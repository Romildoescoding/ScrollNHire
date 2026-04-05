"use client";

import React from "react";

const StudentDashboard = () => {
  return (
    <main className="flex flex-col pb-6 gap-4 max-w-7xl mx-auto">
      {/* Header */}
      <section className="">
        <h1 className="font-playfair text-slate-900 dark:text-slate-100 text-4xl italic leading-tight mb-2">
          Welcome back, Alex
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400 text-base">
          Get started by navigating from the sidebar or select an option on the
          dashboard.
        </p>
      </section>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Hiring Pipeline Tracker */}
        <div className="md:col-span-8 h-fit glass-card rounded-xl p-4 border border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 liquid-glow pointer-events-none"></div>

          <div className="flex justify-between items-center mb-8">
            <h2 className="font-playfair text-slate-900 dark:text-slate-100 text-xl italic leading-tight mb-2">
              Hiring Pipeline Tracker
            </h2>
            <span className="text-xs uppercase tracking-widest text-[#89acff]">
              Live Updates
            </span>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between text-sm px-1">
              {["Shortlisted", "Chat", "Interview", "Offer"].map((step) => (
                <span key={step} className="text-foreground font-medium">
                  {step}
                </span>
              ))}
            </div>

            <div className="h-1.5 w-full bg-primary/30 rounded-full overflow-hidden">
              <div className="h-full w-[65%] bg-gradient-to-r from-cyan-500 to-cyan-600 relative">
                <div className="absolute inset-0 bg-primary/30 animate-pulse"></div>
              </div>
            </div>

            <div className="grid grid-cols-4 text-center mt-4 text-xs">
              <div className=" text-cyan-500 fot-bold">2 companies</div>
              <div className="">1 Company</div>
              <div>Tomorrow, 10 AM</div>
              <div>Pending</div>
            </div>
          </div>
        </div>

        {/* Performance Engine */}
        <div className="md:col-span-4 glass-card rounded-xl p-6 border border-white/5 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-serif italic text-white mb-6">
              Performance Engine
            </h2>

            <div className="flex justify-between items-end mb-6">
              <div>
                <p className="text-xs uppercase text-on-surface-variant mb-1">
                  Reel Views
                </p>
                <p className="text-3xl font-bold text-white">2.4k</p>
              </div>

              <div className="text-right">
                <p className="text-xs uppercase text-on-surface-variant mb-1">
                  Completion
                </p>
                <p className="text-xl font-bold text-[#89acff]">84%</p>
              </div>
            </div>

            <svg
              className="w-full h-20 stroke-primary fill-none stroke-2"
              viewBox="0 0 100 40"
            >
              <path d="M0,35 Q10,30 20,32 T40,15 T60,25 T80,5 T100,20" />
            </svg>
          </div>

          <div className="mt-6 pt-6 border-t border-white/5 grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs uppercase text-on-surface-variant">
                Profile Visits
              </p>
              <p className="font-semibold">142</p>
            </div>
            <div>
              <p className="text-xs uppercase text-on-surface-variant">
                Clicks
              </p>
              <p className="font-semibold">18</p>
            </div>
          </div>
        </div>

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
