from flask import Blueprint, jsonify
from app.services.university_service import UniversityService
from app.services.project_service import ProjectService

universities_bp = Blueprint("universities", __name__)

@universities_bp.route("", methods=["GET"])
def list_universities():
    unis = UniversityService.get_all()
    return jsonify({"count": len(unis), "data": unis}), 200

@universities_bp.route("/overview", methods=["GET"])
def university_overview():
    projects = ProjectService.get_all()
    return jsonify({
        "stats": {
            "active_challenges": 12,
            "submitted_proposals": 4,
            "ongoing_projects": len(projects),
            "total_grants_received": 250000
        },
        "projects": projects
    }), 200
