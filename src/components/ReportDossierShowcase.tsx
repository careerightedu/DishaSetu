"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BrainCircuit, 
  TrendingUp, 
  Route, 
  ZoomIn, 
  ArrowRight, 
  Sparkles, 
  Wifi, 
  Battery, 
  Signal,
  CheckCircle2,
  FileText
} from "lucide-react";

interface Props {
  onZoomPdf?: (imageSrc: string) => void;
}

interface ReportPageItem {
  id: string;
  pageNum: string;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  image: string;
  popoutBadge: string;
  popoutHeading: string;
  popoutText: string;
  tag: string;
  accentColor: string;
}

const REPORT_PAGES: ReportPageItem[] = [
  {
    id: "page-03",
    pageNum: "Page 03",
    title: "Natural Strengths",
    subtitle: "35 Cognitive Dimensions & Values",
    icon: BrainCircuit,
    image: "/report/cognitive-fingerprint.png",
    popoutBadge: "Page 03 • Strengths Radar",
    popoutHeading: "What You Are Naturally Good At",
    popoutText: "Pinpoints your natural cognitive traits and work style without peer bias or coaching pressure.",
    tag: "35 Cognitive Traits Tested",
    accentColor: "from-sky-500 to-cyan-500",
  },
  {
    id: "page-07",
    pageNum: "Page 07",
    title: "Salaries & AI Safety",
    subtitle: "Real Indian Salary Progression",
    icon: TrendingUp,
    image: "/report/career-deep-dive.png",
    popoutBadge: "Page 07 • Market Reality",
    popoutHeading: "Verified Salaries & AI Risk",
    popoutText: "Realistic salary growth from entry (₹12–25L) to Lead (₹40–80L) paired with an AI safety resilience score.",
    tag: "Verified Indian Pay Scales",
    accentColor: "from-teal-500 to-emerald-500",
  },
  {
    id: "page-11",
    pageNum: "Page 11",
    title: "3-Year Action Plan",
    subtitle: "Milestones & Hyped Degrees to Avoid",
    icon: Route,
    image: "/report/execution-plan.png",
    popoutBadge: "Page 11 • Execution Roadmap",
    popoutHeading: "Milestones & Careers to Avoid",
    popoutText: "Month-by-month actions and entrance exams, plus hyped high-burnout degrees eliminated.",
    tag: "Eliminates Wasted Degrees",
    accentColor: "from-sky-600 to-indigo-600",
  },
];

const AUTO_ROTATE_INTERVAL = 5500; // 5.5 seconds per page

