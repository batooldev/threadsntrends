import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import InventoryItem from "@/lib/inventorymanagement";

export async function GET() {
  await dbConnect();

  try {
    const lowStockItems = await InventoryItem.find({
      $expr: { $lte: ["$quantity", "$reorderLevel"] },
    }).populate("productId");

    return NextResponse.json({ success: true, data: lowStockItems });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch low stock items" },
      { status: 500 }
    );
  }
}
