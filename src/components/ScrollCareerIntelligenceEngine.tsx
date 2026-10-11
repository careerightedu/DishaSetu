"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { 
  Cpu, 
  Palette, 
  Compass, 
  BrainCircuit, 
  CheckCircle2,
  ShieldCheck,
  TrendingUp,
  Target,
  Sparkles
} from "lucide-react";

export default function ScrollCareerIntelligenceEngine() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Link Framer Motion directly to page scroll through this container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 70%", "end 75%"],
  });

  // Step 1: Top trait nodes activate smoothly
  const step1Opacity = useTransform(scrollYProgress, [0, 0.15], [0.5, 1]);
  const step1Scale = useTransform(scrollYProgress, [0, 0.15], [0.98, 1]);

  // Connector 1: First set of large lines draw from Top Nodes to Central Hub
  const line1Progress = useTransform(scrollYProgress, [0.08, 0.40], [0, 1]);

  // Step 2: Central Cognitive Fingerprint awakens
  const hubOpacity = useTransform(scrollYProgress, [0.30, 0.52], [0.3, 1]);
  const hubScale = useTransform(scrollYProgress, [0.30, 0.52], [0.96, 1]);

  // Connector 2: Second set of large lines draw from Hub down to Career Matches
  const line2Progress = useTransform(scrollYProgress, [0.45, 0.76], [0, 1]);

  // Step 3: Career Output Matches reveal
  const careersOpacity = useTransform(scrollYProgress, [0.65, 0.88], [0.3, 1]);
  const careersScale = useTransform(scrollYProgress, [0.65, 0.88], [0.97, 1]);

  // Step 4: The 3-Year Roadmap Card slides in and unlocks
  const roadmapOpacity = useTransform(scrollYProgress, [0.78, 0.95], [0, 1]);
  const roadmapY = useTransform(scrollYProgress, [0.78, 0.95], [30, 0]);

  // Canonical sample data grounded strictly in WhatAfter's psychometric dataset & actual report outputs
  const traits = [
    {
      name: "Logical Reasoning",
      sub: "Algorithmic thinking, first-principles logic & structured decomposition",
      score: 88,
      icon: Cpu,
      color: "from-emerald-500 to-teal-400",
    },
    {
      name: "Investigative Inquiry",
      sub: "Scientific curiosity, empirical research & root-cause technical diagnostics",
      score: 84,
      icon: BrainCircuit,
      color: "from-teal-400 to-cyan-400",
    },
    {
      name: "Work Autonomy",
      sub: "Self-directed execution, deep asynchronous focus & low micromanagement",
      score: 82,
      icon: Target,
      color: "from-cyan-400 to-emerald-400",
    },
  ];

  const profile = {
    title: "The Systems Architect",
    code: "IRC • Investigative — Realistic — Conventional",
    summary: "Decomposes complex, ambiguous problem spaces into structured, reliable logic trees. Thrives in high-autonomy environments requiring first-principles technical depth, system reliability, and algorithmic precision.",
  };

  const careers = [
    {
      title: "Software & Application Development",
      match: 94,
      rank: "#1 Primary Fit",
      salary: "₹8–12 LPA Entry • ₹35–50 LPA Senior",
      domain: "Technology & Software Engineering",
      roles: "Software Engineers, Applications Programmers, Web & Systems Engineers",
      isPrimary: true,
    },
    {
      title: "System Analysis & Database Management",
      match: 89,
      rank: "#2 Core Alignment",
      salary: "₹7–10 LPA Entry • ₹28–42 LPA Senior",
      domain: "Data Infrastructure & Systems Architecture",
      roles: "Database Architects, Systems Analysts, Data Infrastructure Engineers",
      isPrimary: false,
    },
    {
      title: "IT Systems, Networks & Infrastructure",
      match: 84,
      rank: "#3 High Affinity",
      salary: "₹6–9 LPA Entry • ₹24–36 LPA Senior",
      domain: "Enterprise & Cloud Infrastructure",
      roles: "Network Engineers, Cloud Infrastructure Specialists, Systems Security",
      isPrimary: false,
    },
  ];

  const roadmap = {
    y1: "Master core Data Structures & Algorithms, discrete math foundations, and deploy 3 verified full-stack applications on GitHub.",
    y2: "Specialize in distributed backend systems or cloud architecture, contribute to open-source, and secure target tech internship.",
    y3: "High-scale system design mastery, portfolio code reviews, and placement into product engineering organization.",
    aiResilienceScore: 82,
    aiResilienceVerdict: "High Human Moat in System Architecture • While basic syntax is automated by AI, high-level system design, domain business logic, data integrity, and failure-mode orchestration require human engineers.",
  };

  return (
    <section 
      ref={containerRef}
      id="intelligence-engine"
      className="relative max-w-[1240px] mx-auto px-6 py-28 border-b border-slate-200/80 dark:border-white/5 overflow-hidden"
    >
      {/* Deep atmospheric ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[550px] bg-emerald-500/[0.07] dark:bg-emerald-500/[0.12] rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute top-3/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[450px] bg-teal-500/[0.05] dark:bg-teal-500/[0.10] rounded-full blur-[160px] pointer-events-none" />

      {/* ------------------------------------------------------------- */}
      {/* THE INTELLIGENCE ENGINE CANVAS                                */}
      {/* ------------------------------------------------------------- */}
      <div className="max-w-5xl mx-auto relative z-10">

        {/* =========================================================== */}
        {/* STEP 1: COGNITIVE TRAITS (Input Nodes)                      */}
        {/* =========================================================== */}
        <motion.div 
          style={{ opacity: step1Opacity, scale: step1Scale }}
          className="relative"
        >
          {/* Subdued architectural category header */}
          <div className="flex items-center justify-between mb-5 px-1">
            <div className="flex items-center gap-2.5">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 shadow-sm shadow-emerald-500/50" />
              </span>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-slate-700 dark:text-emerald-400">
                Cognitive &amp; Work Value Inputs
              </span>
            </div>
            <span className="text-xs text-slate-500 dark:text-[#7f909e] font-mono">
              35 Dimensions Measured
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {traits.map((t, idx) => {
              const IconComp = t.icon;
              return (
                <div
                  key={t.name}
                  className="relative p-6 rounded-2xl bg-white dark:bg-[#0b1723] border border-slate-200 dark:border-white/10 hover:border-emerald-500/50 shadow-lg dark:shadow-2xl transition-all"
                >
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 shadow-sm">
                      <IconComp className="w-6 h-6" />
                    </div>
                    <div className="text-right">
                      <span className="text-xl font-mono font-bold text-emerald-600 dark:text-emerald-400 block leading-none">
                        {t.score}%
                      </span>
                      <span className="text-[10px] font-mono uppercase text-slate-400 dark:text-[#6a7d8c] mt-1 block">
                        Percentile
                      </span>
                    </div>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-1 tracking-tight">
                    {t.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-[#8aa0af] mb-4 leading-relaxed">
                    {t.sub}
                  </p>

                  {/* Score Bar */}
                  <div className="w-full h-2 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full bg-gradient-to-r ${t.color}`} 
                      style={{ width: `${t.score}%` }}
                    />
                  </div>

                  {/* Terminal Connection Socket (Bottom) */}
                  <div className="absolute -bottom-3.5 left-1/2 -translate-x-1/2 flex items-center justify-center">
                    <div className="w-7 h-7 rounded-full bg-slate-900 dark:bg-[#061019] border-2 border-emerald-500/60 shadow-lg shadow-emerald-500/30 flex items-center justify-center">
                      <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400 shadow-sm shadow-emerald-400" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* =========================================================== */}
        {/* CONNECTOR 1: LARGE SCROLL-DRIVEN CONVERGING LINES           */}
        {/* =========================================================== */}
        <div className="relative h-48 sm:h-64 md:h-72 w-full my-2">
          {/* Large Architectural SVG */}
          <svg 
            className="w-full h-full text-emerald-500 overflow-visible" 
            viewBox="0 0 1000 260" 
            fill="none" 
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="largeStreamGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                <stop offset="50%" stopColor="#34d399" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="1" />
              </linearGradient>

              {/* Glowing optic filter */}
              <filter id="opticGlow1" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Background architectural guide conduits (Faint Dashed) */}
            <path d="M 167,0 C 167,160 500,90 500,260" stroke="currentColor" strokeWidth="2" strokeDasharray="6 6" opacity="0.15" />
            <path d="M 500,0 L 500,260" stroke="currentColor" strokeWidth="2" strokeDasharray="6 6" opacity="0.15" />
            <path d="M 833,0 C 833,160 500,90 500,260" stroke="currentColor" strokeWidth="2" strokeDasharray="6 6" opacity="0.15" />

            {/* Layer 1: Wide Neon Ambient Bloom */}
            <motion.path 
              d="M 167,0 C 167,160 500,90 500,260" 
              stroke="#10b981" 
              strokeWidth="16" 
              strokeOpacity="0.15"
              strokeLinecap="round"
              style={{ pathLength: line1Progress }} 
            />
            <motion.path 
              d="M 500,0 L 500,260" 
              stroke="#10b981" 
              strokeWidth="16" 
              strokeOpacity="0.15"
              strokeLinecap="round"
              style={{ pathLength: line1Progress }} 
            />
            <motion.path 
              d="M 833,0 C 833,160 500,90 500,260" 
              stroke="#10b981" 
              strokeWidth="16" 
              strokeOpacity="0.15"
              strokeLinecap="round"
              style={{ pathLength: line1Progress }} 
            />

            {/* Layer 2: Secondary Luminous Conduit */}
            <motion.path 
              d="M 167,0 C 167,160 500,90 500,260" 
              stroke="#34d399" 
              strokeWidth="7" 
              strokeOpacity="0.4"
              strokeLinecap="round"
              style={{ pathLength: line1Progress }} 
            />
            <motion.path 
              d="M 500,0 L 500,260" 
              stroke="#34d399" 
              strokeWidth="7" 
              strokeOpacity="0.4"
              strokeLinecap="round"
              style={{ pathLength: line1Progress }} 
            />
            <motion.path 
              d="M 833,0 C 833,160 500,90 500,260" 
              stroke="#34d399" 
              strokeWidth="7" 
              strokeOpacity="0.4"
              strokeLinecap="round"
              style={{ pathLength: line1Progress }} 
            />

            {/* Layer 3: High-Intensity Crisp Core Beam */}
            <motion.path 
              d="M 167,0 C 167,160 500,90 500,260" 
              stroke="url(#largeStreamGrad1)" 
              strokeWidth="3.5" 
              strokeLinecap="round"
              style={{ pathLength: line1Progress }} 
            />
            <motion.path 
              d="M 500,0 L 500,260" 
              stroke="url(#largeStreamGrad1)" 
              strokeWidth="3.5" 
              strokeLinecap="round"
              style={{ pathLength: line1Progress }} 
            />
            <motion.path 
              d="M 833,0 C 833,160 500,90 500,260" 
              stroke="url(#largeStreamGrad1)" 
              strokeWidth="3.5" 
              strokeLinecap="round"
              style={{ pathLength: line1Progress }} 
            />
          </svg>

          {/* Central Conduit Convergence Badge */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1.5 rounded-full bg-slate-900/90 dark:bg-black/90 border border-emerald-500/50 text-[11px] font-mono text-emerald-300 font-bold backdrop-blur-md shadow-xl flex items-center gap-2 pointer-events-none">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Multi-Trait Signal Convergence</span>
          </div>
        </div>

        {/* =========================================================== */}
        {/* STEP 2: COGNITIVE FINGERPRINT HUB (Central Profile Card)    */}
        {/* =========================================================== */}
        <motion.div 
          style={{ opacity: hubOpacity, scale: hubScale }}
          className="relative rounded-3xl p-8 sm:p-12 bg-gradient-to-br from-emerald-500/10 via-white to-teal-500/10 dark:from-[#0d2232] dark:via-[#091824] dark:to-[#0d2232] border-2 border-emerald-500/60 shadow-2xl overflow-visible transition-all"
        >
          {/* Terminal Connection Socket (Top) */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-slate-900 dark:bg-[#061019] border-2 border-emerald-500 shadow-xl shadow-emerald-500/40 flex items-center justify-center">
              <span className="animate-ping absolute inline-flex h-4 w-4 rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400 shadow-md shadow-emerald-400" />
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="flex items-start sm:items-center gap-5">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-emerald-500/20 border-2 border-emerald-500/50 text-emerald-600 dark:text-emerald-300 flex items-center justify-center shrink-0 shadow-lg">
                <BrainCircuit className="w-9 h-9 sm:w-11 sm:h-11 animate-pulse" />
                <div className="absolute inset-0 rounded-2xl border border-emerald-400/60 animate-ping opacity-30" />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2.5 mb-2">
                  <span className="text-[11px] uppercase font-mono tracking-wider px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-500/30">
                    Cognitive Fingerprint • Synthesized
                  </span>
                  <span className="text-xs text-slate-500 dark:text-[#889aa8] font-mono font-semibold">
                    {profile.code}
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-slate-900 dark:text-white tracking-tight">
                  {profile.title}
                </h2>
                <p className="text-sm sm:text-base text-slate-600 dark:text-[#a0b2bf] leading-relaxed max-w-2xl mt-2">
                  {profile.summary}
                </p>
              </div>
            </div>

            {/* Validation & Market Evidence Card */}
            <div className="shrink-0 p-5 rounded-2xl bg-white/90 dark:bg-black/50 border border-slate-200 dark:border-white/10 flex flex-col gap-2 min-w-[270px]">
              <span className="text-[10px] font-mono uppercase text-slate-400 dark:text-[#6a7d8c] font-bold tracking-wider">
                System Verification
              </span>
              <div className="space-y-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>35 Psychometric Traits Converged</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>138 Career Families Evaluated</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>3,400+ Occupations Benchmarked</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Stream-Eligibility Pre-Filtered</span>
                </div>
              </div>
            </div>
          </div>

          {/* Terminal Connection Socket (Bottom) */}
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-slate-900 dark:bg-[#061019] border-2 border-emerald-500 shadow-xl shadow-emerald-500/40 flex items-center justify-center">
              <span className="animate-ping absolute inline-flex h-4 w-4 rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400 shadow-md shadow-emerald-400" />
            </div>
          </div>
        </motion.div>

        {/* =========================================================== */}
        {/* CONNECTOR 2: LARGE SCROLL-DRIVEN DIVERGING LINES           */}
        {/* =========================================================== */}
        <div className="relative h-48 sm:h-64 md:h-72 w-full my-2">
          <svg 
            className="w-full h-full text-emerald-500 overflow-visible" 
            viewBox="0 0 1000 260" 
            fill="none" 
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="largeStreamGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="1" />
                <stop offset="50%" stopColor="#14b8a6" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.4" />
              </linearGradient>
            </defs>

            {/* Background architectural guide conduits */}
            <path d="M 500,0 C 500,100 167,160 167,260" stroke="currentColor" strokeWidth="2" strokeDasharray="6 6" opacity="0.15" />
            <path d="M 500,0 L 500,260" stroke="currentColor" strokeWidth="2" strokeDasharray="6 6" opacity="0.15" />
            <path d="M 500,0 C 500,100 833,160 833,260" stroke="currentColor" strokeWidth="2" strokeDasharray="6 6" opacity="0.15" />

            {/* Layer 1: Wide Neon Ambient Bloom */}
            <motion.path 
              d="M 500,0 C 500,100 167,160 167,260" 
              stroke="#10b981" 
              strokeWidth="16" 
              strokeOpacity="0.15"
              strokeLinecap="round"
              style={{ pathLength: line2Progress }} 
            />
            <motion.path 
              d="M 500,0 L 500,260" 
              stroke="#10b981" 
              strokeWidth="16" 
              strokeOpacity="0.15"
              strokeLinecap="round"
              style={{ pathLength: line2Progress }} 
            />
            <motion.path 
              d="M 500,0 C 500,100 833,160 833,260" 
              stroke="#10b981" 
              strokeWidth="16" 
              strokeOpacity="0.15"
              strokeLinecap="round"
              style={{ pathLength: line2Progress }} 
            />

            {/* Layer 2: Secondary Luminous Conduit */}
            <motion.path 
              d="M 500,0 C 500,100 167,160 167,260" 
              stroke="#14b8a6" 
              strokeWidth="7" 
              strokeOpacity="0.4"
              strokeLinecap="round"
              style={{ pathLength: line2Progress }} 
            />
            <motion.path 
              d="M 500,0 L 500,260" 
              stroke="#14b8a6" 
              strokeWidth="7" 
              strokeOpacity="0.4"
              strokeLinecap="round"
              style={{ pathLength: line2Progress }} 
            />
            <motion.path 
              d="M 500,0 C 500,100 833,160 833,260" 
              stroke="#14b8a6" 
              strokeWidth="7" 
              strokeOpacity="0.4"
              strokeLinecap="round"
              style={{ pathLength: line2Progress }} 
            />

            {/* Layer 3: High-Intensity Crisp Core Beam */}
            <motion.path 
              d="M 500,0 C 500,100 167,160 167,260" 
              stroke="url(#largeStreamGrad2)" 
              strokeWidth="3.5" 
              strokeLinecap="round"
              style={{ pathLength: line2Progress }} 
            />
            <motion.path 
              d="M 500,0 L 500,260" 
              stroke="url(#largeStreamGrad2)" 
              strokeWidth="3.5" 
              strokeLinecap="round"
              style={{ pathLength: line2Progress }} 
            />
            <motion.path 
              d="M 500,0 C 500,100 833,160 833,260" 
              stroke="url(#largeStreamGrad2)" 
              strokeWidth="3.5" 
              strokeLinecap="round"
              style={{ pathLength: line2Progress }} 
            />
          </svg>

          {/* Divergence Derivation Indicator */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1.5 rounded-full bg-slate-900/90 dark:bg-black/90 border border-emerald-500/50 text-[11px] font-mono text-emerald-300 font-bold backdrop-blur-md shadow-xl flex items-center gap-2 pointer-events-none">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Deriving Ranked Career Matches</span>
          </div>
        </div>

        {/* =========================================================== */}
        {/* STEP 3: CAREER MATCHES (Output Nodes)                       */}
        {/* =========================================================== */}
        <motion.div 
          style={{ opacity: careersOpacity, scale: careersScale }}
          className="relative"
        >
          <div className="flex items-center justify-between mb-5 px-1">
            <div className="flex items-center gap-2.5">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 shadow-sm shadow-emerald-500/50" />
              </span>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-slate-700 dark:text-emerald-400">
                Ranked Career Matches &amp; Compensation Benchmarks
              </span>
            </div>
            <span className="text-xs text-slate-500 dark:text-[#7f909e] font-mono">
              Market Benchmarks
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {careers.map((career) => (
              <div
                key={career.title}
                className={`relative p-6 sm:p-7 rounded-2xl transition-all ${
                  career.isPrimary
                    ? "bg-white dark:bg-[#0d2232] border-2 border-emerald-500/80 shadow-2xl shadow-emerald-500/15 ring-2 ring-emerald-500/25"
                    : "bg-white dark:bg-[#0b1723] border border-slate-200 dark:border-white/10 shadow-lg"
                }`}
              >
                {/* Terminal Connection Socket (Top) */}
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 flex items-center justify-center">
                  <div className="w-7 h-7 rounded-full bg-slate-900 dark:bg-[#061019] border-2 border-emerald-500/60 shadow-lg shadow-emerald-500/30 flex items-center justify-center">
                    <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400 shadow-sm shadow-emerald-400" />
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className={`text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-md ${
                    career.isPrimary
                      ? "bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-500/40"
                      : "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-[#8899a6]"
                  }`}>
                    {career.rank}
                  </span>
                  <span className="text-sm font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {career.match}% Match
                  </span>
                </div>

                <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2 leading-snug">
                  {career.title}
                </h4>

                <span className="text-xs text-slate-500 dark:text-[#8899a6] block mb-1">
                  {career.domain}
                </span>

                <span className="text-[11px] text-slate-400 dark:text-[#6a7d8c] line-clamp-1 block mb-4">
                  Roles: {career.roles}
                </span>

                <div className="pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-[#7a8d9b]">Target Salary:</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-emerald-300 text-sm">
                    {career.salary}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* =========================================================== */}
        {/* STEP 4: THE SEQUENCED 3-YEAR ROADMAP & AI-RESILIENCE CARD   */}
        {/* =========================================================== */}
        <motion.div 
          style={{ opacity: roadmapOpacity, y: roadmapY }}
          className="mt-10 p-8 sm:p-10 rounded-3xl bg-slate-950 text-white dark:bg-[#061019] border-2 border-emerald-500/40 shadow-2xl relative overflow-hidden"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
                  Sequenced 3-Year Execution Blueprint
                </span>
                <span className="text-xs text-slate-400">• Software &amp; Application Development (Rank #1)</span>
              </div>
              <h4 className="text-xl sm:text-2xl font-serif font-bold mb-6 text-white">
                From Higher Education Selection to Industry Placement
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-[10px] font-mono font-bold text-emerald-400 block mb-1.5 uppercase">
                    Year 01: Skill Foundation
                  </span>
                  <span className="text-slate-200 leading-relaxed block">
                    {roadmap.y1}
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-[10px] font-mono font-bold text-teal-400 block mb-1.5 uppercase">
                    Year 02: Specialization &amp; Proof
                  </span>
                  <span className="text-slate-200 leading-relaxed block">
                    {roadmap.y2}
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-[10px] font-mono font-bold text-cyan-400 block mb-1.5 uppercase">
                    Year 03: Career Placement
                  </span>
                  <span className="text-slate-200 leading-relaxed block">
                    {roadmap.y3}
                  </span>
                </div>
              </div>
            </div>

            {/* AI Resilience Shield Component */}
            <div className="shrink-0 lg:w-72 p-5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex flex-col justify-center">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono uppercase font-bold text-emerald-400 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" /> AI-Resilience
                </span>
                <span className="text-base font-bold font-mono text-emerald-300">
                  {roadmap.aiResilienceScore}/100
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {roadmap.aiResilienceVerdict}
              </p>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
