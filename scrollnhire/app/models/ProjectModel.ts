import mongoose, { Document, Model, Schema, Types } from "mongoose";

/* ===================== INTERFACE ===================== */

export interface IProject extends Document {
  studentId: Types.ObjectId;

  title: string;
  description?: string;

  techStack: string[];

  githubUrl?: string;
  liveUrl?: string;

  thumbnail?: string;
  images?: string[];
  videoUrl?: string;

  category?: string;

  difficultyLevel?: "beginner" | "intermediate" | "advanced";

  likesCount: number;
  viewsCount: number;

  isVerified: boolean;

  embedding: number[];

  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<IProject>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: "StudentProfile",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
    },

    techStack: [
      {
        type: String,
      },
    ],

    githubUrl: String,
    liveUrl: String,

    thumbnail: String,

    images: [String],

    videoUrl: String,

    category: String,

    difficultyLevel: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
    },

    likesCount: {
      type: Number,
      default: 0,
    },

    viewsCount: {
      type: Number,
      default: 0,
    },

    isVerified: {
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
projectSchema.index({ studentId: 1 });

export const Project: Model<IProject> =
  mongoose.models.Project || mongoose.model<IProject>("Project", projectSchema);
