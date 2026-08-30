INDUSTRY_CSR_MAP = {
    "WATER_SANITATION": ["Water Treatment", "Infrastructure", "CleanTech", "Public Utilities"],
    "URBAN_INFRASTRUCTURE": ["Smart Cities", "Civil Tech", "Automotive", "Sensor Networks"],
    "ENERGY_ELECTRICITY": ["Solar Power", "Grid Automation", "Clean Energy", "Semiconductors"],
    "ENVIRONMENT_WASTE": ["Recycling Tech", "Sustainable Packaging", "Waste-to-Energy", "ESG Funds"],
    "HEALTHCARE": ["Pharma", "MedTech", "Digital Health", "Biotech"],
    "AGRICULTURE_RURAL": ["AgriTech", "Drone Manufacturing", "Rural Logistics", "Cold Chain"]
}

def match_industries_for_sponsorship(category: str, industries: list) -> list:
    """
    Matches challenges with relevant industry partners and CSR grant programs.
    """
    relevant_domains = INDUSTRY_CSR_MAP.get(category, ["Technology", "Innovation"])
    matched = []
    
    for ind in industries:
        ind_domains = ind.get("csr_focus_areas", [])
        overlap = [d for d in ind_domains if d in relevant_domains]
        score = len(overlap) / max(1, len(relevant_domains))
        
        matched.append({
            "industry_id": ind.get("id"),
            "name": ind.get("name"),
            "focus_overlap": overlap,
            "match_score": round(score, 2),
            "available_csr_fund": ind.get("available_csr_fund", 0)
        })
        
    return sorted(matched, key=lambda x: x["match_score"], reverse=True)
