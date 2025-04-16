// app/api/webhook/route.ts
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { headers } from 'next/headers';
import Order from '@/lib/orders';
import connectDB from '@/lib/db';
import { v4 as uuidv4 } from 'uuid'; // For generating unique order IDs

// This is your Stripe CLI webhook secret for testing your endpoint locally
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: Request) {
  const payload = await req.text();
  const sig = headers().get('stripe-signature');
  
  let event;
  
  try {
    event = stripe.webhooks.constructEvent(payload, sig as string, endpointSecret as string);
  } catch (err: any) {
    console.log(`⚠️ Webhook signature verification failed.`, err.message);
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session: any = event.data.object;
    
    try {
      await connectDB();
      
      // Retrieve the session with line items
      const retrievedSession = await stripe.checkout.sessions.retrieve(session.id, {
        expand: ['line_items'],
      });

      console.log("Retrieved Session: ", retrievedSession); // Fixed typo

      const lineItems = retrievedSession?.line_items?.data || [];
      const orderId = `ORD-${uuidv4().substring(0, 8).toUpperCase()}`;
      const totalAmount = session.amount_total / 100;

      // Get metadata from the session
      const metadata = session.metadata || {};
      
      // Create billing address object with default values
      const billingAddress = {
        firstName: session.customer_details?.name?.split(' ')[0] || 'Guest',
        lastName: session.customer_details?.name?.split(' ').slice(1).join(' ') || 'User',
        address: session.customer_details?.address?.line1 || 'Not provided',
        city: session.customer_details?.address?.city || 'Not provided',
        state: session.customer_details?.address?.state || 'Not provided',
        postalCode: session.customer_details?.address?.postal_code || 'Not provided',
        phone: session.customer_details?.phone || 'Not provided'
      };

      // Use billing address for shipping if shipping details not provided
      const shippingAddress = {
        firstName: billingAddress.firstName,
        lastName: billingAddress.lastName,
        address: billingAddress.address,
        city: billingAddress.city,
        state: billingAddress.state,
        postalCode: billingAddress.postalCode,
        phone: billingAddress.phone
      };

      // Map line items to products
      const products = lineItems.map((item: any) => ({
        productID: item.price?.product || 'unknown',
        name: item.description || 'Unknown Product',
        quantity: item.quantity || 1,
        price: (item.amount_total / 100) / (item.quantity || 1),
        size: 'Default' // Set a default size if not available
      }));

      const newOrder = new Order({
        orderID: orderId,
        customerName: session.customer_details?.name || 'Guest User',
        customerEmail: session.customer_details?.email || 'no-email@example.com',
        billingAddress,
        shippingAddress,
        products,
        totalAmount,
        paymentMethod: 'card',
        status: 'processing'
      });
      
      await newOrder.save();
      console.log(`💰 Order ${orderId} saved successfully!`);
    } catch (error) {
      console.error('Error saving order to database:', error);
      // Add more detailed error logging
      if (error instanceof Error) {
        console.error('Error details:', error.message);
        console.error('Error stack:', error.stack);
      }
    }
  }

  return NextResponse.json({ received: true });
}