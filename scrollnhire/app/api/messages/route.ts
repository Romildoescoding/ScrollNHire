import dbConnect from "@/app/_lib/dbConnect";
import { Conversation } from "@/app/models/ConversationModel";
import { Message } from "@/app/models/Message";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await dbConnect();

    let { conversationId, employerId, studentId, text, hiringProcessId } =
      await req.json();

    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    if (!text?.trim()) {
      return NextResponse.json(
        { success: false, error: "Message cannot be empty" },
        { status: 400 },
      );
    }

    let convo;

    // ✅ Existing conversation
    if (conversationId) {
      convo = await Conversation.findById(conversationId);

      if (!convo) {
        return NextResponse.json(
          { success: false, error: "Conversation not found" },
          { status: 404 },
        );
      }

      employerId = convo.employerId;
      studentId = convo.studentId;
    }

    // ✅ Create if not exists
    if (!convo) {
      convo = await Conversation.findOneAndUpdate(
        { employerId, studentId },
        {
          $setOnInsert: {
            employerId,
            studentId,
            hiringProcessId,
          },
        },
        { new: true, upsert: true },
      );
    }

    // 🔒 Authorization check
    if (
      ![convo.employerId.toString(), convo.studentId.toString()].includes(
        userId,
      )
    ) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access" },
        { status: 403 },
      );
    }

    const senderId = userId;
    const receiverId =
      userId === convo.employerId.toString()
        ? convo.studentId
        : convo.employerId;

    const message = await Message.create({
      conversationId: convo._id,
      senderId,
      receiverId,
      text,
    });

    await Conversation.findByIdAndUpdate(convo._id, {
      lastMessage: text,
      lastMessageAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      data: message,
      conversationId: convo._id,
    });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: err.message,
    });
  }
}
