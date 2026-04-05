import mongoose, { Schema, Model, Document, Types } from "mongoose";

export interface IComment extends Document {
  reelId: Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  text: string;

  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new Schema<IComment>(
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

    text: {
      type: String,
      required: true,
      maxlength: 500,
    },
  },
  { timestamps: true },
);

commentSchema.index({ reelId: 1 });
commentSchema.index({ createdAt: -1 });

export const Comment: Model<IComment> =
  mongoose.models.Comment || mongoose.model<IComment>("Comment", commentSchema);
