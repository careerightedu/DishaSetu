"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BrainCircuit, 
  TrendingUp, 
  Route, 
  ZoomIn, 
  ArrowRight, 
  Eye, 
  MessageSquare, 
  Target, 
  AlertCircle,
  FileText,
  Maximize2,
  CheckCircle2
} from "lucide-react";

interface Props {
  onZoomPdf?: (imageSrc: string) => void;
}

interface ReportComponent {
  id: string;
  pageNum: string;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  image: string;
  badge: string;
  whatYouSee: string;
  plainMeaning: string;
  howItInforms: string;
  whatItCannotEstablish: string;
}

const REPORT_COMPONENTS: ReportComponent[] = [
  {
    id: "cognitive-fingerprint",
    pageNum: "Page 03",
    title: "Cognitive Profile & Strengths",
    subtitle: "Natural working styles & problem-solving tendencies",
    icon: BrainCircuit,
    image: "/report/cognitive-fingerprint.png",
    badge: "Self-Understanding",
    whatYouSee: "A clear spectrum mapping your behavioral styles, problem-solving habits, and work environment preferences derived from your 80 real-world scenario responses.",
    plainMeaning: "Reveals the types of challenges, communication patterns, and team dynamics where you are most likely to thrive versus those that drain your energy.",
    howItInforms: "Helps you filter out streams, degrees, or roles that demand working styles fundamentally misaligned with your natural inclinations.",
    whatItCannotEstablish: "It does not measure fixed biological intelligence, and it does not define a permanent destiny. Your skills and interests can and will grow with practice."
  },
  {
    id: "career-deep-dive",
    pageNum: "Page 07",
    title: "Career Matches & Trajectory",
    subtitle: "Day-to-day reality, responsibilities & industry benchmarks",
    icon: TrendingUp,
    image: "/report/career-deep-dive.png",
    badge: "Career Exploration",
    whatYouSee: "Detailed profile breakdowns of matched career paths, showing daily responsibilities, core skills required, and verified progression benchmarks.",
    plainMeaning: "An objective view of what working in these roles actually involves day-to-day, looking past coaching advertisements and social media hype.",
    howItInforms: "Provides concrete, evidence-backed options to research in depth, compare against alternatives, and discuss openly with parents and mentors.",
    whatItCannotEstablish: "It cannot guarantee college admission, hiring selection, or specific earnings. Success in any path depends on your effort and market conditions."
  },
  {
    id: "execution-plan",
    pageNum: "Page 11",
    title: "3-Year Execution Roadmap",
    subtitle: "Sequenced milestones & development priorities",
    icon: Route,
    image: "/report/execution-plan.png",
    badge: "Structured Action",
    whatYouSee: "A sequenced timeline organized into 1-month, 6-month, 1-year, and 3-year horizons, detailing core projects, skill bridges, and next steps.",
    plainMeaning: "A practical action plan that converts high-level career ideas into tangible priorities you can begin working on immediately.",
    howItInforms: "Helps you prioritize which entrance exams, courses, or projects to focus on first, preventing wasted time and unnecessary financial investments.",
    whatItCannotEstablish: "It cannot substitute for your own sustained dedication and hard work. It gives you directional clarity, but you must drive the execution."
  }
];

