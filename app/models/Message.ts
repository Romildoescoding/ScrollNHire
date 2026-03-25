import mongoose, { Schema, Document, Types } from "mongoose";

export interface IMessage extends Document {
  conversationId: Types.ObjectId;

  senderId: Types.ObjectId;
  receiverId: Types.ObjectId;

  text?: string;

  seen: boolean;

  createdAt: Date;
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
