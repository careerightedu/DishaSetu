"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Cpu, 
  Palette, 
  Compass, 
  LineChart, 
  Key, 
  MessageSquare,
  Sparkles,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

export interface TraitItem {
  id: string;
  name: string;
  score: number;
  percentile: string;
  category: "Aptitude" | "Work Value" | "Cognitive Style";
  headline: string;
  behavioral: string;
  workImplication: string;
  frictionPoint: string;
  icon: React.ElementType;
}

const SAMPLE_TRAITS: TraitItem[] = [
  {
    id: "analytical",
    name: "Analytical Reasoning",
    score: 82,
    percentile: "91st Percentile",
    category: "Aptitude",
    headline: "Strong pattern recognition and structured problem solving.",
    behavioral: "Decomposes ambiguous questions into first-principles logic trees.",
    workImplication: "System architectures, algorithmic logic, root-cause diagnostics.",
    frictionPoint: "Subjective arbitrary decisions lacking measurable evidence.",
    icon: Cpu,
  },
  {
    id: "creative",
    name: "Creative Thinking",
    score: 61,
    percentile: "68th Percentile",
    category: "Cognitive Style",
    headline: "Prefers structured creativity over open-ended ideation.",
    behavioral: "Innovates by combining, remixing, and optimizing proven systems.",
    workImplication: "Applied product engineering, UX architecture, workflow leverage.",
    frictionPoint: "Unconstrained open-ended brainstorming without boundaries.",
    icon: Palette,
  },
  {
    id: "spatial",
    name: "Spatial & Systems Logic",
    score: 88,
    percentile: "95th Percentile",
    category: "Aptitude",
    headline: "High 3D visualization and physical system mental modeling.",
    behavioral: "Perceives how physical components interact dynamically in space.",
    workImplication: "Robotics kinematics, embedded hardware, physical infrastructure.",
    frictionPoint: "Purely abstract paperwork with no physical or spatial grounding.",
    icon: Compass,
  },
  {
    id: "quantitative",
    name: "Quantitative Acumen",
    score: 78,
    percentile: "86th Percentile",
    category: "Aptitude",
    headline: "Intuitive grasp of statistical patterns and computational metrics.",
    behavioral: "Evaluates risk, probability, and trade-offs using quantitative metrics.",
    workImplication: "Telemetry pipelines, unit-economics modeling, data systems.",
    frictionPoint: "Environments that ignore data base rates in favor of hype.",
    icon: LineChart,
  },
  {
    id: "autonomy",
    name: "Work Autonomy",
    score: 86,
    percentile: "93rd Percentile",
    category: "Work Value",
    headline: "Thrives with high ownership; suffocates under micromanagement.",
    behavioral: "Takes relentless self-directed ownership when given objective freedom.",
    workImplication: "Asynchronous teams, frontier labs, early architecture ownership.",
    frictionPoint: "Rigid multi-tier approval chains and mandatory check-in bureaucracy.",
    icon: Key,
  },
  {
    id: "verbal",
    name: "Verbal Synthesis",
    score: 74,
    percentile: "81st Percentile",
    category: "Cognitive Style",
    headline: "Articulates complex technical mechanics into concise narratives.",
    behavioral: "Translates between deep-specialist engineers and executive leaders.",
    workImplication: "Technical product leadership, system architecture, solutions engineering.",
    frictionPoint: "Meetings that could have been a 2-paragraph technical memo.",
    icon: MessageSquare,
  },
];

