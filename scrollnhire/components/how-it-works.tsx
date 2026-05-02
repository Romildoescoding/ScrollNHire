"use client";

import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { motion, useInView } from "motion/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const steps = [
  {
    title: "Discovery",
    description:
      "Finding the right talent today often means digging through static resumes, endless PDFs, and profiles that barely scratch the surface. It’s slow, repetitive, and rarely inspiring.\n\nScrollnHire changes that. Instead of reading about skills, you experience them. Scroll through real projects, live work, and authentic creativity—discovering talent the same way you already explore content.",
  },
  {
    title: "Chat",
    description:
      "When something catches your eye, the momentum usually fades. You switch tabs, draft emails, wait for replies—and the connection loses its spark.\n\nHere, conversations happen instantly. Start chatting the moment you’re impressed. Ask questions, dive deeper, and truly understand the person behind the work while the context is still fresh.",
  },
  {
    title: "Hiring",
    description:
      "Managing candidates across tools, spreadsheets, and notes quickly turns messy. Promising talent gets lost, and the process feels fragmented and hard to track.\n\nWith ScrollnHire, everything stays in one place. Organize candidates your way—whether through structured lists or visual Kanban boards—and move seamlessly from discovery to decision without breaking your flow.",
  },
];

export default function HowItWorks() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section
      id="features"
      className="relative h-[300vh] flex bg-black dark:bg-white text-white dark:text-black "
    >
      {/* LEFT SIDE (Sticky Text) */}
      <div className="sticky top-0 h-screen w-1/3 flex items-center px-8">
        <div className="h-full w-full">
          {/* {steps.map((step, index) => (
            <div
              key={index}
              className="w-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              <motion.div key={index} className=" overflow-hidden">
                <motion.h2
                  className="text-7xl relative font-semibold"
                  transition={{ duration: 1, ease: "circInOut" }}
                  animate={{
                    y:
                      activeIndex === index
                        ? 0
                        : activeIndex > index
                          ? "-110%"
                          : "110%",
                  }}
                >
                  {step.title}
                </motion.h2>
              </motion.div>
            </div>
          ))} */}

          {steps.map((step, index) => (
            <motion.div
              key={index}
              className={cn(
                "w-full border-zinc-800 dark:border-zinc-300 overflow-hidden",
                "border-b last:border-b-0",
              )}
              animate={{
                height: activeIndex === index ? "66%" : "16.6%",
                // opacity: activeIndex === index ? "100%" : "30%",
              }}
              transition={{ duration: 0.75, ease: "easeInOut" }}
            >
              <motion.div
                key={index}
                className=" h-full w-full flex flex-col gap-4 py-10"
                animate={{
                  opacity: activeIndex === index ? "100%" : "30%",
                }}
                transition={{ duration: 0.75, ease: "easeInOut" }}
              >
                <h2 className="text-5xl relative font-semibold">
                  {step.title}
                </h2>
                <p className="text-muted-foreground text-lg mt-2 max-w-md">
                  {step.description}
                </p>
                <Link
                  href="/"
                  className="group h-fit text-lg inline-flex items-center bg-transparent"
                >
                  Start Now
                  <ChevronRight className="h-6 w-6 ml-0 transition-all duration-300 group-hover:ml-2" />
                </Link>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* RIGHT SIDE (Scroll Sections) */}
      <div className="w-2/3">
        {steps.map((_, index) => (
          <StepSection
            key={index}
            index={index}
            setActiveIndex={setActiveIndex}
          />
        ))}
      </div>
    </section>
  );
}

function StepSection({ index, setActiveIndex }: any) {
  const ref = useRef(null);

  const isInView = useInView(ref, {
    margin: "-45% 0px -45% 0px", // 👈 triggers near center
  });

  useEffect(() => {
    if (isInView) {
      setActiveIndex(index);
    }
  }, [isInView, index, setActiveIndex]);

  return (
    <div
      ref={ref}
      className={`h-screen flex items-center justify-center text-3xl font-bold
      ${
        index === 0
          ? "bg-blue-500"
          : index === 1
            ? "bg-purple-500"
            : "bg-green-500"
      }`}
    >
      VIDEO {index + 1}
    </div>
  );
}
