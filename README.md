# 🇮🇳 SIH26043 - AI-Powered Citizen Grievance & Academic Innovation Ecosystem

[![Vercel Deployment](https://img.shields.io/badge/Vercel-Deployed-black?logo=vercel)](https://vercel.com)
[![Flutter](https://img.shields.io/badge/Flutter-Mobile_App-02569B?logo=flutter)](https://flutter.dev)
[![React](https://img.shields.io/badge/React-18_Vite-61DAFB?logo=react)](https://react.dev)
[![Flask](https://img.shields.io/badge/Flask-API_Backend-000000?logo=flask)](https://flask.palletsprojects.com)
[![Firebase](https://img.shields.io/badge/Firebase-Auth_&_DB-FFCA28?logo=firebase)](https://firebase.google.com)

A unified, multi-stakeholder ecosystem built for **Smart India Hackathon (SIH)** that bridges the gap between **Citizens**, **Government Bodies**, **Universities/Research Teams**, and **Industry/CSR Partners**.

---

## 🏛️ System Architecture

```mermaid
graph TD
    Citizen["📱 Citizen App (Flutter)"] -->|Report Grievance & Evidence| Backend["🧠 Flask AI Backend"]
    
    Backend -->|1. Auto Classifier| AI1["NLP Domain Classifier"]
    Backend -->|2. Deduplication| AI2["Deduplicator Engine"]
    Backend -->|3. Impact Scoring| AI3["Priority Matrix"]
    Backend -->|4. Skill Matchmaking| AI4["University & Industry Matcher"]
    
    AI1 & AI2 & AI3 & AI4 --> DB[("🔥 Cloud Firestore & DB")]
    
    WebPortal["🌐 Unified Web Portal (React + Vite)"] -->|Role-Based Access (JWT)| Backend
    
    subgraph Unified Web Experience
        WebPortal -->|Role: GOVERNMENT| Gov["🏛️ Government Portal\n(Review, Fund, Validate)"]
        WebPortal -->|Role: UNIVERSITY| Uni["🎓 University Portal\n(R&D, Teams, Solve)"]
        WebPortal -->|Role: INDUSTRY| Ind["🏢 Industry Portal\n(CSR Funding, Mentorship)"]
    end
```

---

## 📁 Repository Structure

```text
SIH26043/
├── apps/
│   ├── web-portal/          # ⭐ 1 Unified React Web App (Gov + Univ + Industry)
│   └── citizen-app/         # 📱 Flutter Mobile App for Citizens
├── backend/                 # 🧠 Flask API Backend with 5 AI Pipelines
├── shared/                  # 🔄 Shared OpenAPI specs & JSON Constants
├── firebase/                # 🔥 Firestore & Storage Security Rules
├── docs/                    # 📖 Full SIH Evaluation Documentation Suite
├── .github/workflows/       # ⚡ CI/CD Automation
├── docker-compose.yml       # 🐳 Multi-service Docker configuration
└── README.md
```

---

## 🚀 Quick Start Guide

### 1. Flask AI Backend Setup
```bash
cd backend
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
python run.py
```
*Backend runs on `http://localhost:5000`*

### 2. Unified Web Portal Setup
```bash
cd apps/web-portal
npm install
npm run dev
```
*Web Portal runs on `http://localhost:3000`*

### 3. Citizen Mobile App (Flutter)
```bash
cd apps/citizen-app
flutter pub get
flutter run
```

---

## ☁️ Deployment to Vercel (1-Click)

1. Connect this GitHub repository to [Vercel](https://vercel.com).
2. Set **Root Directory** to `apps/web-portal`.
3. Set Environment Variable: `VITE_API_BASE_URL` = your live backend URL.
4. Click **Deploy**.

---

## 👥 Roles & Access Matrix

| Role | Access URL | Capabilities |
| :--- | :--- | :--- |
| **Citizen** | Flutter Mobile App | Voice grievance reporting, geo-tagging, tracking |
| **Government** | `/government/dashboard` | Problem review, budget allocation, certificate issuance |
| **University** | `/university/dashboard` | Challenge adoption, team formation, research milestone submission |
| **Industry** | `/industry/dashboard` | CSR grant allocation, mentorship, technology adoption |

---

## 📜 Documentation Index
- 🏗️ [Architecture & Data Flow](file:///docs/architecture.md)
- 🗄️ [Database & Firestore Schema](file:///docs/database.md)
- 🤖 [AI & ML Matchmaking Algorithms](file:///docs/ai.md)
- 🔒 [Authentication & RBAC](file:///docs/authentication.md)
- 📡 [API Specification (OpenAPI)](file:///shared/api-contracts/openapi.yaml)
- 🚢 [Deployment Guide](file:///docs/deployment.md)
