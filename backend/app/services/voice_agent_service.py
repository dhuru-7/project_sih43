import time
import uuid
import logging
from app.services.sarvam_service import SarvamService
from app.services.gemini_service import GeminiService

logger = logging.getLogger(__name__)

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
                "history": [],
                "language_code": "hi-IN"
            }
        return cls._sessions[session_id]

    @classmethod
    def start_session(cls, session_id: str = None, user_name: str = "Ramesh") -> dict:
        """
        Starts a new voice conversation with TARA.
        Initializes an empty session ready to receive user's speech first.
        """
        session_id = session_id or str(uuid.uuid4())
        # Clean existing session if any
        if session_id in cls._sessions:
            del cls._sessions[session_id]

        session = cls._get_or_create_session(session_id, user_name)
        session["history"] = []

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
        Executes end-to-end voice loop:
        1. Audio bytes -> Sarvam Saaras STT -> transcript + language_code
        2. Transcript -> Gemini 3.5 Flash Lite -> reply_text
        3. Reply text -> Sarvam Bulbul TTS -> audio_base64
        """
        session = cls._get_or_create_session(session_id)

        # 1. Speech to Text
        stt_result = SarvamService.speech_to_text(audio_bytes, filename=filename, mime_type=mime_type)
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
            "parts": [{"text": transcript}]
        })

        # 3. Direct Gemini 3.5 Flash Lite conversational response (ultra-low latency)
        reply_text = GeminiService.generate_chat_response(session["history"])
        reply_text = reply_text.replace("*", "").replace("#", "").replace('"', '').strip()

        session["history"].append({
            "role": "model",
            "parts": [{"text": reply_text}]
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
        Fallback turn for text input testing with Gemini 3.5 Flash Lite directly.
        """
        session = cls._get_or_create_session(session_id)

        session["history"].append({
            "role": "user",
            "parts": [{"text": user_text}]
        })

        reply_text = GeminiService.generate_chat_response(session["history"])
        reply_text = reply_text.replace("*", "").replace("#", "").replace('"', '').strip()

        session["history"].append({
            "role": "model",
            "parts": [{"text": reply_text}]
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
