"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  PenSquare, 
  Send, 
  Lock, 
  AlertCircle,
  Search,
  ChevronDown,
  ChevronUp,
  Globe,
  Tag,
  Share2
} from "lucide-react";
import Navbar from "@/features/auth/components/Navbar";
import { useAuth } from "@/features/auth/context/AuthContext";
import { saveBlogPost, BlogPost, slugify } from "@/lib/blogs";

export default function WriteBlogPage() {
  const { user } = useAuth();
  const router = useRouter();

  // Basic article fields
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<BlogPost["category"]>("Stream Selection");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [authorRole, setAuthorRole] = useState("");

  // SEO & Social Metadata fields
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [customSlug, setCustomSlug] = useState("");
  const [metaKeywords, setMetaKeywords] = useState("");
  const [ogImage, setOgImage] = useState("");
  const [isSeoExpanded, setIsSeoExpanded] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !title.trim() || 
      !content.trim() || 
      !excerpt.trim() || 
      !authorName.trim() || 
      !authorRole.trim()
    ) {
      setError("Please fill out all required fields: Title, Author Display Name, Author Background, Summary, and Article Content.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const created = await saveBlogPost({
        title: title.trim(),
        excerpt: excerpt.trim(),
        content: content.trim(),
        category,
        authorName: authorName.trim(),
        authorRole: authorRole.trim(),
        customSlug: customSlug.trim() || undefined,
        metaTitle: metaTitle.trim() || undefined,
        metaDescription: metaDescription.trim() || undefined,
        metaKeywords: metaKeywords
          .split(",")
          .map((k) => k.trim())
          .filter(Boolean),
        ogImage: ogImage.trim() || undefined,
        canonicalUrl: customSlug.trim()
          ? `https://whatafter.in/blog/${slugify(customSlug.trim())}`
          : undefined,
      });

      router.push(`/blog/${created.slug}`);
    } catch (err: unknown) {
      console.error("Failed to publish blog post:", err);
      const message = err instanceof Error ? err.message : "Failed to publish article. Please try again.";
      setError(message);
      setIsSubmitting(false);
    }
  };

  // If user is not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-[#061019] text-[#f4efe6] font-sans">
        <Navbar />
        <main className="max-w-md mx-auto px-6 py-28 text-center">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
            <Lock className="w-7 h-7" />
          </div>

          <h2 className="text-3xl font-serif font-bold text-white mb-3">
            Sign In to Publish
          </h2>

          <p className="text-sm text-[#92a4b2] leading-relaxed mb-8">
            Reading articles on WhatAfter is completely open. To publish an essay, guide, or story, please log in with your WhatAfter account.
          </p>

          <div className="flex flex-col gap-3">
            <Link
              href="/login?redirect=/blog/new"
              className="w-full py-3.5 rounded-xl bg-emerald-400 text-black font-bold text-sm hover:bg-emerald-300 transition-colors shadow-lg shadow-emerald-500/20"
            >
              Log In to Continue
            </Link>
            <Link
              href="/signup?redirect=/blog/new"
              className="w-full py-3.5 rounded-xl bg-white/5 text-white font-medium text-sm border border-white/10 hover:bg-white/10 transition-colors"
            >
              Create Free Account
            </Link>
            <Link
              href="/blog"
              className="mt-2 text-xs text-[#708492] hover:text-white transition-colors"
            >
              ← Back to Journal
            </Link>
          </div>
        </main>

        <footer className="border-t border-white/10 bg-[#040b12] py-8 text-center text-xs text-[#5e717f]">
          <span>© {new Date().getFullYear()} WhatAfter (Careeright). All rights reserved.</span>
        </footer>
      </div>
    );
  }

  // Current active preview values for the live Google SERP snippet
  const activeSlug = customSlug.trim()
    ? slugify(customSlug.trim())
    : title.trim()
    ? slugify(title.trim())
    : "your-article-slug";
  const activeDisplayTitle =
    metaTitle.trim() ||
    (title.trim() ? `${title.trim()} | WhatAfter` : "Article Meta Title Preview | WhatAfter");
  const activeDisplayDescription =
    metaDescription.trim() ||
    excerpt.trim() ||
    "Add a meta description or summary excerpt to see how this article snippet will appear when searched on Google, Bing, and social channels.";

  return (
    <div className="min-h-screen bg-[#061019] text-[#f4efe6] font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      <Navbar />

      <main className="max-w-[860px] mx-auto px-6 py-12">
        
        {/* Back Link */}
        <Link 
          href="/blog" 
          className="inline-flex items-center gap-2 text-xs font-medium text-[#7c8f9d] hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Journal
        </Link>

        {/* Page Header */}
        <div className="pb-8 border-b border-white/10 mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-widest mb-3">
            <PenSquare className="w-3.5 h-3.5" />
            Article Studio
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-2">
            Write an Article for WhatAfter
          </h1>
          <p className="text-sm text-[#9cb0be]">
            Contribute essays on stream decisions, college transitions, skill building, or parental guidance.
          </p>
        </div>

        {error && (
          <div className="mb-8 p-4 rounded-xl bg-red-950/40 border border-red-500/40 text-red-200 text-xs flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Blog Form */}
        <form onSubmit={handleSubmit} className="space-y-7">
          
          {/* Title */}
          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#98abb9] mb-2">
              Article Title *
            </label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Why Choosing PCM Wasn't Right for Me, and What I Did Next" 
              className="w-full px-4 py-3.5 rounded-xl bg-[#0b1723] border border-white/10 text-white placeholder-[#506371] text-base sm:text-lg font-serif font-bold focus:border-emerald-500/50 outline-none"
              required
            />
          </div>

          {/* Category & Author Name in 2 columns */}
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#98abb9] mb-2">
                Category *
              </label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value as BlogPost["category"])}
                className="w-full px-4 py-3 rounded-xl bg-[#0b1723] border border-white/10 text-white text-sm focus:border-emerald-500/50 outline-none"
              >
                <option value="Stream Selection">Stream Selection</option>
                <option value="College & Beyond">College &amp; Beyond</option>
                <option value="AI & Career Resilience">AI &amp; Career Resilience</option>
                <option value="Parent & Mentor Guides">Parent &amp; Mentor Guides</option>
                <option value="General">General Education &amp; Careers</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#98abb9] mb-2">
                Author Display Name *
              </label>
              <input 
                type="text" 
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="e.g., Ananya Sharma, Rohit Verma, or Career Researcher" 
                className="w-full px-4 py-3 rounded-xl bg-[#0b1723] border border-white/10 text-white text-sm focus:border-emerald-500/50 outline-none"
                required
              />
            </div>
          </div>

          {/* Author Role */}
          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#98abb9] mb-2">
              Author Background / Bio Tag *
            </label>
            <input 
              type="text" 
              value={authorRole}
              onChange={(e) => setAuthorRole(e.target.value)}
              placeholder="e.g., 2nd Year Engineering Student, Parent, or Career Counsellor" 
              className="w-full px-4 py-3 rounded-xl bg-[#0b1723] border border-white/10 text-white text-sm focus:border-emerald-500/50 outline-none"
              required
            />
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#98abb9] mb-2">
              Summary / Excerpt (1–2 sentences) *
            </label>
            <textarea 
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={2}
              placeholder="A brief overview that hooks readers on the blog list page..." 
              className="w-full px-4 py-3 rounded-xl bg-[#0b1723] border border-white/10 text-white placeholder-[#506371] text-sm focus:border-emerald-500/50 outline-none resize-none"
              required
            />
          </div>

          {/* Article Content */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#98abb9]">
                Article Content *
              </label>
              <span className="text-[11px] text-[#6b7e8d]">
                Tip: Use ### for headings, - for bullet points
              </span>
            </div>
            <textarea 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={14}
              placeholder="Write your article here...&#10;&#10;### Section Heading&#10;Write detailed paragraphs explaining your experiences, decisions, and lessons learned.&#10;&#10;- Bullet point one&#10;- Bullet point two" 
              className="w-full px-4 py-3.5 rounded-xl bg-[#0b1723] border border-white/10 text-white placeholder-[#506371] text-sm leading-relaxed focus:border-emerald-500/50 outline-none font-mono"
              required
            />
          </div>

          {/* ========================================================= */}
          {/* SEO & Social Metadata Configuration Card                   */}
          {/* ========================================================= */}
          <div className="rounded-2xl bg-[#091522] border border-emerald-500/25 p-5 sm:p-7 space-y-6 shadow-xl relative overflow-hidden">
            {/* Ambient subtle glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

            {/* Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Search className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-serif font-bold text-white">
                      Search Engine Optimization (SEO) &amp; Social Meta
                    </h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                      Google &amp; Social
                    </span>
                  </div>
                  <p className="text-xs text-[#8ca0af]">
                    Control how this article appears on Google search results, WhatsApp, LinkedIn, and Twitter/X.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsSeoExpanded(!isSeoExpanded)}
                className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-semibold self-start sm:self-center px-3 py-1.5 rounded-lg bg-white/5 border border-white/10"
              >
                {isSeoExpanded ? (
                  <>Collapse <ChevronUp className="w-3.5 h-3.5" /></>
                ) : (
                  <>Expand SEO Options <ChevronDown className="w-3.5 h-3.5" /></>
                )}
              </button>
            </div>

            {isSeoExpanded && (
              <div className="space-y-6 pt-1">
                {/* Live Google Search Snippet Preview */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#98abb9] flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-emerald-400" />
                      Live Google Search Snippet Preview
                    </label>
                    <span className="text-[11px] text-[#6e8290]">Real-time preview</span>
                  </div>
                  <div className="p-4 rounded-xl bg-[#050c13] border border-white/10 space-y-1.5 font-sans">
                    <div className="flex items-center gap-2 text-xs text-[#9aa0a6]">
                      <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px]">W</div>
                      <span className="truncate">
                        https://whatafter.in › blog › {activeSlug}
                      </span>
                    </div>
                    <div className="text-base sm:text-lg text-[#8ab4f8] font-medium hover:underline cursor-pointer truncate">
                      {activeDisplayTitle}
                    </div>
                    <div className="text-xs sm:text-sm text-[#bdc1c6] line-clamp-2 leading-relaxed">
                      {activeDisplayDescription}
                    </div>
                  </div>
                </div>

                {/* Meta Title Input */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#98abb9]">
                      Meta Title (SEO Title)
                    </label>
                    <span className={`text-[11px] font-mono ${metaTitle.length > 60 ? "text-amber-400" : "text-[#708492]"}`}>
                      {metaTitle.length} / 60 chars {metaTitle.length >= 50 && metaTitle.length <= 60 && "✓ Optimal"}
                    </span>
                  </div>
                  <input 
                    type="text" 
                    value={metaTitle}
                    onChange={(e) => setMetaTitle(e.target.value)}
                    placeholder={title.trim() ? `${title.trim()} | WhatAfter` : "e.g. Science vs Commerce After 10th: Which Stream Fits You? | WhatAfter"} 
                    className="w-full px-4 py-3 rounded-xl bg-[#0b1723] border border-white/10 text-white placeholder-[#506371] text-sm focus:border-emerald-500/50 outline-none"
                  />
                  <span className="block text-[11px] text-[#6b7e8d] mt-1.5">
                    Leave empty to automatically use your article title. Recommended: 50–60 characters for optimal display on search engines.
                  </span>
                </div>

                {/* Meta Description Input */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#98abb9]">
                      Meta Description (Search &amp; Social Snippet)
                    </label>
                    <span className={`text-[11px] font-mono ${metaDescription.length > 160 ? "text-amber-400" : "text-[#708492]"}`}>
                      {metaDescription.length} / 160 chars {metaDescription.length >= 140 && metaDescription.length <= 160 && "✓ Optimal"}
                    </span>
                  </div>
                  <textarea 
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    rows={3}
                    placeholder={excerpt.trim() || "e.g. Compare PCM and Commerce in 2026. Discover how cognitive traits, salary trajectories, and automation risk guide your stream choice."} 
                    className="w-full px-4 py-3 rounded-xl bg-[#0b1723] border border-white/10 text-white placeholder-[#506371] text-sm focus:border-emerald-500/50 outline-none resize-none"
                  />
                  <span className="block text-[11px] text-[#6b7e8d] mt-1.5">
                    Leave empty to automatically use your summary excerpt. Recommended: 140–160 characters.
                  </span>
                </div>

                {/* Custom URL Slug & Social Image in 2 Columns */}
                <div className="grid sm:grid-cols-2 gap-6">
                  {/* Custom Slug */}
                  <div>
                    <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#98abb9] mb-2">
                      Custom URL Slug (Optional)
                    </label>
                    <div className="flex items-center rounded-xl bg-[#0b1723] border border-white/10 px-3.5 focus-within:border-emerald-500/50">
                      <span className="text-xs text-[#5f7484] select-none shrink-0 font-mono">/blog/</span>
                      <input 
                        type="text" 
                        value={customSlug}
                        onChange={(e) => setCustomSlug(e.target.value)}
                        placeholder={title.trim() ? slugify(title.trim()) : "custom-slug"} 
                        className="w-full py-3 pl-1 bg-transparent text-white placeholder-[#506371] text-sm outline-none font-mono"
                      />
                    </div>
                    <span className="block text-[11px] text-[#6b7e8d] mt-1.5">
                      Overrides the auto-generated URL slug.
                    </span>
                  </div>

                  {/* Social OG Image */}
                  <div>
                    <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#98abb9] mb-2 flex items-center gap-1.5">
                      <Share2 className="w-3.5 h-3.5 text-emerald-400" />
                      Social Share Image URL (Optional)
                    </label>
                    <input 
                      type="url" 
                      value={ogImage}
                      onChange={(e) => setOgImage(e.target.value)}
                      placeholder="https://whatafter.in/report/career-deep-dive.png" 
                      className="w-full px-4 py-3 rounded-xl bg-[#0b1723] border border-white/10 text-white placeholder-[#506371] text-sm focus:border-emerald-500/50 outline-none"
                    />
                    <span className="block text-[11px] text-[#6b7e8d] mt-1.5">
                      Image displayed on WhatsApp, LinkedIn, and Twitter/X cards.
                    </span>
                  </div>
                </div>

                {/* Keywords / Tags */}
                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#98abb9] mb-2 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-emerald-400" />
                    Focus Keywords / Meta Tags (Optional)
                  </label>
                  <input 
                    type="text" 
                    value={metaKeywords}
                    onChange={(e) => setMetaKeywords(e.target.value)}
                    placeholder="e.g. stream selection, class 10, PCM vs Commerce, cognitive assessment" 
                    className="w-full px-4 py-3 rounded-xl bg-[#0b1723] border border-white/10 text-white placeholder-[#506371] text-sm focus:border-emerald-500/50 outline-none"
                  />
                  <span className="block text-[11px] text-[#6b7e8d] mt-1.5">
                    Separate keywords with commas. Used in meta keyword tags and internal search.
                  </span>

                  {/* Keywords Badges Preview */}
                  {metaKeywords.trim() && (
                    <div className="flex flex-wrap gap-1.5 mt-2.5">
                      {metaKeywords.split(",").map((tag, idx) => {
                        const clean = tag.trim();
                        if (!clean) return null;
                        return (
                          <span key={idx} className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-xs text-emerald-300 font-mono">
                            #{clean}
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>

              </div>
            )}
          </div>

          {/* Submit Actions */}
          <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-[#708492]">
              Published articles are immediately indexed and visible to all WhatAfter visitors.
            </span>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Link
                href="/blog"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-[#8ba0ae] hover:text-white hover:bg-white/10 transition-colors text-center"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-emerald-400 text-black font-bold text-sm hover:bg-emerald-300 transition-colors disabled:opacity-50 shadow-lg shadow-emerald-500/20"
              >
                {isSubmitting ? (
                  <>Publishing...</>
                ) : (
                  <>
                    <Send className="w-4 h-4" /> Publish Article
                  </>
                )}
              </button>
            </div>
          </div>

        </form>

      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#040b12] py-8 text-center text-xs text-[#5e717f]">
        <span>© {new Date().getFullYear()} WhatAfter (Careeright). All rights reserved.</span>
      </footer>

    </div>
  );
}
