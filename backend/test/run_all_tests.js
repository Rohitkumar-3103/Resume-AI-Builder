const path = require("path");
require("../utils/ipv4Fetch");
const dns = require("node:dns");
try {
  dns.setDefaultResultOrder("ipv4first");
} catch (e) {}

require("dotenv").config({ path: path.join(__dirname, "../.env") });

const runBackendTests = require("./test_backend");
const runUploadTests = require("./test_upload");
const runAITests = require("./test_ai");
const runAIDetectionTests = require("./test_ai_detection");
const runGeminiSuite = require("./test_suite");

async function main() {
  console.log("=================================================");
  console.log("      🚀 RESUME AI BUILDER - FULL TEST SUITE     ");
  console.log("=================================================\n");

  const results = {};

  console.log("▶ [1/5] Running Core Backend CRUD & Auth Tests...");
  try {
    results["Core Backend (Auth & CRUD)"] = await runBackendTests();
  } catch (e) {
    results["Core Backend (Auth & CRUD)"] = false;
  }

  console.log("\n▶ [2/5] Running Image & Resume Upload Tests...");
  try {
    results["Image & File Upload"] = await runUploadTests();
  } catch (e) {
    results["Image & File Upload"] = false;
  }

  console.log("\n▶ [3/5] Running Gemini Direct Endpoint Suite...");
  try {
    results["Gemini Model Direct (ATS/Coach)"] = await runGeminiSuite();
  } catch (e) {
    results["Gemini Model Direct (ATS/Coach)"] = false;
  }

  console.log("\n▶ [4/5] Running AI Summary & Experience Route Tests...");
  try {
    results["AI Routes (Summary & Experience)"] = await runAITests();
  } catch (e) {
    results["AI Routes (Summary & Experience)"] = false;
  }

  console.log("\n▶ [5/5] Running AI Detection & Humanizer Route Tests...");
  try {
    results["AI Detector & Humanizer"] = await runAIDetectionTests();
  } catch (e) {
    results["AI Detector & Humanizer"] = false;
  }

  console.log("\n=================================================");
  console.log("                 📊 TEST SUMMARY                 ");
  console.log("=================================================");
  let allPassed = true;
  for (const [testName, passed] of Object.entries(results)) {
    const status = passed ? "✅ PASSED" : "❌ FAILED";
    console.log(`- ${testName.padEnd(35)} : ${status}`);
    if (!passed) allPassed = false;
  }
  console.log("=================================================");

  if (allPassed) {
    console.log("\n🎉 ALL TEST SUITES PASSED FLAWLESSLY!\n");
    process.exit(0);
  } else {
    console.error("\n❌ SOME TESTS FAILED. Please review the output above.\n");
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = main;
