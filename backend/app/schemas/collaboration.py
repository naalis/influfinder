"""Collaboration schemas"""
from pydantic import BaseModel, Field, validator
from typing import Optional, List
from datetime import datetime
from enum import Enum

class ApplicationStatus(str, Enum):
    APPLIED = "applied"
    UNDER_REVIEW = "under_review"
    ACCEPTED = "accepted"
    REJECTED = "rejected"
    WITHDRAWN = "withdrawn"

class CollaborationStatus(str, Enum):
    ACCEPTED = "accepted"
    SCHEDULED = "scheduled"
    VISITED = "visited"
    CONTENT_SUBMITTED = "content_submitted"
    IN_REVIEW = "in_review"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    DISPUTED = "disputed"

# ============ APLICACIONES ============

class ApplicationCreate(BaseModel):
    """Aplicar a una oferta"""
    offer_id: int
    message: Optional[str] = Field(None, max_length=1000)
    media_attachments: Optional[List[str]] = None
    proposed_fee: Optional[float] = Field(None, gt=0)
    proposed_date: Optional[datetime] = None


class ApplicationOut(BaseModel):
    """Aplicación pública"""
    id: int
    offer_id: int
    status: ApplicationStatus
    message: Optional[str] = None
    media_attachments: Optional[List[str]] = None
    proposed_fee: Optional[float] = None
    proposed_date: Optional[datetime] = None
    applied_at: datetime
    
    class Config:
        from_attributes = True


class ApplicationMeOut(ApplicationOut):
    """Mi aplicación (información sensible)"""
    reviewed_at: Optional[datetime] = None
    responded_at: Optional[datetime] = None
    rejection_reason: Optional[str] = None


class ApplicationReview(BaseModel):
    """Revisar aplicación (business)"""
    status: ApplicationStatus
    rejection_reason: Optional[str] = None


class ApplicationWithdraw(BaseModel):
    """Retirar aplicación"""
    reason: Optional[str] = None


# ============ COLABORACIONES ============

class CollaborationSchedule(BaseModel):
    """Agendar fecha de colaboración"""
    scheduled_date: datetime = Field(..., description="Fecha para ejecutar la colaboración")


class CollaborationMarkVisited(BaseModel):
    """Marcar como visitado/ejecutado"""
    visited_date: datetime
    notes: Optional[str] = None


class CollaborationRate(BaseModel):
    """Calificar colaboración"""
    rating: float = Field(..., ge=1, le=5)
    feedback: Optional[str] = Field(None, max_length=500)


class CollaborationDisputeRequest(BaseModel):
    """Abrir disputa"""
    reason: str = Field(..., min_length=20, max_length=500)
    evidence: Optional[List[str]] = None


class CollaborationOut(BaseModel):
    """Colaboración pública"""
    id: int
    offer_id: int
    creator_id: int
    business_id: int
    status: CollaborationStatus
    agreed_fee: float
    scheduled_date: Optional[datetime] = None
    visited_date: Optional[datetime] = None
    completed_date: Optional[datetime] = None
    creator_rating: Optional[float] = None
    business_rating: Optional[float] = None
    created_at: datetime
    
    class Config:
        from_attributes = True


class CollaborationDetailOut(CollaborationOut):
    """Colaboración con detalles"""
    agreed_deliverables: dict = {}
    creator_feedback: Optional[str] = None
    business_feedback: Optional[str] = None
    submission_id: Optional[int] = None
    dispute_reason: Optional[str] = None
