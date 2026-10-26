# ResumeCraft (Resume AI Builder) — Architecture & System Flow

This document details the completed project structure, authentication design, full-stack data flow pipelines, and component architecture for **ResumeCraft** (AI Career Suite, ATS Engine & Academic CoverCraft).

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
│   │   └── aiRoutes.js         # Gemini Flash endpoints (ATS Matcher, Parser, Coach, Humanizer, Detector)
│   ├── uploads/                # Serves static profile pictures
│   ├── utils/
│   │   └── ipv4Fetch.js        # Robust network fetch utility with DNS IPv4 resolution
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
    │   │   ├── AnimatedCharacters.jsx # 4 expressive characters & 3D hanging ceiling lamp stage
    │   │   ├── Navbar.jsx          # Centered pill header with navigation, theme toggle & auth actions
    │   │   ├── CoverPreview.jsx    # 6 academic templates with live A4 rendering & IIIT Allahabad branding
    │   │   ├── AIDetectorModal.jsx # GPTZero-style AI Authenticity Detector & Humanizer modal
    │   │   ├── ResumeForm.jsx      # Multi-section resume input editor
    │   │   └── ResumePreview.jsx   # Real-time resume layout engine (Modern, Minimalist, Creative, Executive)
    │   ├── pages/
    │   │   ├── Dashboard.jsx       # Command Center: Career Readiness gauge, 3 AI module cards, and document workspace
    │   │   ├── ATSBeater.jsx       # ATS Keyword Matcher, Semantic Scorer & Before/After comparison
    │   │   ├── ResumeParser.jsx    # Drag-and-drop PDF/DOCX file uploader & structured extraction
    │   │   ├── CoverTemplates.jsx  # Academic CoverCraft 3-column template showcase gallery
    │   │   ├── CoverPageBuilder.jsx# Live Academic Cover Page Generator with solo/group & instant PDF export
    │   │   ├── InterviewCoach.jsx  # AI Mock Interview Coach (STAR behavioral & technical questions)
    │   │   ├── CareerPlaybook.jsx  # 100+ action verbs directory, XYZ formulas, and ATS golden rules
    │   │   ├── Editor.jsx          # Live split-screen visual editor with PDF/Word download
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
  (Create/Edit)    (ATS Beater)     (PDF / DOCX)     (/templates & create) (Mock STAR Prep)
        │              │                  │                  │                  │
        │              ├─ Keyword Gaps    ├─ Stream Parse    ├─ 6 Academic      └─ Behavioral &
        │              ├─ Semantic Fit    └─ 1-Click Import     Templates          Technical Qs
        │              └─ Before/After       to Builder      ├─ Solo / Group
        │                 Boost (+32%)                       ├─ IIIT Allahabad
        │                                                    └─ Instant PDF
        ▼                                                               │
  [Live Preview]                                                        ▼
        │                                                    [Download Cover PDF]
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
             │    - Key Projects                    │                              │
             ├─── 6. [1-Click] Save to DB ─────────►│ (Stored into Resume Model)   │
             ▼                                      ▼                              ▼
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

## 🎨 UI & Design System Architecture

### 1. Dashboard Command Center
- **Career Readiness Widget**: Circular SVG gauge calculating live ATS readiness score, tracked resumes, and connected AI models.
- **Flagship AI Modules (Trio Cards)**:
  - **ATS Keyword Matcher** (`card-ats-beater`): Emerald Green accent (`#10b981`), `HOT • ATS BEATER` badge.
  - **Resume Upload & Parser** (`card-parser`): Royal Blue accent (`#3b82f6`), `INSTANT IMPORT` badge.
  - **Academic Cover Page Generator** (`card-covercraft`): Energetic Orange accent (`#ea580c` / `#f97316`), `NEW • COVERCRAFT` badge.
- **Document Workspace**:
  - Live search and category filters (`All`, `Modern`, `Minimalist`, `Creative`, `Executive`).
  - Document sheet preview with real-time candidate data and initials badge.
  - Vibrant Light/Dark action buttons: **Edit in Builder** (Blue), **Match JD** (Emerald `#059669`), **AI Audit** (Violet `#7c3aed`), and **Delete** (Crimson `#dc2626`).

