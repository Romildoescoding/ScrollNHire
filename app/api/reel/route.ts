import dbConnect from "@/app/_lib/dbConnect";
import { Reel } from "@/app/models/ReelModel";
import StudentProfile from "@/models/StudentProfileModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { studentId, videoUrl, caption, tags, duration } = await req.json();

    if (!studentId || !videoUrl) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const reel = await Reel.create({
      studentId,
      videoUrl,
      caption: caption || "",
      tags: tags || [],
      duration,
    });

    return NextResponse.json({
      success: true,
      reel,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to create reel" },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  await dbConnect();

  const { searchParams } = new URL(req.url);

  const cursorCreatedAt = searchParams.get("cursorCreatedAt");
  const cursorId = searchParams.get("cursorId");

  const limit = 5;

  const query: any = {};

  /* stable pagination condition */

  if (cursorCreatedAt && cursorId) {
    query.$or = [
      { createdAt: { $lt: new Date(cursorCreatedAt) } },
      {
        createdAt: new Date(cursorCreatedAt),
        _id: { $lt: cursorId },
      },
    ];
  }

  const reels = await Reel.find(query)
    .sort({
      isFeatured: -1,
      likesCount: -1,
      viewsCount: -1,
      createdAt: -1,
      _id: -1,
    })
    .limit(limit)
    .populate({
      path: "studentId",
      select: "userId skills verified",
      populate: {
        path: "userId",
        model: "User",
        select: "name image",
      },
    })
    .lean();

  /* transform studentId -> student */

  const formattedReels = reels.map((reel: any) => ({
    ...reel,
    student: {
      _id: reel.studentId._id,
      skills: reel.studentId.skills,
      verified: reel.studentId.verified,
      user: reel.studentId.userId,
    },
    studentId: undefined,
  }));

  /* next cursor */

  const last = reels[reels.length - 1];

  const nextCursor =
    reels.length === limit
      ? {
          createdAt: last.createdAt,
          id: last._id,
        }
      : null;

  return NextResponse.json({
    reels: formattedReels,
    nextCursor,
  });
}
