import mongoose from "mongoose";

const { Schema } = mongoose;

const cartSchema = new Schema({
  userID: { 
    type: Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  productID: { 
    type: Schema.Types.ObjectId, 
    ref: 'Product',
    required: true 
  },
  name: { 
    type: String, 
    required: true 
  },
  price: { 
    type: Number, 
    required: true 
  },
  quantity: { 
    type: Number, 
    default: 1,
    min: 1
  },
  size: { 
    type: String 
  },
  image: { 
    type: String 
  }
}, { timestamps: true });

export default mongoose.models.Cart || mongoose.model('Cart', cartSchema);