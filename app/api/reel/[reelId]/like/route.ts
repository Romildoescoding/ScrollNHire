import dbConnect from "@/app/_lib/dbConnect";
import { Like } from "@/app/models/LikeModel";
import { Reel } from "@/app/models/ReelModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ reelId: string }> },
) {
  await dbConnect();

  const { userId } = await req.json();
  const { reelId } = await params;

  const existingLike = await Like.findOne({
    reelId,
    userId,
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
    userId,
  });

  await Reel.findByIdAndUpdate(reelId, {
    $inc: { likesCount: 1 },
  });

  return NextResponse.json({ liked: true });
}
