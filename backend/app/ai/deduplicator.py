from app.utils.helpers import calculate_distance

def find_duplicate_problems(new_problem: dict, existing_problems: list, geo_radius_km: float = 0.5) -> list:
    """
    Find existing problems that are within geo-radius and share category/keywords.
    """
    duplicates = []
    new_lat = new_problem.get("latitude")
    new_lon = new_problem.get("longitude")
    new_cat = new_problem.get("category")
    
    for prob in existing_problems:
        p_lat = prob.get("latitude")
        p_lon = prob.get("longitude")
        
        if p_lat is None or p_lon is None:
            continue
            
        dist = calculate_distance(new_lat, new_lon, p_lat, p_lon)
        
        if dist <= geo_radius_km and prob.get("category") == new_cat:
            duplicates.append({
                "problem_id": prob.get("id"),
                "title": prob.get("title"),
                "distance_meters": round(dist * 1000, 1),
                "status": prob.get("status")
            })
            
    return duplicates
