"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "@/hooks/useTranslations";
import Navbar from "@/features/auth/components/Navbar";
import { useAuth } from "@/features/auth/context/AuthContext";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { UserProfile } from "@/features/auth/context/AuthContext";
import { 
  User, 
  Settings, 
  AlertTriangle, 
  Save, 
  ArrowLeft,
  CheckCircle,
  Layers,
  MapPin,
  MessageSquare,
  Trash2,
  Trophy,
  Zap,
  Star
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function EditProfilePage() {
  const { user, profile, updateProfile, loading: authLoading } = useAuth();
  const router = useRouter();
  const t = useTranslations();
  const [loading, setLoading] = useState(false);
  const [sessionExists, setSessionExists] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  
  // Form states
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    fullName: "",
    segment: "",
    cityTier: "",
    languagePreference: "",
    schoolBoard: "",
    grade: "",
    stream: "",
    collegeName: "",
    degree: "",
    specialization: "",
    graduationYear: "",
    jobTitle: "",
    industry: "",
    otherIndustry: "",
    yearsOfExperience: "",
    backgroundStream: ""
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (profile) {
      setFormData({
        fullName: profile.fullName || user?.displayName || "",
        segment: profile.segment || "",
        cityTier: profile.cityTier || "",
        languagePreference: profile.languagePreference || "",
        schoolBoard: profile.schoolBoard || "",
        grade: profile.grade || "",
        stream: profile.stream || "",
        collegeName: profile.collegeName || "",
        degree: profile.degree || "",
        specialization: profile.specialization || "",
        graduationYear: profile.graduationYear || "",
        jobTitle: profile.jobTitle || "",
        industry: profile.industry || "",
        otherIndustry: profile.otherIndustry || "",
        yearsOfExperience: profile.yearsOfExperience || "",
        backgroundStream: profile.backgroundStream || ""
      });
    }

    // Check if user has an active/completed assessment session in Firestore
    async function checkSession() {
      if (!user) return;
      try {
        const sessionRef = doc(db, "assessment_sessions", user.uid);
        const sessionSnap = await getDoc(sessionRef);
        setSessionExists(sessionSnap.exists());
      } catch (err) {
        console.error("Error checking session:", err);
      }
    }
    checkSession();
  }, [profile, user]);

  const validateForm = () => {
    const errs: Record<string, string> = {};
    if (!formData.fullName?.trim()) errs.fullName = "Full name is required";
    if (!formData.cityTier) errs.cityTier = "Please select your city tier";
    if (!formData.languagePreference) errs.languagePreference = "Please select your preferred language";
    if (!formData.segment) errs.segment = "Please select your academic stage";

    if (formData.segment === "S1") {
      if (!formData.schoolBoard) errs.schoolBoard = "School board is required";
      if (!formData.grade) errs.grade = "Grade is required";
    } else if (formData.segment === "S2") {
      if (!formData.schoolBoard) errs.schoolBoard = "School board is required";
      if (!formData.grade) errs.grade = "Grade is required";
      if (!formData.stream) errs.stream = "Academic stream is required";
    } else if (formData.segment === "S3") {
      if (!formData.backgroundStream) errs.backgroundStream = "Broad academic background is required";
      if (!formData.collegeName?.trim()) errs.collegeName = "College / University name is required";
      if (!formData.degree) errs.degree = "Degree program is required";
      if (!formData.specialization?.trim()) errs.specialization = "Specialization is required";
      if (!formData.graduationYear) errs.graduationYear = "Graduation year is required";
    } else if (formData.segment === "S4") {
      if (!formData.backgroundStream) errs.backgroundStream = "Broad professional background is required";
      if (!formData.jobTitle?.trim()) errs.jobTitle = "Job title is required";
      if (!formData.industry) errs.industry = "Industry sector is required";
      if (formData.industry === "Other" && !formData.otherIndustry?.trim()) errs.otherIndustry = "Please specify your industry";
      if (!formData.yearsOfExperience) errs.yearsOfExperience = "Years of experience is required";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!validateForm()) return;

    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const segmentChanged = formData.segment !== profile?.segment;
      
      if (segmentChanged && sessionExists) {
        const confirmReset = window.confirm(
          "WARNING: Changing your current stage/segment will delete your active career assessment answers and reset your progress because the questions are tailored to your academic stage. Do you wish to proceed?"
        );
        
        if (!confirmReset) {
          // Revert segment field and exit
          setFormData(prev => ({ ...prev, segment: profile?.segment || "" }));
          setLoading(false);
          return;
        }

        // Delete active assessment progress
        const sessionRef = doc(db, "assessment_sessions", user.uid);
        await deleteDoc(sessionRef);
        setSessionExists(false);
      }

      // Clean up irrelevant fields before saving to fix corrupted profiles
      const cleanedData = { ...formData };
      if (cleanedData.segment === "S1") {
        cleanedData.stream = "";
        cleanedData.backgroundStream = "";
        cleanedData.collegeName = "";
        cleanedData.degree = "";
        cleanedData.specialization = "";
        cleanedData.graduationYear = "";
        cleanedData.jobTitle = "";
        cleanedData.industry = "";
        cleanedData.otherIndustry = "";
        cleanedData.yearsOfExperience = "";
      } else if (cleanedData.segment === "S2") {
        cleanedData.backgroundStream = "";
        cleanedData.collegeName = "";
        cleanedData.degree = "";
        cleanedData.specialization = "";
        cleanedData.graduationYear = "";
        cleanedData.jobTitle = "";
        cleanedData.industry = "";
        cleanedData.otherIndustry = "";
        cleanedData.yearsOfExperience = "";
      } else if (cleanedData.segment === "S3") {
        cleanedData.schoolBoard = "";
        cleanedData.grade = "";
        cleanedData.stream = "";
        cleanedData.jobTitle = "";
        cleanedData.industry = "";
        cleanedData.otherIndustry = "";
        cleanedData.yearsOfExperience = "";
      } else if (cleanedData.segment === "S4") {
        cleanedData.schoolBoard = "";
        cleanedData.grade = "";
        cleanedData.stream = "";
        cleanedData.collegeName = "";
        cleanedData.degree = "";
        cleanedData.specialization = "";
        cleanedData.graduationYear = "";
      }

      // Update user details in Firestore
      await updateProfile(cleanedData);
      setSuccessMessage(segmentChanged ? "Profile saved and career assessment reset successfully!" : "Profile updated successfully!");
      
      // Auto clear success alert
      setTimeout(() => {
        setSuccessMessage("");
      }, 4000);
      
    } catch (err) {
      console.error("Error saving profile details:", err);
      setErrorMessage("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetSession = async () => {
    if (!user) return;
    const confirmReset = window.confirm(
      "WARNING: Are you sure you want to delete your active career assessment answers and reset your progress? This action cannot be undone."
    );
    if (!confirmReset) return;

    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const sessionRef = doc(db, "assessment_sessions", user.uid);
      await deleteDoc(sessionRef);
      setSessionExists(false);
      setSuccessMessage("Assessment progress reset successfully! Redirecting...");
      setTimeout(() => {
        router.push("/assessment");
      }, 1500);
    } catch (err) {
      console.error("Failed to reset session:", err);
      setErrorMessage("Failed to reset assessment session. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-background">
        <div className="text-center space-y-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="text-xs font-black uppercase tracking-wider text-muted-foreground font-mono">Loading Profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-[100dvh] bg-background">
      <Navbar />

      <main className="flex-grow max-w-3xl mx-auto px-4 sm:px-6 py-10 w-full space-y-6">
        
        {/* Back Link */}
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground font-semibold transition-colors">
          <ArrowLeft className="h-4 w-4" /> {t("Profile.returnToDashboard")}
        </Link>

        {/* Edit profile Card */}
        <Card className="border-border/40 bg-card/65 backdrop-blur-md shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-primary" />
          
          <CardHeader className="space-y-1.5 pb-6">
            <CardTitle className="text-xl font-extrabold flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary animate-spin-slow" /> {t("Profile.title")}
            </CardTitle>
            <CardDescription className="text-xs">
              {t("Profile.subtitle")}
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSave}>
            <CardContent className="space-y-6">
              
              {/* Alert triggers */}
              {successMessage && (
                <div className="rounded-xl border border-green-500/20 bg-green-500/10 p-4 text-xs text-green-500 font-bold flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 shrink-0" /> {successMessage}
                </div>
              )}

              {errorMessage && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-xs text-red-500 font-bold flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 shrink-0" /> {errorMessage}
                </div>
              )}

              {/* SECTION A: BASICS */}
              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-primary border-b border-border/20 pb-1 flex items-center gap-1.5">
                  <User className="h-4 w-4" /> {t("Onboarding.basicDetails")}
                </h3>

                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="fullName">{t("Onboarding.fullName")}</Label>
                    <Input 
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                      className={errors.fullName ? "border-destructive h-10" : "h-10"}
                    />
                    {errors.fullName && <p className="text-xs text-destructive">{errors.fullName}</p>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label htmlFor="cityTier" className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-primary" /> {t("Onboarding.cityTier")}</Label>
                      <Select 
                        value={formData.cityTier} 
                        onValueChange={(val) => setFormData(prev => ({ ...prev, cityTier: val || "" }))}
                      >
                        <SelectTrigger className={errors.cityTier ? "border-destructive h-10" : "h-10"}>
                          <SelectValue placeholder={t("Onboarding.cityTierPlaceholder")} />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border-border/50">
                          <SelectItem value="Tier 1">{t("Onboarding.tier1")}</SelectItem>
                          <SelectItem value="Tier 2">{t("Onboarding.tier2")}</SelectItem>
                          <SelectItem value="Tier 3">{t("Onboarding.tier3")}</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.cityTier && <p className="text-xs text-destructive">{errors.cityTier}</p>}
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="language" className="flex items-center gap-1.5"><MessageSquare className="h-3.5 w-3.5 text-primary" /> {t("Onboarding.language")}</Label>
                      <Select 
                        value={formData.languagePreference} 
                        onValueChange={(val) => setFormData(prev => ({ ...prev, languagePreference: val || "" }))}
                      >
                        <SelectTrigger className={errors.languagePreference ? "border-destructive h-10" : "h-10"}>
                          <SelectValue placeholder={t("Onboarding.languagePlaceholder")} />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border-border/50">
                          <SelectItem value="English">{t("Onboarding.english")}</SelectItem>
                          <SelectItem value="Hindi">{t("Onboarding.hindi")}</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.languagePreference && <p className="text-xs text-destructive">{errors.languagePreference}</p>}
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION B: ACADEMIC STAGE */}
              <div className="space-y-4 pt-2">
                <h3 className="text-xs font-black uppercase tracking-wider text-primary border-b border-border/20 pb-1 flex items-center gap-1.5">
                  <Layers className="h-4 w-4" /> Academic Stage / Segment
                </h3>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <Label htmlFor="segment">Select Your Academic / Professional Stage</Label>
                    <Select 
                      value={formData.segment} 
                      onValueChange={(val) => {
                        const newSegment = val || "";
                        setFormData(prev => ({
                          ...prev,
                          segment: newSegment as any,
                          ...(newSegment !== prev.segment ? {
                            schoolBoard: "",
                            grade: "",
                            stream: "",
                            collegeName: "",
                            degree: "",
                            specialization: "",
                            graduationYear: "",
                            jobTitle: "",
                            industry: "",
                            otherIndustry: "",
                            yearsOfExperience: "",
                          } : {})
                        }));
                      }}
                    >
                      <SelectTrigger className={errors.segment ? "border-destructive h-10" : "h-10"}>
                        <SelectValue placeholder="Select Stage" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border-border/50">
                        <SelectItem value="S1">School (Class 8–10)</SelectItem>
                        <SelectItem value="S2">School (Class 11–12)</SelectItem>
                        <SelectItem value="S3">College Student (UG/PG)</SelectItem>
                        <SelectItem value="S4">Working Professional</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.segment && <p className="text-xs text-destructive">{errors.segment}</p>}
                    {formData.segment !== profile?.segment && sessionExists && (
                      <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-3.5 text-xs text-amber-500 font-bold flex gap-2.5 mt-2">
                        <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
                        <div>
                          <strong>Important Note:</strong> Saving this segment change will delete your active assessment answers and reset your progress because the questions are tailored to this new segment.
                        </div>
                      </div>
                    )}
                  </div>

                  {/* S1 & S2 DYNAMIC INPUTS */}
                  {(formData.segment === "S1" || formData.segment === "S2") && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-xl border border-border/20 bg-background/20 p-4">
                      <div className="space-y-1">
                        <Label htmlFor="schoolBoard">School Board</Label>
                        <Select 
                          value={formData.schoolBoard} 
                          onValueChange={(val) => setFormData(prev => ({ ...prev, schoolBoard: val || "" }))}
                        >
                          <SelectTrigger className={errors.schoolBoard ? "border-destructive h-10" : "h-10"}>
                            <SelectValue placeholder="Select Board" />
                          </SelectTrigger>
                          <SelectContent className="bg-popover border-border/50">
                            <SelectItem value="CBSE">CBSE</SelectItem>
                            <SelectItem value="ICSE">ICSE / ISC</SelectItem>
                            <SelectItem value="State Board">State Board</SelectItem>
                            <SelectItem value="International">IB / IGCSE</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.schoolBoard && <p className="text-xs text-destructive">{errors.schoolBoard}</p>}
                      </div>

                      <div className="space-y-1">
                        <Label htmlFor="grade">Grade / Class</Label>
                        <Select 
                          value={formData.grade} 
                          onValueChange={(val) => setFormData(prev => ({ ...prev, grade: val || "" }))}
                        >
                          <SelectTrigger className={errors.grade ? "border-destructive h-10" : "h-10"}>
                            <SelectValue placeholder="Select Grade" />
                          </SelectTrigger>
                          <SelectContent className="bg-popover border-border/50">
                            {formData.segment === "S1" ? (
                              <>
                                <SelectItem value="Class 8">Class 8</SelectItem>
                                <SelectItem value="Class 9">Class 9</SelectItem>
                                <SelectItem value="Class 10">Class 10</SelectItem>
                              </>
                            ) : (
                              <>
                                <SelectItem value="Class 11">Class 11</SelectItem>
                                <SelectItem value="Class 12">Class 12</SelectItem>
                              </>
                            )}
                          </SelectContent>
                        </Select>
                        {errors.grade && <p className="text-xs text-destructive">{errors.grade}</p>}
                      </div>

                      {formData.segment === "S2" && (
                        <div className="space-y-1 sm:col-span-2">
                          <Label htmlFor="stream">Academic Stream</Label>
                          <Select 
                            value={formData.stream} 
                            onValueChange={(val) => setFormData(prev => ({ ...prev, stream: val || "" }))}
                          >
                            <SelectTrigger className={errors.stream ? "border-destructive h-10" : "h-10"}>
                              <SelectValue placeholder="Select Stream" />
                            </SelectTrigger>
                            <SelectContent className="bg-popover border-border/50">
                              <SelectItem value="Science PCM">Science (Physics, Chemistry, Maths)</SelectItem>
                              <SelectItem value="Science PCB">Science (Physics, Chemistry, Biology)</SelectItem>
                              <SelectItem value="Commerce">Commerce</SelectItem>
                              <SelectItem value="Humanities">Humanities / Arts</SelectItem>
                            </SelectContent>
                          </Select>
                          {errors.stream && <p className="text-xs text-destructive">{errors.stream}</p>}
                        </div>
                      )}
                    </div>
                  )}

                  {/* S3 DYNAMIC INPUTS */}
                  {formData.segment === "S3" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-xl border border-border/20 bg-background/20 p-4">
                      <div className="space-y-1 sm:col-span-2">
                        <Label htmlFor="s3-backgroundStream">Broad Academic Background</Label>
                        <Select
                          value={formData.backgroundStream}
                          onValueChange={(val) => setFormData(prev => ({ ...prev, backgroundStream: val || "" }))}
                        >
                          <SelectTrigger className={errors.backgroundStream ? "border-destructive h-10" : "h-10"}>
                            <SelectValue placeholder="Select Broad Domain" />
                          </SelectTrigger>
                          <SelectContent className="bg-popover border-border/50">
                            <SelectItem value="Science PCM">Science (PCM - Engineering / Tech / Math)</SelectItem>
                            <SelectItem value="Science PCB">Science (PCB - Medical / Bio / Health)</SelectItem>
                            <SelectItem value="Commerce">Commerce / Finance / Business</SelectItem>
                            <SelectItem value="Humanities">Humanities / Arts / Design / Law</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.backgroundStream && <p className="text-xs text-destructive">{errors.backgroundStream}</p>}
                      </div>

                      <div className="space-y-1 sm:col-span-2">
                        <Label htmlFor="collegeName">College / University Name</Label>
                        <Input 
                          id="collegeName"
                          placeholder="e.g. Delhi University, IIT Bombay"
                          value={formData.collegeName}
                          onChange={(e) => setFormData(prev => ({ ...prev, collegeName: e.target.value }))}
                          className={errors.collegeName ? "border-destructive h-10" : "h-10"}
                        />
                        {errors.collegeName && <p className="text-xs text-destructive">{errors.collegeName}</p>}
                      </div>

                      <div className="space-y-1">
                        <Label htmlFor="degree">Degree Program</Label>
                        <Select 
                          value={formData.degree} 
                          onValueChange={(val) => setFormData(prev => ({ ...prev, degree: val || "" }))}
                        >
                          <SelectTrigger className={errors.degree ? "border-destructive h-10" : "h-10"}>
                            <SelectValue placeholder="Select Degree" />
                          </SelectTrigger>
                          <SelectContent className="bg-popover border-border/50">
                            <SelectItem value="B.Tech/B.E.">B.Tech / B.E.</SelectItem>
                            <SelectItem value="B.Com">B.Com / B.Com (Hons)</SelectItem>
                            <SelectItem value="B.Sc.">B.Sc. / B.Sc. (Hons)</SelectItem>
                            <SelectItem value="B.A.">B.A. / B.A. (Hons)</SelectItem>
                            <SelectItem value="B.BA / B.MS">B.BA / B.MS</SelectItem>
                            <SelectItem value="M.Tech/MS/M.Sc.">Postgrad (M.Tech / M.Sc / M.A.)</SelectItem>
                            <SelectItem value="MBA">MBA / PGDM</SelectItem>
                            <SelectItem value="Other">Other Degree</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.degree && <p className="text-xs text-destructive">{errors.degree}</p>}
                      </div>

                      <div className="space-y-1">
                        <Label htmlFor="specialization">Specialization / Major</Label>
                        <Input 
                          id="specialization"
                          placeholder="e.g. Computer Science, Economics"
                          value={formData.specialization}
                          onChange={(e) => setFormData(prev => ({ ...prev, specialization: e.target.value }))}
                          className={errors.specialization ? "border-destructive h-10" : "h-10"}
                        />
                        {errors.specialization && <p className="text-xs text-destructive">{errors.specialization}</p>}
                      </div>

                      <div className="space-y-1 sm:col-span-2">
                        <Label htmlFor="graduationYear">Expected Year of Graduation</Label>
                        <Select 
                          value={formData.graduationYear} 
                          onValueChange={(val) => setFormData(prev => ({ ...prev, graduationYear: val || "" }))}
                        >
                          <SelectTrigger className={errors.graduationYear ? "border-destructive h-10" : "h-10"}>
                            <SelectValue placeholder="Select Graduation Year" />
                          </SelectTrigger>
                          <SelectContent className="bg-popover border-border/50">
                            {["2026", "2027", "2028", "2029", "2030"].map(year => (
                              <SelectItem key={year} value={year}>{year}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.graduationYear && <p className="text-xs text-destructive">{errors.graduationYear}</p>}
                      </div>
                    </div>
                  )}

                  {/* S4 DYNAMIC INPUTS */}
                  {formData.segment === "S4" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-xl border border-border/20 bg-background/20 p-4">
                      <div className="space-y-1 sm:col-span-2">
                        <Label htmlFor="s4-backgroundStream">Broad Professional Background</Label>
                        <Select
                          value={formData.backgroundStream}
                          onValueChange={(val) => setFormData(prev => ({ ...prev, backgroundStream: val || "" }))}
                        >
                          <SelectTrigger className={errors.backgroundStream ? "border-destructive h-10" : "h-10"}>
                            <SelectValue placeholder="Select Broad Domain" />
                          </SelectTrigger>
                          <SelectContent className="bg-popover border-border/50">
                            <SelectItem value="Science PCM">Science (PCM - Engineering / Tech / Math)</SelectItem>
                            <SelectItem value="Science PCB">Science (PCB - Medical / Bio / Health)</SelectItem>
                            <SelectItem value="Commerce">Commerce / Finance / Business</SelectItem>
                            <SelectItem value="Humanities">Humanities / Arts / Design / Law</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.backgroundStream && <p className="text-xs text-destructive">{errors.backgroundStream}</p>}
                      </div>

                      <div className="space-y-1 sm:col-span-2">
                        <Label htmlFor="jobTitle">Job Title</Label>
                        <Input 
                          id="jobTitle"
                          placeholder="e.g. Software Engineer, Sales Manager"
                          value={formData.jobTitle}
                          onChange={(e) => setFormData(prev => ({ ...prev, jobTitle: e.target.value }))}
                          className={errors.jobTitle ? "border-destructive h-10" : "h-10"}
                        />
                        {errors.jobTitle && <p className="text-xs text-destructive">{errors.jobTitle}</p>}
                      </div>

                      <div className="space-y-1">
                        <Label htmlFor="industry">Industry Sector</Label>
                        <Select 
                          value={formData.industry} 
                          onValueChange={(val) => setFormData(prev => ({ ...prev, industry: val || "" }))}
                        >
                          <SelectTrigger className={errors.industry ? "border-destructive h-10" : "h-10"}>
                            <SelectValue placeholder="Select Industry" />
                          </SelectTrigger>
                          <SelectContent className="bg-popover border-border/50">
                            <SelectItem value="IT / Software">Information Technology & Software</SelectItem>
                            <SelectItem value="Finance / Banking">Finance & Banking</SelectItem>
                            <SelectItem value="Marketing / Media">Marketing & Advertising</SelectItem>
                            <SelectItem value="Healthcare / Biotech">Healthcare & Pharmaceuticals</SelectItem>
                            <SelectItem value="Education">Education & Training</SelectItem>
                            <SelectItem value="Logistics / Supply Chain">Logistics & Supply Chain</SelectItem>
                            <SelectItem value="Other">Other Sector</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.industry && <p className="text-xs text-destructive">{errors.industry}</p>}
                      </div>

                      {formData.industry === "Other" && (
                        <div className="space-y-1 sm:col-span-2">
                          <Label htmlFor="otherIndustry">Please specify your industry</Label>
                          <Input 
                            id="otherIndustry"
                            placeholder="e.g. Retail, Real Estate, E-commerce"
                            value={formData.otherIndustry}
                            onChange={(e) => setFormData(prev => ({ ...prev, otherIndustry: e.target.value }))}
                            className={errors.otherIndustry ? "border-destructive h-10" : "h-10"}
                          />
                          {errors.otherIndustry && <p className="text-xs text-destructive">{errors.otherIndustry}</p>}
                        </div>
                      )}

                      <div className="space-y-1 sm:col-span-2">
                        <Label htmlFor="experience">Years of Professional Experience</Label>
                        <Select 
                          value={formData.yearsOfExperience} 
                          onValueChange={(val) => setFormData(prev => ({ ...prev, yearsOfExperience: val || "" }))}
                        >
                          <SelectTrigger className={errors.yearsOfExperience ? "border-destructive h-10" : "h-10"}>
                            <SelectValue placeholder="Select Experience Range" />
                          </SelectTrigger>
                          <SelectContent className="bg-popover border-border/50">
                            <SelectItem value="0-1 years">Less than 1 year (Entry-level)</SelectItem>
                            <SelectItem value="1-3 years">1 to 3 years</SelectItem>
                            <SelectItem value="3-5 years">3 to 5 years</SelectItem>
                            <SelectItem value="5+ years">More than 5 years</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.yearsOfExperience && <p className="text-xs text-destructive">{errors.yearsOfExperience}</p>}
                      </div>
                    </div>
                  )}

                </div>
              </div>

            </CardContent>

            <CardFooter className="flex justify-between border-t border-border/20 pt-6 bg-background/10">
              <Button 
                type="button" 
                variant="ghost" 
                onClick={() => router.push("/")}
                className="font-bold text-muted-foreground hover:text-foreground h-10 px-5"
              >
                {t("Common.cancel")}
              </Button>
              <div className="flex items-center gap-3">
                {sessionExists && (
                  <Button 
                    type="button" 
                    variant="destructive" 
                    disabled={loading}
                    onClick={handleResetSession}
                    className="font-bold flex items-center gap-1.5 h-10 px-4 bg-red-600/90 hover:bg-red-700 text-white shadow-md"
                  >
                    <Trash2 className="h-4 w-4" /> {t("Common.resetAssessment")}
                  </Button>
                )}
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="font-bold flex items-center gap-1.5 h-10 px-6 shadow-md shadow-primary/20"
                >
                  <Save className="h-4 w-4" /> {loading ? t("Common.loading") : t("Common.saveDetails")}
                </Button>
              </div>
            </CardFooter>
          </form>
        </Card>

      </main>
    </div>
  );
}
