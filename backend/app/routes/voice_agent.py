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

@voice_agent_bp.route("/transcribe", methods=["POST"])
def transcribe_audio():
    """
    Dedicated Speech-to-Text endpoint using Sarvam Saaras v3.
    Accepts multipart audio/video file ('audio' or 'file') or JSON {'audio_base64': '...'}.
    Returns the verbatim transcript in Marathi, Hindi, English, etc.
    """
    from app.services.sarvam_service import SarvamService

    audio_bytes = None
    filename = "recording.webm"
    mime_type = "audio/webm"

    if "audio" in request.files or "file" in request.files:
        audio_file = request.files.get("audio") or request.files.get("file")
        audio_bytes = audio_file.read()
        filename = audio_file.filename or "recording.webm"
        mime_type = audio_file.mimetype or "audio/webm"
    else:
        data = request.get_json(silent=True) or {}
        raw_b64 = data.get("audio_base64") or data.get("audio")
        if raw_b64:
            if "," in raw_b64:
                raw_b64 = raw_b64.split(",", 1)[1]
            try:
                audio_bytes = base64.b64decode(raw_b64)
            except Exception as e:
                logger.error(f"Failed to decode base64 audio: {e}")

    if not audio_bytes:
        return jsonify({
            "status": "error",
            "message": "No audio data provided."
        }), 400

    try:
        # Normalize mime_type if video/mp4 was sent by mistake
        if mime_type == "video/mp4":
            mime_type = "video/webm"

        stt_res = SarvamService.speech_to_text(
            audio_bytes=audio_bytes,
            filename=filename,
            mime_type=mime_type,
            language_code="hi-IN"
        )
        return jsonify({
            "status": "success",
            "data": {
                "transcript": stt_res.get("transcript", "").strip(),
                "language": stt_res.get("language_code", "hi-IN")
            }
        }), 200
    except Exception as e:
        logger.exception("Sarvam STT failed in /transcribe")
        return jsonify({
            "status": "error",
            "message": f"Transcription error: {str(e)}"
        }), 500

