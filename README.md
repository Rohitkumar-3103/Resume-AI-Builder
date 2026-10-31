# ResumeCraft (Resume AI Builder) — AI Career Suite, ATS Engine & Academic CoverCraft

A modern, full-stack AI Resume & Academic Career Suite powered by **MERN (MongoDB, Express, React 19, Node.js)** and **Google Gemini AI**.

ResumeCraft empowers job seekers and students to build recruiter-grade resumes, score and optimize applications across 10 transparent recruiting parameters, match resumes against target job descriptions using semantic keyword analysis, audit resumes for AI detector markers, parse existing PDF/DOCX resumes with an animated processing hub, generate professional academic assignment cover pages, and prepare for high-stakes interviews with a simulated AI Interview Coach.

---

## ✨ Flagship Modules & Features

### 1. 📊 Explainable 10-Parameter Resume Scoring Engine
- **Transparent Recruiting Audit**: Evaluates resumes across 10 core recruiting parameters:
  1. *Projects* (scope, tech stack clarity, live links, architectural complexity)
  2. *Technical Skills* (languages, frameworks, tooling, keyword density)
  3. *Education* (degree relevance, pedigree, GPA, timeline)
  4. *Experience & Internships* (employment history, role progression, ownership)
  5. *Achievements & Certifications* (rankings, hackathons, cloud certifications, awards)
  6. *Impact & Quantification* (metrics, %, $, latency reduction, XYZ achievements)
  7. *Brevity & Concision* (signal-to-noise ratio, eliminating fluff)
  8. *Style & Consistency* (uniform formatting, typography, punctuation)
  9. *ATS & Formatting* (standard section headers, parser readability)
  10. *Language & Spelling* (grammar, power action verbs, active voice)
- **Individual Parameter Score Badges**: Displays exact score numbers (0–100) with color-coded status badges:
  - 🟢 **High ($\ge 80$)**: Mint / Emerald badge
  - 🟡 **Mid ($70–79$)**: Amber badge
  - 🔴 **Low ($< 70$)**: Soft Coral / Red badge
- **Interactive Tooltip Bar**: Hovering or clicking any parameter reveals its score, status, and personalized recruiter guidance.
- **Overall Readiness Gauge**: Circular animated SVG gauge displaying instant 0–100 score, Interview Readiness band (*Top Tier*, *Interview Ready*, *Needs Polish*, *Needs Revision*), key strengths, top fixes, and AI summary.

### 2. ⚡ Real-Time Animated Resume Processing Hub
- **3-Step Visual Pipeline**: Smooth animated sequence tracking `01 Upload` ➔ `02 Analyze` ➔ `03 Improve`.
- **Pulse Radar Scanner**: Active concentric pulse radar scanner with live percentage counter.
- **5-Stage Recruiter Checklist**: Staged animated checkmarks verifying document structure, contact details, action verbs, keyword density, and overall career readiness.

### 3. 🎯 ATS Keyword Matcher & Screening Scorer (ATS Beater)
- **Deep ATS Screening**: Scores resumes against any target Job Description using semantic similarity and keyword frequency analysis.
- **Keyword Gap Analysis**: Categorizes missing terms into *Critical Hard Skills*, *Tools & Frameworks*, *Soft Skills*, and *Domain Credentials* with exact placement advice.
- **Section Scores**: Real-time breakdown of Technical Skills Match, Work Experience Relevance, Education Fit, and ATS Readability.
- **"Before vs After" ATS Beater Comparison**: 
  - Visual score boost projection (e.g. 62% ➔ 94%).
  - Tailored AI-optimized professional summary incorporating missing target keywords.
  - Side-by-side bullet point improvements rewritten with Google's XYZ formula and high-impact action verbs.
  - Prioritized step-by-step action roadmap.

