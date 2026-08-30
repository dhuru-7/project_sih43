FUNDING_GRANTS_DB = [
    {
        "id": "fund-501",
        "projectId": "proj-101",
        "sanctionedBy": "Ministry of Jal Shakti & Tata CleanTech",
        "amount": 250000,
        "disbursed": 150000,
        "status": "DISBURSED",
        "tranches": [
            { "stage": "Prototype", "amount": 100000, "status": "RELEASED" },
            { "stage": "Field Testing", "amount": 50000, "status": "RELEASED" },
            { "stage": "Deployment", "amount": 100000, "status": "PENDING" }
        ]
    }
]

class FundingService:
    @staticmethod
    def get_all():
        return FUNDING_GRANTS_DB
