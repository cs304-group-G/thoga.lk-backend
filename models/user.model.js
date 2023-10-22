import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    tempPassword: {
      // Act as otp but not expired until reset requist trigerd,
      // TODO: make it expired in given time limit
      type: String,
      required: false,
    },
    role: {
      type: String,
      enum: ["ADMIN", "MODERATOR", "SELLER", "USER", "PENDING"],
      required: true,
      default: "USER",
    },
    isVerified: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model.Users || mongoose.model("Users", UserSchema);
