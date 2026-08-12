const fs = require('fs');
const path = require('path');

const enPath = path.join(__dirname, 'src/messages/en.json');
const hiPath = path.join(__dirname, 'src/messages/hi.json');

const enJson = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const hiJson = JSON.parse(fs.readFileSync(hiPath, 'utf8'));

const newStringsHi = {
  hello: "नमस्ते",
  explorer: "एक्सप्लोरर",
  welcomeTitle: "आपके CareeRight करियर असेसमेंट डैशबोर्ड में आपका स्वागत है। चलिए आपका रोडमैप बनाते हैं।",
  primaryTask: "प्राथमिक कार्य",
  coreAssessment: "मुख्य करियर मूल्यांकन",
  coreDesc: "वैज्ञानिक रूप से आधारित रुचि, मूल्य, और कार्य प्राथमिकताओं की मैपिंग।",
  timeRequired: "आवश्यक समय",
  time45m: "~ 45 मिनट",
  saveResume: "सहेजें और कभी भी फिर से शुरू करें",
  questionCount: "प्रश्नों की संख्या",
  q80: "80 प्रश्न",
  customizedStage: "आपके स्तर के लिए अनुकूलित",
  methodType: "विधि प्रकार",
  mathAiBased: "गणितीय और एआई आधारित",
  adaptive: "अनुकूली स्कोरिंग तर्क",
  assessmentCompleted: "मूल्यांकन पूरा हुआ",
  assessmentCompletedDesc: "आपने अपनी साइकोमेट्रिक मैपिंग पूरी कर ली है।",
  viewResults: "परिणाम डैशबोर्ड देखें",
  resumeAssessment: "मूल्यांकन फिर से शुरू करें",
  startAssessment: "पूरा मूल्यांकन शुरू करें",
  yourProfile: "आपकी प्रोफ़ाइल",
  editProfile: "प्रोफ़ाइल संपादित करें",
  currentSegment: "वर्तमान सेगमेंट",
  notSelected: "चयनित नहीं है",
  focusAreas: "ध्यान देने वाले क्षेत्र"
};

const newStringsEn = {
  hello: "Hello",
  explorer: "Explorer",
  welcomeTitle: "Welcome to your CareeRight Career assessment dashboard. Let's build your roadmap.",
  primaryTask: "Primary Task",
  coreAssessment: "Core Career Assessment",
  coreDesc: "Scientifically grounded interest, values, and work preferences mapping.",
  timeRequired: "Time Required",
  time45m: "~ 45 Mins",
  saveResume: "Save & resume anytime",
  questionCount: "Question Count",
  q80: "80 Questions",
  customizedStage: "Customized for your stage",
  methodType: "Method Type",
  mathAiBased: "Mathematical & AI Based",
  adaptive: "Adaptive scoring logic",
  assessmentCompleted: "Assessment Completed",
  assessmentCompletedDesc: "You have finished your psychometric mapping.",
  viewResults: "View Results Dashboard",
  resumeAssessment: "Resume Assessment",
  startAssessment: "Start Full Assessment",
  yourProfile: "Your Profile Context",
  editProfile: "Edit Profile",
  currentSegment: "Current Segment",
  notSelected: "Not Selected",
  focusAreas: "Focus Areas"
};

async function main() {
  if (!enJson.Dashboard) enJson.Dashboard = {};
  if (!hiJson.Dashboard) hiJson.Dashboard = {};

  for (const [key, value] of Object.entries(newStringsEn)) {
    enJson.Dashboard[key] = value;
    hiJson.Dashboard[key] = newStringsHi[key];
  }

  if (!enJson.Assessment.saveExit) enJson.Assessment.saveExit = "Save & Exit";
  hiJson.Assessment.saveExit = "सहेजें और बाहर निकलें";
  
  if (!enJson.Assessment.back) enJson.Assessment.back = "Back";
  hiJson.Assessment.back = "पीछे जाएँ";

  fs.writeFileSync(enPath, JSON.stringify(enJson, null, 2));
  fs.writeFileSync(hiPath, JSON.stringify(hiJson, null, 2));
  console.log("Dashboard and Assessment dictionaries updated!");

  // Now patch page.tsx
  const dashboardPath = path.join(__dirname, 'src/app/page.tsx');
  let content = fs.readFileSync(dashboardPath, 'utf8');

  if (!content.includes('useTranslations("Dashboard")')) {
    content = content.replace('import { useAuth } from "@/features/auth/context/AuthContext";', 'import { useAuth } from "@/features/auth/context/AuthContext";\nimport { useTranslations } from "@/hooks/useTranslations";');
    content = content.replace('const [checkingSession, setCheckingSession] = useState(true);', 'const [checkingSession, setCheckingSession] = useState(true);\n  const t = useTranslations("Dashboard");');
  }

  const replacements = [
    ['Hello, <span className="text-primary">{profile?.fullName || user?.displayName || "Explorer"}</span>!', '{t("hello")}, <span className="text-primary">{profile?.fullName || user?.displayName || t("explorer")}</span>!'],
    ['Welcome to your CareeRight Career assessment dashboard. Let&apos;s build your roadmap.', '{t("welcomeTitle")}'],
    ['Primary Task', '{t("primaryTask")}'],
    ['Core Career Assessment', '{t("coreAssessment")}'],
    ['Scientifically grounded interest, values, and work preferences mapping.', '{t("coreDesc")}'],
    ['Time Required', '{t("timeRequired")}'],
    ['~ 45 Mins', '{t("time45m")}'],
    ['Save & resume anytime', '{t("saveResume")}'],
    ['Question Count', '{t("questionCount")}'],
    ['80 Questions', '{t("q80")}'],
    ['Customized for your stage', '{t("customizedStage")}'],
    ['Method Type', '{t("methodType")}'],
    ['Mathematical &amp; AI Based', '{t("mathAiBased")}'],
    ['Adaptive scoring logic', '{t("adaptive")}'],
    ['<h3 className="font-bold text-lg text-foreground">Assessment Completed</h3>', '<h3 className="font-bold text-lg text-foreground">{t("assessmentCompleted")}</h3>'],
    ['<p className="text-sm text-muted-foreground">You have finished your psychometric mapping.</p>', '<p className="text-sm text-muted-foreground">{t("assessmentCompletedDesc")}</p>'],
    ['View Results Dashboard', '{t("viewResults")}'],
    ['Resume Assessment', '{t("resumeAssessment")}'],
    ['Start Full Assessment', '{t("startAssessment")}'],
    ['Your Profile Context', '{t("yourProfile")}'],
    ['Edit Profile', '{t("editProfile")}'],
    ['Current Segment', '{t("currentSegment")}'],
    ['Not Selected', '{t("notSelected")}'],
    ['Focus Areas', '{t("focusAreas")}']
  ];

  for (const [search, replace] of replacements) {
    content = content.split(search).join(replace);
  }

  fs.writeFileSync(dashboardPath, content);
  console.log("src/app/page.tsx updated");
}

main();
