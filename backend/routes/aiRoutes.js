// Enforce IPv4 fetch to bypass broken IPv6/NAT64 timeouts in Node undici
require("../utils/ipv4Fetch");
const dns = require("node:dns");
try {
  dns.setDefaultResultOrder("ipv4first");
} catch (e) {
  // Ignore if unsupported in environment
}

const router = require("express").Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const auth = require("../middleware/auth");

// Initialize Gemini API Client if API key is provided
let genAI;
let model;
if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "your_gemini_api_key_here") {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });
}

// Resilient AI generation with failover across candidate models
const CANDIDATE_MODELS = [
  "gemini-3.5-flash",
  "gemini-3.1-flash-lite-preview",
  "gemini-3.8-flash",
  "gemini-2.5-flash"
];

async function generateWithFallback(prompt) {
  if (!genAI) {
    throw new Error("Gemini AI service is not initialized. Please verify GEMINI_API_KEY in the backend .env file.");
  }

  let lastError = null;
  for (const modelName of CANDIDATE_MODELS) {
    try {
      const activeModel = genAI.getGenerativeModel({ model: modelName });
      const result = await activeModel.generateContent(prompt);
      return result;
    } catch (err) {
      lastError = err;
      const msg = err.message || "";
      // If error is definitely permanent (e.g. invalid API key), rethrow immediately
      if (msg.includes("API_KEY_INVALID") || msg.includes("API key not valid")) {
        throw err;
      }
      console.warn(`[Gemini Failover] Model ${modelName} encountered issue: ${msg.substring(0, 90)}. Trying next candidate model...`);
      continue;
    }
  }
  throw lastError;
}

// User-friendly AI error translator
function formatAiError(error) {
  if (error.message && (error.message.includes("fetch failed") || error.message.includes("CONNECT_TIMEOUT"))) {
    return "Network connection to Gemini AI failed. Please verify your internet connection or proxy settings.";
  }
  if (error.message && (error.message.includes("API_KEY_INVALID") || error.message.includes("API key not valid"))) {
    return "Invalid Gemini API Key. Please verify GEMINI_API_KEY in backend server .env file.";
  }
  return error.message || "Failed to process request with AI";
}

// Helper function to safely extract JSON text from markdown wrapping
function cleanJsonOutput(text) {
  let cleaned = text.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```[a-zA-Z]*\n?/, "").replace(/\n?```$/, "");
  }
  return cleaned.trim();
}

// 1. Generate Summary suggestions based on Job Title
router.post("/generate-summary", auth, async (req, res) => {
  const { jobTitle } = req.body;

  if (!jobTitle) {
    return res.status(400).json({ message: "Job Title is required" });
  }

  if (!model) {
    return res.status(503).json({ 
      message: "Gemini AI service is not configured. Please configure GEMINI_API_KEY in the backend server .env file." 
    });
  }

  try {
    const prompt = `Job Title: ${jobTitle} , Depends on job title give me list of summary suggestions for 3 experience levels: Senior, Mid Level, and Fresher level. Return 3-4 lines for each. Format the response as a JSON array where each object has two string fields: 'summary' and 'experience_level'. Do not wrap the JSON in markdown code blocks.`;

    const result = await generateWithFallback(prompt);
    const response = await result.response;
    const rawText = response.text();
    const cleanedText = cleanJsonOutput(rawText);

    try {
      const jsonResponse = JSON.parse(cleanedText);
      res.json(jsonResponse);
    } catch (parseErr) {
      console.error("Failed to parse Gemini output as JSON:", rawText);
      res.status(500).json({ 
        message: "Failed to generate structured suggestions. AI returned invalid format.",
        raw: rawText
      });
    }
  } catch (error) {
    console.error("Gemini AI API Error:", error.message);
    res.status(500).json({ message: formatAiError(error) });
  }
});

