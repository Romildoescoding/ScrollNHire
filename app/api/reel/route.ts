import dbConnect from "@/app/_lib/dbConnect";
import { Reel } from "@/app/models/ReelModel";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { studentId, videoUrl, caption, tags, duration } = await req.json();

    if (!studentId || !videoUrl) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const reel = await Reel.create({
      studentId,
      videoUrl,
      caption: caption || "",
      tags: tags || [],
      duration,
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
