import mongoose, { Schema, Document, Types } from "mongoose";

export interface IMessage extends Document {
  conversationId: Types.ObjectId;
  senderId: Types.ObjectId;
  receiverId: Types.ObjectId;
  text?: string;
  type: "message" | "interview";
  seen: boolean;
  createdAt: Date;
  interviewMeta?: {
    date: Date;
    link: string;
  };
}

const messageSchema = new Schema<IMessage>(
  {
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
      index: true,
    },

    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    receiverId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    text: {
      type: String,
    },

    type: {
      type: String,
      enum: ["message", "interview"],
      default: "message",
    },
    interviewMeta: {
      date: {
        type: Date,
        required: function () {
          return this.type === "interview";
        },
      },
      link: {
        type: String,
        required: function () {
          return this.type === "interview";
        },
      },
    },
    seen: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

/* 🔥 FAST CHAT FETCH */
messageSchema.index({ conversationId: 1, createdAt: -1 });

export const Message =
  mongoose.models.Message || mongoose.model<IMessage>("Message", messageSchema);
