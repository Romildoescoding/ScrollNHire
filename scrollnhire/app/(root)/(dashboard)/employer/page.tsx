"use client";

import HiringPipeline from "@/components/hiring-pipeline";
import React from "react";

const StudentDashboard = () => {
  return (
    <main className="flex flex-col px-4 pb-6 gap-4 max-w-7xl mx-auto">
      {/* Header */}
      <section className="">
        <h1 className="font-playfair text-slate-900 dark:text-slate-100 text-4xl italic leading-tight">
          Welcome back, Alex
        </h1>
        {/* <p className="text-neutral-600 dark:text-neutral-400 text-base">
          Get started by navigating from the sidebar or select an option on the
          dashboard.
        </p> */}
      </section>

      <HiringPipeline />

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Hiring Pipeline Tracker */}

        {/* Action Required */}
        <div className="md:col-span-4 glass-card rounded-xl p-6 border border-white/5 flex flex-col gap-4">
          <h2 className="text-lg font-serif italic text-white">
            Action Required
          </h2>

          <div className="space-y-3">
            {[
              {
                title: "Pending Assessment",
                desc: "Google UX Design prompt",
                color: "error",
              },
              {
                title: "Upcoming Interview",
                desc: "Starts in 4 hours",
                color: "primary",
              },
              {
                title: "Boost Visibility",
                desc: "Upload 2 more reels for 3x reach",
                color: "white",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-white/5 border border-white/10"
              >
                <p className="text-sm font-semibold text-white">{item.title}</p>
                <p className="text-xs text-on-surface-variant">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Smart Updates */}
        <div className="md:col-span-4 glass-card rounded-xl p-6 border border-white/5">
          <h2 className="text-lg font-serif italic text-white mb-4">
            Smart Updates
          </h2>

          <div className="space-y-4 text-sm">
            <p className="text-white">Shortlisted at Acme Corp</p>
            <p className="text-white">Reel trending in Frontend</p>
            <p className="text-white opacity-50">
              Profile viewed by Meta recruiter
            </p>
          </div>
        </div>

        {/* Skill Insights */}
        <div className="md:col-span-4 glass-card rounded-xl p-6 border border-white/5">
          <h2 className="text-lg font-serif italic text-white mb-4">
            Skill Insights
          </h2>

          <div className="flex flex-wrap gap-2">
            {["React", "Node.js", "UI Design", "TypeScript"].map((skill) => (
              <span
                key={skill}
                className="px-3 py-1 bg-primary/20 text-[#89acff] text-xs rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default StudentDashboard;
