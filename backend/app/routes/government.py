from flask import Blueprint, jsonify
from app.services.problem_service import ProblemService
from app.services.project_service import ProjectService
from app.services.funding_service import FundingService

government_bp = Blueprint("government", __name__)

@government_bp.route("/overview", methods=["GET"])
def get_dashboard_overview():
    problems = ProblemService.get_all()
    projects = ProjectService.get_all()
    grants = FundingService.get_all()
    
    total_budget_sanctioned = sum(g.get("amount", 0) for g in grants)
    
    return jsonify({
        "stats": {
            "total_grievances": len(problems),
            "critical_issues": len([p for p in problems if p.get("severity") == "CRITICAL"]),
            "active_rd_projects": len(projects),
            "total_budget_sanctioned": total_budget_sanctioned,
            "resolution_rate": "84.2%"
        },
        "recent_problems": problems[:5]
    }), 200
