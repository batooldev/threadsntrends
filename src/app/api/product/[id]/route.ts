import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import connectDB from '@/lib/db';
import product from '@/lib/product';

// Define the Product interface
interface Product {
  _id?: ObjectId;
  productID: string;
  name: string;
  price: number;
  description: string;
  imageUrl?: string;
  inStock: boolean;
  size?: string;
}

interface ErrorResponse {
  message: string;
  error?: string;
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<Product | ErrorResponse>> {
  const id = params.id;
  
  if (!id) {
    return NextResponse.json({ message: 'Product ID is required' }, { status: 400 });
  }

  try {
    const db = await connectDB();
    let productFind;
    
    // Determine if the productID is an ObjectId or a string
    // if (ObjectId.isValid(id)) {
    //   productFind = await db.collection('products').findOne({ _id: new ObjectId(id) });
    // } else {
    //   productFind = await db.collection('products').findOne({ productID: id });
    // }

    productFind = await product.findById(id)

    // console.log("product: ", productFind)

    if (!productFind) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    // Convert MongoDB _id to string if it exists
    // const formattedProduct = {
    //   ...productFind,
    //   _id: productFind._id ? productFind._id.toString() : undefined,
    // };

    return NextResponse.json(productFind);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ 
      message: 'Error retrieving product from database',
      error: (error as Error).message,
    }, { status: 500 });
  }
}