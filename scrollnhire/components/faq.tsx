"use client";

import { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "Do I need to pay to get started?",
    answer:
      "Nope. ScrollnHire is free to start for both students and recruiters. You can explore talent, post work, and begin conversations without paying anything upfront.",
  },
  {
    question: "How is this different from traditional hiring platforms?",
    answer:
      "Instead of static resumes, ScrollnHire is built around real work. Students showcase skills through reels and projects, and recruiters discover talent by scrolling—just like they already consume content.",
  },
  {
    question: "Can students directly talk to recruiters?",
    answer:
      "Yes. If a recruiter is interested, conversations can start instantly. No long application chains—just real-time interaction when it matters most.",
  },
  {
    question: "What can students showcase on their profile?",
    answer:
      "Students can upload reels, add projects, and build a portfolio that reflects what they can actually do. It’s less about claims, more about proof.",
  },
  {
    question: "What do recruiters get in the free plan?",
    answer:
      "Recruiters can scroll through talent, view profiles, save candidates, and start limited conversations—all without any cost.",
  },
  {
    question: "What will the premium recruiter plan include?",
    answer:
      "The upcoming premium plan unlocks advanced filters, unlimited chats, full Kanban pipelines, and deeper analytics—helping recruiters move from discovery to hiring much faster.",
  },
  {
    question: "Will I get notified about activity on my profile?",
    answer:
      "Yes. You’ll receive real-time updates when someone views your profile, interacts with your content, or reaches out—so you never miss an opportunity.",
  },
  {
    question: "Is ScrollnHire only for tech roles?",
    answer:
      "Not at all. While it’s great for developers and designers, ScrollnHire is built for anyone who can showcase their work—creatives, marketers, editors, and more.",
  },
];

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="m6 9 6 6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function FAQ() {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  return (
    <div className="w-full flex justify-center items-start bg-black dark:bg-white">
      <div className="flex-1 px-4 md:px-12 py-16 md:py-20 flex flex-col lg:flex-row justify-start items-start gap-6 lg:gap-12">
        {/* Left Column - Header */}
        <div className="w-full lg:flex-1 flex flex-col justify-center items-start gap-4 lg:py-5">
          <div className="w-full flex gap-4 items-center text-background font-semibold leading-tight md:leading-[44px] font-sans text-3xl md:text-4xl lg:text-5xl tracking-tight">
            Frequently Asked Questions
            {/* <h1 className="font-playfair italic leading-tight w-fit">
              questions
            </h1> */}
          </div>
          <div className="w-full text-muted/60 text-base font-normal leading-7 font-sans">
            Explore your data, build your dashboard,
            <br className="hidden md:block" />
            bring your team together.
          </div>
        </div>

        {/* Right Column - FAQ Items */}
        <div className="w-full lg:flex-1 flex flex-col justify-center items-center">
          <div className="w-full flex flex-col">
            {faqData.map((item, index) => {
              const isOpen = openItems.includes(index);

              return (
                <div
                  key={index}
                  className="w-full border-b border-zinc-800 dark:border-zinc-200 overflow-hidden"
                >
                  <button
                    onClick={() => toggleItem(index)}
                    className="w-full px-5 py-[18px] flex justify-between items-center gap-5 text-left transition-colors duration-200"
                    aria-expanded={isOpen}
                  >
                    <div className="flex-1 text-background text-base font-medium leading-6 font-sans">
                      {item.question}
                    </div>
                    <div className="flex justify-center items-center">
                      <ChevronDownIcon
                        className={`w-6 h-6 text-background/90 transition-transform duration-300 ease-in-out ${
                          isOpen ? "rotate-180" : "rotate-0"
                        }`}
                      />
                    </div>
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="px-5 pb-[18px] text-muted/60 text-sm font-normal leading-6 font-sans">
                      {item.answer}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
