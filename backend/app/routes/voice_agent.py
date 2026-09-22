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
    Transcribes via Saaras v3 -> generates reply via Sarvam 105B -> synthesizes via Bulbul v3.
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
        logger.warning(f"Sarvam STT failed in /transcribe ({e})")
        return jsonify({
            "status": "success",
            "data": {
                "transcript": "",
                "language": "hi-IN",
                "warning": "Speech transcription is currently unavailable."
            }
        }), 200

@voice_agent_bp.route("/describe-issue", methods=["POST"])
def describe_issue():
    """
    Primary Problem Report Synthesis Engine powered purely by Sarvam 105B.
    Accepts spoken audio (multipart or base64) or direct text, along with attached photos,
    video frame thumbnails, and reverse geocoded location.
    1. Transcribes audio via Sarvam Saaras v3 STT.
    2. Synthesizes an evidence-grounded problem report with title, 1 of 17 official categories,
       severity vs urgency, factual potential impact, and suggested routing using Sarvam 105B.
    3. Falls back to local rule-based classifier if Sarvam is unreachable.
    """
    from app.services.sarvam_service import SarvamService

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
            "message": "No voice audio, text, or images received for problem description."
        }), 400

    visual_summary = ""
    if images and len(images) > 0:
        visual_summary = f"{len(images)} on-site photo(s)/media item(s) attached by citizen."

    # If citizen attached media without typing/speaking notes, use visual summary as primary observation
    if not transcript.strip() and visual_summary.strip():
        transcript = f"Visual on-site evidence observed: {visual_summary.strip()}"

    # 4. Formulate structured problem report using Sarvam 105B
    issue_meta = None
    try:
        logger.info("Synthesizing problem report using Sarvam 105B...")
        issue_meta = SarvamService.generate_issue_description(
            transcript=transcript or "Civic problem reported with attached media evidence.",
            visual_summary=visual_summary,
            location_info=location_info,
            reporter_type=reporter_type or "Individual Citizen",
            group_name=group_name
        )
    except Exception as sarvam_err:
        logger.warning(f"Sarvam 105B synthesis unavailable ({sarvam_err}), falling back to local classifier...")
        issue_meta = None

    if issue_meta:
        # Extract potential impact array
        pot_impact = issue_meta.get("potential_impact") or [
            "Inspection and maintenance operational concern",
            "Potential safety concern for surrounding area",
            "Infrastructure clutter and access constraint"
        ]
        if isinstance(pot_impact, str):
            pot_impact = [s.strip(" •-") for s in pot_impact.split("\n") if s.strip()]

        # Extract AI observations
        ai_obs = issue_meta.get("ai_observations") or {
            "observed": ["Observed physical condition documented via submitted media."],
            "potential_inference": ["Potential operational impact subject to on-site evaluation."]
        }

        # Extract suggested routing
        routing = issue_meta.get("suggested_routing") or {
            "stakeholders": issue_meta.get("department") or "Relevant utility / infrastructure stakeholders",
            "collaboration_potential": "Potential opportunity for university/engineering teams to explore structured solutions."
        }

        stakeholders_val = routing.get("stakeholders") if isinstance(routing, dict) else str(routing)

        return jsonify({
            "status": "success",
            "data": {
                "transcript": transcript,
                "title": issue_meta.get("title", "Observed Problem Report"),
                "description": issue_meta.get("description", transcript),
                "category": issue_meta.get("category", "Urban Development and Infrastructure"),
                "subcategory": issue_meta.get("subcategory", "General Infrastructure"),
                "issueType": issue_meta.get("issue_type") or issue_meta.get("title", "Observed Problem"),
                "severity": issue_meta.get("severity", "MEDIUM"),
                "urgency": issue_meta.get("urgency", "MEDIUM"),
                "potentialImpact": pot_impact,
                "aiObservations": ai_obs,
                "suggestedRouting": routing,
                "impactCount": "Local vicinity",
                "impactDescription": " • ".join(pot_impact[:3]),
                "department": stakeholders_val or "Relevant utility / infrastructure stakeholders",
                "reporterType": issue_meta.get("reporter_type") or reporter_type or "Individual Citizen",
                "groupName": group_name,
                "language": detected_lang,
                "visualSummary": visual_summary
            }
        }), 200

    # Final NLP Fallback using 17 categories classifier
    from app.ai.classifier import classify_problem
    classified = classify_problem(transcript)
    fallback_title = transcript[:45] + ("..." if len(transcript) > 45 else "") if transcript else "Observed Problem Report"
    default_impact = [
        "Inspection and maintenance operational concern",
        "Potential safety concern for surrounding area",
        "Infrastructure clutter and access constraint"
    ]
    return jsonify({
        "status": "success",
        "data": {
            "transcript": transcript,
            "title": fallback_title,
            "description": transcript or "Problem report documented with attached media evidence.",
            "category": classified.get("category", "Urban Development and Infrastructure"),
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
            "reporterType": reporter_type or "Individual Citizen",
            "groupName": group_name,
            "language": detected_lang,
            "visualSummary": visual_summary
        }
    }), 200

