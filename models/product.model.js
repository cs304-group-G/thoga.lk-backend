import mongoose, { Schema } from "mongoose";

const ProductsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    desciption: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    photoUrls: [
      {
        type: String,
      },
    ],
    sellerId: {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
    reviewId: [
      {
        type: Schema.Types.ObjectId,
        ref: "Reviews",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model.Products ||
  mongoose.model("Products", ProductsSchema);
