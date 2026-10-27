import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://whatafter.in";

  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/methodology",
          "/blog",
          "/blog/*",
          "/privacy",
        ],
        disallow: [
          "/dashboard",
          "/dashboard/*",
          "/assessment",
          "/assessment/*",
          "/simulation",
          "/simulation/*",
          "/onboarding",
          "/onboarding/*",
          "/profile",
          "/profile/*",
          "/results",
          "/results/*",
          "/report",
          "/report/*",
          "/admin",
          "/admin/*",
          "/api",
          "/api/*",
          "/login",
          "/signup",
          "/forgot-password",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
