import { NextRequest, NextResponse } from "next/server";
import { getLLMCompletion } from "@/features/simulation/lib/llm";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import questionsData from "@/features/assessment/data/questions.json";
import scoringMapData from "@/features/assessment/data/scoring_map.json";
import familyTraitScores from "@/features/assessment/data/family_trait_scores.json";
import occupationsByFamilyData from "@/features/assessment/data/occupations_by_family.json";
import careerEligibilityRules from "@/features/assessment/data/career_eligibility_rules.json";

export const maxDuration = 60; // Extend serverless function timeout to 60 seconds

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const sessionUid = request.cookies.get("session")?.value || body.profile?.uid || body.uid || "guest";
    const answers = body.answers || {};
    const step = body.step || "all";
    const userProfileDataFromBody = body.profile || {};

    // 4. Score Objective Questions
    const traitScores: Record<string, number> = {};
    const traitCounts: Record<string, number> = {};
    const scoringMap = (scoringMapData as unknown) as Record<string, any>;

    Object.entries(answers).forEach(([qIdStr, answerValue]) => {
      const rule = scoringMap[qIdStr];
      if (!rule || (rule.scoringMap && rule.scoringMap.SKIP)) return;

      const respType = rule.responseType;
      const sm = rule.scoringMap;
      if (!sm) return;

      const traitsScored = new Set<string>();

      if (respType === "Scenario MCQ" || respType === "Forced Choice") {
        const choice = String(answerValue).trim();
        const mappedScores = sm[choice];
        if (mappedScores) {
          Object.entries(mappedScores).forEach(([trait, val]) => {
            traitScores[trait] = (traitScores[trait] || 0) + Number(val);
            traitsScored.add(trait);
          });
        }
      } else if (respType === "Likert-5") {
        const rating = Number(answerValue);
        const likertData = sm.LIKERT;
        if (!isNaN(rating) && likertData) {
          const factor = (rating - 1) / 4;
          Object.entries(likertData).forEach(([trait, weight]) => {
            traitScores[trait] = (traitScores[trait] || 0) + (factor * Number(weight));
            traitsScored.add(trait);
          });
        }
      } else if (respType === "Ranked Scenario" || respType === "Ranking") {
        if (Array.isArray(answerValue)) {
          const positionWeights = [1.0, 0.67, 0.33, 0.0];
          answerValue.forEach((choice, idx) => {
            const mappedScores = sm[choice];
            if (mappedScores && idx < positionWeights.length) {
              const pw = positionWeights[idx];
              Object.entries(mappedScores).forEach(([trait, val]) => {
                traitScores[trait] = (traitScores[trait] || 0) + (pw * Number(val));
                traitsScored.add(trait);
              });
            }
          });
        }
      } else if (respType === "Multi-select") {
        const multiData = sm.MULTI;
        if (Array.isArray(answerValue) && multiData) {
          Object.entries(multiData).forEach(([trait, val]) => {
            traitScores[trait] = (traitScores[trait] || 0) + (Number(val) * answerValue.length);
            traitsScored.add(trait);
          });
        }
      }

      traitsScored.forEach((trait) => {
        traitCounts[trait] = (traitCounts[trait] || 0) + 1;
      });
    });

    // 6. Compute Final Trait Percentages
    const finalScores: Record<string, number> = {};
    Object.keys(traitScores).forEach((trait) => {
      const sum = traitScores[trait];
      const count = traitCounts[trait] || 1;
      const raw = Math.round((sum / count) * 100);
      // Regress to mean (50) slightly if count is low (1)
      finalScores[trait] = count >= 2 ? raw : Math.round(raw * 0.8 + 10);
    });

    // Track actually measured traits BEFORE applying 50 default fallbacks
    const measuredTraits = new Set(Object.keys(finalScores));

    // Ensure all 40 traits have fallback defaults for downstream reporting
    const sampleFamilyTraits = familyTraitScores[0]?.traits as Record<string, number> || {};
    Object.keys(sampleFamilyTraits).forEach(t => {
      if (finalScores[t] === undefined) {
        finalScores[t] = 50;
      }
    });

    // Identify candidate's top 3 superpower traits (highest scores among actually measured traits)
    const topSuperpowers = Array.from(measuredTraits)
      .sort((a, b) => (finalScores[b] ?? 50) - (finalScores[a] ?? 50))
      .slice(0, 3);

    // 7. Math Matching (Hybrid wRMSE + Cosine Similarity + Specialization Boost)
    const traitWeights: Record<string, number> = {
      // Tier 1: Core RIASEC Interests (Weight 3.0)
      Realistic: 3.0, Investigative: 3.0, Artistic: 3.0,
      Social: 3.0, Enterprising: 3.0, Conventional: 3.0,
      // Tier 2: Core Cognitive Aptitudes (Weight 2.0)
      Logical: 2.0, Creative: 2.0, Verbal: 2.0, Spatial: 2.0, Numerical: 2.0,
      // Tier 3: Work Values & Drivers (Weight 1.5)
      Autonomy: 1.5, Security: 1.5, Wealth: 1.5, Balance: 1.5,
      "Social Impact": 1.5, "Decision Confidence": 1.5, "Risk Appetite": 1.5,
      Achievement: 1.5, Pace: 1.5, "Structure Preference": 1.5,
      // Tier 4: Contextual & Environmental (Weight 0.5)
    };

    const userProfileData: any = { ...userProfileDataFromBody };
    const explicitStream = userProfileData.stream || userProfileData.backgroundStream;

    // Filter out ineligible careers BEFORE doing any heavy mathematical matching
    const eligibleFamilyTraitScores = familyTraitScores.filter((item) => {
      const rules = (careerEligibilityRules as Record<string, { allowedStreams: string[], strict: boolean }>)[item.family];
      if (rules && rules.strict && explicitStream) {
        if (!rules.allowedStreams.includes("ALL") && !rules.allowedStreams.includes(explicitStream)) {
          return false;
        }
      }
      return true;
    });

    const familyMatches = eligibleFamilyTraitScores.map((item) => {
      const familyName = item.family;
      const fTraits = item.traits as Record<string, number>;

      let weightedDiffSum = 0;
      let totalWeight = 0;
      let gapPenalty = 0;
      let signatureBonus = 0;

      // For Cosine Similarity over measured traits
      let dotProduct = 0;
      let userMagSq = 0;
      let careerMagSq = 0;

      Object.entries(fTraits).forEach(([trait, fValue]) => {
        const userValue = finalScores[trait] !== undefined ? finalScores[trait] : 50;
        const w = traitWeights[trait] ?? 0.5;

        // CRITICAL FIX 1: Only include actually measured traits in distance and similarity calculations
        // This eliminates the "50-midpoint anchor" pulling all candidates toward generalist careers!
        if (measuredTraits.has(trait)) {
          const effectiveW = (Math.abs(userValue - 50) <= 5 && fValue < 70) ? w * 0.3 : w;

          weightedDiffSum += effectiveW * Math.pow(userValue - fValue, 2);
          totalWeight += effectiveW;

          // Cosine similarity components (weighted vector space)
          dotProduct += effectiveW * userValue * fValue;
          userMagSq += effectiveW * Math.pow(userValue, 2);
          careerMagSq += effectiveW * Math.pow(fValue, 2);
        }

        // Check for critical gaps on high-weight traits
        if (w >= 2.0 && fValue >= 75 && userValue <= 40) {
          gapPenalty += 12;
        }

        // Add signature bonus for high-high trait alignment
        if (userValue >= 75 && fValue >= 75) {
          signatureBonus += 2.0 * (w / 3.0);
        }
      });

      // Calculate wRMSE score (0-100 scale)
      const wrmse = totalWeight > 0 ? Math.sqrt(weightedDiffSum / totalWeight) : 0;
      const rmseScore = Math.max(0, 100 - (wrmse * 1.15));

      // CRITICAL FIX 2: Calculate Cosine Similarity (measures shape & direction of trait peaks)
      const cosSim = (userMagSq > 0 && careerMagSq > 0)
        ? dotProduct / (Math.sqrt(userMagSq) * Math.sqrt(careerMagSq))
        : 0;
      const cosineScore = Math.max(0, Math.min(100, cosSim * 100));

      // CRITICAL FIX 3: Superpower Specialization Boost (rewards careers matching candidate's top 3 traits)
      let specializationBoost = 0;
      topSuperpowers.forEach((spTrait) => {
        if ((fTraits[spTrait] ?? 0) >= 73) {
          specializationBoost += 3.5;
        }
      });

      // NEW: Stream Affinity Boost
      let streamAffinityBoost = 0;
      const rules = (careerEligibilityRules as Record<string, { allowedStreams: string[], strict: boolean }>)[familyName];
      if (explicitStream && rules && rules.allowedStreams.includes(explicitStream)) {
        streamAffinityBoost = 5; // Give a 5-point home-court advantage
      }

      // Hybrid Blend: 50% Cosine Similarity (shape) + 50% RMSE (distance) + Bonuses - Penalties
      const blendedBase = (cosineScore * 0.5) + (rmseScore * 0.5);
      let baseFitScore = Math.max(0, Math.min(100, blendedBase + signatureBonus + specializationBoost + streamAffinityBoost));
      let rawFitScore = Math.max(25, Math.min(99, Math.round(baseFitScore - gapPenalty)));

      return { familyName, fitScore: Math.max(10, rawFitScore) };
    });

    familyMatches.sort((a, b) => b.fitScore - a.fitScore);
    const rawTop15 = familyMatches.slice(0, 15);

    const top15Clusters = rawTop15.map((f, mathIdx) => ({
      familyName: f.familyName,
      mathFitScore: f.fitScore,
      mathRank: mathIdx + 1
    }));

    if (step === "math") {
      return NextResponse.json({ success: true, scores: finalScores });
    }

    // 8. User Profile from Client Request Payload & Contextual Anchor Answers

    const contextualAnswers: Record<string, string> = {};
    const questionsMap = (questionsData as any[]).reduce((acc, q) => {
      acc[q.id] = q;
      return acc;
    }, {} as Record<number, any>);

    [502, 503, 504, 505, 506, 507, 508, 509, 510, 511].forEach(qid => {
      const rawAns = answers[qid] || answers[String(qid)];
      if (rawAns && questionsMap[qid]) {
        const qObj = questionsMap[qid];
        const subTrait = qObj.subTrait || `Anchor_${qid}`;
        contextualAnswers[subTrait] = String(rawAns);
      }
    });

    const profileSummary = `
- Full Name: ${userProfileData.fullName || "Candidate"}
- Segment: ${userProfileData.segment || "Not specified"} (S1: School 8-10, S2: School 11-12, S3: College, S4: Early Professional)
- City Tier / Location: ${userProfileData.cityTier || "Not specified"}
- Academic Stream / Degree: ${userProfileData.stream || userProfileData.degree || userProfileData.specialization || userProfileData.grade || "Not specified"}
- College / School: ${userProfileData.collegeName || userProfileData.schoolBoard || "Not specified"}
- Current Role / Industry: ${userProfileData.jobTitle ? `${userProfileData.jobTitle} in ${userProfileData.industry}` : "N/A"}
`.trim();

    const contextualAnchorsSummary = Object.keys(contextualAnswers).length > 0
      ? Object.entries(contextualAnswers).map(([k, v]) => `- ${k}: ${v}`).join("\n")
      : "Standard Defaults";

    // Extract Top 5 Strengths & Weaknesses for personalized LLM prompts
    const sortedTraitPairs = Object.entries(finalScores).sort((a, b) => b[1] - a[1]);
    const topStrengthsStr = sortedTraitPairs.slice(0, 5).map(([t, s]) => `${t} (${s})`).join(", ");
    const weaknessesStr = sortedTraitPairs.slice(-3).map(([t, s]) => `${t} (${s})`).join(", ");

    const basePrompt = `
You are a senior vocational psychologist, career coach, and gamification matching engine.

CANDIDATE DEMOGRAPHIC & ACADEMIC PROFILE:
${profileSummary}

REAL-WORLD CONSTRAINTS & PREFERENCES (CONTEXTUAL ANCHORS):
${contextualAnchorsSummary}

PSYCHOMETRIC TRAIT EVALUATION:
${JSON.stringify(finalScores)}

Candidate's TOP STRENGTHS: ${topStrengthsStr}
Candidate's WEAKEST TRAITS: ${weaknessesStr}

TOP 15 MATHEMATICALLY MATCHED CAREER CLUSTERS (Pre-filtered by academic eligibility & 35-trait weighted psychometric model):
${top15Clusters.map((f, i) => `#${i + 1}. "${f.familyName}" (Trait Match Score: ${f.mathFitScore}%)`).join("\n")}
`;

    let systemPrompt = "You are a professional vocational matching engine. Return ONLY a valid JSON object matching the requested schema. No markdown wrappers. IMPORTANT: DO NOT include any reasoning, <think> tags, or conversational text. Output ONLY the raw JSON string.";
    if (userProfileDataFromBody?.languagePreference === "Hindi") {
      systemPrompt += " CRITICAL: ALL GENERATED TEXT (titles, descriptions, reasons, etc) MUST BE TRANSLATED TO AND OUTPUT IN HINDI. KEEP JSON KEYS IN ENGLISH.";
    }

    let resultPayload: any = {};

    const extractJSON = (text: string) => {
      const c = text.replace(/<think>[\s\S]*?<\/think>/g, '').replace(/<thought>[\s\S]*?<\/thought>/g, '');
      const start = c.indexOf('{');
      const end = c.lastIndexOf('}');
      return (start !== -1 && end !== -1 && start <= end) ? c.substring(start, end + 1) : c;
    };

    if (step === "career_scoring") {
      const scoringPrompt = basePrompt + `
