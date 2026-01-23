// app/api/mails/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/app/lib/prisma";
import { sendEmailToGemini } from "@/app/lib/utils";

/**
 * GET handler:
 * 1. Sync new Gmail messages into DB
 * 2. Return paginated email threads for the user
 *
 * Query params:
 * - page (default = 1)
 * - limit (default = 10)
 */
export async function GET(req: Request) {
  const session = await auth();
  if (!session || !session.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    console.log(session.user);
    const user = await prisma.user.findUnique({
      where: { email: session?.user?.email || "" },
      // where: { id: session?.user?.id! },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // --- 1. Sync new Gmail emails ---
    const now = new Date();
    const lastSynced =
      user.lastSyncedAt || new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const cutoff = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const since = lastSynced < cutoff ? cutoff : lastSynced;

    const query = `after:${since.getFullYear()}/${
      since.getMonth() + 1
    }/${since.getDate()}`;

    const gmailRes = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/me/messages?q=${encodeURIComponent(
        query
      )}&maxResults=15`,
      {
        headers: { Authorization: `Bearer ${session.accessToken}` },
      }
    );

    const gmailData = await gmailRes.json();
    console.log("Your gmail data is ----->");
    console.log(gmailData);

    if (gmailData.messages) {
      for (const msg of gmailData.messages) {
        const msgRes = await fetch(
          `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}`,
          { headers: { Authorization: `Bearer ${session.accessToken}` } }
        );
        const msgData = await msgRes.json();

        const receivedAt = new Date(parseInt(msgData.internalDate));

        // Skip if older than lastSyncedAt
        if (
          user.lastSyncedAt &&
          receivedAt.getTime() <= user.lastSyncedAt.getTime()
        ) {
          console.log(`Skipping old email ${msg.id}`);
          continue;
        }

        const headers = msgData.payload?.headers || [];
        const subject =
          headers.find((h: any) => h.name === "Subject")?.value || "";
        const from = headers.find((h: any) => h.name === "From")?.value || "";
        const snippet = msgData.snippet || "";

        // Check if thread already exists
        const existingThread = await prisma.emailThread.findUnique({
          where: { gmailThreadId: msg.threadId },
        });

        if (existingThread) {
          // ✅ Skip processing this thread
          console.log(
            `Thread ${msg.threadId} already exists, skipping Gemini call.`
          );
          continue;
        }

        const aiResult = await sendEmailToGemini({ from, subject, snippet });

        // Insert new thread
        const thread = await prisma.emailThread.create({
          data: {
            gmailThreadId: msg.threadId,
            subject,
            from,
            summary: aiResult.summary || snippet,
            receivedAt: new Date(parseInt(msgData.internalDate)),
            userId: user.id,
          },
        });

        // Insert AI actions if any
        if (aiResult.actions && Array.isArray(aiResult.actions)) {
          for (const act of aiResult.actions) {
            await prisma.action.create({
              data: {
                threadId: thread.id,
                type: act.type || "TASK",
                content: act.content,
                dueDate: act.dueDate ? new Date(act.dueDate) : null,
              },
            });
          }
        }
      }
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { lastSyncedAt: now },
    });

    // --- 2. Return paginated threads ---
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;

    const [threads, total] = await Promise.all([
      prisma.emailThread.findMany({
        where: { userId: user.id },
        include: { actions: true },
        orderBy: { receivedAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.emailThread.count({ where: { userId: user.id } }),
    ]);

    return NextResponse.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      threads,
    });
  } catch (error: any) {
    console.error("Error fetching emails:", error);
    return NextResponse.json(
      { error: "Failed to fetch emails", details: error.message },
      { status: 500 }
    );
  }
}
