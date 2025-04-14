import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import Order from '@/lib/orders';
import connectDB from '@/lib/db';

export async function POST(req: Request) {
  try {
    const orderData = await req.json();
    await connectDB();

    // Generate a unique order ID
    const orderId = `ORD-${uuidv4().substring(0, 8).toUpperCase()}`;

    // Create a new order in MongoDB
    const newOrder = new Order({
      orderID: orderId,
      ...orderData,
      status: 'pending',
    });

    await newOrder.save();

    return NextResponse.json({ 
      success: true, 
      confirmationUrl: `/order-confirmation/${orderId}`,
      order: newOrder  // ✅ Include full order here
    });
  } catch (error: any) {
    console.error('Error creating COD order:', error);
    return NextResponse.json(
      { error: 'Error creating order', message: error.message },
      { status: 500 }
    );
  }
}
