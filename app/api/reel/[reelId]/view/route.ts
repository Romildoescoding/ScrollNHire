import dbConnect from "@/app/_lib/dbConnect";
import { Reel } from "@/app/models/ReelModel";
import { View } from "@/app/models/ViewModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { reelId: string } },
) {
  await dbConnect();

  const { userId } = await req.json();
  const { reelId } = params;

  await View.create({
    reelId,
    userId,
  });

  await Reel.findByIdAndUpdate(reelId, {
    $inc: { viewsCount: 1 },
  });

  return NextResponse.json({ success: true });
}
