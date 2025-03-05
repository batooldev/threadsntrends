import mongoose from "mongoose";

const { Schema } = mongoose;

const cartSchema = new Schema({
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  productId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Product', 
    required: true 
  },
  name: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String 
  },
  category: { 
    type: String, 
    required: true 
  },
  price: { 
    type: Number, 
    required: true 
  },
  stock: { 
    type: Number, 
    required: true 
  },
  size: { 
    type: String 
  },
  image: { 
    type: String 
  },
  isFeatured: { 
    type: Boolean, 
    default: false 
  }
}, { timestamps: true });

 export default mongoose.models.cart || mongoose.model('cart', cartSchema)