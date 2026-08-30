# 🗄️ Database & Firestore Entity Schema

## Primary Collections

### 1. `users`
```json
{
  "uid": "usr_948271",
  "name": "Dr. Rajesh Kumar",
  "email": "officer@jalshakti.gov.in",
  "role": "GOVERNMENT",
  "organization": "Ministry of Jal Shakti",
  "department": "Water Resources",
  "createdAt": "2026-08-25T10:00:00Z"
}
```

### 2. `problems`
```json
{
  "id": "prob_001",
  "title": "Severe sewage pipeline overflow near Main Market",
  "description": "The drainage pipe has burst...",
  "category": "WATER_SANITATION",
  "severity": "HIGH",
  "score": 75.0,
  "status": "CONVERTED_TO_CHALLENGE",
  "latitude": 28.6139,
  "longitude": 77.2090,
  "reportedBy": "usr_citizen_42"
}
```

### 3. `challenges`
```json
{
  "id": "chal_101",
  "title": "Acoustic Sensor IoT Pipeline for Urban Leakage Detection",
  "problemIds": ["prob_001"],
  "ministry": "Ministry of Jal Shakti",
  "allocatedBudget": 500000,
  "status": "PUBLISHED"
}
```
