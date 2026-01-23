import mongoose, { Document, Schema } from "mongoose";

export interface IAvatar extends Document {
  userId: mongoose.Types.ObjectId;
  imageUrl: string;
  poseType: "front" | "side" | "casual" | "gym";
  isPrimary: boolean;
  createdAt: Date;
}

const avatarSchema = new Schema<IAvatar>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  imageUrl: {
    type: String,
    required: true,
  },

  poseType: {
    type: String,
    enum: ["front", "side", "casual", "gym"],
    required: true,
  },

  isPrimary: {
    type: Boolean,
    default: false,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Avatar =
  mongoose.models?.Avatar || mongoose.model<IAvatar>("Avatar", avatarSchema);