// 2. Generate Work Experience plain text bullet points based on Position Title
router.post("/generate-experience", auth, async (req, res) => {
  const { positionTitle } = req.body;

  if (!positionTitle) {
    return res.status(400).json({ message: "Position Title is required" });
  }

  if (!model) {
    return res.status(503).json({ 
      message: "Gemini AI service is not configured. Please configure GEMINI_API_KEY in the backend server .env file." 
    });
  }

  try {
    const prompt = `position title: ${positionTitle} , Depends on position title give me 5-7 bullet points for my work experience section in a resume. Format each bullet point as a plain text string starting with a hyphen (-) and followed by a space, separated by newlines. Do not add intro/outro text, headers, or markdown formatting.`;

    const result = await generateWithFallback(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ bullets: text.trim() });
  } catch (error) {
    console.error("Gemini AI API Error:", error.message);
    res.status(500).json({ message: formatAiError(error) });
  }
});

// 3. Generate Cover Letter text based on Applicant Name, Job Title, Company Name, and Skills
router.post("/generate-cover-letter", auth, async (req, res) => {
  const { fullName, jobTitle, companyName, skills } = req.body;

  if (!model) {
    return res.status(503).json({ 
      message: "Gemini AI service is not configured. Please configure GEMINI_API_KEY in the backend server .env file." 
    });
  }

  try {
    const prompt = `Write a professional 3-paragraph cover letter for ${fullName || "an applicant"} applying for the position of "${jobTitle || "Software Engineer"}" at "${companyName || "a leading company"}".
Key Skills to highlight: ${skills ? skills.join(", ") : "problem solving, team collaboration, technical expertise"}.
The tone should be confident, professional, and engaging.
Return ONLY the raw cover letter body text paragraphs separated by double newlines. Do not include address blocks, date, or sign-off line.`;

    const result = await generateWithFallback(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ coverLetterText: text.trim() });
  } catch (error) {
    console.error("Gemini AI Cover Letter API Error:", error.message);
    res.status(500).json({ message: formatAiError(error) });
  }
});

// 4. Detect AI Content in Resume Text / Sections
router.post("/detect", auth, async (req, res) => {
  const { text, sectionType, context } = req.body;

  if (!text || !text.trim() || text.trim().length < 15) {
    return res.status(400).json({ 
      message: "At least 15 characters of text are required to analyze AI probability." 
    });
  }

  if (!model) {
    return res.status(503).json({ 
      message: "Gemini AI service is not configured. Please configure GEMINI_API_KEY in the backend server .env file." 
    });
  }

  try {
    const prompt = `You are an elite AI Content Classifier and ATS Resume Authenticity Auditor (incorporating principles of GPTZero, Turnitin, and Copyleaks tailored for job applications).

Analyze the following resume/career text:
\"\"\"
${text}
\"\"\"

Context Info:
- Section Type: ${sectionType || "Resume Content"}
- Additional Context: ${context || "Professional Job Application"}

Evaluate the text on:
1. Statistical Perplexity & Burstiness (sentence length variance, transition predictability).
2. Overused AI Résumé Buzzwords & Clichés (e.g., "spearheaded", "orchestrated", "testament to", "delved", "fostered a culture of", "beacon of", "pivotal role", "dynamic and results-oriented", "seamlessly integrated", "demonstrated proficiency", "leveraged cutting-edge").
3. Specificity & Authenticity vs generic robotic statements.

Return a JSON object with EXACTLY this structure (no markdown fences, strictly valid JSON):
{
  "overallAiScore": <integer 0-100 indicating probability of AI generation>,
  "humanScore": <integer 0-100, equal to 100 - overallAiScore>,
  "verdict": "<one of: 'Highly Likely AI', 'Likely AI-Generated', 'Mixed / AI-Assisted', 'Likely Human-Written', 'Highly Authentic Human'>",
  "riskLevel": "<one of: 'High', 'Medium', 'Low', 'Minimal'>",
  "summaryCritique": "<2-3 concise sentences explaining why detectors or recruiters will classify it this way>",
  "metrics": {
    "burstiness": "<e.g. 'Low (Uniform/Robotic)' | 'Medium (Moderate)' | 'High (Natural Cadence)'>",
    "perplexity": "<e.g. 'Low (Predictable/AI)' | 'Medium (Balanced)' | 'High (Authentic)'>",
    "clicheCount": <number of AI cliché patterns detected>,
    "atsReadability": "<e.g. 'Grade 10 - Clear & Crisp' | 'Grade 12 - Professional' | 'Overly Dense / Fluffy'>"
  },
  "flaggedPhrases": [
    {
      "phrase": "<exact detected buzzword or robotic phrase>",
      "reason": "<why this triggers AI detectors or recruiter skepticism>",
      "severity": "<'high' | 'medium' | 'low'>",
      "suggestedAlternative": "<natural, punchy human alternative>"
    }
  ],
  "sentenceAnalysis": [
    {
      "sentence": "<exact sentence or clause from text>",
      "aiScore": <integer 0-100 probability for this specific sentence>,
      "isFlagged": <boolean, true if aiScore >= 55>,
      "note": "<brief 1-phrase rationale if flagged, or empty string>"
    }
  ],
  "humanizeTips": [
    "<concrete recommendation 1>",
    "<concrete recommendation 2>",
    "<concrete recommendation 3>"
  ]
}`;

    const result = await generateWithFallback(prompt);
    const response = await result.response;
    const rawText = response.text();
    const cleanedText = cleanJsonOutput(rawText);

    try {
      const parsed = JSON.parse(cleanedText);
      // Guarantee fallback boundaries
      parsed.overallAiScore = Math.max(0, Math.min(100, Math.round(parsed.overallAiScore || 50)));
      parsed.humanScore = 100 - parsed.overallAiScore;
      res.json(parsed);
    } catch (parseErr) {
      console.error("Failed to parse Gemini AI detection response:", rawText);
      res.status(500).json({
        message: "Failed to parse AI detector results.",
        raw: rawText
      });
    }
  } catch (error) {
    console.error("Gemini AI Detection Error:", error.message);
    res.status(500).json({ message: formatAiError(error) });
  }
});

