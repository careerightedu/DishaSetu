"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  MapPin, 
  CheckCircle2, 
  XCircle, 
  ZoomIn, 
  FileText, 
  Play, 
  Pause, 
  RotateCcw,
  Target,
  ArrowRight,
  ShieldAlert,
  Award,
  Briefcase,
  Layers,
  ChevronDown
} from "lucide-react";

interface Props {
  onZoomPdf?: () => void;
}

interface RoadmapMilestone {
  id: string;
  stage: string;
  timeframe: string;
  title: string;
  subtitle: string;
  deliverable: string;
  skillsGained: string[];
  status: "completed" | "current" | "upcoming";
  xp: string;
}

const MILESTONES: RoadmapMilestone[] = [
  {
    id: "now",
    stage: "NOW",
    timeframe: "Day 0",
    title: "Assessment & Cognitive Profiling",
    subtitle: "35-trait psychometric & aptitude fingerprint mapped. Core strengths, cognitive style, and work values locked in.",
    deliverable: "15-page calibrated intelligence dossier with rank-ordered career viability and explicit mismatch eliminations.",
    skillsGained: ["Self-Awareness", "Cognitive Profiling", "Data-Backed Clarity"],
    status: "completed",
    xp: "+500 XP",
  },
  {
    id: "m1",
    stage: "Month 1",
    timeframe: "Months 1–2",
    title: "Skill Foundation & Design Thinking",
    subtitle: "Audit Design Thinking & Human-Computer Interaction frameworks. Set up engineering dev stacks and clean architecture fundamentals.",
    deliverable: "Git repository initialization, foundational software architecture roadmap, first module breakdown.",
    skillsGained: ["Design Thinking", "Git Workflow", "REST APIs", "Clean Architecture"],
    status: "current",
    xp: "+1,200 XP",
  },
  {
    id: "m6",
    stage: "Month 6",
    timeframe: "Months 3–6",
    title: "First High-Leverage Portfolio",
    subtitle: "Build and deploy 2 production full-stack web applications solving real community and product problems.",
    deliverable: "Live publicly hosted portfolio on GitHub with end-to-end case studies and active user analytics.",
    skillsGained: ["Full-Stack Dev", "Database Design", "CI/CD Deployment", "Open Source"],
    status: "upcoming",
    xp: "+2,500 XP",
  },
  {
    id: "y1",
    stage: "Year 1",
    timeframe: "Year 1",
    title: "Target Tech Internship",
    subtitle: "Secure product engineering or creative tech internship at high-growth venture or Tier-1 engineering firm.",
    deliverable: "Shipped features in production, verified mentor recommendations, and real sprint contribution history.",
    skillsGained: ["Agile Sprints", "Code Reviews", "Production Debugging", "Team Sync"],
    status: "upcoming",
    xp: "+3,500 XP",
  },
  {
    id: "y2",
    stage: "Year 2",
    timeframe: "Year 2",
    title: "Specialization & Systems Scale",
    subtitle: "Deepen focus on distributed microservices, cloud infrastructure (AWS/GCP), and generative AI-tooling integration.",
    deliverable: "Module ownership: architecting services handling concurrent requests with automated failover.",
    skillsGained: ["Distributed Systems", "Cloud Scale", "PostgreSQL Optimization", "AI Integration"],
    status: "upcoming",
    xp: "+5,000 XP",
  },
  {
    id: "y3",
    stage: "Year 3",
    timeframe: "Year 3",
    title: "Target Career: Software & App Lead",
    subtitle: "Graduate directly into high-tier Product Engineer / SDE role (₹12–25 LPA to ₹40–80 LPA Staff Architect trajectory).",
    deliverable: "Full-time placement in Tier-1 product org; clear 5-year technical leadership milestone plan.",
    skillsGained: ["System Architecture", "Technical Strategy", "Mentorship", "Autonomous Delivery"],
    status: "upcoming",
    xp: "+10,000 XP",
  },
];

interface EliminatedCareer {
  title: string;
  mismatchScore: string;
  primaryClash: string;
  reason: string;
  savedYears: string;
}

