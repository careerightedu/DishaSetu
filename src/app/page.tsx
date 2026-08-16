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
  Calendar,
  Brain,
  Terminal,
  CheckCircle2,
  Lock,
  User
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

  const getBgClass = () => {
    if (!sessionExists) return "bg-background";
    const answered = sessionProgress.answered;
    if (answered >= 60) return "bg-slate-950"; 
    if (answered >= 40) return "bg-[#0b132b]"; 
    if (answered >= 20) return "bg-[#1c2541]"; 
    return "bg-slate-900"; 
  };

  return (
    <div className={cn("flex flex-col min-h-[100dvh] transition-colors duration-1000 relative overflow-x-hidden", getBgClass())}>
      {/* Grid Parallax */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b9810a_1px,transparent_1px),linear-gradient(to_bottom,#10b9810a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      <Navbar />

      {/* Hero Section */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        
        {/* Welcome Greeting */}
        <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-card/40 backdrop-blur-md p-6 sm:p-8 shadow-[0_0_30px_rgba(16,185,129,0.05)] group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-50" />
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/20 blur-3xl transition-transform duration-1000 group-hover:scale-150" />
          <div className="absolute left-0 top-0 h-full w-1.5 bg-gradient-to-b from-primary via-emerald-400 to-transparent" />
          
          <div className="relative z-10 space-y-2">
            <h1 className="text-3xl sm:text-4xl font-heading font-black tracking-tight flex items-center flex-wrap gap-x-2 gap-y-1">
              <span className="text-foreground">{t("hello")},</span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-emerald-400 drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                {profile?.fullName || user?.displayName || t("explorer")}
              </span>
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed">
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
              
              <CardHeader className="pl-8 pr-6 sm:pl-10 sm:pr-8 pt-6 sm:pt-8 flex flex-col md:flex-row gap-6 items-center md:items-start text-center md:text-left relative z-10">
                {/* Holographic Core */}
                <div className="relative flex h-20 w-20 sm:h-24 sm:w-24 shrink-0 items-center justify-center mt-2 sm:mt-0">
                  <div className={cn(
                    "absolute inset-0 rounded-full border-4 border-dashed animate-[spin_10s_linear_infinite]",
                    sessionCompleted ? "border-emerald-500/50" : (sessionProgress.answered > 0 ? "border-primary/40" : "border-slate-500/20")
                  )} />
                  <div className={cn(
                    "absolute inset-3 rounded-full border-2 animate-[spin_5s_linear_infinite_reverse]",
                    sessionCompleted ? "border-emerald-400/60" : (sessionProgress.answered > 0 ? "border-primary/50" : "border-slate-500/30")
                  )} />
                  <div className={cn(
                    "absolute h-10 w-10 sm:h-12 sm:w-12 rounded-full flex items-center justify-center animate-pulse",
                    sessionCompleted ? "bg-emerald-500/30 border border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.5)]" : (sessionProgress.answered > 0 ? "bg-primary/20 border border-primary/50 shadow-[0_0_20px_rgba(var(--primary),0.3)]" : "bg-slate-800 border border-slate-600")
                  )}>
                    <Compass className={cn("h-5 w-5 sm:h-6 sm:w-6", sessionCompleted ? "text-emerald-400" : (sessionProgress.answered > 0 ? "text-primary animate-[spin_12s_ease-in-out_infinite]" : "text-slate-500"))} />
                  </div>
                </div>

                <div className="flex-grow flex flex-col justify-center py-2">
                  <CardTitle className="text-3xl sm:text-5xl font-black tracking-tighter flex items-center justify-center md:justify-start gap-3 uppercase">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-emerald-400 to-primary/80 drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                      Assessment Journey
                    </span>
                  </CardTitle>
                </div>
              </CardHeader>
              
              <CardContent className="pl-8 pr-6 sm:pl-10 sm:pr-8 pb-6 sm:pb-8 space-y-6">
                

                {/* Winding Journey Path */}
                {!checkingSession && sessionExists && !sessionCompleted && (
                  <div className="rounded-xl border border-primary/20 bg-slate-950/80 p-4 sm:p-8 mt-6 shadow-inner relative overflow-hidden">
                    {/* Background Grid */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b98105_1px,transparent_1px),linear-gradient(to_bottom,#10b98105_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

                    <div className="relative py-4">
                      {/* The Track Container */}
                      <div className="absolute top-4 bottom-4 left-9 md:left-1/2 w-4 -translate-x-1/2 bg-slate-900 rounded-full border-2 border-slate-800 shadow-[inset_0_0_10px_rgba(0,0,0,0.8)] z-0" />
                      
                      {/* The Active Filled Track */}
                      <div 
                        className="absolute top-4 left-9 md:left-1/2 w-4 -translate-x-1/2 bg-gradient-to-b from-primary via-emerald-400 to-emerald-500 rounded-full z-0 transition-all duration-1000 shadow-[0_0_20px_rgba(16,185,129,0.4)]"
                        style={{ height: `calc(${(sessionProgress.answered / 80) * 100}% - 2rem)`, minHeight: '2rem' }}
                      >
                         {/* The Ship (Leading Edge of the Progress) */}
                         <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-30">
                            <div className="w-10 h-10 bg-slate-900 border-2 border-emerald-400 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.8)]">
                               <div className="w-4 h-4 bg-emerald-400 rounded-full animate-ping absolute" />
                               <Compass className="h-6 w-6 text-emerald-400 animate-[spin_3s_linear_infinite]" />
                            </div>
                         </div>
                      </div>

                      <div className="relative space-y-6 md:-space-y-8 z-10">
                        {[
                          { title: "Surface Scan", unlockAt: 0, icon: "📡", desc: "Establishing baseline metrics" },
                          { title: "Deep Dive", unlockAt: 20, icon: "🌊", desc: "Exploring underlying traits" },
                          { title: "Pattern Recognition", unlockAt: 40, icon: "🧩", desc: "Correlating career vectors" },
                          { title: "Final Calibration", unlockAt: 60, icon: "🎯", desc: "Locking in recommendations" },
                        ].map((badge, idx) => {
                          const isUnlocked = sessionProgress.answered >= badge.unlockAt;
                          const isCurrent = sessionProgress.answered >= badge.unlockAt && sessionProgress.answered < badge.unlockAt + 20;
                          const progressInBadge = Math.min(20, Math.max(0, sessionProgress.answered - badge.unlockAt));
                          
                          return (
                            <div key={idx} className="relative flex items-center md:justify-normal md:odd:flex-row-reverse group">
                              
                              {/* Horizontal Connector Line */}
                              <div className={cn(
                                "hidden md:block absolute top-1/2 -translate-y-1/2 w-16 h-1 z-0 transition-colors duration-1000",
                                idx % 2 === 0 ? "left-1/2" : "right-1/2",
                                isUnlocked ? "bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]" : "bg-slate-800"
                              )} />
                              
                              <div className={cn(
                                "md:hidden absolute top-1/2 -translate-y-1/2 left-9 w-[52px] h-1 z-0 transition-colors duration-1000",
                                isUnlocked ? "bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]" : "bg-slate-800"
                              )} />

                              {/* Waypoint Marker */}
                              <div className={cn(
                                "flex items-center justify-center w-12 h-12 rounded-full border-4 shadow-xl absolute left-9 md:left-1/2 -translate-x-1/2 z-20 transition-all duration-700",
                                isUnlocked ? "bg-slate-900 border-primary" : "bg-slate-800 border-slate-700",
                                isCurrent && "scale-125 border-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.5)] bg-slate-950"
                              )}>
                                {isUnlocked ? <span className="text-xl drop-shadow-md">{badge.icon}</span> : <div className="h-4 w-4 rounded-full bg-slate-600" />}
                              </div>
                              
                              {/* Station Card */}
                              <div className={cn(
                                "w-[calc(100%-5.5rem)] ml-auto md:ml-0 md:w-[calc(50%-4rem)] p-5 sm:p-6 rounded-2xl border transition-all duration-500 relative overflow-hidden",
                                isUnlocked 
                                  ? (isCurrent ? "bg-primary/10 border-primary shadow-[inset_0_0_20px_rgba(var(--primary),0.15),0_0_20px_rgba(var(--primary),0.2)] backdrop-blur-md" : "bg-primary/5 border-primary/30 opacity-80 backdrop-blur-sm") 
                                  : "bg-slate-900/50 border-slate-800 grayscale"
                              )}>
                                {/* Tech overlay pattern */}
                                {isUnlocked && (
                                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-primary/20 to-transparent opacity-50" />
                                )}
                                
                                <div className="flex justify-between items-start mb-3 relative z-10">
                                  <div>
                                    <h4 className={cn("font-bold text-sm sm:text-base uppercase tracking-wider", isUnlocked ? "text-primary drop-shadow-sm" : "text-slate-500")}>
                                      Phase {idx + 1}: {badge.title}
                                    </h4>
                                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">{badge.desc}</p>
                                  </div>
                                  {isUnlocked && (
                                    <span className="text-[10px] font-mono font-black text-slate-900 bg-primary px-2.5 py-1 rounded-md shadow-md h-fit whitespace-nowrap">
                                      {progressInBadge} / 20
                                    </span>
                                  )}
                                </div>
                                {/* Inner progress bar */}
                                <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden mt-3 border border-slate-800 relative z-10 shadow-inner">
                                  <div 
                                    className={cn("h-full transition-all duration-1000", isCurrent ? "bg-gradient-to-r from-primary to-emerald-400 glow-pulse" : "bg-primary/50")}
                                    style={{ width: `${(progressInBadge / 20) * 100}%` }}
                                  />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
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
            {/* Player ID Badge (Profile Card) */}
             <Card className="border-primary/20 bg-black/40 backdrop-blur-md shadow-xl overflow-hidden relative group">
               <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-50" />
               <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
               
               <CardHeader className="p-6 sm:p-8 pb-0 relative z-10 text-center">
                 <div className="mx-auto w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-slate-950 border border-primary/40 shadow-[0_0_30px_rgba(var(--primary),0.3)] flex items-center justify-center mb-6 relative group z-20">
                   {/* Orbiting rings */}
                   <div className="absolute inset-[-6px] rounded-full border-2 border-dashed border-primary/30 animate-[spin_10s_linear_infinite]" />
                   <div className="absolute inset-[-14px] rounded-full border border-primary/10 animate-[spin_15s_linear_infinite_reverse]" />
                   
                   {/* Inner glow */}
                   <div className="absolute inset-0 rounded-full bg-gradient-to-b from-primary/20 to-transparent opacity-50" />
                   
                   {/* Icon */}
                   <User className="h-10 w-10 sm:h-12 sm:w-12 text-primary drop-shadow-[0_0_10px_rgba(var(--primary),0.8)] z-10" />
                 </div>
                 <div className="inline-block px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-mono text-primary font-bold uppercase tracking-widest mb-2 shadow-[0_0_10px_rgba(var(--primary),0.2)]">
                   Player ID
                 </div>
                 <CardTitle className="text-xl font-black text-white tracking-tight">
                   {getSegmentTitle(profile?.segment)}
                 </CardTitle>
                 <CardDescription className="text-xs text-primary/70 mt-1">
                   {getSegmentDesc(profile?.segment)}
                 </CardDescription>
               </CardHeader>
               
               <CardContent className="p-6 sm:p-8 relative z-10 space-y-5">
                 
                 {/* Equipped Loadout Stats */}
                 <div className="space-y-4">
                   <h4 className="text-[10px] font-mono text-slate-400 uppercase tracking-widest text-center border-b border-border/20 pb-2 mb-3">Equipped Loadout</h4>
                   
                   <div className="grid grid-cols-2 gap-3 text-xs">
                     <div className="bg-slate-900/60 border border-border/30 rounded-lg p-2.5 flex flex-col gap-1 transition-colors hover:border-primary/40 hover:bg-slate-900/80">
                       <span className="text-[9px] text-muted-foreground uppercase flex items-center gap-1"><MapPin className="h-3 w-3" /> Base</span>
                       <span className="font-bold text-white truncate" title={profile?.cityTier}>{profile?.cityTier || "Not set"}</span>
                     </div>
                     <div className="bg-slate-900/60 border border-border/30 rounded-lg p-2.5 flex flex-col gap-1 transition-colors hover:border-primary/40 hover:bg-slate-900/80">
                       <span className="text-[9px] text-muted-foreground uppercase flex items-center gap-1"><Globe className="h-3 w-3" /> Comm</span>
                       <span className="font-bold text-white truncate" title={profile?.languagePreference}>{profile?.languagePreference || "Not set"}</span>
                     </div>
                     
                     {/* S1 & S2 */}
                     {(profile?.segment === "S1" || profile?.segment === "S2") && (
                       <>
                         <div className="bg-slate-900/60 border border-border/30 rounded-lg p-2.5 flex flex-col gap-1 transition-colors hover:border-primary/40 hover:bg-slate-900/80">
                           <span className="text-[9px] text-muted-foreground uppercase flex items-center gap-1"><FileText className="h-3 w-3" /> Faction</span>
                           <span className="font-bold text-white truncate" title={profile?.schoolBoard}>{profile?.schoolBoard || "Not set"}</span>
                         </div>
                         <div className="bg-slate-900/60 border border-border/30 rounded-lg p-2.5 flex flex-col gap-1 transition-colors hover:border-primary/40 hover:bg-slate-900/80">
                           <span className="text-[9px] text-muted-foreground uppercase flex items-center gap-1"><Layers className="h-3 w-3" /> Level</span>
                           <span className="font-bold text-white truncate" title={profile?.grade}>{profile?.grade || "Not set"}</span>
                         </div>
                       </>
                     )}
                     
                     {profile?.segment === "S2" && (
                       <div className="bg-slate-900/60 border border-border/30 rounded-lg p-2.5 flex flex-col gap-1 transition-colors hover:border-primary/40 hover:bg-slate-900/80 col-span-2">
                         <span className="text-[9px] text-muted-foreground uppercase flex items-center gap-1"><Compass className="h-3 w-3" /> Spec</span>
                         <span className="font-bold text-primary truncate" title={profile?.stream}>{profile?.stream || "Not set"}</span>
                       </div>
                     )}

                     {/* S3 */}
                     {profile?.segment === "S3" && (
                       <>
                         <div className="bg-slate-900/60 border border-border/30 rounded-lg p-2.5 flex flex-col gap-1 transition-colors hover:border-primary/40 hover:bg-slate-900/80 col-span-2">
                           <span className="text-[9px] text-muted-foreground uppercase flex items-center gap-1"><Building className="h-3 w-3" /> Academy</span>
                           <span className="font-bold text-white truncate" title={profile?.collegeName}>{profile?.collegeName || "Not set"}</span>
                         </div>
                         <div className="bg-slate-900/60 border border-border/30 rounded-lg p-2.5 flex flex-col gap-1 transition-colors hover:border-primary/40 hover:bg-slate-900/80">
                           <span className="text-[9px] text-muted-foreground uppercase flex items-center gap-1"><BookOpen className="h-3 w-3" /> Rank</span>
                           <span className="font-bold text-white truncate" title={profile?.degree}>{profile?.degree || "Not set"}</span>
                         </div>
                         <div className="bg-slate-900/60 border border-border/30 rounded-lg p-2.5 flex flex-col gap-1 transition-colors hover:border-primary/40 hover:bg-slate-900/80">
                           <span className="text-[9px] text-muted-foreground uppercase flex items-center gap-1"><Calendar className="h-3 w-3" /> Exfil</span>
                           <span className="font-bold text-white truncate" title={profile?.graduationYear}>{profile?.graduationYear || "Not set"}</span>
                         </div>
                         <div className="bg-slate-900/60 border border-border/30 rounded-lg p-2.5 flex flex-col gap-1 transition-colors hover:border-primary/40 hover:bg-slate-900/80 col-span-2">
                           <span className="text-[9px] text-muted-foreground uppercase flex items-center gap-1"><Compass className="h-3 w-3" /> Mastery</span>
                           <span className="font-bold text-primary truncate" title={profile?.specialization}>{profile?.specialization || "Not set"}</span>
                         </div>
                       </>
                     )}

                     {/* S4 */}
                     {profile?.segment === "S4" && (
                       <>
                         <div className="bg-slate-900/60 border border-border/30 rounded-lg p-2.5 flex flex-col gap-1 transition-colors hover:border-primary/40 hover:bg-slate-900/80 col-span-2">
                           <span className="text-[9px] text-muted-foreground uppercase flex items-center gap-1"><Briefcase className="h-3 w-3" /> Designation</span>
                           <span className="font-bold text-white truncate" title={profile?.jobTitle}>{profile?.jobTitle || "Not set"}</span>
                         </div>
                         <div className="bg-slate-900/60 border border-border/30 rounded-lg p-2.5 flex flex-col gap-1 transition-colors hover:border-primary/40 hover:bg-slate-900/80">
                           <span className="text-[9px] text-muted-foreground uppercase flex items-center gap-1"><Building className="h-3 w-3" /> Sector</span>
                           <span className="font-bold text-white truncate" title={profile?.industry}>{profile?.industry || "Not set"}</span>
                         </div>
                         <div className="bg-slate-900/60 border border-border/30 rounded-lg p-2.5 flex flex-col gap-1 transition-colors hover:border-primary/40 hover:bg-slate-900/80">
                           <span className="text-[9px] text-muted-foreground uppercase flex items-center gap-1"><Layers className="h-3 w-3" /> XP</span>
                           <span className="font-bold text-white truncate" title={profile?.yearsOfExperience}>{profile?.yearsOfExperience || "0"} Yrs</span>
                         </div>
                       </>
                     )}
                   </div>
                 </div>

               </CardContent>
             </Card>

          </div>

        </div>

      </main>
    </div>
  );
}
