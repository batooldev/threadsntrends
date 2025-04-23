import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Product from "@/lib/product";

export async function GET() {
  await dbConnect();

  try {
    const products = await Product.find()
      .select('name stock reorderLevel price images category')
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch inventory" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  await dbConnect();

  try {
    const body = await req.json();
    const { productId, stock } = body;

    // Find the current product first
    const currentProduct = await Product.findById(productId);
    if (!currentProduct) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    // If stock is being updated, increment reorderLevel
    const reorderLevel = currentProduct.reorderLevel + 1;

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { 
        stock,
        reorderLevel 
      },
      { new: true }
    );

    return NextResponse.json({ success: true, data: updatedProduct });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }
}
