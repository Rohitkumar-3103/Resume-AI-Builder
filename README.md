# ResumeCraft (Resume AI Builder) — AI Career Suite, ATS Engine & Academic CoverCraft

A modern, full-stack AI Resume & Academic Career Suite powered by **MERN (MongoDB, Express, React 19, Node.js)** and **Google Gemini AI**.

ResumeCraft empowers job seekers and students to build recruiter-grade resumes, score and optimize applications against target job descriptions using semantic keyword analysis, audit resumes for AI detector markers, parse existing PDF/DOCX resumes in seconds, generate professional academic assignment cover pages, and prepare for high-stakes interviews with a simulated AI Interview Coach.

---

## ✨ Flagship Modules & Features

### 1. 🎯 ATS Keyword Matcher & Screening Scorer (ATS Beater)
- **Deep ATS Screening**: Scores resumes against any target Job Description using semantic similarity and keyword frequency analysis.
- **Keyword Gap Analysis**: Categorizes missing terms into *Critical Hard Skills*, *Tools & Frameworks*, *Soft Skills*, and *Domain Credentials* with exact placement advice.
- **Section Scores**: Real-time breakdown of Technical Skills Match, Work Experience Relevance, Education Fit, and ATS Readability.
- **"Before vs After" ATS Beater Comparison**: 
  - Visual score boost projection (e.g. 62% ➔ 94%).
  - Tailored AI-optimized professional summary incorporating missing target keywords.
  - Side-by-side bullet point improvements rewritten with Google's XYZ formula and high-impact action verbs.
  - Prioritized step-by-step action roadmap.

### 2. 📤 PDF & DOCX Resume Upload & AI Parser
- Drag-and-drop or upload any existing resume in `.pdf`, `.docx`, `.doc`, or `.txt` format (or paste raw text).
- In-memory stream parsing using `pdf-parse` and `mammoth`.
- Gemini AI categorizes unstructured text into structured resume sections: Personal Info, Professional Summary, Skills, Work Experience, Education, and Key Projects.
- **One-Click Import**: Directly populates the Live Resume Builder editor or transfers into the ATS Matcher.

### 3. 📑 Academic Cover Page Generator (CoverCraft)
- **6 Professional Academic Templates**:
  - *Classic Academic*: Centered institution header, traditional serif typography, and formal submission blocks.
  - *Modern Minimal*: Clean left-aligned layout with generous whitespace and contemporary typography.
  - *Corporate Report*: Bold accent header bar, structured information grid, and executive hierarchy.
  - *Elegant Border*: Double-line page frame for formal coursework and dissertations.
  - *Technical Lab Report*: Engineered for engineering labs, CSE projects, and experiments.
  - *Research & Thesis*: Formal hierarchy designed for thesis papers, dissertations, and research submissions.
- **Solo & Group Submissions**: Toggle between individual student and multi-member team submissions with roll numbers and section tags.
- **Institution Branding**: IIIT Allahabad emblem and custom university logo support.
- **3-Slide Showcase Gallery**: Interactive 3-column template browser at `/templates` with real-time thumbnail previews and modal inspection.
- **Instant Vector PDF Export**: Download crisp, print-ready A4 cover pages with one click.

### 4. 🛡️ AI Content Detector & Authenticity Auditor
- Scans full resumes, summaries, or individual work bullets for AI markers (perplexity, burstiness, robotic buzzwords).
- Flags overused clichés ("spearheaded", "beacon", "orchestrated", "pivotal role").
- Includes an **AI Humanizer** that rewrites content with natural human cadence, active voice, and authentic impact metrics.

### 5. 🎙️ AI Technical & Behavioral Interview Coach
- Generates 5 tailored, realistic interview questions (Technical Architecture, Behavioral STAR method, Situational) based on the candidate's actual projects and the target job description.
- Explains hidden recruiter intent ("Why the interviewer asks this").
- Outlines must-hit talking points and red-flag pitfalls to avoid.
- Provides expandable, high-scoring model answers customized to the candidate's background.

