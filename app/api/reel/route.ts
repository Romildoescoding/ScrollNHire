import dbConnect from "@/app/_lib/dbConnect";
import HiringProcessModel from "@/app/models/HiringProcessModel";
import { Like } from "@/app/models/LikeModel";
import { Reel } from "@/app/models/ReelModel";
import { User } from "@/app/models/UserModel";
import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { userId, videoUrl, thumbnailUrl, caption, tags, duration } =
      await req.json();

    if (!userId || !videoUrl) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.role !== "student") {
      return NextResponse.json(
        { error: "Only students can upload reels" },
        { status: 403 },
      );
    }

    const reel = await Reel.create({
      userId,
      videoUrl,
      thumbnailUrl,
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
  try {
    await dbConnect();

    const session = await auth();
    const viewerId = session?.user?.id;

    const { searchParams } = new URL(req.url);
    const cursorCreatedAt = searchParams.get("cursorCreatedAt");
    const cursorId = searchParams.get("cursorId");
    const initialReelId = searchParams.get("initialReelId");

    const limit = 5;

    const query: any = {};

    if (cursorCreatedAt && cursorId) {
      query.$or = [
        { createdAt: { $lt: new Date(cursorCreatedAt) } },
        {
          createdAt: new Date(cursorCreatedAt),
          _id: { $lt: cursorId },
        },
      ];
    }

    let reels: any[] = [];

    // ✅ HANDLE INITIAL REEL ONLY ON FIRST LOAD
    if (initialReelId && !cursorCreatedAt && !cursorId) {
      const initialReel = await Reel.findById(initialReelId)
        .populate({
          path: "userId",
          model: "User",
          select: "name image role",
        })
        .lean();

      if (initialReel) {
        reels.push(initialReel);
      }

      // ❌ exclude initial reel from normal query
      query._id = { $ne: initialReelId };

      const remaining = await Reel.find(query)
        .sort({
          isFeatured: -1,
          likesCount: -1,
          viewsCount: -1,
          createdAt: -1,
          _id: -1,
        })
        .limit(limit - reels.length)
        .populate({
          path: "userId",
          model: "User",
          select: "name image role",
        })
        .lean();

      reels = [...reels, ...remaining];
    } else {
      // 🔁 NORMAL FLOW
      reels = await Reel.find(query)
        .sort({
          isFeatured: -1,
          likesCount: -1,
          viewsCount: -1,
          createdAt: -1,
          _id: -1,
        })
        .limit(limit)
        .populate({
          path: "userId",
          model: "User",
          select: "name image role",
        })
        .lean();
    }

    const reelIds = reels.map((r) => r._id);

    let likedSet = new Set<string>();
    let shortlistedSet = new Set<string>();

    if (viewerId) {
      const likes = await Like.find({
        userId: viewerId,
        reelId: { $in: reelIds },
      }).select("reelId");

      likedSet = new Set(likes.map((l) => l.reelId.toString()));

      const hiringProcesses = await HiringProcessModel.find({
        employerId: viewerId,
        reelId: { $in: reelIds },
      }).select("reelId status");

      shortlistedSet = new Set(
        hiringProcesses
          .filter((h) => h.status !== "rejected")
          .map((h) => h.reelId.toString()),
      );
    }

    const formattedReels = reels.map(({ userId, ...reel }) => ({
      ...reel,
      user: userId,
      isLiked: likedSet.has(reel._id.toString()),
      isShortlisted: shortlistedSet.has(reel._id.toString()),
    }));

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
  } catch (error: any) {
    console.error("FETCH_REELS_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch reels",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 },
    );
  }
}
