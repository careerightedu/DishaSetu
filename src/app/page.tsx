"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  ArrowRight, 
  Compass, 
  ChevronDown, 
  ChevronUp, 
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
  X
} from "lucide-react";
import Navbar from "@/features/auth/components/Navbar";
import { INITIAL_BLOG_POSTS } from "@/lib/blogs";

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeStage, setActiveStage] = useState<number>(1);
  const [previewTab, setPreviewTab] = useState<"fingerprint" | "deepdive" | "plan">("fingerprint");
  const [zoomImage, setZoomImage] = useState<string | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const stages = [
    {
      id: "class-8",
      label: "Class 8 & 9",
      tagline: "Subject Discovery & Foundational Aptitude",
      dilemma: "Which optional subjects should I choose before entering high school?",
      solution: "Uncovers foundational cognitive aptitudes (numerical, spatial, logical, verbal) and learning styles early, preventing misinformed subject selection.",
      outcomes: [
        "Identifies natural learning style (e.g., Build-to-Learn vs Theory-first)",
        "Maps subject affinity to long-term career viability",
        "Builds academic confidence without high-stakes pressure"
      ],
      image: "/stages/stage_class_8.jpg",
      imageAlt: "Class 8 student exploring hands-on science and foundational aptitude at home",
      badge: "Foundational Aptitude"
    },
    {
      id: "class-10",
      label: "After 10th",
      tagline: "Stream Selection Without Peer Pressure",
      dilemma: "Science, Commerce, or Humanities? How do I choose based on data, not hearsay?",
      solution: "De-biases the stream decision by analyzing 35 cognitive and work value traits, ensuring the student chooses a path aligned with their future work environment preferences.",
      outcomes: [
        "Evidence-backed Stream Selection Matrix (PCM vs PCB vs Commerce vs Arts)",
        "Shows clash points (e.g., high artistic drive vs rigid rote systems)",
        "Includes a Parent Discussion Guide to prevent dinner-table conflict"
      ],
      image: "/stages/stage_class_10.jpg",
      imageAlt: "Class 10 student making a calm, data-backed stream choice with reference books",
      badge: "Stream Matrix"
    },
    {
      id: "class-12",
      label: "After 12th",
      tagline: "Degrees, Entrance Exams & College Majors",
      dilemma: "Which degree and major will actually give me high market demand and AI-resilience?",
      solution: "Ranks top college majors and entrance exam strategies based on salary trajectories, AI automation vulnerability, and true cognitive fit.",
      outcomes: [
        "Expected entry vs senior salary ranges (e.g., ₹12–25 LPA vs ₹40–80 LPA)",
        "AI-Resilience scores (75–85/100) highlighting human moats in each field",
        "Backup educational pathways (e.g., certifications, specialized bootcamps)"
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
      solution: "Provides a sequenced, costed execution plan detailing exact projects, skill bridges, and internship timelines for high-growth tech and business domains.",
      outcomes: [
        "1-Month, 6-Month, 1-Year, and 3-Year sequenced execution roadmap",
        "Clear skill gap closures ('Do This First' action missions)",
        "Career eliminations explaining why certain traditional paths waste time"
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
    <div className="min-h-screen bg-slate-50 dark:bg-[#061019] text-slate-900 dark:text-[#f4efe6] font-sans selection:bg-emerald-500/30 selection:text-emerald-900 dark:selection:text-emerald-200 transition-colors duration-200">
      <Navbar />

      <main className="overflow-hidden">
        
        {/* ========================================================= */}
        {/* 1. HERO SECTION                                           */}
        {/* ========================================================= */}
        <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 border-b border-slate-200/80 dark:border-white/5">
          {/* Ambient background glow */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
          
          <div className="max-w-[1200px] mx-auto px-6 relative z-10 flex flex-col items-center text-center">
            
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 text-xs font-semibold tracking-wide mb-8 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
              <span>AI-Powered Career Intelligence • Class 8 to College</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-bold leading-[1.12] tracking-tight mb-6 max-w-4xl text-slate-950 dark:text-white">
              Stop guessing your future. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-500 dark:from-emerald-400 dark:via-teal-300 dark:to-emerald-200">
                Discover what comes next.
              </span>
            </h1>

            {/* Sub-headline */}
            <p className="text-slate-600 dark:text-[#aab7c0] text-lg md:text-xl max-w-2xl leading-relaxed mb-10 font-normal">
              Not another generic personality quiz. WhatAfter measures 35 cognitive traits and work values across 80 thoughtful scenarios to deliver a sequenced, AI-resilient career roadmap.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <Link 
                href="/signup" 
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-xl bg-emerald-400 text-[#03110f] text-base font-bold hover:bg-emerald-300 transition-all shadow-[0_0_30px_rgba(16,185,129,0.25)] hover:shadow-[0_0_40px_rgba(16,185,129,0.35)] transform hover:-translate-y-0.5"
              >
                Take the Assessment <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
              
              <a 
                href="#inside-report" 
                className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-4 rounded-xl bg-white hover:bg-slate-100 dark:bg-white/5 dark:hover:bg-white/10 text-slate-800 dark:text-white text-base font-medium border border-slate-300 dark:border-white/10 transition-colors shadow-sm"
              >
                View Sample Report ↓
              </a>
            </div>

            {/* Social Proof Avatar Strip */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <div className="flex -space-x-2.5 overflow-hidden">
                <div className="relative inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-[#061019] overflow-hidden shadow-sm">
                  <Image src="/testimonials/aarav.jpg" alt="Aarav" fill className="object-cover" sizes="32px" />
                </div>
                <div className="relative inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-[#061019] overflow-hidden shadow-sm">
                  <Image src="/testimonials/ananya.jpg" alt="Ananya" fill className="object-cover" sizes="32px" />
                </div>
                <div className="relative inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-[#061019] overflow-hidden shadow-sm">
                  <Image src="/testimonials/rohan.jpg" alt="Rohan" fill className="object-cover" sizes="32px" />
                </div>
                <div className="relative inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-[#061019] overflow-hidden shadow-sm">
                  <Image src="/testimonials/verma_parents.jpg" alt="Parents" fill className="object-cover" sizes="32px" />
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="flex text-amber-500">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                </div>
                <span className="font-bold text-slate-800 dark:text-white">4.9/5</span>
                <span className="text-slate-500 dark:text-[#8899a6]">• Trusted by 10,000+ students &amp; parents across India</span>
              </div>
            </div>

            {/* Micro-trust indicators */}
            <div className="mt-5 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 dark:text-[#7d8e9c]">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" /> 80 Thoughtful Scenarios
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" /> Available in English &amp; Hindi (हिंदी)
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" /> 15-Page Intelligence Dossier
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" /> Zero Generic Advice
              </span>
            </div>

            {/* ========================================================= */}
            {/* 2. HERO VISUAL SHOWCASE (Interactive Report Preview)      */}
            {/* ========================================================= */}
            <div className="mt-14 w-full max-w-5xl rounded-2xl border border-slate-200 dark:border-white/10 bg-white/95 dark:bg-[#0b1723]/90 shadow-xl dark:shadow-2xl overflow-hidden backdrop-blur-sm p-4 sm:p-6 text-left">
              {/* Report Tab Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-white/10">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="text-xs text-slate-500 dark:text-[#8da0ad] font-mono">
                    Career Intelligence Report • Confidential 2026
                  </span>
                </div>

                {/* Preview Selector Tabs */}
                <div className="flex items-center gap-2 bg-slate-100 dark:bg-[#061019] p-1 rounded-lg border border-slate-200 dark:border-white/5">
                  <button 
                    onClick={() => setPreviewTab("fingerprint")}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                      previewTab === "fingerprint" 
                        ? "bg-white dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-slate-200 dark:border-emerald-500/30 shadow-sm" 
                        : "text-slate-600 dark:text-[#8da0ad] hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    1. Cognitive Fingerprint
                  </button>
                  <button 
                    onClick={() => setPreviewTab("deepdive")}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                      previewTab === "deepdive" 
                        ? "bg-white dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-slate-200 dark:border-emerald-500/30 shadow-sm" 
                        : "text-slate-600 dark:text-[#8da0ad] hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    2. Career Deep-Dive
                  </button>
                  <button 
                    onClick={() => setPreviewTab("plan")}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                      previewTab === "plan" 
                        ? "bg-white dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-slate-200 dark:border-emerald-500/30 shadow-sm" 
                        : "text-slate-600 dark:text-[#8da0ad] hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    3. Sequenced Roadmap
                  </button>
                </div>
              </div>

              {/* Preview Image Container */}
              <div 
                onClick={() => {
                  if (previewTab === "fingerprint") setZoomImage("/report/cognitive-fingerprint.png");
                  if (previewTab === "deepdive") setZoomImage("/report/career-deep-dive.png");
                  if (previewTab === "plan") setZoomImage("/report/execution-plan.png");
                }}
                className="mt-4 relative h-[380px] sm:h-[480px] lg:h-[520px] w-full rounded-xl overflow-hidden bg-slate-100 dark:bg-[#061019] border border-slate-200 dark:border-white/10 group cursor-zoom-in"
              >
                {previewTab === "fingerprint" && (
                  <div className="relative w-full h-full">
                    <Image 
                      src="/report/cognitive-fingerprint.png" 
                      alt="Cognitive Fingerprint and Trait Radar Preview" 
                      fill 
                      unoptimized
                      quality={100}
                      className="object-contain object-top transition-transform duration-300 group-hover:scale-[1.01]"
                      priority
                    />
                  </div>
                )}
                {previewTab === "deepdive" && (
                  <div className="relative w-full h-full">
                    <Image 
                      src="/report/career-deep-dive.png" 
                      alt="Career Deep-Dive and Salary Projections Preview" 
                      fill 
                      unoptimized
                      quality={100}
                      className="object-contain object-top transition-transform duration-300 group-hover:scale-[1.01]"
                    />
                  </div>
                )}
                {previewTab === "plan" && (
                  <div className="relative w-full h-full">
                    <Image 
                      src="/report/execution-plan.png" 
                      alt="Execution Plan Timeline and Milestone Missions Preview" 
                      fill 
                      unoptimized
                      quality={100}
                      className="object-contain object-top transition-transform duration-300 group-hover:scale-[1.01]"
                    />
                  </div>
                )}

                {/* Hover to Zoom Pill */}
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/60 border border-white/10 text-slate-300 text-[11px] font-medium backdrop-blur-md flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                  <ZoomIn className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Click to expand</span>
                </div>

                {/* Interactive Overlaid Badges */}
                <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2 pointer-events-none">
                  <div className="px-3 py-1 rounded-md bg-white/95 dark:bg-[#061019]/90 border border-emerald-500/40 text-emerald-800 dark:text-emerald-400 text-[11px] font-semibold backdrop-blur-md shadow-sm">
                    ✓ 35-Trait Psychological Model
                  </div>
                  <div className="px-3 py-1 rounded-md bg-white/95 dark:bg-[#061019]/90 border border-teal-500/40 text-teal-800 dark:text-teal-300 text-[11px] font-semibold backdrop-blur-md shadow-sm">
                    ✓ Entry to Senior Salaries: ₹12–80 LPA
                  </div>
                  <div className="px-3 py-1 rounded-md bg-white/95 dark:bg-[#061019]/90 border border-amber-500/40 text-amber-800 dark:text-amber-300 text-[11px] font-semibold backdrop-blur-md shadow-sm">
                    ✓ AI-Resilience: 75–85/100
                  </div>
                </div>
              </div>

            </div>

          </div>
        </section>


        {/* ========================================================= */}
        {/* 3. PROOF & CREDIBILITY METRICS STRIP                      */}
        {/* ========================================================= */}
        <div className="border-b border-slate-200/80 dark:border-white/5 py-10 bg-slate-100/70 dark:bg-[#08131d]/60">
          <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="border-r border-slate-200 dark:border-white/5 last:border-none">
              <span className="text-3xl sm:text-4xl font-serif font-bold block mb-1 text-emerald-600 dark:text-emerald-400">80</span>
              <span className="text-[11px] text-slate-600 dark:text-[#7d8c97] uppercase tracking-wider font-semibold">Thoughtful Scenarios</span>
            </div>
            <div className="border-r border-slate-200 dark:border-white/5 last:border-none">
              <span className="text-3xl sm:text-4xl font-serif font-bold block mb-1 text-emerald-600 dark:text-emerald-400">35</span>
              <span className="text-[11px] text-slate-600 dark:text-[#7d8c97] uppercase tracking-wider font-semibold">Cognitive & Value Traits</span>
            </div>
            <div className="border-r border-slate-200 dark:border-white/5 last:border-none">
              <span className="text-3xl sm:text-4xl font-serif font-bold block mb-1 text-emerald-600 dark:text-emerald-400">5</span>
              <span className="text-[11px] text-slate-600 dark:text-[#7d8c97] uppercase tracking-wider font-semibold">Curated Deep-Dives</span>
            </div>
            <div>
              <span className="text-3xl sm:text-4xl font-serif font-bold block mb-1 text-emerald-600 dark:text-emerald-400">3-Yr</span>
              <span className="text-[11px] text-slate-600 dark:text-[#7d8c97] uppercase tracking-wider font-semibold">Sequenced Roadmap</span>
            </div>
          </div>
        </div>


        {/* ========================================================= */}
        {/* 4. THE 4 LIFE STAGES ("WHAT AFTER?")                      */}
        {/* ========================================================= */}
        <section id="stages" className="max-w-[1200px] mx-auto px-6 py-24 border-b border-slate-200/80 dark:border-white/5">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold uppercase tracking-widest mb-3">
              The Life-Stage Decision Engine
            </div>
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-4 text-slate-950 dark:text-white">
              The Question Changes at Every Stage. <br className="hidden sm:inline" />
              So Does WhatAfter.
            </h2>
            <p className="text-slate-600 dark:text-[#aab7c0] max-w-2xl mx-auto text-base">
              A Class 8 student needs foundational aptitude clarity. A college engineer needs a high-yield specialization roadmap. Select your current crossroads:
            </p>
          </div>

          {/* Stage Selector Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
            {stages.map((stg, i) => (
              <button
                key={stg.id}
                onClick={() => setActiveStage(i)}
                className={`p-4 rounded-xl text-left border transition-all ${
                  activeStage === i 
                    ? "bg-white dark:bg-emerald-500/10 border-emerald-500 text-slate-950 dark:text-white shadow-lg shadow-emerald-500/10" 
                    : "bg-white dark:bg-[#0b1723] border-slate-200 dark:border-white/5 text-slate-600 dark:text-[#8fa0ac] hover:border-slate-300 dark:hover:border-white/20 hover:text-slate-950 dark:hover:text-white shadow-sm"
                }`}
              >
                <span className={`text-[10px] font-bold uppercase tracking-wider block mb-1 ${activeStage === i ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400 dark:text-[#627380]"}`}>
                  Stage {i + 1}
                </span>
                <span className="font-bold text-sm sm:text-base block">{stg.label}</span>
              </button>
            ))}
          </div>

          {/* Active Stage Card */}
          <div className="p-8 sm:p-10 rounded-2xl bg-gradient-to-br from-emerald-50/60 via-white to-slate-50 dark:from-[#0c1926] dark:to-[#08121c] border border-emerald-500/30 shadow-xl dark:shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-center">
              {/* Left Column: Stage Details */}
              <div className="lg:col-span-7">
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block mb-2">
                  {stages[activeStage].tagline}
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold mb-4 text-slate-900 dark:text-white">
                  &ldquo;{stages[activeStage].dilemma}&rdquo;
                </h3>
                <p className="text-slate-600 dark:text-[#9cb0be] text-base leading-relaxed mb-8">
                  {stages[activeStage].solution}
                </p>

                <div className="space-y-3 mb-8">
                  {stages[activeStage].outcomes.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span className="text-sm text-slate-700 dark:text-[#d4dde3] font-medium">{item}</span>
                    </div>
                  ))}
                </div>

                <Link 
                  href="/signup" 
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-emerald-400 text-black font-bold text-sm hover:bg-emerald-300 transition-colors shadow-md shadow-emerald-500/20"
                >
                  Solve Your {stages[activeStage].label} Decision <ArrowRight className="w-4 h-4" />
                </Link>
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
                    <span className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider">{stages[activeStage].badge}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* ========================================================= */}
        {/* 5. HOW IT WORKS                                           */}
        {/* ========================================================= */}
        <section id="how-it-works" className="max-w-[1200px] mx-auto px-6 py-24 border-b border-slate-200/80 dark:border-white/5">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold uppercase tracking-widest mb-3">
              Methodology
            </div>
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-4 text-slate-950 dark:text-white">How WhatAfter Works</h2>
            <p className="text-slate-600 dark:text-[#aab7c0] max-w-2xl mx-auto">
              From confusing career noise to an objective, sequenced career plan in three structured steps.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="p-8 rounded-2xl bg-white dark:bg-[#0b1723] border border-slate-200/80 dark:border-white/5 hover:border-emerald-500/30 transition-all flex flex-col justify-between shadow-sm">
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-6">
                  <BrainCircuit className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider block mb-2">Step 01</span>
                <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Signal Capture</h3>
                <p className="text-sm text-slate-600 dark:text-[#929fa9] leading-relaxed">
                  Respond to 80 scenario-based questions in your choice of language — fully available in both English and Hindi (हिंदी). Designed to assess how you think, how you handle ambiguity, and what you actually value — without any artificial timer or rush.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/5 text-xs text-slate-500 dark:text-[#6e808e] flex items-center justify-between">
                <span>✓ Measures 35 Traits</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">English &amp; हिंदी</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-8 rounded-2xl bg-white dark:bg-[#0b1723] border border-slate-200/80 dark:border-white/5 hover:border-emerald-500/30 transition-all flex flex-col justify-between shadow-sm">
              <div>
                <div className="w-12 h-12 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-6">
                  <Target className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-mono text-teal-600 dark:text-teal-400 font-bold uppercase tracking-wider block mb-2">Step 02</span>
                <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Cognitive Modeling</h3>
                <p className="text-sm text-slate-600 dark:text-[#929fa9] leading-relaxed">
                  Our proprietary intelligence engine overlays your Core Aptitudes on your Work Values, calculating salary trajectories, market demand, and AI-resilience scores against thousands of active industry roles.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/5 text-xs text-slate-500 dark:text-[#6e808e]">
                ✓ AI Automation Resilience Scored
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-8 rounded-2xl bg-white dark:bg-[#0b1723] border border-slate-200/80 dark:border-white/5 hover:border-emerald-500/30 transition-all flex flex-col justify-between shadow-sm">
              <div>
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-6">
                  <Route className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-mono text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wider block mb-2">Step 03</span>
                <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Sequenced Execution</h3>
                <p className="text-sm text-slate-600 dark:text-[#929fa9] leading-relaxed">
                  Receive an exhaustive 15-page dossier including top recommendations, careers eliminated with clash reasons, a 3-year phased timeline, and a dedicated guide for parents and mentors.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/5 text-xs text-slate-500 dark:text-[#6e808e]">
                ✓ 15-Page PDF + Parent Guide
              </div>
            </div>
          </div>
        </section>


        {/* ========================================================= */}
        {/* 6. INSIDE THE 15-PAGE REPORT (VISUAL PROOF)               */}
        {/* ========================================================= */}
        <section id="inside-report" className="py-24 border-b border-slate-200/80 dark:border-white/5 bg-gradient-to-b from-slate-50 via-slate-100/60 to-slate-50 dark:from-[#061019] dark:via-[#091522] dark:to-[#061019]">
          <div className="max-w-[1200px] mx-auto px-6">
            
            <div className="text-center mb-20">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold uppercase tracking-widest mb-3">
                Transparent Product Breakdown
              </div>
              <h2 className="text-3xl md:text-5xl font-serif font-bold mb-4 text-slate-950 dark:text-white">Inside Your Career Intelligence Report</h2>
              <p className="text-slate-600 dark:text-[#aab7c0] max-w-2xl mx-auto">
                No generic 2-paragraph summaries. Every student receives a 15-page data-backed intelligence dossier. Here is exactly what you get:
              </p>
            </div>

            <div className="space-y-24">

              {/* Feature 1: Cognitive Fingerprint */}
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div 
                  onClick={() => setZoomImage("/report/cognitive-fingerprint.png")}
                  className="order-2 md:order-1 relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 dark:bg-[#061019] border border-slate-200 dark:border-white/10 shadow-xl group cursor-zoom-in"
                >
                  <Image 
                    src="/report/cognitive-fingerprint.png" 
                    alt="Cognitive Fingerprint and Trait Radar" 
                    fill 
                    unoptimized
                    quality={100}
                    className="object-contain p-2 transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/60 border border-white/10 text-slate-300 text-[11px] font-medium backdrop-blur-md flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ZoomIn className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Expand</span>
                  </div>
                </div>
                <div className="order-1 md:order-2">
                  <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider block mb-2">Report Page 03</span>
                  <h3 className="text-2xl sm:text-3xl font-serif font-bold mb-4 text-slate-900 dark:text-white">Your Cognitive Fingerprint</h3>
                  <p className="text-slate-600 dark:text-[#95a2ac] mb-6 leading-relaxed">
                    Before we discuss careers, we map who you are. The 35-trait radar displays your Core Aptitudes (Logical, Numerical, Spatial, Verbal, Creative) overlaid directly against your Work Values (Autonomy, Wealth, Balance, Impact, Security).
                  </p>
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 text-sm text-slate-700 dark:text-[#ccd7df] shadow-sm">
                      <b className="text-slate-900 dark:text-white block mb-0.5">Cognitive Style (e.g., Analytical–Divergent):</b>
                      Can imagine bold possibilities and map the technical path to realize them.
                    </div>
                    <div className="p-3 rounded-lg bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 text-sm text-slate-700 dark:text-[#ccd7df] shadow-sm">
                      <b className="text-slate-900 dark:text-white block mb-0.5">Learning Style (e.g., Build-to-Learn):</b>
                      Visual-Kinesthetic learner who thrives through prototyping and technical feedback.
                    </div>
                  </div>
                </div>
              </div>

              {/* Feature 2: Career Deep-Dive & Salary / AI Resilience */}
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <span className="text-xs font-mono text-teal-600 dark:text-teal-400 font-bold uppercase tracking-wider block mb-2">Report Pages 06–10</span>
                  <h3 className="text-2xl sm:text-3xl font-serif font-bold mb-4 text-slate-900 dark:text-white">Deep Dives with Salary &amp; AI-Resilience</h3>
                  <p className="text-slate-600 dark:text-[#95a2ac] mb-6 leading-relaxed">
                    Every top recommended career is scrutinized through rigorous labor market criteria, removing speculation and replacing it with grounded expectations.
                  </p>
                  <ul className="space-y-3.5 text-sm text-slate-700 dark:text-[#aab7c0]">
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <span><b className="text-slate-900 dark:text-white">Expected Salary Trajectories:</b> Clear benchmark ranges for Entry Level (e.g. ₹12–25 LPA) versus Senior Architect/Director (₹40–80 LPA).</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <span><b className="text-slate-900 dark:text-white">AI-Resilience Index (e.g. 75–85/100):</b> Explains why high-level system architecture and human-centric design protect this role from pure AI automation.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <span><b className="text-slate-900 dark:text-white">Day-in-the-Life &amp; Challenges:</b> Realistic daily tasks, things you&apos;ll love, and potential burnout friction points.</span>
                    </li>
                  </ul>
                </div>
                <div 
                  onClick={() => setZoomImage("/report/career-deep-dive.png")}
                  className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 dark:bg-[#061019] border border-slate-200 dark:border-white/10 shadow-xl group cursor-zoom-in"
                >
                  <Image 
                    src="/report/career-deep-dive.png" 
                    alt="Career Deep-Dive and Salary Trajectories" 
                    fill 
                    unoptimized
                    quality={100}
                    className="object-contain p-2 transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/60 border border-white/10 text-slate-300 text-[11px] font-medium backdrop-blur-md flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ZoomIn className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Expand</span>
                  </div>
                </div>
              </div>

              {/* Feature 3: Execution Plan & What We Eliminated */}
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div 
                  onClick={() => setZoomImage("/report/execution-plan.png")}
                  className="order-2 md:order-1 relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 dark:bg-[#061019] border border-slate-200 dark:border-white/10 shadow-xl group cursor-zoom-in"
                >
                  <Image 
                    src="/report/execution-plan.png" 
                    alt="Execution Plan Timeline and Milestones" 
                    fill 
                    unoptimized
                    quality={100}
                    className="object-contain p-2 transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/60 border border-white/10 text-slate-300 text-[11px] font-medium backdrop-blur-md flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ZoomIn className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Expand</span>
                  </div>
                </div>
                <div className="order-1 md:order-2">
                  <span className="text-xs font-mono text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wider block mb-2">Report Pages 11 &amp; 13</span>
                  <h3 className="text-2xl sm:text-3xl font-serif font-bold mb-4 text-slate-900 dark:text-white">Sequenced Execution Plan + Eliminations</h3>
                  <p className="text-slate-600 dark:text-[#95a2ac] mb-6 leading-relaxed">
                    A report without next steps is just entertainment. WhatAfter sequences your next 3 years and clearly outlines what careers to actively avoid.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-white dark:bg-[#0e1b28] border border-slate-200 dark:border-white/5 shadow-sm">
                      <b className="text-slate-900 dark:text-white text-sm block mb-1">Timeline Roadmaps (1 Month, 6 Months, 1 Year, 3 Years):</b>
                      <p className="text-xs text-slate-600 dark:text-[#95a3b0]">
                        Actionable milestones like auditing a Design Thinking course, securing target internships, and building high-leverage portfolios.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-500/20 shadow-sm">
                      <b className="text-red-700 dark:text-red-300 text-sm flex items-center gap-1.5 mb-1">
                        <XCircle className="w-4 h-4 text-red-500 dark:text-red-400" /> Career Eliminations:
                      </b>
                      <p className="text-xs text-red-900/80 dark:text-[#b8a2a2]">
                        Explicitly details why high-profile paths (e.g. CA, Medical Doctor, or Corporate Law) clash with your profile, saving years of costly misdirection.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </section>


        {/* ========================================================= */}
        {/* 7. THE PARENT & COUNSELLOR BRIDGE                         */}
        {/* ========================================================= */}
        <section className="max-w-[1200px] mx-auto px-6 py-20 border-b border-slate-200/80 dark:border-white/5">
          <div className="rounded-3xl p-8 sm:p-12 lg:p-14 bg-gradient-to-r from-emerald-50/70 via-white to-slate-50 dark:from-[#0b1723] dark:via-[#0d1d2d] dark:to-[#0b1723] border border-slate-200 dark:border-white/10 shadow-xl dark:shadow-2xl relative overflow-hidden">
            <div className="grid lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-7">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold uppercase tracking-widest mb-4">
                  Bridging The Generational Gap
                </div>
                <h3 className="text-2xl sm:text-4xl font-serif font-bold mb-4 text-slate-900 dark:text-white">
                  Written for the Dinner Table. <br />
                  Not an Academic Journal.
                </h3>
                <p className="text-slate-600 dark:text-[#a5b4c0] text-base leading-relaxed mb-8">
                  Most career advice turns into arguments between parents and students. WhatAfter includes two dedicated tools: <b>&ldquo;In Plain Words&rdquo;</b> (a one-page conversational letter) and the <b>&ldquo;Guide for Parents &amp; Counsellors&rdquo;</b> with specific conversation starters.
                </p>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-white dark:bg-black/30 border border-slate-200/80 dark:border-white/5 shadow-sm">
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 block mb-1">✓ Constructive Reflection</span>
                    <p className="text-xs text-slate-600 dark:text-[#95a3ad]">
                      &ldquo;How can we blend your technical degree with your passion for design to create a unique career moat?&rdquo;
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-white dark:bg-black/30 border border-slate-200/80 dark:border-white/5 shadow-sm">
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 block mb-1">✓ Financial &amp; Value Alignment</span>
                    <p className="text-xs text-slate-600 dark:text-[#95a3ad]">
                      &ldquo;What does a successful balance between high wealth aspirations and social impact look like for you?&rdquo;
                    </p>
                  </div>
                </div>
              </div>

              {/* Right column: Image */}
              <div className="lg:col-span-5 relative">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-2xl group">
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
                    <span className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider">No Arguments</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* ========================================================= */}
        {/* 8. REAL STUDENT & PARENT TESTIMONIALS                     */}
        {/* ========================================================= */}
        <section className="max-w-[1200px] mx-auto px-6 py-24 border-b border-slate-200/80 dark:border-white/5">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold uppercase tracking-widest mb-3">
              Real Experiences
            </div>
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-4 text-slate-950 dark:text-white">Clarity Replaces Anxiety</h2>
            <p className="text-slate-600 dark:text-[#aab7c0] max-w-2xl mx-auto">
              How students and parents used their WhatAfter dossiers to navigate critical career crossroads.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {testimonials.map((t, idx) => (
              <div key={idx} className="p-8 rounded-2xl bg-white dark:bg-[#0b1723] border border-slate-200/80 dark:border-white/5 flex flex-col justify-between hover:border-emerald-500/30 transition-colors shadow-sm">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                      {t.tag}
                    </span>
                    <div className="flex text-emerald-500 dark:text-emerald-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-slate-700 dark:text-[#c8d4dc] leading-relaxed mb-6 italic">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex items-center gap-3.5">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 border border-slate-200 dark:border-white/10 ring-2 ring-emerald-500/20 shadow-sm">
                    <Image 
                      src={t.avatar} 
                      alt={t.name} 
                      fill 
                      sizes="48px"
                      className="object-cover" 
                    />
                  </div>
                  <div>
                    <span className="text-sm font-bold block text-slate-900 dark:text-white">{t.name}</span>
                    <span className="text-xs text-slate-500 dark:text-[#798a97]">{t.role} • {t.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>


        {/* ========================================================= */}
        {/* 8.5 WHATAFTER JOURNAL / LATEST BLOGS                      */}
        {/* ========================================================= */}
        <section id="journal" className="max-w-[1200px] mx-auto px-6 py-24 border-b border-slate-200/80 dark:border-white/5">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold uppercase tracking-widest mb-3">
                <BookOpen className="w-3.5 h-3.5" /> WhatAfter Journal
              </div>
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-slate-950 dark:text-white mb-3">
                Latest Articles &amp; Frameworks
              </h2>
              <p className="text-slate-600 dark:text-[#aab7c0] max-w-xl text-base">
                Read deep-dives on stream decisions, AI resilience, and dinner-table strategies. Anyone can read freely; sign in to author and publish.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-slate-100 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-300 dark:border-white/10 text-slate-800 dark:text-white text-xs font-bold transition-colors shadow-sm"
              >
                View All Articles <ArrowRight className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
              </Link>
              <Link
                href="/blog/new"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-400 text-[#03110f] text-xs font-bold hover:bg-emerald-300 transition-colors shadow-sm"
              >
                <PenSquare className="w-4 h-4" /> Write a Blog
              </Link>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {INITIAL_BLOG_POSTS.slice(0, 3).map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group flex flex-col justify-between p-6 rounded-2xl bg-white dark:bg-[#0b1723] border border-slate-200/80 dark:border-white/5 hover:border-emerald-500/30 transition-all hover:shadow-xl dark:hover:shadow-emerald-950/20 transform hover:-translate-y-1 shadow-sm"
              >
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                      {post.category}
                    </span>
                  </div>

                  <h3 className="text-xl font-serif font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition-colors mb-3 leading-snug">
                    {post.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-[#95a5b2] leading-relaxed mb-6 line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs text-slate-500 dark:text-[#718593]">
                  <div>
                    <span className="font-semibold text-slate-900 dark:text-[#ccd8e0] block">{post.authorName}</span>
                    {post.authorRole && (
                      <span className="text-[10px] text-slate-400 dark:text-[#5d7180]">{post.authorRole}</span>
                    )}
                  </div>
                  <span className="inline-flex items-center text-emerald-600 dark:text-emerald-400 font-bold group-hover:translate-x-1 transition-transform">
                    Read Article →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>


        {/* ========================================================= */}
        {/* 9. TRANSPARENT PRICING BLOCK (₹999)                       */}
        {/* ========================================================= */}
        <section id="pricing" className="max-w-[1200px] mx-auto px-6 py-24 border-b border-slate-200/80 dark:border-white/5">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold uppercase tracking-widest mb-3">
              Simple, Transparent Pricing
            </div>
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-4 text-slate-950 dark:text-white">One Investment. Lifelong Direction.</h2>
            <p className="text-slate-600 dark:text-[#aab7c0] max-w-2xl mx-auto">
              No hidden fees. No recurring monthly subscriptions. One complete dossier for your next big life decision.
            </p>
          </div>

          <div className="max-w-lg mx-auto p-8 sm:p-10 border-2 border-emerald-500/60 rounded-3xl bg-gradient-to-b from-emerald-50/50 via-white to-slate-50 dark:from-emerald-950/30 dark:via-[#0b1723] dark:to-[#07111b] relative text-center shadow-2xl dark:shadow-emerald-950/40">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-5 py-1.5 bg-emerald-400 text-black text-xs font-black rounded-full uppercase tracking-wider shadow-md">
              Launch Offer • Full Access
            </div>

            <h3 className="text-2xl font-serif font-bold mb-2 text-slate-900 dark:text-white">Comprehensive Career Dossier</h3>
            <p className="text-xs text-slate-600 dark:text-[#95a2ac] mb-6">Complete 15-Page Intelligence Report + Action Roadmap</p>
            
            <div className="flex items-baseline justify-center gap-2 mb-8">
              <span className="text-6xl font-serif font-black text-slate-950 dark:text-white">₹999</span>
              <span className="text-sm text-slate-400 dark:text-[#7f8f9b] line-through">₹2,499</span>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold ml-1">Save 60%</span>
            </div>
            
            <ul className="space-y-3.5 mb-8 text-sm text-left">
              <li className="flex items-center gap-3 text-slate-700 dark:text-[#d2dce3]">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 dark:text-emerald-400 shrink-0" />
                <span>Full 80-Scenario Adaptive Assessment</span>
              </li>
              <li className="flex items-center gap-3 text-slate-700 dark:text-[#d2dce3]">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 dark:text-emerald-400 shrink-0" />
                <span>35-Trait Cognitive Aptitudes &amp; Work Values Radar</span>
              </li>
              <li className="flex items-center gap-3 text-slate-700 dark:text-[#d2dce3]">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 dark:text-emerald-400 shrink-0" />
                <span>Top 5 Ranked Career Matches with Day-in-the-Life breakdowns</span>
              </li>
              <li className="flex items-center gap-3 text-slate-700 dark:text-[#d2dce3]">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 dark:text-emerald-400 shrink-0" />
                <span>AI-Resilience &amp; Expected Salary Benchmarks (Entry to Senior)</span>
              </li>
              <li className="flex items-center gap-3 text-slate-700 dark:text-[#d2dce3]">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 dark:text-emerald-400 shrink-0" />
                <span>Eliminated Careers with Specific Mismatch Rationale</span>
              </li>
              <li className="flex items-center gap-3 text-slate-700 dark:text-[#d2dce3]">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 dark:text-emerald-400 shrink-0" />
                <span>Sequenced 3-Year Action Plan (1m, 6m, 1y, 3y milestones)</span>
              </li>
              <li className="flex items-center gap-3 text-slate-700 dark:text-[#d2dce3]">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 dark:text-emerald-400 shrink-0" />
                <span>Available in Both English &amp; Hindi (हिंदी) — Choose Your Preferred Language</span>
              </li>
              <li className="flex items-center gap-3 text-slate-700 dark:text-[#d2dce3]">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 dark:text-emerald-400 shrink-0" />
                <span>Downloadable 15-Page PDF + Parent &amp; Counsellor Guide</span>
              </li>
            </ul>

            <Link 
              href="/signup" 
              className="block w-full py-4 text-center rounded-xl bg-emerald-400 text-black text-base font-extrabold hover:bg-emerald-300 transition-colors shadow-lg shadow-emerald-500/20"
            >
              Start Assessment (₹999) →
            </Link>
            
            <span className="block mt-4 text-[11px] text-slate-500 dark:text-[#71828f]">
              Secure Payment • Instant Account Creation • Lifetime Access to Results
            </span>
          </div>
        </section>


        {/* ========================================================= */}
        {/* 10. FREQUENTLY ASKED QUESTIONS (FAQ)                      */}
        {/* ========================================================= */}
        <section id="faqs" className="max-w-[850px] mx-auto px-6 py-24 border-b border-slate-200/80 dark:border-white/5">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold uppercase tracking-widest mb-3">
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
                  className="w-full text-left px-6 py-5 flex items-center justify-between font-bold text-base sm:text-lg hover:bg-slate-50 dark:hover:bg-white/5 text-slate-900 dark:text-white transition-colors"
                >
                  <span className="pr-4">{faq.q}</span>
                  {openFaq === i ? (
                    <ChevronUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                  )}
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 text-sm text-slate-600 dark:text-[#9ab0bf] leading-relaxed border-t border-slate-100 dark:border-white/5 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>


        {/* ========================================================= */}
        {/* 11. FINAL HIGH-IMPACT CTA                                 */}
        {/* ========================================================= */}
        <section className="max-w-[1200px] mx-auto px-6 py-20">
          <div className="rounded-3xl p-10 md:p-16 text-center bg-gradient-to-b from-emerald-50 via-slate-50 to-white dark:from-emerald-950/40 dark:via-[#0a1622] dark:to-[#061019] border border-emerald-500/30 relative overflow-hidden shadow-xl dark:shadow-2xl">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <h2 className="text-3xl md:text-5xl font-serif font-bold tracking-tight mb-6 max-w-2xl mx-auto text-slate-950 dark:text-white">
              Your next big decision doesn&apos;t have to be a gamble.
            </h2>
            <p className="text-slate-600 dark:text-[#aab7c0] text-base md:text-lg max-w-xl mx-auto mb-8 leading-relaxed">
              Join students and families who have replaced career anxiety with clear, data-driven direction.
            </p>
            <Link 
              href="/signup" 
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-emerald-400 text-[#03110f] text-base font-extrabold hover:bg-emerald-300 transition-all shadow-[0_0_30px_rgba(16,185,129,0.3)] transform hover:-translate-y-0.5"
            >
              Take the Assessment →
            </Link>
          </div>
        </section>

      </main>
      

      {/* ========================================================= */}
      {/* 12. CLEAN, REAL FOOTER (ZERO BROKEN LINKS)                */}
      {/* ========================================================= */}
      <footer className="border-t border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-[#040b12] pt-16 pb-12 transition-colors duration-200">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-10 mb-14">
            
            {/* Column 1: Brand & Inquiries */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  <Compass className="w-5 h-5" />
                </div>
                <span className="text-xl font-bold tracking-tight text-slate-950 dark:text-white">
                  What<span className="text-emerald-600 dark:text-emerald-400 font-extrabold">After</span>
                </span>
              </div>
              
              <p className="text-xs text-slate-600 dark:text-[#7d909e] max-w-[340px] leading-relaxed mb-4">
                Helping students and families make sense of what comes next — from school to college and beyond. Practical ideas. No generic motivation.
              </p>

              <div className="text-xs text-slate-600 dark:text-[#7d909e]">
                Inquiries &amp; Support: <a href="mailto:careeright.edu@gmail.com" className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium">careeright.edu@gmail.com</a>
              </div>
            </div>
            
            {/* Column 2: WhatAfter Life Stages */}
            <div>
              <h4 className="text-[11px] font-mono font-bold tracking-wider uppercase text-slate-950 dark:text-white mb-4">
                What After?
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-600 dark:text-[#8295a3]">
                <li><a href="#stages" onClick={() => setActiveStage(0)} className="hover:text-emerald-600 dark:hover:text-emerald-300 transition-colors">After Class 8</a></li>
                <li><a href="#stages" onClick={() => setActiveStage(1)} className="hover:text-emerald-600 dark:hover:text-emerald-300 transition-colors">After 10th</a></li>
                <li><a href="#stages" onClick={() => setActiveStage(2)} className="hover:text-emerald-600 dark:hover:text-emerald-300 transition-colors">After 12th</a></li>
                <li><a href="#stages" onClick={() => setActiveStage(3)} className="hover:text-emerald-600 dark:hover:text-emerald-300 transition-colors">After College</a></li>
                <li><a href="#how-it-works" className="hover:text-emerald-600 dark:hover:text-emerald-300 transition-colors">How It Works</a></li>
              </ul>
            </div>

            {/* Column 3: Platform & Real Legal */}
            <div>
              <h4 className="text-[11px] font-mono font-bold tracking-wider uppercase text-slate-950 dark:text-white mb-4">
                Platform
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-600 dark:text-[#8295a3]">
                <li><a href="#inside-report" className="hover:text-emerald-600 dark:hover:text-emerald-300 transition-colors">Inside The Report</a></li>
                <li><Link href="/blog" className="hover:text-emerald-600 dark:hover:text-emerald-300 transition-colors">Journal &amp; Blogs</Link></li>
                <li><a href="#pricing" className="hover:text-emerald-600 dark:hover:text-emerald-300 transition-colors">Pricing (₹999)</a></li>
                <li><a href="#faqs" className="hover:text-emerald-600 dark:hover:text-emerald-300 transition-colors">FAQs</a></li>
                <li><Link href="/privacy" className="hover:text-emerald-600 dark:hover:text-emerald-300 transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>

          </div>

          {/* Bottom strip */}
          <div className="pt-8 border-t border-slate-200 dark:border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500 dark:text-[#5f717f]">
            <span>© {new Date().getFullYear()} WhatAfter (Careeright). All rights reserved.</span>
            <span>Support &amp; Inquiries: <a href="mailto:careeright.edu@gmail.com" className="hover:text-emerald-600 dark:hover:text-emerald-400">careeright.edu@gmail.com</a></span>
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
              <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold uppercase tracking-wider">
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
