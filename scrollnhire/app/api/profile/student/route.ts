import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/_lib/dbConnect";
import StudentProfile from "@/app/models/StudentProfileModel";
import { User } from "@/app/models/UserModel";
import { createEmbedding } from "@/app/_lib/geminiEmbedding";

export async function PATCH(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();
    const { userId, ...rest } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 },
      );
    }

    // 🧹 Remove null / undefined
    const filteredUpdates = Object.fromEntries(
      Object.entries(rest).filter(
        ([_, value]) => value !== null && value !== undefined,
      ),
    );

    // 🎯 Check if embedding needs update
    const embeddingRelevantFields = [
      "bio",
      "skills",
      "degree",
      "branch",
      "cgpa",
    ];

    const shouldUpdateEmbedding = Object.keys(filteredUpdates).some((key) =>
      embeddingRelevantFields.includes(key),
    );

    // 🔥 Create or update profile
    let profile = await StudentProfile.findOneAndUpdate(
      { userId },
      {
        $set: filteredUpdates,
        $setOnInsert: { userId },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      },
    ).lean();

    // 🧠 Generate embedding ONLY if needed OR if new profile
    if (shouldUpdateEmbedding || !profile.embedding?.length) {
      // 👤 Fetch user name
      const user = await User.findById(userId).lean();

      const name = user?.name || "";

      // 🧠 Build meaningful text
      const embeddingText = `
This is a student profile.

Name: ${name}
Bio: ${profile.bio || ""}
Skills: ${(profile.skills || []).join(", ")}
Degree: ${profile.degree || ""}
Branch: ${profile.branch || ""}
CGPA: ${profile.cgpa || ""}
      `.trim();

      // 🚀 Generate embedding
      const embedding = await createEmbedding(embeddingText, "document");

      // 💾 Save embedding
      profile = await StudentProfile.findOneAndUpdate(
        { userId },
        { $set: { embedding } },
        { new: true },
      ).lean();
    }

    return NextResponse.json(
      { message: "Profile saved successfully", profile },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Error updating profile:", error);

    return NextResponse.json(
      {
        error: "Update failed",
        details: error.message,
      },
      { status: 500 },
    );
  }
}
