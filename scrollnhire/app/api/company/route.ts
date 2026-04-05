import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/_lib/dbConnect";
import Company from "@/app/models/CompanyModel";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const search = req.nextUrl.searchParams.get("search");

    if (!search || search.length < 3) {
      return NextResponse.json([]);
    }

    const company = await Company.find({
      name: { $regex: search, $options: "i" }, // 🔥 contains match
    })
      .limit(10)
      .select("_id name domain employerIds");

    return NextResponse.json(company);
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to fetch companies", details: err.message },
      { status: 500 },
    );
  }
}
