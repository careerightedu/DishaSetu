"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  PenSquare, 
  Send, 
  Lock, 
  AlertCircle
} from "lucide-react";
import Navbar from "@/features/auth/components/Navbar";
import { useAuth } from "@/features/auth/context/AuthContext";
import { saveBlogPost, BlogPost } from "@/lib/blogs";

export default function WriteBlogPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<BlogPost["category"]>("Stream Selection");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [authorRole, setAuthorRole] = useState("");
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
        authorRole: authorRole.trim()
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
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#061019] text-[#f4efe6] font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      <Navbar />

      <main className="max-w-[850px] mx-auto px-6 py-12">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-8">
          <Link 
            href="/blog" 
            className="inline-flex items-center gap-2 text-xs font-medium text-[#7c8f9d] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Journal
          </Link>
        </div>

        {/* Page Header */}
        <div className="mb-10 pb-6 border-b border-white/10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-widest mb-3">
            <PenSquare className="w-3.5 h-3.5" />
            Author an Article
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-2">
            Share Your Experience &amp; Insights
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
        <form onSubmit={handleSubmit} className="space-y-6">
          
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

          {/* Category & Read Time */}
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

          {/* Submit Actions */}
          <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-[#708492]">
              Published articles are immediately visible to all WhatAfter visitors.
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
