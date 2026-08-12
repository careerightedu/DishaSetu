"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "@/hooks/useTranslations";
import Navbar from "@/features/auth/components/Navbar";
import { useAuth } from "@/features/auth/context/AuthContext";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

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
      // Save local check state
      if (user) {
        const sessionRef = doc(db, "assessment_sessions", user.uid);
        import("firebase/firestore").then(({ updateDoc }) => {
          updateDoc(sessionRef, { completedQuests: updated }).catch(console.error);
        });
      }
      return updated;
    });
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
  return (
    <div className="flex flex-col min-h-[100dvh] bg-background text-foreground selection:bg-primary/20">
      <Navbar />

      <main className="flex-grow flex items-center justify-center max-w-4xl mx-auto px-4 sm:px-6 py-12 w-full">
        <Card className="w-full border-border/40 bg-gradient-to-br from-card/90 via-card/70 to-card/50 backdrop-blur-xl shadow-2xl p-8 sm:p-12 relative overflow-hidden text-center space-y-8">
          
          {/* Subtle top glow bar */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-primary to-emerald-400" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-[350px] w-[350px] rounded-full bg-primary/10 blur-3xl" />

          {/* Success Icon */}
          <div className="flex items-center justify-center">
            <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 border border-primary/30 shadow-[0_0_25px_rgba(var(--primary),0.2)]">
              <CheckCircle2 className="h-10 w-10 text-primary animate-pulse" />
              <Sparkles className="h-5 w-5 text-emerald-400 absolute -top-1 -right-1" />
            </div>
          </div>

          {/* Main Title & Description */}
          <div className="space-y-3 max-w-xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              <CheckCircle2 className="h-3.5 w-3.5" /> Assessment Complete
            </span>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
              Your CareeRight Report is Ready!
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Our AI Decision Intelligence Engine has successfully compiled your official career report. All recommendations, personality archetypes, entrance exams, and actionable roadmaps have been formatted into your official PDF document.
            </p>
          </div>

          {/* Candidate Info Pill */}
          <div className="inline-flex flex-wrap items-center justify-center gap-4 bg-background/50 border border-border/30 rounded-2xl px-6 py-3 text-xs text-muted-foreground font-medium shadow-inner">
            <span><strong>Candidate:</strong> {profile?.fullName || "Student"}</span>
            <span>•</span>
            <span><strong>Report Type:</strong> Official CareeRight Report</span>
            <span>•</span>
            <span><strong>Status:</strong> <span className="text-emerald-500 font-bold">Generated</span></span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Button 
              onClick={handleDownloadPDF} 
              size="lg"
              className="w-full sm:w-auto font-black text-sm uppercase tracking-wider shadow-xl shadow-primary/20 flex items-center justify-center gap-2.5 h-12 px-8 bg-primary hover:bg-primary/90 text-primary-foreground transition-all hover:scale-105"
            >
              <Download className="h-5 w-5" /> Download CareeRight Report (PDF)
            </Button>

              <Button 
              onClick={handleStartOver} 
              variant="outline"
              disabled={resetting}
              size="lg"
              className="w-full sm:w-auto font-bold text-sm border-border/50 bg-background/50 hover:bg-background flex items-center justify-center gap-2 h-12 px-6 text-muted-foreground hover:text-foreground transition-all"
            >
              <RotateCcw className="h-4 w-4" /> {t("retakeAssessment")}
            </Button>
          </div>

          {/* Footer note */}
          <div className="pt-4 border-t border-border/20 text-[11px] text-muted-foreground flex items-center justify-center gap-2">
            <FileText className="h-3.5 w-3.5 text-primary" />
            <span>Confidential &amp; Verified • Powered by CareeRight AI Engine</span>
          </div>

        </Card>
      </main>
    </div>
  );
}
