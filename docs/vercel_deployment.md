# 🚀 All-in-One Vercel Deployment & In-App Auto-Update Guide

This guide walks you through deploying the complete **SETU Ecosystem** (React Web Portal, Python Flask Backend with TARA Voice AI, and Citizen Android APK hosting) on a **single Vercel project** under one custom domain (`https://setu.vercel.app`).

---

## 🏗️ Architecture Overview

| Component | Technology | Path | Deployed As |
|---|---|---|---|
| **Web Portal** | React + Vite | `apps/web-portal/` | Static Web App on `/` |
| **Backend & Voice AI** | Flask + Gemini 3.5 + Sarvam | `api/index.py` & `backend/` | Serverless Python Function on `/api/...` |
| **Citizen Mobile App** | Flutter Android | `apps/citizen-app/` | Static APK Download on `/downloads/setu-citizen.apk` |

---

## 📋 Pre-Deployment Checklist

1. **Repository Root Configured**:
   - `vercel.json` (at root) configures automatic routing for `/api/(.*)` -> `api/index.py` and static SPA fallback.
   - `api/index.py` provides the WSGI entrypoint for Vercel's Python runtime.
   - `api/requirements.txt` and root `requirements.txt` contain lean, serverless-optimized dependencies (no heavy unused data-science libraries).
   - `apps/web-portal/public/downloads/setu-citizen.apk` contains the production Android release build.

---

## ⚙️ Step-by-Step Vercel Deployment Settings

### Step 1: Import Repository
1. Log in to [Vercel](https://vercel.com).
2. Click **Add New...** -> **Project**.
3. Select your `project_sih43` (or `setu`) GitHub repository.

### Step 2: Configure Project Settings
In the **Configure Project** screen on Vercel:

| Setting | Value | Notes |
|---|---|---|
| **Project Name** | `setu` (or your preferred name) | Determines your default URL: `https://setu.vercel.app` |
| **Framework Preset** | `Vite` (or `Other`) | Vercel will detect Vite automatically |
| **Root Directory** | `.` (Leave as Root / Default) | **Do NOT change to apps/web-portal** so Vercel can see both `apps/` and `api/`! |
| **Build Command** | `cd apps/web-portal && npm install && npm run build` | Overridden automatically by `vercel.json` |
| **Output Directory** | `apps/web-portal/dist` | Overridden automatically by `vercel.json` |

---

## 🔐 Environment Variables to Add on Vercel

In the Vercel **Environment Variables** section, add the following key-value pairs (select **Production**, **Preview**, and **Development**):

| Key | Value | Description |
|---|---|---|
| `GEMINI_API_KEY` | `your_gemini_api_key_here` | Google Gemini API key for TARA Voice AI |
| `GEMINI_MODEL` | `gemini-3.5-flash-lite` | Ultra-fast Gemini model for instant conversational response |
| `SARVAM_API_KEY` | `your_sarvam_api_key_here` | Sarvam AI API key for Saaras STT and Bulbul TTS |
| `SECRET_KEY` | `your_256bit_secret_key_here` | Cryptographically secure 256-bit Flask JWT & session secret |
| `CORS_ORIGINS` | `*` | Allows API calls from Web Portal and Citizen mobile app |
| `FLASK_ENV` | `production` | Enables production mode |
| `VITE_API_BASE_URL` | `/api/v1` | Relative API path for single-domain Vercel deployment |
| `LATEST_APP_VERSION`| `1.0.0` | Controls in-app update notifications |
| `LATEST_BUILD_NUMBER`| `1` | Controls build comparison |

```env
# Copy-pasteable into Vercel's "Paste .env" field:
FLASK_ENV=production
SECRET_KEY=your_256bit_secret_key_here
CORS_ORIGINS=*
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-3.5-flash-lite
SARVAM_API_KEY=your_sarvam_api_key_here
VITE_API_BASE_URL=/api/v1
LATEST_APP_VERSION=1.0.0
LATEST_BUILD_NUMBER=1
```
| `APK_DOWNLOAD_URL` | `/downloads/setu-citizen.apk` | Path or full URL to download the mobile app |

Click **Deploy**!

---

## 📱 How Users Download & Run the Mobile App

1. Visitors go to `https://your-domain.vercel.app`.
2. On the homepage, they click **"Download Setu APK (v1.0.0)"** or scan the QR code.
3. The browser downloads `setu-citizen.apk` directly.
4. When opened on their phone, Android prompts:
   > *"Do you want to install Setu?"*
5. Tap **Install** and open!

---

## 🔄 How the In-App Auto-Update Works

When you release a new version in the future:

1. In `apps/citizen-app/pubspec.yaml`, increment the version (e.g. `version: 1.0.1+2`).
2. Run `flutter build apk --release`.
3. Replace `apps/web-portal/public/downloads/setu-citizen.apk` with the new APK.
4. On Vercel (or in your backend env), update:
   - `LATEST_APP_VERSION` = `1.0.1`
   - `LATEST_BUILD_NUMBER` = `2`
   - `APP_RELEASE_NOTES` = `Fixed minor UI bugs and improved voice transcription speed.`
5. Commit and push to GitHub.
6. When citizens open their installed app, the app detects `1.0.0 < 1.0.1` and displays the **"Update Available"** sheet.
7. Tapping **Update Now** downloads the new version and updates the app seamlessly!

---

## 🛡️ Critical Precautions & Best Practices

1. **Keep `api/requirements.txt` Lean**:
   Vercel serverless functions have a 250 MB uncompressed limit. Keep only necessary libraries (`Flask`, `pydantic`, `requests`, `PyJWT`). Avoid committing large machine learning wheels like `scikit-learn` or `torch` to the Vercel function.
2. **Serverless Request Timeout**:
   Free Hobby tier has a 15s per-request limit. The voice pipeline (Saaras STT ~1.5s + Gemini ~1.5s + Bulbul TTS ~1.5s = ~4.5s) runs well within this limit, but keep spoken audio clips under 60 seconds per turn for optimal speed.
3. **Android Unknown Sources Permission**:
   When citizens download an APK from Chrome for the first time, Android will ask: *"Allow Chrome to install apps from this source?"* Users simply tap **Settings -> Allow**, and installation proceeds.
