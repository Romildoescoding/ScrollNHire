import dbConnect from "@/app/_lib/dbConnect";
import HiringProcess from "@/app/models/HiringProcessModel";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import mongoose from "mongoose";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const session = await auth();
    const employerId = session?.user?.id;

    if (!employerId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status"); // "shortlisted", "chatting", etc.

    const skip = (page - 1) * limit;

    const matchStage: any = {
      employerId: new mongoose.Types.ObjectId(employerId),
    };

    // only add status filter if it's NOT "all"
    if (status && status !== "all") {
      matchStage.status = status;
    }

    const pipeline: any[] = [
      {
        $match: matchStage,
      },

      /* 👤 JOIN USER */
      {
        $lookup: {
          from: "users",
          localField: "studentId",
          foreignField: "_id",
          as: "student",
        },
      },
      { $unwind: "$student" },

      /* 🎓 JOIN STUDENT PROFILE */
      {
        $lookup: {
          from: "studentprofiles",
          localField: "student._id",
          foreignField: "userId",
          as: "profile",
        },
      },
      {
        $unwind: {
          path: "$profile",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $lookup: {
          from: "projects",
          localField: "profile._id", // 🔥 important
          foreignField: "studentId",
          as: "projects",
        },
      },

      /* 🎬 JOIN REELS */
      {
        $lookup: {
          from: "reels",
          localField: "reels",
          foreignField: "_id",
          as: "reelsData",
        },
      },

      /* 🔍 SEARCH (on name) */
      ...(search
        ? [
            {
              $match: {
                "student.name": {
                  $regex: search,
                  $options: "i",
                },
              },
            },
          ]
        : []),

      /* 🧠 PROJECT FINAL SHAPE */
      {
        $project: {
          _id: 0,

          id: "$student._id",
          hiringProcessId: "$_id",
          name: "$student.name",
          email: "$student.email",
          image: "$student.image",
          gender: "$student.gender",

          /* 🎓 PROFILE DATA */
          collegeId: "$profile.collegeId",
          rollno: "$profile.rollno",
          degree: "$profile.degree",
          branch: "$profile.branch",
          yearOfPassing: "$profile.yearOfPassing",
          cgpa: "$profile.cgpa",
          resumeUrl: "$profile.resumeUrl",
          skills: "$profile.skills",
          github: "$profile.github",
          linkedin: "$profile.linkedin",
          bio: "$profile.bio",
          verified: "$profile.verified",

          /* 🎬 REELS */
          reels: {
            $map: {
              input: "$reelsData",
              as: "r",
              in: {
                _id: "$$r._id",
                videoUrl: "$$r.videoUrl",
                thumbnailUrl: "$$r.thumbnailUrl",
                caption: "$$r.caption",
              },
            },
          },

          projects: {
            $map: {
              input: "$projects",
              as: "p",
              in: {
                _id: "$$p._id",
                title: "$$p.title",
                description: "$$p.description",
                techStack: "$$p.techStack",
                githubUrl: "$$p.githubUrl",
                liveUrl: "$$p.liveUrl",
                category: "$$p.category",
                difficultyLevel: "$$p.difficultyLevel",
                thumbnail: "$$p.thumbnail",
                likesCount: "$$p.likesCount",
                viewsCount: "$$p.viewsCount",
                isVerified: "$$p.isVerified",
              },
            },
          },

          /* 📊 HIRING META */
          status: 1,
          role: 1,
          interviewDate: 1,
          createdAt: 1,
        },
      },

      /* 📄 PAGINATION */
      { $skip: skip },
      { $limit: limit },
    ];

    const students = await HiringProcess.aggregate(pipeline);

    const countQuery: any = {
      employerId,
    };

    if (status && status !== "all") {
      countQuery.status = status;
    }

    /* 📊 COUNT (separate lightweight query) */
    const total = await HiringProcess.countDocuments(countQuery);

    return NextResponse.json({
      success: true,
      students,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error: any) {
    console.error("AGGREGATION_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch shortlisted students",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 },
    );
  }
}
