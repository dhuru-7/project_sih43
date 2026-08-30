from flask import Blueprint, jsonify
from app.services.project_service import ProjectService

projects_bp = Blueprint("projects", __name__)

@projects_bp.route("", methods=["GET"])
def list_projects():
    projects = ProjectService.get_all()
    return jsonify({"count": len(projects), "data": projects}), 200

@projects_bp.route("/<project_id>", methods=["GET"])
def get_project(project_id):
    project = ProjectService.get_by_id(project_id)
    if not project:
        return jsonify({"error": "Project not found"}), 404
    return jsonify({"data": project}), 200
