"use client";

import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Zap,
  Target,
  Award
} from "lucide-react";

interface TimelinePhase {
  id: string;
  time: string;
  phaseLabel: string;
  dotColor: string;
  points: string[];
}

const PHASES: TimelinePhase[] = [
  {
    id: "now",
    time: "NOW",
    phaseLabel: "Baseline Assessment",
    dotColor: "bg-emerald-500",
    points: [
      "Completed 80 scenarios across 35 traits.",
      "Mapped Core Aptitudes vs Work Values (Wealth, Social Impact, Autonomy).",
      "Ranked Top 5 recommended career trajectories."
    ],
  },
  {
    id: "1-month",
    time: "1 month",
    phaseLabel: "Exploration & Foundation",
    dotColor: "bg-emerald-400",
    points: [
      "Research the intersection of Engineering and Visual Arts (e.g., Generative Art, Product Design, Creative Coding).",
      "Identify 5 industry leaders who have transitioned from B.Tech to Creative/Design roles.",
      "Audit a basic course on Design Thinking."
    ],
  },
  {
    id: "6-months",
    time: "6 months",
    phaseLabel: "Applied Apprenticeship",
    dotColor: "bg-blue-400",
    points: [
      "Apply for internships in Product Design, UX Research, or Creative Technology.",
      "Network with alumni from IIT Jodhpur working in non-traditional engineering roles.",
      "Develop a personal brand on LinkedIn highlighting the 'Technical Artist' persona."
    ],
  },
  {
    id: "1-year",
    time: "1 year",
    phaseLabel: "Full-Time Placement",
    dotColor: "bg-indigo-400",
    points: [
      "Secure a full-time role in a high-growth tech company within a Product or Design-centric team.",
      "Establish a financial plan to achieve Wealth goals while maintaining Work-Life Balance.",
      "Lead a small-scale project to improve Team Orientation and collaboration skills."
    ],
  },
  {
    id: "3-years",
    time: "3 years",
    phaseLabel: "Scale & Leadership",
    dotColor: "bg-purple-400",
    points: [
      "Transition into a Senior Product Designer or Creative Lead role.",
      "Scale the social impact of work by mentoring junior designers from Tier 2 cities.",
      "Optimize income streams to align with high wealth aspirations."
    ],
  },
];

