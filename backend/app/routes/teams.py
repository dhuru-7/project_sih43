from flask import Blueprint, jsonify

teams_bp = Blueprint("teams", __name__)

@teams_bp.route("", methods=["GET"])
def list_teams():
    return jsonify({
        "teams": [
            {
                "id": "team-01",
                "name": "EcoTech Innovations",
                "university": "IIT Delhi",
                "membersCount": 5,
                "domain": "Water & Sanitation"
            }
        ]
    }), 200
