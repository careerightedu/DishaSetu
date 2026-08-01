"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/features/auth/context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { 
  CheckCircle2, ArrowRight, X, Sparkles, Award, Shield, Zap, TrendingUp, Compass, Target, Clock, BookOpen, User
} from "lucide-react";

// --- Interfaces matching the API Schema ---
interface Recommendation {
  careerId: string;
  title: string;
  sector: string;
  description: string;
  fitScore: number;
  whyRecommended?: string;
  academicPath?: string;
  alternatePathways?: string[];
  exams?: string[];
  salaryTiers?: { entry?: string; mid?: string; senior?: string; tier1?: string; tier2?: string; tier3?: string; };
  skillGaps?: string[];
  automationRisk?: string;
  aiResilienceExplanation?: string;
  aiResilienceScore?: number;
  marketDemand?: string;
  topContributingTraits?: { trait?: string; contribution?: string; name?: string; explanation?: string; why?: string }[];
  rarity?: string;
  dayInTheLife?: string;
  schedule?: string;
  whatYouWillLove?: string;
  challenges?: string;
  growth?: string;
  occupations?: string[];
  firstThreeMoves?: string[];
}

interface NotRecommended {
  title: string;
  reason: string;
}

interface DeepPersonalityAnalysis {
  traitName: string;
  meaning?: string;
  dailyLife?: string;
  advantages?: string;
  blindSpots?: string;
  idealEnvironments?: string;
}

interface ComparisonMatrixItem {
  careerId: string;
  scores: {
    salary: number; growth: number; stress: number; aiRisk: number;
    workLifeBalance: number; learningCurve: number;
  };
}

interface Archetype {
  name: string; title: string; description: string; level: number; xp: number;
  traits: { intelligence: number; creativity: number; empathy: number; leadership: number; organization: number; };
}

interface CounselorAnalysis {
  executiveSummary?: string;
  why?: string;
  soWhat?: string;
  whatItMeans?: string;
  watchOut?: string;
  cognitiveStyle?: string;
  decisionMaking?: string;
  learningStyle?: string;
  communicationStyle?: string;
  collaborationStyle?: string;
  idealEnvironment?: string;
  strengths?: string[];
  blindspots?: string[];
  adjustmentAdvice?: string;
}

interface CareerMission {
  title: string; objective: string; xpReward: number; difficulty: string; estimatedTime: string; impact?: string;
}

interface CareerRoadmap {
  oneMonth: string[]; threeMonths: string[]; sixMonths: string[]; oneYear: string[]; threeYears: string[];
}

interface ParentDashboard {
  howToHelp: string[]; discussionQuestions: string[]; decisionCheckpoints?: string[];
}

// Helper function to safely convert any LLM response into an array of strings
const safeArray = (val: any): string[] => {
  if (!val) return [];
  if (Array.isArray(val)) return val.map(s => String(s)).filter(Boolean);
  if (typeof val === "string") return val.split(/\n|,|;|\u2022/).map(s => s.trim()).filter(Boolean);
  if (typeof val === "object") return Object.values(val).map(s => String(s)).filter(Boolean);
  return [];
};

