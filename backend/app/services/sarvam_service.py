import logging
import requests
from flask import current_app

logger = logging.getLogger(__name__)

SARVAM_STT_URL = "https://api.sarvam.ai/speech-to-text"
SARVAM_TTS_URL = "https://api.sarvam.ai/text-to-speech"
SARVAM_CHAT_URL = "https://api.sarvam.ai/v1/chat/completions"

class SarvamService:
    @staticmethod
    def _get_api_key():
        key = current_app.config.get("SARVAM_API_KEY")
        if not key:
            raise ValueError("SARVAM_API_KEY is not configured.")
        return key

    @classmethod
    def speech_to_text(cls, audio_bytes: bytes, filename: str = "audio.wav", mime_type: str = "audio/wav", language_code: str = "hi-IN") -> dict:
        """
        Converts speech audio to text using Sarvam Saaras v3 model.
        Uses fast language hint (default hi-IN) to avoid multi-second LID delay,
        falling back to 'unknown' auto-detection if no transcript was found.
        """
        api_key = cls._get_api_key()
        headers = {
            "api-subscription-key": api_key
        }
        files = {
            "file": (filename, audio_bytes, mime_type)
        }
        data = {
            "model": "saaras:v3",
            "language_code": language_code or "hi-IN"
        }

        try:
            response = requests.post(SARVAM_STT_URL, headers=headers, files=files, data=data, timeout=25)
            if response.status_code == 200:
                res_json = response.json()
                transcript = res_json.get("transcript", "").strip()
                detected_lang = res_json.get("language_code", language_code or "hi-IN")

                # If empty and language_code was specific, retry once with unknown for regional dialect detection
                if not transcript and language_code != "unknown":
                    logger.info("Specific language STT returned empty; trying auto language detection fallback...")
                    files_fallback = {"file": (filename, audio_bytes, mime_type)}
                    fb_resp = requests.post(
                        SARVAM_STT_URL,
                        headers=headers,
                        files=files_fallback,
                        data={"model": "saaras:v3", "language_code": "unknown"},
                        timeout=25
                    )
                    if fb_resp.status_code == 200:
                        fb_json = fb_resp.json()
                        transcript = fb_json.get("transcript", "").strip()
                        detected_lang = fb_json.get("language_code", "hi-IN")

                logger.info(f"Sarvam STT success. Lang: {detected_lang}, Transcript: {transcript}")
                return {
                    "transcript": transcript,
                    "language_code": detected_lang
                }
            else:
                logger.error(f"Sarvam STT failed ({response.status_code}): {response.text}")
                response.raise_for_status()
        except Exception as e:
            logger.exception("Error during Sarvam STT transcription")
            raise

    @classmethod
    def text_to_speech(cls, text: str, target_language_code: str = "hi-IN", speaker: str = "ritu") -> str:
        """
        Converts text to speech audio (base64 encoded WAV/MP3) using Sarvam Bulbul v3 model.
        Returns base64 audio string.
        """
        api_key = cls._get_api_key()
        headers = {
            "api-subscription-key": api_key,
            "Content-Type": "application/json"
        }
        
        # Valid Sarvam languages for Bulbul: hi-IN, en-IN, bn-IN, te-IN, ta-IN, mr-IN, gu-IN, kn-IN, ml-IN, pa-IN, or-IN
        valid_languages = [
            "hi-IN", "en-IN", "bn-IN", "te-IN", "ta-IN", 
            "mr-IN", "gu-IN", "kn-IN", "ml-IN", "pa-IN", "or-IN"
        ]
        if target_language_code not in valid_languages:
            target_language_code = "hi-IN"

        payload = {
            "inputs": [text],
            "target_language_code": target_language_code,
            "speaker": speaker,
            "pitch": 0,
            "pace": 1.05,
            "loudness": 1.5,
            "speech_sample_rate": 22050,
            "enable_preprocessing": True,
            "model": "bulbul:v3"
        }

        try:
            response = requests.post(SARVAM_TTS_URL, headers=headers, json=payload, timeout=25)
            if response.status_code != 200:
                logger.error(f"Sarvam TTS failed ({response.status_code}): {response.text}")
                response.raise_for_status()

            res_json = response.json()
            audios = res_json.get("audios", [])
            if not audios:
                raise ValueError("Sarvam TTS returned no audio tracks.")

            logger.info(f"Sarvam TTS success. Audio length (b64): {len(audios[0])}")
            return audios[0]
        except Exception as e:
            logger.exception("Error during Sarvam TTS synthesis")
            raise

    @classmethod
    def chat_completion(cls, messages: list, model: str = "sarvam-105b-conversations", max_tokens: int = 100, temperature: float = 0.6) -> str:
        """
        Generates colloquial Indian language speech responses using Sarvam 105B.
        """
        api_key = cls._get_api_key()
        headers = {
            "api-subscription-key": api_key,
            "Content-Type": "application/json"
        }
        payload = {
            "model": model,
            "messages": messages,
            "max_tokens": max_tokens,
            "temperature": temperature
        }

        try:
            response = requests.post(SARVAM_CHAT_URL, headers=headers, json=payload, timeout=20)
            if response.status_code == 200:
                res_json = response.json()
                choices = res_json.get("choices", [])
                if choices:
                    content = choices[0].get("message", {}).get("content", "").strip()
                    logger.info(f"Sarvam 105B completion success ({len(content)} chars)")
                    return content
            logger.warning(f"Sarvam 105B call returned {response.status_code}: {response.text}")
        except Exception as e:
            logger.exception("Error during Sarvam 105B chat completion")
        return ""

    @classmethod
    def generate_issue_description(
        cls,
        transcript: str,
        visual_summary: str = None,
        location_info: dict = None,
        reporter_type: str = None,
        group_name: str = None
    ) -> dict:
        """
        Synthesizes citizen voice/notepad transcripts, video transcripts, visual evidence summaries,
        and geographic administrative divisions into a formal civic grievance using Sarvam 105B.
        """
        official_categories = [
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
        cats_str = ", ".join([f"'{c}'" for c in official_categories])

        system_prompt = (
            "You are TARA, the AI Civic Intelligence Engine for SETU (India National Citizen Grievance & Innovation Platform). "
            "A citizen, collective, grassroots body, or civil society group has reported a civic problem. "
            "Analyze the statement/transcript, visual evidence summary from photos and video frames, and location. "
            "Synthesize this into a formal, clear, actionable, and high-impact civic report. "
            "You must respond with ONLY valid JSON (no markdown formatting, no code fences, no introductory or concluding words) containing these exact keys: "
            "'title' (formal, concise title, under 10 words), "
            "'description' (2-4 clear sentences detailing the specific issue, specific hazard/disruption, and urgency), "
            f"'category' (MUST be exactly one of the 17 official categories: {cats_str}), "
            "'severity' (MUST be one of: 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'), "
            "'impact_count' (string estimate of people impacted, e.g. '200-500 residents' or '1,000+ daily commuters'), "
            "'impact_description' (1-2 sentences on who is affected and how), "
            "'reporter_type' (reporting entity, e.g. 'Individual Citizen', 'Resident Welfare Association (RWA)', 'Self-Help Group (SHG / Sakhi Mandal)', 'Non-Governmental Organization (NGO / CSO)', 'Gram Sabha / Village Committee', 'Youth Club / Nehru Yuva Kendra', 'Farmers Producer Organization (FPO)', 'ASHA / Anganwadi Frontline Worker', 'Traders / Market Association', etc.)."
        )

        user_content_lines = []
        user_content_lines.append(f'Grievance statement / speech transcript: "{transcript or "Visual civic issue reported."}"')
        
        if visual_summary and visual_summary.strip():
            user_content_lines.append(f'Visual evidence observed in attached photos & video frames: "{visual_summary.strip()}"')

        if location_info:
            loc_parts = []
            if location_info.get("villageCity") or location_info.get("village_city"):
                loc_parts.append(f"Village/City: {location_info.get('villageCity') or location_info.get('village_city')}")
            if location_info.get("subdistrict"):
                loc_parts.append(f"Sub-district: {location_info.get('subdistrict')}")
            if location_info.get("district"):
                loc_parts.append(f"District: {location_info.get('district')}")
            if location_info.get("state"):
                loc_parts.append(f"State: {location_info.get('state')}")
            if location_info.get("pincode"):
                loc_parts.append(f"PIN: {location_info.get('pincode')}")
            if loc_parts:
                user_content_lines.append(f"Location Details: {', '.join(loc_parts)}")

        if reporter_type:
            user_content_lines.append(f"Reported by: {reporter_type}")
        if group_name:
            user_content_lines.append(f"Organization / Community Body: {group_name}")

        user_message = "\n".join(user_content_lines)

        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_message}
        ]

        raw_response = cls.chat_completion(
            messages=messages,
            model="sarvam-105b-conversations",
            max_tokens=500,
            temperature=0.2
        )

        if not raw_response:
            raise ValueError("Sarvam 105B returned empty response.")

        # Clean JSON fences if present
        clean_text = raw_response.strip()
        if clean_text.startswith("```"):
            clean_text = clean_text.split("\n", 1)[-1]
        if clean_text.endswith("```"):
            clean_text = clean_text.rsplit("\n", 1)[0]
        clean_text = clean_text.replace("```json", "").replace("```", "").strip()

        # Try to find JSON substring if there is any stray text
        import re, json
        json_match = re.search(r"\{.*\}", clean_text, re.DOTALL)
        if json_match:
            clean_text = json_match.group(0)

        parsed = json.loads(clean_text)

        # Validate & normalize category to 1 of the 17 official categories
        cat = parsed.get("category", "").strip()
        matched_cat = "Urban Development and Infrastructure"
        for official in official_categories:
            if official.lower() == cat.lower() or official.lower() in cat.lower() or cat.lower() in official.lower():
                matched_cat = official
                break

        # Validate severity
        sev = str(parsed.get("severity", "MEDIUM")).upper().strip()
        if sev not in ["LOW", "MEDIUM", "HIGH", "CRITICAL"]:
            sev = "MEDIUM"

        return {
            "title": parsed.get("title") or (transcript[:45] + "..." if len(transcript) > 45 else transcript) or "Civic Grievance Report",
            "description": parsed.get("description") or transcript or "Citizen reported grievance with visual evidence.",
            "category": matched_cat,
            "severity": sev,
            "impact_count": str(parsed.get("impact_count", "100-250 local residents")),
            "impact_description": parsed.get("impact_description", "Affects local residents and commuters in the vicinity."),
            "reporter_type": parsed.get("reporter_type") or reporter_type or "Individual Citizen"
        }


