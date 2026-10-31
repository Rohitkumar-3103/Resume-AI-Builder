import React from "react";
import "./ResumeScoringShowcase.css";

const HowItWorksSection = () => {
  return (
    <section className="showcase-root how-it-works-section" aria-label="How it works">
      <div className="showcase-container">
        <div className="hiw-layout-grid">
          {/* Left Title Column */}
          <div className="showcase-section-header">
            <span className="showcase-tag">HOW IT WORKS</span>
            <h2 className="showcase-title">
              From upload to offer-ready in three steps
            </h2>
          </div>

          {/* Right 3-Step Process Pipeline */}
          <div className="hiw-steps-row">
            {/* Step 01: Upload */}
            <div className="hiw-step-card">
              <div className="hiw-card-top">
                <div className="hiw-icon-badge badge-primary" aria-hidden="true">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                </div>
                <span className="hiw-step-number">01</span>
              </div>
              <h3>Upload</h3>
              <p>
                Drop in a PDF or DOCX. No job description, no copy-pasting, no friction.
              </p>
            </div>

            {/* Connector 1 -> 2 */}
            <div className="hiw-connector" aria-hidden="true"></div>

            {/* Step 02: Analyze */}
            <div className="hiw-step-card">
              <div className="hiw-card-top">
                <div className="hiw-icon-badge badge-mint" aria-hidden="true">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="7" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    <line x1="8" y1="11" x2="14" y2="11" />
                  </svg>
                </div>
                <span className="hiw-step-number">02</span>
              </div>
              <h3>Analyze</h3>
              <p>
                We parse, measure and score your resume across ten parameters in seconds.
              </p>
            </div>

            {/* Connector 2 -> 3 */}
            <div className="hiw-connector" aria-hidden="true"></div>

            {/* Step 03: Improve */}
            <div className="hiw-step-card">
              <div className="hiw-card-top">
                <div className="hiw-icon-badge badge-mint" aria-hidden="true">
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
                    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
                    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
                    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
                    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
                    <circle cx="19" cy="5" r="1" fill="currentColor" />
                  </svg>
                </div>
                <span className="hiw-step-number">03</span>
              </div>
              <h3>Improve</h3>
              <p>
                Get a prioritized fix-list and AI feedback. Re-upload and watch your score climb.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
