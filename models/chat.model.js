import mongoose, { Schema } from "mongoose";
import messageModel from "./message.model.js";

const ChatSchema = new mongoose.Schema(
  {
    user1: {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
    user2: {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
    unreadCount: {
      type: Number,
      default: 0,
    },
    messages: [
      {
        type: Schema.Types.ObjectId,
        ref: "Message",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model.Chat || mongoose.model("Chat", ChatSchema);