TASK: Evaluate the contextual feasibility of the 15 mathematically-matched career clusters.
Based STRICTLY on the candidate's contextual anchors (salary, location, work-life balance, family constraints, open-text answers) and their academic background.
DO NOT evaluate their psychometric trait fit (that is already accounted for in the Math Score).

Provide data for:
1. "scores": Array of exactly 15 objects. Each object must have:
   - title: string (Must exactly match the career cluster name from the Top 15 list)
   - contextScore: number (0-100 integer. 0 = impossible/fundamentally mismatched given their degree/constraints. 100 = perfect contextual fit).
   - reason: string (1 short sentence explaining why this context score was given).

Respond with ONLY a JSON object containing "scores".
`;
      try {
        const completion = await getLLMCompletion(scoringPrompt, systemPrompt, true);
        const cleaned = extractJSON(completion);
        const parsed = JSON.parse(cleaned);

        const llmScores = parsed.scores || [];
        const top5Careers = top15Clusters.map(cluster => {
          const llmEval = llmScores.find((s: any) => s.title === cluster.familyName) || {};
          const contextScore = typeof llmEval.contextScore === 'number' ? llmEval.contextScore : 50;
          // Final Score = 70% Math + 30% Context
          const finalScore = Math.round((cluster.mathFitScore * 0.7) + (contextScore * 0.3));
          return {
            title: cluster.familyName,
            mathScore: cluster.mathFitScore,
            contextScore,
            finalScore,
            reason: llmEval.reason || "Default fallback contextual score."
          };
        }).sort((a, b) => b.finalScore - a.finalScore).slice(0, 5);

        Object.assign(resultPayload, { top5Careers });
      } catch (err) {
        console.warn("LLM fallback for career_scoring:", err);
        const top5Careers = top15Clusters.slice(0, 5).map(c => ({
          title: c.familyName,
          mathScore: c.mathFitScore,
          contextScore: 50,
          finalScore: c.mathFitScore,
          reason: "Fallback due to LLM error"
        }));
        Object.assign(resultPayload, { top5Careers });
      }
    }

    if (step.startsWith("career_") && step !== "career_extras") {
      const idx = parseInt(step.split("_")[1]);
      if (!isNaN(idx) && idx >= 0 && idx < 5) {
        const calibratedFitScores = [95, 88, 83, 79, 74];
        const selectedCareerTitle = body.selectedCareerTitle || top15Clusters[idx]?.familyName || "Business Operations & General Management";

        const isHigherEdOrPro = userProfileData.segment === "S3" || userProfileData.segment === "S4";
        const currentDegree = userProfileData.stream || userProfileData.degree || "undergraduate studies";
        const defaultAcademicPath = isHigherEdOrPro
          ? (userProfileData.segment === "S4" ? "Executive Master's / Specialized Industry Leadership Track" : "Specialized Master's / Postgraduate Diploma Track")
          : "Relevant Bachelor's Degree Track";
        const defaultAlternatePathways = isHigherEdOrPro
          ? ["Advanced Industry Certifications & Portfolio Build Track", "Lateral Industry Transition / Mentorship Bootcamp Track"]
          : ["BCA / B.Sc / Allied Applied Track (Pragmatic Backup if Competitive Exams Missed)", "Direct Industry Diploma & Portfolio Apprenticeship Track"];

        const p = basePrompt + `
