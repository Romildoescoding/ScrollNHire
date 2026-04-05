import dbConnect from "@/app/_lib/dbConnect";
import { Notification } from "@/app/models/NotificationModel";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET() {
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

    const unreadCount = await Notification.countDocuments({
      recipientId: userId,
      isRead: false,
    });

    return NextResponse.json(
      {
        success: true,
        unreadCount,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("GET_UNREAD_COUNT_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch unread count",
      },
      { status: 500 },
    );
  }
}
