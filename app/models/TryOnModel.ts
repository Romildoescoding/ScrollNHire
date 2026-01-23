import mongoose, { Schema } from "mongoose";

export interface ITryOn extends Document {
  userId: mongoose.Types.ObjectId;
  avatarId: mongoose.Types.ObjectId;
  outfitId?: mongoose.Types.ObjectId;
  generatedImageUrl: string;
  createdAt: Date;
}

const tryOnSchema = new Schema<ITryOn>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  avatarId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Avatar",
    required: true,
  },

  outfitId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Outfit",
  },

  generatedImageUrl: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const TryOn =
  mongoose.models?.TryOn || mongoose.model<ITryOn>("TryOn", tryOnSchema);
