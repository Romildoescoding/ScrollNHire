import mongoose, { Schema, Document, Types } from "mongoose";

export type ActiveStatus =
  | "shortlisted"
  | "chatting"
  | "interview_scheduled"
  | "interview_completed"
  | "offer_sent";

export interface IHiringProcess extends Document {
  employerId: Types.ObjectId;
  studentId: Types.ObjectId;

  reels: Types.ObjectId[];

  status:
    | "shortlisted"
    | "chatting"
    | "interview_scheduled"
    | "interview_completed"
    | "offer_sent"
    | "rejected"
    | "hired";

  lastActiveStatus?: ActiveStatus | null;

  role: string;
  interviewDate?: Date;
  interviewLink?: string;

  createdAt: Date;
  updatedAt: Date;
}

const hiringSchema = new Schema<IHiringProcess>(
  {
    employerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    studentId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    reels: [
      {
        type: Schema.Types.ObjectId,
        ref: "Reel",
      },
    ],

    status: {
      type: String,
      enum: [
        "shortlisted",
        "chatting",
        "interview_scheduled",
        "interview_completed",
        "offer_sent",
        "rejected",
        "hired",
      ],
      default: "shortlisted",
    },

    lastActiveStatus: {
      type: String,
      enum: [
        "shortlisted",
        "chatting",
        "interview_scheduled",
        "interview_completed",
        "offer_sent",
      ],
      default: null,
    },

    role: {
      type: String,
      required: true,
    },

    interviewDate: Date,
    interviewLink: String,
  },
  { timestamps: true },
);

/* 🔥 UNIQUE RELATIONSHIP */
hiringSchema.index({ employerId: 1, studentId: 1 }, { unique: true });

export default mongoose.models.HiringProcess ||
  mongoose.model<IHiringProcess>("HiringProcess", hiringSchema);
