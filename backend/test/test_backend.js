const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
require("../utils/ipv4Fetch");
const dns = require("node:dns");
try {
  dns.setDefaultResultOrder("ipv4first");
} catch (e) {}

require("dotenv").config({ path: path.join(__dirname, "../.env") });

const BASE_URL = `http://localhost:${process.env.PORT || 5001}/api`;

async function runTests() {
  console.log("=========================================");
  console.log("   MERN RESUME BUILDER BACKEND VERIFICATION   ");
  console.log("=========================================");

  // 1. Verify MongoDB Connection from .env
  console.log("\n1. Verifying Database Connection...");
  const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/resume-builder";
  console.log(`Connecting to: ${mongoUri.replace(/:([^@]+)@/, ":****@")}`); // Hide credentials
  
  try {
    await mongoose.connect(mongoUri);
    console.log("✅ Database connection successful!");
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
    process.exit(1);
  }

  const testEmail = `test_${Date.now()}@example.com`;
  const testPassword = "password123";
  const testName = "Test User";
  let token = "";
  let resumeId = "";
  let uploadedImagePath = "";
  let success = true;

  try {
    // 2. Test Registration
    console.log("\n2. Testing User Registration...");
    const regRes = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: testName, email: testEmail, password: testPassword })
    });
    
    if (regRes.status === 200 || regRes.status === 201) {
      const regData = await regRes.json();
      console.log(`✅ Registration successful for ${regData.email}!`);
    } else {
      const errText = await regRes.text();
      throw new Error(`Registration failed: ${regRes.status} - ${errText}`);
    }

    // 2.1 Test Duplicate Registration
    console.log("2.1. Testing Duplicate Email Registration Protection...");
    const dupRes = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: testName, email: testEmail, password: testPassword })
    });
    if (dupRes.status === 400) {
      const dupData = await dupRes.json();
      if (dupData.message === "Email already exists") {
        console.log("✅ Duplicate Email Registration prevented with clean 400 error!");
      } else {
        throw new Error(`Unexpected message for duplicate: ${dupData.message}`);
      }
    } else {
      throw new Error(`Expected status 400 for duplicate email, got: ${dupRes.status}`);
    }

    // 3. Test Login
    console.log("\n3. Testing Login and JWT Retrieval...");
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: testEmail, password: testPassword })
    });
    
    if (loginRes.status === 200) {
      const loginData = await loginRes.json();
      token = loginData.token;
      if (!token) throw new Error("No token returned on successful login");
      console.log("✅ Login successful! JWT received.");
    } else {
      throw new Error(`Login failed with status: ${loginRes.status}`);
    }

    // 4. Test Resume Save (Create)
    console.log("\n4. Testing Resume Save (Create)...");
    const sampleResume = {
      title: "Senior Full Stack Engineer Resume",
      themeColor: "#4f46e5",
      personalInfo: {
        fullName: "Alex Rivera",
        jobTitle: "Senior Full Stack Engineer",
        email: testEmail,
        phone: "+1 555-0199",
        address: "San Francisco, CA"
      },
      summary: "Accomplished software engineer with 6+ years of expertise in React and Node.js.",
      skills: ["React", "Node.js", "Express", "MongoDB", "TypeScript"],
      experience: [
        {
          company: "TechNova Corp",
          role: "Senior Full Stack Developer",
          startDate: "2022-01",
          endDate: "Present",
          description: "Engineered scalable microservices and dynamic React dashboards."
        }
      ],
      education: [
        {
          school: "University of California, Berkeley",
          degree: "B.S. in Computer Science",
          startDate: "2016-09",
          endDate: "2020-05"
        }
      ],
      projects: [
        {
          title: "AI ATS Optimizer",
          description: "Engineered an ATS match scanner boosting interview rates by 40%.",
          technologies: "React, Node.js, Gemini AI"
        }
      ]
    };

    const createRes = await fetch(`${BASE_URL}/resumes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(sampleResume)
    });

    if (createRes.status === 201) {
      const createdData = await createRes.json();
      resumeId = createdData._id;
      if (!resumeId) throw new Error("Created resume has no _id");
      console.log(`✅ Resume Save (Create) successful! ID: ${resumeId}`);
    } else {
      const errText = await createRes.text();
      throw new Error(`Resume creation failed: ${createRes.status} - ${errText}`);
    }

    // 5. Test Resume Update (Put)
    console.log("\n5. Testing Resume Update...");
    const updatedPayload = {
      ...sampleResume,
      title: "Staff Software Engineer - Master Edition",
      summary: "Staff Engineer leading mission-critical distributed systems."
    };

    const updateRes = await fetch(`${BASE_URL}/resumes/${resumeId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(updatedPayload)
    });

    if (updateRes.status === 200) {
      const updatedData = await updateRes.json();
      if (updatedData.title !== "Staff Software Engineer - Master Edition") {
        throw new Error("Update did not persist the new title correctly");
      }
      console.log("✅ Resume Update successful!");
    } else {
      throw new Error(`Resume update failed: ${updateRes.status}`);
    }

    // 6. Test Profile Image Upload
    console.log("\n6. Testing Profile Image Upload...");
    const dummyPngBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
    const dummyPngBuffer = Buffer.from(dummyPngBase64, "base64");
    
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

    if (uploadRes.status === 200) {
      const uploadData = await uploadRes.json();
      uploadedImagePath = uploadData.imagePath;
      if (!uploadedImagePath || !uploadedImagePath.startsWith("/uploads/")) {
        throw new Error(`Invalid imagePath returned: ${uploadedImagePath}`);
      }
      console.log(`✅ Image Upload successful! File path: ${uploadedImagePath}`);
    } else {
      throw new Error(`Upload failed with status: ${uploadRes.status}`);
    }

    // 7. Verify Dashboard displays saved resumes
    console.log("\n7. Verifying Dashboard displays saved resumes...");
    const listRes = await fetch(`${BASE_URL}/resumes`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (listRes.status === 200) {
      const listData = await listRes.json();
      const found = listData.some(r => r._id === resumeId);
      if (!found) throw new Error("Created resume not found in user resume list");
      console.log(`✅ Dashboard verify successful! Found ${listData.length} resume(s), including our test resume.`);
    } else {
      throw new Error(`Fetching resumes failed: ${listRes.status}`);
    }

    // 8. Test Resume Delete
    console.log("\n8. Testing Resume Delete...");
    const delRes = await fetch(`${BASE_URL}/resumes/${resumeId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (delRes.status === 200) {
      console.log("✅ Resume Delete successful!");
    } else {
      throw new Error(`Delete failed: ${delRes.status}`);
    }

    // Verify it's gone
    const verifyDelRes = await fetch(`${BASE_URL}/resumes/${resumeId}`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    if (verifyDelRes.status === 404) {
      console.log("✅ Confirmed: Resume no longer exists in database.");
    } else {
      throw new Error(`Resume verify after delete returned status: ${verifyDelRes.status}`);
    }

    // Clean up uploaded image if exists
    if (uploadedImagePath) {
      const localImagePath = path.join(__dirname, "..", uploadedImagePath);
      if (fs.existsSync(localImagePath)) {
        fs.unlinkSync(localImagePath);
        console.log("🧹 Cleaned up temporary test upload image file.");
      }
    }

    // Clean up user from DB
    console.log("\n🧹 Cleaning up test user...");
    const User = require("../models/User");
    await User.deleteOne({ email: testEmail });
    console.log("✅ Test user removed from database.");

    console.log("\n🎉 ALL BACKEND CHECKS PASSED SUCCESSFULLY! 🎉\n");

  } catch (testError) {
    console.error("\n❌ TEST FAILED:", testError.message);
    success = false;
    
    // Attempt database cleanup if test user was created
    try {
      const User = require("../models/User");
      await User.deleteOne({ email: testEmail });
      console.log("🧹 Database cleaned up after failure.");
    } catch (_) {}
    
  } finally {
    await mongoose.connection.close();
    console.log("🔌 Database connection closed.");
  }

  return success;
}

if (require.main === module) {
  runTests();
}

module.exports = runTests;
