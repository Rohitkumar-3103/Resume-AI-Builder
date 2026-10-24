# Resume AI Builder — Architecture & System Flow

This document details the completed project structure, authentication design, and full-stack data flow pipelines for **Resume AI Builder** (AI Career Suite & ATS Engine).

---

## 🔐 Authentication Choice: Option 1 (JWT + MongoDB)

Resume AI Builder leverages **Option 1: JWT (JSON Web Tokens) + MongoDB** as its core authentication architecture.

### Why Option 1 is the Optimal Choice:
1. **100% Data Sovereignty & Privacy**: User credentials and resume records are stored in your own MongoDB database rather than being locked into third-party cloud vendors.
2. **Native Relational Integrity**: Resumes are linked directly to `userId` using Mongoose ObjectIds (`ref: "User"`), ensuring strict owner isolation.
3. **Zero Configuration / Cost**: Operates without external Firebase project keys, billing setups, or third-party quota limits.
4. **Interview Proof**: Proves in interviews that you understand custom token issuance, bcrypt hashing rounds, and cryptographic bearer authorization headers from scratch.

---

## 📂 Project Directory Structure

```text
Resume AI Builder/
│
├── backend/
│   ├── middleware/
│   │   └── auth.js             # JWT bearer verification middleware
│   ├── models/
│   │   ├── Resume.js           # Resume schema (Personal Info, Summary, Experience, Education, Skills, Projects)
│   │   └── User.js             # User Schema (bcryptjs hashed passwords)
│   ├── routes/
│   │   ├── authRoutes.js       # Register (/api/auth/register) & Login (/api/auth/login)
│   │   ├── resumeRoutes.js     # Owner-secured CRUD and Multer photo upload route
│   │   └── aiRoutes.js         # Gemini 2.5 Flash endpoints (ATS Matcher, Parser, Coach, Humanizer, Detector)
│   ├── uploads/                # Serves static profile pictures
│   ├── .env                    # PORT, MONGO_URI, JWT_SECRET, GEMINI_API_KEY
│   ├── server.js               # Main Express entry point (Port 5001)
│   └── package.json            # Dependencies: @google/generative-ai, pdf-parse, mammoth, bcryptjs, jsonwebtoken, multer
│
└── frontend/
    ├── public/
    │   ├── favicon.svg         # SVG Application Icon
    │   └── icons.svg
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx          # Resume AI Builder header with AI sparkle badge & suite navigation
    │   │   ├── AIDetectorModal.jsx # GPTZero-style AI Authenticity Detector & Humanizer modal
    │   │   ├── ResumeForm.jsx      # Multi-section resume input editor
    │   │   └── ResumePreview.jsx   # Real-time templates: Modern, Minimalist, Creative, Executive
    │   ├── pages/
    │   │   ├── Dashboard.jsx       # Command Center: quick launch tools, resume grid, and stats
    │   │   ├── ATSBeater.jsx       # ATS Keyword Matcher, Semantic Scorer & Before/After comparison
    │   │   ├── ResumeParser.jsx    # Drag-and-drop PDF/DOCX file uploader & structured extraction
    │   │   ├── InterviewCoach.jsx  # AI Mock Interview Coach (STAR behavioral & technical questions)
    │   │   ├── CareerPlaybook.jsx  # 100+ action verbs directory, XYZ formulas, and ATS golden rules
    │   │   ├── Editor.jsx          # Split-screen visual editor with PDF/Word download
    │   │   ├── Login.jsx           # Login panel
    │   │   └── Register.jsx        # Registration panel
    │   ├── services/
    │   │   └── api.js              # Axios client wrappers with automatic JWT Authorization header
    │   ├── utils/
    │   │   └── wordExport.js       # Word (.docx) export generator
    │   ├── App.css
    │   ├── App.jsx                 # React Router (v7) route guarding & theme bindings
    │   ├── index.css               # Full responsive design system, theme tokens, and animations
    │   └── main.jsx                # React 19 root mounting
    ├── index.html                  # Branded SEO metadata & Google Fonts
    └── package.json                # React 19, Vite 5, Axios, html2pdf.js
```

---

## 🔄 User System Flow Diagram

```text
                               [User Visits Website]
                                         │
                    ┌────────────────────┴────────────────────┐
                    ▼                                         ▼
            [Register Page]                             [Login Page]
                    │                                         │
                    └────────────► [JWT Issued] ◄─────────────┘
                                         │
                                         ▼
                            [Dashboard Command Center]
                                         │
       ┌──────────────┬──────────────────┼──────────────────┬──────────────┐
       │              │                  │                  │              │
       ▼              ▼                  ▼                  ▼              ▼
[Resume Builder] [ATS Matcher]   [Resume Parser]   [Interview Coach] [Playbook]
 (Create/Edit)    (ATS Beater)     (PDF / DOCX)      (Mock Prep)     (Verbs/Tips)
       │              │                  │                  │              │
       │              ├─ Matched/Missing ├─ In-memory       ├─ STAR Model  └─ Action
       │              │  Keywords           Buffer extract     Answers        Verbs
       │              ├─ Semantic Fit    └─ 1-Click Import  └─ Recruiter   └─ XYZ
       │              └─ Before vs After    to Builder         Intent         Rules
       │                 Comparison
       ▼
 [Live Preview]
       │
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
React Client (ATSBeater.jsx)           Express (/api/ai/match-ats)         Google Gemini 2.5 Flash
             │                                      │                                 │
             ├─── 1. Resume + Job Description ─────►│                                 │
             │    (Bearer JWT in Header)            ├─── 2. Strict Prompt Engineering►│
             │                                      │    (Keyword NLP + Embeddings)   │
             │                                      │◄── 3. Structured JSON Output ───┤
             │◄── 4. Scored Analysis Response ──────┤                                 │
             │    - Overall ATS Score (0-100)       │                                 │
             │    - Matched & Missing Keywords      │                                 │
             │    - Before vs After Boost (+32%)    │                                 │
             ▼                                      ▼                                 ▼
```

