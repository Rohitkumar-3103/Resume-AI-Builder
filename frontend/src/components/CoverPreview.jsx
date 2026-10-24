import React from "react";
import iiitLogo from "../assets/iiit_allahabad.png";

export const TEMPLATES = [
  {
    id: "classic-academic",
    name: "Classic Academic",
    category: "Formal",
    description: "Centered institution header, traditional serif typography, and clear Submitted To / By sections.",
    bestFor: "University assignments, coursework, mid-term & final papers"
  },
  {
    id: "modern-minimal",
    name: "Modern Minimal",
    category: "Minimal",
    description: "Left-aligned, large title, generous whitespace, and a sleek accent touch.",
    bestFor: "Essays, case studies, modern university presentations"
  },
  {
    id: "corporate-report",
    name: "Corporate Report",
    category: "Professional",
    description: "Bold accent header bar, structured information grid, and strong typographic hierarchy.",
    bestFor: "Internship reports, project documentation, business plans"
  },
  {
    id: "elegant-border",
    name: "Elegant Border",
    category: "Formal",
    description: "Double page border framing the page with centered, balanced details.",
    bestFor: "Formal assignments, dissertations, special submissions"
  },
  {
    id: "technical-lab",
    name: "Technical Lab Report",
    category: "Technical",
    description: "Course code and title emphasized; built for CSE, engineering, and science labs.",
    bestFor: "Lab reports, software testing logs, engineering experiments"
  },
  {
    id: "research-thesis",
    name: "Research & Thesis",
    category: "Research",
    description: "Formal hierarchy with author and supervisor blocks and room for long titles.",
    bestFor: "Thesis, dissertations, research papers, seminar projects"
  }
];

export const SUBMISSION_TYPES = [
  "Assignment",
  "Homework",
  "Lab Report",
  "Project Report",
  "Research Paper",
  "Internship Report",
  "Thesis / Dissertation",
  "Case Study",
  "Seminar Report",
  "Other"
];

export const DEFAULT_COVER_DATA = {
  documentType: "Assignment",
  assignmentTitle: "Software Testing Techniques and Quality Assurance",
  subtitle: "A comprehensive study of black-box & white-box verification methods",
  courseCode: "CSE 4203",
  courseTitle: "Software Testing and Quality Assurance",
  semester: "Fall 2026",
  section: "Section A",
  academicYear: "2026–2027",
  submissionDate: new Date().toISOString().split("T")[0],
  additionalNotes: "",
  
  // Institution
  universityName: "Indian Institution of Information Technology Allahabad",
  faculty: "Department of Information Technology",
  department: "Department of Computer Science & Engineering",
  program: "B.Tech in Information Technology",
  institutionAddress: "Devghat, Jhalwa, Prayagraj (Allahabad), Uttar Pradesh, India",
  logoUrl: iiitLogo,
  showLogo: true,
  showInstitutionHeader: true,
  
  // Submitted to
  teacherName: "Dr. Rahman Chowdhury",
  teacherDesignation: "Associate Professor",
  teacherDepartment: "Department of Information Technology",
  teacherInstitution: "Indian Institution of Information Technology Allahabad",
  
  // Submitted by
  submissionMode: "individual", // 'individual' or 'group'
  studentName: "Ayesha Siddika",
  studentId: "C213047",
  studentDepartment: "Department of Computer Science and Engineering",
  studentProgram: "B.Sc. in CSE",
  studentSemester: "7th Semester",
  studentSection: "Section A",
  studentBatch: "Batch 56",
  
  groupMembers: [
    { name: "Ayesha Siddika", id: "C213047", dept: "CSE", section: "A" },
    { name: "Tanvir Ahmed", id: "C213048", dept: "CSE", section: "A" },
    { name: "Nusrat Jahan", id: "C213052", dept: "CSE", section: "A" },
    { name: "Farhan Kabir", id: "C213059", dept: "CSE", section: "A" }
  ],
  
  // Styling
  templateId: "classic-academic",
  accentColor: "#0E4D92",
  fontFamily: "Times New Roman",
  borderStyle: "default",
  layoutDensity: "normal",
  footerText: "Always check your institution's specific formatting requirements."
};

