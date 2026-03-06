import dbConnect from "@/app/_lib/dbConnect";
import { Like } from "@/app/models/LikeModel";
import { Reel } from "@/app/models/ReelModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { reelId: string } },
) {
  await dbConnect();

  const { studentId } = await req.json();
  const { reelId } = params;

  const existingLike = await Like.findOne({
    reelId,
    studentId,
  });

  if (existingLike) {
    await Like.deleteOne({ _id: existingLike._id });

    await Reel.findByIdAndUpdate(reelId, {
      $inc: { likesCount: -1 },
    });

    return NextResponse.json({ liked: false });
  }

  await Like.create({
    reelId,
    studentId,
  });

  await Reel.findByIdAndUpdate(reelId, {
    $inc: { likesCount: 1 },
  });

  return NextResponse.json({ liked: true });
}
