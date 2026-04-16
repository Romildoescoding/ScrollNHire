import mongoose, { Document, Model, Schema, Types } from "mongoose";

/* ===================== INTERFACE ===================== */

export interface IReel extends Document {
  userId: mongoose.Types.ObjectId;
  projectId?: Types.ObjectId;

  videoUrl: string;
  thumbnailUrl: string;
  caption?: string;

  tags: string[];

  duration?: number;

  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  viewsCount: number;

  isFeatured: boolean;

  embedding: number[];

  createdAt: Date;
  updatedAt: Date;
}

/* ===================== SCHEMA ===================== */

const reelSchema = new Schema<IReel>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
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

    thumbnailUrl: {
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

    // EMBEDDING
    embedding: {
      type: [Number],
      required: true,
      default: [],
      validate: {
        validator: function (val: number[]) {
          return val.length === 1536;
        },
        message: "Embedding must be 1536 dimensions",
      },
    },
  },
  { timestamps: true },
);
reelSchema.index({ userId: 1 });
reelSchema.index({ projectId: 1 });
/* ===================== MODEL ===================== */

export const Reel: Model<IReel> =
  mongoose.models.Reel || mongoose.model<IReel>("Reel", reelSchema);