const ELIMINATED_CAREERS: EliminatedCareer[] = [
  {
    title: "Chartered Accountancy (CA)",
    mismatchScore: "-46% Alignment",
    primaryClash: "Rigid Compliance vs High Divergent Creativity",
    reason: "Your cognitive profile shows high need for autonomous experimentation and creative problem solving. CA requires 100% adherence to regulatory tax codes and repetitive auditing with zero room for divergent exploration.",
    savedYears: "Saved 4–5 years",
  },
  {
    title: "Medical Doctor (MBBS/MD)",
    mismatchScore: "-58% Alignment",
    primaryClash: "10-Year Clinical Lock-in vs Wealth & Early Velocity",
    reason: "Your Work Values prioritize high early earning velocity and technology leverage. Medicine requires a 10–12 year training pipeline with delayed ROI and high emotional exhaustion friction.",
    savedYears: "Saved 6–8 years",
  },
  {
    title: "Corporate Litigation Law",
    mismatchScore: "-38% Alignment",
    primaryClash: "Contractual Dispute vs Systems/Product Building",
    reason: "You thrive when building tangible systems that scale. Corporate litigation focuses on conflict mediation and statute interpretation rather than engineering constructive software products.",
    savedYears: "Saved 3–5 years",
  },
];

export default function ReportPage11InteractiveRoadmap({ onZoomPdf }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewPdf, setViewPdf] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"roadmap" | "eliminations">("roadmap");
  const [activeIndex, setActiveIndex] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Link scroll progress across this grand roadmap container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 70%", "end 40%"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 26,
    restDelta: 0.001,
  });

  // Dynamically update active node based on page scroll
  useEffect(() => {
    const unsubscribe = smoothProgress.on("change", (latest) => {
      if (!isPlaying) {
        const computedIndex = Math.min(
          MILESTONES.length - 1,
          Math.max(0, Math.floor(latest * MILESTONES.length))
        );
        setActiveIndex(computedIndex);
      }
    });
    return () => unsubscribe();
  }, [smoothProgress, isPlaying]);

  // Autoplay walkthrough timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % MILESTONES.length);
      }, 2600);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  return (
    <div 
      ref={containerRef}
      className="w-full rounded-3xl bg-white dark:bg-[#07131e] text-slate-900 dark:text-white border-2 border-sky-500/30 dark:border-sky-500/20 shadow-2xl overflow-hidden transition-all text-left"
    >
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 sm:px-8 py-5 bg-slate-50 dark:bg-black/40 border-b border-slate-200 dark:border-white/10 text-xs">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-amber-600 dark:text-amber-400 font-bold block mb-1">
            Sample Dossier • Report Pages 11 &amp; 13
          </span>
          <h4 className="text-base sm:text-xl font-serif font-bold text-slate-900 dark:text-white flex items-center gap-2.5 flex-wrap">
            <span>Sequenced 3-Year Execution Plan</span>
            <span className="text-[11px] font-mono font-bold text-teal-600 dark:text-teal-400 bg-teal-500/10 px-2.5 py-0.5 rounded-full border border-teal-500/30">
              From Here To A Job Offer
            </span>
          </h4>
        </div>

        {/* View Switcher: Interactive vs PDF */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setViewPdf(false)}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all flex items-center gap-1.5 ${
              !viewPdf
                ? "bg-white dark:bg-teal-500 text-slate-900 dark:text-slate-950 shadow-sm border border-slate-200 dark:border-transparent font-bold"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-500 dark:text-slate-950" />
            <span>Interactive</span>
          </button>
          <button
            onClick={() => setViewPdf(true)}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all flex items-center gap-1.5 ${
              viewPdf
                ? "bg-white dark:bg-teal-500 text-slate-900 dark:text-slate-950 shadow-sm border border-slate-200 dark:border-transparent font-bold"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
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
            src="/report/execution-plan.png"
            alt="Execution Plan Static Report Page"
            fill
            unoptimized
            quality={100}
            className="object-contain p-4 transition-transform duration-300 group-hover:scale-[1.02]"
          />
          <div className="absolute top-4 right-4 px-3.5 py-1.5 rounded-full bg-black/75 border border-white/15 text-white text-xs font-medium backdrop-blur-md flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
            <ZoomIn className="w-3.5 h-3.5 text-teal-400" />
            <span>Click to Fullscreen Zoom</span>
          </div>
          <div className="absolute bottom-4 left-4 right-4 px-4 py-2.5 rounded-xl bg-slate-950/85 border border-white/10 text-white text-xs backdrop-blur-md flex items-center justify-between">
            <span className="text-slate-300">High-Resolution PDF Pages 11 &amp; 13</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setViewPdf(false);
              }}
              className="text-teal-400 hover:underline font-bold"
            >
              Switch to Live Interactive Roadmap ↑
            </button>
          </div>
        </div>
      ) : (
        /* Interactive Roadmap View */
        <div className="p-4 sm:p-8 md:p-10 space-y-6 sm:space-y-8">
          
          {/* Main Mode Tabs & Playback Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-white/10 pb-5">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setActiveTab("roadmap")}
                className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 ${
                  activeTab === "roadmap"
                    ? "bg-slate-900 text-white dark:bg-sky-500 dark:text-slate-950 shadow-md"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>3-Year Visual Roadmap</span>
              </button>
              <button
                onClick={() => setActiveTab("eliminations")}
                className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 ${
                  activeTab === "eliminations"
                    ? "bg-red-600 text-white dark:bg-red-500 dark:text-white shadow-md"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <XCircle className="w-4 h-4 text-red-500 dark:text-white" />
                <span>Career Eliminations (Page 13)</span>
              </button>
            </div>

            {activeTab === "roadmap" && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-800 dark:text-slate-200 text-xs font-mono font-bold flex items-center gap-2 transition-colors border border-slate-200 dark:border-white/10 shadow-xs"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-3.5 h-3.5 text-amber-500" />
                      <span>Pause</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 text-sky-500" />
                      <span>Auto-Play</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setIsPlaying(false);
                    setActiveIndex(0);
                  }}
                  className="p-2 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                  title="Reset to Day 0"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {activeTab === "roadmap" ? (
            /* GRAND EXPANSIVE ROADMAP: TALL VERTICAL CIRCUIT WITH EXTENDED CONNECTIONS */
            <div className="relative">
              
              {/* Central Glowing Vertical Spine Line that draws on scroll */}
              <div className="absolute left-4 sm:left-8 top-8 bottom-8 w-1 bg-slate-200 dark:bg-white/10 rounded-full" />
              
              <motion.div
                className="absolute left-4 sm:left-8 top-8 w-1 bg-gradient-to-b from-sky-500 via-teal-400 to-cyan-400 rounded-full origin-top shadow-[0_0_12px_rgba(14,165,233,0.5)]"
                style={{
                  height: `${((activeIndex + 0.5) / MILESTONES.length) * 100}%`,
                }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              />

              {/* Stack of All 6 Milestones Spaced Out Generously */}
              <div className="space-y-8 sm:space-y-12 relative pl-10 sm:pl-20">
                {MILESTONES.map((milestone, idx) => {
                  const isCurrent = activeIndex === idx;
                  const isPassed = activeIndex >= idx;

                  return (
                    <motion.div
                      key={milestone.id}
                      onClick={() => {
                        setIsPlaying(false);
                        setActiveIndex(idx);
                      }}
                      className={`relative cursor-pointer transition-all duration-300 rounded-2xl sm:rounded-3xl p-5 sm:p-8 border-2 ${
                        isCurrent
                          ? "bg-sky-50/70 dark:bg-sky-950/20 border-sky-500 shadow-xl shadow-sky-500/10 scale-[1.01]"
                          : isPassed
                          ? "bg-white dark:bg-[#07131e] border-slate-200 dark:border-white/10 hover:border-sky-500/30"
                          : "bg-slate-50/60 dark:bg-white/[0.02] border-slate-200/60 dark:border-white/5 opacity-70 hover:opacity-100"
                      }`}
                    >
                      {/* Node Bubble on the Vertical Spine */}
                      <div className="absolute -left-10 sm:-left-20 top-7 -translate-x-1/2 z-10">
                        <motion.div
                          animate={{
                            scale: isCurrent ? 1.35 : 1,
                            backgroundColor: isPassed ? "#0ea5e9" : "#475569",
                          }}
                          transition={{ duration: 0.25 }}
                          className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center border-3 sm:border-4 border-white dark:border-[#07131e] shadow-lg shadow-sky-500/20 text-white"
                        >
                          {isPassed ? (
                            <CheckCircle2 className="w-4 h-4 stroke-[3]" />
                          ) : (
                            <span className="w-2 h-2 rounded-full bg-white/70" />
                          )}
                        </motion.div>

                        {/* Pulsing Ripple if Currently Active */}
                        {isCurrent && (
                          <span className="absolute -inset-2 rounded-full bg-sky-500/40 animate-ping pointer-events-none" />
                        )}
                      </div>

                      {/* Top Meta Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3">
                        <div className="flex items-center gap-2.5">
                          <span className="px-3 py-1 rounded-full bg-sky-500/15 border border-sky-500/30 text-sky-700 dark:text-sky-400 text-xs font-mono font-bold uppercase tracking-wider">
                            {milestone.stage} • {milestone.timeframe}
                          </span>
                          {isCurrent && (
                            <motion.span
                              initial={{ opacity: 0, x: -6 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="px-2.5 py-0.5 rounded-full bg-sky-500 text-slate-950 text-[10px] font-black uppercase font-mono tracking-wider shadow-sm"
                            >
                              YOU ARE HERE →
                            </motion.span>
                          )}
                        </div>

                        <span className="text-xs font-mono font-bold text-teal-600 dark:text-teal-400 self-start sm:self-auto">
                          {milestone.xp}
                        </span>
                      </div>

                      {/* Main Title & Description */}
                      <h4 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 dark:text-white mb-2">
                        {milestone.title}
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-[#9bb0be] leading-relaxed mb-5">
                        {milestone.subtitle}
                      </p>

                      {/* Deliverable Box */}
                      <div className="p-4 rounded-2xl bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 text-xs sm:text-sm space-y-1 mb-4 shadow-2xs">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold block">
                          Verified Tangible Deliverable:
                        </span>
                        <p className="font-semibold text-slate-900 dark:text-white">
                          {milestone.deliverable}
                        </p>
                      </div>

                      {/* Compounded Skills Pills */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold mr-1">
                          Skills Compounded:
                        </span>
                        {milestone.skillsGained.map((skill) => (
                          <span
                            key={skill}
                            className="px-2.5 py-1 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-700 dark:text-sky-300 text-xs font-mono font-medium"
                          >
                            ✓ {skill}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

            </div>
          ) : (
            /* Career Eliminations Tab (Report Page 13) */
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div className="p-5 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldAlert className="w-5 h-5 text-red-500" />
                  <span className="text-sm font-mono font-bold uppercase tracking-wider text-red-700 dark:text-red-300">
                    Why We Tell You What NOT To Do (Report Page 13)
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-red-900/80 dark:text-[#b8a2a2] leading-relaxed">
                  Career counseling that only recommends careers creates confirmation bias. WhatAfter filters 900+ careers through your psychometric constraints to eliminate high-prestige but high-burnout misfits:
                </p>
              </div>

              <div className="space-y-3">
                {ELIMINATED_CAREERS.map((elim) => (
                  <div
                    key={elim.title}
                    className="p-5 rounded-2xl bg-slate-50 dark:bg-[#061019] border border-slate-200 dark:border-white/10 hover:border-red-500/30 transition-all text-xs sm:text-sm space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <XCircle className="w-5 h-5 text-red-500 shrink-0" />
                        <span className="font-bold text-slate-900 dark:text-white text-base">
                          {elim.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono text-sky-600 dark:text-sky-400 bg-sky-500/10 px-2.5 py-0.5 rounded-full border border-sky-500/20">
                          {elim.savedYears}
                        </span>
                        <span className="text-[11px] font-mono font-bold text-red-600 dark:text-red-400 bg-red-500/10 px-2.5 py-0.5 rounded-full border border-red-500/20">
                          {elim.mismatchScore}
                        </span>
                      </div>
                    </div>

                    <div className="text-xs font-semibold text-red-600 dark:text-red-400">
                      Core Clash: {elim.primaryClash}
                    </div>

                    <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
                      {elim.reason}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

        </div>
      )}
    </div>
  );
}
