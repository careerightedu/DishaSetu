"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Script from "next/script";
import Navbar from "@/features/auth/components/Navbar";
import { useAuth } from "@/features/auth/context/AuthContext";
import { useTranslations } from "@/hooks/useTranslations";
import { 
  ClipboardList, 
  Clock, 
  HelpCircle, 
  Compass, 
  Play, 
  RotateCcw,
  ChevronRight,
  ArrowLeft,
  Brain,
  Terminal,
  CheckCircle2,
  Layers,
  CreditCard,
  Tag
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

  // Payment states
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [checkingCoupon, setCheckingCoupon] = useState(false);
  const [couponMessage, setCouponMessage] = useState({ type: "", text: "" });
  const [paying, setPaying] = useState(false);

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
  }, [user, router]);

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

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setCheckingCoupon(true);
    setCouponMessage({ type: "", text: "" });
    try {
      const { collection, getDoc, doc } = await import("firebase/firestore");
      const normalizedCode = couponCode.toUpperCase();

      if (profile?.usedCoupons?.includes(normalizedCode)) {
        setCouponMessage({ type: "error", text: "You have already used this coupon." });
        setCheckingCoupon(false);
        return;
      }

      const couponSnap = await getDoc(doc(db, "coupons", normalizedCode));
      
      if (couponSnap.exists() && couponSnap.data().active) {
        const data = couponSnap.data();
        setDiscount(data.discountPercentage || 0);
        setCouponMessage({ type: "success", text: `${data.discountPercentage}% discount applied!` });
      } else {
        setDiscount(0);
        setCouponMessage({ type: "error", text: "Invalid or expired coupon" });
      }
    } catch (err) {
      console.error(err);
      setCouponMessage({ type: "error", text: "Failed to verify coupon" });
    } finally {
      setCheckingCoupon(false);
    }
  };

  const handlePayment = async () => {
    if (!user) return;
    setPaying(true);

    try {
      // Short-circuit for 100% free coupons
      if (discount === 100) {
        const unlockRes = await fetch("/api/assessment/free-unlock", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ couponCode, uid: user.uid })
        });
        
        const unlockData = await unlockRes.json();
        if (unlockData.success) {
          await updateProfile({ hasPaid: true });
          router.push("/assessment/session");
          return;
        } else {
          throw new Error(unlockData.error || "Failed to unlock securely");
        }
      }

      // 1. Create order on backend
      const res = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 99900, couponCode: couponCode, uid: user.uid }) // ₹999 base price
      });
      const data = await res.json();

      if (data.amount === 0) {
        // Fallback catch if backend returned amount 0 for some other reason
        await updateProfile({ hasPaid: true });
        router.push("/assessment/session");
        return;
      }

      if (!data.orderId) throw new Error("Failed to create order");

      // 2. Initialize Razorpay Checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Use NEXT_PUBLIC variable for client
        amount: data.amount,
        currency: data.currency,
        name: "WhatAfter",
        description: "Career Intelligence Assessment",
        order_id: data.orderId,
        handler: async function (response: any) {
          // 3. Verify Payment Signature on Backend
          const verifyRes = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              uid: user.uid,
              couponCode: couponCode ? couponCode.toUpperCase() : undefined
            })
          });
          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            await updateProfile({ hasPaid: true });
            router.push("/assessment/session");
          } else {
            alert("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: profile?.fullName || "",
          email: user.email || "",
        },
        theme: {
          color: "#10b981"
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", function (response: any) {
        alert("Payment Failed: " + response.error.description);
      });
      rzp.open();

    } catch (err) {
      console.error("Payment error:", err);
      alert("Something went wrong initiating the payment.");
    } finally {
      setPaying(false);
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
    <div className={cn("flex flex-col min-h-[100dvh] transition-colors duration-1000 relative overflow-hidden", getBgClass())}>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      {/* Grid Parallax */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b9810a_1px,transparent_1px),linear-gradient(to_bottom,#10b9810a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
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
            
            <CardHeader className="p-6 sm:p-8 pb-4 flex flex-col md:flex-row gap-6 items-center md:items-start text-center md:text-left relative z-10">
              {/* Holographic Core */}
              <div className="relative flex h-20 w-20 sm:h-24 sm:w-24 shrink-0 items-center justify-center mt-2 sm:mt-0">
                <div className={cn(
                  "absolute inset-0 rounded-full border-4 border-dashed animate-[spin_10s_linear_infinite]",
                  sessionProgress.answered > 0 ? "border-primary/40" : "border-slate-500/20"
                )} />
                <div className={cn(
                  "absolute inset-3 rounded-full border-2 animate-[spin_5s_linear_infinite_reverse]",
                  sessionProgress.answered > 0 ? "border-primary/50" : "border-slate-500/30"
                )} />
                <div className={cn(
                  "absolute h-10 w-10 sm:h-12 sm:w-12 rounded-full flex items-center justify-center animate-pulse",
                  sessionProgress.answered > 0 ? "bg-primary/20 border border-primary/50 shadow-[0_0_20px_rgba(var(--primary),0.3)]" : "bg-slate-800 border border-slate-600"
                )}>
                  <Compass className={cn("h-5 w-5 sm:h-6 sm:w-6", sessionProgress.answered > 0 ? "text-primary animate-[spin_12s_ease-in-out_infinite]" : "text-slate-500")} />
                </div>
              </div>

              <div className="space-y-2 flex-grow">
                <div className="flex items-center justify-center md:justify-start gap-2 text-primary font-bold text-xs uppercase tracking-wider">
                  <ClipboardList className="h-4.5 w-4.5" /> Career mapping session
                </div>
                <CardTitle className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  Core Career Assessment
                </CardTitle>
                <CardDescription>
                  A comprehensive questionnaire designed to map your core personality traits, cognitive aptitudes, workflow values, and career alignment vectors.
                </CardDescription>
              </div>
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
              </div>

              {/* Mission Parameters (Metric Grid) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="group relative rounded-xl border border-primary/20 bg-black/20 p-5 overflow-hidden transition-all duration-300 hover:border-primary/50 hover:bg-primary/5 hover:shadow-[0_0_20px_rgba(var(--primary),0.1)]">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Clock className="h-16 w-16 text-primary" />
                  </div>
                  <div className="relative z-10 space-y-2 text-center sm:text-left">
                    <div className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-primary/20 text-primary border border-primary/30 mb-1">
                      <Clock className="h-4 w-4" />
                    </div>
                    <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Duration</div>
                    <p className="text-2xl font-black text-foreground tracking-tight">~ 45 Mins</p>
                    <p className="text-[10px] text-muted-foreground">Pause & resume dynamically</p>
                  </div>
                </div>

                <div className="group relative rounded-xl border border-primary/20 bg-black/20 p-5 overflow-hidden transition-all duration-300 hover:border-primary/50 hover:bg-primary/5 hover:shadow-[0_0_20px_rgba(var(--primary),0.1)]">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <HelpCircle className="h-16 w-16 text-primary" />
                  </div>
                  <div className="relative z-10 space-y-2 text-center sm:text-left">
                    <div className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-primary/20 text-primary border border-primary/30 mb-1">
                      <HelpCircle className="h-4 w-4" />
                    </div>
                    <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Questions</div>
                    <p className="text-2xl font-black text-foreground tracking-tight">80 Questions</p>
                    <p className="text-[10px] text-muted-foreground">80 Scored (Stratified)</p>
                  </div>
                </div>

                <div className="group relative rounded-xl border border-primary/20 bg-black/20 p-5 overflow-hidden transition-all duration-300 hover:border-primary/50 hover:bg-primary/5 hover:shadow-[0_0_20px_rgba(var(--primary),0.1)]">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Compass className="h-16 w-16 text-primary" />
                  </div>
                  <div className="relative z-10 space-y-2 text-center sm:text-left">
                    <div className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-primary/20 text-primary border border-primary/30 mb-1">
                      <Compass className="h-4 w-4" />
                    </div>
                    <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Methodology</div>
                    <p className="text-lg leading-tight font-black text-foreground tracking-tight">Mathematical + AI</p>
                    <p className="text-[10px] text-muted-foreground">Grounded Indian framework</p>
                  </div>
                </div>
              </div>

              {/* Mission Briefing Terminal */}
              <div className="rounded-xl bg-[#0b132b]/80 p-6 border-l-4 border-l-primary border-y border-r border-border/30 relative overflow-hidden group hover:border-l-primary/80 transition-colors">
                <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(var(--primary),0.03)_100%)] pointer-events-none" />
                <div className="relative z-10 space-y-4">
                  <div className="flex items-center gap-2 text-primary">
                    <Terminal className="h-5 w-5 animate-pulse" />
                    <p className="font-mono text-sm font-bold tracking-wider uppercase">{t("guidelinesTitle") || "Mission Briefing"}</p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-1">
                    <div className="flex items-start gap-3 bg-black/30 p-3 rounded-lg border border-white/5 hover:bg-black/50 transition-colors">
                      <div className="mt-0.5 text-primary"><Clock className="h-4 w-4" /></div>
                      <p className="text-xs text-muted-foreground leading-relaxed"><strong className="text-slate-300">{t("guideline1Title")}</strong> {t("guideline1Desc")}</p>
                    </div>
                    <div className="flex items-start gap-3 bg-black/30 p-3 rounded-lg border border-white/5 hover:bg-black/50 transition-colors">
                      <div className="mt-0.5 text-emerald-400"><Brain className="h-4 w-4" /></div>
                      <p className="text-xs text-muted-foreground leading-relaxed"><strong className="text-slate-300">{t("guideline2Title")}</strong> {t("guideline2Desc")}</p>
                    </div>
                    <div className="flex items-start gap-3 bg-black/30 p-3 rounded-lg border border-white/5 hover:bg-black/50 transition-colors">
                      <div className="mt-0.5 text-blue-400"><Layers className="h-4 w-4" /></div>
                      <p className="text-xs text-muted-foreground leading-relaxed"><strong className="text-slate-300">{t("guideline3Title")}</strong> {t("guideline3Desc")}</p>
                    </div>
                    <div className="flex items-start gap-3 bg-black/30 p-3 rounded-lg border border-white/5 hover:bg-black/50 transition-colors">
                      <div className="mt-0.5 text-amber-400"><CheckCircle2 className="h-4 w-4" /></div>
                      <p className="text-xs text-muted-foreground leading-relaxed"><strong className="text-slate-300">Autosave:</strong> Your progress is saved in the cloud. You can safely exit at any time and resume right where you left off.</p>
                    </div>
                  </div>
                </div>
              </div>

            </CardContent>

            <CardFooter className="p-6 sm:p-8 pt-4 pb-8 border-t border-border/20 bg-background/25 flex flex-col gap-4">
              {checkingSession ? (
                <div className="h-10 w-full rounded-lg bg-muted animate-pulse" />
              ) : profile?.hasPaid ? (
                // PAID STATE -> Normal Flow
                <div className="flex flex-col sm:flex-row gap-3 sm:justify-end w-full">
                  {sessionExists ? (
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
                </div>
              ) : (
                // UNPAID STATE -> Checkout Flow
                <div className="flex flex-col md:flex-row items-center justify-between w-full gap-4 p-4 rounded-xl border border-primary/20 bg-primary/5">
                  <div className="flex flex-col gap-1 w-full md:w-1/2">
                    <p className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-primary" /> Unlock Assessment
                    </p>
                    <p className="text-xs text-muted-foreground">Access your comprehensive 80-question career mapping assessment.</p>
                  </div>
                  <div className="flex flex-col w-full md:w-auto items-end gap-2">
                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
                      <div className="relative w-full sm:w-48">
                        <Tag className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                        <Input
                          type="text"
                          placeholder="Coupon Code"
                          className="pl-9 h-10 bg-slate-900 border-slate-700 text-slate-100 text-sm uppercase placeholder:text-slate-500"
                          value={couponCode}
                          onChange={(e) => {
                            setCouponCode(e.target.value);
                            if (couponMessage.text) setCouponMessage({ type: "", text: "" });
                          }}
                        />
                      </div>
                      <Button 
                        variant="secondary" 
                        className="h-10 px-4 whitespace-nowrap text-xs border border-border/50" 
                        onClick={handleApplyCoupon}
                        disabled={checkingCoupon || !couponCode}
                      >
                        {checkingCoupon ? "Checking..." : "Apply"}
                      </Button>
                      <Button 
                        onClick={handlePayment} 
                        disabled={paying}
                        className="w-full sm:w-auto h-10 px-6 font-bold shadow-lg shadow-primary/20 gap-2"
                      >
                        {paying ? (
                          <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        ) : discount === 100 ? (
                          <Play className="h-4 w-4 fill-current" />
                        ) : (
                          <CreditCard className="h-4 w-4" />
                        )}
                        {discount === 100 ? "Start for Free" : `Pay ₹${(999 - (999 * discount / 100)).toFixed(2).replace(/\.00$/, '')} to Start`}
                      </Button>
                    </div>
                    {couponMessage.text && (
                      <p className={`text-[10px] font-bold uppercase tracking-wider px-1 ${couponMessage.type === "success" ? "text-emerald-500" : "text-red-500"}`}>
                        {couponMessage.text}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
}
