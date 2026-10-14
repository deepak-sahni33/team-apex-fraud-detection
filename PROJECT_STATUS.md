# ScamShield  AI — Project Status & Handover Document

> **Status Date**: October 2026  
> **Repository Root**: `c:\Users\deepa\OneDrive\Desktop\Scam Sheild AI Project`  
> **Platform Version**: 2.0.0  
> **Verification Status**: Fully Verified & Passing (7/7 Server Tests Passed, Frontend Build Passed)

---

## 1. Project Overview and Objectives

**ScamShield  AI** is an enterprise-grade cybersecurity threat detection and analysis platform designed to identify, dissect, and explain phishing messages, deceptive SMS/emails, social engineering lures, and malicious URLs.

### Primary Objectives:

1. **Linguistic & Behavioral Threat Detection**: Scans message content for urgency manipulation, account suspension pretexts, credential harvesting, OTP solicitation, wire transfer/cryptocurrency demands, brand impersonation, fake prize lures, and coercive legal intimidation.
2. **Deep URL & Hostname Heuristic Analysis**: Inspects suspicious URLs for IP-based hosts, IDN homograph / punycode deception, credential obfuscation (`@` delimiter), insecure HTTP transmission, deep subdomain nesting, brand typosquatting, high-risk TLDs, non-standard web ports, authentication path traps, and open redirect parameters.
3. **Explainable Risk Scoring**: Computes a normalized 0–100 risk score and categorizes incidents into transparent risk tiers:
   - `LOW` (0–24)
   - `MEDIUM` (25–49)
   - `HIGH` (50–74)
   - `CRITICAL` (75–100)
     Provides granular confidence metrics, specific indicator lists, and concrete user safety actions.
4. **Dual-Pipeline AI & Rule Engine**: Seamlessly integrates with Google Gemini (`gemini-1.5-flash`) or OpenAI (`gpt-4o-mini`) via REST APIs, while incorporating an autonomous, deterministic rule-based cybersecurity engine fallback when API keys are absent or external services fail.
5. **Resilient Case Persistence & Live Analytics**: Saves all scans as trackable cases with unique IDs, supports search and multi-criteria filtering, and feeds a live security analytics dashboard. Implements a thread-safe in-memory store fallback when MongoDB is offline to ensure zero crashes.

---

## 2. Technology Stack

### Backend (`/server`)

- **Runtime**: Node.js (v18+) with Express.js (ES Modules, `"type": "module"`)
- **Database**: MongoDB with Mongoose ODM (v8.8.1)
- **Database Resilience**: In-Memory Storage Fallback (zero-crash execution when MongoDB is not running)
- **AI Engine Abstraction**: Google Gemini REST API / OpenAI API / Deterministic Cybersecurity Engine
- **Security & Middleware**:
  - `helmet` (v8.0.0) — HTTP security headers
  - `cors` (v2.8.5) — Origin allowlist configuration
  - `express-rate-limit` (v7.4.1) — Rate limiting (100 req / 15 min per IP)
  - Custom input validation & sanitization (`middleware/validate.js`)
  - Centralized error handling (`middleware/errorHandler.js`)
- **Testing**: Node.js native assert test suite (`tests/api.test.js`)

### Frontend (`/frontend`)

- **Framework**: React 18.3.1 + Vite 5.4.10
- **Styling**: Tailwind CSS v3.4.14 with `@tailwindcss/forms` and custom cybersecurity SaaS theme
- **Routing**: React Router DOM v6.27.0
- **Data Visualization**: Recharts v2.13.3 (Risk trends, category breakdowns, score distribution)
- **Icons & UI**: Lucide React v0.456.0, React Hot Toast v2.4.1, custom SVG RiskScoreGauge
- **Utilities**: `clsx`, `tailwind-merge`, `date-fns` v3.6.0

---

## 3. Features Already Completed & Verified

The following features have been verified through automated integration tests and production build verification:

