import dbConnect from "@/app/_lib/dbConnect";
import { createEmbedding } from "@/app/_lib/geminiEmbedding";
import { Reel } from "@/app/models/ReelModel";
import StudentProfile from "@/app/models/StudentProfileModel";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  context: { params: Promise<{ reelId: string }> },
) {
  try {
    await dbConnect();

    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const { reelId } = await context.params;
    const body = await req.json();

    // 🎯 Only allow specific fields
    const allowedFields = ["caption", "tags", "thumbnailUrl"];

    const updates: any = {};
    for (const key of allowedFields) {
      if (body[key] !== undefined) {
        updates[key] = body[key];
      }
    }

    // 🧠 Check if embedding needs update
    const embeddingRelevantFields = ["caption", "tags"];

    const shouldUpdateEmbedding = Object.keys(updates).some((key) =>
      embeddingRelevantFields.includes(key),
    );

    // 🔥 Update reel (ownership check)
    let reel = await Reel.findOneAndUpdate(
      {
        _id: reelId,
        userId: userId, // 🔐 ensures ownership
      },
      { $set: updates },
      { new: true },
    ).lean();

    if (!reel) {
      return NextResponse.json(
        { success: false, error: "Reel not found or unauthorized" },
        { status: 404 },
      );
    }

    // 🧠 Recompute embedding if needed
    if (shouldUpdateEmbedding || !reel.embedding?.length) {
      // get creator context
      const studentProfile = await StudentProfile.findOne({ userId }).lean();

      const embeddingText = `
This is a short video reel created by a student.

Caption: ${reel.caption || ""}
Tags: ${(reel.tags || []).join(", ")}

Creator Skills: ${(studentProfile?.skills || []).join(", ")}
      `.trim();

      const embedding = await createEmbedding(embeddingText, "document");

      reel = await Reel.findOneAndUpdate(
        { _id: reelId },
        { $set: { embedding } },
        { new: true },
      ).lean();
    }

    return NextResponse.json({
      success: true,
      data: reel,
    });
  } catch (error: any) {
    console.error("REEL PATCH ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    );
  }
}
