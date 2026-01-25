"""Offer model"""
from sqlalchemy import Column, String, Integer, Float, DateTime, Enum, JSON, Text, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

from app.database import Base

class OfferCategory(str, enum.Enum):
    TRAVEL = "travel"
    FASHION = "fashion"
    BEAUTY = "beauty"
    FITNESS = "fitness"
    FOOD = "food"
    TECH = "tech"
    LIFESTYLE = "lifestyle"
    GAMING = "gaming"
    MUSIC = "music"
    EDUCATION = "education"

class OfferStatus(str, enum.Enum):
    DRAFT = "draft"
    ACTIVE = "active"
    PAUSED = "paused"
    CLOSED = "closed"
    ARCHIVED = "archived"

class Offer(Base):
    __tablename__ = "offers"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Publicador (Business o Agency)
    business_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    
    # Información básica
    title = Column(String(200), nullable=False, index=True)
    description = Column(Text, nullable=False)
    category = Column(Enum(OfferCategory), nullable=False, index=True)
    
    # Financiero
    budget_min = Column(Float, nullable=False)  # Mínimo de pago
    budget_max = Column(Float)  # Máximo de pago (NULL si fijo)
    currency = Column(String(3), default="USD")  # ISO 4217
    payment_terms = Column(String(100))  # "upon_completion", "50_50", etc
    
    # Requisitos Duales (Creator vs Regular Creator)
    requirements = Column(JSON, nullable=False)
    
    # Especificaciones de contenido
    content_specs = Column(JSON, nullable=False)
    
    # Recompensas y beneficios
    deliverables = Column(JSON, default={})
    
    # Plazos
    application_deadline = Column(DateTime, nullable=False)
    content_deadline = Column(DateTime, nullable=False)
    
    # Plataformas
    platforms = Column(JSON)  # ["instagram", "tiktok", "youtube"]
    
    # Estado
    status = Column(Enum(OfferStatus), default=OfferStatus.DRAFT, index=True)
    is_public = Column(Boolean, default=False)
    
    # Stats
    views_count = Column(Integer, default=0)
    applications_count = Column(Integer, default=0)
    accepted_count = Column(Integer, default=0)
    
    # Metadata
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    published_at = Column(DateTime, nullable=True)
    
    # Relaciones
    business = relationship("User", back_populates="offers", foreign_keys=[business_id])
    applications = relationship("Application", back_populates="offer", cascade="all, delete-orphan")
    collaborations = relationship("Collaboration", back_populates="offer", cascade="all, delete-orphan")
