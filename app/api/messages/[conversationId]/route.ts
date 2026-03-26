// GET /api/messages/:conversationId

import { Message } from "@/app/models/Message";

export async function GET(
  req: Request,
  context: { params: Promise<{ conversationId: string }> },
) {
  try {
    const { conversationId } = await context.params;

    const messages = await Message.find({ conversationId }).sort({
      createdAt: 1,
    });

    return Response.json({ success: true, data: messages });
  } catch (err) {
    return Response.json({ success: false, error: err.message });
  }
}
