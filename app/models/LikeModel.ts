import mongoose, { Schema, Model, Document, Types } from "mongoose";

export interface ILike extends Document {
  reelId: Types.ObjectId;
  studentId: Types.ObjectId;
  createdAt: Date;
}

const likeSchema = new Schema<ILike>(
  {
    reelId: {
      type: Schema.Types.ObjectId,
      ref: "Reel",
      required: true,
    },

    studentId: {
      type: Schema.Types.ObjectId,
      ref: "StudentProfile",
      required: true,
    },
  },
  { timestamps: true },
);

likeSchema.index({ reelId: 1 });
likeSchema.index({ studentId: 1 });

/* Prevent duplicate likes */
likeSchema.index({ reelId: 1, studentId: 1 }, { unique: true });

export const Like: Model<ILike> =
  mongoose.models.Like || mongoose.model<ILike>("Like", likeSchema);
