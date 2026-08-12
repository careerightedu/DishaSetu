const fs = require('fs');
const path = require('path');

const onboardingPath = path.join(__dirname, 'src/app/onboarding/page.tsx');
let content = fs.readFileSync(onboardingPath, 'utf8');

// Add import
if (!content.includes('useTranslations')) {
  content = content.replace('import { useRouter } from "next/navigation";', 'import { useRouter } from "next/navigation";\nimport { useTranslations } from "@/hooks/useTranslations";');
}

// Add hook
if (!content.includes('const t = useTranslations("Onboarding");')) {
  content = content.replace('const router = useRouter();', 'const router = useRouter();\n  const t = useTranslations("Onboarding");');
}

const replacements = [
  // Header
  ['<Compass className="h-4 w-4" /> Profile Builder', '<Compass className="h-4 w-4" /> {t("profileBuilder")}'],
  ['Let&apos;s build your profile', '{t("buildTitle")}'],
  ['We personalize your assessment corpus and recommendations based on these details', '{t("buildDesc")}'],
  
  // Step 1
  ['Personal Information', '{t("personalInfo")}'],
  ['<Label htmlFor="fullName">Full Name</Label>', '<Label htmlFor="fullName">{t("fullNameLabel")}</Label>'],
  ['placeholder="Enter your full name"', 'placeholder={t("fullNamePlaceholder")}'],
  ['<Label htmlFor="cityTier">Where do you live? (City Tier)</Label>', '<Label htmlFor="cityTier">{t("cityTierLabel")}</Label>'],
  ['placeholder="Select City Tier"', 'placeholder={t("cityTierPlaceholder")}'],
  ['Tier 1 (Metros: Delhi, Mumbai, Bengaluru, etc.)', '{t("tier1")}'],
  ['Tier 2 (Capitals & Large Cities: Pune, Jaipur, etc.)', '{t("tier2")}'],
  ['Tier 3 (Smaller Towns / District Headquarters)', '{t("tier3")}'],
  ['<Label htmlFor="languagePreference">Preferred Language for Assessment</Label>', '<Label htmlFor="languagePreference">{t("langLabel")}</Label>'],
  ['placeholder="Select Language"', 'placeholder={t("langPlaceholder")}'],
  
  // Step 2
  ['Select Your Current Stage', '{t("selectStage")}'],
  ['School (Class 8–10)', '{t("s1Title")}'],
  ['Explore stream preferences (Science, Commerce, Humanities) & identify interests.', '{t("s1Desc")}'],
  ['High School (Class 11-12)', '{t("s2Title")}'],
  ['Discover optimal degree programs and colleges based on your stream.', '{t("s2Desc")}'],
  ['College Student', '{t("s3Title")}'],
  ['Find suitable entry-level career paths, internships, and skill gap analyses.', '{t("s3Desc")}'],
  ['Working Professional', '{t("s4Title")}'],
  ['Navigate career transitions, executive education, and growth opportunities.', '{t("s4Desc")}'],
  
  // Step 3
  ['Academic & Professional Details', '{t("academicDetails")}'],
  ['<Label htmlFor="schoolBoard">School Board</Label>', '<Label htmlFor="schoolBoard">{t("boardLabel")}</Label>'],
  ['placeholder="e.g. CBSE, ICSE, State Board"', 'placeholder={t("boardPlaceholder")}'],
  ['<Label htmlFor="grade">Current Grade</Label>', '<Label htmlFor="grade">{t("gradeLabel")}</Label>'],
  ['placeholder="Select Grade"', 'placeholder={t("gradePlaceholder")}'],
  ['<Label htmlFor="stream">Stream (Subject Profile)</Label>', '<Label htmlFor="stream">{t("streamLabel")}</Label>'],
  ['placeholder="Select Stream"', 'placeholder={t("streamPlaceholder")}'],
  ['<Label htmlFor="collegeName">College / University Name</Label>', '<Label htmlFor="collegeName">{t("collegeLabel")}</Label>'],
  ['placeholder="e.g. Delhi University, IIT, local college"', 'placeholder={t("collegePlaceholder")}'],
  ['<Label htmlFor="degree">Degree Program</Label>', '<Label htmlFor="degree">{t("degreeLabel")}</Label>'],
  ['placeholder="e.g. B.Tech, B.A., B.Com"', 'placeholder={t("degreePlaceholder")}'],
  ['<Label htmlFor="specialization">Major / Specialization</Label>', '<Label htmlFor="specialization">{t("majorLabel")}</Label>'],
  ['placeholder="e.g. Computer Science, Economics"', 'placeholder={t("majorPlaceholder")}'],
  ['<Label htmlFor="graduationYear">Expected Graduation Year</Label>', '<Label htmlFor="graduationYear">{t("gradYearLabel")}</Label>'],
  ['placeholder="Select Year"', 'placeholder={t("gradYearPlaceholder")}'],
  ['<Label htmlFor="jobTitle">Current Job Title</Label>', '<Label htmlFor="jobTitle">{t("jobLabel")}</Label>'],
  ['placeholder="e.g. Software Engineer, Marketing Analyst"', 'placeholder={t("jobPlaceholder")}'],
  ['<Label htmlFor="industry">Industry Sector</Label>', '<Label htmlFor="industry">{t("industryLabel")}</Label>'],
  ['placeholder="Select Industry"', 'placeholder={t("industryPlaceholder")}'],
  ['<Label htmlFor="otherIndustry">Please specify your industry</Label>', '<Label htmlFor="otherIndustry">{t("industryOtherLabel")}</Label>'],
  ['placeholder="e.g. Retail, Real Estate, E-commerce"', 'placeholder={t("industryOtherPlaceholder")}'],
  ['<Label htmlFor="yearsOfExperience">Years of Work Experience</Label>', '<Label htmlFor="yearsOfExperience">{t("expLabel")}</Label>'],
  ['placeholder="Select Experience"', 'placeholder={t("expPlaceholder")}'],
  
  // Step 4
  ['Profile Completed!', '{t("successTitle")}'],
  ['Your career assessment is now customized. You will be served 80 tailored questions mapped to your segment.', '{t("successDesc")}'],
  ['PROFILE SUMMARY', '{t("profileSummary")}'],
  ['Enter Dashboard', '{t("enterDashboard")}'],
  
  // Buttons
  ['Back\n              </Button>', '{t("back")}\n              </Button>'],
  ['Continue\n                  <ChevronRight', '{t("continue")}\n                  <ChevronRight'],
  ['"Saving..." : "Finish Setup"', 't("saving") : t("finishSetup")']
];

for (const [search, replace] of replacements) {
  content = content.replace(search, replace);
}

fs.writeFileSync(onboardingPath, content);
console.log("onboarding/page.tsx updated");
