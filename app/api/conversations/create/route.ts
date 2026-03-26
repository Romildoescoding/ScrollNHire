// POST /api/conversations

import { Conversation } from "@/app/models/ConversationModel";
import { auth } from "@/auth";

export async function POST(req: Request) {
  try {
    const { employerId, studentId, hiringProcessId } = await req.json();

    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return Response.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    // 🔥 UPSERT again (same logic, no duplicates)
    const convo = await Conversation.findOneAndUpdate(
      { employerId, studentId },
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

    return Response.json({
      success: true,
      data: convo,
    });
  } catch (err: any) {
    return Response.json({ success: false, error: err.message });
  }
}
