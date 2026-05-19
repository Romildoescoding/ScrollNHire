// POST /api/conversations

import { Conversation } from "@/app/models/ConversationModel";
import HiringProcessModel from "@/app/models/HiringProcessModel";
import { auth } from "@/auth";
import { getPostHogClient } from "@/app/lib/posthog-server";

export async function POST(req: Request) {
  try {
    const { employerId, studentId, hiringProcessId } = await req.json();

    const session = await auth();
    const userId = session?.user?.id;

    if (!userId || session?.user?.role !== "employer") {
      return Response.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    // 🔥 UPSERT again (same logic, no duplicates)
    const convo = await Conversation.findOneAndUpdate(
      { employerId: userId, studentId },
      {
        $setOnInsert: {
          employerId: userId,
          studentId,
          hiringProcessId,
        },
      },
      {
        new: true,
        upsert: true,
      },
    );

    await HiringProcessModel.findOneAndUpdate(
      {
        _id: hiringProcessId,
        employerId: userId,
        status: { $ne: "chatting" },
      },
      { status: "chatting" },
    );

    getPostHogClient().capture({
      distinctId: userId,
      event: "conversation_started",
      properties: { student_id: studentId, hiring_process_id: hiringProcessId },
    });

    return Response.json({
      success: true,
      data: convo,
    });
  } catch (err: any) {
    return Response.json({ success: false, error: err.message });
  }
}
