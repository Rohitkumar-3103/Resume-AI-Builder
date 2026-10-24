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

async function testAIRoutes() {
  console.log("=========================================");
  console.log("     GEMINI AI ENDPOINTS VERIFICATION     ");
  console.log("=========================================");

  const testEmail = `ai_test_${Date.now()}@example.com`;
  const testPassword = "password123";
  let token = "";
  let success = true;

  try {
    console.log("\n1. Registering test user...");
    const regRes = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "AI Tester", email: testEmail, password: testPassword })
    });
    const regData = await regRes.json();
    console.log("✅ User registered:", regData.email);

    console.log("\n2. Logging in test user...");
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: testEmail, password: testPassword })
    });
    const loginData = await loginRes.json();
    token = loginData.token;
    console.log("✅ JWT token received.");

    // 3. Test generate-summary route
    console.log("\n3. Testing POST /api/ai/generate-summary...");
    const summaryRes = await fetch(`${BASE_URL}/ai/generate-summary`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ jobTitle: "React Developer" })
    });

    console.log(`Status Code: ${summaryRes.status}`);
    const summaryData = await summaryRes.json();
    
    if (summaryRes.status === 200) {
      console.log("✅ Received 200 OK (API Key is active and generated summaries successfully!)");
      console.log("   Suggestions:", JSON.stringify(summaryData, null, 2));
    } else {
      console.log("❌ Unexpected Status Code:", summaryRes.status);
      console.log("   Response:", summaryData);
      success = false;
    }

    // 4. Test generate-experience route
    console.log("\n4. Testing POST /api/ai/generate-experience...");
    const expRes = await fetch(`${BASE_URL}/ai/generate-experience`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ positionTitle: "React Developer" })
    });

    console.log(`Status Code: ${expRes.status}`);
    const expData = await expRes.json();

    if (expRes.status === 200) {
      console.log("✅ Received 200 OK (API Key is active and generated experience bullets successfully!)");
      console.log("   Bullets:\n", expData.bullets);
    } else {
      console.log("❌ Unexpected Status Code:", expRes.status);
      console.log("   Response:", expData);
      success = false;
    }

    // Cleanup
    console.log("\n🧹 Cleaning up test user...");
    const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/resume-builder";
    await mongoose.connect(mongoUri);
    const User = require("../models/User");
    await User.deleteOne({ email: testEmail });
    console.log("✅ Test user removed.");

  } catch (err) {
    console.error("❌ Test script failed:", err.message);
    success = false;
  } finally {
    await mongoose.connection.close();
    console.log("🔌 Database connection closed. Tests complete.\n");
  }

  return success;
}

if (require.main === module) {
  testAIRoutes();
}

module.exports = testAIRoutes;
