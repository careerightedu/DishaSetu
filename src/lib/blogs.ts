import { collection, getDocs, doc, setDoc, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: "Stream Selection" | "College & Beyond" | "AI & Career Resilience" | "Parent & Mentor Guides" | "General";
  readTime: string;
  authorName: string;
  authorRole?: string;
  createdAt: string; // ISO date string
  coverGradient?: string;
  featured?: boolean;
  // SEO & Social Metadata
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  ogImage?: string;
  canonicalUrl?: string;
}

export const INITIAL_BLOG_POSTS: BlogPost[] = [
  {
    id: "pcm-vs-commerce-2026",
    slug: "pcm-vs-commerce-2026",
    title: "After Class 10: Science (PCM) vs Commerce in the Age of AI",
    excerpt: "Why traditional advice on stream selection often leads to regret, and how mapping cognitive traits de-risks your high school journey.",
    category: "Stream Selection",
    readTime: "5 min read",
    authorName: "Careeright Research Team",
    authorRole: "Cognitive Science & Education",
    createdAt: "2026-09-25T10:00:00Z",
    coverGradient: "from-emerald-900/40 via-[#0b1723] to-[#061019]",
    featured: true,
    metaTitle: "Science (PCM) vs Commerce After Class 10 in the Age of AI | WhatAfter",
    metaDescription: "Why traditional advice on stream selection often leads to regret, and how mapping cognitive traits de-risks your high school journey.",
    metaKeywords: ["stream selection", "Class 10", "PCM vs Commerce", "cognitive assessment", "career guidance"],
    content: `Choosing a stream after Class 10 remains one of the highest-friction decisions in Indian education. For decades, the default formula has been simple: high marks mean Science PCM, average marks mean Commerce, and Humanities is an afterthought.

### The Problem With the Default Formula

In 2026, this formula is actively harmful. The rapid acceleration of generative AI and automation means that memorization-heavy and routine analytical tasks are becoming commoditized. 

When a student chooses Science PCM solely out of habit or social prestige, they frequently encounter two major traps:

1. The Cognitive Clash: A student with high Artistic and Social Impact drives forced into 14 hours of rigid physics and chemistry coaching often burns out before reaching college.
2. The Opportunity Cost: That same student could have excelled in Economics, Behavioral Psychology, or Corporate Law, where their natural communicative and systems-thinking aptitudes would compound faster.

### The Cognitive Solution: What to Measure Instead

Before committing to a stream, ask three objective questions:

- What is your cognitive learning style? Do you learn best through rapid prototyping and practical visual feedback (Build-to-learn), or through abstract proofs and theoretical synthesis?
- What are your primary work value drivers? Do you value Autonomy, Wealth, Balance, or Direct Social Impact?
- What is your resilience to automation? Is the career path you are aiming for protected by human-centric architectural judgment, or is it vulnerable to automated workflows?

Career clarity is not about predicting the next 30 years—it is about choosing the high school stream that keeps your highest-yield doors open.`
  },
  {
    id: "ai-resilience-careers",
    slug: "ai-resilience-careers",
    title: "The AI-Resilience Score: Which Careers Have a Genuine Human Moat?",
    excerpt: "A deep dive into how WhatAfter measures automation vulnerability across technical engineering, design, medicine, and management.",
    category: "AI & Career Resilience",
    readTime: "7 min read",
    authorName: "Sarthak Gupta",
    authorRole: "Product & Engineering",
    createdAt: "2026-09-20T14:30:00Z",
    coverGradient: "from-teal-900/40 via-[#0b1723] to-[#061019]",
    featured: true,
    metaTitle: "The AI-Resilience Score: Which Careers Have a Genuine Human Moat? | WhatAfter",
    metaDescription: "A deep dive into how WhatAfter measures automation vulnerability across technical engineering, design, medicine, and management.",
    metaKeywords: ["AI resilience", "automation safe careers", "future of work", "human moat", "system architecture"],
    content: `Every week, students ask: "Will my chosen career still exist by the time I graduate?"

The honest answer is: the job title will probably exist, but the daily tasks will look radically different. This is why WhatAfter generates an AI-Resilience Score (0–100) for every career match in your report.

### How AI Resilience is Calculated

We do not look at vague industry predictions. Instead, we decompose every career into its fundamental day-to-day tasks and categorize them into two buckets:

#### 1. Low-Moat Tasks (Automated within 1–3 years)

- Boilerplate software code generation and debugging
- Standard financial auditing and reconciliation
- Basic legal document drafting and contract summarization
- Routine image rendering and copy asset production

#### 2. High-Moat Tasks (Human-Centric Longevity)

- High-level System Architecture: Making multi-system trade-offs where no single right answer exists.
- Physical Site & Spatial Judgment: Coordinating real-world infrastructure, civil robotics, or biomedical interventions.
- Stakeholder Empathy & Alignment: Translating ambiguous human problems into actionable technological roadmaps.

### The Verdict for Students

If you are pursuing software engineering, don't just learn syntax—master system architecture and product design. If you are pursuing business or law, pair analytical rigor with negotiation and persuasive communication. The future belongs to those who occupy the intersections.`
  },
  {
    id: "parent-conversations-guide",
    slug: "parent-conversations-guide",
    title: "How to Talk to Your Parents About Non-Traditional Careers",
    excerpt: "Practical scripts and data frameworks to transform anxious dinner-table arguments into constructive family decisions.",
    category: "Parent & Mentor Guides",
    readTime: "4 min read",
    authorName: "Pooja Nair",
    authorRole: "Counselling & Career Strategy",
    createdAt: "2026-09-15T09:15:00Z",
    coverGradient: "from-amber-900/40 via-[#0b1723] to-[#061019]",
    featured: false,
    metaTitle: "How to Talk to Your Parents About Non-Traditional Careers | WhatAfter",
    metaDescription: "Practical scripts and data frameworks to transform anxious dinner-table arguments into constructive family career decisions.",
    metaKeywords: ["parent conversations", "career guidance", "non-traditional careers", "salary trajectories", "student advice"],
    content: `When students tell their parents they want to pursue UI/UX Design, Sports Management, or Sustainable Architecture instead of traditional Medicine or Software Engineering, parental pushback is almost never about control—it is about fear of financial instability.

Parents grew up in an economic era where only three paths offered predictable financial security: Engineering, Medicine, and Government/Banking examinations.

### The 3 Rules for Productive Career Conversations

#### 1. Bring Data, Not Emotions

Never say: "I don't feel like studying engineering."  
Instead, say: "I analyzed entry vs senior salary trajectories in Product Design, and entry roles start at ₹10–18 LPA with senior leads reaching ₹40–60 LPA in high-growth companies. Here is the market demand data."

#### 2. Acknowledge Their Risk Concerns First

Begin the conversation by validating their core concern:  
"I know you want me to be financially independent and secure. That is my top priority as well. That is why I want to show you the 3-year phased plan to reach that milestone."

#### 3. Have a Backup Highway

Present an alternate educational pathway. For example:  
"If my design portfolio does not convert into an internship by Year 2, here is the technical certification bridge I will complete as a safety net."

When parents see that you have thought about risk, salary, and execution deeper than they have, resistance turns into mentorship.`
  }
];

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Fetch all posts: Firestore posts first, then defaults if not already present
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  try {
    const blogsRef = collection(db, "blogs");
    const q = query(blogsRef, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    
    const firestorePosts: BlogPost[] = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as BlogPost));

    // Combine firestore posts with initial posts without duplicating slugs
    const existingSlugs = new Set(firestorePosts.map(p => p.slug));
    const combined = [
      ...firestorePosts,
      ...INITIAL_BLOG_POSTS.filter(p => !existingSlugs.has(p.slug))
    ];

    return combined;
  } catch (err) {
    console.warn("Could not fetch remote blogs, falling back to local dataset:", err);
    return INITIAL_BLOG_POSTS;
  }
}

