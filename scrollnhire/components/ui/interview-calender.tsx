"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { Calendar } from "@/components/ui/calendar";
import { format, isSameDay } from "date-fns";
import { InterviewItem } from "@/app/hooks/useStudentDashboard";
import { ArrowLeft, Info, Laptop } from "lucide-react";
import { Button } from "./button";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useSidebar } from "@/app/context/SidebarContext";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";
import { cn } from "@/lib/utils";

export default function InterviewCalendar({
  isLoading,
  interviewsScheduled,
}: {
  interviewsScheduled: InterviewItem[];
  isLoading: boolean;
}) {
  const { isSidebarOpen } = useSidebar();

  const MAX_BREAKPOINT = isSidebarOpen ? 1253 : 1077;
  const MIN_BREAKPOINT = isSidebarOpen ? 1077 : 901;
  const { data: session } = useSession();
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );

  // const interviewDates = useMemo(
  //   () => interviewsScheduled.map((i) => i.interviewDate),
  //   [interviewsScheduled],
  // );

  const interviewDates = useMemo(
    () => interviewsScheduled.map((i) => new Date(i.interviewDate)),
    [interviewsScheduled],
  );

  const interviewsForSelectedDate = useMemo(() => {
    if (!selectedDate) return [];
    // return interviewsScheduled.filter((i) =>
    //   isSameDay(i.interviewDate, selectedDate),
    // );
    return interviewsScheduled.filter((i) =>
      isSameDay(new Date(i.interviewDate), selectedDate),
    );
  }, [selectedDate, interviewsScheduled]);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [shouldScroll, setShouldScroll] = useState(false);

  useEffect(() => {
    const check = () => {
      const width = window.innerWidth;
      setShouldScroll(
        width < 500 || (width >= MIN_BREAKPOINT && width <= MAX_BREAKPOINT),
      );
    };

    check();

    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [MAX_BREAKPOINT, MIN_BREAKPOINT]);

  const transformContainer = (direction: "left" | "right") => {
    const el = scrollContainerRef.current;
    if (!el) return;

    if (!shouldScroll) return;
    if (direction === "right") el.style.transform = "translateX(-52.5%)";
    if (direction === "left") el.style.transform = "";
  };

  useEffect(() => {
    if (!shouldScroll) {
      const el = scrollContainerRef.current;
      if (!el) return;
      el.style.transform = "";
    }
  }, [shouldScroll]);

  return (
    <div className="w-full border rounded-lg h-full bg-white dark:bg-zinc-950 p-4 shadow-sm overflow-y-hidden overflow-x-hidden flex flex-col gap-2">
      <p className="font-semibold text-lg flex justify-between gap-2">
        <span>Interview Calender</span>
        <Tooltip>
          <TooltipTrigger asChild>
            <Info size={18} />
          </TooltipTrigger>
          <TooltipContent>
            <p>Select any date to view the interviews</p>
          </TooltipContent>
        </Tooltip>
      </p>

      <div
        ref={scrollContainerRef}
        className={cn(
          "w-[200%] transition-all h-[calc(100%-28px)] flex gap-2 overflow-x-hidden",
          isSidebarOpen
            ? "min-[500px]:w-full min-[1077px]:w-[200%] min-[1253px]:w-full"
            : "min-[500px]:w-full min-[901px]:w-[200%] min-[1077px]:w-full",
        )}
      >
        <div
          className={cn(
            "h-full flex items-center justify-center w-1/2",
            isSidebarOpen ? "min-[1253px]:w-fit" : "min-[1077px]:w-fit",
          )}
        >
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              setSelectedDate(date);
              transformContainer("right");
            }}
            modifiers={{
              interview: interviewDates,
            }}
            modifiersClassNames={{
              interview: "hasDot",
            }}
            className="p-0 bg-white dark:bg-zinc-950"
          />
        </div>

        <div
          className={cn(
            "flex w-1/2 h-full flex-col gap-2 px-2 relative",
            isSidebarOpen
              ? "min-[1253px]:flex-1 min-[1253px]:w-auto"
              : "min-[1077px]:flex-1 min-[1077px]:w-auto",
            shouldScroll ? "pl-8" : "pl-2",
          )}
        >
          {shouldScroll && (
            <Button
              variant={"ghost"}
              className="h-6 w-6 flex items-center justify-center absolute top-0 left-2"
              style={{ padding: 0 }}
              onClick={() => transformContainer("left")}
            >
              <ArrowLeft />
            </Button>
          )}

          <h3 className="font-semibold ">
            {selectedDate
              ? `Interviews on ${format(selectedDate, "PPP")}`
              : "Select a date"}
          </h3>

          <div className="flex h-full overflow-y-auto flex-col gap-2">
            {isLoading ? (
              <>
                {Array.from({ length: 2 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-full h-12 shimmer2 rounded-lg"
                  ></div>
                ))}
              </>
            ) : interviewsForSelectedDate.length === 0 ? (
              <div className="w-full h-full items-center justify-center flex flex-col gap-2">
                <div className="h-10 aspect-square rounded-full flex items-center justify-center border-foreground border-2">
                  <Laptop size={24} strokeWidth={1.5} />
                </div>
                <span className="text-muted-foreground">
                  No interviews today
                </span>
                <Button
                  className="rounded-full max-w-[160px]"
                  variant="default"
                  onClick={() => router.push("/chat")}
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
