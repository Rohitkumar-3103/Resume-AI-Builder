import React from "react";
import { ASSET_URL } from "../services/api";

const hexToRgb = (hex) => {
  if (!hex) return null;
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  const fullHex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : null;
};

const ResumePreview = ({ resumeData, mode = "resume" }) => {
  const { personalInfo, summary, education, experience, projects, skills, template, colorTheme, image } = resumeData;

  const rgb = hexToRgb(colorTheme || "#aa3bff");
  const previewStyle = {
    "--theme-color": colorTheme || "#aa3bff",
    ...(rgb ? { "--theme-color-rgb": rgb } : {})
  };

  const renderContactInfo = (layoutClass = "contact-row") => (
    <div className={layoutClass}>
      {personalInfo.email && (
        <span className="contact-item">
          <span className="contact-icon">✉</span> {personalInfo.email}
        </span>
      )}
      {personalInfo.phone && (
        <span className="contact-item">
          <span className="contact-icon">☎</span> {personalInfo.phone}
        </span>
      )}
      {personalInfo.address && (
        <span className="contact-item">
          <span className="contact-icon">📍</span> {personalInfo.address}
        </span>
      )}
      {personalInfo.linkedin && (
        <span className="contact-item">
          <span className="contact-icon" title="LinkedIn">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{ verticalAlign: "-1px" }}>
              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
            </svg>
          </span>{" "}
          <a
            href={personalInfo.linkedin.startsWith("http") ? personalInfo.linkedin : `https://${personalInfo.linkedin}`}
            target="_blank"
            rel="noopener noreferrer"
            className="contact-link"
          >
            {personalInfo.linkedin.replace(/^https?:\/\/(www\.)?/, "")}
          </a>
        </span>
      )}
      {personalInfo.github && (
        <span className="contact-item">
          <span className="contact-icon" title="GitHub">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{ verticalAlign: "-1px" }}>
              <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/>
            </svg>
          </span>{" "}
          <a
            href={personalInfo.github.startsWith("http") ? personalInfo.github : `https://${personalInfo.github}`}
            target="_blank"
            rel="noopener noreferrer"
            className="contact-link"
          >
            {personalInfo.github.replace(/^https?:\/\/(www\.)?/, "")}
          </a>
        </span>
      )}
    </div>
  );

  const renderProfileImage = () => {
    if (!image) return null;
    return (
      <div className="preview-profile-img-container">
        <img src={`${ASSET_URL}${image}`} alt="Profile" className="preview-profile-img" />
      </div>
    );
  };

  const renderCoverLetterContent = () => {
    const cl = resumeData.coverLetter || {};
    return (
      <div className="cover-letter-sheet">
        <div className="cl-header" style={{ borderBottom: "2px solid var(--theme-color)", paddingBottom: "1rem", marginBottom: "1.5rem" }}>
          <h1 className="preview-name" style={{ color: "var(--theme-color)", margin: 0, fontSize: "1.8rem" }}>
            {personalInfo.fullName || "Your Name"}
          </h1>
          <h2 className="preview-headline" style={{ fontSize: "1.1rem", color: "#4b5563", marginTop: "0.25rem" }}>
            {personalInfo.jobTitle || "Professional Title"}
          </h2>
          {renderContactInfo("contact-row")}
        </div>

        <div className="cl-recipient-block" style={{ marginBottom: "1.5rem", fontSize: "0.95rem" }}>
          {cl.letterDate && <p style={{ marginBottom: "1rem", color: "#6b7280" }}>{cl.letterDate}</p>}
          {cl.recipientName && <p style={{ fontWeight: "bold", margin: 0 }}>{cl.recipientName}</p>}
          {cl.recipientTitle && <p style={{ margin: 0, color: "#4b5563" }}>{cl.recipientTitle}</p>}
          {cl.companyName && <p style={{ margin: 0, fontWeight: "500" }}>{cl.companyName}</p>}
        </div>

        <div className="cl-salutation" style={{ fontWeight: "600", marginBottom: "1rem", fontSize: "1rem" }}>
          {cl.salutation || "Dear Hiring Manager,"}
        </div>

        <div className="cl-body" style={{ lineHeight: "1.6", fontSize: "0.95rem", whiteSpace: "pre-line", marginBottom: "2rem" }}>
          {cl.body || "Please enter or generate your cover letter paragraphs..."}
        </div>

        <div className="cl-closing" style={{ fontSize: "0.95rem", whiteSpace: "pre-line" }}>
          {cl.closing || `Sincerely,\n${personalInfo.fullName || ""}`}
        </div>
      </div>
    );
  };

  // Helper renderer sections
  const renderSummarySection = () => {
    if (!summary) return null;
    return (
      <div className="preview-section">
        <h3 className="section-title">Professional Summary</h3>
        <p className="summary-text">{summary}</p>
      </div>
    );
  };

  const renderExperienceSection = () => {
    if (experience.length === 0) return null;
    return (
      <div className="preview-section">
        <h3 className="section-title">Work Experience</h3>
        <div className="experience-list">
          {experience.map((exp, idx) => (
            <div key={idx} className="experience-item">
              <div className="exp-header">
                <div>
                  <h4 className="exp-role">{exp.role || "Role"}</h4>
                  <span className="exp-company">{exp.company || "Company"}</span>
                </div>
                <span className="exp-dates">
                  {exp.startDate} – {exp.endDate}
                </span>
              </div>
              {exp.description && <p className="exp-description">{exp.description}</p>}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderEducationSection = () => {
    if (education.length === 0) return null;
    return (
      <div className="preview-section">
        <h3 className="section-title">Education</h3>
        <div className="education-list">
          {education.map((edu, idx) => (
            <div key={idx} className="education-item">
              <div className="edu-header">
                <div>
                  <h4 className="edu-degree">{edu.degree || "Degree"}</h4>
                  <span className="edu-school">{edu.school || "School"}</span>
                </div>
                <span className="edu-dates">
                  {edu.startDate} – {edu.endDate}
                </span>
              </div>
              {edu.description && <p className="edu-description">{edu.description}</p>}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderProjectsSection = () => {
    if (projects.length === 0) return null;
    return (
      <div className="preview-section">
        <h3 className="section-title">Projects</h3>
        <div className="projects-list">
          {projects.map((proj, idx) => (
            <div key={idx} className="project-item">
              <div className="proj-header">
                <h4 className="proj-title">
                  {proj.title || "Project Title"}
                  {proj.link && (
                    <a href={proj.link} target="_blank" rel="noopener noreferrer" className="proj-link">
                      🔗 Link
                    </a>
                  )}
                </h4>
                {proj.technologies && <span className="proj-tech">{proj.technologies}</span>}
              </div>
              {proj.description && <p className="proj-description">{proj.description}</p>}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderSkillsSection = (isTags = false) => {
    if (skills.length === 0) return null;
    return (
      <div className="preview-section">
        <h3 className="section-title">Skills</h3>
        <div className={isTags ? "skills-tags-list" : "skills-bullets-list"}>
          {skills.map((skill, idx) => (
            <span key={idx} className={isTags ? "skill-tag-item" : "skill-bullet-item"}>
              {skill}
            </span>
          ))}
        </div>
      </div>
    );
  };

  // RENDER BASED ON TEMPLATE
  const renderTemplateContent = () => {
    if (mode === "coverLetter") {
      return renderCoverLetterContent();
    }

    switch (template) {
      case "Minimalist":
        return (
          <div className="template-minimalist-content">
            <div className="header-minimalist">
              <h1 className="preview-name">{personalInfo.fullName || "Your Name"}</h1>
              <h2 className="preview-headline">{personalInfo.jobTitle || "Professional Title"}</h2>
              {renderContactInfo("contact-row centered")}
            </div>
            <div className="minimalist-body">
              {renderSummarySection()}
              {renderExperienceSection()}
              {renderEducationSection()}
              {renderProjectsSection()}
              {renderSkillsSection(true)}
            </div>
          </div>
        );

      case "Creative":
        return (
          <div className="template-creative-content">
            <div className="creative-header" style={{ borderLeft: "8px solid var(--theme-color)" }}>
              <div className="header-details">
                <h1 className="preview-name">{personalInfo.fullName || "Your Name"}</h1>
                <h2 className="preview-headline" style={{ color: "var(--theme-color)" }}>
                  {personalInfo.jobTitle || "Professional Title"}
                </h2>
                {renderContactInfo("contact-grid")}
              </div>
              {renderProfileImage()}
            </div>
            <div className="creative-body-grid">
              <div className="creative-main-col">
                {renderSummarySection()}
                {renderExperienceSection()}
                {renderProjectsSection()}
              </div>
              <div className="creative-side-col">
                {renderSkillsSection(true)}
                {renderEducationSection()}
              </div>
            </div>
          </div>
        );

      case "Executive":
        return (
          <div className="template-executive-content">
            <div className="executive-sidebar" style={{ backgroundColor: "var(--theme-color)" }}>
              {renderProfileImage()}
              <div className="sidebar-details">
                <h1 className="sidebar-name">{personalInfo.fullName || "Your Name"}</h1>
                <h2 className="sidebar-headline">{personalInfo.jobTitle || "Professional Title"}</h2>
                
                <div className="executive-contact">
                  {personalInfo.email && <div className="sidebar-contact-item">✉ {personalInfo.email}</div>}
                  {personalInfo.phone && <div className="sidebar-contact-item">☎ {personalInfo.phone}</div>}
                  {personalInfo.address && <div className="sidebar-contact-item">📍 {personalInfo.address}</div>}
                  {personalInfo.linkedin && (
                    <div className="sidebar-contact-item">
                      <a
                        href={personalInfo.linkedin.startsWith("http") ? personalInfo.linkedin : `https://${personalInfo.linkedin}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "inherit", textDecoration: "none" }}
                      >
                        🔗 {personalInfo.linkedin.replace(/^https?:\/\/(www\.)?/, "")}
                      </a>
                    </div>
                  )}
                  {personalInfo.github && (
                    <div className="sidebar-contact-item">
                      <a
                        href={personalInfo.github.startsWith("http") ? personalInfo.github : `https://${personalInfo.github}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "inherit", textDecoration: "none" }}
                      >
                        💻 {personalInfo.github.replace(/^https?:\/\/(www\.)?/, "")}
                      </a>
                    </div>
                  )}
                </div>

                {skills.length > 0 && (
                  <div className="sidebar-section">
                    <h3>Skills</h3>
                    <div className="sidebar-skills-list">
                      {skills.map((skill, idx) => (
                        <div key={idx} className="sidebar-skill-tag">{skill}</div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="executive-main">
              {renderSummarySection()}
              {renderExperienceSection()}
              {renderProjectsSection()}
              {renderEducationSection()}
            </div>
          </div>
        );

      case "Classic":
        return (
          <div className="template-classic-content">
            <div className="header-classic">
              <h1 className="preview-name">{personalInfo.fullName || "Your Name"}</h1>
              <h2 className="preview-headline">{personalInfo.jobTitle || "Professional Title"}</h2>
              {renderContactInfo("contact-row centered classic-contact")}
            </div>
            <div className="classic-body">
              {renderSummarySection()}
              {renderExperienceSection()}
              {renderEducationSection()}
              {renderProjectsSection()}
              {renderSkillsSection(false)}
            </div>
          </div>
        );

      case "Technical":
        return (
          <div className="template-technical-content">
            <div className="header-technical" style={{ borderBottom: "3px solid var(--theme-color)" }}>
              <div className="technical-header-top">
                {renderProfileImage()}
                <div>
                  <h1 className="preview-name">{personalInfo.fullName || "Your Name"}</h1>
                  <h2 className="preview-headline" style={{ color: "var(--theme-color)" }}>{personalInfo.jobTitle || "Professional Title"}</h2>
                </div>
              </div>
              {renderContactInfo("contact-row technical-contact")}
            </div>
            <div className="technical-body">
              {renderSkillsSection(true)}
              {renderSummarySection()}
              {renderExperienceSection()}
              {renderProjectsSection()}
              {renderEducationSection()}
            </div>
          </div>
        );

      case "Elegant":
        return (
          <div className="template-elegant-content">
            <div className="elegant-top-bar" style={{ backgroundColor: "var(--theme-color)" }} />
            <div className="header-elegant">
              <div className="header-elegant-inner">
                {renderProfileImage()}
                <h1 className="preview-name">{personalInfo.fullName || "Your Name"}</h1>
                <h2 className="preview-headline">{personalInfo.jobTitle || "Professional Title"}</h2>
                {renderContactInfo("contact-row centered elegant-contact")}
              </div>
            </div>
            <div className="elegant-body">
              {renderSummarySection()}
              {renderExperienceSection()}
              {renderProjectsSection()}
              {renderEducationSection()}
              {renderSkillsSection(true)}
            </div>
            <div className="elegant-bottom-bar" style={{ backgroundColor: "var(--theme-color)" }} />
          </div>
        );

      case "Compact":
        return (
          <div className="template-compact-content">
            <div className="header-compact">
              <div className="compact-header-left">
                <h1 className="preview-name">{personalInfo.fullName || "Your Name"}</h1>
                <h2 className="preview-headline" style={{ color: "var(--theme-color)" }}>{personalInfo.jobTitle || "Professional Title"}</h2>
              </div>
              <div className="compact-header-right">
                {renderContactInfo("contact-column compact-contact")}
              </div>
            </div>
            <div className="compact-body">
              {renderSummarySection()}
              <div className="compact-grid">
                <div className="compact-main-col">
                  {renderExperienceSection()}
                  {renderProjectsSection()}
                </div>
                <div className="compact-side-col">
                  {renderEducationSection()}
                  {renderSkillsSection(true)}
                </div>
              </div>
            </div>
          </div>
        );

      case "Timeline":
        return (
          <div className="template-timeline-content">
            <div className="header-timeline" style={{ borderLeft: "6px solid var(--theme-color)" }}>
              <div className="timeline-header-details">
                <h1 className="preview-name">{personalInfo.fullName || "Your Name"}</h1>
                <h2 className="preview-headline">{personalInfo.jobTitle || "Professional Title"}</h2>
                {renderContactInfo("contact-row timeline-contact")}
              </div>
              {renderProfileImage()}
            </div>
            <div className="timeline-body">
              {renderSummarySection()}
              <div className="timeline-spine">
                {renderExperienceSection()}
                {renderEducationSection()}
                {renderProjectsSection()}
              </div>
              {renderSkillsSection(true)}
            </div>
          </div>
        );

      case "Modern":
      default:
        return (
          <div className="template-modern-content">
            <div className="modern-header" style={{ backgroundColor: "rgba(var(--theme-color-rgb, 170, 59, 255), 0.05)" }}>
              <div className="modern-header-top">
                {renderProfileImage()}
                <div className="modern-header-details">
                  <h1 className="preview-name" style={{ color: "var(--theme-color)" }}>
                    {personalInfo.fullName || "Your Name"}
                  </h1>
                  <h2 className="preview-headline">{personalInfo.jobTitle || "Professional Title"}</h2>
                </div>
              </div>
              {renderContactInfo("contact-row modern-contact")}
            </div>
            <div className="modern-body">
              {renderSummarySection()}
              <div className="modern-grid-2col">
                <div className="modern-left-col">
                  {renderExperienceSection()}
                  {renderProjectsSection()}
                </div>
                <div className="modern-right-col">
                  {renderSkillsSection(true)}
                  {renderEducationSection()}
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div id="resume-preview-container" style={previewStyle} className={`resume-preview-sheet template-${template.toLowerCase()}`}>
      {renderTemplateContent()}
    </div>
  );
};

export default ResumePreview;