"use client";

import useConversations from "@/app/hooks/useConversations";
import HiringPipeline from "@/components/hiring-pipeline";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import InterviewCalendar from "@/components/ui/interview-calender";
import {
  ArrowUpRight,
  CalendarDays,
  Check,
  CheckCheck,
  Loader2,
  MessageCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { formatMessageTime } from "../chat/page";
import { useSession } from "next-auth/react";
import useEmployerDashboard from "@/app/hooks/useEmployerDashboard";
import { format } from "date-fns";
import { useSidebar } from "@/app/context/SidebarContext";
import { cn } from "@/lib/utils";

const EmployerDashboard = () => {
  const router = useRouter();

  // const interviewsScheduled = [
  //   {
  //     id: "1",
  //     name: "Aarav Sharma",
  //     role: "Frontend Developer",
  //     time: "10:00 AM",
  //     date: new Date(2026, 3, 18), // April 18, 2026
  //   },
  //   {
  //     id: "2",
  //     name: "Priya Verma",
  //     role: "Backend Developer",
  //     time: "12:30 PM",
  //     date: new Date(2026, 3, 18),
  //   },
  //   {
  //     id: "21",
  //     name: "Priya Verma",
  //     role: "Backend Developer",
  //     time: "12:30 PM",
  //     date: new Date(2026, 3, 18),
  //   },
  //   {
  //     id: "22",
  //     name: "Priya Verma",
  //     role: "Backend Developer",
  //     time: "12:30 PM",
  //     date: new Date(2026, 3, 18),
  //   },
  //   {
  //     id: "23",
  //     name: "Priya Verma",
  //     role: "Backend Developer",
  //     time: "12:30 PM",
  //     date: new Date(2026, 3, 18),
  //   },
  //   {
  //     id: "24",
  //     name: "Priya Verma",
  //     role: "Backend Developer",
  //     time: "12:30 PM",
  //     date: new Date(2026, 3, 18),
  //   },
  //   {
  //     id: "3",
  //     name: "Rohan Mehta",
  //     role: "Full Stack Developer",
  //     time: "03:00 PM",
  //     date: new Date(2026, 3, 19),
  //   },
  //   {
  //     id: "4",
  //     name: "Sneha Kapoor",
  //     role: "UI/UX Designer",
  //     time: "11:15 AM",
  //     date: new Date(2026, 3, 20),
  //   },
  //   {
  //     id: "5",
  //     name: "Karan Patel",
  //     role: "React Developer",
  //     time: "02:00 PM",
  //     date: new Date(2026, 3, 20),
  //   },
  //   {
  //     id: "6",
  //     name: "Ananya Singh",
  //     role: "DevOps Engineer",
  //     time: "04:30 PM",
  //     date: new Date(2026, 3, 22),
  //   },
  //   {
  //     id: "7",
  //     name: "Vikram Joshi",
  //     role: "Node.js Developer",
  //     time: "09:45 AM",
  //     date: new Date(2026, 3, 22),
  //   },
  // ];

  const { data, isLoading } = useEmployerDashboard();

  const { conversations, loading: convoLoading } = useConversations();
  const { data: session, status } = useSession();
  const { isSidebarOpen } = useSidebar();

  return (
    <main className="flex flex-col px-4 pb-6 gap-4 max-w-7xl mx-auto">
      {/* Header */}
      <section className="">
        {status === "loading" ? (
          <div className="shimmer2 h-[45px] w-[350px] rounded-lg"></div>
        ) : (
          session?.user?.name && (
            <h1 className="font-playfair text-slate-900 dark:text-slate-100 text-4xl italic leading-tight">
              Welcome back, {session?.user.name}
            </h1>
          )
        )}
      </section>

      <div
        className={cn(
          "w-full h-[780px] min-h-[374px] max-h-[780px] flex flex-col gap-4",
          isSidebarOpen
            ? "max-[546px]:h-fit max-[546px]:max-h-[1200px] min-[1077px]:flex-row min-[1077px]:h-[375px] min-[1077px]:max-h-[375px]"
            : "max-[546px]:h-fit max-[546px]:max-h-[1200px] min-[901px]:flex-row min-[901px]:h-[375px] min-[901px]:max-h-[375px]",
        )}
      >
        <div
          className={`flex w-full h-full gap-4 flex-col min-[546px]:flex-row`}
        >
          <div className="w-full min-[546px]:w-fit h-full flex flex-col gap-4">
            <Card className="bg-zinc-900 min-w-fit w-full min-[546px]:w-auto border-none p-4 dark:bg-zinc-200 text-background flex flex-col gap-2 rounded-lg shadow-sm">
              <div className="flex gap-2 justify-between items-center">
                <p className="font-semibold">Interviews Today</p>{" "}
                <Button
                  className="h-10 w-10 rounded-full bg-background hover:bg-background text-xl text-foreground hover:text-foreground pointer-events-none"
                  style={{ padding: 0 }}
                >
                  <CalendarDays />
                </Button>
              </div>
              <h1 className="text-4xl font-medium">
                {isLoading ? (
                  <div className="shimmer3 rounded-md w-20 h-10"></div>
                ) : (
                  data.interviewsTodayCount
                )}
              </h1>
              {isLoading ? (
                <div className="shimmer3 rounded-md w-full h-5"></div>
              ) : data.nextInterview ? (
                <p className="text-zinc-400 dark:text-zinc-600 text-sm min-w-fit whitespace-nowrap">
                  Next at {format(data.nextInterview.interviewDate, "p")} on{" "}
                  {format(data.nextInterview.interviewDate, "PPP")}
                </p>
              ) : (
                <p className="text-zinc-400 dark:text-zinc-600 text-sm min-w-fit whitespace-nowrap">
                  No interviews scheduled today
                </p>
              )}
            </Card>
            <Card className="bg-white dark:bg-zinc-950 min-w-fit w-full min-[546px]:w-auto border p-4 flex flex-col gap-3 rounded-lg shadow-sm">
              <div className="flex gap-2 justify-between items-center">
                <p className="font-semibold text-lg">Quick Actions</p>{" "}
                <Button
                  className="h-10 w-10 rounded-full text-xl pointer-events-none"
                  variant="outline"
                  style={{ padding: 0 }}
                >
                  <ArrowUpRight />
                </Button>
              </div>

              <div className="h-full flex flex-col gap-2">
                <Button
                  className="rounded-full"
                  variant="default"
                  onClick={() => router.push("/explore")}
                >
                  Discover Candidates
                </Button>
                <Button
                  className="rounded-full"
                  variant="default"
                  onClick={() => router.push("/explore")}
                >
                  Schedule Interview
                </Button>
                <Button
                  className="rounded-full"
                  variant="default"
                  onClick={() => router.push("/reels")}
                >
                  Scroll Reels
                </Button>
              </div>
            </Card>
          </div>

          <div className="w-full h-full rounded-lg border shadow-sm bg-white dark:bg-zinc-950 p-4">
            <p className="font-semibold text-lg mb-2">Continue Chats</p>
            {/* {conversations.map()} */}

            <div className="flex-1 flex flex-col gap-2 max-h-36 h-full overflow-y-auto">
              {convoLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="shimmer2 rounded-md w-full h-[57px]"
                  ></div>
                ))
              ) : conversations.length === 0 ? (
                <div className="w-full h-full items-center justify-center flex flex-col gap-2">
                  <div className=" h-10 aspect-square rounded-full flex items-center justify-center border-foreground border-2">
                    <MessageCircle size={24} strokeWidth={1.5} />
                  </div>
                  <span className="text-muted-foreground">
                    No conversations yet
                  </span>
                  <Button
                    className="rounded-full max-w-[160px]"
                    variant="default"
                    onClick={() => router.push("/chat")}
                  >
                    Start Chatting
                  </Button>
                </div>
              ) : (
                conversations.map((chat, i) => (
                  <div
                    key={i}
                    // onClick={() => {
                    //   setSelectedConversation(chat);
                    // }}
                    className="border-b p-2 rounded-lg flex items-center gap-3 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all cursor-pointer"
                  >
                    {/* Avatar */}
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={chat.sender?.image ?? undefined}
                        alt="Avatar"
                      />
                      <AvatarFallback>
                        {chat.sender?.name[0] || "U"}
                      </AvatarFallback>
                    </Avatar>
                    {/* <div className="w-10 h-10 rounded-full bg-zinc-400 flex items-center justify-center text-white">
                  {chat.sender?.image || chat.sender?.name[0] || "U"}
                </div> */}

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium truncate">
                          {chat.sender?.name}
                        </span>
                        <span className="text-xs text-zinc-500">
                          {chat.lastMessage?.createdAt &&
                            formatMessageTime(chat.lastMessage.createdAt)}
                        </span>
                      </div>
                      <div className="flex items-center">
                        {chat.lastMessage?.senderId === session?.user?.id &&
                          typeof chat.lastMessage?.isRead === "boolean" && (
                            <span className="mr-1 flex">
                              {chat.lastMessage?.isRead ? (
                                <CheckCheck
                                  className="text-cyan-500"
                                  size={16}
                                />
                              ) : (
                                <Check
                                  className="text-foreground/40"
                                  size={16}
                                />
                              )}
                            </span>
                          )}
                        <p className=" mr-2 flex-1 text-sm text-zinc-500 truncate max-w-[125px]">
                          {chat.lastMessage?.message ||
                            "Click to start conversation."}
                        </p>
                        {/* Unread */}
                        {chat.unreadMessagesCount > 0 && (
                          <div className="min-w-5 h-5 text-xs flex items-center justify-center bg-cyan-500 text-white rounded-full">
                            {chat.unreadMessagesCount}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* CALENDER DIV */}

        <InterviewCalendar
          interviewsScheduled={data.interviewsScheduled}
          isLoading={isLoading}
        />
      </div>

      <HiringPipeline />
    </main>
  );
};

export default EmployerDashboard;
