INDUSTRIES_DB = [
    {
        "id": "ind-01",
        "name": "Tata CleanTech & Sustainability",
        "csr_focus_areas": ["Water Treatment", "CleanTech", "Public Utilities", "Recycling Tech"],
        "available_csr_fund": 5000000,
        "active_mentors": 12
    },
    {
        "id": "ind-02",
        "name": "L&T Smart Infrastructure Labs",
        "csr_focus_areas": ["Smart Cities", "Civil Tech", "Sensor Networks"],
        "available_csr_fund": 8000000,
        "active_mentors": 15
    }
]

class IndustryService:
    @staticmethod
    def get_all():
        return INDUSTRIES_DB

    @staticmethod
    def get_by_id(ind_id):
        for i in INDUSTRIES_DB:
            if i.get("id") == ind_id:
                return i
        return None
