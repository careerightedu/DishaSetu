"use client";

import React, { useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

export default function AmbientBackgroundGlows() {
  const [isDesktop, setIsDesktop] = useState<boolean>(false);

  useEffect(() => {
    const checkWidth = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    checkWidth();
    window.addEventListener("resize", checkWidth, { passive: true });
    return () => window.removeEventListener("resize", checkWidth);
  }, []);

  const { scrollYProgress } = useScroll();

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 70,
    damping: 30,
    restDelta: 0.001,
  });

  // Parallax offsets for floating atmospheric orbs (desktop only)
  const orb1Y = useTransform(smoothProgress, [0, 1], [-40, 220]);
  const orb1X = useTransform(smoothProgress, [0, 1], [-20, 80]);
  
  const orb2Y = useTransform(smoothProgress, [0, 1], [40, -180]);
  const orb2X = useTransform(smoothProgress, [0, 1], [30, -60]);

  const orb3Y = useTransform(smoothProgress, [0, 1], [-80, 260]);

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
      {/* Subtle Architectural Blueprint Dot Matrix Pattern */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.03] dark:opacity-[0.05] text-slate-900 dark:text-sky-300"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="blueprint-dots"
            x="0"
            y="0"
            width="32"
            height="32"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="2" cy="2" r="1" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#blueprint-dots)" />
      </svg>

      {/* Floating Parallax Atmosphere Orb 1 (Top Left) */}
      <motion.div
        style={{ y: orb1Y, x: orb1X }}
        className="absolute -top-32 -left-32 w-[340px] sm:w-[550px] h-[340px] sm:h-[550px] rounded-full bg-gradient-to-br from-sky-500/10 to-teal-400/5 blur-[90px] sm:blur-[140px] dark:from-sky-500/15 dark:to-teal-400/10 pointer-events-none"
      />

      {/* Floating Parallax Atmosphere Orb 2 (Mid Right) */}
      <motion.div
        style={{ y: orb2Y, x: orb2X }}
        className="absolute top-1/3 -right-32 sm:-right-40 w-[360px] sm:w-[600px] h-[360px] sm:h-[600px] rounded-full bg-gradient-to-bl from-teal-500/10 to-cyan-400/5 blur-[100px] sm:blur-[160px] dark:from-teal-500/15 dark:to-cyan-400/10 pointer-events-none"
      />

      {/* Floating Parallax Atmosphere Orb 3 (Lower Left / Center) */}
      <motion.div
        style={{ y: orb3Y }}
        className="absolute top-2/3 left-1/6 sm:left-1/4 w-[320px] sm:w-[500px] h-[320px] sm:h-[500px] rounded-full bg-gradient-to-tr from-cyan-500/5 to-sky-500/10 blur-[90px] sm:blur-[150px] dark:from-cyan-500/10 dark:to-sky-500/12 pointer-events-none"
      />
    </div>
  );
}
