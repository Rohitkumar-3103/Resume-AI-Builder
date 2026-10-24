import React, { useState, useEffect } from "react";
import { getCareerPlaybook } from "../services/api";

const CareerPlaybook = () => {
  const [playbookData, setPlaybookData] = useState(null);
  const [activeVerbCategory, setActiveVerbCategory] = useState("Engineering & Development");
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedVerb, setCopiedVerb] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlaybook = async () => {
      try {
        const data = await getCareerPlaybook();
        setPlaybookData(data);
      } catch (err) {
        console.error("Failed to load playbook data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlaybook();
  }, []);

  const handleCopyVerb = (verb) => {
    navigator.clipboard.writeText(verb);
    setCopiedVerb(verb);
    setTimeout(() => setCopiedVerb(""), 1800);
  };

  const currentVerbs = playbookData?.actionVerbs?.[activeVerbCategory] || [];
  const filteredVerbs = currentVerbs.filter((v) =>
    v.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="playbook-page">
      {/* Hero */}
      <div className="playbook-hero">
        <div className="playbook-hero-badge">
          <span>💡</span> ATS Guidelines & Career Playbook
        </div>
        <h1>Resume Writing Playbook & Power Action Verbs</h1>
        <p>
          Master the art of high-impact resume writing. Browse 100+ recruiter-approved power action verbs,
          learn Google's XYZ bullet formula, and review our battle-tested ATS compliance checklist.
        </p>
      </div>

      <div className="playbook-container">
        {/* Section 1: Power Action Verbs Directory */}
        <div className="playbook-section">
          <div className="section-header-row">
            <div>
              <h2>⚡ High-Impact Power Action Verbs</h2>
              <p>Replace passive phrases with verbs that convey ownership and technical mastery</p>
            </div>
            <div className="verb-search-box">
              <input
                type="text"
                placeholder="Search action verbs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="verb-search-input"
              />
            </div>
          </div>

          {/* Verb Category Tabs */}
          {playbookData?.actionVerbs && (
            <div className="verb-categories-nav">
              {Object.keys(playbookData.actionVerbs).map((cat) => (
                <button
                  key={cat}
                  className={`verb-cat-btn ${activeVerbCategory === cat ? "active" : ""}`}
                  onClick={() => {
                    setActiveVerbCategory(cat);
                    setSearchTerm("");
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {/* Verbs Grid */}
          <div className="verbs-grid">
            {filteredVerbs.length > 0 ? (
              filteredVerbs.map((verb, idx) => (
                <button
                  key={idx}
                  onClick={() => handleCopyVerb(verb)}
                  className={`verb-pill ${copiedVerb === verb ? "copied" : ""}`}
                  title="Click to copy to clipboard"
                >
                  <span className="verb-text">{verb}</span>
                  <span className="copy-indicator">
                    {copiedVerb === verb ? "✓ Copied" : "📋"}
                  </span>
                </button>
              ))
            ) : (
              <div className="no-verbs-found">No verbs matching "{searchTerm}"</div>
            )}
          </div>
        </div>

        {/* Section 2: Google's XYZ Formula */}
        <div className="playbook-section">
          <h2>📐 Google's XYZ Bullet Point Formula</h2>
          <p className="section-subtext">
            Recruiters look for concrete outcomes. Structure every bullet point using the formula:{" "}
            <strong>"Accomplished [X] as measured by [Y] by doing [Z]"</strong>
          </p>

          <div className="formula-cards-grid">
            {playbookData?.bulletFormulas?.map((f, idx) => (
              <div key={idx} className="formula-card">
                <div className="formula-card-top">
                  <span className="formula-tag">{f.category}</span>
                </div>
                <div className="formula-structure">
                  <span className="lbl">Formula Blueprint:</span>
                  <p>{f.formula}</p>
                </div>
                <div className="formula-example">
                  <span className="lbl">⭐ Production Example:</span>
                  <p>"{f.example}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: ATS Golden Rules */}
        <div className="playbook-section">
          <h2>🛡️ 5 ATS Compliance Golden Rules</h2>
          <p className="section-subtext">
            Follow these rules so your resume passes 100% of automated scans and gets into human recruiters' hands.
          </p>

          <div className="rules-cards-grid">
            {playbookData?.atsRules?.map((r, idx) => (
              <div key={idx} className="rule-card">
                <div className="rule-badge">Rule #{idx + 1}</div>
                <h3>{r.rule}</h3>
                <p>{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerPlaybook;
