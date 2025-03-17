// import express, { Request, Response } from 'express';
// import Cart from '@/lib/cart';

// const router = express.Router();

// // Add item to cart
// router.post('/', async (req: Request, res: Response) => {
//     try {
//         const cartItem = new Cart(req.body);
//         await cartItem.save();
//         res.status(201).json(cartItem);
//     } catch (error: unknown) {
//         res.status(400).json({ error: (error as Error).message });
//     }
// });

// // Get all cart items for a user
// router.get('/:userId', async (req: Request, res: Response) => {
//     try {
//         const cartItems = await Cart.find({ userId: req.params.userId }).populate('productId');
//         res.json(cartItems);
//     } catch (error: unknown) {
//         res.status(500).json({ error: (error as Error).message });
//     }
// });

// // Update cart item
// router.put('/:id', async (req: Request, res: Response) => {
//     try {
//         const updatedCartItem = await Cart.findByIdAndUpdate(req.params.id, req.body, { new: true });
//         res.json(updatedCartItem);
//     } catch (error: unknown) {
//         res.status(400).json({ error: (error as Error).message });
//     }
// });

// // Delete cart item
// router.delete('/:id', async (req: Request, res: Response) => {
//     try {
//         await Cart.findByIdAndDelete(req.params.id);
//         res.json({ message: 'Item removed from cart' });
//     } catch (error: unknown) {
//         res.status(500).json({ error: (error as Error).message });
//     }
// });

// export default router;

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Cart  from "@/lib/cart";
// import { getServerSession } from 'next-auth/next';
// import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import mongoose from 'mongoose';

interface CartItem {
  productId: string;
  name: string;
  description?: string;
  category: string;
  price: number;
  stock: number;
  size?: string;
  image?: string;
  quantity: number;
}

export async function POST(
  req: NextRequest
): Promise<NextResponse> {
  try {
    await connectDB();
    
    const body = await req.json();
    const { userId, productId, name, price, quantity = 1, image, size } = body;
    
    if (!userId || !productId || !name || !price) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }
    
    // Check if the item already exists in the cart
    const existingItem = await Cart.findOne({ userId, productId });
    
    if (existingItem) {
      // Update quantity if the item already exists
      existingItem.quantity = (existingItem.quantity || 1) + quantity;
      await existingItem.save();
      return NextResponse.json({ message: 'Item quantity updated', item: existingItem });
    }
    
    // Create a new cart item
    const newCartItem = new Cart({
      userId,
      productId,
      name,
      price,
      quantity,
      image,
      size
    });
    
    await newCartItem.save();
    
    return NextResponse.json({ 
      message: 'Item added to cart',
      item: newCartItem
    });
  } catch (error) {
    console.error('Error adding item to cart:', error);
    return NextResponse.json({ 
      message: 'Error adding item to cart',
      error: (error as Error).message 
    }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest
): Promise<NextResponse> {
  try {
    await connectDB();
    
    const body = await req.json();
    const { itemId, action } = body;
    
    if (!itemId || !action) {
      return NextResponse.json({ message: 'Item ID and action are required' }, { status: 400 });
    }
    
    const cartItem = await Cart.findById(itemId);
    
    if (!cartItem) {
      return NextResponse.json({ message: 'Cart item not found' }, { status: 404 });
    }
    
    // Update quantity based on action
    if (action === "increase") {
      cartItem.quantity = (cartItem.quantity || 1) + 1;
    } else if (action === "decrease" && cartItem.quantity > 1) {
      cartItem.quantity = cartItem.quantity - 1;
    }
    
    await cartItem.save();
    
    return NextResponse.json({ 
      message: 'Quantity updated successfully',
      item: cartItem
    });
  } catch (error) {
    console.error('Error updating quantity:', error);
    return NextResponse.json({ 
      message: 'Error updating quantity',
      error: (error as Error).message 
    }, { status: 500 });
  }
}

export async function GET(
  req: NextRequest
): Promise<NextResponse> {
  try {
    // Connect to database
    await connectDB();
    
    // Get userId from the query parameters
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");
    
    if (!userId) {
      return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
    }
    
    // Validate userId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ message: 'Invalid user ID format' }, { status: 400 });
    }
    
    // Get all cart items for the user
    const cartItems = await Cart.find({ userId: userId });
    
    return NextResponse.json({ 
      cartItems: cartItems
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json({ 
      message: 'Error fetching cart items',
      error: (error as Error).message 
    }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest
): Promise<NextResponse> {
  try {
    await connectDB();
    
    const body = await req.json();
    const { itemId } = body;
    
    if (!itemId) {
      return NextResponse.json({ message: 'Item ID is required' }, { status: 400 });
    }
    
    const result = await Cart.findByIdAndDelete(itemId);
    
    if (!result) {
      return NextResponse.json({ message: 'Cart item not found' }, { status: 404 });
    }
    
    return NextResponse.json({ 
      message: 'Item removed from cart successfully'
    });
  } catch (error) {
    console.error('Error removing item from cart:', error);
    return NextResponse.json({ 
      message: 'Error removing item from cart',
      error: (error as Error).message 
    }, { status: 500 });
  }
}