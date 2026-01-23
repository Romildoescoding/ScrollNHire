import mongoose, { Document, Schema } from "mongoose";

export interface IWardrobeItem extends Document {
  userId: mongoose.Types.ObjectId;
  type: "top" | "bottom" | "outerwear" | "shoes";
  color?: string;
  season?: string;
  imageUrl: string;
  createdAt: Date;
}

const wardrobeSchema = new Schema<IWardrobeItem>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  type: {
    type: String,
    enum: ["top", "bottom", "outerwear", "shoes"],
    required: true,
  },

  color: String,
  season: String,

  imageUrl: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const WardrobeItem =
  mongoose.models?.WardrobeItem ||
  mongoose.model<IWardrobeItem>("WardrobeItem", wardrobeSchema);
