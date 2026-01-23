import { auth } from "@/auth";
import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const session = await auth();

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get query params for pagination
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const page = parseInt(searchParams.get("page") || "1", 10);

    const skip = (page - 1) * limit;

    // Find the logged-in user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Fetch actions for that user (via email threads relationship)
    const actions = await prisma.action.findMany({
      where: {
        thread: {
          userId: user.id,
        },
      },
      orderBy: { createdAt: "desc" }, // newest first
      skip,
      take: limit,
      include: {
        thread: true, // so you get subject/from/summary too
      },
    });

    // Get total count for pagination metadata
    const totalCount = await prisma.action.count({
      where: {
        thread: {
          userId: user.id,
        },
      },
    });

    return NextResponse.json({
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
      totalCount,
      actions,
    });
  } catch (error: any) {
    console.error("Error fetching actions:", error);
    return NextResponse.json(
      { error: "Failed to fetch actions", details: error.message },
      { status: 500 }
    );
  }
}
