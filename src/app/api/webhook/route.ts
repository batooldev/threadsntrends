// app/api/webhook/route.ts
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { headers } from 'next/headers';
import Order from '@/lib/orders';
import connectDB from '@/lib/db';
import Cart from '@/lib/cart'; // Assuming you have a Cart model for clearing the cart
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
      
      // Use the order ID from metadata
      const orderId = session.metadata.order_id;

      // Retrieve the session with line items
      const retrievedSession = await stripe.checkout.sessions.retrieve(session.id, {
        expand: ['line_items'],
      });

      console.log("Retrieved Session: ", retrievedSession); // Fixed typo

      const lineItems = retrievedSession?.line_items?.data || [];
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
        phone: session.customer_details?.phone?.toString() || 'Not provided' // Convert to string
      };
      
      // Create shipping address with string phone
      const shippingAddress = {
        firstName: billingAddress.firstName,
        lastName: billingAddress.lastName,
        address: billingAddress.address,
        city: billingAddress.city,
        state: billingAddress.state,
        postalCode: billingAddress.postalCode,
        phone: billingAddress.phone.toString() // Convert to string
      };

      // Map line items to products
      const products = lineItems.map((item: any, index: number) => ({
        productID: item.price?.product || 'unknown',
        name: item.description || 'Unknown Product',
        quantity: item.quantity || 1,
        price: (item.amount_total / 100) / (item.quantity || 1),
        size: metadata[`product_${index}_size`] || 'Default' 
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
        status: 'processing',
        stripe: {
          sessionId: session.id,
          paymentIntentId: session.payment_intent
        }
      });
      
      await newOrder.save();
      console.log(`💰 Order ${orderId} saved successfully!`);

      // Clear cart after successful order
      const userId = metadata.userId;
      if (userId) {
        await Cart.deleteMany({ userId });
        console.log(`🛒 Cart cleared for user ${userId}`);
      }

      // After saving the order, return success with order ID
      return NextResponse.json({ 
        received: true,
        orderId: orderId
      });
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