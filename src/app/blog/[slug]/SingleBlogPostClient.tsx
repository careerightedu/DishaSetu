"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  Share2, 
  Check, 
  ArrowRight, 
  Sparkles 
} from "lucide-react";
import Navbar from "@/features/auth/components/Navbar";
import { BlogPost, getBlogPostBySlug } from "@/lib/blogs";

// Types for parsed article content
type ContentSection =
  | { type: "h3"; text: string }
  | { type: "h4"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "p"; text: string };

function renderFormattedInline(text: string): React.ReactNode {
  if (!text) return null;

  // Clean raw quotations like *"..."* or *'...'*:
  const cleanText = text.replace(/\*["'](.*?)["']\*/g, "“$1”");

  // Tokenize by bold **...** and italic *...*
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*.*?\*\*|\*.*?\*)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(cleanText)) !== null) {
    if (match.index > lastIndex) {
      parts.push(cleanText.substring(lastIndex, match.index));
    }
    const token = match[0];
    if (token.startsWith("**") && token.endsWith("**")) {
      const boldContent = token.slice(2, -2).replace(/\*/g, "");
      parts.push(
        <strong key={match.index} className="font-bold text-slate-900 dark:text-white">
          {boldContent}
        </strong>
      );
    } else if (token.startsWith("*") && token.endsWith("*")) {
      const italicContent = token.slice(1, -1).replace(/\*/g, "");
      parts.push(
        <em key={match.index} className="italic text-emerald-700 dark:text-emerald-200/90 font-medium">
          {italicContent}
        </em>
      );
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < cleanText.length) {
    parts.push(cleanText.substring(lastIndex));
  }

  // Remove any remaining stray single or double asterisks in string parts so NO star marks ever appear
  return parts.map((part, i) => {
    if (typeof part === "string") {
      return <React.Fragment key={i}>{part.replace(/\*/g, "")}</React.Fragment>;
    }
    return part;
  });
}

