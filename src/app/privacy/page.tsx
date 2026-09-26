import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | WhatAfter",
  description: "Privacy Policy for WhatAfter Career Assessment Platform",
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background text-slate-200 py-16 px-6 md:px-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-background to-background -z-10" />
      
      <div className="max-w-3xl mx-auto bg-white/5 border border-white/10 rounded-2xl p-8 md:p-12 backdrop-blur-sm">
        <h1 className="text-3xl font-bold text-white mb-6">Privacy Policy</h1>
        <p className="text-slate-400 mb-8">Last Updated: September 2026</p>

        <section className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-emerald-400 mb-3">1. Introduction</h2>
            <p className="text-slate-300 leading-relaxed">
              Welcome to WhatAfter ("we," "our," or "us"). We are committed to protecting your privacy and ensuring you have a positive experience on our platform. This Privacy Policy explains how we collect, use, and safeguard your information when you use our career assessment website.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-emerald-400 mb-3">2. Data Collected via Google OAuth</h2>
            <p className="text-slate-300 leading-relaxed mb-2">
              If you choose to sign in to WhatAfter using your Google account (Google OAuth), we request and store the following minimum information provided by Google:
            </p>
            <ul className="list-disc list-inside text-slate-300 space-y-1 ml-4">
              <li><strong>Email Address:</strong> Used strictly to uniquely identify your account, save your assessment progress, and communicate important updates.</li>
              <li><strong>Name:</strong> Used to personalize your dashboard and assessment reports.</li>
              <li><strong>Profile Picture:</strong> Used solely to display your avatar in the navigation menu.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-emerald-400 mb-3">3. How We Use Your Data</h2>
            <p className="text-slate-300 leading-relaxed">
              We use the data collected strictly for core application functionality. Your psychometric assessment answers are analyzed to generate personalized career recommendations. <strong>We do not sell, rent, or trade your personal information or Google user data to any third parties under any circumstances.</strong>
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-emerald-400 mb-3">4. Data Security</h2>
            <p className="text-slate-300 leading-relaxed">
              We implement industry-standard security measures, including Google Cloud Firestore security rules and secure authentication tokens, to protect your personal information from unauthorized access, alteration, or destruction.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-emerald-400 mb-3">5. Data Retention & Deletion</h2>
            <p className="text-slate-300 leading-relaxed">
              We retain your data only for as long as your account is active. If you wish to delete your account and all associated assessment data, please contact our support team, and we will permanently erase your records from our servers.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-emerald-400 mb-3">6. Contact Us</h2>
            <p className="text-slate-300 leading-relaxed">
              If you have any questions or concerns regarding this Privacy Policy or how we handle your Google account data, please contact us at: <br/>
              <span className="text-white font-medium">careeright.edu@gmail.com</span>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
