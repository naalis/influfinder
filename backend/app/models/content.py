"""Content submission model"""
from sqlalchemy import Column, Integer, String, DateTime, Enum, JSON, Float, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

from app.database import Base

class SubmissionStatus(str, enum.Enum):
    SUBMITTED = "submitted"
    UNDER_REVIEW = "under_review"
    APPROVED = "approved"
    REJECTED = "rejected"
    REVISION_REQUESTED = "revision_requested"

class ContentSubmission(Base):
    __tablename__ = "content_submissions"
    
    id = Column(Integer, primary_key=True, index=True)
    collaboration_id = Column(Integer, ForeignKey("collaborations.id"), nullable=False)
    creator_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    status = Column(Enum(SubmissionStatus), default=SubmissionStatus.SUBMITTED)
    
    # URLs del contenido (Instagram post, TikTok, etc)
    content_urls = Column(JSON)  # ["https://instagram.com/p/...", ...]
    
    # Metadata
    captions = Column(JSON)  # {text, hashtags, mentions}
    platform = Column(String)  # instagram, tiktok, youtube
    platform_post_id = Column(String)  # ID del post en la plataforma
    
    # AI Analysis
    ai_score = Column(Float)  # 0-100
    ai_analysis = Column(JSON)  # {hashtags_found, mentions_found, brand_visibility, etc}
    
    # Revisión manual
    reviewed_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    reviewer_notes = Column(String)
    
    # Timestamps
    submitted_at = Column(DateTime, default=datetime.utcnow)
    reviewed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relaciones
    collaboration = relationship("Collaboration", back_populates="submissions", foreign_keys=[collaboration_id])
    creator = relationship("User", foreign_keys=[creator_id])
    reviewer = relationship("User", foreign_keys=[reviewed_by])
