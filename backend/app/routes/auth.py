import uuid
import random
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

# ==============================================================================
# 10 DUMMY AADHAAR ACCOUNTS
# 3 Dev accounts (Reserved for Dev team, manual entry only) + 7 Prototype accounts
# ==============================================================================
AADHAAR_ACCOUNTS_DB = {
    # --- 3 DEV ACCOUNTS (Reserved for Devs, Manual Entry Only) ---
    "234567890123": {
        "id": "dev-001",
        "name": "Dhruv Gautam",
        "aadhaar": "234567890123",
        "formattedAadhaar": "2345 6789 0123",
        "maskedAadhaar": "XXXX XXXX 0123",
        "mobile": "+91 98765 43210",
        "maskedMobile": "+91 98765 XXXXX",
        "dob": "2002-04-15",
        "gender": "Male",
        "address": "Kanke Road, Near Central University",
        "district": "Ranchi",
        "state": "Jharkhand",
        "pincode": "834008",
        "role": "CITIZEN",
        "designation": "Developer Team Lead",
        "isDevAccount": True,
        "activeSessionId": None,
        "lastOtp": "482910"
    },
    "345678901234": {
        "id": "dev-002",
        "name": "Hoomandeep",
        "aadhaar": "345678901234",
        "formattedAadhaar": "3456 7890 1234",
        "maskedAadhaar": "XXXX XXXX 1234",
        "mobile": "+91 98765 43211",
        "maskedMobile": "+91 98765 XXXXX",
        "dob": "2003-08-22",
        "gender": "Male",
        "address": "Bistupur Main Road, Near Jubilee Park",
        "district": "Jamshedpur",
        "state": "Jharkhand",
        "pincode": "831001",
        "role": "CITIZEN",
        "designation": "Core Architecture Dev",
        "isDevAccount": True,
        "activeSessionId": None,
        "lastOtp": "591024"
    },
    "456789012345": {
        "id": "dev-003",
        "name": "Prathna",
        "aadhaar": "456789012345",
        "formattedAadhaar": "4567 8901 2345",
        "maskedAadhaar": "XXXX XXXX 2345",
        "mobile": "+91 98765 43212",
        "maskedMobile": "+91 98765 XXXXX",
        "dob": "2003-11-10",
        "gender": "Female",
        "address": "Saraidhela, Near BIT Campus",
        "district": "Dhanbad",
        "state": "Jharkhand",
        "pincode": "828127",
        "role": "CITIZEN",
        "designation": "UI & UX Design Engineer",
        "isDevAccount": True,
        "activeSessionId": None,
        "lastOtp": "683109"
    },

    # --- 7 GENERAL PROTOTYPE ACCOUNTS ---
    "567890123456": {
        "id": "cit-001",
        "name": "Rahul Verma",
        "aadhaar": "567890123456",
        "formattedAadhaar": "5678 9012 3456",
        "maskedAadhaar": "XXXX XXXX 3456",
        "mobile": "+91 98123 45670",
        "maskedMobile": "+91 98123 XXXXX",
        "dob": "1998-05-14",
        "gender": "Male",
        "address": "Morabadi Ground Road, Ward 4",
        "district": "Ranchi",
        "state": "Jharkhand",
        "pincode": "834008",
        "role": "CITIZEN",
        "isDevAccount": False,
        "isDefault": True,
        "activeSessionId": None,
        "lastOtp": "742918"
    },
    "678901234567": {
        "id": "cit-002",
        "name": "Anjali Soren",
        "aadhaar": "678901234567",
        "formattedAadhaar": "6789 0123 4567",
        "maskedAadhaar": "XXXX XXXX 4567",
        "mobile": "+91 98123 45671",
        "maskedMobile": "+91 98123 XXXXX",
        "dob": "2001-09-18",
        "gender": "Female",
        "address": "Jail Road, Ward 12",
        "district": "Dumka",
        "state": "Jharkhand",
        "pincode": "814101",
        "role": "CITIZEN",
        "isDevAccount": False,
        "activeSessionId": None,
        "lastOtp": "319482"
    },
    "789012345678": {
        "id": "cit-003",
        "name": "Amit Kumar Singh",
        "aadhaar": "789012345678",
        "formattedAadhaar": "7890 1234 5678",
        "maskedAadhaar": "XXXX XXXX 5678",
        "mobile": "+91 98123 45672",
        "maskedMobile": "+91 98123 XXXXX",
        "dob": "1995-12-03",
        "gender": "Male",
        "address": "Korrah Road, Ward 8",
        "district": "Hazaribagh",
        "state": "Jharkhand",
        "pincode": "825301",
        "role": "CITIZEN",
        "isDevAccount": False,
        "activeSessionId": None,
        "lastOtp": "852147"
    },
    "890123456789": {
        "id": "cit-004",
        "name": "Pooja Kumari",
        "aadhaar": "890123456789",
        "formattedAadhaar": "8901 2345 6789",
        "maskedAadhaar": "XXXX XXXX 6789",
        "mobile": "+91 98123 45673",
        "maskedMobile": "+91 98123 XXXXX",
        "dob": "2000-03-27",
        "gender": "Female",
        "address": "Sector 4, Bokaro Steel City",
        "district": "Bokaro",
        "state": "Jharkhand",
        "pincode": "827004",
        "role": "CITIZEN",
        "isDevAccount": False,
        "activeSessionId": None,
        "lastOtp": "963258"
    },
    "901234567890": {
        "id": "cit-005",
        "name": "Birsa Munda Jr.",
        "aadhaar": "901234567890",
        "formattedAadhaar": "9012 3456 7890",
        "maskedAadhaar": "XXXX XXXX 7890",
        "mobile": "+91 98123 45674",
        "maskedMobile": "+91 98123 XXXXX",
        "dob": "1999-07-11",
        "gender": "Male",
        "address": "Main Bazar, Ulihatu Link Road",
        "district": "Khunti",
        "state": "Jharkhand",
        "pincode": "835210",
        "role": "CITIZEN",
        "isDevAccount": False,
        "activeSessionId": None,
        "lastOtp": "147258"
    },
    "123456789012": {
        "id": "cit-006",
        "name": "Sunita Devi",
        "aadhaar": "123456789012",
        "formattedAadhaar": "1234 5678 9012",
        "maskedAadhaar": "XXXX XXXX 9012",
        "mobile": "+91 98123 45675",
        "maskedMobile": "+91 98123 XXXXX",
        "dob": "1992-10-05",
        "gender": "Female",
        "address": "Castairs Town, Near Tower Chowk",
        "district": "Deoghar",
        "state": "Jharkhand",
        "pincode": "814112",
        "role": "CITIZEN",
        "isDevAccount": False,
        "activeSessionId": None,
        "lastOtp": "369258"
    },
    "987654321098": {
        "id": "cit-007",
        "name": "Vikash Oraon",
        "aadhaar": "987654321098",
        "formattedAadhaar": "9876 5432 1098",
        "maskedAadhaar": "XXXX XXXX 1098",
        "mobile": "+91 98123 45676",
        "maskedMobile": "+91 98123 XXXXX",
        "dob": "1997-01-30",
        "gender": "Male",
        "address": "Sisai Road, Ward 3",
        "district": "Gumla",
        "state": "Jharkhand",
        "pincode": "835207",
        "role": "CITIZEN",
        "isDevAccount": False,
        "activeSessionId": None,
        "lastOtp": "258147"
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

# ==============================================================================
# AADHAAR E-KYC AUTHENTICATION ENDPOINTS
# ==============================================================================

@auth_bp.route("/aadhaar/accounts", methods=["GET"])
def get_aadhaar_accounts():
    """Returns the list of 10 dummy Aadhaar accounts for prototype reference with active login status."""
    accounts = []
    for uid, acc in AADHAAR_ACCOUNTS_DB.items():
        accounts.append({
            "id": acc["id"],
            "name": acc["name"],
            "aadhaar": acc["aadhaar"],
            "formattedAadhaar": acc["formattedAadhaar"],
            "maskedAadhaar": acc["maskedAadhaar"],
            "maskedMobile": acc["maskedMobile"],
            "district": acc["district"],
            "isDevAccount": acc.get("isDevAccount", False),
            "isDefault": acc.get("isDefault", False),
            "designation": acc.get("designation", ""),
            "lastOtp": acc.get("lastOtp", "123456"),
            "isLoggedIn": bool(acc.get("activeSessionId"))
        })
    return jsonify({"accounts": accounts}), 200

@auth_bp.route("/aadhaar/available-account", methods=["GET"])
def get_available_aadhaar_account():
    """
    Returns an available citizen Aadhaar account that is NOT currently logged in
    by anyone, preventing collision logouts when multiple testers/evaluators test Setu.
    """
    citizen_accounts = [
        acc for acc in AADHAAR_ACCOUNTS_DB.values()
        if not acc.get("isDevAccount", False)
    ]
    
    # Filter for accounts that have no active session
    available = [acc for acc in citizen_accounts if not acc.get("activeSessionId")]
    
    chosen = available[0] if available else citizen_accounts[0]
    
    return jsonify({
        "success": True,
        "account": {
            "id": chosen["id"],
            "name": chosen["name"],
            "aadhaar": chosen["aadhaar"],
            "aadhaarParts": [chosen["aadhaar"][:4], chosen["aadhaar"][4:8], chosen["aadhaar"][8:]],
            "formattedAadhaar": chosen["formattedAadhaar"],
            "maskedAadhaar": chosen["maskedAadhaar"],
            "maskedMobile": chosen["maskedMobile"],
            "district": chosen["district"],
            "lastOtp": chosen.get("lastOtp", "123456"),
            "isLoggedIn": bool(chosen.get("activeSessionId"))
        },
        "availableCount": len(available),
        "totalCitizenAccounts": len(citizen_accounts)
    }), 200

@auth_bp.route("/aadhaar/logout", methods=["POST"])
def aadhaar_logout():
    """Clears active session for an Aadhaar account on logout."""
    data = request.get_json() or {}
    raw_aadhaar = str(data.get("aadhaarNumber", "")).replace(" ", "").replace("-", "").strip()
    session_id = data.get("sessionId", "")
    
    account = AADHAAR_ACCOUNTS_DB.get(raw_aadhaar)
    if account:
        if not session_id or account.get("activeSessionId") == session_id:
            account["activeSessionId"] = None
    return jsonify({"success": True, "message": "Logged out successfully"}), 200

@auth_bp.route("/aadhaar/request-otp", methods=["POST"])
def request_aadhaar_otp():
    """Simulates UIDAI e-KYC OTP dispatch to citizen's registered mobile."""
    data = request.get_json() or {}
    raw_aadhaar = str(data.get("aadhaarNumber", "")).replace(" ", "").replace("-", "").strip()

    if len(raw_aadhaar) != 12 or not raw_aadhaar.isdigit():
        return jsonify({"error": "Please enter a valid 12-digit Aadhaar number"}), 400

    account = AADHAAR_ACCOUNTS_DB.get(raw_aadhaar)
    if not account:
        # Create a dynamic prototype citizen record if unknown 12-digit provided
        account = {
            "id": f"cit-{raw_aadhaar[-4:]}",
            "name": f"Citizen {raw_aadhaar[-4:]}",
            "aadhaar": raw_aadhaar,
            "formattedAadhaar": f"{raw_aadhaar[:4]} {raw_aadhaar[4:8]} {raw_aadhaar[8:]}",
            "maskedAadhaar": f"XXXX XXXX {raw_aadhaar[-4:]}",
            "mobile": "+91 98000 00000",
            "maskedMobile": "+91 98000 XXXXX",
            "dob": "1996-06-15",
            "gender": "Citizen",
            "address": "Ranchi Municipal Area",
            "district": "Ranchi",
            "state": "Jharkhand",
            "pincode": "834001",
            "role": "CITIZEN",
            "isDevAccount": False,
            "activeSessionId": None,
            "lastOtp": None
        }
        AADHAAR_ACCOUNTS_DB[raw_aadhaar] = account

    # Generate or reuse mock 6-digit OTP
    demo_otp = str(random.randint(100000, 999999)) if not account.get("lastOtp") else account["lastOtp"]
    account["lastOtp"] = demo_otp

    return jsonify({
        "success": True,
        "message": "OTP generated and dispatched to registered mobile",
        "userName": account["name"],
        "maskedMobile": account["maskedMobile"],
        "maskedAadhaar": account["maskedAadhaar"],
        "district": account["district"],
        "otp": demo_otp, # Returned explicitly for on-screen prototype simulation
        "isDevAccount": account.get("isDevAccount", False)
    }), 200

@auth_bp.route("/aadhaar/verify-otp", methods=["POST"])
def verify_aadhaar_otp():
    """
    Verifies citizen OTP, provisions e-KYC profile, and enforces single-session concurrency.
    Signing in invalidates any prior active session for this Aadhaar ID.
    """
    data = request.get_json() or {}
    raw_aadhaar = str(data.get("aadhaarNumber", "")).replace(" ", "").replace("-", "").strip()
    user_otp = str(data.get("otp", "")).strip()

    if not raw_aadhaar or not user_otp:
        return jsonify({"error": "Aadhaar number and OTP are required"}), 400

    account = AADHAAR_ACCOUNTS_DB.get(raw_aadhaar)
    if not account:
        return jsonify({"error": "Aadhaar record not found in system"}), 404

    # Allow configured OTP or universal master test OTP '123456'
    expected_otp = account.get("lastOtp")
    if user_otp != expected_otp and user_otp != "123456":
        return jsonify({"error": "Invalid verification OTP. Please check the code."}), 401

    # SINGLE-SESSION CONCURRENCY ENFORCEMENT:
    # Generate new session UUID; assigning it supersedes and invalidates any previous session!
    new_session_id = f"sess-{uuid.uuid4().hex[:12]}"
    previous_session = account.get("activeSessionId")
    account["activeSessionId"] = new_session_id

    token_payload = {
        "sub": account["id"],
        "sessionId": new_session_id,
        "name": account["name"],
        "aadhaar": account["formattedAadhaar"],
        "role": "CITIZEN",
        "district": account["district"],
        "isDevAccount": account.get("isDevAccount", False),
        "exp": datetime.utcnow() + timedelta(hours=24)
    }

    token = jwt.encode(token_payload, current_app.config["SECRET_KEY"], algorithm="HS256")

    return jsonify({
        "message": "Aadhaar e-KYC verified successfully",
        "token": token,
        "sessionId": new_session_id,
        "wasPreviousSessionActive": previous_session is not None,
        "user": {
            "id": account["id"],
            "name": account["name"],
            "aadhaar": account["formattedAadhaar"],
            "maskedAadhaar": account["maskedAadhaar"],
            "mobile": account["mobile"],
            "maskedMobile": account["maskedMobile"],
            "dob": account["dob"],
            "gender": account["gender"],
            "address": account["address"],
            "district": account["district"],
            "state": account["state"],
            "pincode": account["pincode"],
            "role": "CITIZEN",
            "isDevAccount": account.get("isDevAccount", False),
            "designation": account.get("designation", ""),
            "sessionId": new_session_id
        },
        "portalUrl": "/report"
    }), 200

@auth_bp.route("/aadhaar/validate-session", methods=["POST"])
def validate_aadhaar_session():
    """
    Heartbeat/route-guard check to enforce single-session concurrency.
    If another device/tab has signed into this Aadhaar ID, returns valid: false.
    """
    data = request.get_json() or {}
    raw_aadhaar = str(data.get("aadhaarNumber", "")).replace(" ", "").replace("-", "").strip()
    client_session_id = data.get("sessionId", "")

    account = AADHAAR_ACCOUNTS_DB.get(raw_aadhaar)
    if not account:
        return jsonify({"valid": False, "reason": "Account not found"}), 404

    active_session_id = account.get("activeSessionId")
    
    # Valid only if client session matches current active session in database
    is_valid = bool(active_session_id and active_session_id == client_session_id)

    return jsonify({
        "valid": is_valid,
        "activeSessionId": active_session_id,
        "reason": "OK" if is_valid else "This Aadhaar account has signed in from another device/browser session. Session terminated."
    }), 200

