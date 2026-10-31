import React from "react";
import "./ResumeScoringShowcase.css";

const PROCESSING_STAGES = [
  {
    id: 1,
    title: "Document Text & Structure Extraction",
    desc: "Reading text layers, section headers, work history, and project blocks."
  },
  {
    id: 2,
    title: "Recruiter Signals & 10-Parameter Grading",
    desc: "Weighting Projects, Technical Skills, Education, Experience, and Achievements."
  },
  {
    id: 3,
    title: "Impact Metric & Quantification Audit",
    desc: "Scanning for measurable business impact (%, $, user scale, latency, outcomes)."
  },
  {
    id: 4,
    title: "ATS Compatibility & Format Readability",
    desc: "Checking layout parseability, typography standards, and recruiter ATS benchmarks."
  },
  {
    id: 5,
    title: "Synthesizing Explainable Score & Top Fixes",
    desc: "Computing 0-100 readiness score and drafting prioritized recruiter recommendations."
  }
];

const ResumeProcessingHub = ({
  fileName = "Resume.pdf",
  fileSize = null,
  currentStage = 0,
  progress = 25
}) => {
  return (
    <div className="processing-hub-card" role="status" aria-live="polite">
      {/* 3-Step Breadcrumb Pipeline */}
      <div className="processing-steps-tracker">
        <div className="proc-track-step completed">
          <div className="proc-track-num">✓</div>
          <div className="proc-track-info">
            <span className="proc-step-title">01 Upload</span>
            <span className="proc-step-sub">{fileName}</span>
          </div>
        </div>

        <div className="proc-track-line active"></div>

        <div className="proc-track-step active">
          <div className="proc-track-num pulse-num">02</div>
          <div className="proc-track-info">
            <span className="proc-step-title">02 Analyze</span>
            <span className="proc-step-sub">AI Scoring ({progress}%)</span>
          </div>
        </div>

        <div className="proc-track-line"></div>

        <div className="proc-track-step upcoming">
          <div className="proc-track-num">03</div>
          <div className="proc-track-info">
            <span className="proc-step-title">03 Improve</span>
            <span className="proc-step-sub">Fix-List &amp; Editor</span>
          </div>
        </div>
      </div>

      {/* Main Scanner Section */}
      <div className="processing-scanner-box">
        {/* Animated Radar Pulse Graphic */}
        <div className="radar-pulse-container">
          <div className="radar-pulse-ring ring-1"></div>
          <div className="radar-pulse-ring ring-2"></div>
          <div className="radar-pulse-core">
            <svg
              className="radar-spin-svg"
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>
          </div>
        </div>

        <div className="scanner-text-box">
          <div className="scanner-badge">
            <span className="scanner-sparkle">✦</span>
            <span>Real-Time Recruiter AI Audit</span>
          </div>
          <h3 className="scanner-title">
            Evaluating your resume across ten parameters...
          </h3>
          <p className="scanner-subtitle">
            Analyzing <strong>{fileName}</strong> {fileSize ? `(${fileSize})` : ""} against high-signal recruiter benchmarks.
          </p>
        </div>

        {/* Live Percentage & Progress Bar */}
        <div className="scanner-progress-block">
          <div className="scanner-progress-header">
            <span className="prog-label">Scoring Progress</span>
            <span className="prog-percent">{progress}%</span>
          </div>
          <div className="scanner-progress-track">
            <div
              className="scanner-progress-fill"
              style={{ width: `${Math.min(100, Math.max(5, progress))}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Sequential Checkpoints Checklist */}
      <div className="processing-checklist">
        {PROCESSING_STAGES.map((stage, idx) => {
          const isCompleted = idx < currentStage;
          const isActive = idx === currentStage;
          const isUpcoming = idx > currentStage;

          return (
            <div
              key={stage.id}
              className={`proc-check-item ${isCompleted ? "completed" : ""} ${isActive ? "active" : ""} ${isUpcoming ? "upcoming" : ""}`}
            >
              <div className="proc-check-indicator">
                {isCompleted ? (
                  <div className="check-icon-done">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                ) : isActive ? (
                  <div className="check-icon-active">
                    <span className="active-dot"></span>
                  </div>
                ) : (
                  <div className="check-icon-upcoming"></div>
                )}
              </div>

              <div className="proc-check-content">
                <h4 className="proc-check-title">{stage.title}</h4>
                <p className="proc-check-desc">{stage.desc}</p>
              </div>

              <div className="proc-check-status-tag">
                {isCompleted ? "Done" : isActive ? "Scanning..." : "Pending"}
              </div>
            </div>
          );
        })}
      </div>

      {/* Helpful Recruiter Signal Tip */}
      <div className="processing-tip-footer">
        <span className="tip-bulb">💡</span>
        <span>
          <strong>Recruiter Insight:</strong> Most applicant tracking systems filter out resumes with zero quantified achievements. We test each bullet for percentages, user scale, and dollar impact.
        </span>
      </div>
    </div>
  );
};

export default ResumeProcessingHub;
