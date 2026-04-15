import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/_lib/dbConnect";

import { Reel } from "@/app/models/ReelModel";
import { Project } from "@/app/models/ProjectModel";
import StudentProfile from "@/app/models/StudentProfileModel";

const LIMIT = 10;

/* ===================== QUERY PARSER ===================== */

function parseQueryAdvanced(query: string) {
  const q = query.toLowerCase();

  const skills: string[] = [];
  const roles: string[] = [];
  let location: string | null = null;

  const knownSkills = [
    "react",
    "node",
    "mongodb",
    "express",
    "javascript",
    "typescript",
    "java",
    "springboot",
  ];

  const knownRoles = ["developer", "engineer", "designer"];

  const tokens = q.split(/\s+/);

  tokens.forEach((token) => {
    if (knownSkills.includes(token)) skills.push(token);
    if (knownRoles.includes(token)) roles.push(token);
  });

  // basic "in <location>" detection
  const locationMatch = q.match(/in ([a-z\s]+)/);
  if (locationMatch) {
    location = locationMatch[1].trim();
  }

  return {
    raw: q,
    skills,
    roles,
    location,
  };
}

/* ===================== SCORE FUNCTION ===================== */

function calculateScore(item: any, parsed: any) {
  let score = 0;

  const text = (
    item.caption ||
    item.title ||
    item.description ||
    item.bio ||
    ""
  ).toLowerCase();

  const tags = item.tags || item.skills || item.techStack || [];

  // 🔥 skill match
  parsed.skills.forEach((skill: string) => {
    if (tags.includes(skill)) score += 10;
    if (text.includes(skill)) score += 5;
  });

  // 🔥 name match (very important)
  if (item.userId?.name?.toLowerCase().includes(parsed.raw)) {
    score += 20;
  }

  // 🔥 engagement boost
  score += (item.likesCount || 0) * 0.05;
  score += (item.viewsCount || 0) * 0.02;

  // 🔥 recency boost
  const ageHours = (Date.now() - new Date(item.createdAt).getTime()) / 3600000;

  score += Math.max(15 - ageHours, 0);

  return score;
}

/* ===================== SORT ===================== */

function sortItems(a: any, b: any, sort: string) {
  if (sort === "latest") {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  }

  if (sort === "most_liked") {
    return (b.likesCount || 0) - (a.likesCount || 0);
  }

  return b.score - a.score; // trending
}

/* ===================== API ===================== */

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);

    const queryText = searchParams.get("query") || "";
    const type = searchParams.get("type") || "all";
    const sort = searchParams.get("sort") || "trending";

    const tagsParam = searchParams.get("tags");
    const selectedTags = tagsParam ? tagsParam.split(",") : [];

    const parsed = parseQueryAdvanced(queryText);

    const combinedSkills = [...parsed.skills, ...selectedTags];

    /* ===================== REELS ===================== */

    let reels: any[] = [];

    if (type === "reels" || type === "all") {
      const rawReels = await Reel.find({
        $or: [
          { caption: { $regex: queryText, $options: "i" } },
          { tags: { $in: combinedSkills } },
        ],
      })
        .populate("userId", "name image role")
        .lean();

      reels = rawReels
        .map((r) => ({
          ...r,
          user: r.userId,
          score: calculateScore(r, parsed),
        }))
        .sort((a, b) => sortItems(a, b, sort))
        .slice(0, LIMIT);
    }

    /* ===================== PROFILES ===================== */

    let accounts: any[] = [];

    if (type === "profiles" || type === "all") {
      const rawProfiles = await StudentProfile.find({
        $or: [
          { skills: { $in: combinedSkills } },
          { bio: { $regex: queryText, $options: "i" } },
        ],
      })
        .populate("userId", "name image role professionalTitle")
        .lean();

      // 🔥 filter by username (since it's in populated userId)
      accounts = rawProfiles
        .filter((p) => {
          const name = p.userId?.name?.toLowerCase() || "";
          return (
            name.includes(parsed.raw) ||
            combinedSkills.some((s) => p.skills?.includes(s))
          );
        })
        .map((p) => ({
          ...p,
          score: calculateScore(p, parsed),
        }))
        .sort((a, b) => sortItems(a, b, sort))
        .slice(0, LIMIT);
    }

    /* ===================== PROJECTS ===================== */

    let projects: any[] = [];

    if (type === "projects" || type === "all") {
      const rawProjects = await Project.find({
        $or: [
          { title: { $regex: queryText, $options: "i" } },
          { description: { $regex: queryText, $options: "i" } },
          { techStack: { $in: combinedSkills } },
          { category: { $regex: queryText, $options: "i" } },
        ],
      }).lean();

      projects = rawProjects
        .map((p) => ({
          ...p,
          score: calculateScore(p, parsed),
        }))
        .sort((a, b) => sortItems(a, b, sort))
        .slice(0, LIMIT);
    }

    /* ===================== RESPONSE ===================== */

    return NextResponse.json({
      reels,
      accounts,
      projects,
      nextCursor: null, // can be added per-section later
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
