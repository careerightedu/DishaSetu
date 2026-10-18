"use client";

import React, { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { 
  BrainCircuit, 
  Target, 
  Route, 
  Sparkles, 
  CheckCircle2, 
  ArrowDown, 
  Layers, 
  Check, 
  ShieldCheck, 
  TrendingUp, 
  Languages 
} from "lucide-react";

export default function StackedHowItWorksWavy() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDesktop, setIsDesktop] = React.useState<boolean>(false);

  React.useEffect(() => {
    const checkWidth = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    checkWidth();
    window.addEventListener("resize", checkWidth, { passive: true });
    return () => window.removeEventListener("resize", checkWidth);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 75%", "end 80%"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    restDelta: 0.001,
  });

  // Calculate percentage for progress indicators
  const path1Length = useTransform(smoothProgress, [0.08, 0.42], [0, 1]);
  const path2Length = useTransform(smoothProgress, [0.42, 0.82], [0, 1]);

  // Progressive dimming for previous steps as user scrolls down (desktop spotlight only)
  const step1Brightness = useTransform(smoothProgress, [0, 0.35, 0.52], [1, 1, 0.38]);
  const step1Opacity = useTransform(smoothProgress, [0, 0.35, 0.52], [1, 1, 0.58]);
  const step1Filter = useTransform(step1Brightness, (b) => `brightness(${b})`);

  const step2Brightness = useTransform(smoothProgress, [0.2, 0.38, 0.68, 0.88], [0.85, 1, 1, 0.38]);
  const step2Opacity = useTransform(smoothProgress, [0.2, 0.38, 0.68, 0.88], [0.9, 1, 1, 0.58]);
  const step2Filter = useTransform(step2Brightness, (b) => `brightness(${b})`);

  const step3Brightness = useTransform(smoothProgress, [0.55, 0.8], [0.85, 1]);
  const step3Opacity = useTransform(smoothProgress, [0.55, 0.8], [0.9, 1]);
  const step3Filter = useTransform(step3Brightness, (b) => `brightness(${b})`);

  // Responsive SVG paths & pin anchors
  const wavy1PathD = isDesktop 
    ? "M 270,0 C 270,140 530,140 530,280" 
    : "M 400,0 C 470,70 330,210 400,280";
  const wavy1StartX = isDesktop ? 270 : 400;
  const wavy1EndX = isDesktop ? 530 : 400;

  const wavy2PathD = isDesktop 
    ? "M 530,0 C 530,140 400,140 400,280" 
    : "M 400,0 C 330,70 470,210 400,280";
  const wavy2StartX = isDesktop ? 530 : 400;
  const wavy2EndX = isDesktop ? 400 : 400;

  return (
    <section 
      id="how-it-works" 
      ref={containerRef}
      className="max-w-[1200px] mx-auto px-4 sm:px-6 py-16 sm:py-24 md:py-28 border-b border-slate-200/80 dark:border-white/5 relative overflow-hidden"
    >
      {/* Background Ambient Aura */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-sky-500/5 dark:bg-sky-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Section Header */}
      <div className="text-center mb-20 relative">
        <span className="absolute -top-12 left-1/2 -translate-x-1/2 text-[110px] sm:text-[160px] md:text-[200px] font-serif font-black text-slate-900/[0.03] dark:text-white/[0.03] pointer-events-none select-none -z-10 leading-none">
          03
        </span>
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-600 dark:text-sky-400 text-xs font-semibold uppercase tracking-widest mb-3.5 shadow-xs">
          <Sparkles className="w-3.5 h-3.5" />
          <span>The Methodology</span>
        </div>
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-serif font-bold mb-4 text-slate-950 dark:text-white tracking-tight">
          How WhatAfter Works
        </h2>
        <p className="text-slate-600 dark:text-[#aab7c0] max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
          From confusing career noise to an objective, sequenced career plan in three structured, connected steps.
        </p>
      </div>

      {/* STACKED TIMELINE CONTAINER WITH WAVY DRAWING CONNECTIONS */}
      <div className="relative max-w-4xl mx-auto space-y-0">
        
        {/* ======================================================== */}
        {/* STEP 1: SIGNAL CAPTURE (Left on desktop)                */}
        {/* ======================================================== */}
        <motion.div 
          style={{ filter: step1Filter, opacity: step1Opacity, willChange: "filter, opacity" }}
          className="relative grid md:grid-cols-12 gap-6 sm:gap-8 items-center transition-all duration-300"
        >
          {/* Card */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="md:col-span-8 p-6 sm:p-8 md:p-10 rounded-3xl bg-white dark:bg-[#07131e] border-2 border-sky-500/30 dark:border-sky-500/20 shadow-xl shadow-sky-500/5 hover:border-sky-500/50 transition-all text-left relative group"
          >
            {/* Step Badge */}
            <div className="flex items-center justify-between mb-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 font-mono text-xs font-bold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
                <span>Step 01 • Evaluation</span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold shadow-xs group-hover:scale-110 transition-transform">
                <BrainCircuit className="w-6 h-6" />
              </div>
            </div>

            <h3 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold mb-3 text-slate-950 dark:text-white">
              Answer 80 Real Scenarios
            </h3>
            <p className="text-base sm:text-lg text-slate-700 dark:text-[#97a6b2] mb-6 font-medium">
              30 minutes • Zero exam anxiety • Available in English &amp; हिंदी
            </p>

            {/* Micro-telemetry breakdown pills */}
            <div className="grid sm:grid-cols-3 gap-3 pt-5 border-t border-slate-200/80 dark:border-white/10 text-sm sm:text-base">
              <div className="flex items-center gap-2.5 text-slate-800 dark:text-slate-200 font-semibold">
                <CheckCircle2 className="w-5 h-5 text-sky-600 dark:text-sky-400 shrink-0" />
                <span>80 Real Dilemmas</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-800 dark:text-slate-200 font-semibold">
                <Languages className="w-5 h-5 text-sky-600 dark:text-sky-400 shrink-0" />
                <span>English &amp; हिंदी</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-800 dark:text-slate-200 font-semibold">
                <CheckCircle2 className="w-5 h-5 text-sky-600 dark:text-sky-400 shrink-0" />
                <span>Zero Exam Anxiety</span>
              </div>
            </div>

            {/* Mobile Companion Stat Badge */}
            <div className="flex md:hidden items-center justify-between p-4 rounded-2xl bg-sky-50 dark:bg-white/[0.04] border border-sky-200/80 dark:border-white/10 mt-5 shadow-xs">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold block">
                  No Exam Stress
                </span>
                <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                  No right or wrong answers
                </span>
              </div>
              <div className="text-2xl font-serif font-black text-sky-600 dark:text-sky-400">
                80 Scenarios
              </div>
            </div>
          </motion.div>

          {/* Right Teaser Badge for Step 1 */}
          <div className="md:col-span-4 hidden md:flex flex-col items-center justify-center text-center p-6 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 space-y-3">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold">
              No Right or Wrong Answers
            </span>
            <div className="text-4xl font-serif font-black text-sky-600 dark:text-sky-400">
              80 Scenarios
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              &ldquo;A simple 30-minute test to understand what you naturally enjoy and excel at.&rdquo;
            </p>
          </div>
        </motion.div>

        {/* ======================================================== */}
        {/* WAVY CONNECTOR 1: Flowing from Step 1 to Step 2         */}
        {/* ======================================================== */}
        <div className="relative h-36 sm:h-44 md:h-72 w-full flex items-center justify-center my-0 z-20 pointer-events-none overflow-visible">
          {/* SVG Canvas for self-drawing long wavy S-curve */}
          <svg 
            className="w-full h-full overflow-visible"
            viewBox="0 0 800 280"
            fill="none"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="wavy1Gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0ea5e9" />
                <stop offset="50%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#0284c7" />
              </linearGradient>
              <filter id="glow1" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation={isDesktop ? 4 : 2} result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Background Faint Dashed Path - Always connected border-to-border */}
            <path
              d={wavy1PathD}
              stroke="currentColor"
              strokeWidth={isDesktop ? 3 : 2}
              strokeDasharray="8 8"
              className="text-sky-500/25 dark:text-sky-400/20"
            />

            {/* Animated Self-Drawing Path on Scroll */}
            <motion.path
              d={wavy1PathD}
              stroke="url(#wavy1Gradient)"
              strokeWidth={isDesktop ? 4 : 3}
              strokeLinecap="round"
              filter="url(#glow1)"
              style={{ pathLength: path1Length }}
            />

            {/* Top terminal contact bead directly touching Step 1 card border */}
            <circle cx={wavy1StartX} cy="0" r={isDesktop ? 8 : 6} fill="none" stroke="#0ea5e9" strokeWidth="1.5" className="animate-ping opacity-75" />
            <circle cx={wavy1StartX} cy="0" r={isDesktop ? 5.5 : 4} fill="#0ea5e9" opacity="0.3" filter="blur(2px)" />
            <circle cx={wavy1StartX} cy="0" r={isDesktop ? 4.5 : 3.5} fill="#0ea5e9" stroke="#ffffff" strokeWidth="1.5" />

            {/* Bottom terminal contact bead directly touching Step 2 card border */}
            <circle cx={wavy1EndX} cy="280" r={isDesktop ? 8 : 6} fill="none" stroke="#0284c7" strokeWidth="1.5" className="animate-ping opacity-75" />
            <circle cx={wavy1EndX} cy="280" r={isDesktop ? 5.5 : 4} fill="#0284c7" opacity="0.3" filter="blur(2px)" />
            <circle cx={wavy1EndX} cy="280" r={isDesktop ? 4.5 : 3.5} fill="#0284c7" stroke="#ffffff" strokeWidth="1.5" />
          </svg>
        </div>

        {/* ======================================================== */}
        {/* STEP 2: COGNITIVE MODELING (Right on desktop)           */}
        {/* ======================================================== */}
        <motion.div 
          style={{ filter: step2Filter, opacity: step2Opacity, willChange: "filter, opacity" }}
          className="relative grid md:grid-cols-12 gap-6 sm:gap-8 items-center transition-all duration-300"
        >
          {/* Left Teaser Badge for Step 2 */}
          <div className="md:col-span-4 hidden md:flex flex-col items-center justify-center text-center p-6 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 space-y-3 order-2 md:order-1">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold">
              Real Job Market Check
            </span>
            <div className="text-4xl font-serif font-black text-teal-600 dark:text-teal-400">
              900+ Careers
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              &ldquo;We check actual Indian salaries and identify which jobs are safe from AI automation.&rdquo;
            </p>
          </div>

          {/* Card */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="md:col-span-8 p-6 sm:p-8 md:p-10 rounded-3xl bg-white dark:bg-[#07131e] border-2 border-teal-500/30 dark:border-teal-500/20 shadow-xl shadow-teal-500/5 hover:border-teal-500/50 transition-all text-left relative group order-1 md:order-2"
          >
            {/* Step Badge */}
            <div className="flex items-center justify-between mb-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-400 font-mono text-xs font-bold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                <span>Step 02 • Analysis</span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold shadow-xs group-hover:scale-110 transition-transform">
                <Target className="w-6 h-6" />
              </div>
            </div>

            <h3 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold mb-3 text-slate-950 dark:text-white">
              Match With 900+ Indian Careers
            </h3>
            <p className="text-base sm:text-lg text-slate-700 dark:text-[#97a6b2] mb-6 font-medium">
              Big Five + Holland RIASEC • Real Salaries • AI-Resilience Index
            </p>

            {/* Micro-telemetry breakdown pills */}
            <div className="grid sm:grid-cols-3 gap-3 pt-5 border-t border-slate-200/80 dark:border-white/10 text-sm sm:text-base">
              <div className="flex items-center gap-2.5 text-slate-800 dark:text-slate-200 font-semibold">
                <ShieldCheck className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0" />
                <span>Safe From AI</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-800 dark:text-slate-200 font-semibold">
                <TrendingUp className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0" />
                <span>Real Indian Salaries</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-800 dark:text-slate-200 font-semibold">
                <CheckCircle2 className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0" />
                <span>900+ Jobs Screened</span>
              </div>
            </div>

            {/* Mobile Companion Stat Badge */}
            <div className="flex md:hidden items-center justify-between p-4 rounded-2xl bg-teal-50 dark:bg-white/[0.04] border border-teal-200/80 dark:border-white/10 mt-5 shadow-xs">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold block">
                  Real Job Market Check
                </span>
                <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                  Salaries &amp; AI-safety
                </span>
              </div>
              <div className="text-2xl font-serif font-black text-teal-600 dark:text-teal-400">
                900+ Careers
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* ======================================================== */}
        {/* WAVY CONNECTOR 2: Flowing from Step 2 to Step 3         */}
        {/* ======================================================== */}
        <div className="relative h-36 sm:h-44 md:h-72 w-full flex items-center justify-center my-0 z-20 pointer-events-none overflow-visible">
          {/* SVG Canvas for self-drawing long wavy reverse S-curve */}
          <svg 
            className="w-full h-full overflow-visible"
            viewBox="0 0 800 280"
            fill="none"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="wavy2Gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0284c7" />
                <stop offset="50%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#0ea5e9" />
              </linearGradient>
              <filter id="glow2" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation={isDesktop ? 4 : 2} result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Background Faint Dashed Path - Always connected border-to-border */}
            <path
              d={wavy2PathD}
              stroke="currentColor"
              strokeWidth={isDesktop ? 3 : 2}
              strokeDasharray="8 8"
              className="text-teal-500/25 dark:text-teal-400/20"
            />

            {/* Animated Self-Drawing Path on Scroll */}
            <motion.path
              d={wavy2PathD}
              stroke="url(#wavy2Gradient)"
              strokeWidth={isDesktop ? 4 : 3}
              strokeLinecap="round"
              filter="url(#glow2)"
              style={{ pathLength: path2Length }}
            />

            {/* Top terminal contact bead directly touching Step 2 card border */}
            <circle cx={wavy2StartX} cy="0" r={isDesktop ? 8 : 6} fill="none" stroke="#0284c7" strokeWidth="1.5" className="animate-ping opacity-75" />
            <circle cx={wavy2StartX} cy="0" r={isDesktop ? 5.5 : 4} fill="#0284c7" opacity="0.3" filter="blur(2px)" />
            <circle cx={wavy2StartX} cy="0" r={isDesktop ? 4.5 : 3.5} fill="#0284c7" stroke="#ffffff" strokeWidth="1.5" />

            {/* Bottom terminal contact bead directly touching Step 3 card border */}
            <circle cx={wavy2EndX} cy="280" r={isDesktop ? 8 : 6} fill="none" stroke="#0ea5e9" strokeWidth="1.5" className="animate-ping opacity-75" />
            <circle cx={wavy2EndX} cy="280" r={isDesktop ? 5.5 : 4} fill="#0ea5e9" opacity="0.3" filter="blur(2px)" />
            <circle cx={wavy2EndX} cy="280" r={isDesktop ? 4.5 : 3.5} fill="#0ea5e9" stroke="#ffffff" strokeWidth="1.5" />
          </svg>
        </div>

        {/* ======================================================== */}
        {/* STEP 3: ACTION & DELIVERY (Full-width Center Anchor)     */}
        {/* ======================================================== */}
        <motion.div 
          style={{ filter: step3Filter, opacity: step3Opacity, willChange: "filter, opacity" }}
          className="relative transition-all duration-300"
        >
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="p-6 sm:p-10 md:p-12 rounded-3xl bg-white dark:bg-[#07131e] border-2 border-sky-500/40 dark:border-sky-500/30 shadow-2xl text-left relative group overflow-hidden"
          >
            <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/15 text-sky-700 dark:text-sky-400 font-mono text-xs font-bold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
                <span>Step 03 • Action &amp; Delivery</span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-sky-500/20 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold shadow-xs group-hover:scale-110 transition-transform">
                <Route className="w-6 h-6" />
              </div>
            </div>

            <h3 className="text-2xl sm:text-4xl md:text-5xl font-serif font-bold mb-4 text-slate-950 dark:text-white">
              Get Your 15-Page Career Plan
            </h3>
            <p className="text-base sm:text-lg text-slate-700 dark:text-[#97a6b2] mb-6 font-medium">
              Top 5 Best-Fit Careers • High-Risk Eliminations • 3-Year Action Plan
            </p>

            {/* Mobile Companion Stat Badge */}
            <div className="flex md:hidden items-center justify-between p-4 rounded-2xl bg-sky-50 dark:bg-white/[0.04] border border-sky-200/80 dark:border-white/10 mb-6 shadow-xs">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold block">
                  Actionable Roadmap
                </span>
                <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                  Month-by-month clarity
                </span>
              </div>
              <div className="text-2xl font-serif font-black text-sky-600 dark:text-sky-400">
                15 Pages
              </div>
            </div>

            {/* Compounding deliverables grid */}
            <div className="grid sm:grid-cols-3 gap-4 pt-6 border-t border-slate-200/80 dark:border-white/10">
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/5 space-y-1.5">
                <b className="font-bold text-slate-950 dark:text-white text-base block flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                  <span>3-Year Action Plan</span>
                </b>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Milestones for Month 1, Month 6, Year 1, and Year 3.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/5 space-y-1.5">
                <b className="font-bold text-red-600 dark:text-red-400 text-base block flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <span>Careers to Avoid</span>
                </b>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Hyped coaching paths that clash with your traits.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/5 space-y-1.5">
                <b className="font-bold text-teal-600 dark:text-teal-400 text-base block flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
                  <span>Parent Discussion Guide</span>
                </b>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Zero-conflict talking points for the dinner table.
                </p>
              </div>
            </div>

            {/* Seamless Transition Indicator to the 15-Page Report */}
            <div className="mt-8 pt-6 border-t border-slate-200/60 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm font-mono text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <ArrowDown className="w-4 h-4 text-sky-500 animate-bounce" />
                <span>Explore the live 15-Page dossier chapters directly below ↓</span>
              </div>
              <a 
                href="#inside-report"
                className="px-5 py-2.5 rounded-xl bg-sky-500 text-slate-950 font-bold hover:bg-sky-400 transition-colors shadow-sm"
              >
                Inspect Sample Report Pages →
              </a>
            </div>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}
