import jwt
from datetime import datetime, timedelta
from flask import Blueprint, request, jsonify, current_app

auth_bp = Blueprint("auth", __name__)

DEMO_USERS = {
    "officer@jalshakti.gov.in": {
        "id": "gov-001",
        "name": "Dr. Rajesh Kumar",
        "email": "officer@jalshakti.gov.in",
        "password": "password123",
        "role": "GOVERNMENT",
        "organization": "Ministry of Jal Shakti",
        "portalUrl": "/government/dashboard"
    },
    "dean@iitd.ac.in": {
        "id": "uni-001",
        "name": "Prof. Anita Sharma",
        "email": "dean@iitd.ac.in",
        "password": "password123",
        "role": "UNIVERSITY",
        "organization": "IIT Delhi - R&D Cell",
        "portalUrl": "/university/dashboard"
    },
    "csr@tatacleantech.com": {
        "id": "ind-001",
        "name": "Vikram Malhotra",
        "email": "csr@tatacleantech.com",
        "password": "password123",
        "role": "INDUSTRY",
        "organization": "Tata CleanTech",
        "portalUrl": "/industry/dashboard"
    },
    "citizen@gmail.com": {
        "id": "cit-001",
        "name": "Rahul Verma",
        "email": "citizen@gmail.com",
        "password": "password123",
        "role": "CITIZEN",
        "organization": "Public Citizen",
        "portalUrl": "/government/dashboard"
    }
}

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json() or {}
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    user = DEMO_USERS.get(email)
    if not user or user["password"] != password:
        # Check if dummy user creation requested or fallback
        if email and password:
            role = data.get("role", "CITIZEN")
            user = {
                "id": f"usr-{datetime.utcnow().timestamp()}",
                "name": email.split("@")[0].capitalize(),
                "email": email,
                "role": role,
                "organization": data.get("organization", "Portal User"),
                "portalUrl": f"/{role.lower()}/dashboard" if role in ["GOVERNMENT", "UNIVERSITY", "INDUSTRY"] else "/government/dashboard"
            }
        else:
            return jsonify({"error": "Invalid email or password"}), 401

    token_payload = {
        "sub": user["id"],
        "name": user["name"],
        "email": user["email"],
        "role": user["role"],
        "organization": user.get("organization", ""),
        "exp": datetime.utcnow() + timedelta(hours=24)
    }

    token = jwt.encode(token_payload, current_app.config["SECRET_KEY"], algorithm="HS256")

    return jsonify({
        "message": "Login successful",
        "token": token,
        "user": {
            "id": user["id"],
            "name": user["name"],
            "email": user["email"],
            "role": user["role"],
            "organization": user.get("organization", "")
        },
        "portalUrl": user["portalUrl"]
    }), 200

@auth_bp.route("/me", methods=["GET"])
def get_current_user():
    auth_header = request.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer "):
        return jsonify({"error": "Missing token"}), 401
    
    token = auth_header.split(" ")[1]
    try:
        payload = jwt.decode(token, current_app.config["SECRET_KEY"], algorithms=["HS256"])
        return jsonify({"user": payload}), 200
    except Exception as e:
        return jsonify({"error": "Invalid token"}), 401
