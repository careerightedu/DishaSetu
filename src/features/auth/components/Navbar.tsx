"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/features/auth/context/AuthContext";
import { 
  LogOut, 
  User, 
  Menu, 
  X, 
  ChevronDown, 
  LayoutDashboard, 
  ClipboardList 
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuGroup,
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const { user, profile, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Helper to map segment code to readable text
  const getSegmentName = (seg: string) => {
    switch (seg) {
      case "S1": return "School (8-10)";
      case "S2": return "School (11-12)";
      case "S3": return "College Student";
      case "S4": return "Professional";
      default: return "";
    }
  };

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 transition-transform hover:scale-102">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-primary shadow-md shadow-primary/20 p-1.5">
            {/* Logo image cropped from user screenshot */}
            <Image src="/logo_transparent.png" alt="CareeRight Logo" width={24} height={24} className="object-contain" />
          </div>
          <span className="text-xl font-bold tracking-tight">
            Caree<span className="text-primary font-extrabold">Right</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:gap-6">
          {user ? (
            <>
              <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5">
                <LayoutDashboard className="h-4 w-4" /> Dashboard
              </Link>
              <Link href="/assessment" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5">
                <ClipboardList className="h-4 w-4" /> Take Assessment
              </Link>
              
              <div className="h-4 w-px bg-border/80" />

              {/* User Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger className={cn(buttonVariants({ variant: "ghost", size: "default" }), "flex items-center gap-2 h-9 px-3 hover:bg-muted/50 rounded-full border border-border/20")}>
                  <div className="flex h-6.5 w-6.5 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs border border-primary/20">
                    {profile?.fullName ? profile.fullName.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <span className="max-w-[120px] truncate text-sm font-semibold">
                    {profile?.fullName || "User"}
                  </span>
                  <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 mt-1 border-border/50 bg-popover backdrop-blur-sm">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="flex flex-col gap-1 p-3">
                      <span className="font-semibold text-foreground text-sm">{profile?.fullName || "User"}</span>
                      <span className="text-xs text-muted-foreground truncate">{user.email}</span>
                      {profile?.segment && (
                        <span className="mt-1.5 self-start inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary border border-primary/20">
                          {getSegmentName(profile.segment)}
                        </span>
                      )}
                    </DropdownMenuLabel>
                  </DropdownMenuGroup>
                  <DropdownMenuItem className="focus:bg-muted/60 cursor-pointer p-0">
                    <Link href="/profile" className="flex items-center gap-2 w-full px-2.5 py-1.5">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>Edit Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="focus:bg-muted/60 cursor-pointer p-0">
                    <Link href="/admin" className="flex items-center gap-2 w-full px-2.5 py-1.5">
                      <ClipboardList className="h-4 w-4 text-muted-foreground" />
                      <span>Admin Panel</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-border/40" />
                  <DropdownMenuItem className="focus:bg-destructive/10 text-destructive focus:text-destructive cursor-pointer" onClick={() => logout()}>
                    <LogOut className="h-4 w-4" />
                    <span>Log Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className={cn(buttonVariants({ variant: "ghost", size: "default" }), "text-sm font-medium flex items-center")}
              >
                Log In
              </Link>
              <Link
                href="/signup"
                className={cn(buttonVariants({ variant: "default", size: "default" }), "shadow-sm flex items-center")}
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu toggle */}
        <div className="flex md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-foreground hover:bg-muted/50"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border/40 bg-background/95 backdrop-blur-md px-4 pt-2 pb-4 space-y-3 transition-all duration-200">
          {user ? (
            <>
              <div className="px-3 py-2 border-b border-border/30 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary font-bold border border-primary/20">
                  {profile?.fullName ? profile.fullName.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-semibold text-sm text-foreground">{profile?.fullName || "User"}</div>
                  <div className="text-xs text-muted-foreground">{user.email}</div>
                  {profile?.segment && (
                    <span className="mt-1 inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[9px] font-semibold text-primary border border-primary/20">
                      {getSegmentName(profile.segment)}
                    </span>
                  )}
                </div>
              </div>
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50"
              >
                Dashboard
              </Link>
              <Link
                href="/assessment"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50"
              >
                Take Assessment
              </Link>
              <Link
                href="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50"
              >
                Edit Profile
              </Link>
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50"
              >
                Admin Panel
              </Link>
              <Button
                variant="destructive"
                className="w-full justify-start mt-2"
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
              >
                <LogOut className="mr-2 h-4 w-4" /> Log Out
              </Button>
            </>
          ) : (
            <div className="flex flex-col gap-2 pt-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className={cn(buttonVariants({ variant: "outline", size: "default" }), "w-full flex items-center justify-center")}
              >
                Log In
              </Link>
              <Link
                href="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className={cn(buttonVariants({ variant: "default", size: "default" }), "w-full flex items-center justify-center")}
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
