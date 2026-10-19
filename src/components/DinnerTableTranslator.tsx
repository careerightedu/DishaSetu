"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight,
  TrendingUp,
  BrainCircuit,
  Award
} from "lucide-react";

interface ConversationScenario {
  id: string;
  topic: string;
  shortTopic: string;
  icon: string;
  image: string;
  altText: string;
  parentQuestion: string;
  reportEvidence: string;
  reportPage: string;
  tag: string;
}

const SCENARIOS: ConversationScenario[] = [
  {
    id: "govt-vs-tech",
    topic: "Govt Job vs. Tech Builder",
    shortTopic: "Govt Job vs Tech",
    icon: "🏛️",
    image: "/images/dinner_table_govt.jpg",
    altText: "Indian father and teenage daughter discussing career paths over tea at the dining table",
    parentQuestion: "“Should we force our child to prepare for stable government exams instead of private tech?”",
    reportEvidence: "Your child works best with freedom and creativity. Strict government routines will frustrate them, while tech careers offer faster growth, higher pay, and real job satisfaction.",
    reportPage: "Page 03 • Work Style Radar",
    tag: "Freedom & Faster Growth",
  },
  {
    id: "ai-threat",
    topic: "AI Threat & Job Security",
    shortTopic: "AI Threat & Security",
    icon: "🤖",
    image: "/images/dinner_table_ai.jpg",
    altText: "Indian mother and teenage son reviewing career dossier on tablet together",
    parentQuestion: "“Will AI replace software developers before my child even finishes college?”",
    reportEvidence: "No. Basic repetitive tasks can be automated, but real problem-solving and smart design are safe. Your child will use AI to work faster, not be replaced by it.",
    reportPage: "Page 08 • AI Safety Index",
    tag: "Safe From Automation",
  },
  {
    id: "salary-reality",
    topic: "Realistic Salary Expectations",
    shortTopic: "Real Salaries",
    icon: "💰",
    image: "/images/dinner_table_salary.jpg",
    altText: "Indian parents and son smiling together at the dining table reviewing the career report",
    parentQuestion: "“Are the ₹50 LPA college placement headlines real, or should we expect something grounded?”",
    reportEvidence: "Rare 50 Lakh headlines mislead families. A realistic starting package is ₹12–25 Lakhs, which steadily grows to ₹40–80 Lakhs as they build 7+ years of experience.",
    reportPage: "Page 07 • Salary Trajectory",
    tag: "Real ₹12L–₹80L Salaries",
  },
];

const AUTO_ROTATE_INTERVAL = 6500; // 6.5s per question

