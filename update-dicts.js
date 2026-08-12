const fs = require('fs');
const path = require('path');
const { translate } = require('@vitalets/google-translate-api');

const enPath = path.join(__dirname, 'src/messages/en.json');
const hiPath = path.join(__dirname, 'src/messages/hi.json');

const enJson = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const hiJson = JSON.parse(fs.readFileSync(hiPath, 'utf8'));

const newStrings = {
  Onboarding: {
    // Header
    profileBuilder: "Profile Builder",
    buildTitle: "Let's build your profile",
    buildDesc: "We personalize your assessment corpus and recommendations based on these details",
    
    // Step 1
    personalInfo: "Personal Information",
    fullNameLabel: "Full Name",
    fullNamePlaceholder: "Enter your full name",
    cityTierLabel: "Where do you live? (City Tier)",
    cityTierPlaceholder: "Select City Tier",
    tier1: "Tier 1 (Metros: Delhi, Mumbai, Bengaluru, etc.)",
    tier2: "Tier 2 (Capitals & Large Cities: Pune, Jaipur, etc.)",
    tier3: "Tier 3 (Smaller Towns / District Headquarters)",
    langLabel: "Preferred Language for Assessment",
    langPlaceholder: "Select Language",
    
    // Step 2
    selectStage: "Select Your Current Stage",
    s1Title: "School (Class 8–10)",
    s1Desc: "Explore stream preferences (Science, Commerce, Humanities) & identify interests.",
    s2Title: "High School (Class 11-12)",
    s2Desc: "Discover optimal degree programs and colleges based on your stream.",
    s3Title: "College Student",
    s3Desc: "Find suitable entry-level career paths, internships, and skill gap analyses.",
    s4Title: "Working Professional",
    s4Desc: "Navigate career transitions, executive education, and growth opportunities.",
    
    // Step 3
    academicDetails: "Academic & Professional Details",
    boardLabel: "School Board",
    boardPlaceholder: "e.g. CBSE, ICSE, State Board",
    gradeLabel: "Current Grade",
    gradePlaceholder: "Select Grade",
    streamLabel: "Stream (Subject Profile)",
    streamPlaceholder: "Select Stream",
    collegeLabel: "College / University Name",
    collegePlaceholder: "e.g. Delhi University, IIT, local college",
    degreeLabel: "Degree Program",
    degreePlaceholder: "e.g. B.Tech, B.A., B.Com",
    majorLabel: "Major / Specialization",
    majorPlaceholder: "e.g. Computer Science, Economics",
    gradYearLabel: "Expected Graduation Year",
    gradYearPlaceholder: "Select Year",
    jobLabel: "Current Job Title",
    jobPlaceholder: "e.g. Software Engineer, Marketing Analyst",
    industryLabel: "Industry Sector",
    industryPlaceholder: "Select Industry",
    industryOtherLabel: "Please specify your industry",
    industryOtherPlaceholder: "e.g. Retail, Real Estate, E-commerce",
    expLabel: "Years of Work Experience",
    expPlaceholder: "Select Experience",
    
    // Step 4
    successTitle: "Profile Completed!",
    successDesc: "Your career assessment is now customized. You will be served tailored questions mapped to your segment.",
    profileSummary: "PROFILE SUMMARY",
    enterDashboard: "Enter Dashboard",
    
    // Actions
    back: "Back",
    continue: "Continue",
    saving: "Saving...",
    finishSetup: "Finish Setup"
  },
  Assessment: {
    title: "Career Assessment",
    timeRemaining: "Time Remaining",
    next: "Next Question",
    submit: "Submit Assessment",
    analyzing: "Analyzing Responses...",
    analyzingDesc: "Please wait while our AI models analyze your psychometric profile and generate your personalized report."
  },
  Results: {
    title: "Your Career Analysis Report",
    print: "Print Report",
    back: "Return to Dashboard",
    topCareers: "Top Career Matches",
    strengths: "Key Strengths",
    recommendations: "Recommendations"
  }
};

async function main() {
  for (const [section, keys] of Object.entries(newStrings)) {
    if (!enJson[section]) enJson[section] = {};
    if (!hiJson[section]) hiJson[section] = {};

    for (const [key, value] of Object.entries(keys)) {
      enJson[section][key] = value;
      
      // Translate to Hindi if not present
      if (!hiJson[section][key]) {
        console.log(`Translating: ${value}`);
        try {
          const res = await translate(value, { to: 'hi' });
          hiJson[section][key] = res.text;
        } catch (e) {
          console.error(`Failed to translate ${value}:`, e.message);
          hiJson[section][key] = value;
        }
        await new Promise(r => setTimeout(r, 200)); // rate limit
      }
    }
  }

  fs.writeFileSync(enPath, JSON.stringify(enJson, null, 2));
  fs.writeFileSync(hiPath, JSON.stringify(hiJson, null, 2));
  console.log("Dictionaries updated successfully!");
}

main();
