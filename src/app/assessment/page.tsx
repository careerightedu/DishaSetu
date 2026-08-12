"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/features/auth/components/Navbar";
import { useAuth } from "@/features/auth/context/AuthContext";
import { useTranslations } from "@/hooks/useTranslations";
import { 
  ClipboardList, 
  Clock, 
  HelpCircle, 
  Compass, 
  AlertCircle, 
  Play, 
  RotateCcw,
  Settings,
  ChevronRight,
  ArrowLeft
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function AssessmentHome() {
  const { user, profile, updateProfile } = useAuth();
  const router = useRouter();
  
  const [sessionExists, setSessionExists] = useState(false);
  const t = useTranslations("Assessment");
  const [sessionProgress, setSessionProgress] = useState({ answered: 0, total: 80 });
  const [checkingSession, setCheckingSession] = useState(true);
  const [loading, setLoading] = useState(false);

  // Helper to map segment codes to readable text
  const getSegmentTitle = (seg?: string) => {
    switch (seg) {
      case "S1": return "School Student (Class 8–10)";
      case "S2": return "School Student (Class 11–12)";
      case "S3": return "College Student";
      case "S4": return "Early Professional / Pivot";
      default: return "Not Selected";
    }
  };

  useEffect(() => {
    async function checkActiveSession() {
      if (!user) return;
      try {
        const sessionRef = doc(db, "assessment_sessions", user.uid);
        const sessionSnap = await getDoc(sessionRef);
        
        if (sessionSnap.exists()) {
          const data = sessionSnap.data();
          if (data.status === "completed") {
            router.push("/results");
            return;
          }
          if (data.status === "in-progress") {
            setSessionExists(true);
            const answersCount = Object.keys(data.answers || {}).length;
            const totalCount = data.selectedQuestions?.length || 80;
            setSessionProgress({ answered: answersCount, total: totalCount });
          }
        }
      } catch (err) {
        console.error("Error checking active session:", err);
      } finally {
        setCheckingSession(false);
      }
    }
    checkActiveSession();
  }, [user]);

  const handleResetSegment = async () => {
    setLoading(true);
    try {
      // Temporarily mark onboarding as incomplete so middleware routes user back to onboarding
      await updateProfile({ onboardingCompleted: false });
      router.push("/onboarding");
    } catch (err) {
      console.error("Failed to reset onboarding stage:", err);
      setLoading(false);
    }
  };

  const handleRestartAssessment = async () => {
    if (!user) return;
    const confirmRestart = window.confirm(
      "Are you sure you want to restart? All saved progress in your current session will be permanently deleted."
    );
    if (!confirmRestart) return;

    setLoading(true);
    try {
      const sessionRef = doc(db, "assessment_sessions", user.uid);
      await deleteDoc(sessionRef);
      setSessionExists(false);
      router.push("/assessment/session");
    } catch (err) {
      console.error("Failed to restart assessment session:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-[100dvh] bg-background">
      <Navbar />

      <main className="flex-grow max-w-3xl mx-auto px-4 sm:px-6 py-10 w-full flex items-center justify-center">
        <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-300">
          
          {/* Back button */}
          <Link 
            href="/" 
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="h-4.5 w-4.5 group-hover:-translate-x-0.5 transition-transform" /> 
            Back to Dashboard
          </Link>

          <Card className="border-border/40 bg-card/60 backdrop-blur-md shadow-xl overflow-hidden relative">
            {/* Top highlight bar */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-primary" />
            
            <CardHeader className="p-6 sm:p-8 pb-4 space-y-2">
              <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
                <ClipboardList className="h-4.5 w-4.5" /> Career mapping session
              </div>
              <CardTitle className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Core Career Assessment
              </CardTitle>
              <CardDescription>
                A comprehensive questionnaire designed to map your core personality traits, cognitive aptitudes, workflow values, and career alignment vectors.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-6 sm:p-8 pt-0 space-y-6">
              
              {/* Confirmed Stage Alert */}
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] text-primary font-bold uppercase tracking-wider">Target Academic/Career Stage</span>
                  <h3 className="font-extrabold text-foreground text-base">
                    {getSegmentTitle(profile?.segment)}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Your assessment questions are custom-tailored for this specific stage.
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleResetSegment}
                  disabled={loading}
                  className="self-start sm:self-center font-semibold border-border/60 hover:bg-muted/50 text-xs gap-1.5 h-8.5"
                >
                  <Settings className="h-3.5 w-3.5" /> Change Stage
                </Button>
              </div>

              {/* Assessment Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-xl border border-border/40 bg-background/40 p-4 space-y-1 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-muted-foreground">
                    <Clock className="h-4 w-4 text-primary" /> Duration
                  </div>
                  <p className="text-lg font-bold">~ 45 Mins</p>
                  <p className="text-[10px] text-muted-foreground">Pause & resume dynamically</p>
                </div>

                <div className="rounded-xl border border-border/40 bg-background/40 p-4 space-y-1 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-muted-foreground">
                    <HelpCircle className="h-4 w-4 text-primary" /> Questions
                  </div>
                  <p className="text-lg font-bold">80 Questions</p>
                  <p className="text-[10px] text-muted-foreground">80 Scored (Stratified)</p>
                </div>

                <div className="rounded-xl border border-border/40 bg-background/40 p-4 space-y-1 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-muted-foreground">
                    <Compass className="h-4 w-4 text-primary" /> Methodology
                  </div>
                  <p className="text-lg font-bold">Mathematical + AI</p>
                  <p className="text-[10px] text-muted-foreground">Grounded Indian framework</p>
                </div>
              </div>

              {/* Instructions Callout */}
              <div className="rounded-xl bg-muted/30 p-5 border border-border/30 space-y-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <AlertCircle className="h-4.5 w-4.5 text-primary shrink-0" /> {t("guidelinesTitle")}
                </div>
                <ul className="list-disc list-inside space-y-2 text-xs text-muted-foreground leading-relaxed pl-1">
                  <li><strong>{t("guideline1Title")}</strong> {t("guideline1Desc")}</li>
                  <li><strong>{t("guideline2Title")}</strong> {t("guideline2Desc")}</li>
                  <li><strong>{t("guideline3Title")}</strong> {t("guideline3Desc")}</li>
                  <li><strong>Autosave:</strong> Your progress is saved in the cloud. You can safely exit at any time and resume right where you left off.</li>
                </ul>
              </div>

              {/* Session State Alert */}
              {!checkingSession && sessionExists && (
                <div className="rounded-xl border border-dashed border-border p-4 text-center bg-background/20">
                  <p className="text-sm font-medium text-foreground">
                    You have a saved session with progress: 
                    <span className="text-primary font-bold ml-1.5">
                      {sessionProgress.answered} of {sessionProgress.total} answered ({Math.round((sessionProgress.answered / sessionProgress.total) * 100)}%)
                    </span>
                  </p>
                </div>
              )}

            </CardContent>

            <CardFooter className="p-6 sm:p-8 pt-4 pb-8 border-t border-border/20 bg-background/25 flex flex-col sm:flex-row gap-3 sm:justify-end">
              {checkingSession ? (
                <div className="h-10 w-32 rounded-lg bg-muted animate-pulse" />
              ) : sessionExists ? (
                <>
                  <Button 
                    variant="ghost" 
                    onClick={handleRestartAssessment}
                    disabled={loading}
                    className="font-semibold text-xs border border-border/40 hover:bg-destructive/10 hover:text-destructive h-10 gap-1.5"
                  >
                    <RotateCcw className="h-4 w-4" /> Start Over
                  </Button>
                  <Link
                    href="/assessment/session"
                    className={cn(
                      buttonVariants({ variant: "default", size: "default" }),
                      "font-bold shadow-md shadow-primary/20 h-10 px-6 gap-1.5 flex items-center justify-center"
                    )}
                  >
                    Resume Assessment <Play className="h-4 w-4 fill-primary-foreground" />
                  </Link>
                </>
              ) : (
                <Link
                  href="/assessment/session"
                  className={cn(
                    buttonVariants({ variant: "default", size: "default" }),
                    "font-bold shadow-md shadow-primary/20 h-10 px-6 gap-1.5 flex items-center justify-center w-full sm:w-auto"
                  )}
                >
                  Start Assessment <ChevronRight className="h-4.5 w-4.5" />
                </Link>
              )}
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
}
