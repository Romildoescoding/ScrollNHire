import dbConnect from "@/app/_lib/dbConnect";
import { Like } from "@/app/models/LikeModel";
import { Notification } from "@/app/models/NotificationModel";
import { Reel } from "@/app/models/ReelModel";
import { NextRequest, NextResponse } from "next/server";
import { getPostHogClient } from "@/app/lib/posthog-server";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ reelId: string }> },
) {
  await dbConnect();

  const { reelId } = await context.params;
  const { userId } = await req.json();

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

  // CREATE A NOTIFICATION FOR THE USER
  // ---------------------------------------------
  const reel = await Reel.findById(reelId).select("userId");

  if (reel && reel.userId.toString() !== userId) {
    const existingNotification = await Notification.findOne({
      recipientId: reel.userId,
      senderId: userId,
      reelId,
      type: "like",
    });

    if (!existingNotification) {
      await Notification.create({
        recipientId: reel.userId,
        senderId: userId,
        reelId,
        type: "like",
      });
    }
  }
  // ---------------------------------------------

  await Reel.findByIdAndUpdate(reelId, {
    $inc: { likesCount: 1 },
  });

  getPostHogClient().capture({
    distinctId: userId,
    event: "reel_liked",
    properties: { reel_id: reelId },
  });

  return NextResponse.json({ liked: true });
}
