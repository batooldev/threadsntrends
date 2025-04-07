import mongoose from "mongoose";

const InventoryItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },

    category: { type: String, required: true }, // Category is now required

    quantity: { type: Number, required: true, default: 0 },
    reorderLevel: { type: Number, default: 10 }, // for low stock alerts
    unit: { type: String, default: "pcs" }, // e.g., pcs, kg, liters

    purchasePrice: { type: Number, required: true },
    sellingPrice: { type: Number, required: true },

    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.models.InventoryItem ||
  mongoose.model("InventoryItem", InventoryItemSchema);
