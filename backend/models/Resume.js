const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    title: {
      type: String,
      default: "My Resume"
    },
    personalInfo: {
      fullName: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, default: "" },
      address: { type: String, default: "" },
      jobTitle: { type: String, required: true }
    },
    summary: { type: String, default: "" },
    education: [
      {
        school: { type: String, default: "" },
        degree: { type: String, default: "" },
        startDate: { type: String, default: "" },
        endDate: { type: String, default: "" },
        description: { type: String, default: "" }
      }
    ],
    experience: [
      {
        company: { type: String, default: "" },
        role: { type: String, default: "" },
        startDate: { type: String, default: "" },
        endDate: { type: String, default: "" },
        description: { type: String, default: "" }
      }
    ],
    projects: [
      {
        title: { type: String, default: "" },
        description: { type: String, default: "" },
        technologies: { type: String, default: "" },
        link: { type: String, default: "" }
      }
    ],
    skills: {
      type: [String],
      default: []
    },
    template: {
      type: String,
      default: "Modern"
    },
    colorTheme: {
      type: String,
      default: "#aa3bff"
    },
    image: {
      type: String,
      default: ""
    },
    coverLetter: {
      companyName: { type: String, default: "" },
      recipientName: { type: String, default: "" },
      recipientTitle: { type: String, default: "" },
      jobTitle: { type: String, default: "" },
      letterDate: { type: String, default: "" },
      salutation: { type: String, default: "Dear Hiring Manager," },
      body: { type: String, default: "" },
      closing: { type: String, default: "Sincerely," }
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Resume", resumeSchema);