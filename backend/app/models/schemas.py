from dataclasses import dataclass, field
from typing import Optional, List
from enum import Enum

class UserRole(str, Enum):
    CITIZEN = "CITIZEN"
    GOVERNMENT = "GOVERNMENT"
    UNIVERSITY = "UNIVERSITY"
    INDUSTRY = "INDUSTRY"
    ADMIN = "ADMIN"

@dataclass
class LoginRequest:
    email: str
    password: str

@dataclass
class RegisterRequest:
    name: str
    email: str
    password: str
    role: UserRole
    organization: Optional[str] = None
    department: Optional[str] = None

@dataclass
class ProblemSubmission:
    title: str
    description: str
    latitude: float
    longitude: float
    address: Optional[str] = None
    voiceNoteUrl: Optional[str] = None
    evidenceUrls: List[str] = field(default_factory=list)
    category: Optional[str] = None

@dataclass
class ChallengeCreation:
    title: str
    description: str
    category: str
    department: str
    budget: float
    deadline: str
    problemIds: List[str] = field(default_factory=list)

