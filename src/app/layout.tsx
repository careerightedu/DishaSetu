import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { AuthContextProvider } from "@/features/auth/context/AuthContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
});

export const metadata: Metadata = {
  title: "CareeRight - Advanced Career Assessment & Intelligence Platform",
  description: "Identify your ideal career stream, colleges, exams, and skill gaps with scientifically grounded, AI-assisted psychometric analysis.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", inter.variable, plusJakartaSans.variable)}>
      <body className="antialiased bg-background text-foreground min-h-screen flex flex-col">
        <AuthContextProvider>
          {children}
        </AuthContextProvider>
      </body>
    </html>
  );
}
