import mongoose from "mongoose";

const InventoryItemSchema = new mongoose.Schema(
  {
    productID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      unique: true,
    },
    quantity: { type: Number, required: true, default: 0 },
    reorderLevel: { type: Number, default: 10 },
    unit: { type: String, default: "pcs" },
    purchasePrice: { type: Number, required: true },
    sellingPrice: { type: Number, required: true },
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);


export default mongoose.models.InventoryItem ||
  mongoose.model("InventoryItem", InventoryItemSchema);
