"use client";

import React, { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";

interface Props {
  height?: number;
  direction?: "s-curve" | "reverse-s" | "straight-wave";
  gradientId?: string;
  className?: string;
}

export default function ScrollWavyConnector({
  height = 220,
  direction = "s-curve",
  gradientId = "scrollWavyGrad",
  className = "",
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 90%", "end 55%"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    restDelta: 0.001,
  });

  // Calculate SVG path based on direction across an expansive 240-unit canvas
  let pathD = "M 400,0 C 400,100 400,140 400,240";
  let startX = 400;
  let endX = 400;

  if (direction === "s-curve") {
    startX = 260;
    endX = 540;
    pathD = "M 260,0 C 260,120 540,120 540,240";
  } else if (direction === "reverse-s") {
    startX = 540;
    endX = 260;
    pathD = "M 540,0 C 540,120 260,120 260,240";
  } else {
    startX = 400;
    endX = 400;
    pathD = "M 400,0 C 470,60 330,180 400,240";
  }

  return (
    <div 
      ref={containerRef}
      className={`relative w-full flex items-center justify-center my-0 z-20 pointer-events-none overflow-visible ${className}`}
      style={{ height: `${height}px` }}
    >
      <svg 
        className="w-full h-full overflow-visible"
        viewBox="0 0 800 240"
        fill="none"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="50%" stopColor="#14b8a6" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
          <filter id={`${gradientId}-glow`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Faint static dashed guide path - Always connected border-to-border */}
        <path
          d={pathD}
          stroke="currentColor"
          strokeWidth="3"
          strokeDasharray="8 8"
          className="text-emerald-500/25 dark:text-emerald-400/20"
        />

        {/* Dynamic self-drawing wavy glowing beam on scroll */}
        <motion.path
          d={pathD}
          stroke={`url(#${gradientId})`}
          strokeWidth="4"
          strokeLinecap="round"
          filter={`url(#${gradientId}-glow)`}
          style={{ pathLength: smoothProgress }}
        />

        {/* Top Terminal Contact Bead Touching Upper Section Border */}
        <circle cx={startX} cy={0} r={8} fill="none" stroke="#10b981" strokeWidth="1.5" className="animate-ping opacity-75" />
        <circle cx={startX} cy={0} r={5.5} fill="#10b981" opacity="0.3" filter="blur(2px)" />
        <circle cx={startX} cy={0} r={4.5} fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />

        {/* Bottom Terminal Contact Bead Touching Lower Section Border */}
        <circle cx={endX} cy={240} r={8} fill="none" stroke="#06b6d4" strokeWidth="1.5" className="animate-ping opacity-75" />
        <circle cx={endX} cy={240} r={5.5} fill="#06b6d4" opacity="0.3" filter="blur(2px)" />
        <circle cx={endX} cy={240} r={4.5} fill="#06b6d4" stroke="#ffffff" strokeWidth="1.5" />
      </svg>
    </div>
  );
}
