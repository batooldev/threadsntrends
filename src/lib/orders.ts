import mongoose, { Schema } from "mongoose";



const OrderSchema=new mongoose.Schema(
    {
      orderID: {
        type: String,
        required: true,
        unique: true,
        trim: true,
      },
      customerName: {
        type: String,
        required: true,
        trim: true,
      },
      customerEmail: {
        type: String,
        required: true,
        trim: true,
        match: /.+\@.+\..+/, // Basic email validation
      },
      products: [
        {
          productID: {
            type: String,
            required: true,
            trim: true,
          },
          name: {
            type: String,
            required: true,
            trim: true,
          },
          quantity: {
            type: Number,
            required: true,
            min: 1,
          },
          price: {
            type: Number,
            required: true,
            min: 0,
          },
        },
      ],
      totalAmount: {
        type: Number,
        required: true,
        min: 0,
      },
      status: {
        type: String,
        enum: ['pending', 'processing', 'shipped', 'delivered', 'canceled'],
        default: 'pending',
      },
    },
    { timestamps: true }
  );
  
  export default mongoose.models.Order || mongoose.model('Order', OrderSchema);