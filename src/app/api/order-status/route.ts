import { NextResponse } from 'next/server';
import Order from '@/lib/orders';
import connectDB from '@/lib/db';
import { stripe } from '@/lib/stripe';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('session_id');

  if (!sessionId) {
    return NextResponse.json({ error: 'No session ID provided' }, { status: 400 });
  }

  try {
    await connectDB();
    
    // First try to find order in our database
    const order = await Order.findOne({ 'stripe.sessionId': sessionId });
    
    if (order) {
      return NextResponse.json({ 
        status: 'complete',
        orderId: order.orderID 
      });
    }

    // If not found, check Stripe session
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.metadata?.order_id) {
      return NextResponse.json({ 
        status: 'pending',
        orderId: session.metadata.order_id 
      });
    }

    return NextResponse.json({ status: 'pending' });

  } catch (error) {
    console.error('Error checking order status:', error);
    return NextResponse.json(
      { error: 'Error checking order status' },
      { status: 500 }
    );
  }
}
