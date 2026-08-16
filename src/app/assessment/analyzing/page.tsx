"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Compass, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { syncAssessmentSessionToSupabase } from "@/lib/supabase";

export default function AnalyzingTransition() {
  const router = useRouter();
  const [statusText, setStatusText] = useState("Securing assessment transcripts...");
  const calculationTriggered = useRef(false);

  useEffect(() => {
    let calculationsDone = false;
    let minTimeElapsed = false;

    const checkNavigation = () => {
      if (calculationsDone && minTimeElapsed) {
        router.push("/results");
      }
    };

    // Minimum display timer (5.8 seconds)
    const minTimer = setTimeout(() => {
      minTimeElapsed = true;
      checkNavigation();
    }, 5800);

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/login");
        return;
      }

      if (calculationTriggered.current) return;
      calculationTriggered.current = true;

      try {
        const sessionRef = doc(db, "assessment_sessions", user.uid);
        const sessionSnap = await getDoc(sessionRef);
        if (!sessionSnap.exists()) {
          throw new Error("Active assessment session not found");
        }
        const sessionData = sessionSnap.data();

        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) {
          throw new Error("Candidate profile not found");
        }
        const profileData = userSnap.data();

        const steps = [
          "math",
          "career_scoring",
          "career_0", "career_1", "career_2", "career_3", "career_4",
          "career_extras",
          "personality",
          "actionPlan"
        ];
        const finalData: any = {};

        for (let i = 0; i < steps.length; i++) {
          const step = steps[i];

          if (step === "math") setStatusText("Calculating initial psychometric scores...");
          else if (step === "career_scoring") setStatusText("Evaluating contextual feasibility for Top 15 careers...");
          else if (step.match(/^career_\d+$/)) setStatusText(`Analyzing Career Match ${parseInt(step.split("_")[1]) + 1} of 5...`);
          else if (step === "career_extras") setStatusText("Formulating career comparison matrix...");
          else if (step === "personality") setStatusText("Generating deep personality profile...");
          else if (step === "actionPlan") setStatusText("Creating actionable roadmaps & missions...");

          let resText = "";
          let data: any = {};
          let success = false;
          let retries = 3;

          while (retries > 0 && !success) {
            try {
              let selectedCareerTitle = "";
              let selectedFinalScore = 0;
              if (step.startsWith("career_") && step !== "career_scoring" && step !== "career_extras") {
                const idx = parseInt(step.split("_")[1]);
                if (finalData.top5Careers && finalData.top5Careers[idx]) {
                  selectedCareerTitle = finalData.top5Careers[idx].title;
                  selectedFinalScore = finalData.top5Careers[idx].finalScore;
                }
              }

              const res = await fetch("/api/analyze-assessment", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({
                  profile: profileData,
                  answers: sessionData.answers || {},
                  step,
                  selectedCareerTitle,
                  selectedFinalScore,
                  existingTitles: (finalData.recommendations || []).map((r: any) => r.title)
                })
              });

              resText = await res.text();
              try {
                data = JSON.parse(resText);
              } catch (jsonErr) {
                throw new Error(`Analysis engine returned invalid response format. Details: ${resText.slice(0, 100)}`);
              }

              if (!res.ok) {
                throw new Error(data.error || `Analysis API failed with status: ${res.status}`);
              }
              
              success = true;
            } catch (err) {
              retries--;
              if (retries === 0) {
                throw new Error(`Failed at step "${step}" after 3 attempts. Last error: ${err instanceof Error ? err.message : "Network error"}`);
              }
              console.warn(`Retry triggered for step "${step}". Attempts left: ${retries}. Error:`, err);
              setStatusText(`Network glitch detected. Retrying analysis (${retries} attempts left)...`);
              await new Promise(r => setTimeout(r, 2000)); // 2 second backoff
            }
          }
          // Merge data from this step into final payload
          Object.keys(data).forEach(key => {
            if (key !== "success" && data[key] !== undefined) {
              if (key === "recommendations" && Array.isArray(data[key])) {
                finalData.recommendations = [
                  ...(finalData.recommendations || []),
                  ...data[key]
                ];
              } else {
                finalData[key] = data[key];
              }
            }
          });
        }

        // Save computed results client-side
        const sessionPayload = {
          scores: finalData.scores || {},
          recommendations: finalData.recommendations || [],
          archetype: finalData.archetype || null,
          counselorAnalysis: finalData.counselorAnalysis || null,
          quests: finalData.quests || null,
          achievements: finalData.achievements || null,
          deepPersonalityAnalysis: finalData.deepPersonalityAnalysis || null,
          comparisonMatrix: finalData.comparisonMatrix || null,
          aiCoachNarrative: finalData.aiCoachNarrative || null,
          careerMissions: finalData.careerMissions || null,
          careerRoadmap: finalData.careerRoadmap || null,
          parentDashboard: finalData.parentDashboard || null,
          notRecommended: finalData.notRecommended || null,
          contextualSummary: finalData.contextualSummary || null,
          status: "completed",
          updatedAt: new Date().toISOString()
        };

        await updateDoc(sessionRef, sessionPayload);

        // Async secondary database mirror to Supabase
        syncAssessmentSessionToSupabase(user.uid, sessionPayload);

        setStatusText("Finalizing career profile report dashboard...");
        calculationsDone = true;
        checkNavigation();
      } catch (error: any) {
        console.error("Critical calculation engine failure:", error);
        setStatusText(`Error: ${error.message || "Unknown error occurred"}`);
        // Do NOT set calculationsDone = true or call checkNavigation(), 
        // so the user stays on this screen to read the error.
      }
    });

    return () => {
      clearTimeout(minTimer);
      unsubscribe();
    };
  }, [router]);

  return (
    <div className="flex min-h-[100dvh] items-center justify-center p-4 bg-slate-950 relative overflow-hidden font-mono">
      {/* Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b9811a_1px,transparent_1px),linear-gradient(to_bottom,#10b9811a_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_70%,transparent_100%)]" />

      {/* Engine Core */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[100px] animate-pulse" />

      <div className="z-10 w-full max-w-lg bg-slate-900/80 backdrop-blur-xl border border-emerald-500/30 rounded-2xl p-8 sm:p-12 shadow-[0_0_50px_rgba(16,185,129,0.15)] flex flex-col items-center text-center">
        
        {/* Core spinner */}
        <div className="relative flex h-28 w-28 items-center justify-center mb-8">
          <div className="absolute inset-0 rounded-full border-4 border-dashed border-emerald-500/30 animate-[spin_10s_linear_infinite]" />
          <div className="absolute inset-4 rounded-full border-2 border-emerald-400/50 animate-[spin_5s_linear_infinite_reverse]" />
          <div className="absolute h-14 w-14 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center animate-pulse shadow-[0_0_20px_rgba(16,185,129,0.5)]">
            <Sparkles className="h-6 w-6 text-emerald-400 animate-[spin_8s_ease-in-out_infinite]" />
          </div>
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-emerald-500/0 via-emerald-500/10 to-emerald-500/30 border-r-2 border-emerald-400/50 animate-[spin_3s_linear_infinite]" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-widest mb-2 drop-shadow-lg">
          System Booting
        </h1>
        <p className="text-emerald-400/80 text-xs sm:text-sm mb-10 tracking-widest uppercase font-bold">
          Decision Intelligence Engine
        </p>

        {/* Terminal Window */}
        <div className="w-full bg-slate-950 rounded-lg border border-slate-800 p-4 font-mono text-left relative overflow-hidden shadow-inner">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-emerald-500/50 animate-scan" />
          <div className="flex items-center gap-2 mb-3 text-slate-500 text-xs border-b border-slate-800 pb-2">
            <div className="w-2 h-2 rounded-full bg-red-500/50" />
            <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
            <div className="w-2 h-2 rounded-full bg-green-500/50" />
            <span className="ml-2 font-semibold tracking-wider">root@career-engine:~</span>
          </div>
          <p className="text-emerald-400 text-sm sm:text-base transition-all duration-300">
            <span className="text-emerald-600 mr-2">$</span>
            {statusText}
            <span className="inline-block w-2.5 h-4 bg-emerald-400 ml-1.5 align-middle animate-ping" />
          </p>
        </div>

      </div>
    </div>
  );
}

