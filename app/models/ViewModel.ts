import mongoose, { Schema, Model, Document, Types } from "mongoose";

/* ===================== INTERFACE ===================== */

export interface IView extends Document {
  reelId: Types.ObjectId;
  userId?: Types.ObjectId;
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

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
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
viewSchema.index({ reelId: 1, userId: 1 });

// analytics queries stay fast
viewSchema.index({ reelId: 1, watchedAt: -1 });

/* ===================== MODEL ===================== */

export const View: Model<IView> =
  mongoose.models.View || mongoose.model<IView>("View", viewSchema);
