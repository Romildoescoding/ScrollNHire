import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/_lib/dbConnect";
import CSOProfile from "@/app/models/CSOProfileModel";

export async function PATCH(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();
    const { userId, ...rest } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 },
      );
    }

    // 🧹 Remove null / undefined
    const filteredUpdates = Object.fromEntries(
      Object.entries(rest).filter(
        ([_, value]) => value !== null && value !== undefined,
      ),
    );

    // 🔥 Core logic: create if not exists, update if exists
    const profile = await CSOProfile.findOneAndUpdate(
      { userId },
      {
        $set: filteredUpdates,
        $setOnInsert: { userId }, // only when creating
      },
      {
        new: true,
        upsert: true, // 🧠 magic line
        runValidators: true,
      },
    );

    return NextResponse.json(
      { message: "Profile saved successfully", profile },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Error updating profile:", error);

    return NextResponse.json(
      { error: "Update failed", details: error.message },
      { status: 500 },
    );
  }
}