// 5. Humanize AI-Generated Text to Sound 100% Authentic & Bypass Detectors
router.post("/humanize", auth, async (req, res) => {
  const { text, sectionType, jobTitle, tone } = req.body;

  if (!text || !text.trim() || text.trim().length < 15) {
    return res.status(400).json({ 
      message: "At least 15 characters of text are required to humanize." 
    });
  }

  if (!model) {
    return res.status(503).json({ 
      message: "Gemini AI service is not configured. Please configure GEMINI_API_KEY in the backend server .env file." 
    });
  }

  try {
    const toneDescription = tone === "concise_metrics" 
      ? "Action-oriented and metrics-heavy, direct and punchy without filler" 
      : tone === "conversational_pro" 
      ? "Conversational executive tone, engaging and natural yet authoritative" 
      : "Authentic, high-impact human voice with dynamic rhythm and clear cause-and-effect";

    const prompt = `You are a world-class Executive Resume Writer and Recruiter who excels at rewriting and humanizing AI-generated content so that it bypasses AI detectors (GPTZero, Copyleaks, Turnitin) and sounds genuinely human, credible, and impressive.

Original Text:
\"\"\"
${text}
\"\"\"

Context:
- Section: ${sectionType || "Resume section"}
- Job Title Context: ${jobTitle || "Professional"}
- Tone Requirement: ${toneDescription}

Humanization Rules:
1. Completely eradicate robotic AI markers: NEVER use "spearheaded", "orchestrated", "beacon", "testament to", "delved", "fostered a collaborative environment", "dynamic professional", "pivotal role", "passion for leveraging".
2. Introduce natural burstiness (mix crisp short sentences with informative compound sentences).
3. Ground statements in tangible actions: use direct active verbs (e.g. built, audited, eliminated, wrote, shipped, launched, restructured, designed).
4. Preserve all original numbers, technologies, company names, and truthful claims—do not fabricate facts.
5. If original text consists of bullet points (- ), preserve the bullet point format (- ) for each point.

Return a JSON object with EXACTLY this structure (no markdown fences, strictly valid JSON):
{
  "humanizedText": "<the rewritten humanized text>",
  "projectedAiScore": <integer between 4 and 15 representing expected low AI probability>,
  "improvements": [
    "<specific improvement 1, e.g. Replaced robotic buzzwords with direct action verbs>",
    "<specific improvement 2, e.g. Added cadence and varied sentence lengths>",
    "<specific improvement 3, e.g. Clarified direct impact and ownership>"
  ]
}`;

    const result = await generateWithFallback(prompt);
    const response = await result.response;
    const rawText = response.text();
    const cleanedText = cleanJsonOutput(rawText);

    try {
      const parsed = JSON.parse(cleanedText);
      res.json(parsed);
    } catch (parseErr) {
      console.error("Failed to parse Gemini AI humanize response:", rawText);
      res.status(500).json({
        message: "Failed to parse humanized content.",
        raw: rawText
      });
    }
  } catch (error) {
    console.error("Gemini AI Humanize Error:", error.message);
    res.status(500).json({ message: formatAiError(error) });
  }
});

