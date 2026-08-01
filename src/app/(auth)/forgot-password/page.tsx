"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email");
      return;
    }
    setError("");
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess(true);
    } catch (err) {
      console.error(err);
      const message = err instanceof Error ? err.message : "Failed to send reset link. Verify email and try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 relative overflow-hidden bg-background">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -z-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />

      <div className="w-full max-w-md space-y-6">
        
        {/* Brand / Logo */}
        <div className="flex flex-col items-center text-center space-y-2">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20 p-2">
              <Image src="/logo_transparent.png" alt="CareeRight Logo" width={28} height={28} className="object-contain" />
            </div>
            <span className="text-2xl font-bold tracking-tight">
              Caree<span className="text-primary font-extrabold">Right</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-foreground mt-4">Reset password</h1>
          <p className="text-sm text-muted-foreground">
            We&apos;ll send you a link to log back into your account
          </p>
        </div>

        {/* Card Reset Form */}
        <Card className="border-border/40 bg-card/60 backdrop-blur-md shadow-xl">
          <CardHeader className="p-6 sm:p-8 pb-4 space-y-1">
            <CardTitle className="text-xl font-bold">Forgot Password</CardTitle>
            <CardDescription>Enter registered email address below</CardDescription>
          </CardHeader>
          
          <CardContent className="p-6 sm:p-8 pt-0 space-y-6">
            {success ? (
              <div className="flex flex-col items-center text-center p-4 space-y-3 bg-primary/5 rounded-lg border border-primary/10">
                <CheckCircle2 className="h-10 w-10 text-primary animate-bounce" />
                <h3 className="font-bold text-base text-foreground">Reset Link Sent</h3>
                <p className="text-sm text-muted-foreground">
                  Check your inbox at <strong>{email}</strong> for instructions to reset your password.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="flex items-start gap-2.5 rounded-lg bg-destructive/10 p-3 text-sm text-destructive border border-destructive/20">
                    <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="space-y-2.5">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-9 bg-background/50 focus-visible:ring-primary h-10"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full mt-2 font-semibold shadow-sm h-10" disabled={loading}>
                  {loading ? "Sending..." : "Send Reset Link"}
                </Button>
              </form>
            )}
          </CardContent>

          <CardFooter className="justify-center border-t border-border/20 p-6 sm:p-8 pt-4 pb-6 sm:pb-8">
            <Link
              href="/login"
              className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
            >
              <ArrowLeft className="h-4 w-4" /> Back to log in
            </Link>
          </CardFooter>
        </Card>

      </div>
    </div>
  );
}
