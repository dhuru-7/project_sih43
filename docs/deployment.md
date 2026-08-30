# 🚀 Multi-Target Deployment Guide

## 1. Unified React Web Portal on Vercel
1. Import repository on [Vercel](https://vercel.com).
2. Set Root Directory: `apps/web-portal`.
3. Set Framework: `Vite`.
4. Configure Environment Variable:
   - `VITE_API_BASE_URL` = `https://your-backend-url.onrender.com/api/v1`
5. Deploy.

## 2. Flask API Backend on Render / Railway
1. Create a new Web Service pointing to `./backend`.
2. Build Command: `pip install -r requirements.txt`
3. Start Command: `gunicorn run:app`
4. Set Environment Variables:
   - `SECRET_KEY` = `your_production_secret`
   - `CORS_ORIGINS` = `https://your-vercel-domain.vercel.app`

## 3. Flutter Mobile App (Android APK)
```bash
cd apps/citizen-app
flutter build apk --release
```
Locate the generated `.apk` in `build/app/outputs/flutter-apk/app-release.apk`.
