import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import InventoryItem from "@/lib/inventorymanagement";
import Product from "@/lib/product";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();

  try {
    const body = await req.json();

    const updatedItem = await InventoryItem.findByIdAndUpdate(params.id, body, {
      new: true,
    });

    if (!updatedItem) throw new Error("Item not found");

    // Optional: sync stock if quantity updated
    if (body.quantity !== undefined && updatedItem.productId) {
      await Product.findByIdAndUpdate(updatedItem.productId, {
        stock: body.quantity,
      });
    }

    return NextResponse.json({ success: true, data: updatedItem });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();

  try {
    const deletedItem = await InventoryItem.findByIdAndDelete(params.id);
    if (!deletedItem) throw new Error("Item not found");

    // Optional: reset stock in product
    await Product.findByIdAndUpdate(deletedItem.productId, { stock: 0 });

    return NextResponse.json({ success: true, message: "Item deleted" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}
