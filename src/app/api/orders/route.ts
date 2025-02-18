// C:\threadsntrends\src\app\api\orders\route.ts
import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';  // Use `NextRequest` and `NextResponse`
import dbConnect from '@/lib/db';
import Order from '@/lib/orders';

// Type for API response
type ResponseData = {
  success: boolean;
  data?: any;
  error?: string;
};

// Helper function to handle errors
const handleError = (error: any) => {
  console.error('API Error:', error);
  const message = error instanceof Error ? error.message : 'An unknown error occurred';
  return { success: false, error: message };
};

// POST - Create a new order
export const POST = async (req: NextRequest) => {
  await dbConnect();  // Connect to the database
  
  try {
    // Parse the request body (req.json())
    const body = await req.json();
    const { products } = body;

    if (!products || !Array.isArray(products)) {
      return NextResponse.json({ success: false, error: 'Products array is required' }, { status: 400 });
    }

    // Calculate total amount from products array for validation
    const calculatedTotal = products.reduce(
      (sum, item) => sum + (item.price * item.quantity), 0
    );

    // Check if provided total matches calculated total
    if (Math.abs(calculatedTotal - body.totalAmount) > 0.01) {
      return NextResponse.json({
        success: false,
        error: 'Total amount does not match the sum of product prices'
      }, { status: 400 });
    }

    // Create a new order
    const order = await Order.create(body);
    return NextResponse.json({ success: true, data: order }, { status: 201 });
  } catch (error) {
    const response = handleError(error);
    return NextResponse.json(response, { status: 500 });
  }
};

// GET - Fetch all orders or a specific order
export const GET = async (req: NextRequest) => {
  await dbConnect();  // Connect to the database
  
  try {
    // Use new URL(req.url) to parse searchParams
    const url = new URL(req.url);
    const id = url.searchParams.get('id');  // Extract 'id' from the query parameters

    if (id) {
      // Fetch specific order by id
      const order = await Order.findOne({ orderID: id });
      if (!order) {
        return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: order }, { status: 200 });
    } else {
      // Fetch all orders
      const orders = await Order.find({}).sort({ createdAt: -1 });
      return NextResponse.json({ success: true, data: orders }, { status: 200 });
    }
  } catch (error) {
    const response = handleError(error);
    return NextResponse.json(response, { status: 500 });
  }
};


// PUT - Update an existing order
export const PUT = async (req: NextRequest) => {
  await dbConnect();
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, error: 'Invalid Order ID' }, { status: 400 });
    }

    const body = await req.json();
    if (body.products && Array.isArray(body.products)) {
      const calculatedTotal = body.products.reduce(
        (sum: number, item: any) => sum + item.price * item.quantity, 0
      );
      body.totalAmount = calculatedTotal;
    }

    const order = await Order.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: order }, { status: 200 });
  } catch (error) {
    return NextResponse.json(handleError(error), { status: 500 });
  }
};

// DELETE - Remove an order
export const DELETE = async (req: NextRequest) => {
  await dbConnect();
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, error: 'Invalid Order ID' }, { status: 400 });
    }

    const deletedOrder = await Order.findByIdAndDelete(id);
    if (!deletedOrder) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: {} }, { status: 200 });
  } catch (error) {
    return NextResponse.json(handleError(error), { status: 500 });
  }
};
