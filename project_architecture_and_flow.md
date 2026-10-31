# ResumeCraft (Resume AI Builder) — Architecture & System Flow

This document details the completed project structure, authentication design, full-stack data flow pipelines, component architecture, and 10-parameter scoring methodology for **ResumeCraft** (AI Career Suite, ATS Engine & Academic CoverCraft).

---

## 🔐 Authentication Choice: Option 1 (JWT + MongoDB)

ResumeCraft leverages **Option 1: JWT (JSON Web Tokens) + MongoDB** as its core authentication architecture.

### Why Option 1 is the Optimal Choice:
1. **100% Data Sovereignty & Privacy**: User credentials, resumes, and project records are stored in your own MongoDB database rather than third-party cloud lock-in.
2. **Native Relational Integrity**: Resumes are linked directly to `userId` using Mongoose ObjectIds (`ref: "User"`), ensuring strict owner isolation.
3. **Zero Configuration / Cost**: Operates without external Firebase project keys, cloud billing setups, or third-party quota limits.
4. **Interview Proof**: Demonstrates understanding of custom token issuance, bcrypt hashing rounds, stateless authentication, and cryptographic bearer authorization headers from scratch.

---

## 📂 Project Directory Structure

```text
ResumeCraft (Resume AI Builder)/
│
├── backend/
│   ├── middleware/
│   │   └── auth.js             # JWT bearer verification middleware
│   ├── models/
│   │   ├── Resume.js           # Comprehensive Resume schema (Personal Info, Summary, Experience, Education, Skills, Projects)
│   │   └── User.js             # User Schema (bcryptjs hashed passwords)
│   ├── routes/
│   │   ├── authRoutes.js       # Register (/api/auth/register) & Login (/api/auth/login)
│   │   ├── resumeRoutes.js     # Owner-secured CRUD and Multer photo upload route
│   │   └── aiRoutes.js         # Gemini Flash endpoints (ATS Matcher, Parser, 10-Param Scoring, Coach, Humanizer, Detector)
│   ├── uploads/                # Serves static profile pictures
│   ├── utils/
│   │   ├── ipv4Fetch.js        # Robust network fetch utility with DNS IPv4 resolution
│   │   └── resumeScorer.js     # Deterministic & Explainable 10-Parameter Scoring Engine
│   ├── test/                   # Automated API test suites (ai, backend, detection, upload)
│   ├── .env                    # PORT, MONGO_URI, JWT_SECRET, GEMINI_API_KEY
│   ├── server.js               # Main Express entry point (Port 5001)
│   └── package.json            # @google/generative-ai, pdf-parse, mammoth, bcryptjs, jsonwebtoken, multer
│
├── images/
│   ├── resumecraft.png         # Transparent RGBA brand logo
│   ├── resumecraft_raw_icon.png# High-res master icon
│   └── iiit_allahabad.png      # Indian Institute of Information Technology Allahabad official emblem
│
└── frontend/
    ├── public/
    │   ├── favicon.svg         # SVG Application Icon
    │   ├── resumecraft.png     # Browser favicon & web clip asset
    │   └── iiit_allahabad.png  # University emblem for academic cover pages
    ├── src/
    │   ├── components/
    │   │   ├── AnimatedCharacters.jsx   # 4 expressive characters & 3D hanging ceiling lamp stage
    │   │   ├── Navbar.jsx               # Centered pill header with navigation, theme toggle & auth actions
    │   │   ├── CoverPreview.jsx         # 6 academic templates with live A4 rendering & IIIT Allahabad branding
    │   │   ├── AIDetectorModal.jsx      # GPTZero-style AI Authenticity Detector & Humanizer modal
    │   │   ├── ResumeForm.jsx           # Multi-section resume input editor (9 ATS template cards)
    │   │   ├── ResumePreview.jsx        # Real-time resume layout engine (9 native ATS layouts)
    │   │   ├── ResumeProcessingHub.jsx  # Animated 3-step scanner & 5-stage recruiter checklist
    │   │   ├── ResumeAnalysisSection.jsx# 10-Parameter explainable score dashboard
    │   │   └── HowItWorksSection.jsx    # Visual user journey walkthrough
    │   ├── pages/
    │   │   ├── Dashboard.jsx       # Command Center: Career Readiness gauge, 3 AI module cards, and document workspace
    │   │   ├── ATSBeater.jsx       # ATS Keyword Matcher, Semantic Scorer & Before/After comparison
    │   │   ├── ResumeParser.jsx    # Drag-and-drop PDF/DOCX uploader, Processing Hub & 10-Parameter Report
    │   │   ├── CoverTemplates.jsx  # Academic CoverCraft 3-column template showcase gallery
    │   │   ├── CoverPageBuilder.jsx# Live Academic Cover Page Generator with solo/group & instant PDF export
    │   │   ├── InterviewCoach.jsx  # AI Mock Interview Coach (STAR behavioral & technical questions)
    │   │   ├── CareerPlaybook.jsx  # 100+ action verbs directory, XYZ formulas, and ATS golden rules
    │   │   ├── Editor.jsx          # Live split-screen visual editor (9 templates) with PDF/Word download
    │   │   ├── Login.jsx           # Cyberpunk auth sign-in with interactive character stage
    │   │   └── Register.jsx        # Cyberpunk auth sign-up with interactive character stage
    │   ├── services/
    │   │   └── api.js              # Axios client wrappers with automatic JWT Authorization header
    │   ├── utils/
    │   │   └── wordExport.js       # Word (.docx) export generator
    │   ├── App.css
    │   ├── App.jsx                 # React Router v7 route guarding, theme bindings & full route mapping
    │   ├── index.css               # Unified design system, light/dark themes, responsive grid & animations
    │   └── main.jsx                # React 19 root mounting
    ├── index.html                  # Branded SEO metadata, high-res favicon, & Google Fonts
    └── package.json                # React 19, Vite 5, Axios, html2pdf.js, react-router-dom
```

