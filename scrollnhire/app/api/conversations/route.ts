// GET /api/conversations

import { Conversation } from "@/app/models/ConversationModel";
import { auth } from "@/auth";
import mongoose from "mongoose";

export async function GET(req: Request) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return Response.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);

    const conversations = await Conversation.aggregate([
      // ✅ 1. Match conversations of user
      {
        $match: {
          $or: [{ employerId: userObjectId }, { studentId: userObjectId }],
        },
      },

      // ✅ 2. Sort by last activity
      {
        $sort: { lastMessageAt: -1 },
      },

      // ✅ 3. Lookup last message
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

      // ✅ 4. Count unread messages
      {
        $lookup: {
          from: "messages",
          let: { convoId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$conversationId", "$$convoId"] },
                    { $eq: ["$receiverId", userObjectId] },
                    { $eq: ["$seen", false] },
                  ],
                },
              },
            },
            { $count: "count" },
          ],
          as: "unreadData",
        },
      },

      {
        $addFields: {
          unreadMessagesCount: {
            $ifNull: [{ $arrayElemAt: ["$unreadData.count", 0] }, 0],
          },
        },
      },

      // ✅ 5. Lookup both users
      {
        $lookup: {
          from: "users",
          localField: "studentId",
          foreignField: "_id",
          as: "student",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "employerId",
          foreignField: "_id",
          as: "employer",
        },
      },

      {
        $unwind: "$student",
      },
      {
        $unwind: "$employer",
      },

      // ✅ 6. Pick "other user"
      {
        $addFields: {
          sender: {
            $cond: [
              { $eq: ["$employerId", userObjectId] },
              "$student",
              "$employer",
            ],
          },
        },
      },

      // ✅ 7. Final shape
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

    return Response.json({ success: true, data: conversations });
  } catch (err: any) {
    return Response.json({ success: false, error: err.message });
  }
}
