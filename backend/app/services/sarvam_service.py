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

