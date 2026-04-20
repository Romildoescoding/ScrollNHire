"use client";

import useConversations from "@/app/hooks/useConversations";
import HiringPipeline from "@/components/hiring-pipeline";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import InterviewCalendar from "@/components/ui/interview-calender";
import {
  ArrowUpRight,
  CalendarDays,
  Check,
  CheckCheck,
  Loader2,
  User2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { formatMessageTime } from "../chat/page";
import { useSession } from "next-auth/react";

import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import { ChartAreaInteractive } from "@/components/reels-chart";
import useStudentDashboard from "@/app/hooks/useStudentDashboard";

// import { Skeleton } from "boneyard-js/react";

const StudentDashboard = () => {
  const router = useRouter();
  const { data, isLoading } = useStudentDashboard();

  const completionPercentage = data.profile?.completion;

  const chartData = [
    {
      browser: "safari",
      completion: completionPercentage,
      fill: "var(--color-safari)",
    },
  ];
  const chartConfig = {
    completion: {
      label: "Completion",
    },
    safari: {
      label: "Safari",
      color: "var(--foreground)",
      // color: "var(--chart-2)",
    },
  } satisfies ChartConfig;

  return (
    <main className="flex flex-col px-4 pb-6 gap-4 max-w-7xl mx-auto">
      {/* Header */}
      <section className="">
        {/* <Skeleton name="name" loading={isLoading}> */}
        {data.name && (
          <h1 className="font-playfair text-slate-900 dark:text-slate-100 text-4xl italic leading-tight">
            Welcome back, {data.name}
          </h1>
        )}
        {/* </Skeleton> */}
      </section>

      <div className="w-full h-[50vh] min-h-[374px] flex gap-4">
        <div className="flex w-full h-full gap-4">
          <div className="w-[225px] h-full flex flex-col gap-4">
            {/* <Card className="bg-zinc-900 min-w-fit border-none p-4 dark:bg-zinc-200 text-background flex flex-col gap-2 rounded-lg shadow-sm">
              <div className="flex gap-2 justify-between items-center">
                <p className="font-semibold">Interviews Today</p>{" "}
                <Button
                  className="h-10 w-10 rounded-full bg-background hover:bg-background text-xl text-foreground hover:text-foreground pointer-events-none"
                  style={{ padding: 0 }}
                >
                  <CalendarDays />
                </Button>
              </div>
              <h1 className="text-4xl font-medium">3</h1>
              <p className="text-zinc-400 dark:text-zinc-600 text-sm min-w-fit whitespace-nowrap">
                Next at 2:30 PM on April 19, 26
              </p>
            </Card> */}
            <Card className=" min-w-fit border p-4 flex flex-col gap-3 rounded-lg shadow-sm bg-white dark:bg-zinc-950">
              <div className="flex gap-2 justify-between items-center">
                <p className="font-semibold text-lg">My Profile</p>{" "}
                <Button
                  className="h-10 w-10 rounded-full text-xl pointer-events-none"
                  variant="outline"
                  style={{ padding: 0 }}
                >
                  <User2 />
                </Button>
              </div>
              {/* <Skeleton name="profile" loading={isLoading}> */}
              {data.profile && (
                <div className="flex-1 flex flex-col gap-2">
                  <CardContent className="p-0 min-w-[150px] w-full">
                    <ChartContainer
                      config={chartConfig}
                      className="mx-auto aspect-square max-h-[150px]"
                    >
                      <RadialBarChart
                        data={chartData}
                        startAngle={0}
                        // endAngle={270}
                        endAngle={(data.profile.completion * 360) / 100}
                        outerRadius={70}
                        innerRadius={55}
                      >
                        <PolarGrid
                          gridType="circle"
                          radialLines={false}
                          stroke="none"
                          className="first:fill-muted last:fill-background"
                          polarRadius={[70, 55]}
                        />
                        <RadialBar
                          dataKey="completion"
                          background
                          cornerRadius={10}
                        />
                        <PolarRadiusAxis
                          tick={false}
                          tickLine={false}
                          axisLine={false}
                        >
                          <Label
                            content={({ viewBox }) => {
                              if (
                                viewBox &&
                                "cx" in viewBox &&
                                "cy" in viewBox
                              ) {
                                return (
                                  <text
                                    x={viewBox.cx}
                                    y={viewBox.cy}
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                  >
                                    <tspan
                                      x={viewBox.cx}
                                      y={viewBox.cy}
                                      className="fill-foreground text-3xl font-bold"
                                    >
                                      {chartData[0].completion.toLocaleString()}
                                      %
                                    </tspan>
                                    <tspan
                                      x={viewBox.cx}
                                      y={(viewBox.cy || 0) + 24}
                                      className="fill-muted-foreground"
                                    >
                                      completed
                                    </tspan>
                                  </text>
                                );
                              }
                            }}
                          />
                        </PolarRadiusAxis>
                      </RadialBarChart>
                    </ChartContainer>
                  </CardContent>

                  {/* LIST OF THE SUGGESTIONS */}
                  <div className="flex flex-col gap-2">
                    {data.profile.suggestions.map((suggestion, i) => (
                      <div
                        key={i}
                        className="border text-xs rounded-lg bg-foreground text-background shadow-sm p-2"
                      >
                        {suggestion}
                      </div>
                    ))}
                  </div>
                </div>
              )}{" "}
              {/* </Skeleton> */}
            </Card>
          </div>

          {/* RECENT ACTIVITY AND QUICK ACTIONS */}
          <div className="w-[calc(100%-225px)] h-full flex flex-col gap-4">
            <Card className=" min-w-fit border p-4 flex flex-col gap-3 rounded-lg shadow-sm text-background bg-zinc-900 dark:bg-zinc-50">
              <div className="flex gap-2 justify-between items-center">
                <p className="font-semibold text-lg">Recent Activity</p>{" "}
                {/* <Button
                  className="h-10 w-10 rounded-full text-xl pointer-events-none"
                  variant="outline"
                  style={{ padding: 0 }}
                >
                  <User2 />
                </Button> */}
              </div>

              {/* LIST OF THE SUGGESTIONS */}
              {/* <Skeleton name="suggestion" loading={isLoading}> */}
              {data.activity && (
                <div className="flex flex-col gap-2">
                  {data.activity.map((suggestion, i) => (
                    <div
                      key={i}
                      className="border text-xs rounded-lg bg-background text-foreground shadow-sm p-2"
                    >
                      {suggestion}
                    </div>
                  ))}
                </div>
              )}
              {/* </Skeleton> */}
            </Card>

            <Card className=" min-w-fit border p-4 flex flex-col gap-3 rounded-lg shadow-sm">
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
                  onClick={() => router.push("/create")}
                >
                  Upload Reel
                </Button>
                <Button
                  className="rounded-full"
                  variant="default"
                  onClick={() => router.push("/chat")}
                >
                  View Chats
                </Button>
              </div>
            </Card>
          </div>
        </div>

        {/* CALENDER DIV */}

        <InterviewCalendar interviewsScheduled={data.interviews || []} />
      </div>

      {/* Bento Grid Layout */}
      {/* <Skeleton name="analytics" loading={isLoading}> */}
      {data.analytics && <ChartAreaInteractive data={data.analytics} />}
      {/* </Skeleton> */}
    </main>
  );
};

export default StudentDashboard;
