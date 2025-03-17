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

    // Create the checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cart`,
      // You can add metadata to track the order
      metadata: {
        order_id: Date.now().toString(),
      },
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