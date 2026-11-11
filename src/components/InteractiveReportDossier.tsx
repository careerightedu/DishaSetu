"use client";

import React, { useState } from "react";
import { Radar, Target, TrendingUp, Sparkles, CheckCircle2, ShieldCheck, Zap } from "lucide-react";

export default function InteractiveReportDossier() {
  const [activeTab, setActiveTab] = useState<0 | 1 | 2>(0);

  return (
    <div className="w-full flex flex-col items-center">
      {/* Tab Switcher Pills */}
      <div className="flex items-center gap-2 pb-4 mb-3 border-b border-[var(--brand-line)] w-full overflow-x-auto">
        {[
          { label: "Page 03", title: "Cognitive Fingerprint" },
          { label: "Page 07", title: "Career Deep-Dive" },
          { label: "Page 11", title: "3-Year Action Plan" },
        ].map((tab, idx) => {
          const isActive = activeTab === idx;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveTab(idx as 0 | 1 | 2)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? "bg-[var(--brand-navy)] dark:bg-[var(--brand-accent)] text-white dark:text-[#00123A] shadow-xs"
                  : "bg-[var(--brand-bg)] text-[var(--brand-muted)] hover:text-[var(--brand-ink)]"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Crisp Vector Graphic Canvas (A4 Sheet Mockup) */}
      <div className="w-full max-w-[520px] rounded-2xl bg-[#071324] text-white border border-[#172D4D] shadow-2xl p-4 sm:p-5 select-none overflow-hidden transition-all duration-300">
        
        {/* ======================= TAB 0: COGNITIVE RADAR & TRAITS ======================= */}
        {activeTab === 0 && (
          <div className="space-y-4 animate-in fade-in duration-300">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-y-1.5 border-b border-slate-800 pb-2.5">
              <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-800 whitespace-nowrap">
                03 • COGNITIVE PROFILE
              </span>
              <span className="text-[10px] font-mono text-slate-400 tracking-wider whitespace-nowrap">
                CONFIDENTIAL · 2026
              </span>
            </div>

            <div>
              <h3 className="font-heading font-extrabold text-base sm:text-lg text-white tracking-tight">
                Your cognitive fingerprint
              </h3>
              <p className="text-[11px] text-slate-400 leading-snug mt-0.5">
                Composite of 35 traits measured across 80 responses. Downstream matches derive from this shape.
              </p>
            </div>

            {/* Radar & Aptitude Bars Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 items-center bg-[#0B1B33] border border-[#16315C] rounded-xl p-3 sm:p-3.5">
              {/* Left: Vector Radar SVG */}
              <div className="flex flex-col items-center justify-center">
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="text-[10px] font-bold text-white uppercase tracking-wider flex items-center gap-1">
                    <Radar className="w-3 h-3 text-sky-400" /> Trait Radar
                  </span>
                  <span className="text-[8px] font-mono text-emerald-400 bg-emerald-950/80 px-1.5 py-0.2 rounded border border-emerald-800/80">
                    35-TRAIT
                  </span>
                </div>

                <svg viewBox="0 0 200 190" className="w-[155px] h-[150px] overflow-visible">
                  {/* Concentric Polygons */}
                  {[0.25, 0.5, 0.75, 1].map((scale, i) => (
                    <polygon
                      key={i}
                      points="100,20 176,55 160,140 100,165 40,140 24,55"
                      fill="none"
                      stroke="#1B3B66"
                      strokeWidth={1}
                      transform={`scale(${scale}) translate(${100 * (1 - scale)}, ${95 * (1 - scale)})`}
                    />
                  ))}

                  {/* Axes */}
                  <line x1="100" y1="95" x2="100" y2="20" stroke="#1B3B66" strokeWidth={1} />
                  <line x1="100" y1="95" x2="176" y2="55" stroke="#1B3B66" strokeWidth={1} />
                  <line x1="100" y1="95" x2="160" y2="140" stroke="#1B3B66" strokeWidth={1} />
                  <line x1="100" y1="95" x2="100" y2="165" stroke="#1B3B66" strokeWidth={1} />
                  <line x1="100" y1="95" x2="40" y2="140" stroke="#1B3B66" strokeWidth={1} />
                  <line x1="100" y1="95" x2="24" y2="55" stroke="#1B3B66" strokeWidth={1} />

                  {/* Filled Polygon */}
                  <polygon
                    points="100,28 168,60 150,132 100,158 50,130 35,60"
                    fill="#0EA5E9"
                    fillOpacity="0.25"
                    stroke="#38BDF8"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />

                  {/* Nodes */}
                  {[
                    [100, 28],
                    [168, 60],
                    [150, 132],
                    [100, 158],
                    [50, 130],
                    [35, 60],
                  ].map(([x, y], i) => (
                    <circle key={i} cx={x} cy={y} r="3" fill="#38BDF8" stroke="#071324" strokeWidth="1" />
                  ))}

                  {/* Labels */}
                  <text x="100" y="12" textAnchor="middle" fill="#7DD3FC" fontSize="8" fontWeight="bold">LOGICAL (92)</text>
                  <text x="180" y="58" textAnchor="start" fill="#7DD3FC" fontSize="8" fontWeight="bold">NUMERICAL (87)</text>
                  <text x="165" y="148" textAnchor="start" fill="#7DD3FC" fontSize="8" fontWeight="bold">CREATIVE (76)</text>
                  <text x="100" y="178" textAnchor="middle" fill="#7DD3FC" fontSize="8" fontWeight="bold">SPATIAL (82)</text>
                  <text x="35" y="148" textAnchor="end" fill="#7DD3FC" fontSize="8" fontWeight="bold">AUTONOMY (91)</text>
                  <text x="20" y="58" textAnchor="end" fill="#7DD3FC" fontSize="8" fontWeight="bold">VERBAL (78)</text>
                </svg>
              </div>

              {/* Right: Aptitudes & Values Bars */}
              <div className="space-y-2">
                <div className="flex items-center justify-between border-b border-slate-800 pb-1">
                  <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider">Core Aptitudes</span>
                  <span className="text-[8px] font-mono text-slate-500">Scale 0-100</span>
                </div>
                {[
                  { name: "Logical", score: 92, color: "bg-sky-400" },
                  { name: "Numerical", score: 87, color: "bg-sky-400" },
                  { name: "Spatial", score: 82, color: "bg-teal-400" },
                  { name: "Verbal", score: 78, color: "bg-teal-400" },
                  { name: "Creative", score: 76, color: "bg-indigo-400" },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-[10px]">
                    <span className="w-16 text-slate-300 font-medium truncate">{item.name}</span>
                    <div className="flex-1 h-1.5 bg-[#172D4D] rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.score}%` }} />
                    </div>
                    <span className="font-mono text-[10px] text-slate-400 w-5 text-right">{item.score}</span>
                  </div>
                ))}

                <div className="flex items-center justify-between border-b border-slate-800 pt-1 pb-1">
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Top Drivers</span>
                  <span className="text-[8px] font-mono text-slate-500">Work Values</span>
                </div>
                {[
                  { name: "Autonomy", score: 91, color: "bg-amber-400" },
                  { name: "Mastery", score: 88, color: "bg-amber-400" },
                  { name: "Impact", score: 80, color: "bg-amber-500" },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-[10px]">
                    <span className="w-16 text-slate-300 font-medium truncate">{item.name}</span>
                    <div className="flex-1 h-1.5 bg-[#172D4D] rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.score}%` }} />
                    </div>
                    <span className="font-mono text-[10px] text-amber-400 w-5 text-right">{item.score}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Insight Badges */}
            <div className="grid grid-cols-3 gap-2 text-left">
              <div className="bg-[#0B1B33] border border-[#16315C] rounded-lg p-2.5">
                <span className="text-[8px] font-mono text-sky-400 uppercase tracking-wider block">COGNITIVE STYLE</span>
                <span className="text-[11px] font-bold text-white block mt-0.5">Analytical-Divergent</span>
                <span className="text-[9px] text-slate-400 leading-tight block mt-0.5">Maps logic before building</span>
              </div>
              <div className="bg-[#0B1B33] border border-[#16315C] rounded-lg p-2.5">
                <span className="text-[8px] font-mono text-amber-400 uppercase tracking-wider block">DECISION MAKING</span>
                <span className="text-[11px] font-bold text-white block mt-0.5">Evidence-First</span>
                <span className="text-[9px] text-slate-400 leading-tight block mt-0.5">Fast with data, slow with hype</span>
              </div>
              <div className="bg-[#0B1B33] border border-[#16315C] rounded-lg p-2.5">
                <span className="text-[8px] font-mono text-purple-400 uppercase tracking-wider block">LEARNING STYLE</span>
                <span className="text-[11px] font-bold text-white block mt-0.5">Build-To-Learn</span>
                <span className="text-[9px] text-slate-400 leading-tight block mt-0.5">Hands-on visual feedback</span>
              </div>
            </div>
          </div>
        )}

        {/* ======================= TAB 1: CAREER DEEP-DIVE ======================= */}
        {activeTab === 1 && (
          <div className="space-y-4 animate-in fade-in duration-300">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-y-1.5 border-b border-slate-800 pb-2.5">
              <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-sky-950 text-sky-400 border border-sky-800 whitespace-nowrap">
                07 • CAREER DEEP-DIVE
              </span>
              <span className="text-[10px] font-mono text-slate-400 tracking-wider whitespace-nowrap">
                MATCH RANK: #01
              </span>
            </div>

            <div>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-heading font-extrabold text-base sm:text-lg text-white tracking-tight">
                  Systems Architect & AI Engineering
                </h3>
                <span className="text-xs font-mono font-extrabold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800 whitespace-nowrap">
                  94% FIT
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug mt-0.5">
                Combines high quantitative logic with systemic autonomy and high human moats against commoditization.
              </p>
            </div>

            {/* Compensation & AI Resilience Metric Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#0B1B33] border border-[#16315C] rounded-xl p-3 text-left">
                <span className="text-[8px] font-mono text-slate-400 uppercase tracking-wider block">EARLY TO SENIOR SALARY (INDIA)</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-sm font-bold font-mono text-sky-400">₹14–22 LPA</span>
                  <span className="text-[10px] text-slate-500">→</span>
                  <span className="text-sm font-bold font-mono text-emerald-400">₹45–75+ LPA</span>
                </div>
                <span className="text-[9px] text-slate-400 mt-1 block">Live AI web-sourced market range</span>
              </div>

              <div className="bg-[#0B1B33] border border-[#16315C] rounded-xl p-3 text-left">
                <div className="flex items-center justify-between">
                  <span className="text-[8px] font-mono text-slate-400 uppercase tracking-wider">AI RESILIENCE MOAT</span>
                  <span className="text-[10px] font-mono font-bold text-indigo-400">88/100</span>
                </div>
                <div className="w-full h-1.5 bg-[#172D4D] rounded-full overflow-hidden mt-1.5">
                  <div className="h-full bg-indigo-400 rounded-full" style={{ width: "88%" }} />
                </div>
                <span className="text-[9px] text-slate-400 mt-1 block leading-tight">High human moat in trade-off architecture</span>
              </div>
            </div>

            {/* Day-to-Day Realities & First 3 Moves */}
            <div className="bg-[#0B1B33] border border-[#16315C] rounded-xl p-3 space-y-2 text-left">
              <span className="text-[9px] font-mono text-amber-400 uppercase tracking-wider block font-bold">
                FIRST 3 MOVES (IMMEDIATE LEVERAGE)
              </span>
              {[
                "Focus on multi-tier backend design over basic UI scripting",
                "Take discrete math and distributed systems certifications",
                "Ship 2 end-to-end fullstack architectural prototypes",
              ].map((move, i) => (
                <div key={i} className="flex items-start gap-2 text-[10px] text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{move}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================= TAB 2: 3-YEAR ACTION PLAN ======================= */}
        {activeTab === 2 && (
          <div className="space-y-4 animate-in fade-in duration-300">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-y-1.5 border-b border-slate-800 pb-2.5">
              <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-purple-950 text-purple-400 border border-purple-800 whitespace-nowrap">
                11 • 3-YEAR ACTION PLAN
              </span>
              <span className="text-[10px] font-mono text-slate-400 tracking-wider whitespace-nowrap">
                EXECUTION TIMELINE
              </span>
            </div>

            <div>
              <h3 className="font-heading font-extrabold text-base sm:text-lg text-white tracking-tight">
                From here to career certainty
              </h3>
              <p className="text-[11px] text-slate-400 leading-snug mt-0.5">
                Milestones sequenced to minimize risk, avoid coaching traps, and build compounding leverage.
              </p>
            </div>

            {/* 4 Phased Milestone Steps */}
            <div className="space-y-2 text-left">
              {[
                { time: "1 Month", badge: "Immediate Clarity", desc: "Select 3 elective subjects & audit syllabus", color: "border-sky-500 text-sky-400" },
                { time: "6 Months", badge: "Skill Bridge", desc: "Build foundational project & enter local hackathon", color: "border-teal-500 text-teal-400" },
                { time: "1 Year", badge: "Degree Alignment", desc: "Finalize college list with verified AI-resilience scores", color: "border-indigo-500 text-indigo-400" },
                { time: "3 Years", badge: "High Placement", desc: "Portfolio-first recruitment with industry mentor network", color: "border-emerald-500 text-emerald-400" },
              ].map((m, idx) => (
                <div key={idx} className="bg-[#0B1B33] border border-[#16315C] rounded-xl p-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`px-2 py-0.5 rounded border text-[9px] font-mono font-bold ${m.color}`}>
                      {m.time}
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-white block leading-tight">{m.desc}</span>
                      <span className="text-[9px] text-slate-400">{m.badge}</span>
                    </div>
                  </div>
                  <span className="text-slate-600 text-xs">→</span>
                </div>
              ))}
            </div>

            {/* Family Discussion Callout */}
            <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-900/60 text-left flex items-start gap-2">
              <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <span className="text-[10px] text-amber-200/90 leading-tight">
                Includes calibrated scripts for family discussions to turn dinner-table pressure into mutual support.
              </span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

