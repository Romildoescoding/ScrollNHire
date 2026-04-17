// PATCH /api/projects/:projectId

import dbConnect from "@/app/_lib/dbConnect";
import HiringProcessModel from "@/app/models/HiringProcessModel";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
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

    // const student = await StudentProfile.findOne({ userId });

    // if (!student) {
    //   return NextResponse.json(
    //     { success: false, error: "Student profile not found" },
    //     { status: 404 },
    //   );
    // }

    const body = await req.json();
    const { hiringProcessId, status } = body;

    const existing = await HiringProcessModel.findById(hiringProcessId);

    const terminalStates = ["hired", "rejected"];

    let update: any = { status };

    if (terminalStates.includes(status)) {
      if (!terminalStates.includes(existing.status)) {
        update.lastActiveStatus = existing.status;
      }
    }

    if (status === "shortlisted") {
      update.status = existing.lastActiveStatus || "shortlisted";
    }

    const hiringProcess = await HiringProcessModel.findOneAndUpdate(
      {
        _id: hiringProcessId,
        employerId: userId, // 🔐 enforce ownership
      },
      { $set: update },
      { new: true },
    );

    return NextResponse.json({
      success: true,
      data: hiringProcess,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 },
    );
  }
}
