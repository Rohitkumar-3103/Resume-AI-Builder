import React, { useState } from "react";
import "./ResumeScoringShowcase.css";

const PARAMETERS_LIST = [
  {
    id: "projects",
    name: "Projects",
    desc: "Evaluates project scope, tech stack clarity, deployment links, and architectural complexity.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
      </svg>
    )
  },
  {
    id: "tech-skills",
    name: "Technical Skills",
    desc: "Checks relevant programming languages, modern frameworks, tooling, and database keywords.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    )
  },
  {
    id: "education",
    name: "Education",
    desc: "Verifies degree relevance, institution pedigree, coursework, graduation timeline, and GPA.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" />
      </svg>
    )
  },
  {
    id: "experience",
    name: "Experience & Internships",
    desc: "Analyzes professional employment history, role progression, and scope of responsibilities.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    )
  },
  {
    id: "achievements",
    name: "Achievements & Certifications",
    desc: "Highlights competitive programming rankings, hackathons, cloud certifications, and awards.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="6" />
        <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
      </svg>
    )
  },
  {
    id: "impact",
    name: "Impact & Quantification",
    desc: "Measures measurable results, %, $, latency reduction, and XYZ accomplishment metrics.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    )
  },
  {
    id: "brevity",
    name: "Brevity & Concision",
    desc: "Eliminates fluff, repetitive bullet points, filler phrases, and ensures high signal-to-noise ratio.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="6" cy="6" r="3" />
        <circle cx="6" cy="18" r="3" />
        <line x1="20" y1="4" x2="8.12" y2="15.88" />
        <line x1="14.47" y1="14.48" x2="20" y2="20" />
        <line x1="8.12" y1="8.12" x2="12" y2="12" />
      </svg>
    )
  },
  {
    id: "style",
    name: "Style & Consistency",
    desc: "Ensures uniform date formats, bullet point punctuation, font hierarchy, and margin alignment.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
        <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
        <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
        <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
      </svg>
    )
  },
  {
    id: "ats",
    name: "ATS & Formatting",
    desc: "Guarantees clean parser readability without tables, images, or incompatible column structures.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <polyline points="9 15 11 17 15 13" />
      </svg>
    )
  },
  {
    id: "language",
    name: "Language & Spelling",
    desc: "Audits grammar, typos, tense consistency, and replaces weak passive voice with power action verbs.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
      </svg>
    )
  }
];

// Default benchmark scores across the 10 parameters when previewing without an uploaded file
const DEFAULT_PARAM_SCORES = {
  "projects": 88,
  "tech-skills": 92,
  "education": 85,
  "experience": 84,
  "achievements": 80,
  "impact": 71,
  "brevity": 79,
  "style": 82,
  "ats": 64,
  "language": 86
};

