import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/db';
import Order from '@/lib/orders';

// Type for API response
type ResponseData = {
  success: boolean;
  data?: any;
  error?: string;
};

// Helper function to handle errors
const handleError = (res: NextApiResponse<ResponseData>, error: any) => {
  console.error('API Error:', error);
  const message = error instanceof Error ? error.message : 'An unknown error occurred';
  return res.status(500).json({ success: false, error: message });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const { method } = req;
  
  // Connect to database
  await dbConnect();
  
  try {
    switch (method) {
      // GET - Fetch all orders or a specific order
      case 'GET': {
        const { id } = req.query;
        
        if (id) {
          // Fetch specific order
          const order = await Order.findById(id);
          
          if (!order) {
            return res.status(404).json({ success: false, error: 'Order not found' });
          }
          
          return res.status(200).json({ success: true, data: order });
        } else {
          // Fetch all orders with optional filtering
          const { status, customerEmail } = req.query;
          const filter: any = {};
          
          if (status) filter.status = status;
          if (customerEmail) filter.customerEmail = customerEmail;
          
          const orders = await Order.find(filter).sort({ createdAt: -1 });
          return res.status(200).json({ success: true, data: orders });
        }
      }
      
      // POST - Create a new order
      case 'POST': {
        // Calculate total amount from products array for validation
        const { products } = req.body;
        if (products && Array.isArray(products)) {
          const calculatedTotal = products.reduce(
            (sum, item) => sum + (item.price * item.quantity), 0
          );
          
          // Check if provided total matches calculated total
          if (Math.abs(calculatedTotal - req.body.totalAmount) > 0.01) {
            return res.status(400).json({
              success: false,
              error: 'Total amount does not match the sum of product prices'
            });
          }
        }
        
        const order = await Order.create(req.body);
        return res.status(201).json({ success: true, data: order });
      }
      
      // PUT - Update an existing order
      case 'PUT': {
        const { id } = req.query;
        
        if (!id) {
          return res.status(400).json({ success: false, error: 'Order ID is required' });
        }
        
        // Calculate total if products are being updated
        if (req.body.products) {
          const calculatedTotal = req.body.products.reduce(
            (sum: number, item: any) => sum + (item.price * item.quantity), 0
          );
          
          if (req.body.totalAmount && Math.abs(calculatedTotal - req.body.totalAmount) > 0.01) {
            return res.status(400).json({
              success: false,
              error: 'Total amount does not match the sum of product prices'
            });
          }
          
          // Auto update the total amount
          req.body.totalAmount = calculatedTotal;
        }
        
        const order = await Order.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true
        });
        
        if (!order) {
          return res.status(404).json({ success: false, error: 'Order not found' });
        }
        
        return res.status(200).json({ success: true, data: order });
      }
      
      // DELETE - Remove an order
      case 'DELETE': {
        const { id } = req.query;
        
        if (!id) {
          return res.status(400).json({ success: false, error: 'Order ID is required' });
        }
        
        const deletedOrder = await Order.findByIdAndDelete(id);
        
        if (!deletedOrder) {
          return res.status(404).json({ success: false, error: 'Order not found' });
        }
        
        return res.status(200).json({ success: true, data: {} });
      }
      
      // Handle unsupported methods
      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        return res.status(405).json({ success: false, error: `Method ${method} Not Allowed` });
    }
  } catch (error) {
    return handleError(res, error);
  }
}