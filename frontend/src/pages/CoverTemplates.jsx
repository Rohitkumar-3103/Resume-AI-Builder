import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CoverPreview, { TEMPLATES, DEFAULT_COVER_DATA } from "../components/CoverPreview";

const CATEGORIES = ["All", "Formal", "Minimal", "Professional", "Technical", "Research"];

const CoverTemplates = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [previewModalTemplate, setPreviewModalTemplate] = useState(null);

  // Filter templates
  const filteredTemplates = TEMPLATES.filter((tpl) => {
    const matchesCategory =
      selectedCategory === "All" ||
      tpl.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesQuery =
      tpl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.bestFor.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const handleUseTemplate = (templateId) => {
    navigate(`/create?template=${templateId}`);
  };

  return (
    <div className="cover-templates-page">
      {/* Hero Header */}
      <div className="cover-templates-hero">
        <div className="templates-hero-content">
          <div className="cover-hero-pill">
            <span className="sparkle-icon">📄</span> ACADEMIC COVER CRAFT
          </div>
          <h1 className="templates-main-title">Templates</h1>

          <div className="templates-cta-row">
            <Link to="/create" className="templates-btn-primary">
              <span className="plus-icon">+</span> Create Your Cover Page
            </Link>
          </div>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="templates-filter-container">
          <div className="templates-filter-pills">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`template-filter-pill ${
                  selectedCategory === cat ? "active" : ""
                }`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="templates-search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search templates (e.g. Minimal, Thesis, Lab)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="templates-search-input"
            />
            {searchQuery && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={() => setSearchQuery("")}
              >
                ×
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="templates-grid-wrapper">
        <div className="templates-cards-grid">
          {filteredTemplates.map((tpl) => {
            const previewData = {
              ...DEFAULT_COVER_DATA,
              templateId: tpl.id
            };

            return (
              <div key={tpl.id} className="template-showcase-card">
                {/* Visual miniature A4 preview */}
                <div
                  className="template-card-preview-area"
                  onClick={() => handleUseTemplate(tpl.id)}
                  title={`Click to use ${tpl.name}`}
                >
                  <div className="preview-scaler">
                    <CoverPreview data={previewData} isThumbnail={true} />
                  </div>
                  <div className="template-card-overlay">
                    <span className="use-overlay-btn">Use This Template →</span>
                  </div>
                </div>

                {/* Card Details */}
                <div className="template-card-details">
                  <div className="template-card-header">
                    <h3 className="template-title">{tpl.name}</h3>
                    <span className={`template-badge badge-${tpl.category.toLowerCase()}`}>
                      {tpl.category}
                    </span>
                  </div>

                  <p className="template-desc">{tpl.description}</p>
                  
                  <div className="template-best-for">
                    <span className="best-for-label">Best for:</span> {tpl.bestFor}
                  </div>

                  {/* Actions */}
                  <div className="template-actions">
                    <button
                      type="button"
                      className="template-btn-preview"
                      onClick={() => setPreviewModalTemplate(tpl)}
                    >
                      Preview
                    </button>
                    <button
                      type="button"
                      className="template-btn-use"
                      onClick={() => handleUseTemplate(tpl.id)}
                    >
                      Use Template
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="templates-empty-state">
            <div className="empty-icon">📂</div>
            <h3>No templates matched "{searchQuery}"</h3>
            <p>Try searching with another keyword or resetting the category filter.</p>
            <button
              className="reset-filter-btn"
              onClick={() => {
                setSelectedCategory("All");
                setSearchQuery("");
              }}
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Full-size Preview Modal */}
      {previewModalTemplate && (
        <div className="template-modal-backdrop" onClick={() => setPreviewModalTemplate(null)}>
          <div className="template-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="template-modal-header">
              <div>
                <h2>{previewModalTemplate.name}</h2>
                <span className="modal-category-tag">{previewModalTemplate.category}</span>
              </div>
              <div className="modal-header-actions">
                <button
                  type="button"
                  className="modal-use-btn"
                  onClick={() => handleUseTemplate(previewModalTemplate.id)}
                >
                  Use Template →
                </button>
                <button
                  type="button"
                  className="modal-close-btn"
                  onClick={() => setPreviewModalTemplate(null)}
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="template-modal-body">
              <div className="modal-preview-wrapper">
                <CoverPreview
                  data={{
                    ...DEFAULT_COVER_DATA,
                    templateId: previewModalTemplate.id
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoverTemplates;
