const path = require("path");
require("../utils/ipv4Fetch");
const dns = require("node:dns");
try {
  dns.setDefaultResultOrder("ipv4first");
} catch (e) {}

const mongoose = require("mongoose");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const PORT = process.env.PORT || 5001;
const BASE_URL = `http://localhost:${PORT}/api`;

async function testDetectionAndHumanize() {
  console.log("=========================================");
  console.log("   AI DETECTION & HUMANIZER ROUTE TEST   ");
  console.log("=========================================");

  const testEmail = `ai_det_${Date.now()}@test.com`;
  const testPassword = "password123";
  let token = "";
  let success = true;

  try {
    // 1. Register & login
    const regRes = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Detection Tester", email: testEmail, password: testPassword })
    });
    const regData = await regRes.json();
    console.log("Registered:", regData.email);

    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: testEmail, password: testPassword })
    });
    const loginData = await loginRes.json();
    token = loginData.token;
    console.log("Token obtained.");

    // Sample classic AI-generated resume text with clichés
    const sampleAiText = `A results-driven Senior Software Engineer with a proven track record of orchestrating cross-functional teams and spearheading high-impact digital transformation initiatives. A testament to innovative problem-solving, adept at fostering a culture of technical excellence and seamlessly integrating scalable microservices. Passionate about leveraging cutting-edge architectures to deliver unparalleled user experiences.`;

    // 2. Test /api/ai/detect
    console.log("\nTesting POST /api/ai/detect...");
    const detRes = await fetch(`${BASE_URL}/ai/detect`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        text: sampleAiText,
        sectionType: "Summary",
        context: "Senior Software Engineer Resume"
      })
    });

    console.log("Detect HTTP Status:", detRes.status);
    const detData = await detRes.json();
    console.log("Detect Result:", JSON.stringify(detData, null, 2));
    if (detRes.status !== 200) success = false;

    // 3. Test /api/ai/humanize
    console.log("\nTesting POST /api/ai/humanize...");
    const humRes = await fetch(`${BASE_URL}/ai/humanize`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        text: sampleAiText,
        sectionType: "Summary",
        jobTitle: "Senior Software Engineer",
        tone: "authentic_impact"
      })
    });

    console.log("Humanize HTTP Status:", humRes.status);
    const humData = await humRes.json();
    console.log("Humanize Result:", JSON.stringify(humData, null, 2));
    if (humRes.status !== 200) success = false;

    // Cleanup
    const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/resume-builder";
    await mongoose.connect(mongoUri);
    const User = require("../models/User");
    await User.deleteOne({ email: testEmail });
    console.log("\nTest user cleaned up.");

  } catch (err) {
    console.error("Test error:", err.message);
    success = false;
  } finally {
    await mongoose.connection.close();
  }

  return success;
}

if (require.main === module) {
  testDetectionAndHumanize();
}

module.exports = testDetectionAndHumanize;
