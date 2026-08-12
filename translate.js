const fs = require('fs');
const path = require('path');

const apiKey = process.env.GOOGLE_API_KEY;

const questions = JSON.parse(fs.readFileSync(path.join(__dirname, 'src/features/assessment/data/questions.json'), 'utf8'));

async function translateBatch(batch) {
  const prompt = `Translate the following JSON array of assessment questions into Hindi. 
Keep the exact same JSON structure, keys, and IDs. Only translate the "text" and "options" arrays.
For the options, keep the prefix letters (like A), B), C), D)) or numbers (like 1=, 2=) in English/numbers, but translate the text after it into Hindi.
Output ONLY valid JSON array without Markdown blocks. DO NOT output any <thought> tags.

JSON:
${JSON.stringify(batch, null, 2)}
`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000);

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/openai/chat/completions`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    signal: controller.signal,
    body: JSON.stringify({
      model: "gemma-4-31b-it",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.1
    })
  });
  
  clearTimeout(timeoutId);

  const data = await response.json();
  if (data.error) {
    throw new Error(data.error.message || "Unknown error");
  }
  let text = data.choices[0].message.content;
  
  // Remove thought tags
  if (text.includes("</thought>")) {
    text = text.split("</thought>")[1];
  }
  
  // Remove markdown code blocks if any
  if (text.includes("\`\`\`json")) {
    text = text.replace(/\`\`\`json/g, "").replace(/\`\`\`/g, "");
  }
  
  return JSON.parse(text.trim());
}

async function main() {
  const batchSize = 10;
  let translated = [];
  for (let i = 0; i < questions.length; i += batchSize) {
    console.log(`Translating batch ${Math.floor(i/batchSize) + 1} of ${Math.ceil(questions.length/batchSize)}`);
    const batch = questions.slice(i, i + batchSize);
    let retries = 3;
    while(retries > 0) {
      try {
        const tBatch = await translateBatch(batch);
        translated = translated.concat(tBatch);
        break;
      } catch(e) {
        retries--;
        console.error("Error, retrying...", e.message);
        await new Promise(r => setTimeout(r, 2000));
      }
    }
    // write progress incrementally
    fs.writeFileSync(path.join(__dirname, 'src/features/assessment/data/questions_hi.json'), JSON.stringify(translated, null, 2));
    await new Promise(r => setTimeout(r, 1000));
  }
  console.log('Finished translating!');
}

main();
