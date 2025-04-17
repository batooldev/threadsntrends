import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { ObjectId } from "mongodb";
import Cart from "@/lib/cart";

// Add TypeScript interface for cart items
interface CartItem {
  _id: string;
  userId: ObjectId;
  productId: ObjectId;
  name: string;
  price: number;
  quantity: number;
  size: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    if (!ObjectId.isValid(userId)) {
      return NextResponse.json({ error: "Invalid user ID format" }, { status: 400 });
    }

    const userObjectId = new ObjectId(userId);
    const cartItems = await Cart.find({ userId: userObjectId })
      .lean()
      .sort({ createdAt: -1 });

    console.log(`Found ${cartItems.length} cart items for user ${userId}`);
    
    return NextResponse.json({ cartItems });
  } catch (error: any) {
    console.error("Cart API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const data = await request.json();
    const userObjectId = new ObjectId(data.userId);
    
    // Update the userId to ObjectId before saving
    data.userId = userObjectId;
    
    const existingItem = await Cart.findOne({
      userId: userObjectId,
      productId: new ObjectId(data.productId)
    });

    if (existingItem) {
      existingItem.quantity += data.quantity || 1;
      await existingItem.save();
      return NextResponse.json(existingItem);
    }

    const cartItem = await Cart.create(data);
    return NextResponse.json(cartItem);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await connectToDatabase();
    const { itemId, action } = await request.json();
    
    const item = await Cart.findById(new ObjectId(itemId));
    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    if (action === "increase") {
      item.quantity += 1;
    } else if (action === "decrease" && item.quantity > 1) {
      item.quantity -= 1;
    }

    await item.save();
    return NextResponse.json(item);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await connectToDatabase();
    const { itemId } = await request.json();
    
    const result = await Cart.findByIdAndDelete(new ObjectId(itemId));
    if (!result) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }
    
    return NextResponse.json({ message: "Item deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}