// Configure Multer for in-memory file parsing (PDF, DOCX, TXT)
const multer = require("multer");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const path = require("path");

const resumeUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext === ".pdf" || ext === ".docx" || ext === ".doc" || ext === ".txt") {
      cb(null, true);
    } else {
      cb(new Error("Supported formats: PDF, DOCX, DOC, TXT"));
    }
  }
});

// 6. Upload & Parse Resume File (PDF / DOCX / TXT) or raw text into Structured JSON
router.post("/parse-resume-file", auth, (req, res, next) => {
  resumeUpload.single("file")(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message || "File upload error" });
    }
    next();
  });
}, async (req, res) => {
  if (!model) {
    return res.status(503).json({ 
      message: "Gemini AI service is not configured. Please configure GEMINI_API_KEY in the backend server .env file." 
    });
  }

  try {
    let extractedText = "";

    if (req.file) {
      const ext = path.extname(req.file.originalname).toLowerCase();
      if (ext === ".pdf") {
        const parsed = await pdfParse(req.file.buffer);
        extractedText = parsed.text;
      } else if (ext === ".docx" || ext === ".doc") {
        const result = await mammoth.extractRawText({ buffer: req.file.buffer });
        extractedText = result.value;
      } else {
        extractedText = req.file.buffer.toString("utf8");
      }
    } else if (req.body && req.body.text) {
      extractedText = req.body.text;
    } else {
      return res.status(400).json({ message: "Please upload a resume file (PDF/DOCX/TXT) or provide raw resume text." });
    }

    if (!extractedText || extractedText.trim().length < 20) {
      return res.status(400).json({ 
        message: "Could not extract sufficient text from the resume. Please ensure the file contains selectable text or paste directly." 
      });
    }

    // Call Gemini to structure the extracted text into our Resume schema
    const prompt = `You are an elite Resume Parsing and Information Extraction Engine.
Parse the following raw resume text and extract all information into a structured JSON object.

Raw Resume Content:
\"\"\"
${extractedText.substring(0, 15000)}
\"\"\"

Requirements:
1. Infer an accurate professional title (e.g., "Full Stack Developer Resume", "Data Scientist Profile").
2. Extract personalInfo: fullName, email, phone, address (city, country/state), and jobTitle.
3. Extract professional summary into a concise paragraph.
4. Extract skills as a clean JSON array of strings (individual skill names, e.g. ["React", "Node.js", "Python", "Docker"]).
5. Extract work experience array: each item with { company, role, startDate, endDate, description }. Format description as bullet points separated by newlines starting with "- ".
6. Extract education array: each item with { school, degree, startDate, endDate, description }.
7. Extract projects array: each item with { title, description, technologies, link }.

Return strictly valid JSON matching this schema with NO markdown code fences or backticks:
{
  "title": "<string>",
  "personalInfo": {
    "fullName": "<string>",
    "email": "<string>",
    "phone": "<string>",
    "address": "<string>",
    "jobTitle": "<string>"
  },
  "summary": "<string>",
  "skills": ["<skill1>", "<skill2>"],
  "experience": [
    {
      "company": "<string>",
      "role": "<string>",
      "startDate": "<string>",
      "endDate": "<string>",
      "description": "<string>"
    }
  ],
  "education": [
    {
      "school": "<string>",
      "degree": "<string>",
      "startDate": "<string>",
      "endDate": "<string>",
      "description": "<string>"
    }
  ],
  "projects": [
    {
      "title": "<string>",
      "description": "<string>",
      "technologies": "<string>",
      "link": "<string>"
    }
  ]
}`;

    const result = await generateWithFallback(prompt);
    const response = await result.response;
    const rawOutput = response.text();
    const cleaned = cleanJsonOutput(rawOutput);

    try {
      const parsedResume = JSON.parse(cleaned);
      res.json({
        success: true,
        fileName: req.file ? req.file.originalname : "Pasted Resume Text",
        rawTextLength: extractedText.length,
        rawText: extractedText.substring(0, 4000),
        data: parsedResume
      });
    } catch (parseError) {
      console.error("Gemini JSON Parse Error in Resume Parser:", rawOutput);
      res.status(500).json({
        message: "Failed to parse resume into structured JSON.",
        raw: rawOutput
      });
    }
  } catch (error) {
    console.error("Resume Parsing Error:", error);
    res.status(500).json({ message: formatAiError(error) });
  }
});