const ResumeAnalysisSection = ({
  analysis = null,
  fileName = null,
  isLive = false
}) => {
  const [activeParam, setActiveParam] = useState(null);

  // Dynamic values extracted from real parsed resume or QuillBio benchmark defaults
  const score = analysis?.overallScore ?? 82;
  const status = analysis?.readinessStatus ?? "Interview Ready";
  const metrics = {
    projects: analysis?.metrics?.projects ?? 88,
    impact: analysis?.metrics?.impact ?? 71,
    technicalSkills: analysis?.metrics?.technicalSkills ?? 92,
    atsFormatting: analysis?.metrics?.atsFormatting ?? 64,
    brevity: analysis?.metrics?.brevity ?? 79
  };
  const strength = analysis?.strength ?? "Strong project portfolio with clear tech stacks and live links.";
  const topFix = analysis?.topFix ?? "Quantify 3 bullet points with metrics (%, $, time saved).";
  const aiSummary = analysis?.aiSummary ?? "A solid entry-level resume - tightening impact statements would push you into the top band.";

  // Circular gauge math for dynamic score (compact 110px diameter)
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, score)) / 100) * circumference;

  // Determine status badge theme dynamically based on score & status
  const getStatusBadge = (numScore, currentStatus) => {
    if (numScore >= 80) {
      return {
        className: "status-ready",
        label: currentStatus || "Interview Ready",
        isPositive: true
      };
    }
    if (numScore >= 70) {
      return {
        className: "status-polish",
        label: (currentStatus === "Developing" || !currentStatus) ? "Needs Polish" : currentStatus,
        isPositive: true
      };
    }
    return {
      className: "status-revision",
      label: currentStatus || "Needs Revision",
      isPositive: false
    };
  };

  const statusBadge = getStatusBadge(score, status);

  // Map parameters with dynamic score and personalized feedback if analysis is provided
  const paramsList = PARAMETERS_LIST.map((p) => {
    const detail = analysis?.parameters?.find((item) => item.id === p.id);
    const scoreVal = typeof detail?.score === "number" ? detail.score : (DEFAULT_PARAM_SCORES[p.id] || 85);
    const statusVal = detail?.status || (scoreVal >= 80 ? "Good" : scoreVal >= 70 ? "Needs Polish" : "Needs Work");
    return {
      ...p,
      score: scoreVal,
      status: statusVal,
      feedback: detail?.feedback || p.desc
    };
  });

  return (
    <section className="showcase-root resume-analysis-section" aria-label="Resume Analysis">
      <div className="showcase-container">
        {/* Section Tag */}
        <div className="showcase-section-header" style={{ marginBottom: "14px" }}>
          <span className="showcase-tag">RESUME ANALYSIS</span>
        </div>

        {/* 2-Column Split: Left Card vs Right 10 Parameters */}
        <div className="ra-layout-grid">
          {/* ================================================================
              Left Card: Score Gauge, Progress Bars, Strength, Top Fix, Summary
             ================================================================ */}
          <div className="ra-mockup-window">
            {/* Score Ring & Progress Bars Row */}
            <div className="ra-score-overview-row">
              {/* Radial Circle Gauge */}
              <div className="ra-circle-column">
                <div className="ra-circle-wrapper">
                  <svg className="ra-circle-svg" viewBox="0 0 110 110">
                    <circle
                      className="ra-circle-bg"
                      cx="55"
                      cy="55"
                      r={radius}
                    />
                    <circle
                      className="ra-circle-progress"
                      cx="55"
                      cy="55"
                      r={radius}
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                    />
                  </svg>
                  <div className="ra-circle-text">
                    <span className="ra-score-big">{score}</span>
                    <span className="ra-score-total">/ 100</span>
                  </div>
                </div>
                <div className={`ra-status-pill ${statusBadge.className}`}>
                  {statusBadge.isPositive ? (
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="7" y1="17" x2="17" y2="7" />
                      <polyline points="7 7 17 7 17 17" />
                    </svg>
                  ) : (
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="7" y1="7" x2="17" y2="17" />
                      <polyline points="17 7 17 17 7 17" />
                    </svg>
                  )}
                  <span>{statusBadge.label}</span>
                </div>
              </div>

              {/* 5 Progress Bars */}
              <div className="ra-bars-column">
                {/* 1. Projects */}
                <div className="ra-metric-row">
                  <div className="ra-metric-info">
                    <span>Projects</span>
                    <span className="ra-metric-val">{metrics.projects}</span>
                  </div>
                  <div className="ra-bar-track">
                    <div
                      className={`ra-bar-fill ${metrics.projects >= 75 ? "ra-bar-green" : "ra-bar-amber"}`}
                      style={{ width: `${metrics.projects}%` }}
                    ></div>
                  </div>
                </div>

                {/* 2. Impact & Quantification */}
                <div className="ra-metric-row">
                  <div className="ra-metric-info">
                    <span>Impact &amp; Quantification</span>
                    <span className="ra-metric-val">{metrics.impact}</span>
                  </div>
                  <div className="ra-bar-track">
                    <div
                      className={`ra-bar-fill ${metrics.impact >= 75 ? "ra-bar-green" : "ra-bar-amber"}`}
                      style={{ width: `${metrics.impact}%` }}
                    ></div>
                  </div>
                </div>

                {/* 3. Technical Skills */}
                <div className="ra-metric-row">
                  <div className="ra-metric-info">
                    <span>Technical Skills</span>
                    <span className="ra-metric-val">{metrics.technicalSkills}</span>
                  </div>
                  <div className="ra-bar-track">
                    <div
                      className={`ra-bar-fill ${metrics.technicalSkills >= 75 ? "ra-bar-green" : "ra-bar-amber"}`}
                      style={{ width: `${metrics.technicalSkills}%` }}
                    ></div>
                  </div>
                </div>

                {/* 4. ATS & Formatting */}
                <div className="ra-metric-row">
                  <div className="ra-metric-info">
                    <span>ATS &amp; Formatting</span>
                    <span className="ra-metric-val">{metrics.atsFormatting}</span>
                  </div>
                  <div className="ra-bar-track">
                    <div
                      className={`ra-bar-fill ${metrics.atsFormatting >= 75 ? "ra-bar-green" : "ra-bar-amber"}`}
                      style={{ width: `${metrics.atsFormatting}%` }}
                    ></div>
                  </div>
                </div>

                {/* 5. Brevity & Concision */}
                <div className="ra-metric-row">
                  <div className="ra-metric-info">
                    <span>Brevity &amp; Concision</span>
                    <span className="ra-metric-val">{metrics.brevity}</span>
                  </div>
                  <div className="ra-bar-track">
                    <div
                      className={`ra-bar-fill ${metrics.brevity >= 75 ? "ra-bar-green" : "ra-bar-amber"}`}
                      style={{ width: `${metrics.brevity}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Strength & Top Fix Callouts */}
            <div className="ra-callouts-row">
              {/* Strength Card */}
              <div className="ra-callout-card ra-callout-strength">
                <div className="ra-callout-label">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  <span>STRENGTH</span>
                </div>
                <p className="ra-callout-text">{strength}</p>
              </div>

              {/* Top Fix Card */}
              <div className="ra-callout-card ra-callout-fix">
                <div className="ra-callout-label">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="4" y1="6" x2="20" y2="6" />
                    <line x1="4" y1="12" x2="14" y2="12" />
                    <line x1="4" y1="18" x2="18" y2="18" />
                    <circle cx="18" cy="12" r="2" />
                  </svg>
                  <span>TOP FIX</span>
                </div>
                <p className="ra-callout-text">{topFix}</p>
              </div>
            </div>

            {/* AI Summary Banner */}
            <div className="ra-ai-summary-banner">
              <span className="ra-summary-icon" aria-hidden="true">✦</span>
              <p className="ra-summary-text">
                <strong>AI summary:</strong> {aiSummary}
              </p>
            </div>
          </div>

          {/* ================================================================
              Right Card: Ten Parameters
             ================================================================ */}
          <div className="ra-parameters-panel">
            {/* Header */}
            <div className="ra-param-header">
              <div className="ra-param-top-icon" aria-hidden="true">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="12 2 2 7 12 12 22 7 12 2" />
                  <polyline points="2 17 12 22 22 17" />
                  <polyline points="2 12 12 17 22 12" />
                </svg>
              </div>
              <h3 className="ra-param-title">Ten parameters</h3>
            </div>

            {/* 2-Column Grid (10 Parameter Pills with Individual Scores) */}
            <div className="ra-param-grid" role="list">
              {paramsList.map((param) => {
                const isSelected = activeParam?.id === param.id;
                return (
                  <div
                    key={param.id}
                    className={`ra-param-item ${isSelected ? "active" : ""}`}
                    onClick={() => setActiveParam(isSelected ? null : param)}
                    onMouseEnter={() => setActiveParam(param)}
                    role="listitem"
                    tabIndex={0}
                    title={`${param.name} (${param.score}/100): ${param.feedback}`}
                  >
                    <div className="ra-param-left">
                      <div className="ra-param-icon-box" aria-hidden="true">
                        {param.icon}
                      </div>
                      <span className="ra-param-name">{param.name}</span>
                    </div>
                    {typeof param.score === "number" && (
                      <span
                        className={`ra-param-score-badge ${
                          param.score >= 80 ? "high" : param.score >= 70 ? "mid" : "low"
                        }`}
                        aria-label={`Score: ${param.score}`}
                      >
                        {param.score}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Parameter Detail Tooltip Info */}
            {activeParam && (
              <div className="ra-param-tooltip-bar">
                <span>💡</span>
                <span>
                  <strong>
                    {activeParam.name}
                    {typeof activeParam.score === "number" && (
                      <> ({activeParam.score}/100 &middot; {activeParam.status || "Evaluated"}): </>
                    )}
                    {typeof activeParam.score !== "number" && ": "}
                  </strong>
                  {activeParam.feedback}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResumeAnalysisSection;
