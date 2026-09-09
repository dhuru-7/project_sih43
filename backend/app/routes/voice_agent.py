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

@voice_agent_bp.route("/describe-issue", methods=["POST"])
def describe_issue():
    """
    Accepts spoken audio (multipart or base64) or direct text, along with optional images,
    location details, and reporter type.
    Transcribes voice using STT -> formats a formal civic report
    using AI Engine -> returns title, description, category (1 of 17), severity,
    impact estimate, and reporter type.
    """
    from app.services.sarvam_service import SarvamService
    from app.services.gemini_service import GeminiService

    transcript = ""
    detected_lang = "hi-IN"
    images = []
    location_info = None
    reporter_type = None

    # 1. Handle multipart audio file
    if "audio" in request.files or "file" in request.files:
        audio_file = request.files.get("audio") or request.files.get("file")
        audio_bytes = audio_file.read()
        filename = audio_file.filename or "recording.webm"
        mime_type = audio_file.mimetype or "audio/webm"

        # Check for location / reporter in form
        reporter_type = request.form.get("reporter_type") or request.form.get("reporterType")
        loc_str = request.form.get("location_info") or request.form.get("locationInfo")
        if loc_str:
            import json
            try:
                location_info = json.loads(loc_str)
            except Exception:
                pass

        try:
            stt_res = SarvamService.speech_to_text(
                audio_bytes=audio_bytes,
                filename=filename,
                mime_type=mime_type,
                language_code="hi-IN"
            )
            transcript = stt_res.get("transcript", "").strip()
            detected_lang = stt_res.get("language_code", "hi-IN")
        except Exception as e:
            logger.exception("Sarvam STT failed in describe_issue")
            return jsonify({
                "status": "error",
                "message": f"Speech transcription error: {str(e)}"
            }), 500

    # 2. Handle JSON payload (audio_base64 or direct text)
    else:
        data = request.get_json(silent=True) or {}
        images = data.get("images", [])
        location_info = data.get("locationInfo") or data.get("location_info")
        reporter_type = data.get("reporterType") or data.get("reporter_type")
        group_name = data.get("groupName") or data.get("group_name") or ""

        if "audio_base64" in data and data["audio_base64"]:
            try:
                raw_b64 = data["audio_base64"]
                if "," in raw_b64:
                    raw_b64 = raw_b64.split(",", 1)[1]
                audio_bytes = base64.b64decode(raw_b64)
                stt_res = SarvamService.speech_to_text(
                    audio_bytes=audio_bytes,
                    filename="recording.webm",
                    mime_type="audio/webm",
                    language_code="hi-IN"
                )
                transcript = stt_res.get("transcript", "").strip()
                detected_lang = stt_res.get("language_code", "hi-IN")
            except Exception as e:
                logger.exception("Sarvam STT failed on base64 audio")
                return jsonify({
                    "status": "error",
                    "message": f"Speech transcription error: {str(e)}"
                }), 500
        elif "text" in data and data["text"].strip():
            transcript = data["text"].strip()

    if not transcript and not images:
        return jsonify({
            "status": "error",
            "message": "No voice audio, text, or images received for grievance description."
        }), 400

    # 3. Formulate structured grievance using Gemini AI Engine
    try:
        issue_meta = GeminiService.generate_issue_description(
            transcript=transcript or "Visual civic problem reported by citizen.",
            images=images,
            location_info=location_info,
            reporter_type=reporter_type,
            group_name=group_name
        )
        return jsonify({
            "status": "success",
            "data": {
                "transcript": transcript,
                "title": issue_meta.get("title", "Civic Grievance Report"),
                "description": issue_meta.get("description", transcript),
                "category": issue_meta.get("category", "Urban Development and Infrastructure"),
                "severity": issue_meta.get("severity", "MEDIUM"),
                "impactCount": issue_meta.get("impact_count", "100-250 local residents"),
                "impactDescription": issue_meta.get("impact_description", "Affects local residents and daily commuters."),
                "reporterType": issue_meta.get("reporter_type", reporter_type or "Individual Citizen"),
                "groupName": group_name,
                "language": detected_lang
            }
        }), 200
    except Exception as e:
        logger.exception("AI issue description generation failed")
        from app.ai.classifier import classify_problem
        classified = classify_problem(transcript)
        return jsonify({
            "status": "success",
            "data": {
                "transcript": transcript,
                "title": transcript[:40] + ("..." if len(transcript) > 40 else "") if transcript else "Civic Grievance Report",
                "description": transcript or "Civic issue reported with evidence.",
                "category": classified.get("category", "Urban Development and Infrastructure"),
                "severity": "MEDIUM",
                "impactCount": "50-150 residents",
                "impactDescription": "Local residents facing civic disruption.",
                "reporterType": reporter_type or "Individual Citizen",
                "language": detected_lang
            }
        }), 200


