"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  ArrowRight, 
  Check, 
  ZoomIn, 
  X, 
  ExternalLink,
  ChevronDown,
  Sparkles,
  BookOpen,
  GraduationCap,
  Briefcase,
  Route,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  HelpCircle
} from "lucide-react";
import { useAuth } from "@/features/auth/context/AuthContext";
import ThemeToggle from "@/components/ThemeToggle";

export default function LandingPage() {
  const { user } = useAuth();
  
  // Interactive Scenario Widget State
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [barValues, setBarValues] = useState<[number, number, number]>([0, 0, 0]);
  const [showBars, setShowBars] = useState<boolean>(false);

  // Tilted quote box state on click
  const [activeTiltedQuote, setActiveTiltedQuote] = useState<number | null>(null);

  // Stage Switcher State
  const [activeStage, setActiveStage] = useState<"stream" | "degree" | "mba" | "change">("stream");
  const [isStagePaused, setIsStagePaused] = useState<boolean>(false);

  // Auto-switch stages every 4.5 seconds unless user clicks a tab
  useEffect(() => {
    if (isStagePaused) return;

    const stageKeys: Array<"stream" | "degree" | "mba" | "change"> = ["stream", "degree", "mba", "change"];
    const timer = setInterval(() => {
      setActiveStage((prev) => {
        const currentIndex = stageKeys.indexOf(prev);
        const nextIndex = (currentIndex + 1) % stageKeys.length;
        return stageKeys[nextIndex];
      });
    }, 4500);

    return () => clearInterval(timer);
  }, [isStagePaused]);

  // FAQ Accordion State (single open or multiple)
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Lightbox Zoom Modal for Report
  const [zoomImage, setZoomImage] = useState<string | null>(null);

  // Active Report Tab in Carousel
  const [activeReportPage, setActiveReportPage] = useState<number>(0);
  const [isReportPaused, setIsReportPaused] = useState<boolean>(false);

  // Auto-switch report preview pages every 4.5 seconds unless user clicks
  useEffect(() => {
    if (isReportPaused) return;

    const timer = setInterval(() => {
      setActiveReportPage((prev) => (prev + 1) % 3);
    }, 4500);

    return () => clearInterval(timer);
  }, [isReportPaused]);

  // Sticky Mobile CTA Visibility
  const [stickyVisible, setStickyVisible] = useState<boolean>(false);
  const [headerScrolled, setHeaderScrolled] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setHeaderScrolled(scrollY > 10);
      setStickyVisible(scrollY > 520);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scenario selection handler
  const handleSelectScenario = (index: number, values: [number, number, number]) => {
    setSelectedOption(index);
    setShowBars(true);
    // Trigger animated width change
    setBarValues([0, 0, 0]);
    setTimeout(() => {
      setBarValues(values);
    }, 50);
  };

  // Stage Data matching reference
  const STAGES = {
    stream: {
      badge: "After 10th",
      title: "Choosing a stream",
      desc: "Compare Science (PCM/PCB), Commerce and Humanities by how you like to learn, not just your marks.",
      chips: ["Science (PCM)", "Medicine (PCB)", "Commerce", "Humanities / Arts"],
      cta: "Explore stream fit",
      href: "/signup?stage=stream",
      image: "/stages/stage_class_10.jpg",
      imageAlt: "Class 10 student making a calm, data-backed stream choice",
      tag: "Stream Matrix"
    },
    degree: {
      badge: "After 12th",
      title: "Choosing a degree",
      desc: "Look past the popular entrance coaching courses. See which undergraduate degrees match how you think and work.",
      chips: ["Engineering & CS", "Economics & Law", "Design & Media", "Modern Disciplines"],
      cta: "Explore degrees",
      href: "/signup?stage=degree",
      image: "/stages/stage_class_12.jpg",
      imageAlt: "Class 12 student evaluating college majors and degrees",
      tag: "Degree Fit"
    },
    mba: {
      badge: "Postgrad & MBA",
      title: "Choosing an MBA specialization",
      desc: "Marketing, Finance, Operations, Strategy or Product? Match the daily work reality, not just placement headlines.",
      chips: ["Marketing & Growth", "Finance & Banking", "Operations & Supply", "Product & Strategy"],
      cta: "Explore specializations",
      href: "/signup?stage=mba",
      image: "/stages/stage_college.jpg",
      imageAlt: "Postgrad and college student evaluating functional specializations",
      tag: "Functional Fit"
    },
    change: {
      badge: "Working Professionals",
      title: "Changing your career",
      desc: "Find your transferable strengths, adjacent roles and the concrete skills to build for a career switch that fits.",
      chips: ["Transferable Strengths", "Adjacent Roles", "Skill Bridges", "Autonomous vs Team"],
      cta: "Explore career change",
      href: "/signup?stage=career-change",
      image: "/images/learner_success.jpg",
      imageAlt: "Working professional planning a sustainable career transition",
      tag: "Career Switch"
    }
  };

  const reportPages = [
    {
      title: "Page 03: Cognitive Fingerprint",
      desc: "Multi-dimensional traits across analytical, intuitive, autonomous and collaborative continuums.",
      src: "/report/cognitive-fingerprint.png"
    },
    {
      title: "Page 07: Career Deep-Dive",
      desc: "Rank-ordered matches, daily tasks, AI web-sourced salary ranges and explicit mismatch alerts.",
      src: "/report/career-deep-dive.png"
    },
    {
      title: "Page 11: 3-Year Action Plan",
      desc: "Phased execution milestones at 1 month, 6 months, 1 year and 3 years with family talking points.",
      src: "/report/execution-plan.png"
    }
  ];

  const faqs = [
    {
      q: "Who is this for?",
      a: "Students after Class 10 or 12, people choosing an MBA specialization and professionals thinking about a change. Parents are welcome to sit with their child."
    },
    {
      q: "How long does it take?",
      a: "Usually 20–25 minutes, at your own pace, on any phone, tablet or laptop."
    },
    {
      q: "Can it guarantee the right career?",
      a: "No. It gives you clarity and a shortlist to research. Your effort and real-world exploration do the rest."
    },
    {
      q: "How reliable are the salary figures?",
      a: "They are typical early and mid-career ranges, not campus outliers. Sources are listed in the methodology."
    },
    {
      q: "What if I’m not happy?",
      a: "Because the report is delivered instantly, purchases are generally final. If a technical error blocks you, contact us within 7 days for a reset or full refund."
    },
    {
      q: "Is my data safe?",
      a: "Your answers stay in your private dashboard. See our privacy policy."
    }
  ];

  const articles = [
    {
      slug: "pcm-vs-commerce-2026",
      meta: "Stream choice · 5 min read",
      title: "Science (PCM) vs Commerce in the age of AI",
      desc: "Why advice based on marks and peers often ends in regret, and what to look at instead.",
      image: "/images/blog_pcm_vs_commerce.jpg",
      imageAlt: "Science PCM vs Commerce study desk flatlay"
    },
    {
      slug: "ai-resilience-careers",
      meta: "AI and careers · 7 min read",
      title: "Which careers have a genuine human moat?",
      desc: "How we think about which careers hold up as AI changes the work.",
      image: "/images/blog_ai_resilience.jpg",
      imageAlt: "Architectural design studio workspace"
    },
    {
      slug: "parent-conversations-guide",
      meta: "For parents · 4 min read",
      title: "How to talk to your parents about non-traditional careers",
      desc: "Practical scripts to turn dinner-table arguments into a calm decision.",
      image: "/images/blog_parent_conversations.jpg",
      imageAlt: "Warm collaborative family career discussion"
    }
  ];

  return (
    <div className="min-h-screen bg-[var(--brand-bg)] text-[var(--brand-ink)] font-sans selection:bg-[#A9D2FF] selection:text-[#002058]">
      
      {/* ========================================================= */}
      {/* 1. STICKY HEADER / NAVIGATION                             */}
      {/* ========================================================= */}
      <header 
        id="hd"
        className={`sticky top-0 z-40 bg-[var(--brand-bg)]/90 backdrop-blur-md transition-shadow duration-300 ${
          headerScrolled ? "shadow-[0_1px_0_var(--brand-line)]" : ""
        }`}
      >
        <div className="w-redesign flex items-center justify-between h-[68px]">
          {/* Logo */}
          <Link href={user ? "/dashboard" : "/"} className="flex items-center gap-2.5 transition-transform hover:scale-102">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 dark:bg-sky-950/50 border border-sky-200 dark:border-sky-500/25 shadow-xs p-1.5">
              <Image src="/what_after_logo_blue.png" alt="WhatAfter Logo" width={28} height={28} className="object-contain" priority />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-950 dark:text-white">
              What<span className="text-sky-600 dark:text-sky-400 font-extrabold">After</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="flex items-center gap-4 sm:gap-6">
            <a href="#stages" className="hidden md:inline-block text-[0.95rem] font-medium text-[var(--brand-muted)] hover:text-[var(--brand-ink)] transition-colors">
              Who it’s for
            </a>
            <a href="#report" className="hidden md:inline-block text-[0.95rem] font-medium text-[var(--brand-muted)] hover:text-[var(--brand-ink)] transition-colors">
              Sample report
            </a>
            <a href="#pricing" className="hidden md:inline-block text-[0.95rem] font-medium text-[var(--brand-muted)] hover:text-[var(--brand-ink)] transition-colors">
              Pricing
            </a>
            <a href="#faq" className="hidden md:inline-block text-[0.95rem] font-medium text-[var(--brand-muted)] hover:text-[var(--brand-ink)] transition-colors">
              FAQ
            </a>

            {/* Dark Mode Toggle on Top Right */}
            <ThemeToggle />

            {user ? (
              <Link 
                href="/dashboard"
                className="btn-pri !py-2 !px-4 !text-sm"
              >
                Dashboard
              </Link>
            ) : (
              <div className="flex items-center gap-3">
                <Link 
                  href="/login"
                  className="hidden sm:inline-block text-sm font-semibold text-[var(--brand-muted)] hover:text-[var(--brand-ink)]"
                >
                  Log in
                </Link>
                <Link 
                  href="/signup"
                  className="btn-pri !py-2 !px-4.5 !text-sm"
                >
                  Start now
                </Link>
              </div>
            )}
          </nav>
        </div>
      </header>

      <main id="top">

        {/* ========================================================= */}
        {/* 2. HERO SECTION WITH INTERACTIVE SCENARIO WIDGET          */}
        {/* ========================================================= */}
        <section className="pt-8 sm:pt-16 pb-16 sm:pb-24">
          <div className="w-redesign grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-14 items-center">
            
            {/* Left Column: Headlines & CTAs */}
            <div>
              <h1 className="font-heading font-extrabold text-[2.2rem] sm:text-[3.2rem] lg:text-[3.8rem] leading-[1.08] tracking-tight text-[var(--brand-ink)]">
                Don’t pick your stream on <span className="highlight-ink">other people’s advice.</span>
              </h1>
              
              <p className="mt-5 sm:mt-6 text-[1.1rem] text-[var(--brand-muted)] leading-relaxed max-w-[54ch]">
                Answer 80 real-life scenarios in about 25 minutes. Get a personalised 15-page report with career matches, roles to avoid and a 3-year plan. Made for students, parents and career switchers.
              </p>

              <div className="mt-7 sm:mt-8 flex flex-wrap items-center gap-3.5">
                <Link href="/signup" className="btn-pri">
                  <span>Find my career fit — ₹999</span>
                  <span className="ar font-bold">→</span>
                </Link>
                <a href="#report" className="btn-sec">
                  See a sample report
                </a>
              </div>

              {/* Facts list with bold checkmarks */}
              <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-7 text-sm font-medium text-[var(--brand-muted)] list-none p-0">
                <li className="flex items-center gap-1.5">
                  <span className="font-bold text-[var(--brand-ink)]">✓</span> English &amp; हिंदी
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="font-bold text-[var(--brand-ink)]">✓</span> No right or wrong answers
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="font-bold text-[var(--brand-ink)]">✓</span> Report ready instantly
                </li>
              </ul>
            </div>

            {/* Right Column: Interactive Scenario Card */}
            <div 
              className="bg-[var(--brand-card)] border-2 border-[var(--brand-ink)] rounded-[24px] p-6 sm:p-7 shadow-[8px_8px_0_var(--brand-navy)]"
              aria-live="polite"
            >
              <div className="text-xs font-bold uppercase tracking-wider text-[var(--brand-muted)] mb-2">
                <span>Try 1 of 80 scenarios</span>
              </div>

              <h3 className="font-heading font-bold text-lg sm:text-[1.3rem] text-[var(--brand-ink)] leading-snug my-2.5 mb-4">
                Group project, deadline tomorrow. What do you do first?
              </h3>

              {/* Options */}
              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={() => handleSelectScenario(0, [85, 30, 90])}
                  className={`w-full text-left p-3.5 sm:px-4 rounded-[14px] border-2 font-medium text-sm sm:text-base transition-all ${
                    selectedOption === 0
                      ? "bg-[var(--brand-accent)] text-[var(--brand-on-accent)] border-[var(--brand-accent)] shadow-xs"
                      : "border-[var(--brand-line)] hover:border-[var(--brand-ink)] hover:translate-x-1 text-[var(--brand-ink)] bg-transparent"
                  }`}
                  aria-pressed={selectedOption === 0}
                >
                  Make a checklist and split the tasks
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectScenario(1, [35, 85, 40])}
                  className={`w-full text-left p-3.5 sm:px-4 rounded-[14px] border-2 font-medium text-sm sm:text-base transition-all ${
                    selectedOption === 1
                      ? "bg-[var(--brand-accent)] text-[var(--brand-on-accent)] border-[var(--brand-accent)] shadow-xs"
                      : "border-[var(--brand-line)] hover:border-[var(--brand-ink)] hover:translate-x-1 text-[var(--brand-ink)] bg-transparent"
                  }`}
                  aria-pressed={selectedOption === 1}
                >
                  Brainstorm wild ideas with the team
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectScenario(2, [70, 15, 60])}
                  className={`w-full text-left p-3.5 sm:px-4 rounded-[14px] border-2 font-medium text-sm sm:text-base transition-all ${
                    selectedOption === 2
                      ? "bg-[var(--brand-accent)] text-[var(--brand-on-accent)] border-[var(--brand-accent)] shadow-xs"
                      : "border-[var(--brand-line)] hover:border-[var(--brand-ink)] hover:translate-x-1 text-[var(--brand-ink)] bg-transparent"
                  }`}
                  aria-pressed={selectedOption === 2}
                >
                  Quietly fix the hardest part myself
                </button>
              </div>

              {/* Trait Continuum Bars */}
              {showBars && (
                <div className="mt-5 pt-4 border-t border-[var(--brand-line)] animate-fadeIn">
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs font-bold text-[var(--brand-ink)] mb-1">
                        <span>Analytical → Intuitive</span>
                        <span className="font-mono text-slate-500">{barValues[0]}%</span>
                      </div>
                      <div className="h-2.5 rounded-full bg-[var(--brand-line)] overflow-hidden">
                        <div 
                          className="h-full bg-[var(--brand-navy)] rounded-full transition-all duration-700 ease-out"
                          style={{ width: `${barValues[0]}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-bold text-[var(--brand-ink)] mb-1">
                        <span>Solo → Collaborative</span>
                        <span className="font-mono text-slate-500">{barValues[1]}%</span>
                      </div>
                      <div className="h-2.5 rounded-full bg-[var(--brand-line)] overflow-hidden">
                        <div 
                          className="h-full bg-[var(--brand-navy)] rounded-full transition-all duration-700 ease-out"
                          style={{ width: `${barValues[1]}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-bold text-[var(--brand-ink)] mb-1">
                        <span>Flexible → Structured</span>
                        <span className="font-mono text-slate-500">{barValues[2]}%</span>
                      </div>
                      <div className="h-2.5 rounded-full bg-[var(--brand-line)] overflow-hidden">
                        <div 
                          className="h-full bg-[var(--brand-navy)] rounded-full transition-all duration-700 ease-out"
                          style={{ width: `${barValues[2]}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <p className="mt-4 text-xs text-[var(--brand-muted)] leading-relaxed italic">
                    That’s one answer. Your report reads patterns across all 80 to map your full working style profile.
                  </p>
                </div>
              )}
            </div>

          </div>
        </section>


        {/* ========================================================= */}
        {/* 3. NOISE SECTION: The Decision is Still Yours to Live With */}
        {/* ========================================================= */}
        <section className="dark-brand-section py-16 sm:py-24">
          <div className="w-redesign">
            
            <h2 className="font-heading font-extrabold text-[1.8rem] sm:text-[2.6rem] leading-[1.18] text-white max-w-[28ch]">
              Everyone has advice. The decision is still yours to live with.
            </h2>

            {/* 4 Dialogue Quote Cards with click tilt */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 my-10 sm:my-12">
              {[
                {
                  quote: "“Science le lo. Options zyada hain.”",
                  source: "Relatives, after 10th"
                },
                {
                  quote: "“MBA se career boost milega.”",
                  source: "Seniors, after graduation"
                },
                {
                  quote: "“Sarkari naukri karo. Life set.”",
                  source: "Parents, always"
                },
                {
                  quote: "“IT mein chale jao. Future wahi hai.”",
                  source: "Friends and the internet"
                }
              ].map((item, idx) => {
                const isSelected = activeTiltedQuote === idx;
                const isEven = idx % 2 === 1;
                const tiltClass = isSelected
                  ? isEven
                    ? "tilted-even"
                    : "tilted-odd"
                  : "";

                return (
                  <div
                    key={idx}
                    role="button"
                    tabIndex={0}
                    onClick={() => setActiveTiltedQuote(isSelected ? null : idx)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setActiveTiltedQuote(isSelected ? null : idx);
                      }
                    }}
                    className={`qc flex flex-col justify-between cursor-pointer ${tiltClass}`}
                  >
                    <p className="font-heading font-bold text-lg sm:text-[1.18rem] text-white leading-snug mb-5">
                      {item.quote}
                    </p>
                    <span className="text-xs sm:text-[0.82rem] font-semibold text-[#7AAEF4]">
                      {item.source}
                    </span>
                  </div>
                );
              })}
            </div>

            <p className="lead-text text-base sm:text-lg max-w-[56ch] leading-relaxed text-[#C6DBF3]">
              You don’t have too few options. You have no clear way to compare them. WhatAfter gives you one.
            </p>

          </div>
        </section>


        {/* ========================================================= */}
        {/* 4. CAREER STAGES SECTION (Interactive Tabbed Panel)       */}
        {/* ========================================================= */}
        <section id="stages" className="py-16 sm:py-24">
          <div className="w-redesign">
            
            <h2 className="font-heading font-extrabold text-[1.8rem] sm:text-[2.8rem] text-[var(--brand-ink)] leading-tight">
              Where are you right now?
            </h2>
            <p className="text-[1.1rem] text-[var(--brand-muted)] mt-2.5 max-w-[56ch]">
              Pick your stage. The report is built around the decision in front of you.
            </p>

            {/* Tab Buttons */}
            <div className="flex flex-wrap gap-3 sm:gap-4 mt-8 mb-8" role="tablist">
              {(["stream", "degree", "mba", "change"] as const).map((key) => {
                const stage = STAGES[key];
                const isActive = activeStage === key;
                return (
                  <button
                    key={key}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => {
                      setIsStagePaused(true);
                      setActiveStage(key);
                    }}
                    className={`py-2.5 px-5 sm:px-6 rounded-full border-2 font-bold text-sm sm:text-[0.95rem] transition-all cursor-pointer ${
                      isActive 
                        ? "bg-[var(--brand-navy)] text-white border-[var(--brand-navy)] shadow-sm scale-[1.02]" 
                        : "bg-[var(--brand-card)] text-[var(--brand-ink)] border-[var(--brand-line)] hover:border-[var(--brand-ink)]"
                    }`}
                  >
                    {stage.badge}
                  </button>
                );
              })}
            </div>

            {/* Interactive Panel Content */}
            {(() => {
              const current = STAGES[activeStage];
              return (
                <div 
                  className="bg-[var(--brand-card)] rounded-[28px] p-6 sm:p-10 border border-[var(--brand-line)] grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 sm:gap-10 items-center shadow-xs"
                  role="tabpanel"
                >
                  {/* Left Column: Stage Details */}
                  <div>
                    <h3 className="font-heading font-bold text-2xl sm:text-3xl text-[var(--brand-ink)] leading-snug">
                      {current.title}
                    </h3>
                    <p className="text-[var(--brand-muted)] mt-3 mb-5 leading-relaxed text-base sm:text-[1.05rem]">
                      {current.desc}
                    </p>

                    {/* Chips */}
                    <div className="flex flex-wrap gap-2 mb-7">
                      {current.chips.map((chip, idx) => (
                        <span 
                          key={idx}
                          className="px-3.5 py-1.5 rounded-full bg-[var(--brand-bg)] border border-[var(--brand-line)] text-xs sm:text-sm font-semibold text-[var(--brand-ink)]"
                        >
                          {chip}
                        </span>
                      ))}
                    </div>

                    <Link href={current.href} className="btn-pri">
                      <span>{current.cta}</span>
                      <span className="ar font-bold">→</span>
                    </Link>
                  </div>

                  {/* Right Column: Stage Real Illustration Card */}
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-[var(--brand-line)] shadow-md group bg-[var(--brand-bg)]">
                    <Image
                      src={current.image}
                      alt={current.imageAlt}
                      fill
                      className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
                      sizes="(max-width: 1024px) 100vw, 45vw"
                      priority={activeStage === "stream"}
                    />
                  </div>

                </div>
              );
            })()}

          </div>
        </section>


        {/* ========================================================= */}
        {/* 5. HOW IT WORKS: Three Steps. No Exam Stress.             */}
        {/* ========================================================= */}
        <section id="how" className="pt-0 pb-16 sm:pb-24">
          <div className="w-redesign">
            
            <h2 className="font-heading font-extrabold text-[1.8rem] sm:text-[2.8rem] text-[var(--brand-ink)] leading-tight">
              Three steps. No exam stress.
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-10">
              
              {/* Step 1 */}
              <div className="bg-[var(--brand-card)] rounded-[24px] p-7 border border-[var(--brand-line)] relative hover:-translate-y-1.5 hover:shadow-[0_14px_0_-6px_var(--brand-accent)] transition-all">
                <div className="w-11 h-11 rounded-full bg-[var(--brand-accent)] text-white flex items-center justify-center font-heading font-extrabold text-xl mb-4 shadow-xs">
                  1
                </div>
                <h3 className="font-heading font-bold text-xl text-[var(--brand-ink)] leading-snug">
                  Play through 80 scenarios
                </h3>
                <p className="text-sm sm:text-[0.95rem] text-[var(--brand-muted)] mt-2.5 leading-relaxed">
                  Everyday school, college and work situations. Pick what you’d actually do. About 25 minutes on any phone or laptop.
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-[var(--brand-card)] rounded-[24px] p-7 border border-[var(--brand-line)] relative hover:-translate-y-1.5 hover:shadow-[0_14px_0_-6px_var(--brand-accent)] transition-all">
                <div className="w-11 h-11 rounded-full bg-[var(--brand-accent)] text-white flex items-center justify-center font-heading font-extrabold text-xl mb-4 shadow-xs">
                  2
                </div>
                <h3 className="font-heading font-bold text-xl text-[var(--brand-ink)] leading-snug">
                  See your patterns
                </h3>
                <p className="text-sm sm:text-[0.95rem] text-[var(--brand-muted)] mt-2.5 leading-relaxed">
                  We map how you think and work, then match you to 120+ roles: primary, secondary and wildcard picks.
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-[var(--brand-card)] rounded-[24px] p-7 border border-[var(--brand-line)] relative hover:-translate-y-1.5 hover:shadow-[0_14px_0_-6px_var(--brand-accent)] transition-all">
                <div className="w-11 h-11 rounded-full bg-[var(--brand-accent)] text-white flex items-center justify-center font-heading font-extrabold text-xl mb-4 shadow-xs">
                  3
                </div>
                <h3 className="font-heading font-bold text-xl text-[var(--brand-ink)] leading-snug">
                  Plan your next move
                </h3>
                <p className="text-sm sm:text-[0.95rem] text-[var(--brand-muted)] mt-2.5 leading-relaxed">
                  Get your roadmap and talking points for the family conversation. Walk in with answers, not arguments.
                </p>
              </div>

            </div>

          </div>
        </section>


        {/* ========================================================= */}
        {/* 6. SAMPLE REPORT & DELIVERABLES: See Exactly What You Buy  */}
        {/* ========================================================= */}
        <section id="report" className="py-16 sm:py-24 bg-[#EBF2FC]/70 dark:bg-[#071E47]/60 border-y border-[var(--brand-line)]">
          <div className="w-redesign grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            
            {/* Left Column: Deliverables Checklist */}
            <div>
              <h2 className="font-heading font-extrabold text-[1.8rem] sm:text-[2.8rem] text-[var(--brand-ink)] leading-tight">
                See exactly what you’re buying.
              </h2>

              <ul className="list-none p-0 my-6 sm:my-7 space-y-2.5">
                <li className="flex items-start gap-3 p-3.5 sm:p-4 rounded-[16px] bg-[var(--brand-card)] border border-[var(--brand-line)] hover:translate-x-1.5 transition-transform">
                  <span className="text-[var(--brand-accent)] font-bold text-lg leading-none mt-0.5">✦</span>
                  <div>
                    <b className="text-[var(--brand-ink)] font-bold block text-base">Your work-style profile</b>
                    <span className="text-[var(--brand-muted)] text-sm">Where you thrive and what drains your energy.</span>
                  </div>
                </li>

                <li className="flex items-start gap-3 p-3.5 sm:p-4 rounded-[16px] bg-[var(--brand-card)] border border-[var(--brand-line)] hover:translate-x-1.5 transition-transform">
                  <span className="text-[var(--brand-accent)] font-bold text-lg leading-none mt-0.5">✦</span>
                  <div>
                    <b className="text-[var(--brand-ink)] font-bold block text-base">Career matches and eliminations</b>
                    <span className="text-[var(--brand-muted)] text-sm">What to explore, and what to cross off early with clear reasons.</span>
                  </div>
                </li>

                <li className="flex items-start gap-3 p-3.5 sm:p-4 rounded-[16px] bg-[var(--brand-card)] border border-[var(--brand-line)] hover:translate-x-1.5 transition-transform">
                  <span className="text-[var(--brand-accent)] font-bold text-lg leading-none mt-0.5">✦</span>
                  <div>
                    <b className="text-[var(--brand-ink)] font-bold block text-base">Salary ranges and 3-year plan</b>
                    <span className="text-[var(--brand-muted)] text-sm">Actionable milestones at 1 month, 6 months, 1 year, and 3 years.</span>
                  </div>
                </li>

                <li className="flex items-start gap-3 p-3.5 sm:p-4 rounded-[16px] bg-[var(--brand-card)] border border-[var(--brand-line)] hover:translate-x-1.5 transition-transform">
                  <span className="text-[var(--brand-accent)] font-bold text-lg leading-none mt-0.5">✦</span>
                  <div>
                    <b className="text-[var(--brand-ink)] font-bold block text-base">Family discussion prompts</b>
                    <span className="text-[var(--brand-muted)] text-sm">Calm, non-judgmental talking points for parents and mentors.</span>
                  </div>
                </li>
              </ul>

              <Link href="/signup" className="btn-pri">
                <span>Get my report</span>
                <span className="ar font-bold">→</span>
              </Link>
            </div>

            {/* Right Column: Real Dossier Carousel Preview with Zoom */}
            <div className="bg-[var(--brand-card)] border-2 border-[var(--brand-ink)] rounded-[24px] p-5 sm:p-6 shadow-[8px_8px_0_var(--brand-navy)] dark:shadow-[8px_8px_0_#0F387E] flex flex-col justify-between">
              
              {/* Carousel Tab Buttons */}
              <div className="flex items-center gap-2 pb-4 border-b border-[var(--brand-line)] overflow-x-auto">
                {reportPages.map((page, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setIsReportPaused(true);
                      setActiveReportPage(idx);
                    }}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                      activeReportPage === idx
                        ? "bg-[var(--brand-navy)] dark:bg-[var(--brand-accent)] text-white dark:text-[#00123A] shadow-xs"
                        : "bg-[var(--brand-bg)] text-[var(--brand-muted)] hover:text-[var(--brand-ink)]"
                    }`}
                  >
                    Page {idx === 0 ? "03" : idx === 1 ? "07" : "11"}
                  </button>
                ))}
              </div>

              {/* Active Page Preview with Lightbox Trigger */}
              <div className="relative mt-4 group">
                <div 
                  onClick={() => {
                    setIsReportPaused(true);
                    setZoomImage(reportPages[activeReportPage].src);
                  }}
                  className="relative aspect-[3/4] max-h-[420px] w-full rounded-xl overflow-hidden border border-[var(--brand-line)] cursor-zoom-in bg-white dark:bg-[#040C1A] flex items-center justify-center shadow-inner"
                >
                  <Image
                    src={reportPages[activeReportPage].src}
                    alt={reportPages[activeReportPage].title}
                    fill
                    className="object-contain p-2"
                    sizes="(max-width: 768px) 100vw, 500px"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="px-3 py-1.5 rounded-full bg-white text-xs font-bold text-slate-900 shadow-md flex items-center gap-1.5">
                      <ZoomIn className="w-3.5 h-3.5" /> Tap to zoom
                    </span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </section>


        {/* ========================================================= */}
        {/* 7. TRUST & BOUNDARIES: Honest About What It Can & Can't Do */}
        {/* ========================================================= */}
        <section className="py-16 sm:py-24">
          <div className="w-redesign">
            
            <h2 className="font-heading font-extrabold text-[1.8rem] sm:text-[2.8rem] text-[var(--brand-ink)] leading-tight">
              Honest about what it can and can’t do.
            </h2>

            {/* 3 Core Principles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-9">
              
              <div className="p-6 rounded-[24px] bg-[var(--brand-card)] border border-[var(--brand-line)]">
                <h3 className="font-heading font-bold text-lg text-[var(--brand-ink)] mb-2">
                  Everyday scenarios
                </h3>
                <p className="text-sm text-[var(--brand-muted)] leading-relaxed">
                  Not an IQ or marks test. It looks at how you naturally work and decide.
                </p>
              </div>

              <div className="p-6 rounded-[24px] bg-[var(--brand-card)] border border-[var(--brand-line)]">
                <h3 className="font-heading font-bold text-lg text-[var(--brand-ink)] mb-2">
                  Spectrums, not labels
                </h3>
                <p className="text-sm text-[var(--brand-muted)] leading-relaxed">
                  You’re not forced into a 4–letter type. Traits sit on a sliding scale and can grow.
                </p>
              </div>

              <div className="p-6 rounded-[24px] bg-[var(--brand-card)] border border-[var(--brand-line)]">
                <h3 className="font-heading font-bold text-lg text-[var(--brand-ink)] mb-2">
                  Sources you can check
                </h3>
                <p className="text-sm text-[var(--brand-muted)] leading-relaxed">
                  Salary figures are queried live via AI web search for typical realistic bands.{" "}
                  <Link href="/methodology" className="text-[var(--brand-accent)] font-semibold underline hover:text-[var(--brand-navy)]">
                    Read our methodology
                  </Link>.
                </p>
              </div>

            </div>

            {/* Side-by-Side Boundaries (Can vs Can't) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              
              <div className="p-6 rounded-[20px] border-2 border-[var(--brand-ink)] bg-[var(--brand-accent)] text-white">
                <b className="font-heading font-bold text-lg block mb-1.5 flex items-center gap-1.5">
                  <span>✓</span> It can
                </b>
                <p className="text-sm text-white/95 leading-relaxed">
                  Show where you fit, surface options you hadn’t considered and give you better questions for mentors.
                </p>
              </div>

              <div className="p-6 rounded-[20px] border-2 border-[var(--brand-ink)] bg-[var(--brand-card)] text-[var(--brand-ink)]">
                <b className="font-heading font-bold text-lg block mb-1.5 flex items-center gap-1.5 text-rose-600">
                  <span>✕</span> It can’t
                </b>
                <p className="text-sm text-[var(--brand-muted)] leading-relaxed">
                  Guarantee a job, predict earnings or decide for you. That stays with you.
                </p>
              </div>

            </div>

          </div>
        </section>


        {/* ========================================================= */}
        {/* 8. WHAT STUDENTS AND PARENTS SAY: Transparent Reflections  */}
        {/* ========================================================= */}
        <section className="pt-0 pb-16 sm:pb-24">
          <div className="w-redesign">
            
            <h2 className="font-heading font-extrabold text-[1.8rem] sm:text-[2.8rem] text-[var(--brand-ink)] leading-tight mb-8">
              What students and parents say.
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              
              <figure className="m-0 p-6 rounded-[24px] bg-[var(--brand-card)] border border-[var(--brand-line)] flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-full bg-sky-100 border border-sky-300 text-sky-800 font-bold flex items-center justify-center text-xs mb-3.5">
                    10th
                  </div>
                  <blockquote className="m-0 mb-3 font-medium text-sm sm:text-base text-[var(--brand-ink)] leading-snug">
                    &ldquo;My family wanted me to choose Science PCM automatically. Having the trait report showed my parents that economics and corporate law fit how I actually think.&rdquo;
                  </blockquote>
                </div>
                <figcaption className="text-xs text-[var(--brand-muted)] font-medium pt-2 border-t border-[var(--brand-line)]">
                  Student Reflection · Delhi · After 10th
                </figcaption>
              </figure>

              <figure className="m-0 p-6 rounded-[24px] bg-[var(--brand-card)] border border-[var(--brand-line)] flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 font-bold flex items-center justify-center text-xs mb-3.5">
                    Family
                  </div>
                  <blockquote className="m-0 mb-3 font-medium text-sm sm:text-base text-[var(--brand-ink)] leading-snug">
                    &ldquo;Instead of another tense dinner table argument about marks, the report gave us neutral talking points. It made discussing non-traditional degrees calm and constructive.&rdquo;
                  </blockquote>
                </div>
                <figcaption className="text-xs text-[var(--brand-muted)] font-medium pt-2 border-t border-[var(--brand-line)]">
                  Parent Discussion · Bengaluru · College Prep
                </figcaption>
              </figure>

              <figure className="m-0 p-6 rounded-[24px] bg-[var(--brand-card)] border border-[var(--brand-line)] flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-full bg-indigo-100 border border-indigo-300 text-indigo-800 font-bold flex items-center justify-center text-xs mb-3.5">
                    Work
                  </div>
                  <blockquote className="m-0 mb-3 font-medium text-sm sm:text-base text-[var(--brand-ink)] leading-snug">
                    &ldquo;After three years in IT operations, I felt burnt out. The report helped me see that product management and UX research utilized my strengths without starting from zero.&rdquo;
                  </blockquote>
                </div>
                <figcaption className="text-xs text-[var(--brand-muted)] font-medium pt-2 border-t border-[var(--brand-line)]">
                  Early Professional · Pune · Career Pivot
                </figcaption>
              </figure>

            </div>

          </div>
        </section>


        {/* ========================================================= */}
        {/* 9. JOURNAL SECTION: Read Before You Decide                */}
        {/* ========================================================= */}
        <section id="journal" className="pt-0 pb-16 sm:pb-24">
          <div className="w-redesign">
            
            <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
              <div>
                <h2 className="font-heading font-extrabold text-[1.8rem] sm:text-[2.8rem] text-[var(--brand-ink)] leading-tight">
                  Read before you decide.
                </h2>
              </div>
              <Link href="/blog" className="btn-sec !py-2 !px-4 !text-sm">
                <span>Read all articles</span>
                <span className="ar font-bold">→</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {articles.map((art) => (
                <Link
                  key={art.slug}
                  href={`/blog/${art.slug}`}
                  className="group bg-[var(--brand-card)] border border-[var(--brand-line)] rounded-[24px] overflow-hidden hover:-translate-y-1.5 hover:shadow-[0_12px_0_-6px_var(--brand-accent)] transition-all flex flex-col justify-between"
                >
                  {/* Article Cover Visual */}
                  <div className="relative w-full aspect-[16/9] overflow-hidden border-b border-[var(--brand-line)] bg-slate-100">
                    <Image
                      src={art.image}
                      alt={art.imageAlt}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>

                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <small className="text-xs text-[var(--brand-muted)] font-medium block mb-2">
                        {art.meta}
                      </small>
                      <h3 className="font-heading font-bold text-base sm:text-[1.1rem] text-[var(--brand-ink)] group-hover:text-[var(--brand-accent)] transition-colors leading-snug mb-2">
                        {art.title}
                      </h3>
                      <p className="text-xs sm:text-[0.93rem] text-[var(--brand-muted)] leading-relaxed">
                        {art.desc}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

          </div>
        </section>


        {/* ========================================================= */}
        {/* 10. PRICING SECTION: One Price. Nothing Hidden.           */}
        {/* ========================================================= */}
        <section id="pricing" className="dark-brand-section py-16 sm:py-24">
          <div className="w-redesign grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            
            {/* Left Column: Context & Guarantees */}
            <div>
              <h2 className="font-heading font-extrabold text-[2.2rem] sm:text-[3.2rem] text-white leading-[1.12]">
                One price. Nothing hidden.
              </h2>
              <div className="space-y-1.5 mt-4 text-[1.05rem] text-[#C6DBF3] leading-relaxed">
                <p>A single counselling session often costs several thousand rupees.</p>
                <p>The wrong degree can cost lakhs and years.</p>
              </div>

              <div className="space-y-5 mt-8">
                <div>
                  <h3 className="font-heading font-bold text-lg text-white mb-1">
                    Start right away
                  </h3>
                  <p className="text-sm text-[#C6DBF3] leading-relaxed">
                    Sign up, pay and begin. No waiting for an appointment.
                  </p>
                </div>

                <div>
                  <h3 className="font-heading font-bold text-lg text-white mb-1">
                    Report in seconds
                  </h3>
                  <p className="text-sm text-[#C6DBF3] leading-relaxed">
                    Read it on your dashboard or download the PDF anytime.
                  </p>
                </div>

                <div>
                  <h3 className="font-heading font-bold text-lg text-white mb-1">
                    If something breaks, we fix it
                  </h3>
                  <p className="text-sm text-[#C6DBF3] leading-relaxed">
                    A technical error stops you finishing? Write to us within 7 days for a reset or full refund.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Pricing Card */}
            <div className="pricing-card-redesign">
              <div className="flex items-baseline gap-2.5">
                <span className="font-heading font-extrabold text-5xl sm:text-6xl text-[#002058] tracking-tight">
                  ₹999
                </span>
                <span className="text-sm text-slate-500 font-bold tracking-tight">
                  one-time
                </span>
              </div>

              <ul className="list-none p-0 my-7 space-y-3 text-[0.92rem] text-[#002058]">
                <li className="flex items-start gap-3">
                  <span className="font-bold text-[#002058] shrink-0 text-sm mt-0.5">✓</span>
                  <span>80-scenario assessment, English &amp; हिंदी</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-bold text-[#002058] shrink-0 text-sm mt-0.5">✓</span>
                  <span>15-page personalised PDF report</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-bold text-[#002058] shrink-0 text-sm mt-0.5">✓</span>
                  <span>Primary, secondary and wildcard career matches</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-bold text-[#002058] shrink-0 text-sm mt-0.5">✓</span>
                  <span>Roles to avoid, with reasons</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-bold text-[#002058] shrink-0 text-sm mt-0.5">✓</span>
                  <span>Salary ranges and a 3-year action plan</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-bold text-[#002058] shrink-0 text-sm mt-0.5">✓</span>
                  <span>Family and mentor discussion prompts</span>
                </li>
              </ul>

              <Link 
                href="/signup" 
                className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-full bg-[#0B63E0] hover:bg-[#0954be] text-white font-bold text-base shadow-sm transition-all hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Get started</span>
                <span className="font-bold">→</span>
              </Link>

              {/* Payment Visuals & Info */}
              <div className="mt-4 flex flex-col items-center gap-2">
                <div className="flex items-center justify-center gap-2 text-slate-400">
                  {/* UPI badge icon */}
                  <span className="inline-flex items-center px-2 py-0.5 rounded border border-slate-200 bg-slate-50 text-[10px] font-bold tracking-wider text-slate-700 uppercase">
                    UPI
                  </span>
                  {/* Card Icon */}
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-slate-200 bg-slate-50 text-[10px] font-semibold text-slate-700">
                    <svg className="w-3.5 h-3.5 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="20" height="14" x="2" y="5" rx="2" />
                      <line x1="2" x2="22" y1="10" y2="10" />
                    </svg>
                    Cards
                  </span>
                  {/* Netbanking Icon */}
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-slate-200 bg-slate-50 text-[10px] font-semibold text-slate-700">
                    <svg className="w-3.5 h-3.5 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="3" x2="21" y1="21" y2="21" />
                      <line x1="6" x2="6" y1="11" />
                      <line x1="10" x2="10" y1="11" />
                      <line x1="14" x2="14" y1="11" />
                      <line x1="18" x2="18" y1="11" />
                      <polygon points="12 3 2 8 22 8 12 3" />
                    </svg>
                    Net Banking
                  </span>
                </div>
                <small className="text-center text-xs text-slate-500 font-medium">
                  No subscription · 100% secure payment
                </small>
              </div>
            </div>

          </div>
        </section>


        {/* ========================================================= */}
        {/* 11. FAQ SECTION: Quick Answers                            */}
        {/* ========================================================= */}
        <section id="faq" className="py-16 sm:py-24">
          <div className="w-redesign max-w-[760px] mx-auto">
            
            <h2 className="font-heading font-extrabold text-[1.8rem] sm:text-[2.8rem] text-[var(--brand-ink)] leading-tight mb-7 text-center sm:text-left">
              Quick answers.
            </h2>

            {/* Structured Data for SEO / AEO */}
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "FAQPage",
                  "mainEntity": faqs.map((f) => ({
                    "@type": "Question",
                    "name": f.q,
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": f.a
                    }
                  }))
                })
              }}
            />

            <div className="space-y-2.5">
              {faqs.map((faq, i) => {
                const isOpen = openFaq === i;
                return (
                  <div
                    key={i}
                    className={`rounded-[18px] border bg-[var(--brand-card)] transition-colors overflow-hidden ${
                      isOpen ? "border-[var(--brand-ink)]" : "border-[var(--brand-line)]"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-ans-${i}`}
                      className="w-full text-left px-5 sm:px-6 py-4.5 sm:py-5 flex items-center justify-between font-bold text-base sm:text-lg text-[var(--brand-ink)] cursor-pointer"
                    >
                      <span className="pr-4">{faq.q}</span>
                      <span className={`font-heading font-extrabold text-xl text-[var(--brand-muted)] transition-transform duration-200 shrink-0 ${
                        isOpen ? "rotate-45" : ""
                      }`}>
                        +
                      </span>
                    </button>

                    <div
                      id={`faq-ans-${i}`}
                      role="region"
                      className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
                        isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <p className="px-5 sm:px-6 pb-5 text-sm sm:text-base text-[var(--brand-muted)] leading-relaxed border-t border-[var(--brand-line)] pt-3.5">
                          {faq.q === "Is my data safe?" ? (
                            <>
                              Your answers stay in your private dashboard. See our{" "}
                              <Link href="/privacy" className="text-[var(--brand-accent)] font-semibold underline hover:text-[var(--brand-navy)]">
                                privacy policy
                              </Link>.
                            </>
                          ) : (
                            faq.a
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </section>


        {/* ========================================================= */}
        {/* 12. FINAL CTA SECTION: You don’t need whole future figured */}
        {/* ========================================================= */}
        <section className="dark-brand-section py-20 sm:py-28 text-center">
          <div className="w-redesign max-w-3xl mx-auto">
            
            <p className="font-heading font-semibold text-base sm:text-xl text-[#C6DBF3] max-w-[36ch] mx-auto mb-6 leading-snug">
              &ldquo;You cannot remove every uncertainty from your future. But you can make your next decision more informed.&rdquo;
            </p>

            <h2 className="font-heading font-extrabold text-3xl sm:text-5xl text-white tracking-tight leading-tight mb-4">
              You don’t need your whole future figured out.
            </h2>

            <p className="text-base sm:text-lg text-[#C6DBF3] max-w-lg mx-auto mb-8">
              Just a better, calmer way to make the next decision.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3.5">
              <Link href="/signup" className="btn-pri">
                <span>Find my career fit — ₹999</span>
                <span className="ar font-bold">→</span>
              </Link>
              <Link href="/methodology" className="btn-sec">
                Read the methodology
              </Link>
            </div>

          </div>
        </section>

      </main>


      {/* ========================================================= */}
      {/* 13. FOOTER: 3-Column Clean Platform Footer                */}
      {/* ========================================================= */}
      <footer className="dark-brand-section border-t border-white/15 py-12 sm:py-16 text-sm text-[#C6DBF3]">
        <div className="w-redesign">
          <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr_1fr] gap-10 mb-10">
            
            {/* Column 1: Brand & Contact */}
            <div>
              <Link href="#top" className="flex items-center gap-2.5 mb-3 transition-transform hover:scale-102">
                <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-sky-950/50 border border-sky-500/25 shadow-xs p-1">
                  <Image src="/what_after_logo_blue.png" alt="WhatAfter Logo" width={24} height={24} className="object-contain" />
                </div>
                <span className="text-xl font-bold tracking-tight text-white">
                  What<span className="text-sky-400 font-extrabold">After</span>
                </span>
              </Link>
              <p className="mt-3 text-xs sm:text-sm text-[#C6DBF3] max-w-[34ch] leading-relaxed">
                Helping students and families make sense of what comes next, from school to college and beyond. Practical ideas. No generic motivation.
              </p>
              <p className="mt-3 text-xs text-[#A9C0E0]">
                Help: <a href="mailto:careeright.edu@gmail.com" className="text-[#6CB6FF] hover:underline font-medium">careeright.edu@gmail.com</a>
              </p>
            </div>

            {/* Column 2: What After? (Stages) */}
            <div>
              <h4 className="font-heading font-bold text-white text-base mb-3">
                What after?
              </h4>
              <div className="flex flex-col space-y-2 text-xs sm:text-sm text-[#C6DBF3]">
                <a href="#stages" className="hover:text-[#6CB6FF] transition-colors">Choosing a stream</a>
                <a href="#stages" className="hover:text-[#6CB6FF] transition-colors">Choosing a degree</a>
                <a href="#stages" className="hover:text-[#6CB6FF] transition-colors">MBA specialization</a>
                <a href="#stages" className="hover:text-[#6CB6FF] transition-colors">Career change</a>
                <a href="#how" className="hover:text-[#6CB6FF] transition-colors">How it works</a>
              </div>
            </div>

            {/* Column 3: Platform Links */}
            <div>
              <h4 className="font-heading font-bold text-white text-base mb-3">
                Platform
              </h4>
              <div className="flex flex-col space-y-2 text-xs sm:text-sm text-[#C6DBF3]">
                <a href="#report" className="hover:text-[#6CB6FF] transition-colors">Inside the report</a>
                <Link href="/methodology" className="hover:text-[#6CB6FF] transition-colors">Methodology and trust</Link>
                <Link href="/blog" className="hover:text-[#6CB6FF] transition-colors">Journal</Link>
                <a href="#pricing" className="hover:text-[#6CB6FF] transition-colors">Pricing (₹999)</a>
                <a href="#faq" className="hover:text-[#6CB6FF] transition-colors">FAQs</a>
                <Link href="/privacy" className="hover:text-[#6CB6FF] transition-colors">Privacy policy</Link>
                <Link href="/login" className="hover:text-[#6CB6FF] transition-colors">Log in</Link>
              </div>
            </div>

          </div>

          <div className="pt-6 border-t border-white/15 text-xs text-[#A9C0E0] flex flex-col sm:flex-row items-center justify-between gap-3">
            <span>© {new Date().getFullYear()} WhatAfter. All rights reserved.</span>
            <span>Independent career decision-support platform.</span>
          </div>
        </div>
      </footer>


      {/* ========================================================= */}
      {/* 14. STICKY MOBILE CTA BAR                                 */}
      {/* ========================================================= */}
      <div className={`sticky-mobile-bar sm:hidden ${stickyVisible ? "active" : ""}`}>
        <Link href="/signup" className="btn-pri w-full justify-center !py-3.5 !text-base shadow-lg border-2 border-white">
          Find my career fit — ₹999
        </Link>
      </div>


      {/* ========================================================= */}
      {/* 15. LIGHTBOX ZOOM MODAL FOR REPORT PAGES                  */}
      {/* ========================================================= */}
      {zoomImage && (
        <div 
          onClick={() => setZoomImage(null)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out animate-fadeIn"
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full h-full flex flex-col items-center justify-center">
            <button
              onClick={() => setZoomImage(null)}
              className="absolute top-2 right-2 p-2 rounded-full bg-white/20 text-white hover:bg-white/40 transition-colors z-10"
              aria-label="Close Preview"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="relative w-full h-full">
              <Image
                src={zoomImage}
                alt="Enlarged Report Preview"
                fill
                className="object-contain"
                sizes="(max-width: 1200px) 100vw, 1200px"
              />
            </div>
            <p className="text-white/80 text-xs mt-2 font-mono">
              Tap anywhere outside or press close to exit
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
