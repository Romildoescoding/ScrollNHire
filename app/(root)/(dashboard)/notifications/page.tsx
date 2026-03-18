"use client";

import { formatNotificationTime } from "@/app/_lib/actions";
import { Bookmark, Calendar, Heart, MessageCircle } from "lucide-react";
import React, { useState } from "react";

type NotificationType = {
  recipientId: string;
  senderId: string;
  reelId?: string;
  type: "shortlist" | "like" | "comment" | "interview";
  message: string;
  isRead: boolean;
  createdAt: Date;
};

const NotificationsPage = () => {
  const [category, setCategory] = useState<
    "all" | "interview" | "shortlist" | "comment"
  >("all");

  const [notifications, setNotifications] = useState<NotificationType[]>([
    {
      recipientId: "1",
      senderId: "2",
      type: "like",
      message: 'liked your reel "Frontend Animation Demo"',
      isRead: false,
      createdAt: new Date("2026-03-18T12:00:00Z"),
    },
    {
      recipientId: "1",
      senderId: "3",
      type: "comment",
      message: 'commented: "Bro this UI is clean 🔥"',
      isRead: false,
      createdAt: new Date("2026-03-18T10:30:00Z"),
    },
    {
      recipientId: "1",
      senderId: "4",
      type: "shortlist",
      message: "shortlisted you for Frontend Developer role",
      isRead: false,
      createdAt: new Date("2026-03-17T18:45:00Z"),
    },
    {
      recipientId: "1",
      senderId: "5",
      type: "interview",
      message: "invited you to an interview at 7:00 PM",
      isRead: false,
      createdAt: new Date("2026-03-17T14:15:00Z"),
    },
    {
      recipientId: "1",
      senderId: "6",
      type: "like",
      message: 'liked your reel "Node.js API Project"',
      isRead: true,
      createdAt: new Date("2026-03-16T20:10:00Z"),
    },
    {
      recipientId: "1",
      senderId: "7",
      type: "comment",
      message: 'commented: "Can you share repo?"',
      isRead: true,
      createdAt: new Date("2026-03-16T16:05:00Z"),
    },
    {
      recipientId: "1",
      senderId: "8",
      type: "shortlist",
      message: "shortlisted you for Full Stack Intern role",
      isRead: false,
      createdAt: new Date("2026-03-15T11:20:00Z"),
    },
    {
      recipientId: "1",
      senderId: "9",
      type: "interview",
      message: "scheduled your interview for tomorrow",
      isRead: false,
      createdAt: new Date("2026-02-15T09:00:00Z"),
    },
  ]);

  const filteredNotifications =
    category === "all"
      ? notifications
      : notifications.filter((n) => n.type === category);

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-4xl italic font-playfair">Notifications</h1>
      </div>

      {/* <main className="w-full flex justify-center"> */}
      <div className="flex flex-col gap-4">
        {/* NAV */}
        <nav className="flex gap-4 overflow-x-auto no-scrollbar">
          {["all", "interview", "shortlist", "comment"].map((cat) => (
            <button
              key={cat}
              className={`${
                category === cat
                  ? "bg-foreground text-background"
                  : "bg-primary/10 text-foreground"
              } transition-all px-4 py-1.5 rounded-full capitalize text-sm font-bold whitespace-nowrap`}
              onClick={() => setCategory(cat as any)}
            >
              {cat}
            </button>
          ))}
        </nav>

        {/* NOTIFICATIONS */}
        <main className="flex-1">
          {filteredNotifications.map((notification, i) => (
            <Notif notification={notification} key={i} />
          ))}
        </main>
      </div>
      {/* </main> */}
    </div>
  );
};

function Notif({ notification }: { notification: NotificationType }) {
  const getIcon = () => {
    switch (notification.type) {
      case "like":
        return <Heart size={14} fill="white" />;
      case "comment":
        return <MessageCircle size={14} fill="white" />;
      case "shortlist":
        return <Bookmark size={14} fill="white" />;
      case "interview":
        return <Calendar size={14} />;
    }
  };

  const getBgColor = () => {
    switch (notification.type) {
      case "like":
        return "bg-red-500";
      case "comment":
        return "bg-blue-500";
      case "shortlist":
        return "bg-purple-500";
      case "interview":
        return "bg-green-500";
    }
  };

  const getTagClass = () => {
    switch (notification.type) {
      case "like":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      case "comment":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      case "shortlist":
        return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";
      case "interview":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
    }
  };

  return (
    <div className="flex items-center rounded-md gap-4 p-4 border-b border-primary/5 hover:bg-primary/5 transition-colors">
      {/* PROFILE */}
      <div className="relative shrink-0">
        <div
          className="w-12 h-12 rounded-full bg-slate-200 bg-cover bg-center"
          style={{
            backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuBAAEnJuIN6yp1Bm4YE4ZllHR263X76SUzYQORfH8nDzIS8qr3I5E_-xQIXdQTlTPQGwaNbAi-Qg8881LcA-3XXrw5wTmmRlIgkASyDZ4TRdi2XsgCxrpehGVkxVGLIV-bAWr7ruyoCEk071NMUZIHwVdUuHVj46L9eno9dTPFF06RYVHAMmhcncxWHVn3GA_d-mtVD8LOhqxMUrfQdHR8Ckc6H5GC2HoOkoGK0g-MBwaMuFn5glE5L6yTntcZhsyX2ViodEDtjY7JU")`,
          }}
        />

        {/* ICON */}
        <div
          className={`${getBgColor()} absolute -bottom-1 -right-1  text-white rounded-full p-1 border-2 border-background-light dark:border-background-dark`}
        >
          {getIcon()}
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium leading-tight mb-1">
          <span className="font-bold text-slate-900 dark:text-slate-100">
            John
          </span>{" "}
          {notification.message}
        </p>

        <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
          {formatNotificationTime(notification.createdAt)}
        </p>
      </div>

      <div
        className={`flex text-center w-20 justify-center items-center px-2 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getTagClass()}`}
      >
        {notification.type}
      </div>
    </div>
  );
}

export default NotificationsPage;
