"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

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

export default function InstitutesMarquee() {
  // Duplicate array 3 times for a completely seamless, continuous loop
  const duplicated = [...INSTITUTES, ...INSTITUTES, ...INSTITUTES];

  return (
    <div className="w-full border-y border-slate-200/80 dark:border-white/5 bg-slate-100/70 dark:bg-white/[0.02] py-6 sm:py-8 overflow-hidden relative">
      {/* Label */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 text-center mb-5">
        <span className="text-xs sm:text-sm font-mono font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
          Trusted by students targeting India&apos;s premier institutions
        </span>
      </div>

      {/* Edge gradient fade masks */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-28 bg-gradient-to-r from-slate-100/90 dark:from-[#061019] to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-28 bg-gradient-to-l from-slate-100/90 dark:from-[#061019] to-transparent z-10" />

      {/* Infinite Horizontal Marquee */}
      <div className="flex w-max">
        <motion.div
          className="flex items-center gap-8 sm:gap-12 shrink-0 pr-8 sm:pr-12"
          animate={{ x: ["0%", "-33.333%"] }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {duplicated.map((inst, idx) => (
            <div
              key={`${inst.name}-${idx}`}
              className="flex items-center gap-3 sm:gap-4 px-4 py-2.5 rounded-2xl bg-white dark:bg-white/5 border border-slate-200/80 dark:border-white/10 shadow-xs shrink-0 hover:scale-105 transition-transform"
            >
              <div className="relative w-8 h-8 sm:w-10 sm:h-10 shrink-0 flex items-center justify-center">
                <Image
                  src={inst.logo}
                  alt={inst.name}
                  width={40}
                  height={40}
                  className="max-h-8 sm:max-h-10 w-auto object-contain"
                />
              </div>
              <div className="text-left">
                <span className="text-sm sm:text-base font-serif font-bold text-slate-900 dark:text-white block leading-tight whitespace-nowrap">
                  {inst.name}
                </span>
                <span className="text-[10px] sm:text-[11px] font-mono text-sky-700 dark:text-sky-400 font-semibold block leading-tight whitespace-nowrap">
                  {inst.badge}
                </span>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
