"use client";

import { useState, useMemo } from "react";
import { Calendar } from "@/components/ui/calendar";
import { format, isSameDay } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";

type Interview = {
  id: string;
  name: string;
  role: string;
  time: string;
  date: Date;
};

export default function InterviewCalendar({
  interviewsScheduled,
}: {
  interviewsScheduled: Interview[];
}) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );

  // 🎯 Extract all interview dates
  const interviewDates = useMemo(
    () => interviewsScheduled.map((i) => i.date),
    [interviewsScheduled],
  );

  // 🎯 Filter interviews for selected date
  const interviewsForSelectedDate = useMemo(() => {
    if (!selectedDate) return [];
    return interviewsScheduled.filter((i) => isSameDay(i.date, selectedDate));
  }, [selectedDate, interviewsScheduled]);

  return (
    <div className="w-full min-w-fit border rounded-lg h-full  bg-white dark:bg-zinc-950 p-4 shadow-sm overflow-y-hidden flex flex-col gap-2">
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
              <p className="text-muted-foreground text-sm">
                No interviews scheduled.
              </p>
            ) : (
              interviewsForSelectedDate.map((interview) => (
                <div
                  key={interview.id}
                  className="border rounded-lg p-2 w-full bg-foreground text-background flex justify-between items-center cursor-pointer"
                >
                  <div>
                    <p className="font-medium text-sm">{interview.name}</p>
                    <p className="text-xs text-zinc-400 dark:text-zinc-600">
                      {interview.role}
                    </p>
                  </div>

                  <div className="text-xs font-medium">{interview.time}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
