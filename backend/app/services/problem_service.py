import uuid
from datetime import datetime
from app.ai.classifier import classify_problem
from app.ai.prioritizer import calculate_priority_score
from app.ai.deduplicator import find_duplicate_problems

# In-memory storage for demonstration / fallback when Firebase is not configured
PROBLEMS_DB = [
    {
        "id": "prob-001",
        "title": "Severe sewage pipeline overflow near Main Market",
        "description": "The drainage pipe has burst, causing dirty water to spill on the main road.",
        "category": "WATER_SANITATION",
        "department": "Ministry of Jal Shakti",
        "severity": "HIGH",
        "score": 75.0,
        "status": "CONVERTED_TO_CHALLENGE",
        "latitude": 28.6139,
        "longitude": 77.2090,
        "createdAt": "2026-08-25T10:00:00Z"
    },
    {
        "id": "prob-002",
        "title": "High voltage transformer sparks on 5th Avenue",
        "description": "Continuous sparking and smoke from the local power transformer.",
        "category": "ENERGY_ELECTRICITY",
        "department": "Ministry of Power",
        "severity": "CRITICAL",
        "score": 90.0,
        "status": "VERIFIED",
        "latitude": 28.6145,
        "longitude": 77.2100,
        "createdAt": "2026-08-28T14:30:00Z"
    }
]

class ProblemService:
    @staticmethod
    def get_all(category=None, status=None):
        results = PROBLEMS_DB
        if category:
            results = [p for p in results if p.get("category") == category]
        if status:
            results = [p for p in results if p.get("status") == status]
        return results

    @staticmethod
    def get_by_id(problem_id):
        for p in PROBLEMS_DB:
            if p.get("id") == problem_id:
                return p
        return None

    @staticmethod
    def create_problem(data):
        prob_id = f"prob-{str(uuid.uuid4())[:8]}"
        title = data.get("title", "")
        description = data.get("description", "")
        
        # 1. AI Classification
        ai_res = classify_problem(f"{title} {description}")
        category = ai_res["category"]
        
        # 2. Duplicate Detection
        duplicates = find_duplicate_problems({
            "latitude": data.get("latitude"),
            "longitude": data.get("longitude"),
            "category": category
        }, PROBLEMS_DB)
        
        # 3. Severity & Priority Scoring
        priority_res = calculate_priority_score(title, description, duplicate_count=len(duplicates))
        
        new_problem = {
            "id": prob_id,
            "title": title,
            "description": description,
            "category": category,
            "severity": priority_res["severity"],
            "score": priority_res["score"],
            "status": "SUBMITTED" if not duplicates else "FLAGGED_DUPLICATE",
            "duplicates": duplicates,
            "latitude": data.get("latitude"),
            "longitude": data.get("longitude"),
            "address": data.get("address", "Sector 4, New Delhi"),
            "voiceNoteUrl": data.get("voiceNoteUrl"),
            "evidenceUrls": data.get("evidenceUrls", []),
            "createdAt": datetime.utcnow().isoformat() + "Z"
        }
        PROBLEMS_DB.append(new_problem)
        return new_problem
