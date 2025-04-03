import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/lib/product';

export async function GET(request: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json({ error: "Query parameter is required" }, { status: 400 });
    }

    // Search only by 'name' field (case-insensitive)
    const products = await Product.find({
      name: { $regex: query, $options: "i" } // Case-insensitive search in name field
    }).sort({ createdAt: -1 });

    return NextResponse.json({ products });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: "Failed to search products" }, { status: 500 });
  }
}