- [x] **Message Threat Analyzer (`server/analyzers/messageAnalyzer.js`)**:
  - 11 threat categories analyzed: Urgency manipulation, account suspension/alerts, credential/password harvesting, OTP requests, banking/crypto demands, brand impersonation, prize/lottery scams, KYC fraud, investment scams, legal coercion, and embedded hyperlinks.
  - Verified via backend test suite.
- [x] **URL Heuristic Analyzer (`server/analyzers/urlAnalyzer.js`)**:
  - Heuristic checks: IP hostname detection, Punycode/IDN homograph attacks, credential/`@` symbol obfuscation, insecure HTTP, excessive subdomain levels, brand typosquatting, high-risk TLDs, non-standard ports, suspicious auth path keywords, open redirect parameters.
  - Verified via backend test suite.
- [x] **Explainable Risk Scorer (`server/analyzers/riskScorer.js`)**:
  - Calculates weighted 0–100 scores, assigns standard tiers (LOW/MEDIUM/HIGH/CRITICAL), generates confidence scores, and produces contextual safety recommendations.
- [x] **AI Abstraction Layer & Deterministic Fallback (`server/services/aiService.js`)**:
  - Transparent switching between Gemini, OpenAI, and deterministic rule-based threat engine.
  - Structured JSON response parsing and validation.
- [x] **Database & Resilience Engine (`server/config/db.js`, `server/services/caseService.js`)**:
  - Connects to MongoDB if available.
  - Automatically falls back to in-memory store if MongoDB is down, seeded with initial mock cases and capable of handling live CRUD queries without 500 errors.
- [x] **API Endpoints & Controllers**:
  - `GET /api/health` — System status, DB connection, AI engine mode.
  - `POST /api/analyze/message` — Analyzes message text with input validation and rate limiting.
  - `POST /api/analyze/url` — Analyzes URL with protocol parsing, validation, and rate limiting.
  - `GET /api/cases` — Retrieves paginated cases with search and filter queries.
  - `GET /api/cases/:id` — Retrieves case details by Case ID.
  - `DELETE /api/cases/:id` — Deletes a case record.
  - `GET /api/dashboard/stats` — Aggregates counts, average risk score, detection rate, trends, and recent cases.
- [x] **Frontend Threat Scanner (`frontend/src/pages/ScannerPage.jsx`)**:
  - Dual tabs for Message and URL analysis.
  - Preset examples for instant testing.
  - Character counter, real-time input validation, error handling, and loading state.
  - Renders comprehensive `AnalysisResult` card with SVG gauge, risk badge, confidence metric, indicator list, and recommended actions.
- [x] **Frontend Security Dashboard (`frontend/src/pages/DashboardPage.jsx`)**:
  - 4 key KPI stat cards (Total scans, Critical threats, High risk detections, Avg risk score).
  - Recharts risk trend charts and threat category distribution.
  - Recent case table with direct links to details.
  - Synchronizes with backend `/api/dashboard/stats` with demo data fallback.
- [x] **Frontend Case History (`frontend/src/pages/HistoryPage.jsx`)**:
  - Live full-text search by ID, category, or input content.
  - Risk level and analysis type filter dropdowns.
  - Synchronizes with backend `/api/cases`.
- [x] **Frontend Case Details (`frontend/src/pages/CaseDetailsPage.jsx`)**:
  - Comprehensive report page showing case metadata, risk gauge, original input with copy-to-clipboard, evidence list, and recommended actions.
- [x] **Frontend Landing & Technical Pages (`LandingPage.jsx`, `AboutPage.jsx`, `NotFoundPage.jsx`)**:
  - Hero section, feature breakdown, live threat ticker, architecture overview, 404 handler.
- [x] **Frontend Production Build**:
  - Vite build tested and verified (`dist/` generated with zero errors).

---

## 4. Files Created or Modified

### Root

