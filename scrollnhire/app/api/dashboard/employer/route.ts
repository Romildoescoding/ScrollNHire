import dbConnect from "@/app/_lib/dbConnect";
import HiringProcess from "@/app/models/HiringProcessModel";
import { auth } from "@/auth";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET() {
  try {
    await dbConnect();

    const session = await auth();
    const employerId = session?.user?.id;

    if (!employerId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    // 🎯 Fetch interviews
    const interviews = await HiringProcess.aggregate([
      {
        $match: {
          employerId: new mongoose.Types.ObjectId(employerId),
          interviewDate: { $exists: true },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "studentId",
          foreignField: "_id",
          as: "student",
        },
      },
      { $unwind: "$student" },
      {
        $project: {
          _id: 1,
          name: "$student.name",
          role: 1,
          interviewDate: 1,
          interviewLink: 1,
        },
      },
    ]);

    // 📅 interviews today
    const interviewsToday = interviews.filter(
      (i) =>
        i.interviewDate &&
        new Date(i.interviewDate) >= startOfDay &&
        new Date(i.interviewDate) <= endOfDay,
    );

    // ⏭️ next interview
    const upcoming = interviews
      .filter((i) => new Date(i.interviewDate) >= new Date())
      .sort((a, b) => +new Date(a.interviewDate) - +new Date(b.interviewDate));

    const nextInterview = upcoming[0] || null;

    return NextResponse.json({
      success: true,
      data: {
        interviewsTodayCount: interviewsToday.length,
        nextInterview,
        interviewsScheduled: interviews,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 },
    );
  }
}
