"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "@/hooks/useTranslations";
import { useAuth } from "@/features/auth/context/AuthContext";
import Navbar from "@/features/auth/components/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Save,
  AlertCircle,
  Check,
  RotateCcw,
  Zap,
  Flame,
  Trophy,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { doc, getDoc, setDoc, increment } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { sfx } from "@/lib/audio";

import questionsDataEn from "@/features/assessment/data/questions.json";
import questionsDataHi from "@/features/assessment/data/questions_hi.json";

interface Question {
  id: number;
  dimension: string;
  subTrait: string;
  segment: string;
  text: string;
  responseType: string;
  options: string[];
}

const MILESTONES: Record<number, { emoji: string; msg: string }> = {
  25: { emoji: "🔥", msg: "You're on fire! 25% done — keep it up!" },
  50: { emoji: "⚡", msg: "Halfway there! You're crushing it!" },
  75: { emoji: "🚀", msg: "75% done — the finish line is close!" },
  100: { emoji: "🏆", msg: "All done! Generating your career report..." },
};

const DIMENSION_COLORS: Record<string, string> = {
  "Analytical Thinking": "from-blue-900/40 to-blue-950/20 border-blue-800/40",
  "Social Orientation": "from-purple-900/40 to-purple-950/20 border-purple-800/40",
  "Creative Drive": "from-amber-900/40 to-amber-950/20 border-amber-800/40",
  "Contextual Anchor": "from-red-900/50 to-rose-950/40 border-red-800/60 ring-1 ring-red-500/20",
  default: "from-slate-900/60 to-slate-950/30 border-slate-700/40",
};

const getDimColor = (dim: string) => DIMENSION_COLORS[dim] || DIMENSION_COLORS.default;

