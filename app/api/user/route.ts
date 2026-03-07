import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/_lib/dbConnect";
import { User } from "@/app/models/UserModel";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();
    const { name, email, image, provider, password } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    let user = await User.findOne({ email });

    // ---------------------- GOOGLE LOGIN ----------------------
    if (provider === "google") {
      if (!user) {
        user = await User.create({
          name,
          email,
          image: image,
          provider: "google",
          providerId: email,
        });
      }

      return NextResponse.json(
        { message: "Google login successful", user },
        { status: 200 },
      );
    }

    // ---------------------- CUSTOM LOGIN ----------------------
    else {
      // if (provider === "custom") {
      if (!password) {
        return NextResponse.json(
          { error: "Password required for custom login" },
          { status: 400 },
        );
      }

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      // Compare password hash
      const isMatch = bcrypt.compare(password, user?.password || "");

      if (!isMatch) {
        return NextResponse.json(
          { error: "Invalid credentials" },
          { status: 401 },
        );
      }

      return NextResponse.json(
        { message: "Login successful", user },
        { status: 200 },
      );
    }

    // return NextResponse.json({ error: "Invalid provider" }, { status: 400 });
  } catch (error: any) {
    console.error("Error during login:", error);
    return NextResponse.json(
      { error: "Login failed", details: error.message },
      { status: 500 },
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();
    const { email, ...rest } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email is required to update user" },
        { status: 400 },
      );
    }

    // 🧹 Remove null / undefined fields
    const filteredUpdates = Object.fromEntries(
      Object.entries(rest).filter(
        ([_, value]) => value !== null && value !== undefined,
      ),
    );

    // 🔒 Prevent updating restricted fields
    const restrictedFields = [
      "password",
      "providerId",
      "provider",
      "email",
      "createdAt",
    ];

    for (const field of restrictedFields) {
      delete filteredUpdates[field];
    }

    // ⚠️ Optional: enforce schema-based logic
    if (!filteredUpdates.role || filteredUpdates.role === "employer") {
      delete filteredUpdates.collegeId;
    }

    const updatedUser = await User.findOneAndUpdate(
      { email },
      { $set: filteredUpdates },
      { new: true, runValidators: true },
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "User updated successfully", user: updatedUser },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Error updating user:", error);

    return NextResponse.json(
      { error: "Update failed", details: error.message },
      { status: 500 },
    );
  }
}
