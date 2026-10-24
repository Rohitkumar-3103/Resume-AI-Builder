import React, { useState } from "react";
import { uploadImage, ASSET_URL, generateSummary, generateExperience, generateCoverLetter } from "../services/api";

const ResumeForm = ({ resumeData, setResumeData, onOpenAIDetector }) => {
  const [activeSection, setActiveSection] = useState("design");
  const [skillInput, setSkillInput] = useState("");
  const [aiSummaryLoading, setAiSummaryLoading] = useState(false);
  const [aiSummarySuggestions, setAiSummarySuggestions] = useState(null);
  const [experienceLoadingIndex, setExperienceLoadingIndex] = useState(null);
  const [aiCoverLoading, setAiCoverLoading] = useState(false);

  const handlePrefillSampleData = () => {
    setResumeData({
      ...resumeData,
      title: "Software Engineer Resume",
      template: resumeData.template || "Modern",
      colorTheme: resumeData.colorTheme || "#aa3bff",
      personalInfo: {
        fullName: "Alex Rivera",
        email: "alex.rivera@example.com",
        phone: "+1 (555) 234-5678",
        address: "San Francisco, CA",
        jobTitle: "Senior Full Stack Engineer"
      },
      summary: "Results-driven Full Stack Engineer with 6+ years of experience building scalable web applications using React, Node.js, and MongoDB. Passionate about clean code, performance optimization, and AI integrations.",
      skills: ["React.js", "Node.js", "Express", "MongoDB", "TypeScript", "REST APIs", "Tailwind CSS", "Docker", "Git"],
      education: [
        {
          school: "University of California, Berkeley",
          degree: "B.S. in Computer Science",
          startDate: "Sep 2016",
          endDate: "May 2020",
          description: "Graduated with Honors. Coursework in Data Structures, Web Development, and Distributed Systems."
        }
      ],
      experience: [
        {
          company: "TechNova Solutions",
          role: "Senior Full Stack Engineer",
          startDate: "Jan 2022",
          endDate: "Present",
          description: "• Architected microservices backend handling 1M+ daily active requests using Express and Node.js.\n• Led frontend redesign in React 19, improving page load performance by 40%."
        },
        {
          company: "Innovate Labs",
          role: "Software Developer",
          startDate: "Jun 2020",
          endDate: "Dec 2021",
          description: "• Developed responsive SPAs using React and RESTful APIs.\n• Integrated OAuth 2.0 authentication and automated CI/CD deployment pipelines."
        }
      ],
      projects: [
        {
          title: "AI-Powered Resume Builder",
          technologies: "React 19, Express, MongoDB, Gemini AI",
          link: "https://github.com/example/resume-builder",
          description: "Built a full-stack MERN application enabling live PDF/Word exports, customizable templates, and AI content suggestions."
        }
      ],
      coverLetter: {
        recipientName: "Sarah Jenkins",
        recipientTitle: "Head of Engineering",
        companyName: "Acme Innovations Inc.",
        jobTitle: "Senior Full Stack Engineer",
        letterDate: "August 19, 2026",
        salutation: "Dear Ms. Jenkins,",
        body: "I am writing to express my strong interest in the Senior Full Stack Engineer position at Acme Innovations Inc. With over six years of experience developing robust web applications with React, Node.js, and modern cloud architectures, I am excited about the opportunity to contribute to your engineering team.\n\nThroughout my career at TechNova Solutions, I have successfully scaled backend microservices to process over 1 million daily requests while optimizing frontend performance. My experience aligns closely with your tech stack, and I thrive in collaborative environments focused on innovation and high-quality software delivery.\n\nThank you for considering my application. I look forward to discussing how my technical background and problem-solving skills make me a great fit for Acme Innovations.",
        closing: "Sincerely,\nAlex Rivera"
      }
    });
  };

  const handleGenerateSummary = async () => {
    const jobTitle = resumeData.personalInfo?.jobTitle;
    if (!jobTitle || !jobTitle.trim()) {
      alert("Please enter a Job Title in 'Personal Details' first.");
      return;
    }
    setAiSummaryLoading(true);
    setAiSummarySuggestions(null);
    try {
      const suggestions = await generateSummary(jobTitle);
      setAiSummarySuggestions(suggestions);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to generate summary from AI. Make sure GEMINI_API_KEY is configured.");
    } finally {
      setAiSummaryLoading(false);
    }
  };

  const handleGenerateCoverLetterAI = async () => {
    setAiCoverLoading(true);
    try {
      const result = await generateCoverLetter({
        fullName: resumeData.personalInfo?.fullName,
        jobTitle: resumeData.coverLetter?.jobTitle || resumeData.personalInfo?.jobTitle,
        companyName: resumeData.coverLetter?.companyName,
        skills: resumeData.skills
      });
      setResumeData({
        ...resumeData,
        coverLetter: {
          ...resumeData.coverLetter,
          body: result.coverLetterText
        }
      });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to generate cover letter from AI.");
    } finally {
      setAiCoverLoading(false);
    }
  };

  const handleGenerateExperience = async (index) => {
    const positionTitle = resumeData.experience[index]?.role;
    if (!positionTitle || !positionTitle.trim()) {
      alert("Please enter a Role/Job Title for this work experience first.");
      return;
    }
    setExperienceLoadingIndex(index);
    try {
      const result = await generateExperience(positionTitle);
      const currentDescription = resumeData.experience[index]?.description || "";
      const separator = currentDescription ? "\n" : "";
      
      handleArrayChange("experience", index, "description", currentDescription + separator + result.bullets);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to generate experience bullet points. Make sure GEMINI_API_KEY is configured.");
    } finally {
      setExperienceLoadingIndex(null);
    }
  };

  const handleScanSummary = () => {
    if (!resumeData.summary || !resumeData.summary.trim()) {
      alert("Please write or generate a Professional Summary first.");
      return;
    }
    if (onOpenAIDetector) {
      onOpenAIDetector({
        title: "Professional Summary AI Audit",
        sectionType: "Professional Summary",
        text: resumeData.summary,
        jobTitle: resumeData.personalInfo?.jobTitle || "",
        onApply: (humanizedText) => {
          setResumeData(prev => ({ ...prev, summary: humanizedText }));
        }
      });
    }
  };

  const handleScanExperience = (index) => {
    const exp = resumeData.experience[index];
    if (!exp?.description || !exp.description.trim()) {
      alert("Please enter a description or bullet points for this work experience first.");
      return;
    }
    if (onOpenAIDetector) {
      onOpenAIDetector({
        title: `Work Experience AI Audit: ${exp.role || "Job Entry"}`,
        sectionType: "Work Experience",
        text: exp.description,
        jobTitle: exp.role || resumeData.personalInfo?.jobTitle || "",
        onApply: (humanizedText) => {
          handleArrayChange("experience", index, "description", humanizedText);
        }
      });
    }
  };

  const handleScanCoverLetter = () => {
    const letterBody = resumeData.coverLetter?.body;
    if (!letterBody || !letterBody.trim()) {
      alert("Please write or generate a Cover Letter first.");
      return;
    }
    if (onOpenAIDetector) {
      onOpenAIDetector({
        title: "Cover Letter AI Content Audit",
        sectionType: "Cover Letter",
        text: letterBody,
        jobTitle: resumeData.coverLetter?.jobTitle || resumeData.personalInfo?.jobTitle || "",
        onApply: (humanizedText) => {
          setResumeData(prev => ({
            ...prev,
            coverLetter: {
              ...(prev.coverLetter || {}),
              body: humanizedText
            }
          }));
        }
      });
    }
  };

  const handlePersonalChange = (e) => {
    setResumeData({
      ...resumeData,
      personalInfo: {
        ...resumeData.personalInfo,
        [e.target.name]: e.target.value
      }
    });
  };

  const handleCoverLetterChange = (e) => {
    setResumeData({
      ...resumeData,
      coverLetter: {
        ...(resumeData.coverLetter || {}),
        [e.target.name]: e.target.value
      }
    });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await uploadImage(formData);
      setResumeData({
        ...resumeData,
        image: response.imagePath
      });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to upload image");
    }
  };

  // Generic handlers for arrays
  const addArrayItem = (key, defaultObj) => {
    setResumeData({
      ...resumeData,
      [key]: [...resumeData[key], defaultObj]
    });
  };

  const removeArrayItem = (key, index) => {
    const updated = [...resumeData[key]];
    updated.splice(index, 1);
    setResumeData({
      ...resumeData,
      [key]: updated
    });
  };

  const handleArrayChange = (key, index, field, value) => {
    const updated = [...resumeData[key]];
    updated[index] = {
      ...updated[index],
      [field]: value
    };
    setResumeData({
      ...resumeData,
      [key]: updated
    });
  };

  // Skills
  const addSkill = (e) => {
    e.preventDefault();
    if (!skillInput.trim()) return;
    if (!resumeData.skills.includes(skillInput.trim())) {
      setResumeData({
        ...resumeData,
        skills: [...resumeData.skills, skillInput.trim()]
      });
    }
    setSkillInput("");
  };

  const removeSkill = (skillToRemove) => {
    setResumeData({
      ...resumeData,
      skills: resumeData.skills.filter((s) => s !== skillToRemove)
    });
  };

  const sections = [
    { id: "design", label: "Layout & Theme", subtitle: "Template styles, typography & color accents", icon: "🎨" },
    { id: "personal", label: "Personal Details", subtitle: "Name, headline, contact info & photo", icon: "👤" },
    { id: "summary", label: "Professional Summary", subtitle: "Executive pitch, 1-click AI & humanizer", icon: "📝" },
    { id: "experience", label: "Work Experience", subtitle: "Roles, achievements & STAR formula bullets", icon: "💼" },
    { id: "education", label: "Education", subtitle: "Degrees, institutions & academic honors", icon: "🎓" },
    { id: "projects", label: "Projects", subtitle: "Key builds, technologies & public links", icon: "💻" },
    { id: "skills", label: "Skills & Keywords", subtitle: "Core competencies & ATS keyword tags", icon: "⚡" },
    { id: "coverLetter", label: "Cover Letter", subtitle: "Tailored letter with Gemini AI", icon: "✉️" }
  ];

  const templates = [
    { id: "Modern", title: "Modern Professional", badge: "Balanced", desc: "Two-column layout with header accent and optimal space efficiency." },
    { id: "Minimalist", title: "Minimalist Clean", badge: "ATS Best", desc: "Single-column classic hierarchy with flawless ATS readability." },
    { id: "Creative", title: "Creative Tech", badge: "Modern", desc: "Distinctive accent sidebar with tech tag layout and photo support." },
    { id: "Executive", title: "Executive Split", badge: "Senior", desc: "Full-bleed left colored sidebar for high-density executive profiles." }
  ];

  const themeColors = [
    "#aa3bff", // Vibrant Purple
    "#3b82f6", // Royal Blue
    "#10b981", // Emerald Green
    "#ef4444", // Crimson Red
    "#f59e0b", // Amber Orange
    "#111827", // Dark Slate
    "#0d9488"  // Teal
  ];

  return (
    <div className="resume-form-container">
      {/* Accordion headers */}
      {sections.map((sec) => (
        <div key={sec.id} className={`form-accordion-item ${activeSection === sec.id ? "active" : ""}`}>
          <button
            type="button"
            className="accordion-header"
            onClick={() => setActiveSection(activeSection === sec.id ? "" : sec.id)}
          >
            <div className="accordion-header-left">
              <div className="accordion-icon-halo">{sec.icon}</div>
              <div className="accordion-text-stack">
                <span className="accordion-title">{sec.label}</span>
                <span className="accordion-subtitle">{sec.subtitle}</span>
              </div>
            </div>
            <svg className="accordion-chevron-svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>

          {activeSection === sec.id && (
            <div className="accordion-content">
              {/* LAYOUT & THEME SECTION */}
              {sec.id === "design" && (
                <div className="design-section-grid">
                  <div className="form-group">
                    <label>Choose Resume Template</label>
                    <div className="template-cards-grid">
                      {templates.map((tpl) => (
                        <div
                          key={tpl.id}
                          className={`template-card ${resumeData.template === tpl.id ? "active" : ""}`}
                          onClick={() => setResumeData({ ...resumeData, template: tpl.id })}
                        >
                          <div className="template-card-header">
                            <span className="template-card-title">{tpl.title}</span>
                            <span className="template-card-badge">{tpl.badge}</span>
                          </div>
                          <p className="template-card-desc">{tpl.desc}</p>
                        </div>
                      ))}
                    </div>

                    <select
                      value={resumeData.template}
                      onChange={(e) => setResumeData({ ...resumeData, template: e.target.value })}
                      style={{ display: "none" }}
                    >
                      <option value="Modern">Modern Professional</option>
                      <option value="Minimalist">Minimalist / Clean</option>
                      <option value="Creative">Creative / Tech</option>
                      <option value="Executive">Executive / Double-Column</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Select Accent Theme Color</label>
                    <div className="color-palette">
                      {themeColors.map((color) => {
                        const isSelected = resumeData.colorTheme === color;
                        return (
                          <button
                            key={color}
                            type="button"
                            className={`color-bubble ${isSelected ? "selected" : ""}`}
                            style={{ 
                              backgroundColor: color,
                              ...(isSelected ? { 
                                borderColor: "var(--bg-card)", 
                                boxShadow: `0 0 0 3px ${color}` 
                              } : {})
                            }}
                            onClick={() => setResumeData({ ...resumeData, colorTheme: color })}
                            title={color}
                          />
                        );
                      })}
                      <label 
                        className={`custom-color-picker-wrapper ${!themeColors.includes(resumeData.colorTheme) ? "selected" : ""}`}
                        style={{ 
                          backgroundColor: resumeData.colorTheme,
                          ...(!themeColors.includes(resumeData.colorTheme) ? {
                            borderColor: "var(--bg-card)",
                            boxShadow: `0 0 0 3px ${resumeData.colorTheme}`
                          } : {})
                        }}
                        title="Custom Color Picker"
                      >
                        <input
                          type="color"
                          value={resumeData.colorTheme}
                          onChange={(e) => setResumeData({ ...resumeData, colorTheme: e.target.value })}
                        />
                        <span className="picker-icon">🎨</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* PERSONAL DETAILS SECTION */}
              {sec.id === "personal" && (
                <div className="personal-section-grid">
                  <div className="image-upload-wrapper">
                    <div className="image-preview-circle">
                      {resumeData.image ? (
                        <img src={`${ASSET_URL}${resumeData.image}`} alt="Profile" />
                      ) : (
                        <span>No Photo</span>
                      )}
                    </div>
                    <div className="image-upload-input-group">
                      <label htmlFor="profile-image-upload" className="custom-file-upload">
                        Upload Profile Photo
                      </label>
                      <input
                        id="profile-image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                      <p className="upload-help-text">JPG, PNG or WebP. Max 5MB.</p>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      value={resumeData.personalInfo.fullName}
                      onChange={handlePersonalChange}
                      placeholder="e.g. John Doe"
                    />
                  </div>

                  <div className="form-group">
                    <label>Job Title / Headline</label>
                    <input
                      type="text"
                      name="jobTitle"
                      value={resumeData.personalInfo.jobTitle}
                      onChange={handlePersonalChange}
                      placeholder="e.g. Senior Software Engineer"
                    />
                  </div>

                  <div className="form-group-row">
                    <div className="form-group">
                      <label>Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={resumeData.personalInfo.email}
                        onChange={handlePersonalChange}
                        placeholder="e.g. johndoe@example.com"
                      />
                    </div>
                    <div className="form-group">
                      <label>Phone Number</label>
                      <input
                        type="text"
                        name="phone"
                        value={resumeData.personalInfo.phone}
                        onChange={handlePersonalChange}
                        placeholder="e.g. +1 (555) 019-2834"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Location / Address</label>
                    <input
                      type="text"
                      name="address"
                      value={resumeData.personalInfo.address}
                      onChange={handlePersonalChange}
                      placeholder="e.g. San Francisco, CA"
                    />
                  </div>
                </div>
              )}

              {/* SUMMARY SECTION */}
              {sec.id === "summary" && (
                <div className="form-group">
                  <div className="flex justify-between items-center" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem", flexWrap: "wrap", gap: "0.5rem" }}>
                    <label style={{ marginBottom: 0 }}>Professional Summary</label>
                    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                      <button
                        type="button"
                        onClick={handleScanSummary}
                        className="ai-detect-badge-btn"
                        title="Scan summary for AI patterns and 1-click humanize"
                      >
                        🛡️ Scan AI & Humanize
                      </button>
                      <button
                        type="button"
                        onClick={handleGenerateSummary}
                        disabled={aiSummaryLoading}
                        className="ai-action-btn"
                      >
                        {aiSummaryLoading ? "🤖 Generating..." : "🤖 Generate with Gemini AI"}
                      </button>
                    </div>
                  </div>
                  <textarea
                    rows="6"
                    value={resumeData.summary}
                    onChange={(e) => setResumeData({ ...resumeData, summary: e.target.value })}
                    placeholder="Briefly describe your career objectives, skills, and top achievements..."
                  />
                  {aiSummarySuggestions && (
                    <div className="ai-suggestions-container" style={{ marginTop: "1rem" }}>
                      <h5 style={{ fontWeight: 600, fontSize: "0.9rem", marginBottom: "0.5rem" }}>AI Suggestions (Click to apply):</h5>
                      <div className="ai-suggestions-grid" style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                        {aiSummarySuggestions.map((item, index) => (
                          <div 
                            key={index} 
                            onClick={() => {
                              setResumeData({ ...resumeData, summary: item.summary });
                              setAiSummarySuggestions(null);
                            }}
                            className="ai-suggestion-card"
                            style={{ 
                              background: "var(--bg-card-hover)", 
                              border: "1px solid var(--border)", 
                              borderRadius: "6px", 
                              padding: "0.75rem 1rem", 
                              cursor: "pointer",
                              transition: "all 0.2s ease"
                            }}
                          >
                            <span className="ai-suggestion-level" style={{ color: "var(--primary)", fontWeight: "bold", fontSize: "0.8rem", textTransform: "uppercase" }}>Level: {item.experience_level}</span>
                            <p style={{ margin: "0.25rem 0 0", fontSize: "0.85rem", color: "var(--text-main)", textShadow: "none" }}>{item.summary}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* EXPERIENCE SECTION */}
              {sec.id === "experience" && (
                <div className="dynamic-list">
                  {resumeData.experience.map((exp, idx) => (
                    <div key={idx} className="dynamic-item-card">
                      <div className="dynamic-item-header">
                        <h4>Job Entry #{idx + 1}</h4>
                        <button
                          type="button"
                          className="remove-item-btn"
                          onClick={() => removeArrayItem("experience", idx)}
                        >
                          ✕ Remove
                        </button>
                      </div>

                      <div className="form-group-row">
                        <div className="form-group">
                          <label>Company</label>
                          <input
                            type="text"
                            value={exp.company}
                            onChange={(e) => handleArrayChange("experience", idx, "company", e.target.value)}
                            placeholder="e.g. Google"
                          />
                        </div>
                        <div className="form-group">
                          <label>Role</label>
                          <input
                            type="text"
                            value={exp.role}
                            onChange={(e) => handleArrayChange("experience", idx, "role", e.target.value)}
                            placeholder="e.g. Frontend Developer"
                          />
                        </div>
                      </div>

                      <div className="form-group-row">
                        <div className="form-group">
                          <label>Start Date</label>
                          <input
                            type="text"
                            value={exp.startDate}
                            onChange={(e) => handleArrayChange("experience", idx, "startDate", e.target.value)}
                            placeholder="e.g. Jun 2023"
                          />
                        </div>
                        <div className="form-group">
                          <label>End Date</label>
                          <input
                            type="text"
                            value={exp.endDate}
                            onChange={(e) => handleArrayChange("experience", idx, "endDate", e.target.value)}
                            placeholder="e.g. Present"
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <div className="flex justify-between items-center" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem", flexWrap: "wrap", gap: "0.5rem" }}>
                          <label style={{ marginBottom: 0 }}>Description / Core Responsibilities</label>
                          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                            <button
                              type="button"
                              onClick={() => handleScanExperience(idx)}
                              className="ai-detect-badge-btn"
                              title="Audit this job entry for AI patterns and 1-click humanize"
                            >
                              🛡️ Audit AI & Humanize
                            </button>
                            <button
                              type="button"
                              onClick={() => handleGenerateExperience(idx)}
                              disabled={experienceLoadingIndex === idx}
                              className="ai-action-btn"
                            >
                              {experienceLoadingIndex === idx ? "🤖 Suggesting..." : "🤖 AI Suggest Bullets"}
                            </button>
                          </div>
                        </div>
                        <textarea
                          rows="4"
                          value={exp.description}
                          onChange={(e) => handleArrayChange("experience", idx, "description", e.target.value)}
                          placeholder="Implemented key features..."
                        />
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="add-item-btn"
                    onClick={() =>
                      addArrayItem("experience", {
                        company: "",
                        role: "",
                        startDate: "",
                        endDate: "",
                        description: ""
                      })
                    }
                  >
                    + Add Experience
                  </button>
                </div>
              )}

              {/* EDUCATION SECTION */}
              {sec.id === "education" && (
                <div className="dynamic-list">
                  {resumeData.education.map((edu, idx) => (
                    <div key={idx} className="dynamic-item-card">
                      <div className="dynamic-item-header">
                        <h4>Education Entry #{idx + 1}</h4>
                        <button
                          type="button"
                          className="remove-item-btn"
                          onClick={() => removeArrayItem("education", idx)}
                        >
                          ✕ Remove
                        </button>
                      </div>

                      <div className="form-group-row">
                        <div className="form-group">
                          <label>School / University</label>
                          <input
                            type="text"
                            value={edu.school}
                            onChange={(e) => handleArrayChange("education", idx, "school", e.target.value)}
                            placeholder="e.g. Stanford University"
                          />
                        </div>
                        <div className="form-group">
                          <label>Degree / Field of Study</label>
                          <input
                            type="text"
                            value={edu.degree}
                            onChange={(e) => handleArrayChange("education", idx, "degree", e.target.value)}
                            placeholder="e.g. B.S. in Computer Science"
                          />
                        </div>
                      </div>

                      <div className="form-group-row">
                        <div className="form-group">
                          <label>Start Date</label>
                          <input
                            type="text"
                            value={edu.startDate}
                            onChange={(e) => handleArrayChange("education", idx, "startDate", e.target.value)}
                            placeholder="e.g. Sep 2019"
                          />
                        </div>
                        <div className="form-group">
                          <label>End Date</label>
                          <input
                            type="text"
                            value={edu.endDate}
                            onChange={(e) => handleArrayChange("education", idx, "endDate", e.target.value)}
                            placeholder="e.g. Jun 2023"
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label>Additional Details (GPA, Honors, etc.)</label>
                        <textarea
                          rows="3"
                          value={edu.description}
                          onChange={(e) => handleArrayChange("education", idx, "description", e.target.value)}
                          placeholder="Minor in Mathematics, GPA 3.9..."
                        />
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="add-item-btn"
                    onClick={() =>
                      addArrayItem("education", {
                        school: "",
                        degree: "",
                        startDate: "",
                        endDate: "",
                        description: ""
                      })
                    }
                  >
                    + Add Education
                  </button>
                </div>
              )}

              {/* PROJECTS SECTION */}
              {sec.id === "projects" && (
                <div className="dynamic-list">
                  {resumeData.projects.map((proj, idx) => (
                    <div key={idx} className="dynamic-item-card">
                      <div className="dynamic-item-header">
                        <h4>Project Entry #{idx + 1}</h4>
                        <button
                          type="button"
                          className="remove-item-btn"
                          onClick={() => removeArrayItem("projects", idx)}
                        >
                          ✕ Remove
                        </button>
                      </div>

                      <div className="form-group-row">
                        <div className="form-group">
                          <label>Project Title</label>
                          <input
                            type="text"
                            value={proj.title}
                            onChange={(e) => handleArrayChange("projects", idx, "title", e.target.value)}
                            placeholder="e.g. E-Commerce Platform"
                          />
                        </div>
                        <div className="form-group">
                          <label>Project Link</label>
                          <input
                            type="url"
                            value={proj.link}
                            onChange={(e) => handleArrayChange("projects", idx, "link", e.target.value)}
                            placeholder="e.g. https://github.com/myproject"
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label>Technologies Used</label>
                        <input
                          type="text"
                          value={proj.technologies}
                          onChange={(e) => handleArrayChange("projects", idx, "technologies", e.target.value)}
                          placeholder="e.g. React, Node.js, Socket.io, CSS"
                        />
                      </div>

                      <div className="form-group">
                        <label>Project Description</label>
                        <textarea
                          rows="4"
                          value={proj.description}
                          onChange={(e) => handleArrayChange("projects", idx, "description", e.target.value)}
                          placeholder="Detail the architecture, your role, and quantitative outcomes..."
                        />
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="add-item-btn"
                    onClick={() =>
                      addArrayItem("projects", {
                        title: "",
                        description: "",
                        technologies: "",
                        link: ""
                      })
                    }
                  >
                    + Add Project
                  </button>
                </div>
              )}

              {/* SKILLS SECTION */}
              {sec.id === "skills" && (
                <div className="skills-section-form">
                  <form onSubmit={addSkill} className="skills-input-row">
                    <input
                      type="text"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      placeholder="Type a skill and press Enter or click Add (e.g. Docker, TypeScript)"
                    />
                    <button type="submit" className="add-skill-btn">
                      + Add
                    </button>
                  </form>

                  {/* Quick Recommended Keyword Chips */}
                  <div className="skills-suggestions-row">
                    <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 600 }}>
                      Quick Suggestions:
                    </span>
                    {[
                      "React.js",
                      "Node.js",
                      "TypeScript",
                      "Python",
                      "MongoDB",
                      "PostgreSQL",
                      "Docker",
                      "AWS",
                      "REST APIs",
                      "Tailwind CSS",
                      "System Design"
                    ].map((sug) => (
                      <button
                        key={sug}
                        type="button"
                        className="skills-suggestion-chip"
                        onClick={() => {
                          if (!resumeData.skills.includes(sug)) {
                            setResumeData({
                              ...resumeData,
                              skills: [...resumeData.skills, sug]
                            });
                          }
                        }}
                        style={{
                          opacity: resumeData.skills.includes(sug) ? 0.45 : 1,
                          cursor: resumeData.skills.includes(sug) ? "default" : "pointer"
                        }}
                        disabled={resumeData.skills.includes(sug)}
                        title={resumeData.skills.includes(sug) ? "Already added" : "Click to add"}
                      >
                        + {sug}
                      </button>
                    ))}
                  </div>

                  <div className="skills-tag-container">
                    {resumeData.skills.map((skill, idx) => (
                      <span key={idx} className="skill-tag">
                        {skill}
                        <button
                          type="button"
                          className="remove-skill-tag"
                          onClick={() => removeSkill(skill)}
                          title="Remove skill"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                    {resumeData.skills.length === 0 && (
                      <p className="no-skills-text">No skills added yet. Type above or click any suggested keyword.</p>
                    )}
                  </div>
                </div>
              )}

              {/* COVER LETTER SECTION */}
              {sec.id === "coverLetter" && (
                <div className="cover-letter-form-grid">
                  <div className="form-group-row">
                    <div className="form-group">
                      <label>Recipient Name</label>
                      <input
                        type="text"
                        name="recipientName"
                        value={resumeData.coverLetter?.recipientName || ""}
                        onChange={handleCoverLetterChange}
                        placeholder="e.g. Sarah Jenkins"
                      />
                    </div>
                    <div className="form-group">
                      <label>Recipient Title</label>
                      <input
                        type="text"
                        name="recipientTitle"
                        value={resumeData.coverLetter?.recipientTitle || ""}
                        onChange={handleCoverLetterChange}
                        placeholder="e.g. Hiring Manager"
                      />
                    </div>
                  </div>

                  <div className="form-group-row">
                    <div className="form-group">
                      <label>Company Name</label>
                      <input
                        type="text"
                        name="companyName"
                        value={resumeData.coverLetter?.companyName || ""}
                        onChange={handleCoverLetterChange}
                        placeholder="e.g. Acme Innovations Inc."
                      />
                    </div>
                    <div className="form-group">
                      <label>Target Job Title</label>
                      <input
                        type="text"
                        name="jobTitle"
                        value={resumeData.coverLetter?.jobTitle || resumeData.personalInfo?.jobTitle || ""}
                        onChange={handleCoverLetterChange}
                        placeholder="e.g. Senior Software Engineer"
                      />
                    </div>
                  </div>

                  <div className="form-group-row">
                    <div className="form-group">
                      <label>Letter Date</label>
                      <input
                        type="text"
                        name="letterDate"
                        value={resumeData.coverLetter?.letterDate || ""}
                        onChange={handleCoverLetterChange}
                        placeholder="e.g. August 19, 2026"
                      />
                    </div>
                    <div className="form-group">
                      <label>Salutation</label>
                      <input
                        type="text"
                        name="salutation"
                        value={resumeData.coverLetter?.salutation || "Dear Hiring Manager,"}
                        onChange={handleCoverLetterChange}
                        placeholder="e.g. Dear Ms. Jenkins,"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <div className="flex justify-between items-center" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem", flexWrap: "wrap", gap: "0.5rem" }}>
                      <label style={{ marginBottom: 0 }}>Letter Body Paragraphs</label>
                      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                        <button
                          type="button"
                          onClick={handleScanCoverLetter}
                          className="ai-detect-badge-btn"
                          title="Audit cover letter for AI patterns and humanize"
                        >
                          🛡️ Scan AI & Humanize
                        </button>
                        <button
                          type="button"
                          onClick={handleGenerateCoverLetterAI}
                          disabled={aiCoverLoading}
                          className="ai-action-btn"
                        >
                          {aiCoverLoading ? "🤖 Generating..." : "🤖 Generate Cover Letter with Gemini AI"}
                        </button>
                      </div>
                    </div>
                    <textarea
                      rows="8"
                      name="body"
                      value={resumeData.coverLetter?.body || ""}
                      onChange={handleCoverLetterChange}
                      placeholder="Write or generate your cover letter content..."
                    />
                  </div>

                  <div className="form-group">
                    <label>Sign-off / Closing</label>
                    <input
                      type="text"
                      name="closing"
                      value={resumeData.coverLetter?.closing || "Sincerely,\n" + (resumeData.personalInfo?.fullName || "")}
                      onChange={handleCoverLetterChange}
                      placeholder="e.g. Sincerely, John Doe"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ResumeForm;