@voice_agent_bp.route("/describe-issue", methods=["POST"])
def describe_issue():
    """
    Primary Civic Grievance Synthesis Engine powered by Sarvam 105B.
    Accepts spoken audio (multipart or base64) or direct text, along with attached photos,
    video frame thumbnails, and reverse geocoded location.
    1. Transcribes audio via Sarvam Saaras v3 STT.
    2. Gathers visual scene summary from photos/video frames via Gemini vision (if available).
    3. Synthesizes a formal, actionable civic grievance with title, 1 of 17 official categories,
       severity, description, and impact estimate using Sarvam 105B.
    4. Falls back to Gemini and rule-based classifier if remote services encounter limits.
    """
    from app.services.sarvam_service import SarvamService
    from app.services.gemini_service import GeminiService

    transcript = ""
    detected_lang = "hi-IN"
    images = []
    location_info = None
    reporter_type = None
    group_name = ""
    video_transcript = ""
    voice_transcript = ""
    user_notes = ""

    # 1. Handle multipart audio file
    if "audio" in request.files or "file" in request.files:
        audio_file = request.files.get("audio") or request.files.get("file")
        audio_bytes = audio_file.read()
        filename = audio_file.filename or "recording.webm"
        mime_type = audio_file.mimetype or "audio/webm"

        # Check for location / reporter / transcripts in form
        reporter_type = request.form.get("reporter_type") or request.form.get("reporterType")
        group_name = request.form.get("group_name") or request.form.get("groupName") or ""
        video_transcript = request.form.get("video_transcript") or request.form.get("videoTranscript") or ""
        voice_transcript = request.form.get("voice_transcript") or request.form.get("voiceTranscript") or ""
        user_notes = request.form.get("text") or request.form.get("notepadText") or ""
        loc_str = request.form.get("location_info") or request.form.get("locationInfo")
        if loc_str:
            import json
            try:
                location_info = json.loads(loc_str)
            except Exception:
                pass

        try:
            if mime_type == "video/mp4":
                mime_type = "video/webm"
            stt_res = SarvamService.speech_to_text(
                audio_bytes=audio_bytes,
                filename=filename,
                mime_type=mime_type,
                language_code="hi-IN"
            )
            transcript = stt_res.get("transcript", "").strip()
            voice_transcript = transcript
            detected_lang = stt_res.get("language_code", "hi-IN")
        except Exception as e:
            logger.exception("Sarvam STT failed in describe_issue multipart")

    # 2. Handle JSON payload (audio_base64 or direct text + images)
    else:
        data = request.get_json(silent=True) or {}
        images = data.get("images", [])
        location_info = data.get("locationInfo") or data.get("location_info")
        reporter_type = data.get("reporterType") or data.get("reporter_type")
        group_name = data.get("groupName") or data.get("group_name") or ""
        video_transcript = data.get("videoTranscript") or data.get("video_transcript") or ""
        voice_transcript = data.get("voiceTranscript") or data.get("voice_transcript") or ""
        user_notes = data.get("text") or data.get("notepadText") or ""

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
                voice_transcript = transcript
                detected_lang = stt_res.get("language_code", "hi-IN")
            except Exception as e:
                logger.exception("Sarvam STT failed on base64 audio")
        elif user_notes.strip():
            transcript = user_notes.strip()

        # Combine transcripts for fallback classifiers if needed
        full_transcript_parts = []
        if user_notes.strip():
            full_transcript_parts.append(user_notes.strip())
        if voice_transcript.strip() and voice_transcript.strip() not in user_notes:
            full_transcript_parts.append(f"[Spoken Voice Note: {voice_transcript.strip()}]")
        if video_transcript.strip():
            full_transcript_parts.append(f"[Spoken in Video: {video_transcript.strip()}]")
        if full_transcript_parts:
            transcript = "\n".join(full_transcript_parts)

    if not transcript and not images:
        return jsonify({
            "status": "error",
            "message": "No voice audio, text, or images received for grievance description."
        }), 400

    # 3. Extract visual scene summary from photos and video frame thumbnails (if available)
    visual_summary = ""
    if images and len(images) > 0:
        try:
            visual_summary = GeminiService.describe_visual_evidence(images)
        except Exception as e:
            logger.warning(f"Visual evidence extraction failed (non-critical): {e}")

    # 4. Formulate structured grievance using Groq LLM Mind (llama-3.3-70b-versatile) as PRIMARY engine
    issue_meta = None
    from app.services.groq_service import GroqService
    try:
        logger.info("Synthesizing civic grievance using Groq LLM Mind...")
        issue_meta = GroqService.synthesize_grievance_report(
            video_transcripts=video_transcript or "",
            voice_transcript=voice_transcript or "",
            user_text=user_notes or transcript or "",
            visual_summary=visual_summary or "",
            location_info=location_info,
            reporter_type=reporter_type or "Individual Citizen",
            group_name=group_name
        )
    except Exception as groq_err:
        logger.warning(f"Groq synthesis failed ({groq_err}), falling back to Sarvam 105B...")
        try:
            issue_meta = SarvamService.generate_issue_description(
                transcript=transcript or "Visual civic issue observed and reported with attached media evidence.",
                visual_summary=visual_summary,
                location_info=location_info,
                reporter_type=reporter_type or "Individual Citizen",
                group_name=group_name
            )
        except Exception as sarvam_err:
            logger.warning(f"Sarvam 105B fallback failed ({sarvam_err}), trying Gemini fallback...")
            try:
                issue_meta = GeminiService.generate_issue_description(
                    transcript=transcript or "Visual civic problem reported by citizen.",
                    images=images,
                    location_info=location_info,
                    reporter_type=reporter_type,
                    group_name=group_name
                )
            except Exception as gemini_err:
                logger.exception(f"Gemini fallback also failed ({gemini_err}), falling back to NLP classifier...")

    if issue_meta:
        return jsonify({
            "status": "success",
            "data": {
                "transcript": transcript,
                "title": issue_meta.get("title", "Civic Grievance Report"),
                "description": issue_meta.get("description", transcript),
                "category": issue_meta.get("category", "Urban Development and Infrastructure"),
                "severity": issue_meta.get("severity", "MEDIUM"),
                "impactCount": issue_meta.get("impact_count") or issue_meta.get("impactCount") or "100-250 local residents",
                "impactDescription": issue_meta.get("impact_description") or issue_meta.get("impactDescription") or "Affects local residents and daily commuters.",
                "department": issue_meta.get("department", "Municipal Corporation"),
                "reporterType": issue_meta.get("reporter_type") or reporter_type or "Individual Citizen",
                "groupName": group_name,
                "language": detected_lang,
                "visualSummary": visual_summary
            }
        }), 200

    # Final NLP Fallback using 17 categories classifier
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
            "groupName": group_name,
            "language": detected_lang
        }
    }), 200



