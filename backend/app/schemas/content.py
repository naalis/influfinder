"""Content schemas"""
from pydantic import BaseModel, Field
from typing import Optional, List, Dict
from datetime import datetime
from enum import Enum

class SubmissionStatus(str, Enum):
    SUBMITTED = "submitted"
    UNDER_REVIEW = "under_review"
    APPROVED = "approved"
    REJECTED = "rejected"
    REVISION_REQUESTED = "revision_requested"

class ContentSubmissionCreate(BaseModel):
    """Subir contenido"""
    collaboration_id: int
    content_urls: List[str] = Field(..., min_items=1)
    captions: Dict
    platform: str
    platform_post_id: Optional[str] = None


class ContentSubmissionOut(BaseModel):
    """Submission público"""
    id: int
    collaboration_id: int
    status: SubmissionStatus
    content_urls: List[str]
    platform: str
    ai_score: Optional[float] = None
    submitted_at: datetime
    reviewed_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class ContentAnalysisResult(BaseModel):
    """Resultado de análisis AI"""
    ai_score: float
    passed_requirements: bool
    quality_rating: float
    relevance_rating: float
    analysis: Dict = {}


class ContentValidationResult(BaseModel):
    """Resultado de validación de contenido"""
    hashtags: Dict = {}
    mentions: Dict = {}
    overall_compliance: bool
    issues: List[str] = []
