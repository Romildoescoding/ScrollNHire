"use client";

import { BarChartCard } from "@/components/bar-chart-card";
import { ChartCard } from "@/components/chart-card";
import DashboardChats from "@/components/dashboard-chats";
import DashboardNotes from "@/components/dashboard-notes";
// import useFetchEmails from "@/app/hooks/useFetchEmails";
import { DataTable } from "@/components/email-table";

// import { BarChartCard } from "@/app/components/BarChartCard";
// import { ChartCard } from "@/app/components/ChartCard";
// import DashboardChats from "@/app/components/DashboardChats";
// import DashboardNotes from "@/app/components/DashboardNotes";
// import { useSidebar } from "@/app/context/SidebarContext";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useState } from "react";

const DashboardComponent = () => {
  const { data: session } = useSession();
  const [notes, setNotes] = useState([{ title: "Note 1" }]);
  // const { collapsed, setIsCollapsed } = useSidebar();
  // const { notes, isFetching } = useFetchNotes();
  return (
    <div className=" text-zinc-900 grid transition-all duration-300 max-[640px]:grid-cols-1 max-[810px]:grid-cols-2 grid-cols-3 gap-4 h-fit p-6 pt-4 pb-4 w-full overflow-x-hidden ">
      <div className="w-full min-[810px]:justify-around h-full min-[1160px]:justify-start flex items-center flex-col gap-4">
        <div className="rounded-lg order-1 max-h-fit border-[1px] flex flex-col gap-2 p-6 w-full ">
          <span className="text-2xl font-semibold">
            Welcome Back,{" "}
            <span className="font-bold">{session?.user?.name || "User"}</span>
          </span>
          <span className="text-zinc-500 text-sm">
            Get started by navigating from the sidebar or select an option on
            the dashboard.
          </span>
        </div>

        <DashboardNotes />

        {/* <div className="rounded-lg max-h-fit border-[1px] flex flex-col gap-1 p-6 w-full max-w-sm"> */}
        <div className="rounded-lg max-h-fit order-2 min-[810px]:order-3 border-[1px] flex flex-col gap-1 p-6 w-full">
          <CardTitle className="text-xl">Total Notes</CardTitle>
          <CardDescription>
            The number of notes you have exported till date.
          </CardDescription>
          <h1 className="w-full flex text-3xl font-bold">
            {Number(notes?.length).toLocaleString()} notes
          </h1>
        </div>
      </div>

      <div className="w-full min-[810px]:justify-around h-full min-[1160px]:justify-start flex items-center flex-col gap-4">
        <div className="min-w-md w-full h-fit flex flex-col gap-4">
          <ChartCard />
        </div>

        <DashboardChats />
      </div>

      <div className="w-full h-fit flex sm:col-span-1 min-[810px]:flex-row min-[810px]:col-span-2 min-[1160px]:flex-col min-[1160px]:col-span-1 flex-col gap-4">
        <div className="rounded-lg max-h-fit border-[1px] flex flex-col gap-2 p-6 w-full">
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Access the main features via these buttons.
          </CardDescription>
          <Link
            href="/notes/uploads"
            className="w-full flex items-center justify-center p-2 font-semibold text-sm bg-zinc-900 hover:bg-zinc-800 text-zinc-50 rounded-lg transition-all"
          >
            Upload Notes
          </Link>
          <Link
            href="/notes/editor"
            className="w-full flex items-center justify-center p-2 font-semibold text-sm bg-zinc-900 hover:bg-zinc-800 text-zinc-50 rounded-lg transition-all"
          >
            Access Editor
          </Link>
          <Link
            href="/chat"
            className="w-full flex items-center justify-center p-2 font-semibold text-sm bg-zinc-900 hover:bg-zinc-800 text-zinc-50 rounded-lg transition-all"
          >
            Chat with AI
          </Link>
        </div>

        <div className="min-w-md w-full h-fit flex flex-col gap-4">
          <BarChartCard />
        </div>

        {/* <div className="rounded-lg max-h-fit border-[1px] flex flex-col gap-2 p-6 w-full max-w-sm">
      <CardTitle>Quick Chat</CardTitle>
      <CardDescription>Ask the AI anything.</CardDescription>
      <input
        type="text"
        className="rounded-md border-[1px] text-sm placeholder:text-zinc-300 p-2"
        placeholder="Type Message.."
      />
    </div> */}
      </div>
    </div>
  );
};

export default DashboardComponent;
