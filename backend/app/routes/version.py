import os
from flask import Blueprint, jsonify, request

version_bp = Blueprint("version", __name__)

@version_bp.route("/version", methods=["GET"])
def get_app_version():
    """
    Returns the latest published mobile app version metadata for OTA / in-app updates.
    """
    latest_version = os.getenv("LATEST_APP_VERSION", "1.0.0")
    build_number = int(os.getenv("LATEST_BUILD_NUMBER", "1"))
    min_supported_version = os.getenv("MIN_SUPPORTED_APP_VERSION", "1.0.0")
    apk_download_url = os.getenv(
        "APK_DOWNLOAD_URL",
        "/downloads/setu-citizen.apk"
    )
    release_notes = os.getenv(
        "APP_RELEASE_NOTES",
        "Official Setu Citizen Release featuring TARA Voice AI, instant civic issue reporting, and real-time status tracking."
    )
    force_update = os.getenv("FORCE_APP_UPDATE", "false").lower() == "true"

    return jsonify({
        "status": "success",
        "data": {
            "app_name": "Setu Citizen",
            "package_name": "gov.sih.setu.citizen_app",
            "latest_version": latest_version,
            "build_number": build_number,
            "min_supported_version": min_supported_version,
            "apk_download_url": apk_download_url,
            "release_notes": release_notes,
            "force_update": force_update,
            "release_date": "2026-09-04",
            "file_size_mb": 28.5
        }
    }), 200