### 6. 💡 Career Playbook & Power Action Verbs
- Directory of 100+ recruiter-approved power action verbs categorized by field (*Engineering*, *Data & AI*, *Leadership*, *Product*, *Design*).
- Click-to-copy functionality for instant integration into resumes.
- Interactive guide to Google's XYZ formula (*"Accomplished [X] as measured by [Y] by doing [Z]"*).
- 5 ATS compliance golden rules.

### 7. ✍️ Live Split-Screen Resume Builder
- Split-screen live preview with instant CSS typography and layout rendering.
- 4 designer resume templates: **Modern**, **Minimalist**, **Creative**, and **Executive**.
- Custom theme color picker and accent bubble presets.
- Profile picture upload with local asset storage.
- Instant high-fidelity **PDF Export** (`html2pdf.js`) and **Word Export** (`.docx`).

### 8. 🌓 Theme Studio & Command Center
- Full **Dark Mode & Light Mode** support across every component with persistent local storage.
- Interactive Career Readiness circular gauge with live health dots and status indicators.
- Quick search and filtering across saved resumes by template category.
- Color-coded action buttons for every document: **Match JD** (Emerald Green), **AI Audit** (Violet), and **Delete** (Coral Red).

---

## 🛠️ Architecture & Tech Stack

```text
ResumeCraft (Resume AI Builder)
├── backend/
│   ├── routes/
│   │   ├── aiRoutes.js       # Gemini Flash endpoints (ATS Matcher, Parser, Coach, Detector)
│   │   ├── authRoutes.js     # JWT Registration & Login with bcryptjs
│   │   └── resumeRoutes.js   # Owner-secured CRUD and profile picture uploads
│   ├── models/
│   │   ├── Resume.js         # Comprehensive Resume schema
│   │   └── User.js           # User credentials schema
│   ├── utils/
│   │   └── ipv4Fetch.js      # Robust network fetch with DNS resolution
│   └── server.js             # Express app entry point (Port 5001)
│
└── frontend/
    └── src/
        ├── pages/
        │   ├── Dashboard.jsx        # Command Center with Career Gauge & Module Showcase
        │   ├── ATSBeater.jsx        # ATS Keyword Matcher & Before/After comparison
        │   ├── ResumeParser.jsx     # PDF/DOCX Upload & Parsing
        │   ├── CoverTemplates.jsx   # Academic CoverCraft 3-column template showcase
        │   ├── CoverPageBuilder.jsx # Live Academic Cover Page Generator & PDF Exporter
        │   ├── InterviewCoach.jsx   # AI Mock Interview Coach
        │   ├── CareerPlaybook.jsx   # Tips & Action Verbs Playbook
        │   ├── Editor.jsx           # Live split-screen Resume Builder
        │   ├── Login.jsx            # Authentication: Sign In
        │   └── Register.jsx         # Authentication: Sign Up
        ├── components/
        │   ├── Navbar.jsx           # Floating pill header with theme toggle & auth
        │   ├── CoverPreview.jsx     # 6 academic templates with live A4 rendering
        │   ├── AIDetectorModal.jsx  # Authenticity scanner & humanizer modal
        │   ├── ResumeForm.jsx       # Multi-section editor accordion
        │   └── ResumePreview.jsx    # Real-time resume layout engine
        └── services/
            └── api.js               # Axios client wrappers with JWT interceptors
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

Create a `.env` file in the `backend/` directory:
```env
PORT=5001
MONGO_URI=mongodb://localhost:27017/resume-builder
JWT_SECRET=your_jwt_secret_key_here
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev   # Runs on http://localhost:5173
```

---

## 🔐 Authentication & Data Privacy
ResumeCraft features a dedicated **JWT + MongoDB** authentication architecture (`bcryptjs` password hashing + stateless tokens). Resumes and cover pages remain private to each user account, with zero external tracking.

---

## 📄 License
This project is open-source and available under the ISC License.
