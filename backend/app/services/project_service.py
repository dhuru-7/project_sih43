PROJECTS_DB = [
    {
        "id": "proj-101",
        "title": "IoT-Based Acoustic Leak Detection for Municipal Pipelines",
        "challengeId": "chal-01",
        "university": "IIT Delhi",
        "teamLead": "Prof. A. Sharma",
        "status": "FIELD_TESTED",
        "progressPercentage": 75,
        "fundingAllocated": 250000,
        "industryPartner": "Tata CleanTech"
    }
]

class ProjectService:
    @staticmethod
    def get_all():
        return PROJECTS_DB

    @staticmethod
    def get_by_id(project_id):
        for p in PROJECTS_DB:
            if p.get("id") == project_id:
                return p
        return None
