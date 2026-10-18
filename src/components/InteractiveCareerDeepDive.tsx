"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  TrendingUp, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle,
  ChevronDown,
  Layers,
  ArrowRight
} from "lucide-react";

export default function InteractiveCareerDeepDive() {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [activeTrait, setActiveTrait] = useState<string>("Wealth");

  return (
    <div className="relative w-full rounded-2xl bg-white dark:bg-[#07131e]/95 border border-slate-200 dark:border-white/10 p-5 sm:p-7 backdrop-blur-md text-slate-900 dark:text-white shadow-xl dark:shadow-2xl overflow-hidden transition-colors">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-1/4 w-80 h-80 rounded-full bg-sky-500/5 dark:bg-sky-500/10 blur-[110px] pointer-events-none" />

      {/* ========================================================= */}
      {/* 1. REPORT PAGE HEADER STRIP                               */}
      {/* ========================================================= */}
      <div className="flex items-center justify-between pb-3.5 border-b border-slate-200 dark:border-white/10 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-sky-500 text-slate-950 font-black text-[11px] tracking-wider">
            07
          </span>
          <span className="font-bold tracking-widest uppercase text-sky-700 dark:text-sky-400">
            CAREER DEEP-DIVE · RANK #2
          </span>
        </div>
        <div className="text-slate-400 dark:text-slate-500 tracking-widest uppercase text-[10px]">
          CONFIDENTIAL • 2026
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. CAREER TITLE & FIT BADGES                              */}
      {/* ========================================================= */}
      <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-xl sm:text-3xl font-serif font-black text-slate-950 dark:text-white tracking-tight">
            Software &amp; Application Development
          </h3>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className="px-2.5 py-0.5 rounded-full bg-sky-100 dark:bg-sky-500/20 text-sky-800 dark:text-sky-400 border border-sky-300 dark:border-sky-500/30 text-[10px] font-mono font-bold tracking-wider uppercase">
              STRONG PROFILE MATCH
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 text-[10px] font-mono font-semibold tracking-wider uppercase">
              INFORMATION TECHNOLOGY
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-teal-50 dark:bg-teal-500/20 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-500/30 text-[10px] font-mono font-semibold tracking-wider uppercase">
              IMMEDIATE FIT
            </span>
          </div>
        </div>

        <div className="shrink-0 flex items-center gap-2">
          <span className="px-3 py-1 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-700 dark:text-sky-400 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-sky-500" />
            94% Fit
          </span>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. COMPACT SUMMARY (WHY THIS RANKS HERE & KEY STATS)      */}
      {/* ========================================================= */}
      <div className="mt-5 p-4 sm:p-5 rounded-xl bg-sky-950/5 dark:bg-sky-950/20 border border-sky-500/30 dark:border-sky-500/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2.5 mb-2.5 border-b border-sky-500/20">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-sky-700 dark:text-sky-400">
            WHY THIS RANKS HERE
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">Contributing Traits:</span>
            <span className="px-1.5 py-0.5 rounded bg-white dark:bg-white/10 text-[10px] font-mono font-bold text-sky-700 dark:text-sky-300">Wealth</span>
            <span className="px-1.5 py-0.5 rounded bg-white dark:bg-white/10 text-[10px] font-mono font-bold text-sky-700 dark:text-sky-300">Subject Strength</span>
            <span className="px-1.5 py-0.5 rounded bg-white dark:bg-white/10 text-[10px] font-mono font-bold text-sky-700 dark:text-sky-300">Artistic</span>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
          Leverages B.Tech background and high Subject Strength while satisfying Wealth and Social Impact goals through scalable tech solutions. Aligns with AI orientation and provides a stable, high-paying path given financial constraints.
        </p>

        {/* Compact Key Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4 pt-3 border-t border-sky-500/15">
          <div className="p-2.5 rounded-lg bg-white/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/5 text-center">
            <span className="text-[9px] font-mono uppercase text-slate-400 block mb-0.5">Entry Salary</span>
            <span className="text-xs sm:text-sm font-mono font-bold text-sky-600 dark:text-sky-400">₹12–25 LPA</span>
          </div>

          <div className="p-2.5 rounded-lg bg-white/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/5 text-center">
            <span className="text-[9px] font-mono uppercase text-slate-400 block mb-0.5">Senior Salary</span>
            <span className="text-xs sm:text-sm font-mono font-bold text-sky-600 dark:text-sky-400">₹40–80 LPA</span>
          </div>

          <div className="p-2.5 rounded-lg bg-white/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/5 text-center">
            <span className="text-[9px] font-mono uppercase text-slate-400 block mb-0.5">Market Demand</span>
            <span className="text-xs sm:text-sm font-mono font-bold text-slate-900 dark:text-white">Very High</span>
          </div>

          <div className="p-2.5 rounded-lg bg-white/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/5 text-center">
            <span className="text-[9px] font-mono uppercase text-slate-400 block mb-0.5">AI-Resilience</span>
            <span className="text-xs sm:text-sm font-mono font-bold text-teal-600 dark:text-teal-400">75/100</span>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 4. EXPANDABLE SECTION (OPTION TO EXPAND FULL REPORT)      */}
      {/* ========================================================= */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pt-6 space-y-5">
              
              {/* Internal Connecting Conduit */}
              <div className="flex flex-col items-center my-2">
                <div className="w-0.5 h-6 bg-gradient-to-b from-sky-500 to-teal-500" />
              </div>

              {/* 2x2 Detailed Modules Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Module 1: A Day In The Life */}
                <div className="p-4 sm:p-5 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-xs">
                  <h4 className="font-serif font-bold text-slate-950 dark:text-white text-sm mb-2">
                    A day in the life
                  </h4>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                    Writing clean, scalable code and participating in agile sprint planning. Debugging complex system issues and collaborating with product managers to translate requirements into functional features.
                  </p>

                  <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-white/5">
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-sky-700 dark:text-sky-400 block mb-0.5">
                        WHAT YOU&apos;LL LOVE
                      </span>
                      <p className="text-slate-700 dark:text-slate-300 leading-snug">
                        The ability to build tools that impact millions (Social Impact) and the intellectual satisfaction of solving hard technical puzzles.
                      </p>
                    </div>

                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400 block mb-0.5">
                        POSSIBLE CHALLENGES
                      </span>
                      <p className="text-slate-700 dark:text-slate-300 leading-snug">
                        Rapidly evolving tech stacks requiring constant upskilling and the pressure of tight deployment deadlines.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Module 2: Growth & Salary */}
                <div className="p-4 sm:p-5 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-xs flex flex-col justify-between">
                  <div>
                    <h4 className="font-serif font-bold text-slate-950 dark:text-white text-sm mb-1">
                      Growth &amp; salary
                    </h4>
                    <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 mb-3 pb-1.5 border-b border-slate-200 dark:border-white/5">
                      Software Engineer &rarr; Senior Engineer &rarr; Tech Lead &rarr; Software Architect
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 dark:text-slate-400">Market Demand:</span>
                        <span className="font-semibold text-slate-900 dark:text-white">Very High - Sustained Demand</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 dark:text-slate-400">AI-Resilience:</span>
                        <span className="font-mono font-bold text-sky-600 dark:text-sky-400">75/100 (Architecture remains human-centric)</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-200 dark:border-white/5 text-[10px] font-mono text-slate-500 dark:text-slate-400">
                    Salary benchmark: ₹12–25 LPA (Entry) &rarr; ₹40–80 LPA (Senior)
                  </div>
                </div>

                {/* Module 3: Education Path */}
                <div className="p-4 sm:p-5 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-xs">
                  <h4 className="font-serif font-bold text-slate-950 dark:text-white text-sm mb-1.5">
                    Education path
                  </h4>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-2.5">
                    Specialized Certifications in Cloud (AWS/Azure/GCP) or M.Tech in Computer Science/AI for deep specialization.
                  </p>

                  <div className="mb-2.5">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 block mb-1">
                      ALTERNATE PATHWAYS
                    </span>
                    <ul className="text-slate-600 dark:text-slate-300 space-y-1 list-disc pl-4 text-[11px]">
                      <li>Intensive Full-Stack Bootcamps for immediate industry readiness</li>
                      <li>Open Source contributions to build a public portfolio for direct hiring</li>
                    </ul>
                  </div>

                  <div className="pt-2 border-t border-slate-200 dark:border-white/5 flex items-center gap-1.5">
                    <span className="text-[10px] font-mono text-slate-400">Exams:</span>
                    <span className="px-1.5 py-0.5 rounded bg-white dark:bg-white/5 text-[10px] font-mono font-bold">GATE</span>
                    <span className="px-1.5 py-0.5 rounded bg-white dark:bg-white/5 text-[10px] font-mono font-bold">LeetCode Assessments</span>
                  </div>
                </div>

                {/* Module 4: Your First Three Moves */}
                <div className="p-4 sm:p-5 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-xs">
                  <h4 className="font-serif font-bold text-slate-950 dark:text-white text-sm mb-1">
                    Your first three moves
                  </h4>
                  <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400 mb-2.5">
                    Highest-leverage actions to close the gap toward this role
                  </p>

                  <div className="space-y-1.5">
                    <div className="flex items-start gap-2 p-1.5 rounded-lg bg-white dark:bg-white/5">
                      <span className="px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-700 dark:text-sky-400 font-mono text-[10px] font-black">01</span>
                      <p className="text-[11px] text-slate-800 dark:text-slate-200 leading-snug">Build and deploy 2 full-stack applications on GitHub</p>
                    </div>

                    <div className="flex items-start gap-2 p-1.5 rounded-lg bg-white dark:bg-white/5">
                      <span className="px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-700 dark:text-sky-400 font-mono text-[10px] font-black">02</span>
                      <p className="text-[11px] text-slate-800 dark:text-slate-200 leading-snug">Master Data Structures and Algorithms (DSA) for technical interviews</p>
                    </div>

                    <div className="flex items-start gap-2 p-1.5 rounded-lg bg-white dark:bg-white/5">
                      <span className="px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-700 dark:text-sky-400 font-mono text-[10px] font-black">03</span>
                      <p className="text-[11px] text-slate-800 dark:text-slate-200 leading-snug">Contribute to a major open-source project to demonstrate collaborative coding</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* 5. TOGGLE BUTTON (EXPAND / COLLAPSE)                      */}
      {/* ========================================================= */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full mt-4 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200/80 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-center gap-2 transition-all shadow-xs group"
      >
        <span>
          {isExpanded ? "Collapse Career Deep-Dive" : "Expand Full Career Deep-Dive (Day in Life, Education, First Moves)"}
        </span>
        <ChevronDown 
          className={`w-3.5 h-3.5 text-sky-500 transition-transform duration-300 ${
            isExpanded ? "rotate-180" : ""
          }`} 
        />
      </button>

    </div>
  );
}
