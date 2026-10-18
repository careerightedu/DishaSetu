"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Route, 
  Calendar, 
  CheckCircle2, 
  Users, 
  GraduationCap, 
  BookOpen, 
  Sparkles, 
  ArrowRight,
  ShieldAlert,
  ChevronRight,
  Flame,
  Building,
  DollarSign
} from "lucide-react";

interface YearRoadmap {
  year: string;
  badge: string;
  theme: string;
  focus: string;
  milestones: {
    title: string;
    description: string;
    deliverable: string;
    status: "Completed" | "Current" | "Upcoming";
  }[];
  recommendedCourses: string[];
  targetCompanies: string[];
  expectedStipend: string;
}

const SAMPLE_ROADMAP: YearRoadmap[] = [
  {
    year: "Year 01",
    badge: "Foundations & Systems Architecture",
    theme: "Semesters 1 & 2 • Core Kinematics & Physical Telemetry",
    focus: "Establish mathematical rigor, C++ systems programming, and build 2 physical prototypes from scratch.",
    milestones: [
      {
        title: "Master C++20 Systems & Discrete Math",
        description: "Focus on pointer memory management, cache locality, and linear algebra matrices for 3D coordinate transformations.",
        deliverable: "Verified GitHub repo with custom kinematics algorithms",
        status: "Completed",
      },
      {
        title: "Build Physical ROS2 Autonomous Rover",
        description: "Assemble hardware chassis, wire motor encoders to microcontroller, integrate 2D LiDAR, and run SLAM mapping.",
        deliverable: "Working physical rover that autonomous maps a 200 sq ft room",
        status: "Current",
      },
      {
        title: "Publish Benchmark Simulation in Gazebo",
        description: "Simulate physics, obstacle collision models, and velocity commands in 3D Gazebo simulation environment.",
        deliverable: "Public open-source benchmark with clear README & video demo",
        status: "Upcoming",
      },
    ],
    recommendedCourses: ["Data Structures & Algorithms in C++", "Linear Algebra & Vector Calculus", "Digital Electronics & RTOS", "Autonomous Mobile Robots"],
    targetCompanies: ["Campus Robotics Labs", "Deep-Tech University Incubators", "Open-Source Robotics Foundation"],
    expectedStipend: "Academic Lab Grant / Hardware Sponsorship (₹15k–25k)",
  },
  {
    year: "Year 02",
    badge: "Applied Perception & Fellowships",
    theme: "Semesters 3 & 4 • Multi-Sensor Fusion & Research Apprenticeship",
    focus: "Transition from basic rovers to multi-sensor fusion, camera perception, and secure your first industry fellowship.",
    milestones: [
      {
        title: "Implement Multi-Sensor Extended Kalman Filter",
        description: "Fuse asynchronous IMU telemetry, wheel odometry, and camera visual odometry for sub-centimeter localization accuracy.",
        deliverable: "Production ROS2 state estimation node running on Jetson Nano",
        status: "Upcoming",
      },
      {
        title: "Join Campus Robotics Lab / Fellowship",
        description: "Work under a faculty researcher or venture lab on funded autonomous navigation, drone telemetry, or robotic arm inverse kinematics.",
        deliverable: "Co-authored technical report or competition placement",
        status: "Upcoming",
      },
      {
        title: "10-Week Summer Deep-Tech Internship",
        description: "Work as an autonomous systems intern at a high-growth robotics, autonomous delivery, or industrial warehouse automation startup.",
        deliverable: "Production code merged into real-world autonomous fleet codebase",
        status: "Upcoming",
      },
    ],
    recommendedCourses: ["Computer Vision & Deep Learning", "Feedback Control Systems", "Embedded Linux Kernel Drivers", "Probabilistic Robotics"],
    targetCompanies: ["GreyOrange", "Addverb Technologies", "Skye Air Mobility", "Torc Robotics India"],
    expectedStipend: "₹45,000 – ₹80,000 / month internship stipend",
  },
  {
    year: "Year 03",
    badge: "Production Capstone & Placement Launch",
    theme: "Semesters 5 & 6 • Autonomous Fleet Deployments & Offer Negotiation",
    focus: "Deploy complex capstone hardware-software systems, target high-tier autonomous ventures, and secure ₹18–28 LPA placement.",
    milestones: [
      {
        title: "Deploy Multi-Agent Autonomous Fleet Capstone",
        description: "Coordinate 3+ autonomous rovers using decentralized communication protocols, dynamic collision avoidance, and fleet telemetry dashboards.",
        deliverable: "Live hardware demonstration recorded and shared with industry recruiters",
        status: "Upcoming",
      },
      {
        title: "Targeted Off-Campus Deep-Tech Recruitment",
        description: "Bypass generic mass IT campus hiring. Directly interview with lead robotics architects at tier-1 autonomous driving, defense, and surgical robotics labs.",
        deliverable: "Multiple technical rounds completed with portfolio walkthroughs",
        status: "Upcoming",
      },
      {
        title: "Secure Placement Offer in ₹18–28 LPA Band",
        description: "Negotiate core engineering position with equity or performance multipliers based on rare physical-digital engineering competency.",
        deliverable: "Signed offer letter as Autonomous Systems / Firmware Engineer",
        status: "Upcoming",
      },
    ],
    recommendedCourses: ["Multi-Agent Robotics Systems", "Embedded Security & Hardware Crypto", "Distributed Fleet Optimization", "Product Engineering Management"],
    targetCompanies: ["Tonbo Imaging", "Ather Energy", "NVIDIA Autonomous Machines", "Deep-Tech Robotics Ventures"],
    expectedStipend: "₹18 – ₹28 LPA starting full-time compensation",
  },
];

