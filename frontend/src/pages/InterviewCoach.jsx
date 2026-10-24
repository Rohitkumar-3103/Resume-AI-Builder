import React, { useState, useEffect } from "react";
import { getResumes, getInterviewPrep } from "../services/api";

const InterviewCoach = () => {
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [interviewType, setInterviewType] = useState("Balanced mix of Technical, Behavioral (STAR), and System Design");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [prepResult, setPrepResult] = useState(null);
  const [openAnswerId, setOpenAnswerId] = useState(null);

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

    const parts = [];
    if (resume.personalInfo) {
      parts.push(`Candidate: ${resume.personalInfo.fullName || ""}`);
      parts.push(`Current/Target Role: ${resume.personalInfo.jobTitle || ""}`);
      setJobTitle(resume.personalInfo.jobTitle || "");
    }
    if (resume.summary?.trim()) {
      parts.push(`Summary: ${resume.summary.trim()}`);
    }
    if (resume.skills?.length) {
      parts.push(`Skills: ${resume.skills.join(", ")}`);
    }
    if (resume.experience?.length) {
      const expStr = resume.experience
        .filter((e) => e.company || e.role)
        .map((e) => `${e.role || "Role"} at ${e.company || "Company"}: ${e.description || ""}`)
        .join("\n");
      parts.push(`Experience:\n${expStr}`);
    }
    if (resume.projects?.length) {
      const projStr = resume.projects
        .filter((p) => p.title)
        .map((p) => `${p.title} (${p.technologies || ""}): ${p.description || ""}`)
        .join("\n");
      parts.push(`Projects:\n${projStr}`);
    }

    setResumeText(parts.join("\n\n"));
  };

  const handleGenerateQuestions = async (e) => {
    e.preventDefault();
    if (!resumeText.trim() || resumeText.length < 30) {
      setError("Please select a resume or provide your resume background (at least 30 characters).");
      return;
    }

    setError("");
    setLoading(true);
    setPrepResult(null);

    try {
      const result = await getInterviewPrep({
        resumeText,
        jobTitle: jobTitle || "Software Engineer",
        jobDescription,
        interviewType
      });
      setPrepResult(result);
      if (result.questions?.length > 0) {
        setOpenAnswerId(result.questions[0].id || 1);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to generate interview prep questions.");
    } finally {
      setLoading(false);
    }
  };

  const toggleAnswer = (id) => {
    setOpenAnswerId(openAnswerId === id ? null : id);
  };

  return (
    <div className="coach-page">
      {/* Hero Header */}
      <div className="coach-hero">
        <div className="coach-hero-badge">
          <span>🎙️</span> AI Technical & Behavioral Interview Coach
        </div>
        <h1>Personalized Mock Interview Questions & Model Answers</h1>
        <p>
          Simulate an interview with a Principal Tech Recruiter. Gemini AI analyzes your background against the
          target role to generate probing questions, recruiter rationale, and high-scoring STAR framework answers.
        </p>
      </div>

      <div className="coach-container">
        {error && <div className="ats-alert-error">{error}</div>}

        {/* Input Configuration Card */}
        <div className="coach-setup-card">
          <div className="setup-grid">
            {/* Resume Selection */}
            <div className="setup-col">
              <label>Select Candidate Resume:</label>
              {resumes.length > 0 ? (
                <select
                  value={selectedResumeId}
                  onChange={(e) => handleSelectResume(e.target.value)}
                  className="coach-select"
                >
                  {resumes.map((r) => (
                    <option key={r._id} value={r._id}>
                      {r.title} ({r.personalInfo?.fullName || "Draft"})
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  placeholder="Paste resume text below"
                  disabled
                  className="coach-input"
                />
              )}

              <div className="mini-text-area-wrap">
                <textarea
                  rows={4}
                  placeholder="Resume summary or key highlights..."
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  className="coach-textarea"
                ></textarea>
              </div>
            </div>

            {/* Target Role & Mode */}
            <div className="setup-col">
              <label>Target Job Title:</label>
              <input
                type="text"
                placeholder="e.g. Senior Backend Engineer"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className="coach-input"
              />

              <label style={{ marginTop: "12px" }}>Interview Focus Type:</label>
              <select
                value={interviewType}
                onChange={(e) => setInterviewType(e.target.value)}
                className="coach-select"
              >
                <option value="Balanced mix of Technical, Behavioral (STAR), and System Design">
                  🌟 Balanced Mix (Tech + Behavioral + Architecture)
                </option>
                <option value="Deep Technical & System Architecture Focus">
                  ⚙️ Deep Technical & System Design Focus
                </option>
                <option value="Behavioral, Leadership & STAR Method Focus">
                  🤝 Behavioral & Cultural Leadership (STAR)
                </option>
                <option value="Resume Specific Deep-Dive (Past Projects & Decisions)">
                  🔍 Resume Scrutiny (Past Project Decisions & Metrics)
                </option>
              </select>

              <label style={{ marginTop: "12px" }}>Target Job Description / Tech Focus (Optional):</label>
              <input
                type="text"
                placeholder="e.g. React, Node.js, AWS microservices, scaling high-concurrency systems"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="coach-input"
              />
            </div>
          </div>

          <div className="coach-action-row">
            <button
              onClick={handleGenerateQuestions}
              disabled={loading}
              className="coach-submit-btn"
            >
              {loading ? (
                <>
                  <span className="spinner-small"></span> Generating Tailored Interview Questions...
                </>
              ) : (
                <>
                  <span>🎯</span> Generate Interview Questions & Model Answers
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results Stream */}
        {prepResult && (
          <div className="coach-results-stream">
            {/* Overview Banner */}
            <div className="coach-summary-banner">
              <div className="summary-left">
                <div className="badge-pill">Target Evaluation</div>
                <h3>Recruiter Assessment Focus</h3>
                <p>{prepResult.roleSummary}</p>
              </div>
              <div className="readiness-card">
                <span className="readiness-lbl">Interview Readiness:</span>
                <strong className="readiness-val">{prepResult.readinessRating}</strong>
              </div>
            </div>

            {/* Questions List */}
            <div className="questions-stack">
              <h2>Tailored Interview Questions ({prepResult.questions?.length || 0})</h2>
              {prepResult.questions?.map((q, idx) => {
                const isOpen = openAnswerId === (q.id || idx + 1);
                return (
                  <div className={`question-card ${isOpen ? "open" : ""}`} key={idx}>
                    <div className="question-header" onClick={() => toggleAnswer(q.id || idx + 1)}>
                      <div className="question-title-wrap">
                        <span className="q-number">Q{idx + 1}</span>
                        <div>
                          <span className="q-category">{q.category}</span>
                          <h4>{q.question}</h4>
                        </div>
                      </div>
                      <button className="q-toggle-icon">
                        {isOpen ? "▲ Hide Answer" : "▼ Reveal Model Answer"}
                      </button>
                    </div>

                    {/* Collapsible Content */}
                    {isOpen && (
                      <div className="question-body">
                        {/* Why they ask */}
                        {q.whyTheyAsk && (
                          <div className="recruiter-intent-box">
                            <span className="intent-tag">🕵️ Why the interviewer asks this:</span>
                            <p>{q.whyTheyAsk}</p>
                          </div>
                        )}

                        {/* Key Points to Hit */}
                        {q.keyPointsToHit?.length > 0 && (
                          <div className="key-points-box">
                            <span className="section-label">✅ Key Points You Must Touch On:</span>
                            <ul>
                              {q.keyPointsToHit.map((point, pIdx) => (
                                <li key={pIdx}>{point}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Model Answer */}
                        <div className="model-answer-box">
                          <div className="answer-header">
                            <span className="answer-tag">🌟 High-Scoring Model Answer:</span>
                          </div>
                          <div className="answer-text">{q.modelAnswer}</div>
                        </div>

                        {/* Common Pitfalls */}
                        {q.commonPitfalls && (
                          <div className="pitfalls-box">
                            <span className="pitfall-tag">⚠️ Common Pitfalls to Avoid:</span>
                            <p>{q.commonPitfalls}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* General Interview Tips */}
            {prepResult.interviewTips?.length > 0 && (
              <div className="coach-tips-card">
                <h3>💡 Recruiter Advice for this Role</h3>
                <div className="tips-grid">
                  {prepResult.interviewTips.map((tip, idx) => (
                    <div key={idx} className="tip-pill-item">
                      <span className="tip-num">{idx + 1}</span>
                      <p>{tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewCoach;
