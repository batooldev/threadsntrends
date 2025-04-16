import mongoose, { Schema } from "mongoose";

const AddressSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  address: { type: String, required: true },
  apartment: String,
  city: { type: String, required: true },
  postalCode: String,
  phone: { type: Number, required: true },
});

const OrderSchema = new mongoose.Schema(
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
      match: /.+\@.+\..+/,
    },
    shippingAddress: {
      type: AddressSchema,
      required: true,
    },
    billingAddress: {
      type: AddressSchema,
      required: true,
    },
    products: [{
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
      size: {
        type: String,
        required: true,
      },
    }],
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    shippingCost: {
      type: Number,
      required: true,
      default: 99,
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'canceled'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      enum: ['card', 'cod'],
      required: true,
    }
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);