// 7. ATS Resume Screening Scorer & Keyword Matcher (ATS Beater) with Before vs After Comparison
router.post("/match-ats", auth, async (req, res) => {
  const { resumeText, jobDescription, resumeTitle, jobTitle } = req.body;

  if (!resumeText || resumeText.trim().length < 30) {
    return res.status(400).json({ message: "Resume text must be at least 30 characters long." });
  }

  if (!jobDescription || jobDescription.trim().length < 30) {
    return res.status(400).json({ message: "Job description must be at least 30 characters long." });
  }

  if (!model) {
    return res.status(503).json({ 
      message: "Gemini AI service is not configured. Please configure GEMINI_API_KEY in the backend server .env file." 
    });
  }

  try {
    const prompt = `You are an elite Applicant Tracking System (ATS) Engine and Principal Technical Recruiter with deep expertise in Fortune 500 ATS algorithms (Taleo, Workday, Greenhouse, Lever, iCIMS).

Your mission is to perform a comprehensive Resume Screening & ATS Keyword Match analysis, score the resume against the target Job Description, and generate a transformative "Before vs After" ATS Beater optimization.

TARGET JOB TITLE / ROLE:
${jobTitle || "Target Position"}

TARGET JOB DESCRIPTION:
\"\"\"
${jobDescription.substring(0, 10000)}
\"\"\"

CANDIDATE RESUME:
\"\"\"
${resumeText.substring(0, 10000)}
\"\"\"

Perform the following calculations:
1. Overall ATS Match Score (0 to 100).
2. Keyword Match Score (0 to 100) - exact and synonymous presence of required hard skills, tools, technologies, and certifications.
3. Semantic Similarity Score (0 to 100) - contextual alignment of candidate's past scope, responsibilities, and seniority with JD requirements.
4. Section Scores (0 to 100 each for: skillsMatch, experienceRelevance, educationFit, formattingAtsFriendliness).
5. Extract matched keywords with context and frequency.
6. Extract missing critical keywords with placement recommendations.
7. Identify ATS warnings and red flags (e.g. missing quantitative achievements, unmentioned core tech).
8. Generate "Before vs After" ATS Beater Optimization:
   - Calculate projectedAfterScore (realistic score after adopting recommendations, usually +15 to +30 points higher).
   - Generate an optimized, punchy summary incorporating missing keywords naturally without robotic stuffing.
   - Select 2-4 key bullet points from the resume that are weak or missing keywords and provide improved "After" versions with strong action verbs and quantified impact.
   - List the top 3-5 prioritized action steps.

Return ONLY a strictly valid JSON object (no markdown backticks, no comments):
{
  "overallMatchScore": <integer 0-100>,
  "keywordMatchScore": <integer 0-100>,
  "semanticSimilarityScore": <integer 0-100>,
  "verdict": "<e.g. 'Strong Match - High ATS Pass Rate' | 'Good Match - Minor Keyword Gaps' | 'Moderate Match - Needs Tailoring' | 'Low Match - Significant Deficiencies'>",
  "atsPassProbability": "<'High (>85%)' | 'Moderate (65-84%)' | 'Low (<65%)'>",
  "sectionScores": {
    "skillsMatch": <integer 0-100>,
    "experienceRelevance": <integer 0-100>,
    "educationFit": <integer 0-100>,
    "formattingAtsFriendliness": <integer 0-100>
  },
  "matchedKeywords": [
    {
      "keyword": "<keyword name>",
      "category": "<'Hard Skill' | 'Tool/Framework' | 'Soft Skill' | 'Domain'>",
      "importance": "<'Critical' | 'High' | 'Medium'>",
      "count": <integer>,
      "context": "<brief quote or section where it appeared>"
    }
  ],
  "missingKeywords": [
    {
      "keyword": "<missing keyword name>",
      "category": "<'Hard Skill' | 'Tool/Framework' | 'Soft Skill' | 'Domain'>",
      "importance": "<'Critical' | 'High' | 'Medium'>",
      "recommendation": "<exact advice on where to incorporate this in resume>"
    }
  ],
  "atsWarnings": [
    "<specific ATS risk or parsing issue>"
  ],
  "keyStrengths": [
    "<specific alignment point 1>",
    "<specific alignment point 2>"
  ],
  "beforeAfterOptimization": {
    "beforeScore": <same as overallMatchScore>,
    "projectedAfterScore": <integer higher than beforeScore, up to 98>,
    "scoreDelta": <integer projectedAfterScore - beforeScore>,
    "optimizedSummary": "<tailored professional summary incorporating key missing target keywords>",
    "bulletComparisons": [
      {
        "roleOrProject": "<context or company>",
        "originalBullet": "<original bullet point from resume>",
        "optimizedBullet": "<rewritten bullet point with strong action verb, keyword integration, and metric>",
        "reason": "<why the optimized version beats ATS filters and hooks recruiters>"
      }
    ],
    "actionPlan": [
      "<step 1>",
      "<step 2>",
      "<step 3>"
    ]
  }
}`;

    const result = await generateWithFallback(prompt);
    const response = await result.response;
    const rawOutput = response.text();
    const cleaned = cleanJsonOutput(rawOutput);

    try {
      const parsed = JSON.parse(cleaned);
      // Guarantee bounded numbers
      parsed.overallMatchScore = Math.max(0, Math.min(100, Math.round(parsed.overallMatchScore || 50)));
      if (parsed.beforeAfterOptimization) {
        parsed.beforeAfterOptimization.beforeScore = parsed.overallMatchScore;
        parsed.beforeAfterOptimization.projectedAfterScore = Math.min(99, Math.max(parsed.overallMatchScore + 10, parsed.beforeAfterOptimization.projectedAfterScore || (parsed.overallMatchScore + 18)));
        parsed.beforeAfterOptimization.scoreDelta = parsed.beforeAfterOptimization.projectedAfterScore - parsed.overallMatchScore;
      }
      res.json(parsed);
    } catch (parseError) {
      console.error("Gemini JSON Parse Error in ATS Matcher:", rawOutput);
      res.status(500).json({
        message: "Failed to parse ATS screening analysis.",
        raw: rawOutput
      });
    }
  } catch (error) {
    console.error("ATS Screening Error:", error);
    res.status(500).json({ message: formatAiError(error) });
  }
});

