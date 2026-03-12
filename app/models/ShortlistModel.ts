import mongoose, { Schema, Document } from "mongoose";

export interface IShortlist extends Document {
  employerId: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  reelId: mongoose.Types.ObjectId;
  createdAt: Date;
}

const ShortlistSchema = new Schema<IShortlist>(
  {
    employerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    studentId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    reelId: {
      type: Schema.Types.ObjectId,
      ref: "Reel",
      required: true,
    },
  },
  { timestamps: true },
);

ShortlistSchema.index(
  { employerId: 1, studentId: 1, reelId: 1 },
  { unique: true },
);

export default mongoose.models.Shortlist ||
  mongoose.model<IShortlist>("Shortlist", ShortlistSchema);
