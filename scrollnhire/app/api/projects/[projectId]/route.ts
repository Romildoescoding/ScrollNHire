import dbConnect from "@/app/_lib/dbConnect";
import { createEmbedding } from "@/app/_lib/geminiEmbedding";
import { Project } from "@/app/models/ProjectModel";
import StudentProfile from "@/app/models/StudentProfileModel";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  context: { params: Promise<{ projectId: string }> },
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

    const student = await StudentProfile.findOne({ userId }, { embedding: 0 });

    if (!student) {
      return NextResponse.json(
        { success: false, error: "Student profile not found" },
        { status: 404 },
      );
    }

    const { projectId } = await context.params;
    const body = await req.json();

    // 🧠 fields that affect embedding
    const embeddingRelevantFields = [
      "title",
      "description",
      "techStack",
      "category",
      "difficultyLevel",
    ];

    const shouldUpdateEmbedding = Object.keys(body).some((key) =>
      embeddingRelevantFields.includes(key),
    );

    // 🔥 update project
    let project = await Project.findOneAndUpdate(
      {
        _id: projectId,
        studentId: student._id,
      },
      { $set: body },
      { new: true },
    ).lean();

    if (!project) {
      return NextResponse.json(
        { success: false, error: "Project not found or unauthorized" },
        { status: 404 },
      );
    }

    // 🧠 regenerate embedding if needed
    if (shouldUpdateEmbedding || !project.embedding?.length) {
      const embeddingText = `
This is a software project.

Title: ${project.title}
Description: ${project.description || ""}
Tech Stack: ${(project.techStack || []).join(", ")}
Category: ${project.category || ""}
`.trim();
      // Difficulty: ${project.difficultyLevel || ""}

      const embedding = await createEmbedding(embeddingText, "document");

      project = await Project.findOneAndUpdate(
        { _id: projectId },
        { $set: { embedding } },
        { new: true },
      ).lean();
    }

    return NextResponse.json({
      success: true,
      data: project,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 },
    );
  }
}
