import dbConnect from "@/app/_lib/dbConnect";
import ShortlistModel from "@/app/models/ShortlistModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ reelId: string }> },
) {
  try {
    await dbConnect();

    const { reelId } = await context.params;
    const body = await req.json();

    const { employerId, studentId } = body;

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

    const existing = await ShortlistModel.findOne({
      employerId,
      studentId,
      reelId,
    });

    if (existing) {
      await ShortlistModel.deleteOne({ _id: existing._id });

      return {
        shortlisted: false,
        message: "Removed from shortlist",
      };
    }

    const shortlist = await ShortlistModel.create({
      employerId,
      studentId,
      reelId,
    });

    const result = {
      shortlisted: true,
      message: "Student shortlisted",
      data: shortlist,
    };

    return NextResponse.json(
      {
        success: true,
        ...result,
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
