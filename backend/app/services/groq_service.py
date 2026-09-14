import os
import json
import logging
import requests
from flask import current_app

logger = logging.getLogger(__name__)

GROQ_CHAT_URL = "https://api.groq.com/openai/v1/chat/completions"

OFFICIAL_CATEGORIES = [
    "Urban Development and Infrastructure",
    "Sanitation and Waste Management",
    "Water Supply and Water Resources",
    "Roads, Transport and Traffic Management",
    "Electricity and Power Supply",
    "Public Health and Sanitation",
    "Environment and Pollution Control",
    "Education and Academic Infrastructure",
    "Women and Child Welfare",
    "Rural Development and Panchayati Raj",
    "Agriculture and Farmer Welfare",
    "Disaster Management and Flood Relief",
    "Law, Order and Public Safety",
    "Public Distribution System and Food",
    "Social Justice and Empowerment",
    "Revenue and Land Administration",
    "Public Administration and Governance"
]

class GroqService:
    @staticmethod
    def _get_api_key():
        key = None
        try:
            key = current_app.config.get("GROQ_API_KEY")
        except RuntimeError:
            pass
        if not key:
            key = os.getenv("GROQ_API_KEY")
        return key

    @classmethod
    def synthesize_grievance_report(
        cls,
        video_transcripts: str = "",
        voice_transcript: str = "",
        user_text: str = "",
        visual_summary: str = "",
        location_info=None,
        reporter_type: str = "Individual Citizen",
        group_name: str = ""
    ) -> dict:
        """
        Synthesizes an official, actionable civic grievance report from multi-modal inputs
        using Groq LLM (llama-3.3-70b-versatile with graceful fallback).
        """
        api_key = cls._get_api_key()
        if not api_key:
            raise ValueError("GROQ_API_KEY is not configured.")

        # Build location context
        loc_str = "Not provided"
        if isinstance(location_info, dict):
            loc_parts = []
            if location_info.get("formatted"):
                loc_parts.append(location_info["formatted"])
            else:
                for k in ["villageCity", "subdistrict", "district", "state", "pincode"]:
                    if location_info.get(k):
                        loc_parts.append(str(location_info[k]))
            if location_info.get("latitude") and location_info.get("longitude"):
                loc_parts.append(f"Coordinates: ({location_info['latitude']}, {location_info['longitude']})")
            if loc_parts:
                loc_str = ", ".join(loc_parts)
        elif location_info:
            loc_str = str(location_info)

        categories_list_str = "\n".join([f"- {cat}" for cat in OFFICIAL_CATEGORIES])

        system_prompt = f"""You are the Master AI Civic Grievance Evaluation Engine for the SETU National Innovation & Grievance Ecosystem.
Your goal is to synthesize multi-modal citizen evidence into a high-precision, authentic civic grievance report.

You must categorize the issue into EXACTLY ONE of the following 17 official categories:
{categories_list_str}

Guidelines:
1. Title: Professional, concise (under 10 words), stating the core issue and landmark/area (e.g., "Severe Sewage Leakage on MG Road", "Deep Uncovered Pothole near Sector 4").
2. Category: MUST be an exact match to one of the 17 categories listed above.
3. Description:
   - CRITICAL REQUIREMENT: Write the description in the FIRST PERSON from the perspective of the reporting citizen themselves (e.g., "I am reporting an urgent issue regarding...", "In our locality...").
   - NEVER speak in the third person. DO NOT say "Ground-level civic grievance reported by Individual Citizen", "The citizen reported", "Verified with 1 on-site video recording", or "A complaint was lodged".
   - Sound natural, direct, concise, and authentic — exactly as if the resident is writing their own complaint to the municipal officer.
   - You MUST extract and prominently highlight the concrete details mentioned by the user or visible in evidence:
     * Street Name / Road / Colony / Landmark / Shop / School
     * Time / Duration (e.g., "since yesterday evening", "around 8:15 PM", "ongoing for the past 3 days")
     * Specific Problem & Hazard (e.g., broken water main, open drain, overflowing garbage, exposed sparking wire)
     * Names of any specific places, shops, or landmarks mentioned
     * Direct impact on commuters, school children, or nearby residents
     * Polite, urgent call to action for the department to inspect and repair it.
   - Format: Start with 1-2 direct sentences, followed by structured bullet highlights:
     • Street / Landmark: [extracted name]
     • Time / Duration: [extracted time]
     • Specific Issue: [core problem]
     • Impact: [who is affected]
     Conclude with a brief action request.
4. Severity: One of "LOW", "MEDIUM", "HIGH", or "CRITICAL".
5. Impact Count: Realistic estimate of citizens affected (e.g., "150-300 residents", "Daily commuters on Ward 14").
6. Impact Description: Direct public hazards, hygiene risks, or daily convenience disruption in citizen words.
7. Department: The most relevant municipal or state department (e.g., "Municipal Corporation (JMC)", "Public Works Department (PWD)", "Jal Sansthan / Water Board", "State Electricity Board").

You MUST return ONLY valid JSON matching this exact structure:
{{
  "title": "string",
  "category": "string",
  "description": "string",
  "severity": "LOW|MEDIUM|HIGH|CRITICAL",
  "impact_count": "string",
  "impact_description": "string",
  "department": "string"
}}"""

        evidence_sections = []
        if video_transcripts and video_transcripts.strip():
            evidence_sections.append(f"### Spoken Audio Transcripts from Attached Videos (via Saaras v3):\n{video_transcripts.strip()}")
        if voice_transcript and voice_transcript.strip():
            evidence_sections.append(f"### Spoken Voice Note from Citizen (via Saaras v3):\n{voice_transcript.strip()}")
        if user_text and user_text.strip():
            evidence_sections.append(f"### Citizen Written Notes / Text Description:\n{user_text.strip()}")
        if visual_summary and visual_summary.strip():
            evidence_sections.append(f"### Visual Scene Analysis from Attached Photos & Video Frames:\n{visual_summary.strip()}")
        evidence_sections.append(f"### Geolocation & Administrative Boundaries:\n{loc_str}")
        evidence_sections.append(f"### Reporter Identity:\nType: {reporter_type}" + (f" | Group: {group_name}" if group_name else ""))

        user_content = "Please synthesize an official civic grievance report based on the following multi-modal evidence:\n\n" + "\n\n".join(evidence_sections)

        primary_model = "openai/gpt-oss-120b"
        try:
            configured_model = current_app.config.get("GROQ_MODEL")
            if configured_model:
                primary_model = configured_model
        except RuntimeError:
            primary_model = os.getenv("GROQ_MODEL", "openai/gpt-oss-120b")

        candidate_models = [
            primary_model,
            "qwen/qwen3.8-27b",
            "groq/compound"
        ]
        # Remove duplicates while preserving order
        candidate_models = list(dict.fromkeys(candidate_models))

        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }

        last_error = None
        for model in candidate_models:
            payload = {
                "model": model,
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_content}
                ],
                "temperature": 0.2,
                "max_tokens": 2048
            }

            try:
                logger.info(f"Attempting Groq synthesis with model: {model}")
                resp = requests.post(GROQ_CHAT_URL, headers=headers, json=payload, timeout=30)
                if resp.status_code == 200:
                    resp_json = resp.json()
                    content = resp_json["choices"][0]["message"].get("content") or ""
                    logger.info(f"Groq synthesis succeeded with model {model}")
                    return cls._clean_and_parse_json(content)
                else:
                    logger.warning(f"Groq model {model} returned status {resp.status_code}: {resp.text[:120]}")
                    last_error = f"{resp.status_code}: {resp.text}"
                    # If 404 or decommissioned, try next model in candidate list
                    continue
            except Exception as e:
                logger.warning(f"Error requesting Groq model {model}: {e}")
                last_error = str(e)
                continue

        raise RuntimeError(f"All Groq models failed. Last error: {last_error}")

    @staticmethod
    def _clean_and_parse_json(text: str) -> dict:
        """Parses LLM output cleanly even if wrapped in markdown code blocks or reasoning tags."""
        import re
        cleaned = text.strip()
        cleaned = re.sub(r"<think>.*?</think>", "", cleaned, flags=re.DOTALL).strip()
        cleaned = re.sub(r"<thought>.*?</thought>", "", cleaned, flags=re.DOTALL).strip()

        if cleaned.startswith("```"):
            lines = cleaned.splitlines()
            if lines[0].startswith("```"):
                lines = lines[1:]
            if lines and lines[-1].startswith("```"):
                lines = lines[:-1]
            cleaned = "\n".join(lines).strip()

        # Find first { and last }
        start_idx = cleaned.find("{")
        end_idx = cleaned.rfind("}")
        if start_idx != -1 and end_idx != -1 and end_idx > start_idx:
            cleaned = cleaned[start_idx:end_idx + 1]

        try:
            data = json.loads(cleaned, strict=False)
        except Exception:
            clean_esc = re.sub(r'[\x00-\x1f\x7f-\x9f]', lambda m: ' ' if m.group(0) in '\r\n\t' else '', cleaned)
            data = json.loads(clean_esc, strict=False)

        # Validate category against official list or normalize
        category = data.get("category", "Urban Development and Infrastructure")
        if category not in OFFICIAL_CATEGORIES:
            # Match best partial or default
            matched = None
            for cat in OFFICIAL_CATEGORIES:
                if cat.lower() in category.lower() or category.lower() in cat.lower():
                    matched = cat
                    break
            data["category"] = matched or "Urban Development and Infrastructure"

        # Normalize severity
        sev = str(data.get("severity", "MEDIUM")).upper()
        if sev not in ["LOW", "MEDIUM", "HIGH", "CRITICAL"]:
            sev = "MEDIUM"
        data["severity"] = sev

        return data

    @classmethod
    def transcribe_audio(cls, audio_bytes: bytes, filename: str = "audio.wav", language: str = "en") -> dict:
        """
        Transcribes speech audio or video audio using Groq Whisper Large v3 Turbo.
        Supports flac, mp3, mp4, mpeg, mpga, m4a, ogg, wav, webm.
        """
        api_key = cls._get_api_key()
        if not api_key:
            raise ValueError("GROQ_API_KEY is not configured.")

        url = "https://api.groq.com/openai/v1/audio/transcriptions"
        headers = {"Authorization": f"Bearer {api_key}"}

        # Normalize filename extension for Whisper
        fname = filename
        if not any(fname.lower().endswith(ext) for ext in [".wav", ".mp3", ".webm", ".mp4", ".m4a", ".ogg", ".flac"]):
            fname = "audio.webm"

        files = {
            "file": (fname, audio_bytes, "application/octet-stream")
        }
        data = {
            "model": "whisper-large-v3-turbo",
            "response_format": "json"
        }

        response = requests.post(url, headers=headers, files=files, data=data, timeout=30)
        if response.status_code == 200:
            res_json = response.json()
            return {
                "transcript": res_json.get("text", "").strip(),
                "language_code": language
            }
        else:
            raise RuntimeError(f"Groq Whisper failed {response.status_code}: {response.text}")
