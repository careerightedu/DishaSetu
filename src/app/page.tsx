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
  Star,
  XCircle,
  Sparkles,
  Check,
  BookOpen,
  PenSquare,
  ZoomIn,
  X,
  GraduationCap,
  TrendingUp,
  ShieldCheck
} from "lucide-react";
import { motion, AnimatePresence, useScroll, useSpring, useTransform } from "framer-motion";
import Navbar from "@/features/auth/components/Navbar";
import { INITIAL_BLOG_POSTS } from "@/lib/blogs";
import ScrollCareerIntelligenceEngine from "@/components/ScrollCareerIntelligenceEngine";
import ReportDossierShowcase from "@/components/ReportDossierShowcase";
import DinnerTableTranslator from "@/components/DinnerTableTranslator";
import StackedHowItWorksWavy from "@/components/StackedHowItWorksWavy";
import SocialProofBanner from "@/components/SocialProofBanner";
import ScrollWavyConnector from "@/components/ScrollWavyConnector";
import AmbientBackgroundGlows from "@/components/AmbientBackgroundGlows";
import ScrollDimSection from "@/components/ScrollDimSection";

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeStage, setActiveStage] = useState<number>(1);
  const [isStagePaused, setIsStagePaused] = useState<boolean>(false);
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

  // Auto-switch stages every 5 seconds unless user hovers or taps
  React.useEffect(() => {
    if (isStagePaused) return;

    const timer = setInterval(() => {
      setActiveStage((prev) => (prev + 1) % 4);
    }, 5000);

    return () => clearInterval(timer);
  }, [isStagePaused]);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Parallax transforms for staggered testimonial columns
  const testimonialsRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: testimonialsProgress } = useScroll({
    target: testimonialsRef,
    offset: ["start end", "end start"],
  });
  const testimonialsSmooth = useSpring(testimonialsProgress, {
    stiffness: 90,
    damping: 25,
    restDelta: 0.001,
  });
  const col1Y = useTransform(testimonialsSmooth, [0, 1], [25, -25]);
  const col2Y = useTransform(testimonialsSmooth, [0, 1], [-20, 20]);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const stages = [
    {
      id: "class-8",
      label: "Class 8 & 9",
      tagline: "Subject Discovery & Foundational Aptitude",
      dilemma: "Which optional subjects should I choose before high school begins?",
      solution: "Uncovers foundational cognitive aptitudes (numerical, logical, verbal, spatial) early, preventing years of regret from choosing the wrong subjects.",
      outcomes: [
        "Discover your natural learning style (Build-to-Learn vs Theory-first)",
        "Align subject preferences with verified 10-year career demand",
        "Build genuine academic confidence with zero exam pressure"
      ],
      image: "/stages/stage_class_8.jpg",
      imageAlt: "Class 8 student exploring hands-on science and foundational aptitude at home",
      badge: "Foundational Aptitude"
    },
    {
      id: "class-10",
      label: "After 10th",
      tagline: "Stream Selection Without Peer Pressure",
      dilemma: "Science, Commerce, or Humanities? How do I choose with real data?",
      solution: "Eliminates coaching hype and peer pressure by analyzing 35 cognitive traits and work values, matching the student to the stream where they will actually excel.",
      outcomes: [
        "Evidence-backed Stream Matrix (PCM vs PCB vs Commerce vs Arts)",
        "Pinpoints clash points (e.g. creative mind trapped in rote learning)",
        "Includes a Parent Discussion Guide to prevent dinner-table arguments"
      ],
      image: "/stages/stage_class_10.jpg",
      imageAlt: "Class 10 student making a calm, data-backed stream choice with reference books",
      badge: "Stream Matrix"
    },
    {
      id: "class-12",
      label: "After 12th",
      tagline: "Degrees, Entrance Exams & College Majors",
      dilemma: "Which college major will actually provide high market demand and AI-resilience?",
      solution: "Ranks top degrees and competitive exam pathways based on verified salary trajectories, cognitive fit, and automation protection.",
      outcomes: [
        "Verified Indian entry vs senior salary benchmarks (₹12–25L vs ₹40–80L+)",
        "AI-Resilience rating highlighting jobs protected from automation",
        "Low-stress backup pathways so you always have a secure Plan B"
      ],
      image: "/stages/stage_class_12.jpg",
      imageAlt: "Class 12 student evaluating entrance exams and market-ready college majors",
      badge: "Major & Degree Fit"
    },
    {
      id: "college",
      label: "College & Beyond",
      tagline: "First Career Move & 3-Year Specialization",
      dilemma: "Campus placements, higher studies (GATE/CAT/GRE), or domain pivot?",
      solution: "Provides a step-by-step 3-year execution plan with exact projects, skill bridges, and milestone timelines for high-growth modern roles.",
      outcomes: [
        "Sequenced 3-Year Roadmap (1-month, 6-month, 1-year, 3-year actions)",
        "High-priority skill gap closures for immediate hiring advantage",
        "Clear list of dead-end careers to eliminate before wasting years"
      ],
      image: "/stages/stage_college.jpg",
      imageAlt: "College engineering student reviewing career roadmaps on campus",
      badge: "First Career Move"
    }
  ];

  const faqs = [
    {
      q: "How is WhatAfter different from standard psychometric or MBTI tests?",
      a: "Standard personality tests box you into a generic 4-letter category and offer vague advice. WhatAfter measures 35 cognitive traits and work values across 80 realistic scenarios, directly correlating them with real-world Indian and global job markets, expected salary benchmarks, AI-resilience ratings, and concrete 3-year execution roadmaps."
    },
    {
      q: "What if my parents want me to do engineering or medicine, but my interests differ?",
      a: "This is exactly why we created the 'In Plain Words' narrative (Page 12) and the 'Guide for Parents & Counsellors' (Page 14). Written without confusing psychometric jargon, the report explains the trade-offs, financial upside, and viability so students and parents can have an informed, respectful conversation based on objective data rather than emotion or peer pressure."
    },
    {
      q: "How is the AI-Resilience score calculated?",
      a: "Our model analyzes the specific core competencies required in each career domain and evaluates which functions are susceptible to automation by generative AI and automation workflows versus which functions require high human judgment, system architecture, spatial reasoning, and creative empathy."
    },
    {
      q: "How long does the assessment take to complete?",
      a: "The assessment consists of 80 thoughtful scenario questions. Because there are no right or wrong answers, students can move at their own natural pace without artificial time pressure. You can save your progress and return at any time."
    },
    {
      q: "Can I take the assessment in Hindi?",
      a: "Yes! The entire assessment is fully available in both English and Hindi (हिंदी). You can choose the language of your choice at the start of the assessment and answer in whichever language you feel most comfortable with."
    },
    {
      q: "Can I share the report with my school teacher or career counsellor?",
      a: "Yes! Every assessment generates a downloadable, high-resolution 15-page PDF dossier specifically structured with dedicated reflection prompts, discussion points, and execution checklists for mentors and counsellors."
    }
  ];

  const testimonials = [
    {
      quote: "Every coaching institute in Kota told us our son must take Science PCM. The WhatAfter report showed his high verbal precision and analytical traits mapped much better to Law and Economics. It saved our family two years of stress and lakhs of rupees.",
      name: "Sunita & Rajesh Verma",
      role: "Parents of Class 10 Student",
      location: "New Delhi",
      tag: "Stream Selection",
      avatar: "/testimonials/verma_parents.jpg"
    },
    {
      quote: "I was torn between corporate software engineering and product design. The report pinpointed my 100% Artistic trait alongside my engineering background and mapped out a Creative Technology path. It felt like someone had finally articulated my exact internal dilemma.",
      name: "Aarav Sharma",
      role: "1st Year B.Tech Student",
      location: "IIT Jodhpur",
      tag: "College Specialization",
      avatar: "/testimonials/aarav.jpg"
    },
    {
      quote: "Most quizzes tell you 'You should be an engineer'. WhatAfter went 10 levels deeper: it gave me expected entry salaries (₹12–20 LPA), AI-risk scores, and literally mapped out my first three open-source projects to build.",
      name: "Ananya Iyer",
      role: "Class 12 Student (PCM)",
      location: "Bengaluru",
      tag: "Degree & College Choice",
      avatar: "/testimonials/ananya.jpg"
    },
    {
      quote: "The 'What We Eliminated' section was the most helpful part. It showed me exactly why traditional manufacturing would clash with my desire for autonomy, and directed me toward Robotics Product Management.",
      name: "Rohan Deshmukh",
      role: "Final Year Mechanical Engineering",
      location: "Pune",
      tag: "Career Pivot",
      avatar: "/testimonials/rohan.jpg"
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
        {/* 1. HERO SECTION (ENGLISHYAARI-INSPIRED 1-LINER SOLUTION)  */}
        {/* ========================================================= */}
        <ScrollDimSection isHero id="hero" className="relative pt-16 pb-20 md:pt-24 md:pb-28 border-b border-slate-200/80 dark:border-white/5 overflow-hidden">
          {/* Subtle Background Grid & Ambient Glow */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#0ea5e908_1px,transparent_1px),linear-gradient(to_bottom,#0ea5e908_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none" />
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[360px] bg-sky-500/10 rounded-full blur-[140px] pointer-events-none" />
          
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 relative z-10 flex flex-col items-center text-center">
            
            {/* Main Headline (2-Line High-Impact Solution) */}
            <h1 className="font-sans font-black tracking-tight text-4xl sm:text-6xl md:text-7xl lg:text-[76px] leading-[1.08] mb-4 max-w-4xl">
              <span className="block text-slate-950 dark:text-white">
                Find Your Right Career In
              </span>
              <span className="block text-amber-500 dark:text-amber-400 mt-1 sm:mt-2">
                One 30-Minute Assessment!
              </span>
            </h1>

            {/* Pill CTA Button (EnglishYaari Style) */}
            <div className="flex flex-col items-center justify-center gap-3 mb-10 w-full sm:w-auto">
              <Link 
                href="/signup" 
                className="w-full sm:w-auto rounded-full px-9 sm:px-11 py-4 sm:py-4.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-base sm:text-lg shadow-xl shadow-sky-500/25 hover:shadow-sky-500/40 hover:scale-105 active:scale-95 transition-all inline-flex items-center justify-center gap-2"
              >
                Start Assessment — ₹999 Only <ArrowRight className="w-5 h-5" />
              </Link>
              
              <a 
                href="#inside-report" 
                className="text-xs sm:text-sm font-bold text-slate-500 hover:text-sky-600 dark:text-slate-400 dark:hover:text-sky-400 transition-colors inline-flex items-center gap-1.5"
              >
                View Sample 15-Page Report ↓
              </a>
            </div>

            {/* 3 Circular Icon Badges (EnglishYaari Style) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 md:gap-12 pt-6 border-t border-slate-200/80 dark:border-white/10 w-full max-w-3xl mx-auto">
              {/* Badge 1 */}
              <div className="flex items-center justify-center sm:justify-start gap-3.5 text-left">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center shadow-md shadow-sky-500/20 shrink-0 text-white">
                  <GraduationCap className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">Class 8 to College</div>
                  <div className="text-sm sm:text-base font-extrabold text-slate-950 dark:text-white">All Streams Welcome</div>
                </div>
              </div>

              {/* Badge 2 */}
              <div className="flex items-center justify-center sm:justify-start gap-3.5 text-left">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center shadow-md shadow-teal-500/20 shrink-0 text-white">
                  <TrendingUp className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">Real Job Market</div>
                  <div className="text-sm sm:text-base font-extrabold text-slate-950 dark:text-white">Verified Indian Salaries</div>
                </div>
              </div>

              {/* Badge 3 */}
              <div className="flex items-center justify-center sm:justify-start gap-3.5 text-left">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-md shadow-amber-500/20 shrink-0 text-white">
                  <ShieldCheck className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">Next 35 Years</div>
                  <div className="text-sm sm:text-base font-extrabold text-slate-950 dark:text-white">AI-Resilient Future</div>
                </div>
              </div>
            </div>

          </div>
        </ScrollDimSection>

        {/* ========================================================= */}
        {/* 1.5 SOCIAL VALIDATION & PROOF BANNER (ENGLISHYAARI STYLE)  */}
        {/* ========================================================= */}
        <SocialProofBanner />


        {/* ========================================================= */}
        {/* 2. THE 35-YEAR CAREER DECISION (ENGLISHYAARI TABLET MOCKUP)*/}
        {/* ========================================================= */}
        <ScrollDimSection id="urgency" className="max-w-[1200px] mx-auto px-4 sm:px-6 py-16 sm:py-24 border-b border-slate-200/80 dark:border-white/5 relative">
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-sans font-black text-slate-950 dark:text-white tracking-tight leading-tight">
              Don&apos;t Spend 35 Years Wondering.
            </h2>
          </div>

          {/* EnglishYaari-Style Tablet Device & Floating Live UI Showcase */}
          <div className="relative max-w-4xl mx-auto">
            
            {/* Tablet Frame */}
            <div className="relative rounded-[28px] sm:rounded-[40px] md:rounded-[48px] border-[8px] sm:border-[12px] md:border-[14px] border-slate-900 bg-slate-950 shadow-2xl overflow-hidden aspect-[4/3] sm:aspect-[16/10] md:aspect-[16/9]">
              {/* Front Camera Notch Dot */}
              <div className="absolute top-2.5 sm:top-3.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-slate-800 z-30" />
              
              {/* Student Visual Background */}
              <Image 
                src="/images/student_career_confidence.jpg" 
                alt="Confident Student on WhatAfter" 
                fill 
                className="object-cover object-center" 
                priority
              />

              {/* Ambient Dark Gradient for Legibility */}
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/45 to-transparent z-10" />

              {/* Overlaid Typography Inside Screen (EnglishYaari Style) */}
              <div className="absolute top-6 sm:top-10 left-6 sm:left-10 z-20 max-w-[240px] sm:max-w-xs md:max-w-sm text-left">
                <span className="text-white text-2xl sm:text-4xl md:text-5xl font-black tracking-tight leading-[1.05] block">
                  Decide. <br />
                  &amp; Lead. <br />
                  <span className="italic text-sky-400">FOR 35 YEARS</span>
                </span>
              </div>

            </div>

            {/* Desktop Overlapping Floating Cards (2 Clean Boxes - EnglishYaari Style) */}
            <div className="hidden md:block">
              {/* Box 1: Assessment Progress with BIG WhatAfter Logo */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="absolute -top-6 -right-6 lg:-right-10 w-[340px] rounded-2xl bg-white dark:bg-[#07131e] border-2 border-slate-200/90 dark:border-white/10 p-5 shadow-2xl z-30 text-left"
              >
                <div className="flex items-center justify-between mb-3.5">
                  <div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Greetings!</div>
                    <div className="text-base font-bold text-slate-950 dark:text-white">Your Progress so far!</div>
                  </div>
                  {/* BIG WhatAfter Logo */}
                  <div className="w-14 h-14 rounded-2xl bg-sky-50 dark:bg-sky-950/50 border border-sky-100 dark:border-sky-500/20 p-2 flex items-center justify-center shadow-xs shrink-0">
                    <Image 
                      src="/what_after_logo_blue.png" 
                      alt="WhatAfter Logo" 
                      width={44} 
                      height={44} 
                      className="object-contain"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 py-3 border-y border-slate-100 dark:border-white/5">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-mono">Completed Questions</span>
                    <b className="text-slate-950 dark:text-white font-black text-base">24 / 80</b>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-mono">Current Stage</span>
                    <b className="text-sky-600 dark:text-sky-400 font-bold text-sm">RIASEC Fit</b>
                  </div>
                </div>

                <div className="mt-3.5 space-y-1.5">
                  <div className="flex justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400">
                    <span>Assessment Progress</span>
                    <span className="font-bold text-sky-600 dark:text-sky-400">30% Complete</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-white/10 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-sky-500 to-teal-400 h-full w-[30%] rounded-full" />
                  </div>
                </div>
              </motion.div>

              {/* Box 2: Live Notification with SMALL WhatAfter Logo */}
              <motion.div 
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="absolute -bottom-6 -right-8 lg:-right-12 w-[340px] rounded-2xl bg-white/95 dark:bg-[#07131e]/95 backdrop-blur-md border-2 border-slate-200/90 dark:border-white/10 p-4 shadow-2xl z-30 text-left space-y-1.5"
              >
                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                  {/* SMALL WhatAfter Logo */}
                  <span className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                    <Image 
                      src="/what_after_logo_blue.png" 
                      alt="WhatAfter" 
                      width={16} 
                      height={16} 
                      className="object-contain"
                    />
                    WHATAFTER
                  </span>
                  <span>1m ago</span>
                </div>
                <div className="text-sm font-bold text-slate-950 dark:text-white flex items-center gap-1.5">
                  <span>Hurray! Cognitive Fit Mapped!</span>
                  <span>🎉</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Strong alignment in <b>Product &amp; Systems Architecture</b>. Next: AI-resilience evaluation.
                </p>
              </motion.div>
            </div>

            {/* Mobile Stacked Cards (2 Clean Boxes) */}
            <div className="grid grid-cols-1 gap-3 md:hidden mt-6 text-left">
              {/* Mobile Box 1: Progress with Big Logo */}
              <div className="rounded-2xl bg-white dark:bg-[#07131e] border border-slate-200/80 dark:border-white/10 p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">Greetings!</div>
                    <div className="text-sm font-bold text-slate-950 dark:text-white">Your Progress so far!</div>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-sky-50 dark:bg-sky-950/50 border border-sky-100 dark:border-sky-500/20 p-2 flex items-center justify-center shrink-0">
                    <Image 
                      src="/what_after_logo_blue.png" 
                      alt="WhatAfter Logo" 
                      width={36} 
                      height={36} 
                      className="object-contain"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs py-2 border-y border-slate-100 dark:border-white/5">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-mono">Questions</span>
                    <b className="text-slate-950 dark:text-white font-bold text-sm">24 / 80</b>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-mono">Current Stage</span>
                    <b className="text-sky-600 dark:text-sky-400 font-bold">RIASEC Fit</b>
                  </div>
                </div>
                <div className="mt-2.5">
                  <div className="w-full bg-slate-100 dark:bg-white/10 h-2 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-sky-500 to-teal-400 h-full w-[30%]" />
                  </div>
                </div>
              </div>

              {/* Mobile Box 2: Notification with Small Logo */}
              <div className="rounded-2xl bg-white dark:bg-[#07131e] border border-slate-200/80 dark:border-white/10 p-4 shadow-sm space-y-1">
                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                  <span className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                    <Image 
                      src="/what_after_logo_blue.png" 
                      alt="WhatAfter" 
                      width={16} 
                      height={16} 
                      className="object-contain"
                    />
                    WHATAFTER
                  </span>
                  <span>1m ago</span>
                </div>
                <div className="text-xs font-bold text-slate-950 dark:text-white flex items-center gap-1">
                  <span>Hurray! Cognitive Fit Mapped! 🎉</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  Strong alignment in <b>Product &amp; Systems Architecture</b>.
                </p>
              </div>
            </div>

          </div>

          {/* Direct CTA */}
          <div className="mt-8 text-center">
            <Link 
              href="/signup" 
              className="rounded-full px-9 sm:px-11 py-4 sm:py-4.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-base sm:text-lg shadow-xl shadow-sky-500/25 hover:shadow-sky-500/40 hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-2"
            >
              Get Career Certainty Today (₹999 Only) →
            </Link>
          </div>
        </ScrollDimSection>





        {/* ========================================================= */}
        {/* 4. THE 4 LIFE STAGES ("WHAT AFTER?")                      */}
        {/* ========================================================= */}
        <ScrollDimSection id="stages" className="max-w-[1200px] mx-auto px-4 sm:px-6 py-24 border-b border-slate-200/80 dark:border-white/5 relative">
          <div className="text-center mb-16 relative">
            <span className="absolute -top-12 left-1/2 -translate-x-1/2 text-[110px] sm:text-[160px] md:text-[200px] font-serif font-black text-slate-900/[0.03] dark:text-white/[0.03] pointer-events-none select-none -z-10 leading-none">
              02
            </span>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-600 dark:text-sky-400 text-xs font-semibold uppercase tracking-widest mb-3">
              The Life-Stage Decision Engine
            </div>
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-4 text-slate-950 dark:text-white">
              The Question Changes at Every Stage. <br className="hidden sm:inline" />
              So Does WhatAfter.
            </h2>
            <p className="text-slate-600 dark:text-[#aab7c0] max-w-xl mx-auto text-base sm:text-lg">
              Select your current crossroads to see your tailored outcome:
            </p>
          </div>

          {/* Stage Selector Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mb-10">
            {stages.map((stg, i) => (
              <button
                key={stg.id}
                onClick={() => setActiveStage(i)}
                className={`relative p-4 sm:p-5 rounded-2xl text-left border transition-all ${
                  activeStage === i 
                    ? "border-sky-500 bg-sky-500/10 text-slate-950 dark:text-white shadow-lg shadow-sky-500/15 ring-2 ring-sky-500/20" 
                    : "bg-white dark:bg-[#0b1723] border-slate-200 dark:border-white/5 text-slate-700 dark:text-[#8fa0ac] hover:border-slate-300 dark:hover:border-white/20 hover:text-slate-950 dark:hover:text-white shadow-xs"
                }`}
              >
                {activeStage === i && (
                  <motion.div
                    layoutId="activeStageTab"
                    className="absolute inset-0 rounded-2xl bg-white dark:bg-sky-500/10 -z-10"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <span className={`text-xs font-mono font-bold uppercase tracking-wider block mb-1 ${activeStage === i ? "text-sky-700 dark:text-sky-400" : "text-slate-500 dark:text-[#627380]"}`}>
                  Stage {i + 1}
                </span>
                <span className="font-extrabold text-base sm:text-lg block leading-snug">{stg.label}</span>
              </button>
            ))}
          </div>

          {/* Active Stage Card */}
          <div className="p-6 sm:p-10 md:p-12 rounded-3xl bg-white dark:bg-[#07131e] border-2 border-sky-500/30 shadow-xl dark:shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <AnimatePresence mode="wait">
              <motion.div 
                key={stages[activeStage].id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.28, ease: "easeOut" }}
                className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-center"
              >
                {/* Left Column: Stage Details */}
                <div className="lg:col-span-7 space-y-5">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-700 dark:text-sky-400 text-xs font-mono font-bold uppercase tracking-wider">
                    {stages[activeStage].tagline}
                  </div>
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-slate-950 dark:text-white leading-tight">
                    &ldquo;{stages[activeStage].dilemma}&rdquo;
                  </h3>

                  <div className="space-y-3 pt-2">
                    {stages[activeStage].outcomes.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-sky-500/20 text-sky-700 dark:text-sky-400 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-4 h-4 stroke-[3]" />
                        </div>
                        <span className="text-base sm:text-lg text-slate-800 dark:text-[#d4dde3] font-semibold leading-snug">{item}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4">
                    <Link 
                      href="/signup" 
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-extrabold text-base sm:text-lg transition-all shadow-lg shadow-sky-500/25 hover:shadow-xl transform hover:-translate-y-0.5 text-center"
                    >
                      Solve Your {stages[activeStage].label} Decision (₹999 Only) →
                    </Link>
                  </div>
                </div>

                {/* Right Column: Stage Persona Photo */}
                <div className="lg:col-span-5 relative">
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-xl group bg-slate-100 dark:bg-black/30">
                    <Image 
                      src={stages[activeStage].image}
                      alt={stages[activeStage].imageAlt}
                      fill
                      className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
                      sizes="(max-width: 1024px) 100vw, 40vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute bottom-3 left-3 right-3 px-3 py-2 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-white flex items-center justify-between">
                      <span className="text-xs font-medium">{stages[activeStage].label}</span>
                      <span className="text-[10px] text-sky-300 font-bold uppercase tracking-wider">{stages[activeStage].badge}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
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
        {/* 6. INSIDE THE 15-PAGE REPORT (VISUAL PROOF)               */}
        {/* ========================================================= */}
        <ScrollDimSection id="inside-report" className="py-24 border-b border-slate-200/80 dark:border-white/5 bg-gradient-to-b from-slate-50 via-slate-100/60 to-slate-50 dark:from-[#061019] dark:via-[#091522] dark:to-[#061019] relative">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
            
            <div className="text-center mb-16 lg:mb-20 relative">
              <span className="absolute -top-12 left-1/2 -translate-x-1/2 text-[110px] sm:text-[160px] md:text-[200px] font-serif font-black text-slate-900/[0.03] dark:text-white/[0.03] pointer-events-none select-none -z-10 leading-none">
                04
              </span>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-600 dark:text-sky-400 text-xs font-semibold uppercase tracking-widest mb-3">
                Transparent Product Breakdown
              </div>
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold mb-3 text-slate-950 dark:text-white tracking-tight">
                Inside Your 15-Page Dossier
              </h2>
              <p className="text-slate-600 dark:text-[#aab7c0] text-base sm:text-lg max-w-xl mx-auto">
                Verified Data • Realistic Salaries • Zero Hype
              </p>
            </div>

            {/* Dossier Preview Showcase (Clean, Auto-Rotating, Non-Scrollable) */}
            <ReportDossierShowcase onZoomPdf={(src) => setZoomImage(src)} />

          </div>
        </ScrollDimSection>

        {/* Wavy Conduit connecting 3-Year Execution Plan into Parent Bridge */}
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 -my-4 relative z-20">
          <ScrollWavyConnector 
            height={240} 
            direction="reverse-s" 
            gradientId="wavy-roadmap-to-parent" 
          />
        </div>


        {/* ========================================================= */}
        {/* 7. THE PARENT & COUNSELLOR BRIDGE                         */}
        {/* ========================================================= */}
        <ScrollDimSection className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 py-16 sm:py-20 border-b border-slate-200/80 dark:border-white/5 overflow-hidden">
          <div className="rounded-3xl p-5 sm:p-10 lg:p-14 bg-gradient-to-r from-sky-50/70 via-white to-slate-50 dark:from-[#0b1723] dark:via-[#0d1d2d] dark:to-[#0b1723] border border-slate-200 dark:border-white/10 shadow-xl dark:shadow-2xl relative overflow-hidden w-full max-w-full min-w-0">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center w-full max-w-full min-w-0">
              <div className="w-full max-w-full min-w-0 lg:col-span-7">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-600 dark:text-sky-400 text-xs font-semibold uppercase tracking-widest mb-4">
                  Bridging The Generational Gap
                </div>
                <h3 className="text-2xl sm:text-4xl font-serif font-bold mb-4 text-slate-900 dark:text-white break-words">
                  Written for the Dinner Table. <br className="hidden sm:inline" />
                  Not an Academic Journal.
                </h3>
                <p className="text-slate-600 dark:text-[#a5b4c0] text-base mb-6 font-medium">
                  Objective data to replace dinner-table arguments with calm conviction.
                </p>

                {/* Interactive Dinner Table Translator */}
                <div className="mt-2 w-full max-w-full min-w-0">
                  <DinnerTableTranslator />
                </div>
              </div>

              {/* Right column: Image */}
              <div className="w-full max-w-full min-w-0 lg:col-span-5 relative">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-2xl group w-full">
                  <Image 
                    src="/images/dinner_table_bridge.jpg"
                    alt="Indian mother and son reviewing career assessment on a tablet together at home"
                    fill
                    className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-3 left-3 right-3 px-3 py-2 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-white flex items-center justify-between">
                    <span className="text-xs font-medium">Calm dinner-table conversations</span>
                    <span className="text-[10px] text-sky-300 font-bold uppercase tracking-wider">No Arguments</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollDimSection>


        {/* Wavy Conduit connecting Parent Bridge into Testimonials */}
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 -my-4 relative z-20">
          <ScrollWavyConnector 
            height={240} 
            direction="s-curve" 
            gradientId="wavy-parent-to-testimonials" 
          />
        </div>

        {/* ========================================================= */}
        {/* 8. REAL STUDENT & PARENT TESTIMONIALS                     */}
        {/* ========================================================= */}
        <ScrollDimSection id="testimonials" className="max-w-[1200px] mx-auto px-4 sm:px-6 py-24 border-b border-slate-200/80 dark:border-white/5 relative">
          <div ref={testimonialsRef}>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-700 dark:text-sky-400 text-xs font-semibold uppercase tracking-widest mb-3">
                ⭐ Real Experiences • Verified Outcomes
              </div>
              <h2 className="text-3xl sm:text-5xl md:text-6xl font-serif font-bold mb-4 text-slate-950 dark:text-white tracking-tight">
                Clarity Replaces Anxiety
              </h2>
              <p className="text-slate-700 dark:text-[#aab7c0] max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
                How students and parents used their WhatAfter dossiers to navigate critical career crossroads.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6 sm:gap-8 items-start">
              {/* Column 1 (Parallaxed on Desktop) */}
              <motion.div style={{ y: isDesktop ? col1Y : 0 }} className="space-y-6">
                {[testimonials[0], testimonials[2]].map((t, idx) => (
                  <motion.div 
                    key={idx} 
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0b1723] border-2 border-slate-200/80 dark:border-white/5 flex flex-col justify-between hover:border-sky-500/40 transition-all hover:shadow-xl dark:hover:shadow-sky-950/20 shadow-sm"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-sky-500/10 text-sky-800 dark:text-sky-300 border border-sky-500/20">
                          {t.tag}
                        </span>
                        <div className="flex text-sky-500 dark:text-sky-400">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-current" />
                          ))}
                        </div>
                      </div>
                      <p className="text-base sm:text-lg text-slate-800 dark:text-[#c8d4dc] leading-relaxed mb-6 italic">
                        &ldquo;{t.quote}&rdquo;
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex items-center gap-4">
                      <div className="relative w-14 h-14 rounded-full overflow-hidden shrink-0 border border-slate-200 dark:border-white/10 ring-2 ring-sky-500/20 shadow-sm">
                        <Image 
                          src={t.avatar} 
                          alt={t.name} 
                          fill 
                          sizes="56px"
                          className="object-cover" 
                        />
                      </div>
                      <div>
                        <span className="text-base font-bold block text-slate-950 dark:text-white">{t.name}</span>
                        <span className="text-sm text-slate-600 dark:text-[#798a97]">{t.role} • {t.location}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Column 2 (Opposite Parallaxed on Desktop) */}
              <motion.div style={{ y: isDesktop ? col2Y : 0 }} className="space-y-6 sm:mt-8">
                {[testimonials[1], testimonials[3]].map((t, idx) => (
                  <motion.div 
                    key={idx} 
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
                    className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0b1723] border-2 border-slate-200/80 dark:border-white/5 flex flex-col justify-between hover:border-sky-500/40 transition-all hover:shadow-xl dark:hover:shadow-sky-950/20 shadow-sm"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-sky-500/10 text-sky-800 dark:text-sky-300 border border-sky-500/20">
                          {t.tag}
                        </span>
                        <div className="flex text-sky-500 dark:text-sky-400">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-current" />
                          ))}
                        </div>
                      </div>
                      <p className="text-base sm:text-lg text-slate-800 dark:text-[#c8d4dc] leading-relaxed mb-6 italic">
                        &ldquo;{t.quote}&rdquo;
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex items-center gap-4">
                      <div className="relative w-14 h-14 rounded-full overflow-hidden shrink-0 border border-slate-200 dark:border-white/10 ring-2 ring-sky-500/20 shadow-sm">
                        <Image 
                          src={t.avatar} 
                          alt={t.name} 
                          fill 
                          sizes="56px"
                          className="object-cover" 
                        />
                      </div>
                      <div>
                        <span className="text-base font-bold block text-slate-950 dark:text-white">{t.name}</span>
                        <span className="text-sm text-slate-600 dark:text-[#798a97]">{t.role} • {t.location}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </ScrollDimSection>


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
        {/* 9. TRANSPARENT PRICING BLOCK (₹999)                       */}
        {/* ========================================================= */}
        <ScrollDimSection id="pricing" className="max-w-[1240px] mx-auto px-4 sm:px-6 py-24 sm:py-32 border-b border-slate-200/80 dark:border-white/5 relative">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 relative">
            <span className="absolute -top-12 left-1/2 -translate-x-1/2 text-[110px] sm:text-[160px] md:text-[200px] font-serif font-black text-slate-900/[0.03] dark:text-white/[0.03] pointer-events-none select-none -z-10 leading-none">
              05
            </span>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-600 dark:text-sky-400 text-xs font-semibold uppercase tracking-widest mb-3">
              One-Time Investment • Zero Recurring Subscriptions
            </div>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold mb-4 text-slate-950 dark:text-white tracking-tight">
              Your Complete Career Intelligence Dossier
            </h2>
            <p className="text-base sm:text-lg text-slate-600 dark:text-[#aab7c0] max-w-2xl mx-auto leading-relaxed">
              One assessment. A decision framework you can return to for years.
            </p>
          </div>

          {/* PRICING & OFFER CARD */}
          <div className="max-w-xl mx-auto">
            <div className="p-8 sm:p-10 border-2 border-sky-500/50 rounded-3xl bg-white dark:bg-[#07131e] relative shadow-2xl dark:shadow-sky-950/40">
              
              <div className="absolute top-0 right-8 -translate-y-1/2 px-4 py-1.5 bg-sky-500 text-slate-950 text-xs font-mono font-black rounded-full uppercase tracking-wider shadow-md">
                Launch Offer • 60% Off
              </div>

              <div className="mb-6">
                <span className="text-xs font-mono uppercase tracking-wider text-sky-700 dark:text-sky-400 font-bold block mb-1">
                  Complete Intelligence Package
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-slate-950 dark:text-white">
                  Career Intelligence Dossier
                </h3>
                <p className="text-sm text-slate-600 dark:text-[#95a2ac] mt-1.5 font-medium">
                  Immediate access to 80-scenario evaluation + 15-page dossier
                </p>
              </div>

              {/* Price Display */}
              <div className="flex items-baseline gap-3 mb-6 pb-6 border-b border-slate-200 dark:border-white/10">
                <span className="text-5xl sm:text-6xl font-serif font-black text-slate-950 dark:text-white">
                  ₹999
                </span>
                <div className="flex flex-col">
                  <span className="text-base text-slate-400 dark:text-slate-500 line-through">₹2,499</span>
                  <span className="text-xs font-mono font-bold text-sky-700 dark:text-sky-400">One-Time Fee • No Upsells</span>
                </div>
              </div>

              {/* What You Receive */}
              <span className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold block mb-3.5">
                Everything Included in Your ₹999 Access:
              </span>
              <ul className="space-y-3.5 mb-8 text-sm sm:text-base text-slate-800 dark:text-[#d2dce3]">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-sky-600 dark:text-sky-400 shrink-0" />
                  <span><b>80-Scenario Evaluation</b> in English &amp; हिंदी</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-sky-600 dark:text-sky-400 shrink-0" />
                  <span><b>35-Trait Cognitive &amp; Values Radar</b> graph</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-sky-600 dark:text-sky-400 shrink-0" />
                  <span><b>Top 5 Ranked Careers</b> with verified Indian salaries</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-sky-600 dark:text-sky-400 shrink-0" />
                  <span><b>AI-Resilience Index</b> (Protected vs automated roles)</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-sky-600 dark:text-sky-400 shrink-0" />
                  <span><b>Career Eliminations</b> (What NOT to choose)</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-sky-600 dark:text-sky-400 shrink-0" />
                  <span><b>3-Year Milestone Roadmap</b> (1m, 6m, 1y, 3y actions)</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-sky-600 dark:text-sky-400 shrink-0" />
                  <span><b>Parent Discussion Guide</b> for calm dinner tables</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-sky-600 dark:text-sky-400 shrink-0" />
                  <span><b>Downloadable 15-Page PDF</b> + Lifetime Dashboard</span>
                </li>
              </ul>

              {/* CTA */}
              <Link 
                href="/signup" 
                className="block w-full py-4 sm:py-4.5 text-center rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-base sm:text-lg font-black transition-all shadow-lg shadow-sky-500/25 active:scale-[0.99]"
              >
                Start Assessment — ₹999 Only →
              </Link>

              <div className="mt-4 pt-3.5 border-t border-slate-200 dark:border-white/5 flex items-center justify-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-mono">
                <span>🔒 256-Bit SSL</span>
                <span>•</span>
                <span>⚡ Instant Access</span>
                <span>•</span>
                <span>♾️ Lifetime Validity</span>
              </div>

            </div>
          </div>

        </ScrollDimSection>


        {/* ========================================================= */}
        {/* 10. FREQUENTLY ASKED QUESTIONS (FAQ)                      */}
        {/* ========================================================= */}
        <ScrollDimSection id="faqs" className="max-w-[850px] mx-auto px-4 sm:px-6 py-24 border-b border-slate-200/80 dark:border-white/5 relative">
          <div className="text-center mb-14 relative">
            <span className="absolute -top-12 left-1/2 -translate-x-1/2 text-[110px] sm:text-[160px] md:text-[200px] font-serif font-black text-slate-900/[0.03] dark:text-white/[0.03] pointer-events-none select-none -z-10 leading-none">
              06
            </span>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-600 dark:text-sky-400 text-xs font-semibold uppercase tracking-widest mb-3">
              Clear Answers
            </div>
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-4 text-slate-950 dark:text-white">Frequently Asked Questions</h2>
            <p className="text-slate-600 dark:text-[#aab7c0]">Everything you need to know about the assessment and report.</p>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-slate-200 dark:border-white/5 rounded-xl overflow-hidden bg-white dark:bg-[#0b1723]/80 transition-colors shadow-sm">
                <button 
                  onClick={() => toggleFaq(i)}
                  className="w-full text-left px-5 sm:px-6 py-5 flex items-center justify-between font-bold text-base sm:text-lg hover:bg-slate-50 dark:hover:bg-white/5 text-slate-900 dark:text-white transition-colors"
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
                <AnimatePresence initial={false}>
                  {openFaq === i && (
                    <motion.div
                      key="faq-content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 sm:px-6 pb-6 text-base text-slate-700 dark:text-[#9ab0bf] leading-relaxed border-t border-slate-100 dark:border-white/5 pt-4">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </ScrollDimSection>


        {/* ========================================================= */}
        {/* 11. FINAL HIGH-IMPACT CTA                                 */}
        {/* ========================================================= */}
        <ScrollDimSection className="max-w-[1200px] mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="rounded-3xl p-8 sm:p-12 md:p-16 text-center bg-white dark:bg-[#07131e] border-2 border-sky-500/40 relative overflow-hidden shadow-2xl">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/25 text-sky-700 dark:text-sky-400 text-xs sm:text-sm font-bold uppercase tracking-wider mb-5">
              <span>🎯</span> 35 Years of Work Life • One Decision
            </div>
            
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-serif font-bold tracking-tight mb-5 max-w-3xl mx-auto text-slate-950 dark:text-white leading-tight">
              Don&apos;t spend the next 35 years wondering &ldquo;What If?&rdquo;
            </h2>
            <p className="text-slate-700 dark:text-[#aab7c0] text-base sm:text-xl max-w-2xl mx-auto mb-8 leading-relaxed font-medium">
              Take the decision with verified data today. Protect your time, finances, and sanity for just ₹999.
            </p>
            <Link 
              href="/signup" 
              className="inline-flex items-center justify-center px-9 py-4.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-base sm:text-lg font-black transition-all shadow-xl shadow-sky-500/25 transform hover:-translate-y-0.5"
            >
              Get Career Certainty Today (₹999 Only) →
            </Link>
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
                <li><a href="#stages" onClick={() => setActiveStage(0)} className="hover:text-sky-600 dark:hover:text-sky-300 transition-colors">After Class 8</a></li>
                <li><a href="#stages" onClick={() => setActiveStage(1)} className="hover:text-sky-600 dark:hover:text-sky-300 transition-colors">After 10th</a></li>
                <li><a href="#stages" onClick={() => setActiveStage(2)} className="hover:text-sky-600 dark:hover:text-sky-300 transition-colors">After 12th</a></li>
                <li><a href="#stages" onClick={() => setActiveStage(3)} className="hover:text-sky-600 dark:hover:text-sky-300 transition-colors">After College</a></li>
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
