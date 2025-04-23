import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    console.log("request: ", data);
    
    if (!data.items || !Array.isArray(data.items) || data.items.length === 0) {
      return NextResponse.json({ error: 'No items provided' }, { status: 400 });
    }

    // Create line items from the cart items
    const lineItems = data.items.map((item: any) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          // You can add more product data here if needed
          // description: item.description,
          // images: item.image ? [item.image] : [],
        },
        // Stripe expects amount in cents, so multiply by 100
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    // Generate order ID first
    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    
    // Create metadata object with all required fields
    const metadata: { [key: string]: string } = {
      order_id: orderId,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      // Shipping Address
      shipping_firstName: data.shippingAddress.firstName,
      shipping_lastName: data.shippingAddress.lastName,
      shipping_address: data.shippingAddress.address,
      shipping_city: data.shippingAddress.city,
      shipping_postalCode: data.shippingAddress.postalCode,
      shipping_phone: data.shippingAddress.phone,
      // Billing Address
      billing_firstName: data.billingAddress.firstName,
      billing_lastName: data.billingAddress.lastName,
      billing_address: data.billingAddress.address,
      billing_city: data.billingAddress.city,
      billing_postalCode: data.billingAddress.postalCode,
      billing_phone: data.billingAddress.phone,
      // Additional Order Details
      shippingCost: data.shippingCost.toString(),
      totalAmount: data.totalAmount.toString(),
      paymentMethod: data.paymentMethod,
    };

    // Add size information for each product
    data.products.forEach((product: any, index: number) => {
      metadata[`product_${index}_size`] = product.size;
    });

    // Create the checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/success?session_id={CHECKOUT_SESSION_ID}&orderId=${orderId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cart`,
      metadata,
      shipping_address_collection: { allowed_countries: ['PK'] },
      billing_address_collection: 'required',
      customer_email: data.customerEmail,
      phone_number_collection: {
        enabled: true
      }
    });

    return NextResponse.json({ url: session.url });
  } catch (error:  any) {
    console.log(error);
    return NextResponse.json(
      { error: 'Error creating checkout session', message: error.message }, 
      { status: 500 }
    );
  }
}