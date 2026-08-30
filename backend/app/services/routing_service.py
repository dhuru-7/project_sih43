class RoutingService:
    @staticmethod
    def route_problem_to_department(problem_category: str) -> dict:
        dept_map = {
            "WATER_SANITATION": "Ministry of Jal Shakti",
            "URBAN_INFRASTRUCTURE": "Ministry of Housing & Urban Affairs",
            "ENERGY_ELECTRICITY": "Ministry of Power",
            "ENVIRONMENT_WASTE": "Ministry of Environment, Forest and Climate Change",
            "HEALTHCARE": "Ministry of Health & Family Welfare",
            "AGRICULTURE_RURAL": "Ministry of Agriculture & Farmers Welfare"
        }
        return {
            "department": dept_map.get(problem_category, "General Grievance Cell"),
            "sla_hours": 48 if problem_category in ["ENERGY_ELECTRICITY", "HEALTHCARE"] else 72
        }