---

## 🔄 User System Flow Diagram

```text
                                [User Visits Website]
                                          │
                     ┌────────────────────┴────────────────────┐
                     ▼                                         ▼
             [Register Page]                             [Login Page]
       (Interactive 4-Character Stage)            (Interactive 4-Character Stage)
       • Staged Slide-In Entrance                 • Staged Slide-In Entrance
         (1st Lamp Down, 2nd 4 Colors Up)           (1st Lamp Down, 2nd 4 Colors Up)
       • Real-Time Mouse Tracking (atan2)         • Real-Time Mouse Tracking (atan2)
       • Password Paw Hide / Peek States          • Password Paw Hide / Peek States
       • 5-Sec Celebration Loading Dance          • 5-Sec Celebration Loading Dance
                     │                                         │
                     └────────────► [JWT Issued] ◄─────────────┘
                                          │
                                          ▼
                             [Dashboard Command Center]
                (Career Readiness Gauge • 3 AI Modules • My Resumes)
                                          │
        ┌──────────────┬──────────────────┼──────────────────┬──────────────────┐
        │              │                  │                  │                  │
        ▼              ▼                  ▼                  ▼                  ▼
 [Resume Builder] [ATS Matcher]   [Resume Parser]    [CoverCraft Suite]  [Interview Coach]
  (9 Templates)    (ATS Beater)     (PDF / DOCX)     (/templates & create) (Mock STAR Prep)
        │              │                  │                  │                  │
        │              ├─ Keyword Gaps    ├─ Stream Parse    ├─ 6 Academic      └─ Behavioral &
        │              ├─ Semantic Fit    ├─ Processing Hub     Templates          Technical Qs
        │              └─ Before/After       (3-Step Radar)  ├─ Solo / Group
        │                 Boost (+32%)    ├─ 10-Param Score  ├─ IIIT Allahabad
        │                                 │  Dashboard       └─ Instant PDF
        │                                 └─ 1-Click Import                     │
        ▼                                    to Builder                         ▼
  [Live Preview]                                                        [Download Cover PDF]
  ┌─────┴────────────────┐
  ▼                      ▼
 [Download PDF]    [Download Word]
```

---

## 💾 Application Data Flow Pipelines

### 1. Authentication Pipeline (JWT + MongoDB)
```text
Browser Form                Express (/api/auth)             MongoDB (User Collection)
     │                                │                                │
     ├─── 1. Register/Login Data ────►│                                │
     │    (email, password)           ├─── 2. Bcrypt Hash / Compare ──►│
     │                                │    (User Document)             │
     │◄── 3. Signed JWT Token ────────┤                                │
     │    (Stored in localStorage)    │                                │
     │                                │                                │
     ├─── 4. Protected API Request ──►│                                │
     │    (Bearer JWT Header)         ├─── 5. Verify JWT & Attach User │
     ▼                                ▼                                ▼
```

