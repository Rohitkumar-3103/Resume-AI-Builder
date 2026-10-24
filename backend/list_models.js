const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

async function listModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  console.log("Using API Key:", apiKey ? `${apiKey.substring(0, 8)}...` : "None");
  
  if (!apiKey) {
    console.error("No API Key configured.");
    return;
  }

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await response.json();
    if (data.error) {
      console.error("API Error:", data.error);
    } else {
      console.log("\nAvailable Models for your key:");
      data.models.forEach(m => {
        console.log(`- ${m.name} (supports: ${m.supportedGenerationMethods.join(", ")})`);
      });
    }
  } catch (err) {
    console.error("Request failed:", err.message);
  }
}

listModels();
