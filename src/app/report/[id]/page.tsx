"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslations } from "@/hooks/useTranslations";
import Navbar from "@/features/auth/components/Navbar";
import { useAuth } from "@/features/auth/context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { 
  Sparkles, 
  Briefcase, 
  Download, 
  Lock,
  Unlock,
  CheckCircle2,
  BadgeAlert,
  ArrowRight
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ScoreReport {
  [traitName: string]: number;
}

interface Recommendation {
  careerId: string;
  title: string;
  sector: string;
  fitScore: number;
  description: string;
  whyRecommended: string;
  academicPath: string;
  exams: string[];
  skillGaps: string[];
}

interface Archetype {
  name: string;
  title: string;
  description: string;
}

export default function ArchivedReportDashboard() {
  const { id } = useParams() as { id: string };
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [scores, setScores] = useState<ScoreReport | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[] | null>(null);
  const [archetype, setArchetype] = useState<Archetype | null>(null);
  
  const [hasCorruptedSession, setHasCorruptedSession] = useState(false);
  const t = useTranslations("Results");
  
  // Gamification States
  const [revealedCount, setRevealedCount] = useState(3); // Fully revealed for archived report
  
  useEffect(() => {
    async function fetchResults() {
      if (!user || !id) return;
      try {
        const reportRef = doc(db, "users", user.uid, "reports", id);
        const sessionSnap = await getDoc(reportRef);
        if (sessionSnap.exists()) {
          const data = sessionSnap.data();
          if (data.status === "completed") {
            if (data.scores && data.recommendations) {
              setScores(data.scores);
              setRecommendations(data.recommendations);
              setArchetype(data.archetype || null);
            } else {
              setHasCorruptedSession(true);
            }
          }
        }
      } catch (err) {
        console.error("Error loading archived report:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchResults();
  }, [user, id]);

  const handleDownloadPDF = () => {
    window.open(`/results/print?reportId=${id}`, "_blank");
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
                Report Not Found
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                We could not find the specified archived report. It may have been deleted or corrupted.
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex-col gap-3 pt-4">
              <Link href="/" className="w-full font-extrabold bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6 rounded-md flex items-center justify-center gap-1.5 shadow-md">
                Return to Dashboard <ArrowRight className="h-4 w-4" />
              </Link>
            </CardFooter>
          </Card>
        </main>
      </div>
    );
  }

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

      <main className="flex-grow flex flex-col items-center max-w-5xl mx-auto px-4 sm:px-6 py-12 w-full space-y-12">
        
        {/* Header Section */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            <CheckCircle2 className="h-3.5 w-3.5" /> Archived Report
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground">
            Your Historical <span className="text-primary">Matches</span>
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            This is a read-only view of a past assessment session.
          </p>
        </div>

        {/* Radar Chart */}
        {renderRadarChart()}

        {/* Dynamic Archetype Banner */}
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

        {/* Revealed Cards (Archived reports default to revealed) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full relative z-10">
          {recommendations.slice(0, 3).map((rec, index) => {
            return (
              <div 
                key={rec.careerId} 
                className={cn(
                  "relative h-[280px] w-full rounded-3xl border-2 transition-all duration-700 flex flex-col items-center justify-center p-6 text-center shadow-xl group",
                  "bg-card border-primary/30 shadow-primary/10"
                )}
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 space-y-4 rounded-3xl bg-card border border-border/50">
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

        {/* Footer Actions */}
        <div className="transition-all duration-1000 transform max-w-md w-full">
          <Card className="border-border/40 bg-gradient-to-br from-card/90 via-card/70 to-card/50 backdrop-blur-xl shadow-2xl p-8 relative overflow-hidden text-center space-y-6">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-primary to-emerald-400" />
            <Button 
              onClick={handleDownloadPDF} 
              size="lg"
              className="w-full font-black text-sm uppercase tracking-wider shadow-xl shadow-primary/20 flex items-center justify-center gap-2.5 h-12 bg-primary hover:bg-primary/90 text-primary-foreground transition-all hover:scale-105"
            >
              <Download className="h-5 w-5" /> Download / Print Report
            </Button>
            <Link href="/" className="text-xs text-muted-foreground hover:text-foreground font-semibold flex items-center justify-center gap-1.5 w-full mx-auto transition-colors">
               Return to Dashboard
            </Link>
          </Card>
        </div>

      </main>
    </div>
  );
}
