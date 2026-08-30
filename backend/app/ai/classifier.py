import re

# Domain keyword maps for NLP Classification
CATEGORY_KEYWORDS = {
    "WATER_SANITATION": ["water", "leak", "pipe", "drainage", "sewage", "tap", "drinking", "pipeline", "overflow"],
    "URBAN_INFRASTRUCTURE": ["road", "pothole", "street light", "traffic", "bridge", "footpath", "signal", "tar", "divider"],
    "ENERGY_ELECTRICITY": ["power", "electricity", "transformer", "wire", "spark", "blackout", "voltage", "pole"],
    "ENVIRONMENT_WASTE": ["garbage", "trash", "waste", "pollution", "smoke", "dump", "plastic", "smell", "burning"],
    "HEALTHCARE": ["hospital", "clinic", "doctor", "medicine", "dengue", "malaria", "mosquito", "ambulance", "hygiene"],
    "AGRICULTURE_RURAL": ["crop", "farmer", "irrigation", "canal", "fertilizer", "soil", "harvest", "seed"]
}

def classify_problem(text: str) -> dict:
    """
    Classify grievance text into ministry / problem categories using NLP keyword weight analysis.
    """
    cleaned_text = re.sub(r'[^a-zA-Z\s]', '', text.lower())
    words = cleaned_text.split()
    
    scores = {category: 0 for category in CATEGORY_KEYWORDS}
    
    for category, keywords in CATEGORY_KEYWORDS.items():
        for word in words:
            if word in keywords:
                scores[category] += 1
                
    best_category = max(scores, key=scores.get)
    max_score = scores[best_category]
    
    if max_score == 0:
        return {
            "category": "URBAN_INFRASTRUCTURE",
            "confidence": 0.50,
            "all_scores": scores
        }
        
    confidence = min(0.98, 0.65 + (max_score * 0.10))
    return {
        "category": best_category,
        "confidence": round(confidence, 2),
        "all_scores": scores
    }
