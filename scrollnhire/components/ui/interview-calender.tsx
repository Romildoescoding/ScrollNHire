"use client";

import { useState, useMemo } from "react";
import { Calendar } from "@/components/ui/calendar";
import { format, isSameDay } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { InterviewItem } from "@/app/hooks/useStudentDashboard";
import { AlertCircle, Laptop } from "lucide-react";
import { Button } from "./button";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function InterviewCalendar({
  interviewsScheduled,
}: {
  interviewsScheduled: InterviewItem[];
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );

  // 🎯 Extract all interview dates
  const interviewDates = useMemo(
    () => interviewsScheduled.map((i) => i.interviewDate),
    [interviewsScheduled],
  );

  // 🎯 Filter interviews for selected date
  const interviewsForSelectedDate = useMemo(() => {
    if (!selectedDate) return [];
    return interviewsScheduled.filter((i) =>
      isSameDay(i.interviewDate, selectedDate),
    );
  }, [selectedDate, interviewsScheduled]);

  return (
    <div className="w-full min-w-fit border rounded-lg h-full bg-white dark:bg-zinc-950 p-4 shadow-sm overflow-y-hidden flex flex-col gap-2">
      <p className="font-semibold text-lg">Interview Calender</p>
      {/* 📅 Calendar */}
      <div className="w-full h-[calc(100%-28px)] flex gap-2">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          // 🔥 Highlight interview dates
          modifiers={{
            interview: interviewDates,
          }}
          modifiersClassNames={{
            interview: "hasDot",
          }}
          className="p-0 bg-white dark:bg-zinc-950"
        />

        {/* 📋 Interview List */}
        <div className="flex flex-1 h-full flex-col gap-2 px-2">
          <h3 className="font-semibold">
            {selectedDate
              ? `Interviews on ${format(selectedDate, "PPP")}`
              : "Select a date"}
          </h3>
          <div className="flex h-full overflow-y-auto flex-col gap-2">
            {interviewsForSelectedDate.length === 0 ? (
              <div className="w-full h-full items-center justify-center flex flex-col gap-2">
                <div className=" h-10 aspect-square rounded-full flex items-center justify-center border-foreground border-2">
                  <Laptop size={24} strokeWidth={1.5} />
                </div>
                <span className="text-muted-foreground">
                  No interviews today
                </span>
                <Button
                  className="rounded-full max-w-[160px]"
                  variant="default"
                  onClick={() => router.push("/create")}
                >
                  {session?.user?.role === "employer"
                    ? "Schedule Interview"
                    : "Go to chats"}
                </Button>
              </div>
            ) : (
              interviewsForSelectedDate.map((interview) => (
                <div
                  key={interview.id}
                  className="border rounded-lg p-2 w-full bg-foreground text-background flex justify-between items-center cursor-pointer"
                >
                  <div>
                    <p className="font-medium text-sm">{interview.name}</p>
                    <p className="text-xs text-zinc-400 dark:text-zinc-600">
                      {interview.role || "Role unspecified"}
                    </p>
                  </div>

                  <div className="text-xs font-medium">
                    {format(interview.interviewDate, "p")}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
