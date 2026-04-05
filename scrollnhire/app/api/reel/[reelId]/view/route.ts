import dbConnect from "@/app/_lib/dbConnect";
import { Reel } from "@/app/models/ReelModel";
import { View } from "@/app/models/ViewModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ reelId: string }> },
) {
  await dbConnect();

  const { userId } = await req.json();
  const { reelId } = await context.params;

  try {
    const existing = await View.findOne({ reelId, userId });

    if (!existing) {
      await View.create({ reelId, userId });

      await Reel.findByIdAndUpdate(reelId, {});
    }
  } catch (err) {
    console.error("VIEW_ERROR:", err);
  }
  return NextResponse.json({ success: true });
}
