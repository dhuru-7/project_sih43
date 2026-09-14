import os
import sys
import json
import base64
import re
import sqlite3
import tempfile
from datetime import datetime
from flask import Flask, jsonify, request
from flask_cors import CORS
import requests

# Ensure backend and repository root directories are in Python sys.path
current_dir = os.path.dirname(os.path.abspath(__file__))
repo_root = os.path.abspath(os.path.join(current_dir, ".."))
backend_dir = os.path.join(repo_root, "backend")

for p in [backend_dir, repo_root]:
    if p not in sys.path:
        sys.path.insert(0, p)

SARVAM_API_KEY = os.getenv("SARVAM_API_KEY", "sk_4epvscwg_NfXygGdgX2p496s19l0VhjQP")
SARVAM_STT_URL = "https://api.sarvam.ai/speech-to-text"
SARVAM_CHAT_URL = "https://api.sarvam.ai/v1/chat/completions"

OFFICIAL_CATEGORIES = [
    "Education",
    "Healthcare",
    "Agriculture",
    "Water Resources",
    "Environment",
    "Energy",
    "Urban Development and Infrastructure",
    "Accessibility and Inclusion",
    "Public Administration and Governance",
    "Rural Livelihoods and Development",
    "Disaster Management",
    "Transportation and Mobility",
    "Sanitation and Waste Management",
    "Employment and Entrepreneurship",
    "Housing and Community",
    "Public Safety and Security",
    "Cyber Security"
]

