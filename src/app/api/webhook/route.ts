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
      
      const lineItems: any = retrievedSession?.line_items?.data;
      
      // Generate a unique order ID
      const orderId = `ORD-${uuidv4().substring(0, 8).toUpperCase()}`;
      
      // Calculate total amount
      const totalAmount = session.amount_total as any / 100; // Convert from cents to dollars
      
      // Create a new order in MongoDB using your schema
      const newOrder = new Order({
        orderID: orderId,
        customerName: session.customer_details.name as any || 'Guest',
        customerEmail: session.customer_details.email as any,
        billingAddress: {
          // If you're collecting address during checkout
          country: session.customer_details.address?.country || '',
          line1: session.customer_details.address?.line1 || '',
          city: session.customer_details.address?.city || '',
          postal_code: session.customer_details.address?.postal_code || '',
          state: session.customer_details.address?.state || '',
        },
        products: lineItems.map((item : any) => ({
          productID: item.price?.product || 'unknown',
          name: item.description,
          quantity: item.quantity,
          price: (item.amount_total / 100) / item.quantity // Price per unit
        })),
        totalAmount: totalAmount,
        status: 'processing', // Initially set to processing after payment
      });
      
      await newOrder.save();
      console.log(`💰 Order ${orderId} saved successfully!`);
    } catch (error) {
      console.error('Error saving order to database:', error);
    }
  }

  return NextResponse.json({ received: true });
}

// For Next.js 13+ API routes
export const config = {
  runtime: 'edge',
};