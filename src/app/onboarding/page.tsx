"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "@/hooks/useTranslations";
import { useAuth, UserProfile } from "@/features/auth/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Compass, 
  GraduationCap, 
  BookOpen, 
  Briefcase, 
  User as UserIcon,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  Layers,
  Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

export default function OnboardingPage() {
  const { user, profile, updateProfile } = useAuth();
  const router = useRouter();
  const t = useTranslations("Onboarding");

  // Onboarding wizard steps: 1: Basics, 2: Segment Select, 3: Segment Details, 4: Success
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form states
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    fullName: profile?.fullName || user?.displayName || "",
    segment: "",
    cityTier: "",
    languagePreference: "",
    schoolBoard: "",
    grade: "",
    stream: "",
    backgroundStream: "",
    collegeName: "",
    degree: "",
    specialization: "",
    graduationYear: "",
    jobTitle: "",
    industry: "",
    otherIndustry: "",
    yearsOfExperience: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep = (currentStep: number) => {
    const errs: Record<string, string> = {};
    if (currentStep === 1) {
      if (!formData.fullName?.trim()) errs.fullName = "Full name is required";
      if (!formData.cityTier) errs.cityTier = "Please select a city tier";
      if (!formData.languagePreference) errs.languagePreference = "Please select a language preference";
    } else if (currentStep === 2) {
      if (!formData.segment) errs.segment = "Please select a segment";
    } else if (currentStep === 3) {
      if (formData.segment === "S1") {
        if (!formData.schoolBoard) errs.schoolBoard = "School board is required";
        if (!formData.grade) errs.grade = "Grade is required";
      } else if (formData.segment === "S2") {
        if (!formData.schoolBoard) errs.schoolBoard = "School board is required";
        if (!formData.grade) errs.grade = "Grade is required";
        if (!formData.stream) errs.stream = "Stream selection is required";
      } else if (formData.segment === "S3") {
        if (!formData.backgroundStream) errs.backgroundStream = "Broad academic background is required";
        if (!formData.collegeName?.trim()) errs.collegeName = "College/University name is required";
        if (!formData.degree) errs.degree = "Degree is required";
        if (!formData.specialization?.trim()) errs.specialization = "Specialization is required";
        if (!formData.graduationYear) errs.graduationYear = "Graduation year is required";
      } else if (formData.segment === "S4") {
        if (!formData.backgroundStream) errs.backgroundStream = "Broad professional background is required";
        if (!formData.jobTitle?.trim()) errs.jobTitle = "Job title is required";
        if (!formData.industry) errs.industry = "Industry is required";
        if (formData.industry === "Other" && !formData.otherIndustry?.trim()) errs.otherIndustry = "Please specify your industry";
        if (!formData.yearsOfExperience) errs.yearsOfExperience = "Years of experience is required";
      }
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSegmentSelect = (segment: "S1" | "S2" | "S3" | "S4") => {
    // Clear other details if segment changes
    setFormData(prev => ({
      ...prev,
      segment,
      schoolBoard: "",
      grade: "",
      stream: "",
      backgroundStream: "",
      collegeName: "",
      degree: "",
      specialization: "",
      graduationYear: "",
      jobTitle: "",
      industry: "",
      otherIndustry: "",
      yearsOfExperience: "",
    }));
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;
    setLoading(true);
    try {
      // Save profile and mark onboarding as complete
      await updateProfile({
        ...formData,
        onboardingCompleted: true,
      });
      // Move to success screen
      setStep(4);
    } catch (err) {
      console.error("Failed to complete onboarding:", err);
      setErrors({ submit: "Failed to save profile. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleStartApp = () => {
    router.push("/");
  };

  // Animation variants
  const slideVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: -50, transition: { duration: 0.2 } }
  };

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center p-4 relative overflow-hidden bg-background">
      {/* Background blobs */}
      <div className="absolute top-1/4 left-1/4 -z-10 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 -z-10 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />

      <div className="w-full max-w-2xl space-y-6">
        
        {/* Step Indicator Header */}
        {step < 4 && (
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="flex items-center gap-1.5 text-primary text-xs font-bold uppercase tracking-wider">
              <Compass className="h-4 w-4" /> {t("profileBuilder")}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{t("buildTitle")}</h1>
            <p className="text-sm text-muted-foreground max-w-md">
              {t("buildDesc")}
            </p>

            {/* Step Progress Tracker */}
            <div className="flex items-center justify-between w-full max-w-sm pt-4 relative">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-border -z-10" />
              <div 
                className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-primary -z-10 transition-all duration-300"
                style={{ width: `${((step - 1) / 2) * 100}%` }}
              />
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`h-7 w-7 rounded-full flex items-center justify-center font-bold text-xs border transition-all duration-300 ${
                    s < step 
                      ? "bg-primary border-primary text-primary-foreground" 
                      : s === step 
                      ? "bg-background border-primary text-primary ring-4 ring-primary/20" 
                      : "bg-background border-border text-muted-foreground"
                  }`}
                >
                  {s}
                </div>
              ))}
            </div>
          </div>
        )}

        <Card className="border-border/40 bg-card/60 backdrop-blur-md shadow-xl overflow-hidden min-h-[400px] flex flex-col justify-between">
          <CardContent className="p-6 sm:p-8 flex-grow">
            <AnimatePresence mode="wait">
              {/* STEP 1: BASICS */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  variants={slideVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-6"
                >
                  <h2 className="text-lg font-bold flex items-center gap-2 border-b border-border/40 pb-2">
                    <UserIcon className="h-5 w-5 text-primary" /> {t("personalInfo")}
                  </h2>

                  <div className="grid grid-cols-1 gap-5">
                    <div className="space-y-2.5">
                      <Label htmlFor="fullName">{t("fullNameLabel")}</Label>
                      <Input
                        id="fullName"
                        placeholder={t("fullNamePlaceholder")}
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className={`bg-background/40 focus-visible:ring-primary h-10 ${errors.fullName ? "border-destructive" : ""}`}
                      />
                      {errors.fullName && <p className="text-xs text-destructive">{errors.fullName}</p>}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-2.5">
                        <Label htmlFor="cityTier">{t("cityTierLabel")}</Label>
                        <Select
                          value={formData.cityTier}
                          onValueChange={(val) => setFormData({ ...formData, cityTier: val || "" })}
                        >
                          <SelectTrigger className={`bg-background/40 focus:ring-primary h-10 ${errors.cityTier ? "border-destructive" : ""}`}>
                            <SelectValue placeholder={t("cityTierPlaceholder")} />
                          </SelectTrigger>
                          <SelectContent className="bg-popover border-border/50">
                            <SelectItem value="Tier 1">{t("tier1")}</SelectItem>
                            <SelectItem value="Tier 2">{t("tier2")}</SelectItem>
                            <SelectItem value="Tier 3">{t("tier3")}</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.cityTier && <p className="text-xs text-destructive">{errors.cityTier}</p>}
                      </div>

                      <div className="space-y-2.5">
                        <Label htmlFor="languagePreference">{t("langLabel")}</Label>
                        <Select
                          value={formData.languagePreference}
                          onValueChange={(val) => setFormData({ ...formData, languagePreference: val || "" })}
                        >
                          <SelectTrigger className={`bg-background/40 focus:ring-primary h-10 ${errors.languagePreference ? "border-destructive" : ""}`}>
                            <SelectValue placeholder={t("langPlaceholder")} />
                          </SelectTrigger>
                          <SelectContent className="bg-popover border-border/50">
                            <SelectItem value="English">English</SelectItem>
                            <SelectItem value="Hindi">Hindi (हिंदी)</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.languagePreference && <p className="text-xs text-destructive">{errors.languagePreference}</p>}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: SEGMENT SELECTION */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  variants={slideVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-6"
                >
                  <h2 className="text-lg font-bold flex items-center gap-2 border-b border-border/40 pb-2">
                    <Layers className="h-5 w-5 text-primary" /> {t("selectStage")}
                  </h2>
                  
                  {errors.segment && (
                    <p className="text-xs text-destructive text-center">{errors.segment}</p>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                    {/* S1 Card */}
                    <div
                      onClick={() => handleSegmentSelect("S1")}
                      className={`group relative rounded-xl border p-6 cursor-pointer flex flex-col justify-between min-h-[170px] transition-all duration-300 ${
                        formData.segment === "S1"
                          ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-md"
                          : "border-border/40 bg-background/30 hover:border-primary/45 hover:bg-primary/2 hover:scale-[1.01]"
                      }`}
                    >
                      <div className="space-y-2.5">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                          <GraduationCap className="h-5 w-5" />
                        </div>
                        <h3 className="font-bold text-foreground text-sm">{t("s1Title")}</h3>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {t("s1Desc")}
                        </p>
                      </div>
                    </div>

                    {/* S2 Card */}
                    <div
                      onClick={() => handleSegmentSelect("S2")}
                      className={`group relative rounded-xl border p-6 cursor-pointer flex flex-col justify-between min-h-[170px] transition-all duration-300 ${
                        formData.segment === "S2"
                          ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-md"
                          : "border-border/40 bg-background/30 hover:border-primary/45 hover:bg-primary/2 hover:scale-[1.01]"
                      }`}
                    >
                      <div className="space-y-2.5">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                          <Compass className="h-5 w-5" />
                        </div>
                        <h3 className="font-bold text-foreground text-sm">School (Class 11–12)</h3>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          Map college streams, Indian entrance exams (JEE, NEET, CUET, CLAT), and target degrees.
                        </p>
                      </div>
                    </div>

                    {/* S3 Card */}
                    <div
                      onClick={() => handleSegmentSelect("S3")}
                      className={`group relative rounded-xl border p-6 cursor-pointer flex flex-col justify-between min-h-[170px] transition-all duration-300 ${
                        formData.segment === "S3"
                          ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-md"
                          : "border-border/40 bg-background/30 hover:border-primary/45 hover:bg-primary/2 hover:scale-[1.01]"
                      }`}
                    >
                      <div className="space-y-2.5">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                          <BookOpen className="h-5 w-5" />
                        </div>
                        <h3 className="font-bold text-foreground text-sm">{t("s3Title")}</h3>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          Align placements, specializations, Masters/MBA tracks, GATE/CAT exams, or pivots.
                        </p>
                      </div>
                    </div>

                    {/* S4 Card */}
                    <div
                      onClick={() => handleSegmentSelect("S4")}
                      className={`group relative rounded-xl border p-6 cursor-pointer flex flex-col justify-between min-h-[170px] transition-all duration-300 ${
                        formData.segment === "S4"
                          ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-md"
                          : "border-border/40 bg-background/30 hover:border-primary/45 hover:bg-primary/2 hover:scale-[1.01]"
                      }`}
                    >
                      <div className="space-y-2.5">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                          <Briefcase className="h-5 w-5" />
                        </div>
                        <h3 className="font-bold text-foreground text-sm">Early Professional</h3>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          Validate pivot options, industry changes, MBA pathways, or role switches.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: SEGMENT-SPECIFIC DETAILS */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  variants={slideVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-6"
                >
                  <h2 className="text-lg font-bold flex items-center gap-2 border-b border-border/40 pb-2">
                    <Award className="h-5 w-5 text-primary" /> Segment Details
                  </h2>

                  {/* S1 Form: Class 8-10 */}
                  {formData.segment === "S1" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-2.5">
                        <Label htmlFor="schoolBoard">{t("boardLabel")}</Label>
                        <Select
                          value={formData.schoolBoard}
                          onValueChange={(val) => setFormData({ ...formData, schoolBoard: val || "" })}
                        >
                          <SelectTrigger className={`h-10 ${errors.schoolBoard ? "border-destructive" : ""}`}>
                            <SelectValue placeholder="Select Board" />
                          </SelectTrigger>
                          <SelectContent className="bg-popover">
                            <SelectItem value="CBSE">CBSE</SelectItem>
                            <SelectItem value="ICSE">ICSE</SelectItem>
                            <SelectItem value="State Board">State Board</SelectItem>
                            <SelectItem value="IB/IGCSE">IB / IGCSE</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.schoolBoard && <p className="text-xs text-destructive">{errors.schoolBoard}</p>}
                      </div>

                      <div className="space-y-2.5">
                        <Label htmlFor="grade">Current Grade/Class</Label>
                        <Select
                          value={formData.grade}
                          onValueChange={(val) => setFormData({ ...formData, grade: val || "" })}
                        >
                          <SelectTrigger className={`h-10 ${errors.grade ? "border-destructive" : ""}`}>
                            <SelectValue placeholder={t("gradePlaceholder")} />
                          </SelectTrigger>
                          <SelectContent className="bg-popover">
                            <SelectItem value="Class 8">Class 8</SelectItem>
                            <SelectItem value="Class 9">Class 9</SelectItem>
                            <SelectItem value="Class 10">Class 10</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.grade && <p className="text-xs text-destructive">{errors.grade}</p>}
                      </div>
                    </div>
                  )}

                  {/* S2 Form: Class 11-12 */}
                  {formData.segment === "S2" && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                      <div className="space-y-2.5">
                        <Label htmlFor="schoolBoard">School Board</Label>
                        <Select
                          value={formData.schoolBoard}
                          onValueChange={(val) => setFormData({ ...formData, schoolBoard: val || "" })}
                        >
                          <SelectTrigger className={`h-10 ${errors.schoolBoard ? "border-destructive" : ""}`}>
                            <SelectValue placeholder="Select Board" />
                          </SelectTrigger>
                          <SelectContent className="bg-popover">
                            <SelectItem value="CBSE">CBSE</SelectItem>
                            <SelectItem value="ICSE / ISC">ISC (ICSE)</SelectItem>
                            <SelectItem value="State Board">State Board</SelectItem>
                            <SelectItem value="IB/IGCSE">IB / IGCSE</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.schoolBoard && <p className="text-xs text-destructive">{errors.schoolBoard}</p>}
                      </div>

                      <div className="space-y-2.5">
                        <Label htmlFor="grade">{t("gradeLabel")}</Label>
                        <Select
                          value={formData.grade}
                          onValueChange={(val) => setFormData({ ...formData, grade: val || "" })}
                        >
                          <SelectTrigger className={`h-10 ${errors.grade ? "border-destructive" : ""}`}>
                            <SelectValue placeholder="Select Grade" />
                          </SelectTrigger>
                          <SelectContent className="bg-popover">
                            <SelectItem value="Class 11">Class 11</SelectItem>
                            <SelectItem value="Class 12">Class 12</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.grade && <p className="text-xs text-destructive">{errors.grade}</p>}
                      </div>

                      <div className="space-y-2.5">
                        <Label htmlFor="stream">Academic Stream</Label>
                        <Select
                          value={formData.stream}
                          onValueChange={(val) => setFormData({ ...formData, stream: val || "" })}
                        >
                          <SelectTrigger className={`h-10 ${errors.stream ? "border-destructive" : ""}`}>
                            <SelectValue placeholder={t("streamPlaceholder")} />
                          </SelectTrigger>
                          <SelectContent className="bg-popover">
                            <SelectItem value="Science PCM">Science (PCM - Engineering)</SelectItem>
                            <SelectItem value="Science PCB">Science (PCB - Medical)</SelectItem>
                            <SelectItem value="Commerce">Commerce</SelectItem>
                            <SelectItem value="Humanities">Humanities / Arts</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.stream && <p className="text-xs text-destructive">{errors.stream}</p>}
                      </div>
                    </div>
                  )}

                  {/* S3 Form: College Student */}
                  {formData.segment === "S3" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-2.5 sm:col-span-2">
                        <Label htmlFor="s3-backgroundStream">Broad Academic Background</Label>
                        <Select
                          value={formData.backgroundStream}
                          onValueChange={(val) => setFormData({ ...formData, backgroundStream: val || "" })}
                        >
                          <SelectTrigger className={`h-10 ${errors.backgroundStream ? "border-destructive" : ""}`}>
                            <SelectValue placeholder="Select Broad Domain" />
                          </SelectTrigger>
                          <SelectContent className="bg-popover">
                            <SelectItem value="Science PCM">Science (PCM - Engineering / Tech / Math)</SelectItem>
                            <SelectItem value="Science PCB">Science (PCB - Medical / Bio / Health)</SelectItem>
                            <SelectItem value="Commerce">Commerce / Finance / Business</SelectItem>
                            <SelectItem value="Humanities">Humanities / Arts / Design / Law</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.backgroundStream && <p className="text-xs text-destructive">{errors.backgroundStream}</p>}
                      </div>

                      <div className="space-y-2.5">
                        <Label htmlFor="collegeName">{t("collegeLabel")}</Label>
                        <Input
                          id="collegeName"
                          placeholder="e.g. SRCC, IIT Delhi, DU"
                          value={formData.collegeName}
                          onChange={(e) => setFormData({ ...formData, collegeName: e.target.value })}
                          className={`h-10 ${errors.collegeName ? "border-destructive" : ""}`}
                        />
                        {errors.collegeName && <p className="text-xs text-destructive">{errors.collegeName}</p>}
                      </div>

                      <div className="space-y-2.5">
                        <Label htmlFor="degree">Degree / Course</Label>
                        <Select
                          value={formData.degree}
                          onValueChange={(val) => setFormData({ ...formData, degree: val || "" })}
                        >
                          <SelectTrigger className={`h-10 ${errors.degree ? "border-destructive" : ""}`}>
                            <SelectValue placeholder="Select Degree" />
                          </SelectTrigger>
                          <SelectContent className="bg-popover">
                            <SelectItem value="B.Tech / B.E.">B.Tech / B.E.</SelectItem>
                            <SelectItem value="B.Sc.">B.Sc.</SelectItem>
                            <SelectItem value="B.Com.">B.Com.</SelectItem>
                            <SelectItem value="B.A.">B.A.</SelectItem>
                            <SelectItem value="B.B.A. / B.M.S.">B.B.A. / B.M.S.</SelectItem>
                            <SelectItem value="B.C.A. / B.Sc. CS">B.C.A. / B.Sc. CS</SelectItem>
                            <SelectItem value="Master's (MBA/MTech/MA)">Master&apos;s Degree (MBA, M.Tech, etc.)</SelectItem>
                            <SelectItem value="Other">Other Degree</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.degree && <p className="text-xs text-destructive">{errors.degree}</p>}
                      </div>

                      <div className="space-y-2.5">
                        <Label htmlFor="specialization">Specialization / Major</Label>
                        <Input
                          id="specialization"
                          placeholder="e.g. Computer Science, Finance, English"
                          value={formData.specialization}
                          onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                          className={`h-10 ${errors.specialization ? "border-destructive" : ""}`}
                        />
                        {errors.specialization && <p className="text-xs text-destructive">{errors.specialization}</p>}
                      </div>

                      <div className="space-y-2.5">
                        <Label htmlFor="graduationYear">{t("gradYearLabel")}</Label>
                        <Select
                          value={formData.graduationYear}
                          onValueChange={(val) => setFormData({ ...formData, graduationYear: val || "" })}
                        >
                          <SelectTrigger className={`h-10 ${errors.graduationYear ? "border-destructive" : ""}`}>
                            <SelectValue placeholder={t("gradYearPlaceholder")} />
                          </SelectTrigger>
                          <SelectContent className="bg-popover">
                            <SelectItem value="2026">2026</SelectItem>
                            <SelectItem value="2027">2027</SelectItem>
                            <SelectItem value="2028">2028</SelectItem>
                            <SelectItem value="2029">2029</SelectItem>
                            <SelectItem value="2030+">2030 or later</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.graduationYear && <p className="text-xs text-destructive">{errors.graduationYear}</p>}
                      </div>
                    </div>
                  )}

                  {/* S4 Form: Early Professional */}
                  {formData.segment === "S4" && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                      <div className="space-y-2.5 sm:col-span-3">
                        <Label htmlFor="s4-backgroundStream">Broad Professional Background</Label>
                        <Select
                          value={formData.backgroundStream}
                          onValueChange={(val) => setFormData({ ...formData, backgroundStream: val || "" })}
                        >
                          <SelectTrigger className={`h-10 ${errors.backgroundStream ? "border-destructive" : ""}`}>
                            <SelectValue placeholder="Select Broad Domain" />
                          </SelectTrigger>
                          <SelectContent className="bg-popover">
                            <SelectItem value="Science PCM">Science (PCM - Engineering / Tech / Math)</SelectItem>
                            <SelectItem value="Science PCB">Science (PCB - Medical / Bio / Health)</SelectItem>
                            <SelectItem value="Commerce">Commerce / Finance / Business</SelectItem>
                            <SelectItem value="Humanities">Humanities / Arts / Design / Law</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.backgroundStream && <p className="text-xs text-destructive">{errors.backgroundStream}</p>}
                      </div>

                      <div className="space-y-2.5">
                        <Label htmlFor="jobTitle">Current Job Title / Role</Label>
                        <Input
                          id="jobTitle"
                          placeholder="e.g. Software Engineer, Analyst"
                          value={formData.jobTitle}
                          onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                          className={`h-10 ${errors.jobTitle ? "border-destructive" : ""}`}
                        />
                        {errors.jobTitle && <p className="text-xs text-destructive">{errors.jobTitle}</p>}
                      </div>

                      <div className="space-y-2.5">
                        <Label htmlFor="industry">Industry</Label>
                        <Select
                          value={formData.industry}
                          onValueChange={(val) => setFormData({ ...formData, industry: val || "" })}
                        >
                          <SelectTrigger className={`h-10 ${errors.industry ? "border-destructive" : ""}`}>
                            <SelectValue placeholder={t("industryPlaceholder")} />
                          </SelectTrigger>
                          <SelectContent className="bg-popover">
                            <SelectItem value="IT / Software / Tech">IT, Software & Tech</SelectItem>
                            <SelectItem value="Banking / Finance / Consulting">Banking, Finance & Consulting</SelectItem>
                            <SelectItem value="Education / EdTech">Education & EdTech</SelectItem>
                            <SelectItem value="Healthcare / Biotech">Healthcare & Biotech</SelectItem>
                            <SelectItem value="Marketing / Sales / Ads">Marketing, Sales & Ads</SelectItem>
                            <SelectItem value="Manufacturing / Core Engineering">Manufacturing & Core Eng</SelectItem>
                            <SelectItem value="Other">Other Industry</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.industry && <p className="text-xs text-destructive">{errors.industry}</p>}
                      </div>

                      {formData.industry === "Other" && (
                        <div className="space-y-2.5 sm:col-span-3">
                          <Label htmlFor="otherIndustry">{t("industryOtherLabel")}</Label>
                          <Input
                            id="otherIndustry"
                            placeholder={t("industryOtherPlaceholder")}
                            value={formData.otherIndustry}
                            onChange={(e) => setFormData({ ...formData, otherIndustry: e.target.value })}
                            className={`h-10 ${errors.otherIndustry ? "border-destructive" : ""}`}
                          />
                          {errors.otherIndustry && <p className="text-xs text-destructive">{errors.otherIndustry}</p>}
                        </div>
                      )}

                      <div className="space-y-2.5">
                        <Label htmlFor="yearsOfExperience">{t("expLabel")}</Label>
                        <Select
                          value={formData.yearsOfExperience}
                          onValueChange={(val) => setFormData({ ...formData, yearsOfExperience: val || "" })}
                        >
                          <SelectTrigger className={`h-10 ${errors.yearsOfExperience ? "border-destructive" : ""}`}>
                            <SelectValue placeholder={t("expPlaceholder")} />
                          </SelectTrigger>
                          <SelectContent className="bg-popover">
                            <SelectItem value="Less than 1 Year">Less than 1 Year</SelectItem>
                            <SelectItem value="1 to 3 Years">1 to 3 Years</SelectItem>
                            <SelectItem value="3 to 5 Years">3 to 5 Years</SelectItem>
                            <SelectItem value="More than 5 Years">More than 5 Years</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.yearsOfExperience && <p className="text-xs text-destructive">{errors.yearsOfExperience}</p>}
                      </div>
                    </div>
                  )}

                  {errors.submit && (
                    <p className="text-sm text-destructive text-center mt-2">{errors.submit}</p>
                  )}
                </motion.div>
              )}

              {/* STEP 4: ONBOARDING SUCCESS */}
              {step === 4 && (
                <motion.div
                  key="step4"
                  variants={slideVariants}
                  initial="hidden"
                  animate="visible"
                  className="flex flex-col items-center text-center p-6 space-y-6 animate-in fade-in zoom-in-95 duration-300"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary border border-primary/20">
                    <CheckCircle className="h-10 w-10 animate-bounce" />
                  </div>
                  <div className="space-y-2.5">
                    <h2 className="text-2xl font-bold text-foreground">{t("successTitle")}</h2>
                    <p className="text-sm text-muted-foreground max-w-sm">
                      {t("successDesc")}
                    </p>
                  </div>
                  
                  <div className="w-full max-w-sm rounded-xl border border-border/45 bg-background/40 p-5 text-left space-y-2.5 text-xs">
                    <div className="flex justify-between border-b border-border/30 pb-2 font-semibold text-foreground">
                      <span>{t("profileSummary")}</span>
                      <span className="text-primary font-bold">{formData.segment === "S1" || formData.segment === "S2" ? "School" : formData.segment === "S3" ? "College" : "Professional"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Name:</span>
                      <span className="font-medium text-foreground">{formData.fullName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Location:</span>
                      <span className="font-medium text-foreground">{formData.cityTier}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Language:</span>
                      <span className="font-medium text-foreground">{formData.languagePreference}</span>
                    </div>
                  </div>

                  <Button onClick={handleStartApp} className="w-full max-w-xs font-semibold shadow-sm h-10">
                    {t("enterDashboard")}
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>

          {/* Card Footer Actions */}
          {step < 4 && (
            <div className="flex justify-between items-center px-6 sm:px-8 py-4 border-t border-border/30 bg-background/20">
              <Button
                variant="ghost"
                onClick={handleBack}
                disabled={step === 1 || loading}
                className="font-medium h-10"
              >
                <ChevronLeft className="mr-2 h-4 w-4" /> {t("back")}
              </Button>

              {step < 3 ? (
                <Button onClick={handleNext} className="font-semibold shadow-sm h-10">
                  {t("continue")}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={loading} className="font-semibold shadow-sm h-10">
                  {loading ? t("saving") : t("finishSetup")}
                  {!loading && <CheckCircle className="ml-2 h-4 w-4" />}
                </Button>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
