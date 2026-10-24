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