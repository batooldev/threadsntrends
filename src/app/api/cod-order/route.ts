import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import Order from '@/lib/orders';
import Cart from '@/lib/cart';
import connectDB from '@/lib/db';

export async function POST(req: Request) {
  try {
    const orderData = await req.json();
    await connectDB();

    console.log(orderData, 'Order Data'); // Log the order data for debugging

    // Generate a unique order ID
    const orderId = `ORD-${uuidv4().substring(0, 8).toUpperCase()}`;

    // Create a new order in MongoDB
    const newOrder = new Order({
      orderID: orderId,
      ...orderData,
      status: 'pending',
    });

    await newOrder.save();
    
    // Clear the user's cart after successful order
    const userId = orderData.userId; // Use userId directly from orderData
    if (userId) {
      await Cart.deleteMany({ userId });
      console.log(`🛒 Cart cleared for user ${userId}`);
    } else {
      console.warn('No userId provided for cart clearing');
    }

    console.log('Order created successfully:', newOrder);
    return NextResponse.json({ 
      success: true, 
      confirmationUrl: `/order-confirmation/${orderId}`,
      order: {
        _id: newOrder._id,
        orderID: orderId
      }
    });
  } catch (error: any) {
    console.error('Error creating COD order:', error);
    return NextResponse.json(
      { error: 'Error creating order', message: error.message },
      { status: 500 }
    );
  }
}
