"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  ArrowRight, 
  Compass, 
  ChevronDown, 
  ChevronUp, 
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  BrainCircuit,
  Target,
  Route,
  XCircle,
  Sparkles,
  Check,
  BookOpen,
  PenSquare,
  ZoomIn,
  X,
  GraduationCap,
  TrendingUp,
  ShieldCheck,
  Briefcase,
  Sliders,
  Database,
  Cpu,
  Scale,
  Laptop,
  Download,
  Mail,
  RotateCcw
} from "lucide-react";
import { motion, AnimatePresence, useScroll, useSpring, useTransform } from "framer-motion";
import Navbar from "@/features/auth/components/Navbar";
import { INITIAL_BLOG_POSTS } from "@/lib/blogs";
import ScrollCareerIntelligenceEngine from "@/components/ScrollCareerIntelligenceEngine";
import ReportDossierShowcase from "@/components/ReportDossierShowcase";
import StackedHowItWorksWavy from "@/components/StackedHowItWorksWavy";
import ScrollWavyConnector from "@/components/ScrollWavyConnector";
import AmbientBackgroundGlows from "@/components/AmbientBackgroundGlows";
import ScrollDimSection from "@/components/ScrollDimSection";

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [zoomImage, setZoomImage] = useState<string | null>(null);
  const [isDesktop, setIsDesktop] = useState<boolean>(false);

  React.useEffect(() => {
    const checkWidth = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    checkWidth();
    window.addEventListener("resize", checkWidth, { passive: true });
    return () => window.removeEventListener("resize", checkWidth);
  }, []);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });



  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const careerStages = [
    {
      id: "stream",
      cardNumber: "1",
      badge: "After 10th",
      title: "Choosing a stream",
      copy: "Understand your preferences and explore the differences between Science, Commerce and Humanities before making your choice.",
      explanation: "Evaluates 35 cognitive traits and learning styles to help students and families evaluate PCM, PCB, Commerce, or Arts based on data rather than peer pressure.",
      tags: ["Science (PCM/PCB)", "Commerce", "Humanities / Arts"],
      cta: "Explore Stream Fit",
      href: "/signup?stage=stream",
      icon: BookOpen
    },
    {
      id: "degree",
      cardNumber: "2",
      badge: "After 12th",
      title: "Choosing a degree",
      copy: "Look beyond popular courses. Explore career possibilities that align with your interests, strengths and preferred ways of working.",
      explanation: "Moves past entrance coaching hype to map which undergraduate degrees and modern disciplines align with how you actually think and work.",
      tags: ["Undergraduate Majors", "Modern Disciplines", "Work Style Fit"],
      cta: "Explore Degree Pathways",
      href: "/signup?stage=degree",
      icon: GraduationCap
    },
    {
      id: "mba",
      cardNumber: "3",
      badge: "Postgrad & MBA",
      title: "Choosing an MBA specialization",
      copy: "Think beyond placement statistics. Explore whether different functions, responsibilities and work environments suit your preferences.",
      explanation: "Examines daily work style, quantitative comfort, and leadership values across Marketing, Finance, Operations, Strategy, and Product.",
      tags: ["Marketing & Finance", "Operations & Strategy", "Product & Tech"],
      cta: "Explore Specializations",
      href: "/signup?stage=mba",
      icon: Briefcase
    },
    {
      id: "career-change",
      cardNumber: "4",
      badge: "Working Professionals",
      title: "Changing your career",
      copy: "Identify what matters to you in your next role, explore adjacent career directions and understand the skills or experience you may need to build.",
      explanation: "Provides structured reflection on transferable strengths, work values, and adjacent domains when planning a meaningful career change.",
      tags: ["Transferable Strengths", "Adjacent Roles", "Skill Bridges"],
      cta: "Explore Career Change",
      href: "/signup?stage=career-change",
      icon: Route
    }
  ];

  const faqs = [
    {
      q: "What is a career assessment?",
      a: "A career assessment is a structured self-reflection tool that evaluates your natural working inclinations, problem-solving styles, and behavioral tendencies in practical situations. It helps you understand what types of work and learning environments suit you best, rather than basing critical education decisions purely on marks or peer trends."
    },
    {
      q: "How can I choose the right career for me?",
      a: "Choosing the right career starts with understanding how you think, communicate, and solve problems rather than following popular hype. By identifying your natural strengths, exploring modern career paths, and understanding real-world day-to-day tasks and compensation, you can make an informed, confident choice."
    },
    {
      q: "Which stream should I choose after Class 10?",
      a: "The choice between Science (PCM/PCB), Commerce, and Humanities should be based on your preferred ways of learning and thinking, not just 10th board marks. WhatAfter evaluates your cognitive rhythms and problem-solving preferences to help students and families evaluate stream fit with calm, objective data."
    },
    {
      q: "How do I choose a degree after Class 12?",
      a: "Look beyond traditional entrance coaching narratives. Consider the day-to-day subjects you enjoy, the cognitive skills modern industries demand, and whether you thrive in analytical investigation, creative execution, or management. WhatAfter highlights undergraduate majors and career tracks that match your natural profile."
    },
    {
      q: "How do I choose an MBA specialization?",
      a: "Choose an MBA specialization—such as Marketing, Finance, Operations, Strategy, or Product Management—based on the actual daily work realities of those roles, such as quantitative modeling, client negotiations, or systems execution, rather than average placement headlines alone."
    },
    {
      q: "Can WhatAfter help me explore a career change?",
      a: "Yes. Working professionals use WhatAfter to identify their transferable strengths, isolate what causes friction or burnout in their current role, and explore adjacent domains that offer better alignment with their preferred working styles."
    },
    {
      q: "How does the assessment work?",
      a: "You respond to 80 realistic situational scenarios available in both English and Hindi. There are no right or wrong answers, formulas, or academic trick questions. You can take it at your own pace (typically 20–25 minutes) from any phone, tablet, or laptop."
    },
    {
      q: "What will I receive in the career report?",
      a: "You receive an instant 15-page Career Intelligence Dossier PDF. It includes your multi-dimensional trait profile, 3-tier career recommendations (Primary, Secondary, and Wildcard), career eliminations (what to avoid), AI web-sourced salary benchmarks, a 3-year execution plan, and structured discussion prompts for parents or mentors."
    },
    {
      q: "Can the assessment guarantee the right career?",
      a: "No assessment can guarantee a job or predict your future. WhatAfter is an objective decision-support framework designed to give you clarity, eliminate mismatched directions, and highlight high-probability options. Your eventual career success depends on your ongoing effort, skills, and real-world exploration."
    },
    {
      q: "How reliable are the salary estimates?",
      a: "Salary figures in your report are retrieved by our AI model querying live market data across the internet for each specific role. The system is prompted to identify realistic median bands (25th to 75th percentile) for entry-level and mid-career positions, explicitly filtering out extreme 1% campus outliers."
    },
    {
      q: "How much does WhatAfter cost?",
      a: "WhatAfter costs a straightforward, one-time payment of ₹999. There are no recurring subscriptions, hidden fees, or premium upsells."
    },
    {
      q: "How do I access my report after payment?",
      a: "Access is immediate. After completing the 80 scenarios, your customized report is generated instantly and saved to your private dashboard, where you can view it online or download the complete 15-page PDF anytime."
    },
    {
      q: "What is the refund policy?",
      a: "Because assessment access and customized report generation are delivered immediately, purchases are generally final. However, if a technical error prevents you from completing the evaluation or generating your dossier, contact support at careeright.edu@gmail.com within 7 days for a prompt reset or full refund."
    }
  ];



  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-slate-50 dark:bg-[#061019] text-slate-900 dark:text-[#f4efe6] font-sans selection:bg-sky-500/30 selection:text-sky-900 dark:selection:text-sky-200 transition-colors duration-200 relative">
      {/* Dynamic Parallax Atmosphere Glows & Blueprint Grid */}
      <AmbientBackgroundGlows />

      {/* Top Viewport Reading Progress Beam */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-sky-500 via-teal-400 to-cyan-400 origin-left z-50 pointer-events-none"
        style={{ scaleX }}
      />

      <Navbar />

      <main className="w-full max-w-full overflow-x-hidden">
        
        {/* ========================================================= */}
        {/* 1. HERO SECTION (POINT 3 - OBJECTIVE & VALUE PROPOSITION)  */}
        {/* ========================================================= */}
        <ScrollDimSection isHero id="hero" className="relative pt-12 pb-16 md:pt-20 md:pb-24 border-b border-slate-200/80 dark:border-white/5 overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-[#061019] dark:via-[#081522] dark:to-[#061019]">
          <div className="max-w-[1240px] mx-auto px-4 sm:px-6 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
              
              {/* Left Column: Core Positioning Copy & CTAs */}
              <div className="lg:col-span-7 space-y-6 text-left">
                
                {/* Eyebrow */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-700 dark:text-sky-400 text-xs font-mono font-bold uppercase tracking-wider">
                  Career Clarity for Every Stage
                </div>

                {/* H1 */}
                <h1 className="font-serif font-bold text-3xl sm:text-5xl lg:text-[54px] text-slate-950 dark:text-white tracking-tight leading-[1.14]">
                  Before you choose your next step, understand yourself.
                </h1>

                {/* Supporting Headline */}
                <p className="text-lg sm:text-xl font-medium text-slate-800 dark:text-slate-200 leading-snug">
                  A career decision can shape years of your life. Make it with more clarity, not just pressure.
                </p>

                {/* Body Copy */}
                <div className="space-y-3 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                  <p>
                    Choosing a stream, degree, MBA specialization or career path can feel overwhelming when everyone has advice but you are still unsure what suits you.
                  </p>
                  <p>
                    WhatAfter helps you understand your work preferences, explore career possibilities and plan your next steps with greater clarity.
                  </p>
                </div>

                {/* CTA Group */}
                <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                  <Link 
                    href="/signup" 
                    className="inline-flex items-center justify-center gap-2 px-7 py-3.5 sm:py-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-base shadow-lg shadow-sky-600/20 hover:shadow-sky-600/35 transition-all text-center active:scale-[0.99]"
                  >
                    <span>Discover Your Career Fit</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <a 
                    href="#inside-report" 
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 sm:py-4 rounded-xl border border-slate-300 dark:border-white/15 bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-800 dark:text-slate-200 font-semibold text-base transition-all text-center active:scale-[0.99]"
                  >
                    <span>See a Sample Report</span>
                  </a>
                </div>

                {/* Supporting Information */}
                <div className="pt-2 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
                  <span>80 real-life scenarios</span>
                  <span>·</span>
                  <span>English and Hindi</span>
                  <span>·</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">₹999 one-time payment</span>
                </div>

              </div>

              {/* Right Column: Genuine Report Preview */}
              <div className="lg:col-span-5 order-last">
                <div className="relative mx-auto max-w-md lg:max-w-none">
                  {/* Subtle Background Glow */}
                  <div className="absolute -inset-3 bg-gradient-to-tr from-sky-500/15 to-teal-500/15 rounded-3xl blur-2xl pointer-events-none" />

                  {/* Genuine Report Preview Container */}
                  <div 
                    onClick={() => setZoomImage("/report/career-deep-dive.png")}
                    className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-200/80 dark:border-white/10 shadow-2xl group cursor-zoom-in transition-all duration-300 hover:border-sky-500/40"
                  >
                    {/* Top Bar Label */}
                    <div className="px-4 py-2.5 bg-slate-950/80 backdrop-blur-md border-b border-white/10 flex items-center justify-between text-white text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-sky-400" />
                        <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-sky-300">
                          Actual Report Excerpt • 15-Page Dossier
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-slate-300 bg-white/10 px-2 py-0.5 rounded-full font-mono">
                        <ZoomIn className="w-3.5 h-3.5" />
                        <span>Preview</span>
                      </div>
                    </div>

                    {/* Report Image */}
                    <div className="relative aspect-[4/5] sm:aspect-[3/4] w-full bg-slate-950">
                      <Image
                        src="/report/career-deep-dive.png"
                        alt="Genuine excerpt from WhatAfter Career Intelligence Report"
                        fill
                        className="object-contain object-top group-hover:scale-[1.02] transition-transform duration-500"
                        sizes="(max-width: 1024px) 100vw, 40vw"
                        priority
                      />
                    </div>

                    {/* Bottom Caption */}
                    <div className="px-4 py-3 bg-slate-950/90 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
                      <span className="truncate">Sample Career Trajectory &amp; AI-Safety Breakdown</span>
                      <span className="text-sky-400 font-semibold shrink-0 ml-2">Click to inspect →</span>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </ScrollDimSection>

        {/* ========================================================= */}
        {/* 4. PROBLEM SECTION (Brief Point 4)                         */}
        {/* ========================================================= */}
        <ScrollDimSection id="problem" className="max-w-[1200px] mx-auto px-4 sm:px-6 py-20 sm:py-28 border-b border-slate-200/80 dark:border-white/5 relative">
          
          {/* Eyebrow & Main H2 */}
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 text-xs font-semibold uppercase tracking-wider mb-4">
              <span>The Noise Around Career Choices</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-950 dark:text-white tracking-tight leading-[1.15]">
              Everyone has advice. <br className="hidden sm:inline" />
              <span className="text-slate-600 dark:text-slate-400 font-bold">
                But how do you know what&apos;s right for you?
              </span>
            </h2>
            <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              You&apos;ve probably heard some version of these statements:
            </p>
          </div>

          {/* 4 Relatable Advice Dialogue Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-14 sm:mb-16">
            
            {/* Quote 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.05 }}
              className="relative rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-white/10 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group hover:border-sky-500/30"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-3.5 pb-2.5 border-b border-slate-100 dark:border-white/5">
                  <span className="font-medium text-slate-700 dark:text-slate-300">Relatives &amp; Family</span>
                  <span className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400">After 10th</span>
                </div>
                <p className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white leading-snug tracking-tight">
                  &ldquo;Science le lo. Options zyada hain.&rdquo;
                </p>
              </div>
              <div className="mt-5 pt-3 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-white/5">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0" />
                <span>The default advice for safe options</span>
              </div>
            </motion.div>

            {/* Quote 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="relative rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-white/10 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group hover:border-sky-500/30"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-3.5 pb-2.5 border-b border-slate-100 dark:border-white/5">
                  <span className="font-medium text-slate-700 dark:text-slate-300">Seniors &amp; Mentors</span>
                  <span className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400">Graduation</span>
                </div>
                <p className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white leading-snug tracking-tight">
                  &ldquo;An MBA will give your career a boost.&rdquo;
                </p>
              </div>
              <div className="mt-5 pt-3 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-white/5">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0" />
                <span>The universal acceleration prescription</span>
              </div>
            </motion.div>

            {/* Quote 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="relative rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-white/10 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group hover:border-sky-500/30"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-3.5 pb-2.5 border-b border-slate-100 dark:border-white/5">
                  <span className="font-medium text-slate-700 dark:text-slate-300">Parents &amp; Elders</span>
                  <span className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400">Security</span>
                </div>
                <p className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white leading-snug tracking-tight">
                  &ldquo;Government job ki preparation karo. Life set ho jayegi.&rdquo;
                </p>
              </div>
              <div className="mt-5 pt-3 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-white/5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                <span>The quest for guaranteed lifetime stability</span>
              </div>
            </motion.div>

            {/* Quote 4 */}
            <motion.div 
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="relative rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-white/10 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group hover:border-sky-500/30"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-3.5 pb-2.5 border-b border-slate-100 dark:border-white/5">
                  <span className="font-medium text-slate-700 dark:text-slate-300">Internet &amp; Peers</span>
                  <span className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400">Trends</span>
                </div>
                <p className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white leading-snug tracking-tight">
                  &ldquo;IT mein chale jao. Future wahi hai.&rdquo;
                </p>
              </div>
              <div className="mt-5 pt-3 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-white/5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                <span>The fear of missing the modern wave</span>
              </div>
            </motion.div>

          </div>

          {/* Editorial Narrative & Core Truth Box */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
            
            {/* Left Narrative: The Dilemma */}
            <div className="lg:col-span-7 rounded-3xl bg-slate-50/80 dark:bg-slate-900/50 border border-slate-200/80 dark:border-white/10 p-6 sm:p-8 md:p-10 flex flex-col justify-between">
              <div className="space-y-4 text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                <p>
                  Your parents want security. Your friends are choosing their paths. Teachers and relatives have their own opinions. The internet has a thousand different answers.
                </p>
                <div className="pt-4 border-t border-slate-200/60 dark:border-white/10">
                  <p className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white tracking-tight">
                    But the decision is yours to live with.
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-slate-200/60 dark:border-white/10 flex items-center gap-3 text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300 font-bold shrink-0">
                  ✓
                </span>
                <span>Moving from outside noise to inner clarity</span>
              </div>
            </div>

            {/* Right Card: The Core Realization & WhatAfter Solution */}
            <div className="lg:col-span-5 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-sky-950 text-white p-6 sm:p-8 md:p-10 border border-slate-800 shadow-xl flex flex-col justify-between relative overflow-hidden">
              
              {/* Subtle background glow */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="relative z-10 space-y-4">
                <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-400">
                  <Compass className="w-5 h-5" />
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-mono uppercase tracking-widest text-sky-400 font-semibold block">
                    The Underlying Problem
                  </span>
                  <p className="text-lg sm:text-xl font-bold leading-snug text-white">
                    The problem isn&apos;t that you have too few options. It&apos;s that you don&apos;t have a clear way to evaluate them.
                  </p>
                </div>

                <p className="text-sm sm:text-base text-slate-300 leading-relaxed pt-2">
                  WhatAfter helps you move beyond assumptions and start asking better questions about your future.
                </p>
              </div>

              <div className="relative z-10 mt-6 pt-5 border-t border-white/10 flex items-center justify-between text-xs text-sky-300/80">
                <span>Structured self-evaluation</span>
                <span className="font-mono text-sky-400">80 Scenarios</span>
              </div>
            </div>

          </div>

        </ScrollDimSection>

        {/* ========================================================= */}
        {/* 5. WHY THIS DECISION MATTERS (Brief Point 5)               */}
        {/* ========================================================= */}
        <ScrollDimSection id="decision-matters" className="max-w-[1200px] mx-auto px-4 sm:px-6 py-20 sm:py-28 border-b border-slate-200/80 dark:border-white/5 relative">
          
          {/* Eyebrow & Main H2 */}
          <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 text-xs font-semibold uppercase tracking-wider mb-4">
              <span>Why This Decision Matters</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-950 dark:text-white tracking-tight leading-[1.15]">
              A career decision is about <br className="hidden sm:inline" />
              <span className="text-slate-600 dark:text-slate-400 font-bold">
                more than choosing a job.
              </span>
            </h2>
            <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              It can influence the subjects you study, the degree you pursue, the money you invest, the skills you build and the opportunities you spend years working towards.
            </p>
          </div>

          {/* 5 Cascading Dimension Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5 sm:gap-4 mb-12 sm:mb-14">
            
            {/* Dimension 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: 0.05 }}
              className="rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-white/10 p-4 sm:p-5 shadow-xs hover:border-sky-500/30 transition-all flex flex-col justify-between"
            >
              <div className="w-9 h-9 rounded-xl bg-sky-500/10 dark:bg-sky-500/20 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-3">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-mono uppercase text-slate-400 block mb-1">01 / Foundation</span>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-tight">
                  Subjects You Study
                </h3>
              </div>
            </motion.div>

            {/* Dimension 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: 0.1 }}
              className="rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-white/10 p-4 sm:p-5 shadow-xs hover:border-sky-500/30 transition-all flex flex-col justify-between"
            >
              <div className="w-9 h-9 rounded-xl bg-teal-500/10 dark:bg-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-3">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-mono uppercase text-slate-400 block mb-1">02 / Pathway</span>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-tight">
                  Degree You Pursue
                </h3>
              </div>
            </motion.div>

            {/* Dimension 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: 0.15 }}
              className="rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-white/10 p-4 sm:p-5 shadow-xs hover:border-sky-500/30 transition-all flex flex-col justify-between"
            >
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3">
                <Target className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-mono uppercase text-slate-400 block mb-1">03 / Commitment</span>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-tight">
                  Money You Invest
                </h3>
              </div>
            </motion.div>

            {/* Dimension 4 */}
            <motion.div 
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: 0.2 }}
              className="rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-white/10 p-4 sm:p-5 shadow-xs hover:border-sky-500/30 transition-all flex flex-col justify-between"
            >
              <div className="w-9 h-9 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3">
                <BrainCircuit className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-mono uppercase text-slate-400 block mb-1">04 / Capability</span>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-tight">
                  Skills You Build
                </h3>
              </div>
            </motion.div>

            {/* Dimension 5 */}
            <motion.div 
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: 0.25 }}
              className="col-span-2 md:col-span-1 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-white/10 p-4 sm:p-5 shadow-xs hover:border-sky-500/30 transition-all flex flex-col justify-between"
            >
              <div className="w-9 h-9 rounded-xl bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-3">
                <Route className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-mono uppercase text-slate-400 block mb-1">05 / Trajectory</span>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-tight">
                  Years of Opportunity
                </h3>
              </div>
            </motion.div>

          </div>

          {/* Balanced Perspective Grid: Risk vs Reassurance */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 sm:mb-14">
            
            {/* Thoughtful Reality */}
            <div className="rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/10 p-6 sm:p-8 flex flex-col justify-between">
              <div className="space-y-3">
                <span className="text-xs font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400 font-bold block">
                  The Cost of Inertia
                </span>
                <p className="text-lg sm:text-xl font-bold text-slate-950 dark:text-white leading-snug">
                  Choosing a path without understanding it can mean spending time and money on an option that turns out to be a poor fit.
                </p>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed pt-2">
                  It means your decisions deserve more thought than simply following what everyone else is doing.
                </p>
              </div>
            </div>

            {/* Grounded Reassurance */}
            <div className="rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/10 p-6 sm:p-8 flex flex-col justify-between">
              <div className="space-y-3">
                <span className="text-xs font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400 font-bold block">
                  A Realistic Perspective
                </span>
                <p className="text-lg sm:text-xl font-bold text-slate-950 dark:text-white leading-snug">
                  That doesn&apos;t mean every decision must be perfect.
                </p>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed pt-2">
                  People change direction, discover new interests and build successful careers in unexpected ways.
                </p>
              </div>
            </div>

          </div>

          {/* Core Emphasis Box (Verbatim from brief) */}
          <div className="rounded-3xl bg-gradient-to-r from-sky-500/10 via-teal-500/10 to-sky-500/5 dark:from-sky-500/15 dark:via-teal-500/10 dark:to-transparent border border-sky-500/20 dark:border-sky-400/20 p-6 sm:p-10 text-center relative overflow-hidden">
            <div className="max-w-3xl mx-auto space-y-3">
              <span className="text-xs font-mono uppercase tracking-widest text-sky-700 dark:text-sky-400 font-bold block">
                The WhatAfter Principle
              </span>
              <p className="text-xl sm:text-2xl md:text-3xl font-black text-slate-950 dark:text-white tracking-tight leading-snug">
                &ldquo;You cannot remove every uncertainty from your future. But you can make your next decision more informed.&rdquo;
              </p>
            </div>
          </div>

        </ScrollDimSection>

        {/* ========================================================= */}
        {/* 6. CAREER STAGES SECTION (Brief Point 6)                  */}
        {/* ========================================================= */}
        <ScrollDimSection id="stages" className="max-w-[1200px] mx-auto px-4 sm:px-6 py-20 sm:py-28 border-b border-slate-200/80 dark:border-white/5 relative">
          
          {/* Eyebrow & Main H2 */}
          <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 text-xs font-semibold uppercase tracking-wider mb-4">
              <span>Career Stages</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-950 dark:text-white tracking-tight leading-[1.15]">
              Wherever you are in your journey, <br className="hidden sm:inline" />
              <span className="text-slate-600 dark:text-slate-400 font-bold">
                your next decision deserves clarity.
              </span>
            </h2>
            <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Select your current milestone to understand how structured self-discovery provides clarity for your next step:
            </p>
          </div>

          {/* Four Distinct Career Stage Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 mb-12 sm:mb-14">
            {careerStages.map((stage, idx) => {
              const IconComponent = stage.icon;
              return (
                <motion.div
                  key={stage.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  className="rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-white/10 p-6 sm:p-7 shadow-sm hover:shadow-xl hover:border-sky-500/30 transition-all flex flex-col justify-between group relative overflow-hidden"
                >
                  <div>
                    {/* Header: Badge & Card Number */}
                    <div className="flex items-center justify-between mb-5">
                      <span className="text-xs font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400">
                        {stage.badge}
                      </span>
                      <span className="text-xs font-mono text-slate-400 dark:text-slate-500">
                        Card {stage.cardNumber}
                      </span>
                    </div>

                    {/* Icon & Title */}
                    <div className="space-y-3.5">
                      <div className="w-11 h-11 rounded-2xl bg-sky-50 dark:bg-sky-950/50 border border-sky-100 dark:border-sky-500/20 text-sky-600 dark:text-sky-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <IconComponent className="w-5 h-5" />
                      </div>

                      <h3 className="text-xl font-bold text-slate-950 dark:text-white tracking-tight leading-snug">
                        {stage.title}
                      </h3>

                      {/* Brief Copy Verbatim */}
                      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        {stage.copy}
                      </p>

                      {/* Relevant Explanation / How WhatAfter Helps */}
                      <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed space-y-1.5">
                        <span className="font-semibold text-slate-800 dark:text-slate-200 block text-[11px] uppercase tracking-wider">
                          How WhatAfter Helps
                        </span>
                        <p>{stage.explanation}</p>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {stage.tags.map((tag, tIdx) => (
                          <span 
                            key={tIdx}
                            className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Product Pathway CTA */}
                  <div className="mt-6 pt-5 border-t border-slate-100 dark:border-white/5">
                    <Link
                      href={stage.href}
                      className="w-full inline-flex items-center justify-between px-4 py-3 rounded-xl bg-slate-900 hover:bg-sky-600 dark:bg-white/10 dark:hover:bg-sky-500 text-white dark:hover:text-slate-950 text-sm font-bold transition-all group-hover:shadow-md"
                    >
                      <span>{stage.cta}</span>
                      <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Grounding Context Note (Verbatim constraint compliance) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/70 dark:border-white/5 text-center max-w-2xl mx-auto">
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              <strong className="text-slate-700 dark:text-slate-300">A note on our scope:</strong> WhatAfter&apos;s 80-scenario assessment is designed to map core cognitive traits, work styles and interest profiles. It provides directional clarity and structured self-discovery to inform your research and discussions, rather than prescribing a rigid or automated destiny.
            </p>
          </div>

        </ScrollDimSection>

        {/* ========================================================= */}
        {/* 5. HOW IT WORKS (STACKED WITH WAVY SELF-DRAWING CONDUITS) */}
        {/* ========================================================= */}
        <ScrollDimSection as="div">
          <StackedHowItWorksWavy />
        </ScrollDimSection>

        {/* Wavy Conduit connecting How It Works into Inside Report */}
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 -my-4 relative z-20">
          <ScrollWavyConnector 
            height={240} 
            direction="s-curve" 
            gradientId="wavy-how-to-dossier" 
          />
        </div>

        {/* ========================================================= */}
        {/* 8. SAMPLE REPORT AND DELIVERABLES (Brief Point 8)          */}
        {/* ========================================================= */}
        <ScrollDimSection id="inside-report" className="py-20 sm:py-28 border-b border-slate-200/80 dark:border-white/5 bg-gradient-to-b from-slate-50 via-slate-100/60 to-slate-50 dark:from-[#061019] dark:via-[#091522] dark:to-[#061019] relative">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
            
            <div className="text-center mb-14 sm:mb-16 relative">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 text-xs font-semibold uppercase tracking-wider mb-4">
                <span>Sample Report &amp; Deliverables</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-950 dark:text-white tracking-tight leading-[1.15]">
                Don&apos;t just take our word for it. <br className="hidden sm:inline" />
                <span className="text-slate-600 dark:text-slate-400 font-bold">
                  See what you&apos;ll receive.
                </span>
              </h2>
              <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                The report is the practical output of your assessment — designed to help you think clearly, evaluate options and take structured action.
              </p>
            </div>

            {/* Dossier Preview Showcase */}
            <ReportDossierShowcase onZoomPdf={(src) => setZoomImage(src)} />

          </div>
        </ScrollDimSection>

        {/* Wavy Conduit connecting Sample Report into Trust & Methodology */}
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 -my-4 relative z-20">
          <ScrollWavyConnector 
            height={240} 
            direction="reverse-s" 
            gradientId="wavy-report-to-methodology" 
          />
        </div>

        {/* ========================================================= */}
        {/* 9. TRUST AND METHODOLOGY (Brief Point 9)                  */}
        {/* ========================================================= */}
        <ScrollDimSection id="methodology" className="py-20 sm:py-28 border-b border-slate-200/80 dark:border-white/5 bg-white dark:bg-[#061019] relative">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6">

            {/* Section Header */}
            <div className="text-center max-w-3xl mx-auto mb-16 relative">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-700 dark:text-sky-300 text-xs font-semibold uppercase tracking-wider mb-4">
                <ShieldCheck className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                <span>Trust &amp; Methodology</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-950 dark:text-white tracking-tight leading-[1.15]">
                Understand how your recommendations are made.
              </h2>
              <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                Career choices shape years of your life. You deserve complete transparency into what we measure, how our algorithms work, where our salary data comes from, and where our boundaries lie.
              </p>
            </div>

            {/* 6 Key Pillars Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              
              {/* Pillar 1: What It Measures */}
              <div className="p-6 sm:p-7 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 hover:border-sky-500/40 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-sky-500/10 text-sky-700 dark:text-sky-300 border border-sky-500/20">
                      Measurement
                    </span>
                    <Target className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-950 dark:text-white mb-2.5">
                    80 Real-Life Scenarios, Not an Academic Test
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    Evaluates behavioral inclinations, preferred work rhythms, and problem-solving habits in everyday situations. We do not test IQ, subject recall, or academic speed. There are no right or wrong answers.
                  </p>
                </div>
                <div className="mt-4 pt-3.5 border-t border-slate-200 dark:border-white/10 text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Focus: Behavioral tendencies &amp; working styles
                </div>
              </div>

              {/* Pillar 2: How Responses Are Interpreted */}
              <div className="p-6 sm:p-7 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 hover:border-sky-500/40 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-sky-500/10 text-sky-700 dark:text-sky-300 border border-sky-500/20">
                      Interpretation
                    </span>
                    <Sliders className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-950 dark:text-white mb-2.5">
                    Multi-Dimensional Trait Continuums
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    Human potential is fluid. Instead of boxing you into rigid 4-letter personality labels, we map your responses along continuous spectrums (e.g., Analytical vs. Intuitive, Autonomous vs. Collaborative).
                  </p>
                </div>
                <div className="mt-4 pt-3.5 border-t border-slate-200 dark:border-white/10 text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Focus: Fluid traits over rigid personality boxes
                </div>
              </div>

              {/* Pillar 3: How Recommendations Are Generated */}
              <div className="p-6 sm:p-7 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 hover:border-sky-500/40 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-sky-500/10 text-sky-700 dark:text-sky-300 border border-sky-500/20">
                      Career Matching
                    </span>
                    <Compass className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-950 dark:text-white mb-2.5">
                    Competency Matching Across 120+ Modern Roles
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    Your trait profile is mapped against a structured matrix of 120+ modern Indian and global career trajectories. We evaluate cognitive requirements and daily work realities to suggest Primary, Secondary, and Wildcard directions.
                  </p>
                </div>
                <div className="mt-4 pt-3.5 border-t border-slate-200 dark:border-white/10 text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Focus: Primary, Secondary &amp; Wildcard options
                </div>
              </div>

              {/* Pillar 4: Salary Information */}
              <div className="p-6 sm:p-7 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 hover:border-sky-500/40 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-sky-500/10 text-sky-700 dark:text-sky-300 border border-sky-500/20">
                      Compensation Estimates
                    </span>
                    <Database className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-950 dark:text-white mb-2.5">
                    Live Web Sourced by AI
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    Salary figures are retrieved by our AI model querying live market information across the internet for each recommended career. It is prompted to identify typical, realistic compensation bands for early and mid-career professionals, rather than extreme outlier packages.
                  </p>
                </div>
                <div className="mt-4 pt-3.5 border-t border-slate-200 dark:border-white/10 text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Focus: AI web search for realistic market ranges
                </div>
              </div>

              {/* Pillar 5: How AI Is Used */}
              <div className="p-6 sm:p-7 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 hover:border-sky-500/40 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-sky-500/10 text-sky-700 dark:text-sky-300 border border-sky-500/20">
                      Technology &amp; AI
                    </span>
                    <Cpu className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-950 dark:text-white mb-2.5">
                    Pattern Analysis, Not Automated Destiny
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    We use structured algorithms and natural-language pattern matching to evaluate your multi-dimensional scenario responses against role criteria. AI is never used to determine your fate or replace human judgment and agency.
                  </p>
                </div>
                <div className="mt-4 pt-3.5 border-t border-slate-200 dark:border-white/10 text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Focus: Decision support, never automated destiny
                </div>
              </div>

              {/* Pillar 6: What It Can and Cannot Tell You */}
              <div className="p-6 sm:p-7 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 hover:border-sky-500/40 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-sky-500/10 text-sky-700 dark:text-sky-300 border border-sky-500/20">
                      Clear Boundaries
                    </span>
                    <Scale className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-950 dark:text-white mb-2.5">
                    Honest Guidance With Explicit Limits
                  </h3>
                  <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                    <p className="flex items-start gap-1.5">
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold shrink-0">✓ CAN:</span>
                      <span>Show work styles where you thrive, overlooked career fits, and questions for mentors.</span>
                    </p>
                    <p className="flex items-start gap-1.5">
                      <span className="text-rose-600 dark:text-rose-400 font-bold shrink-0">✕ CANNOT:</span>
                      <span>Guarantee job placements, predict lifetime earnings, or dictate what you must do.</span>
                    </p>
                  </div>
                </div>
                <div className="mt-4 pt-3.5 border-t border-slate-200 dark:border-white/10 text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Focus: Transparent reality checks &amp; limits
                </div>
              </div>

            </div>

            {/* Dedicated Methodology Link Banner */}
            <div className="rounded-2xl p-6 sm:p-8 bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="max-w-2xl">
                <h4 className="text-base sm:text-lg font-bold text-slate-950 dark:text-white mb-2">
                  Read our full methodology and data sources
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Explore our detailed breakdown of scenario design, trait spectrums, AI-driven market salary lookups, and explicit assessment limits — with zero unverified claims or scientific jargon.
                </p>
              </div>

              <div className="shrink-0 w-full md:w-auto">
                <Link
                  href="/methodology"
                  className="inline-flex items-center justify-center gap-2 w-full md:w-auto px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 font-bold text-sm shadow-md transition-all active:scale-[0.99]"
                >
                  <span>Read Our Full Methodology</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

          </div>
        </ScrollDimSection>

        {/* Wavy Conduit connecting Trust & Methodology into Journal */}
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 -my-4 relative z-20">
          <ScrollWavyConnector 
            height={240} 
            direction="s-curve" 
            gradientId="wavy-methodology-to-journal" 
          />
        </div>


        {/* ========================================================= */}
        {/* 8.5 WHATAFTER JOURNAL (ARTICLES & FRAMEWORKS)             */}
        {/* ========================================================= */}
        <ScrollDimSection id="journal" className="max-w-[1200px] mx-auto px-4 sm:px-6 py-24 border-b border-slate-200/80 dark:border-white/5">
          {/* Articles & Frameworks */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-700 dark:text-sky-400 text-xs font-semibold uppercase tracking-widest mb-3">
                <BookOpen className="w-4 h-4" /> WhatAfter Journal
              </div>
              <h2 className="text-3xl sm:text-5xl font-serif font-bold text-slate-950 dark:text-white mb-3">
                Latest Articles &amp; Frameworks
              </h2>
              <p className="text-slate-700 dark:text-[#aab7c0] max-w-xl text-base sm:text-lg leading-relaxed">
                Read deep-dives on stream decisions, AI resilience, and dinner-table strategies. Free to read for everyone.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-slate-100 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white text-sm font-bold transition-colors shadow-xs"
              >
                View All Articles <ArrowRight className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              </Link>
              <Link
                href="/blog/new"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-sm font-bold transition-colors shadow-xs"
              >
                <PenSquare className="w-4 h-4" /> Write an Article
              </Link>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {INITIAL_BLOG_POSTS.slice(0, 3).map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group flex flex-col justify-between p-7 rounded-3xl bg-white dark:bg-[#0b1723] border-2 border-slate-200/80 dark:border-white/5 hover:border-sky-500/40 transition-all hover:shadow-xl dark:hover:shadow-sky-950/20 transform hover:-translate-y-1 shadow-sm"
              >
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-sky-500/10 text-sky-800 dark:text-sky-300 border border-sky-500/20">
                      {post.category}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-slate-950 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-300 transition-colors mb-3 leading-snug">
                    {post.title}
                  </h3>

                  <p className="text-sm sm:text-base text-slate-700 dark:text-[#95a5b2] leading-relaxed mb-6 line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-sm text-slate-600 dark:text-[#718593]">
                  <div>
                    <span className="font-bold text-slate-950 dark:text-[#ccd8e0] block">{post.authorName}</span>
                    {post.authorRole && (
                      <span className="text-xs text-slate-500 dark:text-[#5d7180]">{post.authorRole}</span>
                    )}
                  </div>
                  <span className="inline-flex items-center text-sky-700 dark:text-sky-400 font-extrabold group-hover:translate-x-1 transition-transform">
                    Read Article →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </ScrollDimSection>

        {/* Wavy Conduit connecting Journal into Pricing */}
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 -my-4 relative z-20">
          <ScrollWavyConnector 
            height={240} 
            direction="reverse-s" 
            gradientId="wavy-journal-to-pricing" 
          />
        </div>

        {/* ========================================================= */}
        {/* 10. PRICING SECTION (Brief Point 10)                      */}
        {/* ========================================================= */}
        <ScrollDimSection id="pricing" className="max-w-[1200px] mx-auto px-4 sm:px-6 py-24 sm:py-32 border-b border-slate-200/80 dark:border-white/5 relative">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 relative">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-700 dark:text-sky-300 text-xs font-semibold uppercase tracking-wider mb-4">
              <span>Transparent Pricing</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-950 dark:text-white tracking-tight leading-[1.15]">
              A clearer way to think about your next career decision.
            </h2>
            <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              One straightforward investment. Full deliverables, immediate online access, and transparent terms before checkout.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-start">

            {/* Left: Main Product & Deliverables Card (7 cols) */}
            <div className="lg:col-span-7 p-7 sm:p-9 rounded-3xl bg-white dark:bg-[#07131e] border-2 border-slate-200 dark:border-white/10 hover:border-sky-500/50 transition-all shadow-xl dark:shadow-2xl relative">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-white/10">
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-sky-700 dark:text-sky-400 font-bold block mb-1">
                    Complete Evaluation Package
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-bold text-slate-950 dark:text-white">
                    WhatAfter Career Assessment
                  </h3>
                </div>

                <div className="text-left sm:text-right shrink-0">
                  <div className="text-4xl sm:text-5xl font-black text-slate-950 dark:text-white tracking-tight">
                    ₹999
                  </div>
                  <span className="text-xs font-mono text-slate-500 dark:text-slate-400 font-medium block mt-0.5">
                    one-time payment • no subscriptions
                  </span>
                </div>
              </div>

              {/* Exact Deliverables List */}
              <div className="py-6">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold block mb-4">
                  Deliverables Included in Your Purchase:
                </span>
                <ul className="space-y-3.5 text-sm sm:text-base text-slate-800 dark:text-[#d2dce3]">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
                    <span><b>80-Scenario Evaluation:</b> Real-world choices in English and Hindi with no right/wrong answers.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
                    <span><b>15-Page Career Intelligence Dossier:</b> Complete PDF report available for immediate download.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
                    <span><b>Multi-Dimensional Trait Spectrums:</b> Fluid assessment of your reasoning, execution, and work rhythms.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
                    <span><b>3-Tier Career Matching:</b> Specific Primary, Secondary, and Wildcard career paths.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
                    <span><b>Career Eliminations:</b> Objective identification of mismatch roles to prevent career burnout.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
                    <span><b>Live Market Salary Benchmarks:</b> Realistic prevailing salary ranges retrieved by AI for matched roles.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
                    <span><b>3-Year Action Plan:</b> Concrete learning milestones for 1 month, 6 months, 1 year, and 3 years.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
                    <span><b>Family &amp; Mentor Discussion Prompts:</b> Structured talking points for constructive dinner-table conversations.</span>
                  </li>
                </ul>
              </div>

              {/* Primary CTA Button */}
              <div className="pt-2">
                <Link 
                  href="/signup" 
                  className="inline-flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-base shadow-lg shadow-sky-600/25 transition-all active:scale-[0.99] text-center"
                >
                  <span>Get Started with WhatAfter — ₹999</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <div className="mt-3 text-center text-xs text-slate-500 dark:text-slate-400 font-medium">
                  One-time payment of ₹999 • All applicable terms clear before checkout
                </div>
              </div>

            </div>

            {/* Right: Operational Transparency (How it works, delivery, support, refund) (5 cols) */}
            <div className="lg:col-span-5 space-y-4">

              {/* 1. How you access it */}
              <div className="p-6 rounded-2xl bg-white dark:bg-[#07131e] border border-slate-200 dark:border-white/10 shadow-sm">
                <div className="flex items-center gap-2.5 text-xs font-mono font-bold uppercase tracking-wider text-sky-700 dark:text-sky-400 mb-2">
                  <Laptop className="w-4 h-4" />
                  <span>How You Access The Assessment</span>
                </div>
                <h4 className="text-base font-bold text-slate-950 dark:text-white mb-1.5">
                  Immediate Online Access
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Right after signing up and checkout, you are redirected directly to your assessment portal. Complete the 80 scenarios at your own pace (typically 20–25 minutes) from any phone, tablet, or laptop.
                </p>
              </div>

              {/* 2. When & how report is received */}
              <div className="p-6 rounded-2xl bg-white dark:bg-[#07131e] border border-slate-200 dark:border-white/10 shadow-sm">
                <div className="flex items-center gap-2.5 text-xs font-mono font-bold uppercase tracking-wider text-sky-700 dark:text-sky-400 mb-2">
                  <Download className="w-4 h-4" />
                  <span>How &amp; When You Receive Your Report</span>
                </div>
                <h4 className="text-base font-bold text-slate-950 dark:text-white mb-1.5">
                  Instant Generation &amp; PDF Download
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  As soon as you complete the final scenario, your personalized 15-page dossier is compiled automatically. You can read it directly on your private dashboard and download a full-color PDF anytime.
                </p>
              </div>

              {/* 3. Available support */}
              <div className="p-6 rounded-2xl bg-white dark:bg-[#07131e] border border-slate-200 dark:border-white/10 shadow-sm">
                <div className="flex items-center gap-2.5 text-xs font-mono font-bold uppercase tracking-wider text-sky-700 dark:text-sky-400 mb-2">
                  <Mail className="w-4 h-4" />
                  <span>Customer &amp; Technical Support</span>
                </div>
                <h4 className="text-base font-bold text-slate-950 dark:text-white mb-1.5">
                  Direct Email Assistance
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Have a question about your account, payment, or assessment progress? Our support team is reachable directly at <a href="mailto:careeright.edu@gmail.com" className="text-sky-600 dark:text-sky-400 font-semibold underline underline-offset-2">careeright.edu@gmail.com</a>.
                </p>
              </div>

              {/* 4. Refund terms */}
              <div className="p-6 rounded-2xl bg-white dark:bg-[#07131e] border border-slate-200 dark:border-white/10 shadow-sm">
                <div className="flex items-center gap-2.5 text-xs font-mono font-bold uppercase tracking-wider text-sky-700 dark:text-sky-400 mb-2">
                  <RotateCcw className="w-4 h-4" />
                  <span>Refund &amp; Resolution Policy</span>
                </div>
                <h4 className="text-base font-bold text-slate-950 dark:text-white mb-1.5">
                  Fair &amp; Transparent Terms
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Because assessment access and report generation are delivered immediately, purchases are generally final. However, if a technical error prevents you from completing your assessment or generating your report, contact us within 7 days for an immediate reset or full refund.
                </p>
              </div>

            </div>

          </div>

        </ScrollDimSection>


        {/* ========================================================= */}
        {/* 11. FREQUENTLY ASKED QUESTIONS (Brief Point 11)           */}
        {/* ========================================================= */}
        <ScrollDimSection id="faqs" className="max-w-[850px] mx-auto px-4 sm:px-6 py-24 border-b border-slate-200/80 dark:border-white/5 relative">
          
          {/* FAQPage Structured Data for Search Engines & SEO */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": faqs.map((faq) => ({
                  "@type": "Question",
                  "name": faq.q,
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": faq.a
                  }
                }))
              })
            }}
          />

          <div className="text-center mb-14 relative">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-700 dark:text-sky-300 text-xs font-semibold uppercase tracking-wider mb-4">
              <span>Frequently Asked Questions</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-950 dark:text-white tracking-tight leading-[1.15]">
              Clear answers to common questions.
            </h2>
            <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Everything you need to know about the WhatAfter assessment, deliverables, methodologies, and policies.
            </p>
          </div>
          
          <div className="space-y-3.5">
            {faqs.map((faq, i) => (
              <div 
                key={i} 
                className="border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden bg-white dark:bg-[#07131e] transition-colors shadow-sm"
              >
                <button 
                  onClick={() => toggleFaq(i)}
                  aria-expanded={openFaq === i}
                  aria-controls={`faq-answer-${i}`}
                  id={`faq-question-${i}`}
                  className="w-full text-left px-5 sm:px-6 py-5 flex items-center justify-between font-bold text-base sm:text-lg hover:bg-slate-50 dark:hover:bg-white/[0.03] text-slate-900 dark:text-white transition-colors"
                >
                  <span className="pr-4">{faq.q}</span>
                  <motion.div
                    animate={{ rotate: openFaq === i ? 180 : 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="shrink-0"
                  >
                    <ChevronDown className={`w-5 h-5 transition-colors ${openFaq === i ? "text-sky-600 dark:text-sky-400" : "text-slate-400"}`} />
                  </motion.div>
                </button>
                <div
                  id={`faq-answer-${i}`}
                  role="region"
                  aria-labelledby={`faq-question-${i}`}
                  className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
                    openFaq === i ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-5 sm:px-6 pb-6 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-white/5 pt-4">
                      {faq.a}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollDimSection>


        {/* ========================================================= */}
        {/* 12. FINAL CTA (Brief Point 12)                            */}
        {/* ========================================================= */}
        <ScrollDimSection className="max-w-[1200px] mx-auto px-4 sm:px-6 py-20 sm:py-28">
          <div className="rounded-3xl p-8 sm:p-12 md:p-16 text-center bg-gradient-to-b from-sky-50/60 via-white to-slate-50 dark:from-[#081523] dark:via-[#07131e] dark:to-[#081523] border border-slate-200 dark:border-white/10 relative overflow-hidden shadow-xl dark:shadow-2xl">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-700 dark:text-sky-300 text-xs font-semibold uppercase tracking-wider mb-5">
              <span>A Clearer Next Step</span>
            </div>
            
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight mb-5 max-w-3xl mx-auto text-slate-950 dark:text-white leading-[1.15]">
              You don&apos;t need to have your entire future figured out.
            </h2>
            
            <div className="text-slate-600 dark:text-slate-300 text-base sm:text-lg max-w-2xl mx-auto mb-9 leading-relaxed space-y-3 font-normal">
              <p className="font-semibold text-slate-800 dark:text-slate-200 text-lg sm:text-xl">
                You just need a better way to think about your next step.
              </p>
              <p>
                Whether you&apos;re choosing a stream, exploring a degree, considering an MBA specialization or thinking about changing careers, start by understanding yourself and the options in front of you.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                href="/signup" 
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-base shadow-lg shadow-sky-600/25 transition-all active:scale-[0.99] w-full sm:w-auto"
              >
                <span>Discover Your Career Fit — ₹999</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              
              <Link
                href="/methodology"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl border border-slate-300 dark:border-white/15 bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-800 dark:text-slate-200 font-semibold text-base transition-all w-full sm:w-auto"
              >
                <span>Read Our Methodology</span>
              </Link>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
              <span>80 practical scenarios</span>
              <span>•</span>
              <span>English &amp; Hindi</span>
              <span>•</span>
              <span>Immediate report download</span>
            </div>

          </div>
        </ScrollDimSection>

      </main>
      

      {/* ========================================================= */}
      {/* 12. CLEAN, REAL FOOTER (ZERO BROKEN LINKS)                */}
      {/* ========================================================= */}
      <footer className="border-t border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-[#040b12] pt-16 pb-12 transition-colors duration-200">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-4 gap-10 mb-14">
            
            {/* Column 1: Brand & Inquiries */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-50 dark:bg-sky-950/50 border border-sky-200 dark:border-sky-500/25 p-1 shadow-xs">
                  <Image src="/what_after_logo_blue.png" alt="WhatAfter Logo" width={24} height={24} className="object-contain" />
                </div>
                <span className="text-xl font-bold tracking-tight text-slate-950 dark:text-white">
                  What<span className="text-sky-600 dark:text-sky-400 font-extrabold">After</span>
                </span>
              </div>
              
              <p className="text-xs text-slate-600 dark:text-[#7d909e] max-w-[340px] leading-relaxed mb-4">
                Helping students and families make sense of what comes next — from school to college and beyond. Practical ideas. No generic motivation.
              </p>

              <div className="text-xs text-slate-600 dark:text-[#7d909e]">
                Inquiries &amp; Support: <a href="mailto:careeright.edu@gmail.com" className="text-sky-600 dark:text-sky-400 hover:underline font-medium">careeright.edu@gmail.com</a>
              </div>
            </div>
            
            {/* Column 2: WhatAfter Life Stages */}
            <div>
              <h4 className="text-[11px] font-mono font-bold tracking-wider uppercase text-slate-950 dark:text-white mb-4">
                What After?
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-600 dark:text-[#8295a3]">
                <li><a href="#stages" className="hover:text-sky-600 dark:hover:text-sky-300 transition-colors">Choosing a Stream</a></li>
                <li><a href="#stages" className="hover:text-sky-600 dark:hover:text-sky-300 transition-colors">Choosing a Degree</a></li>
                <li><a href="#stages" className="hover:text-sky-600 dark:hover:text-sky-300 transition-colors">MBA Specialization</a></li>
                <li><a href="#stages" className="hover:text-sky-600 dark:hover:text-sky-300 transition-colors">Career Change</a></li>
                <li><a href="#how-it-works" className="hover:text-sky-600 dark:hover:text-sky-300 transition-colors">How It Works</a></li>
              </ul>
            </div>

            {/* Column 3: Platform & Real Legal */}
            <div>
              <h4 className="text-[11px] font-mono font-bold tracking-wider uppercase text-slate-950 dark:text-white mb-4">
                Platform
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-600 dark:text-[#8295a3]">
                <li><a href="#inside-report" className="hover:text-sky-600 dark:hover:text-sky-300 transition-colors">Inside The Report</a></li>
                <li><Link href="/methodology" className="hover:text-sky-600 dark:hover:text-sky-300 transition-colors">Methodology &amp; Trust</Link></li>
                <li><Link href="/blog" className="hover:text-sky-600 dark:hover:text-sky-300 transition-colors">Journal &amp; Blogs</Link></li>
                <li><a href="#pricing" className="hover:text-sky-600 dark:hover:text-sky-300 transition-colors">Pricing (₹999)</a></li>
                <li><a href="#faqs" className="hover:text-sky-600 dark:hover:text-sky-300 transition-colors">FAQs</a></li>
                <li><Link href="/privacy" className="hover:text-sky-600 dark:hover:text-sky-300 transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>

          </div>

          {/* Bottom strip */}
          <div className="pt-8 border-t border-slate-200 dark:border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500 dark:text-[#5f717f]">
            <span>© {new Date().getFullYear()} WhatAfter (Careeright). All rights reserved.</span>
            <span>Support &amp; Inquiries: <a href="mailto:careeright.edu@gmail.com" className="hover:text-sky-600 dark:hover:text-sky-400">careeright.edu@gmail.com</a></span>
          </div>
        </div>
      </footer>

      {/* Lightbox Zoom Modal for High-Resolution Report Viewing */}
      {zoomImage && (
        <div 
          onClick={() => setZoomImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 dark:bg-black/90 backdrop-blur-md animate-in fade-in duration-200 cursor-zoom-out"
        >
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="relative max-w-4xl w-full max-h-[92vh] bg-white dark:bg-[#061019] rounded-2xl border border-slate-200 dark:border-white/20 overflow-hidden shadow-2xl p-3 sm:p-4 flex flex-col items-center"
          >
            <div className="w-full flex items-center justify-between px-3 py-2 border-b border-slate-200 dark:border-white/10 mb-2">
              <span className="text-xs font-mono text-sky-600 dark:text-sky-400 font-semibold uppercase tracking-wider">
                WhatAfter 15-Page Dossier • Detailed Page Preview
              </span>
              <button 
                onClick={() => setZoomImage(null)}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 text-slate-700 dark:text-white transition-colors"
                aria-label="Close Preview"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="relative w-full h-[78vh] overflow-auto rounded-lg bg-slate-50 dark:bg-[#0b1723]/60 p-2">
              <Image 
                src={zoomImage} 
                alt="Enlarged Report Preview" 
                fill 
                unoptimized
                quality={100}
                className="object-contain"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
