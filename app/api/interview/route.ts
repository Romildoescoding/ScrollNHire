// POST /api/interview

import { auth } from "@/auth";
import HiringProcessModel from "@/app/models/HiringProcessModel";
import { Message } from "@/app/models/Message";
import { Conversation } from "@/app/models/ConversationModel";

export async function POST(req: Request) {
  try {
    const { interviewTime, interviewLink, conversationId, receiverId } =
      await req.json();

    const session = await auth();
    const userId = session?.user?.id;

    if (!userId || session?.user?.role !== "employer") {
      return Response.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    // 🔍 Get conversation (to access hiringProcessId + studentId)
    const convo = await Conversation.findById(conversationId);

    if (!convo) {
      return Response.json(
        { success: false, error: "Conversation not found" },
        { status: 404 },
      );
    }

    // 🔥 Update Hiring Process
    await HiringProcessModel.findOneAndUpdate(
      {
        _id: convo.hiringProcessId,
        employerId: userId,
      },
      {
        status: "interview_scheduled",
        interviewDate: new Date(interviewTime),
        interviewLink,
      },
    );

    // 💬 Create system message
    const message = await Message.create({
      conversationId,
      senderId: userId,
      receiverId,
      text: `Interview scheduled on ${new Date(interviewTime).toLocaleString()}`,
      type: "interview",
      interviewMeta: {
        date: new Date(interviewTime),
        link: interviewLink,
      },
      seen: false,
    });

    return Response.json({
      success: true,
      data: message,
    });
  } catch (err: any) {
    return Response.json({
      success: false,
      error: err.message,
    });
  }
}
