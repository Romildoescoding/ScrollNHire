import mongoose, { Schema } from "mongoose";

export interface ISavedOutfit extends Document {
  userId: mongoose.Types.ObjectId;
  outfitId: mongoose.Types.ObjectId;
  createdAt: Date;
}

const savedOutfitSchema = new Schema<ISavedOutfit>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  outfitId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Outfit",
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const SavedOutfit =
  mongoose.models?.SavedOutfit ||
  mongoose.model<ISavedOutfit>("SavedOutfit", savedOutfitSchema);
