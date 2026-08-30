from flask import Blueprint, jsonify
from app.services.funding_service import FundingService

funding_bp = Blueprint("funding", __name__)

@funding_bp.route("", methods=["GET"])
def list_funding():
    grants = FundingService.get_all()
    return jsonify({"count": len(grants), "data": grants}), 200
