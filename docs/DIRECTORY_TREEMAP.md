# 🌳 Project Directory Treemap & Architecture Layout
**Project: SETU - SIH PS 26043 (Unified Ecosystem)**

```text
SIH26043/
├── 🌐 api/                                # Vercel Serverless Function entrypoint
│   ├── index.py                           # WSGI bridge for Flask on Vercel
│   └── requirements.txt                   # Lean production dependencies for serverless
│
├── 💻 apps/
│   └── web-portal/                        # ⭐ 1 Unified React 18 + Vite Web Application
│       ├── public/
│       │   └── fonts/                     # Typography & brand assets
│       ├── src/
│       │   ├── components/
│       │   │   ├── common/                # Shared Navbar, Sidebar, Footer
│       │   │   └── ui/                    # Base UI buttons, badges, icons
│       │   ├── context/                   # React Contexts (AuthContext, ThemeContext)
│       │   ├── layouts/                   # LandingLayout, AuthLayout, DashboardLayout
│       │   ├── portals/                   # Role-Based Portals
│       │   │   ├── citizen/               # 📱 Citizen Hub (Mobile PWA & Desktop Reporting, TARA Voice AI)
│       │   │   ├── government/            # 🏛️ Government Portal (Review, University Allocation, Funding)
│       │   │   ├── university/            # 🎓 University Portal (SPOC Management & Student/Faculty Teams)
│       │   │   └── industry/              # 🏢 Industry & CSR Portal (Project Discovery, Funding, Mentorship)
│       │   ├── public-pages/              # Landing Page, Login, Register
│       │   ├── routes/                    # AppRoutes, ProtectedRoute, RoleGuard
│       │   ├── services/                  # API Client (Axios) & Auth Service
│       │   ├── App.jsx                    # Root App component with providers
│       │   ├── index.css                  # Global design tokens & CSS system
│       │   └── main.jsx                   # React DOM entrypoint
│       ├── .env.example                   # Frontend environment variables template
│       ├── index.html                     # HTML5 root template
│       ├── package.json                   # Web portal dependencies & Vite scripts
│       ├── vercel.json                    # Standalone SPA rewrite rules
│       └── vite.config.js                 # Vite bundler configuration
│
├── 🧠 backend/                            # Core Intelligence REST API (Python Flask)
│   ├── app/
│   │   ├── ai/                            # 5 Specialized AI/NLP Pipelines
│   │   │   ├── classifier.py              # Domain classifier (Agriculture, Health, Water, etc.)
│   │   │   ├── deduplicator.py            # Cosine semantic duplicate problem detector
│   │   │   ├── industry_matcher.py        # Industry CSR & technology alignment
│   │   │   ├── prioritizer.py             # Severity & community impact matrix
│   │   │   └── university_matcher.py      # University specialization & lab capability matcher
│   │   ├── middleware/                    # JWT Auth verification, RBAC, and error handlers
│   │   │   ├── auth.py                    # Token verification decorator
│   │   │   ├── error_handler.py           # Global JSON error responses
│   │   │   └── permissions.py             # Role-based route guard
│   │   ├── models/
│   │   │   └── schemas.py                 # Data validation schemas
│   │   ├── routes/                        # 11 REST API Route Blueprints
│   │   │   ├── analytics.py               # Aggregated government insights
│   │   │   ├── auth.py                    # Register, login, token refresh
│   │   │   ├── funding.py                 # Grants and CSR funds tracking
│   │   │   ├── government.py              # Problem review and department queue
│   │   │   ├── industry.py                # Industry partner discovery and proposals
│   │   │   ├── notifications.py           # In-app and stakeholder notifications
│   │   │   ├── problems.py                # Citizen grievance CRUD and AI ingestion
│   │   │   ├── projects.py                # University research & prototype tracking
│   │   │   ├── teams.py                   # Student/faculty team formation
│   │   │   ├── universities.py            # HEI profiles and institutional capabilities
│   │   │   ├── version.py                 # App versioning and healthcheck
│   │   │   └── voice_agent.py             # TARA AI multimodal voice conversation endpoints
│   │   ├── services/                      # Business logic layer
│   │   │   ├── funding_service.py         # Grant tracking logic
│   │   │   ├── gemini_service.py          # Google Gemini 3.5 LLM integration
│   │   │   ├── industry_service.py        # Industry collaboration management
│   │   │   ├── notification_service.py    # Multi-stakeholder alerts
│   │   │   ├── problem_service.py         # Problem ingestion and status pipeline
│   │   │   ├── project_service.py         # Project milestones and prototype logs
│   │   │   ├── routing_service.py         # Auto-routing problem statements
│   │   │   ├── sarvam_service.py          # Sarvam AI (Saaras STT & Bulbul TTS)
│   │   │   ├── university_service.py      # University data provider
│   │   │   └── voice_agent_service.py     # TARA stateful voice session manager
│   │   ├── utils/
│   │   │   └── helpers.py                 # Common utility functions
│   │   ├── config.py                      # Flask environment configuration
│   │   └── __init__.py                    # Flask application factory with CORS
│   ├── tests/
│   │   └── test_api.py                    # Backend unit & integration test suite
│   ├── .env.example                       # Backend secrets template
│   ├── Dockerfile                         # Container definition for containerized deployments
│   ├── pytest.ini                         # Pytest configuration
│   ├── requirements.txt                   # Flask & AI Python dependencies
│   └── run.py                             # Development server entrypoint
│
├── 📖 docs/                               # Comprehensive SIH Documentation Suite
│   ├── PROJECT_BLUEPRINT.md               # ⭐ Master Ecosystem Blueprint (Roles, Workflows & Phases)
│   ├── SIH_PROBLEM_STATEMENT.md           # 📋 Verbatim SIH PS 26043 details from portal
│   ├── DIRECTORY_TREEMAP.md               # 🌳 Full repository structure and file inventory
│   ├── architecture.md                    # System architecture & high-level data flow
│   ├── database.md                        # Firestore database schemas & entity relationships
│   ├── ai.md                              # NLP and ML matchmaking algorithms documentation
│   ├── authentication.md                  # JWT RBAC security and role permissions matrix
│   ├── deployment.md                      # Multi-target deployment instructions
│   ├── vercel_deployment.md               # Single-domain Vercel cloud deployment guide
│   └── product.md                         # Product requirements & user experience guidelines
│
├── 🔥 firebase/                           # Database & Storage Security
│   ├── firebase.json                      # Firebase configuration
│   ├── firestore.indexes.json             # Composite query indexes
│   ├── firestore.rules                    # Security rules for Firestore collections
│   └── storage.rules                      # Security rules for evidence media uploads
│
├── 🔄 shared/                             # Cross-Cutting Contracts & Constants
│   ├── api-contracts/
│   │   └── openapi.yaml                   # OpenAPI 3.0 specification for all REST endpoints
│   ├── constants/
│   │   ├── problem-categories.json        # Canonical thematic problem domains
│   │   ├── project-status.json            # State machine statuses
│   │   └── roles.json                     # Canonical user roles (CITIZEN, GOVT, UNIV, INDUSTRY)
│   └── documentation/
│       └── README.md                      # Shared module overview
│
├── .github/workflows/                     # CI/CD automation pipelines
├── docker-compose.yml                     # Multi-service local container runner
├── package.json                           # Root monorepo convenience scripts
├── pyproject.toml                         # Python project configuration
├── requirements.txt                       # Root Python dependencies for cloud runtimes
├── vercel.json                            # Root full-stack Vercel deployment configuration
├── .gitignore                             # Clean Git ignore file
└── README.md                              # Project overview & presentation portal
```
