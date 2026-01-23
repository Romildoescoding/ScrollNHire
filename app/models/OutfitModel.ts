import mongoose, { Schema } from "mongoose";

export interface IOutfit extends Document {
  mood: string;
  occasion: string;
  colorPalette?: string[];
  imageUrl: string;
  createdAt: Date;
}

const outfitSchema = new Schema<IOutfit>({
  mood: String,
  occasion: String,
  colorPalette: [String],

  imageUrl: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Outfit =
  mongoose.models?.Outfit || mongoose.model<IOutfit>("Outfit", outfitSchema);
