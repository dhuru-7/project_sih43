from flask import Blueprint, request, jsonify
from app.services.problem_service import ProblemService

problems_bp = Blueprint("problems", __name__)

@problems_bp.route("", methods=["GET"])
def list_problems():
    category = request.args.get("category")
    status = request.args.get("status")
    problems = ProblemService.get_all(category, status)
    return jsonify({"count": len(problems), "data": problems}), 200

@problems_bp.route("/<problem_id>", methods=["GET"])
def get_problem(problem_id):
    problem = ProblemService.get_by_id(problem_id)
    if not problem:
        return jsonify({"error": "Problem not found"}), 404
    return jsonify({"data": problem}), 200

@problems_bp.route("", methods=["POST"])
def submit_problem():
    data = request.get_json() or {}
    if not data.get("title") or not data.get("description"):
        return jsonify({"error": "Title and description are required"}), 400
        
    created = ProblemService.create_problem(data)
    return jsonify({
        "message": "Problem submitted successfully and processed by AI engines",
        "data": created
    }), 201
