// Enforce IPv4 fetch to bypass broken IPv6/NAT64 timeouts in Node undici
require("./utils/ipv4Fetch");
const dns = require("node:dns");
try {
  dns.setDefaultResultOrder("ipv4first");
} catch (e) {
  // Ignore if unsupported in environment
}

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const aiRoutes = require("./routes/aiRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve static uploads
app.use("/uploads", express.static(uploadsDir));

// Serve static root images (logos, badges, assets)
const imagesDir = path.join(__dirname, "../images");
if (fs.existsSync(imagesDir)) {
  app.use("/images", express.static(imagesDir));
}

app.use("/api/auth", authRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api/ai", aiRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || "Internal Server Error" });
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/resume-builder")
  .then(async () => {
    console.log("MongoDB Connected");
    try {
      const User = require("./models/User");
      const bcrypt = require("bcryptjs");
      const existingDemo = await User.findOne({ email: "alex@example.com" });
      if (!existingDemo) {
        const hashedPassword = await bcrypt.hash("password123", 10);
        await User.create({
          name: "Alex Rivera",
          email: "alex@example.com",
          password: hashedPassword
        });
        console.log("Demo user alex@example.com seeded successfully");
      }
    } catch (e) {
      console.log("Demo seed notice:", e.message);
    }
  })
  .catch(err => console.log(err));

app.listen(PORT, () => {
  console.log(`Server Running on Port ${PORT}`);
});