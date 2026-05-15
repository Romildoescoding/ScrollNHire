// GET /api/projects

import dbConnect from "@/app/_lib/dbConnect";
import { createEmbedding } from "@/app/_lib/geminiEmbedding";
import { Project } from "@/app/models/ProjectModel";
import StudentProfile from "@/app/models/StudentProfileModel";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function GET() {
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
        { success: false, error: "No student profile found" },
        { status: 404 },
      );
    }

    const projects = await Project.find(
      { studentId: student._id },
      { embedding: 0 },
    );

    return NextResponse.json({
      success: true,
      data: projects,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
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

    const body = await req.json();

    // 🧠 Minimal validation (you can expand this later)
    if (!body.title) {
      return NextResponse.json(
        { success: false, error: "Title is required" },
        { status: 400 },
      );
    }

    // 🧠 Build embedding text
    const embeddingText = `
This is a software project.

Title: ${body.title}
Description: ${body.description || ""}
Tech Stack: ${(body.techStack || []).join(", ")}
Category: ${body.category || ""}
`.trim();
    // Difficulty: ${body.difficultyLevel || ""}

    // 🚀 Generate embedding
    const embedding = await createEmbedding(embeddingText, "document");

    const newProject = await Project.create({
      studentId: student._id,

      title: body.title,
      description: body.description || "",

      techStack: body.techStack || [],

      githubUrl: body.githubUrl || "",
      liveUrl: body.liveUrl || "",

      thumbnail: body.thumbnail || "",
      images: body.images || [],
      videoUrl: body.videoUrl || "",

      category: body.category || "",
      difficultyLevel: body.difficultyLevel,

      embedding, // THE IMPORTANT LINE

      // defaults handled by schema
    });

    return NextResponse.json(
      {
        success: true,
        data: newProject,
      },
      { status: 201 },
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 },
    );
  }
}