export default function AnimatedCareerPathTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState<number>(0);

  // Scroll tracking across the roadmap section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 65%", "end 35%"],
  });

  // Smooth line draw height
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const indicatorPercent = useTransform(scrollYProgress, [0, 1], [0, 100]);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const step = Math.min(
      PHASES.length - 1,
      Math.max(0, Math.floor(latest * PHASES.length))
    );
    setActiveStep(step);
  });

  return (
    <div 
      ref={containerRef}
      className="relative w-full rounded-2xl bg-white dark:bg-[#07131e]/95 border border-slate-200 dark:border-white/10 p-5 sm:p-9 backdrop-blur-md text-slate-900 dark:text-white shadow-xl dark:shadow-2xl overflow-hidden transition-colors"
    >
      {/* Background ambient glow */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 rounded-full bg-cyan-500/5 dark:bg-cyan-500/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-10 -left-20 w-96 h-96 rounded-full bg-indigo-500/5 dark:bg-indigo-500/10 blur-[130px] pointer-events-none" />

      {/* ========================================================= */}
      {/* 1. REPORT PAGE HEADER STRIP                               */}
      {/* ========================================================= */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-white/10 text-xs font-mono">
        <div className="flex items-center gap-2.5">
          <span className="px-2 py-0.5 rounded bg-emerald-500 text-slate-950 font-black text-[11px] tracking-wider">
            13
          </span>
          <span className="font-bold tracking-widest uppercase text-emerald-700 dark:text-emerald-400">
            EXECUTION PLAN
          </span>
        </div>
        <div className="text-slate-400 dark:text-slate-500 tracking-widest uppercase text-[10px]">
          CONFIDENTIAL • 2026
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. PAGE TITLE & SUBTITLE                                  */}
      {/* ========================================================= */}
      <div className="mt-5 pb-2">
        <h3 className="text-2xl sm:text-4xl font-serif font-black text-slate-950 dark:text-white tracking-tight">
          From here to a job offer
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 max-w-2xl leading-relaxed">
          A sequenced, costed plan — not a wish list. Each phase closes a specific gap identified earlier in this report, in the order that compounds fastest.
        </p>
      </div>

      {/* Internal Connecting Conduit: Header -> Timeline */}
      <div className="my-6 flex flex-col items-center">
        <div className="w-0.5 h-10 bg-gradient-to-b from-emerald-500 via-blue-500 to-indigo-500" />
      </div>

      {/* ========================================================= */}
      {/* 3. TIMELINE CARD WITH LONGER, LARGER CONNECTIONS          */}
      {/* ========================================================= */}
      <div className="p-5 sm:p-7 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 shadow-xs relative">
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-200 dark:border-white/5">
          <h4 className="text-base sm:text-lg font-serif font-bold text-slate-950 dark:text-white flex items-center gap-2">
            <span>Timeline</span>
            <span className="text-xs font-mono font-normal text-slate-400 dark:text-slate-500 hidden sm:inline">
              (Scroll down to animate through milestones)
            </span>
          </h4>

          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-mono font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Phase: {PHASES[activeStep].time}</span>
          </div>
        </div>

        {/* Long, Generous Timeline Track */}
        <div className="relative pl-6 sm:pl-36 md:pl-44 pt-2 pb-4">
          
          {/* Background Spine Line */}
          <div className="absolute left-[18px] sm:left-[118px] md:left-[148px] top-4 bottom-4 w-1 bg-slate-200 dark:bg-white/10 -translate-x-1/2 rounded-full" />

          {/* Animated Glowing Progress Line */}
          <motion.div 
            style={{ height: lineHeight }}
            className="absolute left-[18px] sm:left-[118px] md:left-[148px] top-4 w-1 bg-gradient-to-b from-emerald-500 via-blue-500 via-indigo-500 to-purple-500 -translate-x-1/2 rounded-full shadow-[0_0_14px_rgba(16,185,129,0.8)] z-10"
          />

          {/* Floating Moving Beacon "You are here →" */}
          <motion.div
            style={{ 
              top: useTransform(indicatorPercent, [0, 100], ["16px", "calc(100% - 24px)"])
            }}
            className="absolute left-[18px] sm:left-[118px] md:left-[148px] -translate-x-full pr-3.5 -translate-y-1/2 z-30 pointer-events-none transition-transform"
          >
            <div className="flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400 text-white dark:text-slate-950 font-mono text-[10px] sm:text-xs font-black shadow-[0_0_20px_rgba(5,150,105,0.4)] dark:shadow-[0_0_20px_rgba(52,211,153,0.9)] border border-emerald-500 dark:border-emerald-200">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white dark:bg-slate-950 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white dark:bg-slate-950" />
              </span>
              <span className="whitespace-nowrap font-bold tracking-tight">You are here →</span>
            </div>
          </motion.div>

          {/* Timeline Phase Nodes */}
          <div className="space-y-10 sm:space-y-12 relative z-20">
            {PHASES.map((phase, idx) => {
              const isPassed = activeStep >= idx;
              const isCurrent = activeStep === idx;

              return (
                <div 
                  key={phase.id}
                  onClick={() => setActiveStep(idx)}
                  className={`group cursor-pointer flex items-start gap-4 sm:gap-6 transition-all duration-300 ${
                    isCurrent ? "scale-[1.01]" : ""
                  }`}
                >
                  {/* Left Column (Desktop Timestamp) */}
                  <div className="hidden sm:flex flex-col items-end w-20 md:w-28 shrink-0 pt-0.5 text-right">
                    <span className={`font-mono text-sm sm:text-base font-black transition-colors ${
                      isCurrent 
                        ? "text-emerald-600 dark:text-emerald-400" 
                        : isPassed 
                        ? "text-slate-800 dark:text-slate-300" 
                        : "text-slate-400 dark:text-slate-500"
                    }`}>
                      {phase.time}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                      {phase.phaseLabel}
                    </span>
                  </div>

                  {/* Node Circle on Track */}
                  <div className="relative flex items-center justify-center shrink-0 mt-0.5">
                    {isCurrent && (
                      <div className="absolute w-8 h-8 rounded-full bg-emerald-500/25 dark:bg-emerald-500/30 animate-ping" />
                    )}

                    <div className={`relative w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                      isCurrent
                        ? "bg-emerald-500 dark:bg-emerald-400 border-white text-white dark:text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.5)] scale-110"
                        : isPassed
                        ? "bg-emerald-50 dark:bg-emerald-950 border-emerald-500 text-emerald-700 dark:text-emerald-400"
                        : "bg-slate-100 dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-400"
                    }`}>
                      <span className="w-2.5 h-2.5 rounded-full bg-current" />
                    </div>
                  </div>

                  {/* Right Content Card for Phase */}
                  <div className={`flex-1 rounded-xl p-4 sm:p-5 border transition-all duration-300 ${
                    isCurrent 
                      ? "bg-white dark:bg-white/10 border-emerald-500/60 shadow-md ring-1 ring-emerald-500/30" 
                      : isPassed
                      ? "bg-white/80 dark:bg-white/[0.04] border-slate-200 dark:border-white/10"
                      : "bg-white/50 dark:bg-white/[0.02] border-slate-200/60 dark:border-white/5 opacity-60"
                  }`}>
                    {/* Mobile Timestamp Label */}
                    <div className="sm:hidden flex items-center justify-between mb-2">
                      <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        {phase.time}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {phase.phaseLabel}
                      </span>
                    </div>

                    <h5 className="text-sm font-serif font-bold text-slate-900 dark:text-white mb-2 hidden sm:block">
                      {phase.time}: {phase.phaseLabel}
                    </h5>

                    {/* Action Items List */}
                    <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                      {phase.points.map((pt, pIdx) => (
                        <li key={pIdx} className="flex items-start gap-2">
                          <span className="text-emerald-500 shrink-0 mt-0.5">•</span>
                          <span className="leading-relaxed">{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      </div>

      {/* Sleek bottom milestone assurance */}
      <div className="mt-6 pt-4 border-t border-slate-200 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400 font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Every phase closes a specific hiring gap in order of highest leverage.</span>
        </div>
        <span className="text-emerald-600 dark:text-emerald-400 font-bold shrink-0">
          Target Outcome: Offer Placement
        </span>
      </div>

    </div>
  );
}
