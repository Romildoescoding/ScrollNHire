import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/app/_lib/dbConnect";
import { User } from "@/app/models/UserModel";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        {
          error: "User already exists",
          provider: existingUser.provider,
        },
        { status: 409 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      provider: "custom",
      providerId: email,
      password: hashedPassword,
      image: "https://placehold.co/96",
    });

    return NextResponse.json({ message: "Signup successful" }, { status: 201 });
  } catch (error: any) {
    console.error("Signup error:", error);
    return NextResponse.json(
      {
        error: "Signup failed",
        details: error.message,
      },
      { status: 500 },
    );
  }
}
