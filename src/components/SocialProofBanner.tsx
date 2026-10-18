"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, ArrowRight } from "lucide-react";
import AnimatedCounter from "@/components/AnimatedCounter";

interface Institute {
  name: string;
  badge: string;
  logo: string;
}

const INSTITUTES: Institute[] = [
  {
    name: "IIT Bombay",
    badge: "Engineering & Tech",
    logo: "/institutes/iit_bombay.svg",
  },
  {
    name: "IIT Delhi",
    badge: "Engineering & Science",
    logo: "/institutes/iit_delhi.svg",
  },
  {
    name: "BITS Pilani",
    badge: "Tech & Innovation",
    logo: "/institutes/bits_pilani.svg",
  },
  {
    name: "IIM Ahmedabad",
    badge: "Management & Strategy",
    logo: "/institutes/iim_ahmedabad.svg",
  },
  {
    name: "NLSIU Bengaluru",
    badge: "Law & Public Policy",
    logo: "/institutes/nlsiu.svg",
  },
  {
    name: "SRCC Delhi",
    badge: "Commerce & Economics",
    logo: "/institutes/srcc.png",
  },
  {
    name: "IIT Kanpur",
    badge: "Engineering & Research",
    logo: "/institutes/iit_kanpur.svg",
  },
];

export default function SocialProofBanner() {
  // Duplicate for smooth seamless infinite marquee
  const duplicatedInstitutes = [...INSTITUTES, ...INSTITUTES, ...INSTITUTES];

  return (
    <section className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 my-10 sm:my-16 relative z-10">
      {/* Outer Curved Banner (EnglishYaari Style) */}
      <div className="relative rounded-[28px] sm:rounded-[36px] md:rounded-[44px] overflow-hidden bg-gradient-to-br from-sky-600 via-sky-700 to-sky-900 border border-sky-400/20 shadow-2xl p-6 sm:p-10 md:p-12 text-white">
        
        {/* Subtle Organic Background Waves (EnglishYaari Style) */}
        <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden">
          <svg
            className="w-full h-full object-cover min-w-[1000px]"
            viewBox="0 0 1200 600"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <path
              d="M0 80 C 300 140, 600 20, 900 80 C 1050 110, 1150 70, 1200 80"
              stroke="white"
              strokeWidth="2"
              fill="none"
            />
            <path
              d="M0 160 C 250 220, 550 100, 850 160 C 1050 200, 1150 140, 1200 160"
              stroke="white"
              strokeWidth="2"
              fill="none"
            />
            <path
              d="M0 240 C 350 300, 650 180, 950 240 C 1080 270, 1150 220, 1200 240"
              stroke="white"
              strokeWidth="2"
              fill="none"
            />
            <path
              d="M0 340 C 200 400, 500 280, 800 340 C 1020 380, 1140 320, 1200 340"
              stroke="white"
              strokeWidth="2"
              fill="none"
            />
            <path
              d="M0 440 C 320 500, 620 380, 920 440 C 1060 470, 1150 420, 1200 440"
              stroke="white"
              strokeWidth="2"
              fill="none"
            />
            <path
              d="M0 520 C 220 580, 520 460, 820 520 C 1020 560, 1140 500, 1200 520"
              stroke="white"
              strokeWidth="2"
              fill="none"
            />
          </svg>
        </div>

        {/* Ambient Glow Orbs */}
        <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-sky-400/25 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 rounded-full bg-cyan-400/20 blur-3xl pointer-events-none" />

        <div className="relative z-10">
          
          {/* ========================================================= */}
          {/* TOP HEADER: Target Premier Institutions                   */}
          {/* ========================================================= */}
          <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
            <span className="text-xs sm:text-sm font-mono font-bold uppercase tracking-widest text-sky-100 block mb-1.5">
              Targeting India&apos;s Premier Institutions
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-sans font-black tracking-tight text-white">
              Where WhatAfter Students Excel
            </h2>
          </div>

          {/* ========================================================= */}
          {/* INSTITUTES MARQUEE TICKER (EnglishYaari Style Pills)      */}
          {/* ========================================================= */}
          <div className="relative w-full overflow-hidden mb-10 sm:mb-14 py-2">
            {/* Edge fade masks */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-12 sm:w-24 bg-gradient-to-r from-sky-700 to-transparent z-10" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-12 sm:w-24 bg-gradient-to-l from-sky-700 to-transparent z-10" />

            <div className="flex w-max">
              <motion.div
                className="flex items-center gap-4 sm:gap-6 shrink-0 pr-4 sm:pr-6"
                animate={{ x: ["0%", "-33.333%"] }}
                transition={{
                  duration: 25,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                {duplicatedInstitutes.map((inst, idx) => (
                  <div
                    key={`${inst.name}-${idx}`}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white text-slate-900 shadow-md shrink-0 hover:scale-105 transition-transform"
                  >
                    <div className="relative w-7 h-7 sm:w-8 sm:h-8 shrink-0 flex items-center justify-center">
                      <Image
                        src={inst.logo}
                        alt={inst.name}
                        width={32}
                        height={32}
                        className="max-h-7 sm:max-h-8 w-auto object-contain"
                      />
                    </div>
                    <div className="text-left">
                      <span className="text-xs sm:text-sm font-sans font-bold text-slate-950 block leading-tight whitespace-nowrap">
                        {inst.name}
                      </span>
                      <span className="text-[10px] font-mono text-sky-700 font-semibold block leading-tight whitespace-nowrap">
                        {inst.badge}
                      </span>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* MAIN LOWER GRID: Student Photo + Testimonial + Stats     */}
          {/* ========================================================= */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* LEFT / CENTER: Student Portrait & White Testimonial Card */}
            <div className="lg:col-span-7 flex flex-col sm:flex-row items-center sm:items-stretch gap-5">
              
              {/* Student Portrait with Yellow/Amber Accent Offset Border */}
              <div className="relative w-full sm:w-[240px] md:w-[260px] aspect-[3/4] rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-amber-400 shadow-[8px_8px_0px_0px_#f59e0b] sm:shadow-[10px_10px_0px_0px_#f59e0b] shrink-0 bg-slate-900">
                <Image
                  src="/images/learner_success.jpg"
                  alt="WhatAfter Confident Learner"
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 640px) 100vw, 260px"
                  priority
                />

                {/* Overlaid Bottom Progress Line */}
                <div className="absolute bottom-2.5 inset-x-2.5 z-20 px-3 py-2 rounded-xl bg-slate-950/85 backdrop-blur-md border border-white/15">
                  <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                    <span className="text-emerald-400 font-bold">● Calibrated</span>
                    <span className="text-white font-bold">100% Fit</span>
                  </div>
                  <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-sky-400 to-emerald-400 h-full w-full rounded-full" />
                  </div>
                </div>
              </div>

              {/* White Testimonial Card */}
              <div className="flex-1 w-full bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-7 shadow-xl text-slate-900 flex flex-col justify-between border border-slate-100 text-left">
                <div>
                  {/* Author Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-11 h-11 rounded-full overflow-hidden ring-2 ring-sky-500/30">
                        <Image
                          src="/testimonials/ananya.jpg"
                          alt="Ananya S."
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-sans font-bold text-slate-950 text-base leading-tight">
                          Ananya S.
                        </div>
                        <div className="text-xs text-slate-500 font-medium">
                          Class 12 • Science &amp; AI Track
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Stars */}
                  <div className="flex text-amber-500 gap-0.5 mb-3">
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                  </div>

                  {/* Quote */}
                  <p className="text-slate-800 text-sm sm:text-[15px] font-medium leading-relaxed">
                    &ldquo;WhatAfter eliminated all the confusion for our family. The 30-minute assessment revealed my exact cognitive fit and saved us ₹12 Lakhs on wrong coaching.&rdquo;
                  </p>
                </div>

                {/* Footer Link */}
                <div className="mt-5 pt-4 border-t border-slate-100">
                  <a
                    href="#testimonials"
                    className="text-sky-700 hover:text-sky-900 font-bold text-xs sm:text-sm inline-flex items-center gap-1.5 group transition-colors"
                  >
                    Read More Testimonials
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </a>
                </div>
              </div>

            </div>

            {/* RIGHT: Big High-Impact Numbers & Happy Learners Social Proof */}
            <div className="lg:col-span-5 flex flex-col justify-center text-left sm:text-left pl-0 lg:pl-6">
              
              {/* 3 Proof Metrics (From App) */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-y-6 gap-x-6 sm:gap-x-8 mb-8 sm:mb-10">
                <div>
                  <div className="text-4xl sm:text-5xl md:text-6xl font-black font-sans text-white tracking-tight leading-none mb-1.5">
                    80
                  </div>
                  <span className="text-xs sm:text-sm font-mono uppercase tracking-wider text-sky-100 font-semibold block">
                    Thoughtful Scenarios
                  </span>
                </div>

                <div>
                  <div className="text-4xl sm:text-5xl md:text-6xl font-black font-sans text-white tracking-tight leading-none mb-1.5">
                    35
                  </div>
                  <span className="text-xs sm:text-sm font-mono uppercase tracking-wider text-sky-100 font-semibold block">
                    Cognitive Traits
                  </span>
                </div>

                <div>
                  <div className="text-4xl sm:text-5xl md:text-6xl font-black font-sans text-white tracking-tight leading-none mb-1.5">
                    3-Yr
                  </div>
                  <span className="text-xs sm:text-sm font-mono uppercase tracking-wider text-sky-100 font-semibold block">
                    Sequenced Roadmap
                  </span>
                </div>

                <div>
                  <div className="text-4xl sm:text-5xl md:text-6xl font-black font-sans text-white tracking-tight leading-none mb-1.5">
                    ₹12L+
                  </div>
                  <span className="text-xs sm:text-sm font-mono uppercase tracking-wider text-sky-100 font-semibold block">
                    Avg. Coaching Saved
                  </span>
                </div>
              </div>

              {/* Overlapping Avatars & Happy Learners (EnglishYaari Style) */}
              <div className="pt-6 border-t border-white/15 flex flex-wrap items-center gap-3.5">
                <div className="flex -space-x-2.5 overflow-hidden">
                  <div className="relative inline-block h-9 w-9 rounded-full ring-2 ring-sky-300/60 overflow-hidden shadow-sm">
                    <Image src="/testimonials/aarav.jpg" alt="Aarav" fill className="object-cover" sizes="36px" />
                  </div>
                  <div className="relative inline-block h-9 w-9 rounded-full ring-2 ring-sky-300/60 overflow-hidden shadow-sm">
                    <Image src="/testimonials/ananya.jpg" alt="Ananya" fill className="object-cover" sizes="36px" />
                  </div>
                  <div className="relative inline-block h-9 w-9 rounded-full ring-2 ring-sky-300/60 overflow-hidden shadow-sm">
                    <Image src="/testimonials/rohan.jpg" alt="Rohan" fill className="object-cover" sizes="36px" />
                  </div>
                  <div className="relative inline-block h-9 w-9 rounded-full ring-2 ring-sky-300/60 overflow-hidden shadow-sm">
                    <Image src="/testimonials/verma_parents.jpg" alt="Parents" fill className="object-cover" sizes="36px" />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex text-amber-400">
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                  </div>
                  <span className="font-bold text-white text-sm sm:text-base">
                    +10,000 Happy Students &amp; Families
                  </span>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
