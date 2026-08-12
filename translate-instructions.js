const fs = require('fs');
const path = require('path');

const enPath = path.join(__dirname, 'src/messages/en.json');
const hiPath = path.join(__dirname, 'src/messages/hi.json');

const enJson = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const hiJson = JSON.parse(fs.readFileSync(hiPath, 'utf8'));

// Strings for Dashboard
const dashboardHi = {
  instructionsTitle: "शुरू करने से पहले निर्देश:",
  instruction1: "ईमानदारी से जवाब दें, उस आधार पर नहीं जो दूसरे आपसे उम्मीद करते हैं।",
  instruction2: "कोई 'सही' या 'गलत' उत्तर नहीं हैं।",
  instruction3: "70 प्रश्न स्वभाव पर आधारित हैं और 10 संदर्भात्मक हैं।"
};

const dashboardEn = {
  instructionsTitle: "Instructions before you begin:",
  instruction1: "Answer honestly based on your preferences, not what others expect.",
  instruction2: "There are no \"right\" or \"wrong\" answers.",
  instruction3: "70 are trait based questions and 10 are contextual."
};

// Strings for Assessment Guidelines
const assessmentHi = {
  guidelinesTitle: "महत्वपूर्ण दिशानिर्देश",
  guideline1Title: "अपना समय लें:",
  guideline1Desc: "जल्दबाजी न करें। पूरा करने में औसतन ~45 मिनट लगते हैं, लेकिन आपके लिए कोई समय सीमा नहीं है।",
  guideline2Title: "सहजता से उत्तर दें:",
  guideline2Desc: "कोई सही या गलत उत्तर नहीं हैं। ऐसे विकल्प चुनें जो वास्तव में आपका प्रतिनिधित्व करते हों, न कि वह जो आपको लगता है कि आपको उत्तर देना 'चाहिए'।",
  guideline3Title: "मूल्यांकन संरचना:",
  guideline3Desc: "70 प्रश्न स्वभाव पर आधारित हैं और 10 संदर्भात्मक हैं।"
};

const assessmentEn = {
  guidelinesTitle: "Important Guidelines",
  guideline1Title: "Take your time:",
  guideline1Desc: "Do not rush. Average completion is ~45 minutes, but you have no time limits.",
  guideline2Title: "Answer instinctively:",
  guideline2Desc: "There are no right or wrong answers. Choose options that genuinely represent you, not how you think you \"should\" answer.",
  guideline3Title: "Assessment Structure:",
  guideline3Desc: "70 are trait based questions and 10 are contextual."
};

async function main() {
  if (!enJson.Dashboard) enJson.Dashboard = {};
  if (!hiJson.Dashboard) hiJson.Dashboard = {};
  if (!enJson.Assessment) enJson.Assessment = {};
  if (!hiJson.Assessment) hiJson.Assessment = {};

  for (const [key, value] of Object.entries(dashboardEn)) {
    enJson.Dashboard[key] = value;
    hiJson.Dashboard[key] = dashboardHi[key];
  }

  for (const [key, value] of Object.entries(assessmentEn)) {
    enJson.Assessment[key] = value;
    hiJson.Assessment[key] = assessmentHi[key];
  }

  fs.writeFileSync(enPath, JSON.stringify(enJson, null, 2));
  fs.writeFileSync(hiPath, JSON.stringify(hiJson, null, 2));
  console.log("Dictionaries updated!");

  // Now patch page.tsx
  const dashboardPath = path.join(__dirname, 'src/app/page.tsx');
  let content = fs.readFileSync(dashboardPath, 'utf8');

  const replacementsDashboard = [
    ['Instructions before you begin:', '{t("instructionsTitle")}'],
    ['Answer honestly based on your preferences, not what others expect.', '{t("instruction1")}'],
    ['There are no &quot;right&quot; or &quot;wrong&quot; answers.', '{t("instruction2")}'],
    ['70 are trait based questions and 10 are contextual.', '{t("instruction3")}']
  ];

  for (const [search, replace] of replacementsDashboard) {
    content = content.split(search).join(replace);
  }

  fs.writeFileSync(dashboardPath, content);
  console.log("src/app/page.tsx updated");

  // Now patch assessment page
  const assessmentPath = path.join(__dirname, 'src/app/assessment/page.tsx');
  let contentAssessment = fs.readFileSync(assessmentPath, 'utf8');

  // ensure useTranslations is there
  if (!contentAssessment.includes('useTranslations')) {
    contentAssessment = contentAssessment.replace('import { useAuth } from "@/features/auth/context/AuthContext";', 'import { useAuth } from "@/features/auth/context/AuthContext";\nimport { useTranslations } from "@/hooks/useTranslations";');
    contentAssessment = contentAssessment.replace('const [sessionExists, setSessionExists] = useState(false);', 'const [sessionExists, setSessionExists] = useState(false);\n  const t = useTranslations("Assessment");');
  }

  const replacementsAssessment = [
    ['Important Guidelines', '{t("guidelinesTitle")}'],
    ['Take your time:', '{t("guideline1Title")}'],
    ['Do not rush. Average completion is ~45 minutes, but you have no time limits.', '{t("guideline1Desc")}'],
    ['Answer instinctively:', '{t("guideline2Title")}'],
    ['There are no right or wrong answers. Choose options that genuinely represent you, not how you think you &quot;should&quot; answer.', '{t("guideline2Desc")}'],
    ['Assessment Structure:', '{t("guideline3Title")}'],
    ['70 are trait based questions and 10 are contextual.', '{t("guideline3Desc")}']
  ];

  for (const [search, replace] of replacementsAssessment) {
    contentAssessment = contentAssessment.split(search).join(replace);
  }

  fs.writeFileSync(assessmentPath, contentAssessment);
  console.log("src/app/assessment/page.tsx updated");
}

main();
