import mongoose, { Document, Model, Schema, Types } from "mongoose";

/* ===================== INTERFACE ===================== */

export interface IReel extends Document {
  studentId: Types.ObjectId;
  projectId?: Types.ObjectId;

  videoUrl: string;
  caption?: string;

  tags: string[];

  duration?: number;

  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  viewsCount: number;

  isFeatured: boolean;

  createdAt: Date;
  updatedAt: Date;
}

/* ===================== SCHEMA ===================== */

const reelSchema = new Schema<IReel>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: "StudentProfile",
      required: true,
    },

    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
    },

    videoUrl: {
      type: String,
      required: true,
    },

    caption: String,

    tags: [
      {
        type: String,
      },
    ],

    duration: Number,

    likesCount: {
      type: Number,
      default: 0,
    },

    commentsCount: {
      type: Number,
      default: 0,
    },

    sharesCount: {
      type: Number,
      default: 0,
    },

    viewsCount: {
      type: Number,
      default: 0,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);
reelSchema.index({ studentId: 1 });
reelSchema.index({ projectId: 1 });
/* ===================== MODEL ===================== */

export const Reel: Model<IReel> =
  mongoose.models.Reel || mongoose.model<IReel>("Reel", reelSchema);