export default function AssessmentSession() {
  const { user, profile } = useAuth();
  const router = useRouter();
  const t = useTranslations("Assessment");

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, string | number | string[]>>({});
  const [timeSpent, setTimeSpent] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const nextBtnRef = useRef<HTMLButtonElement>(null);
  const [slideDirection, setSlideDirection] = useState(1);

  // Gamification
  const [xp, setXp] = useState(0);
  const [lastStreakTrigger, setLastStreakTrigger] = useState(0);

  const [streak, setStreak] = useState(0);
  const [showGodlikeFocus, setShowGodlikeFocus] = useState(false);
  const [showHalfway, setShowHalfway] = useState(false);
  const [showChapterCard, setShowChapterCard] = useState(false);
  const isBackingRef = useRef(false);
  
  useEffect(() => {
    isBackingRef.current = slideDirection === -1;
  }, [slideDirection]);

  useEffect(() => {
    // Show Chapter roadmap every 20 questions, but only when moving forward
    if (currentIdx > 0 && currentIdx % 20 === 0 && !isBackingRef.current) {
      setShowChapterCard(true);
      sfx.playDing();
      setTimeout(() => setShowChapterCard(false), 4000);
    }
  }, [currentIdx]);
  useEffect(() => {
    if (streak > 0 && streak % 15 === 0 && !showHalfway) {
      setShowGodlikeFocus(true);
      sfx.playDing();
      setTimeout(() => setShowGodlikeFocus(false), 4000);
    }
  }, [streak, showHalfway]);

  useEffect(() => {
    if (showHalfway) {
      sfx.playDing();
      setTimeout(() => setShowHalfway(false), 4000);
    }
  }, [showHalfway]);

  const [showXpPop, setShowXpPop] = useState(false);
  const [xpPopKey, setXpPopKey] = useState(0);
  const ENCOURAGEMENT_WORDS = [
    "Superb!", "Genius!", "Flawless!", "Incredible!", "Brilliant!", 
    "Outstanding!", "Spot On!", "Excellent!", "Perfect!", 
    "Great Insight!", "Sharp!", "Awesome!", "Nailed it!", "Fantastic!"
  ];
  const [floatingTexts, setFloatingTexts] = useState<{ id: number, text: string, x: number, y: number }[]>([]);

  const [milestone, setMilestone] = useState<{ emoji: string; msg: string } | null>(null);
  const [milestoneSeen, setMilestoneSeen] = useState<Set<number>>(new Set());
  const [justAnswered, setJustAnswered] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showShake, setShowShake] = useState(false);
  const [activeMultiplier, setActiveMultiplier] = useState(1);
  
  const [particles, setParticles] = useState<{ id: number, x: number, y: number, color: string }[]>([]);

  const spawnParticles = (e: React.MouseEvent | React.TouchEvent, colorHex: string) => {
    let clientX = 0;
    let clientY = 0;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    const newParticles = Array.from({ length: 6 }).map(() => ({
      id: Date.now() + Math.random(),
      x: clientX + (Math.random() - 0.5) * 60,
      y: clientY + (Math.random() - 0.5) * 60,
      color: colorHex
    }));
    
    setParticles(prev => [...prev, ...newParticles]);
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.find(n => n.id === p.id)));
    }, 800);
  };

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [activeSeconds, setActiveSeconds] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);

  const parseOption = (opt: string) => {
    const match = opt.match(/^([A-D]|[1-5])\)\s*(.*)/);
    if (match) return { value: match[1], text: match[2] };
    const likertMatch = opt.match(/^([1-5])\s*=\s*(.*)/);
    if (likertMatch) return { value: likertMatch[1], text: likertMatch[2] };
    return { value: opt.slice(0, 2).trim(), text: opt };
  };

  useEffect(() => {
    if (loading) return;
    setActiveSeconds(0);
    timerRef.current = setInterval(() => setActiveSeconds((p) => p + 1), 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [currentIdx, loading]);

  useEffect(() => {
    if (!user || !profile) return;
    const uid = user.uid;
    const userSegment = profile.segment || "S3";

    async function loadOrCreateSession() {
      try {
        const sessionRef = doc(db, "assessment_sessions", uid);
        const sessionSnap = await getDoc(sessionRef);

        if (sessionSnap.exists()) {
          const data = sessionSnap.data();
          if (data.status === "in-progress") {
            setQuestions(data.selectedQuestions || []);
            setAnswers(data.answers || {});
            setTimeSpent(data.timeSpent || {});
            setCurrentIdx(data.currentQuestionIndex || 0);
            setXp(Object.keys(data.answers || {}).length * 10);
            setLoading(false);
            return;
          } else if (data.status === "completed") {
            router.push("/assessment/analyzing");
            return;
          }
        }

        const lang = profile?.languagePreference === "Hindi" ? "hi" : "en";
        const qData: Question[] = (lang === "hi" ? questionsDataHi : questionsDataEn) as Question[];
        const segmentQs = qData.filter((q: Question) => 
          (q.segment === userSegment || q.segment === "ALL") && q.responseType !== "Open Text" && q.dimension !== "Open-Ended"
        );

        const contextualQs = segmentQs.filter(q => q.dimension === "Contextual Anchor");
        const psychometricQs = segmentQs.filter(q => q.dimension !== "Contextual Anchor");

        const byDimension: Record<string, Question[]> = {};
        for (const q of psychometricQs) {
          if (!byDimension[q.dimension]) byDimension[q.dimension] = [];
          byDimension[q.dimension].push(q);
        }

        const selectedPsychometric: Question[] = [];
        const PSYCHO_TARGET = 70;
        for (const [, qs] of Object.entries(byDimension)) {
          const shuffled = [...qs].sort(() => Math.random() - 0.5);
          selectedPsychometric.push(...shuffled.slice(0, Math.ceil((qs.length / psychometricQs.length) * PSYCHO_TARGET)));
        }
        
        // Shuffle the 70 psychometric questions and trim to exact target
        const finalPsychometric = selectedPsychometric.sort(() => Math.random() - 0.5).slice(0, PSYCHO_TARGET);
        
        // Append all 10 contextual questions exactly at the end (71 to 80)
        const finalSelected = [...finalPsychometric, ...contextualQs].slice(0, 80);

        await setDoc(doc(db, "assessment_sessions", uid), {
          selectedQuestions: finalSelected,
          answers: {},
          timeSpent: {},
          status: "in-progress",
          currentQuestionIndex: 0,
          segment: userSegment,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });

        setQuestions(finalSelected);
        setLoading(false);
      } catch (err) {
        console.error("Session load error:", err);
        setError("Failed to load assessment. Please check your connection.");
        setLoading(false);
      }
    }

    loadOrCreateSession();
  }, [user, profile, router]);

  const syncProgressToCloud = async (idx: number, ans: typeof answers, ts: typeof timeSpent) => {
    if (!user) return;
    try {
      await setDoc(doc(db, "assessment_sessions", user.uid), {
        answers: ans, currentQuestionIndex: idx, timeSpent: ts, updatedAt: new Date().toISOString(),
      }, { merge: true });
    } catch (err) {
      console.error("Progress save failed:", err);
    }
  };

  const accumTimeSpent = useCallback(() => {
    const activeQ = questions[currentIdx];
    if (!activeQ) return timeSpent;
    return { ...timeSpent, [activeQ.id]: (timeSpent[activeQ.id] || 0) + activeSeconds };
  }, [questions, currentIdx, timeSpent, activeSeconds]);

  const awardXP = useCallback(() => {
    const earnedXp = 10;
    const nextStreak = streak + 1;
    
    // Always increment streak
    setStreak(nextStreak);
    setActiveMultiplier(1);

    // Always play ding
    sfx.playDing();
    
    // Only show encouragement word if Godlike Focus banner is NOT about to appear
    if (nextStreak % 15 !== 0) {
      const word = ENCOURAGEMENT_WORDS[Math.floor(Math.random() * ENCOURAGEMENT_WORDS.length)];
      const id = Date.now() + Math.random();
      setFloatingTexts(prev => [...prev, { id, text: word, x: 20 + Math.random() * 40, y: 15 + Math.random() * 15 }]);
      setTimeout(() => {
        setFloatingTexts(prev => prev.filter(t => t.id !== id));
      }, 1500);
    }

    setXp((prev) => prev + earnedXp);
    setXpPopKey((k) => k + 1);
    setShowXpPop(true);
    setJustAnswered(true);
    setTimeout(() => setShowXpPop(false), 1200);
    setTimeout(() => setJustAnswered(false), 600);
  }, [streak]);

  const checkMilestone = useCallback((nextIdx: number, total: number) => {
    const pct = Math.round(((nextIdx + 1) / total) * 100);
    for (const m of [25, 50, 75]) {
      if (pct >= m && !milestoneSeen.has(m)) {
        setMilestoneSeen((s) => new Set(Array.from(s).concat([m])));
        if (m === 50) {
          setShowHalfway(true);
        } else {
          setMilestone(MILESTONES[m]);
          setTimeout(() => setMilestone(null), 2800);
        }
        break;
      }
    }
  }, [milestoneSeen]);

  const handleAnswerChange = useCallback((qId: number, value: string | number | string[]) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(50);
    }
    const hadAnswer = answers[qId] !== undefined;
    setAnswers((prev) => ({ ...prev, [qId]: value }));
    if (!hadAnswer) {
      awardXP();
    } else {
      sfx.playPop();
    }

    // Satisfying Auto-advance for single selection to reduce clicks
    if (typeof value === "number" || (typeof value === "string" && !value.startsWith("Other:"))) {
      if (value !== "E") { // Don't auto advance if they selected "Other" but haven't typed yet
        setTimeout(() => {
          if (nextBtnRef.current && !nextBtnRef.current.disabled) {
            nextBtnRef.current.click();
          }
        }, 150); // Reduced from 400ms for snappier mobile feel
      }
    }
  }, [answers, awardXP]);

  const isQuestionAnswered = () => {
    const q = questions[currentIdx];
    if (!q) return false;
    const ans = answers[q.id];
    switch (q.responseType) {
      case "Scenario MCQ": case "Forced Choice": return typeof ans === "string" && ans.length > 0;
      case "Likert-5": return typeof ans === "number" || (typeof ans === "string" && ans.length > 0);
      case "Multi-select": return Array.isArray(ans) && ans.length > 0;
      case "Ranking": case "Ranked Scenario": return Array.isArray(ans) && ans.length > 0;
      case "Open Text":
        if (!ans || typeof ans !== "string") return false;
        return ans.trim().split(/\s+/).filter(Boolean).length >= 15;
      default: return false;
    }
  };

  const handleNext = async () => {
    if (!isQuestionAnswered()) {
      setShowShake(true);
      sfx.playError();
      setTimeout(() => setShowShake(false), 400);
      return;
    }
    sfx.playSwoosh();

    if (currentIdx >= questions.length - 1) {
      setSaving(true);
      setShowConfetti(true);
      setMilestone(MILESTONES[100]);
      try {
        const finalTimeSpent = accumTimeSpent();
        // Save total XP to Firestore
        await setDoc(doc(db, "assessment_sessions", user!.uid), {
          answers, timeSpent: finalTimeSpent, status: "completed", updatedAt: new Date().toISOString(), totalXp: xp,
        }, { merge: true });
        
        await setDoc(doc(db, "users", user!.uid), {
          totalXp: increment(xp)
        }, { merge: true });

        setTimeout(() => router.push("/assessment/analyzing"), 2200);
      } catch (err) {
        console.error("Submission failed:", err);
        setError("Failed to submit. Please check your internet connection.");
        setSaving(false);
        setShowConfetti(false);
      }
      return;
    }

    setSlideDirection(1);
    const nextIdx = currentIdx + 1;
    const finalTimeSpent = accumTimeSpent();
    setCurrentIdx(nextIdx);
    setTimeSpent(finalTimeSpent);
    checkMilestone(nextIdx, questions.length);
    await syncProgressToCloud(nextIdx, answers, finalTimeSpent);
  };

  const handleBack = async () => {
    if (currentIdx <= 0) return;
    sfx.playPop();
    setSlideDirection(-1);
    const prevIdx = currentIdx - 1;
    const finalTimeSpent = accumTimeSpent();
    setCurrentIdx(prevIdx);
    setTimeSpent(finalTimeSpent);
    setStreak((s) => Math.max(0, s - 1));
    await syncProgressToCloud(prevIdx, answers, finalTimeSpent);
  };

  const handleSaveAndExit = async () => {
    setSaving(true);
    try {
      await syncProgressToCloud(currentIdx, answers, accumTimeSpent());
      router.push("/");
    } catch {
      setError("Failed to save. Please try again.");
      setSaving(false);
    }
  };

  const handleRankSelection = (optionVal: string) => {
    const q = questions[currentIdx];
    const curr = (answers[q.id] as string[]) || [];
    if (curr.includes(optionVal)) {
      handleAnswerChange(q.id, curr.filter((v) => v !== optionVal));
    } else if (curr.length < q.options.length) {
      handleAnswerChange(q.id, [...curr, optionVal]);
    }
  };

  const handleCheckboxToggle = (opt: string) => {
    const q = questions[currentIdx];
    const curr = (answers[q.id] as string[]) || [];
    handleAnswerChange(q.id, curr.includes(opt) ? curr.filter((v) => v !== opt) : [...curr, opt]);
  };

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 30 : -30, opacity: 0, scale: 0.98 }),
    center: { x: 0, opacity: 1, scale: 1, transition: { duration: 0.15, ease: "easeOut" as const } },
    exit: (dir: number) => ({ x: dir > 0 ? -30 : 30, opacity: 0, scale: 0.98, transition: { duration: 0.1, ease: "easeIn" as const } }),
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-[100dvh] bg-background">
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center gap-5">
          <div className="relative">
            <div className="h-16 w-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
            <Zap className="h-6 w-6 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-sm font-semibold text-muted-foreground animate-pulse">{t("initializing")}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-[100dvh] bg-background">
        <Navbar />
        <div className="flex-grow flex items-center justify-center p-4">
          <Card className="max-w-md border-destructive/30 bg-destructive/5 text-center p-8 space-y-4">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
            <h2 className="text-lg font-bold">{t("failedStart")}</h2>
            <p className="text-sm text-muted-foreground">{error}</p>
            <Button onClick={() => window.location.reload()} className="font-semibold">Reload Page</Button>
          </Card>
        </div>
      </div>
    );
  }

  const activeQuestion = questions[currentIdx];
  const progressPercent = Math.round(((currentIdx + 1) / questions.length) * 100);
  const isBossFight = activeQuestion?.dimension === "Contextual Anchor";
  const dimColor = getDimColor(activeQuestion?.dimension || "default");
  const answered = isQuestionAnswered();

  const getBgClass = () => {
    if (currentIdx >= 60) return "bg-slate-950"; 
    if (currentIdx >= 40) return "bg-[#0b132b]"; 
    if (currentIdx >= 20) return "bg-[#1c2541]"; 
    return "bg-slate-900"; 
  };

  return (
    <div className={cn("flex flex-col min-h-[100dvh] transition-colors duration-1000 relative overflow-hidden select-none", getBgClass())}>
      {/* Particle Effect Layer */}
      <AnimatePresence>
        {particles.map(p => (
          <motion.div
            key={p.id}
            initial={{ opacity: 1, x: p.x, y: p.y, scale: 0.5 }}
            animate={{ opacity: 0, x: p.x + (Math.random() - 0.5) * 100, y: p.y + (Math.random() - 0.5) * 100, scale: 1.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="fixed z-[60] w-3 h-3 rounded-full pointer-events-none blur-[1px]"
            style={{ backgroundColor: p.color, boxShadow: `0 0 10px ${p.color}` }}
          />
        ))}
      </AnimatePresence>

      {/* Chapter Journey Roadmap Interstitial */}
      <AnimatePresence>
        {showChapterCard && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-950/90 backdrop-blur-xl"
          >
            <div className="w-full max-w-lg px-6 flex flex-col items-center">
              <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-widest mb-16">
                Journey Progress
              </h2>
              
              {/* Timeline Track */}
              <div className="w-full relative h-2 bg-slate-800 rounded-full mb-8">
                {/* Active Track */}
                <motion.div 
                  className="absolute top-0 left-0 h-full bg-emerald-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                  initial={{ width: `${Math.max(0, currentIdx - 20) / questions.length * 100}%` }}
                  animate={{ width: `${(currentIdx / questions.length) * 100}%` }}
                  transition={{ duration: 1.5, ease: "easeInOut", delay: 0.3 }}
                />
                
                {/* Ship Icon */}
                <motion.div 
                  className="absolute top-1/2 -translate-y-1/2 text-4xl sm:text-5xl drop-shadow-[0_0_15px_rgba(16,185,129,0.8)] z-10"
                  initial={{ left: `calc(${Math.max(0, currentIdx - 20) / questions.length * 100}% - 24px)` }}
                  animate={{ left: `calc(${(currentIdx / questions.length) * 100}% - 24px)` }}
                  transition={{ duration: 1.5, ease: "easeInOut", delay: 0.3 }}
                >
                  🚀
                </motion.div>
                
                {/* Nodes */}
                {[0, 20, 40, 60, 80].map((node) => (
                  <div 
                    key={node} 
                    className={cn(
                      "absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-slate-950 transition-colors duration-500 z-0",
                      currentIdx >= node ? "bg-emerald-400" : "bg-slate-700"
                    )}
                    style={{ left: `calc(${(node / 80) * 100}% - 8px)` }}
                  />
                ))}
              </div>

              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.8 }}
                className="text-emerald-400 font-mono font-bold tracking-widest mt-8"
              >
                {currentIdx} / {questions.length} Checkpoint Reached
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ambient glow (Evolving Core) */}
      <div className="pointer-events-none fixed inset-0 -z-10 flex items-center justify-center overflow-hidden">
        <div 
          className="absolute rounded-full transition-all duration-1000 ease-out" 
          style={{ 
            width: `${300 + progressPercent * 2}px`, 
            height: `${300 + progressPercent * 2}px`,
            background: isBossFight 
              ? `radial-gradient(circle, hsla(350, 84%, 39%, 0.25) 0%, hsla(0, 80%, 40%, 0) 70%)`
              : `radial-gradient(circle, hsla(${160 + progressPercent}, 84%, 39%, 0.15) 0%, hsla(${220 + progressPercent}, 80%, 40%, 0) 70%)`,
            transform: `scale(${answered ? 1.05 : 1})`,
            opacity: activeMultiplier > 1 ? 1 : 0.6
          }} 
        />
        <div 
          className="absolute rounded-full transition-all duration-[3000ms] ease-in-out" 
          style={{ 
            width: `${200 + progressPercent}px`, 
            height: `${200 + progressPercent}px`,
            background: isBossFight ? `radial-gradient(circle, hsla(0, 84%, 39%, 0.2) 0%, hsla(0, 84%, 39%, 0) 70%)` : `radial-gradient(circle, hsla(${160 + progressPercent}, 84%, 39%, 0.1) 0%, hsla(${160 + progressPercent}, 84%, 39%, 0) 70%)`,
            transform: `rotate(${progressPercent * 3.6}deg) translate(${Math.sin(progressPercent) * 20}px, ${Math.cos(progressPercent) * 20}px)`
          }} 
        />
      </div>

      <Navbar />

      {/* Confetti */}
      {showConfetti && (
        <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center">
          {[...Array(12)].map((_, i) => (
            <div key={i} className={`confetti-piece confetti-${i + 1}`} />
          ))}
        </div>
      )}

      {/* Milestone Toast */}
      <AnimatePresence>
        {milestone && (
          <div className="fixed bottom-28 left-1/2 -translate-x-1/2 z-50 milestone-toast pointer-events-none">
            <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl px-6 py-3 flex items-center gap-3 shadow-2xl shadow-emerald-500/10 backdrop-blur-xl">
              <span className="text-2xl">{milestone.emoji}</span>
              <span className="text-sm font-bold text-white">{milestone.msg}</span>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Godlike Focus Easter Egg */}
      <AnimatePresence>
        {showGodlikeFocus && !showHalfway && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, filter: "blur(5px)" }}
            transition={{ type: "spring", damping: 14, stiffness: 120 }}
            className="fixed top-6 sm:top-10 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
          >
            <div className="flex items-center gap-3 bg-slate-900/80 backdrop-blur-md border border-amber-500/30 px-6 py-3 rounded-full shadow-[0_0_20px_rgba(245,158,11,0.2)]">
              <span className="text-2xl sm:text-3xl">🔥</span>
              <div className="flex flex-col">
                <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
                  Godlike Focus!
                </h2>
                <p className="text-white/80 text-xs sm:text-sm font-bold uppercase tracking-widest">
                  Unstoppable Momentum
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Halfway Milestone Banner */}
      <AnimatePresence>
        {showHalfway && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, filter: "blur(5px)" }}
            transition={{ type: "spring", damping: 14, stiffness: 120 }}
            className="fixed top-6 sm:top-10 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
          >
            <div className="flex items-center gap-3 bg-slate-900/80 backdrop-blur-md border border-emerald-500/30 px-6 py-3 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.2)]">
              <span className="text-2xl sm:text-3xl">⚡</span>
              <div className="flex flex-col">
                <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">
                  Halfway There!
                </h2>
                <p className="text-white/80 text-xs sm:text-sm font-bold uppercase tracking-widest">
                  Great Progress
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Encouragement Texts */}
      <AnimatePresence>
        {floatingTexts.map(ft => (
          <motion.div
            key={ft.id}
            initial={{ opacity: 0, y: ft.y + 10, x: `${ft.x}vw`, scale: 0.5 }}
            animate={{ opacity: 1, y: ft.y - 10, scale: 1.2 }}
            exit={{ opacity: 0, y: ft.y - 20, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="fixed z-50 pointer-events-none text-xl md:text-2xl font-black text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)] rotate-[-5deg]"
            style={{ top: `${ft.y}vh` }}
          >
            {ft.text}
          </motion.div>
        ))}
      </AnimatePresence>

      <main className="flex-grow max-w-2xl mx-auto px-4 sm:px-6 py-5 sm:py-8 w-full flex flex-col gap-5">
        
        {/* Boss Fight Banner */}
        <AnimatePresence>
          {isBossFight && currentIdx === questions.length - 10 && (
             <motion.div
               initial={{ opacity: 0, height: 0 }}
               animate={{ opacity: 1, height: "auto" }}
               exit={{ opacity: 0, height: 0 }}
               className="w-full bg-red-500/10 border border-red-500/30 rounded-xl p-3 flex items-center justify-center gap-3 overflow-hidden"
             >
               <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
               <span className="text-sm font-bold text-red-400 uppercase tracking-widest">
                 Final Phase: Real-World Constraints
               </span>
             </motion.div>
          )}
        </AnimatePresence>

        {/* HUD HEADER */}
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1 text-xs font-mono font-bold text-slate-300">
                Q {currentIdx + 1}<span className="text-slate-500">/{questions.length}</span>
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full">
                {activeQuestion.dimension}
              </span>
            </div>

            <div className="flex items-center gap-2 relative">
              {showXpPop && (
                <span key={xpPopKey} className="xp-pop absolute -top-2 left-1/2 -translate-x-1/2 text-xs font-black text-emerald-400 whitespace-nowrap z-10">
                  +10 XP
                </span>
              )}
              {streak > 2 && (
                <div className="flex items-center gap-1 bg-orange-500/10 border border-orange-500/20 rounded-full px-2.5 py-1">
                  <Flame className="h-3.5 w-3.5 text-orange-400" />
                  <span className="text-xs font-black text-orange-400">{streak}</span>
                </div>
              )}
              <div className="flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2.5 py-1">
                <Zap className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-xs font-black text-emerald-400">{xp} XP</span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700/50">
            <motion.div
              className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full relative overflow-hidden"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
            </motion.div>
          </div>

          {/* Dimension mobile */}
          <div className="flex sm:hidden">
            <span className="inline-flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full">
              {activeQuestion.dimension}
            </span>
          </div>
        </div>

        {/* QUESTION CARD */}
        <div className="flex-grow">
          <div className={cn("w-full rounded-2xl border bg-gradient-to-br backdrop-blur-sm sm:backdrop-blur-md shadow-2xl overflow-hidden", dimColor)}>
            <AnimatePresence mode="wait" custom={slideDirection}>
              <motion.div
                key={activeQuestion.id}
                custom={slideDirection}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="p-5 sm:p-7 space-y-6"
              >
                <h2 className="text-xl sm:text-2xl font-heading font-bold text-white leading-relaxed tracking-wide">
                  {activeQuestion.text}
                </h2>

                <div className="pt-1">

                  {/* SCENARIO MCQ */}
                  {activeQuestion.responseType === "Scenario MCQ" && (
                    <div className="grid grid-cols-1 gap-3">
                      {activeQuestion.options.map((opt, i) => {
                        const { value, text } = parseOption(opt);
                        const isContextualAnchor = activeQuestion.dimension === "Contextual Anchor" || (activeQuestion.id >= 502 && activeQuestion.id <= 511);
                        const isOtherOption = isContextualAnchor && (value === "E" || /\bother\b/i.test(text));
                        const currentAnsStr = String(answers[activeQuestion.id] || "");
                        const isSelected = isOtherOption
                          ? (currentAnsStr === "E" || currentAnsStr.startsWith("Other:") || (currentAnsStr.length > 0 && !["A", "B", "C", "D"].includes(currentAnsStr)))
                          : currentAnsStr === value;

                        return (
                          <motion.div
                            key={i}
                            animate={isSelected ? { scale: [1, 1.025, 0.995, 1] } : { scale: 1 }}
                            transition={{ duration: 0.35 }}
                            onClick={(e) => {
                              spawnParticles(e, '#34d399');
                              if (isOtherOption) {
                                handleAnswerChange(activeQuestion.id, currentAnsStr.startsWith("Other:") ? currentAnsStr : "E");
                              } else {
                                handleAnswerChange(activeQuestion.id, value);
                              }
                            }}
                            className={cn(
                              "group rounded-xl border cursor-pointer transition-all duration-200 select-none relative overflow-hidden",
                              isSelected
                                ? "border-emerald-500/60 bg-emerald-950/50 shadow-lg shadow-emerald-500/10 glow-pulse"
                                : "border-slate-700/60 bg-slate-900/40 hover:border-slate-600 hover:bg-slate-800/40"
                            )}
                          >
                            {isSelected && (
                              <motion.div
                                initial={{ scaleY: 0 }}
                                animate={{ scaleY: 1 }}
                                transition={{ duration: 0.2 }}
                                className="absolute left-0 top-0 w-1 h-full bg-emerald-500 origin-top rounded-r"
                              />
                            )}
                            <div className="flex items-start gap-3 p-4">
                              <span className={cn(
                                "h-8 w-8 rounded-lg font-bold text-xs flex items-center justify-center border shrink-0 transition-all duration-200",
                                isSelected
                                  ? "bg-emerald-500 border-emerald-500 text-slate-950"
                                  : "border-slate-600 text-slate-400 group-hover:border-slate-400 group-hover:text-slate-200"
                              )}>
                                {value}
                              </span>
                              <p className="text-sm font-medium text-slate-200 leading-relaxed flex-1 pt-0.5">{text}</p>
                              {isSelected && (
                                <motion.div
                                  initial={{ scale: 0, rotate: -90 }}
                                  animate={{ scale: 1, rotate: 0 }}
                                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                                  className="shrink-0 mt-0.5"
                                >
                                  <Check className="h-5 w-5 text-emerald-400" />
                                </motion.div>
                              )}
                            </div>
                            {isOtherOption && isSelected && (
                              <div className="px-4 pb-4 pl-[60px]" onClick={(e) => e.stopPropagation()}>
                                <input
                                  type="text"
                                  placeholder="Type your specific answer here..."
                                  value={currentAnsStr.startsWith("Other: ") ? currentAnsStr.replace("Other: ", "") : (currentAnsStr !== "E" ? currentAnsStr : "")}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setAnswers((prev) => ({ ...prev, [activeQuestion.id]: val ? `Other: ${val}` : "E" }));
                                  }}
                                  className="w-full px-3.5 py-2 rounded-lg bg-slate-800 border border-emerald-500/40 text-sm font-medium text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 select-text"
                                  autoFocus
                                />
                              </div>
                            )}
                          </motion.div>
                        );
                      })}
                    </div>
                  )}

                  {/* TINDER-STYLE FORCED CHOICE */}
                  {activeQuestion.responseType === "Forced Choice" && activeQuestion.options.length >= 2 && (() => {
                    const optA = parseOption(activeQuestion.options[0]);
                    const optB = parseOption(activeQuestion.options[1]);
                    const currentAns = String(answers[activeQuestion.id] || "");
                    const isSelectedA = currentAns === optA.value;
                    const isSelectedB = currentAns === optB.value;

                    return (
                      <div className="relative w-full h-[320px] flex items-center justify-center overflow-hidden select-none">
                        {/* Swipe Indicators Background (Fallback) */}
                        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-2 pointer-events-none z-0">
                          <div className={cn("flex flex-col items-start transition-opacity duration-200", dragOffset < -20 ? "opacity-100" : "opacity-20")}>
                            <span className="text-3xl">👈</span>
                          </div>
                          <div className={cn("flex flex-col items-end transition-opacity duration-200", dragOffset > 20 ? "opacity-100" : "opacity-20")}>
                            <span className="text-3xl">👉</span>
                          </div>
                        </div>

                        {/* Draggable Card */}
                        <motion.div
                          drag="x"
                          dragConstraints={{ left: 0, right: 0 }}
                          onDrag={(e, info) => setDragOffset(info.offset.x)}
                          onDragEnd={(e, info) => {
                            if (info.offset.x < -80) {
                              handleAnswerChange(activeQuestion.id, optA.value);
                            } else if (info.offset.x > 80) {
                              handleAnswerChange(activeQuestion.id, optB.value);
                            }
                            setDragOffset(0);
                          }}
                          whileDrag={{ scale: 1.05, cursor: "grabbing" }}
                          animate={{ 
                            x: dragOffset === 0 ? (isSelectedA ? -20 : isSelectedB ? 20 : 0) : undefined,
                            rotate: dragOffset === 0 ? (isSelectedA ? -2 : isSelectedB ? 2 : 0) : dragOffset * 0.1,
                          }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                          className={cn(
                            "absolute z-10 w-full max-w-[280px] aspect-[3/4] rounded-3xl shadow-2xl flex flex-col items-center justify-center p-6 text-center cursor-grab touch-none border-2 transition-colors duration-300",
                            isSelectedA ? "bg-rose-950/40 border-rose-500/50" : isSelectedB ? "bg-emerald-950/40 border-emerald-500/50" : "bg-slate-800 border-slate-700"
                          )}
                        >
                          <div className="text-emerald-400 mb-2 opacity-50">
                            <Zap className="h-6 w-6" />
                          </div>
                          <h3 className="text-base font-bold text-white mb-4 flex items-center justify-center gap-2 w-full">
                            <span className="text-slate-400 text-lg animate-[pulse_1.5s_infinite]">👈</span>
                            Swipe
                            <span className="text-slate-400 text-lg animate-[pulse_1.5s_infinite]">👉</span>
                          </h3>
                          
                          <div className={cn("w-full flex items-start gap-3 rounded-xl p-2 transition-colors", isSelectedA ? "bg-rose-500/20" : "")}>
                            <span className="text-xl opacity-60 shrink-0 mt-1">👈</span>
                            <p className={cn("flex-1 text-[13px] font-medium leading-snug text-left", isSelectedA ? "text-white" : "text-slate-300")}>
                              <span className="text-rose-400 font-bold block mb-0.5">{optA.value}:</span> {optA.text}
                            </p>
                          </div>
                          
                          <div className="w-12 h-px bg-slate-700 my-2 opacity-50 mx-auto" />
                          
                          <div className={cn("w-full flex items-start gap-3 rounded-xl p-2 transition-colors", isSelectedB ? "bg-emerald-500/20" : "")}>
                            <p className={cn("flex-1 text-[13px] font-medium leading-snug text-right", isSelectedB ? "text-white" : "text-slate-300")}>
                              <span className="text-emerald-400 font-bold block mb-0.5">{optB.value}:</span> {optB.text}
                            </p>
                            <span className="text-xl opacity-60 shrink-0 mt-1">👉</span>
                          </div>
                        </motion.div>
                      </div>
                    );
                  })()}

                  {/* LIKERT-5 — Emoji tiles */}
                  {activeQuestion.responseType === "Likert-5" && (() => {
                    const emojis = ["😟", "😕", "😐", "🙂", "😄"];
                    return (
                      <div className="space-y-4 py-2">
                        <div className="flex justify-between gap-2">
                          {activeQuestion.options.map((opt, i) => {
                            const { value } = parseOption(opt);
                            const numVal = parseInt(value);
                            const isSelected = answers[activeQuestion.id] === numVal;
                            return (
                              <motion.button
                                key={i}
                                type="button"
                                onClick={(e) => {
                                  spawnParticles(e, '#34d399');
                                  handleAnswerChange(activeQuestion.id, numVal);
                                }}
                                whileTap={{ scale: 0.88 }}
                                className={cn(
                                  "flex-1 flex flex-col items-center gap-1.5 rounded-xl border py-3 px-1 transition-all duration-200 min-h-[72px] cursor-pointer",
                                  isSelected
                                    ? "border-emerald-500/60 bg-emerald-950/60 shadow-lg shadow-emerald-500/10 glow-pulse"
                                    : "border-slate-700/60 bg-slate-900/40 hover:border-slate-600 hover:bg-slate-800/50"
                                )}
                              >
                                <motion.span
                                  className="text-2xl"
                                  animate={isSelected ? { scale: [1, 1.3, 1] } : { scale: 1 }}
                                  transition={{ duration: 0.3 }}
                                >
                                  {emojis[i]}
                                </motion.span>
                                <span className={cn("text-[10px] font-bold", isSelected ? "text-emerald-400" : "text-slate-500")}>
                                  {numVal}
                                </span>
                              </motion.button>
                            );
                          })}
                        </div>
                        <div className="flex justify-between text-[10px] text-slate-500 font-semibold px-1">
                          <span>{parseOption(activeQuestion.options[0]).text}</span>
                          <span>{parseOption(activeQuestion.options[activeQuestion.options.length - 1]).text}</span>
                        </div>
                      </div>
                    );
                  })()}

                  {/* MULTI-SELECT */}
                  {activeQuestion.responseType === "Multi-select" && (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-xs text-slate-500 font-semibold">
                        <span>Select all that apply</span>
                        <span className="text-emerald-400">{((answers[activeQuestion.id] as string[]) || []).length} selected</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {activeQuestion.options.map((opt, i) => {
                          const isSelected = ((answers[activeQuestion.id] as string[]) || []).includes(opt);
                          return (
                            <motion.div
                              key={i}
                              animate={isSelected ? { scale: [1, 1.02, 1] } : { scale: 1 }}
                              transition={{ duration: 0.25 }}
                              onClick={() => handleCheckboxToggle(opt)}
                              className={cn(
                                "group rounded-xl border cursor-pointer flex items-center gap-3 p-3.5 transition-all duration-200 select-none relative overflow-hidden",
                                isSelected
                                  ? "border-emerald-500/60 bg-emerald-950/50 shadow-md glow-pulse"
                                  : "border-slate-700/60 bg-slate-900/40 hover:border-slate-600 hover:bg-slate-800/50"
                              )}
                            >
                              {isSelected && (
                                <motion.div initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: 0.15 }}
                                  className="absolute left-0 top-0 w-1 h-full bg-emerald-500 origin-top" />
                              )}
                              <Checkbox
                                checked={isSelected}
                                onCheckedChange={() => handleCheckboxToggle(opt)}
                                className="border-slate-600 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500 shrink-0"
                              />
                              <span className={cn("text-sm font-semibold leading-tight", isSelected ? "text-white" : "text-slate-300")}>{opt}</span>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* RANKING */}
                  {(activeQuestion.responseType === "Ranking" || activeQuestion.responseType === "Ranked Scenario") && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center text-xs text-slate-500 font-semibold">
                        <span>{t("tapOrder")}</span>
                        <Button variant="ghost" size="sm" onClick={() => { const q = questions[currentIdx]; setAnswers((p) => ({ ...p, [q.id]: [] })); }}
                          className="text-[10px] uppercase font-bold text-slate-500 hover:text-red-400 gap-1 px-2 h-7"
                          disabled={((answers[activeQuestion.id] as string[]) || []).length === 0}>
                          <RotateCcw className="h-3 w-3" /> Reset
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 gap-2.5">
                        {activeQuestion.options.map((opt, i) => {
                          const { value, text } = parseOption(opt);
                          const valKey = value || opt;
                          const currentRanks = (answers[activeQuestion.id] as string[]) || [];
                          const rankIndex = currentRanks.indexOf(valKey);
                          const isRanked = rankIndex !== -1;
                          return (
                            <motion.div
                              key={i}
                              animate={isRanked ? { scale: [1, 1.02, 1] } : { scale: 1 }}
                              transition={{ duration: 0.25 }}
                              onClick={() => handleRankSelection(valKey)}
                              className={cn(
                                "group rounded-xl border cursor-pointer flex items-start gap-3.5 p-4 transition-all duration-200 select-none",
                                isRanked ? "border-emerald-500/60 bg-emerald-950/50 shadow-md" : "border-slate-700/60 bg-slate-900/40 hover:border-slate-600 hover:bg-slate-800/50"
                              )}
                            >
                              <span className={cn(
                                "h-8 w-8 rounded-lg font-bold text-xs flex items-center justify-center border shrink-0 transition-all duration-200",
                                isRanked ? "bg-emerald-500 border-emerald-500 text-slate-950" : "border-slate-600 text-slate-400 group-hover:border-slate-400"
                              )}>
                                <AnimatePresence mode="wait">
                                  <motion.span key={isRanked ? rankIndex : "plus"}
                                    initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }}
                                    transition={{ duration: 0.18 }}>
                                    {isRanked ? `${rankIndex + 1}` : "+"}
                                  </motion.span>
                                </AnimatePresence>
                              </span>
                              <div className="text-sm font-medium text-slate-200 leading-relaxed pt-0.5 flex-1">
                                {value ? <span className="font-bold text-slate-500 mr-1.5">{value})</span> : null}
                                {text}
                              </div>
                              {isRanked && <Star className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />}
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* OPEN TEXT */}
                  {activeQuestion.responseType === "Open Text" && (
                    <div className="space-y-3">
                      <Label className="text-xs text-slate-400 font-semibold">
                        Describe your thoughts (minimum 15 words):
                      </Label>
                      <Textarea
                        rows={5}
                        placeholder="Write your response here..."
                        value={(answers[activeQuestion.id] as string) || ""}
                        onChange={(e) => handleAnswerChange(activeQuestion.id, e.target.value)}
                        className="bg-slate-900/60 border-slate-700/60 focus-visible:ring-emerald-500/50 text-sm leading-relaxed p-4 text-white placeholder:text-slate-600 resize-none rounded-xl select-text"
                      />
                      <div className="flex justify-between items-center text-xs font-semibold px-1">
                        <span className={answered ? "text-emerald-400" : "text-slate-500"}>
                          {((answers[activeQuestion.id] as string) || "").trim().split(/\s+/).filter(Boolean).length} / 15 words
                        </span>
                        {answered && (
                          <motion.span initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-emerald-400 flex items-center gap-1">
                            <Check className="h-3.5 w-3.5" /> Good to go!
                          </motion.span>
                        )}
                      </div>
                    </div>
                  )}

                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* MOBILE-FIRST FOOTER */}
        <div className="safe-bottom">
          <div className="flex justify-center mb-3">
            <button
              onClick={handleSaveAndExit}
              disabled={saving}
              className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 hover:text-slate-300 transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-800/50"
            >
              <Save className="h-3.5 w-3.5" />
              Save &amp; Exit
            </button>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentIdx === 0 || saving}
              className="h-12 px-5 font-semibold text-sm border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-slate-300 hover:text-white flex-shrink-0"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              {t("back")}
            </Button>

            <Button
              ref={nextBtnRef}
              onClick={handleNext}
              disabled={saving}
              className={cn(
                "flex-1 h-12 font-bold text-sm shadow-lg transition-all duration-300",
                showShake ? "bg-red-900/60 text-red-400 border border-red-500/50" : "",
                !showShake && answered
                  ? "bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/30 btn-pulse-active"
                  : (!showShake && !answered) ? "bg-slate-800 text-slate-500 border border-slate-700" : ""
              )}
            >
              {saving ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-full border-2 border-slate-950/30 border-t-slate-950 animate-spin" />
                  Submitting...
                </div>
              ) : currentIdx >= questions.length - 1 ? (
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4" /> {t("submit")}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  {t("nextQuestion")} <ChevronRight className="h-4 w-4" />
                </div>
              )}
            </Button>
          </div>
        </div>

      </main>
    </div>
  );
}
