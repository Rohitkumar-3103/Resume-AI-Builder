# Resume AI Builder — AI Career Suite & ATS Engine

A next-generation, full-stack AI Resume & Career Suite powered by **MERN (MongoDB, Express, React 19, Node.js)** and **Google Gemini AI**. 

Resume AI Builder empowers job seekers to build recruiter-grade resumes, score and optimize applications against target job descriptions using semantic similarity and keyword analysis, audit resumes for AI detector markers, parse existing PDF/DOCX resumes in seconds, and prepare for high-stakes interviews with a simulated AI Interview Coach.

---

## ✨ Flagship Features

### 1. 🎯 Resume Screening Scorer & ATS Keyword Matcher (ATS Beater)
- **Deep ATS Screening**: Scores resumes against any target Job Description using semantic similarity and keyword frequency analysis.
- **Keyword Gap Analysis**: Categorizes missing terms into *Critical Hard Skills*, *Tools & Frameworks*, *Soft Skills*, and *Domain Credentials* with exact placement advice.
- **Section Scores**: Real-time breakdown of Technical Skills Match, Work Experience Relevance, Education Fit, and ATS Readability.
- **"Before vs After" ATS Beater Comparison**: 
  - Visual score boost projection (e.g. 62% ➔ 94%).
  - Tailored AI-optimized professional summary incorporating missing target keywords.
  - Side-by-side bullet point improvements rewritten with Google's XYZ formula and high-impact action verbs.
  - Prioritized step-by-step action roadmap.

### 2. 📤 PDF & DOCX Resume Upload & AI Parser
- Drag-and-drop or select any existing resume in `.pdf`, `.docx`, `.doc`, or `.txt` format (or paste raw text).
- In-memory parsing using `pdf-parse` and `mammoth`.
- Gemini AI accurately categorizes unstructured text into structured resume sections: Personal Info, Professional Summary, Skills, Work Experience, Education, and Key Projects.
- **One-Click Import**: Directly populates the Live Resume Builder editor or transfers into the ATS Matcher.

### 3. 🛡️ AI Content Detector & Authenticity Auditor
- Scans full resumes, summaries, or individual work bullets for AI markers (perplexity, burstiness, robotic buzzwords).
- Flags overused clichés ("spearheaded", "beacon", "orchestrated", "pivotal role").
- Includes an **AI Humanizer** that rewrites content with natural human cadence, active voice, and authentic impact metrics.

### 4. 🎙️ AI Technical & Behavioral Interview Coach
- Generates 5 tailored, realistic interview questions (Technical Architecture, Behavioral STAR method, Situational) based on the candidate's actual projects and the target job description.
- Explains the hidden recruiter intent ("Why the interviewer asks this").
- Outlines must-hit talking points and red-flag pitfalls to avoid.
- Provides expandable, high-scoring model answers customized to the candidate's background.

### 5. 💡 Career Playbook & Power Action Verbs
- Directory of 100+ recruiter-approved power action verbs categorized by field (*Engineering*, *Data & AI*, *Leadership*, *Product*, *Design*).
- Click-to-copy functionality for instant integration into resumes.
- Interactive guide to Google's XYZ formula (*"Accomplished [X] as measured by [Y] by doing [Z]"*).
- 5 ATS compliance golden rules.

### 6. ✍️ Live Resume Builder & Customizer
- Split-screen live preview with instant CSS typography and layout rendering.
- 4 designer templates: **Modern**, **Minimalist**, **Creative**, and **Executive**.
- Custom theme color picker and accent bubble presets.
- Profile picture upload (Multer).
- Instant high-fidelity **PDF Export** (`html2pdf.js`) and **Word Export** (`.docx`).

---

## 🛠️ Architecture & Tech Stack

```text
Resume AI Builder
├── backend/
│   ├── routes/
│   │   ├── aiRoutes.js       # Gemini 2.5 Flash endpoints (ATS Matcher, Parser, Coach, Detector)
│   │   ├── authRoutes.js     # JWT Registration & Login with bcryptjs
│   │   └── resumeRoutes.js   # Owner-secured CRUD and profile picture uploads
│   ├── models/
│   │   ├── Resume.js         # Comprehensive Resume schema
│   │   └── User.js           # User credentials schema
│   └── server.js             # Express app entry point (Port 5001)
│
└── frontend/
    └── src/
        ├── pages/
        │   ├── Dashboard.jsx       # Career Suite Command Center
        │   ├── ATSBeater.jsx       # ATS Keyword Matcher & Before/After comparison
        │   ├── ResumeParser.jsx    # PDF/DOCX Upload & Parsing
        │   ├── InterviewCoach.jsx  # AI Mock Interview Coach
        │   ├── CareerPlaybook.jsx  # Tips & Action Verbs Playbook
        │   ├── Editor.jsx          # Live split-screen Resume Builder
        │   ├── Login.jsx           # Login panel
        │   └── Register.jsx        # Registration panel
        ├── components/
        │   ├── Navbar.jsx          # Modern header with Career Suite links
        │   ├── AIDetectorModal.jsx # Authenticity scanner & humanizer modal
        │   ├── ResumeForm.jsx      # Multi-section editor
        │   └── ResumePreview.jsx   # Real-time preview rendering
        └── services/
            └── api.js              # Axios client wrappers with JWT interceptors
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** (v18+)
- **MongoDB** running locally (`mongodb://localhost:27017/resume-builder`) or MongoDB Atlas
- **Google Gemini API Key** (configured in `backend/.env`)

### 2. Backend Setup
```bash
cd backend
npm install
npm run dev   # Runs on http://localhost:5001
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev   # Runs on http://localhost:5173
```

---

## 🔐 Authentication Choice
Resume AI Builder includes a self-contained, enterprise-grade **JWT + MongoDB** authentication engine (`bcryptjs` password hashing + stateless signed tokens). This ensures complete data privacy, eliminates external cloud vendor lock-in, and guarantees that your resumes remain tied to your user account.
