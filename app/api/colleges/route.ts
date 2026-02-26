import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/_lib/dbConnect";
import College from "@/app/models/CollegeModel";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const search = req.nextUrl.searchParams.get("search");

    if (!search || search.length < 3) {
      return NextResponse.json([]);
    }

    const colleges = await College.find({
      name: { $regex: search, $options: "i" }, // 🔥 contains match
    })
      .limit(10)
      .select("_id name domain location");

    return NextResponse.json(colleges);
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to fetch colleges", details: err.message },
      { status: 500 },
    );
  }
}
