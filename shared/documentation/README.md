# 🔄 Shared Module Overview

This directory contains cross-cutting resources shared between:
1. `apps/web-portal/` (Unified React Application)
2. `apps/citizen-app/` (Flutter Mobile Application)
3. `backend/` (Flask API & AI Pipelines)

### Subdirectories:
- `constants/`: JSON files containing canonical roles, problem categories, ministry mappings, and lifecycle status definitions.
- `api-contracts/`: OpenAPI 3.0 specs to ensure zero contract mismatch between frontend and backend.