export default function DinnerTableTranslator() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeScenario = SCENARIOS[activeIndex];

  // Continuous auto-rotate
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % SCENARIOS.length);
    }, AUTO_ROTATE_INTERVAL);

    return () => clearInterval(timer);
  }, [activeIndex]);

  return (
    <div className="w-full space-y-6">
      
      {/* 1. TOP TOPIC SELECTOR TABS */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
        {SCENARIOS.map((scenario, idx) => {
          const isActive = idx === activeIndex;
          return (
            <button
              key={scenario.id}
              onClick={() => setActiveIndex(idx)}
              className={`px-4 sm:px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all relative overflow-hidden flex items-center gap-2 ${
                isActive
                  ? "bg-slate-900 dark:bg-white text-white dark:text-slate-950 shadow-lg shadow-sky-500/10 font-bold scale-[1.02]"
                  : "bg-white/80 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-white/10 border border-slate-200/80 dark:border-white/10"
              }`}
            >
              <span>{scenario.icon}</span>
              <span>{scenario.shortTopic}</span>

              {/* Active Countdown Progress Line */}
              {isActive && (
                <motion.div
                  key={`progress-${activeIndex}`}
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: AUTO_ROTATE_INTERVAL / 1000, ease: "linear" }}
                  className="absolute bottom-0 left-0 h-[2.5px] bg-sky-400 dark:bg-sky-500"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* 2. THE INTERACTIVE VISUAL STAGE */}
      <div className="relative w-full rounded-3xl overflow-hidden border-2 border-slate-200/90 dark:border-white/10 shadow-2xl bg-slate-950 min-h-[580px] xs:min-h-[600px] sm:min-h-[560px] md:min-h-[580px] lg:min-h-[620px] flex flex-col justify-between p-4 sm:p-7 select-none">
        
        {/* Background Discussion Image (with smooth crossfade) */}
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeScenario.id}
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.99 }}
              transition={{ duration: 0.55, ease: "easeInOut" }}
              className="relative w-full h-full"
            >
              <Image
                src={activeScenario.image}
                alt={activeScenario.altText}
                fill
                className="object-cover object-center"
                sizes="(max-width: 1200px) 100vw, 1200px"
                priority
              />
              {/* Cinematic Vignette / Readability Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-slate-950/70 sm:from-slate-950/80 sm:via-transparent sm:to-slate-950/60" />
              <div className="absolute top-0 left-0 w-full sm:w-2/3 h-1/2 bg-gradient-to-br from-black/60 to-transparent pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-full sm:w-2/3 h-1/2 bg-gradient-to-tl from-black/75 to-transparent pointer-events-none" />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* TOP LAYER: QUESTION BUBBLE (Framer Motion Step 1) */}
        <div className="relative z-10 w-full flex justify-start">
          <AnimatePresence mode="wait">
            <motion.div
              key={`question-${activeScenario.id}`}
              initial={{ opacity: 0, y: -16, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.97 }}
              transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
              className="w-full max-w-md sm:max-w-lg p-4 sm:p-5 rounded-3xl bg-amber-50/95 dark:bg-[#1a150c]/95 border-2 border-amber-300/80 dark:border-amber-500/40 text-amber-950 dark:text-amber-100 shadow-2xl backdrop-blur-xl relative"
            >
              {/* Thought/Speech Bubble Indicator Badge */}
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span className="text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400">
                  💬 Typical Dinner-Table Dilemma:
                </span>
              </div>

              {/* The Parent's Question */}
              <p className="font-serif italic font-semibold text-sm sm:text-base md:text-lg leading-snug text-slate-900 dark:text-amber-50">
                {activeScenario.parentQuestion}
              </p>

              {/* Decorative thought bubble tail on desktop */}
              <div className="hidden sm:block absolute -bottom-2.5 left-8 w-4 h-4 bg-amber-50/95 dark:bg-[#1a150c]/95 border-r-2 border-b-2 border-amber-300/80 dark:border-amber-500/40 rotate-45 transform" />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* MIDDLE LAYER: Subtle Bridge Indicator (Step 2) */}
        <div className="relative z-10 w-full flex justify-center py-2 sm:py-0">
          <motion.div
            key={`bridge-${activeScenario.id}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.25 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-[11px] font-medium shadow-md"
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-400 animate-spin-slow" />
            <span>Answered with Objective Dossier Evidence</span>
            <ArrowRight className="w-3 h-3 text-sky-300" />
          </motion.div>
        </div>

        {/* BOTTOM LAYER: WHATAFTER ANSWER CARD (Framer Motion Step 3) */}
        <div className="relative z-10 w-full flex justify-end">
          <AnimatePresence mode="wait">
            <motion.div
              key={`answer-${activeScenario.id}`}
              initial={{ opacity: 0, y: 20, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.97 }}
              transition={{ duration: 0.45, delay: 0.35, ease: "easeOut" }}
              className="w-full max-w-md sm:max-w-lg p-4 sm:p-6 rounded-3xl bg-white/95 dark:bg-[#07131e]/95 border-2 border-sky-400/50 dark:border-sky-500/40 text-slate-900 dark:text-white shadow-2xl shadow-sky-950/50 backdrop-blur-xl relative"
            >
              {/* Header: WhatAfter Logo & Verification */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200/80 dark:border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-sky-50 dark:bg-white/10 flex items-center justify-center p-1 border border-sky-500/20">
                    <Image
                      src="/what_after_logo_blue.png"
                      alt="WhatAfter Logo"
                      width={24}
                      height={24}
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <span className="font-serif font-bold text-sm sm:text-base block text-slate-950 dark:text-white leading-none">
                      WhatAfter
                    </span>
                    <span className="text-[10px] font-mono text-sky-600 dark:text-sky-400 font-semibold">
                      {activeScenario.reportPage}
                    </span>
                  </div>
                </div>

                <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-[10px] font-mono font-bold">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  <span>Verified Dossier Data</span>
                </div>
              </div>

              {/* The Dossier Answer Text */}
              <p className="text-xs sm:text-sm md:text-base font-medium text-slate-800 dark:text-slate-100 leading-relaxed mb-3">
                {activeScenario.reportEvidence}
              </p>

              {/* Footer Badge */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-white/5 text-[11px] text-slate-500 dark:text-slate-400">
                <span className="inline-flex items-center gap-1.5 font-mono text-sky-700 dark:text-sky-300 font-bold bg-sky-500/10 px-2 py-0.5 rounded-md">
                  <ShieldCheck className="w-3.5 h-3.5 text-sky-500" />
                  {activeScenario.tag}
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  Zero Dinner-Table Conflict
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>

    </div>
  );
}
