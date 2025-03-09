import { NextApiRequest, NextApiResponse } from 'next';
import { ObjectId } from 'mongodb';
import connectDB from '@/lib/db';

// Define the Product interface to match your MongoDB document
interface Product {
  _id: string;
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
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Extract the ID from the URL parameters
  const { id } = req.query;
  
  // Handle case where id might be an array (Next.js can sometimes provide query params as arrays)
  const productId = Array.isArray(id) ? id[0] : id;

  // Validate the ID format
  if (!productId || !ObjectId.isValid(productId)) {
    return res.status(400).json({ message: 'Invalid product ID format' });
  }

  try {
    // Connect to MongoDB
    const { db } = await connectDB();
    
    // Query the products collection for the document with matching ID
    const product = await db.collection('products').findOne({
      _id: new ObjectId(productId)
    });

    // Handle case where product was not found
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Convert MongoDB ObjectId to string for the frontend
    const formattedProduct = {
      ...product,
      _id: product._id.toString()
    };

    // Return the product data
    return res.status(200).json(formattedProduct as unknown as Product);
  } catch (error) {
    console.error('Database error:', error);
    const err = error as Error;
    return res.status(500).json({ 
      message: 'Error retrieving product from database',
      error: err.message 
    });
  }
}