import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { parseResumeFile, createResume } from "../services/api";
import ResumeAnalysisSection from "../components/ResumeAnalysisSection";
import ResumeProcessingHub from "../components/ResumeProcessingHub";

const ResumeParser = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentStage, setCurrentStage] = useState(0);
  const [progress, setProgress] = useState(15);
  const [error, setError] = useState("");
  const [parsedResult, setParsedResult] = useState(null);
  const [importing, setImporting] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showRawFields, setShowRawFields] = useState(false);

  useEffect(() => {
    let timeouts = [];
    if (loading) {
      setCurrentStage(0);
      setProgress(18);

      const stageTimes = [
        { time: 700, stage: 1, prog: 38 },
        { time: 1600, stage: 2, prog: 62 },
        { time: 2600, stage: 3, prog: 80 },
        { time: 3800, stage: 4, prog: 92 }
      ];

      timeouts = stageTimes.map(({ time, stage, prog }) =>
        setTimeout(() => {
          setCurrentStage(stage);
          setProgress(prog);
        }, time)
      );
    }
    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [loading]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError("");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
      setError("");
    }
  };

  const handleParse = async (e) => {
    e.preventDefault();
    setError("");

    if (!file) {
      setError("Please select a PDF or DOCX resume file to upload.");
      return;
    }

    setLoading(true);
    setParsedResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await parseResumeFile(formData);

      // Smooth completion to 100%
      setProgress(100);
      setCurrentStage(4);
      await new Promise((r) => setTimeout(r, 420));

      setParsedResult(res);

      // Smooth scroll to analysis report
      setTimeout(() => {
        window.scrollTo({ top: 340, behavior: "smooth" });
      }, 150);
    } catch (err) {
      console.error(err);
      let errMsg = err.response?.data?.message || err.message || "Failed to parse resume. Please check the file format.";
      if (typeof errMsg === "string" && errMsg.includes("pdfParse is not a function")) {
        errMsg = "PDF parser updated. Please restart the backend server and re-upload.";
      }
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleImportToEditor = async () => {
    if (!parsedResult || !parsedResult.data) return;

    const token = localStorage.getItem("token");
    if (!token) {
      localStorage.setItem("pendingParsedResume", JSON.stringify(parsedResult.data));
      navigate("/login");
      return;
    }

    setImporting(true);
    setError("");

    try {
      const data = parsedResult.data;
      const newResumePayload = {
        title: data.title || `${data.personalInfo?.fullName || "My"} Resume`,
        personalInfo: {
          fullName: data.personalInfo?.fullName || "",
          email: data.personalInfo?.email || "",
          phone: data.personalInfo?.phone || "",
          address: data.personalInfo?.address || "",
          jobTitle: data.personalInfo?.jobTitle || "",
          linkedin: data.personalInfo?.linkedin || "",
          github: data.personalInfo?.github || ""
        },
        summary: data.summary || "",
        skills: Array.isArray(data.skills) ? data.skills : [],
        experience: Array.isArray(data.experience)
          ? data.experience.map((e) => ({
              company: e.company || "",
              role: e.role || "",
              startDate: e.startDate || "",
              endDate: e.endDate || "",
              description: e.description || ""
            }))
          : [],
        education: Array.isArray(data.education)
          ? data.education.map((ed) => ({
              school: ed.school || "",
              degree: ed.degree || "",
              startDate: ed.startDate || "",
              endDate: ed.endDate || "",
              description: ed.description || ""
            }))
          : [],
        projects: Array.isArray(data.projects)
          ? data.projects.map((p) => ({
              title: p.title || "",
              description: p.description || "",
              technologies: p.technologies || "",
              link: p.link || ""
            }))
          : [],
        template: "Modern",
        colorTheme: "#059669"
      };

      const created = await createResume(newResumePayload);
      navigate(`/editor/${created._id}`);
    } catch (err) {
      console.error(err);
      setError("Failed to import parsed resume to editor. Please try again.");
    } finally {
      setImporting(false);
    }
  };

  const handleSendToATS = () => {
    if (!parsedResult) return;
    navigate("/ats-matcher");
  };

  const handleReset = () => {
    setParsedResult(null);
    setFile(null);
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="parser-page" style={{ paddingTop: "20px" }}>
      {/* Top Header */}
      <div className="parser-hero">
        <div className="parser-hero-badge">
          <span>⚡</span> AI Resume Parser &amp; 10-Parameter Scoring Engine
        </div>
        <h1>Upload Resume (PDF / DOCX) ➔ Explainable Score &amp; Report</h1>
      </div>

      {/* Upload & Scoring Center */}
      <div className="parser-container" style={{ marginTop: "12px", marginBottom: "30px" }}>
        {error && <div className="ats-alert-error">{error}</div>}

        {/* Real-time AI Processing Hub when scanning */}
        {loading ? (
          <ResumeProcessingHub
            fileName={file?.name || "Candidate_Resume.pdf"}
            fileSize={file ? (file.size / 1024).toFixed(1) + " KB" : null}
            currentStage={currentStage}
            progress={progress}
          />
        ) : (
          <>
            {/* Upload Dropzone */}
            <div
              className={`parser-dropzone ${isDragOver ? "dragover" : ""} ${file ? "has-file" : ""}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf,.docx,.doc,.txt"
                style={{ display: "none" }}
              />
              <div className="dropzone-icon">
                {file ? "📄" : "☁️"}
              </div>
              {file ? (
                <div className="file-info-box">
                  <h4>{file.name}</h4>
                  <p>{(file.size / 1024).toFixed(1)} KB • Click or drop a different file to replace</p>
                </div>
              ) : (
                <div className="dropzone-prompt">
                  <h3>Drag &amp; Drop your resume here, or <span className="browse-link">browse files</span></h3>
                  <p>Supports PDF, DOCX, DOC, and TXT (Max 10MB)</p>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="parser-action-row" style={{ marginTop: "20px" }}>
              <button
                onClick={handleParse}
                disabled={loading || !file}
                className="parser-submit-btn"
                style={{
                  padding: "16px 36px",
                  fontSize: "16px",
                  fontWeight: 700,
                  borderRadius: "14px",
                  background: file
                    ? "linear-gradient(135deg, #059669 0%, #047857 100%)"
                    : "#9ca3af",
                  boxShadow: file
                    ? "0 10px 25px -5px rgba(5, 150, 105, 0.4)"
                    : "none",
                  cursor: file ? "pointer" : "not-allowed",
                  transition: "all 0.25s ease"
                }}
              >
                <span>⚡</span> Analyze &amp; Score My Resume
              </button>
            </div>
          </>
        )}
      </div>

      {/* ====================================================================
          REAL-TIME PARSED & SCORED RESULT DASHBOARD
          If resume is uploaded: renders candidate's real score analysis.
          If not yet uploaded: renders the QuillBio benchmark preview.
         ==================================================================== */}
      {parsedResult && parsedResult.analysis ? (
        <div className="live-analysis-wrapper" style={{ marginTop: "40px", scrollMarginTop: "100px" }}>
          {/* Success Banner & Actions Bar */}
          <div style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "20px",
            padding: "24px 28px",
            marginBottom: "32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "16px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.04)"
          }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                <span style={{ fontSize: "22px" }}>🎉</span>
                <h2 style={{ fontSize: "22px", fontWeight: 800, margin: 0, color: "var(--text-main)" }}>
                  Resume Analyzed &amp; Scored Successfully!
                </h2>
              </div>
              <p style={{ margin: 0, fontSize: "14px", color: "var(--text-muted)" }}>
                Source: <strong>{parsedResult.fileName}</strong> • Overall Score: <strong>{parsedResult.analysis.overallScore} / 100 ({parsedResult.analysis.readinessStatus})</strong>
              </p>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
              <button
                onClick={handleImportToEditor}
                disabled={importing}
                style={{
                  background: "#059669",
                  color: "#ffffff",
                  padding: "12px 22px",
                  borderRadius: "12px",
                  fontWeight: 700,
                  fontSize: "14.5px",
                  border: "none",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px"
                }}
              >
                {importing ? "Creating..." : "✏️ Open in Live Editor"}
              </button>

              <button
                onClick={handleSendToATS}
                style={{
                  background: "var(--bg-card)",
                  color: "var(--text-main)",
                  border: "1px solid var(--border)",
                  padding: "12px 20px",
                  borderRadius: "12px",
                  fontWeight: 600,
                  fontSize: "14px",
                  cursor: "pointer"
                }}
              >
                🎯 Test Against Job Description
              </button>

              <button
                onClick={() => setShowRawFields(!showRawFields)}
                style={{
                  background: "transparent",
                  color: "var(--text-muted)",
                  border: "1px solid var(--border)",
                  padding: "12px 18px",
                  borderRadius: "12px",
                  fontWeight: 600,
                  fontSize: "13.5px",
                  cursor: "pointer"
                }}
              >
                {showRawFields ? "Hide Extracted Fields ▲" : "View Extracted Fields ▼"}
              </button>

              <button
                onClick={handleReset}
                style={{
                  background: "transparent",
                  color: "#ef4444",
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                  padding: "12px 18px",
                  borderRadius: "12px",
                  fontWeight: 600,
                  fontSize: "13.5px",
                  cursor: "pointer"
                }}
              >
                🔄 Upload Another
              </button>
            </div>
          </div>

          {/* Dynamic Resume Analysis Dashboard */}
          <ResumeAnalysisSection
            url="resumecraft.ai/analysis"
            analysis={parsedResult.analysis}
            fileName={parsedResult.fileName}
            isLive={true}
          />

          {/* Optional Extracted Resume Details Grid */}
          {showRawFields && parsedResult.data && (
            <div className="parsed-results-panel" style={{ marginTop: "40px" }}>
              <div className="parsed-header-bar">
                <div className="parsed-header-title">
                  <h2>📋 Extracted Structured Fields</h2>
                  <p>{parsedResult.rawTextLength} characters extracted and categorized by Gemini</p>
                </div>
              </div>

              <div className="parsed-content-grid">
                {/* Profile Card */}
                <div className="parsed-card profile-card">
                  <h3>👤 Personal Information</h3>
                  <div className="info-fields">
                    <div className="info-field">
                      <span className="label">Full Name:</span>
                      <strong>{parsedResult.data.personalInfo?.fullName || "Not detected"}</strong>
                    </div>
                    <div className="info-field">
                      <span className="label">Job Title:</span>
                      <strong>{parsedResult.data.personalInfo?.jobTitle || "Not detected"}</strong>
                    </div>
                    <div className="info-field">
                      <span className="label">Email:</span>
                      <span>{parsedResult.data.personalInfo?.email || "Not detected"}</span>
                    </div>
                    <div className="info-field">
                      <span className="label">Phone:</span>
                      <span>{parsedResult.data.personalInfo?.phone || "Not detected"}</span>
                    </div>
                  </div>
                </div>

                {/* Skills Card */}
                <div className="parsed-card skills-card">
                  <h3>🛠️ Extracted Skills ({parsedResult.data.skills?.length || 0})</h3>
                  <div className="skills-pill-wrap">
                    {parsedResult.data.skills?.map((skill, idx) => (
                      <span key={idx} className="extracted-skill-pill">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Summary Card */}
                {parsedResult.data.summary && (
                  <div className="parsed-card full-width summary-card">
                    <h3>📝 Summary</h3>
                    <p>{parsedResult.data.summary}</p>
                  </div>
                )}

                {/* Experience Card */}
                {parsedResult.data.experience?.length > 0 && (
                  <div className="parsed-card full-width">
                    <h3>💼 Work Experience ({parsedResult.data.experience.length})</h3>
                    <div className="parsed-items-list">
                      {parsedResult.data.experience.map((exp, idx) => (
                        <div key={idx} className="parsed-timeline-item">
                          <div className="item-header">
                            <h4>{exp.role || "Role"}</h4>
                            <span className="item-company">
                              @ {exp.company || "Company"} ({exp.startDate || ""} - {exp.endDate || ""})
                            </span>
                          </div>
                          <p className="item-desc">{exp.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Projects Card */}
                {parsedResult.data.projects?.length > 0 && (
                  <div className="parsed-card full-width">
                    <h3>🚀 Projects ({parsedResult.data.projects.length})</h3>
                    <div className="parsed-items-list">
                      {parsedResult.data.projects.map((proj, idx) => (
                        <div key={idx} className="parsed-timeline-item">
                          <h4>{proj.title}</h4>
                          {proj.technologies && (
                            <span className="item-tech-stack">Tech: {proj.technologies}</span>
                          )}
                          <p className="item-desc">{proj.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ) : !loading ? (
        /* Benchmark Preview when no resume uploaded yet */
        <div style={{ marginTop: "24px" }}>
          <ResumeAnalysisSection />
        </div>
      ) : null}
    </div>
  );
};

export default ResumeParser;
