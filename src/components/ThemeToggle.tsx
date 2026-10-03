"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export default function ThemeToggle({ className, showLabel = false }: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className={cn("h-9 w-9 rounded-lg text-muted-foreground opacity-60", className)}
        aria-label="Toggle theme"
        disabled
      >
        <div className="h-4 w-4 rounded-full border border-current" />
      </Button>
    );
  }

  const currentTheme = theme === "system" ? resolvedTheme : theme;
  const isDark = currentTheme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <Button
      variant="ghost"
      size={showLabel ? "default" : "icon"}
      onClick={toggleTheme}
      className={cn(
        "relative text-foreground hover:bg-muted/70 transition-colors rounded-lg",
        showLabel ? "w-full justify-start gap-2.5 px-3 py-2 h-auto" : "h-9 w-9",
        className
      )}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <div className="relative flex items-center justify-center">
        {isDark ? (
          <Sun className="h-[18px] w-[18px] text-amber-400 transition-transform duration-300 hover:rotate-45" />
        ) : (
          <Moon className="h-[18px] w-[18px] text-slate-700 transition-transform duration-300 hover:-rotate-12" />
        )}
      </div>
      {showLabel && (
        <span className="text-sm font-medium">
          {isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        </span>
      )}
    </Button>
  );
}
