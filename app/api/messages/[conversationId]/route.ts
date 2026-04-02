// GET /api/messages/:conversationId

import { Message } from "@/app/models/Message";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

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

    if (!conversationId) {
      return NextResponse.json(
        { success: false, message: "conversationId required" },
        { status: 400 },
      );
    }

    const messages = await Message.find({
      conversationId,
    })
      .sort({ createdAt: 1 }) // oldest → newest
      .lean();

    return NextResponse.json({
      success: true,
      data: messages,
    });
  } catch (error: any) {
    console.error("GET_MESSAGES_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch messages",
      },
      { status: 500 },
    );
  }
}
