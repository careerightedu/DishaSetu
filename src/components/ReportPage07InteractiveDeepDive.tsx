"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  TrendingUp, 
  ShieldCheck, 
  CheckCircle2, 
  Circle,
  ZoomIn, 
  FileText,
  Briefcase,
  Layers,
  ArrowRight,
  Code2,
  Clock,
  Heart,
  AlertTriangle,
  ChevronRight
} from "lucide-react";

interface Props {
  onZoomPdf?: () => void;
}

type CareerLevelId = "entry" | "senior_dev" | "tech_lead" | "architect";

interface CareerLevel {
  id: CareerLevelId;
  title: string;
  shortTitle: string;
  years: string;
  salary: string;
  progress: number;
  scope: string;
  keySkills: string[];
}

const CAREER_LADDER: CareerLevel[] = [
  {
    id: "entry",
    title: "Software Engineer",
    shortTitle: "SDE 1",
    years: "0–2 Years",
    salary: "₹12–25 LPA",
    progress: 25,
    scope: "Build new features, fix bugs, and connect web applications.",
    keySkills: ["Web Development", "Git & APIs", "Problem Solving"],
  },
  {
    id: "senior_dev",
    title: "Senior Engineer",
    shortTitle: "Senior SDE",
    years: "3–5 Years",
    salary: "₹25–40 LPA",
    progress: 50,
    scope: "Lead core feature development, optimize databases, and launch reliable services.",
    keySkills: ["Backend Systems", "Databases", "Cloud Setup"],
  },
  {
    id: "tech_lead",
    title: "Tech Lead",
    shortTitle: "Tech Lead",
    years: "5–8 Years",
    salary: "₹35–55 LPA",
    progress: 75,
    scope: "Guide the engineering team, design system architecture, and plan sprints.",
    keySkills: ["System Design", "Team Mentorship", "Sprint Planning"],
  },
  {
    id: "architect",
    title: "Software Architect",
    shortTitle: "Architect",
    years: "8+ Years",
    salary: "₹40–80 LPA",
    progress: 100,
    scope: "Set long-term tech strategy, cloud scale, and company security standards.",
    keySkills: ["Large Scale Systems", "Tech Strategy", "Security"],
  },
];