def create_standalone_app():
    """
    Self-contained serverless Flask app for Vercel deployment.
    Provides Sarvam Saaras v3 STT, Sarvam 105B reasoning, and SQLite problems storage.
    """
    app = Flask(__name__)
    CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)

    db_path = os.path.join(tempfile.gettempdir(), "setu_problems.db")

    def get_db():
        conn = sqlite3.connect(db_path)
        conn.row_factory = sqlite3.Row
        return conn

    def init_db():
        try:
            with get_db() as conn:
                conn.execute("""
                    CREATE TABLE IF NOT EXISTS problems (
                        id TEXT PRIMARY KEY,
                        title TEXT NOT NULL,
                        description TEXT NOT NULL,
                        category TEXT,
                        department TEXT,
                        severity TEXT,
                        score REAL,
                        status TEXT,
                        impact_count TEXT,
                        impact_description TEXT,
                        reporter_type TEXT,
                        group_name TEXT,
                        author TEXT,
                        author_id TEXT,
                        address TEXT,
                        village_city TEXT,
                        subdistrict TEXT,
                        district TEXT,
                        state TEXT,
                        pincode TEXT,
                        latitude REAL,
                        longitude REAL,
                        thumbnail TEXT,
                        evidence_urls TEXT,
                        upvotes INTEGER DEFAULT 1,
                        safety_status TEXT DEFAULT 'SAFE',
                        raw_transcripts TEXT,
                        created_at TEXT,
                        updated_at TEXT
                    )
                """)
                conn.commit()
        except Exception as e:
            print(f"init_db warning: {e}")

    init_db()

    @app.route("/api/health", methods=["GET"])
    def health():
        return jsonify({
            "status": "healthy",
            "service": "SETU Vercel Serverless API",
            "version": "1.0.0"
        }), 200

    @app.route("/api/v1/voice/transcribe", methods=["POST"])
    def transcribe():
        audio_bytes = None
        filename = "audio.wav"
        mime_type = "audio/wav"

        if "audio" in request.files or "file" in request.files:
            f = request.files.get("audio") or request.files.get("file")
            audio_bytes = f.read()
            filename = f.filename or "audio.wav"
            mime_type = f.mimetype or "audio/wav"
        else:
            data = request.get_json(silent=True) or {}
            raw_b64 = data.get("audio_base64") or data.get("audio")
            if raw_b64:
                if "," in raw_b64:
                    raw_b64 = raw_b64.split(",", 1)[1]
                try:
                    audio_bytes = base64.b64decode(raw_b64)
                except Exception:
                    pass

        if not audio_bytes or len(audio_bytes) < 400:
            return jsonify({
                "status": "success",
                "data": {
                    "transcript": "",
                    "language": "hi-IN",
                    "warning": "Empty or inaudible audio clip."
                }
            }), 200

        if "mp4" in mime_type.lower() or "video" in mime_type.lower():
            mime_type = "audio/wav"

        try:
            resp = requests.post(
                SARVAM_STT_URL,
                headers={"api-subscription-key": SARVAM_API_KEY},
                files={"file": (filename, audio_bytes, mime_type)},
                data={"model": "saaras:v3", "language_code": "unknown"},
                timeout=25
            )
            if resp.status_code == 200:
                res_json = resp.json()
                transcript = (res_json.get("transcript") or "").strip()
                lang = res_json.get("language_code") or "hi-IN"
                return jsonify({
                    "status": "success",
                    "data": {
                        "transcript": transcript,
                        "language": lang
                    }
                }), 200
            else:
                print(f"Sarvam STT returned {resp.status_code}: {resp.text}")
        except Exception as e:
            print(f"Sarvam STT call error: {e}")

        return jsonify({
            "status": "success",
            "data": {
                "transcript": "",
                "language": "hi-IN",
                "warning": "Audio could not be transcribed."
            }
        }), 200

    @app.route("/api/v1/voice/describe-issue", methods=["POST"])
    def describe_issue():
        data = request.get_json(silent=True) or {}
        text = (data.get("text") or "").strip()
        video_transcript = (data.get("videoTranscript") or "").strip()
        voice_transcript = (data.get("voiceTranscript") or "").strip()
        location = data.get("locationInfo") or {}
        reporter_type = data.get("reporterType") or "Individual Citizen"
        group_name = data.get("groupName") or ""

        cats_str = ", ".join([f"'{c}'" for c in OFFICIAL_CATEGORIES])
        system_prompt = (
            "You are TARA, the AI Civic Intelligence Engine for SETU (India National Citizen Grievance & Innovation Platform).\n"
            "A citizen has reported a civic problem using spoken video, voice note, or written text.\n"
            "Synthesize this into an authentic, actionable citizen grievance report.\n"
            "CRITICAL REQUIREMENT FOR DESCRIPTION: Write the 'description' in the FIRST PERSON from the perspective of the reporting citizen themselves (e.g. 'I am reporting an urgent issue...', 'In our street...').\n"
            "NEVER use third-person bureaucratic phrasing like 'A grievance was reported by Individual Citizen'.\n"
            "Highlight the exact street name, nearby landmark, time/duration, core problem, and impact.\n"
            "Format the description with an opening statement, followed by structured bullet details:\n"
            "• Street / Landmark: [name]\n"
            "• Time / Duration: [time]\n"
            "• Specific Issue: [problem]\n"
            "• Impact: [who is affected]\n"
            "and end with a polite request for municipal action.\n"
            "Respond with ONLY valid JSON (no markdown fences) containing these exact keys:\n"
            "'title' (direct, under 10 words, stating problem and area),\n"
            "'description' (the first-person structured description),\n"
            f"'category' (MUST be exactly one of: {cats_str}),\n"
            "'severity' (MUST be one of: 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'),\n"
            "'impact_count' (e.g. '100-250 local residents'),\n"
            "'impact_description' (1-2 sentences on who is affected),\n"
            "'department' (appropriate municipal department),\n"
            f"'reporter_type' ('{reporter_type}')."
        )

        user_parts = []
        if video_transcript:
            user_parts.append(f"Spoken by citizen in video: '{video_transcript}'")
        if voice_transcript:
            user_parts.append(f"Spoken by citizen in voice note: '{voice_transcript}'")
        if text:
            user_parts.append(f"Written notes: '{text}'")
        if not user_parts:
            user_parts.append("Visual civic issue reported with attached evidence.")

        loc_str = location.get("formatted") or location.get("villageCity") or ""
        if loc_str:
            user_parts.append(f"Location: {loc_str}")
        if group_name:
            user_parts.append(f"Organization: {group_name}")

        user_message = "\n".join(user_parts)

        try:
            resp = requests.post(
                SARVAM_CHAT_URL,
                headers={
                    "api-subscription-key": SARVAM_API_KEY,
                    "Content-Type": "application/json"
                },
                json={
                    "model": "sarvam-105b-conversations",
                    "messages": [
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_message}
                    ],
                    "max_tokens": 550,
                    "temperature": 0.2
                },
                timeout=25
            )

            if resp.status_code == 200:
                res_json = resp.json()
                raw_content = res_json.get("choices", [{}])[0].get("message", {}).get("content", "").strip()
                if raw_content.startswith("```"):
                    raw_content = raw_content.split("\n", 1)[-1]
                if raw_content.endswith("```"):
                    raw_content = raw_content.rsplit("\n", 1)[0]
                raw_content = raw_content.replace("```json", "").replace("```", "").strip()

                match = re.search(r"\{.*\}", raw_content, re.DOTALL)
                if match:
                    raw_content = match.group(0)

                parsed = json.loads(raw_content, strict=False)

                cat = parsed.get("category", "")
                matched_cat = "Urban Development and Infrastructure"
                for official in OFFICIAL_CATEGORIES:
                    if official.lower() in cat.lower() or cat.lower() in official.lower():
                        matched_cat = official
                        break

                sev = str(parsed.get("severity", "MEDIUM")).upper().strip()
                if sev not in ["LOW", "MEDIUM", "HIGH", "CRITICAL"]:
                    sev = "MEDIUM"

                return jsonify({
                    "status": "success",
                    "data": {
                        "title": parsed.get("title", "Civic Issue Needs Inspection"),
                        "description": parsed.get("description", user_message),
                        "category": matched_cat,
                        "severity": sev,
                        "impactCount": str(parsed.get("impact_count", "100-250 local residents")),
                        "impactDescription": str(parsed.get("impact_description", "Disruption reported by local residents.")),
                        "department": parsed.get("department", "Municipal Corporation"),
                        "reporterType": reporter_type,
                        "groupName": group_name,
                        "language": "hi-IN"
                    }
                }), 200
        except Exception as e:
            print(f"Sarvam 105B synthesis error: {e}")

        # Fallback to structured response based on user input
        address = location.get("formatted") or location.get("villageCity") or "Local Area"
        core_issue = video_transcript or voice_transcript or text or "civic problem requiring municipal attention"
        return jsonify({
            "status": "success",
            "data": {
                "title": core_issue[:45] + "..." if len(core_issue) > 45 else core_issue.capitalize(),
                "description": (
                    f"I am reporting an urgent civic problem at {address}. {core_issue}\n\n"
                    f"Details:\n"
                    f"• Street / Landmark: {address}\n"
                    f"• Time / Duration: Reported today\n"
                    f"• Specific Issue: {core_issue}\n"
                    f"• Impact: Disruption of public movement and safety hazard for nearby residents.\n\n"
                    f"Requesting the concerned departmental authorities to inspect the site and resolve this issue promptly."
                ),
                "category": "Urban Development and Infrastructure",
                "severity": "MEDIUM",
                "impactCount": "100-250 local residents",
                "impactDescription": f"Public safety and daily convenience disruption reported near {address}.",
                "department": "Municipal Corporation",
                "reporterType": reporter_type,
                "groupName": group_name,
                "language": "hi-IN"
            }
        }), 200

    @app.route("/api/v1/problems", methods=["GET", "POST"])
    def problems():
        if request.method == "POST":
            data = request.get_json(silent=True) or {}
            prob_id = f"SETU-{os.urandom(3).hex().upper()}"
            now = datetime.now().isoformat()
            try:
                with get_db() as conn:
                    conn.execute("""
                        INSERT INTO problems (
                            id, title, description, category, department, severity,
                            status, impact_count, impact_description, reporter_type,
                            group_name, author, address, village_city, district,
                            state, pincode, thumbnail, safety_status, created_at, updated_at
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    """, (
                        prob_id,
                        data.get("title", "Civic Problem"),
                        data.get("description", ""),
                        data.get("category", "Urban Development and Infrastructure"),
                        data.get("department", "Municipal Corporation"),
                        data.get("severity", "MEDIUM"),
                        "SUBMITTED",
                        data.get("impactCount", "100-250 residents"),
                        data.get("impactDescription", ""),
                        data.get("reporterType", "Individual Citizen"),
                        data.get("groupName", ""),
                        data.get("author", "Citizen"),
                        data.get("locationDetails", {}).get("formatted", ""),
                        data.get("locationDetails", {}).get("villageCity", ""),
                        data.get("locationDetails", {}).get("district", ""),
                        data.get("locationDetails", {}).get("state", "Jharkhand"),
                        data.get("locationDetails", {}).get("pincode", ""),
                        data.get("thumbnail", ""),
                        data.get("safetyStatus", "SAFE"),
                        now,
                        now
                    ))
                    conn.commit()
            except Exception as e:
                print(f"Error saving problem: {e}")

            return jsonify({
                "status": "success",
                "message": "Problem submitted successfully",
                "data": {
                    "id": prob_id,
                    "title": data.get("title"),
                    "status": "SUBMITTED",
                    "createdAt": now
                }
            }), 201

        # GET problems
        try:
            with get_db() as conn:
                rows = conn.execute("SELECT * FROM problems ORDER BY created_at DESC LIMIT 50").fetchall()
                problems_list = [dict(r) for r in rows]
                if problems_list:
                    return jsonify({
                        "status": "success",
                        "count": len(problems_list),
                        "data": problems_list
                    }), 200
        except Exception as e:
            print(f"Error fetching problems: {e}")

        return jsonify({"status": "success", "count": 0, "data": []}), 200

    return app

# WSGI application entry point for Vercel
try:
    from app import create_app
    app = create_app(os.getenv("FLASK_ENV", "production"))
except Exception as exc:
    print(f"Standard backend loading failed ({exc}); running standalone serverless app...")
    app = create_standalone_app()
