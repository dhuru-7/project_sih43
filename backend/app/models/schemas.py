from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from enum import Enum

class UserRole(str, Enum):
    CITIZEN = "CITIZEN"
    GOVERNMENT = "GOVERNMENT"
    UNIVERSITY = "UNIVERSITY"
    INDUSTRY = "INDUSTRY"
    ADMIN = "ADMIN"

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: UserRole
    organization: Optional[str] = None
    department: Optional[str] = None

class ProblemSubmission(BaseModel):
    title: str = Field(..., min_length=5, max_length=200)
    description: str = Field(..., min_length=10)
    latitude: float
    longitude: float
    address: Optional[str] = None
    voiceNoteUrl: Optional[str] = None
    evidenceUrls: Optional[List[str]] = []
    category: Optional[str] = None

class ChallengeCreation(BaseModel):
    title: str
    description: str
    category: str
    department: str
    budget: float
    deadline: str
    problemIds: Optional[List[str]] = []
