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
import { Reel } from "@/app/models/ReelModel";
import { Project } from "@/app/models/ProjectModel";

export async function POST(req) {
  // /profile/romil-clx91k2j3
  let { email, param } = await req.json();
  await dbConnect();
  try {
    if (!email) {
      if (!param) {
        return NextResponse.json(
          { error: "Email is required" },
          { status: 400 },
        );
      } else {
        const user = await User.findById(param);
        if (!user)
          return NextResponse.json(
            { error: "User not found" },
            { status: 404 },
          );
        email = user.email;
      }
    }
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let studentProfile = null;
    let employerProfile = null;

    // 🎯 Role-based fetch
    if (user.role === "student") {
      studentProfile = await StudentProfile.findOne({
        userId: user._id,
      })
        .populate("collegeId", "name domain location") // 👈 populate college
        .lean();

      const projects = await Project.find({ studentId: studentProfile._id });

      const reels = await Reel.find({ userId: user._id });

      studentProfile = {
        ...studentProfile,
        college: studentProfile?.collegeId || null,
        collegeId: studentProfile?.collegeId?._id || null,
        reels,
        projects,
      };
    }

    if (user.role === "employer") {
      employerProfile = await EmployerProfile.findOne({
        userId: user._id,
      })
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