### 2. Floating Navbar & Navigation Capsule
- **Left**: Transparent RGBA brand logo with glowing hover aura.
- **Center Capsule**: Floating pill navigation containing `📊 Dashboard`, `🎨 Templates`, `🎯 ATS Matcher AI`, and `📤 Parse File`.
- **Right**: Primary `+ Create Resume` gradient button, `Dark / Light` theme toggle, and styled red `Logout` button.

### 3. Academic CoverCraft Suite (`/templates` & `/create`)
- **3-Slide Gallery Grid**: 3-column template showcase (`repeat(3, minmax(0, 1fr))`) rendering all 6 academic templates cleanly.
- **Live A4 Form-Builder**: Live split-screen with instant PDF vector export powered by `html2pdf.js`.
- **Institutional Identity**: Pre-configured with **Indian Institute of Information Technology Allahabad** emblem and configurable for any academic institution.

### 4. Cyberpunk Animated Character Stage & Optics Engine
- **3-Tier Decoupled SVG Pipeline**:
  - *Layer 1 (Entrance)*: `.char-*-entrance` handles the spring slide-up from beneath the floor (`translateY(340px)` ➔ `translateY(0)`).
  - *Layer 2 (Alive Breathing)*: `.char-*-alive` handles the continuous, subtle breathing and swaying loops.
  - *Layer 3 (Mouse Tracking & Tilts)*: `.char-*` handles real-time rotational tilts (`rotate(${tilt}deg)`), celebration jumping, and paw positioning without animation conflict.
- **Trigonometric Math Engine (`Math.atan2`)**:
  - Computes dynamic polar angles `Math.atan2(dy, dx)` relative to the stage center point.
  - Clamps radius with `Math.hypot` to limit maximum pupil displacement (`6.8px`).
  - Normalizes viewport coordinate deltas to drive responsive body rotation:
    - Purple: &plusmn;4&deg;
    - Pink: &plusmn;6&deg;
    - Orange: &plusmn;3.5&deg; with organic squish/stretch
    - Yellow: &plusmn;8&deg; body tilt with &plusmn;20&deg; seesaw beak rotation
- **Staged Slide Entrance Choreography**:
  - *1st Movement (Lamp Down)*: Hanging 3D lamp drops from above (`translateY(-140px)` ➔ `translateY(0)`) at `0.0s` with cubic-bezier spring easing.
  - *Beam Bloom*: Conical light beam flares downward from the shade rim at `0.25s`.
  - *2nd Movement (4 Colors Up)*: Staggered sequence popping up into the spotlight:
    - 🟣 Purple: `0.42s`
    - 🔴 Pink: `0.52s`
    - 🟡 Yellow: `0.62s`
    - 🟠 Orange: `0.72s`
- **Lighting Optics & Pull Cord Mechanics**:
  - 3D Conical metallic shade (`polygon(30% 0%, 70% 0%, 100% 100%, 0% 100%)`) with layered socket cap and elliptical under-rim opening (`92px`).
  - Conical light beam positioned at `top: 78px` with aperture `clip-path: polygon(42.5% 0%, 57.5% 0%, 100% 100%, 0% 100%)` (width `66px`), perfectly tucked 13px inside the shade rim opening to eliminate side artifacts.
  - Interactive pull cord with expanded **38&times;76px** click hitbox (`z-index: 12`), `e.stopPropagation()` event bubbling guard, hover glow enlargement, and `16px` spring pull animation.
  - Complete light shut-off state (`display: none !important; opacity: 0 !important;`) that extinguishes the light beam, floor glow, and dims characters into ambient darkness.
- **Cyberpunk Auth Form UI**:
  - Gliding indicator arrow (`◀`) that slides smoothly between active inputs via CSS cubic-bezier transition.
  - Floating sparkle particles (`.btn-sparkle`) around neon gradient submit buttons.
  - Seamless Dark & Light theme overrides with Chrome `-webkit-autofill` background color protection.

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
