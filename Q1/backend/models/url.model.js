import mongoose, { Schema } from "mongoose";

const urlSchema = new Schema(
  {
    originalUrl: {
      type: String,
      required: true,
    },
    shortCode: {
      type: String,
      unique: true,
      required: true,
    },
    clicks: {
      type: Number,
      default: 0,
    },
    expireAt: { type: Date, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Url", urlSchema);
