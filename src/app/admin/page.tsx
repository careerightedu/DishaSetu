"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/features/auth/components/Navbar";
import { useAuth } from "@/features/auth/context/AuthContext";
import { collection, getDocs, getDoc, writeBatch, doc, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import occupationsByFamily from "@/features/assessment/data/occupations_by_family.json";
import { 
  Users, 
  CheckCircle2, 
  Clock, 
  UserMinus, 
  Layers, 
  Search,
  ArrowLeft,
  Shield,
  ShieldAlert,
  ArrowUpDown,
  RefreshCw,
  Compass,
  Ticket,
  Plus,
  Trash2,
  Power
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface AdminCandidate {
  uid: string;
  fullName: string;
  email?: string;
  segment: string;
  cityTier: string;
  languagePreference: string;
  onboardingCompleted: boolean;
  status: "Not Started" | "In Progress" | "Completed";
  progress: string; // e.g. "12 / 75"
  progressPercent: number;
  timeSpentSec: number;
  updatedAt?: string;
}

interface Coupon {
  id: string;
  active: boolean;
  discountPercentage: number;
  createdAt: string;
}

export default function AdminDashboard() {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [candidates, setCandidates] = useState<AdminCandidate[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  
  const [activeTab, setActiveTab] = useState<"candidates" | "coupons">("candidates");

  // Candidates Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [segmentFilter, setSegmentFilter] = useState("all");
  const [sortField, setSortField] = useState<"fullName" | "progressPercent" | "timeSpentSec">("progressPercent");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [seeding, setSeeding] = useState(false);

  // Coupon Generator State
  const [newCouponCode, setNewCouponCode] = useState("");
  const [newCouponDiscount, setNewCouponDiscount] = useState("");
  const [generatingCoupon, setGeneratingCoupon] = useState(false);

  const handleSeedDatabase = async () => {
    if (!window.confirm("Are you sure you want to seed the database? This will overwrite the 'career_families' collection with the 138 career clusters.")) return;
    setSeeding(true);
    try {
      const batch = writeBatch(db);
      const entries = Object.entries(occupationsByFamily);
      entries.forEach(([familyName, occupations]) => {
        const docRef = doc(db, "career_families", familyName);
        batch.set(docRef, {
          family: familyName,
          occupations: occupations,
          updatedAt: new Date().toISOString()
        });
      });
      await batch.commit();
      alert(`Seeded ${entries.length} families and occupations successfully!`);
    } catch (err) {
      console.error("Seeding error:", err);
      alert("Failed to seed database: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setSeeding(false);
    }
  };
  
  const fetchAdminData = async () => {
    setRefreshing(true);
    try {
      const usersSnap = await getDocs(collection(db, "users"));
      const sessionsSnap = await getDocs(collection(db, "assessment_sessions"));
      
      // Map sessions by uid
      interface SessionData {
        status?: string;
        selectedQuestions?: unknown[];
        answers?: Record<string, unknown>;
        timeSpent?: Record<string, number>;
      }
      const sessionsMap: Record<string, SessionData> = {};
      sessionsSnap.forEach((doc) => {
        sessionsMap[doc.id] = doc.data() as SessionData;
      });

      const list: AdminCandidate[] = [];
      usersSnap.forEach((uDoc) => {
        const uData = uDoc.data();
        const uid = uDoc.id;
        const session = sessionsMap[uid];

        let status: "Not Started" | "In Progress" | "Completed" = "Not Started";
        let progress = "0 / 75";
        let progressPercent = 0;
        let timeSpentSec = 0;

        if (session) {
          const totalQs = session.selectedQuestions?.length || 75;
          const answeredCount = Object.keys(session.answers || {}).length;
          
          if (session.status === "completed") {
            status = "Completed";
            progress = `${totalQs} / ${totalQs}`;
            progressPercent = 100;
          } else {
            status = "In Progress";
            progress = `${answeredCount} / ${totalQs}`;
            progressPercent = Math.round((answeredCount / totalQs) * 100);
          }

          // Calculate time spent
          const timeSpentMap = session.timeSpent || {};
          timeSpentSec = Object.values(timeSpentMap).reduce((sum: number, val) => sum + Number(val), 0);
        }

        list.push({
          uid,
          fullName: uData.fullName || "Candidate",
          email: uData.email || "",
          segment: uData.segment || "",
          cityTier: uData.cityTier || "",
          languagePreference: uData.languagePreference || "",
          onboardingCompleted: !!uData.onboardingCompleted,
          status,
          progress,
          progressPercent,
          timeSpentSec,
          updatedAt: uData.updatedAt || ""
        });
      });

      setCandidates(list);

      // Fetch Coupons
      const couponsSnap = await getDocs(collection(db, "coupons"));
      const couponsList: Coupon[] = [];
      couponsSnap.forEach((doc) => {
        couponsList.push({ id: doc.id, ...doc.data() } as Coupon);
      });
      setCoupons(couponsList);

    } catch (err) {
      console.error("Error loading admin datasets:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchAdminData();
    }
  }, [user]);

  // Check role: user must be an admin to access
  const isAdmin = profile?.role === "admin";

  if (loading) {
    return (
      <div className="flex flex-col min-h-[100dvh] bg-background">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-sm font-semibold text-muted-foreground">Gathering candidate databases...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col min-h-[100dvh] bg-background">
        <Navbar />
        <main className="flex-grow flex items-center justify-center p-4">
          <Card className="w-full max-w-sm border-border/40 bg-card/65 backdrop-blur-md shadow-2xl p-6 text-center">
            <CardHeader className="space-y-2">
              <ShieldAlert className="mx-auto h-12 w-12 text-primary" />
              <CardTitle className="text-lg font-bold">Authentication Required</CardTitle>
            </CardHeader>
            <CardFooter className="justify-center pt-2">
              <Link href="/login" className="font-extrabold bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6 rounded-md flex items-center justify-center shadow-md">
                Log In
              </Link>
            </CardFooter>
          </Card>
        </main>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col min-h-[100dvh] bg-background">
        <Navbar />
        <main className="flex-grow flex items-center justify-center p-4">
          <Card className="w-full max-w-md border-border/40 bg-card/65 backdrop-blur-md shadow-2xl p-8 text-center space-y-4">
            <CardHeader className="space-y-2 p-0">
              <ShieldAlert className="mx-auto h-12 w-12 text-amber-500" />
              <CardTitle className="text-xl font-extrabold text-foreground">Access Denied</CardTitle>
              <CardDescription className="text-xs">
                Your account does not possess administrator permissions required to view statistics.
              </CardDescription>
            </CardHeader>

            <CardFooter className="flex justify-center pt-2 p-0">
              <Link href="/" className="text-xs text-muted-foreground hover:text-foreground font-semibold flex items-center gap-1">
                <ArrowLeft className="h-3.5 w-3.5" /> Return to Dashboard
              </Link>
            </CardFooter>
          </Card>
        </main>
      </div>
    );
  }

  // --- STATISTICAL COMPUTATIONS ---
  const totalRegistered = candidates.length;
  const completionsCount = candidates.filter(c => c.status === "Completed").length;
  const inProgressCount = candidates.filter(c => c.status === "In Progress").length;
  const notStartedCount = candidates.filter(c => c.status === "Not Started").length;

  // Onboarding-only drop-offs = registered but not started
  const onboardingDropOffs = notStartedCount;
  // Total drop-offs = onboarding-only + started but abandoned (in-progress)
  const totalDropOffs = onboardingDropOffs + inProgressCount;
  const dropOffRate = totalRegistered > 0 ? Math.round((totalDropOffs / totalRegistered) * 100) : 0;

  // Segments breakdown
  const s1Count = candidates.filter(c => c.segment === "S1").length;
  const s2Count = candidates.filter(c => c.segment === "S2").length;
  const s3Count = candidates.filter(c => c.segment === "S3").length;
  const s4Count = candidates.filter(c => c.segment === "S4").length;

  // Formatting helper for seconds -> MM:SS
  const formatTime = (secs: number) => {
    if (secs === 0) return "0m";
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return remainingSecs > 0 ? `${mins}m ${remainingSecs}s` : `${mins}m`;
  };

  // --- FILTERING & SORTING ---
  const filteredCandidates = candidates.filter(c => {
    const safeName = String(c.fullName || "").toLowerCase();
    const safeUid = String(c.uid || "").toLowerCase();
    const searchLow = searchTerm.toLowerCase().trim();
    
    const matchesSearch = !searchLow || safeName.includes(searchLow) || safeUid.includes(searchLow);
    const matchesStatus = statusFilter === "all" || c.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesSegment = segmentFilter === "all" || c.segment === segmentFilter;

    return matchesSearch && matchesStatus && matchesSegment;
  });

  const sortedCandidates = [...filteredCandidates].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];

    if (typeof aVal === "string") {
      aVal = aVal.toLowerCase();
      bVal = (bVal as string).toLowerCase();
    }

    if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
    if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const toggleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  // --- COUPON ACTIONS ---
  const handleGenerateCoupon = async () => {
    if (!newCouponCode || !newCouponDiscount) return;
    setGeneratingCoupon(true);
    try {
      const code = newCouponCode.toUpperCase().trim();
      const discount = parseInt(newCouponDiscount);
      if (isNaN(discount) || discount <= 0 || discount > 100) {
        alert("Invalid discount percentage");
        setGeneratingCoupon(false);
        return;
      }
      
      const docRef = doc(db, "coupons", code);
      const existing = await getDoc(docRef);
      if (existing.exists()) {
        alert("Coupon code already exists! Choose a different code.");
        setGeneratingCoupon(false);
        return;
      }
      
      const newCoupon = {
        active: true,
        discountPercentage: discount,
        createdAt: new Date().toISOString()
      };
      
      await setDoc(docRef, newCoupon);
      
      setCoupons(prev => [{ id: code, ...newCoupon }, ...prev]);
      setNewCouponCode("");
      setNewCouponDiscount("");
    } catch (err) {
      console.error(err);
      alert("Failed to generate coupon");
    } finally {
      setGeneratingCoupon(false);
    }
  };

  const toggleCouponStatus = async (code: string, currentStatus: boolean) => {
    try {
      const docRef = doc(db, "coupons", code);
      await updateDoc(docRef, { active: !currentStatus });
      setCoupons(prev => prev.map(c => c.id === code ? { ...c, active: !currentStatus } : c));
    } catch(err) {
      console.error("Failed to toggle coupon status", err);
    }
  };

  const deleteCoupon = async (code: string) => {
    if (!window.confirm("Are you sure you want to delete this coupon permanently?")) return;
    try {
      await deleteDoc(doc(db, "coupons", code));
      setCoupons(prev => prev.filter(c => c.id !== code));
    } catch (err) {
      console.error("Failed to delete coupon", err);
    }
  };

  return (
    <div className="flex flex-col min-h-[100dvh] bg-background">
      <Navbar />

      <main className="flex-grow max-w-6xl mx-auto px-4 sm:px-6 py-8 w-full space-y-8">
        
        {/* Page Header */}
        <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/30 pb-5">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
              <Shield className="h-7 w-7 text-primary" /> WhatAfter Admin Panel
            </h1>
            <p className="text-xs text-muted-foreground">
              Internal board for managing candidates and configuration.
            </p>
          </div>
          <div className="flex items-center gap-3 self-start sm:self-center">
            {activeTab === "candidates" && (
              <Button
                onClick={handleSeedDatabase}
                disabled={seeding || refreshing}
                variant="outline"
                className="font-bold border-border/50 bg-background/50 hover:bg-muted flex items-center gap-1.5 h-10 text-xs"
              >
                <RefreshCw className={`h-4 w-4 ${seeding ? 'animate-spin' : ''}`} />
                {seeding ? "Seeding Database..." : "Seed Families & Occupations"}
              </Button>
            )}
            <Button 
              onClick={fetchAdminData} 
              variant="outline"
              disabled={refreshing || seeding}
              className="font-bold border-border/50 bg-background/50 flex items-center gap-1.5 h-10 text-xs"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} /> Refresh Data
            </Button>
          </div>
        </section>

        {/* TAB SWITCHER */}
        <div className="flex gap-6 border-b border-border/20">
          <button 
            className={`pb-3 text-sm font-bold transition-colors ${activeTab === 'candidates' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'}`}
            onClick={() => setActiveTab('candidates')}
          >
            Candidates & Analytics
          </button>
          <button 
            className={`pb-3 text-sm font-bold transition-colors flex items-center gap-1.5 ${activeTab === 'coupons' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'}`}
            onClick={() => setActiveTab('coupons')}
          >
            <Ticket className="h-4 w-4" /> Coupons
          </button>
        </div>

        {/* CANDIDATES TAB */}
        {activeTab === "candidates" && (
          <>
            {/* METRICS GRID */}
            <section className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              <Card className="border-border/40 bg-card/60 backdrop-blur-md shadow-md p-4 flex flex-col justify-between">
                <div className="flex items-center justify-between pb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Registered Users</span>
                  <Users className="h-4 w-4 text-primary" />
                </div>
                <div className="space-y-1">
                  <span className="text-2xl sm:text-3xl font-black text-foreground">{totalRegistered}</span>
                  <span className="block text-[9px] text-muted-foreground font-semibold">Total onboarding completed</span>
                </div>
              </Card>

              <Card className="border-border/40 bg-card/60 backdrop-blur-md shadow-md p-4 flex flex-col justify-between">
                <div className="flex items-center justify-between pb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Completions</span>
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                </div>
                <div className="space-y-1">
                  <span className="text-2xl sm:text-3xl font-black text-foreground">{completionsCount}</span>
                  <span className="block text-[9px] text-muted-foreground font-semibold">
                    {totalRegistered > 0 ? Math.round((completionsCount / totalRegistered) * 100) : 0}% of registered users
                  </span>
                </div>
              </Card>

              <Card className="border-border/40 bg-card/60 backdrop-blur-md shadow-md p-4 flex flex-col justify-between">
                <div className="flex items-center justify-between pb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">In Progress</span>
                  <Clock className="h-4 w-4 text-amber-500" />
                </div>
                <div className="space-y-1">
                  <span className="text-2xl sm:text-3xl font-black text-foreground">{inProgressCount}</span>
                  <span className="block text-[9px] text-muted-foreground font-semibold">Active sessions ongoing</span>
                </div>
              </Card>

              <Card className="border-border/40 bg-card/60 backdrop-blur-md shadow-md p-4 flex flex-col justify-between">
                <div className="flex items-center justify-between pb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Drop-off Rate</span>
                  <UserMinus className="h-4 w-4 text-destructive" />
                </div>
                <div className="space-y-1">
                  <span className="text-2xl sm:text-3xl font-black text-foreground">{dropOffRate}%</span>
                  <span className="block text-[9px] text-muted-foreground font-semibold">{totalDropOffs} dropped candidates</span>
                </div>
              </Card>
            </section>

            {/* DETAILS SECTION */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Funnel & Segment Breakdowns */}
              <div className="lg:col-span-4 flex flex-col gap-6">
                
                {/* Segment Breakdown */}
                <Card className="border-border/40 bg-card/60 backdrop-blur-md shadow-md p-5 space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-wider text-primary border-b border-border/20 pb-1.5 flex items-center gap-1.5">
                    <Layers className="h-4 w-4" /> Onboarding Stage Split
                  </h3>
                  <div className="space-y-3">
                    {[
                      { label: "Class 8-10 (S1)", count: s1Count },
                      { label: "Class 11-12 (S2)", count: s2Count },
                      { label: "College Student (S3)", count: s3Count },
                      { label: "Professional (S4)", count: s4Count }
                    ].map((seg, idx) => {
                      const percent = totalRegistered > 0 ? Math.round((seg.count / totalRegistered) * 100) : 0;
                      return (
                        <div key={idx} className="space-y-1.5">
                          <div className="flex justify-between text-xs font-bold text-foreground">
                            <span>{seg.label}</span>
                            <span>{seg.count} ({percent}%)</span>
                          </div>
                          <div className="h-1.5 w-full rounded-full bg-border/40 overflow-hidden">
                            <div 
                              className="h-full rounded-full bg-primary"
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>

                {/* Drop-off Funnel Analysis */}
                <Card className="border-border/40 bg-card/60 backdrop-blur-md shadow-md p-5 space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-wider text-primary border-b border-border/20 pb-1.5 flex items-center gap-1.5">
                    <Compass className="h-4 w-4" /> Drop-off Funnel Analysis
                  </h3>
                  <div className="space-y-4 text-xs">
                    <div className="flex justify-between border-b border-border/10 pb-2">
                      <span className="text-muted-foreground">1. Onboarding Completed:</span>
                      <span className="font-bold text-foreground">{totalRegistered}</span>
                    </div>
                    <div className="flex justify-between border-b border-border/10 pb-2">
                      <span className="text-muted-foreground">2. Onboarding-Only Drop-off (0 answers):</span>
                      <span className="font-bold text-destructive">{onboardingDropOffs}</span>
                    </div>
                    <div className="flex justify-between border-b border-border/10 pb-2">
                      <span className="text-muted-foreground">3. Active In-Progress (Abandoned):</span>
                      <span className="font-bold text-amber-500">{inProgressCount}</span>
                    </div>
                    <div className="flex justify-between pb-1">
                      <span className="text-muted-foreground">4. Assessment Finalized:</span>
                      <span className="font-bold text-green-500">{completionsCount}</span>
                    </div>
                  </div>
                </Card>

              </div>

              {/* CANDIDATES TABLE GRID */}
              <Card className="lg:col-span-8 border-border/40 bg-card/65 backdrop-blur-md shadow-md overflow-hidden flex flex-col justify-between">
                <CardHeader className="p-5 pb-3">
                  <CardTitle className="text-lg font-bold">Candidates Engagement List</CardTitle>
                </CardHeader>
                <CardContent className="p-0 flex-grow">
                  
                  {/* Filter controls */}
                  <div className="p-4 bg-slate-900/30 border-b border-border/20 flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-grow">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                      <Input 
                        placeholder="Search by name or UID..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 bg-slate-900/50 h-9"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val || "all")}>
                        <SelectTrigger className="w-[120px] h-9 bg-slate-900/50 text-xs">
                          <SelectValue placeholder="All Status" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border-border/50">
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="not started">Not Started</SelectItem>
                          <SelectItem value="in progress">In Progress</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select value={segmentFilter} onValueChange={(val) => setSegmentFilter(val || "all")}>
                        <SelectTrigger className="w-[120px] h-9 bg-slate-900/50 text-xs">
                          <SelectValue placeholder="All Stages" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border-border/50">
                          <SelectItem value="all">All Stages</SelectItem>
                          <SelectItem value="S1">Class 8-10 (S1)</SelectItem>
                          <SelectItem value="S2">Class 11-12 (S2)</SelectItem>
                          <SelectItem value="S3">College (S3)</SelectItem>
                          <SelectItem value="S4">Professional (S4)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left text-xs">
                      <thead className="bg-slate-900/40 border-b border-border/20 text-muted-foreground font-semibold">
                        <tr>
                          <th 
                            onClick={() => toggleSort("fullName")}
                            className="p-3.5 cursor-pointer hover:text-foreground select-none"
                          >
                            <div className="flex items-center gap-1.5">Candidate Name <ArrowUpDown className="h-3 w-3" /></div>
                          </th>
                          <th className="p-3.5">Stage</th>
                          <th 
                            onClick={() => toggleSort("progressPercent")}
                            className="p-3.5 cursor-pointer hover:text-foreground select-none"
                          >
                            <div className="flex items-center gap-1.5">Progress <ArrowUpDown className="h-3 w-3" /></div>
                          </th>
                          <th 
                            onClick={() => toggleSort("timeSpentSec")}
                            className="p-3.5 cursor-pointer hover:text-foreground select-none"
                          >
                            <div className="flex items-center gap-1.5">Time Spent <ArrowUpDown className="h-3 w-3" /></div>
                          </th>
                          <th className="p-3.5">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/10 font-medium">
                        {sortedCandidates.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="text-center p-8 text-muted-foreground">
                              No matching candidate records found.
                            </td>
                          </tr>
                        ) : (
                          sortedCandidates.map((cand) => (
                            <tr key={cand.uid} className="hover:bg-muted/10">
                              <td className="p-3.5 font-bold text-foreground">
                                <div>{cand.fullName}</div>
                                <span className="text-[9px] text-muted-foreground/80 font-mono tracking-tight">{cand.uid.substring(0, 12)}</span>
                              </td>
                              <td className="p-3.5 text-muted-foreground">{cand.segment || "N/A"}</td>
                              <td className="p-3.5">
                                <div className="space-y-1 max-w-[100px]">
                                  <div className="flex justify-between text-[10px]">
                                    <span>{cand.progress}</span>
                                  </div>
                                  <div className="h-1.5 w-full rounded-full bg-border/40 overflow-hidden">
                                    <div 
                                      className={`h-full rounded-full ${cand.status === 'Completed' ? 'bg-green-500' : 'bg-primary'}`}
                                      style={{ width: `${cand.progressPercent}%` }}
                                    />
                                  </div>
                                </div>
                              </td>
                              <td className="p-3.5 text-muted-foreground">{formatTime(cand.timeSpentSec)}</td>
                              <td className="p-3.5">
                                <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                                  cand.status === "Completed"
                                    ? "bg-green-500/10 border-green-500/35 text-green-500"
                                    : cand.status === "In Progress"
                                    ? "bg-amber-500/10 border-amber-500/35 text-amber-500"
                                    : "bg-slate-500/10 border-slate-500/35 text-slate-500"
                                }`}>
                                  {cand.status}
                                </span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                </CardContent>
              </Card>

            </section>
          </>
        )}

        {/* COUPONS TAB */}
        {activeTab === "coupons" && (
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Create Coupon Card */}
            <div className="lg:col-span-4">
              <Card className="border-border/40 bg-card/60 backdrop-blur-md shadow-md sticky top-6">
                <CardHeader className="p-5 pb-3 border-b border-border/20">
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <Plus className="h-5 w-5 text-primary" /> Generate Coupon
                  </CardTitle>
                  <CardDescription>Create a new discount code for users.</CardDescription>
                </CardHeader>
                <CardContent className="p-5 space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold">Coupon Code</Label>
                    <Input 
                      placeholder="e.g. FLAT50" 
                      value={newCouponCode}
                      onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                      className="uppercase bg-slate-900 border-slate-700 text-slate-100 font-mono font-bold tracking-widest placeholder:text-slate-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold">Discount Percentage (%)</Label>
                    <Input 
                      type="number"
                      placeholder="e.g. 100" 
                      min="1" max="100"
                      value={newCouponDiscount}
                      onChange={(e) => setNewCouponDiscount(e.target.value)}
                      className="bg-slate-900 border-slate-700 text-slate-100 font-mono placeholder:text-slate-500"
                    />
                  </div>
                </CardContent>
                <CardFooter className="p-5 pt-0">
                  <Button 
                    className="w-full font-bold shadow-md"
                    onClick={handleGenerateCoupon}
                    disabled={generatingCoupon || !newCouponCode || !newCouponDiscount}
                  >
                    {generatingCoupon ? "Generating..." : "Save Coupon"}
                  </Button>
                </CardFooter>
              </Card>
            </div>

            {/* Coupons List */}
            <div className="lg:col-span-8">
              <Card className="border-border/40 bg-card/65 backdrop-blur-md shadow-md overflow-hidden">
                <CardHeader className="p-5 pb-3">
                  <CardTitle className="text-lg font-bold">Active Coupons</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left text-xs">
                      <thead className="bg-background/40 border-b border-border/20 text-muted-foreground font-semibold">
                        <tr>
                          <th className="p-3.5">Code</th>
                          <th className="p-3.5">Discount</th>
                          <th className="p-3.5">Created At</th>
                          <th className="p-3.5">Status</th>
                          <th className="p-3.5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/10 font-medium">
                        {coupons.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="text-center p-8 text-muted-foreground">
                              No coupons generated yet.
                            </td>
                          </tr>
                        ) : (
                          // Sort coupons by createdAt desc
                          [...coupons].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(coupon => (
                            <tr key={coupon.id} className={`hover:bg-muted/10 transition-colors ${!coupon.active ? 'opacity-50 grayscale' : ''}`}>
                              <td className="p-3.5 font-bold font-mono tracking-widest text-primary text-sm">
                                {coupon.id}
                              </td>
                              <td className="p-3.5">
                                <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                                  {coupon.discountPercentage}% OFF
                                </span>
                              </td>
                              <td className="p-3.5 text-muted-foreground">
                                {new Date(coupon.createdAt).toLocaleDateString()}
                              </td>
                              <td className="p-3.5">
                                {coupon.active ? (
                                  <span className="text-green-500 flex items-center gap-1 font-bold"><CheckCircle2 className="h-3 w-3" /> Active</span>
                                ) : (
                                  <span className="text-muted-foreground flex items-center gap-1 font-bold">Inactive</span>
                                )}
                              </td>
                              <td className="p-3.5">
                                <div className="flex justify-end gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => toggleCouponStatus(coupon.id, coupon.active)}
                                    className="h-7 px-2 text-[10px] gap-1"
                                    title={coupon.active ? "Deactivate" : "Activate"}
                                  >
                                    <Power className="h-3 w-3" />
                                    {coupon.active ? "Disable" : "Enable"}
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => deleteCoupon(coupon.id)}
                                    className="h-7 px-2 text-[10px]"
                                    title="Delete"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>

          </section>
        )}

      </main>
    </div>
  );
}
