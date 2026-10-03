import { Metadata } from "next";
import { getBlogPostBySlug } from "@/lib/blogs";
import SingleBlogPostClient from "./SingleBlogPostClient";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getBlogPostBySlug(params.slug);
  if (!post) {
    return {
      title: "Article Not Found | WhatAfter Journal",
      description: "The requested career intelligence article could not be found.",
    };
  }

  const title = post.metaTitle || `${post.title} | WhatAfter`;
  const description = post.metaDescription || post.excerpt;
  const canonicalUrl = post.canonicalUrl || `https://whatafter.in/blog/${post.slug}`;
  const ogImage = post.ogImage || "/what_after_logo_white.png";
  const keywords =
    post.metaKeywords && post.metaKeywords.length > 0
      ? post.metaKeywords
      : [post.category, "career guidance", "WhatAfter", "stream selection", "cognitive assessment"];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "WhatAfter Career Intelligence",
      type: "article",
      publishedTime: post.createdAt,
      authors: [post.authorName],
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function SingleBlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getBlogPostBySlug(params.slug);
  return <SingleBlogPostClient initialPost={post} slug={params.slug} />;
}