function parseArticleContent(content: string): ContentSection[] {
  const lines = content.split("\n");
  const sections: ContentSection[] = [];
  let currentList: { type: "ul" | "ol"; items: string[] } | null = null;
  let currentParagraphLines: string[] = [];

  const flushParagraph = () => {
    if (currentParagraphLines.length > 0) {
      const text = currentParagraphLines.join(" ").trim();
      if (text) {
        sections.push({ type: "p", text });
      }
      currentParagraphLines = [];
    }
  };

  const flushList = () => {
    if (currentList) {
      sections.push(currentList);
      currentList = null;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    if (!line) {
      flushParagraph();
      flushList();
      continue;
    }

    if (line.startsWith("### ")) {
      flushParagraph();
      flushList();
      sections.push({ type: "h3", text: line.replace(/^###\s+/, "") });
    } else if (line.startsWith("#### ")) {
      flushParagraph();
      flushList();
      sections.push({ type: "h4", text: line.replace(/^####\s+/, "") });
    } else if (line.startsWith("- ") || line.startsWith("* ")) {
      flushParagraph();
      const itemText = line.replace(/^[-*]\s+/, "");
      if (currentList && currentList.type === "ul") {
        currentList.items.push(itemText);
      } else {
        flushList();
        currentList = { type: "ul", items: [itemText] };
      }
    } else if (/^\d+\.\s+/.test(line)) {
      flushParagraph();
      const itemText = line.replace(/^\d+\.\s+/, "");
      if (currentList && currentList.type === "ol") {
        currentList.items.push(itemText);
      } else {
        flushList();
        currentList = { type: "ol", items: [itemText] };
      }
    } else {
      flushList();
      currentParagraphLines.push(line);
    }
  }

  flushParagraph();
  flushList();

  return sections;
}

export default function SingleBlogPostClient({
  initialPost,
  slug,
}: {
  initialPost: BlogPost | null;
  slug: string;
}) {
  const [post, setPost] = useState<BlogPost | null>(initialPost);
  const [loading, setLoading] = useState(!initialPost);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (initialPost) {
      setPost(initialPost);
      setLoading(false);
      return;
    }
    async function loadPost() {
      if (!slug) return;
      try {
        const found = await getBlogPostBySlug(slug);
        setPost(found);
      } catch (err) {
        console.error("Failed to load blog post:", err);
      } finally {
        setLoading(false);
      }
    }
    loadPost();
  }, [slug, initialPost]);

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#061019] text-slate-800 dark:text-[#f4efe6]">
        <Navbar />
        <div className="py-32 text-center">
          <div className="w-8 h-8 border-2 border-emerald-500 dark:border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-slate-500 dark:text-[#8fa1ad]">Loading essay...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#061019] text-slate-800 dark:text-[#f4efe6]">
        <Navbar />
        <div className="max-w-2xl mx-auto px-6 py-32 text-center">
          <h2 className="text-3xl font-serif font-bold text-slate-900 dark:text-white mb-4">Article Not Found</h2>
          <p className="text-sm text-slate-600 dark:text-[#8fa1ad] mb-8">
            The essay you are looking for may have been moved or unpublished.
          </p>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-400 dark:hover:bg-emerald-300 text-white dark:text-black font-bold text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Journal
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#061019] text-slate-800 dark:text-[#f4efe6] font-sans selection:bg-emerald-500/30 selection:text-emerald-900 dark:selection:text-emerald-200">
      <Navbar />

      <main className="max-w-[800px] mx-auto px-6 py-12">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <Link 
            href="/blog" 
            className="inline-flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-[#7c8f9d] hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to All Articles
          </Link>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-700 dark:text-[#a0b0bd] hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 shadow-sm transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Link Copied
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" /> Share Article
              </>
            )}
          </button>
        </div>

        {/* Article Header */}
        <header className="pb-8 border-b border-slate-200 dark:border-white/10 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-semibold uppercase tracking-widest mb-4">
            {post.category}
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-slate-900 dark:text-white mb-6 leading-[1.2]">
            {renderFormattedInline(post.title)}
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-[#95a8b7] leading-relaxed mb-8">
            {renderFormattedInline(post.excerpt)}
          </p>

          <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500 dark:text-[#6e8290] pt-4 border-t border-slate-200 dark:border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold text-xs border border-emerald-200 dark:border-emerald-500/20">
                {post.authorName.charAt(0)}
              </div>
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">{post.authorName}</span>
                {post.authorRole && <span>{post.authorRole}</span>}
              </div>
            </div>
          </div>
        </header>

        {/* Article Body Content */}
        <article className="max-w-none text-slate-700 dark:text-[#cfdbe3] leading-relaxed space-y-6 text-base sm:text-lg">
          {parseArticleContent(post.content).map((section, idx) => {
            if (section.type === "h3") {
              return (
                <h3 key={idx} className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 dark:text-white mt-10 mb-4 pt-6 border-t border-slate-200 dark:border-white/5">
                  {renderFormattedInline(section.text)}
                </h3>
              );
            } else if (section.type === "h4") {
              return (
                <h4 key={idx} className="text-lg sm:text-xl font-serif font-bold text-emerald-700 dark:text-emerald-300 mt-8 mb-3">
                  {renderFormattedInline(section.text)}
                </h4>
              );
            } else if (section.type === "ul") {
              return (
                <ul key={idx} className="space-y-2.5 my-4 pl-5 list-disc marker:text-emerald-600 dark:marker:text-emerald-400">
                  {section.items.map((item, itemIdx) => (
                    <li key={itemIdx} className="text-sm sm:text-base leading-relaxed text-slate-700 dark:text-[#c3d1dc]">
                      {renderFormattedInline(item)}
                    </li>
                  ))}
                </ul>
              );
            } else if (section.type === "ol") {
              return (
                <ol key={idx} className="space-y-3 my-4 pl-5 list-decimal marker:text-emerald-600 dark:marker:text-emerald-400">
                  {section.items.map((item, itemIdx) => (
                    <li key={itemIdx} className="text-sm sm:text-base leading-relaxed text-slate-700 dark:text-[#c3d1dc]">
                      {renderFormattedInline(item)}
                    </li>
                  ))}
                </ol>
              );
            } else if (section.type === "p") {
              return (
                <p key={idx} className="text-sm sm:text-base leading-relaxed text-slate-700 dark:text-[#c3d1dc]">
                  {renderFormattedInline(section.text)}
                </p>
              );
            }
            return null;
          })}
        </article>

        {/* Next Steps CTA Box */}
        <div className="mt-16 p-8 rounded-2xl bg-gradient-to-br from-emerald-50/80 via-white to-emerald-50/30 dark:from-[#0c1a26] dark:to-[#07131e] border border-emerald-200 dark:border-emerald-500/30 text-center shadow-lg dark:shadow-xl">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="text-2xl font-serif font-bold text-slate-900 dark:text-white mb-2">
            Ready to Discover Your Own Direction?
          </h3>
          <p className="text-sm text-slate-600 dark:text-[#95a8b7] max-w-md mx-auto mb-6">
            Take the 80-scenario WhatAfter assessment to receive your personalized 15-page Career Intelligence Dossier.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-400 dark:hover:bg-emerald-300 text-white dark:text-black font-bold text-sm transition-colors shadow-lg shadow-emerald-500/20"
          >
            Take the Assessment (₹999) <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-white/10 bg-white dark:bg-[#040b12] py-8 text-center text-xs text-slate-500 dark:text-[#5e717f]">
        <span>© {new Date().getFullYear()} WhatAfter (Careeright). All rights reserved.</span>
      </footer>

    </div>
  );
}