TASK FOR CAREER RECOMMENDATION #${idx + 1} (RANK #${idx + 1} OF 5):
Your task is to generate a comprehensive career profile for the specific career: "${selectedCareerTitle}".
This career has already been selected by our mathematical matching engine as a Top 5 fit for this candidate.

SELECTION & CONTEXTUAL EVALUATION RULES:
1. Contextualize the profile: Relate this career ("${selectedCareerTitle}") to the candidate's 10 REAL-WORLD CONTEXTUAL ANCHORS:
   ${contextualAnchorsSummary}
2. Trait Alignment: Highlight how this career leverages their top psychometric strengths (${topStrengthsStr}).
3. Feasibility: Suggest progression pathways that make sense for their academic background (${currentDegree}).

CRITICAL PROGRESSION RULES:
- EDUCATIONAL PROGRESSION RULE ("WHAT NEXT TO DO"): DO NOT suggest degrees or qualifications the candidate has already completed or is currently pursuing! Since this candidate is in segment "${userProfileData.segment || "S3"}" (${currentDegree}), you MUST suggest WHAT NEXT TO DO from their exact current stage onwards (e.g., if they are in College (S3) or Working Professionals (S4), suggest Master's/MBAs, PG Diplomas, Executive tracks, or specialized industry certifications—DO NOT suggest a Bachelor's degree!).
- INDIAN SCHOOL STUDENT ALTERNATIVE PATHWAYS RULE: For School Students (S1/S2), while academicPath (Plan A) should suggest the top primary degree (e.g., B.Tech / MBBS / B.Com Hons), alternatePathways (Plan B and Plan C) MUST provide pragmatic, high-value Indian alternative routes in case they do not clear hyper-competitive entrance exams (like JEE or NEET) or cannot afford expensive private college seats.

