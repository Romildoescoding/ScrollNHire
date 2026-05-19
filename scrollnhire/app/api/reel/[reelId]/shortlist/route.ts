import dbConnect from "@/app/_lib/dbConnect";
import { Notification } from "@/app/models/NotificationModel";
import HiringProcess from "@/app/models/HiringProcessModel";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getPostHogClient } from "@/app/lib/posthog-server";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ reelId: string }> },
) {
  try {
    await dbConnect();

    const { reelId } = await context.params;
    const { studentId } = await req.json();

    const session = await auth();
    const employerId = session?.user?.id;

    if (!reelId || !studentId || !employerId) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 },
      );
    }

    /* 🔍 FIND EXISTING RELATIONSHIP */

    let existing = await HiringProcess.findOne({
      employerId,
      studentId,
    });

    /* 🆕 CREATE NEW */

    if (!existing) {
      const hiring = await HiringProcess.create({
        employerId,
        studentId,
        reels: [reelId],
        status: "shortlisted",
        role: "Not specified", // adjust if needed
      });

      await Notification.create({
        recipientId: studentId,
        senderId: employerId,
        reelId,
        type: "shortlist",
        message: "shortlisted your profile",
      });

      getPostHogClient().capture({
        distinctId: employerId,
        event: "reel_shortlisted",
        properties: { reel_id: reelId, student_id: studentId },
      });

      return NextResponse.json({
        success: true,
        shortlisted: true,
        message: "Student shortlisted",
        data: hiring,
      });
    }

    /* 🚫 BLOCK if already progressed */

    if (existing.status !== "shortlisted") {
      return NextResponse.json(
        { success: false, message: "Candidate already in hiring process" },
        { status: 400 },
      );
    }

    const alreadyShortlisted = existing.reels.some(
      (r: any) => r.toString() === reelId,
    );

    /* ❌ REMOVE REEL */

    if (alreadyShortlisted) {
      const updated = await HiringProcess.findOneAndUpdate(
        { _id: existing._id },
        {
          $pull: { reels: reelId },
        },
        { new: true },
      );

      /* 🧠 If no reels left → delete entire hiring process */

      if (updated.reels.length === 0) {
        await HiringProcess.deleteOne({ _id: existing._id });
      }

      return NextResponse.json({
        success: true,
        shortlisted: false,
        message: "Removed from shortlist",
      });
    }

    /* ➕ ADD REEL */

    const updated = await HiringProcess.findOneAndUpdate(
      { _id: existing._id },
      {
        $addToSet: { reels: reelId },
      },
      { new: true },
    );

    return NextResponse.json({
      success: true,
      shortlisted: true,
      message: "Reel added to shortlist",
      data: updated,
    });
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
