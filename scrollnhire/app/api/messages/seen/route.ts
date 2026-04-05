// PATCH /api/messages/seen

import { Message } from "@/app/models/Message";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  try {
    // const { messageIds, conversationId } = await req.json();
    const { messageIds } = await req.json();

    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ success: false }, { status: 401 });
    }

    await Message.updateMany(
      {
        _id: { $in: messageIds },
        receiverId: userId,
      },
      {
        $set: { seen: true },
      },
    );

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message });
  }
}
