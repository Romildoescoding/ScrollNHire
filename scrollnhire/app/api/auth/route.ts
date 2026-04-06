import dbConnect from "@/app/_lib/dbConnect";
import EmployerProfile from "@/app/models/EmployerProfileModel";
import StudentProfile from "@/app/models/StudentProfileModel";
// import { verifySession } from "@/app/_lib/session";
import { User } from "@/app/models/UserModel";
// import { cookies } from "next/headers";
import { NextResponse } from "next/server";

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
      studentProfile = await StudentProfile.findOne({
        userId: user._id,
      }).lean();
    }

    if (user.role === "employer") {
      employerProfile = await EmployerProfile.findOne({
        userId: user._id,
      }).lean();
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
