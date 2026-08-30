from flask import Blueprint, jsonify
from app.services.industry_service import IndustryService

industry_bp = Blueprint("industry", __name__)

@industry_bp.route("", methods=["GET"])
def list_industries():
    industries = IndustryService.get_all()
    return jsonify({"count": len(industries), "data": industries}), 200

@industry_bp.route("/overview", methods=["GET"])
def industry_overview():
    return jsonify({
        "stats": {
            "sponsored_challenges": 6,
            "allocated_csr_funds": 1300000,
            "active_mentorships": 14,
            "ip_licensed": 2
        }
    }), 200
