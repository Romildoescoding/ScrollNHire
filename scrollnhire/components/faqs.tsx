"use client";

import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { Badge } from "./ui/badge";

const faqs = [
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

import { motion } from "motion/react";

export function FAQ() {
  // const [open, setOpen] = useState<number | null>(null);

  return (
    <section
      id="faq"
      className="w-full py-20 md:py-32 md:pb-0 bg-black dark:bg-white"
    >
      <div className="container px-4 md:px-6">
        <motion.div
          // initial={{ opacity: 0, y: 20 }}
          // whileInView={{ opacity: 1, y: 0 }}
          // viewport={{ once: true }}
          // transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
        >
          {/* <Badge
            className="rounded-full px-4 py-1.5 text-sm font-medium"
            variant="secondary"
          >
            FAQ
          </Badge> */}
          <h2 className="text-3xl md:text-6xl font-bold text-white dark:text-black">
            Frequently Asked Questions
          </h2>
          {/* <p className="max-w-[800px] text-muted-foreground md:text-lg">
            Find answers to common questions about our platform.
          </p> */}
        </motion.div>

        <div className="px-8 w-full">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                // initial={{ opacity: 0, y: 10 }}
                // whileInView={{ opacity: 1, y: 0 }}
                // viewport={{ once: true }}
                // transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <AccordionItem
                  value={`item-${i}`}
                  className="border-b last:border-b-0 border-zinc-800 dark:border-zinc-300 py-2"
                >
                  <AccordionTrigger className="text-left font-medium text-lg hover:no-underline text-white dark:text-black">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-base text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