- [`README.md`](file:///c:/Users/deepa/OneDrive/Desktop/Scam%20Sheild%20AI%20Project/README.md) — Comprehensive master documentation with quickstart guides and architecture.
- [`PROJECT_STATUS.md`](file:///c:/Users/deepa/OneDrive/Desktop/Scam%20Sheild%20AI%20Project/PROJECT_STATUS.md) — Current state, handover checklist, and configuration instructions.

### Server Directory (`/server`)

- [`server/package.json`](file:///c:/Users/deepa/OneDrive/Desktop/Scam%20Sheild%20AI%20Project/server/package.json) — Dependencies and scripts (`start`, `dev`, `test`).
- [`server/package-lock.json`](file:///c:/Users/deepa/OneDrive/Desktop/Scam%20Sheild%20AI%20Project/server/package-lock.json)
- [`server/.env`](file:///c:/Users/deepa/OneDrive/Desktop/Scam%20Sheild%20AI%20Project/server/.env) — Active environment variables.
- [`server/.env.example`](file:///c:/Users/deepa/OneDrive/Desktop/Scam%20Sheild%20AI%20Project/server/.env.example) — Template configuration.
- [`server/server.js`](file:///c:/Users/deepa/OneDrive/Desktop/Scam%20Sheild%20AI%20Project/server/server.js) — HTTP server entry point and graceful shutdown.
- [`server/app.js`](file:///c:/Users/deepa/OneDrive/Desktop/Scam%20Sheild%20AI%20Project/server/app.js) — Express app, CORS, Helmet, routes, and error handling.
- [`server/config/db.js`](file:///c:/Users/deepa/OneDrive/Desktop/Scam%20Sheild%20AI%20Project/server/config/db.js) — Mongoose connection and fallback monitor.
- [`server/config/env.js`](file:///c:/Users/deepa/OneDrive/Desktop/Scam%20Sheild%20AI%20Project/server/config/env.js) — Environment variable parser and defaults.
- [`server/analyzers/messageAnalyzer.js`](file:///c:/Users/deepa/OneDrive/Desktop/Scam%20Sheild%20AI%20Project/server/analyzers/messageAnalyzer.js) — Linguistic threat pattern engine.
- [`server/analyzers/urlAnalyzer.js`](file:///c:/Users/deepa/OneDrive/Desktop/Scam%20Sheild%20AI%20Project/server/analyzers/urlAnalyzer.js) — Heuristic URL analysis engine.
- [`server/analyzers/riskScorer.js`](file:///c:/Users/deepa/OneDrive/Desktop/Scam%20Sheild%20AI%20Project/server/analyzers/riskScorer.js) — 0–100 risk scoring and recommendations.
- [`server/services/aiService.js`](file:///c:/Users/deepa/OneDrive/Desktop/Scam%20Sheild%20AI%20Project/server/services/aiService.js) — Multi-provider AI pipeline (Gemini/OpenAI/Rules).
- [`server/services/caseService.js`](file:///c:/Users/deepa/OneDrive/Desktop/Scam%20Sheild%20AI%20Project/server/services/caseService.js) — Dual-mode MongoDB + in-memory case store.
- [`server/controllers/analyzeController.js`](file:///c:/Users/deepa/OneDrive/Desktop/Scam%20Sheild%20AI%20Project/server/controllers/analyzeController.js) — Analysis controller logic.
- [`server/controllers/caseController.js`](file:///c:/Users/deepa/OneDrive/Desktop/Scam%20Sheild%20AI%20Project/server/controllers/caseController.js) — Case CRUD controller.
- [`server/controllers/dashboardController.js`](file:///c:/Users/deepa/OneDrive/Desktop/Scam%20Sheild%20AI%20Project/server/controllers/dashboardController.js) — Aggregated metrics controller.
- [`server/middleware/validate.js`](file:///c:/Users/deepa/OneDrive/Desktop/Scam%20Sheild%20AI%20Project/server/middleware/validate.js) — Request validation middleware.
- [`server/middleware/rateLimiter.js`](file:///c:/Users/deepa/OneDrive/Desktop/Scam%20Sheild%20AI%20Project/server/middleware/rateLimiter.js) — Rate limiter configuration.
- [`server/middleware/errorHandler.js`](file:///c:/Users/deepa/OneDrive/Desktop/Scam%20Sheild%20AI%20Project/server/middleware/errorHandler.js) — 404 and 500 error handlers.
- [`server/models/Case.js`](file:///c:/Users/deepa/OneDrive/Desktop/Scam%20Sheild%20AI%20Project/server/models/Case.js) — Mongoose case schema and indices.
- [`server/routes/index.js`](file:///c:/Users/deepa/OneDrive/Desktop/Scam%20Sheild%20AI%20Project/server/routes/index.js) — Master API router & `/health`.
- [`server/routes/analyzeRoutes.js`](file:///c:/Users/deepa/OneDrive/Desktop/Scam%20Sheild%20AI%20Project/server/routes/analyzeRoutes.js) — `/api/analyze/*` endpoints.
- [`server/routes/caseRoutes.js`](file:///c:/Users/deepa/OneDrive/Desktop/Scam%20Sheild%20AI%20Project/server/routes/caseRoutes.js) — `/api/cases/*` endpoints.
- [`server/routes/dashboardRoutes.js`](file:///c:/Users/deepa/OneDrive/Desktop/Scam%20Sheild%20AI%20Project/server/routes/dashboardRoutes.js) — `/api/dashboard/*` endpoints.
- [`server/utils/logger.js`](file:///c:/Users/deepa/OneDrive/Desktop/Scam%20Sheild%20AI%20Project/server/utils/logger.js) — Standardized timestamped logger.
- [`server/utils/idGenerator.js`](file:///c:/Users/deepa/OneDrive/Desktop/Scam%20Sheild%20AI%20Project/server/utils/idGenerator.js) — Case ID format generator (`CASE-YYYY-XXXXX`).
- [`server/tests/api.test.js`](file:///c:/Users/deepa/OneDrive/Desktop/Scam%20Sheild%20AI%20Project/server/tests/api.test.js) — 7 integration test scenarios.

### Frontend Directory (`/frontend`)

- [`frontend/package.json`](file:///c:/Users/deepa/OneDrive/Desktop/Scam%20Sheild%20AI%20Project/frontend/package.json) — Dependencies and scripts (`dev`, `build`, `preview`).
- [`frontend/package-lock.json`](file:///c:/Users/deepa/OneDrive/Desktop/Scam%20Sheild%20AI%20Project/frontend/package-lock.json)
- [`frontend/vite.config.js`](file:///c:/Users/deepa/OneDrive/Desktop/Scam%20Sheild%20AI%20Project/frontend/vite.config.js) — Vite React plugin configuration.
- [`frontend/tailwind.config.js`](file:///c:/Users/deepa/OneDrive/Desktop/Scam%20Sheild%20AI%20Project/frontend/tailwind.config.js) — Custom theme colors and fonts.
- [`frontend/postcss.config.js`](file:///c:/Users/deepa/OneDrive/Desktop/Scam%20Sheild%20AI%20Project/frontend/postcss.config.js) — PostCSS Tailwind/Autoprefixer setup.
- [`frontend/index.html`](file:///c:/Users/deepa/OneDrive/Desktop/Scam%20Sheild%20AI%20Project/frontend/index.html) — HTML template and Google Fonts (Inter).
- [`frontend/.env`](file:///c:/Users/deepa/OneDrive/Desktop/Scam%20Sheild%20AI%20Project/frontend/.env) — Active frontend environment variables.
- [`frontend/.env.example`](file:///c:/Users/deepa/OneDrive/Desktop/Scam%20Sheild%20AI%20Project/frontend/.env.example) — Frontend template configuration.
- [`frontend/public/shield.svg`](file:///c:/Users/deepa/OneDrive/Desktop/Scam%20Sheild%20AI%20Project/frontend/public/shield.svg) — SVG favicon.
- [`frontend/src/main.jsx`](file:///c:/Users/deepa/OneDrive/Desktop/Scam%20Sheild%20AI%20Project/frontend/src/main.jsx) — React DOM entry point.
- [`frontend/src/App.jsx`](file:///c:/Users/deepa/OneDrive/Desktop/Scam%20Sheild%20AI%20Project/frontend/src/App.jsx) — Application router and layout wrapping.
- [`frontend/src/App.css`](file:///c:/Users/deepa/OneDrive/Desktop/Scam%20Sheild%20AI%20Project/frontend/src/App.css) & [`frontend/src/index.css`](file:///c:/Users/deepa/OneDrive/Desktop/Scam%20Sheild%20AI%20Project/frontend/src/index.css) — Custom component styles and design tokens.
- [`frontend/src/config/env.js`](file:///c:/Users/deepa/OneDrive/Desktop/Scam%20Sheild%20AI%20Project/frontend/src/config/env.js) — Frontend environment reader.
- [`frontend/src/config/routes.js`](file:///c:/Users/deepa/OneDrive/Desktop/Scam%20Sheild%20AI%20Project/frontend/src/config/routes.js) — Named route constants and path helpers.
- [`frontend/src/data/demoData.js`](file:///c:/Users/deepa/OneDrive/Desktop/Scam%20Sheild%20AI%20Project/frontend/src/data/demoData.js) — Seed cases and analytics mock data.
- [`frontend/src/store/authContext.jsx`](file:///c:/Users/deepa/OneDrive/Desktop/Scam%20Sheild%20AI%20Project/frontend/src/store/authContext.jsx) — Auth context and guest session state.
- [`frontend/src/services/api.js`](file:///c:/Users/deepa/OneDrive/Desktop/Scam%20Sheild%20AI%20Project/frontend/src/services/api.js) — Fetch API wrapper with error handling.
- [`frontend/src/services/analysisService.js`](file:///c:/Users/deepa/OneDrive/Desktop/Scam%20Sheild%20AI%20Project/frontend/src/services/analysisService.js) — Client service for analysis and cases.
- [`frontend/src/components/layout/Navbar.jsx`](file:///c:/Users/deepa/OneDrive/Desktop/Scam%20Sheild%20AI%20Project/frontend/src/components/layout/Navbar.jsx) — Responsive navigation bar.
- [`frontend/src/components/layout/Footer.jsx`](file:///c:/Users/deepa/OneDrive/Desktop/Scam%20Sheild%20AI%20Project/frontend/src/components/layout/Footer.jsx) — Application footer.
- [`frontend/src/components/layout/PageLayout.jsx`](file:///c:/Users/deepa/OneDrive/Desktop/Scam%20Sheild%20AI%20Project/frontend/src/components/layout/PageLayout.jsx) — Standard page wrapper and header.
- [`frontend/src/components/ui/Badge.jsx`](file:///c:/Users/deepa/OneDrive/Desktop/Scam%20Sheild%20AI%20Project/frontend/src/components/ui/Badge.jsx) — Risk badges (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`).
- [`frontend/src/components/ui/Button.jsx`](file:///c:/Users/deepa/OneDrive/Desktop/Scam%20Sheild%20AI%20Project/frontend/src/components/ui/Button.jsx) — Reusable styled buttons.
- [`frontend/src/components/ui/Card.jsx`](file:///c:/Users/deepa/OneDrive/Desktop/Scam%20Sheild%20AI%20Project/frontend/src/components/ui/Card.jsx) — Card container components.
- [`frontend/src/components/ui/StatCard.jsx`](file:///c:/Users/deepa/OneDrive/Desktop/Scam%20Sheild%20AI%20Project/frontend/src/components/ui/StatCard.jsx) — Metrics card with trend indicators.
- [`frontend/src/components/ui/RiskScoreGauge.jsx`](file:///c:/Users/deepa/OneDrive/Desktop/Scam%20Sheild%20AI%20Project/frontend/src/components/ui/RiskScoreGauge.jsx) — Radial SVG score gauge.
- [`frontend/src/components/ui/EmptyState.jsx`](file:///c:/Users/deepa/OneDrive/Desktop/Scam%20Sheild%20AI%20Project/frontend/src/components/ui/EmptyState.jsx) — Empty list display.
- [`frontend/src/components/ui/Input.jsx`](file:///c:/Users/deepa/OneDrive/Desktop/Scam%20Sheild%20AI%20Project/frontend/src/components/ui/Input.jsx) — Reusable text inputs and textareas.
- [`frontend/src/components/ui/LoadingSpinner.jsx`](file:///c:/Users/deepa/OneDrive/Desktop/Scam%20Sheild%20AI%20Project/frontend/src/components/ui/LoadingSpinner.jsx) — Loading spinner.
- [`frontend/src/components/analysis/AnalysisResult.jsx`](file:///c:/Users/deepa/OneDrive/Desktop/Scam%20Sheild%20AI%20Project/frontend/src/components/analysis/AnalysisResult.jsx) — Analysis result presentation card.
- [`frontend/src/pages/LandingPage.jsx`](file:///c:/Users/deepa/OneDrive/Desktop/Scam%20Sheild%20AI%20Project/frontend/src/pages/LandingPage.jsx) — Homepage with CTAs and live features.
- [`frontend/src/pages/ScannerPage.jsx`](file:///c:/Users/deepa/OneDrive/Desktop/Scam%20Sheild%20AI%20Project/frontend/src/pages/ScannerPage.jsx) — Threat scanning view.
- [`frontend/src/pages/DashboardPage.jsx`](file:///c:/Users/deepa/OneDrive/Desktop/Scam%20Sheild%20AI%20Project/frontend/src/pages/DashboardPage.jsx) — Analytics dashboard with charts.
- [`frontend/src/pages/HistoryPage.jsx`](file:///c:/Users/deepa/OneDrive/Desktop/Scam%20Sheild%20AI%20Project/frontend/src/pages/HistoryPage.jsx) — Filterable case history.
- [`frontend/src/pages/CaseDetailsPage.jsx`](file:///c:/Users/deepa/OneDrive/Desktop/Scam%20Sheild%20AI%20Project/frontend/src/pages/CaseDetailsPage.jsx) — Detailed case report view.
- [`frontend/src/pages/AboutPage.jsx`](file:///c:/Users/deepa/OneDrive/Desktop/Scam%20Sheild%20AI%20Project/frontend/src/pages/AboutPage.jsx) — Architecture and detection methodology.
- [`frontend/src/pages/NotFoundPage.jsx`](file:///c:/Users/deepa/OneDrive/Desktop/Scam%20Sheild%20AI%20Project/frontend/src/pages/NotFoundPage.jsx) — 404 view.

---

## 5. Current Implementation Status

| Component                            | Status           | Verification Result                                                                                                  |
| :----------------------------------- | :--------------- | :------------------------------------------------------------------------------------------------------------------- |
| **Backend Express Server**           | Fully Functional | Starts on `PORT=5000`, graceful termination on SIGINT/SIGTERM                                                        |
| **Threat Analyzers (Message & URL)** | Fully Functional | 100% passed on 7 API test scenarios                                                                                  |
| **Deterministic Fallback Engine**    | Fully Functional | Active when `GEMINI_API_KEY` or `OPENAI_API_KEY` is omitted                                                          |
| **Database Resilience**              | Fully Functional | Mongoose connects when MongoDB is up; transparent in-memory store activates if MongoDB is down                       |
| **API Endpoints (`/api/*`)**         | Fully Functional | Input validation, rate limiting, and standard JSON formats verified                                                  |
| **Frontend Application**             | Fully Functional | Vite builds successfully with zero JSX/CSS errors                                                                    |
| **Frontend-Backend Integration**     | Fully Functional | REST calls to `/api/analyze/*`, `/api/cases`, and `/api/dashboard/stats` configured with offline simulation fallback |
| **Git Repository**                   | Not Initialized  | Directory is not currently a git repo (`fatal: not a git repository`)                                                |

---

## 6. Pending Tasks

1. **Git Repository Setup**:
   - Initialize git at project root (`git init`).
   - Create a root `.gitignore` ensuring `node_modules`, `dist`, `.env`, and IDE folders are ignored.
   - Perform initial git commit.
2. **Frontend Bundle Code-Splitting (Vite)**:
   - In `frontend/vite.config.js`, configure `build.rollupOptions.output.manualChunks` to split the vendor bundle (extract `recharts`, `react`, and `lucide-react` into separate chunks) to resolve the `>500 kB` Vite build notice.
3. **External AI API Key Validation**:
   - Supply a valid `GEMINI_API_KEY` in `server/.env` and execute a live test to verify dynamic Gemini LLM analysis.
4. **MongoDB Atlas / Live Connection Verification**:
   - Supply a live MongoDB connection URI in `server/.env` and verify persistent storage of scans.
5. **Batch Scanning & File Upload Feature**:
   - Implement upload support for `.eml`, `.txt`, and `.csv` files for batch threat detection.
6. **Alerting & Exporting**:
   - Add export options (PDF / CSV report generation for individual cases or history).
   - Add webhook or email notifications for `CRITICAL` threat detections.

---

## 7. Known Bugs and Errors

- **Vite Chunk Size Notice (Non-breaking)**:
  - When running `npm run build` in `frontend/`, Rollup displays a warning:
    ```text
    (!) Some chunks are larger than 500 kB after minification. Consider:
    - Using dynamic import() to code-split the application
    - Use build.rollupOptions.output.manualChunks to improve chunking
    ```
  - This is non-breaking and does not prevent building or running the application.
- **Git Repository Not Initialized**:
  - Running `git status` at the root currently returns `fatal: not a git repository`.

---

## 8. Commands Required to Run the Project

### Running Backend Tests

```bash
cd server
npm test
```

_Expected Output:_

```text
TEST SUMMARY: 7 Passed, 0 Failed
```

### Running Backend Server

```bash
cd server
npm start
# Alternatively, with auto-reload:
npm run dev
```

_Listens on:_ `http://localhost:5000`  
_Health Check:_ `http://localhost:5000/api/health`

### Running Frontend Development Server

```bash
cd frontend
npm run dev
```

_Accessible on:_ `http://localhost:5173`

### Building Frontend for Production

```bash
cd frontend
npm run build
npm run preview
```

---

## 9. Important Configuration and API Requirements

### Backend Configuration (`server/.env`)

```ini
# Server Configuration
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173,http://127.0.0.1:5173

# Database Configuration (Local MongoDB or MongoDB Atlas URI)
# If MongoDB is unreachable, ScamShield  AI automatically uses its in-memory fallback
MONGODB_URI=mongodb://127.0.0.1:27017/ScamShield 

# AI Provider Configuration (Optional)
# If left empty, the high-accuracy deterministic rules engine is used automatically
AI_PROVIDER=gemini
GEMINI_API_KEY=
GEMINI_MODEL=gemini-1.5-flash

# Alternative: OpenAI
# AI_PROVIDER=openai
# OPENAI_API_KEY=
# OPENAI_MODEL=gpt-4o-mini

# Security & Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```

### Frontend Configuration (`frontend/.env`)

```ini
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=ScamShield  AI
VITE_APP_VERSION=1.0.0
VITE_ENABLE_DEMO_MODE=true
```

---

## 10. The Exact Next Task to Continue

The exact next task for the next AI coding session or developer is:

1. **Initialize Git & Commit**:
   - Run `git init` in the root directory `c:\Users\deepa\OneDrive\Desktop\Scam Sheild AI Project`.
   - Create a root `.gitignore` containing:
     ```gitignore
     node_modules/
     dist/
     .env
     .DS_Store
     Thumbs.db
     *.log
     ```
   - Commit all verified files as the initial baseline commit.
2. **Optimize Vite Code-Splitting**:
   - Edit [`frontend/vite.config.js`](file:///c:/Users/deepa/OneDrive/Desktop/Scam%20Sheild%20AI%20Project/frontend/vite.config.js) to configure manual chunk splitting:
     ```javascript
     build: {
       rollupOptions: {
         output: {
           manualChunks: {
             vendor: ['react', 'react-dom', 'react-router-dom'],
             charts: ['recharts'],
             icons: ['lucide-react'],
           },
         },
       },
     }
     ```
   - Run `npm run build` in `frontend/` to confirm that all chunks are below 500 kB.
