"use client";

import { useState } from "react";

const faqs = [
  {
    q: "How is this different?",
    a: "You discover candidates through short-form project videos instead of resumes.",
  },
  {
    q: "Is it free?",
    a: "Yes, currently free during early access.",
  },
  {
    q: "Who can use it?",
    a: "Students and recruiters.",
  },
  {
    q: "Can I contact candidates?",
    a: "Yes, directly via chat.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="bg-black text-white py-32 px-10 max-w-3xl mx-auto">
      <h2 className="text-4xl font-semibold mb-10 text-center">FAQs</h2>

      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <div
            key={i}
            className="border border-zinc-800 rounded-xl p-5 cursor-pointer"
            onClick={() => setOpen(open === i ? null : i)}
          >
            <div className="flex justify-between">
              <span>{faq.q}</span>
              <span>{open === i ? "-" : "+"}</span>
            </div>

            {open === i && <p className="text-gray-400 mt-3">{faq.a}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}
