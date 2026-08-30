from flask import Blueprint, jsonify
from app.services.problem_service import ProblemService

analytics_bp = Blueprint("analytics", __name__)

@analytics_bp.route("/grievances-by-category", methods=["GET"])
def grievances_by_category():
    problems = ProblemService.get_all()
    breakdown = {}
    for p in problems:
        cat = p.get("category", "OTHER")
        breakdown[cat] = breakdown.get(cat, 0) + 1
    return jsonify({"breakdown": breakdown}), 200

@analytics_bp.route("/resolution-trends", methods=["GET"])
def resolution_trends():
    return jsonify({
        "months": ["Apr", "May", "Jun", "Jul", "Aug"],
        "reported": [45, 62, 78, 91, 110],
        "resolved": [38, 54, 70, 85, 98]
    }), 200
