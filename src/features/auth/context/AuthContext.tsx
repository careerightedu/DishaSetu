"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  signInWithPopup, 
  GoogleAuthProvider,
  updateProfile as firebaseUpdateProfile,
  sendEmailVerification,
  User as FirebaseUser
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { syncUserProfileToSupabase } from "@/lib/supabase";

export interface CareeRightUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
}

export interface UserProfile {
  fullName: string;
  segment: "S1" | "S2" | "S3" | "S4" | "";
  cityTier: "Tier 1" | "Tier 2" | "Tier 3" | "";
  languagePreference: "English" | "Hindi" | "";
  onboardingCompleted: boolean;
  role?: string;
  
  // Segment details
  // S1/S2 Details
  schoolBoard?: string;
  grade?: string;
  stream?: string; // S2 only (Science PCM, Science PCB, Commerce, Humanities)
  // S3 Details
  backgroundStream?: string; // Broad domain for strict eligibility checks
  collegeName?: string;
  degree?: string;
  specialization?: string;
  graduationYear?: string;
  
  // S4 Details
  jobTitle?: string;
  industry?: string;
  otherIndustry?: string;
  yearsOfExperience?: string;
  
  updatedAt?: string;
}

interface AuthContextType {
  user: CareeRightUser | null;
  profile: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<CareeRightUser>;
  signup: (email: string, password: string, fullName: string) => Promise<CareeRightUser>;
  loginWithGoogle: () => Promise<CareeRightUser>;
  logout: () => Promise<void>;
  updateProfile: (profileData: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper functions for client-side cookies
function setCookie(name: string, value: string, days = 7) {
  if (typeof window === "undefined") return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`;
}

function deleteCookie(name: string) {
  if (typeof window === "undefined") return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

export function AuthContextProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<CareeRightUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Sync cookies with user and profile states
  const syncCookies = (currentUser: CareeRightUser | null, currentProfile: UserProfile | null) => {
    if (currentUser) {
      setCookie("session", currentUser.uid);
      if (currentProfile?.onboardingCompleted) {
        setCookie("onboarding_completed", "true");
      } else {
        setCookie("onboarding_completed", "false");
      }
    } else {
      deleteCookie("session");
      deleteCookie("onboarding_completed");
    }
  };

  // Helper to map Firebase User to CareeRightUser
  const mapFirebaseUser = (fbUser: FirebaseUser): CareeRightUser => {
    return {
      uid: fbUser.uid,
      email: fbUser.email,
      displayName: fbUser.displayName,
      photoURL: fbUser.photoURL,
      emailVerified: fbUser.emailVerified
    };
  };

  // Initialize and observe auth changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const mappedUser = mapFirebaseUser(firebaseUser);
        setUser(mappedUser);
        try {
          const docRef = doc(db, "users", firebaseUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const currentProfile = docSnap.data() as UserProfile;
            setProfile(currentProfile);
            syncCookies(mappedUser, currentProfile);
          } else {
            setProfile(null);
            syncCookies(mappedUser, null);
          }
        } catch (e) {
          console.error("Error reading profile from Firestore:", e);
          syncCookies(mappedUser, null);
        }
      } else {
        setUser(null);
        setProfile(null);
        syncCookies(null, null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Action methods
  const login = async (email: string, password: string): Promise<CareeRightUser> => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      if (!userCredential.user.emailVerified) {
        await signOut(auth);
        throw new Error("unverified-email");
      }

      const mappedUser = mapFirebaseUser(userCredential.user);
      setUser(mappedUser);
      
      // Fetch profile and sync cookies immediately to prevent race conditions with middleware
      try {
        const docRef = doc(db, "users", mappedUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const currentProfile = docSnap.data() as UserProfile;
          setProfile(currentProfile);
          syncCookies(mappedUser, currentProfile);
        } else {
          setProfile(null);
          syncCookies(mappedUser, null);
        }
      } catch (e) {
        console.error("Error reading profile from Firestore during login:", e);
        syncCookies(mappedUser, null);
      }

      return mappedUser;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const signup = async (email: string, password: string, fullName: string): Promise<CareeRightUser> => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await firebaseUpdateProfile(userCredential.user, { displayName: fullName });
      await sendEmailVerification(userCredential.user);
      
      const mappedUser = mapFirebaseUser(userCredential.user);
      
      // We don't log them in automatically. They must verify their email first.
      await signOut(auth);
      setUser(null);
      setProfile(null);
      
      return mappedUser;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const loginWithGoogle = async (): Promise<CareeRightUser> => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const mappedUser = mapFirebaseUser(result.user);
      setUser(mappedUser);

      // Fetch profile and sync cookies immediately to prevent race conditions with middleware
      try {
        const docRef = doc(db, "users", mappedUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const currentProfile = docSnap.data() as UserProfile;
          setProfile(currentProfile);
          syncCookies(mappedUser, currentProfile);
        } else {
          setProfile(null);
          syncCookies(mappedUser, null);
        }
      } catch (e) {
        console.error("Error reading profile from Firestore during Google Sign In:", e);
        syncCookies(mappedUser, null);
      }

      return mappedUser;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      setUser(null);
      setProfile(null);
      syncCookies(null, null);
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileData: Partial<UserProfile>) => {
    if (!user) throw new Error("No authenticated user found");

    const updatedProfile: UserProfile = {
      ...(profile || {
        fullName: user.displayName || "",
        segment: "",
        cityTier: "",
        languagePreference: "",
        onboardingCompleted: false
      }),
      ...profileData,
      updatedAt: new Date().toISOString()
    };

    const docRef = doc(db, "users", user.uid);
    await setDoc(docRef, updatedProfile, { merge: true });
    setProfile(updatedProfile);
    syncCookies(user, updatedProfile);

    // Secondary database mirror to Supabase
    syncUserProfileToSupabase(user.uid, updatedProfile);
  };

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      loading,
      login,
      signup,
      loginWithGoogle,
      logout,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthContextProvider");
  }
  return context;
}
