import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/_lib/dbConnect";

import { Reel } from "@/app/models/ReelModel";
import { Project } from "@/app/models/ProjectModel";
import StudentProfile from "@/app/models/StudentProfileModel";
import { createEmbedding } from "@/app/_lib/geminiEmbedding";

const LIMIT = 10;

function calculateScore(item: any) {
  const vector = item.vectorScore || 0;

  // 🔥 Normalize engagement (log scale)
  const likes = Math.log10((item.likesCount || 0) + 1);
  const views = Math.log10((item.viewsCount || 0) + 1);

  // 🕒 Smooth recency decay (not harsh cutoff)
  const ageHours = (Date.now() - new Date(item.createdAt).getTime()) / 3600000;

  const recencyBoost = Math.exp(-ageHours / 48);
  // half-life ≈ 2 days

  // 🎯 Final weighted score
  const score =
    vector * 0.6 + // 🧠 meaning dominates
    likes * 0.2 + // ❤️ engagement (controlled)
    views * 0.1 + // 👀 weaker than likes
    recencyBoost * 0.1; // ⏳ freshness

  return score;
}

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);

    const queryText = searchParams.get("query") || "";
    const type = searchParams.get("type") || "all";

    // 🧠 STEP 1: Convert query → embedding
    const queryEmbedding = await createEmbedding(queryText);

    /* ===================== REELS ===================== */

    let reels: any[] = [];

    if (type === "reels" || type === "all") {
      const rawReels = await Reel.aggregate([
        {
          $vectorSearch: {
            index: "reel_vector_index",
            path: "embedding",
            queryVector: queryEmbedding,
            numCandidates: 100,
            limit: LIMIT,
          },
        },
        {
          $addFields: {
            vectorScore: { $meta: "vectorSearchScore" },
          },
        },

        // 🔗 JOIN USER
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user",
          },
        },

        // 🧹 flatten
        {
          $unwind: "$user",
        },

        // 🎯 remove embedding + shape response
        {
          $project: {
            // embedding: 0, // ❌ remove embedding

            // keep reel fields
            // userId: 1,
            videoUrl: 1,
            thumbnailUrl: 1,
            tags: 1,
            caption: 1,
            likesCount: 1,
            commentsCount: 1,
            sharesCount: 1,
            viewsCount: 1,
            createdAt: 1,
            vectorScore: 1,

            // replace userId with user object
            user: {
              _id: "$user._id",
              name: "$user.name",
              image: "$user.image",
              role: "$user.role",
            },
          },
        },
      ]);

      reels = rawReels
        .map((r) => ({
          ...r,
          score: calculateScore(r),
        }))
        .sort((a, b) => b.score - a.score);
    }

    /* ===================== PROFILES ===================== */

    let accounts: any[] = [];

    if (type === "profiles" || type === "all") {
      const rawProfiles = await StudentProfile.aggregate([
        {
          $vectorSearch: {
            index: "profile_vector_index",
            path: "embedding",
            queryVector: queryEmbedding,
            numCandidates: 100,
            limit: LIMIT,
          },
        },
        {
          $addFields: {
            vectorScore: { $meta: "vectorSearchScore" },
          },
        },

        // 🔗 Join with User collection
        {
          $lookup: {
            from: "users", // collection name (IMPORTANT: lowercase plural usually)
            localField: "userId",
            foreignField: "_id",
            as: "user",
          },
        },

        // 🧹 Flatten user array
        {
          $unwind: "$user",
        },

        // 🎯 Final projection (exclude embedding, include what you need)
        {
          $project: {
            _id: 1,
            userId: 1,
            vectorScore: 1,

            // student profile fields
            rollno: 1,
            degree: 1,
            branch: 1,
            yearOfPassing: 1,
            cgpa: 1,
            skills: 1,
            github: 1,
            linkedin: 1,
            bio: 1,
            verified: 1,
            resumeUrl: 1,

            // user fields
            name: "$user.name",
            image: "$user.image",
            email: "$user.email",

            // 🚫 explicitly exclude embedding
            // embedding: 0,
          },
        },
      ]);

      accounts = rawProfiles
        .map((p) => ({
          ...p,
          score: calculateScore(p),
        }))
        .sort((a, b) => b.score - a.score);
    }

    /* ===================== PROJECTS ===================== */

    let projects: any[] = [];

    if (type === "projects" || type === "all") {
      const rawProjects = await Project.aggregate([
        {
          $vectorSearch: {
            index: "project_vector_index",
            path: "embedding",
            queryVector: queryEmbedding,
            numCandidates: 100,
            limit: LIMIT,
          },
        },
        {
          $addFields: {
            vectorScore: { $meta: "vectorSearchScore" },
          },
        },
        {
          $project: {
            embedding: 0,
          },
        },
      ]);

      projects = rawProjects
        .map((p) => ({
          ...p,
          score: calculateScore(p),
        }))
        .sort((a, b) => b.score - a.score);
    }

    return NextResponse.json({
      reels,
      accounts,
      projects,
    });
  } catch (error: any) {
    console.error("SEARCH_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Search failed",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 },
    );
  }
}
