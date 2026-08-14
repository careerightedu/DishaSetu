"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "@/hooks/useTranslations";
import Navbar from "@/features/auth/components/Navbar";
import { useAuth } from "@/features/auth/context/AuthContext";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { 
  Sparkles, 
  TrendingUp, 
  BookOpen, 
  Briefcase, 
  ChevronDown, 
  ChevronUp, 
  Download, 
  RotateCcw,
  Compass, 
  Target,
  BadgeAlert,
  ArrowRight,
  HelpCircle,
  GraduationCap,
  Award,
  Brain,
  CheckCircle2,
  Lock,
  Unlock,
  FileText,
  Gamepad2,
  Sword,
  ListTodo
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ScoreReport {
  [traitName: string]: number;
}

interface Recommendation {
  careerId: string;
  title: string;
  matchType?: string;
  pivotPath?: string;
  sector: string;
  fitScore: number;
  description: string;
  whyRecommended: string;
  academicPath: string;
  exams: string[];
  salaryTiers: {
    tier1: string;
    tier2: string;
    tier3: string;
  };
  skillGaps: string[];
  automationRisk: string;
  marketDemand: number;
  breakdown: {
    interest: number;
    ability: number;
    lifestyle: number;
    values: number;
    demand: number;
    confidence: number;
  };
  specializations?: {
    title: string;
    explanation: string;
    whyFit: string;
  }[];
  rarity?: string;
  dayInTheLife?: string;
  schedule?: string;
  whatYouWillLove?: string;
  challenges?: string;
  growth?: string;
  realWorldImpact?: string;
  whoShouldAvoid?: string;
  occupations?: string[];
}

// Helper function to safely convert any LLM response (array, string, object) into an array
const safeArray = (val: any): any[] => {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  if (typeof val === "string") return val.split(/\n|,|;|\u2022/).map(s => s.trim()).filter(Boolean);
  if (typeof val === "object") return Object.values(val);
  return [];
};

interface Archetype {
  name: string;
  title: string;
  description: string;
  level: number;
  xp: number;
  traits: {
    intelligence: number;
    creativity: number;
    empathy: number;
    leadership: number;
    organization: number;
  };
}

interface CounselorAnalysis {
  executiveSummary: string;
  strengths: string[];
  blindspots: string[];
  adjustmentAdvice: string;
}

interface CareerMission {
  title: string;
  objective: string;
  xpReward: number;
  difficulty: string;
  estimatedTime: string;
  impact: string;
}

interface Achievement {
  title: string;
  description: string;
}

export default function ResultsDashboard() {
  const router = useRouter();
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [scores, setScores] = useState<ScoreReport | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[] | null>(null);
  const [archetype, setArchetype] = useState<Archetype | null>(null);
  const [counselorAnalysis, setCounselorAnalysis] = useState<CounselorAnalysis | null>(null);
  const [careerMissions, setCareerMissions] = useState<CareerMission[] | null>(null);
  const [achievements, setAchievements] = useState<Achievement[] | null>(null);
  
  const [expandedCareer, setExpandedCareer] = useState<string | null>(null);
  const [resetting, setResetting] = useState(false);
  const [hasCorruptedSession, setHasCorruptedSession] = useState(false);
  const t = useTranslations("Results");
  const [activeTab, setActiveTab] = useState<"matching" | "archetype" | "counselor" | "quests">("matching");
  
  // Gamification States
  const [revealedCount, setRevealedCount] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  
  // Local state to track checked quests
  const [completedQuests, setCompletedQuests] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function fetchResults() {
      if (!user) return;
      try {
        const sessionRef = doc(db, "assessment_sessions", user.uid);
        const sessionSnap = await getDoc(sessionRef);
        if (sessionSnap.exists()) {
          const data = sessionSnap.data();
          if (data.status === "completed") {
            if (data.scores && data.recommendations) {
              setScores(data.scores);
              setRecommendations(data.recommendations);
              setArchetype(data.archetype || null);
              setCounselorAnalysis(data.counselorAnalysis || null);
              setCareerMissions(data.careerMissions || null);
              setAchievements(data.achievements || null);
              
              // Initialize completed quests status
              if (data.completedQuests) {
                setCompletedQuests(data.completedQuests);
              }
            } else {
              setHasCorruptedSession(true);
            }
          }
        }
      } catch (err) {
        console.error("Error loading completed session results:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchResults();
  }, [user]);

  const handleStartOver = async () => {
    if (!user) return;
    if (!window.confirm(t("retakeConfirm"))) return;
    
    setResetting(true);
    try {
      const sessionRef = doc(db, "assessment_sessions", user.uid);
      await deleteDoc(sessionRef);
      router.push("/assessment");
    } catch (err) {
      console.error("Failed to delete active session:", err);
      setResetting(false);
    }
  };

  const handleDownloadPDF = () => {
    window.open("/results/print", "_blank");
  };

  const toggleQuest = (questTitle: string) => {
    setCompletedQuests(prev => {
      const updated = { ...prev, [questTitle]: !prev[questTitle] };
      if (user) {
        const sessionRef = doc(db, "assessment_sessions", user.uid);
        import("firebase/firestore").then(({ updateDoc }) => {
          updateDoc(sessionRef, { completedQuests: updated }).catch(console.error);
        });
      }
      return updated;
    });
  };

  const handleReveal = (index: number) => {
    if (index === revealedCount) {
      import('@/lib/audio').then(({ sfx }) => {
        if (index === 2) {
          sfx.playDing();
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 5000);
        } else {
          sfx.playSwoosh();
        }
      });
      setRevealedCount(prev => prev + 1);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-[100dvh] bg-background">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-sm font-semibold text-muted-foreground">{t("retrieving")}</p>
          </div>
        </main>
      </div>
    );
  }

  if (!scores || !recommendations) {
    return (
      <div className="flex flex-col min-h-[100dvh] bg-background">
        <Navbar />
        <main className="flex-grow flex items-center justify-center p-4">
          <Card className="w-full max-w-md border-border/40 bg-card/65 backdrop-blur-md shadow-2xl text-center p-8">
            <CardHeader className="space-y-2">
              <BadgeAlert className="mx-auto h-12 w-12 text-primary" />
              <CardTitle className="text-xl font-extrabold text-foreground">
                {hasCorruptedSession ? "Analysis Interrupted" : t("noResults")}
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                {hasCorruptedSession 
                  ? "Your assessment was submitted but the AI analysis was interrupted. You can try analyzing it again, or start over."
                  : t("notCompleted")}
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex-col gap-3 pt-4">
              {hasCorruptedSession ? (
                <>
                  <Link href="/assessment/analyzing" className="w-full font-extrabold bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6 rounded-md flex items-center justify-center gap-1.5 shadow-md">
                    Retry Analysis <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Button variant="outline" onClick={handleStartOver} disabled={resetting} className="w-full">
                    {resetting ? "Resetting..." : "Start Over"}
                  </Button>
                </>
              ) : (
                <Link href="/assessment" className="w-full font-extrabold bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6 rounded-md flex items-center justify-center gap-1.5 shadow-md">
                  {t("startAssessment")} <ArrowRight className="h-4 w-4" />
                </Link>
              )}
            </CardFooter>
          </Card>
        </main>
      </div>
    );
  }

  // Segment display formatting
  const segmentLabel = profile?.segment === "S1" || profile?.segment === "S2"
    ? `School Student (Class ${profile?.grade || "8-12"})`
    : profile?.segment === "S3"
    ? "College Student"
    : "Early Career Professional";

  // Calculate quest completion metrics
  const totalQuests = careerMissions?.length || 0;
  const totalCompleted = Object.values(completedQuests).filter(Boolean).length;
  const questProgressPct = totalQuests > 0 ? Math.round((totalCompleted / totalQuests) * 100) : 0;

  // Extract all unique skills mentioned in gaps to populate Locked Branch of Skill Tree
  const lockedSkillsFromGaps = Array.from(new Set(recommendations.flatMap(rec => rec.skillGaps || [])));

  // Calculate Top 5 traits for Radar Chart
  const topTraits = Object.entries(scores || {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const renderRadarChart = () => {
    if (topTraits.length < 3) return null;
    const numPoints = topTraits.length;
    const radius = 100;
    const cx = 150;
    const cy = 150;
    const angleStep = (Math.PI * 2) / numPoints;

    const points = topTraits.map(([, score], i) => {
      const r = (score / 100) * radius;
      const x = cx + r * Math.sin(i * angleStep);
      const y = cy - r * Math.cos(i * angleStep);
      return `${x},${y}`;
    }).join(" ");

    const webPoints = [20, 40, 60, 80, 100].map(level => {
      return Array.from({ length: numPoints }).map((_, i) => {
        const x = cx + level * Math.sin(i * angleStep);
        const y = cy - level * Math.cos(i * angleStep);
        return `${x},${y}`;
      }).join(" ");
    });

    return (
      <div className="w-full flex flex-col items-center justify-center bg-slate-900/40 rounded-3xl p-6 border border-slate-800 shadow-xl relative overflow-hidden">
        <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6">Trait Signature</h3>
        <svg width="400" height="350" className="overflow-visible max-w-full">
          {webPoints.map((pts, i) => (
            <polygon key={i} points={pts} fill="none" stroke="#334155" strokeWidth="1" />
          ))}
          {Array.from({ length: numPoints }).map((_, i) => (
            <line 
              key={i} 
              x1={cx} y1={cy} 
              x2={cx + radius * Math.sin(i * angleStep)} 
              y2={cy - radius * Math.cos(i * angleStep)} 
              stroke="#334155" 
              strokeWidth="1" 
            />
          ))}
          
          <motion.polygon
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, type: "spring", bounce: 0.4 }}
            points={points}
            fill="rgba(16, 185, 129, 0.2)"
            stroke="#10b981"
            strokeWidth="2"
            style={{ transformOrigin: "150px 150px" }}
          />
          
          {topTraits.map(([trait], i) => {
            const r = radius + 35;
            const x = cx + r * Math.sin(i * angleStep);
            const y = cy - r * Math.cos(i * angleStep);
            
            // Split trait name into max 2 lines for better layout
            const words = trait.split(" ");
            const line1 = words.slice(0, Math.ceil(words.length / 2)).join(" ");
            const line2 = words.slice(Math.ceil(words.length / 2)).join(" ");

            return (
              <text key={i} x={x} y={y} fontSize="11" fill="#94a3b8" textAnchor="middle" dominantBaseline="middle" className="font-bold tracking-wider">
                <tspan x={x} dy={line2 ? "-0.6em" : "0"}>{line1.toUpperCase()}</tspan>
                {line2 && <tspan x={x} dy="1.2em">{line2.toUpperCase()}</tspan>}
              </text>
            );
          })}
        </svg>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-[100dvh] bg-background text-foreground selection:bg-primary/20 overflow-x-hidden relative">
      <Navbar />

      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center overflow-hidden">
          {/* Confetti placeholders - in a real app you'd use react-confetti */}
          <div className="absolute top-10 left-1/4 w-3 h-3 bg-primary rotate-45 animate-ping" />
          <div className="absolute top-20 right-1/4 w-3 h-3 bg-emerald-500 rotate-12 animate-ping" style={{ animationDelay: '0.2s' }} />
          <div className="absolute top-1/3 left-1/3 w-3 h-3 bg-amber-500 rotate-90 animate-ping" style={{ animationDelay: '0.4s' }} />
          <div className="absolute top-1/4 right-1/3 w-3 h-3 bg-rose-500 rotate-45 animate-ping" style={{ animationDelay: '0.1s' }} />
        </div>
      )}

      <main className="flex-grow flex flex-col items-center max-w-5xl mx-auto px-4 sm:px-6 py-12 w-full space-y-12">
        
        {/* Header Section */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            <CheckCircle2 className="h-3.5 w-3.5" /> Assessment Complete
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground">
            Your Future is <span className="text-primary">Unlocking</span>
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            We've analyzed your psychometric profile. Click on the locked cards below to reveal your top 3 scientifically-backed career recommendations!
          </p>
        </div>

        {/* Radar Chart */}
        {renderRadarChart()}

        {/* Dynamic Archetype Banner (Identity Gamification) */}
        {archetype && (
          <div className="w-full max-w-3xl border border-primary/30 bg-primary/5 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 shadow-xl relative overflow-hidden">
            <div className="absolute -right-10 -top-10 h-40 w-40 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
            <div className="h-24 w-24 shrink-0 rounded-2xl bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center shadow-lg shadow-primary/20 border border-primary/20 rotate-3 transition-transform hover:rotate-6">
              <Sparkles className="h-10 w-10 text-primary-foreground" />
            </div>
            <div className="flex-1 text-center sm:text-left space-y-2 z-10">
              <div className="text-xs font-black uppercase tracking-widest text-primary">Your Core Archetype</div>
              <h2 className="text-2xl sm:text-3xl font-black text-foreground">{archetype.title}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{archetype.description}</p>
            </div>
          </div>
        )}

        {/* Gacha Reveal Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full relative z-10">
          {recommendations.slice(0, 3).map((rec, index) => {
            const isRevealed = revealedCount > index;
            const isNextToReveal = revealedCount === index;
            
            return (
              <div 
                key={rec.careerId} 
                onClick={() => handleReveal(index)}
                className={cn(
                  "relative h-[280px] w-full rounded-3xl border-2 transition-all duration-700 preserve-3d cursor-pointer flex flex-col items-center justify-center p-6 text-center shadow-xl group",
                  isRevealed 
                    ? "bg-card border-primary/30 shadow-primary/10 rotate-y-180" 
                    : isNextToReveal 
                      ? "bg-slate-900 border-primary shadow-[0_0_30px_rgba(var(--primary),0.3)] animate-pulse hover:scale-105" 
                      : "bg-slate-900 border-border/40 opacity-70 cursor-not-allowed"
                )}
              >
                {/* Unrevealed State (Front of card) */}
                <div className={cn("absolute inset-0 flex flex-col items-center justify-center backface-hidden", isRevealed ? "hidden" : "flex")}>
                  {isNextToReveal ? (
                    <>
                      <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Unlock className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="font-black text-lg text-primary uppercase tracking-widest">Tap to Reveal</h3>
                      <p className="text-xs text-muted-foreground mt-2 font-bold uppercase">Match #{index + 1}</p>
                    </>
                  ) : (
                    <>
                      <Lock className="h-10 w-10 text-muted-foreground/50 mb-4" />
                      <h3 className="font-bold text-sm text-muted-foreground/70 uppercase tracking-widest">Locked</h3>
                      <p className="text-xs text-muted-foreground/50 mt-2 font-bold uppercase">Reveal #{index} first</p>
                    </>
                  )}
                </div>

                {/* Revealed State (Back of card - mentally rotate it back) */}
                <div className={cn("absolute inset-0 flex flex-col items-center justify-center p-6 space-y-4 rounded-3xl bg-card border border-border/50", isRevealed ? "flex rotate-y-180" : "hidden")}>
                  <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Match #{index + 1}</span>
                    <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full border border-emerald-500/20">{rec.fitScore}% Fit</span>
                  </div>
                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/20 mt-4">
                    <Briefcase className="h-7 w-7 text-primary" />
                  </div>
                  <div className="space-y-1 w-full">
                    <h3 className="font-black text-lg text-foreground leading-tight">{rec.title}</h3>
                    <p className="text-xs text-primary font-bold">{rec.sector}</p>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed w-full">
                    {rec.whyRecommended}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Download PDF CTA - Only shows when all 3 are revealed */}
        <div className={cn("transition-all duration-1000 transform max-w-md w-full", revealedCount === 3 ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0 pointer-events-none")}>
          <Card className="border-border/40 bg-gradient-to-br from-card/90 via-card/70 to-card/50 backdrop-blur-xl shadow-2xl p-8 relative overflow-hidden text-center space-y-6">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-primary to-emerald-400" />
            
            <div className="text-center space-y-4">
              <h3 className="font-black text-xl">Get Your Full 15-Page Report</h3>
              <p className="text-muted-foreground text-sm max-w-md mx-auto">
                Unlock the deep-dive analysis of your psychometric traits, detailed roadmaps, entrance exams, and salary trajectories for all 15 career matches.
              </p>
            </div>

            <Button 
              onClick={handleDownloadPDF} 
              size="lg"
              className="w-full font-black text-sm uppercase tracking-wider shadow-xl shadow-primary/20 flex items-center justify-center gap-2.5 h-12 bg-primary hover:bg-primary/90 text-primary-foreground transition-all hover:scale-105"
            >
              <Download className="h-5 w-5" /> Download Full PDF Report
            </Button>
            
            <button onClick={handleStartOver} disabled={resetting} className="text-xs text-muted-foreground hover:text-foreground font-semibold flex items-center justify-center gap-1.5 w-full mx-auto transition-colors">
              <RotateCcw className="h-3.5 w-3.5" /> {resetting ? "Resetting..." : "Start over and retake assessment"}
            </button>
          </Card>
        </div>

      </main>
    </div>
  );
}
