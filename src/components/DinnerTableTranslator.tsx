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
    reportAnswer: "AI-Resilience Score 75/100. Routine syntax is automated, but high-level system architecture, security compliance, and business domain logic protect this career path from pure AI automation.",
    metricBadge: "Report Page 08 • AI Resilience Index",
  },
  {
    id: "stream-conflict",
    topic: "Govt Job vs. Tech Builder",
    parentQuestion: "“Should we force our child to prepare for stable government exams instead of private tech?”",
    reportAnswer: "Candidate exhibits 85% Work Autonomy and Divergent Analytical Reasoning. Strict bureaucratic hierarchies cause friction; dynamic product engineering provides both higher earnings and fulfillment.",
    metricBadge: "Report Page 03 • Work Values Radar",
  },
  {
    id: "salary-reality",
    topic: "Realistic Salary Expectations",
    parentQuestion: "“Are the ₹50 LPA college placement headlines real, or should we expect something grounded?”",
    reportAnswer: "Calibrated Indian labor market data: ₹12–25 LPA for top product entry-level roles, progressing systematically to ₹40–80 LPA at Staff Architect level over 7+ years.",
    metricBadge: "Report Page 07 • Salary Trajectory",
  },
];

export default function DinnerTableTranslator() {
  const [activeId, setActiveId] = useState<string>("ai-fear");
  const activePrompt = PROMPTS.find((p) => p.id === activeId) || PROMPTS[0];

  return (
    <div className="w-full rounded-2xl bg-white dark:bg-[#07131e] border border-slate-200 dark:border-white/10 shadow-lg overflow-hidden text-left">
      {/* Tab Selector */}
      <div className="flex border-b border-slate-200 dark:border-white/10 overflow-x-auto bg-slate-50 dark:bg-black/40 p-1.5 gap-1 text-xs">
        {PROMPTS.map((prompt) => {
          const isSelected = activeId === prompt.id;
          return (
            <button
              key={prompt.id}
              onClick={() => setActiveId(prompt.id)}
              className={`px-3 py-1.5 rounded-lg font-mono text-xs font-semibold whitespace-nowrap transition-all ${
                isSelected
                  ? "bg-white dark:bg-emerald-500 text-slate-900 dark:text-slate-950 shadow-xs font-bold"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
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
          className="p-5 sm:p-6 space-y-4"
        >
          {/* Parent Anxiety / Question */}
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs sm:text-sm">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 block mb-1">
              💬 Typical Dinner-Table Question:
            </span>
            <p className="font-serif italic text-slate-800 dark:text-slate-200">
              {activePrompt.parentQuestion}
            </p>
          </div>

          {/* Arrow divider */}
          <div className="flex items-center justify-center text-slate-400 dark:text-slate-500 text-xs font-mono gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
            <span>Answered with Objective Dossier Data ↓</span>
          </div>

          {/* Dossier Data Answer */}
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs sm:text-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>WhatAfter Grounded Evidence:</span>
              </span>
              <span className="text-[10px] font-mono font-semibold text-slate-500 dark:text-slate-400">
                {activePrompt.metricBadge}
              </span>
            </div>
            <p className="text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
              {activePrompt.reportAnswer}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
