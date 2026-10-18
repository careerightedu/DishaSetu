"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, ArrowRight, ShieldCheck, Heart, Sparkles, CheckCircle2 } from "lucide-react";

interface ConversationPrompt {
  id: string;
  topic: string;
  parentQuestion: string;
  reportAnswer: string;
  metricBadge: string;
}

const PROMPTS: ConversationPrompt[] = [
  {
    id: "ai-fear",
    topic: "AI Threat & Job Security",
    parentQuestion: "“Will AI replace software developers before my child even finishes college?”",
    reportAnswer: "AI-Resilience Score 75/100 • High-level system architecture and security protect this path from automation.",
    metricBadge: "Page 08 • AI Resilience Index",
  },
  {
    id: "stream-conflict",
    topic: "Govt Job vs. Tech Builder",
    parentQuestion: "“Should we force our child to prepare for stable government exams instead of private tech?”",
    reportAnswer: "85% Autonomy Trait • Bureaucracy causes friction; product engineering yields higher pay & fulfillment.",
    metricBadge: "Page 03 • Work Values Radar",
  },
  {
    id: "salary-reality",
    topic: "Realistic Salary Expectations",
    parentQuestion: "“Are the ₹50 LPA college placement headlines real, or should we expect something grounded?”",
    reportAnswer: "Verified Indian Market: ₹12–25 LPA starting pay, rising to ₹40–80 LPA at Staff level (7+ yrs).",
    metricBadge: "Page 07 • Salary Trajectory",
  },
];

export default function DinnerTableTranslator() {
  const [activeId, setActiveId] = useState<string>("ai-fear");
  const activePrompt = PROMPTS.find((p) => p.id === activeId) || PROMPTS[0];

  return (
    <div className="w-full max-w-full min-w-0 rounded-2xl bg-white dark:bg-[#07131e] border border-slate-200 dark:border-white/10 shadow-lg overflow-hidden text-left">
      {/* Tab Selector */}
      <div className="flex w-full max-w-full min-w-0 border-b border-slate-200 dark:border-white/10 overflow-x-auto no-scrollbar bg-slate-100/70 dark:bg-black/40 p-2 gap-1.5 text-xs sm:text-sm">
        {PROMPTS.map((prompt) => {
          const isSelected = activeId === prompt.id;
          return (
            <button
              key={prompt.id}
              onClick={() => setActiveId(prompt.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold shrink-0 whitespace-nowrap transition-all ${
                isSelected
                  ? "bg-white dark:bg-sky-500 text-slate-950 dark:text-slate-950 shadow-sm font-bold ring-1 ring-slate-200/80 dark:ring-transparent"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white"
              }`}
            >
              {prompt.topic}
            </button>
          );
        })}
      </div>

      {/* Content Card with AnimatePresence */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activePrompt.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
          className="p-5 sm:p-7 space-y-4 w-full min-w-0"
        >
          {/* Parent Anxiety / Question */}
          <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/25 w-full min-w-0">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400 block mb-1.5">
              💬 Typical Dinner-Table Question:
            </span>
            <p className="font-serif italic text-base sm:text-lg text-slate-900 dark:text-slate-100 break-words leading-snug">
              {activePrompt.parentQuestion}
            </p>
          </div>

          {/* Arrow divider */}
          <div className="flex items-center justify-center text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-medium gap-2 text-center py-0.5">
            <Sparkles className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
            <span className="break-words font-semibold">Answered with Objective Dossier Evidence ↓</span>
          </div>

          {/* Dossier Data Answer */}
          <div className="p-4 sm:p-5 rounded-2xl bg-sky-500/10 border border-sky-500/30 space-y-2.5 w-full min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 w-full min-w-0">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-sky-800 dark:text-sky-400 flex items-center gap-1.5 shrink-0">
                <CheckCircle2 className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
                <span>WhatAfter Report Evidence:</span>
              </span>
              <span className="text-xs font-mono font-semibold text-slate-600 dark:text-slate-400">
                {activePrompt.metricBadge}
              </span>
            </div>
            <p className="text-sm sm:text-base text-slate-800 dark:text-slate-100 leading-relaxed font-medium break-words">
              {activePrompt.reportAnswer}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
