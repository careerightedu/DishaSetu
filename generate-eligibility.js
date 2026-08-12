const fs = require('fs');
const path = require('path');

const familyTraitsPath = path.join(__dirname, 'src/features/assessment/data/family_trait_scores.json');
const destPath = path.join(__dirname, 'src/features/assessment/data/career_eligibility_rules.json');

const data = JSON.parse(fs.readFileSync(familyTraitsPath, 'utf8'));
const rules = {};

const pcbKeywords = ["medical", "health", "doctor", "nursing", "veterin", "dentist", "pharm", "therapist", "biology", "life science"];
const pcmKeywords = ["engineer", "software", "developer", "architect", "IT", "systems", "network", "data scientist", "aviation", "pilot", "physics", "math"];
const commKeywords = ["finance", "accountant", "bank", "audit", "tax", "actuar"];

data.forEach(item => {
  const family = item.family.toLowerCase();
  
  let streams = ["ALL"];
  let strict = false;

  // Medicine requires PCB
  if (pcbKeywords.some(k => family.includes(k))) {
    streams = ["Science PCB"];
    strict = true;
  }
  // Engineering/Tech requires PCM
  else if (pcmKeywords.some(k => family.includes(k))) {
    streams = ["Science PCM"];
    strict = true;
  }
  // Finance prefers Commerce or PCM
  else if (commKeywords.some(k => family.includes(k))) {
    streams = ["Commerce", "Science PCM", "Science PCB"];
    strict = false;
  }

  rules[item.family] = {
    allowedStreams: streams,
    strict: strict
  };
});

fs.writeFileSync(destPath, JSON.stringify(rules, null, 2));
console.log(`Generated rules for ${Object.keys(rules).length} families at ${destPath}`);
