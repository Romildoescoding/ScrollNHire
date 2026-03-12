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
  try {
    await dbConnect();

    const body = await req.json();
    const { text, userId } = body;

    const { reelId } = await context.params;

    // validation
    if (!text || !userId) {
      return NextResponse.json(
        { success: false, message: "text and userId are required" },
        { status: 400 },
      );
    }

    if (!reelId) {
      return NextResponse.json(
        { success: false, message: "reelId is required" },
        { status: 400 },
      );
    }

    // create comment
    const comment = await Comment.create({
      reelId,
      userId,
      text,
    });

    // increment reel comment count
    await Reel.findByIdAndUpdate(reelId, {
      $inc: { commentsCount: 1 },
    });

    // populate user info
    const populatedComment = await Comment.findById(comment._id)
      .populate({
        path: "userId",
        model: "User",
        select: "name image role",
      })
      .lean();

    return NextResponse.json(
      {
        success: true,
        data: populatedComment,
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("COMMENT_CREATION_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create comment",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 },
    );
  }
}
