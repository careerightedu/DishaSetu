"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Cpu, 
  Palette, 
  Compass, 
  LineChart, 
  MessageSquare, 
  Key, 
  Sparkles, 
  ZoomIn, 
  FileText
} from "lucide-react";

export interface RadarTraitItem {
  id: string;
  name: string;
  score: number;
  takeaway: string;
  subdetail: string;
  icon: React.ElementType;
  color: string;
}

const TRAITS: RadarTraitItem[] = [
  {
    id: "analytical",
    name: "Analytical Reasoning",
    score: 82,
    takeaway: "Strong pattern recognition and structured problem solving.",
    subdetail: "Decomposes ambiguous questions into first-principles logic trees.",
    icon: Cpu,
    color: "#10b981", // emerald
  },
  {
    id: "creative",
    name: "Creative Thinking",
    score: 61,
    takeaway: "Prefers structured creativity over open-ended ideation.",
    subdetail: "Innovates by combining, remixing, and optimizing proven frameworks.",
    icon: Palette,
    color: "#14b8a6", // teal
  },
  {
    id: "spatial",
    name: "Spatial & Systems Logic",
    score: 78,
    takeaway: "High 3D mental modeling and system architecture intuition.",
    subdetail: "Mentally simulates how complex physical and digital components interact in space.",
    icon: Compass,
    color: "#06b6d4", // cyan
  },
  {
    id: "numerical",
    name: "Numerical Aptitude",
    score: 74,
    takeaway: "Quantitative reasoning and statistical comfort.",
    subdetail: "Evaluates risk, probability, and trade-offs using mathematical models.",
    icon: LineChart,
    color: "#3b82f6", // blue
  },
  {
    id: "verbal",
    name: "Verbal Reasoning",
    score: 72,
    takeaway: "Clear conceptual communication and articulate reasoning.",
    subdetail: "Translates nuanced technical mechanics into concise, structured narratives.",
    icon: MessageSquare,
    color: "#8b5cf6", // purple
  },
  {
    id: "autonomy",
    name: "Work Autonomy",
    score: 85,
    takeaway: "Takes relentless self-directed ownership with low micromanagement.",
    subdetail: "Thrives when given clear outcome goals with the freedom to execute independently.",
    icon: Key,
    color: "#f59e0b", // amber
  },
];

interface Props {
  onZoomPdf?: () => void;
}

