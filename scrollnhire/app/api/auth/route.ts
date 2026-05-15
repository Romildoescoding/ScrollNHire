import dbConnect from "@/app/_lib/dbConnect";
import EmployerProfile from "@/app/models/EmployerProfileModel";
import StudentProfile from "@/app/models/StudentProfileModel";
// import { verifySession } from "@/app/_lib/session";
import { User } from "@/app/models/UserModel";
import "@/app/models/CollegeModel";
import "@/app/models/CompanyModel";
// import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { createEmbedding } from "@/app/_lib/geminiEmbedding";

export async function POST(req) {
  const { email } = await req.json();
  await dbConnect();
  try {
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let studentProfile = null;
    let employerProfile = null;

    // 🎯 Role-based fetch
    if (user.role === "student") {
      studentProfile = await StudentProfile.findOne(
        {
          userId: user._id,
        },
        { embedding: 0 },
      )
        .populate("collegeId", "name domain location") // 👈 populate college
        .lean();

      studentProfile = {
        ...studentProfile,
        college: studentProfile?.collegeId || null,
        collegeId: studentProfile?.collegeId?._id || null,
      };
    }

    if (user.role === "employer") {
      employerProfile = await EmployerProfile.findOne(
        {
          userId: user._id,
        },
        { embedding: 0 },
      )
        .populate("companyId", "name domain") // 👈 populate company
        .lean();

      employerProfile = {
        ...employerProfile,
        company: employerProfile?.companyId || null,
        companyId: employerProfile?.companyId?._id || null,
      };
    }

    return NextResponse.json({
      user: {
        name: user.name,
        email: user.email,
        image: user.image,
        provider: user.provider,
        role: user.role,
        isOnboarded: user.isOnboarded,
        gender: user.gender,
        profession: user.profession,
        professionalTitle: user.professionalTitle,

        // Profile object
        studentProfile: studentProfile || null,
        employerProfile: employerProfile || null,
      },
    });
  } catch (error) {
    // Token is invalid or expired
    console.log("ERROR!!!!!!!!!!!!!", error);
    return NextResponse.json({ user: null }, { status: 401 });
  }
}

export async function PATCH(req: Request) {
  await dbConnect();

  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await req.json();

    // ================= USER UPDATE =================
    const allowedUserFields = [
      "name",
      "image",
      "gender",
      // "profession",
      // "professionalTitle",
    ];

    const userUpdates: any = {};

    for (const key of allowedUserFields) {
      if (body[key] !== undefined) {
        userUpdates[key] = body[key];
      }
    }

    if (Object.keys(userUpdates).length > 0) {
      await User.findByIdAndUpdate(user._id, userUpdates);
    }

    // ================= STUDENT PROFILE =================
    if (user.role === "student" && body.studentProfile) {
      const allowedStudentFields = [
        "degree",
        "branch",
        "cgpa",
        "skills",
        "github",
        "linkedin",
        "bio",
        "collegeId",
        "resumeUrl",
      ];

      const studentUpdates: any = {};

      for (const key of allowedStudentFields) {
        if (body.studentProfile[key] !== undefined) {
          studentUpdates[key] = body.studentProfile[key];
        }
      }

      // 🧠 fields that affect embedding
      const embeddingRelevantFields = [
        "bio",
        "skills",
        "degree",
        "branch",
        "cgpa",
      ];

      const shouldUpdateEmbedding =
        Object.keys(studentUpdates).some((key) =>
          embeddingRelevantFields.includes(key),
        ) ||
        // user name changed
        Object.keys(userUpdates).includes("name");

      //  update profile
      const profile = await StudentProfile.findOneAndUpdate(
        { userId: user._id },
        { $set: studentUpdates },
        { upsert: true, new: true },
      ).lean();

      //  generate embedding if needed
      if (shouldUpdateEmbedding || !profile?.embedding?.length) {
        const updatedName = userUpdates.name || user.name;
        const embeddingText = `
This is a student profile.

Name: ${updatedName || ""}
Bio: ${profile.bio || ""}
Skills: ${(profile.skills || []).join(", ")}
Degree: ${profile.degree || ""}
Branch: ${profile.branch || ""}
CGPA: ${profile.cgpa || ""}
    `.trim();

        const embedding = await createEmbedding(embeddingText, "document");

        await StudentProfile.findOneAndUpdate(
          { userId: user._id },
          { $set: { embedding } },
        );
      }
    }

    // ================= EMPLOYER PROFILE =================
    if (user.role === "employer" && body.employerProfile) {
      const allowedEmployerFields = [
        "designation",
        "linkedin",
        "bio",
        "companyId",
      ];

      const employerUpdates: any = {};

      for (const key of allowedEmployerFields) {
        if (body.employerProfile[key] !== undefined) {
          employerUpdates[key] = body.employerProfile[key];
        }
      }

      await EmployerProfile.findOneAndUpdate(
        { userId: user._id },
        { $set: employerUpdates },
        { upsert: true, new: true },
      );
    }

    // ================= FETCH UPDATED DATA =================

    let studentProfile = null;
    let employerProfile = null;

    if (user.role === "student") {
      studentProfile = await StudentProfile.findOne(
        {
          userId: user._id,
        },
        { embedding: 0 },
      )
        .populate("collegeId", "name domain location")
        .lean();

      studentProfile = {
        ...studentProfile,
        college: studentProfile?.collegeId || null,
        collegeId: studentProfile?.collegeId?._id || null,
      };
    }

    if (user.role === "employer") {
      employerProfile = await EmployerProfile.findOne(
        {
          userId: user._id,
        },
        { embedding: 0 },
      )
        .populate("companyId", "name domain")
        .lean();

      employerProfile = {
        ...employerProfile,
        company: employerProfile?.companyId || null,
        companyId: employerProfile?.companyId?._id || null,
      };
    }

    const updatedUser = await User.findById(user._id);

    return NextResponse.json({
      user: {
        name: updatedUser.name,
        email: updatedUser.email, // 🔒 locked
        image: updatedUser.image,
        provider: updatedUser.provider,
        role: updatedUser.role,
        isOnboarded: updatedUser.isOnboarded,
        gender: updatedUser.gender,
        profession: updatedUser.profession,
        professionalTitle: updatedUser.professionalTitle,

        studentProfile: studentProfile || null,
        employerProfile: employerProfile || null,
      },
    });
  } catch (error) {
    console.log("PATCH ERROR:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
