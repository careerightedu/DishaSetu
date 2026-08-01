# CareeRight — Advanced Career Assessment Platform

CareeRight is a high-precision career assessment platform powered by a hybrid **Mathematical & AI-Based Engine**. It measures candidate psychometric vectors across 40 standardized core traits and maps them against 138 canonical career clusters in India, generating personalized executive PDF reports.

---

## 🛠️ Tech Stack
- **Frontend**: Next.js 14 (App Router), React 18, Tailwind CSS, Lucide Icons, Framer Motion
- **Primary Database & Auth**: Firebase Authentication & Cloud Firestore
- **Secondary Database Mirror**: Supabase (PostgreSQL `profiles` & `assessment_sessions`)
- **AI / LLM Engine**: Google AI Studio (Gemma-4-31B-IT)

---

## 🚀 Getting Started

### 1. Environment Setup
Copy `.env.example` to `.env.local` and fill in your credentials:
```bash
cp .env.example .env.local
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to access the application.

---

## 📦 Deployment & Production Build

To verify and test production build locally:
```bash
npm run build
npm run start
```
