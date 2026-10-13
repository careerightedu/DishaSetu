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
    : "M 400,0 C 440,70 360,210 400,280";
  const wavy1StartX = isDesktop ? 270 : 400;
  const wavy1EndX = isDesktop ? 530 : 400;

  const wavy2PathD = isDesktop 
    ? "M 530,0 C 530,140 400,140 400,280" 
    : "M 400,0 C 360,70 440,210 400,280";
  const wavy2StartX = isDesktop ? 530 : 400;
  const wavy2EndX = isDesktop ? 400 : 400;

  return (
    <section 
      id="how-it-works" 
      ref={containerRef}
      className="max-w-[1200px] mx-auto px-4 sm:px-6 py-16 sm:py-24 md:py-28 border-b border-slate-200/80 dark:border-white/5 relative overflow-hidden"
    >
      {/* Background Ambient Aura */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Section Header */}
      <div className="text-center mb-20 relative">
        <span className="absolute -top-12 left-1/2 -translate-x-1/2 text-[110px] sm:text-[160px] md:text-[200px] font-serif font-black text-slate-900/[0.03] dark:text-white/[0.03] pointer-events-none select-none -z-10 leading-none">
          03
        </span>
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold uppercase tracking-widest mb-3.5 shadow-xs">
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
          style={isDesktop ? { filter: step1Filter, opacity: step1Opacity, willChange: "filter, opacity" } : { opacity: step1Opacity, willChange: "opacity" }}
          className="relative grid md:grid-cols-12 gap-6 sm:gap-8 items-center transition-all duration-300"
        >
          {/* Card */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="md:col-span-8 p-6 sm:p-8 md:p-10 rounded-3xl bg-white dark:bg-[#07131e] border-2 border-emerald-500/30 dark:border-emerald-500/20 shadow-xl shadow-emerald-500/5 hover:border-emerald-500/50 transition-all text-left relative group"
          >
            {/* Step Badge */}
            <div className="flex items-center justify-between mb-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Step 01 • Input</span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold shadow-xs group-hover:scale-110 transition-transform">
                <BrainCircuit className="w-6 h-6" />
              </div>
            </div>

            <h3 className="text-2xl sm:text-3xl font-serif font-bold mb-3 text-slate-900 dark:text-white">
              Signal Capture
            </h3>
            <p className="text-sm sm:text-base text-slate-600 dark:text-[#97a6b2] leading-relaxed mb-6">
              Respond to 80 scenario-based questions in your choice of language — fully available in both <b>English &amp; Hindi (हिंदी)</b>. Designed to evaluate how you make decisions under ambiguity, cognitive instincts, and uncompromised work values — without timer anxiety or exam pressure.
            </p>

            {/* Micro-telemetry breakdown pills */}
            <div className="grid sm:grid-cols-3 gap-3 pt-5 border-t border-slate-100 dark:border-white/10 text-xs">
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>80 Thoughtful Dilemmas</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
                <Languages className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>English &amp; हिंदी</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Zero Exam Panic</span>
              </div>
            </div>
          </motion.div>

          {/* Right Teaser Badge for Step 1 */}
          <div className="md:col-span-4 hidden md:flex flex-col items-center justify-center text-center p-6 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 space-y-3">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold">
              Unconscious Behavioral Mapping
            </span>
            <div className="text-3xl font-serif font-black text-emerald-600 dark:text-emerald-400">
              80 Scenarios
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              &ldquo;No right or wrong options — only clear windows into how your mind prioritizes trade-offs.&rdquo;
            </p>
          </div>
        </motion.div>

        {/* ======================================================== */}
        {/* WAVY CONNECTOR 1: Flowing from Step 1 to Step 2         */}
        {/* ======================================================== */}
        <div className="relative h-24 sm:h-32 md:h-72 w-full flex items-center justify-center my-0 z-20 pointer-events-none overflow-visible">
          {/* SVG Canvas for self-drawing long wavy S-curve */}
          <svg 
            className="w-full h-full overflow-visible"
            viewBox="0 0 800 280"
            fill="none"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="wavy1Gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="50%" stopColor="#14b8a6" />
                <stop offset="100%" stopColor="#06b6d4" />
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
              className="text-emerald-500/25 dark:text-emerald-400/20"
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
            <circle cx={wavy1StartX} cy="0" r={isDesktop ? 8 : 6} fill="none" stroke="#10b981" strokeWidth="1.5" className="animate-ping opacity-75" />
            <circle cx={wavy1StartX} cy="0" r={isDesktop ? 5.5 : 4} fill="#10b981" opacity="0.3" filter="blur(2px)" />
            <circle cx={wavy1StartX} cy="0" r={isDesktop ? 4.5 : 3.5} fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />

            {/* Bottom terminal contact bead directly touching Step 2 card border */}
            <circle cx={wavy1EndX} cy="280" r={isDesktop ? 8 : 6} fill="none" stroke="#06b6d4" strokeWidth="1.5" className="animate-ping opacity-75" />
            <circle cx={wavy1EndX} cy="280" r={isDesktop ? 5.5 : 4} fill="#06b6d4" opacity="0.3" filter="blur(2px)" />
            <circle cx={wavy1EndX} cy="280" r={isDesktop ? 4.5 : 3.5} fill="#06b6d4" stroke="#ffffff" strokeWidth="1.5" />
          </svg>
        </div>

        {/* ======================================================== */}
        {/* STEP 2: COGNITIVE MODELING (Right on desktop)           */}
        {/* ======================================================== */}
        <motion.div 
          style={isDesktop ? { filter: step2Filter, opacity: step2Opacity, willChange: "filter, opacity" } : { opacity: step2Opacity, willChange: "opacity" }}
          className="relative grid md:grid-cols-12 gap-6 sm:gap-8 items-center transition-all duration-300"
        >
          {/* Left Teaser Badge for Step 2 */}
          <div className="md:col-span-4 hidden md:flex flex-col items-center justify-center text-center p-6 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 space-y-3 order-2 md:order-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold">
              Multidimensional Synthesis
            </span>
            <div className="text-3xl font-serif font-black text-teal-600 dark:text-teal-400">
              35 Traits
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              &ldquo;5 Aptitude dimensions overlaid against 6 core Work Values with Indian labor market calibration.&rdquo;
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
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 font-mono text-xs font-bold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                <span>Step 02 • Analysis</span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold shadow-xs group-hover:scale-110 transition-transform">
                <Target className="w-6 h-6" />
              </div>
            </div>

            <h3 className="text-2xl sm:text-3xl font-serif font-bold mb-3 text-slate-900 dark:text-white">
              Cognitive Modeling
            </h3>
            <p className="text-sm sm:text-base text-slate-600 dark:text-[#97a6b2] leading-relaxed mb-6">
              Our intelligence engine synthesizes your Core Aptitudes with your Work Values. It computes salary trajectories, real hiring demand, and <b>AI-resilience scores</b> across hundreds of active industry roles, eliminating emotion, parental friction, and peer pressure.
            </p>

            {/* Micro-telemetry breakdown pills */}
            <div className="grid sm:grid-cols-3 gap-3 pt-5 border-t border-slate-100 dark:border-white/10 text-xs">
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
                <ShieldCheck className="w-4 h-4 text-teal-500 shrink-0" />
                <span>AI Resilience Index (75/100)</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
                <TrendingUp className="w-4 h-4 text-teal-500 shrink-0" />
                <span>Realistic Salary Curves</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
                <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0" />
                <span>900+ Careers Screened</span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* ======================================================== */}
        {/* WAVY CONNECTOR 2: Flowing from Step 2 to Step 3         */}
        {/* ======================================================== */}
        <div className="relative h-24 sm:h-32 md:h-72 w-full flex items-center justify-center my-0 z-20 pointer-events-none overflow-visible">
          {/* SVG Canvas for self-drawing long wavy reverse S-curve */}
          <svg 
            className="w-full h-full overflow-visible"
            viewBox="0 0 800 280"
            fill="none"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="wavy2Gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="50%" stopColor="#14b8a6" />
                <stop offset="100%" stopColor="#10b981" />
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
            <circle cx={wavy2StartX} cy="0" r={isDesktop ? 8 : 6} fill="none" stroke="#06b6d4" strokeWidth="1.5" className="animate-ping opacity-75" />
            <circle cx={wavy2StartX} cy="0" r={isDesktop ? 5.5 : 4} fill="#06b6d4" opacity="0.3" filter="blur(2px)" />
            <circle cx={wavy2StartX} cy="0" r={isDesktop ? 4.5 : 3.5} fill="#06b6d4" stroke="#ffffff" strokeWidth="1.5" />

            {/* Bottom terminal contact bead directly touching Step 3 card border */}
            <circle cx={wavy2EndX} cy="280" r={isDesktop ? 8 : 6} fill="none" stroke="#10b981" strokeWidth="1.5" className="animate-ping opacity-75" />
            <circle cx={wavy2EndX} cy="280" r={isDesktop ? 5.5 : 4} fill="#10b981" opacity="0.3" filter="blur(2px)" />
            <circle cx={wavy2EndX} cy="280" r={isDesktop ? 4.5 : 3.5} fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />
          </svg>
        </div>

        {/* ======================================================== */}
        {/* STEP 3: SEQUENCED EXECUTION (Full-width Center Anchor)  */}
        {/* ======================================================== */}
        <motion.div 
          style={isDesktop ? { filter: step3Filter, opacity: step3Opacity, willChange: "filter, opacity" } : { opacity: step3Opacity, willChange: "opacity" }}
          className="relative transition-all duration-300"
        >
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="p-6 sm:p-10 md:p-12 rounded-3xl bg-gradient-to-br from-emerald-500/10 via-white to-teal-500/10 dark:from-[#0c1a27] dark:via-[#07131e] dark:to-[#071926] border-2 border-emerald-500/40 dark:border-emerald-500/30 shadow-2xl shadow-emerald-500/10 text-left relative group overflow-hidden"
          >
            <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Step 03 • Action &amp; Delivery</span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold shadow-xs group-hover:scale-110 transition-transform">
                <Route className="w-6 h-6" />
              </div>
            </div>

            <h3 className="text-2xl sm:text-4xl font-serif font-bold mb-4 text-slate-900 dark:text-white">
              Sequenced Execution Plan
            </h3>
            <p className="text-sm sm:text-base text-slate-600 dark:text-[#97a6b2] leading-relaxed mb-8 max-w-3xl">
              Receive an exhaustive <b>15-page dossier</b> that bridges the gap between assessment insight and real-world execution. Features top ranked careers, explicit mismatch eliminations (what <i>not</i> to do), a 3-year sequenced milestone roadmap, and a dedicated guide for parents.
            </p>

            {/* Compounding deliverables grid */}
            <div className="grid sm:grid-cols-3 gap-4 pt-6 border-t border-slate-200/80 dark:border-white/10 text-xs sm:text-sm">
              <div className="p-4 rounded-2xl bg-white dark:bg-black/30 border border-slate-200 dark:border-white/5 space-y-1">
                <b className="font-semibold text-slate-900 dark:text-white block flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>3-Year Milestones</span>
                </b>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Month 1, Month 6, Year 1, Year 3 sequenced progression from Day 0 to target job offer.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-black/30 border border-slate-200 dark:border-white/5 space-y-1">
                <b className="font-semibold text-red-600 dark:text-red-400 block flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  <span>Career Eliminations</span>
                </b>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Explicit clash reasons why CA, Medicine, or Corporate Law waste time for your profile.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-black/30 border border-slate-200 dark:border-white/5 space-y-1">
                <b className="font-semibold text-teal-600 dark:text-teal-400 block flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-teal-500" />
                  <span>Parent Discussion Guide</span>
                </b>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Calm conversation starters for the dinner table, eliminating conflict and emotional debates.
                </p>
              </div>
            </div>

            {/* Seamless Transition Indicator to the 15-Page Report */}
            <div className="mt-8 pt-6 border-t border-slate-200/60 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <ArrowDown className="w-4 h-4 text-emerald-500 animate-bounce" />
                <span>Explore the live 15-Page dossier chapters directly below ↓</span>
              </div>
              <a 
                href="#inside-report"
                className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 transition-colors shadow-sm"
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
