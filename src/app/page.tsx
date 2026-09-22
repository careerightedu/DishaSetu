"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { 
  Brain, 
  Compass, 
  Target, 
  TrendingUp,
  Sparkles,
  ChevronRight,
  Shield,
  Zap,
  GraduationCap,
  Briefcase,
  BookOpen,
  LineChart,
  FileText,
  User,
  MapPin
} from "lucide-react";
import Navbar from "@/features/auth/components/Navbar";

export default function LandingPage() {
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) - 0.5,
        y: (e.clientY / window.innerHeight) - 0.5,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const segments = [
    {
      icon: <BookOpen className="w-6 h-6 text-emerald-400" />,
      title: "School Students (Class 8-10)",
      subtitle: "Stream & Career Selection",
      description: "Confused about Science, Commerce, or Arts? We analyze your innate aptitudes to identify which stream and specific career paths will truly suit your personality and cognitive strengths.",
      color: "emerald"
    },
    {
      icon: <GraduationCap className="w-6 h-6 text-blue-400" />,
      title: "School Students (Class 11-12)",
      subtitle: "College & Degree Planning",
      description: "Stop following the crowd. Identify which undergraduate degrees and entrance exams will set you up for long-term success, along with top career recommendations based on who you are.",
      color: "blue"
    },
    {
      icon: <Target className="w-6 h-6 text-purple-400" />,
      title: "College Students",
      subtitle: "First Career Move",
      description: "Bridge the gap between your degree and the job market. Discover entry-level roles across various industries where your unique skill set will allow you to naturally excel.",
      color: "purple"
    },
    {
      icon: <Briefcase className="w-6 h-6 text-orange-400" />,
      title: "Working Professionals",
      subtitle: "Career Pivot & Growth",
      description: "Feeling stuck? Uncover your hidden potential and get actionable skill pathways to successfully transition into a more fulfilling career.",
      color: "orange"
    }
  ];

  const features = [
    {
      icon: <Brain className="w-8 h-8 text-emerald-400" />,
      title: "Deep Psychometric Analysis",
      description: "Our engine analyzes over 80 specific data points across your cognitive abilities, emotional intelligence, and work styles to build a complete profile."
    },
    {
      icon: <Compass className="w-8 h-8 text-blue-400" />,
      title: "130+ Mapped Career Fields",
      description: "We don't just give you generic advice. We provide a ranked match-score against 130+ highly specific, modern career fields."
    },
    {
      icon: <MapPin className="w-8 h-8 text-purple-400" />,
      title: "Fully Bilingual Experience",
      description: "Take the assessment in the language you are most comfortable with. Our platform seamlessly supports both English and Hindi."
    }
  ];

  return (
    <div className="min-h-[100dvh] bg-background text-foreground overflow-hidden relative selection:bg-emerald-500/30 selection:text-emerald-200">
      
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Animated Grid */}
        <div 
          className="absolute inset-0 bg-[linear-gradient(to_right,#10b9810a_1px,transparent_1px),linear-gradient(to_bottom,#10b9810a_1px,transparent_1px)] bg-[size:3rem_3rem]"
          style={{
            transform: `perspective(1000px) rotateX(60deg) translateY(${scrollYProgress.get() * -200}px) translateZ(-200px)`,
            transformOrigin: "top center",
          }}
        />
        
        {/* Glow Orbs */}
        <motion.div 
          className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-600/20 blur-[120px]"
          animate={{
            x: mousePosition.x * 50,
            y: mousePosition.y * 50,
          }}
          transition={{ type: "spring", damping: 50, stiffness: 10 }}
        />
        <motion.div 
          className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/15 blur-[120px]"
          animate={{
            x: mousePosition.x * -50,
            y: mousePosition.y * -50,
          }}
          transition={{ type: "spring", damping: 50, stiffness: 10 }}
        />
      </div>

      {/* Content wrapper */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />

        <main className="flex-grow flex flex-col items-center">
          
          {/* HERO SECTION */}
          <section className="w-full max-w-7xl mx-auto px-6 pt-32 pb-24 md:pt-48 md:pb-32 flex flex-col items-center text-center relative">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8 shadow-2xl"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-semibold tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-200">
                AI-Powered Career Assessment (Available in English & Hindi)
              </span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-8 leading-[1.1]"
            >
              Discover the Right Career Path. <br className="hidden md:block" />
              <span className="relative">
                <span className="absolute -inset-2 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 blur-xl rounded-full" />
                <span className="relative bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-blue-500">
                  Eliminate the Guesswork.
                </span>
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed"
            >
              Take our comprehensive 80-question psychometric test to uncover your true strengths. Whether you&apos;re in school, college, or working as a professional, WhatAfter provides a scientifically backed roadmap to your future.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
            >
              <Link href="/signup" className="w-full sm:w-auto">
                <div className="group relative w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-300 bg-emerald-500 rounded-xl hover:bg-emerald-400 overflow-hidden shadow-[0_0_40px_rgba(16,185,129,0.3)] hover:shadow-[0_0_60px_rgba(16,185,129,0.5)] hover:-translate-y-1">
                  <div className="absolute inset-0 w-full h-full -ml-[100%] bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
                  <span className="relative flex items-center gap-2 text-lg">
                    Take an Assessment <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
              <Link href="/login" className="w-full sm:w-auto">
                <div className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 font-bold text-slate-300 transition-all duration-300 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:text-white">
                  Log back in
                </div>
              </Link>
            </motion.div>
          </section>

          {/* DASHBOARD PREVIEW / 3D ELEMENT */}
          <motion.section 
            style={{ y: y1 }}
            className="w-full max-w-6xl mx-auto px-6 relative z-20 mt-12 mb-32"
          >
            <div className="relative rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-2xl p-2 shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 pointer-events-none" />
              <div className="rounded-xl overflow-hidden border border-white/5 bg-background relative min-h-[650px] md:min-h-0 md:aspect-[16/9] flex flex-col items-stretch justify-center">
                 <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-overlay" />
                 <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/40 via-background/80 to-background" />
                 
                 {/* Mock UI Elements - Career Assessment Theme */}
                 <div className="relative z-10 w-full h-full p-5 sm:p-6 md:p-10 flex flex-col justify-between text-slate-200 overflow-y-auto">
                    
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
                       <div>
                          <div className="text-emerald-400 font-bold text-sm tracking-wider uppercase mb-1 flex items-center gap-2">
                             <Sparkles className="w-4 h-4" /> Assessment Complete
                          </div>
                          <h3 className="text-2xl font-bold text-white">Your AI Career Profile</h3>
                       </div>
                       <div className="px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                          <Brain className="w-5 h-5 text-emerald-400" />
                          <span className="font-semibold text-emerald-300">98% Accuracy</span>
                       </div>
                    </div>
                    
                    {/* Main Content Area */}
                    <div className="flex-1 flex flex-col md:flex-row gap-4 md:gap-6">
                       {/* Left Column: Top Matches */}
                       <div className="flex-[2] bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col backdrop-blur-sm relative overflow-hidden">
                          <h4 className="text-sm font-semibold text-slate-400 mb-4 uppercase tracking-wider">Top Career Matches</h4>
                          
                          <div 
                            className="relative h-44 overflow-hidden"
                            style={{ WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)' }}
                          >
                             <motion.div 
                               animate={{ y: [0, -260] }}
                               transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
                               className="space-y-3 pt-4"
                             >
                                {/* Match 1 */}
                                <div className="bg-white/5 border border-white/5 rounded-lg p-3 flex items-center justify-between">
                                   <div className="flex items-center gap-3">
                                      <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center relative overflow-hidden">
                                         <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 8, ease: "linear" }} className="absolute -inset-2 bg-gradient-to-r from-transparent via-emerald-400/20 to-transparent" />
                                         <Target className="w-5 h-5 text-emerald-400 relative z-10" />
                                      </div>
                                      <div>
                                         <div className="font-bold text-white text-sm">Data Scientist</div>
                                         <div className="text-[10px] text-slate-400">Technology & Analytics</div>
                                      </div>
                                   </div>
                                   <div className="text-right">
                                      <div className="text-emerald-400 font-bold text-base">96%</div>
                                   </div>
                                </div>
                                {/* Match 2 */}
                                <div className="bg-white/5 border border-white/5 rounded-lg p-3 flex items-center justify-between">
                                   <div className="flex items-center gap-3">
                                      <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center relative overflow-hidden">
                                         <motion.div animate={{ rotate: -360 }} transition={{ repeat: Infinity, duration: 8, ease: "linear" }} className="absolute -inset-2 bg-gradient-to-r from-transparent via-blue-400/20 to-transparent" />
                                         <Compass className="w-5 h-5 text-blue-400 relative z-10" />
                                      </div>
                                      <div>
                                         <div className="font-bold text-white text-sm">Product Manager</div>
                                         <div className="text-[10px] text-slate-400">Business & Tech</div>
                                      </div>
                                   </div>
                                   <div className="text-right">
                                      <div className="text-blue-400 font-bold text-base">92%</div>
                                   </div>
                                </div>
                                {/* Match 3 */}
                                <div className="bg-white/5 border border-white/5 rounded-lg p-3 flex items-center justify-between">
                                   <div className="flex items-center gap-3">
                                      <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center relative overflow-hidden">
                                         <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 8, ease: "linear" }} className="absolute -inset-2 bg-gradient-to-r from-transparent via-purple-400/20 to-transparent" />
                                         <LineChart className="w-5 h-5 text-purple-400 relative z-10" />
                                      </div>
                                      <div>
                                         <div className="font-bold text-white text-sm">Financial Analyst</div>
                                         <div className="text-[10px] text-slate-400">Finance</div>
                                      </div>
                                   </div>
                                   <div className="text-right">
                                      <div className="text-purple-400 font-bold text-base">88%</div>
                                   </div>
                                </div>
                                {/* Match 4 */}
                                <div className="bg-white/5 border border-white/5 rounded-lg p-3 flex items-center justify-between">
                                   <div className="flex items-center gap-3">
                                      <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center relative overflow-hidden">
                                         <motion.div animate={{ rotate: -360 }} transition={{ repeat: Infinity, duration: 8, ease: "linear" }} className="absolute -inset-2 bg-gradient-to-r from-transparent via-orange-400/20 to-transparent" />
                                         <Briefcase className="w-5 h-5 text-orange-400 relative z-10" />
                                      </div>
                                      <div>
                                         <div className="font-bold text-white text-sm">Marketing Strategist</div>
                                         <div className="text-[10px] text-slate-400">Marketing & Sales</div>
                                      </div>
                                   </div>
                                   <div className="text-right">
                                      <div className="text-orange-400 font-bold text-base">85%</div>
                                   </div>
                                </div>
                                {/* Match 1 Duplicate for loop */}
                                <div className="bg-white/5 border border-white/5 rounded-lg p-3 flex items-center justify-between">
                                   <div className="flex items-center gap-3">
                                      <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center relative overflow-hidden">
                                         <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 8, ease: "linear" }} className="absolute -inset-2 bg-gradient-to-r from-transparent via-emerald-400/20 to-transparent" />
                                         <Target className="w-5 h-5 text-emerald-400 relative z-10" />
                                      </div>
                                      <div>
                                         <div className="font-bold text-white text-sm">Data Scientist</div>
                                         <div className="text-[10px] text-slate-400">Technology & Analytics</div>
                                      </div>
                                   </div>
                                   <div className="text-right">
                                      <div className="text-emerald-400 font-bold text-base">96%</div>
                                   </div>
                                </div>
                             </motion.div>
                          </div>
                          
                          {/* Actionable Roadmap Demo */}
                          <div className="mt-8 border-t border-white/10 pt-5 relative">
                             <div className="flex items-center justify-between mb-4">
                               <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Actionable Roadmap</h4>
                               <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-500/20 font-semibold flex items-center gap-1">
                                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live Sync
                               </span>
                             </div>
                             
                             <div 
                               className="relative h-28 overflow-hidden" 
                               style={{ WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)' }}
                             >
                                <motion.div 
                                  animate={{ y: [0, -100] }} 
                                  transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
                                  className="space-y-4 pt-4"
                                >
                                   {/* Step 1 */}
                                   <div className="flex gap-4">
                                      <div className="flex flex-col items-center">
                                         <div className="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.8)] relative z-10" />
                                         <div className="w-px h-10 bg-emerald-500/30 my-1" />
                                      </div>
                                      <div className="flex-1 -mt-1">
                                         <div className="text-sm font-bold text-white">Learn Python Basics</div>
                                         <div className="text-xs text-slate-400">Week 1-2</div>
                                      </div>
                                   </div>
                                   {/* Step 2 */}
                                   <div className="flex gap-4">
                                      <div className="flex flex-col items-center">
                                         <div className="w-3 h-3 rounded-full bg-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.8)] relative z-10" />
                                         <div className="w-px h-10 bg-blue-500/30 my-1" />
                                      </div>
                                      <div className="flex-1 -mt-1">
                                         <div className="text-sm font-bold text-white">Statistical Analysis</div>
                                         <div className="text-xs text-slate-400">Week 3-4</div>
                                      </div>
                                   </div>
                                   {/* Step 3 */}
                                   <div className="flex gap-4">
                                      <div className="flex flex-col items-center">
                                         <div className="w-3 h-3 rounded-full bg-white/20 border border-white/30 relative z-10" />
                                         <div className="w-px h-10 bg-white/10 my-1" />
                                      </div>
                                      <div className="flex-1 -mt-1">
                                         <div className="text-sm font-bold text-white opacity-50">Machine Learning</div>
                                         <div className="text-xs text-slate-400 opacity-50">Month 2</div>
                                      </div>
                                   </div>
                                   {/* Step 4 */}
                                   <div className="flex gap-4">
                                      <div className="flex flex-col items-center">
                                         <div className="w-3 h-3 rounded-full bg-white/20 border border-white/30 relative z-10" />
                                      </div>
                                      <div className="flex-1 -mt-1">
                                         <div className="text-sm font-bold text-white opacity-50">Capstone Project</div>
                                         <div className="text-xs text-slate-400 opacity-50">Month 3</div>
                                      </div>
                                   </div>
                                </motion.div>
                             </div>
                          </div>
                          
                       </div>
                       
                        {/* Right Column: Traits */}
                        <div className="flex-1 flex flex-col gap-4">
                           <div 
                              className="relative h-56 md:h-full md:min-h-[300px] overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-5"
                              style={{ WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)' }}
                           >
                              <motion.div 
                                animate={{ y: [0, -320] }}
                                transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
                                className="space-y-6 pt-4"
                              >
                                 {/* Trait 1 */}
                                 <div>
                                    <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Cognitive Agility</div>
                                    <div className="text-lg font-bold text-white mb-2">Superior</div>
                                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden relative">
                                       <div className="absolute top-0 bottom-0 left-0 w-[94%] bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                                       <motion.div animate={{ x: ["-100%", "300%"] }} transition={{ repeat: Infinity, duration: 2.5, ease: "linear", delay: 0.5 }} className="absolute top-0 bottom-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/50 to-transparent mix-blend-overlay" />
                                    </div>
                                 </div>
                                 
                                 {/* Trait 2 */}
                                 <div>
                                    <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Creative Problem Solving</div>
                                    <div className="text-lg font-bold text-white mb-2">Advanced</div>
                                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden relative">
                                       <div className="absolute top-0 bottom-0 left-0 w-[85%] bg-purple-400 shadow-[0_0_10px_rgba(192,132,252,0.8)]" />
                                       <motion.div animate={{ x: ["-100%", "300%"] }} transition={{ repeat: Infinity, duration: 2.5, ease: "linear", delay: 1 }} className="absolute top-0 bottom-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/50 to-transparent mix-blend-overlay" />
                                    </div>
                                 </div>
                                 
                                 {/* Trait 3 */}
                                 <div>
                                    <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Emotional Intelligence</div>
                                    <div className="text-lg font-bold text-white mb-2">High</div>
                                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden relative">
                                       <div className="absolute top-0 bottom-0 left-0 w-[88%] bg-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                                       <motion.div animate={{ x: ["-100%", "300%"] }} transition={{ repeat: Infinity, duration: 2.5, ease: "linear", delay: 1.5 }} className="absolute top-0 bottom-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/50 to-transparent mix-blend-overlay" />
                                    </div>
                                 </div>

                                 {/* Trait 4 */}
                                 <div>
                                    <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Analytical Thinking</div>
                                    <div className="text-lg font-bold text-white mb-2">Exceptional</div>
                                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden relative">
                                       <div className="absolute top-0 bottom-0 left-0 w-[96%] bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.8)]" />
                                       <motion.div animate={{ x: ["-100%", "300%"] }} transition={{ repeat: Infinity, duration: 2.5, ease: "linear", delay: 2 }} className="absolute top-0 bottom-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/50 to-transparent mix-blend-overlay" />
                                    </div>
                                 </div>

                                 {/* Trait 1 Duplicate */}
                                 <div>
                                    <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Cognitive Agility</div>
                                    <div className="text-lg font-bold text-white mb-2">Superior</div>
                                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden relative">
                                       <div className="absolute top-0 bottom-0 left-0 w-[94%] bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                                       <motion.div animate={{ x: ["-100%", "300%"] }} transition={{ repeat: Infinity, duration: 2.5, ease: "linear", delay: 2.5 }} className="absolute top-0 bottom-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/50 to-transparent mix-blend-overlay" />
                                    </div>
                                 </div>
                              </motion.div>
                           </div>
                        </div>
                    </div>
                 </div>
              </div>
            </div>
          </motion.section>

          {/* 4 SEGMENTS SECTION */}
          <section className="w-full max-w-7xl mx-auto px-6 py-24 relative z-20 border-t border-white/10 mt-12">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-black mb-6">Tailored Guidance for Every Stage of Your Journey</h2>
              <p className="text-slate-400 max-w-3xl mx-auto text-lg">
                Whether you are just starting high school or looking for your next big career pivot, our assessments dynamically adapt to your life stage.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {segments.map((seg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="bg-white/[0.03] border border-white/10 rounded-3xl p-8 backdrop-blur-md flex flex-col hover:bg-white/[0.06] transition-all relative overflow-hidden group"
                >
                  {/* Subtle color glow based on segment */}
                  <div className="absolute top-0 right-0 w-32 h-32 opacity-10 rounded-bl-[100px] -z-10 transition-transform group-hover:scale-110" style={{ backgroundColor: seg.color === 'emerald' ? '#10b981' : seg.color === 'blue' ? '#3b82f6' : seg.color === 'purple' ? '#a855f7' : '#f97316' }} />
                  
                  <div className="flex items-center gap-4 mb-6">
                     <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shadow-inner">
                       {seg.icon}
                     </div>
                     <div>
                        <div className="text-sm text-slate-400 uppercase tracking-widest font-bold">{seg.title}</div>
                        <h3 className="text-2xl font-bold text-white">{seg.subtitle}</h3>
                     </div>
                  </div>
                  <p className="text-slate-300 leading-relaxed text-base flex-grow">
                    {seg.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* PERSONALIZED REPORT SECTION */}
          <section className="w-full bg-white/[0.02] border-y border-white/10 py-24 relative z-20 mt-12">
             <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row items-center gap-16">
                   <div className="flex-1 space-y-6">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-semibold uppercase tracking-wider">
                         <FileText className="w-4 h-4" /> 100% Personalized
                      </div>
                      <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
                         Deep Insights, <br /> Tailored Just For You
                      </h2>
                      <p className="text-lg text-slate-400 leading-relaxed">
                         Once you complete the assessment, you unlock a highly detailed, personalized psychological and career report designed to give you clarity and direction.
                      </p>
                      
                      <ul className="space-y-4 mt-8">
                         <li className="flex items-start gap-3">
                            <Brain className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
                            <div>
                               <strong className="text-white">Cognitive Profile:</strong>
                               <p className="text-slate-400 text-sm">A deep dive into your logical reasoning, verbal ability, and spatial awareness.</p>
                            </div>
                         </li>
                         <li className="flex items-start gap-3">
                            <User className="w-6 h-6 text-purple-400 shrink-0 mt-0.5" />
                            <div>
                               <strong className="text-white">Personality Archetypes:</strong>
                               <p className="text-slate-400 text-sm">Understand how you interact with the world, make decisions, and handle stress.</p>
                            </div>
                         </li>
                         <li className="flex items-start gap-3">
                            <Target className="w-6 h-6 text-blue-400 shrink-0 mt-0.5" />
                            <div>
                               <strong className="text-white">Top Career Matches:</strong>
                               <p className="text-slate-400 text-sm">A rigorously ranked list of the career fields you are most statistically likely to thrive in.</p>
                            </div>
                         </li>
                         <li className="flex items-start gap-3">
                            <LineChart className="w-6 h-6 text-orange-400 shrink-0 mt-0.5" />
                            <div>
                               <strong className="text-white">Actionable Execution Plan:</strong>
                               <p className="text-slate-400 text-sm">Step-by-step guidance on certifications, degrees, and skills needed to reach your top career match.</p>
                            </div>
                         </li>
                      </ul>
                   </div>
                   
                   <div className="flex-1 w-full relative hidden md:block">
                      <div className="absolute inset-0 bg-blue-500/20 blur-[120px] rounded-full pointer-events-none" />
                      <div className="relative bg-slate-900 border border-white/10 rounded-2xl p-2 shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500">
                         <div className="rounded-xl overflow-hidden bg-slate-950 aspect-[4/3] relative flex items-center justify-center border border-white/5">
                            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay" />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent" />
                            <div className="relative z-10 text-center p-8">
                               <FileText className="w-16 h-16 text-emerald-400 mx-auto mb-4 opacity-80 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                               <div className="text-2xl font-bold text-white mb-2">Comprehensive Report</div>
                               <div className="w-32 h-2 bg-emerald-500/50 rounded-full mx-auto" />
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          </section>

          {/* FEATURES SECTION */}
          <section className="w-full max-w-7xl mx-auto px-6 py-24 relative z-20">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-black mb-6">A Scientific Approach to Your Future</h2>
              <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                Traditional career counseling is obsolete. We use deep psychological models combined with real-time industry intelligence.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {features.map((feat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-lg hover:bg-white/10 transition-colors"
                >
                  <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 shadow-inner">
                    {feat.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-4">{feat.title}</h3>
                  <p className="text-slate-400 leading-relaxed text-sm">
                    {feat.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* METRICS / TRUST SECTION */}
          <section className="w-full border-y border-white/10 bg-white/[0.02] py-20 relative z-20 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-3 gap-12 text-center">
               <div>
                  <h4 className="text-5xl font-black text-white mb-2">80+</h4>
                  <p className="text-slate-400 uppercase tracking-widest text-sm font-bold">Psychometric Variables</p>
               </div>
               <div>
                  <h4 className="text-5xl font-black text-white mb-2">130+</h4>
                  <p className="text-slate-400 uppercase tracking-widest text-sm font-bold">Career Fields</p>
               </div>
               <div>
                  <h4 className="text-5xl font-black text-white mb-2">Bilingual</h4>
                  <p className="text-slate-400 uppercase tracking-widest text-sm font-bold">English & Hindi Native</p>
               </div>
            </div>
          </section>

          {/* BOTTOM CTA */}
          <section className="w-full max-w-4xl mx-auto px-6 py-32 text-center relative z-20">
             <div className="absolute inset-0 bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />
             <Shield className="w-16 h-16 text-emerald-400 mx-auto mb-8 opacity-80" />
             <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">
                Ready to take control <br className="hidden sm:block" /> of your future?
             </h2>
             <p className="text-xl text-slate-400 mb-10 max-w-xl mx-auto">
                Join thousands of students and professionals who have already mapped their optimal career trajectory with WhatAfter.
             </p>
             <Link href="/signup">
                <div className="inline-flex items-center justify-center px-10 py-5 font-bold text-white transition-all duration-300 bg-emerald-500 rounded-xl hover:bg-emerald-400 shadow-[0_0_40px_rgba(16,185,129,0.4)] hover:shadow-[0_0_60px_rgba(16,185,129,0.6)] hover:-translate-y-1 text-xl gap-3 group overflow-hidden relative">
                  <div className="absolute inset-0 w-full h-full -ml-[100%] bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
                  <Zap className="w-6 h-6 relative z-10" /> 
                  <span className="relative z-10">Begin Your Assessment Now</span>
                </div>
              </Link>
          </section>

        </main>
        
        {/* Footer */}
        <footer className="w-full border-t border-white/10 bg-black/50 backdrop-blur-lg py-8 z-20 mt-auto">
          <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
             <div className="flex items-center gap-2">
                <Compass className="h-6 w-6 text-emerald-400" />
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-400">
                  WhatAfter
                </span>
             </div>
             <p className="text-slate-500 text-sm">© {new Date().getFullYear()} WhatAfter.in. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
