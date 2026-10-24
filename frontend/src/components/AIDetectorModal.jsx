import React, { useState, useEffect } from "react";
import { detectAIContent, humanizeAIContent } from "../services/api";

const AIDetectorModal = ({
  isOpen,
  onClose,
  initialText = "",
  title = "AI Resume Detector & Humanizer",
  sectionType = "Resume Content",
  jobTitle = "",
  onApplyHumanized = null
}) => {
  const [currentText, setCurrentText] = useState(initialText);
  const [activeTab, setActiveTab] = useState("overview"); // "overview" | "sentences" | "cliches" | "humanizer"
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectionResult, setDetectionResult] = useState(null);
  const [detectError, setDetectError] = useState("");

  // Humanizer states
  const [selectedTone, setSelectedTone] = useState("authentic_impact");
  const [isHumanizing, setIsHumanizing] = useState(false);
  const [humanizeResult, setHumanizeResult] = useState(null);
  const [humanizeError, setHumanizeError] = useState("");
  const [appliedSuccess, setAppliedSuccess] = useState(false);
  const [copiedSuccess, setCopiedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCurrentText(initialText || "");
      setDetectionResult(null);
      setDetectError("");
      setHumanizeResult(null);
      setHumanizeError("");
      setAppliedSuccess(false);
      setCopiedSuccess(false);
      setActiveTab("overview");

      // Auto-run detection if sufficient text is provided
      if (initialText && initialText.trim().length >= 15) {
        runDetection(initialText);
      }
    }
  }, [isOpen, initialText]);

  const runDetection = async (textToScan = currentText) => {
    if (!textToScan || textToScan.trim().length < 15) {
      setDetectError("Please provide at least 15 characters of text to analyze AI patterns.");
      return;
    }

    setIsDetecting(true);
    setDetectError("");
    try {
      const data = await detectAIContent({
        text: textToScan,
        sectionType,
        context: `${jobTitle ? `Job Role: ${jobTitle}. ` : ""}Section: ${sectionType}`
      });
      setDetectionResult(data);
    } catch (err) {
      console.error(err);
      setDetectError(err.response?.data?.message || "Failed to analyze AI content. Check your Gemini API connection.");
    } finally {
      setIsDetecting(false);
    }
  };

  const runHumanize = async () => {
    const textToHumanize = currentText;
    if (!textToHumanize || textToHumanize.trim().length < 15) {
      setHumanizeError("Text is too short to humanize.");
      return;
    }

    setIsHumanizing(true);
    setHumanizeError("");
    setAppliedSuccess(false);
    try {
      const data = await humanizeAIContent({
        text: textToHumanize,
        sectionType,
        jobTitle,
        tone: selectedTone
      });
      setHumanizeResult(data);
    } catch (err) {
      console.error(err);
      setHumanizeError(err.response?.data?.message || "Failed to humanize text.");
    } finally {
      setIsHumanizing(false);
    }
  };

  const handleApply = () => {
    if (humanizeResult?.humanizedText && onApplyHumanized) {
      onApplyHumanized(humanizeResult.humanizedText);
      setAppliedSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1000);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 2000);
  };

  if (!isOpen) return null;

  // Determine score color category
  const aiScore = detectionResult ? detectionResult.overallAiScore : 0;
  const isHighRisk = aiScore >= 70;
  const isMediumRisk = aiScore >= 35 && aiScore < 70;
  const scoreColor = isHighRisk ? "#ef4444" : isMediumRisk ? "#f59e0b" : "#10b981";
  const scoreGradient = isHighRisk
    ? "linear-gradient(135deg, #ef4444, #dc2626)"
    : isMediumRisk
    ? "linear-gradient(135deg, #f59e0b, #d97706)"
    : "linear-gradient(135deg, #10b981, #059669)";

  return (
    <div className="ai-modal-overlay" onClick={onClose}>
      <div 
        className="ai-modal-dialog" 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="ai-modal-header">
          <div className="ai-modal-title-group">
            <span className="ai-modal-icon">🛡️</span>
            <div>
              <h3 className="ai-modal-title">{title}</h3>
              <p className="ai-modal-subtitle">
                ATS Authenticity Audit & AI Detection Engine • Section: <strong>{sectionType}</strong>
              </p>
            </div>
          </div>
          <button className="ai-modal-close-btn" onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="ai-modal-body">
          {/* Quick Rescan / Input preview if text modified */}
          <div className="ai-input-preview-bar">
            <div className="ai-input-info">
              <span className="ai-input-badge">Analyzed Text</span>
              <span className="ai-char-count">{currentText.length} characters ({currentText.split(/\s+/).filter(Boolean).length} words)</span>
            </div>
            <button 
              type="button" 
              className="ai-rescan-btn"
              onClick={() => runDetection(currentText)}
              disabled={isDetecting}
            >
              {isDetecting ? "🔄 Scanning..." : "⚡ Re-scan Text"}
            </button>
          </div>

          {/* Loading Animation */}
          {isDetecting && (
            <div className="ai-detect-loading-card">
              <div className="ai-radar-spinner"></div>
              <h4>Analyzing with Gemini AI Auditor...</h4>
              <p>Scanning perplexity, burstiness cadence, passive fillers, and ATS pattern markers</p>
            </div>
          )}

          {/* Error Message */}
          {detectError && !isDetecting && (
            <div className="ai-error-banner">
              <span>⚠️</span>
              <div>
                <strong>Audit Error:</strong> {detectError}
              </div>
            </div>
          )}

          {/* Detection Results */}
          {detectionResult && !isDetecting && (
            <>
              {/* Top Score Cards Grid */}
              <div className="ai-score-summary-grid">
                {/* Circular Score Gauge */}
                <div className="ai-gauge-card">
                  <div className="ai-gauge-wrapper">
                    <svg className="ai-gauge-svg" viewBox="0 0 120 120">
                      <circle
                        cx="60"
                        cy="60"
                        r="50"
                        className="ai-gauge-bg"
                      />
                      <circle
                        cx="60"
                        cy="60"
                        r="50"
                        className="ai-gauge-progress"
                        style={{
                          stroke: scoreColor,
                          strokeDasharray: 314.159,
                          strokeDashoffset: 314.159 * (1 - aiScore / 100)
                        }}
                      />
                    </svg>
                    <div className="ai-gauge-content">
                      <span className="ai-gauge-percent" style={{ color: scoreColor }}>
                        {aiScore}%
                      </span>
                      <span className="ai-gauge-label">AI PROBABILITY</span>
                    </div>
                  </div>
                  <div className="ai-gauge-footer">
                    <span 
                      className="ai-risk-tag" 
                      style={{ 
                        background: `${scoreColor}22`, 
                        color: scoreColor,
                        borderColor: `${scoreColor}66`
                      }}
                    >
                      {detectionResult.riskLevel} Risk of ATS Flagging
                    </span>
                  </div>
                </div>

                {/* Authenticity & Verdict Card */}
                <div className="ai-verdict-card">
                  <div className="ai-verdict-header">
                    <span className="ai-verdict-pill" style={{ background: scoreGradient }}>
                      {detectionResult.verdict}
                    </span>
                    <span className="ai-human-score">
                      🌱 <strong>{detectionResult.humanScore}%</strong> Human Authentic
                    </span>
                  </div>
                  <p className="ai-critique-text">{detectionResult.summaryCritique}</p>

                  {/* Metrics Row */}
                  <div className="ai-metrics-row">
                    <div className="ai-metric-pill">
                      <span className="metric-name">Cadence / Burstiness:</span>
                      <span className="metric-val">{detectionResult.metrics?.burstiness || "Natural"}</span>
                    </div>
                    <div className="ai-metric-pill">
                      <span className="metric-name">Predictability:</span>
                      <span className="metric-val">{detectionResult.metrics?.perplexity || "Balanced"}</span>
                    </div>
                    <div className="ai-metric-pill">
                      <span className="metric-name">Clichés Detected:</span>
                      <span className="metric-val" style={{ color: (detectionResult.metrics?.clicheCount || 0) > 0 ? "#ef4444" : "#10b981" }}>
                        {detectionResult.metrics?.clicheCount || 0}
                      </span>
                    </div>
                    <div className="ai-metric-pill">
                      <span className="metric-name">Readability:</span>
                      <span className="metric-val">{detectionResult.metrics?.atsReadability || "Professional"}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="ai-tabs-nav">
                <button
                  type="button"
                  className={`ai-tab-btn ${activeTab === "overview" ? "active" : ""}`}
                  onClick={() => setActiveTab("overview")}
                >
                  📊 Analysis & Heatmap
                </button>
                <button
                  type="button"
                  className={`ai-tab-btn ${activeTab === "cliches" ? "active" : ""}`}
                  onClick={() => setActiveTab("cliches")}
                >
                  ⚠️ Flagged Clichés ({detectionResult.flaggedPhrases?.length || 0})
                </button>
                <button
                  type="button"
                  className={`ai-tab-btn ai-tab-humanize-btn ${activeTab === "humanizer" ? "active" : ""}`}
                  onClick={() => {
                    setActiveTab("humanizer");
                    if (!humanizeResult && !isHumanizing) {
                      runHumanize();
                    }
                  }}
                >
                  ✨ 1-Click Humanizer & Polisher
                </button>
              </div>

              {/* TAB 1: OVERVIEW & SENTENCE HEATMAP */}
              {activeTab === "overview" && (
                <div className="ai-tab-content">
                  <div className="ai-section-subtitle">
                    <h4>Sentence-by-Sentence Authenticity Breakdown</h4>
                    <p>Color-coded risk score per sentence based on perplexity and phrasing pattern:</p>
                  </div>

                  <div className="ai-sentences-list">
                    {detectionResult.sentenceAnalysis?.map((item, idx) => {
                      const sScore = item.aiScore;
                      const sHigh = sScore >= 70;
                      const sMed = sScore >= 45 && sScore < 70;
                      const color = sHigh ? "#ef4444" : sMed ? "#f59e0b" : "#10b981";

                      return (
                        <div 
                          key={idx} 
                          className="ai-sentence-card"
                          style={{ borderLeftColor: color }}
                        >
                          <div className="ai-sentence-top">
                            <span 
                              className="ai-sentence-tag"
                              style={{ background: `${color}18`, color: color }}
                            >
                              {sHigh ? "🤖 High AI Risk" : sMed ? "⚡ AI-Assisted / Generic" : "🌱 Natural Human"} ({sScore}%)
                            </span>
                            {item.note && (
                              <span className="ai-sentence-note">{item.note}</span>
                            )}
                          </div>
                          <p className="ai-sentence-text">"{item.sentence}"</p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Recruiter / Humanize Tips */}
                  {detectionResult.humanizeTips?.length > 0 && (
                    <div className="ai-tips-card">
                      <h5>💡 Recruiter & ATS Optimization Tips:</h5>
                      <ul>
                        {detectionResult.humanizeTips.map((tip, i) => (
                          <li key={i}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: DETECTED CLICHES */}
              {activeTab === "cliches" && (
                <div className="ai-tab-content">
                  <div className="ai-section-subtitle">
                    <h4>Overused AI Resume Clichés & Robotic Phrases</h4>
                    <p>These specific terms trigger automated AI detectors and make recruiters question authenticity:</p>
                  </div>

                  {(!detectionResult.flaggedPhrases || detectionResult.flaggedPhrases.length === 0) ? (
                    <div className="ai-empty-cliches">
                      <span>🎉</span>
                      <p>No robotic clichés detected! Your text avoids overused AI buzzwords.</p>
                    </div>
                  ) : (
                    <div className="ai-cliches-grid">
                      {detectionResult.flaggedPhrases.map((phraseItem, idx) => (
                        <div key={idx} className="ai-cliche-card">
                          <div className="ai-cliche-header">
                            <span className="ai-cliche-badge">"{phraseItem.phrase}"</span>
                            <span className={`ai-severity-tag ${phraseItem.severity}`}>
                              {phraseItem.severity.toUpperCase()} RISK
                            </span>
                          </div>
                          <p className="ai-cliche-reason"><strong>Why it flags:</strong> {phraseItem.reason}</p>
                          {phraseItem.suggestedAlternative && (
                            <div className="ai-cliche-alternative">
                              <span className="alt-label">Try instead:</span>
                              <span className="alt-text">"{phraseItem.suggestedAlternative}"</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: 1-CLICK HUMANIZER */}
              {activeTab === "humanizer" && (
                <div className="ai-tab-content ai-humanizer-tab">
                  <div className="ai-humanizer-controls">
                    <div className="tone-selector-wrapper">
                      <label>Humanization Tone / Style:</label>
                      <div className="tone-pills">
                        <button
                          type="button"
                          className={`tone-pill ${selectedTone === "authentic_impact" ? "active" : ""}`}
                          onClick={() => setSelectedTone("authentic_impact")}
                        >
                          🌟 Authentic Impact (Recommended)
                        </button>
                        <button
                          type="button"
                          className={`tone-pill ${selectedTone === "concise_metrics" ? "active" : ""}`}
                          onClick={() => setSelectedTone("concise_metrics")}
                        >
                          📈 Metrics & Action Verbs
                        </button>
                        <button
                          type="button"
                          className={`tone-pill ${selectedTone === "conversational_pro" ? "active" : ""}`}
                          onClick={() => setSelectedTone("conversational_pro")}
                        >
                          💼 Conversational Executive
                        </button>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="ai-generate-human-btn"
                      onClick={runHumanize}
                      disabled={isHumanizing}
                    >
                      {isHumanizing ? "⏳ Humanizing Text..." : "✨ Re-generate Humanized Version"}
                    </button>
                  </div>

                  {humanizeError && (
                    <div className="ai-error-banner">
                      <span>⚠️</span>
                      <div>{humanizeError}</div>
                    </div>
                  )}

                  {isHumanizing && (
                    <div className="ai-detect-loading-card">
                      <div className="ai-radar-spinner"></div>
                      <h4>Humanizing content with executive recruiter cadence...</h4>
                      <p>Eliminating buzzwords, injecting burstiness, and polishing active verbs</p>
                    </div>
                  )}

                  {humanizeResult && !isHumanizing && (
                    <div className="ai-humanize-result-card">
                      <div className="ai-humanize-header">
                        <div className="ai-projected-score">
                          <span className="projected-badge">
                            Projected AI Score: <strong>{humanizeResult.projectedAiScore}%</strong>
                          </span>
                          <span className="reduction-badge">
                            🔻 Drops from {detectionResult.overallAiScore}% to ~{humanizeResult.projectedAiScore}% AI
                          </span>
                        </div>
                        <div className="ai-humanize-actions">
                          <button
                            type="button"
                            className="ai-copy-btn"
                            onClick={() => handleCopy(humanizeResult.humanizedText)}
                          >
                            {copiedSuccess ? "✅ Copied!" : "📋 Copy Text"}
                          </button>
                          {onApplyHumanized && (
                            <button
                              type="button"
                              className="ai-apply-btn"
                              onClick={handleApply}
                              disabled={appliedSuccess}
                            >
                              {appliedSuccess ? "✅ Applied to Resume!" : "✨ Apply to Resume"}
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Side by Side Comparison */}
                      <div className="ai-diff-grid">
                        <div className="ai-diff-column original">
                          <div className="diff-col-header">
                            <span>Original (High AI Markers)</span>
                            <span className="diff-score-tag bad">{detectionResult.overallAiScore}% AI</span>
                          </div>
                          <div className="diff-col-body">{currentText}</div>
                        </div>

                        <div className="ai-diff-column humanized">
                          <div className="diff-col-header">
                            <span>Humanized & ATS-Polished</span>
                            <span className="diff-score-tag good">{humanizeResult.projectedAiScore}% AI</span>
                          </div>
                          <div className="diff-col-body">{humanizeResult.humanizedText}</div>
                        </div>
                      </div>

                      {/* Improvements Made */}
                      {humanizeResult.improvements?.length > 0 && (
                        <div className="ai-improvements-box">
                          <h5>🛠️ Key Improvements Made:</h5>
                          <ul>
                            {humanizeResult.improvements.map((item, idx) => (
                              <li key={idx}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {/* Fallback if no text provided */}
          {!currentText && !isDetecting && (
            <div className="ai-empty-prompt">
              <span className="empty-icon">📝</span>
              <h4>No text selected to analyze</h4>
              <p>Type or paste your resume content in the editor to run the AI detection & humanizer audit.</p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="ai-modal-footer">
          <div className="ai-footer-buttons" style={{ marginLeft: "auto" }}>
            <button type="button" className="ai-footer-close" onClick={onClose}>
              Close
            </button>
            {activeTab !== "humanizer" && detectionResult && (
              <button
                type="button"
                className="ai-footer-primary"
                onClick={() => {
                  setActiveTab("humanizer");
                  if (!humanizeResult) runHumanize();
                }}
              >
                Go to Humanizer ✨
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIDetectorModal;
