"use client";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { CircleAlert, Loader2, MoveRight } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
// import useUserChats from "../(root)/chat/useUserChats";
import Link from "next/link";

const DashboardChats = () => {
  //   const { chats, isLoading } = useUserChats();
  const [isLoading, setIsLoading] = useState(false);
  const [chats, setChats] = useState([
    {
      chatId: "abc",
      title: "Random chat",
    },
  ]);
  const router = useRouter();

  //   useEffect(()=>{},[])

  //   console.log(chats);

  //   useEffect(() => {
  //     console.log(chats);
  //     console.log(isLoading);
  //   }, [isLoading, chats]);
  return (
    <div className="rounded-lg max-h-fit border-[1px] flex flex-col gap-2 p-6 w-full">
      <CardTitle>Recent Chats</CardTitle>
      <CardDescription>Select any chat to begin with.</CardDescription>
      {isLoading ? (
        <div className="h-[140px] w-full flex items-center justify-center">
          <Loader2 height={24} width={24} />
        </div>
      ) : chats.length > 0 ? (
        <>
          {chats
            ?.reverse()
            .slice(0, 3)
            .map((chat, i) => (
              <div
                key={i}
                className="fade-parent w-full flex justify-between cursor-pointer p-2 hover:bg-zinc-100  transition border-[1px] rounded-lg text-sm font-semibold capitalize"
                onClick={() => {
                  localStorage.setItem("recentChatId", chat.chatId);
                  router.push("/chat");
                }}
              >
                {chat.title}
                <span className="fade-icon">
                  <MoveRight />
                </span>
              </div>
            ))}
        </>
      ) : (
        <div className="w-full flex flex-col gap-2 text-center">
          <span className="font-semibold items-center gap-2 mt-[12px] flex flex-col">
            <CircleAlert />
            No chats found!
          </span>
          <span className=" text-sm text-zinc-600">
            You have not initiated any chats.
          </span>
          <Link
            href="/notes/upload"
            className="w-full flex items-center justify-center p-2 font-semibold text-sm bg-zinc-950 hover:bg-zinc-800 text-zinc-50 rounded-lg transition-all"
          >
            Chat with AI
          </Link>
        </div>
      )}

      {/* <div
        className="fade-parent w-full flex justify-between cursor-pointer p-2 hover:bg-zinc-100  transition border-[1px] rounded-lg text-sm font-semibold capitalize"
        onClick={() => {
          localStorage.setItem("recentChatId", "234");
        }}
      >
        Artificial Intelligence Code help
        <span className="fade-icon">
          <MoveRight />
        </span>
      </div>
      <div
        className="fade-parent w-full flex justify-between cursor-pointer p-2 hover:bg-zinc-100  transition border-[1px] rounded-lg text-sm font-semibold capitalize"
        onClick={() => {
          localStorage.setItem("recentChatId", "234");
        }}
      >
        Resume Content Restructuring
        <span className="fade-icon">
          <MoveRight />
        </span>
      </div> */}

      {/* {localStorage.setItem("recentChatId","234")} */}
    </div>
  );
};

export default DashboardChats;
