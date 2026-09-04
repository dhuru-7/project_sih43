import base64
import logging
from flask import Blueprint, request, jsonify
from app.services.voice_agent_service import VoiceAgentService

logger = logging.getLogger(__name__)

voice_agent_bp = Blueprint("voice_agent", __name__)

@voice_agent_bp.route("/start", methods=["POST"])
def start_voice():
    """
    Initializes a voice session with TARA, returns greeting text and Bulbul TTS audio.
    """
    data = request.get_json(silent=True) or {}
    session_id = data.get("session_id")
    user_name = data.get("user_name", "रामेश्वर")

    try:
        result = VoiceAgentService.start_session(session_id=session_id, user_name=user_name)
        return jsonify({
            "status": "success",
            "data": result
        }), 200
    except Exception as e:
        logger.exception("Failed to start voice session")
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

@voice_agent_bp.route("/chat", methods=["POST"])
def voice_chat():
    """
    Accepts speech audio (multipart file or base64) or text.
    Transcribes via Saaras v3 -> generates reply via Gemini 3.5 Flash Lite -> synthesizes via Bulbul v3.
    """
    session_id = None

    # Check for multipart/form-data upload
    if "audio" in request.files or "file" in request.files:
        audio_file = request.files.get("audio") or request.files.get("file")
        session_id = request.form.get("session_id")
        audio_bytes = audio_file.read()
        filename = audio_file.filename or "audio.wav"
        mime_type = audio_file.mimetype or "audio/wav"

        try:
            result = VoiceAgentService.process_audio_turn(
                session_id=session_id,
                audio_bytes=audio_bytes,
                filename=filename,
                mime_type=mime_type
            )
            return jsonify({
                "status": "success",
                "data": result
            }), 200
        except Exception as e:
            logger.exception("Error processing voice audio turn")
            return jsonify({
                "status": "error",
                "message": str(e)
            }), 500

    # Check for JSON payload
    data = request.get_json(silent=True) or {}
    session_id = data.get("session_id")
    
    if "audio_base64" in data:
        try:
            raw_b64 = data["audio_base64"]
            audio_bytes = base64.b64decode(raw_b64)
            result = VoiceAgentService.process_audio_turn(
                session_id=session_id,
                audio_bytes=audio_bytes,
                filename="voice.wav",
                mime_type="audio/wav"
            )
            return jsonify({
                "status": "success",
                "data": result
            }), 200
        except Exception as e:
            logger.exception("Error processing base64 audio turn")
            return jsonify({
                "status": "error",
                "message": str(e)
            }), 500

    if "text" in data and data["text"].strip():
        try:
            result = VoiceAgentService.process_text_turn(
                session_id=session_id,
                user_text=data["text"].strip()
            )
            return jsonify({
                "status": "success",
                "data": result
            }), 200
        except Exception as e:
            logger.exception("Error processing text turn")
            return jsonify({
                "status": "error",
                "message": str(e)
            }), 500

    return jsonify({
        "status": "error",
        "message": "No audio file, audio_base64, or text provided."
    }), 400

@voice_agent_bp.route("/end", methods=["POST"])
def end_voice():
    data = request.get_json(silent=True) or {}
    session_id = data.get("session_id")
    if not session_id:
        return jsonify({"status": "error", "message": "session_id required"}), 400

    VoiceAgentService.end_session(session_id)
    return jsonify({"status": "success", "message": "Session ended"}), 200
