UNIVERSITIES_DB = [
    {
        "id": "uni-01",
        "name": "Indian Institute of Technology (IIT) Delhi",
        "departments": ["Civil Engineering", "Environmental Engineering", "Computer Vision", "Smart City Labs"],
        "tier": "TIER_1",
        "active_teams": 8
    },
    {
        "id": "uni-02",
        "name": "National Institute of Technology (NIT) Trichy",
        "departments": ["Electrical Engineering", "Power Systems", "IoT Sensor Labs"],
        "tier": "TIER_1",
        "active_teams": 5
    }
]

class UniversityService:
    @staticmethod
    def get_all():
        return UNIVERSITIES_DB

    @staticmethod
    def get_by_id(uni_id):
        for u in UNIVERSITIES_DB:
            if u.get("id") == uni_id:
                return u
        return None
