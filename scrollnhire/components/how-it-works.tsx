"use client";

import { motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";

const steps = [
  {
    title: "Discovery",
    description:
      "Scroll through real projects, not static resumes. Discover talent the way you already explore content.",
  },
  {
    title: "Chat",
    description:
      "See something impressive? Start a conversation instantly. Ask, explore, and evaluate in real-time.",
  },
  {
    title: "Hiring",
    description:
      "Manage candidates your way — list view or Kanban. From discovery to hire, everything stays in sync.",
  },
];

export default function HowItWorks() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="relative h-[300vh] flex bg-black text-white border-t border-yellow-500">
      {/* LEFT SIDE (Sticky Text) */}
      <div className="sticky top-0 h-screen w-1/3 flex items-center px-20">
        <div className="space-y-10">
          {steps.map((step, index) => (
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
                {/* <p className="text-gray-400 mt-2 max-w-md">{step.description}</p> */}
              </motion.div>
            </div>
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