export default function ReportPage03InteractiveRadar({ onZoomPdf }: Props) {
  const [activeId, setActiveId] = useState<string>("analytical");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [viewPdf, setViewPdf] = useState<boolean>(false);

  // Auto-cycle through traits automatically when not hovered
  useEffect(() => {
    if (hoveredId !== null || viewPdf) return;
    const interval = setInterval(() => {
      setActiveId((current) => {
        const currentIndex = TRAITS.findIndex((t) => t.id === current);
        const nextIndex = (currentIndex + 1) % TRAITS.length;
        return TRAITS[nextIndex].id;
      });
    }, 2800);
    return () => clearInterval(interval);
  }, [hoveredId, viewPdf]);

  // Active trait to show: hovered takes precedence, otherwise selected
  const activeTrait = TRAITS.find((t) => t.id === (hoveredId || activeId)) || TRAITS[0];
  const activeIndex = TRAITS.findIndex((t) => t.id === activeTrait.id);

  // SVG Radar Dimensions
  const size = 320;
  const cx = size / 2;
  const cy = size / 2;
  const maxR = size * 0.38;
  const N = TRAITS.length; // 6 vertices (Hexagon)

  const getCoordinates = (index: number, ratio: number) => {
    const angle = (2 * Math.PI * index) / N - Math.PI / 2;
    const r = ratio * maxR;
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    };
  };

  const levels = [0.25, 0.5, 0.75, 1.0];

  const polygonPoints = TRAITS.map((t, i) => {
    const coords = getCoordinates(i, t.score / 100);
    return `${coords.x},${coords.y}`;
  }).join(" ");

  const IconComp = activeTrait.icon;

  return (
    <div className="w-full rounded-2xl bg-white dark:bg-[#07131e] text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 shadow-xl overflow-hidden transition-all">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3.5 bg-slate-50 dark:bg-black/40 border-b border-slate-200 dark:border-white/10 text-xs">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-bold block mb-0.5">
            Sample Dossier • Page 03
          </span>
          <div className="flex items-center gap-2">
            <h4 className="text-sm sm:text-base font-serif font-bold text-slate-900 dark:text-white">
              Explore a sample Cognitive Fingerprint
            </h4>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
              <span className={`w-1.5 h-1.5 rounded-full bg-emerald-500 ${hoveredId !== null ? "" : "animate-ping"}`} />
              <span>{hoveredId !== null ? "Paused" : "Live Auto-Cycle"}</span>
            </div>
          </div>
        </div>

        {/* View Switcher: Interactive vs PDF */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          <button
            onClick={() => setViewPdf(false)}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition-all flex items-center gap-1.5 ${
              !viewPdf
                ? "bg-white dark:bg-emerald-500 text-slate-900 dark:text-slate-950 shadow-sm border border-slate-200 dark:border-transparent font-bold"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Sparkles className="w-3 h-3 text-emerald-500 dark:text-slate-950" />
            <span>Interactive</span>
          </button>
          <button
            onClick={() => setViewPdf(true)}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition-all flex items-center gap-1.5 ${
              viewPdf
                ? "bg-white dark:bg-emerald-500 text-slate-900 dark:text-slate-950 shadow-sm border border-slate-200 dark:border-transparent font-bold"
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
            src="/report/cognitive-fingerprint.png"
            alt="Cognitive Fingerprint Static Report Page"
            fill
            unoptimized
            quality={100}
            className="object-contain p-3 transition-transform duration-300 group-hover:scale-[1.02]"
          />
          <div className="absolute top-3 right-3 px-3 py-1.5 rounded-full bg-black/75 border border-white/15 text-white text-xs font-medium backdrop-blur-md flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
            <ZoomIn className="w-3.5 h-3.5 text-emerald-400" />
            <span>Click to Fullscreen Zoom</span>
          </div>
          <div className="absolute bottom-3 left-3 right-3 px-3 py-2 rounded-xl bg-slate-950/85 border border-white/10 text-white text-[11px] backdrop-blur-md flex items-center justify-between">
            <span className="text-slate-300">High-Resolution PDF Page 03</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setViewPdf(false);
              }}
              className="text-emerald-400 hover:underline font-bold"
            >
              Switch to Live Interactive Radar ↑
            </button>
          </div>
        </div>
      ) : (
        /* Interactive Radar Chart View */
        <div className="p-4 sm:p-6">
          <div className="grid md:grid-cols-12 gap-6 lg:gap-8 items-center">
            
            {/* Left Column: SVG Radar Chart */}
            <div className="md:col-span-6 flex flex-col items-center">
              <p className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 text-center">
                Hover or tap any axis node:
              </p>

              {/* SVG Radar Visual */}
              <div className="relative w-full max-w-[280px] sm:max-w-[310px] aspect-square mx-auto flex items-center justify-center select-none my-1">
                <svg
                  viewBox={`0 0 ${size} ${size}`}
                  className="w-full h-full overflow-visible"
                >
                  <defs>
                    <radialGradient id="interactiveRadarFill" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.5" />
                      <stop offset="70%" stopColor="#10b981" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#059669" stopOpacity="0.08" />
                    </radialGradient>
                  </defs>

                  {/* Concentric Reference Grid Levels */}
                  {levels.map((lvl) => {
                    const points = Array.from({ length: N })
                      .map((_, i) => {
                        const c = getCoordinates(i, lvl);
                        return `${c.x},${c.y}`;
                      })
                      .join(" ");

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

                  {/* Radial Spokes from Center */}
                  {Array.from({ length: N }).map((_, i) => {
                    const outer = getCoordinates(i, 1.0);
                    const isSpokeActive = i === activeIndex;

                    return (
                      <line
                        key={i}
                        x1={cx}
                        y1={cy}
                        x2={outer.x}
                        y2={outer.y}
                        stroke="currentColor"
                        strokeWidth={isSpokeActive ? "2" : "1"}
                        className={isSpokeActive ? "text-emerald-500" : "text-slate-200 dark:text-white/15"}
                      />
                    );
                  })}

                  {/* Data Polygon */}
                  <polygon
                    points={polygonPoints}
                    fill="url(#interactiveRadarFill)"
                    stroke="#10b981"
                    strokeWidth="2.5"
                    strokeLinejoin="round"
                    className="transition-all duration-300"
                  />

                  {/* Interactive Vertices */}
                  {TRAITS.map((t, i) => {
                    const coords = getCoordinates(i, t.score / 100);
                    const isSelected = activeTrait.id === t.id;

                    return (
                      <g
                        key={t.id}
                        className="cursor-pointer group"
                        onMouseEnter={() => setHoveredId(t.id)}
                        onMouseLeave={() => setHoveredId(null)}
                        onClick={() => setActiveId(t.id)}
                      >
                        {/* Generous hit area for easy hover/touch */}
                        <circle cx={coords.x} cy={coords.y} r="20" fill="transparent" />

                        {/* Active Ping Aura */}
                        {isSelected && (
                          <circle
                            cx={coords.x}
                            cy={coords.y}
                            r="14"
                            fill="#10b981"
                            fillOpacity="0.3"
                            className="animate-ping"
                          />
                        )}

                        {/* Node Core */}
                        <circle
                          cx={coords.x}
                          cy={coords.y}
                          r={isSelected ? "7" : "5"}
                          fill={isSelected ? "#10b981" : "#059669"}
                          stroke="#ffffff"
                          strokeWidth={isSelected ? "2.5" : "1.5"}
                          className="transition-all duration-200"
                        />
                      </g>
                    );
                  })}

                  {/* Peripheral Axis Labels (Clickable/Hoverable) */}
                  {TRAITS.map((t, i) => {
                    const outer = getCoordinates(i, 1.22);
                    const isSelected = activeTrait.id === t.id;

                    return (
                      <text
                        key={`text-${t.id}`}
                        x={outer.x}
                        y={outer.y + 4}
                        textAnchor="middle"
                        onMouseEnter={() => setHoveredId(t.id)}
                        onMouseLeave={() => setHoveredId(null)}
                        onClick={() => setActiveId(t.id)}
                        className={`text-[10px] font-mono font-bold cursor-pointer transition-all ${
                          isSelected
                            ? "fill-emerald-600 dark:fill-emerald-400 font-black scale-105"
                            : "fill-slate-600 dark:fill-slate-400 hover:fill-slate-900 dark:hover:fill-white"
                        }`}
                      >
                        {t.name.split(" ")[0].toUpperCase()} ({t.score})
                      </text>
                    );
                  })}
                </svg>

                {/* Center Token */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold block">
                    35-Trait
                  </span>
                  <span className="text-[11px] font-mono font-black text-emerald-600 dark:text-emerald-400 block">
                    Radar
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Detailed Trait Card */}
            <div className="md:col-span-6 space-y-3.5">
              {/* THE EXACT REQUESTED HOVER CARD */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTrait.id}
                  initial={{ opacity: 0, y: 3 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -3 }}
                  transition={{ duration: 0.15 }}
                  className="p-4 rounded-xl bg-emerald-50/70 dark:bg-[#061019] border border-emerald-500/30 shadow-sm space-y-2"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                        <IconComp className="w-4 h-4" />
                      </div>
                      <h5 className="text-sm font-serif font-bold text-slate-900 dark:text-white">
                        {activeTrait.name} — <span className="font-mono text-emerald-600 dark:text-emerald-400">{activeTrait.score}</span>
                      </h5>
                    </div>
                    <span className="text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400 font-semibold px-2 py-0.5 rounded bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10">
                      Measured Score
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm font-semibold text-emerald-800 dark:text-emerald-300 leading-snug">
                    {activeTrait.takeaway}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {activeTrait.subdetail}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