### 3. PDF/DOCX Resume Upload & Parsing Pipeline
```text
React Client (ResumeParser.jsx)        Express (/api/ai/parse-resume-file)      Gemini AI
             │                                      │                              │
             ├─── 1. Multipart File Upload ────────►│                              │
             │    (.pdf, .docx, .txt)               ├── 2. Extract Raw Text Buffer │
             │                                      │   (pdf-parse / mammoth)      │
             │                                      ├── 3. Parse Entities Prompt ─►│
             │                                      │◄─ 4. Structured Resume JSON ─┤
             │◄── 5. Clean Extracted Sections ──────┤                              │
             │    - Personal Info, Summary          │                              │
             │    - Skills, Experience, Education   │                              │
             ├─── 6. [1-Click] Save to DB ─────────►│ (Stored into Resume Model)   │
             ▼                                      ▼                              ▼
```

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
| `POST` | `/api/ai/parse-resume-file` | JWT Bearer | In-memory PDF/DOCX buffer parsing & Gemini structuring |
| `POST` | `/api/ai/match-ats` | JWT Bearer | ATS screening scoring, keyword gaps, and Before/After boost |
| `POST` | `/api/ai/interview-prep` | JWT Bearer | Mock interview questions with STAR answers |
| `POST` | `/api/ai/detect` | JWT Bearer | AI authenticity scoring & cliché auditor |
| `POST` | `/api/ai/humanize` | JWT Bearer | AI detector bypass & humanizing engine |
| `POST` | `/api/ai/generate-summary` | JWT Bearer | Level-based (Fresher, Mid, Senior) summary generator |
| `POST` | `/api/ai/generate-experience` | JWT Bearer | Position-based bullet points generator |
| `POST` | `/api/ai/generate-cover-letter`| JWT Bearer | Tailored cover letter body generator |
| `GET` | `/api/ai/career-playbook` | Public | 100+ power verbs, XYZ formulas, and ATS rules |

---

## 🎨 Executive Editor Suite Architecture (Create & Edit Resume)

The `/editor/create` and `/editor/:id` visual workstation is built for real-time document crafting with dual Light / Dark mode perfection:

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│  EDITOR TOPBAR: [← Dashboard] | [📝 Title Input] [● Saved]   [🎯 ATS] [📥 Import] [🛡️ Audit]  [💾 Save] [📝 Word] [📄 PDF] │
├──────────────────────────────────────────┬─────────────────────────────────────────────┤
│  FORM BUILDER PANEL (42% Width)          │  PREVIEW WORKSTATION (58% Width)            │
│  - Quick Starter Deck (1-Click Sample)   │  - Fixed Header Toolbar:                    │
│  - Layout & Theme (Interactive Cards)    │    [📄 Resume Preview] [✉️ Cover Letter]     │
│  - Personal Details (Photo Dropzone)     │    [− 92% + 100%] Zoom Controller           │
│  - Professional Summary (AI Generator)   │    [🟣 Template Style Badge]                 │
│  - Work Experience (STAR Bullets)        │  - Scrollable Canvas Viewport:              │
│  - Education & Academic Honors           │    - Light: #eef2f7 with Dot-Matrix Grid    │
│  - Key Projects & Repository Links       │    - Dark: #090b14 with Dot-Matrix Grid     │
│  - Skills & Keywords (+ Quick Chips)     │    - Real-Time Multi-Layer Paper Shadow     │
│  - Tailored Cover Letter Form            │    - A4 Standards (210 × 297 mm)            │
└──────────────────────────────────────────┴─────────────────────────────────────────────┘
```

### Key UX Innovations:
1. **Pinned Preview Toolbar**: Never scrolls away when navigating lengthy multi-page resumes.
2. **Precision Zoom Deck**: Live zooming (`65%` to `125%` with `Fit / 100%` toggle) ensures the resume sheet is never clipped on narrow viewports.
3. **Interactive Template Cards**: Clickable visual cards for `Modern Professional`, `Minimalist Clean`, `Creative Tech`, and `Executive Split`.
4. **Live Status Badge**: Immediate feedback (`✓ Saved` vs `● Unsaved edits`) with auto-save timestamp.
5. **Harmonious Light & Dark Themes**: Deep obsidian dark mode (`#080a11`, `#141729`) and crisp clean light mode (`#f8fafc`, `#ffffff`, `#eef2f7`).

---

## 🛠️ Environment Configuration

### Backend (`backend/.env`)
```env
PORT=5001
MONGO_URI=mongodb://localhost:27017/resume-builder
JWT_SECRET=supersecretresumebuilderkey123!
GEMINI_API_KEY=your_gemini_api_key_here
```

### Theme Presets
- **Primary Color**: `#2563eb` (Royal Blue)
- **Secondary / Highlight Color**: `#f59e0b` (Amber Orange)
- **AI Accent**: `linear-gradient(135deg, #2563eb, #8b5cf6)`
- **Success / ATS Pass**: `#10b981` (Emerald)
