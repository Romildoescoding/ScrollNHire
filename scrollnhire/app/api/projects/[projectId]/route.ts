// PATCH /api/projects/:projectId

import dbConnect from "@/app/_lib/dbConnect";
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

    const student = await StudentProfile.findOne({ userId });

    if (!student) {
      return NextResponse.json(
        { success: false, error: "Student profile not found" },
        { status: 404 },
      );
    }

    const { projectId } = await context.params;

    const body = await req.json();

    const project = await Project.findOneAndUpdate(
      {
        _id: projectId,
        studentId: student._id, // 🔐 ownership check
      },
      { $set: body },
      { new: true },
    );

    if (!project) {
      return NextResponse.json(
        { success: false, error: "Project not found or unauthorized" },
        { status: 404 },
      );
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
