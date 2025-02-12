// app/api/products/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/lib/product';
//import { auth } from '@/lib/auth'; // Assuming you have authentication middleware

// GET all products or query products
export async function GET(request: Request) {
  try {
    await dbConnect();
    
    // Get URL parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const search = searchParams.get('search');

    // Build query
    let query: any = {};
    
    if (category) query.category = category;
    if (featured) query.isFeatured = featured === 'true';
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Execute query with pagination
    const skip = (page - 1) * limit;
    const products = await Product.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments(query);

    return NextResponse.json({
      products,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    console.error('Products GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST new product
export async function POST(request: Request) {
  try {
    await dbConnect();

    const body = await request.json();

    // Generate unique productID
    const count = await Product.countDocuments();
    const productID = `PROD${String(count + 1).padStart(6, '0')}`;
    
    const product = await Product.create({
      ...body,
      productID
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    console.error('Products POST error:', error);
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'Product with this ID already exists' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}

// PUT update multiple products
export async function PUT(request: Request) {
  try {
    await dbConnect();
    
    const updates = await request.json();
    const operations = updates.map((update: any) => ({
      updateOne: {
        filter: { productID: update.productID },
        update: { $set: update }
      }
    }));

    const result = await Product.bulkWrite(operations);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Products PUT error:', error);
    return NextResponse.json(
      { error: 'Failed to update products' },
      { status: 500 }
    );
  }
}

// DELETE multiple products
export async function DELETE(request: Request) {
  try {
    await dbConnect();
    
    const { productIDs } = await request.json();
    const result = await Product.deleteMany({
      productID: { $in: productIDs }
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Products DELETE error:', error);
    return NextResponse.json(
      { error: 'Failed to delete products' },
      { status: 500 }
    );
  }
}