import dbConnect from "@/app/_lib/dbConnect";
import { Comment } from "@/app/models/CommentModel";
import { Reel } from "@/app/models/ReelModel";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ reelId: string }> },
) {
  await dbConnect();

  const { reelId } = await context.params;

  const { searchParams } = new URL(req.url);
  const cursor = searchParams.get("cursor");

  const limit = 10;

  const query: any = {
    reelId,
  };

  if (cursor) {
    query.createdAt = { $lt: new Date(cursor) };
  }

  const comments = await Comment.find(query)
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate({
      path: "userId",
      model: "User",
      select: "name image role",
    })
    .lean();

  //
  const nextCursor =
    comments.length === limit ? comments[comments.length - 1].createdAt : null;

  return NextResponse.json({
    comments,
    nextCursor,
  });
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ reelId: string }> },
) {
  await dbConnect();

  const { text, userId } = await req.json();
  const { reelId } = await context.params;

  const comment = await Comment.create({
    reelId,
    userId,
    text,
  });

  await Reel.findByIdAndUpdate(reelId, {
    $inc: { commentsCount: 1 },
  });

  return NextResponse.json(comment);
}
