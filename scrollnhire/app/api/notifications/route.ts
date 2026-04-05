import dbConnect from "@/app/_lib/dbConnect";
import { Notification } from "@/app/models/NotificationModel";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    // 📦 Query params
    const { searchParams } = new URL(req.url);

    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limitRaw = parseInt(searchParams.get("limit") || "10");

    // 🔥 Protect your DB
    const limit = Math.min(limitRaw, 20);

    const skip = (page - 1) * limit;

    // 🚀 Fetch notifications with sender + reel
    const notifications = await Notification.find({
      recipientId: userId,
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate({
        path: "senderId",
        select: "name image",
      })
      .populate({
        path: "reelId",
        select: "caption thumbnailUrl",
      })
      .lean();

    // 📊 Total count
    const total = await Notification.countDocuments({
      recipientId: userId,
    });

    // 🔴 Unread count (VERY useful)
    const unreadCount = await Notification.countDocuments({
      recipientId: userId,
      isRead: false,
    });

    return NextResponse.json(
      {
        success: true,
        data: notifications,
        pagination: {
          page,
          limit,
          total,
          hasMore: skip + notifications.length < total,
        },
        unreadCount,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("GET_NOTIFICATIONS_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch notifications",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 },
    );
  }
}
