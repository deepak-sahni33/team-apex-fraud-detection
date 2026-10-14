# ScamShield  AI

> **Detect. Explain. Protect.**  
> AI-Based Phishing, Scam Message & Malicious URL Detection Platform.

---

## 1. Project Overview

**ScamShield  AI** is an end-to-end cybersecurity SaaS application designed to detect, analyze, and explain phishing messages, deceptive emails, SMS scams, and malicious URLs. The platform provides:

- **Linguistic & Behavioral Threat Analysis**: Detects urgency manipulation, credential harvesting, brand impersonation, fake alerts, and social engineering patterns.
- **Deep URL & Hostname Heuristics**: Examines domain structures, punycode spoofing, IP-based hosts, excessive subdomains, brand typosquatting, non-standard ports, and open redirects.
- **Explainable Cybersecurity Risk Scoring**: Classifies threats into transparent tiers (0–24: Low, 25–49: Medium, 50–74: High, 75–100: Critical) with concrete evidence indicators and recommended safety actions.
- **AI Threat Pipeline with Resilient Fallback**: Seamlessly supports Google Gemini or OpenAI LLMs, with an automatic deterministic security rules engine fallback when no API key is present.
- **Security Analytics & Case History**: Stores threat cases, supports full-text search and filtering, and aggregates metrics for live security dashboards.

---

## 2. Technology Stack

### Frontend

- **Framework**: React 18 + Vite 5
- **Styling**: Tailwind CSS v3 (Custom cybersecurity SaaS theme)
- **Routing**: React Router v6
- **Data Visualization**: Recharts (Risk trends, daily distribution, threat categories)
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Utilities**: `clsx`, `tailwind-merge`, `date-fns`

### Backend

- **Runtime & Server**: Node.js + Express.js (ES Modules)
- **Database**: MongoDB with Mongoose ODM
- **Resilience**: In-Memory Storage Fallback (zero-crash execution when MongoDB is not yet running)
- **AI Abstraction**: Google Gemini REST API / OpenAI REST API / Deterministic Cybersecurity Engine
- **Security**: Helmet, CORS origin allowlisting, Express Rate Limiter, Input Sanitization & Validation

---

## 3. Architecture & Project Structure

```
Scam Sheild AI Project/
├── README.md                           # Master project documentation
│
├── frontend/                           # React + Vite Frontend
│   ├── public/
│   │   └── shield.svg                  # Application favicon
│   ├── src/
│   │   ├── config/
│   │   │   ├── env.js                  # Frontend environment variables
│   │   │   └── routes.js               # Route paths constants
│   │   ├── services/
│   │   │   ├── api.js                  # Fetch wrapper with error handling
│   │   │   └── analysisService.js      # REST API client for analysis & cases
│   │   ├── store/
│   │   │   └── authContext.jsx         # Auth state context
│   │   ├── data/
│   │   │   └── demoData.js             # Initial demo dataset
│   │   ├── components/
│   │   │   ├── layout/                 # Navbar, Footer, PageLayout
│   │   │   ├── ui/                     # Badge, Button, Card, StatCard, Gauge
│   │   │   └── analysis/               # AnalysisResult card
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx         # Product overview & CTAs
│   │   │   ├── ScannerPage.jsx         # Message & URL threat scanner
│   │   │   ├── DashboardPage.jsx       # Security analytics & charts
│   │   │   ├── HistoryPage.jsx         # Searchable case history table
│   │   │   ├── CaseDetailsPage.jsx     # Deep dive into individual scan records
│   │   │   ├── AboutPage.jsx           # Technical architecture & methodology
│   │   │   └── NotFoundPage.jsx        # 404 handler
│   │   ├── App.jsx                     # Top-level routing
│   │   └── main.jsx                    # React entry point
│   ├── .env                            # Active frontend environment variables
│   └── package.json
│
└── server/                             # Node.js + Express Backend
    ├── config/
    │   ├── db.js                       # Mongoose connection & fallback monitor
    │   └── env.js                      # Environment configuration parser
    ├── analyzers/
    │   ├── messageAnalyzer.js          # Linguistic & scam pattern matcher
    │   ├── urlAnalyzer.js              # Heuristic URL & hostname analyzer
    │   └── riskScorer.js               # Explainable 0-100 risk score engine
    ├── services/
    │   ├── aiService.js                # AI provider abstraction (Gemini / OpenAI / Fallback)
    │   └── caseService.js              # Case persistence (MongoDB + in-memory store)
    ├── controllers/
    │   ├── analyzeController.js        # /api/analyze/message & /api/analyze/url
    │   ├── caseController.js           # /api/cases CRUD operations
    │   └── dashboardController.js      # /api/dashboard/stats aggregation
    ├── middleware/
    │   ├── validate.js                 # Input validation & sanitization
    │   ├── rateLimiter.js              # Express rate limiting
    │   └── errorHandler.js             # Centralized error handler
    ├── models/
    │   └── Case.js                     # Mongoose schema for threat cases
    ├── routes/
    │   ├── analyzeRoutes.js            # Threat scanning routes
    │   ├── caseRoutes.js               # Case repository routes
    │   ├── dashboardRoutes.js          # Metrics routes
    │   └── index.js                    # Master API router & /health endpoint
    ├── tests/
    │   └── api.test.js                 # Automated API test suite (7 scenarios)
    ├── app.js                          # Express application configuration
    ├── server.js                       # HTTP server entry point
    ├── .env                            # Active backend environment variables
    ├── .env.example                    # Backend environment template
    └── package.json
```

---

## 4. Environment Variables

### Backend (`server/.env`)

