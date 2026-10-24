import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { parseResumeFile, parseResumeText, createResume } from "../services/api";

const ResumeParser = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [pasteText, setPasteText] = useState("");
  const [inputMode, setInputMode] = useState("file"); // "file" | "text"
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [parsedResult, setParsedResult] = useState(null);
  const [importing, setImporting] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

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

    if (inputMode === "file") {
      if (!file) {
        setError("Please select a PDF or DOCX resume file to upload.");
        return;
      }
    } else {
      if (!pasteText.trim() || pasteText.length < 30) {
        setError("Please paste your resume text (at least 30 characters).");
        return;
      }
    }

    setLoading(true);
    setParsedResult(null);

    try {
      let res;
      if (inputMode === "file") {
        const formData = new FormData();
        formData.append("file", file);
        res = await parseResumeFile(formData);
      } else {
        res = await parseResumeText(pasteText);
      }
      setParsedResult(res);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to parse resume. Please check the file format or try pasting text.");
    } finally {
      setLoading(false);
    }
  };

  const handleImportToEditor = async () => {
    if (!parsedResult || !parsedResult.data) return;

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
          jobTitle: data.personalInfo?.jobTitle || ""
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
        colorTheme: "#2563eb"
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

  return (
    <div className="parser-page">
      {/* Header */}
      <div className="parser-hero">
        <div className="parser-hero-badge">
          <span>⚡</span> AI Resume Parser & Converter
        </div>
        <h1>Upload Resume (PDF / DOCX) ➔ Instant Structured Resume</h1>
      </div>

      <div className="parser-container">
        {error && <div className="ats-alert-error">{error}</div>}

        {/* Input Switcher */}
        <div className="parser-input-mode-switch">
          <button
            className={`mode-btn ${inputMode === "file" ? "active" : ""}`}
            onClick={() => setInputMode("file")}
          >
            📁 Upload PDF / DOCX File
          </button>
          <button
            className={`mode-btn ${inputMode === "text" ? "active" : ""}`}
            onClick={() => setInputMode("text")}
          >
            📝 Paste Resume Text
          </button>
        </div>

        {/* Upload Box */}
        {inputMode === "file" ? (
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
                <h3>Drag & Drop your resume here, or <span className="browse-link">browse files</span></h3>
                <p>Supports PDF, DOCX, DOC, and TXT (Max 10MB)</p>
              </div>
            )}
          </div>
        ) : (
          <div className="parser-text-area-box">
            <textarea
              className="parser-textarea"
              rows={12}
              placeholder="Paste the full text of your resume here..."
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
            ></textarea>
            <div className="parser-char-count">{pasteText.length} characters</div>
          </div>
        )}

        {/* Submit Button */}
        <div className="parser-action-row">
          <button
            onClick={handleParse}
            disabled={loading}
            className="parser-submit-btn"
          >
            {loading ? (
              <>
                <span className="spinner-small"></span> Extracting & Parsing with Gemini AI...
              </>
            ) : (
              <>
                <span>✨</span> Parse Resume Content with AI
              </>
            )}
          </button>
        </div>

        {/* Parsed Result Showcase */}
        {parsedResult && parsedResult.data && (
          <div className="parsed-results-panel">
            <div className="parsed-header-bar">
              <div className="parsed-header-title">
                <h2>🎉 Resume Parsed Successfully!</h2>
                <p>Source: {parsedResult.fileName} • {parsedResult.rawTextLength} characters processed</p>
              </div>
              <div className="parsed-header-actions">
                <button
                  onClick={handleImportToEditor}
                  disabled={importing}
                  className="import-editor-btn"
                >
                  {importing ? "Creating Resume..." : "✏️ Open in Resume Builder ➔"}
                </button>
                <button onClick={handleSendToATS} className="send-ats-btn">
                  🎯 Test Against Job in ATS Matcher
                </button>
              </div>
            </div>

            {/* Extracted Details Grid */}
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
                  <div className="info-field">
                    <span className="label">Location:</span>
                    <span>{parsedResult.data.personalInfo?.address || "Not detected"}</span>
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
                  <h3>📝 Professional Summary</h3>
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

              {/* Education Card */}
              {parsedResult.data.education?.length > 0 && (
                <div className="parsed-card">
                  <h3>🎓 Education ({parsedResult.data.education.length})</h3>
                  <div className="parsed-items-list">
                    {parsedResult.data.education.map((edu, idx) => (
                      <div key={idx} className="parsed-timeline-item">
                        <h4>{edu.degree || "Degree"}</h4>
                        <span className="item-company">
                          {edu.school || "School"} ({edu.startDate || ""} - {edu.endDate || ""})
                        </span>
                        {edu.description && <p className="item-desc">{edu.description}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Projects Card */}
              {parsedResult.data.projects?.length > 0 && (
                <div className="parsed-card">
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
    </div>
  );
};

export default ResumeParser;