### 4. 📤 Universal PDF & DOCX Resume Upload & AI Parser
- Drag-and-drop or upload any existing resume in `.pdf`, `.docx`, `.doc`, or `.txt` format (or paste raw text).
- **Universal PDF Extractor**: Compatible with `pdf-parse` v2 (`PDFParse` class) and stream-based text recovery fallbacks for 100% crash-free parsing.
- Gemini AI categorizes unstructured text into structured resume sections: Personal Info, Professional Summary, Skills, Work Experience, Education, and Key Projects.
- **One-Click Import**: Directly populates the Live Resume Builder editor or transfers into the ATS Matcher.

### 5. 📑 Academic Cover Page Generator (CoverCraft)
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

### 6. ✍️ Live Split-Screen Resume Builder (9 ATS Templates)
- Split-screen live preview with instant CSS typography and layout rendering.
- **9 Designer ATS Resume Templates**:
  1. **Modern Professional**: Balanced two-column layout with header accent and optimal space efficiency.
  2. **Minimalist Clean**: Single-column classic hierarchy with 100% ATS readability.
  3. **Creative Tech**: Distinctive accent sidebar with tech tag layout and photo support.
  4. **Executive Split**: Full-bleed left colored sidebar for high-density executive profiles.
  5. **Classic Corporate**: Traditional serif single-column structure with elegant horizontal dividers.
  6. **Technical Developer**: Developer-first layout featuring prominent skills block, monospace tech stacks, and project links.
  7. **Elegant Border**: Framed layout with theme accent lines, refined typography, and balanced spacing.
  8. **Compact One-Page**: High-density layout engineered to fit extensive experience onto a single page.
  9. **Timeline Career**: Chronological vertical timeline connector rail showing continuous career progression.
- Custom theme color picker and accent bubble presets.
- Profile picture upload with local asset storage.
- Instant high-fidelity **PDF Export** (`html2pdf.js`) and **Word Export** (`.docx`).

### 7. 🛡️ AI Content Detector & Authenticity Auditor
- Scans full resumes, summaries, or individual work bullets for AI markers (perplexity, burstiness, robotic buzzwords).
- Flags overused clichés ("spearheaded", "beacon", "orchestrated", "pivotal role").
- Includes an **AI Humanizer** that rewrites content with natural human cadence, active voice, and authentic impact metrics.

### 8. 🎙️ AI Technical & Behavioral Interview Coach
- Generates 5 tailored, realistic interview questions (Technical Architecture, Behavioral STAR method, Situational) based on the candidate's actual projects and the target job description.
- Explains hidden recruiter intent ("Why the interviewer asks this").
- Outlines must-hit talking points and red-flag pitfalls to avoid.
- Provides expandable, high-scoring model answers customized to the candidate's background.

### 9. 💡 Career Playbook & Power Action Verbs
- Directory of 100+ recruiter-approved power action verbs categorized by field (*Engineering*, *Data & AI*, *Leadership*, *Product*, *Design*).
- Click-to-copy functionality for instant integration into resumes.
- Interactive guide to Google's XYZ formula (*"Accomplished [X] as measured by [Y] by doing [Z]"*).
- 5 ATS compliance golden rules.

### 10. 🌓 Theme Studio & Command Center
- Full **Dark Mode & Light Mode** support across every component with persistent local storage.
- Interactive Career Readiness circular gauge with live health dots and status indicators.
- Quick search and filtering across saved resumes by all 9 template categories.
- Color-coded action buttons for every document: **Match JD** (Emerald Green), **AI Audit** (Violet), and **Delete** (Coral Red).

### 11. 🎭 Interactive Animated Character Stage & Cyberpunk Neon Auth System
- **4 Expressive Characters (Purple, Pink, Yellow, Orange)**:
  - **Trigonometric Mouse Cursor Tracking**: Real-time pupil tracking across the screen using `Math.atan2`, paired with body tilts and Yellow's seesaw beak rotation.
  - **3-Tier Decoupled SVG Architecture**: Nested layers separate slide-up entrance animations, continuous organic breathing loops, and live cursor tilts so motions never conflict.
  - **Interactive State Reactions**:
    - *Password Hidden*: Purple covers its eyes with paws and Pink looks away shyly.
    - *Password Visible*: Purple peeks through paws with rosy blushing cheeks and happy smile.
    - *Typing*: Character mouths and beaks chatter dynamically in sync with input keystrokes.
    - *5-Second Celebration Dance*: Bouncing jumps, raised cheering arms, and floating twinkling star particles upon Sign In / Sign Up submission.
