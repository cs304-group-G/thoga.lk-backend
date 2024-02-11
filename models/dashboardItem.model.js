import mongoose, { Schema } from "mongoose";

const DashboardItemSchema = new mongoose.Schema(
  {
    product: {
      type: String,
    },
    govPrice: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model.DashboardItem ||
  mongoose.model("Dashboard", DashboardItemSchema);
