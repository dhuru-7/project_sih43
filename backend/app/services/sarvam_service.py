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
            "You are TARA, the AI Civic Intelligence Engine for SETU. "
            "A citizen has reported a real-world problem using photos, video frames, voice notes, or text. "
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
            "You must respond with ONLY valid JSON (no markdown formatting, no code fences) containing these exact keys:\n"
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
            '  "reporter_type": "Individual Citizen"\n'
            "}"
        )

        user_content_lines = []
        user_content_lines.append(f'Citizen problem statement / transcript: "{transcript or "Visual problem reported."}"')
        
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
            max_tokens=600,
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

        try:
            parsed = json.loads(clean_text, strict=False)
        except Exception:
            # Fallback: escape literal unescaped newlines inside string values
            sanitized = re.sub(r'[\r\n\t]+', ' ', clean_text)
            parsed = json.loads(sanitized, strict=False)

        # Validate & normalize category to 1 of the 17 official categories
        cat = parsed.get("category", "").strip()
        matched_cat = "Urban Development and Infrastructure"
        for official in official_categories:
            if official.lower() == cat.lower() or official.lower() in cat.lower() or cat.lower() in official.lower():
                matched_cat = official
                break

        # Validate severity and urgency
        sev = str(parsed.get("severity", "MEDIUM")).upper().strip()
        if sev not in ["LOW", "MEDIUM", "HIGH", "CRITICAL"]:
            sev = "MEDIUM"

        urg = str(parsed.get("urgency", "MEDIUM")).upper().strip()
        if urg not in ["LOW", "MEDIUM", "HIGH", "CRITICAL"]:
            urg = "MEDIUM"

        # Format potential impact
        potential_impact = parsed.get("potential_impact")
        if isinstance(potential_impact, str):
            potential_impact = [s.strip(" •-") for s in potential_impact.split("\n") if s.strip()]
        elif not isinstance(potential_impact, list) or not potential_impact:
            potential_impact = [
                "Inspection and maintenance operational concern",
                "Potential safety concern for surrounding area",
                "Infrastructure clutter and access constraint"
            ]

        # AI observations
        ai_obs = parsed.get("ai_observations") or {}
        if not isinstance(ai_obs, dict):
            ai_obs = {}
        observed_facts = ai_obs.get("observed") or ["Observed physical condition documented via submitted media."]
        inferences = ai_obs.get("potential_inference") or ["Potential operational impact subject to on-site evaluation."]

        # Suggested routing
        routing = parsed.get("suggested_routing") or {}
        if isinstance(routing, str):
            stakeholders = routing
            collab = "Potential opportunity for university/engineering teams to explore structured solutions."
        else:
            stakeholders = routing.get("stakeholders") or "Relevant utility / infrastructure stakeholders"
            collab = routing.get("collaboration_potential") or "Potential opportunity for university/engineering teams to explore structured solutions."

        title_res = parsed.get("title") or (transcript[:45] + "..." if len(transcript) > 45 else transcript) or "Observed Infrastructure Problem"
        desc_res = parsed.get("description") or transcript or "Problem report documented with attached media evidence."

        return {
            "title": title_res,
            "description": desc_res,
            "category": matched_cat,
            "subcategory": parsed.get("subcategory") or "General Infrastructure",
            "issue_type": parsed.get("issue_type") or title_res,
            "severity": sev,
            "urgency": urg,
            "potential_impact": potential_impact,
            "ai_observations": {
                "observed": observed_facts if isinstance(observed_facts, list) else [str(observed_facts)],
                "potential_inference": inferences if isinstance(inferences, list) else [str(inferences)]
            },
            "suggested_routing": {
                "stakeholders": stakeholders,
                "collaboration_potential": collab
            },
            "impact_count": "Local vicinity",
            "impact_description": " • ".join(potential_impact[:3]),
            "reporter_type": parsed.get("reporter_type") or reporter_type or "Individual Citizen"
        }


