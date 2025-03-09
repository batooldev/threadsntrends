import { NextApiRequest, NextApiResponse } from 'next';
import { ObjectId } from 'mongodb';
import connectDB from '@/lib/db';

// Define the Product interface
interface Product {
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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Product | ErrorResponse>
): Promise<void> {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { id } = req.query;
  const productId = Array.isArray(id) ? id[0] : id;

  if (!productId) {
    return res.status(400).json({ message: 'Product ID is required' });
  }

  try {
    const { db } = await connectDB();
    
    let product;
    
    // Determine if the productID is an ObjectId or a string
    if (ObjectId.isValid(productId)) {
      product = await db.collection('products').findOne({ _id: new ObjectId(productId) });
    } else {
      product = await db.collection('products').findOne({ productID: productId });
    }

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Convert MongoDB _id to string
    const formattedProduct = {
      ...product,
      productID: product._id.toString(),
    };

    return res.status(200).json(formattedProduct as unknown as Product);
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ 
      message: 'Error retrieving product from database',
      error: (error as Error).message,
    });
  }
}