### 2. ATS Keyword Matcher & Beater Pipeline
```text
React Client (ATSBeater.jsx)           Express (/api/ai/match-ats)         Google Gemini AI
             │                                      │                             │
             ├─── 1. Resume + Job Description ─────►│                             │
             │    (Bearer JWT in Header)            ├─── 2. Strict Prompt ───────►│
             │                                      │    (Keyword NLP + Embeddings)
             │                                      │◄── 3. Structured JSON ──────┤
             │◄── 4. Scored Analysis Response ──────┤                             │
             │    - Overall ATS Score (0-100)       │                             │
             │    - Matched & Missing Keywords      │                             │
             │    - Before vs After Boost (+32%)    │                             │
             ▼                                      ▼                             ▼
```

### 3. PDF/DOCX Resume Upload & 10-Parameter Scoring Pipeline
```text
React Client (ResumeParser.jsx)        Express (/api/ai/parse-resume-file)      Gemini AI & Scorer
             │                                      │                                  │
             ├─── 1. Multipart File Upload ────────►│                                  │
             │    (.pdf, .docx, .txt)               ├── 2. Extract Raw Text Buffer     │
             │                                      │   (Universal extractPdfText)     │
             │                                      ├── 3. Gemini Entity Structuring ─►│
             │                                      │◄─ 4. Structured JSON Response ───┤
             │                                      ├── 5. calculateExplainableScore() │
             │                                      │   - 10 Recruiting Parameters     │
             │                                      │   - Exact Numerical Scores       │
             │                                      │   - Strengths, Top Fixes, Summary│
             │◄── 6. Complete Score & Data Payload ─┤                                  │
             ├─── 7. Render Processing Hub & Score  │                                  │
             │    - 3-Step Scanner (100%)           │                                  │
             │    - 10 Parameter Pills with Badges  │                                  │
             │    - Interactive Tooltip Bar         │                                  │
             ├─── 8. [1-Click] Save to DB ─────────►│ (Stored into Resume Model)       │
             ▼                                      ▼                                  ▼
```

### 4. Academic Cover Page Pipeline (CoverCraft)
```text
React Client (/templates) ──► Template Selection ──► React Client (/create)
                                                            │
                                        ┌───────────────────┴───────────────────┐
                                        ▼                                       ▼
                             [Solo Submission Form]                  [Group Submission Form]
                             (Student Name, Roll No)                 (Dynamic Member Rows)
                                        │                                       │
                                        └───────────────────┬───────────────────┘
                                                            ▼
                                                [CoverPreview Component]
                                                - Selected Template Layout (1 of 6)
                                                - IIIT Allahabad / Custom University Logo
                                                - Course Code, Title, Supervisor Block
                                                - Submission Type & Date
                                                            │
                                                            ▼
                                                [html2pdf.js Vector Engine]
                                                            │
                                                            ▼
                                                [Print-Ready A4 Cover Page PDF]
```

---

## 📊 The 10-Parameter Explainable Scoring Engine

The scoring system evaluates candidate resumes against 10 explicit recruiting parameters (`backend/utils/resumeScorer.js`):

| # | Parameter ID | Display Name | What It Audits | Score Thresholds |
|---|---|---|---|---|
| **1** | `projects` | **Projects** | Scope, tech stack clarity, live deployment links, GitHub repos | $\ge 80$ Good, $\ge 65$ Polish, $< 65$ Work |
| **2** | `tech-skills` | **Technical Skills** | Programming languages, frameworks, cloud, tooling keywords | $\ge 80$ Good, $\ge 65$ Polish, $< 65$ Work |
| **3** | `education` | **Education** | Degree relevance, institution pedigree, timeline, GPA | $\ge 80$ Good, $\ge 65$ Polish, $< 65$ Work |
| **4** | `experience` | **Experience & Internships** | Professional work history, ownership, duration, role progression | $\ge 80$ Good, $\ge 65$ Polish, $< 65$ Work |
| **5** | `achievements` | **Achievements & Certifications** | Competitions, hackathons, cloud certifications, scholarships | $\ge 80$ Good, $\ge 65$ Polish, $< 65$ Work |
| **6** | `impact` | **Impact & Quantification** | Quantified metrics (%, $, time saved, latency reduction, XYZ) | $\ge 80$ Good, $\ge 65$ Polish, $< 65$ Work |
| **7** | `brevity` | **Brevity & Concision** | Signal-to-noise ratio, eliminating fluff sentences, word count | $\ge 80$ Good, $\ge 65$ Polish, $< 65$ Work |
| **8** | `style` | **Style & Consistency** | Uniform date formatting, bullet punctuation, typography | $\ge 80$ Good, $\ge 65$ Polish, $< 65$ Work |
| **9** | `ats` | **ATS & Formatting** | Standard section headings, single/double column parser compatibility | $\ge 80$ Good, $\ge 65$ Polish, $< 65$ Work |
| **10** | `language` | **Language & Spelling** | Grammar, active voice, replacing weak passive verbs with action verbs | $\ge 80$ Good, $\ge 65$ Polish, $< 65$ Work |

