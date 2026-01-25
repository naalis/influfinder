"""User and Profile models"""
from sqlalchemy import Column, String, Integer, Boolean, DateTime, Enum, JSON, Float, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

from app.database import Base

class UserType(str, enum.Enum):
    CREATOR = "creator"
    BUSINESS = "business"
    AGENCY = "agency"

class AuthProvider(str, enum.Enum):
    EMAIL = "email"
    INSTAGRAM = "instagram"
    FACEBOOK = "facebook"
    TIKTOK = "tiktok"
    GOOGLE = "google"

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True)
    password_hash = Column(String, nullable=True)  # NULL si usa OAuth
    
    # Tipo de usuario
    user_type = Column(Enum(UserType), default=UserType.CREATOR)
    
    # Estado
    is_active = Column(Boolean, default=False)  # Requiere email verify
    is_verified = Column(Boolean, default=False)
    email_verified_at = Column(DateTime, nullable=True)
    
    # Autenticación Multi-Plataforma
    auth_providers = Column(JSON, default={})  # {instagram: {id, token, expires}, facebook: {...}}
    
    # Metadata
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_login = Column(DateTime, nullable=True)
    
    # Relaciones
    profile = relationship("Profile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    offers = relationship("Offer", back_populates="business", foreign_keys="Offer.business_id")
    applications = relationship("Application", back_populates="creator")
    collaborations_as_creator = relationship("Collaboration", back_populates="creator", foreign_keys="Collaboration.creator_id")
    collaborations_as_business = relationship("Collaboration", back_populates="business", foreign_keys="Collaboration.business_id")
    submissions = relationship("ContentSubmission", back_populates="creator")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")
    messages_sent = relationship("Message", back_populates="sender", foreign_keys="Message.sender_id")
    messages_received = relationship("Message", back_populates="recipient", foreign_keys="Message.recipient_id")


class Profile(Base):
    __tablename__ = "profiles"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    
    # Info Personal
    full_name = Column(String)
    bio = Column(String(500))
    avatar_url = Column(String)
    cover_url = Column(String)
    
    # Sistema de Gamificación
    tier_level = Column(Integer, default=0, index=True)  # 0-5 (Newbie -> Legend)
    karma_score = Column(Integer, default=0)
    tier_progress = Column(Float, default=0.0)  # 0-100%
    completed_collaborations = Column(Integer, default=0)
    
    # Redes Sociales
    instagram_handle = Column(String, unique=True, nullable=True, index=True)
    instagram_followers = Column(Integer, default=0)
    instagram_verified = Column(Boolean, default=False)
    instagram_profile_id = Column(String, unique=True, nullable=True)
    
    tiktok_handle = Column(String, unique=True, nullable=True)
    tiktok_followers = Column(Integer, default=0)
    tiktok_verified = Column(Boolean, default=False)
    
    facebook_handle = Column(String, unique=True, nullable=True)
    facebook_followers = Column(Integer, default=0)
    
    youtube_channel = Column(String, nullable=True)
    youtube_subscribers = Column(Integer, default=0)
    
    # Localización
    country = Column(String)  # ISO 3166-1 alpha-2
    city = Column(String)
    timezone = Column(String)
    languages = Column(JSON, default=[])  # ["es", "en", "pt"]
    
    # Categorías de contenido (creator only)
    categories = Column(JSON, default=[])  # ["travel", "fitness", "food"]
    
    # Ratings y Estadísticas
    rating = Column(Float, default=0.0)  # 0-5 stars
    rating_count = Column(Integer, default=0)
    completion_rate = Column(Float, default=0.0)  # %
    response_time = Column(Integer, default=0)  # promedio horas
    
    # Bancos de cuenta (business/agency)
    bank_account = Column(JSON, nullable=True)  # {account_holder, iban, routing_number}
    
    # Datos Personales Sensibles
    document_id = Column(String, nullable=True)  # RUT, DNI, etc (encrypted)
    document_verified = Column(Boolean, default=False)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relación
    user = relationship("User", back_populates="profile")
