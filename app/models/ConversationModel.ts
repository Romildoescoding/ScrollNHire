import mongoose, { Schema, Document, Types } from "mongoose";

export interface IConversation extends Document {
  employerId: Types.ObjectId;
  studentId: Types.ObjectId;

  hiringProcessId: Types.ObjectId;

  lastMessage?: string;
  lastMessageAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

const conversationSchema = new Schema<IConversation>(
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

    hiringProcessId: {
      type: Schema.Types.ObjectId,
      ref: "HiringProcess",
      required: true,
    },

    lastMessage: String,

    lastMessageAt: Date,
  },
  { timestamps: true },
);

/* 🔥 ONE CHAT PER PAIR */
conversationSchema.index({ employerId: 1, studentId: 1 }, { unique: true });

export const Conversation =
  mongoose.models.Conversation ||
  mongoose.model<IConversation>("Conversation", conversationSchema);