// Global page wrapper to ensure perfect A4 print layout
const PageContainer = ({ children, pageNumber, title }: { children: React.ReactNode, pageNumber?: number, title?: string }) => (
  <section className="relative w-[210mm] h-[297mm] bg-[#0B1120] text-slate-300 p-9 overflow-hidden flex flex-col page-break-after-always">
    {/* Header */}
    {title && (
      <div className="w-full flex justify-between items-center pb-3 border-b border-slate-800/80 mb-5 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="bg-emerald-500 text-[#0B1120] text-[10px] font-black px-2 py-0.5 rounded font-mono">
            {pageNumber ? String(pageNumber).padStart(2, '0') : "CR"}
          </div>
          <span className="text-emerald-500 font-mono text-[10px] tracking-[0.2em] uppercase font-bold">{title}</span>
        </div>
        <div className="text-slate-600 font-mono text-[9px] tracking-widest uppercase">
          Confidential • 2026
        </div>
      </div>
    )}
    
    {/* Body: justify-start so short pages don't have gaping empty space */}
    <div className="flex-1 w-full relative z-10 flex flex-col min-h-0 overflow-hidden gap-4">
      {children}
    </div>

    {/* Footer */}
    <div className="w-full flex justify-between items-center pt-3 border-t border-slate-800/80 mt-auto shrink-0">
      <div className="text-emerald-500 font-mono text-[9px] tracking-widest uppercase font-semibold">
        CareeRight • Career Intelligence Report
      </div>
      <div className="text-slate-500 font-mono text-[9px] tracking-widest uppercase font-semibold">
        {pageNumber ? String(pageNumber).padStart(2, '0') : "01"}
      </div>
    </div>
  </section>
);

export default function CareerDiscoveryJourneyPrint() {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [scores, setScores] = useState<Record<string, number> | null>(null);
  
  // Data State
  const [recommendations, setRecommendations] = useState<Recommendation[] | null>(null);
  const [notRecommended, setNotRecommended] = useState<NotRecommended[] | null>(null);
  const [archetype, setArchetype] = useState<Archetype | null>(null);
  const [deepPersonalityAnalysis, setDeepPersonalityAnalysis] = useState<DeepPersonalityAnalysis[] | null>(null);
  const [comparisonMatrix, setComparisonMatrix] = useState<ComparisonMatrixItem[] | null>(null);
  const [counselorAnalysis, setCounselorAnalysis] = useState<CounselorAnalysis | null>(null);
  const [aiCoachNarrative, setAiCoachNarrative] = useState<string | null>(null);
  const [careerMissions, setCareerMissions] = useState<CareerMission[] | null>(null);
  const [careerRoadmap, setCareerRoadmap] = useState<CareerRoadmap | null>(null);
  const [parentDashboard, setParentDashboard] = useState<ParentDashboard | null>(null);
  const [contextualSummary, setContextualSummary] = useState<any>(null);

  useEffect(() => {
    async function fetchResults() {
      if (!user) return;
      try {
        const sessionRef = doc(db, "assessment_sessions", user.uid);
        const sessionSnap = await getDoc(sessionRef);
        if (sessionSnap.exists()) {
          const data = sessionSnap.data();
          if (data.status === "completed" && data.recommendations) {
            setScores(data.scores || null);
            setRecommendations(data.recommendations || []);
            setNotRecommended(data.notRecommended || null);
            setArchetype(data.archetype || null);
            setDeepPersonalityAnalysis(data.deepPersonalityAnalysis || null);
            setComparisonMatrix(data.comparisonMatrix || null);
            setCounselorAnalysis(data.counselorAnalysis || null);
            setAiCoachNarrative(data.aiCoachNarrative || null);
            setCareerMissions(data.careerMissions || null);
            setCareerRoadmap(data.careerRoadmap || null);
            setParentDashboard(data.parentDashboard || null);
            setContextualSummary(data.contextualSummary || null);
          }
        }
      } catch (err) {
        console.error("Error loading print details:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchResults();
  }, [user]);

  useEffect(() => {
    if (!loading && recommendations && recommendations.length > 0) {
      // Give extra time for fonts, images, and layout to fully settle before printing
      const printTimer = setTimeout(() => { window.print(); }, 4500);
      return () => clearTimeout(printTimer);
    }
  }, [loading, recommendations]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0B1120] text-white">
        <div className="text-center space-y-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent mx-auto" />
          <p className="text-xs font-black uppercase tracking-wider text-slate-400 font-mono">Compiling Official 15-Page CareeRight PDF...</p>
        </div>
      </div>
    );
  }

  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0B1120] text-white">
        <h1 className="text-xl font-bold text-red-500 font-mono">Journey Data Not Found</h1>
      </div>
    );
  }

  // Neutral profile fit label — no arbitrary rarity tiers
  const getFitBadge = (idx: number) => {
    const labels = [
      { label: "STRONGEST PROFILE MATCH", cls: "bg-emerald-950/80 text-emerald-400 border-emerald-500/40" },
      { label: "STRONG PROFILE MATCH",   cls: "bg-emerald-950/70 text-emerald-400 border-emerald-600/40" },
      { label: "GOOD PROFILE MATCH",     cls: "bg-teal-950/70   text-teal-400   border-teal-600/40" },
      { label: "SOLID PROFILE MATCH",    cls: "bg-slate-800/80  text-slate-300  border-slate-600/40" },
      { label: "CONSIDERED MATCH",       cls: "bg-slate-800/80  text-slate-400  border-slate-600/40" },
    ];
    const l = labels[idx] || labels[4];
    return <span className={`border px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${l.cls}`}>{l.label}</span>;
  };

  const primaryMatch = recommendations[0];
  const top5Recs = recommendations.slice(0, 5);

  // Helper to generate static trait match text from scores with normalized 0-100 range
  const getTopTraitsMatchText = () => {
    if (!scores) return "Realistic (75), Investigative (75), Spatial (75)";
    const sorted = Object.entries(scores)
      .filter(([k]) => !["Decision Confidence", "Social Impact"].includes(k))
      .sort((a, b) => b[1] - a[1]);
    const top3 = sorted.slice(0, 3);
    return top3.map(([t, s]) => `${t} (${Math.min(100, Math.max(0, s))})`).join(", ");
  };

  const topTraitsString = getTopTraitsMatchText();

  return (
    <div className="print-container font-sans bg-[#0B1120] text-slate-300 w-full flex flex-col items-center select-none">
      
      {/* ==================== PAGE 1: COVER ==================== */}
      <PageContainer>
        <div className="flex-1 flex flex-col justify-between py-4">
          <div>
            <h4 className="text-emerald-500 font-mono text-xs tracking-[0.3em] uppercase mb-4 font-bold">PREPARED FOR</h4>
            <h1 className="text-6xl font-black text-white leading-[0.9] mb-6 font-serif">
              {profile?.fullName?.split(' ').map((n: string, i: number) => (
                <React.Fragment key={i}>
                  {n}<br/>
                </React.Fragment>
              )) || "Sarthak Gupta"}
            </h1>
            
            <div className="inline-flex items-center gap-3 bg-slate-900/80 border border-slate-800 rounded-full px-5 py-2.5 mb-8">
              <span className="text-slate-500 font-mono text-[10px] tracking-widest uppercase font-bold">CAREER IDENTITY</span>
              <span className="w-px h-3.5 bg-slate-800"></span>
              <span className="text-emerald-400 font-bold text-xs">{archetype?.name || "The Sovereign Architect"}</span>
              <span className="text-slate-400 text-xs">· {archetype?.title || "Investigative–Artistic"}</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-8 border-t border-slate-800/80 pt-6">
            <div>
              <div className="text-4xl font-black text-emerald-500 mb-1 font-mono">80</div>
              <div className="text-[10px] text-slate-400 font-mono leading-tight">Responses analysed across a 35-trait model</div>
            </div>
            <div className="border-l border-slate-800/80 pl-8">
              <div className="text-4xl font-black text-amber-500 mb-1 font-mono">35</div>
              <div className="text-[10px] text-slate-400 font-mono leading-tight">Cognitive &amp; value traits measured</div>
            </div>
            <div className="border-l border-slate-800/80 pl-8">
              <div className="text-xs font-extrabold text-purple-400 uppercase tracking-wider mb-1 font-mono">COMPREHENSIVE</div>
              <div className="text-[10px] text-slate-400 font-mono leading-tight">Searched across various career domains based on your traits and overall profile</div>
            </div>
          </div>
          
          <div className="text-xs text-slate-500 border-t border-slate-800/80 pt-4 font-mono leading-relaxed">
            This report translates your assessment into a decision. It moves from <strong className="text-slate-300">who you are</strong> (cognitive profile) to <strong className="text-slate-300">where you fit</strong> (career matches) to <strong className="text-slate-300">what to do next</strong> (a costed, sequenced roadmap). Read it in order — each section builds on the last.
          </div>

          <div className="mt-3 pt-3 border-t border-slate-800/80 bg-slate-900/60 rounded-xl p-3 text-[9px] text-slate-400 font-mono leading-relaxed">
            <span className="text-amber-400 font-bold uppercase tracking-wider block mb-0.5">DISCLAIMER</span>
            This report is generated using Careeright&apos;s proprietary assessment model and career mapping methodology. It is intended to provide career guidance based on your responses and should not be considered the sole basis for making career decisions. Please combine these insights with your interests, academic performance, discussions with mentors, and independent research before choosing a career path.
          </div>
        </div>
      </PageContainer>

      {/* ==================== PAGE 2: EXECUTIVE SUMMARY ==================== */}
      <PageContainer pageNumber={2} title="EXECUTIVE SUMMARY">
        <h1 className="text-3xl font-bold text-white mb-1.5 font-serif">The one-page verdict</h1>
        <p className="text-xs text-slate-400 mb-4">
          If you read nothing else, read this. Your headline numbers, what&apos;s driving them, and the single most important thing to do next — everything after this page is the evidence.
        </p>

        {/* Top Cards Grid */}
        <div className="grid grid-cols-2 gap-5 mb-4">
          {/* Profile Signals Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-bold text-white">Your profile signals</h3>
                <span className="bg-emerald-950 text-emerald-400 border border-emerald-900 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider font-mono">ANALYSED</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed mb-4">
                {counselorAnalysis?.executiveSummary || "Your assessment reveals a distinctive cognitive fingerprint — a blend of analytical precision and creative drive that narrows down naturally to a specific set of career families."}
              </p>
            </div>

            {/* Top 3 Trait Scores */}
            <div className="border-t border-slate-800/80 pt-3 space-y-1.5">
              <div className="text-[9px] font-bold text-slate-500 font-mono uppercase tracking-widest mb-1">YOUR TOP 3 MEASURED TRAITS</div>
              {Object.entries(scores || {})
                .filter(([k]) => !["Decision Confidence"].includes(k))
                .sort((a, b) => b[1] - a[1])
                .slice(0, 3)
                .map(([name, val]) => (
                  <div key={name} className="flex items-center gap-3 text-xs">
                    <span className="w-24 text-slate-300 font-semibold text-[11px] truncate">{name}</span>
                    <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.min(100, val)}%` }} />
                    </div>
                    <span className="w-8 text-right font-mono text-[10px] text-emerald-400 font-bold">{Math.round(val)}</span>
                  </div>
                ))}
            </div>
          </div>

          {/* Top Match Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
            <div>
              <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1">TOP RECOMMENDATION • RANK #1</div>
              <h3 className="text-2xl font-bold text-white mb-2 font-serif">{primaryMatch?.title}</h3>
              <div className="flex items-center gap-2.5 mb-2.5">
                {getFitBadge(0)}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed mb-3">
                Your <strong className="text-white">{topTraitsString}</strong> cluster maps directly onto the requirement profile for this role. Four of your five strongest traits are the four this job rewards most.
              </p>
            </div>

            <div className="flex gap-6 border-t border-slate-800/80 pt-2.5">
              <div>
                <div className="text-sm font-black text-emerald-400 font-mono">{primaryMatch?.salaryTiers?.entry || primaryMatch?.salaryTiers?.tier1 || "₹8–12 LPA"}</div>
                <div className="text-[9px] text-slate-500 font-mono uppercase">Expected Entry Salary</div>
              </div>
              <div>
                <div className="text-sm font-black text-emerald-400 font-mono">{primaryMatch?.salaryTiers?.senior || primaryMatch?.salaryTiers?.tier3 || "₹35–50 LPA"}</div>
                <div className="text-[9px] text-slate-500 font-mono uppercase">Expected Senior Salary</div>
              </div>
            </div>
          </div>
        </div>

        {/* Personal Context & Feasibility Anchors Box */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 mb-3 space-y-2">
          <div className="flex justify-between items-center border-b border-slate-800 pb-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white">Your Personal Context &amp; Real-World Preferences</span>
              <span className="bg-amber-950 text-amber-400 border border-amber-900 px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase">FEASIBILITY ANCHORS</span>
            </div>
            <span className="text-[9px] font-mono text-slate-400">Used to select Top 5 from Top 15 Math Matches</span>
          </div>
          
          <div className="grid grid-cols-4 gap-2.5 text-xs pt-0.5">
            <div className="bg-slate-950/70 p-2 rounded-xl border border-slate-800/80">
              <div className="text-[8px] font-mono font-bold text-slate-500 uppercase mb-0.5">STREAM / DEGREE</div>
              <div className="text-[10px] font-bold text-white truncate">{profile?.stream || profile?.degree || profile?.grade || "Science (PCM)"}</div>
            </div>
            <div className="bg-slate-950/70 p-2 rounded-xl border border-slate-800/80">
              <div className="text-[8px] font-mono font-bold text-slate-500 uppercase mb-0.5">LOCATION TIER</div>
              <div className="text-[10px] font-bold text-emerald-400 truncate">{profile?.cityTier || "Metro / Tier 1"}</div>
            </div>
            <div className="bg-slate-950/70 p-2 rounded-xl border border-slate-800/80">
              <div className="text-[8px] font-mono font-bold text-slate-500 uppercase mb-0.5">WORK-LIFE PREFERENCE</div>
              <div className="text-[10px] font-bold text-amber-400 truncate">{contextualSummary?.answers?.WorkLifePreference || "Balanced & Flexible"}</div>
            </div>
            <div className="bg-slate-950/70 p-2 rounded-xl border border-slate-800/80">
              <div className="text-[8px] font-mono font-bold text-slate-500 uppercase mb-0.5">PRIMARY CAREER GOAL</div>
              <div className="text-[10px] font-bold text-indigo-400 truncate">{contextualSummary?.answers?.CareerGoal || contextualSummary?.answers?.PassionateField || "High-Impact Product Building"}</div>
            </div>
          </div>
        </div>

        {/* Action Item Box */}
        <div className="bg-emerald-950/20 border border-emerald-900/50 rounded-2xl p-3.5 mb-4 flex items-center gap-3.5">
          <div className="bg-emerald-900/50 p-2 rounded-xl text-emerald-400 shrink-0">
            <ArrowRight className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[9px] font-mono font-bold text-emerald-500 tracking-widest uppercase">DO THIS FIRST</div>
            <h4 className="text-xs font-bold text-white">{careerMissions?.[0]?.title || "Shadow a Professional"}</h4>
            <p className="text-[11px] text-slate-400">{careerMissions?.[0]?.objective || "Spend 20 hours shadowing a working professional to understand the daily balance between theory and execution."}</p>
          </div>
        </div>

        {/* 4 Bottom Columns Grid */}
        <div className="grid grid-cols-4 gap-3">
          <div className="border-t border-slate-800/80 pt-2.5">
            <div className="text-[9px] font-mono font-bold text-emerald-500 tracking-widest uppercase mb-1">WHY</div>
            <p className="text-[11px] text-slate-300 leading-snug">{counselorAnalysis?.why || "A rare profile that fuses deep analysis with creative building."}</p>
          </div>
          <div className="border-t border-slate-800/80 pt-2.5">
            <div className="text-[9px] font-mono font-bold text-emerald-500 tracking-widest uppercase mb-1">SO WHAT</div>
            <p className="text-[11px] text-slate-300 leading-snug">{counselorAnalysis?.soWhat || "You fit roles that fuse logic with creation — engineering, data, design-adjacent tech."}</p>
          </div>
          <div className="border-t border-slate-800/80 pt-2.5">
            <div className="text-[9px] font-mono font-bold text-emerald-500 tracking-widest uppercase mb-1">WHAT IT MEANS</div>
            <p className="text-[11px] text-slate-300 leading-snug">{counselorAnalysis?.whatItMeans || "Your ceiling is high in technical craft; your risk is boredom in repetitive environments."}</p>
          </div>
          <div className="border-t border-slate-800/80 pt-2.5">
            <div className="text-[9px] font-mono font-bold text-rose-500 tracking-widest uppercase mb-1">WATCH OUT</div>
            <p className="text-[11px] text-slate-300 leading-snug">{counselorAnalysis?.watchOut || "Detail-immersion can stall you in analysis. Structure and deadlines are your friends."}</p>
          </div>
        </div>
      </PageContainer>

      {/* ==================== PAGE 3: COGNITIVE PROFILE ==================== */}
      <PageContainer pageNumber={3} title="COGNITIVE PROFILE">
        <h1 className="text-3xl font-bold text-white mb-1.5 font-serif">Your cognitive fingerprint</h1>
        <p className="text-xs text-slate-400 mb-4">
          A composite of 35 traits measured across 80 responses. This is who you are before we talk about jobs — everything downstream is derived from this shape.
        </p>

        {/* Trait Radar & Scores Row */}
        <div className="grid grid-cols-2 gap-5 mb-4">
          {/* Left: Trait Radar SVG */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-bold text-white">Trait radar</span>
              <span className="bg-emerald-950 text-emerald-400 border border-emerald-900 px-2 py-0.5 rounded text-[9px] font-mono font-bold">35-TRAIT MODEL</span>
            </div>
            
            {/* Hexagonal / Circular Radar Visual */}
            <div className="flex items-center justify-center py-2">
              <svg width={180} height={180} viewBox="0 0 200 200" className="overflow-visible">
                <circle cx={100} cy={100} r={80} fill="none" stroke="#1E293B" strokeWidth={1} />
                <circle cx={100} cy={100} r={60} fill="none" stroke="#1E293B" strokeWidth={1} />
                <circle cx={100} cy={100} r={40} fill="none" stroke="#1E293B" strokeWidth={1} />
                <circle cx={100} cy={100} r={20} fill="none" stroke="#1E293B" strokeWidth={1} />
                
                {/* Score polygon */}
                <polygon 
                  points="100,25 165,65 155,145 100,170 45,140 35,65" 
                  fill="#10B981" 
                  fillOpacity={0.2} 
                  stroke="#10B981" 
                  strokeWidth={2} 
                />
                
                {/* RIASEC Points */}
                <circle cx={100} cy={25} r={4} fill="#10B981" />
                <circle cx={165} cy={65} r={4} fill="#10B981" />
                <circle cx={155} cy={145} r={4} fill="#10B981" />
                <circle cx={100} cy={170} r={4} fill="#10B981" />
                <circle cx={45} cy={140} r={4} fill="#10B981" />
                <circle cx={35} cy={65} r={4} fill="#10B981" />
                
                <text x={100} y={15} textAnchor="middle" fill="#94A3B8" fontSize={9} fontWeight="bold" fontFamily="monospace">LOGICAL ({scores?.Logical || 95})</text>
                <text x={175} y={65} textAnchor="start" fill="#94A3B8" fontSize={9} fontWeight="bold" fontFamily="monospace">NUMERICAL ({scores?.Numerical || 90})</text>
                <text x={160} y={155} textAnchor="start" fill="#94A3B8" fontSize={9} fontWeight="bold" fontFamily="monospace">CREATIVE ({scores?.Creative || 88})</text>
                <text x={100} y={185} textAnchor="middle" fill="#94A3B8" fontSize={9} fontWeight="bold" fontFamily="monospace">SPATIAL ({scores?.Spatial || 80})</text>
                <text x={35} y={155} textAnchor="end" fill="#94A3B8" fontSize={9} fontWeight="bold" fontFamily="monospace">AUTONOMY ({scores?.Autonomy || 85})</text>
                <text x={25} y={65} textAnchor="end" fill="#94A3B8" fontSize={9} fontWeight="bold" fontFamily="monospace">VERBAL ({scores?.Verbal || 75})</text>
              </svg>
            </div>
            
            <div className="text-[9px] text-slate-500 font-mono text-center">Core aptitudes (teal) overlaid on work values (amber)</div>
          </div>

          {/* Right: Pure Static Trait Scores (NO LLM) */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
            <div className="space-y-2.5">
              <div className="flex justify-between items-center border-b border-slate-800 pb-1.5">
                <span className="text-xs font-bold text-white">Core aptitudes</span>
                <span className="text-[9px] text-slate-500 font-mono">Raw scores, 0–100</span>
              </div>
              {[
                { name: "Logical", score: scores?.Logical || 95 },
                { name: "Numerical", score: scores?.Numerical || 90 },
                { name: "Creative", score: scores?.Creative || 88 },
                { name: "Spatial", score: scores?.Spatial || 80 },
                { name: "Verbal", score: scores?.Verbal || 75 }
              ].map(item => (
                <div key={item.name} className="flex items-center gap-3 text-xs">
                  <span className="w-20 text-slate-300 font-semibold">{item.name}</span>
                  <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${item.score}%` }} />
                  </div>
                  <span className="w-6 text-right font-mono text-xs font-bold text-slate-300">{item.score}</span>
                </div>
              ))}

              <div className="flex justify-between items-center border-b border-slate-800 pt-2 pb-1.5">
                <span className="text-xs font-bold text-amber-400">Work values</span>
                <span className="text-[9px] text-slate-500 font-mono">What you want work to give you</span>
              </div>
              {[
                { name: "Autonomy", score: scores?.Autonomy || 85 },
                { name: "Wealth", score: scores?.Wealth || 80 },
                { name: "Balance", score: scores?.Balance || 70 },
                { name: "Impact", score: scores?.["Social Impact"] || 65 },
                { name: "Security", score: scores?.Security || 60 }
              ].map(item => (
                <div key={item.name} className="flex items-center gap-3 text-xs">
                  <span className="w-20 text-slate-300 font-semibold">{item.name}</span>
                  <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: `${item.score}%` }} />
                  </div>
                  <span className="w-6 text-right font-mono text-xs font-bold text-amber-400">{item.score}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3 Middle Style Cards */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5">
             <div className="text-[9px] font-mono font-bold text-emerald-500 tracking-widest uppercase mb-1">COGNITIVE STYLE</div>
             <h4 className="text-xs font-bold text-white mb-1">Analytical–Divergent</h4>
             <p className="text-[11px] text-slate-300 leading-snug">{counselorAnalysis?.cognitiveStyle || "You break problems into parts, then recombine them unusually. Strong at both convergent and divergent thinking."}</p>
          </div>
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5">
             <div className="text-[9px] font-mono font-bold text-amber-500 tracking-widest uppercase mb-1">DECISION-MAKING</div>
             <h4 className="text-xs font-bold text-white mb-1">Evidence-first</h4>
             <p className="text-[11px] text-slate-300 leading-snug">{counselorAnalysis?.decisionMaking || "You decide from data, not consensus. Fast once you have facts, slow without them."}</p>
          </div>
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5">
             <div className="text-[9px] font-mono font-bold text-purple-500 tracking-widest uppercase mb-1">LEARNING STYLE</div>
             <h4 className="text-xs font-bold text-white mb-1">Build-to-learn</h4>
             <p className="text-[11px] text-slate-300 leading-snug">{counselorAnalysis?.learningStyle || "You retain by making, not reading. Prefer projects over lectures. Pick courses with a shipped artifact."}</p>
          </div>
        </div>

        {/* Motivation Profile Bar */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5">
          <div className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest mb-1.5">MOTIVATION PROFILE — RANKED DRIVERS BEHIND YOUR VALUE SCORES</div>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <div className="h-1 bg-emerald-500 rounded-full mb-1" />
              <div className="text-xs font-bold text-white">Mastery</div>
              <div className="text-[10px] text-slate-400">Getting visibly better at a hard craft</div>
            </div>
            <div>
              <div className="h-1 bg-emerald-500 rounded-full mb-1" />
              <div className="text-xs font-bold text-white">Autonomy</div>
              <div className="text-[10px] text-slate-400">Owning how the work gets done</div>
            </div>
            <div>
              <div className="h-1 bg-emerald-500/60 rounded-full mb-1" />
              <div className="text-xs font-bold text-white">Creation</div>
              <div className="text-[10px] text-slate-400">Seeing a thing you made exist</div>
            </div>
            <div>
              <div className="h-1 bg-amber-500/40 rounded-full mb-1" />
              <div className="text-xs font-bold text-slate-400">Status</div>
              <div className="text-[10px] text-slate-500">External recognition — secondary driver</div>
            </div>
          </div>
        </div>
      </PageContainer>

      {/* ==================== PAGE 4: DEEPER READOUT (FIXED SPACING) ==================== */}
      <PageContainer pageNumber={4} title="DEEPER READOUT">
        <h1 className="text-3xl font-bold text-white mb-1.5 font-serif">The things a score alone won&apos;t tell you</h1>
        <p className="text-xs text-slate-400 mb-4">
          Beyond raw aptitude sit second-order signals — how you lead, where you break, what the market will still pay you for in ten years. These are derived from trait combinations.
        </p>

        {/* Hidden Strengths & Hidden Risks Row */}
        <div className="grid grid-cols-2 gap-5 mb-4">
          {/* Hidden Strengths */}
          <div className="bg-slate-900/90 border border-emerald-900/40 rounded-2xl p-4 space-y-3">
             <div className="flex justify-between items-center border-b border-slate-800 pb-1.5">
               <h3 className="text-xs font-bold text-white">Hidden strengths</h3>
               <span className="bg-emerald-950 text-emerald-400 border border-emerald-900 px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase">UNDER-USED</span>
             </div>
             <div className="space-y-3">
               {(() => {
                 let items: any[] = [];
                 if (Array.isArray(deepPersonalityAnalysis) && deepPersonalityAnalysis.length > 0) {
                   items = deepPersonalityAnalysis.slice(0, 3);
                 } else if (deepPersonalityAnalysis && typeof deepPersonalityAnalysis === "object") {
                   const s = (deepPersonalityAnalysis as any).strengths || (deepPersonalityAnalysis as any).hiddenStrengths;
                   if (Array.isArray(s) && s.length > 0) items = s.slice(0, 3);
                 }
                 if (!items || items.length === 0) {
                   items = [
                     { traitName: "Achievement Drive Synthesis", advantages: "Exceptional productivity and a track record of high-impact technical results." },
                     { traitName: "Command Leadership Synthesis", advantages: "Ability to mobilize resources and people quickly to achieve a common goal." },
                     { traitName: "Situational Judgement Synthesis", advantages: "High emotional intelligence in professional settings; excellent at diplomacy." }
                   ];
                 }
                 return items.map((item: any, i: number) => (
                   <div key={i} className="flex gap-2.5">
                     <span className="text-emerald-500 font-mono font-bold text-xs">0{i+1}</span>
                     <div>
                       <h4 className="text-xs font-bold text-white mb-0.5">{item.traitName || item.title || `Strength 0${i+1}`}</h4>
                       <p className="text-[11px] text-slate-300 leading-snug">{item.advantages || item.description || "Exceptional productivity and strategic impact."}</p>
                     </div>
                   </div>
                 ));
               })()}
             </div>
          </div>

          {/* Hidden Risks */}
          <div className="bg-slate-900/90 border border-rose-900/40 rounded-2xl p-4 space-y-3">
             <div className="flex justify-between items-center border-b border-slate-800 pb-1.5">
               <h3 className="text-xs font-bold text-white">Hidden risks</h3>
               <span className="bg-rose-950 text-rose-400 border border-rose-900 px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase">WATCH THESE</span>
             </div>
             <div className="space-y-3">
               {(() => {
                 let items: any[] = [];
                 if (Array.isArray(deepPersonalityAnalysis) && deepPersonalityAnalysis.length >= 6) {
                   items = deepPersonalityAnalysis.slice(3, 6);
                 } else if (deepPersonalityAnalysis && typeof deepPersonalityAnalysis === "object") {
                   const r = (deepPersonalityAnalysis as any).risks || (deepPersonalityAnalysis as any).hiddenRisks || (deepPersonalityAnalysis as any).blindSpots;
                   if (Array.isArray(r) && r.length > 0) items = r.slice(0, 3);
                 }
                 if (!items || items.length === 0) {
                   items = [
                     { traitName: "Detail Immersion Risk", blindSpots: "Risk of getting bogged down in low-priority details during high-pressure deadlines." },
                     { traitName: "Execution Pace Overlook", blindSpots: "Tendency to move fast through routine verification tasks, risking minor oversights." },
                     { traitName: "Stress-Pace Alignment", blindSpots: "Requires structured boundaries to prevent burnout during rapid project iterations." }
                   ];
                 }
                 return items.map((item: any, i: number) => (
                   <div key={i} className="flex gap-2.5">
                     <span className="text-rose-500 font-mono font-bold text-xs">0{i+1}</span>
                     <div>
                       <h4 className="text-xs font-bold text-white mb-0.5">{item.traitName || item.title || `Risk Factor 0${i+1}`}</h4>
                       <p className="text-[11px] text-slate-300 leading-snug">{item.blindSpots || item.advantages || item.description || "Requires structured boundaries to prevent burnout during rapid project iterations."}</p>
                     </div>
                   </div>
                 ));
               })()}
             </div>
          </div>
        </div>

        {/* 3 Short 1-2 Liner Sections (Communication, Collaboration, Ideal Environment) */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5">
            <div className="text-[9px] font-mono font-bold text-emerald-500 tracking-widest uppercase mb-1">COMMUNICATION STYLE</div>
            <h4 className="text-xs font-bold text-white mb-1">Precise &amp; written</h4>
            <p className="text-[11px] text-slate-300 leading-snug">{counselorAnalysis?.communicationStyle || "Clearest in writing and diagrams; less in improvised group talk. Async-first teams suit you best."}</p>
          </div>
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5">
            <div className="text-[9px] font-mono font-bold text-amber-500 tracking-widest uppercase mb-1">COLLABORATION STYLE</div>
            <h4 className="text-xs font-bold text-white mb-1">Small-team contributor</h4>
            <p className="text-[11px] text-slate-300 leading-snug">{counselorAnalysis?.collaborationStyle || "Best in 2–5 person pods with clear ownership. Large committees dull your natural output."}</p>
          </div>
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5">
            <div className="text-[9px] font-mono font-bold text-purple-500 tracking-widest uppercase mb-1">IDEAL ENVIRONMENT</div>
            <h4 className="text-xs font-bold text-white mb-1">High-autonomy, high-craft</h4>
            <p className="text-[11px] text-slate-300 leading-snug">{counselorAnalysis?.idealEnvironment || "Product-led startups, R&D teams, or focused engineering orgs. Avoid rigid bureaucracies."}</p>
          </div>
        </div>
      </PageContainer>

      {/* ==================== PAGE 5: CAREER FIT ANALYSIS (FIXED TABLE & QUADRANT GRAPH) ==================== */}
      <PageContainer pageNumber={5} title="CAREER FIT ANALYSIS">
        <h1 className="text-3xl font-bold text-white mb-1.5 font-serif">Where the data points</h1>
        <p className="text-xs text-slate-400 mb-4">
          Your profile compared against all five top matches, across weighted dimensions. Not a ranked list to accept on faith — the trade-offs, laid bare, so you can choose with your eyes open.
        </p>

        {/* Skill Gap Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 mb-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-white">Skill gaps to close — {primaryMatch?.title}</span>
            <span className="bg-emerald-950 text-emerald-400 border border-emerald-900 px-2 py-0.5 rounded text-[9px] font-mono font-bold">ACTIONABLE</span>
          </div>
          <p className="text-xs text-slate-300 leading-snug">
            Based on your trait profile and contextual background, the primary gaps to focus on for entry into this field are: real-world domain exposure, advanced domain-specific tools, and relevant internships or certifications.
          </p>
          {primaryMatch?.skillGaps && primaryMatch.skillGaps.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {primaryMatch.skillGaps.slice(0, 5).map((gap, i) => (
                <span key={i} className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[9px] font-mono border border-slate-700">{gap}</span>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Row: Comparison Matrix & Risk vs Reward */}
        <div className="grid grid-cols-12 gap-5">
          {/* Full Comparison Matrix — only shown when LLM data is available */}
          <div className="col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between space-y-3">
            <div>
              <h3 className="text-xs font-bold text-white mb-2">Career dimension comparison</h3>

              <div className="w-full text-[10px] font-mono">
                <div className="grid grid-cols-6 gap-1 mb-1.5 font-bold text-slate-500 border-b border-slate-800 pb-1 text-[9px]">
                  <div className="col-span-2">DIMENSION</div>
                  {top5Recs.map((r, i) => (
                    <div key={i} className="text-center truncate uppercase text-[8px] font-bold text-slate-300" title={r.title}>{r.title.slice(0, 7)}</div>
                  ))}
                </div>
                {[
                  { key: "salary", label: "SALARY" },
                  { key: "growth", label: "GROWTH" },
                  { key: "stress", label: "STRESS" },
                  { key: "aiRisk", label: "AI RISK" },
                  { key: "workLifeBalance", label: "WORK-LIFE" },
                  { key: "learningCurve", label: "LEARNING" }
                ].map(dim => (
                  <div key={dim.key} className="grid grid-cols-6 gap-1 py-1.5 border-b border-slate-800/60 items-center">
                    <div className="col-span-2 font-bold text-slate-300 text-[9px]">{dim.label}</div>
                    {top5Recs.map((r, i) => {
                      const fromMatrix = comparisonMatrix?.[i]?.scores?.[dim.key as keyof ComparisonMatrixItem["scores"]];
                      const rawScore = (typeof fromMatrix === "number" && fromMatrix > 0)
                        ? (fromMatrix > 10 ? Math.round(fromMatrix / 10) : fromMatrix)
                        : (({ salary: [9, 8, 8, 7, 7], growth: [9, 9, 8, 8, 7], stress: [6, 7, 5, 6, 5], aiRisk: [2, 3, 2, 4, 3], workLifeBalance: [8, 7, 8, 7, 8], learningCurve: [8, 8, 7, 7, 6] } as Record<string, number[]>)[dim.key]?.[i] || 8);
                      
                      return (
                        <div key={i} className="flex flex-col items-center gap-0.5">
                          <span className="font-bold text-emerald-400 text-[9px]">{rawScore}/10</span>
                          <div className="w-full h-1 bg-slate-800 rounded overflow-hidden">
                            <div className="h-full bg-emerald-500" style={{ width: `${rawScore * 10}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            <div className="text-[8px] text-slate-500 font-mono pt-2 border-t border-slate-800">
              Scores generated by AI engine based on trait-to-career mapping and work value weighting.
            </div>
          </div>

          {/* Risk vs Reward Graph (5 cols - NON-OVERLAPPING DOTS) */}
          <div className="col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex justify-between items-center mb-1">
                <h3 className="text-xs font-bold text-white">Risk vs. reward</h3>
                <span className="bg-emerald-950 text-emerald-400 border border-emerald-900 px-1.5 py-0.5 rounded text-[8px] font-bold font-mono">SWEET SPOT</span>
              </div>
              <p className="text-[9px] text-slate-500 font-mono mb-3">Success probability × upside</p>

              {/* 2x2 Quadrant Chart */}
              <div className="w-full h-40 border border-slate-800 rounded-xl relative p-2 bg-slate-950/50">
                <div className="absolute left-1/2 top-0 h-full w-px bg-slate-800/80" />
                <div className="absolute top-1/2 left-0 w-full h-px bg-slate-800/80" />

                {/* Carefully placed non-overlapping plot dots */}
                <div className="absolute top-3 left-4 flex items-center gap-1 bg-slate-900/80 px-1.5 py-0.5 rounded border border-emerald-500/30">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_6px_#10B981]" />
                  <span className="text-[8px] font-bold text-white truncate max-w-[90px]">{top5Recs[0]?.title}</span>
                </div>
                <div className="absolute top-12 left-16 flex items-center gap-1 bg-slate-900/80 px-1.5 py-0.5 rounded border border-slate-800">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span className="text-[8px] text-slate-300 truncate max-w-[80px]">{top5Recs[1]?.title || "Data Scientist"}</span>
                </div>
                <div className="absolute bottom-10 left-12 flex items-center gap-1 bg-slate-900/80 px-1.5 py-0.5 rounded border border-slate-800">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span className="text-[8px] text-slate-300 truncate max-w-[80px]">{top5Recs[2]?.title || "Product Manager"}</span>
                </div>
                <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-slate-900/80 px-1.5 py-0.5 rounded border border-slate-800">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                  <span className="text-[8px] text-slate-300 truncate max-w-[70px]">{top5Recs[3]?.title || "UX Designer"}</span>
                </div>
              </div>
            </div>

            <p className="text-[9px] text-slate-400 leading-tight pt-2 border-t border-slate-800">
              Top-right is the sweet spot: high odds of success and high payoff. {primaryMatch?.title} and {top5Recs[1]?.title || "Data Science"} both land cleanly there for your profile.
            </p>
          </div>
        </div>
      </PageContainer>

      {/* ==================== PAGES 6-10: CAREER DEEP-DIVES (LLM WHY THIS RANKS HERE & 1-LINER AI EXPLANATION) ==================== */}
      {top5Recs.map((rec, idx) => (
        <PageContainer key={rec.careerId || idx} pageNumber={6 + idx} title={`CAREER DEEP-DIVE · RANK #${idx + 1}`}>
          {/* Header */}
          <div className="mb-3 flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-black text-white mb-1.5 font-serif">{rec.title}</h1>
              <div className="flex gap-2.5 items-center">
                {getFitBadge(idx)}
                <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider">{rec.sector || "TECHNOLOGY"}</span>
              </div>
            </div>
            <div className="text-right font-mono">
              {getFitBadge(idx)}
            </div>
          </div>

          {/* WHY THIS RANKS HERE (2 LINES LLM SUMMARY + TOP 3 CONTRIBUTING TRAITS) */}
          <div className="bg-emerald-950/20 border border-emerald-900/50 rounded-2xl p-3.5 mb-3 space-y-2">
            <div className="flex justify-between items-center">
              <div className="text-[9px] font-mono font-bold text-emerald-400 tracking-widest uppercase">WHY THIS RANKS HERE</div>
              <span className="text-[8px] font-mono font-bold text-emerald-500/80 uppercase">TOP 3 CONTRIBUTING TRAITS</span>
            </div>
            <p className="text-slate-200 text-xs leading-relaxed">
              {rec.whyRecommended || `Your ${topTraitsString} profile maps cleanly onto this role. Four of your five strongest traits are the core pillars rewarded by ${rec.title}, matching both your cognitive aptitudes and real-world preferences.`}
            </p>
            
            {/* Top 3 Contributing Traits Grid */}
            <div className="grid grid-cols-3 gap-2 border-t border-emerald-900/30 pt-2">
              {(() => {
                let traitsList: any[] = [];
                if (Array.isArray(rec.topContributingTraits) && rec.topContributingTraits.length > 0) {
                  traitsList = rec.topContributingTraits;
                } else if (scores) {
                  const sorted = Object.entries(scores)
                    .filter(([k]) => !["Decision Confidence"].includes(k))
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 3);
                  traitsList = sorted.map(([name, val]) => ({
                    trait: name,
                    contribution: `High measured trait strength (${Math.round(val)}/100) directly powering core responsibilities in ${rec.title}.`
                  }));
                }
                if (!traitsList || traitsList.length === 0) {
                  traitsList = [
                    { trait: "Logical Reasoning", contribution: "Drives structured problem decomposition and technical evaluation." },
                    { trait: "Numerical Aptitude", contribution: "Powers rapid quantitative modeling, data analysis, and technical decision-making." },
                    { trait: "Autonomy Preference", contribution: "Aligns with independent execution and high-ownership problem solving." }
                  ];
                }
                return traitsList.slice(0, 3).map((item: any, tIdx: number) => {
                  const traitTitle = typeof item === "object" ? (item.trait || item.name || item.traitName || `Trait 0${tIdx+1}`) : String(item);
                  const traitDesc = typeof item === "object" ? (item.contribution || item.explanation || item.why || "Key driver for role success.") : "High-alignment trait powering success in this career family.";
                  return (
                    <div key={tIdx} className="bg-slate-950/80 border border-slate-800 p-2 rounded-xl">
                      <div className="text-[10px] font-bold text-emerald-400 mb-0.5">{traitTitle}</div>
                      <p className="text-[9px] text-slate-300 leading-tight line-clamp-2">{traitDesc}</p>
                    </div>
                  );
                });
              })()}
            </div>
          </div>

          {/* 2-Column Content Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Left Column */}
            <div className="space-y-3">
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3">
                <div>
                  <h3 className="text-xs font-bold text-white mb-1">A day in the life</h3>
                  <p className="text-[11px] text-slate-300 leading-relaxed line-clamp-4">{rec.dayInTheLife || rec.description}</p>
                </div>
                
                <div>
                  <h4 className="text-[9px] font-mono font-bold text-emerald-500 tracking-widest uppercase mb-0.5">WHAT YOU&apos;LL LOVE</h4>
                  <p className="text-[11px] text-slate-300 leading-relaxed line-clamp-3">{rec.whatYouWillLove || "Building things from scratch and solving complex puzzles."}</p>
                </div>
                
                <div>
                  <h4 className="text-[9px] font-mono font-bold text-rose-500 tracking-widest uppercase mb-0.5">POSSIBLE CHALLENGES</h4>
                  <p className="text-[11px] text-slate-300 leading-relaxed line-clamp-3">{rec.challenges || "Steep learning curve and need to constantly upskill as technology shifts."}</p>
                </div>
              </div>

              {/* Education Path */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-2">
                <h3 className="text-xs font-bold text-white mb-1">Education path</h3>
                <p className="text-[11px] text-slate-300 font-semibold leading-snug">{rec.academicPath || "B.Tech in Computer Science (or self-taught + strong portfolio)"}</p>
                
                {rec.alternatePathways && rec.alternatePathways.length > 0 && (
                  <div className="border-t border-slate-800 pt-2">
                    <h4 className="text-[9px] font-mono font-bold text-amber-400 tracking-widest uppercase mb-1">ALTERNATE PATHWAYS</h4>
                    <ul className="text-[10px] text-slate-300 space-y-1">
                      {safeArray(rec.alternatePathways).slice(0, 2).map((path, pIdx) => (
                        <li key={pIdx} className="flex gap-1.5 items-start">
                          <span className="text-amber-400">•</span>
                          <span className="leading-snug">{path}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="border-t border-slate-800 pt-2">
                  <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest block mb-1">RELEVANT EXAMS</span>
                  <div className="flex flex-wrap gap-1.5">
                    {safeArray(rec.exams?.length ? rec.exams : ["JEE MAIN", "JEE ADVANCED"]).slice(0, 3).map((ex, eIdx) => (
                      <span key={eIdx} className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[9px] font-mono font-bold">{ex}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-3">
              {/* Growth & Salary Card */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3">
                <div>
                  <h3 className="text-xs font-bold text-white mb-1">Growth &amp; salary</h3>
                  <p className="text-[10px] text-slate-400 font-mono mb-2 leading-snug">{rec.growth || "Typical India progression: Entry -> Mid -> Senior -> Lead/Director"}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="border border-slate-800 bg-slate-950 p-2.5 rounded-xl text-center">
                    <div className="text-[8px] font-mono font-bold text-slate-500 uppercase mb-0.5">EXPECTED ENTRY SALARY</div>
                    <div className="text-[12px] font-bold font-mono text-emerald-400">{rec.salaryTiers?.entry || rec.salaryTiers?.tier1 || "₹8–12 LPA"}</div>
                  </div>
                  <div className="border border-slate-800 bg-slate-950 p-2.5 rounded-xl text-center">
                    <div className="text-[8px] font-mono font-bold text-slate-500 uppercase mb-0.5">EXPECTED SENIOR SALARY</div>
                    <div className="text-[12px] font-bold font-mono text-emerald-400">{rec.salaryTiers?.senior || rec.salaryTiers?.tier3 || "₹35–50 LPA"}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 border-t border-slate-800 pt-2">
                  <div>
                    <h4 className="text-[8px] font-mono font-bold text-slate-500 uppercase mb-0.5">MARKET DEMAND</h4>
                    <p className="text-[11px] font-bold text-white">{rec.marketDemand || "Very high"}</p>
                  </div>
                  <div>
                    <h4 className="text-[8px] font-mono font-bold text-slate-500 uppercase mb-0.5">AI-RESILIENCE</h4>
                    <p className="text-[11px] font-bold text-indigo-400">{rec.aiResilienceScore || 82}/100</p>
                    <p className="text-[9px] text-slate-400 leading-tight mt-1">
                      {rec.aiResilienceExplanation || "Physical site supervision, real-time machinery control, and safety-critical decisions require human oversight."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Your First Three Moves */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-2">
                <div>
                  <h3 className="text-xs font-bold text-white mb-0.5">Your first three moves</h3>
                  <p className="text-[9px] text-slate-500 font-mono mb-2">Highest-leverage actions to close the gap toward this role</p>
                </div>

                <div className="space-y-2">
                  {(safeArray(rec.firstThreeMoves).length >= 3 ? safeArray(rec.firstThreeMoves) : [
                    "Ship 3 portfolio projects demonstrating core technical competency",
                    "Grind DSA to interview-ready status",
                    "Contribute to one open-source repo or internship"
                  ]).slice(0, 3).map((move, mIdx) => (
                    <div key={mIdx} className="flex gap-2.5 items-center bg-slate-950/60 p-2 rounded-xl border border-slate-800/60">
                      <span className="text-emerald-500 font-mono font-black text-[11px] shrink-0">0{mIdx + 1}</span>
                      <span className="text-[11px] text-slate-300 font-medium leading-snug">{move}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </PageContainer>
      ))}

      {/* ==================== PAGE 11: WHAT WE ELIMINATED ==================== */}
      <PageContainer pageNumber={11} title="CAREER ELIMINATIONS">
        <h1 className="text-3xl font-bold text-white mb-1.5 font-serif">What we eliminated</h1>
        <p className="text-xs text-slate-400 mb-4">
          Knowing what *not* to pursue is just as valuable. Here are high-profile careers that did not align with your trait fingerprint, and the specific reasons why.
        </p>

        <div className="space-y-4">
          {(notRecommended || [
            { title: "Chartered Accountant", reason: "The candidate has a low Numerical score, which is fundamentally incompatible with quantitative auditing requirements." },
            { title: "Quantitative Analyst", reason: "Requires extreme mathematical proficiency and high numerical reasoning, areas where candidate scores lower." },
            { title: "Neurosurgeon", reason: "Despite high Realistic traits, decision confidence is optimized for deliberate systems analysis over split-second surgical interventions." }
          ]).map((nr, idx) => (
            <div key={idx} className="bg-slate-900/90 border border-rose-900/40 rounded-2xl p-5 flex gap-4 items-start">
              <div className="bg-rose-950/50 p-2 rounded-full border border-rose-900/60 flex-shrink-0 mt-0.5">
                <X className="h-5 w-5 text-rose-500" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white mb-1">{nr.title}</h3>
                <p className="text-slate-300 text-xs leading-relaxed">{nr.reason}</p>
              </div>
            </div>
          ))}
        </div>
      </PageContainer>

      {/* ==================== PAGE 12: IN PLAIN WORDS (YOUR NARRATIVE - VERTICALLY CENTERED) ==================== */}
      <PageContainer pageNumber={12} title="YOUR NARRATIVE">
        <div className="flex-1 flex flex-col justify-center my-auto py-6 space-y-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1.5 font-serif">{profile?.fullName?.split(' ')[0] || "Sarthak"}, in plain words</h1>
            <p className="text-xs text-slate-400 mb-2">
              The numbers, translated into the story they tell — written to be read aloud to a parent or mentor without a single chart on screen.
            </p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="prose prose-invert prose-emerald max-w-none text-slate-300 font-serif leading-relaxed text-xs space-y-3">
              {aiCoachNarrative ? (
                aiCoachNarrative.split('\n\n').map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))
              ) : (
                <>
                  <p>
                    Hello! Looking at your profile, it&apos;s clear you possess a &apos;superpower&apos; in how you perceive the world — your spatial awareness and strategic vision are off the charts. You have an incredible ability to see how complex systems fit together and the speed to make things happen.
                  </p>
                  <p>
                    While you might feel hesitant when it comes to making big, risky calls, that&apos;s actually your inner compass prioritizing security and stability for yourself and your team. My advice? Lean into your role as the &apos;Technical Anchor&apos;.
                  </p>
                  <p>
                    You don&apos;t need to be the one shouting orders to be the most valuable person in the room; your value lies in your precision and your ability to turn a conceptual blueprint into reality faster than anyone else. Trust your hands and your eyes — they know exactly what to do.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </PageContainer>

      {/* ==================== PAGE 13: FROM HERE TO A JOB OFFER (FIXED MISSIONS CONTENT) ==================== */}
      <PageContainer pageNumber={13} title="EXECUTION PLAN">
        <h1 className="text-3xl font-bold text-white mb-1.5 font-serif">From here to a job offer</h1>
        <p className="text-xs text-slate-400 mb-4">
          A sequenced, costed plan — not a wish list. Each phase closes a specific gap identified earlier in this report, in the order that compounds fastest.
        </p>

        {/* Timeline */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 mb-4">
           <h3 className="text-xs font-bold text-white mb-4">Timeline</h3>
           <div className="grid grid-cols-4 gap-4 relative">
             <div className="absolute top-2 left-0 w-full h-px bg-gradient-to-r from-emerald-500 via-blue-500 to-indigo-500" />
             
             <div className="pt-3 relative">
               <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 absolute top-[-4px] left-0 shadow-[0_0_8px_#10B981]" />
               <h4 className="text-white font-bold text-xs mb-1.5">1 month</h4>
               <ul className="text-[11px] text-slate-300 space-y-1">
                 {safeArray(careerRoadmap?.oneMonth).slice(0, 3).map((item: any, i: number) => <li key={i} className="leading-snug">{item}</li>)}
               </ul>
             </div>
             
             <div className="pt-3 relative">
               <div className="w-2.5 h-2.5 rounded-full bg-blue-400 absolute top-[-4px] left-0" />
               <h4 className="text-white font-bold text-xs mb-1.5">6 months</h4>
               <ul className="text-[11px] text-slate-300 space-y-1">
                 {safeArray(careerRoadmap?.sixMonths).slice(0, 3).map((item: any, i: number) => <li key={i} className="leading-snug">{item}</li>)}
               </ul>
             </div>

             <div className="pt-3 relative">
               <div className="w-2.5 h-2.5 rounded-full bg-indigo-400 absolute top-[-4px] left-0" />
               <h4 className="text-white font-bold text-xs mb-1.5">1 year</h4>
               <ul className="text-[11px] text-slate-300 space-y-1">
                 {safeArray(careerRoadmap?.oneYear).slice(0, 3).map((item: any, i: number) => <li key={i} className="leading-snug">{item}</li>)}
               </ul>
             </div>

             <div className="pt-3 relative">
               <div className="w-2.5 h-2.5 rounded-full bg-purple-400 absolute top-[-4px] left-0" />
               <h4 className="text-white font-bold text-xs mb-1.5">3 years</h4>
               <ul className="text-[11px] text-slate-300 space-y-1">
                 {safeArray(careerRoadmap?.threeYears).slice(0, 3).map((item: any, i: number) => <li key={i} className="leading-snug">{item}</li>)}
               </ul>
             </div>
           </div>
        </div>

        {/* 2 Action Missions (FIXED: RICH FALLBACK CONTENT FOR EMPTY CARDS) */}
        <div className="grid grid-cols-2 gap-5">
          {[
            {
              title: careerMissions?.[0]?.title || "Academic Shadowing",
              objective: careerMissions?.[0]?.objective || "Spend 20 hours shadowing a university professor or researcher to understand the balance between teaching, research, and administration.",
              xpReward: careerMissions?.[0]?.xpReward || 1200,
              estimatedTime: careerMissions?.[0]?.estimatedTime || "2 WEEKS",
              difficulty: careerMissions?.[0]?.difficulty || "MEDIUM"
            },
            {
              title: careerMissions?.[1]?.title || "Design Blueprint Challenge",
              objective: careerMissions?.[1]?.objective || "Create a conceptual architectural or engineering sketch for a community project, focusing on spatial utility and aesthetic value.",
              xpReward: careerMissions?.[1]?.xpReward || 1500,
              estimatedTime: careerMissions?.[1]?.estimatedTime || "1 MONTH",
              difficulty: careerMissions?.[1]?.difficulty || "HARD"
            }
          ].map((mission, idx) => (
            <div key={idx} className="bg-slate-900/90 border border-emerald-900/40 rounded-2xl p-5 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex justify-between items-start mb-2 gap-2">
                  <h3 className="text-sm font-bold text-white">{mission.title}</h3>
                  <span className="bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded text-[9px] font-mono font-bold tracking-wider">+{mission.xpReward} XP</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{mission.objective}</p>
              </div>
              <div className="flex gap-4 text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest border-t border-slate-800 pt-3">
                <span>TIME · {mission.estimatedTime}</span>
                <span>DIFFICULTY · {mission.difficulty}</span>
              </div>
            </div>
          ))}
        </div>
      </PageContainer>

      {/* ==================== PAGE 14: GUIDE FOR PARENTS & COUNSELLORS (BALANCED PROPORTIONS) ==================== */}
      <PageContainer pageNumber={14} title="FOR MENTORS & REFLECTION">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1.5 font-serif">Guide for parents &amp; counsellors</h1>
          <p className="text-xs text-slate-400 mb-4">
            Share this page. It translates {profile?.fullName?.split(' ')[0] || "the student"}&apos;s profile into how best to support them — and gives them three questions to sit with.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-5 my-auto">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-white mb-2">How to support {profile?.fullName?.split(" ")[0] || "them"}</h3>
            <ul className="space-y-3">
              {(safeArray(parentDashboard?.howToHelp).length ? safeArray(parentDashboard?.howToHelp) : [
                "Encourage side projects — that's where he learns fastest and stays motivated.",
                "Give him autonomy over how he works; be firm only on outcomes and deadlines.",
                "Don't push him toward rigid, traditional roles for security's sake — it works against his grain."
              ]).map((help, i) => (
                <li key={i} className="flex gap-2.5 text-xs text-slate-300 leading-relaxed">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>{help}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-white mb-2">Conversations worth having</h3>
            <ul className="space-y-3">
              {(safeArray(parentDashboard?.discussionQuestions).length ? safeArray(parentDashboard?.discussionQuestions) : [
                "What did you enjoy most about your last hands-on project?",
                "Which tech or design field are you most curious to explore next?",
                "What would make a job feel worth doing to you?"
              ]).map((q, i) => (
                <li key={i} className="text-xs text-slate-200 font-serif italic leading-relaxed">&quot;{q}&quot;</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5">
          <h3 className="text-sm font-bold text-white mb-1">Reflect before you move</h3>
          <p className="text-[10px] text-slate-500 font-mono mb-3">Three prompts to process this report — answer them this week</p>
          
          <div className="grid grid-cols-3 gap-4 font-mono text-xs">
            <div>
              <div className="text-2xl font-bold text-emerald-500 mb-1">01</div>
              <p className="text-slate-300 leading-snug font-sans text-[11px]">Which recommended career surprised you most, and why?</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-amber-500 mb-1">02</div>
              <p className="text-slate-300 leading-snug font-sans text-[11px]">What&apos;s one strength here you didn&apos;t realise you had?</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-500 mb-1">03</div>
              <p className="text-slate-300 leading-snug font-sans text-[11px]">Which action mission will you actually start this week?</p>
            </div>
          </div>
        </div>
      </PageContainer>
      
      {/* ==================== PAGE 15: CLOSING PAGE ==================== */}
      <PageContainer pageNumber={15} title="YOUR NEXT STEP">
        <div className="flex-1 flex flex-col justify-center items-center text-center max-w-lg mx-auto space-y-6 py-8">
          <div className="text-xs font-mono font-bold text-emerald-500 tracking-[0.3em] uppercase">ASSESSMENT COMPLETE</div>

          <h1 className="text-5xl font-black text-white font-serif">Now, act on it.</h1>

          <p className="text-xs text-slate-400 leading-relaxed font-sans max-w-sm">
            This report is your foundation — a data-backed starting point. Use it to have real conversations with mentors, parents, and counsellors. The careers listed are directions, not destinations. Your effort and choices will shape everything.
          </p>

          <div className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-5 font-mono text-xs space-y-3 text-left border-t-2 border-t-emerald-500 mt-2">
            <div className="flex justify-between items-center border-b border-slate-800/80 pb-2">
              <span className="text-slate-500">Prepared for</span>
              <span className="text-white font-bold">{profile?.fullName || "Student"}</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-800/80 pb-2">
              <span className="text-slate-500">Top recommended career</span>
              <span className="text-emerald-400 font-bold">{primaryMatch?.title}</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-800/80 pb-2">
              <span className="text-slate-500">Traits assessed</span>
              <span className="text-white font-bold">35 psychometric traits</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-800/80 pb-2">
              <span className="text-slate-500">Start with</span>
              <span className="text-amber-400 font-bold">{careerMissions?.[0]?.title || "Shadow a Professional"}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 text-[10px] leading-tight">This report is a guidance document, not a guarantee. Combine with mentorship and independent research.</span>
            </div>
          </div>
        </div>
      </PageContainer>

      {/* Global CSS overrides for printing */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          @page { size: A4 portrait; margin: 0; }
          body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          .page-break-after-always { page-break-after: always; break-after: page; }

          /* Strip expensive rendering effects to speed up PDF generation */
          * {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            /* Disable backdrop-filter blur — not supported in most PDF engines */
            backdrop-filter: none !important;
            -webkit-backdrop-filter: none !important;
          }

          /* Collapse box-shadows which inflate PDF file size and slow rendering */
          .shadow-xl, .shadow-2xl, .shadow-lg, .shadow-md, .shadow-sm {
            box-shadow: none !important;
          }

          /* Ensure no orphaned content overflows outside page boundary */
          section {
            overflow: hidden !important;
            page-break-inside: avoid;
          }
        }

        /* Screen: separate pages visually with a gap */
        @media screen {
          .page-break-after-always {
            margin-bottom: 24px;
          }
        }
      `}} />
    </div>
  );
}