// 8. Deep AI Resume Quality Scorer & Readability Auditor
router.post("/score-resume", auth, async (req, res) => {
  const { resumeText, jobTitle } = req.body;

  if (!resumeText || resumeText.trim().length < 30) {
    return res.status(400).json({ message: "Resume text must be at least 30 characters long." });
  }

  if (!model) {
    return res.status(503).json({ 
      message: "Gemini AI service is not configured. Please configure GEMINI_API_KEY in the backend server .env file." 
    });
  }

  try {
    const prompt = `You are an Executive Resume Reviewer and Headhunter.
Perform an in-depth audit of this resume for professional caliber, recruiter readability, impact metrics, and action-verb strength.

Candidate Target Role: ${jobTitle || "Professional"}
Resume Text:
\"\"\"
${resumeText.substring(0, 10000)}
\"\"\"

Return strictly valid JSON (no markdown backticks):
{
  "overallScore": <integer 0-100>,
  "letterGrade": "<'A+' | 'A' | 'B+' | 'B' | 'C' | 'Needs Work'>",
  "readabilityMetrics": {
    "quantificationRate": "<percentage of bullets containing numbers, e.g. '42% (Target: >50%)'>",
    "actionVerbStrength": "<'Exceptional' | 'Strong' | 'Average' | 'Weak/Passive'>",
    "wordCount": <integer approximate words>,
    "bulletCount": <integer count of achievement bullets>
  },
  "sectionFeedback": [
    {
      "section": "<e.g. Summary | Experience | Skills | Education>",
      "status": "<'Excellent' | 'Good' | 'Needs Improvement'>",
      "critique": "<actionable 1-2 sentence feedback>"
    }
  ],
  "topStrengths": [
    "<strength 1>",
    "<strength 2>",
    "<strength 3>"
  ],
  "criticalImprovements": [
    "<actionable improvement 1>",
    "<actionable improvement 2>",
    "<actionable improvement 3>"
  ]
}`;

    const result = await generateWithFallback(prompt);
    const response = await result.response;
    const rawOutput = response.text();
    const cleaned = cleanJsonOutput(rawOutput);

    try {
      const parsed = JSON.parse(cleaned);
      parsed.overallScore = Math.max(0, Math.min(100, Math.round(parsed.overallScore || 70)));
      res.json(parsed);
    } catch (parseError) {
      console.error("Gemini JSON Parse Error in Resume Scorer:", rawOutput);
      res.status(500).json({
        message: "Failed to parse resume score.",
        raw: rawOutput
      });
    }
  } catch (error) {
    console.error("Resume Scorer Error:", error);
    res.status(500).json({ message: formatAiError(error) });
  }
});

