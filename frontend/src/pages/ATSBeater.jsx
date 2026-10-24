import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getResumes, matchATS } from "../services/api";

const SAMPLE_JOB_DESCRIPTIONS = [
  {
    title: "Senior Full Stack Engineer (React & Node.js)",
    text: `Job Title: Senior Full Stack Engineer
Location: Remote / Hybrid
About the Role:
We are looking for an experienced Senior Full Stack Engineer to architect, build, and scale our core SaaS platform. You will work across the stack with React, Node.js, Express, MongoDB, and AWS cloud infrastructure.

Key Responsibilities:
- Design and implement scalable RESTful and GraphQL APIs using Node.js and Express.
- Build responsive, accessible, and high-performance UI components using React, Redux/Zustand, and modern CSS.
- Optimize database queries and schema designs in MongoDB and PostgreSQL.
- Implement automated testing with Jest, React Testing Library, and Cypress.
- Work with Docker, CI/CD pipelines (GitHub Actions), and AWS services (S3, ECS, Lambda).
- Collaborate with cross-functional teams, mentor junior developers, and enforce code quality best practices.

Requirements:
- 4+ years of professional full-stack development experience.
- Deep proficiency with JavaScript (ES6+), TypeScript, React, and Node.js.
- Strong understanding of microservices, asynchronous programming, and REST APIs.
- Experience with Git, Docker, Kubernetes, and automated deployment pipelines.
- Excellent communication skills, problem-solving mindset, and ownership.`
  },
  {
    title: "AI / Python Backend Developer",
    text: `Job Title: AI & Backend Software Engineer
Location: Remote
About the Role:
Join our machine learning engineering team to build AI-driven products using Python, FastAPI, and Large Language Models (LLMs).

Key Responsibilities:
- Build high-throughput asynchronous backend microservices using Python and FastAPI.
- Integrate LLM APIs (Gemini, OpenAI, Anthropic) and vector databases (Pinecone, ChromaDB, Qdrant).
- Implement RAG (Retrieval-Augmented Generation) pipelines, chunking strategies, and embedding semantic search.
- Monitor model inference performance, prompt latency, and token consumption.
- Deploy containerized services to GCP/AWS with Docker and Kubernetes.

Requirements:
- 3+ years experience in Python backend development.
- Hands-on experience with LangChain, LlamaIndex, or raw LLM API integrations.
- Familiarity with NLP techniques, sentence embeddings, and vector similarity search.
- Strong grasp of SQL/NoSQL databases and Redis caching.
- BS/MS in Computer Science, Data Science, or related field.`
  }
];