- **Hanging 3D Conical Ceiling Lamp & Optics**:
  - Layered metallic cap socket, 3D conical shade, and tucked-in bright cyan bulb dome with radial bloom.
  - **Staged Slide Entrance Choreography**:
    - *Phase 1*: Lamp smoothly slides down from the ceiling (`translateY(-140px)` ➔ `translateY(0)`).
    - *Phase 2*: 4 characters slide up into position from beneath the stage floor (`translateY(340px)` ➔ `translateY(0)`) in a staggered sequence.
  - **Interactive Pull Cord & Hitbox**: Generous 38&times;76px clickable hitbox with 16px spring pull animation and complete light shut-off state (`display: none !important; opacity: 0 !important`).
- **Cyberpunk Auth Form UI**:
  - Gliding neon arrow indicator (`◀`) tracking active input fields with spring physics.
  - Floating animated sparkles around glowing gradient submit pill buttons.
  - Full Dark & Light theme overrides with Chrome `-webkit-autofill` background color preservation.

---

## 🛠️ Architecture & Tech Stack

```text
ResumeCraft (Resume AI Builder)
├── backend/
│   ├── routes/
│   │   ├── aiRoutes.js          # Gemini Flash endpoints (ATS Matcher, Parser, Coach, Detector)
│   │   ├── authRoutes.js        # JWT Registration & Login with bcryptjs
│   │   └── resumeRoutes.js      # Owner-secured CRUD and profile picture uploads
│   ├── models/
│   │   ├── Resume.js            # Comprehensive Resume schema
│   │   └── User.js              # User credentials schema
│   ├── utils/
│   │   ├── ipv4Fetch.js         # Robust network fetch with DNS resolution
│   │   └── resumeScorer.js      # 10-Parameter Explainable Scoring Engine
│   └── server.js                # Express app entry point (Port 5001)
│
└── frontend/
    └── src/
        ├── pages/
        │   ├── Dashboard.jsx        # Command Center with Career Gauge & Module Showcase
        │   ├── ATSBeater.jsx        # ATS Keyword Matcher & Before/After comparison
        │   ├── ResumeParser.jsx     # PDF/DOCX Upload, Processing Hub & 10-Parameter Report
        │   ├── CoverTemplates.jsx   # Academic CoverCraft 3-column template showcase
        │   ├── CoverPageBuilder.jsx # Live Academic Cover Page Generator & PDF Exporter
        │   ├── InterviewCoach.jsx   # AI Mock Interview Coach
        │   ├── CareerPlaybook.jsx   # Tips & Action Verbs Playbook
        │   ├── Editor.jsx           # Live split-screen Resume Builder (9 Templates)
        │   ├── Login.jsx            # Authentication: Sign In with interactive stage
        │   └── Register.jsx         # Authentication: Sign Up with interactive stage
        ├── components/
        │   ├── AnimatedCharacters.jsx   # 4 expressive characters & 3D hanging lamp stage
        │   ├── Navbar.jsx               # Floating pill header with theme toggle & Sign In pill button
        │   ├── CoverPreview.jsx         # 6 academic templates with live A4 rendering
        │   ├── AIDetectorModal.jsx      # Authenticity scanner & humanizer modal
        │   ├── ResumeForm.jsx           # Multi-section editor accordion (9 template cards)
        │   ├── ResumePreview.jsx        # Real-time resume layout engine (9 ATS layouts)
        │   ├── ResumeProcessingHub.jsx  # Animated 3-step scanner & recruiter checklist
        │   ├── ResumeAnalysisSection.jsx# 10-Parameter explainable score dashboard
        │   └── HowItWorksSection.jsx    # Visual user journey walkthrough
        └── services/
            └── api.js                   # Axios client wrappers with JWT interceptors
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
