import mongoose from "mongoose";
import "@/lib/User";
import "@/lib/product";

const reviewSchema = new mongoose.Schema(
    {
      userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      productID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true,
      },
      comment: {
        type: String,
        required: true,
        trim: true,
      },

    },
    { timestamps: true }
  );
  

export default mongoose.models.review || mongoose.model('review', reviewSchema); 