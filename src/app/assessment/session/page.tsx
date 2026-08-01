"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
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
  Hash
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Import question database directly
import questionsData from "@/features/assessment/data/questions.json";

interface Question {
  id: number;
  dimension: string;
  subTrait: string;
  segment: string;
  text: string;
  responseType: string;
  options: string[];
}

export default function AssessmentSession() {
  const { user, profile } = useAuth();
  const router = useRouter();

  // Wizard session state
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, string | number | string[]>>({});
  const [timeSpent, setTimeSpent] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Slide transition direction: 1 = forward, -1 = backward
  const [slideDirection, setSlideDirection] = useState(1);

  // Time tracker for active question
  const [activeSeconds, setActiveSeconds] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Parse option prefixes (e.g. "A) text" or "1 = text")
  const parseOption = (opt: string) => {
    const match = opt.match(/^([A-D]|[1-5])\)\s*(.*)/);
    if (match) {
      return { value: match[1], text: match[2] };
    }
    const likertMatch = opt.match(/^([1-5])\s*=\s*(.*)/);
    if (likertMatch) {
      return { value: likertMatch[1], text: likertMatch[2] };
    }
    return { value: opt.slice(0, 2).trim(), text: opt };
  };

  // Passive time tracker side-effect
  useEffect(() => {
    if (loading) return;

    // Reset clock for new question
    setActiveSeconds(0);

    // Track active question index seconds
    timerRef.current = setInterval(() => {
      setActiveSeconds(prev => prev + 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIdx, loading]);

  // Load or initialize session
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
            setLoading(false);
            return;
          }
        }

        // Initialize new session: 70 psychometric (2 per subTrait) + 10 Contextual Anchor questions = 80 total
        // 1. Separate Psychometric pool and Contextual Anchor pool
        const contextualAnchors = questionsData.filter(
          q => q.dimension === "Contextual Anchor" || (q.id >= 502 && q.id <= 511)
        ) as Question[];

        const psychometricPool = questionsData.filter(
          q => q.responseType !== "Open Text" && 
               q.dimension !== "Contextual Anchor" && 
               (q.id < 502 || q.id > 511) && 
               (q.segment === "ALL" || q.segment === userSegment)
        ) as Question[];

        // 2. Group psychometric pool by subTrait for stratified sampling (70 questions = 35 subTraits * 2)
        const bySubTrait: Record<string, Question[]> = {};
        psychometricPool.forEach(q => {
          const st = q.subTrait || "General";
          if (!bySubTrait[st]) bySubTrait[st] = [];
          bySubTrait[st].push(q);
        });

        // 3. Guarantee 2 questions per subTrait
        const guaranteed: Question[] = [];
        Object.values(bySubTrait).forEach(qList => {
          const shuffled = [...qList].sort(() => 0.5 - Math.random());
          const selected = shuffled.slice(0, 2);
          selected.forEach(q => guaranteed.push(q));
        });

        // 4. Combine 70 psychometric + 10 Contextual Anchors (sorted by ID)
        const combinedQuestions = [...guaranteed, ...contextualAnchors].sort((a, b) => a.id - b.id);

        // 5. Create Firestore record
        const newSession = {
          userId: uid,
          segment: userSegment,
          selectedQuestions: combinedQuestions,
          answers: {},
          timeSpent: {},
          currentQuestionIndex: 0,
          status: "in-progress",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        await setDoc(sessionRef, newSession);
        setQuestions(combinedQuestions);
        setAnswers({});
        setTimeSpent({});
        setCurrentIdx(0);
      } catch (err) {
        console.error("Error creating/loading session:", err);
        setError("Failed to initialize session. Please check your connection and reload.");
      } finally {
        setLoading(false);
      }
    }

    loadOrCreateSession();
  }, [user, profile]);

  // Handle saving and sync to Firestore
  const syncProgressToCloud = async (
    nextIdx: number, 
    updatedAnswers = answers, 
    updatedTimeSpent = timeSpent
  ) => {
    if (!user) return;
    try {
      const sessionRef = doc(db, "assessment_sessions", user.uid);
      await setDoc(sessionRef, {
        currentQuestionIndex: nextIdx,
        answers: updatedAnswers,
        timeSpent: updatedTimeSpent,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (err) {
      console.error("Progress save failed:", err);
      // Silent fail to allow offline navigation, will sync next click
    }
  };

  const handleNext = async () => {
    if (currentIdx >= questions.length - 1) {
      // Completed, transition to analyzing screen
      setSaving(true);
      try {
        const finalTimeSpent = accumTimeSpent();
        const sessionRef = doc(db, "assessment_sessions", user!.uid);
        await setDoc(sessionRef, {
          answers,
          timeSpent: finalTimeSpent,
          status: "completed",
          updatedAt: new Date().toISOString()
        }, { merge: true });

        router.push("/assessment/analyzing");
      } catch (err) {
        console.error("Submission failed:", err);
        setError("Failed to submit assessment. Please check internet connection.");
        setSaving(false);
      }
      return;
    }

    setSlideDirection(1);
    const nextIdx = currentIdx + 1;
    const finalTimeSpent = accumTimeSpent();
    
    // Optimistic UI update
    setCurrentIdx(nextIdx);
    setTimeSpent(finalTimeSpent);
    
    // Sync background
    await syncProgressToCloud(nextIdx, answers, finalTimeSpent);
  };

  const handleBack = async () => {
    if (currentIdx <= 0) return;

    setSlideDirection(-1);
    const prevIdx = currentIdx - 1;
    const finalTimeSpent = accumTimeSpent();

    setCurrentIdx(prevIdx);
    setTimeSpent(finalTimeSpent);

    await syncProgressToCloud(prevIdx, answers, finalTimeSpent);
  };

  const handleSaveAndExit = async () => {
    setSaving(true);
    const finalTimeSpent = accumTimeSpent();
    try {
      await syncProgressToCloud(currentIdx, answers, finalTimeSpent);
      router.push("/");
    } catch (err) {
      console.error("Error saving progress:", err);
      setError("Failed to save session. Please try again.");
      setSaving(false);
    }
  };

  // Helper to accumulate seconds on question
  const accumTimeSpent = () => {
    const activeQ = questions[currentIdx];
    const prevTime = timeSpent[activeQ.id] || 0;
    return {
      ...timeSpent,
      [activeQ.id]: prevTime + activeSeconds
    };
  };

  // Response validator: check if current question has valid answers
  const isQuestionAnswered = () => {
    const q = questions[currentIdx];
    if (!q) return false;

    const ans = answers[q.id];

    switch (q.responseType) {
      case "Scenario MCQ":
      case "Forced Choice":
        return typeof ans === "string" && ans.length > 0;
      case "Likert-5":
        return typeof ans === "number" || (typeof ans === "string" && ans.length > 0);
      case "Multi-select":
        return Array.isArray(ans) && ans.length > 0;
      case "Ranking":
      case "Ranked Scenario":
        // Must rank all available choices
        return Array.isArray(ans) && ans.length === q.options.length;
      case "Open Text":
        // Word count limit (min 15 words)
        if (!ans || typeof ans !== "string") return false;
        const words = ans.trim().split(/\s+/).filter(Boolean);
        return words.length >= 15;
      default:
        return false;
    }
  };

  // Click-to-Rank ranking state management
  const handleRankSelection = (optionVal: string) => {
    const q = questions[currentIdx];
    const currentRanks = (answers[q.id] as string[]) || [];

    if (currentRanks.includes(optionVal)) {
      // Toggle off / remove from ranks
      const updated = currentRanks.filter((v: string) => v !== optionVal);
      setAnswers({ ...answers, [q.id]: updated });
    } else {
      // Add to ranks
      if (currentRanks.length < q.options.length) {
        setAnswers({ ...answers, [q.id]: [...currentRanks, optionVal] });
      }
    }
  };

  const handleResetRankings = () => {
    const q = questions[currentIdx];
    setAnswers({ ...answers, [q.id]: [] });
  };

  // Checkbox list checkbox handlers
  const handleCheckboxToggle = (optionVal: string) => {
    const q = questions[currentIdx];
    const currentSelections = (answers[q.id] as string[]) || [];

    let updated;
    if (currentSelections.includes(optionVal)) {
      updated = currentSelections.filter((v: string) => v !== optionVal);
    } else {
      updated = [...currentSelections, optionVal];
    }
    setAnswers({ ...answers, [q.id]: updated });
  };

  // Framer Motion animation setup
  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 100 : -100,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.35, ease: "easeOut" as const }
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -100 : 100,
      opacity: 0,
      transition: { duration: 0.25, ease: "easeIn" as const }
    })
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center space-y-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm font-semibold text-muted-foreground animate-pulse">Initializing custom question profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Navbar />
        <div className="flex-grow flex items-center justify-center p-4">
          <Card className="max-w-md border-destructive/20 bg-destructive/5 text-center p-6 space-y-4">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
            <h2 className="text-lg font-bold text-foreground">Failed to start assessment</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{error}</p>
            <Button onClick={() => window.location.reload()} className="font-semibold shadow-sm">
              Reload Page
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  const activeQuestion = questions[currentIdx];
  const progressPercent = Math.round(((currentIdx + 1) / questions.length) * 100);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />

      <main className="flex-grow max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 w-full flex flex-col justify-between">
        
        {/* Progress Header */}
        <div className="w-full space-y-3.5 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Hash className="h-4 w-4 text-primary" />
              <span className="font-bold text-foreground text-sm">Question {currentIdx + 1}</span> of {questions.length}
            </div>
            <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary border border-primary/20 rounded-full px-2.5 py-0.5 font-bold uppercase tracking-wider text-[10px] self-start sm:self-auto">
              {activeQuestion.dimension} Fit
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="w-full h-2 bg-border/40 rounded-full overflow-hidden relative border border-border/20">
            <motion.div 
              className="h-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Question Panel */}
        <div className="flex-grow flex items-center justify-center min-h-[350px]">
          <AnimatePresence mode="wait" custom={slideDirection}>
            <motion.div
              key={activeQuestion.id}
              custom={slideDirection}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full"
            >
              <Card className="border-border/40 bg-card/60 backdrop-blur-md shadow-xl p-6 sm:p-8 md:p-10 space-y-6">
                
                {/* Question Text */}
                <h2 className="text-lg sm:text-xl font-bold text-foreground leading-relaxed">
                  {activeQuestion.text}
                </h2>

                {/* Question Option Renderer */}
                <div className="pt-2">

                  {/* 1. SCENARIO MCQ / FORCED CHOICE */}
                  {(activeQuestion.responseType === "Scenario MCQ" || activeQuestion.responseType === "Forced Choice") && (
                    <div className="grid grid-cols-1 gap-3.5">
                      {activeQuestion.options.map((opt, i) => {
                        const { value, text } = parseOption(opt);
                        const isContextualAnchor = activeQuestion.dimension === "Contextual Anchor" || (activeQuestion.id >= 502 && activeQuestion.id <= 511);
                        const isOtherOption = isContextualAnchor && (value === "E" || /\bother\b/i.test(text));
                        const currentAnsStr = String(answers[activeQuestion.id] || "");
                        const isSelected = isOtherOption 
                          ? (currentAnsStr === "E" || currentAnsStr.startsWith("Other:") || (currentAnsStr.length > 0 && !["A","B","C","D"].includes(currentAnsStr)))
                          : currentAnsStr === value;

                        return (
                          <div
                            key={i}
                            onClick={() => {
                              if (isOtherOption) {
                                setAnswers({ 
                                  ...answers, 
                                  [activeQuestion.id]: currentAnsStr.startsWith("Other:") ? currentAnsStr : "E" 
                                });
                              } else {
                                setAnswers({ ...answers, [activeQuestion.id]: value });
                              }
                            }}
                            className={cn(
                              "group rounded-xl border p-4.5 cursor-pointer flex flex-col gap-2 transition-all duration-200 select-none",
                              isSelected 
                                ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-sm"
                                : "border-border/40 bg-background/30 hover:border-primary/45 hover:bg-primary/2"
                            )}
                          >
                            <div className="flex items-start gap-4 w-full">
                              <span className={cn(
                                "h-7 w-7 rounded-lg font-bold text-xs flex items-center justify-center border shrink-0 transition-colors",
                                isSelected
                                  ? "bg-primary border-primary text-primary-foreground"
                                  : "border-border text-muted-foreground group-hover:border-primary/50 group-hover:text-primary"
                              )}>
                                {value}
                              </span>
                              <p className="text-sm font-medium text-foreground leading-relaxed pt-0.5">{text}</p>
                            </div>

                            {/* Write-in input for 'Other' option */}
                            {isOtherOption && isSelected && (
                              <div className="mt-2 pl-11 w-full" onClick={(e) => e.stopPropagation()}>
                                <input
                                  type="text"
                                  placeholder="Type your specific answer here..."
                                  value={currentAnsStr.startsWith("Other: ") ? currentAnsStr.replace("Other: ", "") : (currentAnsStr !== "E" ? currentAnsStr : "")}
                                  onChange={(e) => {
                                    const customVal = e.target.value;
                                    setAnswers({
                                      ...answers,
                                      [activeQuestion.id]: customVal ? `Other: ${customVal}` : "E"
                                    });
                                  }}
                                  className="w-full px-3.5 py-2 rounded-lg bg-background border border-primary/50 text-sm font-medium text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30"
                                  autoFocus
                                />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* 2. LIKERT-5 */}
                  {activeQuestion.responseType === "Likert-5" && (
                    <div className="space-y-6 py-4">
                      {/* Likert circles */}
                      <div className="flex justify-between max-w-lg mx-auto relative px-2">
                        {/* Connecting line */}
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-border/50 -z-10" />
                        
                        {activeQuestion.options.map((opt, i) => {
                          const { value } = parseOption(opt);
                          const numVal = parseInt(value);
                          const isSelected = answers[activeQuestion.id] === numVal;
                          return (
                            <button
                              key={i}
                              type="button"
                              onClick={() => setAnswers({ ...answers, [activeQuestion.id]: numVal })}
                              className={cn(
                                "h-11 w-11 rounded-full font-bold text-sm flex items-center justify-center border transition-all duration-200",
                                isSelected
                                  ? "bg-primary border-primary text-primary-foreground scale-110 shadow-md ring-4 ring-primary/20"
                                  : "bg-background border-border text-muted-foreground hover:border-primary/50 hover:text-primary hover:scale-105"
                              )}
                            >
                              {numVal}
                            </button>
                          );
                        })}
                      </div>
                      
                      {/* Extremes Labels */}
                      <div className="flex justify-between text-[11px] text-muted-foreground font-semibold px-2 max-w-lg mx-auto">
                        <span>{parseOption(activeQuestion.options[0]).text}</span>
                        <span>Neutral</span>
                        <span>{parseOption(activeQuestion.options[activeQuestion.options.length - 1]).text}</span>
                      </div>
                    </div>
                  )}

                  {/* 3. MULTI-SELECT */}
                  {activeQuestion.responseType === "Multi-select" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {activeQuestion.options.map((opt, i) => {
                        const isSelected = ((answers[activeQuestion.id] as string[]) || []).includes(opt);
                        return (
                          <div
                            key={i}
                            onClick={() => handleCheckboxToggle(opt)}
                            className={cn(
                              "group rounded-xl border p-4 cursor-pointer flex items-center gap-3.5 transition-all duration-200 select-none",
                              isSelected 
                                ? "border-primary bg-primary/5 ring-1 ring-primary/10 shadow-sm"
                                : "border-border/40 bg-background/30 hover:border-primary/45 hover:bg-primary/2"
                            )}
                          >
                            <Checkbox 
                              checked={isSelected}
                              onCheckedChange={() => handleCheckboxToggle(opt)}
                              className="border-border group-hover:border-primary/60 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                            />
                            <span className="text-sm font-semibold text-foreground">{opt}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* 4. RANKING / RANKED SCENARIO */}
                  {(activeQuestion.responseType === "Ranking" || activeQuestion.responseType === "Ranked Scenario") && (
                    <div className="space-y-5">
                      <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <span>Tap options in order of your preference:</span>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={handleResetRankings}
                          className="text-[10px] uppercase font-bold text-muted-foreground hover:text-destructive gap-1 px-2 h-7"
                          disabled={((answers[activeQuestion.id] as string[]) || []).length === 0}
                        >
                          <RotateCcw className="h-3 w-3" /> Reset
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-3">
                        {activeQuestion.options.map((opt, i) => {
                          const { value, text } = parseOption(opt);
                          const valKey = value || opt;
                          const currentRanks = (answers[activeQuestion.id] as string[]) || [];
                          const rankIndex = currentRanks.indexOf(valKey);
                          const isRanked = rankIndex !== -1;

                          return (
                            <div
                              key={i}
                              onClick={() => handleRankSelection(valKey)}
                              className={cn(
                                "group rounded-xl border p-4 cursor-pointer flex items-start gap-4 transition-all duration-200 select-none",
                                isRanked
                                  ? "border-primary bg-primary/5"
                                  : "border-border/40 bg-background/30 hover:border-primary/45 hover:bg-primary/2"
                              )}
                            >
                              <span className={cn(
                                "h-7 w-7 rounded-lg font-bold text-xs flex items-center justify-center border shrink-0 transition-all duration-200",
                                isRanked
                                  ? "bg-primary border-primary text-primary-foreground scale-105 shadow-sm"
                                  : "border-border text-muted-foreground group-hover:border-primary/50 group-hover:text-primary"
                              )}>
                                {isRanked ? `${rankIndex + 1}` : "+"}
                              </span>
                              <div className="text-sm font-medium text-foreground leading-relaxed pt-0.5">
                                {value ? <span className="font-bold text-muted-foreground mr-1.5">{value})</span> : null}
                                {text}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* 5. OPEN TEXT */}
                  {activeQuestion.responseType === "Open Text" && (
                    <div className="space-y-3">
                      <Label htmlFor="openText" className="text-xs text-muted-foreground font-semibold">
                        Provide a descriptive response explaining your thoughts (min 15 words):
                      </Label>
                      <Textarea
                        id="openText"
                        rows={6}
                        placeholder="Write your response here..."
                        value={(answers[activeQuestion.id] as string) || ""}
                        onChange={(e) => setAnswers({ ...answers, [activeQuestion.id]: e.target.value })}
                        className="bg-background/40 focus-visible:ring-primary border-border/60 text-sm leading-relaxed p-4"
                      />
                      
                      {/* Word Count Indicator */}
                      <div className="flex justify-between items-center text-xs font-semibold px-1">
                        <span className={cn(
                          isQuestionAnswered() ? "text-primary" : "text-muted-foreground"
                        )}>
                          Word count: {
                            ((answers[activeQuestion.id] as string) || "")
                              .trim()
                              .split(/\s+/)
                              .filter(Boolean).length
                          } / 15 words minimum
                        </span>
                        
                        {isQuestionAnswered() && (
                          <span className="text-primary flex items-center gap-1">
                            <Check className="h-3.5 w-3.5" /> Valid length
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                </div>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Wizard Symmetrical Navigation Footer */}
        <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-4 mt-8 pt-6 border-t border-border/20">
          
          {/* Back button */}
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={currentIdx === 0 || saving}
            className="font-semibold text-xs border border-border/40 hover:bg-muted/50 h-10 px-4 w-full sm:w-auto"
          >
            <ChevronLeft className="mr-1.5 h-4.5 w-4.5" /> Back
          </Button>

          {/* Center Save & Exit */}
          <Button
            variant="outline"
            onClick={handleSaveAndExit}
            disabled={saving}
            className="font-semibold text-xs border-border/60 hover:bg-muted/50 h-10 px-4 gap-1.5 w-full sm:w-auto"
          >
            <Save className="h-4 w-4" /> Save & Exit
          </Button>

          {/* Next/Finish button */}
          <Button
            onClick={handleNext}
            disabled={!isQuestionAnswered() || saving}
            className="font-bold shadow-md shadow-primary/20 h-10 px-6 w-full sm:w-auto gap-1.5"
          >
            {currentIdx >= questions.length - 1 ? (
              <>Finish Assessment <Check className="ml-1.5 h-4.5 w-4.5" /></>
            ) : (
              <>Next Question <ChevronRight className="ml-1.5 h-4.5 w-4.5" /></>
            )}
          </Button>

        </div>

      </main>
    </div>
  );
}