// 9. AI Interview Coach: Personalized Mock Questions & Model Answers
router.post("/interview-prep", auth, async (req, res) => {
  const { resumeText, jobTitle, jobDescription, interviewType } = req.body;

  if (!resumeText || resumeText.trim().length < 30) {
    return res.status(400).json({ message: "Resume text must be at least 30 characters long." });
  }

  if (!model) {
    return res.status(503).json({ 
      message: "Gemini AI service is not configured. Please configure GEMINI_API_KEY in the backend server .env file." 
    });
  }

  try {
    const prompt = `You are a Principal Tech Recruiter and Executive Hiring Manager at a top tech company.
Generate 5 highly targeted, realistic interview questions and exemplary model answers for a candidate with this resume, tailored to the target role.

Target Role: ${jobTitle || "Software Engineer"}
Target Job Description / Tech Focus:
\"\"\"
${jobDescription ? jobDescription.substring(0, 5000) : "General industry expectations for " + (jobTitle || "this role")}
\"\"\"

Candidate Resume Background:
\"\"\"
${resumeText.substring(0, 8000)}
\"\"\"

Question Type Focus: ${interviewType || "Balanced mix of Technical, Behavioral (STAR method), and Architecture/System Design"}

Return strictly valid JSON (no markdown backticks):
{
  "roleSummary": "<2-sentence synthesis of what interviewers will be scrutinizing for this position>",
  "readinessRating": "<'Strong Candidate' | 'Promising - Focus on Storytelling' | 'Needs Preparation'>",
  "questions": [
    {
      "id": 1,
      "category": "<'Behavioral (STAR)' | 'Technical Deep-Dive' | 'System/Project Architecture' | 'Problem Solving'>",
      "question": "<realistic, probing interview question referring to their background or tech stack>",
      "whyTheyAsk": "<recruiter insight into what the interviewer is secretly evaluating>",
      "keyPointsToHit": [
        "<key point 1>",
        "<key point 2>",
        "<key point 3>"
      ],
      "modelAnswer": "<high-scoring, authentic sample answer using the candidate's actual projects or tech>",
      "commonPitfalls": "<what candidate should avoid saying>"
    }
  ],
  "interviewTips": [
    "<tip 1>",
    "<tip 2>",
    "<tip 3>"
  ]
}`;

    const result = await generateWithFallback(prompt);
    const response = await result.response;
    const rawOutput = response.text();
    const cleaned = cleanJsonOutput(rawOutput);

    try {
      const parsed = JSON.parse(cleaned);
      res.json(parsed);
    } catch (parseError) {
      console.error("Gemini JSON Parse Error in Interview Prep:", rawOutput);
      res.status(500).json({
        message: "Failed to parse interview prep questions.",
        raw: rawOutput
      });
    }
  } catch (error) {
    console.error("Interview Coach Error:", error);
    res.status(500).json({ message: formatAiError(error) });
  }
});

