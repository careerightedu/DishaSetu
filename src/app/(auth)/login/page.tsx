"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/features/auth/context/AuthContext";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function LoginPage() {
  const { loginWithGoogle } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) - 0.5,
        y: (e.clientY / window.innerHeight) - 0.5,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleGoogleSignIn = async () => {
    setError("");
    setLoading(true);
    try {
      await loginWithGoogle();
      const params = new URLSearchParams(window.location.search);
      const redirectUrl = params.get("redirect");
      window.location.href = redirectUrl || "/dashboard";
    } catch (err) {
      console.error(err);
      const message = err instanceof Error ? err.message : "Failed to log in with Google.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden bg-background text-foreground">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Animated Grid */}
        <div 
          className="absolute inset-0 bg-[linear-gradient(to_right,#10b9810a_1px,transparent_1px),linear-gradient(to_bottom,#10b9810a_1px,transparent_1px)] bg-[size:3rem_3rem]"
          style={{
            transform: `perspective(1000px) rotateX(60deg) translateY(-50px) translateZ(-200px)`,
            transformOrigin: "top center",
          }}
        />
        
        {/* Glow Orbs */}
        <motion.div 
          className="absolute top-[10%] left-[10%] w-[40%] h-[40%] rounded-full bg-emerald-600/20 blur-[120px]"
          animate={{
            x: mousePosition.x * 30,
            y: mousePosition.y * 30,
          }}
          transition={{ type: "spring", damping: 50, stiffness: 10 }}
        />
        <motion.div 
          className="absolute bottom-[10%] right-[10%] w-[30%] h-[30%] rounded-full bg-blue-600/15 blur-[120px]"
          animate={{
            x: mousePosition.x * -30,
            y: mousePosition.y * -30,
          }}
          transition={{ type: "spring", damping: 50, stiffness: 10 }}
        />
      </div>

      {/* Main Container: Split 2-Column on LG, Stacked on Mobile */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center relative z-10 px-2 sm:px-4 my-auto"
      >
        
        {/* Left Column: Big Brand Logo & Name */}
        <div className="flex flex-col justify-center items-center lg:items-start text-center lg:text-left space-y-5 lg:pr-6">
          <Link href="/" className="inline-flex items-center gap-3 sm:gap-4 group">
            <div className="flex h-14 w-14 sm:h-20 sm:w-20 items-center justify-center rounded-2xl bg-white/5 border border-white/10 shadow-2xl shadow-emerald-500/10 p-2.5 sm:p-3 transition-transform group-hover:scale-105 shrink-0">
              <Image 
                src="/what_after_logo_white.png" 
                alt="WhatAfter Logo" 
                width={64} 
                height={64} 
                className="object-contain" 
                priority
              />
            </div>
            <span className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white whitespace-nowrap">
              What<span className="text-emerald-400 font-extrabold">After</span>
            </span>
          </Link>

          <p className="text-sm sm:text-base text-slate-300 max-w-md leading-relaxed font-normal">
            AI-Powered Career Intelligence for Class 8 to College. Mapping 35 cognitive traits to actionable, high-demand roadmaps.
          </p>

          {/* Value Proof Badges */}
          <div className="hidden sm:flex flex-col gap-2.5 text-xs text-slate-400 pt-1">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>35-Trait Cognitive Aptitudes &amp; Work Values</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Real Salary Trajectories &amp; AI-Resilience Scores</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Available in English &amp; Hindi (हिंदी)</span>
            </div>
          </div>
        </div>

        {/* Right Column: Login Card & Actions */}
        <div className="w-full max-w-md mx-auto space-y-4">
          <div className="text-center lg:text-left space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Welcome back</h1>
            <p className="text-sm text-slate-400">
              Sign in to resume your career assessment and report
            </p>
          </div>

          {/* Card Form */}
          <Card className="border-white/10 bg-slate-900/50 backdrop-blur-xl shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-blue-500/5 pointer-events-none" />
            <CardHeader className="p-6 sm:p-8 pb-4 space-y-1 text-center relative z-10">
              <CardTitle className="text-xl font-bold text-white">Log In</CardTitle>
              <CardDescription className="text-slate-400">Continue with your Google account</CardDescription>
            </CardHeader>
            
            <CardContent className="p-6 sm:p-8 pt-0 space-y-6 text-center relative z-10">
              {error && (
                <div className="flex items-start gap-2.5 rounded-lg bg-red-500/10 p-3 text-sm text-red-400 border border-red-500/20 animate-in fade-in slide-in-from-top-1 text-left">
                  <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <Button
                variant="outline"
                type="button"
                className="group relative w-full font-semibold transition-all duration-300 border-white/10 bg-white/5 hover:bg-emerald-500/10 hover:border-emerald-500/30 overflow-hidden shadow-[0_0_20px_rgba(255,255,255,0.02)] hover:shadow-[0_0_40px_rgba(16,185,129,0.3)] hover:-translate-y-1 h-12 text-base text-white"
                onClick={handleGoogleSignIn}
                disabled={loading}
              >
                <div className="absolute inset-0 w-full h-full -ml-[100%] bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
                {/* Google SVG Icon */}
                <svg className="relative z-10 mr-3 h-5 w-5 shrink-0" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                <span className="relative z-10">{loading ? "Signing in..." : "Continue with Google"}</span>
              </Button>
            </CardContent>

            <CardFooter className="justify-center border-t border-white/5 p-6 sm:p-8 pt-4 pb-6 sm:pb-8 relative z-10 bg-black/10">
              <p className="text-sm text-slate-400">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="font-semibold text-emerald-400 hover:text-emerald-300 hover:underline">
                  Sign up
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>

      </motion.div>
    </div>
  );
}
