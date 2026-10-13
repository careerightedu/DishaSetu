"use client";

import React, { useState, useRef } from "react";
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
  X,
  Users
} from "lucide-react";
import { motion, AnimatePresence, useScroll, useSpring, useTransform } from "framer-motion";
import Navbar from "@/features/auth/components/Navbar";
import { INITIAL_BLOG_POSTS } from "@/lib/blogs";
import ScrollCareerIntelligenceEngine from "@/components/ScrollCareerIntelligenceEngine";
import ReportPage03InteractiveRadar from "@/components/ReportPage03InteractiveRadar";
import ReportPage07InteractiveDeepDive from "@/components/ReportPage07InteractiveDeepDive";
import ReportPage11InteractiveRoadmap from "@/components/ReportPage11InteractiveRoadmap";
import AnimatedCounter from "@/components/AnimatedCounter";
import DinnerTableTranslator from "@/components/DinnerTableTranslator";
import StackedHowItWorksWavy from "@/components/StackedHowItWorksWavy";
import ScrollWavyConnector from "@/components/ScrollWavyConnector";
import AmbientBackgroundGlows from "@/components/AmbientBackgroundGlows";
import ScrollDimSection from "@/components/ScrollDimSection";

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeStage, setActiveStage] = useState<number>(1);
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
    <div className="min-h-screen bg-slate-50 dark:bg-[#061019] text-slate-900 dark:text-[#f4efe6] font-sans selection:bg-emerald-500/30 selection:text-emerald-900 dark:selection:text-emerald-200 transition-colors duration-200 relative">
      {/* Dynamic Parallax Atmosphere Glows & Blueprint Grid */}
      <AmbientBackgroundGlows />

      {/* Top Viewport Reading Progress Beam */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 origin-left z-50 pointer-events-none"
        style={{ scaleX }}
      />

      <Navbar />

      <main className="overflow-hidden">
        
        {/* ========================================================= */}
        {/* 1. HERO SECTION                                           */}
        {/* ========================================================= */}
        <ScrollDimSection isHero id="hero" className="relative pt-16 pb-20 md:pt-24 md:pb-28 border-b border-slate-200/80 dark:border-white/5">
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

          </div>
        </ScrollDimSection>


        {/* ========================================================= */}
        {/* 3. PROOF & CREDIBILITY METRICS STRIP                      */}
        {/* ========================================================= */}
        <ScrollDimSection as="div">
          <div className="border-b border-slate-200/80 dark:border-white/5 py-10 bg-slate-100/70 dark:bg-[#08131d]/60">
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
              <div className="border-r border-slate-200 dark:border-white/5 last:border-none">
                <AnimatedCounter value={80} className="text-3xl sm:text-4xl font-serif font-bold block mb-1 text-emerald-600 dark:text-emerald-400" />
                <span className="text-[11px] text-slate-600 dark:text-[#7d8c97] uppercase tracking-wider font-semibold">Thoughtful Scenarios</span>
              </div>
              <div className="border-r border-slate-200 dark:border-white/5 last:border-none">
                <AnimatedCounter value={35} className="text-3xl sm:text-4xl font-serif font-bold block mb-1 text-emerald-600 dark:text-emerald-400" />
                <span className="text-[11px] text-slate-600 dark:text-[#7d8c97] uppercase tracking-wider font-semibold">Cognitive &amp; Value Traits</span>
              </div>
              <div className="border-r border-slate-200 dark:border-white/5 last:border-none">
                <AnimatedCounter value={5} className="text-3xl sm:text-4xl font-serif font-bold block mb-1 text-emerald-600 dark:text-emerald-400" />
                <span className="text-[11px] text-slate-600 dark:text-[#7d8c97] uppercase tracking-wider font-semibold">Curated Deep-Dives</span>
              </div>
              <div>
                <AnimatedCounter value={3} suffix="-Yr" className="text-3xl sm:text-4xl font-serif font-bold block mb-1 text-emerald-600 dark:text-emerald-400" />
                <span className="text-[11px] text-slate-600 dark:text-[#7d8c97] uppercase tracking-wider font-semibold">Sequenced Roadmap</span>
              </div>
            </div>
          </div>
        </ScrollDimSection>

        {/* ========================================================= */}
        {/* 3B. SCROLL-DRIVEN CAREER INTELLIGENCE ENGINE              */}
        {/* ========================================================= */}
        <ScrollDimSection as="div">
          <ScrollCareerIntelligenceEngine />
        </ScrollDimSection>


        {/* ========================================================= */}
        {/* 4. THE 4 LIFE STAGES ("WHAT AFTER?")                      */}
        {/* ========================================================= */}
        <ScrollDimSection id="stages" className="max-w-[1200px] mx-auto px-6 py-24 border-b border-slate-200/80 dark:border-white/5 relative">
          <div className="text-center mb-16 relative">
            <span className="absolute -top-12 left-1/2 -translate-x-1/2 text-[110px] sm:text-[160px] md:text-[200px] font-serif font-black text-slate-900/[0.03] dark:text-white/[0.03] pointer-events-none select-none -z-10 leading-none">
              02
            </span>
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
                className={`relative p-4 rounded-xl text-left border transition-all ${
                  activeStage === i 
                    ? "border-emerald-500 text-slate-950 dark:text-white shadow-lg shadow-emerald-500/10" 
                    : "bg-white dark:bg-[#0b1723] border-slate-200 dark:border-white/5 text-slate-600 dark:text-[#8fa0ac] hover:border-slate-300 dark:hover:border-white/20 hover:text-slate-950 dark:hover:text-white shadow-sm"
                }`}
              >
                {activeStage === i && (
                  <motion.div
                    layoutId="activeStageTab"
                    className="absolute inset-0 rounded-xl bg-white dark:bg-emerald-500/10 -z-10"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
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
        <div className="max-w-[1200px] mx-auto px-6 -my-4 relative z-20">
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
          <div className="max-w-[1200px] mx-auto px-6">
            
            <div className="text-center mb-24 lg:mb-28 relative">
              <span className="absolute -top-12 left-1/2 -translate-x-1/2 text-[110px] sm:text-[160px] md:text-[200px] font-serif font-black text-slate-900/[0.03] dark:text-white/[0.03] pointer-events-none select-none -z-10 leading-none">
                04
              </span>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold uppercase tracking-widest mb-3">
                Transparent Product Breakdown
              </div>
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold mb-4 text-slate-950 dark:text-white tracking-tight">
                Inside Your Career Intelligence Report
              </h2>
              <p className="text-slate-600 dark:text-[#aab7c0] text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
                No generic 2-paragraph summaries. Every student receives a 15-page data-backed intelligence dossier. Here is exactly what you get:
              </p>
            </div>

            <div className="space-y-0">

              {/* Feature 1: Cognitive Fingerprint */}
              <div className="relative">
                {/* Ambient glow aura */}
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-80 sm:w-96 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

                {/* Section Header & Explanatory Context */}
                <div className="max-w-3xl mx-auto text-center mb-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[11px] font-mono font-bold uppercase tracking-wider mb-2.5">
                    Report Page 03 • Psychometric &amp; Value Architecture
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-serif font-bold mb-3 text-slate-900 dark:text-white tracking-tight">
                    Your Cognitive Fingerprint
                  </h3>
                  <p className="text-slate-600 dark:text-[#95a2ac] text-sm leading-relaxed mb-6 max-w-2xl mx-auto">
                    Before we discuss careers, we map who you are. The 35-trait radar displays your Core Aptitudes (Logical, Numerical, Spatial, Verbal, Creative) overlaid directly against your Work Values (Autonomy, Wealth, Balance, Impact, Security).
                  </p>

                  {/* Context breakdown cards */}
                  <div className="grid sm:grid-cols-2 gap-3.5 text-left max-w-2xl mx-auto">
                    <div className="p-4 rounded-xl bg-white dark:bg-[#07131e] border border-slate-200 dark:border-white/10 text-xs sm:text-sm text-slate-700 dark:text-[#ccd7df] shadow-sm">
                      <b className="text-slate-900 dark:text-white block mb-1 font-semibold flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span>Cognitive Style (Analytical–Divergent):</span>
                      </b>
                      Can imagine bold possibilities and map the technical path to realize them with structured logic trees.
                    </div>
                    <div className="p-4 rounded-xl bg-white dark:bg-[#07131e] border border-slate-200 dark:border-white/10 text-xs sm:text-sm text-slate-700 dark:text-[#ccd7df] shadow-sm">
                      <b className="text-slate-900 dark:text-white block mb-1 font-semibold flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-teal-500" />
                        <span>Learning Style (Build-to-Learn):</span>
                      </b>
                      Visual-Kinesthetic learner who thrives through rapid prototyping, architectural testing, and immediate feedback.
                    </div>
                  </div>
                </div>

                {/* Report Interactive View */}
                <div className="max-w-4xl mx-auto">
                  <ReportPage03InteractiveRadar onZoomPdf={() => setZoomImage("/report/cognitive-fingerprint.png")} />
                </div>
              </div>

              {/* Wavy Conduit: Radar to Deep-Dive */}
              <ScrollWavyConnector 
                height={200} 
                className="-my-3"
                direction="reverse-s" 
                gradientId="wavy-radar-to-deepdive" 
              />

              {/* Feature 2: Career Deep-Dive & Salary / AI Resilience */}
              <div className="relative">
                {/* Ambient glow aura */}
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-80 sm:w-96 h-80 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

                {/* Section Header & Explanatory Context */}
                <div className="max-w-3xl mx-auto text-center mb-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-600 dark:text-teal-400 text-[11px] font-mono font-bold uppercase tracking-wider mb-2.5">
                    Report Pages 06–10 • Labor Market Grounding
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-serif font-bold mb-3 text-slate-900 dark:text-white tracking-tight">
                    Deep Dives with Salary &amp; AI-Resilience
                  </h3>
                  <p className="text-slate-600 dark:text-[#95a2ac] text-sm leading-relaxed mb-6 max-w-2xl mx-auto">
                    Every top recommended career is scrutinized through rigorous labor market criteria, removing speculation and replacing it with grounded expectations.
                  </p>

                  {/* Context breakdown cards */}
                  <div className="grid sm:grid-cols-3 gap-3.5 text-left max-w-3xl mx-auto">
                    <div className="p-4 rounded-xl bg-white dark:bg-[#07131e] border border-slate-200 dark:border-white/10 text-xs text-slate-700 dark:text-[#ccd7df] shadow-sm">
                      <b className="text-slate-900 dark:text-white block mb-1 font-semibold flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span>Expected Salaries:</span>
                      </b>
                      Clear benchmark ranges for Entry Level (₹12–25 LPA) up to Senior Architect/Director (₹40–80 LPA).
                    </div>
                    <div className="p-4 rounded-xl bg-white dark:bg-[#07131e] border border-slate-200 dark:border-white/10 text-xs text-slate-700 dark:text-[#ccd7df] shadow-sm">
                      <b className="text-slate-900 dark:text-white block mb-1 font-semibold flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-teal-500" />
                        <span>AI-Resilience (75/100):</span>
                      </b>
                      Why high-level system architecture and human-centric design protect this role from pure AI automation.
                    </div>
                    <div className="p-4 rounded-xl bg-white dark:bg-[#07131e] border border-slate-200 dark:border-white/10 text-xs text-slate-700 dark:text-[#ccd7df] shadow-sm">
                      <b className="text-slate-900 dark:text-white block mb-1 font-semibold flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-cyan-500" />
                        <span>Day-in-the-Life &amp; Friction:</span>
                      </b>
                      Realistic daily sprint tasks, intellectual thrills, and potential burnout friction points.
                    </div>
                  </div>
                </div>

                {/* Report Interactive View */}
                <div className="max-w-4xl mx-auto">
                  <ReportPage07InteractiveDeepDive onZoomPdf={() => setZoomImage("/report/career-deep-dive.png")} />
                </div>
              </div>

              {/* Wavy Conduit: Deep-Dive to 3-Year Roadmap */}
              <ScrollWavyConnector 
                height={200} 
                className="-my-3"
                direction="s-curve" 
                gradientId="wavy-deepdive-to-roadmap" 
              />

              {/* Feature 3: Execution Plan & What We Eliminated */}
              <div className="relative">
                {/* Ambient glow aura */}
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-80 sm:w-96 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

                {/* Section Header & Explanatory Context */}
                <div className="max-w-3xl mx-auto text-center mb-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-[11px] font-mono font-bold uppercase tracking-wider mb-2.5">
                    Report Pages 11 &amp; 13 • 3-Year Action Roadmap
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-serif font-bold mb-3 text-slate-900 dark:text-white tracking-tight">
                    Sequenced Execution Plan + Eliminations
                  </h3>
                  <p className="text-slate-600 dark:text-[#95a2ac] text-sm sm:text-base leading-relaxed mb-6 max-w-2xl mx-auto">
                    A report without next steps is just entertainment. WhatAfter sequences your next 3 years and clearly outlines what prestigious careers to actively avoid.
                  </p>

                  {/* Context breakdown cards */}
                  <div className="grid sm:grid-cols-2 gap-3.5 text-left max-w-2xl mx-auto">
                    <div className="p-4 rounded-xl bg-white dark:bg-[#07131e] border border-slate-200 dark:border-white/10 text-xs sm:text-sm text-slate-700 dark:text-[#ccd7df] shadow-sm">
                      <b className="text-slate-900 dark:text-white block mb-1 font-semibold flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span>Timeline Roadmaps (1M, 6M, 1Y, 3Y):</span>
                      </b>
                      Actionable milestones like auditing Design Thinking, securing target internships, and shipping high-leverage portfolios.
                    </div>
                    <div className="p-4 rounded-xl bg-red-50/80 dark:bg-red-950/20 border border-red-200 dark:border-red-500/20 text-xs sm:text-sm text-red-900/80 dark:text-[#b8a2a2] shadow-sm">
                      <b className="text-red-700 dark:text-red-300 block mb-1 font-semibold flex items-center gap-1.5">
                        <XCircle className="w-4 h-4 text-red-500 dark:text-red-400 shrink-0" />
                        <span>Career Eliminations (What NOT to do):</span>
                      </b>
                      Explicitly details why high-profile paths (e.g. CA, Medical Doctor, Corporate Law) clash with your profile, saving years of costly misdirection.
                    </div>
                  </div>
                </div>

                {/* Report Interactive View - Expansive Full Width Container */}
                <div className="max-w-5xl mx-auto">
                  <ReportPage11InteractiveRoadmap onZoomPdf={() => setZoomImage("/report/execution-plan.png")} />
                </div>
              </div>

            </div>

          </div>
        </ScrollDimSection>

        {/* Wavy Conduit connecting 3-Year Execution Plan into Parent Bridge */}
        <div className="max-w-[1200px] mx-auto px-6 -my-4 relative z-20">
          <ScrollWavyConnector 
            height={240} 
            direction="reverse-s" 
            gradientId="wavy-roadmap-to-parent" 
          />
        </div>


        {/* ========================================================= */}
        {/* 7. THE PARENT & COUNSELLOR BRIDGE                         */}
        {/* ========================================================= */}
        <ScrollDimSection className="max-w-[1200px] mx-auto px-6 py-20 border-b border-slate-200/80 dark:border-white/5">
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
                <p className="text-slate-600 dark:text-[#a5b4c0] text-base leading-relaxed mb-6">
                  Most career advice turns into arguments between parents and students. WhatAfter includes two dedicated tools: <b>&ldquo;In Plain Words&rdquo;</b> (a one-page conversational letter) and the <b>&ldquo;Guide for Parents &amp; Counsellors&rdquo;</b> with specific conversation starters.
                </p>

                {/* Interactive Dinner Table Translator */}
                <div className="mt-2">
                  <DinnerTableTranslator />
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
        </ScrollDimSection>


        {/* Wavy Conduit connecting Parent Bridge into Testimonials */}
        <div className="max-w-[1200px] mx-auto px-6 -my-4 relative z-20">
          <ScrollWavyConnector 
            height={240} 
            direction="s-curve" 
            gradientId="wavy-parent-to-testimonials" 
          />
        </div>

        {/* ========================================================= */}
        {/* 8. REAL STUDENT & PARENT TESTIMONIALS                     */}
        {/* ========================================================= */}
        <ScrollDimSection className="max-w-[1200px] mx-auto px-6 py-24 border-b border-slate-200/80 dark:border-white/5 relative">
          <div ref={testimonialsRef}>
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold uppercase tracking-widest mb-3">
              Real Experiences
            </div>
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-4 text-slate-950 dark:text-white">Clarity Replaces Anxiety</h2>
            <p className="text-slate-600 dark:text-[#aab7c0] max-w-2xl mx-auto">
              How students and parents used their WhatAfter dossiers to navigate critical career crossroads.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 items-start">
            {/* Column 1 (Parallaxed on Desktop) */}
            <motion.div style={{ y: isDesktop ? col1Y : 0 }} className="space-y-6">
              {[testimonials[0], testimonials[2]].map((t, idx) => (
                <div key={idx} className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#0b1723] border border-slate-200/80 dark:border-white/5 flex flex-col justify-between hover:border-emerald-500/30 transition-all hover:shadow-lg dark:hover:shadow-emerald-950/20 shadow-sm">
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
            </motion.div>

            {/* Column 2 (Opposite Parallaxed on Desktop) */}
            <motion.div style={{ y: isDesktop ? col2Y : 0 }} className="space-y-6 sm:mt-8">
              {[testimonials[1], testimonials[3]].map((t, idx) => (
                <div key={idx} className="p-8 rounded-2xl bg-white dark:bg-[#0b1723] border border-slate-200/80 dark:border-white/5 flex flex-col justify-between hover:border-emerald-500/30 transition-all hover:shadow-lg dark:hover:shadow-emerald-950/20 shadow-sm">
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
            </motion.div>
          </div>
          </div>
        </ScrollDimSection>


        {/* ========================================================= */}
        {/* 8.5 WHATAFTER JOURNAL / LATEST BLOGS                      */}
        {/* ========================================================= */}
        <ScrollDimSection id="journal" className="max-w-[1200px] mx-auto px-6 py-24 border-b border-slate-200/80 dark:border-white/5">
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
        </ScrollDimSection>

        {/* Wavy Conduit connecting Journal into Pricing */}
        <div className="max-w-[1200px] mx-auto px-6 -my-4 relative z-20">
          <ScrollWavyConnector 
            height={240} 
            direction="reverse-s" 
            gradientId="wavy-journal-to-pricing" 
          />
        </div>

        {/* ========================================================= */}
        {/* 9. TRANSPARENT PRICING BLOCK (₹999)                       */}
        {/* ========================================================= */}
        <ScrollDimSection id="pricing" className="max-w-[1240px] mx-auto px-6 py-24 sm:py-32 border-b border-slate-200/80 dark:border-white/5 relative">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 relative">
            <span className="absolute -top-12 left-1/2 -translate-x-1/2 text-[110px] sm:text-[160px] md:text-[200px] font-serif font-black text-slate-900/[0.03] dark:text-white/[0.03] pointer-events-none select-none -z-10 leading-none">
              05
            </span>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold uppercase tracking-widest mb-3">
              One-Time Investment • Zero Recurring Subscriptions
            </div>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold mb-4 text-slate-950 dark:text-white tracking-tight">
              Your Complete Career Intelligence Dossier
            </h2>
            <p className="text-base sm:text-lg text-slate-600 dark:text-[#aab7c0] max-w-2xl mx-auto leading-relaxed">
              One assessment. A decision framework you can return to for years.
            </p>
          </div>

          {/* VISUAL TRANSFORMATION PIPELINE: 80 Scenarios → 35 Traits → 5 Career Paths → 3-Year Roadmap */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 dark:bg-[#07131e] text-white border border-slate-800 dark:border-white/10 shadow-2xl relative overflow-hidden mb-12">
            <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -left-20 -top-20 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-5 border-b border-white/10">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold block mb-0.5">
                    The Science Behind The Dossier
                  </span>
                  <h4 className="text-base sm:text-lg font-serif font-bold text-white">
                    How Your Responses Transform Into Lifelong Direction
                  </h4>
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold self-start sm:self-auto">
                  ₹999 Complete Access
                </div>
              </div>

              {/* Animated Laser Data Pulse Stream Track */}
              <div className="hidden lg:block relative w-full h-[3px] bg-gradient-to-r from-emerald-500/20 via-teal-500/30 to-cyan-500/20 mb-6 rounded-full overflow-hidden">
                <motion.div
                  className="w-36 h-full bg-gradient-to-r from-transparent via-emerald-400 to-transparent blur-[1px]"
                  animate={{ x: ["-100%", "900%"] }}
                  transition={{ duration: 3.2, repeat: Infinity, ease: "linear" }}
                />
              </div>

              {/* 4 Compounding Steps */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 relative">
                
                {/* Step 1: 80 Scenarios */}
                <motion.div 
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-500/50 hover:bg-white/[0.07] transition-colors flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
                        Step 01 • Input
                      </span>
                      <BrainCircuit className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="text-xl sm:text-2xl font-serif font-black text-white mb-1.5 flex items-center justify-between">
                      <span>80 Scenarios</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Adaptive, realistic work &amp; study dilemmas. Zero right/wrong anxiety or memorization stress.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/10 text-[11px] font-mono text-emerald-300 flex items-center gap-1 font-semibold">
                    <span>Unconscious behavioral mapping</span>
                  </div>
                </motion.div>

                {/* Step 2: 35 Traits */}
                <motion.div 
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-teal-500/50 hover:bg-white/[0.07] transition-colors flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-teal-400 font-bold">
                        Step 02 • Analysis
                      </span>
                      <Compass className="w-4 h-4 text-teal-400 group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="text-xl sm:text-2xl font-serif font-black text-white mb-1.5 flex items-center justify-between">
                      <span>35 Traits</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Cognitive aptitudes (numerical, spatial, logical, verbal, creative) mapped against work values.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/10 text-[11px] font-mono text-teal-300 flex items-center gap-1 font-semibold">
                    <span>Multidimensional Radar Graph</span>
                  </div>
                </motion.div>

                {/* Step 3: 5 Career Paths */}
                <motion.div 
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-500/50 hover:bg-white/[0.07] transition-colors flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold">
                        Step 03 • Filtering
                      </span>
                      <Target className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="text-xl sm:text-2xl font-serif font-black text-white mb-1.5 flex items-center justify-between">
                      <span>5 Career Paths</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      900+ careers filtered down to top 5 recommendations with Indian market salary benchmarks &amp; AI resilience.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/10 text-[11px] font-mono text-cyan-300 flex items-center gap-1 font-semibold">
                    <span>Labor-market grounded metrics</span>
                  </div>
                </motion.div>

                {/* Step 4: 3-Year Roadmap */}
                <motion.div 
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-500/50 hover:bg-white/[0.07] transition-colors flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
                        Step 04 • Execution
                      </span>
                      <Route className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="text-xl sm:text-2xl font-serif font-black text-white mb-1.5 flex items-center justify-between">
                      <span>3-Year Roadmap</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Sequenced milestones (1m, 6m, 1y, 3y) plus what prestigious careers to actively eliminate.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/10 text-[11px] font-mono text-emerald-300 flex items-center gap-1 font-semibold">
                    <span>From here to a job offer</span>
                  </div>
                </motion.div>

              </div>

              {/* Bottom Pipeline Summary */}
              <div className="mt-6 pt-5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-xs sm:text-sm text-slate-200">
                    <b className="text-white">One assessment.</b> A decision framework you can return to for years.
                  </span>
                </div>
                <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                  <span className="text-emerald-400">80 Scenarios</span>
                  <span>→</span>
                  <span className="text-teal-400">35 Traits</span>
                  <span>→</span>
                  <span className="text-cyan-400">5 Paths</span>
                  <span>→</span>
                  <span className="text-emerald-400">3-Year Plan</span>
                </div>
              </div>
            </div>
          </div>

          {/* 2-COLUMN MAIN CONVERSION SECTION: Designed for Students + Parents & The Investment Card */}
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Designed for Students + Parents & Cost Comparison */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Card 1: Designed for Students + Parents */}
              <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#07131e] border border-slate-200 dark:border-white/10 shadow-lg">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-bold block">
                      The Generational Bridge
                    </span>
                    <h3 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 dark:text-white">
                      Designed for Students + Parents
                    </h3>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-[#95a2ac] leading-relaxed mb-6">
                  Most career anxiety comes from generational friction: students want freedom and modern fields, while parents want stability and ROI. WhatAfter replaces guesswork with objective data both sides can trust.
                </p>

                <div className="grid sm:grid-cols-2 gap-4">
                  {/* For Students */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 space-y-2">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                      <span>🎓</span> For Students
                    </span>
                    <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                      <li className="flex items-start gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>Discover hidden aptitudes without peer pressure or exam dread</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>Realistic day-in-the-life tasks, salary ceilings, and AI impact</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>Step-by-step 3-year execution roadmap from day one</span>
                      </li>
                    </ul>
                  </div>

                  {/* For Parents */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 space-y-2">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 flex items-center gap-1.5">
                      <span>🛡️</span> For Parents
                    </span>
                    <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                      <li className="flex items-start gap-1.5">
                        <Check className="w-3.5 h-3.5 text-teal-500 shrink-0 mt-0.5" />
                        <span>Objective data to have calm, constructive dinner-table conversations</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <Check className="w-3.5 h-3.5 text-teal-500 shrink-0 mt-0.5" />
                        <span>Avoid ₹5–15 Lakhs in misdirected coaching or unsuitable degrees</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <Check className="w-3.5 h-3.5 text-teal-500 shrink-0 mt-0.5" />
                        <span>Clear breakdown of high-burnout fields eliminated before signing up</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Card 2: Cost of Misdirection vs ₹999 */}
              <div className="p-6 rounded-3xl bg-emerald-500/5 border border-emerald-500/20 text-xs sm:text-sm">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                      Cost of Misdirection vs. Cost of Clarity
                    </span>
                    <h4 className="font-serif font-bold text-slate-900 dark:text-white text-base">
                      Why ₹999 is the Highest-ROI Decision of the Year
                    </h4>
                    <p className="text-slate-600 dark:text-[#95a2ac] text-xs leading-relaxed">
                      A single semester in the wrong stream costs ₹75,000–₹3,00,000 and months of lost morale. Traditional counselors charge ₹5,000+ for subjective opinions. For <b>₹999</b>, WhatAfter gives you an algorithmic psychometric blueprint you can refer back to whenever you face your next crossroads.
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: The Pricing & Offer Card */}
            <div className="lg:col-span-5">
              <div className="p-8 sm:p-10 border-2 border-emerald-500/50 rounded-3xl bg-gradient-to-b from-white via-slate-50 to-emerald-50/30 dark:from-[#0b1723] dark:via-[#07131e] dark:to-[#050e17] relative shadow-2xl dark:shadow-emerald-950/40">
                
                <div className="absolute top-0 right-8 -translate-y-1/2 px-4 py-1 bg-emerald-400 text-slate-950 text-[11px] font-mono font-black rounded-full uppercase tracking-wider shadow-md">
                  60% Off • Launch Price
                </div>

                <div className="mb-6">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold block mb-1">
                    Complete Intelligence Package
                  </span>
                  <h3 className="text-2xl font-serif font-bold text-slate-900 dark:text-white">
                    Career Intelligence Dossier
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-[#95a2ac] mt-1">
                    Instant access to the adaptive evaluation + 15-page report
                  </p>
                </div>

                {/* Price Display */}
                <div className="flex items-baseline gap-2.5 mb-6 pb-6 border-b border-slate-200 dark:border-white/10">
                  <span className="text-5xl sm:text-6xl font-serif font-black text-slate-950 dark:text-white">
                    ₹999
                  </span>
                  <div className="flex flex-col">
                    <span className="text-sm text-slate-400 dark:text-slate-500 line-through">₹2,499</span>
                    <span className="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400">One-Time Fee</span>
                  </div>
                </div>

                {/* What You Receive */}
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold block mb-3">
                  Everything Included in Your ₹999 Access:
                </span>
                <ul className="space-y-3 mb-8 text-xs text-slate-700 dark:text-[#d2dce3]">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span><b>80-Scenario Adaptive Assessment</b> (Psychometric &amp; Values)</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span><b>35-Trait Cognitive Aptitudes</b> &amp; Work Values Radar</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span><b>Top 5 Ranked Careers</b> with Entry-to-Senior Indian Salary Data</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span><b>AI-Resilience Index</b> (Human Moat vs Automated Tasks)</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span><b>Career Eliminations</b> with Explicit Conflict Analysis</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span><b>Sequenced 3-Year Action Plan</b> (1m, 6m, 1y, 3y)</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span><b>Available in English &amp; Hindi (हिंदी)</b></span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span><b>Downloadable 15-Page PDF</b> + Lifetime Online Dashboard</span>
                  </li>
                </ul>

                {/* CTA */}
                <Link 
                  href="/signup" 
                  className="block w-full py-4 text-center rounded-xl bg-emerald-400 text-slate-950 text-base font-extrabold hover:bg-emerald-300 transition-all shadow-lg shadow-emerald-500/25 active:scale-[0.99]"
                >
                  Start Assessment (₹999) →
                </Link>

                <div className="mt-4 pt-3 border-t border-slate-200 dark:border-white/5 flex items-center justify-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                  <span>🔒 256-Bit SSL</span>
                  <span>•</span>
                  <span>⚡ Instant Access</span>
                  <span>•</span>
                  <span>♾️ Lifetime Validity</span>
                </div>

              </div>
            </div>

          </div>

        </ScrollDimSection>


        {/* ========================================================= */}
        {/* 10. FREQUENTLY ASKED QUESTIONS (FAQ)                      */}
        {/* ========================================================= */}
        <ScrollDimSection id="faqs" className="max-w-[850px] mx-auto px-6 py-24 border-b border-slate-200/80 dark:border-white/5 relative">
          <div className="text-center mb-14 relative">
            <span className="absolute -top-12 left-1/2 -translate-x-1/2 text-[110px] sm:text-[160px] md:text-[200px] font-serif font-black text-slate-900/[0.03] dark:text-white/[0.03] pointer-events-none select-none -z-10 leading-none">
              06
            </span>
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
                  <motion.div
                    animate={{ rotate: openFaq === i ? 180 : 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="shrink-0"
                  >
                    <ChevronDown className={`w-5 h-5 transition-colors ${openFaq === i ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400"}`} />
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
                      <div className="px-6 pb-5 text-sm text-slate-600 dark:text-[#9ab0bf] leading-relaxed border-t border-slate-100 dark:border-white/5 pt-3">
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
        <ScrollDimSection className="max-w-[1200px] mx-auto px-6 py-20">
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
        </ScrollDimSection>

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
