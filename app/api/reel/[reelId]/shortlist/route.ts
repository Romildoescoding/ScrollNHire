import dbConnect from "@/app/_lib/dbConnect";
import { Notification } from "@/app/models/NotificationModel";
import HiringProcess from "@/app/models/HiringProcessModel";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ reelId: string }> },
) {
  try {
    await dbConnect();

    const { reelId } = await context.params;
    const body = await req.json();

    const { studentId } = body;

    const session = await auth();
    const employerId = session?.user?.id;

    if (!reelId) {
      return NextResponse.json(
        { success: false, message: "reelId is required" },
        { status: 400 },
      );
    }

    if (!employerId || !studentId) {
      return NextResponse.json(
        { success: false, message: "employerId and studentId are required" },
        { status: 400 },
      );
    }

    const existing = await HiringProcess.findOne({
      employerId,
      studentId,
      reelId,
    });

    /* UN-SHORTLIST */

    if (existing) {
      // If already in the hiring pipeline, CAN"T SHORTLIST HIM DUDE..
      if (existing.status !== "shortlisted") {
        return NextResponse.json(
          { success: false, message: "Candidate already in hiring process" },
          { status: 400 },
        );
      }
      await HiringProcess.deleteOne({ _id: existing._id });

      return NextResponse.json({
        success: true,
        shortlisted: false,
        message: "Removed from shortlist",
      });
    }

    /* CREATE HIRING PROCESS */

    const hiring = await HiringProcess.create({
      employerId,
      studentId,
      reelId,
      status: "shortlisted",
    });

    /* CREATE NOTIFICATION */

    await Notification.create({
      recipientId: studentId,
      senderId: employerId,
      reelId,
      type: "shortlist",
      message: "Your project reel was shortlisted by an employer",
    });

    return NextResponse.json(
      {
        success: true,
        shortlisted: true,
        message: "Student shortlisted",
        data: hiring,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("SHORTLIST_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to toggle shortlist",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 },
    );
  }
}
