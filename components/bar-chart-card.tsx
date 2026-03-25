"use client";

import {
  Activity,
  CircleAlert,
  Loader2,
  NotebookText,
  TrendingUp,
} from "lucide-react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
// import useNotesCategories from "../(root)/notes/useNotesCategories";
import Link from "next/link";
import { useState } from "react";
// import Spinner from "./Spinner";
// const chartData = [
//   { month: "January", Notes: 186 },
//   { month: "February", Notes: 305 },
//   { month: "March", Notes: 237 },
//   { month: "April", Notes: 73 },
//   { month: "May", Notes: 209 },
//   { month: "June", Notes: 214 },
// ];

const chartConfig = {
  Notes: {
    label: "Notes",
    color: "#18181b",
  },
} satisfies ChartConfig;

export function BarChartCard() {
  const [categories, setcategories] = useState([
    { category: "Development" },
    { category: "JAvascript" },
  ]);
  const [isFetching, setIsFetching] = useState(false);
  //   const { categories, isFetching } = useNotesCategories();
  console.log(categories);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Category-wise Notes</CardTitle>
        {/* <CardDescription>January - June 2024</CardDescription> */}
      </CardHeader>
      {isFetching ? (
        <div className="flex items-center h-[277px] w-full justify-center">
          <Loader2 height={20} width={20} />
        </div>
      ) : categories.length > 0 ? (
        <>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <BarChart
                accessibilityLayer
                data={categories}
                margin={{
                  top: 25,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="category"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 10)}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar dataKey="Notes" fill="var(--color-Notes)" radius={8}>
                  <LabelList
                    position="top"
                    offset={12}
                    className="fill-foreground"
                    fontSize={12}
                  />
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col items-start gap-2 text-sm">
            {/* <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div> */}
            <div className="flex gap-2 font-medium leading-none">
              Maximum notes belong to {categories[0]?.category?.slice(0, 10)}{" "}
              category <Activity size={15} />
            </div>
            <div className="leading-none text-muted-foreground">
              Showing category wise number of notes
            </div>
          </CardFooter>
        </>
      ) : (
        <div className="w-full flex flex-col gap-2 text-center p-4 pt-0">
          <span className="font-semibold items-center gap-2 mt-[45px] flex flex-col">
            <CircleAlert />
            No notes found!
          </span>
          <span className=" text-sm text-zinc-600">
            You have not uploaded any notes yet.
          </span>
          <Link
            href="/notes/upload"
            className="w-full flex items-center justify-center p-2 font-semibold text-sm bg-zinc-950 hover:bg-zinc-800 text-zinc-50 rounded-lg transition-all"
          >
            Upload Notes
          </Link>
        </div>
      )}
    </Card>
  );
}