// 10. Resume Tips & ATS Playbook Directory
router.get("/career-playbook", (req, res) => {
  res.json({
    actionVerbs: {
      "Engineering & Development": [
        "Architected", "Engineered", "Refactored", "Containerized", "Automated",
        "Orchestrated", "Implemented", "Deployed", "Migrated", "Benchmarked",
        "Integrated", "Optimized", "Scaled", "Debugged", "Prototyped"
      ],
      "Leadership & Management": [
        "Spearheaded", "Directed", "Mentored", "Mobilized", "Cultivated",
        "Accelerated", "Championed", "Negotiated", "Streamlined", "Delegated",
        "Formulated", "Pioneered", "Revitalized", "Trained", "Unified"
      ],
      "Data & Artificial Intelligence": [
        "Modeled", "Trained", "Fine-tuned", "Extracted", "Synthesized",
        "Quantified", "Forecasted", "Cleaned", "Validated", "Operationalized",
        "Clustered", "Engineered Features", "Visualized", "Evaluated", "Monitored"
      ],
      "Product & Project Management": [
        "Defined", "Prioritized", "Launched", "Validated", "Iterated",
        "Spearheaded", "Aligned", "Facilitated", "Scrum-Mastered", "Delivered",
        "Roadmapped", "Researched", "Tested", "Optimized", "Conducted"
      ],
      "Design & UX": [
        "Crafted", "Wireframed", "Prototyped", "Conceptualized", "Iterated",
        "Standardized", "Revamped", "Conducted Research", "Mapped", "Illustrated"
      ]
    },
    atsRules: [
      {
        rule: "Standard Section Headings",
        desc: "Use universal headings like 'Work Experience', 'Education', 'Skills', and 'Projects'. Obscure titles like 'My Journey' confuse parsers."
      },
      {
        rule: "Clean Single/Double Column Layout",
        desc: "Avoid multi-layer nested tables, text boxes, or floating canvas elements. Clean linear hierarchies parse with 99.9% accuracy."
      },
      {
        rule: "Direct Keyword Mirroring",
        desc: "If the job description asks for 'Node.js' and 'CI/CD Pipelines', write those exact terms rather than ambiguous abbreviations."
      },
      {
        rule: "XYZ Bullet Formula",
        desc: "Accomplished [X] as measured by [Y] by doing [Z]. Always anchor your work to business metrics, speedups, or revenue."
      },
      {
        rule: "Supported File Formats",
        desc: "Export as PDF (searchable text, not flattened raster images) or .docx Word format. All modern ATS support searchable PDFs."
      }
    ],
    bulletFormulas: [
      {
        category: "Performance Optimization",
        formula: "Optimized [System/Component], slashing latency by [X]% and supporting [Y] concurrent users by implementing [Z].",
        example: "Optimized MongoDB aggregation pipelines, slashing API response time by 42% and supporting 15,000+ daily active users using Redis caching."
      },
      {
        category: "Feature Delivery",
        formula: "Designed and shipped [Feature Name], increasing [User Metric] by [X]% within [Timeframe] using [Technologies].",
        example: "Designed and shipped real-time resume export engine, increasing user completion rate by 28% across 4,000+ candidate applications using React and Node.js."
      },
      {
        category: "Automation & Cost Reduction",
        formula: "Automated [Manual Process] with [Tool/Script], reducing engineering overhead by [X] hours/week and saving $[Y].",
        example: "Automated end-to-end regression testing with GitHub Actions, reducing deployment turnaround by 65% and saving 14 engineering hours per sprint."
      }
    ]
  });
});

module.exports = router;