export default function ReportDossierShowcase({ onZoomPdf }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeComponent = REPORT_COMPONENTS[activeIndex];
  const IconComponent = activeComponent.icon;

  return (
    <div className="w-full space-y-10">
      
      {/* 1. Component Selector Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4">
        {REPORT_COMPONENTS.map((item, idx) => {
          const isActive = idx === activeIndex;
          const ItemIcon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveIndex(idx)}
              className={`p-4 sm:p-5 rounded-2xl text-left border transition-all duration-200 flex items-start gap-3.5 relative overflow-hidden ${
                isActive
                  ? "bg-white dark:bg-slate-900 border-sky-500 shadow-md ring-2 ring-sky-500/20 text-slate-950 dark:text-white"
                  : "bg-white/60 dark:bg-slate-900/40 border-slate-200/80 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-white/15"
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                isActive
                  ? "bg-sky-500/10 text-sky-600 dark:text-sky-400"
                  : "bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400"
              }`}>
                <ItemIcon className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                    isActive
                      ? "bg-sky-100 dark:bg-sky-500/20 text-sky-700 dark:text-sky-300"
                      : "bg-slate-100 dark:bg-white/5 text-slate-500"
                  }`}>
                    {item.pageNum}
                  </span>
                  <span className="text-xs text-slate-400 truncate">{item.badge}</span>
                </div>
                <h4 className="text-base font-bold text-slate-950 dark:text-white truncate">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                  {item.subtitle}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* 2. Main Inspection Grid: 4-Point Explanation + Actual Readable Document Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        
        {/* Left Column: 4-Point Plain Language Explanation (as mandated by the brief) */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Active Component Title */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-white/10">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-sky-600 dark:text-sky-400 mb-1">
                <span>{activeComponent.pageNum} • {activeComponent.badge}</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white tracking-tight">
                {activeComponent.title}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-100 dark:border-sky-500/20 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
              <IconComponent className="w-6 h-6" />
            </div>
          </div>

          {/* The 4 Specific Brief Questions Answered */}
          <div className="space-y-4">
            
            {/* 1. What the user will see */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-white/10 shadow-xs">
              <div className="flex items-center gap-2.5 text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                <Eye className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
                <span>What You Will See</span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {activeComponent.whatYouSee}
              </p>
            </div>

            {/* 2. What it means in plain language */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-white/10 shadow-xs">
              <div className="flex items-center gap-2.5 text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                <MessageSquare className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                <span>What It Means In Plain Language</span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {activeComponent.plainMeaning}
              </p>
            </div>

            {/* 3. How it can inform their decision */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-white/10 shadow-xs">
              <div className="flex items-center gap-2.5 text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                <Target className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <span>How It Informs Your Decision</span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {activeComponent.howItInforms}
              </p>
            </div>

            {/* 4. What it cannot establish (Grounded honest limitation) */}
            <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 shadow-xs">
              <div className="flex items-center gap-2.5 text-xs font-mono font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400 mb-2">
                <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <span>What It Cannot Establish</span>
              </div>
              <p className="text-sm text-amber-900/80 dark:text-amber-200/90 leading-relaxed">
                {activeComponent.whatItCannotEstablish}
              </p>
            </div>

          </div>

          {/* Prominent Action CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={() => onZoomPdf?.(activeComponent.image)}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 font-bold text-sm transition-all shadow-md active:scale-[0.99]"
            >
              <Maximize2 className="w-4 h-4" />
              <span>Preview the Sample Report</span>
            </button>

            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm transition-all shadow-md active:scale-[0.99]"
            >
              <span>Get Your Report (₹999)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>

        {/* Right Column: Actual Readable Document Canvas (No tiny device mockups) */}
        <div className="lg:col-span-6">
          <div className="sticky top-24 space-y-3">
            
            {/* Document Frame */}
            <div className="rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden">
              
              {/* Document Header Bar */}
              <div className="px-4 py-3 bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-white/10 flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-sky-500" />
                  <span className="font-semibold text-slate-900 dark:text-white">WhatAfter Dossier</span>
                  <span className="text-slate-400">•</span>
                  <span className="font-mono text-slate-500 dark:text-slate-400">{activeComponent.pageNum}</span>
                </div>
                <button
                  onClick={() => onZoomPdf?.(activeComponent.image)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-white/10 hover:bg-sky-50 dark:hover:bg-sky-500/20 text-slate-800 dark:text-white text-xs font-semibold transition-colors border border-slate-200 dark:border-white/10"
                >
                  <ZoomIn className="w-3.5 h-3.5 text-sky-500" />
                  <span>Enlarge Page</span>
                </button>
              </div>

              {/* Clickable Readable Document Image */}
              <div 
                onClick={() => onZoomPdf?.(activeComponent.image)}
                className="relative aspect-[3/4] w-full bg-slate-50 dark:bg-slate-950 overflow-hidden cursor-zoom-in group"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeComponent.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="relative w-full h-full"
                  >
                    <Image
                      src={activeComponent.image}
                      alt={activeComponent.title}
                      fill
                      className="object-contain object-top group-hover:scale-[1.015] transition-transform duration-300"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      priority
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Bottom Overlay Hint */}
                <div className="absolute inset-x-0 bottom-0 py-3 bg-gradient-to-t from-slate-950/80 via-slate-950/40 to-transparent flex items-center justify-center pointer-events-none">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-sm text-white text-xs font-medium border border-white/10">
                    <ZoomIn className="w-3 h-3 text-sky-400" />
                    <span>Click anywhere to inspect high-resolution page</span>
                  </span>
                </div>
              </div>

            </div>

            {/* Mobile helper note */}
            <p className="text-center text-xs text-slate-500 dark:text-slate-400">
              Readable preview directly from the official 15-page dossier. Tap to inspect in full screen.
            </p>

          </div>
        </div>

      </div>

    </div>
  );
}
