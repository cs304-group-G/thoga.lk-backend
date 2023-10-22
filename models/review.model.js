import mongoose, { Schema } from "mongoose";

const ReviewsSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      enum: [1, 2, 3, 4, 5],
      required: true,
      default: 3,
    },
    ReviewerId: {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
    ProductId: {
      type: Schema.Types.ObjectId,
      ref: "Products",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model.Reviews ||
  mongoose.model("Reviews", ReviewsSchema);
