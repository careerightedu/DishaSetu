import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { AuthContextProvider } from "@/features/auth/context/AuthContext";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#061019" },
  ],
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://whatafter.in"),
  title: {
    default: "WhatAfter | Career Assessment & Career Guidance",
    template: "%s | WhatAfter",
  },
  description:
    "Explore career options with WhatAfter. Understand your strengths, compare career possibilities and make informed decisions about your education and career.",
  keywords: [
    "Career assessment",
    "Career guidance",
    "Career assessment for students",
    "Career options after Class 10",
    "Career options after Class 12",
    "Choosing a degree",
    "Choosing an MBA specialization",
    "Career change assessment",
    "Career planning",
    "Career aptitude assessment",
  ],
  authors: [{ name: "WhatAfter", url: "https://whatafter.in" }],
  creator: "WhatAfter",
  publisher: "WhatAfter",
  alternates: {
    canonical: "https://whatafter.in",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://whatafter.in",
    siteName: "WhatAfter",
    title: "WhatAfter | Career Assessment & Career Guidance",
    description:
      "Explore career options with WhatAfter. Understand your strengths, compare career possibilities and make informed decisions about your education and career.",
    images: [
      {
        url: "/what_after_logo_blue.png",
        width: 1200,
        height: 630,
        alt: "WhatAfter Career Assessment Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WhatAfter | Career Assessment & Career Guidance",
    description:
      "Explore career options with WhatAfter. Understand your strengths, compare career possibilities and make informed decisions about your education and career.",
    images: ["/what_after_logo_blue.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/what_after_logo_blue.png",
    apple: "/what_after_logo_blue.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Structured Data (JSON-LD) for Organization & WebSite (Strictly zero invented ratings or reviews)
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "WhatAfter",
    url: "https://whatafter.in",
    logo: "https://whatafter.in/what_after_logo_blue.png",
    description:
      "Career assessment and career guidance platform helping students and professionals navigate educational and career transitions.",
    contactPoint: {
      "@type": "ContactPoint",
      email: "careeright.edu@gmail.com",
      contactType: "customer support",
    },
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "WhatAfter",
    url: "https://whatafter.in",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://whatafter.in/blog?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="en" suppressHydrationWarning className={cn("font-sans", inter.variable, playfair.variable)}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="antialiased bg-background text-foreground min-h-[100dvh] flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <AuthContextProvider>
            {children}
          </AuthContextProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
