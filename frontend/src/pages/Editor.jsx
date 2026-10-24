import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getResume, createResume, updateResume } from "../services/api";
import ResumeForm from "../components/ResumeForm";
import ResumePreview from "../components/ResumePreview";
import AIDetectorModal from "../components/AIDetectorModal";
import html2pdf from "html2pdf.js";
import { downloadAsWord } from "../utils/wordExport";

const defaultResumeState = {
  title: "My Resume",
  template: "Modern",
  colorTheme: "#aa3bff",
  image: "",
  personalInfo: {
    fullName: "",
    email: "",
    phone: "",
    address: "",
    jobTitle: ""
  },
  summary: "",
  education: [],
  experience: [],
  projects: [],
  skills: [],
  coverLetter: {
    companyName: "",
    recipientName: "",
    recipientTitle: "",
    jobTitle: "",
    letterDate: "",
    salutation: "Dear Hiring Manager,",
    body: "",
    closing: "Sincerely,"
  }
};

const Editor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resumeData, setResumeData] = useState(defaultResumeState);
  const [previewMode, setPreviewMode] = useState("resume"); // "resume" | "coverLetter"
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [previewZoom, setPreviewZoom] = useState(0.92);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // AI Detector Modal State
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiModalConfig, setAiModalConfig] = useState({
    title: "AI Authenticity Audit",
    sectionType: "Resume",
    text: "",
    jobTitle: "",
    onApply: null
  });

  const handleOpenAIDetector = (config) => {
    setAiModalConfig(config);
    setAiModalOpen(true);
  };

  const handleScanFullResume = () => {
    const sections = [];
    if (resumeData.summary?.trim()) {
      sections.push(`[Professional Summary]\n${resumeData.summary.trim()}`);
    }
    if (resumeData.experience?.length) {
      const expText = resumeData.experience
        .filter(e => e.description?.trim())
        .map(e => `Role: ${e.role || "Position"} at ${e.company || "Company"}\n${e.description.trim()}`)
        .join("\n\n");
      if (expText) sections.push(`[Work Experience]\n${expText}`);
    }
    if (resumeData.projects?.length) {
      const projText = resumeData.projects
        .filter(p => p.description?.trim())
        .map(p => `Project: ${p.title || "Project"}\n${p.description.trim()}`)
        .join("\n\n");
      if (projText) sections.push(`[Key Projects]\n${projText}`);
    }
    if (resumeData.coverLetter?.body?.trim()) {
      sections.push(`[Cover Letter]\n${resumeData.coverLetter.body.trim()}`);
    }

    const fullContent = sections.join("\n\n---\n\n");

    if (!fullContent || fullContent.length < 20) {
      alert("Please add some content to your resume (summary or work experience) before running the full AI scan.");
      return;
    }

    handleOpenAIDetector({
      title: "Comprehensive Resume AI Audit",
      sectionType: "Full Resume & Cover Letter",
      text: fullContent,
      jobTitle: resumeData.personalInfo?.jobTitle || "",
      onApply: null
    });
  };

  useEffect(() => {
    if (id) {
      const fetchResume = async () => {
        try {
          setLoading(true);
          const data = await getResume(id);
          setResumeData({
            ...defaultResumeState,
            ...data,
            personalInfo: {
              ...defaultResumeState.personalInfo,
              ...(data.personalInfo || {})
            },
            coverLetter: {
              ...defaultResumeState.coverLetter,
              ...(data.coverLetter || {})
            },
            education: data.education || [],
            experience: data.experience || [],
            projects: data.projects || [],
            skills: data.skills || []
          });
          setIsDirty(false);
        } catch (err) {
          console.error(err);
          setError("Failed to fetch resume details.");
        } finally {
          setLoading(false);
        }
      };
      fetchResume();
    } else {
      setResumeData({
        ...defaultResumeState,
        personalInfo: { ...defaultResumeState.personalInfo },
        coverLetter: { ...defaultResumeState.coverLetter },
        education: [],
        experience: [],
        projects: [],
        skills: []
      });
      setIsDirty(false);
    }
  }, [id]);

  const handleUpdateResumeData = (updater) => {
    setIsDirty(true);
    if (typeof updater === "function") {
      setResumeData(updater);
    } else {
      setResumeData(updater);
    }
  };

  const handleSave = async () => {
    setSaveLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      if (id) {
        const updated = await updateResume(id, resumeData);
        setResumeData(updated);
        setIsDirty(false);
        setSuccessMsg("Saved successfully!");
      } else {
        const created = await createResume(resumeData);
        setIsDirty(false);
        setSuccessMsg("Created successfully!");
        setTimeout(() => {
          navigate(`/editor/${created._id}`);
        }, 800);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to save.");
    } finally {
      setSaveLoading(false);
      setTimeout(() => setSuccessMsg(""), 3000);
    }
  };

  const handleDownloadPDF = () => {
    const element = document.getElementById("resume-preview-container");
    if (!element) return;

    const documentName = previewMode === "coverLetter" ? "CoverLetter" : "Resume";
    const filename = `${resumeData.personalInfo?.fullName || documentName}_${resumeData.title || "Resume"}.pdf`;

    const opt = {
      margin: 0,
      filename: filename,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { 
        scale: 2, 
        useCORS: true,
        logging: false,
        letterRendering: true
      },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
    };

    html2pdf().from(element).set(opt).save();
  };

  const handleDownloadWord = () => {
    const element = document.getElementById("resume-preview-container");
    if (!element) return;

    const documentName = previewMode === "coverLetter" ? "CoverLetter" : "Resume";
    const filename = `${resumeData.personalInfo?.fullName || documentName}_${resumeData.title || "Resume"}.docx`;

    downloadAsWord(element, filename);
  };

  if (loading) {
    return (
      <div className="editor-loading">
        <div className="spinner"></div>
        <p>Loading resume editor...</p>
      </div>
    );
  }

  return (
    <div className="editor-container">
      {/* Redesigned Executive Top Action Bar */}
      <div className="editor-topbar">
        {/* Left: Navigation & Document Title */}
        <div className="topbar-left">
          <Link to="/dashboard" className="back-to-dashboard" title="Return to Dashboard">
            <span>←</span> Dashboard
          </Link>

          <div className="topbar-divider" />

          <div className="resume-title-wrap">
            <span className="resume-title-icon">📄</span>
            <input
              type="text"
              className="resume-title-input"
              value={resumeData.title}
              onChange={(e) => {
                setResumeData({ ...resumeData, title: e.target.value });
                setIsDirty(true);
              }}
              placeholder="Resume Title (e.g. Senior Tech Lead CV)"
            />
            <span className={`topbar-status-badge ${isDirty ? "unsaved" : ""}`}>
              {isDirty ? "● Unsaved edits" : "✓ Saved"}
            </span>
          </div>
        </div>

        {/* Center: AI & Career Intelligence Toolkit */}
        <div className="topbar-center-tools">
          <Link
            to="/ats-matcher"
            className="topbar-tool-pill ats"
            title="Score this resume against a target job description"
          >
            🎯 ATS Scorer
          </Link>
          <Link
            to="/resume-parser"
            className="topbar-tool-pill import"
            title="Upload an existing PDF or DOCX resume to auto-fill"
          >
            📥 Import PDF/DOCX
          </Link>
          <button 
            onClick={handleScanFullResume} 
            className="topbar-ai-audit-pill"
            title="Scan entire resume for AI-generated text, burstiness, and ATS clichés"
          >
            🛡️ AI Authenticity Audit
          </button>
        </div>

        {/* Right: Cloud Save & High-Resolution Exports */}
        <div className="topbar-right">
          {successMsg && <span className="topbar-status-badge">{successMsg}</span>}
          {error && <span className="topbar-status-badge unsaved">{error}</span>}

          <button 
            onClick={handleSave} 
            className="topbar-save-btn" 
            disabled={saveLoading}
            title="Save changes to your account"
          >
            {saveLoading ? "💾 Saving..." : "💾 Save"}
          </button>

          <button 
            onClick={handleDownloadWord} 
            className="topbar-word-btn"
            title="Export standard editable Microsoft Word (.docx) file"
          >
            📝 Word (.docx)
          </button>

          <button 
            onClick={handleDownloadPDF} 
            className="topbar-pdf-btn"
            title="Generate high-resolution vector PDF document"
          >
            📄 Export PDF
          </button>
        </div>
      </div>

      {/* Main Split Screen Workspace */}
      <div className="editor-workspace">
        {/* Left Form Builder Panel */}
        <div className="editor-panel-form">
          <ResumeForm 
            resumeData={resumeData} 
            setResumeData={handleUpdateResumeData} 
            onOpenAIDetector={handleOpenAIDetector}
          />
        </div>

        {/* Right Live Preview Canvas Panel */}
        <div className="editor-panel-preview">
          {/* Fixed Header Toolbar with Mode Switcher & Zoom Deck */}
          <div className="preview-toolbar">
            <div className="preview-mode-capsule">
              <button
                className={`mode-capsule-btn ${previewMode === "resume" ? "active" : ""}`}
                onClick={() => setPreviewMode("resume")}
              >
                <span>📄</span> Resume Preview
              </button>
              <button
                className={`mode-capsule-btn ${previewMode === "coverLetter" ? "active" : ""}`}
                onClick={() => setPreviewMode("coverLetter")}
              >
                <span>✉️</span> Cover Letter
              </button>
            </div>

            <div className="preview-toolbar-controls">
              <div className="preview-zoom-group">
                <button
                  type="button"
                  className="zoom-btn"
                  onClick={() => setPreviewZoom((z) => Math.max(0.65, Number((z - 0.05).toFixed(2))))}
                  title="Zoom Out"
                >
                  −
                </button>
                <span className="zoom-text">{Math.round(previewZoom * 100)}%</span>
                <button
                  type="button"
                  className="zoom-btn"
                  onClick={() => setPreviewZoom((z) => Math.min(1.25, Number((z + 0.05).toFixed(2))))}
                  title="Zoom In"
                >
                  +
                </button>
                <button
                  type="button"
                  className="zoom-reset-btn"
                  onClick={() => setPreviewZoom((z) => (z === 1 ? 0.92 : 1))}
                  title="Toggle Fit / 100%"
                >
                  {previewZoom === 1 ? "Fit" : "100%"}
                </button>
              </div>

              <div className="preview-meta-badge">
                <span 
                  className="preview-meta-dot" 
                  style={{ backgroundColor: resumeData.colorTheme || "#aa3bff" }}
                />
                <span>{resumeData.template} Style</span>
              </div>
            </div>
          </div>

          {/* Paper Viewport */}
          <div className="preview-scroll-viewport">
            <div 
              className="preview-zoom-wrapper"
              style={{ 
                transform: `scale(${previewZoom})`, 
                transformOrigin: "top center",
                transition: "transform 0.15s ease" 
              }}
            >
              <ResumePreview resumeData={resumeData} mode={previewMode} />
            </div>
          </div>
        </div>
      </div>

      {/* AI Resume Detector & Humanizer Modal */}
      <AIDetectorModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        initialText={aiModalConfig.text}
        title={aiModalConfig.title}
        sectionType={aiModalConfig.sectionType}
        jobTitle={aiModalConfig.jobTitle}
        onApplyHumanized={aiModalConfig.onApply}
      />
    </div>
  );
};

export default Editor;