export default function ReportDossierShowcase({ onZoomPdf }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activePage = REPORT_PAGES[activeIndex];

  // Auto-rotate effect
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % REPORT_PAGES.length);
    }, AUTO_ROTATE_INTERVAL);

    return () => clearInterval(timer);
  }, [activeIndex]);

  return (
    <div className="w-full">
      {/* Main Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        
        {/* Left Column: Simple Pill Navigation (matching reference design) */}
        <div className="lg:col-span-5 order-2 lg:order-1">
          <div className="p-4 sm:p-6 rounded-3xl bg-white dark:bg-[#07131e] border border-slate-200/90 dark:border-white/10 shadow-xl space-y-3">
            <div className="flex items-center justify-between px-2 mb-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold">
                Sample Report Pages ({activeIndex + 1}/{REPORT_PAGES.length})
              </span>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-sky-600 dark:text-sky-400 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Auto-cycling
              </span>
            </div>

            {/* List of tabs */}
            <div className="space-y-2.5">
              {REPORT_PAGES.map((page, idx) => {
                const isActive = idx === activeIndex;
                const IconComponent = page.icon;

                return (
                  <button
                    key={page.id}
                    onClick={() => setActiveIndex(idx)}
                    className={`w-full text-left p-3.5 sm:p-4 rounded-2xl transition-all duration-300 relative overflow-hidden flex items-center justify-between group ${
                      isActive
                        ? "bg-gradient-to-r from-sky-500 via-sky-600 to-teal-500 text-white shadow-lg shadow-sky-500/25 scale-[1.01]"
                        : "bg-slate-50 dark:bg-white/[0.04] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.08] border border-slate-200/60 dark:border-white/5"
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                        isActive
                          ? "bg-white/20 text-white shadow-inner"
                          : "bg-slate-200/70 dark:bg-white/10 text-slate-700 dark:text-slate-300 group-hover:text-sky-500"
                      }`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                            isActive ? "bg-white/25 text-white" : "text-slate-500 dark:text-slate-400"
                          }`}>
                            {page.pageNum}
                          </span>
                        </div>
                        <h4 className={`text-base font-serif font-bold truncate ${
                          isActive ? "text-white" : "text-slate-900 dark:text-white"
                        }`}>
                          {page.title}
                        </h4>
                        <p className={`text-xs truncate ${
                          isActive ? "text-sky-100" : "text-slate-500 dark:text-slate-400"
                        }`}>
                          {page.subtitle}
                        </p>
                      </div>
                    </div>

                    <ArrowRight className={`w-4 h-4 shrink-0 transition-transform ${
                      isActive ? "text-white translate-x-0.5 opacity-100" : "text-slate-400 opacity-0 group-hover:opacity-100"
                    }`} />

                    {/* Active progress bar countdown */}
                    {isActive && (
                      <motion.div
                        key={`progress-${activeIndex}`}
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: AUTO_ROTATE_INTERVAL / 1000, ease: "linear" }}
                        className="absolute bottom-0 left-0 h-[3px] bg-white/40"
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Micro CTA Box under the tabs */}
            <div className="pt-3 border-t border-slate-200/80 dark:border-white/10 text-center">
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                Sample excerpts from the 15-page dossier
              </p>
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-md active:scale-[0.99]"
              >
                <span>Unlock Your Full 15-Page Dossier (₹999)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>
        </div>

        {/* Right Column: Realistic Phone Mockup Display + Popout Card */}
        <div className="lg:col-span-7 order-1 lg:order-2 flex justify-center">
          <div className="relative w-full max-w-[360px] sm:max-w-[400px] pt-4 pb-14 sm:pb-16 flex justify-center">
            
            {/* Ambient Glow behind the phone */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 sm:w-80 h-96 bg-gradient-to-tr from-sky-500/20 via-teal-500/20 to-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

            {/* SMARTPHONE DEVICE FRAME (Realistic Modern iPhone) */}
            <div className="relative w-[290px] xs:w-[310px] sm:w-[335px] rounded-[48px] sm:rounded-[52px] p-3 sm:p-3.5 bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900 border-[3px] border-slate-600/70 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6),0_0_35px_rgba(14,165,233,0.15)] ring-1 ring-white/20 select-none">
              
              {/* Hardware buttons simulation */}
              <div className="absolute -left-1.5 top-24 w-1 h-7 bg-slate-600 rounded-l" />
              <div className="absolute -left-1.5 top-34 w-1 h-10 bg-slate-600 rounded-l" />
              <div className="absolute -left-1.5 top-48 w-1 h-10 bg-slate-600 rounded-l" />
              <div className="absolute -right-1.5 top-28 w-1 h-14 bg-slate-600 rounded-r" />

              {/* SCREEN CONTAINER */}
              <div 
                onClick={() => onZoomPdf?.(activePage.image)}
                className="relative rounded-[38px] sm:rounded-[42px] overflow-hidden bg-slate-950 border border-slate-800/80 aspect-[9/19] h-[550px] xs:h-[580px] sm:h-[620px] flex flex-col cursor-zoom-in group"
              >
                
                {/* 1. iOS Status Bar */}
                <div className="relative z-30 pt-3 px-6 pb-1 flex items-center justify-between text-white text-[11px] font-semibold bg-slate-950/90 backdrop-blur-sm">
                  <span>09:41</span>

                  {/* Dynamic Island */}
                  <div className="w-24 h-5 bg-black rounded-full flex items-center justify-end pr-2 ring-1 ring-white/10">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-900 ring-1 ring-slate-800 inline-block" />
                  </div>

                  {/* Right Icons */}
                  <div className="flex items-center gap-1.5 text-slate-200">
                    <Signal className="w-3 h-3 stroke-[2.5]" />
                    <Wifi className="w-3 h-3 stroke-[2.5]" />
                    <Battery className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                </div>

                {/* 2. In-App Mini Header */}
                <div className="relative z-20 px-4 py-2 border-b border-white/10 bg-slate-950/80 backdrop-blur-md flex items-center justify-between text-white text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
                    <span className="font-mono text-[10px] text-sky-300 font-bold uppercase tracking-wider">
                      CareeRight • {activePage.pageNum}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-slate-300 bg-white/10 px-2 py-0.5 rounded-full font-mono">
                    <ZoomIn className="w-3 h-3" />
                    <span>Zoom</span>
                  </div>
                </div>

                {/* 3. Report PDF Page Content inside Phone Viewport */}
                <div className="relative flex-1 w-full bg-slate-950 overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activePage.id}
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.01 }}
                      transition={{ duration: 0.35, ease: "easeInOut" }}
                      className="relative w-full h-full"
                    >
                      <Image
                        src={activePage.image}
                        alt={activePage.popoutHeading}
                        fill
                        className="object-contain object-top group-hover:scale-[1.03] transition-transform duration-500"
                        sizes="(max-width: 640px) 300px, 350px"
                        priority
                      />
                    </motion.div>
                  </AnimatePresence>

                  {/* Subtle hover gradient indicator on tap */}
                  <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-slate-950/90 to-transparent pointer-events-none flex items-end justify-center pb-2">
                    <span className="text-[10px] font-mono text-slate-400 group-hover:text-sky-300 transition-colors">
                      Tap phone screen to expand
                    </span>
                  </div>
                </div>

                {/* 4. iOS Home Indicator Bar */}
                <div className="relative z-20 py-2 bg-slate-950 flex justify-center">
                  <div className="w-28 h-1 bg-white/40 rounded-full" />
                </div>

              </div>

            </div>

            {/* POPOUT CALLOUT BOX (Overlapping the phone card, exactly like the reference image) */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`popout-${activePage.id}`}
                initial={{ opacity: 0, y: 16, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.96 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="absolute -bottom-2 sm:-bottom-4 -left-3 xs:-left-5 sm:-left-8 lg:-left-12 z-40 w-[270px] xs:w-[290px] sm:w-[320px] p-4 sm:p-5 rounded-3xl bg-white/95 dark:bg-[#0c1e2e]/95 text-slate-900 dark:text-white shadow-2xl border-2 border-slate-200/90 dark:border-white/15 backdrop-blur-xl"
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-sky-500 to-teal-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-sky-500/30">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-sky-600 dark:text-sky-400 font-bold block mb-0.5">
                      {activePage.popoutBadge}
                    </span>
                    <h5 className="text-sm sm:text-base font-serif font-bold leading-tight mb-1 text-slate-950 dark:text-white">
                      {activePage.popoutHeading}
                    </h5>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium mb-2.5">
                      {activePage.popoutText}
                    </p>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sky-50 dark:bg-sky-500/10 border border-sky-200 dark:border-sky-500/20 text-sky-700 dark:text-sky-300 text-[10px] font-mono font-bold">
                      <CheckCircle2 className="w-3 h-3 text-sky-500" />
                      <span>{activePage.tag}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

          </div>
        </div>

      </div>
    </div>
  );
}
