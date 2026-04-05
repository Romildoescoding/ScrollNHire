import mongoose, { Schema, Model, Document, Types } from "mongoose";

export interface ILike extends Document {
  reelId: Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
}

const likeSchema = new Schema<ILike>(
  {
    reelId: {
      type: Schema.Types.ObjectId,
      ref: "Reel",
      required: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

likeSchema.index({ reelId: 1 });
likeSchema.index({ userId: 1 });

/* Prevent duplicate likes */
likeSchema.index({ reelId: 1, userId: 1 }, { unique: true });

export const Like: Model<ILike> =
  mongoose.models.Like || mongoose.model<ILike>("Like", likeSchema);