Provide data for:
1. "recommendation": Concise career profile for "${selectedCareerTitle}".
Required fields (KEEP ALL EXPLANATIONS VERY CONCISE, 1-2 LINES MAX TO MINIMIZE TOKENS):
- careerId: string (lowercase hyphenated version of title)
- title: string (MUST BE EXACTLY "${selectedCareerTitle}")
- matchType: string ("Immediate Fit" OR "Aspirational Pivot". Set to Aspirational Pivot if the cluster fundamentally mismatches their current background)
- pivotPath: string (If matchType is Aspirational Pivot, write 1-2 sentences on EXACTLY what additional education/certifications they need to pivot from their current background. If Immediate Fit, just write "N/A".)
- sector: string
- description: string (short overview of this career cluster)
- whyRecommended: string (EXACTLY 2 lines explaining why this career ranks at position #${idx + 1} considering candidate's contextual anchors, personal write-in answers, academic background, and trait strengths)
- topContributingTraits: array of exactly 3 objects with { trait: string, contribution: string } (Identify the top 3 psychometric traits that contributed most to this match and explain in 1 short sentence how each trait powers success in this role)
- rarity: string ("Legendary", "Epic", "Rare", "Uncommon")
- salaryTiers: object with { entry: "₹8-12 LPA", senior: "₹35-50 LPA" } (Expected entry-level salary and expected senior-level salary based on current Indian market data)
- dayInTheLife: string (short, 2-3 sentences max)
- whatYouWillLove: string (short, 1-2 sentences max)
- challenges: string (short, 1-2 sentences max)
- growth: string (short career progression chain, e.g. "Analyst -> Senior -> Lead -> Officer")
- marketDemand: string (short, e.g. "High - ~1.4M open roles projected by 2027")
- aiResilienceScore: number (0-100 integer; CRITICAL: Evaluate "${selectedCareerTitle}" individually and score it based on its actual vulnerability to AI automation or its human moat!)
- aiResilienceExplanation: string (short 1-liner explaining why this specific career has this level of AI resilience or automation risk)
- academicPath: string (Primary Path A indicating WHAT NEXT TO DO from their current stage onwards, e.g. for School S1/S2: "B.Tech in CS" or "MBBS"; for College S3 / Professionals S4: "MS / M.Tech in AI" or "Executive MBA in Tech Strategy")
- alternatePathways: array of 2 strings (Plan B and Plan C pragmatic alternate routes; for S1/S2 MUST include high-value backups like BCA/B.Stat if JEE fails or Psychology/Allied Health if NEET fails; for S3/S4 include certifications/bootcamps)
- exams: array of 1-3 exam acronyms (e.g. ["JEE MAIN", "JEE ADVANCED"])
- firstThreeMoves: array of exactly 3 short actionable steps (e.g. ["Ship 3 portfolio projects on GitHub", "Master DSA basics", "Build 1 open-source project"])
- skillGaps: array of 3-5 short strings representing skills they lack (e.g. ["Python", "System Design", "Cloud Architecture"])
- skillGapsDescription: short 1-2 sentences explaining what the primary gaps are for this user to enter this field based on their profile
- occupations: array of 2-3 specialization roles in this cluster

Respond with ONLY a JSON object containing "recommendation".
`;
        try {
          const completion = await getLLMCompletion(p, systemPrompt, true);
          const cleaned = extractJSON(completion);
          const parsed = JSON.parse(cleaned);

          if (parsed.recommendation) {
            parsed.recommendation.title = selectedCareerTitle; // strictly enforce
            parsed.recommendation.careerId = selectedCareerTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            parsed.recommendation.fitScore = body.selectedFinalScore || calibratedFitScores[idx] || (95 - idx * 5);
            Object.assign(resultPayload, { recommendations: [parsed.recommendation] });
          } else {
            Object.assign(resultPayload, {
              recommendations: [{
                title: selectedCareerTitle,
                careerId: selectedCareerTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
                fitScore: body.selectedFinalScore || calibratedFitScores[idx] || (95 - idx * 5),
                sector: "PROFESSIONAL SERVICES",
                description: `High-alignment career cluster mapped to candidate's psychometric profile.`,
                whyRecommended: `Matches candidate contextual preferences and psychometric traits.`,
                topContributingTraits: [],
                rarity: "Epic",
                salaryTiers: { entry: "₹6-10 LPA", senior: "₹25-40 LPA" },
                dayInTheLife: "Engages in core domain tasks, collaboration, and high-ownership problem solving.",
                whatYouWillLove: "High autonomy and rapid professional growth.",
                challenges: "Requires continuous learning and adaptability.",
                growth: "Junior Specialist -> Senior Professional -> Lead Manager -> Director",
                marketDemand: "High growth projection",
                aiResilienceScore: 85,
                aiResilienceExplanation: "Requires high human situational judgment and strategic oversight.",
                academicPath: defaultAcademicPath,
                alternatePathways: defaultAlternatePathways,
                exams: ["NATIONAL ENTRY EXAM"],
                firstThreeMoves: ["Build foundational portfolio", "Network with industry mentors", "Apply for internships"],
                occupations: [selectedCareerTitle]
              }]
            });
          }
        } catch (llmErr) {
          console.warn(`LLM parsing fallback for step ${step}:`, llmErr);
          Object.assign(resultPayload, {
            recommendations: [{
              title: selectedCareerTitle,
              careerId: selectedCareerTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
              sector: "PROFESSIONAL SERVICES",
              description: `High-alignment career matching your measured trait profile in ${selectedCareerTitle}.`,
              whyRecommended: `Your top psychometric traits map directly onto the requirement profile for ${selectedCareerTitle}.`,
              fitScore: body.selectedFinalScore || calibratedFitScores[idx] || (95 - idx * 5),
              salaryTiers: { entry: "₹8-12 LPA", senior: "₹35-50 LPA" },
              aiResilienceScore: 85,
              aiResilienceExplanation: "Requires high human situational judgment and strategic oversight.",
              academicPath: defaultAcademicPath,
              alternatePathways: defaultAlternatePathways,
              exams: ["NATIONAL ENTRY EXAM"],
              firstThreeMoves: ["Build foundational portfolio", "Network with industry mentors", "Apply for internships"],
              occupations: [selectedCareerTitle]
            }]
          });
        }
      }
    }

    if (step === "career_extras" || step === "all") {
      const p = basePrompt + `
Provide data for:
1. "notRecommended": Array of exactly 3 famous/aspirational careers (e.g. Chartered Accountant, Medical Doctor) that score poorly for this profile. Include title and reason (1 short sentence).
2. "comparisonMatrix": Array of exactly 5 objects matching the Top 5 careers. Include careerId and scores (1-10 integer for: salary, growth, stress, aiRisk, workLifeBalance, learningCurve).

Respond with ONLY a JSON object containing "notRecommended" and "comparisonMatrix".
`;
      try {
        const completion = await getLLMCompletion(p, systemPrompt, true);
        const cleaned = extractJSON(completion);
        const parsed = JSON.parse(cleaned);
        Object.assign(resultPayload, parsed);
      } catch (err) {
        console.warn("LLM fallback for career_extras:", err);
      }
    }

    if (step === "personality" || step === "all") {
      const p = basePrompt + `
Provide data for:
1. "archetype": RPG Hero Archetype (e.g. Tech Alchemist). Fields: name, title, description, level, xp, traits.
2. "deepPersonalityAnalysis": Object containing "strengths" (array of exactly 3 objects: traitName, advantages) and "risks" (array of exactly 3 objects: traitName, blindSpots).
3. "counselorAnalysis":
   - executiveSummary: short overview
   - why: short 1-2 lines on why profile behaves this way
   - soWhat: short 1-2 lines on fitting role types
   - whatItMeans: short 1-2 lines on ceiling and risks
   - watchOut: short 1-2 lines on warnings
   - cognitiveStyleTitle: short 1-3 words summarizing their cognitive style (e.g. "Analytical-Divergent")
   - cognitiveStyle: short 1-2 lines describing their unique cognitive style based on traits
   - decisionMakingTitle: short 1-3 words summarizing how they make decisions (e.g. "Evidence-first")
   - decisionMaking: short 1-2 lines describing how they uniquely make decisions
   - learningStyleTitle: short 1-3 words summarizing their learning style (e.g. "Build-to-learn")
   - learningStyle: short 1-2 lines describing their personalized learning style
   - communicationStyleTitle: short 1-3 words summarizing their communication style (e.g. "Precise & written")
   - communicationStyle: short 1-2 lines describing their communication style based on their traits
   - collaborationStyleTitle: short 1-3 words summarizing their teamwork style (e.g. "Small-team contributor")
   - collaborationStyle: short 1-2 lines describing their teamwork preferences
   - idealEnvironmentTitle: short 1-3 words summarizing their optimal environment (e.g. "High-autonomy, high-craft")
   - idealEnvironment: short 1-2 lines describing their optimal work environment
4. "aiCoachNarrative": Concise, warm coaching letter.

Respond with ONLY a JSON object containing "archetype", "deepPersonalityAnalysis", "counselorAnalysis", and "aiCoachNarrative".
`;
      try {
        const completion = await getLLMCompletion(p, systemPrompt, true);
        const cleaned = extractJSON(completion);
        Object.assign(resultPayload, JSON.parse(cleaned));
      } catch (err) {
        console.warn("LLM fallback for personality:", err);
      }
    }

    if (step === "actionPlan" || step === "all") {
      const p = basePrompt + `
Provide data for:
1. "careerMissions": 2 actionable missions. Fields: title, objective, xpReward, difficulty, estimatedTime.
2. "careerRoadmap": Actionable steps for oneMonth (array), threeMonths (array), sixMonths (array), oneYear (array), threeYears (array).
3. "parentDashboard": howToHelp (array of 4 short items), discussionQuestions (array of 3 questions).
4. "achievements": 3 badges. Fields: title, description.

Respond with ONLY a JSON object containing "careerMissions", "careerRoadmap", "parentDashboard", and "achievements".
`;
      try {
        const completion = await getLLMCompletion(p, systemPrompt, true);
        const cleaned = extractJSON(completion);
        Object.assign(resultPayload, JSON.parse(cleaned));
      } catch (err) {
        console.warn("LLM fallback for actionPlan:", err);
      }
    }

    const contextualSummary = {
      profile: userProfileData,
      answers: contextualAnswers
    };

    return NextResponse.json({ success: true, ...resultPayload, scores: finalScores, contextualSummary });

  } catch (error) {
    console.error("Critical API engine failure:", error);
    const msg = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

