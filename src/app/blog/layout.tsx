import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    absolute: "Career Intelligence Journal | WhatAfter",
  },
  description:
    "Explore research-backed essays, decision frameworks, and practical guides on stream selection, degree planning, MBA specializations, and career transitions.",
  keywords: [
    "career intelligence",
    "career advice blog",
    "stream selection guide",
    "degree planning",
    "MBA specializations",
    "career transitions",
    "WhatAfter journal"
  ],
  alternates: {
    canonical: "https://whatafter.in/blog",
  },
  openGraph: {
    title: "Career Intelligence Journal | WhatAfter",
    description:
      "Explore research-backed essays, decision frameworks, and practical guides on stream selection, degree planning, MBA specializations, and career transitions.",
    url: "https://whatafter.in/blog",
    siteName: "WhatAfter",
    locale: "en_IN",
    type: "website",
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
