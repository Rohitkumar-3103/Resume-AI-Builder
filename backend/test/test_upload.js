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

async function testUpload() {
  console.log("=========================================");
  console.log("     IMAGE UPLOAD ENDPOINT VERIFICATION   ");
  console.log("=========================================");

  const testEmail = `upload_test_${Date.now()}@example.com`;
  const testPassword = "password123";
  let token = "";
  let success = true;

  try {
    console.log("\n1. Registering test user...");
    const regRes = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Upload Tester", email: testEmail, password: testPassword })
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

    console.log("\n3. Simulating file upload...");
    // Create a tiny valid 1x1 PNG image buffer in memory
    const dummyPngBuffer = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
      "base64"
    );

    const formData = new FormData();
    const blob = new Blob([dummyPngBuffer], { type: "image/png" });
    formData.append("image", blob, "avatar.png");

    const uploadRes = await fetch(`${BASE_URL}/resumes/upload`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`
      },
      body: formData
    });

    console.log(`Status Code: ${uploadRes.status}`);
    const uploadData = await uploadRes.json();
    console.log("Response Body:", uploadData);

    if (uploadRes.status === 200 && uploadData.imagePath) {
      console.log("✅ Image Upload succeeded!");
    } else {
      console.log("❌ Image Upload failed.");
      success = false;
    }

    // Cleanup user
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
  testUpload();
}

module.exports = testUpload;
