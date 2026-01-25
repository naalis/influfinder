"""Collaboration models"""
from sqlalchemy import Column, Integer, String, DateTime, Enum, JSON, Float, ForeignKey, Boolean, Text
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

from app.database import Base

class ApplicationStatus(str, enum.Enum):
    APPLIED = "applied"
    UNDER_REVIEW = "under_review"
    ACCEPTED = "accepted"
    REJECTED = "rejected"
    WITHDRAWN = "withdrawn"

class CollaborationStatus(str, enum.Enum):
    ACCEPTED = "accepted"
    SCHEDULED = "scheduled"
    VISITED = "visited"
    CONTENT_SUBMITTED = "content_submitted"
    IN_REVIEW = "in_review"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    DISPUTED = "disputed"

class Application(Base):
    __tablename__ = "applications"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Relaciones
    offer_id = Column(Integer, ForeignKey("offers.id"), nullable=False, index=True)
    creator_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    
    # Estado
    status = Column(Enum(ApplicationStatus), default=ApplicationStatus.APPLIED, index=True)
    
    # Mensaje de aplicación
    message = Column(String(1000), nullable=True)
    media_attachments = Column(JSON, default=[])  # URLs de portfolio
    
    # Propuesta del creador
    proposed_fee = Column(Float, nullable=True)  # Si negocia precio
    proposed_date = Column(DateTime, nullable=True)
    
    # Respuesta del business
    rejection_reason = Column(String(500), nullable=True)
    
    # Timestamps
    applied_at = Column(DateTime, default=datetime.utcnow, index=True)
    reviewed_at = Column(DateTime, nullable=True)
    responded_at = Column(DateTime, nullable=True)
    
    # Relaciones
    offer = relationship("Offer", back_populates="applications")
    creator = relationship("User", back_populates="applications", foreign_keys=[creator_id])
    collaboration = relationship("Collaboration", back_populates="application", uselist=False)


class Collaboration(Base):
    __tablename__ = "collaborations"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Relaciones
    offer_id = Column(Integer, ForeignKey("offers.id"), nullable=False, index=True)
    application_id = Column(Integer, ForeignKey("applications.id"), unique=True, nullable=True)
    creator_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    business_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    
    # Estado y progreso
    status = Column(Enum(CollaborationStatus), default=CollaborationStatus.ACCEPTED, index=True)
    
    # Acuerdos
    agreed_fee = Column(Float, nullable=False)
    agreed_deliverables = Column(JSON, default={})
    
    # Cronograma
    scheduled_date = Column(DateTime, nullable=True)  # Cuándo ejecutar
    visited_date = Column(DateTime, nullable=True)    # Cuándo fue visitado/hizo
    completed_date = Column(DateTime, nullable=True)  # Cuándo finalizó
    
    # Contenido
    submission_id = Column(Integer, ForeignKey("content_submissions.id"), nullable=True)
    
    # Evaluación
    creator_rating = Column(Float, nullable=True)     # 1-5 del creador
    creator_feedback = Column(String(500), nullable=True)
    business_rating = Column(Float, nullable=True)    # 1-5 del business
    business_feedback = Column(String(500), nullable=True)
    
    # Disputa
    dispute_reason = Column(String(500), nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relaciones
    offer = relationship("Offer", back_populates="collaborations")
    application = relationship("Application", back_populates="collaboration")
    creator = relationship("User", back_populates="collaborations_as_creator", foreign_keys=[creator_id])
    business = relationship("User", back_populates="collaborations_as_business", foreign_keys=[business_id])
    submission = relationship("ContentSubmission", back_populates="collaboration")
