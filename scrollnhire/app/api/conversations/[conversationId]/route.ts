// GET /api/conversations/[conversationId]

import { NextResponse } from "next/server";
import { auth } from "@/auth";
import mongoose from "mongoose";
import { Conversation } from "@/app/models/ConversationModel";

export async function GET(
  req: Request,
  context: { params: Promise<{ conversationId: string }> },
) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const { conversationId } = await context.params;

    const convo = await Conversation.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(conversationId),
          $or: [
            { employerId: new mongoose.Types.ObjectId(userId) },
            { studentId: new mongoose.Types.ObjectId(userId) },
          ],
        },
      },

      // 👤 determine sender (other user)
      {
        $addFields: {
          senderId: {
            $cond: [
              { $eq: ["$employerId", new mongoose.Types.ObjectId(userId)] },
              "$studentId",
              "$employerId",
            ],
          },
        },
      },

      // 👤 populate sender
      {
        $lookup: {
          from: "users",
          localField: "senderId",
          foreignField: "_id",
          as: "sender",
        },
      },
      { $unwind: "$sender" },

      // 💬 get last message
      {
        $lookup: {
          from: "messages",
          let: { convoId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$conversationId", "$$convoId"] },
              },
            },
            { $sort: { createdAt: -1 } },
            { $limit: 1 },
          ],
          as: "lastMessage",
        },
      },
      {
        $unwind: {
          path: "$lastMessage",
          preserveNullAndEmptyArrays: true,
        },
      },

      // 📬 unread count
      {
        $lookup: {
          from: "messages",
          let: { convoId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$conversationId", "$$convoId"] },
                receiverId: new mongoose.Types.ObjectId(userId),
                seen: false,
              },
            },
            { $count: "count" },
          ],
          as: "unreadMessages",
        },
      },
      {
        $addFields: {
          unreadMessagesCount: {
            $ifNull: [{ $arrayElemAt: ["$unreadMessages.count", 0] }, 0],
          },
        },
      },

      // 🎯 FINAL FORMAT (your exact structure)
      {
        $project: {
          _id: 1,

          sender: {
            _id: "$sender._id",
            name: "$sender.name",
            image: "$sender.image",
          },

          lastMessage: {
            message: "$lastMessage.text",
            senderId: "$lastMessage.senderId",
            isRead: "$lastMessage.seen",
            createdAt: "$lastMessage.createdAt",
          },

          unreadMessagesCount: 1,
        },
      },
    ]);

    if (!convo || convo.length === 0) {
      return NextResponse.json(
        { success: false, message: "Conversation not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: convo[0],
    });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: err.message,
    });
  }
}