```ini
# Server Configuration
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173,http://127.0.0.1:5173

# Database Configuration (Local MongoDB or MongoDB Atlas URI)
MONGODB_URI=mongodb://127.0.0.1:27017/ScamShield 

# AI Provider Configuration (Optional)
# Leave blank to use the high-accuracy deterministic rules engine
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

### Frontend (`frontend/.env`)

```ini
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=ScamShield  AI
VITE_APP_VERSION=1.0.0
VITE_ENABLE_DEMO_MODE=true
```

---

## 5. Quickstart & Installation

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- _(Optional)_ **MongoDB**: Local MongoDB instance or free MongoDB Atlas cloud cluster.

### Step 1: Install Backend & Run Tests

```bash
cd server
npm install
npm test
```

### Step 2: Start the Backend Server

```bash
npm start
# Server listens at: http://localhost:5000
# Health check: http://localhost:5000/api/health
```

### Step 3: Start the Frontend Application

In a separate terminal window:

```bash
cd frontend
npm install
npm run dev
# Application accessible at: http://localhost:5173
```

---

## 6. MongoDB Setup & Resilient Storage

ScamShield  AI is engineered with database resilience:

1. **With Local MongoDB / MongoDB Atlas**:
   - Provide a connection URI in `server/.env`:
     ```ini
     MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/ScamShield 
     ```
   - All threat records, risk stats, and dashboard queries persist in MongoDB collections via Mongoose.
2. **Without MongoDB (Zero-Crash Fallback)**:
   - If MongoDB is unavailable or unreachable on startup, ScamShield  AI logs a warning and automatically activates an **in-memory thread-safe store**.
   - Scanning, case saving, searching, and dashboard stats continue functioning without 500 errors.

---

## 7. AI Provider Setup & Fallback Mode

ScamShield  AI features a decoupled AI abstraction layer (`server/services/aiService.js`):

- **Gemini Mode**: Add your Google Gemini API key to `GEMINI_API_KEY` in `server/.env`.
- **OpenAI Mode**: Set `AI_PROVIDER=openai` and specify `OPENAI_API_KEY` and `OPENAI_MODEL=gpt-4o-mini`.
- **Deterministic Rules Mode (Fallback)**: If no API key is specified, or if network connectivity to the LLM is interrupted, ScamShield  AI transparently uses its **deterministic pattern recognition engine**:
  - Message analyzer scans for 14+ distinct threat vectors (urgency, OTP extortion, account suspension, brand spoofing, KYC fraud).
  - URL analyzer evaluates 11+ structural and heuristic flags (IP hostnames, punycode, TLDs, keyword stacking, open redirects).
  - The API clearly labels the response with `engineMode: "rule-based-fallback"` to guarantee transparent cybersecurity reporting.

---

## 8. REST API Reference

All routes are prefixed with `/api`.

| Method   | Endpoint               | Description                                                       | Status Codes       |
| -------- | ---------------------- | ----------------------------------------------------------------- | ------------------ |
| `GET`    | `/api/health`          | Service health, uptime, MongoDB & AI status                       | 200                |
| `POST`   | `/api/analyze/message` | Scans text message for scam & phishing patterns                   | 200, 400, 429, 500 |
| `POST`   | `/api/analyze/url`     | Evaluates URL structure & deceptive indicators                    | 200, 400, 429, 500 |
| `GET`    | `/api/cases`           | Retrieves paginated cases (`search`, `riskLevel`, `analysisType`) | 200, 500           |
| `GET`    | `/api/cases/:id`       | Retrieves full case report by Case ID                             | 200, 404, 500      |
| `DELETE` | `/api/cases/:id`       | Deletes a case from the threat database                           | 200, 404, 500      |
| `GET`    | `/api/dashboard/stats` | Aggregated threat counts, detection rate, trends                  | 200, 500           |

### Sample Response: `POST /api/analyze/message`

```json
{
  "success": true,
  "data": {
    "caseId": "CASE-2026-F4B2A",
    "riskScore": 87,
    "riskLevel": "CRITICAL",
    "threatCategory": "Credential / OTP Phishing",
    "confidence": 92,
    "indicators": [
      "Urgency manipulation tactics detected (pressuring victim for immediate response).",
      "Account suspension or security alert claim detected (typical social engineering pretext).",
      "Direct credential harvesting or login verification solicitation identified.",
      "Embedded hyperlink or shortened redirect URL identified in message body."
    ],
    "explanation": "Analysis identified 4 potential risk indicator(s). Key factors include: Urgency Manipulation, Account Suspension & Alert, Credential / Password Request. Potential phishing indicators detected. Exercise appropriate caution.",
    "recommendedAction": "Do not respond, click links, or provide any credentials. Block the sender immediately and report the message to IT/security.",
    "analysisType": "message",
    "originalInput": "URGENT: Your account has been suspended! Verify password immediately: http://fake-login.xyz",
    "engineMode": "rule-based-fallback",
    "processingTimeMs": 3,
    "createdAt": "2026-10-08T13:57:54.295Z"
  }
}
```

---

## 9. Security Considerations

- **No Hardcoded Secrets**: All keys, ports, and origins are managed through `.env` configurations.
- **Input Validation & Sanitization**: Strict validation on payload types, string length caps (5,000 characters), and URL structure checks.
- **Information Leakage Prevention**: Stack traces and raw internal error details are suppressed from client responses in production.
- **Rate Limiting**: Analysis endpoints are protected by an express rate limiter to mitigate denial-of-service attempts.
- **Objective Cybersecurity Terminology**: Threat reports use explainable, risk-oriented classifications without unsubstantiated claims.
