const fs = require('fs');
const path = require('path');
const { translate } = require('@vitalets/google-translate-api');

const enPath = path.join(__dirname, 'src/messages/en.json');
const hiPath = path.join(__dirname, 'src/messages/hi.json');

const enJson = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const hiJson = JSON.parse(fs.readFileSync(hiPath, 'utf8'));

const newStrings = {
  retrieving: "Retrieving profile diagnostics...",
  noResults: "No Results Available",
  notCompleted: "You have not completed the Career Assessment session yet.",
  startAssessment: "Start Assessment",
  retakeConfirm: "Are you sure you want to discard your current results and start a new assessment? This action cannot be undone.",
  topMatches: "Top Career Matches",
  whyFit: "Why it's a fit",
  growth: "Growth & Impact",
  salary: "Expected Salary",
  viewDetails: "View Details",
  hideDetails: "Hide Details",
  retakeAssessment: "Retake Assessment",
  backDashboard: "Back to Dashboard",
  printReport: "Print Report",
  skillTree: "Your Skill Tree",
  missions: "Your Career Missions",
  achievements: "Achievements",
  locked: "Locked",
  unlocked: "Unlocked",
  inProgress: "In Progress",
  completed: "Completed"
};

async function main() {
  if (!enJson.Results) enJson.Results = {};
  if (!hiJson.Results) hiJson.Results = {};

  for (const [key, value] of Object.entries(newStrings)) {
    enJson.Results[key] = value;
    if (!hiJson.Results[key]) {
      console.log(`Translating: ${value}`);
      try {
        const res = await translate(value, { to: 'hi' });
        hiJson.Results[key] = res.text;
      } catch (e) {
        hiJson.Results[key] = value;
      }
      await new Promise(r => setTimeout(r, 200));
    }
  }

  fs.writeFileSync(enPath, JSON.stringify(enJson, null, 2));
  fs.writeFileSync(hiPath, JSON.stringify(hiJson, null, 2));
  console.log("Results dictionaries updated!");

  // Now patch page.tsx
  const resultsPath = path.join(__dirname, 'src/app/results/page.tsx');
  let content = fs.readFileSync(resultsPath, 'utf8');

  // Add import and hook
  if (!content.includes('useTranslations')) {
    content = content.replace('import { useRouter } from "next/navigation";', 'import { useRouter } from "next/navigation";\nimport { useTranslations } from "@/hooks/useTranslations";');
    content = content.replace('const [resetting, setResetting] = useState(false);', 'const [resetting, setResetting] = useState(false);\n  const t = useTranslations("Results");');
  }

  const replacements = [
    ['Retrieving profile diagnostics...', '{t("retrieving")}'],
    ['No Results Available', '{t("noResults")}'],
    ['You have not completed the Career Assessment session yet.', '{t("notCompleted")}'],
    ['Start Assessment', '{t("startAssessment")}'],
    ['window.confirm("Are you sure you want to discard your current results and start a new assessment? This action cannot be undone.")', 'window.confirm(t("retakeConfirm"))'],
    ['Top Career Matches', '{t("topMatches")}'],
    ['Why it&apos;s a fit', '{t("whyFit")}'],
    ['Growth & Impact', '{t("growth")}'],
    ['Expected Salary', '{t("salary")}'],
    ['<span className="font-semibold text-primary/80">View Details</span>', '<span className="font-semibold text-primary/80">{t("viewDetails")}</span>'],
    ['<span className="font-semibold text-primary/80">Hide Details</span>', '<span className="font-semibold text-primary/80">{t("hideDetails")}</span>'],
    ['Retake Assessment', '{t("retakeAssessment")}'],
    ['Back to Dashboard', '{t("backDashboard")}'],
    ['Print Report', '{t("printReport")}'],
    ['Your Skill Tree', '{t("skillTree")}'],
    ['Your Career Missions', '{t("missions")}'],
    ['Achievements', '{t("achievements")}'],
    ['<span className="text-xs font-semibold text-emerald-500">Unlocked</span>', '<span className="text-xs font-semibold text-emerald-500">{t("unlocked")}</span>'],
    ['<span className="text-xs font-semibold text-muted-foreground">Locked</span>', '<span className="text-xs font-semibold text-muted-foreground">{t("locked")}</span>'],
    ['<span className="text-xs font-bold text-amber-500">In Progress</span>', '<span className="text-xs font-bold text-amber-500">{t("inProgress")}</span>'],
    ['<span className="text-xs font-bold text-emerald-500">Completed</span>', '<span className="text-xs font-bold text-emerald-500">{t("completed")}</span>']
  ];

  for (const [search, replace] of replacements) {
    // Only replace first occurrence if it's JSX text to avoid weird bugs
    content = content.split(search).join(replace);
  }

  fs.writeFileSync(resultsPath, content);
  console.log("results/page.tsx updated");
}

main();
