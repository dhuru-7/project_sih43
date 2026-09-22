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
    CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

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

    @app.route("/", methods=["GET"])
    @app.route("/api", methods=["GET"])
    @app.route("/health", methods=["GET"])
    @app.route("/api/health", methods=["GET"])
    def health():
        return jsonify({
            "status": "healthy",
            "service": "SETU Vercel Serverless API",
            "version": "1.0.0"
        }), 200

    @app.route("/voice/transcribe", methods=["POST"])
    @app.route("/api/voice/transcribe", methods=["POST"])
    @app.route("/v1/voice/transcribe", methods=["POST"])
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

    @app.route("/voice/describe-issue", methods=["POST"])
    @app.route("/api/voice/describe-issue", methods=["POST"])
    @app.route("/v1/voice/describe-issue", methods=["POST"])
    @app.route("/api/v1/voice/describe-issue", methods=["POST"])
    def describe_issue():
        data = request.get_json(silent=True) or {}
        text = (data.get("text") or "").strip()
        video_transcript = (data.get("videoTranscript") or "").strip()
        voice_transcript = (data.get("voiceTranscript") or "").strip()
        location = data.get("locationInfo") or {}
        reporter_type = data.get("reporterType") or "Individual Citizen"
        group_name = data.get("groupName") or ""
        core_issue = video_transcript or voice_transcript or text or "Observed physical issue documented via on-site evidence."

        cats_str = ", ".join([f"'{c}'" for c in OFFICIAL_CATEGORIES])
        system_prompt = (
            "You are TARA, the AI Civic Intelligence Engine for SETU.\n"
            "A citizen has reported a real-world problem using photos, video frames, voice notes, or text.\n"
            "Analyze the input and synthesize an evidence-grounded, structured problem report.\n\n"
            "CRITICAL PHILOSOPHY & EVIDENCE RULES:\n"
            "1. Setu connects problems to appropriate stakeholders, government bodies, and potential academic/industry research collaborators. "
            "Do NOT assume every issue is a municipal complaint. Do NOT state that the municipality will resolve it or is responsible.\n"
            "2. TITLE: Direct, factual, and problem-focused (under 10 words). Describe WHAT the problem is (e.g. 'Tangled Overhead Utility Wires', 'Waterlogging on Road', 'Damaged Road Surface', 'Uncollected Waste Accumulation', 'Broken Streetlight', 'Blocked Drainage'). "
            "NEVER use titles like 'Complaint Against Municipality', 'Urgent Civic Grievance', 'Societal Challenge: Utility', or 'Request for Municipal Intervention'.\n"
            "3. DESCRIPTION: Factual, concise, and neutral. Describe the observed problem directly from a problem perspective. "
            "DO NOT use first-person complaint letters (NO 'I am reporting...', NO 'In our locality...', NO 'I kindly request the municipal authority...', NO 'Please resolve...', NO 'The concerned authority must...'). "
            "DO NOT invent unverified hazards or assumptions: never state 'risk of electrocution', 'live electrical wires', 'illegal wiring', or 'imminent catastrophe' unless directly proven by evidence. "
            "When inferring potential consequences, always use qualified phrasing ('potential', 'may', or 'appears').\n"
            "4. POTENTIAL IMPACT: Provide a list of 2-4 concise, evidence-supported or qualified bullet points (e.g. ['Difficult inspection and maintenance', 'Potential safety concern for nearby residents and workers', 'Visual and infrastructure clutter', 'Possible obstruction around nearby structures']). "
            "NEVER invent numbers of affected people (no fake '50-100 residents at risk of electrocution'), deaths, injuries, or financial loss.\n"
            "5. SEVERITY vs URGENCY: Keep them separate. "
            "- severity: Potential physical seriousness of the issue ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL'). "
            "- urgency: How quickly operational attention may be needed ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL'). Do not mark high urgency merely because the citizen used dramatic words like 'urgent'.\n"
            "6. AI OBSERVATIONS: "
            "- observed: List of 2-3 directly visible or verified physical facts. "
            "- potential_inference: 1-2 reasonable, qualified conclusions using 'may', 'appears', or 'potential'.\n"
            "7. SUGGESTED ROUTING: "
            "- stakeholders: Domain-relevant authority or entity (e.g. 'Relevant utility / infrastructure stakeholders', 'Urban infrastructure / roads authority', 'Sanitation / local body', 'Water supply & drainage board'). Do NOT default to municipality. "
            "- collaboration_potential: Potential opportunity for university, engineering, or industry collaboration (e.g. 'Potential opportunity for university/engineering teams to explore safer cable organization and infrastructure management solutions.').\n\n"
            "Respond with ONLY valid JSON (no markdown fences) containing these exact keys:\n"
            "{\n"
            '  "title": "Factual problem title",\n'
            f'  "category": "Exactly one of: {cats_str}",\n'
            '  "subcategory": "Subcategory name (e.g. Utility Infrastructure)",\n'
            '  "issue_type": "Specific issue type (e.g. Unmanaged Overhead Cabling)",\n'
            '  "severity": "LOW | MEDIUM | HIGH | CRITICAL",\n'
            '  "urgency": "LOW | MEDIUM | HIGH | CRITICAL",\n'
            '  "description": "Factual neutral description without complaint letter phrasing",\n'
            '  "potential_impact": ["Impact point 1", "Impact point 2"],\n'
            '  "ai_observations": {\n'
            '    "observed": ["Observed physical detail 1", "Observed physical detail 2"],\n'
            '    "potential_inference": ["Qualified inference 1"]\n'
            '  },\n'
            '  "suggested_routing": {\n'
            '    "stakeholders": "Relevant stakeholders",\n'
            '    "collaboration_potential": "University / industry research & solution potential"\n'
            '  },\n'
            f'  "reporter_type": "{reporter_type}"\n'
            "}"
        )

        user_parts = []
        if video_transcript:
            user_parts.append(f"Spoken by citizen in video: '{video_transcript}'")
        if voice_transcript:
            user_parts.append(f"Spoken by citizen in voice note: '{voice_transcript}'")
        if text:
            user_parts.append(f"Written notes: '{text}'")
        if not user_parts:
            user_parts.append("Visual problem reported with attached evidence.")

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
                    "max_tokens": 600,
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

                urg = str(parsed.get("urgency", "MEDIUM")).upper().strip()
                if urg not in ["LOW", "MEDIUM", "HIGH", "CRITICAL"]:
                    urg = "MEDIUM"

                pot_impact = parsed.get("potential_impact")
                if isinstance(pot_impact, str):
                    pot_impact = [s.strip(" •-") for s in pot_impact.split("\n") if s.strip()]
                elif not isinstance(pot_impact, list) or not pot_impact:
                    pot_impact = [
                        "Inspection and maintenance operational concern",
                        "Potential safety concern for surrounding area",
                        "Infrastructure clutter and access constraint"
                    ]

                ai_obs = parsed.get("ai_observations") or {}
                if not isinstance(ai_obs, dict):
                    ai_obs = {}
                obs = ai_obs.get("observed") or ["Observed physical condition documented via submitted media."]
                inf = ai_obs.get("potential_inference") or ["Potential operational impact subject to on-site evaluation."]

                routing = parsed.get("suggested_routing") or {}
                if isinstance(routing, str):
                    stakeholders = routing
                    collab = "Potential opportunity for university/engineering teams to explore structured solutions."
                else:
                    stakeholders = routing.get("stakeholders") or "Relevant utility / infrastructure stakeholders"
                    collab = routing.get("collaboration_potential") or "Potential opportunity for university/engineering teams to explore structured solutions."

                title_res = parsed.get("title") or (core_issue[:45] + "..." if len(core_issue) > 45 else core_issue.capitalize()) if (video_transcript or voice_transcript or text) else "Observed Problem Report"
                desc_res = parsed.get("description") or user_message

                return jsonify({
                    "status": "success",
                    "data": {
                        "title": title_res,
                        "description": desc_res,
                        "category": matched_cat,
                        "subcategory": parsed.get("subcategory") or "General Infrastructure",
                        "issueType": parsed.get("issue_type") or title_res,
                        "severity": sev,
                        "urgency": urg,
                        "potentialImpact": pot_impact,
                        "aiObservations": {
                            "observed": obs if isinstance(obs, list) else [str(obs)],
                            "potential_inference": inf if isinstance(inf, list) else [str(inf)]
                        },
                        "suggestedRouting": {
                            "stakeholders": stakeholders,
                            "collaboration_potential": collab
                        },
                        "impactCount": "Local vicinity",
                        "impactDescription": " • ".join(pot_impact[:3]),
                        "department": stakeholders,
                        "reporterType": reporter_type,
                        "groupName": group_name,
                        "language": "hi-IN"
                    }
                }), 200
        except Exception as e:
            print(f"Sarvam 105B synthesis error: {e}")

        # Fallback to structured neutral response based on user input
        address = location.get("formatted") or location.get("villageCity") or "Local Area"
        core_issue = video_transcript or voice_transcript or text or "Observed physical issue documented via on-site evidence."
        fallback_title = core_issue[:45] + "..." if len(core_issue) > 45 else core_issue.capitalize()
        default_impact = [
            "Inspection and maintenance operational concern",
            "Potential safety concern for surrounding area",
            "Infrastructure clutter and access constraint"
        ]

        return jsonify({
            "status": "success",
            "data": {
                "title": fallback_title,
                "description": f"Problem observed at {address}. {core_issue}",
                "category": "Urban Development and Infrastructure",
                "subcategory": "General Infrastructure",
                "issueType": fallback_title,
                "severity": "MEDIUM",
                "urgency": "MEDIUM",
                "potentialImpact": default_impact,
                "aiObservations": {
                    "observed": ["Observed physical condition documented via submitted media."],
                    "potential_inference": ["Potential operational impact subject to on-site evaluation."]
                },
                "suggestedRouting": {
                    "stakeholders": "Relevant utility / infrastructure stakeholders",
                    "collaboration_potential": "Potential opportunity for university/engineering teams to explore structured solutions."
                },
                "impactCount": "Local vicinity",
                "impactDescription": " • ".join(default_impact),
                "department": "Relevant utility / infrastructure stakeholders",
                "reporterType": reporter_type,
                "groupName": group_name,
                "language": "hi-IN"
            }
        }), 200

    @app.route("/v1/problems", methods=["GET", "POST"])
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
    app = create_standalone_app()
except Exception as exc:
    print(f"Standard serverless init error ({exc}); creating fallback...")
    try:
        from app import create_app
        app = create_app(os.getenv("FLASK_ENV", "production"))
    except Exception:
        from flask import Flask
        app = Flask(__name__)
