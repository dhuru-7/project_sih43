import re

# 17 Official Problem Categories (Handwritten Note & SIH Official Problem Domains)
PROBLEM_CATEGORIES = [
    "Education",
    "Healthcare",
    "Agriculture",
    "Water Resources",
    "Environment",
    "Energy",
    "Urban Development and Infrastructure",
    "Accessibility and Inclusion",
    "Public Administration and Governance",
    "Rural Livelihoods and Development",
    "Disaster Management",
    "Transportation and Mobility",
    "Sanitation and Waste Management",
    "Employment and Entrepreneurship",
    "Housing and Community",
    "Public Safety and Security",
    "Cyber Security"
]

CATEGORY_KEYWORDS = {
    "Education": [
        "school", "college", "teacher", "student", "class", "books", "classroom", "blackboard",
        "desk", "midday", "meal", "education", "syllabus", "dropout", "exam", "hostel", "degree"
    ],
    "Healthcare": [
        "hospital", "clinic", "doctor", "nurse", "medicine", "dengue", "malaria", "mosquito",
        "ambulance", "hygiene", "health", "phc", "chc", "vaccine", "infection", "fever", "patients"
    ],
    "Agriculture": [
        "crop", "farmer", "irrigation", "canal", "fertilizer", "soil", "harvest", "seed",
        "paddy", "wheat", "mandis", "pesticide", "monsoon", "drought", "tractor", "farm", "kisan"
    ],
    "Water Resources": [
        "water", "drinking", "borewell", "tubewell", "river", "lake", "pond", "contamination",
        "fluoride", "arsenic", "pipeline", "dam", "well", "groundwater", "filtration", "leak"
    ],
    "Environment": [
        "pollution", "air", "tree", "forest", "deforestation", "smoke", "plastic", "biodiversity",
        "wildlife", "smog", "carbon", "emission", "green", "flora", "fauna", "ecology"
    ],
    "Energy": [
        "power", "electricity", "transformer", "wire", "spark", "blackout", "voltage", "pole",
        "solar", "grid", "load", "shedding", "substation", "generator", "renewable", "inverter"
    ],
    "Urban Development and Infrastructure": [
        "road", "pothole", "street", "light", "bridge", "footpath", "signal", "divider", "flyover",
        "pavement", "culvert", "metro", "underpass", "tar", "asphalt", "sidewalk", "signboard"
    ],
    "Accessibility and Inclusion": [
        "disabled", "wheelchair", "ramp", "blind", "braille", "deaf", "handicap", "inclusion",
        "elderly", "special", "needs", "barrier", "accessible", "sign", "language"
    ],
    "Public Administration and Governance": [
        "corruption", "bribe", "officer", "panchayat", "collector", "certificate", "ration", "portal",
        "delay", "red", "tape", "service", "babu", "license", "grievance", "transparency", "e-governance"
    ],
    "Rural Livelihoods and Development": [
        "rural", "village", "gram", "panchayat", "mgnrega", "artisan", "handloom", "tola",
        "cottage", "dairy", "poultry", "livelihood", "shg", "self", "help", "group", "livestock"
    ],
    "Disaster Management": [
        "flood", "earthquake", "cyclone", "landslide", "fire", "emergency", "relief", "rescue",
        "ndrf", "sdrf", "hazard", "shelter", "warning", "evacuation", "damage", "crisis"
    ],
    "Transportation and Mobility": [
        "bus", "train", "auto", "railway", "station", "stop", "ticket", "transit",
        "traffic", "commute", "fare", "route", "vehicle", "rickshaw", "transport"
    ],
    "Sanitation and Waste Management": [
        "garbage", "trash", "waste", "drainage", "sewage", "dump", "smell", "burning",
        "manhole", "gutter", "overflow", "cleanliness", "swachh", "toilet", "compost"
    ],
    "Employment and Entrepreneurship": [
        "job", "unemployment", "skill", "training", "startup", "placement", "internship",
        "wage", "salary", "recruitment", "youth", "work", "fair", "vacancy", "career"
    ],
    "Housing and Community": [
        "slum", "house", "shelter", "homeless", "pmay", "colony", "community", "hall",
        "park", "playground", "encroachment", "building", "residential", "eviction"
    ],
    "Public Safety and Security": [
        "crime", "theft", "police", "cctv", "harassment", "women", "safety", "robbery",
        "patrol", "assault", "violence", "threat", "fir", "station", "emergency", "security"
    ],
    "Cyber Security": [
        "scam", "fraud", "hacked", "phishing", "otp", "cyber", "online", "identity",
        "data", "breach", "malware", "ransomware", "virus", "upi", "card", "cloning"
    ]
}

def classify_problem(text: str) -> dict:
    """
    Classify grievance text into one of the 17 SIH Problem Categories using NLP keyword weight analysis.
    """
    if not text:
        return {
            "category": "Urban Development and Infrastructure",
            "confidence": 0.50,
            "all_scores": {}
        }

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
            "category": "Urban Development and Infrastructure",
            "confidence": 0.50,
            "all_scores": scores
        }
        
    confidence = min(0.98, 0.65 + (max_score * 0.08))
    return {
        "category": best_category,
        "confidence": round(confidence, 2),
        "all_scores": scores
    }