---

## 🎨 9 ATS Resume Templates in Live Builder

| # | ID | Name | Layout Structure | Target Roles |
|---|---|---|---|---|
| **1** | `Modern` | **Modern Professional** | Balanced 2-column with accent header | Full Stack, PM, Business |
| **2** | `Minimalist` | **Minimalist Clean** | Classic single-column linear hierarchy | Corporate, Legal, General ATS |
| **3** | `Creative` | **Creative Tech** | Left accent sidebar with tech tags & photo | Design, Frontend, Mobile |
| **4** | `Executive` | **Executive Split** | Full-bleed colored sidebar with high density | Senior Leads, Directors |
| **5** | `Classic` | **Classic Corporate** | Traditional serif (Georgia) with divider rules | Finance, Consulting, Academia |
| **6** | `Technical` | **Technical Developer** | Skill-first layout with monospace tech badges | Software Engineers, DevOps, Data |
| **7** | `Elegant` | **Elegant Border** | Framed layout with accent bands & refined typography | Marketing, Operations, Product |
| **8** | `Compact` | **Compact One-Page** | High-density layout engineered for 1-page fit | High-experience candidates |
| **9** | `Timeline` | **Timeline Career** | Vertical timeline connector rail on experience | Progressive career milestones |

---

## 🌐 API Endpoints Reference

| Method | Endpoint | Protection | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new user with hashed password |
| `POST` | `/api/auth/login` | Public | Verify credentials and return signed 7-day JWT |
| `GET` | `/api/resumes` | JWT Bearer | Fetch all resumes belonging to authenticated user |
| `GET` | `/api/resumes/:id` | JWT Bearer | Fetch single resume document by ID |
| `POST` | `/api/resumes` | JWT Bearer | Create new resume document |
| `PUT` | `/api/resumes/:id` | JWT Bearer | Update existing resume document |
| `DELETE` | `/api/resumes/:id` | JWT Bearer | Delete resume document |
| `POST` | `/api/resumes/upload` | JWT Bearer | Upload profile photo (Multer) |
| `POST` | `/api/ai/parse-resume-file` | Optional Auth | Resilient PDF/DOCX buffer parsing & 10-Parameter Scoring |
| `POST` | `/api/ai/match-ats` | JWT Bearer | ATS screening scoring, keyword gaps, and Before/After boost |
| `POST` | `/api/ai/interview-prep` | JWT Bearer | Mock interview questions with STAR answers |
| `POST` | `/api/ai/detect` | JWT Bearer | AI authenticity scoring & cliché auditor |
| `POST` | `/api/ai/humanize` | JWT Bearer | AI detector bypass & humanizing engine |
| `POST` | `/api/ai/generate-summary` | JWT Bearer | Level-based (Fresher, Mid, Senior) summary generator |
| `POST` | `/api/ai/generate-experience` | JWT Bearer | Position-based bullet points generator |
| `POST` | `/api/ai/generate-cover-letter`| JWT Bearer | Tailored cover letter body generator |
| `GET` | `/api/ai/career-playbook` | Public | 100+ power verbs, XYZ formulas, and ATS rules |

---

## 🛠️ Environment Configuration

### Backend (`backend/.env`)
```env
PORT=5001
MONGO_URI=mongodb://localhost:27017/resume-builder
JWT_SECRET=supersecretresumebuilderkey123!
GEMINI_API_KEY=your_gemini_api_key_here
```

### Color Token Palette
- **Primary Gradient**: `linear-gradient(135deg, #2563eb, #1d4ed8)`
- **ATS Match / Success**: `#10b981` (Emerald)
- **Parser / Data Flow**: `#3b82f6` (Royal Blue)
- **Academic CoverCraft**: `#f97316` / `#ea580c` (Vibrant Orange)
- **AI Audit / Inspector**: `#7c3aed` (Deep Violet)
- **Delete / Alert**: `#dc2626` (Crimson Red)
- **Dark Canvas**: `#06080f` / `#0b0f19` with subtle grid matrix
- **Light Canvas**: `#f8fafc` / `#ffffff` with high-contrast `#0f172a` typography