export default function ReportPage07InteractiveDeepDive({ onZoomPdf }: Props) {
  const [viewPdf, setViewPdf] = useState<boolean>(false);
  const [activeLevelId, setActiveLevelId] = useState<CareerLevelId>("entry");
  const [activeTab, setActiveTab] = useState<"salary" | "ai" | "moves">("salary");
  const [completedMoves, setCompletedMoves] = useState<Record<number, boolean>>({ 0: true });
  const [isHovered, setIsHovered] = useState<boolean>(false);

  // Auto-cycle through career levels automatically when not hovered
  useEffect(() => {
    if (isHovered || viewPdf) return;
    const interval = setInterval(() => {
      setActiveLevelId((current) => {
        const currentIndex = CAREER_LADDER.findIndex((l) => l.id === current);
        const nextIndex = (currentIndex + 1) % CAREER_LADDER.length;
        return CAREER_LADDER[nextIndex].id;
      });
    }, 3200);
    return () => clearInterval(interval);
  }, [isHovered, viewPdf]);

  const activeLevel = CAREER_LADDER.find((l) => l.id === activeLevelId) || CAREER_LADDER[0];

  const toggleMove = (index: number) => {
    setCompletedMoves((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="w-full rounded-2xl bg-white dark:bg-[#07131e] text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 shadow-xl overflow-hidden transition-all"
    >
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3.5 bg-slate-50 dark:bg-black/40 border-b border-slate-200 dark:border-white/10 text-xs">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-teal-600 dark:text-teal-400 font-bold block mb-0.5">
            Sample Report • Page 07
          </span>
          <h4 className="text-sm sm:text-base font-serif font-bold text-slate-900 dark:text-white flex items-center gap-2 flex-wrap">
            <span>Software &amp; Technology Careers</span>
            <span className="text-[11px] font-mono font-bold text-sky-600 dark:text-sky-400 bg-sky-500/10 px-2.5 py-0.5 rounded-full border border-sky-500/30">
              Rank #1 • 94% Match
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-500/10 border border-teal-500/25 text-[11px] font-mono text-teal-600 dark:text-teal-400 font-semibold">
              <span className={`w-1.5 h-1.5 rounded-full bg-teal-500 ${isHovered ? "" : "animate-ping"}`} />
              <span>{isHovered ? "Paused" : "Auto-Preview"}</span>
            </span>
          </h4>
        </div>

        {/* View Switcher: Interactive vs PDF */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          <button
            onClick={() => setViewPdf(false)}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition-all flex items-center gap-1.5 ${
              !viewPdf
                ? "bg-white dark:bg-teal-500 text-slate-900 dark:text-slate-950 shadow-sm border border-slate-200 dark:border-transparent font-bold"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Sparkles className="w-3 h-3 text-teal-500 dark:text-slate-950" />
            <span>Interactive</span>
          </button>
          <button
            onClick={() => setViewPdf(true)}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition-all flex items-center gap-1.5 ${
              viewPdf
                ? "bg-white dark:bg-teal-500 text-slate-900 dark:text-slate-950 shadow-sm border border-slate-200 dark:border-transparent font-bold"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <FileText className="w-3 h-3" />
            <span>Static PDF</span>
          </button>
        </div>
      </div>

      {viewPdf ? (
        /* Static PDF View */
        <div
          onClick={onZoomPdf}
          className="relative aspect-[4/3] w-full bg-slate-100 dark:bg-[#061019] cursor-zoom-in group overflow-hidden"
        >
          <Image
            src="/report/career-deep-dive.png"
            alt="Career Deep-Dive Static Report Page"
            fill
            unoptimized
            quality={100}
            className="object-contain p-3 transition-transform duration-300 group-hover:scale-[1.02]"
          />
          <div className="absolute top-3 right-3 px-3 py-1.5 rounded-full bg-black/75 border border-white/15 text-white text-xs font-medium backdrop-blur-md flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
            <ZoomIn className="w-3.5 h-3.5 text-teal-400" />
            <span>Click to Fullscreen Zoom</span>
          </div>
          <div className="absolute bottom-3 left-3 right-3 px-3 py-2 rounded-xl bg-slate-950/85 border border-white/10 text-white text-[11px] backdrop-blur-md flex items-center justify-between">
            <span className="text-slate-300">High-Resolution PDF Page 07</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setViewPdf(false);
              }}
              className="text-teal-400 hover:underline font-bold"
            >
              Switch to Live Interactive Deep-Dive ↑
            </button>
          </div>
        </div>
      ) : (
        /* Interactive Career Intelligence Deep-Dive View */
        <div className="p-4 sm:p-5 space-y-4">
          
          {/* Subtabs for exploring aspects */}
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-3 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab("salary")}
              className={`shrink-0 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === "salary"
                  ? "bg-slate-900 text-white dark:bg-sky-500 dark:text-slate-950 shadow-sm font-bold"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Growth &amp; Salaries</span>
            </button>
            <button
              onClick={() => setActiveTab("ai")}
              className={`shrink-0 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === "ai"
                  ? "bg-slate-900 text-white dark:bg-sky-500 dark:text-slate-950 shadow-sm font-bold"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>AI Safety Score (75/100)</span>
            </button>
            <button
              onClick={() => setActiveTab("moves")}
              className={`shrink-0 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === "moves"
                  ? "bg-slate-900 text-white dark:bg-sky-500 dark:text-slate-950 shadow-sm font-bold"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>First 3 Action Steps</span>
            </button>
          </div>

          {/* TAB 1: Growth & Salary Progression Ladder */}
          {activeTab === "salary" && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {/* Interactive Ladder Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {CAREER_LADDER.map((lvl) => {
                  const isActive = activeLevelId === lvl.id;
                  return (
                    <button
                      key={lvl.id}
                      onClick={() => setActiveLevelId(lvl.id)}
                      className={`p-3 rounded-xl text-left transition-all border ${
                        isActive
                          ? "bg-sky-500/10 border-sky-500 dark:border-sky-400 text-slate-950 dark:text-white shadow-sm ring-1 ring-sky-500/30"
                          : "bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-white/15"
                      }`}
                    >
                      <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                        {lvl.years}
                      </div>
                      <div className="font-bold text-sm sm:text-base text-slate-900 dark:text-white truncate">
                        {lvl.shortTitle}
                      </div>
                      <div className="text-xs sm:text-sm font-mono font-bold text-sky-600 dark:text-sky-400 mt-1">
                        {lvl.salary}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Animated Progress Bar */}
              <div className="p-4 sm:p-5 rounded-xl bg-slate-50 dark:bg-[#061019] border border-slate-200 dark:border-white/10 space-y-3">
                <div className="flex items-center justify-between text-sm sm:text-base">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white text-base sm:text-lg">
                      {activeLevel.title}
                    </span>
                    <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                      ({activeLevel.years})
                    </span>
                  </div>
                  <div className="font-mono font-black text-sky-600 dark:text-sky-400 text-base sm:text-lg">
                    {activeLevel.salary}
                  </div>
                </div>

                <div className="w-full h-2.5 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-sky-500 via-teal-400 to-cyan-400 rounded-full"
                    animate={{ width: `${activeLevel.progress}%` }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                  />
                </div>

                <p className="text-sm sm:text-base text-slate-700 dark:text-slate-200 font-medium leading-relaxed">
                  {activeLevel.scope}
                </p>

                {/* Key Skills Tags */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-xs font-semibold text-slate-500">Core skills:</span>
                  {activeLevel.keySkills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 rounded-md bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-medium text-slate-800 dark:text-slate-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* What You'll Love & Challenges */}
              <div className="grid sm:grid-cols-2 gap-3 text-sm">
                <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                  <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold mb-1.5 text-sm sm:text-base">
                    <Heart className="w-4 h-4" />
                    <span>What You&apos;ll Love</span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
                    Building real apps used by millions &amp; solving satisfying real-world challenges.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
                  <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold mb-1.5 text-sm sm:text-base">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Known Challenges</span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
                    Keeping up with new tools and meeting sprint delivery deadlines.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: AI-Resilience Deep Dive */}
          {activeTab === "ai" && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div className="p-5 rounded-xl bg-slate-50 dark:bg-[#061019] border border-slate-200 dark:border-white/10 space-y-3">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div>
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-0.5">
                      AI Impact &amp; Safety Rating
                    </span>
                    <span className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      <span>75 / 100 • Safe &amp; In High Demand</span>
                    </span>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-bold">
                    Strong Human Advantage
                  </div>
                </div>

                <div className="w-full h-2.5 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full w-[75%]" />
                </div>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  AI speeds up repetitive starter code and simple tasks. However, <b className="text-slate-900 dark:text-white">creative problem solving</b>, real business decisions, system design, and security remain firmly in human hands.
                </p>
              </div>

              {/* Safe vs Accelerated Comparison */}
              <div className="grid sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                  <div className="font-bold text-emerald-700 dark:text-emerald-400 mb-2 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Safe From AI (75%)</span>
                  </div>
                  <ul className="space-y-1.5 text-slate-700 dark:text-slate-300">
                    <li>• Planning system architecture &amp; logic</li>
                    <li>• Turning user ideas into real products</li>
                    <li>• Data privacy, security, and reliability</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                  <div className="font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Sped Up by AI (25%)</span>
                  </div>
                  <ul className="space-y-1.5 text-slate-600 dark:text-slate-400">
                    <li>• Writing boilerplate starter code</li>
                    <li>• Catching typos and syntax bugs</li>
                    <li>• Generating preliminary test cases</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 3: First Three Moves Checklist */}
          {activeTab === "moves" && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-3"
            >
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#061019] border border-slate-200 dark:border-white/10">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-0.5">
                  Action Steps • Report Page 07
                </span>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                  Tap each step to track your starting plan:
                </p>
              </div>

              {[
                {
                  id: 0,
                  num: "01",
                  title: "Build & launch 2 real projects you can show off",
                  desc: "Create 2 full applications with login and a database so employers can see your real capability.",
                },
                {
                  id: 1,
                  num: "02",
                  title: "Master practical coding & interview basics",
                  desc: "Practice core programming fundamentals and common technical interview questions.",
                },
                {
                  id: 2,
                  num: "03",
                  title: "Collaborate on a real open-source project",
                  desc: "Work alongside other developers to learn professional code reviews and team workflows.",
                },
              ].map((move) => {
                const isDone = !!completedMoves[move.id];
                return (
                  <div
                    key={move.id}
                    onClick={() => toggleMove(move.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                      isDone
                        ? "bg-sky-500/5 border-sky-500/30 text-slate-900 dark:text-white"
                        : "bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-white/15"
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {isDone ? (
                        <CheckCircle2 className="w-5 h-5 text-sky-500" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-400 dark:text-slate-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[11px] font-mono font-bold text-sky-600 dark:text-sky-400">
                          Step {move.num}
                        </span>
                        <h5 className={`text-sm font-bold ${isDone ? "line-through text-slate-500 dark:text-slate-400" : ""}`}>
                          {move.title}
                        </h5>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-snug">
                        {move.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}

        </div>
      )}
    </div>
  );
}
