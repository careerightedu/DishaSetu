const fs = require('fs');
const path = require('path');
const { translate } = require('@vitalets/google-translate-api');

const enPath = path.join(__dirname, 'src/messages/en.json');
const hiPath = path.join(__dirname, 'src/messages/hi.json');

const enJson = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const hiJson = JSON.parse(fs.readFileSync(hiPath, 'utf8'));

const newStrings = {
  initializing: "Initializing custom question profile...",
  failedStart: "Failed to start assessment",
  question: "Question",
  of: "of",
  neutral: "Neutral",
  tapOrder: "Tap options in order of your preference:"
};

async function main() {
  if (!enJson.Assessment) enJson.Assessment = {};
  if (!hiJson.Assessment) hiJson.Assessment = {};

  for (const [key, value] of Object.entries(newStrings)) {
    enJson.Assessment[key] = value;
    if (!hiJson.Assessment[key]) {
      console.log(`Translating: ${value}`);
      try {
        const res = await translate(value, { to: 'hi' });
        hiJson.Assessment[key] = res.text;
      } catch (e) {
        hiJson.Assessment[key] = value;
      }
      await new Promise(r => setTimeout(r, 200));
    }
  }

  fs.writeFileSync(enPath, JSON.stringify(enJson, null, 2));
  fs.writeFileSync(hiPath, JSON.stringify(hiJson, null, 2));
  console.log("Assessment dictionaries updated!");

  // Now patch page.tsx
  const assessmentPath = path.join(__dirname, 'src/app/assessment/session/page.tsx');
  let content = fs.readFileSync(assessmentPath, 'utf8');

  // Add import and hook
  if (!content.includes('useTranslations')) {
    content = content.replace('import { useRouter } from "next/navigation";', 'import { useRouter } from "next/navigation";\nimport { useTranslations } from "@/hooks/useTranslations";');
    content = content.replace('const router = useRouter();', 'const router = useRouter();\n  const t = useTranslations("Assessment");');
  }

  const replacements = [
    ['Initializing custom question profile...', '{t("initializing")}'],
    ['Failed to start assessment', '{t("failedStart")}'],
    ['Question {currentIdx + 1}</span> of {questions.length}', '{t("question")} {currentIdx + 1}</span> {t("of")} {questions.length}'],
    ['<span>Neutral</span>', '<span>{t("neutral")}</span>'],
    ['Tap options in order of your preference:', '{t("tapOrder")}'],
    ['Finish Assessment', '{t("submit")}'],
    ['Next Question', '{t("nextQuestion")}']
  ];

  for (const [search, replace] of replacements) {
    content = content.replace(search, replace);
  }

  fs.writeFileSync(assessmentPath, content);
  console.log("assessment/session/page.tsx updated");
}

main();
