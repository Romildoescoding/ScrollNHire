import dbConnect from "@/app/_lib/dbConnect";
import { Comment } from "@/app/models/CommentModel";
import { Reel } from "@/app/models/ReelModel";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { reelId: string; commentId: string } },
) {
  await dbConnect();

  const { reelId, commentId } = params;

  await Comment.findByIdAndDelete(commentId);

  await Reel.findByIdAndUpdate(reelId, {
    $inc: { commentsCount: -1 },
  });

  return NextResponse.json({ success: true });
}