const CoverPreview = ({
  data,
  scale = 1,
  isThumbnail = false,
  customRef = null
}) => {
  const d = data || DEFAULT_COVER_DATA;
  const template = d.templateId || "classic-academic";
  const accent = d.accentColor || "#0E4D92";
  const font = d.fontFamily || "Times New Roman";

  // Font family mapping
  const getFontFamily = () => {
    switch (font) {
      case "Times New Roman":
        return "'Times New Roman', Times, serif";
      case "Garamond":
        return "Garamond, Baskerville, 'Baskerville Old Face', 'Hoefler Text', serif";
      case "Georgia":
        return "Georgia, serif";
      case "Inter":
        return "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";
      case "Outfit":
        return "'Outfit', 'Plus Jakarta Sans', sans-serif";
      case "Merriweather":
        return "'Merriweather', Georgia, serif";
      default:
        return "'Times New Roman', Times, serif";
    }
  };

  // Format date nicely
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    try {
      const parts = dateStr.split("-");
      if (parts.length === 3) {
        const date = new Date(parts[0], parts[1] - 1, parts[2]);
        return date.toLocaleDateString("en-US", {
          day: "numeric",
          month: "long",
          year: "numeric"
        });
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  const formattedDate = formatDate(d.submissionDate);

  // Default University Crest SVG if no uploaded logo
  const defaultCrest = (
    <svg viewBox="0 0 100 100" className="cover-crest-svg" fill="none" stroke={accent} strokeWidth="2.5">
      <circle cx="50" cy="50" r="44" stroke={accent} strokeWidth="3" />
      <circle cx="50" cy="50" r="38" stroke={accent} strokeWidth="1" strokeDasharray="3 3" />
      <path d="M50 18 L68 32 L68 55 C68 68 50 80 50 80 C50 80 32 68 32 55 L32 32 Z" fill={`${accent}15`} stroke={accent} strokeWidth="2" />
      <path d="M50 28 L50 68" stroke={accent} strokeWidth="2" />
      <path d="M38 48 L62 48" stroke={accent} strokeWidth="2" />
      <circle cx="50" cy="38" r="4" fill={accent} />
      <path d="M44 60 L50 56 L56 60" stroke={accent} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );

  // Density styles
  const densityMultiplier = d.layoutDensity === "compact" ? 0.85 : d.layoutDensity === "relaxed" ? 1.15 : 1;

  // Render Submitted By (Solo vs Group)
  const renderSubmittedBy = () => {
    if (d.submissionMode === "group") {
      return (
        <div className="cover-submitted-group">
          <div className="cover-block-label" style={{ color: accent }}>
            SUBMITTED BY (GROUP)
          </div>
          <table className="cover-group-table" style={{ fontSize: isThumbnail ? "5px" : "11px" }}>
            <thead>
              <tr style={{ borderBottom: `1.5px solid ${accent}` }}>
                <th>#</th>
                <th>Name</th>
                <th>Student ID</th>
                <th>Dept & Sec</th>
              </tr>
            </thead>
            <tbody>
              {(d.groupMembers || []).map((m, idx) => (
                <tr key={idx}>
                  <td>{idx + 1}</td>
                  <td className="cover-group-name">{m.name || "Student Name"}</td>
                  <td>{m.id || "ID"}</td>
                  <td>{m.dept ? `${m.dept} - ${m.section || "A"}` : m.section || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    return (
      <div className="cover-submitted-individual">
        <div className="cover-block-label" style={{ color: accent }}>
          SUBMITTED BY
        </div>
        <div className="cover-person-name">{d.studentName || "Student Full Name"}</div>
        <div className="cover-person-meta">
          {d.studentId && <div><strong>ID:</strong> {d.studentId}</div>}
          {d.studentDepartment && <div>{d.studentDepartment}</div>}
          {d.studentProgram && <div>{d.studentProgram}</div>}
          {(d.studentSemester || d.studentSection) && (
            <div>
              {[d.studentSemester, d.studentSection && `Sec: ${d.studentSection}`].filter(Boolean).join(" · ")}
            </div>
          )}
          {d.studentBatch && <div>{d.studentBatch}</div>}
        </div>
      </div>
    );
  };

  const renderSubmittedTo = () => (
    <div className="cover-submitted-to">
      <div className="cover-block-label" style={{ color: accent }}>
        SUBMITTED TO
      </div>
      <div className="cover-person-name">{d.teacherName || "Teacher / Supervisor Name"}</div>
      <div className="cover-person-meta">
        {d.teacherDesignation && <div>{d.teacherDesignation}</div>}
        {d.teacherDepartment && <div>{d.teacherDepartment}</div>}
        {d.teacherInstitution && <div>{d.teacherInstitution}</div>}
      </div>
    </div>
  );

  return (
    <div 
      className={`cover-a4-sheet template-${template} ${isThumbnail ? "cover-thumbnail-mode" : ""}`}
      ref={customRef}
      style={{
        fontFamily: getFontFamily(),
        "--cover-accent": accent,
        transform: scale !== 1 ? `scale(${scale})` : undefined,
        transformOrigin: "top center"
      }}
    >
      {/* 1. CLASSIC ACADEMIC TEMPLATE */}
      {template === "classic-academic" && (
        <div className="cover-layout-classic" style={{ gap: `${24 * densityMultiplier}px` }}>
          {d.showInstitutionHeader && (
            <div className="cover-classic-header">
              <h1 className="cover-inst-name" style={{ color: accent }}>
                {d.universityName || "YOUR UNIVERSITY NAME"}
              </h1>
              {d.faculty && <h2 className="cover-inst-faculty">{d.faculty}</h2>}
              {d.department && <h3 className="cover-inst-dept">{d.department}</h3>}
              
              {d.showLogo && (
                <div className="cover-logo-wrapper">
                  {d.logoUrl ? (
                    <img src={d.logoUrl} alt="Institution Logo" className="cover-logo-img" />
                  ) : (
                    defaultCrest
                  )}
                </div>
              )}
            </div>
          )}

          <div className="cover-divider-line" style={{ backgroundColor: accent }} />

          <div className="cover-classic-body">
            <div className="cover-doc-badge" style={{ color: accent, borderColor: `${accent}40` }}>
              {d.documentType?.toUpperCase() || "ASSIGNMENT"}
            </div>
            
            <h2 className="cover-main-title">{d.assignmentTitle || "Your Assignment Title"}</h2>
            {d.subtitle && <p className="cover-subtitle">{d.subtitle}</p>}

            <div className="cover-course-box">
              {d.courseCode && <span className="cover-course-code">{d.courseCode}</span>}
              {d.courseCode && d.courseTitle && <span className="cover-course-sep"> — </span>}
              {d.courseTitle && <span className="cover-course-title">{d.courseTitle}</span>}
              <div className="cover-term-row">
                {[d.semester, d.academicYear].filter(Boolean).join(" · ")}
              </div>
            </div>
          </div>

          <div className="cover-divider-line" style={{ backgroundColor: `${accent}30` }} />

          <div className="cover-parties-row">
            {renderSubmittedTo()}
            {renderSubmittedBy()}
          </div>

          <div className="cover-classic-footer">
            <div className="cover-date-display">
              <strong>Date of Submission:</strong> {formattedDate || "Submission Date"}
            </div>
            {d.footerText && <div className="cover-custom-footer">{d.footerText}</div>}
          </div>
        </div>
      )}

      {/* 2. MODERN MINIMAL TEMPLATE */}
      {template === "modern-minimal" && (
        <div className="cover-layout-minimal" style={{ gap: `${28 * densityMultiplier}px` }}>
          <div className="cover-minimal-accent-bar" style={{ backgroundColor: accent }} />

          <div className="cover-minimal-top">
            <div className="cover-minimal-brand">
              {d.showLogo && (
                <div className="cover-minimal-logo">
                  {d.logoUrl ? (
                    <img src={d.logoUrl} alt="Logo" className="cover-logo-img" />
                  ) : (
                    defaultCrest
                  )}
                </div>
              )}
              {d.showInstitutionHeader && (
                <div className="cover-minimal-inst-text">
                  <div className="cover-inst-name-mini" style={{ color: accent }}>
                    {d.universityName || "UNIVERSITY NAME"}
                  </div>
                  <div className="cover-inst-dept-mini">{d.department}</div>
                </div>
              )}
            </div>

            <div className="cover-minimal-doc-tag" style={{ backgroundColor: `${accent}15`, color: accent }}>
              {d.documentType || "Assignment"}
            </div>
          </div>

          <div className="cover-minimal-center">
            <h1 className="cover-minimal-title">{d.assignmentTitle || "Assignment Title"}</h1>
            {d.subtitle && <p className="cover-minimal-sub">{d.subtitle}</p>}
            
            <div className="cover-minimal-course-pill" style={{ borderLeft: `3px solid ${accent}` }}>
              <div className="cover-course-primary">
                <strong>{d.courseCode}</strong> {d.courseTitle && `· ${d.courseTitle}`}
              </div>
              <div className="cover-course-secondary">
                {[d.semester, d.section && `Section ${d.section}`, d.academicYear].filter(Boolean).join(" | ")}
              </div>
            </div>
          </div>

          <div className="cover-minimal-grid">
            {renderSubmittedTo()}
            {renderSubmittedBy()}
          </div>

          <div className="cover-minimal-bottom">
            <div className="cover-date-minimal">
              <span className="cover-date-label">SUBMITTED ON: </span>
              <strong>{formattedDate || "Date"}</strong>
            </div>
            {d.footerText && <div className="cover-custom-footer">{d.footerText}</div>}
          </div>
        </div>
      )}

      {/* 3. CORPORATE REPORT TEMPLATE */}
      {template === "corporate-report" && (
        <div className="cover-layout-corporate">
          <div className="cover-corporate-banner" style={{ backgroundColor: accent }}>
            <div className="cover-corporate-header-inner">
              {d.showLogo && (
                <div className="cover-corporate-logo-wrap">
                  {d.logoUrl ? (
                    <img src={d.logoUrl} alt="Logo" className="cover-logo-img corporate-logo-badge" />
                  ) : (
                    <svg viewBox="0 0 100 100" className="cover-crest-svg" fill="none" stroke="#ffffff" strokeWidth="2.5">
                      <circle cx="50" cy="50" r="44" stroke="#ffffff" strokeWidth="3" />
                      <path d="M50 20 L66 34 L66 54 C66 66 50 76 50 76 C50 76 34 66 34 54 L34 34 Z" fill="rgba(255,255,255,0.2)" stroke="#ffffff" strokeWidth="2" />
                    </svg>
                  )}
                </div>
              )}
              {d.showInstitutionHeader && (
                <div className="cover-corporate-banner-text">
                  <h2>{d.universityName || "ORGANIZATION / UNIVERSITY"}</h2>
                  <p>{d.department || d.faculty || "Academic Division"}</p>
                </div>
              )}
            </div>
          </div>

          <div className="cover-corporate-body" style={{ padding: `${32 * densityMultiplier}px 40px` }}>
            <div className="cover-corporate-kicker" style={{ color: accent }}>
              {d.documentType?.toUpperCase() || "FORMAL REPORT"}
            </div>
            <h1 className="cover-corporate-title">{d.assignmentTitle || "Project / Corporate Report"}</h1>
            {d.subtitle && <p className="cover-corporate-sub">{d.subtitle}</p>}

            <div className="cover-corporate-table-card" style={{ borderColor: `${accent}30` }}>
              <div className="cover-card-row">
                <span className="cover-c-label">Course:</span>
                <span className="cover-c-val">{[d.courseCode, d.courseTitle].filter(Boolean).join(" — ")}</span>
              </div>
              <div className="cover-card-row">
                <span className="cover-c-label">Term:</span>
                <span className="cover-c-val">{[d.semester, d.academicYear].filter(Boolean).join(" · ")}</span>
              </div>
              {d.section && (
                <div className="cover-card-row">
                  <span className="cover-c-label">Section:</span>
                  <span className="cover-c-val">{d.section}</span>
                </div>
              )}
              <div className="cover-card-row">
                <span className="cover-c-label">Date:</span>
                <span className="cover-c-val">{formattedDate}</span>
              </div>
            </div>

            <div className="cover-corporate-split">
              {renderSubmittedTo()}
              {renderSubmittedBy()}
            </div>
          </div>

          <div className="cover-corporate-footer-stripe" style={{ backgroundColor: accent }}>
            {d.institutionAddress || d.footerText || d.universityName}
          </div>
        </div>
      )}

      {/* 4. ELEGANT BORDER TEMPLATE */}
      {template === "elegant-border" && (
        <div className="cover-layout-border">
          <div className="cover-inner-border" style={{ borderColor: accent }}>
            <div className="cover-second-border" style={{ borderColor: `${accent}40` }}>
              <div className="cover-border-content" style={{ gap: `${20 * densityMultiplier}px` }}>
                {d.showInstitutionHeader && (
                  <div className="cover-border-header">
                    <h1 className="cover-border-inst" style={{ color: accent }}>
                      {d.universityName || "UNIVERSITY NAME"}
                    </h1>
                    {d.department && <p className="cover-border-dept">{d.department}</p>}
                    {d.faculty && <p className="cover-border-faculty">{d.faculty}</p>}
                    
                    {d.showLogo && (
                      <div className="cover-border-logo">
                        {d.logoUrl ? (
                          <img src={d.logoUrl} alt="Logo" className="cover-logo-img" />
                        ) : (
                          defaultCrest
                        )}
                      </div>
                    )}
                  </div>
                )}

                <div className="cover-border-ornament" style={{ color: accent }}>
                  ✦ · · · · · · · · · · · ✦
                </div>

                <div className="cover-border-mid">
                  <div className="cover-border-type" style={{ color: accent }}>
                    An Official {d.documentType || "Assignment"}
                  </div>
                  <h2 className="cover-border-title">{d.assignmentTitle || "Assignment Title"}</h2>
                  {d.subtitle && <p className="cover-border-sub">{d.subtitle}</p>}
                  
                  <div className="cover-border-course">
                    <strong>{d.courseCode}</strong>: {d.courseTitle}
                    <div style={{ marginTop: "4px" }}>
                      {[d.semester, d.academicYear].filter(Boolean).join(" · ")}
                    </div>
                  </div>
                </div>

                <div className="cover-border-parties">
                  {renderSubmittedTo()}
                  {renderSubmittedBy()}
                </div>

                <div className="cover-border-date">
                  <span className="cover-date-capsule" style={{ borderColor: accent, color: accent }}>
                    Submission Date: {formattedDate}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. TECHNICAL LAB REPORT TEMPLATE */}
      {template === "technical-lab" && (
        <div className="cover-layout-technical" style={{ gap: `${20 * densityMultiplier}px` }}>
          <div className="cover-tech-top-line" style={{ backgroundColor: accent }} />
          
          <div className="cover-tech-header">
            {d.showLogo && (
              <div className="cover-tech-logo">
                {d.logoUrl ? (
                  <img src={d.logoUrl} alt="Logo" className="cover-logo-img" />
                ) : (
                  defaultCrest
                )}
              </div>
            )}
            {d.showInstitutionHeader && (
              <div className="cover-tech-inst">
                <div className="cover-tech-inst-name" style={{ color: accent }}>
                  {d.universityName || "UNIVERSITY OF TECHNOLOGY"}
                </div>
                <div className="cover-tech-dept">{d.department || "Faculty of Science & Engineering"}</div>
                {d.institutionAddress && <div className="cover-tech-addr">{d.institutionAddress}</div>}
              </div>
            )}
          </div>

          <div className="cover-tech-box" style={{ borderColor: accent }}>
            <div className="cover-tech-badge" style={{ backgroundColor: accent }}>
              {d.documentType?.toUpperCase() || "LAB REPORT"}
            </div>
            
            <div className="cover-tech-code" style={{ color: accent }}>
              {d.courseCode || "CSE 4203"}
            </div>
            <div className="cover-tech-course-title">
              {d.courseTitle || "Software Testing and Engineering Lab"}
            </div>
            <div className="cover-tech-main-title">
              {d.assignmentTitle || "Experiment Title / Lab Report"}
            </div>
            {d.subtitle && <div className="cover-tech-sub">{d.subtitle}</div>}

            <div className="cover-tech-meta-row">
              {d.semester && <span><strong>Semester:</strong> {d.semester}</span>}
              {d.section && <span><strong>Section:</strong> {d.section}</span>}
              {d.academicYear && <span><strong>Year:</strong> {d.academicYear}</span>}
            </div>
          </div>

          <div className="cover-tech-split">
            <div className="cover-tech-col" style={{ borderTop: `2px solid ${accent}` }}>
              {renderSubmittedTo()}
            </div>
            <div className="cover-tech-col" style={{ borderTop: `2px solid ${accent}` }}>
              {renderSubmittedBy()}
            </div>
          </div>

          <div className="cover-tech-footer">
            <div className="cover-tech-date">
              <strong>DATE OF SUBMISSION:</strong> {formattedDate}
            </div>
            {d.footerText && <div className="cover-custom-footer">{d.footerText}</div>}
          </div>
        </div>
      )}

      {/* 6. RESEARCH & THESIS TEMPLATE */}
      {template === "research-thesis" && (
        <div className="cover-layout-thesis" style={{ gap: `${26 * densityMultiplier}px` }}>
          {d.showInstitutionHeader && (
            <div className="cover-thesis-header">
              <h1 className="cover-thesis-inst" style={{ color: accent }}>
                {d.universityName || "UNIVERSITY NAME"}
              </h1>
              {d.faculty && <h2 className="cover-thesis-fac">{d.faculty}</h2>}
              {d.department && <h3 className="cover-thesis-dept">{d.department}</h3>}
              
              {d.showLogo && (
                <div className="cover-thesis-logo">
                  {d.logoUrl ? (
                    <img src={d.logoUrl} alt="Logo" className="cover-logo-img" />
                  ) : (
                    defaultCrest
                  )}
                </div>
              )}
            </div>
          )}

          <div className="cover-thesis-body">
            <h1 className="cover-thesis-title">{d.assignmentTitle || "Thesis / Research Paper Title"}</h1>
            {d.subtitle && <p className="cover-thesis-sub">{d.subtitle}</p>}

            <div className="cover-thesis-statement">
              A {d.documentType?.toLowerCase() || "dissertation"} submitted in partial fulfillment of the requirements for the degree of <strong>{d.program || "Bachelor of Science in Computer Science & Engineering"}</strong>
            </div>

            <div className="cover-thesis-course">
              {[d.courseCode, d.courseTitle].filter(Boolean).join(" — ")}
            </div>
          </div>

          <div className="cover-thesis-parties">
            {renderSubmittedBy()}
            {renderSubmittedTo()}
          </div>

          <div className="cover-thesis-footer">
            <div className="cover-thesis-date">
              {d.institutionAddress && <div>{d.institutionAddress}</div>}
              <div>{formattedDate}</div>
            </div>
            {d.footerText && <div className="cover-custom-footer">{d.footerText}</div>}
          </div>
        </div>
      )}
    </div>
  );
};

export default CoverPreview;