// Fetch single post by slug
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const allPosts = await getAllBlogPosts();
  return allPosts.find(p => p.slug === slug || p.id === slug) || null;
}

// Save new blog post to Firestore
export async function saveBlogPost(postData: {
  title: string;
  excerpt: string;
  content: string;
  category: BlogPost["category"];
  authorName: string;
  authorRole?: string;
  readTime?: string;
  customSlug?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  ogImage?: string;
  canonicalUrl?: string;
}): Promise<BlogPost> {
  const rawSlug = postData.customSlug?.trim() || postData.title;
  const slug = slugify(rawSlug);
  const now = new Date().toISOString();
  
  // Calculate approximate read time if not provided
  const wordCount = postData.content.trim().split(/\s+/).length;
  const readTime = postData.readTime || `${Math.max(1, Math.ceil(wordCount / 200))} min read`;

  const newPost: BlogPost = {
    id: `post-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    slug,
    title: postData.title,
    excerpt: postData.excerpt,
    content: postData.content,
    category: postData.category,
    readTime,
    authorName: postData.authorName || "Anonymous Contributor",
    authorRole: postData.authorRole || undefined,
    createdAt: now,
    featured: false,
    coverGradient: "from-emerald-950/40 via-[#0b1723] to-[#061019]",
    metaTitle: postData.metaTitle?.trim() || `${postData.title} | WhatAfter`,
    metaDescription: postData.metaDescription?.trim() || postData.excerpt,
    metaKeywords: postData.metaKeywords && postData.metaKeywords.length > 0 ? postData.metaKeywords : undefined,
    ogImage: postData.ogImage?.trim() || undefined,
    canonicalUrl: postData.canonicalUrl?.trim() || undefined,
  };

  try {
    const postRef = doc(db, "blogs", newPost.id);
    await setDoc(postRef, newPost);
  } catch (err) {
    console.error("Error saving blog post to Firestore:", err);
  }

  return newPost;
}
