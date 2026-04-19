"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export const description = "An interactive area chart"

const chartData = [
  { date: "2024-04-01", views: 222, },
  { date: "2024-04-02", views: 97, },
  { date: "2024-04-03", views: 167, },
  { date: "2024-04-04", views: 242, },
  { date: "2024-04-05", views: 373, },
  { date: "2024-04-06", views: 301, },
  { date: "2024-04-07", views: 245, },
  { date: "2024-04-08", views: 409, },
  { date: "2024-04-09", views: 59, },
  { date: "2024-04-10", views: 261, },
  { date: "2024-04-11", views: 327, },
  { date: "2024-04-12", views: 292, },
  { date: "2024-04-13", views: 342, },
  { date: "2024-04-14", views: 137, },
  { date: "2024-04-15", views: 120, },
  { date: "2024-04-16", views: 138, },
  { date: "2024-04-17", views: 446, },
  { date: "2024-04-18", views: 364, },
  { date: "2024-04-19", views: 243, },
  { date: "2024-04-20", views: 89, },
  { date: "2024-04-21", views: 137, },
  { date: "2024-04-22", views: 224, },
  { date: "2024-04-23", views: 138, },
  { date: "2024-04-24", views: 387, },
  { date: "2024-04-25", views: 215, },
  { date: "2024-04-26", views: 75, },
  { date: "2024-04-27", views: 383, },
  { date: "2024-04-28", views: 122, },
  { date: "2024-04-29", views: 315, },
  { date: "2024-04-30", views: 454, },
  { date: "2024-05-01", views: 165, },
  { date: "2024-05-02", views: 293, },
  { date: "2024-05-03", views: 247, },
  { date: "2024-05-04", views: 385, },
  { date: "2024-05-05", views: 481, },
  { date: "2024-05-06", views: 498, },
  { date: "2024-05-07", views: 388, },
  { date: "2024-05-08", views: 149, },
  { date: "2024-05-09", views: 227, },
  { date: "2024-05-10", views: 293, },
  { date: "2024-05-11", views: 335, },
  { date: "2024-05-12", views: 197, },
  { date: "2024-05-13", views: 197, },
  { date: "2024-05-14", views: 448, },
  { date: "2024-05-15", views: 473, },
  { date: "2024-05-16", views: 338, },
  { date: "2024-05-17", views: 499, },
  { date: "2024-05-18", views: 315, },
  { date: "2024-05-19", views: 235, },
  { date: "2024-05-20", views: 177, },
  { date: "2024-05-21", views: 82, },
  { date: "2024-05-22", views: 81, },
  { date: "2024-05-23", views: 252, },
  { date: "2024-05-24", views: 294, },
  { date: "2024-05-25", views: 201, },
  { date: "2024-05-26", views: 213, },
  { date: "2024-05-27", views: 420, },
  { date: "2024-05-28", views: 233, },
  { date: "2024-05-29", views: 78, },
  { date: "2024-05-30", views: 340, },
  { date: "2024-05-31", views: 178, },
  { date: "2024-06-01", views: 178, },
  { date: "2024-06-02", views: 470, },
  { date: "2024-06-03", views: 103, },
  { date: "2024-06-04", views: 439, },
  { date: "2024-06-05", views: 88, },
  { date: "2024-06-06", views: 294, },
  { date: "2024-06-07", views: 323, },
  { date: "2024-06-08", views: 385, },
  { date: "2024-06-09", views: 438, },
  { date: "2024-06-10", views: 155, },
  { date: "2024-06-11", views: 92, },
  { date: "2024-06-12", views: 492, },
  { date: "2024-06-13", views: 81, },
  { date: "2024-06-14", views: 426, },
  { date: "2024-06-15", views: 307, },
  { date: "2024-06-16", views: 371, },
  { date: "2024-06-17", views: 475, },
  { date: "2024-06-18", views: 107, },
  { date: "2024-06-19", views: 341, },
  { date: "2024-06-20", views: 408, },
  { date: "2024-06-21", views: 169, },
  { date: "2024-06-22", views: 317, },
  { date: "2024-06-23", views: 480, },
  { date: "2024-06-24", views: 132, },
  { date: "2024-06-25", views: 141, },
  { date: "2024-06-26", views: 434, },
  { date: "2024-06-27", views: 448, },
  { date: "2024-06-28", views: 149, },
  { date: "2024-06-29", views: 103, },
  { date: "2024-06-30", views: 446, },
]

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  views: {
    label: "Views",
    color: "var(--foreground)",
  }
} satisfies ChartConfig

export function ChartAreaInteractive() {
  const [timeRange, setTimeRange] = React.useState("90d")

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date)
    const referenceDate = new Date("2024-06-30")
    let daysToSubtract = 90
    if (timeRange === "30d") {
      daysToSubtract = 30
    } else if (timeRange === "7d") {
      daysToSubtract = 7
    }
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return date >= startDate
  })

  return (
    <Card className="pt-0">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Area Chart - Interactive</CardTitle>
          <CardDescription>
            Showing views for the last 3 months
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d" className="rounded-lg">
              Last 3 months
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              Last 30 days
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              Last 7 days
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillViews" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-views)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-views)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              {/* <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.1}
                />
              </linearGradient> */}
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="views"
              type="natural"
              fill="url(#fillViews)"
              stroke="var(--color-views)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
