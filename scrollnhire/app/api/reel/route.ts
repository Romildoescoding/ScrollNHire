import dbConnect from "@/app/_lib/dbConnect";
import { createEmbedding } from "@/app/_lib/geminiEmbedding";
import HiringProcessModel from "@/app/models/HiringProcessModel";
import { Like } from "@/app/models/LikeModel";
import { Reel } from "@/app/models/ReelModel";
import { User } from "@/app/models/UserModel";
import { auth } from "@/auth";
import mongoose from "mongoose";
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

    // 🧠 OPTIONAL: get student profile for better context
    const studentProfile = await StudentProfile.findOne({ userId }).lean();

    // 🧠 Build embedding text
    const embeddingText = `
This is a short video reel created by a student.

Caption: ${caption || ""}
Tags: ${(tags || []).join(", ")}

Creator Skills: ${(studentProfile?.skills || []).join(", ")}
    `.trim();

    // 🚀 Generate embedding
    const embedding = await createEmbedding(embeddingText, "document");

    const reel = await Reel.create({
      userId,
      videoUrl,
      thumbnailUrl,
      caption: caption || "",
      tags: tags || [],
      duration,

      embedding,
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
    const search = searchParams.get("search");

    const limit = 5;

    const query: any = {};

    // 🔍 SEARCH (optional)
    if (search) {
      query.$or = [
        { caption: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    // 🚫 ALWAYS exclude initial reel to prevent duplication
    if (initialReelId) {
      query._id = {
        ...(query._id || {}),
        $ne: new mongoose.Types.ObjectId(initialReelId),
      };
    }

    // 🔁 CURSOR PAGINATION (FIXED)
    if (cursorCreatedAt && cursorId) {
      query.$and = [
        ...(query.$and || []),
        {
          $or: [
            { createdAt: { $lt: new Date(cursorCreatedAt) } },
            {
              createdAt: new Date(cursorCreatedAt),
              _id: {
                $lt: new mongoose.Types.ObjectId(cursorId),
              },
            },
          ],
        },
      ];
    }

    let reels: any[] = [];

    // 🎯 INITIAL REEL HANDLING
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

      const remaining = await Reel.find(query)
        .sort({
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

    // ❤️ LIKES + SHORTLISTS
    if (viewerId) {
      const likes = await Like.find({
        userId: viewerId,
        reelId: { $in: reelIds },
      }).select("reelId");

      likedSet = new Set(likes.map((l) => l.reelId.toString()));

      const hiringProcesses = await HiringProcessModel.find({
        employerId: viewerId,
        status: { $ne: "rejected" },
        reels: { $in: reelIds },
      }).select("reels");

      shortlistedSet = new Set(
        hiringProcesses.flatMap((p) => p.reels.map((r: any) => r.toString())),
      );
    }

    // 🎁 FORMAT RESPONSE
    const formattedReels = reels.map(({ userId, ...reel }) => ({
      ...reel,
      user: userId,
      isLiked: likedSet.has(reel._id.toString()),
      isShortlisted: shortlistedSet.has(reel._id.toString()),
    }));

    // 🧭 NEXT CURSOR
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
