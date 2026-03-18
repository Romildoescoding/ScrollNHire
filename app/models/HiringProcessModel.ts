import mongoose, { Schema, Document } from "mongoose";

export interface IHiringProcess extends Document {
  employerId: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  reelId: mongoose.Types.ObjectId;

  status:
    | "shortlisted"
    | "chat_requested"
    | "chat_active"
    | "interview_scheduled"
    | "interview_completed"
    | "offer_sent"
    | "rejected"
    | "hired";

  interviewDate?: Date;
  role: string;

  createdAt: Date;
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

    reelId: {
      type: Schema.Types.ObjectId,
      ref: "Reel",
      required: true,
    },

    status: {
      type: String,
      enum: [
        "shortlisted",
        "chat_requested",
        "chat_active",
        "interview_scheduled",
        "interview_completed",
        "offer_sent",
        "rejected",
        "hired",
      ],
      default: "shortlisted",
    },

    interviewDate: Date,
    role: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

hiringSchema.index(
  { employerId: 1, studentId: 1, reelId: 1 },
  { unique: true },
);

export default mongoose.models.HiringProcess ||
  mongoose.model("HiringProcess", hiringSchema);
