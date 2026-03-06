import mongoose, { Schema, Model, Document, Types } from "mongoose";

/* ===================== INTERFACE ===================== */

export interface IView extends Document {
  reelId: Types.ObjectId;
  studentId?: Types.ObjectId;
  watchedAt: Date;
}

/* ===================== SCHEMA ===================== */

const viewSchema = new Schema<IView>(
  {
    reelId: {
      type: Schema.Types.ObjectId,
      ref: "Reel",
      required: true,
      index: true,
    },

    studentId: {
      type: Schema.Types.ObjectId,
      ref: "StudentProfile",
      required: false, // anonymous viewers allowed
    },

    watchedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
  },
);

/* ===================== INDEXES ===================== */

// fast lookup for analytics
viewSchema.index({ reelId: 1 });

// prevent spam views from same user in short time (optional logic layer)
viewSchema.index({ reelId: 1, studentId: 1 });

/* ===================== MODEL ===================== */

export const View: Model<IView> =
  mongoose.models.View || mongoose.model<IView>("View", viewSchema);
