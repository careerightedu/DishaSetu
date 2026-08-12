"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/features/auth/components/Navbar";
import { useAuth } from "@/features/auth/context/AuthContext";
import { useTranslations } from "@/hooks/useTranslations";
import { 
  ClipboardList, 
  MapPin, 
  Globe, 
  Layers, 
  BookOpen, 
  Briefcase, 
  Compass, 
  FileText, 
  Clock, 
  AlertCircle,
  HelpCircle,
  ChevronRight,
  Building,
  Calendar
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function Dashboard() {
  const { user, profile } = useAuth();

  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [sessionExists, setSessionExists] = useState(false);
  const [sessionProgress, setSessionProgress] = useState({ answered: 0, total: 80 });
  const [checkingSession, setCheckingSession] = useState(true);
  const t = useTranslations("Dashboard");

  useEffect(() => {
    async function checkActiveSession() {
      if (!user) return;
      try {
        const sessionRef = doc(db, "assessment_sessions", user.uid);
        const sessionSnap = await getDoc(sessionRef);
        
        if (sessionSnap.exists()) {
          const data = sessionSnap.data();
          if (data.status === "completed") {
            setSessionCompleted(true);
          } else if (data.status === "in-progress") {
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

  // Helper to map segment codes to readable text
  const getSegmentTitle = (seg?: string) => {
    switch (seg) {
      case "S1": return "School Student (Class 8–10)";
      case "S2": return "School Student (Class 11–12)";
      case "S3": return "College Student";
      case "S4": return "Early Professional / Pivot";
      default: return t("notSelected");
    }
  };

  const getSegmentDesc = (seg?: string) => {
    switch (seg) {
      case "S1": return "Stream decisions: Science, Commerce, or Arts selection support";
      case "S2": return "Entrance exams prep (JEE, NEET, CUET) & target college programs";
      case "S3": return "Placement prep, specialization focus, Masters/MBA recommendations";
      case "S4": return "Career switch validations, role transition paths, skill gap analysis";
      default: return "";
    }
  };

  return (
    <div className="flex flex-col min-h-[100dvh] bg-background">
      <Navbar />

      {/* Hero Section */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        
        {/* Welcome Greeting */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 rounded-2xl border border-primary/10 relative overflow-hidden">
          <div className="absolute right-0 top-0 -z-10 h-32 w-32 rounded-full bg-primary/10 blur-2xl" />
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold tracking-wide">
              {t("hello")}, <span className="text-primary">{profile?.fullName || user?.displayName || t("explorer")}</span>!
            </h1>
            <p className="text-sm text-muted-foreground">
              {t("welcomeTitle")}
            </p>
          </div>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Assessment Flow Start */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-primary/20 bg-card/60 backdrop-blur-md shadow-lg overflow-hidden relative">
              {/* Highlight ribbon */}
              <div className="absolute left-0 top-0 h-full w-1.5 bg-primary" />
              
              <CardHeader className="pl-8 pr-6 sm:pl-10 sm:pr-8 pt-6 sm:pt-8">
                <div className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary border border-primary/20 mb-2">
                  {t("primaryTask")}
                </div>
                <CardTitle className="text-2xl font-bold flex items-center gap-2">
                  <ClipboardList className="h-6 w-6 text-primary" /> {t("coreAssessment")}
                </CardTitle>
                <CardDescription>
                  {t("coreDesc")}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pl-8 pr-6 sm:pl-10 sm:pr-8 pb-6 sm:pb-8 space-y-6">
                
                {/* Metric Items Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="rounded-xl border border-border/40 bg-background/30 p-4 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="h-4 w-4 text-primary" /> {t("timeRequired")}
                    </div>
                    <p className="text-lg font-bold">{t("time45m")}</p>
                    <p className="text-[10px] text-muted-foreground">{t("saveResume")}</p>
                  </div>

                  <div className="rounded-xl border border-border/40 bg-background/30 p-4 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <HelpCircle className="h-4 w-4 text-primary" /> {t("questionCount")}
                    </div>
                    <p className="text-lg font-bold">{t("q80")}</p>
                    <p className="text-[10px] text-muted-foreground">{t("customizedStage")}</p>
                  </div>

                  <div className="rounded-xl border border-border/40 bg-background/30 p-4 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Compass className="h-4 w-4 text-primary" /> {t("methodType")}
                    </div>
                    <p className="text-base font-bold text-foreground">{t("mathAiBased")}</p>
                    <p className="text-[10px] text-muted-foreground">Grounded Indian framework</p>
                  </div>
                </div>

                {/* Important Notice */}
                <div className="rounded-lg bg-primary/5 p-4 border border-primary/10 flex gap-3 text-sm text-foreground">
                  <AlertCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-semibold text-primary">{t("instructionsTitle")}</p>
                    <ul className="list-disc list-inside space-y-1 text-xs text-muted-foreground">
                      <li>{t("instruction1")}</li>
                      <li>{t("instruction2")}</li>
                      <li>{t("instruction3")}</li>
                    </ul>
                  </div>
                </div>

                {/* Session Progress Tracker */}
                {!checkingSession && sessionExists && (
                  <div className="rounded-xl border border-dashed border-primary/20 bg-primary/5 p-5 space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-muted-foreground font-semibold">Saved Session Progress</span>
                      <span className="text-primary font-extrabold">
                        {sessionProgress.answered} of {sessionProgress.total} Answered ({Math.round((sessionProgress.answered / sessionProgress.total) * 100)}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-border/40 rounded-full overflow-hidden relative border border-border/10">
                      <div 
                        className="h-full bg-primary transition-all duration-500"
                        style={{ width: `${Math.round((sessionProgress.answered / sessionProgress.total) * 100)}%` }}
                      />
                    </div>
                  </div>
                )}

              </CardContent>

              <CardFooter className="pl-8 pr-6 sm:pl-10 sm:pr-8 pb-6 sm:pb-8 pt-0 flex flex-col sm:flex-row gap-3">
                {checkingSession ? (
                  <div className="h-11 w-44 rounded-lg bg-muted animate-pulse" />
                ) : sessionCompleted ? (
                  <Link
                    href="/results"
                    className={cn(
                      buttonVariants({ variant: "default", size: "lg" }),
                      "font-bold shadow-md shadow-primary/20 bg-emerald-600 hover:bg-emerald-500 text-white w-full sm:w-auto flex items-center justify-center gap-1.5"
                    )}
                  >
                    <FileText className="h-5 w-5" /> Download / View CareeRight Report
                    <ChevronRight className="h-5 w-5" />
                  </Link>
                ) : sessionExists ? (
                  <Link
                    href="/assessment"
                    className={cn(
                      buttonVariants({ variant: "default", size: "lg" }),
                      "font-bold shadow-md shadow-primary/20 w-full sm:w-auto flex items-center justify-center gap-1.5"
                    )}
                  >
                    {t("resumeAssessment")}
                    <ChevronRight className="h-5 w-5" />
                  </Link>
                ) : (
                  <Link
                    href="/assessment"
                    className={cn(
                      buttonVariants({ variant: "default", size: "lg" }),
                      "font-bold shadow-md shadow-primary/20 w-full sm:w-auto flex items-center justify-center"
                    )}
                  >
                    Start Assessment Now
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Link>
                )}
              </CardFooter>
            </Card>

          </div>

          {/* Right Column: Profile details & segment */}
          <div className="space-y-6">
            
            {/* User Profile Summary Card */}
             <Card className="border-border/40 bg-card/60 backdrop-blur-md shadow-md">
               <CardHeader className="p-6 sm:p-8 pb-4">
                 <CardTitle className="text-lg font-bold flex items-center gap-2">
                   <Layers className="h-5 w-5 text-primary" /> Active Segment Profile
                 </CardTitle>
                 <CardDescription>
                   Your current academic/professional track configuration
                 </CardDescription>
               </CardHeader>
               <CardContent className="p-6 sm:p-8 pt-0 pb-6 space-y-4">
                
                {/* Segment Header */}
                <div className="rounded-xl bg-primary/5 p-4 border border-primary/10 space-y-1">
                  <p className="text-xs text-primary font-bold uppercase tracking-wider">Active Stage</p>
                  <p className="font-extrabold text-foreground text-sm">
                    {getSegmentTitle(profile?.segment)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {getSegmentDesc(profile?.segment)}
                  </p>
                </div>

                {/* Profile Fields List */}
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between border-b border-border/20 pb-2">
                    <span className="text-muted-foreground flex items-center gap-1.5"><MapPin className="h-4 w-4 text-muted-foreground" /> City Tier:</span>
                    <span className="font-medium text-foreground">{profile?.cityTier || "Not set"}</span>
                  </div>

                  <div className="flex justify-between border-b border-border/20 pb-2">
                    <span className="text-muted-foreground flex items-center gap-1.5"><Globe className="h-4 w-4 text-muted-foreground" /> Language:</span>
                    <span className="font-medium text-foreground">{profile?.languagePreference || "Not set"}</span>
                  </div>

                  {/* S1 & S2 details */}
                  {(profile?.segment === "S1" || profile?.segment === "S2") && (
                    <>
                      <div className="flex justify-between border-b border-border/20 pb-2">
                        <span className="text-muted-foreground flex items-center gap-1.5"><FileText className="h-4 w-4 text-muted-foreground" /> Board:</span>
                        <span className="font-medium text-foreground">{profile?.schoolBoard || "Not set"}</span>
                      </div>
                      <div className="flex justify-between border-b border-border/20 pb-2">
                        <span className="text-muted-foreground flex items-center gap-1.5"><Layers className="h-4 w-4 text-muted-foreground" /> Class:</span>
                        <span className="font-medium text-foreground">{profile?.grade || "Not set"}</span>
                      </div>
                    </>
                  )}

                  {profile?.segment === "S2" && (
                    <div className="flex justify-between border-b border-border/20 pb-2">
                      <span className="text-muted-foreground flex items-center gap-1.5"><Compass className="h-4 w-4 text-muted-foreground" /> Stream:</span>
                      <span className="font-medium text-foreground">{profile?.stream || "Not set"}</span>
                    </div>
                  )}

                  {/* S3 details */}
                  {profile?.segment === "S3" && (
                    <>
                      <div className="flex justify-between border-b border-border/20 pb-2">
                        <span className="text-muted-foreground flex items-center gap-1.5"><Building className="h-4 w-4 text-muted-foreground" /> College:</span>
                        <span className="font-medium text-foreground max-w-[150px] truncate align-right" title={profile?.collegeName}>
                          {profile?.collegeName || "Not set"}
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-border/20 pb-2">
                        <span className="text-muted-foreground flex items-center gap-1.5"><BookOpen className="h-4 w-4 text-muted-foreground" /> Degree:</span>
                        <span className="font-medium text-foreground">{profile?.degree || "Not set"}</span>
                      </div>
                      <div className="flex justify-between border-b border-border/20 pb-2">
                        <span className="text-muted-foreground flex items-center gap-1.5"><Compass className="h-4 w-4 text-muted-foreground" /> Specialization:</span>
                        <span className="font-medium text-foreground truncate max-w-[120px]">{profile?.specialization || "Not set"}</span>
                      </div>
                      <div className="flex justify-between border-b border-border/20 pb-2">
                        <span className="text-muted-foreground flex items-center gap-1.5"><Calendar className="h-4 w-4 text-muted-foreground" /> Graduation:</span>
                        <span className="font-medium text-foreground">{profile?.graduationYear || "Not set"}</span>
                      </div>
                    </>
                  )}

                  {/* S4 details */}
                  {profile?.segment === "S4" && (
                    <>
                      <div className="flex justify-between border-b border-border/20 pb-2">
                        <span className="text-muted-foreground flex items-center gap-1.5"><Briefcase className="h-4 w-4 text-muted-foreground" /> Role:</span>
                        <span className="font-medium text-foreground truncate max-w-[150px]">{profile?.jobTitle || "Not set"}</span>
                      </div>
                      <div className="flex justify-between border-b border-border/20 pb-2">
                        <span className="text-muted-foreground flex items-center gap-1.5"><Building className="h-4 w-4 text-muted-foreground" /> Industry:</span>
                        <span className="font-medium text-foreground truncate max-w-[120px]">{profile?.industry || "Not set"}</span>
                      </div>
                      <div className="flex justify-between border-b border-border/20 pb-2">
                        <span className="text-muted-foreground flex items-center gap-1.5"><Layers className="h-4 w-4 text-muted-foreground" /> Experience:</span>
                        <span className="font-medium text-foreground">{profile?.yearsOfExperience || "Not set"}</span>
                      </div>
                    </>
                  )}
                </div>

               </CardContent>
               <CardFooter className="p-6 sm:p-8 pt-4 border-t border-border/20 flex gap-2">
                <Link
                  href="/onboarding"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "default" }),
                    "w-full font-semibold border-border/60 hover:bg-muted/50 flex items-center justify-center"
                  )}
                >
                  Re-configure Profile
                </Link>
              </CardFooter>
            </Card>

          </div>

        </div>

      </main>
    </div>
  );
}
