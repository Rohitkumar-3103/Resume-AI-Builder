import React from "react";
import HowItWorksSection from "./HowItWorksSection";
import ResumeAnalysisSection from "./ResumeAnalysisSection";
import "./ResumeScoringShowcase.css";

const ResumeScoringShowcase = ({
  url = "resumecraft.ai/dashboard",
  showHowItWorks = true,
  showAnalysis = true,
  analysis = null,
  fileName = null,
  isLive = false
}) => {
  return (
    <div className="resume-scoring-showcase-wrapper">
      {showHowItWorks && <HowItWorksSection />}
      {showAnalysis && (
        <ResumeAnalysisSection
          url={url}
          analysis={analysis}
          fileName={fileName}
          isLive={isLive}
        />
      )}
    </div>
  );
};

export default ResumeScoringShowcase;
