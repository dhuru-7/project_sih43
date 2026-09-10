"""
Bhashini & IndicTrans2 Translation API Route
Government of India / MeitY / AI4Bharat Translation Gateway for Setu
Supports 22 Scheduled Indian Languages + Jharkhand Dialects
"""

import os
import requests
from flask import Blueprint, request, jsonify

bhashini_bp = Blueprint("bhashini", __name__)

# Common civic and administrative terminology cache for instant lookup
CIVIC_DICTIONARY = {
    "hi": {
        "civic issue": "नागरिक समस्या",
        "pothole": "सड़क का गड्ढा",
        "water supply": "जल आपूर्ति",
        "street light": "स्ट्रीट लाइट",
        "garbage": "कचरा",
        "drainage": "जल निकासी",
        "electricity": "बिजली",
        "hospital": "अस्पताल",
        "school": "विद्यालय",
        "cleanliness": "स्वच्छता",
        "grant": "अनुदान",
        "research project": "अनुसंधान परियोजना",
        "approved": "स्वीकृत",
        "pending": "लंबित",
        "resolved": "समाधानित"
    },
    "sat": {
        "civic issue": "ᱟᱹᱛᱩ ᱮᱴᱠᱮᱴᱚᱬᱮ",
        "pothole": "ᱦᱚᱨ ᱜᱟᱹᱦᱤᱨ",
        "water supply": "ᱫᱟᱜ ᱧᱟᱢ",
        "electricity": "ᱵᱤᱡᱽᱞᱤ",
        "resolved": "ᱥᱚᱞᱦᱮᱭᱮᱱᱟ"
    },
    "bn": {
        "civic issue": "পৌর সমস্যা",
        "pothole": "রাস্তার গর্ত",
        "water supply": "জল সরবরাহ",
        "electricity": "বিদ্যুৎ",
        "resolved": "সমাধান হয়েছে"
    }
}

@bhashini_bp.route("/translate", methods=["POST"])
def translate_text():
    """
    Translates input text using Bhashini (AI4Bharat IndicTrans2) pipeline
    with graceful fallback to civic vocabulary cache.
    """
    data = request.get_json() or {}
    text = data.get("text", "").strip()
    target_lang = data.get("target_lang", "hi").lower()
    source_lang = data.get("source_lang", "en").lower()

    if not text:
        return jsonify({"error": "No text provided"}), 400

    if target_lang == source_lang:
        return jsonify({
            "translated_text": text,
            "engine": "identity",
            "target_lang": target_lang
        }), 200

    # 1. Check quick in-memory civic dictionary
    lower_text = text.lower()
    if target_lang in CIVIC_DICTIONARY and lower_text in CIVIC_DICTIONARY[target_lang]:
        return jsonify({
            "translated_text": CIVIC_DICTIONARY[target_lang][lower_text],
            "engine": "bhashini_civic_cache",
            "target_lang": target_lang
        }), 200

    # 2. Check if Bhashini API credentials exist
    bhashini_user_id = os.environ.get("BHASHINI_USER_ID")
    bhashini_api_key = os.environ.get("BHASHINI_API_KEY")
    bhashini_pipeline_id = os.environ.get("BHASHINI_PIPELINE_ID")

    if bhashini_user_id and bhashini_api_key:
        try:
            # Official Bhashini ULCA Pipeline Request
            headers = {
                "userID": bhashini_user_id,
                "ulcaApiKey": bhashini_api_key,
                "Content-Type": "application/json"
            }
            payload = {
                "pipelineTasks": [
                    {
                        "taskType": "translation",
                        "config": {
                            "language": {
                                "sourceLanguage": source_lang,
                                "targetLanguage": target_lang
                            }
                        }
                    }
                ],
                "inputData": {
                    "input": [{"source": text}]
                }
            }
            res = requests.post(
                "https://dhruva-api.bhashini.gov.in/services/inference/pipeline",
                json=payload,
                headers=headers,
                timeout=5
            )
            if res.status_code == 200:
                result = res.json()
                translated = result["pipelineResponse"][0]["output"][0]["target"]
                return jsonify({
                    "translated_text": translated,
                    "engine": "bhashini_gov_cloud",
                    "target_lang": target_lang
                }), 200
        except Exception as e:
            # Fall back smoothly
            pass

    # 3. Graceful fallback preserving text
    return jsonify({
        "translated_text": text,
        "engine": "bhashini_passthrough_fallback",
        "target_lang": target_lang,
        "note": "Bhashini AI4Bharat ready. Configure BHASHINI_API_KEY for live cloud pipeline."
    }), 200


@bhashini_bp.route("/languages", methods=["GET"])
def get_supported_languages():
    """List 22 scheduled Indian languages supported by Bhashini"""
    return jsonify({
        "total": 22,
        "primary_state": "Jharkhand",
        "top_state_languages": ["hi", "en", "sat", "kht", "bn", "ur", "nag", "unr", "kru", "hoc", "mai", "bho", "mag", "or"],
        "pipeline": "AI4Bharat IndicTrans2"
    }), 200
