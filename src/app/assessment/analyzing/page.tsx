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
          "career_0", "career_1", "career_2", "career_3", "career_4",
          "career_extras",
          "personality",
          "actionPlan"
        ];
        const finalData: any = {};

        for (let i = 0; i < steps.length; i++) {
          const step = steps[i];

          if (step === "math") setStatusText("Calculating initial psychometric scores...");
          else if (step.startsWith("career_")) setStatusText(`Analyzing Career Match ${parseInt(step.split("_")[1]) + 1} of 5...`);
          else if (step === "career_extras") setStatusText("Formulating career comparison matrix...");
          else if (step === "personality") setStatusText("Generating deep personality profile...");
          else if (step === "actionPlan") setStatusText("Creating actionable roadmaps & missions...");

          let resText = "";
          let data: any = {};
          let success = false;
          let retries = 3;

          while (retries > 0 && !success) {
            try {
              const res = await fetch("/api/analyze-assessment", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({
                  profile: profileData,
                  answers: sessionData.answers || {},
                  step,
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
    <div className="flex min-h-[100dvh] items-center justify-center p-4 bg-background relative overflow-hidden">
      {/* Soft background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl" />

      <Card className="w-full max-w-md border-border/40 bg-card/65 backdrop-blur-md shadow-2xl p-8 sm:p-10 relative overflow-hidden">
        
        {/* Visual scanning overlay */}
        <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-primary to-transparent animate-scan" />

        <CardContent className="flex flex-col items-center text-center space-y-6 pt-6">
          
          {/* Animated circular scanner */}
          <div className="relative flex h-24 w-24 items-center justify-center">
            
            {/* Spinning background circles */}
            <div className="absolute inset-0 rounded-full border-2 border-dashed border-primary/20 animate-[spin_15s_linear_infinite]" />
            <div className="absolute inset-2 rounded-full border border-primary/40 animate-[spin_8s_linear_infinite_reverse]" />
            
            {/* Pulsing inner core */}
            <div className="absolute h-14 w-14 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center animate-pulse">
              <Compass className="h-7 w-7 text-primary animate-[spin_12s_ease-in-out_infinite]" />
            </div>
            
            {/* Scanning radar sweep */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary/0 via-primary/5 to-primary/20 border-r-2 border-primary/30 animate-[spin_3s_linear_infinite]" />
          </div>

          <div className="space-y-2.5">
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground flex items-center justify-center gap-1.5">
              Analyzing Responses <Sparkles className="h-5 w-5 text-primary animate-bounce" />
            </h1>
            <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
              Our Decision Intelligence Engine is scoring your profile across 35 traits and matching them with our Career Registry.
            </p>
          </div>

          {/* Status text */}
          <div className="w-full bg-background/50 rounded-xl border border-border/30 px-4 py-3 h-12 flex items-center justify-center shadow-inner">
            <p className="text-xs font-semibold text-primary transition-all duration-300 animate-pulse text-center">
              {statusText}
            </p>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}