export default function InteractiveExecutionRoadmap() {
  const [activeYearIndex, setActiveYearIndex] = useState<number>(0);
  const [activePerspective, setActivePerspective] = useState<"student" | "parent">("student");
  const [activeMilestoneIndex, setActiveMilestoneIndex] = useState<number>(1);

  const activeRoadmap = SAMPLE_ROADMAP[activeYearIndex];
  const activeMilestone = activeRoadmap.milestones[activeMilestoneIndex] || activeRoadmap.milestones[0];

  return (
    <div className="w-full rounded-2xl bg-slate-900 text-white dark:bg-[#07131e] border-2 border-sky-500/40 shadow-2xl p-4 sm:p-7 relative overflow-hidden">
      {/* Ambient glow backdrop */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-white/10 relative z-10">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold uppercase tracking-wider mb-1.5">
            <Route className="w-3.5 h-3.5" />
            <span>Interactive Sample Roadmap • Report Pages 11–15</span>
          </div>
          <h3 className="text-lg sm:text-2xl font-serif font-bold text-white tracking-tight">
            Sequenced 3-Year Execution Plan &amp; Family Alignment Guide
          </h3>
          <p className="text-xs sm:text-sm text-slate-300">
            Step-by-step phased execution from college choice to high-growth placement, with dedicated parent briefs.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 shrink-0 self-start sm:self-auto">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-xs font-mono font-bold text-cyan-300">
            3-Year Phased Blueprint
          </span>
        </div>
      </div>

      {/* Year Selector Tabs */}
      <div className="grid grid-cols-3 gap-2 mt-5 relative z-10">
        {SAMPLE_ROADMAP.map((yr, i) => (
          <button
            key={yr.year}
            onClick={() => {
              setActiveYearIndex(i);
              setActiveMilestoneIndex(0);
            }}
            className={`p-3 rounded-xl border text-left transition-all ${
              activeYearIndex === i
                ? "bg-cyan-500 text-black border-cyan-400 shadow-lg shadow-cyan-500/30 scale-101 font-bold"
                : "bg-white/5 text-slate-300 hover:bg-white/10 border-white/5"
            }`}
          >
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-mono text-[10px] uppercase tracking-wider font-bold opacity-80">
                Phase 0{i + 1}
              </span>
              <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold ${activeYearIndex === i ? "bg-black/20 text-black" : "bg-white/10 text-cyan-400"}`}>
                {yr.year}
              </span>
            </div>
            <span className="block text-xs sm:text-sm font-bold truncate">
              {yr.badge}
            </span>
          </button>
        ))}
      </div>

      {/* Main Grid Workbench */}
      <div className="grid lg:grid-cols-12 gap-8 items-start mt-6 relative z-10">
        
        {/* ========================================================= */}
        {/* LEFT COLUMN: PHASE MISSIONS & CHECKLISTS                  */}
        {/* ========================================================= */}
        <div className="lg:col-span-7 space-y-5">
          <div className="p-5 sm:p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
              <div>
                <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold block mb-0.5">
                  Phase Objectives
                </span>
                <h4 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-cyan-400" />
                  <span>{activeRoadmap.theme}</span>
                </h4>
              </div>
              <span className="text-xs font-mono font-bold text-sky-400 px-2.5 py-1 rounded-md bg-sky-500/15 border border-sky-500/30">
                3 Key Milestones
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 mb-5 leading-relaxed">
              {activeRoadmap.focus}
            </p>

            {/* Clickable Milestones List */}
            <div className="space-y-2.5 mb-5">
              <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
                Click A Milestone To Examine Execution Details:
              </span>

              {activeRoadmap.milestones.map((ms, idx) => (
                <button
                  key={ms.title}
                  onClick={() => setActiveMilestoneIndex(idx)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                    activeMilestoneIndex === idx
                      ? "bg-white/10 border-cyan-500/60 shadow-md"
                      : "bg-black/30 border-white/5 hover:border-white/15"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 text-[10px] font-mono font-bold ${
                        idx === 0 ? "bg-sky-500 text-black" : "bg-cyan-500/30 text-cyan-300"
                      }`}>
                        {idx + 1}
                      </div>
                      <span>{ms.title}</span>
                    </span>
                    <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded bg-white/10 text-slate-300 font-bold shrink-0">
                      {ms.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 pl-6 leading-relaxed mb-2">
                    {ms.description}
                  </p>

                  <div className="pl-6 flex items-center gap-1.5 text-[11px] font-mono text-cyan-300">
                    <span className="text-slate-400">Deliverable:</span>
                    <span className="font-semibold text-sky-300">{ms.deliverable}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Coursework & Internship Chips */}
            <div className="pt-4 border-t border-white/10 grid sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block mb-1.5">
                  High-Yield College Electives:
                </span>
                <div className="flex flex-wrap gap-1">
                  {activeRoadmap.recommendedCourses.map((c) => (
                    <span key={c} className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-slate-300">
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block mb-1.5">
                  Target Hiring Ventures:
                </span>
                <div className="flex flex-wrap gap-1">
                  {activeRoadmap.targetCompanies.map((tc) => (
                    <span key={tc} className="px-2 py-0.5 rounded bg-teal-500/10 border border-teal-500/20 text-[10px] font-mono text-teal-300">
                      {tc}
                    </span>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: INTERACTIVE PERSPECTIVE (STUDENT VS PARENT) */}
        {/* ========================================================= */}
        <div className="lg:col-span-5 space-y-5">
          <div className="p-5 sm:p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            
            {/* Perspective Toggle Buttons */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
              <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">
                Perspective Brief
              </span>
              <div className="flex items-center gap-1 p-0.5 rounded-lg bg-black/40 border border-white/10">
                <button
                  onClick={() => setActivePerspective("student")}
                  className={`px-2.5 py-1 rounded-md text-xs font-mono font-bold transition-all ${
                    activePerspective === "student"
                      ? "bg-cyan-500 text-black shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  For Student
                </button>
                <button
                  onClick={() => setActivePerspective("parent")}
                  className={`px-2.5 py-1 rounded-md text-xs font-mono font-bold transition-all ${
                    activePerspective === "parent"
                      ? "bg-cyan-500 text-black shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  For Parents
                </button>
              </div>
            </div>

            {/* Dynamic Perspective Content */}
            <AnimatePresence mode="wait">
              {activePerspective === "student" ? (
                <motion.div
                  key="student"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-4"
                >
                  <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/25">
                    <span className="text-[10px] font-mono uppercase font-bold text-cyan-300 block mb-1">
                      Execution Principle
                    </span>
                    <p className="text-xs sm:text-sm font-bold text-white leading-snug">
                      &ldquo;Kill tutorial hell. In autonomous systems and robotics, a single working physical machine on GitHub crushes 50 generic online certificates.&rdquo;
                    </p>
                  </div>

                  <div className="space-y-2.5 text-xs text-slate-300">
                    <div className="p-3 rounded-xl bg-black/20 border border-white/5">
                      <b className="text-white block mb-0.5">Where Most Students Fail:</b>
                      Collecting passive online course badges without ever troubleshooting real physical hardware serial ports or sensor calibration.
                    </div>
                    <div className="p-3 rounded-xl bg-black/20 border border-white/5">
                      <b className="text-white block mb-0.5">Your Unfair Advantage:</b>
                      Your 82 Analytical Reasoning + 88 Spatial Logic lets you understand physics and coordinate math intuitively. Use it to build physical hardware.
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="parent"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-4"
                >
                  <div className="p-4 rounded-xl bg-sky-500/10 border border-sky-500/25">
                    <span className="text-[10px] font-mono uppercase font-bold text-sky-300 block mb-1">
                      De-Biasing Family Apprehension
                    </span>
                    <p className="text-xs sm:text-sm font-bold text-white leading-snug">
                      &ldquo;Generic IT services campus placements have stagnated at ₹3.5–5 LPA for 15 years and face severe AI automation. Systems &amp; robotics engineers start at ₹14–22 LPA.&rdquo;
                    </p>
                  </div>

                  <div className="space-y-2.5 text-xs text-slate-300">
                    <div className="p-3 rounded-xl bg-black/20 border border-white/5">
                      <b className="text-white block mb-0.5">Parent Question: Is this too specialized?</b>
                      No. An engineer who masters physical kinematics + C++ software can easily pivot into any software or AI role. The reverse is NOT true—pure web developers cannot touch hardware.
                    </div>
                    <div className="p-3 rounded-xl bg-black/20 border border-white/5">
                      <b className="text-white block mb-0.5">Recommended Family Investment:</b>
                      Support hardware development kits (Raspberry Pi, motor controllers, LiDAR sensors ~₹15k). It serves as an ultra-high ROI career catalyst.
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Compensation & Timeline Horizon Banner */}
            <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400 block">
                  Expected Timeline Compensation:
                </span>
                <span className="font-mono font-bold text-sky-400 text-sm">
                  {activeRoadmap.expectedStipend}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono uppercase text-slate-400 block">
                  Report Guarantee
                </span>
                <span className="text-[11px] font-mono text-cyan-300 font-semibold">
                  Zero Generic Advice
                </span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
