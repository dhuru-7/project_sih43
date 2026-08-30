DEPARTMENT_SKILL_MAP = {
    "WATER_SANITATION": ["Civil Engineering", "Environmental Engineering", "IoT Sensor Labs", "Chemical Technology"],
    "URBAN_INFRASTRUCTURE": ["Civil Engineering", "Transportation Systems", "Smart City Labs", "Computer Vision"],
    "ENERGY_ELECTRICITY": ["Electrical Engineering", "Renewable Energy Research", "Power Systems"],
    "ENVIRONMENT_WASTE": ["Environmental Science", "Biotechnology", "Material Science", "Robotics"],
    "HEALTHCARE": ["Biomedical Engineering", "Bio-Informatics", "Data Science Healthcare"],
    "AGRICULTURE_RURAL": ["Agricultural Engineering", "Drone Tech Lab", "Precision Agriculture"]
}

def match_universities_for_challenge(category: str, universities: list) -> list:
    """
    Rank universities best suited to tackle a challenge based on department specialization.
    """
    relevant_depts = DEPARTMENT_SKILL_MAP.get(category, ["Computer Science", "Engineering"])
    ranked = []
    
    for uni in universities:
        uni_depts = uni.get("departments", [])
        matched_depts = [d for d in uni_depts if d in relevant_depts]
        match_score = len(matched_depts) / max(1, len(relevant_depts))
        
        ranked.append({
            "university_id": uni.get("id"),
            "name": uni.get("name"),
            "matched_departments": matched_depts,
            "match_score": round(match_score, 2),
            "tier": uni.get("tier", "TIER_1")
        })
        
    return sorted(ranked, key=lambda x: x["match_score"], reverse=True)
