// File: app/api/orders/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/lib/orders';

export async function GET() {
  try {
    await connectDB();
    const orders = await Order.find({}).sort({ createdAt: -1 });
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const orderData = await request.json();
    await connectDB();
    
    const newOrder = new Order(orderData);
    const savedOrder = await newOrder.save();
    
    return NextResponse.json(savedOrder, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

// export async function GET(request, { params }) {
//   try {
//     const { orderId } = params;
//     await dbConnect();
    
//     const order = await Order.findOne({ orderID: orderId });
    
//     if (!order) {
//       return NextResponse.json(
//         { error: 'Order not found' },
//         { status: 404 }
//       );
//     }
    
//     return NextResponse.json(order);
//   } catch (error) {
//     return NextResponse.json(
//       { error: 'Failed to fetch order' },
//       { status: 500 }
//     );
//   }
// }

// export async function PUT(request, { params }) {
//   try {
//     const { orderId } = params;
//     const orderData = await request.json();
    
//     await dbConnect();
    
//     const updatedOrder = await Order.findOneAndUpdate(
//       { orderID: orderId },
//       orderData,
//       { new: true, runValidators: true }
//     );
    
//     if (!updatedOrder) {
//       return NextResponse