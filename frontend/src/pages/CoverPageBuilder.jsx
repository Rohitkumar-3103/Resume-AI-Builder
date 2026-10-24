import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import CoverPreview, {
  TEMPLATES,
  SUBMISSION_TYPES,
  DEFAULT_COVER_DATA
} from "../components/CoverPreview";
import iiitLogo from "../assets/iiit_allahabad.png";

const COLOR_PRESETS = [
  { name: "Academic Navy", hex: "#0E4D92" },
  { name: "IIIT Emerald Green", hex: "#046A38" },
  { name: "Classic Crimson", hex: "#8B0000" },
  { name: "Royal Violet", hex: "#5B21B6" },
  { name: "Obsidian Slate", hex: "#1E293B" },
  { name: "Ocean Teal", hex: "#0D9488" },
  { name: "Warm Amber", hex: "#D97706" }
];

const CoverPageBuilder = () => {
  const [searchParams] = useSearchParams();
  const printAreaRef = useRef(null);

  // Initialize form data from localStorage or default
  const [formData, setFormData] = useState(() => {
    try {
      const saved = localStorage.getItem("covercraft_draft");
      if (saved) {
        let parsed = JSON.parse(saved);
        if (parsed.universityName === "International Islamic University Chittagong" || !parsed.logoUrl) {
          parsed.universityName = "Indian Institution of Information Technology Allahabad";
          parsed.institutionAddress = "Devghat, Jhalwa, Prayagraj (Allahabad), Uttar Pradesh, India";
          parsed.teacherInstitution = "Indian Institution of Information Technology Allahabad";
          parsed.logoUrl = iiitLogo;
        }
        const urlTpl = searchParams.get("template");
        if (urlTpl && TEMPLATES.some((t) => t.id === urlTpl)) {
          return { ...parsed, templateId: urlTpl };
        }
        return parsed;
      }
    } catch {
      // fallback
    }
    const urlTpl = searchParams.get("template");
    return {
      ...DEFAULT_COVER_DATA,
      templateId: urlTpl && TEMPLATES.some((t) => t.id === urlTpl) ? urlTpl : "classic-academic"
    };
  });

  const [previewZoom, setPreviewZoom] = useState(85);
  const [isExporting, setIsExporting] = useState(false);
  const [showLargeModal, setShowLargeModal] = useState(false);
  const [saveToast, setSaveToast] = useState(false);

  // Save to localStorage automatically on change
  useEffect(() => {
    try {
      localStorage.setItem("covercraft_draft", JSON.stringify(formData));
    } catch {
      // ignore
    }
  }, [formData]);

  // Sync if template query param changes
  useEffect(() => {
    const urlTpl = searchParams.get("template");
    if (urlTpl && TEMPLATES.some((t) => t.id === urlTpl)) {
      setFormData((prev) => ({ ...prev, templateId: urlTpl }));
    }
  }, [searchParams]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle Logo Upload
  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("File size exceeds 2 MB. Please upload an image under 2 MB.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        handleChange("logoUrl", uploadEvent.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Reset to empty/default
  const handleReset = () => {
    if (window.confirm("Reset all cover page fields to clean defaults?")) {
      setFormData({
        ...DEFAULT_COVER_DATA,
        assignmentTitle: "",
        subtitle: "",
        courseCode: "",
        courseTitle: "",
        semester: "",
        section: "",
        universityName: "",
        department: "",
        faculty: "",
        teacherName: "",
        studentName: "",
        studentId: "",
        logoUrl: ""
      });
      showTemporaryToast("Form reset");
    }
  };

  // Load Demo Data
  const handleLoadDemo = () => {
    setFormData({
      ...DEFAULT_COVER_DATA,
      logoUrl: iiitLogo,
      templateId: formData.templateId || "classic-academic"
    });
    showTemporaryToast("Sample data loaded");
  };

  const showTemporaryToast = (msg) => {
    setSaveToast(msg);
    setTimeout(() => setSaveToast(false), 2500);
  };

  // Group Member Handlers
  const handleAddMember = () => {
    setFormData((prev) => ({
      ...prev,
      groupMembers: [
        ...(prev.groupMembers || []),
        { name: "", id: "", dept: prev.department ? prev.department.split(" ")[0] : "CSE", section: prev.section || "A" }
      ]
    }));
  };

  const handleUpdateMember = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...(prev.groupMembers || [])];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, groupMembers: updated };
    });
  };

  const handleRemoveMember = (index) => {
    setFormData((prev) => ({
      ...prev,
      groupMembers: prev.groupMembers.filter((_, idx) => idx !== index)
    }));
  };

  // Download PDF using html2pdf.js
  const handleDownloadPDF = async () => {
    setIsExporting(true);
    try {
      const element = printAreaRef.current;
      if (!element) return;

      const opt = {
        margin: 0,
        filename: `${(formData.assignmentTitle || "Cover_Page").replace(/[^a-zA-Z0-9_-]/g, "_")}_Cover.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
      };

      // Dynamically load html2pdf if needed or use global
      if (window.html2pdf) {
        await window.html2pdf().set(opt).from(element).save();
      } else {
        const html2pdfModule = await import("html2pdf.js");
        const html2pdf = html2pdfModule.default || html2pdfModule;
        await html2pdf().set(opt).from(element).save();
      }
      showTemporaryToast("PDF downloaded successfully!");
    } catch (err) {
      console.error("PDF generation error:", err);
      // Fallback to print
      window.print();
    } finally {
      setIsExporting(false);
    }
  };

  // Native Print
  const handlePrint = () => {
    window.print();
  };

  // Export as Word / DOCX Compatible HTML
  const handleDownloadDocx = () => {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${formData.assignmentTitle || "Cover Page"}</title>
        <style>
          @page { size: A4; margin: 20mm; }
          body { font-family: ${formData.fontFamily || 'Times New Roman'}, serif; text-align: center; }
          .inst { font-size: 24pt; font-weight: bold; color: ${formData.accentColor}; }
          .dept { font-size: 14pt; margin-top: 6pt; }
          .type { font-size: 14pt; font-weight: bold; margin-top: 36pt; color: ${formData.accentColor}; }
          .title { font-size: 22pt; font-weight: bold; margin-top: 12pt; }
          .course { font-size: 14pt; margin-top: 18pt; }
          .split { margin-top: 48pt; width: 100%; display: table; }
          .col { display: table-cell; width: 50%; text-align: left; vertical-align: top; font-size: 11pt; }
          .date { margin-top: 48pt; font-size: 11pt; }
        </style>
      </head>
      <body>
        <div class="inst">${formData.universityName || ''}</div>
        <div class="dept">${formData.department || ''}</div>
        <div class="type">${(formData.documentType || 'ASSIGNMENT').toUpperCase()}</div>
        <div class="title">${formData.assignmentTitle || ''}</div>
        <div class="course">${formData.courseCode || ''} — ${formData.courseTitle || ''}</div>
        <div class="split">
          <div class="col">
            <strong>SUBMITTED TO:</strong><br/>
            ${formData.teacherName || ''}<br/>
            ${formData.teacherDesignation || ''}<br/>
            ${formData.teacherDepartment || ''}
          </div>
          <div class="col">
            <strong>SUBMITTED BY:</strong><br/>
            ${formData.studentName || ''}<br/>
            ID: ${formData.studentId || ''}<br/>
            ${formData.studentDepartment || ''}
          </div>
        </div>
        <div class="date">Date of Submission: ${formData.submissionDate || ''}</div>
      </body>
      </html>
    `;
    const blob = new Blob(["\ufeff" + htmlContent], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(formData.assignmentTitle || "Cover_Page").replace(/[^a-zA-Z0-9_-]/g, "_")}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showTemporaryToast("DOC file exported");
  };

  return (
    <div className="covercraft-create-page">
      {/* Toast Alert */}
      {saveToast && (
        <div className="cover-save-toast">
          <span>✓</span> {saveToast}
        </div>
      )}

      {/* Top Header Banner */}
      <div className="cover-page-header">
        <div className="cover-header-left">
          <h1 className="cover-page-title">Create your cover page</h1>

        </div>
        <div className="cover-header-actions">
          <button type="button" onClick={handleLoadDemo} className="cover-btn-outline-demo" title="Fill realistic academic sample data">
            ✨ Quick Demo
          </button>
          <button type="button" onClick={handleReset} className="cover-btn-outline-reset" title="Clear or reset inputs">
            ↺ Reset form
          </button>
          <Link to="/templates" className="cover-btn-outline-tpl">
            🎨 Templates
          </Link>
        </div>
      </div>

      <div className="cover-workbench-layout">
        {/* ============================================================== */}
        {/* LEFT COLUMN: FORM SECTIONS                                      */}
        {/* ============================================================== */}
        <div className="cover-form-column">
          
          {/* SECTION 1: DOCUMENT INFORMATION */}
          <section className="cover-form-section">
            <div className="cover-section-header">
              <span className="section-index-badge">1</span>
              <h2>Document information</h2>
            </div>

            {/* WHAT ARE YOU SUBMITTING? (EXACT IMAGE 1 DESIGN) */}
            <div className="cover-submitting-wrapper">
              <label className="cover-submitting-label">
                What are you submitting?
              </label>
              <div className="cover-submitting-pills-grid">
                {SUBMISSION_TYPES.map((type) => {
                  const isSelected = formData.documentType === type;
                  return (
                    <button
                      key={type}
                      type="button"
                      className={`cover-submission-pill-btn ${isSelected ? "selected" : ""}`}
                      onClick={() => handleChange("documentType", type)}
                    >
                      {type}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Title & Subtitle */}
            <div className="cover-input-grid">
              <div className="cover-form-field full-width">
                <label>
                  Assignment / report title <span className="req-star">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Software Testing Techniques and Test Case Design"
                  value={formData.assignmentTitle}
                  onChange={(e) => handleChange("assignmentTitle", e.target.value)}
                  className="cover-input"
                  required
                />
              </div>

              <div className="cover-form-field full-width">
                <label>Subtitle (optional)</label>
                <input
                  type="text"
                  placeholder="e.g. A study of black-box & white-box verification methods"
                  value={formData.subtitle}
                  onChange={(e) => handleChange("subtitle", e.target.value)}
                  className="cover-input"
                />
              </div>

              <div className="cover-form-field">
                <label>Course code</label>
                <input
                  type="text"
                  placeholder="e.g. CSE 4203"
                  value={formData.courseCode}
                  onChange={(e) => handleChange("courseCode", e.target.value)}
                  className="cover-input"
                />
              </div>

              <div className="cover-form-field">
                <label>Course title</label>
                <input
                  type="text"
                  placeholder="e.g. Software Testing and Quality Assurance"
                  value={formData.courseTitle}
                  onChange={(e) => handleChange("courseTitle", e.target.value)}
                  className="cover-input"
                />
              </div>

              <div className="cover-form-field">
                <label>Semester / trimester</label>
                <input
                  type="text"
                  placeholder="e.g. Fall 2026 / 7th Semester"
                  value={formData.semester}
                  onChange={(e) => handleChange("semester", e.target.value)}
                  className="cover-input"
                />
              </div>

              <div className="cover-form-field">
                <label>Section</label>
                <input
                  type="text"
                  placeholder="e.g. Section A"
                  value={formData.section}
                  onChange={(e) => handleChange("section", e.target.value)}
                  className="cover-input"
                />
              </div>

              <div className="cover-form-field">
                <label>Academic year</label>
                <input
                  type="text"
                  placeholder="e.g. 2026-27"
                  value={formData.academicYear}
                  onChange={(e) => handleChange("academicYear", e.target.value)}
                  className="cover-input"
                />
              </div>

              <div className="cover-form-field">
                <label>
                  Submission date <span className="req-star">*</span>
                </label>
                <input
                  type="date"
                  value={formData.submissionDate}
                  onChange={(e) => handleChange("submissionDate", e.target.value)}
                  className="cover-input"
                  required
                />
              </div>

              <div className="cover-form-field full-width">
                <label>Additional notes (optional)</label>
                <textarea
                  rows="2"
                  placeholder="Experiment number, lab group number, or special instructions..."
                  value={formData.additionalNotes}
                  onChange={(e) => handleChange("additionalNotes", e.target.value)}
                  className="cover-textarea"
                />
              </div>
            </div>
          </section>

          {/* SECTION 2: INSTITUTION */}
          <section className="cover-form-section">
            <div className="cover-section-header">
              <span className="section-index-badge">2</span>
              <h2>Institution</h2>
            </div>

            <div className="cover-input-grid">
              <div className="cover-form-field full-width">
                <label>
                  University or college name <span className="req-star">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Indian Institution of Information Technology Allahabad"
                  value={formData.universityName}
                  onChange={(e) => handleChange("universityName", e.target.value)}
                  className="cover-input"
                  required
                />
              </div>

              <div className="cover-form-field">
                <label>Faculty or school (optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Department of Information Technology"
                  value={formData.faculty}
                  onChange={(e) => handleChange("faculty", e.target.value)}
                  className="cover-input"
                />
              </div>

              <div className="cover-form-field">
                <label>
                  Department <span className="req-star">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Department of Computer Science & Engineering"
                  value={formData.department}
                  onChange={(e) => handleChange("department", e.target.value)}
                  className="cover-input"
                  required
                />
              </div>

              <div className="cover-form-field full-width">
                <label>Program or degree</label>
                <input
                  type="text"
                  placeholder="e.g. B.Tech in Information Technology"
                  value={formData.program}
                  onChange={(e) => handleChange("program", e.target.value)}
                  className="cover-input"
                />
              </div>

              <div className="cover-form-field full-width">
                <label>Institution address (optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Devghat, Jhalwa, Prayagraj (Allahabad), Uttar Pradesh, India"
                  value={formData.institutionAddress}
                  onChange={(e) => handleChange("institutionAddress", e.target.value)}
                  className="cover-input"
                />
              </div>

              {/* Logo Upload */}
              <div className="cover-form-field full-width">
                <label>Institution logo (optional · PNG or JPEG, max 2 MB)</label>
                <div className="cover-logo-upload-box">
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/jpg, image/webp"
                    onChange={handleLogoUpload}
                    id="inst-logo-upload"
                    className="cover-file-input"
                  />
                  <label htmlFor="inst-logo-upload" className="cover-file-upload-btn">
                    Choose File
                  </label>
                  <span className="cover-file-name">
                    {formData.logoUrl ? (formData.logoUrl === iiitLogo ? "IIIT Allahabad Official Logo Attached" : "Custom Logo Attached") : "Using academic crest preset"}
                  </span>
                  {formData.logoUrl && (
                    <button
                      type="button"
                      className="cover-remove-logo-btn"
                      onClick={() => handleChange("logoUrl", "")}
                    >
                      Remove
                    </button>
                  )}
                </div>
                <p className="cover-help-text">
                  The logo is rendered dynamically in your browser and is not uploaded to any remote server.
                </p>
              </div>
            </div>
          </section>

          {/* SECTION 3: SUBMITTED TO */}
          <section className="cover-form-section">
            <div className="cover-section-header">
              <span className="section-index-badge">3</span>
              <h2>Submitted to</h2>
            </div>

            <div className="cover-input-grid">
              <div className="cover-form-field">
                <label>
                  Teacher or supervisor name <span className="req-star">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Rahman Chowdhury"
                  value={formData.teacherName}
                  onChange={(e) => handleChange("teacherName", e.target.value)}
                  className="cover-input"
                  required
                />
              </div>

              <div className="cover-form-field">
                <label>Designation</label>
                <input
                  type="text"
                  placeholder="e.g. Associate Professor"
                  value={formData.teacherDesignation}
                  onChange={(e) => handleChange("teacherDesignation", e.target.value)}
                  className="cover-input"
                />
              </div>

              <div className="cover-form-field">
                <label>Department (optional)</label>
                <input
                  type="text"
                  placeholder="Defaults to institution department"
                  value={formData.teacherDepartment}
                  onChange={(e) => handleChange("teacherDepartment", e.target.value)}
                  className="cover-input"
                />
              </div>

              <div className="cover-form-field">
                <label>Institution (optional)</label>
                <input
                  type="text"
                  placeholder="Defaults to institution name"
                  value={formData.teacherInstitution}
                  onChange={(e) => handleChange("teacherInstitution", e.target.value)}
                  className="cover-input"
                />
              </div>
            </div>
          </section>

          {/* SECTION 4: SUBMITTED BY */}
          <section className="cover-form-section">
            <div className="cover-section-header">
              <span className="section-index-badge">4</span>
              <h2>Submitted by</h2>
            </div>

            {/* Individual vs Group Toggle */}
            <div className="cover-mode-toggle-group">
              <label className={`cover-radio-pill ${formData.submissionMode === "individual" ? "active" : ""}`}>
                <input
                  type="radio"
                  name="submissionMode"
                  value="individual"
                  checked={formData.submissionMode === "individual"}
                  onChange={() => handleChange("submissionMode", "individual")}
                />
                <span>Individual (Solo)</span>
              </label>

              <label className={`cover-radio-pill ${formData.submissionMode === "group" ? "active" : ""}`}>
                <input
                  type="radio"
                  name="submissionMode"
                  value="group"
                  checked={formData.submissionMode === "group"}
                  onChange={() => handleChange("submissionMode", "group")}
                />
                <span>Group Submission</span>
              </label>
            </div>

            {formData.submissionMode === "individual" ? (
              <div className="cover-input-grid">
                <div className="cover-form-field">
                  <label>
                    Student full name <span className="req-star">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Ayesha Siddika"
                    value={formData.studentName}
                    onChange={(e) => handleChange("studentName", e.target.value)}
                    className="cover-input"
                    required
                  />
                </div>

                <div className="cover-form-field">
                  <label>
                    Student ID <span className="req-star">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. C213047"
                    value={formData.studentId}
                    onChange={(e) => handleChange("studentId", e.target.value)}
                    className="cover-input"
                    required
                  />
                </div>

                <div className="cover-form-field">
                  <label>Department</label>
                  <input
                    type="text"
                    placeholder="e.g. Department of CSE"
                    value={formData.studentDepartment}
                    onChange={(e) => handleChange("studentDepartment", e.target.value)}
                    className="cover-input"
                  />
                </div>

                <div className="cover-form-field">
                  <label>Program</label>
                  <input
                    type="text"
                    placeholder="e.g. B.Sc. in CSE"
                    value={formData.studentProgram}
                    onChange={(e) => handleChange("studentProgram", e.target.value)}
                    className="cover-input"
                  />
                </div>

                <div className="cover-form-field">
                  <label>Semester / trimester</label>
                  <input
                    type="text"
                    placeholder="e.g. 7th Semester"
                    value={formData.studentSemester}
                    onChange={(e) => handleChange("studentSemester", e.target.value)}
                    className="cover-input"
                  />
                </div>

                <div className="cover-form-field">
                  <label>Section</label>
                  <input
                    type="text"
                    placeholder="e.g. Section A"
                    value={formData.studentSection}
                    onChange={(e) => handleChange("studentSection", e.target.value)}
                    className="cover-input"
                  />
                </div>

                <div className="cover-form-field full-width">
                  <label>Batch (optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Batch 56"
                    value={formData.studentBatch}
                    onChange={(e) => handleChange("studentBatch", e.target.value)}
                    className="cover-input"
                  />
                </div>
              </div>
            ) : (
              /* Group Member Management */
              <div className="cover-group-members-area">
                <div className="group-members-list">
                  {(formData.groupMembers || []).map((m, idx) => (
                    <div key={idx} className="group-member-row">
                      <span className="member-index">#{idx + 1}</span>
                      <input
                        type="text"
                        placeholder="Member Full Name"
                        value={m.name}
                        onChange={(e) => handleUpdateMember(idx, "name", e.target.value)}
                        className="cover-input member-name-input"
                      />
                      <input
                        type="text"
                        placeholder="Student ID"
                        value={m.id}
                        onChange={(e) => handleUpdateMember(idx, "id", e.target.value)}
                        className="cover-input member-id-input"
                      />
                      <input
                        type="text"
                        placeholder="Dept"
                        value={m.dept}
                        onChange={(e) => handleUpdateMember(idx, "dept", e.target.value)}
                        className="cover-input member-dept-input"
                      />
                      <input
                        type="text"
                        placeholder="Sec"
                        value={m.section}
                        onChange={(e) => handleUpdateMember(idx, "section", e.target.value)}
                        className="cover-input member-sec-input"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveMember(idx)}
                        className="member-remove-btn"
                        title="Remove member"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={handleAddMember}
                  className="add-member-btn"
                >
                  + Add Group Member
                </button>
              </div>
            )}
          </section>

          {/* SECTION 5: DESIGN */}
          <section className="cover-form-section">
            <div className="cover-section-header">
              <span className="section-index-badge">5</span>
              <h2>Design</h2>
            </div>
            <p className="cover-section-subnote">
              Switching templates keeps everything you have typed.
            </p>

            {/* Template Selector Grid */}
            <div className="cover-template-picker-grid">
              {TEMPLATES.map((tpl) => {
                const isActive = formData.templateId === tpl.id;
                return (
                  <button
                    key={tpl.id}
                    type="button"
                    className={`template-select-card ${isActive ? "selected" : ""}`}
                    onClick={() => handleChange("templateId", tpl.id)}
                  >
                    <span className="tpl-name">{tpl.name}</span>
                    <span className="tpl-cat">{tpl.category}</span>
                  </button>
                );
              })}
            </div>

            {/* Styling Controls */}
            <div className="cover-input-grid" style={{ marginTop: "1.5rem" }}>
              {/* Accent Color */}
              <div className="cover-form-field full-width">
                <label>Accent colour</label>
                <div className="cover-color-picker-row">
                  <div className="color-presets-list">
                    {COLOR_PRESETS.map((p) => (
                      <button
                        key={p.hex}
                        type="button"
                        className={`color-preset-circle ${formData.accentColor === p.hex ? "active" : ""}`}
                        style={{ backgroundColor: p.hex }}
                        onClick={() => handleChange("accentColor", p.hex)}
                        title={p.name}
                      />
                    ))}
                  </div>
                  <div className="custom-color-input-wrap">
                    <label
                      className={`custom-color-picker-wrapper ${!COLOR_PRESETS.some(p => p.hex.toLowerCase() === formData.accentColor?.toLowerCase()) ? "selected" : ""}`}
                      style={{
                        backgroundColor: formData.accentColor,
                        ...(!COLOR_PRESETS.some(p => p.hex.toLowerCase() === formData.accentColor?.toLowerCase()) ? {
                          borderColor: "var(--bg-card)",
                          boxShadow: `0 0 0 3px ${formData.accentColor}`
                        } : {})
                      }}
                      title="Custom Color Picker"
                    >
                      <input
                        type="color"
                        value={formData.accentColor}
                        onChange={(e) => handleChange("accentColor", e.target.value)}
                      />
                      <span className="picker-icon">🎨</span>
                    </label>
                    <input
                      type="text"
                      value={formData.accentColor}
                      onChange={(e) => handleChange("accentColor", e.target.value)}
                      className="cover-input color-hex-text"
                    />
                  </div>
                </div>
              </div>

              {/* Font */}
              <div className="cover-form-field">
                <label>Font family</label>
                <select
                  value={formData.fontFamily}
                  onChange={(e) => handleChange("fontFamily", e.target.value)}
                  className="cover-select"
                >
                  <option value="Times New Roman">Times New Roman (Traditional Academic)</option>
                  <option value="Garamond">Garamond (Classic Book Serif)</option>
                  <option value="Georgia">Georgia (Warm Serif)</option>
                  <option value="Inter">Inter (Clean Modern Sans)</option>
                  <option value="Outfit">Outfit (Geometric Modern)</option>
                  <option value="Merriweather">Merriweather (Editorial)</option>
                </select>
                <p className="cover-help-text">In Word, falls back to serif or sans-serif appropriately.</p>
              </div>

              {/* Layout Density */}
              <div className="cover-form-field">
                <label>Layout density</label>
                <select
                  value={formData.layoutDensity}
                  onChange={(e) => handleChange("layoutDensity", e.target.value)}
                  className="cover-select"
                >
                  <option value="normal">Normal</option>
                  <option value="compact">Compact (Shorter page items)</option>
                  <option value="relaxed">Relaxed (Generous whitespace)</option>
                </select>
              </div>

              {/* Toggles */}
              <div className="cover-form-field full-width checkboxes-row">
                <label className="cover-checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.showLogo}
                    onChange={(e) => handleChange("showLogo", e.target.checked)}
                  />
                  <span>Show logo / crest</span>
                </label>

                <label className="cover-checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.showInstitutionHeader}
                    onChange={(e) => handleChange("showInstitutionHeader", e.target.checked)}
                  />
                  <span>Show institution header</span>
                </label>
              </div>

              <div className="cover-form-field full-width">
                <label>Footer text (optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Always check your institution's formatting rules."
                  value={formData.footerText}
                  onChange={(e) => handleChange("footerText", e.target.value)}
                  className="cover-input"
                />
              </div>
            </div>
          </section>

        </div>

        {/* ============================================================== */}
        {/* RIGHT COLUMN: STICKY LIVE A4 PREVIEW & EXPORT ACTIONS          */}
        {/* ============================================================== */}
        <div className="cover-preview-column">
          <div className="cover-preview-sticky-card">
            
            {/* Top Toolbar */}
            <div className="preview-top-toolbar">
              <button
                type="button"
                className="preview-inspect-btn"
                onClick={() => setShowLargeModal(true)}
              >
                ⤢ Inspect larger preview
              </button>

              <div className="preview-zoom-controls">
                <button
                  type="button"
                  className="zoom-btn"
                  onClick={() => setPreviewZoom((z) => Math.max(50, z - 10))}
                  title="Zoom out"
                >
                  -
                </button>
                <span className="zoom-val">{previewZoom}%</span>
                <button
                  type="button"
                  className="zoom-btn"
                  onClick={() => setPreviewZoom((z) => Math.min(130, z + 10))}
                  title="Zoom in"
                >
                  +
                </button>
                <button
                  type="button"
                  className="zoom-reset-btn"
                  onClick={() => setPreviewZoom(85)}
                  title="Reset zoom"
                >
                  Fit
                </button>
              </div>
            </div>

            {/* A4 Sheet Container */}
            <div className="preview-canvas-viewport">
              <div
                className="preview-canvas-transformer"
                style={{
                  transform: `scale(${previewZoom / 100})`,
                  transformOrigin: "top center"
                }}
              >
                <CoverPreview
                  data={formData}
                  customRef={printAreaRef}
                />
              </div>
            </div>

            {/* Export Action Buttons */}
            <div className="preview-export-actions">
              <button
                type="button"
                className="cover-download-pdf-btn"
                onClick={handleDownloadPDF}
                disabled={isExporting}
              >
                {isExporting ? "Generating PDF..." : "📥 Download PDF"}
              </button>

              <button
                type="button"
                className="cover-download-docx-btn"
                onClick={handleDownloadDocx}
              >
                📄 Download DOCX
              </button>

              <button
                type="button"
                className="cover-print-btn"
                onClick={handlePrint}
              >
                🖨️ Print
              </button>
            </div>

            <p className="preview-disclaimer">
              Always check your institution's own formatting requirements before submitting.
            </p>
          </div>
        </div>

      </div>

      {/* FULLSCREEN INSPECT MODAL */}
      {showLargeModal && (
        <div className="template-modal-backdrop" onClick={() => setShowLargeModal(false)}>
          <div className="template-modal-content inspect-modal" onClick={(e) => e.stopPropagation()}>
            <div className="template-modal-header">
              <div>
                <h2>{formData.assignmentTitle || "Cover Page Preview"}</h2>
                <span className="modal-category-tag">{formData.templateId}</span>
              </div>
              <div className="modal-header-actions">
                <button
                  type="button"
                  className="modal-use-btn"
                  onClick={handleDownloadPDF}
                >
                  Download PDF
                </button>
                <button
                  type="button"
                  className="modal-close-btn"
                  onClick={() => setShowLargeModal(false)}
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="template-modal-body modal-inspect-body">
              <CoverPreview data={formData} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoverPageBuilder;
