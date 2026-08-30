CRITICAL_KEYWORDS = ["danger", "hazard", "fire", "spark", "accident", "hospital", "life", "children", "flood", "collapse"]
HIGH_KEYWORDS = ["heavy", "broken", "blocked", "major", "urgently", "severe", "contaminated"]

def calculate_priority_score(title: str, description: str, duplicate_count: int = 0) -> dict:
    """
    Computes a composite priority score (1-100) and severity category.
    """
    full_text = f"{title} {description}".lower()
    base_score = 30.0
    
    # Check critical triggers
    for word in CRITICAL_KEYWORDS:
        if word in full_text:
            base_score += 25
            
    # Check high triggers
    for word in HIGH_KEYWORDS:
        if word in full_text:
            base_score += 10
            
    # Density / Duplicate bonus (more people reporting = higher priority)
    base_score += min(20, duplicate_count * 5)
    
    score = min(100.0, max(10.0, base_score))
    
    if score >= 80:
        severity = "CRITICAL"
    elif score >= 60:
        severity = "HIGH"
    elif score >= 40:
        severity = "MEDIUM"
    else:
        severity = "LOW"
        
    return {
        "score": round(score, 1),
        "severity": severity
    }
