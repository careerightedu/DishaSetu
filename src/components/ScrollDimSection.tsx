"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

interface ScrollDimSectionProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
  as?: "section" | "div";
  isHero?: boolean;
  dimBrightness?: number; // Lowest brightness when dimmed (default: 0.38)
  dimOpacity?: number;    // Lowest opacity when dimmed (default: 0.58)
}

/**
 * ScrollDimSection:
 * Creates an intelligent focal spotlight across the homepage.
 * - On desktop: smoothly dims previous sections when user scrolls past them to focus on the active section.
 * - On mobile (< 768px): maintains full 100% brightness and crisp readability without GPU filter overhead,
 *   preventing premature dimming and ensuring buttery-smooth 60/120fps touch scrolling.
 */
export default function ScrollDimSection({
  children,
  id,
  className = "",
  as = "section",
  isHero = false,
  dimBrightness = 0.38,
  dimOpacity = 0.58,
}: ScrollDimSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDesktop, setIsDesktop] = useState<boolean>(false);

  useEffect(() => {
    const checkWidth = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    checkWidth();
    window.addEventListener("resize", checkWidth, { passive: true });
    return () => window.removeEventListener("resize", checkWidth);
  }, []);

  // Monitor the section's position relative to viewport
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: isHero 
      ? ["start start", "end start"]
      : ["start end", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 95,
    damping: 26,
    restDelta: 0.001,
  });

  // Calculate brightness transform (desktop spotlight)
  const brightness = useTransform(
    smoothProgress,
    isHero 
      ? [0, 0.35, 0.85] 
      : [0, 0.22, 0.62, 0.92],
    isHero
      ? [1, 0.88, dimBrightness]
      : [0.82, 1, 1, dimBrightness]
  );

  // Calculate opacity transform (desktop spotlight)
  const opacity = useTransform(
    smoothProgress,
    isHero
      ? [0, 0.4, 0.9]
      : [0, 0.2, 0.65, 0.95],
    isHero
      ? [1, 0.92, dimOpacity]
      : [0.85, 1, 1, dimOpacity]
  );

  // Convert brightness to CSS filter string
  const filter = useTransform(brightness, (b) => `brightness(${b})`);

  const Component = as === "section" ? motion.section : motion.div;

  return (
    <Component
      id={id}
      ref={containerRef}
      style={
        isDesktop
          ? {
              filter,
              opacity,
              willChange: "filter, opacity",
            }
          : undefined
      }
      className={`transition-colors duration-200 ${className}`}
    >
      {children}
    </Component>
  );
}
