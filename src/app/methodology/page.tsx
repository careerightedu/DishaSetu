import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import Navbar from "@/features/auth/components/Navbar";
import { 
  ArrowLeft, 
  ArrowRight, 
  Target, 
  Sliders, 
  Compass, 
  Database, 
  Cpu, 
  Scale, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle
} from "lucide-react";

export const metadata: Metadata = {
  title: {
    absolute: "Trust & Methodology | WhatAfter Career Assessment",
  },
  description:
    "A transparent, plain-language explanation of how WhatAfter measures work styles, interprets responses, maps career recommendations, retrieves current market salaries via AI web search, and maintains strict ethical boundaries.",
  alternates: {
    canonical: "https://whatafter.in/methodology",
  },
  openGraph: {
    title: "Trust & Methodology | WhatAfter Career Assessment",
    description:
      "A transparent, plain-language explanation of how WhatAfter measures work styles, interprets responses, maps career recommendations, retrieves current market salaries via AI web search, and maintains strict ethical boundaries.",
    url: "https://whatafter.in/methodology",
    siteName: "WhatAfter",
    locale: "en_IN",
    type: "website",
  },
};

export default function MethodologyPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#061019] text-slate-900 dark:text-[#f4efe6] font-sans selection:bg-sky-500/30 selection:text-sky-900 dark:selection:text-sky-200">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        
        {/* Back Link */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-sky-600 dark:text-slate-400 dark:hover:text-sky-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>

        {/* Page Hero */}
        <header className="mb-14 pb-10 border-b border-slate-200 dark:border-white/10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-700 dark:text-sky-300 text-xs font-semibold uppercase tracking-wider mb-4">
            <ShieldCheck className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
            <span>Full Disclosure &amp; Framework</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-950 dark:text-white tracking-tight leading-[1.15] mb-4">
            How WhatAfter Works: <br className="hidden sm:inline" />
            Our Methodology &amp; Principles
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
            Career decisions determine years of your life and significant family investment. You deserve complete transparency into what we evaluate, how calculations are made, where our compensation figures originate, and what this assessment can and cannot tell you.
          </p>
        </header>

        {/* Content Sections */}
        <div className="space-y-16">

          {/* Section 1: What the Assessment Measures */}
          <section id="measurement" className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-600 dark:text-sky-400 shrink-0">
                <Target className="w-5 h-5" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-950 dark:text-white">
                1. What the Assessment Measures (and What It Doesn&apos;t)
              </h2>
            </div>
            
            <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
              WhatAfter is built on <strong>80 situational scenarios</strong> that simulate realistic workplace, academic, and problem-solving dilemmas. Rather than asking abstract self-rating questions (e.g., &ldquo;Rate how creative you are from 1 to 5&rdquo;), we place you in tangible everyday choices:
            </p>

            <div className="grid sm:grid-cols-2 gap-4 my-4">
              <div className="p-5 rounded-2xl bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/10">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  What We Measure
                </h3>
                <ul className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-1.5 list-disc list-inside">
                  <li>Natural problem-solving style (analytical vs. intuitive)</li>
                  <li>Preferred work rhythms and ambiguity tolerance</li>
                  <li>Execution focus (hands-on building vs. high-level ideation)</li>
                  <li>Collaboration style and autonomy needs</li>
                  <li>Core work motivators (autonomy, mastery, impact, stability)</li>
                </ul>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/10">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                  What We Do Not Measure
                </h3>
                <ul className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-1.5 list-disc list-inside">
                  <li>General intelligence or IQ scores</li>
                  <li>School syllabus recall or academic memory</li>
                  <li>Speed of test-taking or quantitative examination marks</li>
                  <li>English grammar or linguistic vocabulary prowess</li>
                  <li>Fixed personality labels or unchangeable destiny</li>
                </ul>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 italic">
              Key Takeaway: There are no &ldquo;right&rdquo; or &ldquo;wrong&rdquo; answers. A student who prefers deep solo analytical tasks is not &ldquo;better&rdquo; or &ldquo;worse&rdquo; than one who thrives in dynamic client negotiations; they simply flourish in different career environments.
            </p>
          </section>

          {/* Section 2: How Responses Are Interpreted */}
          <section id="interpretation" className="space-y-4 pt-10 border-t border-slate-200 dark:border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-600 dark:text-sky-400 shrink-0">
                <Sliders className="w-5 h-5" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-950 dark:text-white">
                2. How Responses Are Interpreted: Trait Continuums
              </h2>
            </div>

            <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
              Traditional psychometric tests frequently force users into rigid 4-letter acronyms or simplistic categories. Human psychology and professional work are far more nuanced.
            </p>

            <div className="p-6 rounded-2xl bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 space-y-4">
              <h3 className="font-bold text-slate-950 dark:text-white text-base">
                Multi-Dimensional Trait Spectrums
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Rather than treating traits as binary on/off switches, WhatAfter models your preferences on continuous spectrums. For example, your inclination toward structured systems vs. creative improvisation is mapped as a ratio based on repeated choices across distinct scenarios.
              </p>
              <div className="grid sm:grid-cols-2 gap-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5">
                  <span className="font-bold text-sky-700 dark:text-sky-400 block mb-1">Reasoning Style</span>
                  Analytical &amp; Empirical ↔ Intuitive &amp; Contextual
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5">
                  <span className="font-bold text-sky-700 dark:text-sky-400 block mb-1">Task Orientation</span>
                  Deep Execution &amp; Craft ↔ Strategic Vision &amp; Ideation
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5">
                  <span className="font-bold text-sky-700 dark:text-sky-400 block mb-1">Work Rhythm</span>
                  Predictable &amp; Systematic ↔ Rapid &amp; Highly Ambiguous
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5">
                  <span className="font-bold text-sky-700 dark:text-sky-400 block mb-1">Social Architecture</span>
                  Autonomous &amp; Independent ↔ Collaborative &amp; Stakeholder-Heavy
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: How Career Recommendations Are Generated */}
          <section id="recommendations" className="space-y-4 pt-10 border-t border-slate-200 dark:border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-600 dark:text-sky-400 shrink-0">
                <Compass className="w-5 h-5" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-950 dark:text-white">
                3. How Career Recommendations Are Generated
              </h2>
            </div>

            <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
              Once your multi-dimensional profile is calculated, it is evaluated against our proprietary competency matrix covering <strong>120+ modern Indian and international career trajectories</strong>.
            </p>

            <div className="space-y-3">
              <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/10">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-sky-700 dark:text-sky-400 block mb-1">
                  1. Role Decomposition
                </span>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Every career in our database is decomposed into its fundamental daily realities: cognitive requirements, collaboration intensity, feedback frequency, and day-to-day pressure points.
                </p>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/10">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-sky-700 dark:text-sky-400 block mb-1">
                  2. Three-Tier Recommendation Output
                </span>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-2">
                  Instead of presenting a single &ldquo;destiny&rdquo; role, the report delivers three strategic tiers:
                </p>
                <ul className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-1 list-disc list-inside ml-2">
                  <li><strong>Primary Pathways (High Natural Alignment):</strong> Roles where your instinctive working rhythm and problem-solving style directly mirror daily expectations.</li>
                  <li><strong>Secondary Pathways (Adjacent Synergies):</strong> Roles that share 70–80% of your strengths but may require acquiring a specific functional skill.</li>
                  <li><strong>Wildcard / Cross-Functional Directions:</strong> Unconventional combinations (e.g., Design + Legal, Bio + Tech) that you may not have considered.</li>
                </ul>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/10">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 block mb-1">
                  3. The Elimination Matrix
                </span>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Equally important is showing what <em>not</em> to pursue. The report identifies popular careers that clash with your core energy drivers, explaining clearly why pursuing them could lead to chronic burnout or dissatisfaction.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4: Sources and Dates for Salary Information */}
          <section id="salary-data" className="space-y-4 pt-10 border-t border-slate-200 dark:border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-600 dark:text-sky-400 shrink-0">
                <Database className="w-5 h-5" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-950 dark:text-white">
                4. How Salary Information Is Sourced
              </h2>
            </div>

            <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
              Transparent, realistic compensation expectations help families make grounded decisions without chasing misleading hype:
            </p>

            <div className="p-6 rounded-2xl bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-bold font-mono">
                  Method: AI Live Web Search
                </span>
                <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 text-xs font-medium">
                  Dynamic per Career Role
                </span>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                <p>
                  <strong>AI Internet Retrieval:</strong> Rather than relying on static or generic compensation tables, our assessment leverages an AI model prompted to search the internet for current market compensation data relevant to that specific career pathway.
                </p>
                <p>
                  <strong>Realistic Market Range Prompting:</strong> The model is instructed to look up prevailing, realistic market compensation bands for early-career and mid-level roles, explicitly filtering out extreme top-1% campus headlines or isolated overseas packages.
                </p>
                <p>
                  <strong>Indicative Guidance Only:</strong> We treat all salary numbers as indicative directional guidance to help students understand career scope and economic viability — never as a formal contract, guarantee of income, or rigid prediction.
                </p>
              </div>
            </div>
          </section>

          {/* Section 5: How AI Is Used */}
          <section id="ai-usage" className="space-y-4 pt-10 border-t border-slate-200 dark:border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-600 dark:text-sky-400 shrink-0">
                <Cpu className="w-5 h-5" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-950 dark:text-white">
                5. How AI Is Used in the Evaluation
              </h2>
            </div>

            <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
              We believe in transparent, assistive computing — not black-box automation that pretends to predict the future.
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 space-y-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">
                  How AI Is Used
                </span>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  We employ natural-language pattern matching and structured algorithmic matrix synthesis to correlate scenario selections with role requirements, formatting complex multi-dimensional data into readable, plain-language insights.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 space-y-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 block">
                  How AI Is NEVER Used
                </span>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  AI is never permitted to determine a student&apos;s destiny, generate unverified career assertions, or replace human agency. No algorithm can predict market shocks or human grit; it serves purely as a structured thinking framework.
                </p>
              </div>
            </div>
          </section>

          {/* Section 6: What It Can and Cannot Tell You */}
          <section id="boundaries" className="space-y-4 pt-10 border-t border-slate-200 dark:border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-600 dark:text-sky-400 shrink-0">
                <Scale className="w-5 h-5" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-950 dark:text-white">
                6. What the Assessment Can and Cannot Tell You
              </h2>
            </div>

            <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
              We make no claims of infallible accuracy or guaranteed outcomes. Genuine clarity begins with recognizing limits:
            </p>

            <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.02]">
              <div className="grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-200 dark:divide-white/10">
                
                {/* CAN DO */}
                <div className="p-6 space-y-3">
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold font-mono uppercase text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    What WhatAfter Can Establish
                  </div>
                  <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-500 font-bold shrink-0">•</span>
                      <span>The working environments and task types where you have natural energy and focus.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-500 font-bold shrink-0">•</span>
                      <span>Career avenues you might have overlooked due to peer or family consensus.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-500 font-bold shrink-0">•</span>
                      <span>Specific mismatch warnings for careers that clash with your core working style.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-500 font-bold shrink-0">•</span>
                      <span>Objective, non-judgmental talking points to facilitate calm dinner-table conversations.</span>
                    </li>
                  </ul>
                </div>

                {/* CANNOT DO */}
                <div className="p-6 space-y-3">
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold font-mono uppercase text-rose-600 dark:text-rose-400">
                    <XCircle className="w-4 h-4" />
                    What WhatAfter Cannot Establish
                  </div>
                  <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                    <li className="flex items-start gap-2">
                      <span className="text-rose-500 font-bold shrink-0">•</span>
                      <span>Guaranteed job placements, campus recruitment offers, or exam cut-offs.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-rose-500 font-bold shrink-0">•</span>
                      <span>Precise lifetime income or exact financial forecasts for your individual career.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-rose-500 font-bold shrink-0">•</span>
                      <span>A definitive command telling you what you &ldquo;must&rdquo; do with your life.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-rose-500 font-bold shrink-0">•</span>
                      <span>A replacement for ongoing personal reflection, mentorship, and real-world experimentation.</span>
                    </li>
                  </ul>
                </div>

              </div>
            </div>
          </section>

          {/* Section 7: Ethical Standards & Disclaimers */}
          <section id="ethical-standards" className="space-y-4 pt-10 border-t border-slate-200 dark:border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-600 dark:text-sky-400 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-950 dark:text-white">
                7. Ethical Standards &amp; Transparency Disclaimers
              </h2>
            </div>

            <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
              WhatAfter is designed as an independent career decision-support platform. We do not claim scientific validation, expert endorsement, guaranteed accuracy, or superior performance without formal third-party empirical evidence. Our purpose is to provide structured self-reflection, eliminate false dilemmas, and give students and families grounded data to think clearly about their next steps.
            </p>

            <div className="p-6 rounded-2xl bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 space-y-4">
              <h3 className="font-bold text-slate-950 dark:text-white text-base">
                Our Ethical Guarantees
              </h3>
              <div className="grid sm:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
                  <span><strong>Zero College Sponsorships:</strong> We accept no fees, commissions, or referral incentives from any university, coaching institute, or private college.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
                  <span><strong>No Sponsored Career Rankings:</strong> Recommendation scores reflect candidate scenario fit exclusively, never commercial promotion.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
                  <span><strong>No Artificial Urgency:</strong> We do not use countdown timers, fake discounts, or manipulative scarcity messaging to force purchases.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
                  <span><strong>Full Data Privacy:</strong> Assessment answers and personal details are never rented, sold, or shared with third-party recruitment agencies.</span>
                </div>
              </div>
            </div>
          </section>

          {/* Action Callout */}
          <section className="pt-10 border-t border-slate-200 dark:border-white/10">
            <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-sky-50 via-white to-slate-50 dark:from-[#0b1723] dark:via-[#0e1d2c] dark:to-[#0b1723] border border-slate-200 dark:border-white/10 text-center space-y-5">
              <h3 className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white tracking-tight">
                Ready for a clear, grounded next step?
              </h3>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-xl mx-auto leading-relaxed">
                Take the 80-scenario assessment and receive your 15-page Career Intelligence Dossier with zero jargon and full transparency.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm shadow-lg shadow-sky-600/20 transition-all active:scale-[0.99]"
                >
                  <span>Discover Your Career Fit — ₹999</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/#inside-report"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-slate-300 dark:border-white/15 bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-800 dark:text-slate-200 font-semibold text-sm transition-all"
                >
                  <span>Preview Sample Report</span>
                </Link>
              </div>
            </div>
          </section>

        </div>

      </main>

      {/* Simple Footer */}
      <footer className="border-t border-slate-200 dark:border-white/10 py-10 bg-white dark:bg-[#040a10] text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-4xl mx-auto px-4 space-y-2">
          <p>© {new Date().getFullYear()} WhatAfter (Careeright). All rights reserved.</p>
          <div className="flex justify-center gap-4 text-slate-600 dark:text-slate-400">
            <Link href="/" className="hover:text-sky-600 dark:hover:text-sky-300">Home</Link>
            <span>•</span>
            <Link href="/methodology" className="hover:text-sky-600 dark:hover:text-sky-300">Methodology</Link>
            <span>•</span>
            <Link href="/privacy" className="hover:text-sky-600 dark:hover:text-sky-300">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