const ATSBeater = () => {
  const navigate = useNavigate();
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [analysisResult, setAnalysisResult] = useState(null);
  const [activeTab, setActiveTab] = useState("overview"); // "overview" | "keywords" | "comparison" | "actionPlan"
  const [copiedKey, setCopiedKey] = useState("");

  // Fetch saved resumes to easily select
  useEffect(() => {
    const fetchResumesList = async () => {
      try {
        const data = await getResumes();
        setResumes(data);
        if (data.length > 0) {
          handleSelectResume(data[0]._id, data);
        }
      } catch (err) {
        console.error("Failed to load user resumes:", err);
      }
    };
    fetchResumesList();
  }, []);

  const handleSelectResume = (id, list = resumes) => {
    setSelectedResumeId(id);
    const resume = list.find((r) => r._id === id);
    if (!resume) return;

    // Convert resume to text representation
    const parts = [];
    if (resume.personalInfo) {
      parts.push(`Name: ${resume.personalInfo.fullName || ""}`);
      parts.push(`Target Role: ${resume.personalInfo.jobTitle || ""}`);
      parts.push(`Contact: ${resume.personalInfo.email || ""} | ${resume.personalInfo.phone || ""}`);
      setJobTitle(resume.personalInfo.jobTitle || "");
    }
    if (resume.summary?.trim()) {
      parts.push(`\n[Professional Summary]\n${resume.summary.trim()}`);
    }
    if (resume.skills?.length) {
      parts.push(`\n[Skills & Technologies]\n${resume.skills.join(", ")}`);
    }
    if (resume.experience?.length) {
      const expStr = resume.experience
        .filter((e) => e.company || e.role)
        .map((e) => `${e.role || "Role"} at ${e.company || "Company"} (${e.startDate || ""} - ${e.endDate || ""}):\n${e.description || ""}`)
        .join("\n\n");
      if (expStr) parts.push(`\n[Work Experience]\n${expStr}`);
    }
    if (resume.projects?.length) {
      const projStr = resume.projects
        .filter((p) => p.title)
        .map((p) => `${p.title} (${p.technologies || ""}):\n${p.description || ""}`)
        .join("\n\n");
      if (projStr) parts.push(`\n[Key Projects]\n${projStr}`);
    }
    if (resume.education?.length) {
      const eduStr = resume.education
        .filter((e) => e.school || e.degree)
        .map((e) => `${e.degree || ""} from ${e.school || ""} (${e.startDate || ""} - ${e.endDate || ""})`)
        .join("\n");
      if (eduStr) parts.push(`\n[Education]\n${eduStr}`);
    }

    setResumeText(parts.join("\n"));
  };

  const handleLoadSampleJD = (sample) => {
    setJobDescription(sample.text);
    if (!jobTitle) setJobTitle(sample.title);
  };

  const handleRunMatch = async (e) => {
    e.preventDefault();
    if (!resumeText.trim() || resumeText.length < 30) {
      setError("Please select a resume or paste your resume content (at least 30 characters).");
      return;
    }
    if (!jobDescription.trim() || jobDescription.length < 30) {
      setError("Please paste a target Job Description to compare against.");
      return;
    }

    setError("");
    setLoading(true);
    setAnalysisResult(null);

    try {
      const result = await matchATS({
        resumeText,
        jobDescription,
        jobTitle: jobTitle || "Target Role"
      });
      setAnalysisResult(result);
      setActiveTab("overview");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to analyze resume against job description.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(""), 2000);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "#10b981"; // Emerald
    if (score >= 65) return "#f59e0b"; // Amber
    return "#ef4444"; // Red
  };

  return (
    <div className="ats-beater-page">
      {/* Hero Header */}
      <div className="ats-hero-section">
        <div className="ats-hero-content">
          <div className="ats-pill-badge">
            <span className="sparkle-icon">📄</span> AI Resume Builder & ATS Analyzer
          </div>
          <h1>Get an ATS-Friendly Resume, Accurate Score & Clear Fixes</h1>

          {/* Privacy Trust Bar Guarantee */}
          <div className="ats-privacy-trust-bar">
            <div className="trust-bar-pill">
              <span className="trust-lock">🔒</span>
              <span className="trust-highlight">Zero Data Retention:</span>
              <span className="trust-muted">No resume data is ever stored</span>
            </div>
            <div className="trust-bar-items">
              <span className="trust-item"><span className="check-dot">✓</span> ATS-Friendly Resume</span>
              <span className="trust-item"><span className="check-dot">✓</span> Accurate Match Score</span>
              <span className="trust-item"><span className="check-dot">✓</span> Missing Keyword Gap</span>
              <span className="trust-item"><span className="check-dot">✓</span> Clear Actionable Fixes</span>
            </div>
          </div>
        </div>
      </div>

      <div className="ats-container">
        {error && <div className="ats-alert-error">{error}</div>}

        {/* Input Grid */}
        <div className="ats-input-grid">
          {/* Resume Panel */}
          <div className="ats-panel">
            <div className="ats-panel-header">
              <div className="ats-panel-title">
                <span className="panel-icon">📄</span>
                <div>
                  <h3>1. Your Resume</h3>
                  <p>Choose an existing resume or paste your text below</p>
                </div>
              </div>
              {resumes.length > 0 && (
                <div className="ats-resume-selector">
                  <label htmlFor="resume-select">Load Resume:</label>
                  <select
                    id="resume-select"
                    value={selectedResumeId}
                    onChange={(e) => handleSelectResume(e.target.value)}
                  >
                    {resumes.map((r) => (
                      <option key={r._id} value={r._id}>
                        {r.title} ({r.personalInfo?.fullName || "Draft"})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <textarea
              className="ats-textarea"
              rows={14}
              placeholder="Paste or type your resume content here (Summary, Skills, Work Experience, Projects, Education)..."
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
            ></textarea>
            <div className="ats-char-count">{resumeText.length} characters</div>
          </div>

          {/* Job Description Panel */}
          <div className="ats-panel">
            <div className="ats-panel-header">
              <div className="ats-panel-title">
                <span className="panel-icon">🎯</span>
                <div>
                  <h3>2. Target Job Description</h3>
                  <p>Paste the JD or try a sample role</p>
                </div>
              </div>
              <div className="ats-samples-group">
                <span className="samples-label">Samples:</span>
                {SAMPLE_JOB_DESCRIPTIONS.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleLoadSampleJD(sample)}
                    className="ats-sample-btn"
                  >
                    {sample.title.split(" ")[0]} {sample.title.split(" ")[1]}
                  </button>
                ))}
              </div>
            </div>

            <div className="ats-role-input-group">
              <label>Target Job Title (Optional):</label>
              <input
                type="text"
                placeholder="e.g. Senior Full Stack Engineer"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className="ats-role-input"
              />
            </div>

            <textarea
              className="ats-textarea"
              rows={11}
              placeholder="Paste the full job description here (Responsibilities, Requirements, Tech Stack, Qualifications)..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            ></textarea>
            <div className="ats-char-count">{jobDescription.length} characters</div>
          </div>
        </div>

        {/* Action Button */}
        <div className="ats-action-container">
          <button
            onClick={handleRunMatch}
            disabled={loading}
            className="ats-run-btn"
          >
            {loading ? (
              <>
                <span className="spinner-small"></span> Running ATS Screening & Semantic Matching...
              </>
            ) : (
              <>
                <span>⚡</span> Run ATS Screening & Match Analysis
              </>
            )}
          </button>
        </div>

        {/* Results Section */}
        {analysisResult && (
          <div className="ats-results-wrapper">
            {/* Top Score Cards */}
            <div className="ats-score-cards-grid">
              {/* Overall Match */}
              <div className="ats-score-card primary-card">
                <div className="score-card-header">
                  <span className="card-badge">Overall ATS Score</span>
                  <span className="card-status" style={{ color: getScoreColor(analysisResult.overallMatchScore) }}>
                    {analysisResult.atsPassProbability}
                  </span>
                </div>
                <div className="score-big-number" style={{ color: getScoreColor(analysisResult.overallMatchScore) }}>
                  {analysisResult.overallMatchScore}<span>%</span>
                </div>
                <div className="score-progress-bar">
                  <div
                    className="score-progress-fill"
                    style={{
                      width: `${analysisResult.overallMatchScore}%`,
                      backgroundColor: getScoreColor(analysisResult.overallMatchScore)
                    }}
                  ></div>
                </div>
                <p className="score-verdict">{analysisResult.verdict}</p>
              </div>

              {/* Keyword Match */}
              <div className="ats-score-card">
                <div className="score-card-header">
                  <span className="card-badge">Keyword Match</span>
                  <span className="card-sub">{analysisResult.matchedKeywords?.length || 0} Matched</span>
                </div>
                <div className="score-big-number">
                  {analysisResult.keywordMatchScore}<span>%</span>
                </div>
                <div className="score-progress-bar">
                  <div
                    className="score-progress-fill"
                    style={{
                      width: `${analysisResult.keywordMatchScore}%`,
                      backgroundColor: "#3b82f6"
                    }}
                  ></div>
                </div>
                <p className="score-desc">Exact and synonymous technical keywords present</p>
              </div>

              {/* Semantic Similarity */}
              <div className="ats-score-card">
                <div className="score-card-header">
                  <span className="card-badge">Semantic Fit</span>
                  <span className="card-sub">NLP Embeddings</span>
                </div>
                <div className="score-big-number">
                  {analysisResult.semanticSimilarityScore}<span>%</span>
                </div>
                <div className="score-progress-bar">
                  <div
                    className="score-progress-fill"
                    style={{
                      width: `${analysisResult.semanticSimilarityScore}%`,
                      backgroundColor: "#8b5cf6"
                    }}
                  ></div>
                </div>
                <p className="score-desc">Relevance of responsibilities and seniority</p>
              </div>

              {/* Before vs After Booster Badge */}
              {analysisResult.beforeAfterOptimization && (
                <div className="ats-score-card booster-card">
                  <div className="score-card-header">
                    <span className="card-badge booster-tag">ATS Beater Potential</span>
                    <span className="score-delta">+{analysisResult.beforeAfterOptimization.scoreDelta}% boost</span>
                  </div>
                  <div className="booster-comparison-numbers">
                    <div className="booster-num before">
                      <span className="lbl">Original</span>
                      <strong>{analysisResult.beforeAfterOptimization.beforeScore}%</strong>
                    </div>
                    <div className="booster-arrow">➔</div>
                    <div className="booster-num after">
                      <span className="lbl">Optimized</span>
                      <strong>{analysisResult.beforeAfterOptimization.projectedAfterScore}%</strong>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab("comparison")}
                    className="view-comparison-btn"
                  >
                    View Before vs After ➔
                  </button>
                </div>
              )}
            </div>

            {/* Navigation Tabs */}
            <div className="ats-result-tabs">
              <button
                className={`ats-tab-btn ${activeTab === "overview" ? "active" : ""}`}
                onClick={() => setActiveTab("overview")}
              >
                📊 Score Breakdown & Findings
              </button>
              <button
                className={`ats-tab-btn ${activeTab === "keywords" ? "active" : ""}`}
                onClick={() => setActiveTab("keywords")}
              >
                🏷️ Keyword Gap Analysis ({analysisResult.missingKeywords?.length || 0} Missing)
              </button>
              <button
                className={`ats-tab-btn highlight ${activeTab === "comparison" ? "active" : ""}`}
                onClick={() => setActiveTab("comparison")}
              >
                ✨ Before vs After ATS Beater
              </button>
              <button
                className={`ats-tab-btn ${activeTab === "actionPlan" ? "active" : ""}`}
                onClick={() => setActiveTab("actionPlan")}
              >
                🚀 Prioritized Action Plan
              </button>
            </div>

            {/* Tab 1: Overview */}
            {activeTab === "overview" && (
              <div className="ats-tab-content">
                <div className="ats-overview-grid">
                  {/* Section Scores */}
                  <div className="ats-sub-panel">
                    <h3>Section-by-Section ATS Alignment</h3>
                    <div className="section-bars-list">
                      {analysisResult.sectionScores && (
                        <>
                          <div className="section-bar-item">
                            <div className="bar-info">
                              <span>Technical Skills Match</span>
                              <strong>{analysisResult.sectionScores.skillsMatch}%</strong>
                            </div>
                            <div className="mini-track">
                              <div
                                className="mini-fill"
                                style={{ width: `${analysisResult.sectionScores.skillsMatch}%`, background: "#3b82f6" }}
                              ></div>
                            </div>
                          </div>

                          <div className="section-bar-item">
                            <div className="bar-info">
                              <span>Work Experience Relevance</span>
                              <strong>{analysisResult.sectionScores.experienceRelevance}%</strong>
                            </div>
                            <div className="mini-track">
                              <div
                                className="mini-fill"
                                style={{ width: `${analysisResult.sectionScores.experienceRelevance}%`, background: "#10b981" }}
                              ></div>
                            </div>
                          </div>

                          <div className="section-bar-item">
                            <div className="bar-info">
                              <span>Education & Credentials Fit</span>
                              <strong>{analysisResult.sectionScores.educationFit}%</strong>
                            </div>
                            <div className="mini-track">
                              <div
                                className="mini-fill"
                                style={{ width: `${analysisResult.sectionScores.educationFit}%`, background: "#8b5cf6" }}
                              ></div>
                            </div>
                          </div>

                          <div className="section-bar-item">
                            <div className="bar-info">
                              <span>ATS Formatting & Readability</span>
                              <strong>{analysisResult.sectionScores.formattingAtsFriendliness}%</strong>
                            </div>
                            <div className="mini-track">
                              <div
                                className="mini-fill"
                                style={{ width: `${analysisResult.sectionScores.formattingAtsFriendliness}%`, background: "#f59e0b" }}
                              ></div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Strengths & Warnings */}
                  <div className="ats-sub-panel">
                    <h3>ATS Red Flags & Standout Strengths</h3>
                    
                    {analysisResult.atsWarnings?.length > 0 && (
                      <div className="ats-warnings-box">
                        <div className="box-tag warning-tag">⚠️ Critical ATS Warnings</div>
                        <ul>
                          {analysisResult.atsWarnings.map((warn, i) => (
                            <li key={i}>{warn}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {analysisResult.keyStrengths?.length > 0 && (
                      <div className="ats-strengths-box">
                        <div className="box-tag strength-tag">✅ Top Alignment Strengths</div>
                        <ul>
                          {analysisResult.keyStrengths.map((str, i) => (
                            <li key={i}>{str}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Keyword Gap Analysis */}
            {activeTab === "keywords" && (
              <div className="ats-tab-content">
                <div className="keywords-tab-grid">
                  {/* Missing Keywords (Critical to add) */}
                  <div className="keywords-column missing-col">
                    <div className="col-header">
                      <h3>🔴 Missing Critical Keywords ({analysisResult.missingKeywords?.length || 0})</h3>
                      <p>Add these terms to pass ATS screening filters</p>
                    </div>
                    <div className="keyword-cards-list">
                      {analysisResult.missingKeywords?.map((kw, i) => (
                        <div className="missing-kw-card" key={i}>
                          <div className="kw-badge-row">
                            <span className="kw-badge missing-tag">{kw.keyword}</span>
                            <span className="kw-category">{kw.category}</span>
                            <span className={`kw-importance ${kw.importance?.toLowerCase()}`}>
                              {kw.importance}
                            </span>
                          </div>
                          <p className="kw-recommendation">{kw.recommendation}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Matched Keywords */}
                  <div className="keywords-column matched-col">
                    <div className="col-header">
                      <h3>🟢 Successfully Matched Keywords ({analysisResult.matchedKeywords?.length || 0})</h3>
                      <p>Keywords detected in your resume matching the JD</p>
                    </div>
                    <div className="matched-kw-pills-wrap">
                      {analysisResult.matchedKeywords?.map((kw, i) => (
                        <div className="matched-kw-pill" key={i} title={kw.context || ""}>
                          <span className="matched-check">✓</span>
                          <strong>{kw.keyword}</strong>
                          <span className="matched-count">×{kw.count || 1}</span>
                          <span className="matched-cat">{kw.category}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Before vs After Comparison */}
            {activeTab === "comparison" && analysisResult.beforeAfterOptimization && (
              <div className="ats-tab-content">
                <div className="comparison-banner">
                  <div className="comparison-banner-text">
                    <h2>Before vs After: ATS Beater Transformation</h2>
                    <p>
                      See how optimizing your bullet points and professional summary with strong action verbs,
                      metrics, and naturally incorporated target keywords elevates your score from{" "}
                      <strong>{analysisResult.beforeAfterOptimization.beforeScore}%</strong> to{" "}
                      <strong>{analysisResult.beforeAfterOptimization.projectedAfterScore}%</strong>.
                    </p>
                  </div>
                  <div className="comparison-badge-pill">
                    +{analysisResult.beforeAfterOptimization.scoreDelta}% Recruiter Impact
                  </div>
                </div>

                {/* Optimized Summary Comparison */}
                {analysisResult.beforeAfterOptimization.optimizedSummary && (
                  <div className="optimized-section-card">
                    <div className="opt-header">
                      <h3>✨ Tailored Professional Summary</h3>
                      <button
                        onClick={() =>
                          copyToClipboard(
                            analysisResult.beforeAfterOptimization.optimizedSummary,
                            "summary"
                          )
                        }
                        className="copy-btn"
                      >
                        {copiedKey === "summary" ? "✓ Copied!" : "📋 Copy Optimized Summary"}
                      </button>
                    </div>
                    <div className="summary-comparison-box">
                      <div className="summary-after">
                        <div className="summary-tag">ATS-Optimized Version:</div>
                        <p>{analysisResult.beforeAfterOptimization.optimizedSummary}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Bullet Points Side-by-Side Comparison */}
                {analysisResult.beforeAfterOptimization.bulletComparisons?.length > 0 && (
                  <div className="bullet-comparisons-container">
                    <h3>Side-by-Side Bullet Point Improvements</h3>
                    <div className="bullet-cards-stack">
                      {analysisResult.beforeAfterOptimization.bulletComparisons.map((b, i) => (
                        <div className="bullet-comparison-card" key={i}>
                          <div className="bullet-card-top">
                            <span className="role-tag">{b.roleOrProject || "Work Experience"}</span>
                            <span className="why-tag">💡 {b.reason}</span>
                          </div>
                          <div className="bullet-split-view">
                            <div className="bullet-col before-col">
                              <span className="col-label">🔴 Original Bullet (Before):</span>
                              <div className="bullet-box original">{b.originalBullet}</div>
                            </div>
                            <div className="bullet-col after-col">
                              <div className="after-label-row">
                                <span className="col-label">🟢 ATS Beater Bullet (After):</span>
                                <button
                                  onClick={() => copyToClipboard(b.optimizedBullet, `bullet-${i}`)}
                                  className="mini-copy-btn"
                                >
                                  {copiedKey === `bullet-${i}` ? "✓ Copied" : "Copy"}
                                </button>
                              </div>
                              <div className="bullet-box improved">{b.optimizedBullet}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab 4: Prioritized Action Plan */}
            {activeTab === "actionPlan" && (
              <div className="ats-tab-content">
                <div className="action-plan-wrapper">
                  <h3>🚀 Step-by-Step ATS Optimization Roadmap</h3>
                  <p>Follow these high-impact steps to maximize your recruiter callback rate:</p>
                  
                  <div className="action-steps-list">
                    {analysisResult.beforeAfterOptimization?.actionPlan?.map((step, idx) => (
                      <div className="action-step-item" key={idx}>
                        <div className="step-number">{idx + 1}</div>
                        <div className="step-text">{step}</div>
                      </div>
                    ))}
                  </div>

                  <div className="action-cta-box">
                    <div>
                      <h4>Ready to apply these improvements to your resume?</h4>
                      <p>Open your resume in the editor to integrate the optimized summary and bullet points.</p>
                    </div>
                    {selectedResumeId ? (
                      <Link to={`/editor/${selectedResumeId}`} className="primary-cta-btn">
                        Open in Resume Builder ➔
                      </Link>
                    ) : (
                      <Link to="/editor/create" className="primary-cta-btn">
                        Create New Resume ➔
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ATSBeater;
