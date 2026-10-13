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
    scope: "Writing modular code, agile sprint shipping, debugging services & API integration.",
    keySkills: ["Full-Stack Dev", "Git Workflows", "REST APIs", "Unit Testing"],
  },
  {
    id: "senior_dev",
    title: "Senior Engineer",
    shortTitle: "Senior SDE",
    years: "3–5 Years",
    salary: "₹25–40 LPA",
    progress: 50,
    scope: "Owning core backend modules, microservices, database tuning & CI/CD automation.",
    keySkills: ["Distributed Systems", "PostgreSQL Tuning", "Cloud Infra (AWS/GCP)", "Code Audits"],
  },
  {
    id: "tech_lead",
    title: "Tech Lead",
    shortTitle: "Tech Lead",
    years: "5–8 Years",
    salary: "₹35–55 LPA",
    progress: 75,
    scope: "Sprint architecture, team mentorship, high-availability SLAs & product alignment.",
    keySkills: ["System Architecture", "Team Mentorship", "Resilience Design", "Cross-Squad Sync"],
  },
  {
    id: "architect",
    title: "Software Architect",
    shortTitle: "Architect",
    years: "8+ Years",
    salary: "₹40–80 LPA",
    progress: 100,
    scope: "Multi-region distributed systems, enterprise technical roadmap & security standards.",
    keySkills: ["Enterprise Scalability", "Disaster Recovery", "Tech Strategy", "CapEx/OpEx Trade-offs"],
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
            Sample Dossier • Report Page 07
          </span>
          <h4 className="text-sm sm:text-base font-serif font-bold text-slate-900 dark:text-white flex items-center gap-2 flex-wrap">
            <span>Software &amp; Application Development</span>
            <span className="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
              Rank #2 • 94% Match
            </span>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-teal-500/10 border border-teal-500/25 text-[10px] font-mono text-teal-600 dark:text-teal-400 font-bold">
              <span className={`w-1.5 h-1.5 rounded-full bg-teal-500 ${isHovered ? "" : "animate-ping"}`} />
              <span>{isHovered ? "Paused" : "Live Ladder Projection"}</span>
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
              className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                activeTab === "salary"
                  ? "bg-slate-900 text-white dark:bg-emerald-500 dark:text-slate-950 shadow-sm"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Growth &amp; Salary</span>
            </button>
            <button
              onClick={() => setActiveTab("ai")}
              className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                activeTab === "ai"
                  ? "bg-slate-900 text-white dark:bg-emerald-500 dark:text-slate-950 shadow-sm"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>AI-Resilience (75/100)</span>
            </button>
            <button
              onClick={() => setActiveTab("moves")}
              className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                activeTab === "moves"
                  ? "bg-slate-900 text-white dark:bg-emerald-500 dark:text-slate-950 shadow-sm"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>First 3 Moves</span>
            </button>
          </div>

          {/* TAB 1: Growth & Salary Progression Ladder */}
          {activeTab === "salary" && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-3.5"
            >
              {/* Interactive Ladder Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {CAREER_LADDER.map((lvl) => {
                  const isActive = activeLevelId === lvl.id;
                  return (
                    <button
                      key={lvl.id}
                      onClick={() => setActiveLevelId(lvl.id)}
                      className={`p-2 rounded-xl text-left transition-all border ${
                        isActive
                          ? "bg-emerald-500/10 border-emerald-500 dark:border-emerald-400 text-slate-950 dark:text-white shadow-sm"
                          : "bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-white/15"
                      }`}
                    >
                      <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        {lvl.years}
                      </div>
                      <div className="font-semibold text-xs truncate">
                        {lvl.shortTitle}
                      </div>
                      <div className="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                        {lvl.salary}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Animated Progress Bar */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#061019] border border-slate-200 dark:border-white/10 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white text-sm">
                      {activeLevel.title}
                    </span>
                    <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400">
                      ({activeLevel.years})
                    </span>
                  </div>
                  <div className="font-mono font-black text-emerald-600 dark:text-emerald-400 text-sm">
                    {activeLevel.salary}
                  </div>
                </div>

                <div className="w-full h-2.5 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 rounded-full"
                    animate={{ width: `${activeLevel.progress}%` }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                  />
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {activeLevel.scope}
                </p>

                {/* Key Skills Tags */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Required Skills:</span>
                  {activeLevel.keySkills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-0.5 rounded-md bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[11px] font-mono font-medium text-slate-700 dark:text-slate-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Day in the Life preview snippet */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                  <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold mb-1">
                    <Heart className="w-3.5 h-3.5" />
                    <span>What You&apos;ll Love</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-snug">
                    Building tools that impact millions &amp; the intellectual thrill of solving hard technical puzzles.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                  <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-bold mb-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Known Challenges</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-snug">
                    Rapidly shifting framework standards &amp; sprint deployment deadlines requiring constant upskilling.
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
              className="space-y-3.5"
            >
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#061019] border border-slate-200 dark:border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block">
                      Labor Market Vulnerability Score
                    </span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-teal-500" />
                      <span>75 / 100 • Sustained High Demand</span>
                    </span>
                  </div>
                  <div className="px-2.5 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-600 dark:text-teal-400 text-xs font-mono font-bold">
                    Strong Human Moat
                  </div>
                </div>

                <div className="w-full h-2.5 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden mb-3">
                  <div className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full w-[75%]" />
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Generative AI heavily automates routine boilerplate code and basic CRUD scaffolding, but <b className="text-slate-900 dark:text-white">high-level system design</b>, distributed consensus, failure orchestration, and human-centric product trade-offs remain firmly in human hands.
                </p>
              </div>

              {/* Moat vs Automated Comparison */}
              <div className="grid sm:grid-cols-2 gap-2.5 text-xs">
                <div className="p-3.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                  <div className="font-bold text-emerald-700 dark:text-emerald-400 mb-1.5 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Protected Human Moat (75%)</span>
                  </div>
                  <ul className="space-y-1 text-slate-600 dark:text-slate-300 text-[11px]">
                    <li>• Distributed architecture &amp; high availability</li>
                    <li>• Translating vague business needs to tech specs</li>
                    <li>• Security audits, data privacy &amp; resilience</li>
                  </ul>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                  <div className="font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>AI-Accelerated Tasks (25%)</span>
                  </div>
                  <ul className="space-y-1 text-slate-500 dark:text-slate-400 text-[11px]">
                    <li>• Writing repetitive boilerplate &amp; schema stubs</li>
                    <li>• Generating synthetic test datasets</li>
                    <li>• Syntax conversion across languages</li>
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
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                  Verified Action Plan (Report Page 07)
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Click the milestones below to track your execution readiness:
                </p>
              </div>

              {[
                {
                  id: 0,
                  num: "01",
                  title: "Build and deploy 2 full-stack applications on GitHub",
                  desc: "Demonstrates end-to-end capability: user authentication, relational database, external APIs, and live production deployment.",
                },
                {
                  id: 1,
                  num: "02",
                  title: "Master Data Structures & Algorithms (DSA) for technical rounds",
                  desc: "Systematic mastery of arrays, graphs, dynamic programming, and space/time complexity analysis for top-tier product screenings.",
                },
                {
                  id: 2,
                  num: "03",
                  title: "Contribute to a major open-source collaborative project",
                  desc: "Validates code review adherence, git branch etiquette, and collaboration within large existing codebases.",
                },
              ].map((move) => {
                const isDone = !!completedMoves[move.id];
                return (
                  <div
                    key={move.id}
                    onClick={() => toggleMove(move.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                      isDone
                        ? "bg-emerald-500/5 border-emerald-500/30 text-slate-900 dark:text-white"
                        : "bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-white/15"
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {isDone ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-400 dark:text-slate-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                          Step {move.num}
                        </span>
                        <h5 className={`text-xs font-bold ${isDone ? "line-through text-slate-500 dark:text-slate-400" : ""}`}>
                          {move.title}
                        </h5>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
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
