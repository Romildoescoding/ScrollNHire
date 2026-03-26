// POST /api/messages

import { Conversation } from "@/app/models/ConversationModel";
import { Message } from "@/app/models/Message";
import { auth } from "@/auth";

export async function POST(req: Request) {
  try {
    const { conversationId, employerId, studentId, text, hiringProcessId } =
      await req.json();

    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return Response.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    let convo;

    // ✅ If conversationId is provided → trust it
    if (conversationId) {
      convo = await Conversation.findById(conversationId);
    }

    // ✅ Otherwise → UPSERT conversation (atomic 💥)
    if (!convo) {
      convo = await Conversation.findOneAndUpdate(
        { employerId, studentId }, // unique key
        {
          $setOnInsert: {
            employerId,
            studentId,
            hiringProcessId,
          },
        },
        {
          new: true,
          upsert: true,
        },
      );
    }

    // ✅ Decide sender & receiver cleanly
    const senderId = userId;
    const receiverId = userId === employerId ? studentId : employerId;

    // ✅ Create message
    const message = await Message.create({
      conversationId: convo._id,
      senderId,
      receiverId,
      text,
    });

    // ✅ Update conversation metadata
    await Conversation.findByIdAndUpdate(convo._id, {
      lastMessage: text,
      lastMessageAt: new Date(),
    });

    return Response.json({
      success: true,
      data: message,
      conversationId: convo._id,
    });
  } catch (err: any) {
    return Response.json({ success: false, error: err.message });
  }
}
