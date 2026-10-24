const path = require("path");
require("../utils/ipv4Fetch");
const dns = require("node:dns");
try {
  dns.setDefaultResultOrder("ipv4first");
} catch (e) {}

const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

async function testGeminiEndpoints() {
  console.log("=========================================");
  console.log("   RESUME AI BUILDER - GEMINI TEST SUITE  ");
  console.log("=========================================\n");

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("❌ GEMINI_API_KEY not found in .env");
    return false;
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });

  console.log("1. Testing ATS Screening Scorer & Keyword Matcher...");
  const atsPrompt = `You are an elite Applicant Tracking System (ATS).
Score this resume against the JD:
JD: Senior React & Node.js Developer with TypeScript and Docker experience.
Resume: Frontend Developer with 3 years React and JavaScript experience. Built SPAs.

Return strictly valid JSON:
{
  "overallMatchScore": 72,
  "verdict": "Moderate Match",
  "matchedKeywords": [{"keyword": "React", "category": "Hard Skill"}],
  "missingKeywords": [{"keyword": "TypeScript", "category": "Hard Skill", "recommendation": "Add to skills and experience"}]
}`;

  try {
    const res = await model.generateContent(atsPrompt);
    const text = (await res.response).text();
    console.log("✅ ATS Matcher Gemini response received!");
    console.log("Sample Output:", text.trim().substring(0, 150) + "...\n");
  } catch (err) {
    console.error("❌ ATS test failed:", err.message);
    return false;
  }

  console.log("2. Testing AI Interview Coach prompt...");
  const coachPrompt = `You are a Principal Tech Recruiter.
Generate 1 interview question and model answer for a candidate applying for Full Stack Engineer with React and Node.js.
Return strictly valid JSON:
{
  "question": "How do you handle state management in large scale React apps?",
  "modelAnswer": "In high-throughput apps, I evaluate Zustand or Redux Toolkit depending on..."
}`;

  try {
    const res = await model.generateContent(coachPrompt);
    const text = (await res.response).text();
    console.log("✅ Interview Coach Gemini response received!");
    console.log("Sample Output:", text.trim().substring(0, 150) + "...\n");
  } catch (err) {
    console.error("❌ Interview Coach test failed:", err.message);
    return false;
  }

  console.log("🎉 All Gemini AI endpoints verified successfully for Resume AI Builder!");
  return true;
}

if (require.main === module) {
  testGeminiEndpoints();
}

module.exports = testGeminiEndpoints;
