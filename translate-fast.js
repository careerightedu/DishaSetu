const fs = require('fs');
const path = require('path');
const { translate } = require('@vitalets/google-translate-api');

const questions = JSON.parse(fs.readFileSync(path.join(__dirname, 'src/features/assessment/data/questions.json'), 'utf8'));

// Utility to preserve prefixes like "A)", "1="
function splitPrefix(text) {
  const match = text.match(/^([A-D]\)|[1-5]=)\s*(.*)/);
  if (match) {
    return { prefix: match[1] + ' ', rest: match[2] };
  }
  return { prefix: '', rest: text };
}

async function translateText(text) {
  try {
    const res = await translate(text, { to: 'hi' });
    return res.text;
  } catch (e) {
    console.error("Translation error:", e.message);
    return text; // fallback
  }
}

async function main() {
  const translatedQuestions = [];
  
  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    console.log(`Translating question ${i + 1}/${questions.length}`);
    
    let translatedText = await translateText(q.text);
    
    let translatedOptions = [];
    for (let opt of q.options) {
      const { prefix, rest } = splitPrefix(opt);
      const translatedOptText = await translateText(rest);
      translatedOptions.push(prefix + translatedOptText);
    }
    
    translatedQuestions.push({
      ...q,
      text: translatedText,
      options: translatedOptions
    });
    
    // throttle slightly
    await new Promise(r => setTimeout(r, 200));
  }
  
  fs.writeFileSync(path.join(__dirname, 'src/features/assessment/data/questions_hi.json'), JSON.stringify(translatedQuestions, null, 2));
  console.log("Translation complete!");
}

main();
