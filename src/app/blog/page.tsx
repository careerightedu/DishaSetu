"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  BookOpen, 
  PenSquare, 
  Search,
  Lock,
  ChevronRight
} from "lucide-react";
import Navbar from "@/features/auth/components/Navbar";
import { useAuth } from "@/features/auth/context/AuthContext";
import { BlogPost, getAllBlogPosts } from "@/lib/blogs";

export default function BlogListingPage() {
  const { user } = useAuth();
  const router = useRouter();
  
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    async function loadPosts() {
      try {
        const data = await getAllBlogPosts();
        setPosts(data);
      } catch (err) {
        console.error("Failed to load blog posts:", err);
      } finally {
        setLoading(false);
      }
    }
    loadPosts();
  }, []);

  const handleWriteClick = () => {
    if (user) {
      router.push("/blog/new");
    } else {
      setShowLoginModal(true);
    }
  };

  const categories = [
    "All",
    "Stream Selection",
    "College & Beyond",
    "AI & Career Resilience",
    "Parent & Mentor Guides"
  ];

  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    const matchesSearch = 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.authorName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#061019] text-slate-900 dark:text-[#f4efe6] font-sans selection:bg-emerald-500/30 selection:text-emerald-900 dark:selection:text-emerald-200 transition-colors duration-200">
      <Navbar />

      <main className="max-w-[1200px] mx-auto px-6 py-16">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-slate-200 dark:border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold uppercase tracking-widest mb-4">
              <BookOpen className="w-3.5 h-3.5" />
              WhatAfter Journal
            </div>
            <h1 className="text-4xl sm:text-5xl font-serif font-bold text-slate-950 dark:text-white mb-3">
              Insights, Frameworks &amp; Perspectives
            </h1>
            <p className="text-slate-600 dark:text-[#aab7c0] text-base max-w-2xl leading-relaxed">
              In-depth essays on stream selection, cognitive alignment, and navigating modern career transitions in the age of AI.
            </p>
          </div>

          {/* Write a Blog Button */}
          <div className="shrink-0">
            <button
              onClick={handleWriteClick}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-emerald-400 text-[#03110f] font-bold text-sm hover:bg-emerald-300 transition-all shadow-[0_0_25px_rgba(16,185,129,0.25)] hover:shadow-[0_0_35px_rgba(16,185,129,0.35)] transform hover:-translate-y-0.5"
            >
              <PenSquare className="w-4 h-4" />
              Write an Article
            </button>
            <span className="block text-[11px] text-slate-500 dark:text-[#697b88] mt-2 text-center md:text-right">
              {user ? "Logged in as contributor" : "Login required to publish"}
            </span>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="mt-8 mb-12 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === cat 
                    ? "bg-white dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-slate-200 dark:border-emerald-500/40 shadow-sm" 
                    : "bg-white dark:bg-[#0b1723] text-slate-600 dark:text-[#8ea0ad] border border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10 hover:text-slate-900 dark:hover:text-white shadow-sm"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#687b89]" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search essays & topics..."
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-white dark:bg-[#0b1723] border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-[#5c707f] outline-none focus:border-emerald-500/50 shadow-sm"
            />
          </div>
        </div>

        {/* Blog Posts Grid */}
        {loading ? (
          <div className="py-24 text-center">
            <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm text-slate-500 dark:text-[#8fa1ad]">Loading articles...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-white dark:bg-[#0b1723] border border-slate-200 dark:border-white/5 my-8 shadow-sm">
            <BookOpen className="w-10 h-10 text-slate-400 dark:text-[#607482] mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">No articles found</h3>
            <p className="text-xs text-slate-500 dark:text-[#8da0ad]">Try adjusting your search query or category filter.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <Link 
                key={post.id} 
                href={`/blog/${post.slug}`}
                className="group flex flex-col justify-between p-6 rounded-2xl bg-white dark:bg-[#0b1723] border border-slate-200/80 dark:border-white/5 hover:border-emerald-500/30 transition-all hover:shadow-xl dark:hover:shadow-emerald-950/20 transform hover:-translate-y-1 shadow-sm"
              >
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                      {post.category}
                    </span>
                  </div>

                  <h3 className="text-xl font-serif font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition-colors mb-3 leading-snug">
                    {post.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-[#95a5b2] leading-relaxed mb-6 line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs text-slate-500 dark:text-[#718593]">
                  <div>
                    <span className="font-semibold text-slate-900 dark:text-[#ccd8e0] block">{post.authorName}</span>
                    {post.authorRole && (
                      <span className="text-[10px] text-slate-400 dark:text-[#5d7180]">{post.authorRole}</span>
                    )}
                  </div>
                  <span className="inline-flex items-center text-emerald-600 dark:text-emerald-400 font-bold group-hover:translate-x-1 transition-transform">
                    Read <ChevronRight className="w-4 h-4 ml-0.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

      </main>

      {/* Login Required Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 dark:bg-black/80 backdrop-blur-sm">
          <div className="max-w-md w-full p-8 rounded-2xl bg-white dark:bg-[#0b1723] border border-slate-200 dark:border-emerald-500/30 shadow-2xl relative">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-5">
              <Lock className="w-6 h-6" />
            </div>

            <h3 className="text-2xl font-serif font-bold text-slate-900 dark:text-white mb-2">
              Login to Write a Blog
            </h3>
            
            <p className="text-sm text-slate-600 dark:text-[#97a9b7] leading-relaxed mb-6">
              Anyone can read WhatAfter articles freely. To author and publish an article, please sign in to your WhatAfter account.
            </p>

            <div className="flex flex-col gap-3">
              <Link
                href="/login?redirect=/blog/new"
                className="w-full py-3 text-center rounded-xl bg-emerald-400 text-black font-bold text-sm hover:bg-emerald-300 transition-colors shadow-md shadow-emerald-500/20"
              >
                Log In to Continue
              </Link>
              <Link
                href="/signup?redirect=/blog/new"
                className="w-full py-3 text-center rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-800 dark:text-white font-medium text-sm border border-slate-200 dark:border-white/10 transition-colors"
              >
                Create an Account
              </Link>
              <button
                onClick={() => setShowLoginModal(false)}
                className="mt-2 text-xs text-slate-500 dark:text-[#6e818f] hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Cancel and Return to Reading
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-[#040b12] py-8 text-center text-xs text-slate-500 dark:text-[#5e717f] transition-colors duration-200">
        <span>© {new Date().getFullYear()} WhatAfter (Careeright). All rights reserved.</span>
      </footer>

    </div>
  );
}
