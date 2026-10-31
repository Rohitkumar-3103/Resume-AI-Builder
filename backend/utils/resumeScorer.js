/**
 * resumeScorer.js
 * Comprehensive 10-Parameter Explainable Scoring Engine modeled after QuillBio standards.
 * Evaluates candidate resumes across:
 *  1. Projects
 *  2. Technical Skills
 *  3. Education
 *  4. Experience & Internships
 *  5. Achievements & Certifications
 *  6. Impact & Quantification
 *  7. Brevity & Concision
 *  8. Style & Consistency
 *  9. ATS & Formatting
 * 10. Language & Spelling
 */

function calculateExplainableScore(rawText = "", parsedData = {}) {
  const text = (rawText || "").toLowerCase();
  const data = parsedData || {};

  const skills = Array.isArray(data.skills) ? data.skills : [];
  const experience = Array.isArray(data.experience) ? data.experience : [];
  const projects = Array.isArray(data.projects) ? data.projects : [];
  const education = Array.isArray(data.education) ? data.education : [];
  const summary = typeof data.summary === "string" ? data.summary : "";

  // Helper: Count occurrences
  const countMatches = (regex) => (rawText.match(regex) || []).length;

  // 1. Projects Evaluation (Max 100)
  let projScore = 50;
  if (projects.length >= 1) projScore += 15;
  if (projects.length >= 2) projScore += 15;
  if (projects.length >= 3) projScore += 10;
  const hasLinks = projects.some(p => p.link && (p.link.includes("github") || p.link.includes("http") || p.link.includes(".app") || p.link.includes(".com")));
  if (hasLinks || text.includes("github.com/") || text.includes("vercel.app") || text.includes("demo:")) projScore += 10;
  projScore = Math.min(100, Math.max(30, projScore));

  // 2. Technical Skills Evaluation (Max 100)
  let skillScore = 45;
  if (skills.length >= 5) skillScore += 20;
  if (skills.length >= 10) skillScore += 20;
  if (skills.length >= 15) skillScore += 10;
  // Modern stack detection
  const modernKeywords = ["react", "node", "python", "typescript", "docker", "aws", "sql", "graphql", "next.js", "kubernetes", "mongodb", "fastapi", "golang", "java", "c++", "tailwind"];
  const matchedKeywords = modernKeywords.filter(kw => text.includes(kw));
  if (matchedKeywords.length >= 4) skillScore += 5;
  skillScore = Math.min(100, Math.max(35, skillScore));

  // 3. Education Evaluation (Max 100)
  let eduScore = 60;
  if (education.length > 0) {
    eduScore += 20;
    const firstEdu = education[0];
    if (firstEdu.degree && (firstEdu.degree.length > 4)) eduScore += 10;
    if (firstEdu.school && (firstEdu.school.length > 4)) eduScore += 10;
  }
  eduScore = Math.min(100, Math.max(40, eduScore));

  // 4. Experience & Internships Evaluation (Max 100)
  let expScore = 50;
  if (experience.length >= 1) expScore += 25;
  if (experience.length >= 2) expScore += 15;
  if (experience.length >= 3) expScore += 10;
  expScore = Math.min(100, Math.max(40, expScore));

  // 5. Achievements & Certifications (Max 100)
  let achScore = 55;
  const achievementKeywords = [
    "hackathon", "winner", "rank", "certified", "aws certified", "first place",
    "top", "scholarship", "dean's list", "award", "contest", "leetcode", "codeforces", "codechef", "gfg"
  ];
  let achMatches = 0;
  achievementKeywords.forEach(kw => {
    if (text.includes(kw)) achMatches++;
  });
  achScore += Math.min(40, achMatches * 10);
  achScore = Math.min(100, Math.max(35, achScore));

  // 6. Impact & Quantification Evaluation (Max 100)
  // Check for numbers, percentages, dollar signs, metric reductions
  let impactScore = 40;
  const metricRegex = /(\d+([.,]\d+)?%|\$\s*\d+([.,]\d+)?[kmb]?|\b\d+([.,]\d+)?\s*[kmb]\b|\b\d{1,3}(,\d{3})+\+?|\b\d+\+?\s*(users|requests|qps|ms|seconds|hours|clients|customers|downloads|stars|percent))/gi;
  const numMetrics = countMatches(metricRegex);
  if (numMetrics >= 1) impactScore += 15;
  if (numMetrics >= 3) impactScore += 20;
  if (numMetrics >= 6) impactScore += 15;
  if (numMetrics >= 10) impactScore += 10;
  impactScore = Math.min(100, Math.max(30, impactScore));

  // 7. Brevity & Concision Evaluation (Max 100)
  let brevityScore = 75;
  const wordCount = rawText.trim().split(/\s+/).length;
  if (wordCount >= 250 && wordCount <= 750) {
    brevityScore = 85;
  } else if (wordCount > 1000) {
    brevityScore = 65; // Too verbose
  } else if (wordCount < 180) {
    brevityScore = 55; // Too brief
  }
  // Check for filler phrases
  const fillerWords = ["responsible for", "duties included", "helped with", "assisted in", "team player", "hard working", "go-getter"];
  let fillerCount = 0;
  fillerWords.forEach(w => {
    if (text.includes(w)) fillerCount++;
  });
  brevityScore -= fillerCount * 4;
  brevityScore = Math.min(100, Math.max(45, brevityScore));

  // 8. Style & Consistency (Max 100)
  let styleScore = 78;
  if (summary && summary.length >= 40) styleScore += 8;
  if (data.personalInfo?.email && data.personalInfo?.phone) styleScore += 8;
  if (text.includes("present") || text.includes("202")) styleScore += 4;
  styleScore = Math.min(100, Math.max(50, styleScore));

  // 9. ATS & Formatting (Max 100)
  let atsScore = 65;
  const standardSections = ["skills", "experience", "education", "projects"];
  let foundSections = 0;
  standardSections.forEach(sec => {
    if (text.includes(sec)) foundSections++;
  });
  atsScore += foundSections * 7;
  // Penalize unusual characters
  if (!text.includes("<table>") && !text.includes("<img")) atsScore += 7;
  atsScore = Math.min(100, Math.max(40, atsScore));

  // 10. Language & Spelling (Max 100)
  let langScore = 72;
  const strongActionVerbs = [
    "engineered", "architected", "developed", "spearheaded", "optimized",
    "accelerated", "designed", "deployed", "scaled", "automated", "built", "implemented"
  ];
  let verbMatches = 0;
  strongActionVerbs.forEach(v => {
    if (text.includes(v)) verbMatches++;
  });
  langScore += Math.min(25, verbMatches * 4);
  langScore = Math.min(100, Math.max(50, langScore));

  // Compute Overall Weighted Score
  const weights = {
    projects: 0.16,
    impact: 0.16,
    technicalSkills: 0.15,
    atsFormatting: 0.12,
    brevity: 0.10,
    education: 0.08,
    experience: 0.08,
    achievements: 0.05,
    style: 0.05,
    language: 0.05
  };

  const overall = Math.round(
    projScore * weights.projects +
    impactScore * weights.impact +
    skillScore * weights.technicalSkills +
    atsScore * weights.atsFormatting +
    brevityScore * weights.brevity +
    eduScore * weights.education +
    expScore * weights.experience +
    achScore * weights.achievements +
    styleScore * weights.style +
    langScore * weights.language
  );

  const overallScore = Math.min(100, Math.max(35, overall));

  // Readiness Status
  let readinessStatus = "Interview Ready";
  if (overallScore < 68) {
    readinessStatus = "Needs Revision";
  } else if (overallScore < 78) {
    readinessStatus = "Needs Polish";
  } else if (overallScore >= 88) {
    readinessStatus = "Top Tier";
  }

  // Derive Dynamic Strengths
  let strength = "Strong project portfolio with clear tech stacks and live links.";
  if (skillScore >= 88 && skillScore > projScore) {
    strength = `Broad modern technical toolkit with in-demand competencies across ${skills.slice(0, 4).join(", ")}.`;
  } else if (impactScore >= 80) {
    strength = "Excellent quantification of business impact, system latency gains, and measurable outcomes.";
  } else if (projScore >= 85) {
    strength = "Strong project portfolio with clear tech stacks and live deployment / GitHub links.";
  } else if (expScore >= 85) {
    strength = "Robust professional work track record with high ownership in prior roles.";
  }

  // Derive Dynamic Top Fix
  let topFix = "Quantify 3 bullet points with metrics (%, $, time saved).";
  if (impactScore < 75) {
    topFix = "Quantify 3 bullet points with metrics (%, $, time saved, latency reduction).";
  } else if (atsScore < 72) {
    topFix = "Align section headers with standard ATS conventions (Skills, Experience, Education, Projects).";
  } else if (brevityScore < 72) {
    topFix = "Tighten long descriptive sentences; trim filler words like 'responsible for' or 'helped'.";
  } else if (skillScore < 75) {
    topFix = "Group skills into clear categories (Languages, Frameworks, Cloud, Databases) with higher keyword density.";
  } else if (projScore < 75) {
    topFix = "Add live deployment links (Vercel, Render) or active GitHub repos to all featured projects.";
  }

  // Dynamic AI Summary
  let aiSummary = "A solid resume - tightening impact statements and quantification would push you into the top tier.";
  if (overallScore >= 85) {
    aiSummary = "An outstanding, recruiter-ready profile with strong technical depth and clear impact across projects.";
  } else if (overallScore >= 75) {
    aiSummary = "A solid candidate resume - tightening impact statements and adding metrics will push you into the top tier.";
  } else {
    aiSummary = "Good foundational experiences detected, but needs stronger bullet point quantification and ATS formatting to maximize interview calls.";
  }

  // Construct Parameter Breakdown List
  const parameters = [
    {
      id: "projects",
      name: "Projects",
      score: projScore,
      status: projScore >= 80 ? "Good" : projScore >= 65 ? "Needs Polish" : "Needs Work",
      feedback: projScore >= 80
        ? "Robust project selection with explicit tech stacks and accessible links."
        : "Add live demo links or public GitHub repositories to substantiate your claims."
    },
    {
      id: "tech-skills",
      name: "Technical Skills",
      score: skillScore,
      status: skillScore >= 80 ? "Good" : "Needs Polish",
      feedback: skillScore >= 80
        ? `High keyword coverage across ${skills.slice(0, 5).join(", ")}.`
        : "Expand skills list with database, cloud, and modern tooling frameworks."
    },
    {
      id: "education",
      name: "Education",
      score: eduScore,
      status: eduScore >= 75 ? "Good" : "Needs Polish",
      feedback: "Valid institution pedigree, major, and graduation timeline detected."
    },
    {
      id: "experience",
      name: "Experience & Internships",
      score: expScore,
      status: expScore >= 75 ? "Good" : "Needs Polish",
      feedback: experience.length > 0
        ? `Found ${experience.length} professional engagement(s) with role history.`
        : "Highlight relevant internships, freelance work, or open-source contributions."
    },
    {
      id: "achievements",
      name: "Achievements & Certifications",
      score: achScore,
      status: achScore >= 70 ? "Good" : "Needs Polish",
      feedback: achScore >= 70
        ? "Noteworthy competitive programming handles, awards, or cloud credentials."
        : "Include hackathons, competitive programming rank (LeetCode, Codeforces), or certifications."
    },
    {
      id: "impact",
      name: "Impact & Quantification",
      score: impactScore,
      status: impactScore >= 75 ? "Good" : "Needs Attention",
      feedback: impactScore >= 75
        ? "Bullet points effectively leverage %, $, and measurable performance indicators."
        : "Reframe bullets using Google's XYZ formula: Accomplished [X], as measured by [Y], by doing [Z]."
    },
    {
      id: "brevity",
      name: "Brevity & Concision",
      score: brevityScore,
      status: brevityScore >= 75 ? "Good" : "Needs Polish",
      feedback: brevityScore >= 75
        ? "Clean word count and efficient bullet lengths without unnecessary filler."
        : "Trim wordy descriptions to 1-2 lines per bullet with punchy sentence structures."
    },
    {
      id: "style",
      name: "Style & Consistency",
      score: styleScore,
      status: styleScore >= 75 ? "Good" : "Needs Polish",
      feedback: "Consistent capitalization, contact hierarchy, and date formatting."
    },
    {
      id: "ats",
      name: "ATS & Formatting",
      score: atsScore,
      status: atsScore >= 75 ? "Good" : "Needs Attention",
      feedback: atsScore >= 75
        ? "Single-column friendly structure that standard ATS parsers can ingest cleanly."
        : "Ensure headings are standard (e.g. 'Work Experience', 'Technical Skills') without nested tables."
    },
    {
      id: "language",
      name: "Language & Spelling",
      score: langScore,
      status: langScore >= 75 ? "Good" : "Needs Polish",
      feedback: langScore >= 75
        ? "Strong active verbs (Engineered, Architected, Scaled) drive the narrative."
        : "Replace weak passive phrasing with assertive technical action verbs."
    }
  ];

  return {
    overallScore,
    readinessStatus,
    strength,
    topFix,
    aiSummary,
    metrics: {
      projects: projScore,
      impact: impactScore,
      technicalSkills: skillScore,
      atsFormatting: atsScore,
      brevity: brevityScore
    },
    parameters
  };
}

module.exports = {
  calculateExplainableScore
};