export default function InteractiveCognitiveRadar() {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const activeTrait = SAMPLE_TRAITS[activeIndex];

  // SVG Radar Dimensions
  const size = 360;
  const cx = size / 2;
  const cy = size / 2;
  const maxR = size * 0.40;
  const N = SAMPLE_TRAITS.length;

  // Grid levels (20%, 40%, 60%, 80%, 100%)
  const levels = [0.2, 0.4, 0.6, 0.8, 1.0];

  // Calculate coordinates for a given trait index and radius ratio
  const getCoordinates = (index: number, ratio: number) => {
    const angle = (2 * Math.PI * index) / N - Math.PI / 2;
    const r = ratio * maxR;
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    };
  };

  // Build the active polygon points string
  const polygonPoints = SAMPLE_TRAITS.map((t, i) => {
    const coords = getCoordinates(i, t.score / 100);
    return `${coords.x},${coords.y}`;
  }).join(" ");

  return (
    <div className="w-full rounded-2xl bg-white dark:bg-[#07131e] text-slate-900 dark:text-white border border-slate-200 dark:border-sky-500/40 shadow-xl dark:shadow-2xl p-4 sm:p-7 relative overflow-hidden transition-colors">
      {/* Ambient glow backdrop */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/5 dark:bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-500/5 dark:bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-200 dark:border-white/10 relative z-10">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-sky-50 dark:bg-sky-500/15 border border-sky-200 dark:border-sky-500/30 text-sky-700 dark:text-sky-400 text-xs font-mono font-bold uppercase tracking-wider mb-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Sample Fingerprint</span>
          </div>
          <h3 className="text-lg sm:text-2xl font-serif font-bold text-slate-900 dark:text-white tracking-tight">
            Explore a Sample Cognitive Fingerprint
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            Hover or tap any node to inspect psychological traits and work implications.
          </p>
        </div>

        {/* Trait count indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 shrink-0 self-start sm:self-auto">
          <span className="w-2 h-2 rounded-full bg-sky-500 dark:bg-sky-400 animate-ping" />
          <span className="text-xs font-mono font-bold text-sky-700 dark:text-sky-300">
            35 Traits Synthesized
          </span>
        </div>
      </div>

      {/* Main interactive workbench grid */}
      <div className="grid lg:grid-cols-12 gap-8 items-center mt-6 relative z-10">
        
        {/* ========================================================= */}
        {/* LEFT COLUMN: INTERACTIVE SVG RADAR CHART                  */}
        {/* ========================================================= */}
        <div className="lg:col-span-6 flex flex-col items-center">
          <div className="relative w-full max-w-[380px] aspect-square flex items-center justify-center">
            
            <svg 
              viewBox={`0 0 ${size} ${size}`} 
              className="w-full h-full select-none overflow-visible"
            >
              <defs>
                {/* Luminous sky blue fill gradient */}
                <radialGradient id="radarFillGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.45" />
                  <stop offset="70%" stopColor="#0ea5e9" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#0284c7" stopOpacity="0.1" />
                </radialGradient>

                {/* Glow filter for active point */}
                <filter id="pointGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Concentric reference grid levels (theme aware) */}
              {levels.map((lvl) => {
                const points = SAMPLE_TRAITS.map((_, i) => {
                  const c = getCoordinates(i, lvl);
                  return `${c.x},${c.y}`;
                }).join(" ");
                return (
                  <polygon
                    key={lvl}
                    points={points}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={lvl === 1.0 ? "1.5" : "1"}
                    strokeDasharray={lvl === 1.0 ? "none" : "3 3"}
                    className="text-slate-300 dark:text-white/15"
                  />
                );
              })}

              {/* Radial axis lines (theme aware) */}
              {SAMPLE_TRAITS.map((_, i) => {
                const outer = getCoordinates(i, 1.0);
                const isActive = i === activeIndex;
                return (
                  <line
                    key={i}
                    x1={cx}
                    y1={cy}
                    x2={outer.x}
                    y2={outer.y}
                    stroke="currentColor"
                    strokeWidth={isActive ? "2" : "1"}
                    className={isActive ? "text-sky-500" : "text-slate-300 dark:text-white/15"}
                  />
                );
              })}

              {/* The Data Polygon */}
              <polygon
                points={polygonPoints}
                fill="url(#radarFillGrad)"
                stroke="#0ea5e9"
                strokeWidth="3"
                strokeLinejoin="round"
                className="transition-all duration-300"
              />

              {/* Interactive Vertices */}
              {SAMPLE_TRAITS.map((t, i) => {
                const coords = getCoordinates(i, t.score / 100);
                const isActive = i === activeIndex;

                return (
                  <g 
                    key={t.id} 
                    className="cursor-pointer group"
                    onClick={() => setActiveIndex(i)}
                    onMouseEnter={() => setActiveIndex(i)}
                  >
                    {/* Active pulse aura */}
                    {isActive && (
                      <circle
                        cx={coords.x}
                        cy={coords.y}
                        r="16"
                        fill="#0ea5e9"
                        fillOpacity="0.25"
                        className="animate-ping"
                      />
                    )}

                    {/* Point hit target (invisible larger area for easy touch) */}
                    <circle
                      cx={coords.x}
                      cy={coords.y}
                      r="20"
                      fill="transparent"
                    />

                    {/* Outer ring */}
                    <circle
                      cx={coords.x}
                      cy={coords.y}
                      r={isActive ? "9" : "6"}
                      fill={isActive ? "#0ea5e9" : "#0284c7"}
                      stroke="#ffffff"
                      strokeWidth={isActive ? "2.5" : "1.5"}
                      filter={isActive ? "url(#pointGlow)" : "none"}
                      className="transition-all duration-200"
                    />

                    {/* Center core */}
                    {isActive && (
                      <circle
                        cx={coords.x}
                        cy={coords.y}
                        r="3.5"
                        fill="#ffffff"
                      />
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Central classification token */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
              <span className="text-[10px] font-mono uppercase tracking-wider text-sky-600 dark:text-sky-400 font-bold block">
                COGNITIVE
              </span>
              <span className="text-xs font-serif font-bold text-slate-900 dark:text-white block">
                RIC 82
              </span>
            </div>
          </div>

          {/* Quick select buttons under the radar */}
          <div className="flex flex-wrap justify-center gap-1.5 mt-3 max-w-[420px]">
            {SAMPLE_TRAITS.map((t, i) => (
              <button
                key={t.id}
                onClick={() => setActiveIndex(i)}
                onMouseEnter={() => setActiveIndex(i)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 ${
                  activeIndex === i
                    ? "bg-sky-500 text-white dark:text-slate-950 font-bold shadow-md shadow-sky-500/20 scale-105"
                    : "bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/5"
                }`}
              >
                <span>{t.name.split(" ")[0]}</span>
                <span className="opacity-80">({t.score})</span>
              </button>
            ))}
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: DEEP PSYCHOLOGICAL DIAGNOSTIC CARD          */}
        {/* ========================================================= */}
        <div className="lg:col-span-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTrait.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="p-6 sm:p-7 rounded-2xl bg-slate-50/90 dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-md relative overflow-hidden shadow-sm dark:shadow-none"
            >
              {/* Top Bar with Icon & Score */}
              <div className="flex items-center justify-between gap-3 mb-4 pb-4 border-b border-slate-200 dark:border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-sky-100 dark:bg-sky-500/20 border border-sky-300 dark:border-sky-500/40 text-sky-700 dark:text-sky-400 flex items-center justify-center shrink-0 shadow-sm">
                    <activeTrait.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-sky-700 dark:text-sky-400 font-bold block">
                      {activeTrait.category} • {activeTrait.percentile}
                    </span>
                    <h4 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 dark:text-white">
                      {activeTrait.name} — <span className="text-sky-600 dark:text-sky-400 font-mono">{activeTrait.score}</span>
                    </h4>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400 block">
                    Diagnostic Score
                  </span>
                  <span className="text-lg font-mono font-bold text-sky-600 dark:text-sky-400">
                    {activeTrait.score}/100
                  </span>
                </div>
              </div>

              {/* The Core Insight Highlight */}
              <div className="p-4 rounded-xl bg-sky-50 dark:bg-sky-500/10 border border-sky-200 dark:border-sky-500/30 mb-5">
                <span className="text-[10px] font-mono uppercase font-bold text-sky-700 dark:text-sky-300 block mb-1">
                  Psychological Reality
                </span>
                <p className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug">
                  &ldquo;{activeTrait.headline}&rdquo;
                </p>
              </div>

              {/* Detailed Breakdown Sections */}
              <div className="space-y-3.5 text-xs sm:text-sm">
                <div>
                  <span className="text-[11px] font-mono uppercase text-slate-500 dark:text-slate-400 font-bold block mb-1">
                    Behavioral Mechanism:
                  </span>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    {activeTrait.behavioral}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-white/5">
                  <span className="text-[11px] font-mono uppercase text-sky-700 dark:text-sky-400 font-bold block mb-1 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" /> High-Affinity Environment:
                  </span>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    {activeTrait.workImplication}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-white/5">
                  <span className="text-[11px] font-mono uppercase text-amber-700 dark:text-amber-400 font-bold block mb-1 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" /> Environmental Friction Point:
                  </span>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    {activeTrait.frictionPoint}
                  </p>
                </div>
              </div>

              {/* Bottom Assurance Note */}
              <div className="mt-5 pt-3.5 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                <span>Objective scenario measurement</span>
                <span className="text-sky-600 dark:text-sky-400 font-semibold">Zero generic personality boxes</span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
