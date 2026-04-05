import mongoose, { Document, Schema } from "mongoose";

export interface IInterviewRequest extends Document {
  employerId: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  projectId?: mongoose.Types.ObjectId;
  message: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: Date;
}

const interviewSchema = new Schema<IInterviewRequest>({
  employerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  studentId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  projectId: { type: Schema.Types.ObjectId, ref: "Project" },
  message: String,
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.InterviewRequest ||
  mongoose.model<IInterviewRequest>("InterviewRequest", interviewSchema);
