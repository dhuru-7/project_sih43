import time
import uuid
import logging
from app.services.sarvam_service import SarvamService
from app.services.gemini_service import GeminiService

logger = logging.getLogger(__name__)

SARVAM_TARA_SYSTEM_PROMPT = """You are TARA (तारा), an empathetic, polite, and dedicated AI voice companion and assistant for citizens on the SETU platform.
The user can talk to you about anything: daily life, friendly conversation, questions, or municipal problems (roads, water, electricity, sanitation).
Rules for spoken voice:
1. Always respond in the EXACT same language and dialect the user spoke in (Hindi, Hinglish, English, Bengali, Tamil, Telugu, Marathi, etc.).
2. Greet with 'नमस्ते' warmly when appropriate.
3. Sound like a polite, warm, caring Indian friend over a phone call.
4. Keep your response strictly to 1 or 2 short, natural spoken sentences without any markdown formatting, asterisks (*), hashtags (#), or emojis.
5. Never use bullet points, lists, or headers."""

class VoiceAgentService:
    # In-memory store for ongoing voice sessions and greeting audio cache
    _sessions = {}
    _greeting_cache = {}

    @classmethod
    def _get_or_create_session(cls, session_id: str = None, user_name: str = "नागरिक") -> dict:
        if not session_id or session_id not in cls._sessions:
            session_id = session_id or str(uuid.uuid4())
            cls._sessions[session_id] = {
                "session_id": session_id,
                "user_name": user_name,
                "created_at": time.time(),
                "history": [
                    {"role": "system", "content": SARVAM_TARA_SYSTEM_PROMPT}
                ],
                "language_code": "hi-IN"
            }
        return cls._sessions[session_id]

    @classmethod
    def start_session(cls, session_id: str = None, user_name: str = "Ramesh") -> dict:
        """
        Starts a new voice conversation with TARA using 100% Sarvam AI stack.
        Initializes an empty session ready to receive user's speech first.
        """
        session_id = session_id or str(uuid.uuid4())
        # Clean existing session if any
        if session_id in cls._sessions:
            del cls._sessions[session_id]

        session = cls._get_or_create_session(session_id, user_name)
        session["history"] = [
            {"role": "system", "content": SARVAM_TARA_SYSTEM_PROMPT}
        ]

        return {
            "session_id": session_id,
            "text": "",
            "audio_base64": "",
            "speaker": "ritu",
            "language_code": "hi-IN"
        }

    @classmethod
    def process_audio_turn(cls, session_id: str, audio_bytes: bytes, filename: str = "voice.wav", mime_type: str = "audio/wav") -> dict:
        """
        Executes 100% pure Sarvam AI voice loop:
        1. Audio bytes -> Sarvam Saaras v3 STT -> transcript + language_code
        2. Transcript -> Sarvam 105B Brain -> reply_text
        3. Reply text -> Sarvam Bulbul v3 TTS -> audio_base64
        """
        session = cls._get_or_create_session(session_id)

        # 1. Speech to Text via Sarvam Saaras v3 (ultra-fast language hint, automatic dialect fallback)
        stt_result = SarvamService.speech_to_text(
            audio_bytes,
            filename=filename,
            mime_type=mime_type,
            language_code=session.get("language_code", "hi-IN")
        )
        transcript = stt_result.get("transcript", "").strip()
        detected_lang = stt_result.get("language_code", "hi-IN")
        session["language_code"] = detected_lang

        if not transcript:
            fallback_text = "नमस्ते जी, मुझे आपकी आवाज़ साफ़ नहीं सुनाई दी। क्या आप कृपया दोबारा बोल सकते हैं?"
            fallback_audio = SarvamService.text_to_speech(fallback_text, target_language_code="hi-IN", speaker="ritu")
            return {
                "session_id": session_id,
                "user_transcript": "",
                "reply_text": fallback_text,
                "audio_base64": fallback_audio,
                "language_code": detected_lang
            }

        # 2. Append user turn to history
        session["history"].append({
            "role": "user",
            "content": transcript
        })

        # 3. Fast Brain: Gemini 3.5 Flash Lite (<1.0s latency) with Sarvam 105B fallback
        reply_text = ""
        try:
            gemini_messages = []
            for h in session["history"]:
                if h["role"] == "user":
                    gemini_messages.append({"role": "user", "parts": [{"text": h["content"]}]})
                elif h["role"] == "assistant":
                    gemini_messages.append({"role": "model", "parts": [{"text": h["content"]}]})

            reply_text = GeminiService.generate_chat_response(gemini_messages)
        except Exception as e:
            logger.warning(f"Gemini Flash Lite turn failed ({e}), falling back to Sarvam 105B...")
            reply_text = SarvamService.chat_completion(
                session["history"],
                model="sarvam-105b-conversations",
                max_tokens=40
            )

        if not reply_text or not reply_text.strip():
            reply_text = "नमस्ते जी, मैं समझ रही हूँ। कृपया बताइए मैं आपकी किस प्रकार सहायता कर सकती हूँ?"

        reply_text = reply_text.replace("*", "").replace("#", "").replace('"', '').strip()
        # Keep response strictly to 1 or 2 concise spoken sentences so Bulbul TTS synthesizes in under 1s
        sentences = [s.strip() for s in reply_text.split("।") if s.strip()]
        if len(sentences) > 2:
            reply_text = "। ".join(sentences[:2]) + "।"

        session["history"].append({
            "role": "assistant",
            "content": reply_text
        })

        # 4. Determine target language code for Bulbul TTS
        tts_lang = "hi-IN"
        if detected_lang and detected_lang.startswith("en"):
            tts_lang = "en-IN"
        elif detected_lang in ["bn-IN", "te-IN", "ta-IN", "mr-IN", "gu-IN", "kn-IN", "ml-IN", "pa-IN", "or-IN"]:
            tts_lang = detected_lang

        audio_base64 = SarvamService.text_to_speech(reply_text, target_language_code=tts_lang, speaker="ritu")

        return {
            "session_id": session_id,
            "user_transcript": transcript,
            "reply_text": reply_text,
            "audio_base64": audio_base64,
            "language_code": tts_lang
        }

    @classmethod
    def process_text_turn(cls, session_id: str, user_text: str) -> dict:
        """
        Fallback turn for text input testing with Sarvam 105B Brain directly.
        """
        session = cls._get_or_create_session(session_id)

        session["history"].append({
            "role": "user",
            "content": user_text
        })

        reply_text = SarvamService.chat_completion(
            session["history"],
            model="sarvam-105b-conversations",
            max_tokens=70
        )
        if not reply_text or not reply_text.strip():
            reply_text = "नमस्ते जी, मैं आपकी किस प्रकार मदद कर सकती हूँ?"

        reply_text = reply_text.replace("*", "").replace("#", "").replace('"', '').strip()

        session["history"].append({
            "role": "assistant",
            "content": reply_text
        })

        audio_base64 = SarvamService.text_to_speech(reply_text, target_language_code="hi-IN", speaker="ritu")

        return {
            "session_id": session_id,
            "user_transcript": user_text,
            "reply_text": reply_text,
            "audio_base64": audio_base64,
            "language_code": "hi-IN"
        }

    @classmethod
    def end_session(cls, session_id: str) -> dict:
        if session_id in cls._sessions:
            del cls._sessions[session_id]
        return {"status": "success", "session_id": session_id}
