import React, { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getResumes, deleteResume, ASSET_URL } from "../services/api";
import AIDetectorModal from "../components/AIDetectorModal";

const Dashboard = () => {
  const navigate = useNavigate();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTemplateFilter, setSelectedTemplateFilter] = useState("All");

  // AI Detector modal state
  const [auditModalOpen, setAuditModalOpen] = useState(false);
  const [auditConfig, setAuditConfig] = useState({
    text: "",
    title: "",
    sectionType: "Full Resume",
    jobTitle: ""
  });

  const fetchResumes = async () => {
    try {
      setLoading(true);
      const data = await getResumes();
      setResumes(data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch resumes. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const handleAuditResume = (resume) => {
    const sections = [];
    if (resume.summary?.trim()) sections.push(`[Summary]\n${resume.summary.trim()}`);
    if (resume.experience?.length) {
      const expText = resume.experience
        .filter((e) => e.description?.trim())
        .map((e) => `${e.role || "Role"} at ${e.company || "Company"}:\n${e.description.trim()}`)
        .join("\n\n");
      if (expText) sections.push(`[Experience]\n${expText}`);
    }
    if (resume.projects?.length) {
      const pText = resume.projects
        .filter((p) => p.description?.trim())
        .map((p) => `${p.title}:\n${p.description.trim()}`)
        .join("\n\n");
      if (pText) sections.push(`[Projects]\n${pText}`);
    }
    const fullText = sections.join("\n\n---\n\n");
    if (!fullText || fullText.length < 15) {
      alert("This resume doesn't have enough content to audit yet. Open the editor and add summary or experience details.");
      return;
    }
    setAuditConfig({
      text: fullText,
      title: `AI Authenticity Audit: ${resume.title}`,
      sectionType: "Comprehensive Resume",
      jobTitle: resume.personalInfo?.jobTitle || ""
    });
    setAuditModalOpen(true);
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        await deleteResume(id);
        setResumes(resumes.filter((resume) => resume._id !== id));
      } catch (err) {
        console.error(err);
        alert("Failed to delete resume.");
      }
    }
  };

  // Filter resumes by search query and template
  const filteredResumes = useMemo(() => {
    return resumes.filter((r) => {
      const matchesSearch =
        r.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.personalInfo?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.personalInfo?.jobTitle?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTemplate =
        selectedTemplateFilter === "All" || (r.template || "Modern") === selectedTemplateFilter;
      return matchesSearch && matchesTemplate;
    });
  }, [resumes, searchQuery, selectedTemplateFilter]);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-orbit-spinner">
          <div className="orbit-dot dot-1"></div>
          <div className="orbit-dot dot-2"></div>
          <div className="orbit-dot dot-3"></div>
        </div>
        <p className="loading-text">Loading your Resume AI Builder workspace...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page-wrapper">
      {/* Ambient background glow elements */}
      <div className="ambient-glow glow-top-left"></div>
      <div className="ambient-glow glow-top-right"></div>
      <div className="ambient-glow glow-center"></div>

      <div className="dashboard-container">
        {/* Hero Command Deck */}
        <div className="dash-hero-deck">
          <div className="hero-grid-backdrop"></div>
          
          <div className="dash-hero-content">


            <h1 className="hero-display-title">
              Craft Resumes That <span className="gradient-shimmer-text">Land Top Offers</span>
            </h1>

            <p className="hero-display-subtitle">
              Beat 99% of Applicant Tracking Systems with real-time semantic keyword matching,
              instant PDF/DOCX import, and precision ATS gap analysis.
            </p>
          </div>

          {/* Interactive Readiness Widget */}
          <div className="dash-readiness-widget">
            <div className="widget-header">
              <span className="widget-tag">CAREER READINESS</span>
              <span className="widget-live-dot"></span>
            </div>

            <div className="widget-gauge-row">
              <div className="radial-gauge-wrap">
                <svg viewBox="0 0 100 100" className="radial-gauge-svg">
                  <circle cx="50" cy="50" r="42" className="gauge-bg" />
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    className="gauge-progress"
                    strokeDasharray="264"
                    strokeDashoffset="24"
                  />
                </svg>
                <div className="gauge-center-text">
                  <span className="gauge-num">95%</span>
                  <span className="gauge-lbl">ATS INDEX</span>
                </div>
              </div>

              <div className="widget-info-block">
                <h4>Exceptional</h4>
                <p>High callback probability across Fortune 500 ATS systems</p>
                <div className="widget-stats-mini">
                  <div className="mini-stat">
                    <span className="num">{resumes.length}</span>
                    <span className="lbl">Resumes</span>
                  </div>
                  <div className="mini-divider"></div>
                  <div className="mini-stat">
                    <span className="num">Gemini 3.5</span>
                    <span className="lbl">AI Model</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="widget-checklist">
              <div className="check-item"><span className="check-icon">✓</span> Semantic Keyword Matching Active</div>
              <div className="check-item"><span className="check-icon">✓</span> PDF / DOCX Buffer Parser Connected</div>
              <div className="check-item"><span className="check-icon">✓</span> AI Authenticity Detector Enabled</div>
            </div>
          </div>
        </div>

        {/* The Core AI Modules */}
        <div className="suite-section-header">
          <div className="section-title-wrap">
            <span className="section-kicker">INTELLIGENT TOOLS</span>
            <h2>Flagship AI Modules</h2>
          </div>
        </div>

        <div className="dash-tools-grid-v2">
          {/* Card 1: ATS Beater */}
          <Link to="/ats-matcher" className="tool-card-v2 card-ats-beater">
            <div className="card-top-row">
              <div className="tool-icon-halo icon-ats">🎯</div>
              <span className="tool-pill-tag tag-hot">HOT • ATS BEATER</span>
            </div>
            <div className="card-main-text">
              <h3>ATS Keyword Matcher</h3>
              <p>Compare your resume against any job description. Detect missing keywords and preview a transformative Before vs After score boost.</p>
            </div>
            <div className="card-footer-meta">
              <span className="meta-metric">+32% Match Boost</span>
              <span className="card-cta-link">Launch Matcher ➔</span>
            </div>
          </Link>

          {/* Card 2: Resume Parser */}
          <Link to="/resume-parser" className="tool-card-v2 card-parser">
            <div className="card-top-row">
              <div className="tool-icon-halo icon-parser">📤</div>
              <span className="tool-pill-tag tag-instant">INSTANT IMPORT</span>
            </div>
            <div className="card-main-text">
              <h3>Resume Upload & Parser</h3>
              <p>Drag and drop existing PDF or Word resumes. Gemini AI extracts contact info, skills, and work history directly into the editor.</p>
            </div>
            <div className="card-footer-meta">
              <span className="meta-metric">PDF • DOCX • Word</span>
              <span className="card-cta-link">Upload File ➔</span>
            </div>
          </Link>

          {/* Card 3: CoverCraft Academic Cover Pages */}
          <Link to="/templates" className="tool-card-v2 card-covercraft">
            <div className="card-top-row">
              <div className="tool-icon-halo icon-covercraft">📑</div>
              <span className="tool-pill-tag tag-new">NEW • COVERCRAFT</span>
            </div>
            <div className="card-main-text">
              <h3>Academic Cover Page Generator</h3>
              <p>Design professional assignment and report cover pages with 6 academic templates, solo/group student submission, and instant PDF download.</p>
            </div>
            <div className="card-footer-meta">
              <span className="meta-metric">6 Templates • Solo/Group</span>
              <span className="card-cta-link">Explore Templates ➔</span>
            </div>
          </Link>
        </div>

        {/* Resumes Document Showcase */}
        <div className="resumes-section-wrap">
          <div className="resumes-bar">
            <div>
              <span className="section-kicker">DOCUMENT WORKSPACE</span>
              <h2>My Resumes & CVs ({resumes.length})</h2>
            </div>

            {/* Filter and Search Bar */}
            <div className="resumes-filter-controls">
              <div className="resume-search-input-wrap">
                <span className="search-icon">🔍</span>
                <input
                  type="text"
                  placeholder="Search resumes by title or role..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="resume-search-field"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="clear-search-btn">
                    ✕
                  </button>
                )}
              </div>

              <div className="template-pills-row">
                {["All", "Modern", "Minimalist", "Creative", "Executive"].map((tmpl) => (
                  <button
                    key={tmpl}
                    onClick={() => setSelectedTemplateFilter(tmpl)}
                    className={`template-filter-pill ${selectedTemplateFilter === tmpl ? "active" : ""}`}
                  >
                    {tmpl}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {error && <div className="dashboard-error-box">{error}</div>}

          {/* Resumes Grid */}
          {resumes.length === 0 ? (
            <div className="empty-state-card">
              <div className="empty-icon-orbit">📄</div>
              <h3>No resumes created yet</h3>
              <p>Kickstart your journey by building a new resume with AI assistance or uploading an existing PDF/DOCX file!</p>
              <div className="empty-state-buttons">
                <Link to="/editor/create" className="btn-glow-primary">
                  <span>+</span> Create First Resume
                </Link>
                <Link to="/resume-parser" className="btn-glass-secondary">
                  <span>📤</span> Upload PDF / DOCX
                </Link>
              </div>
            </div>
          ) : filteredResumes.length === 0 ? (
            <div className="no-filter-results">
              <p>No resumes match your current filter: "{searchQuery || selectedTemplateFilter}".</p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedTemplateFilter("All");
                }}
                className="reset-filter-btn"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="resume-cards-gallery">
              {filteredResumes.map((resume) => {
                const themeColor = resume.colorTheme || "#2563eb";
                const initials = (resume.personalInfo?.fullName || "Resume")
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .substring(0, 2)
                  .toUpperCase();

                return (
                  <div className="document-card-v2" key={resume._id}>
                    {/* Simulated Miniature Resume Canvas */}
                    <div className="document-sheet-preview">
                      {/* Top Accent Strip */}
                      <div className="sheet-accent-bar" style={{ backgroundColor: themeColor }}></div>

                      <div className="sheet-top-header">
                        <span className="sheet-badge-template" style={{ backgroundColor: themeColor }}>
                          {resume.template || "Modern"}
                        </span>
                        <span className="sheet-status-ready">✓ ATS READY</span>
                      </div>

                      <div className="sheet-applicant-block">
                        {resume.image ? (
                          <img src={`${ASSET_URL}${resume.image}`} alt="Profile" className="sheet-avatar-img" />
                        ) : (
                          <div className="sheet-avatar-initials" style={{ borderColor: themeColor }}>
                            {initials}
                          </div>
                        )}
                        <h4 className="sheet-name">{resume.personalInfo?.fullName || "Unnamed Candidate"}</h4>
                        <span className="sheet-role">{resume.personalInfo?.jobTitle || "Professional"}</span>
                      </div>

                      {/* Mock Content Lines */}
                      <div className="sheet-mock-lines">
                        <div className="mock-line w-full"></div>
                        <div className="mock-line w-80"></div>
                        <div className="mock-line-row">
                          <div className="mock-line w-40"></div>
                          <div className="mock-line w-50"></div>
                        </div>
                        <div className="mock-skills-dots">
                          <span className="mini-pill" style={{ borderColor: themeColor }}></span>
                          <span className="mini-pill"></span>
                          <span className="mini-pill"></span>
                        </div>
                      </div>
                    </div>

                    {/* Document Info & Actions */}
                    <div className="document-card-body">
                      <div className="doc-title-row">
                        <h3 title={resume.title}>{resume.title}</h3>
                        <span className="doc-theme-dot" style={{ backgroundColor: themeColor }} title={`Color Theme: ${themeColor}`}></span>
                      </div>
                      
                      <p className="doc-updated-timestamp">
                        Updated {new Date(resume.updatedAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                      </p>

                      {/* Action Buttons */}
                      <div className="doc-actions-suite">
                        <Link to={`/editor/${resume._id}`} className="doc-action-edit">
                          <span>✏️</span> Edit in Builder
                        </Link>
                        
                        <div className="doc-actions-secondary-row">
                          <Link
                            to="/ats-matcher"
                            className="doc-mini-action btn-ats"
                            title="Score this resume against a target job description"
                          >
                            🎯 Match JD
                          </Link>
                          <button
                            onClick={() => handleAuditResume(resume)}
                            className="doc-mini-action btn-audit"
                            title="Audit this resume for AI-generated text"
                          >
                            🛡️ AI Audit
                          </button>
                          <button
                            onClick={() => handleDelete(resume._id, resume.title)}
                            className="doc-mini-action btn-delete"
                            title="Delete resume"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Quick Card: Create New */}
              <Link to="/editor/create" className="quick-action-card-glass create-card">
                <div className="quick-card-icon-wrap plus-icon">+</div>
                <h4>Build New Resume</h4>
                <p>Create with live split-screen preview and AI assistance</p>
                <span className="quick-card-sub">Start from scratch ➔</span>
              </Link>

              {/* Quick Card: Upload PDF/Word */}
              <Link to="/resume-parser" className="quick-action-card-glass upload-card">
                <div className="quick-card-icon-wrap upload-icon">📤</div>
                <h4>Upload & Parse File</h4>
                <p>Import PDF, DOCX, or Word resume directly into the builder</p>
                <span className="quick-card-sub">Auto-extract ➔</span>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* AI Resume Detector Modal for Dashboard */}
      <AIDetectorModal
        isOpen={auditModalOpen}
        onClose={() => setAuditModalOpen(false)}
        initialText={auditConfig.text}
        title={auditConfig.title}
        sectionType={auditConfig.sectionType}
        jobTitle={auditConfig.jobTitle}
      />
    </div>
  );
};

export default Dashboard;
