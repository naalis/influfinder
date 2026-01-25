"""Notification and Message models"""
from sqlalchemy import Column, Integer, String, DateTime, Enum, JSON, ForeignKey, Boolean, Text
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

from app.database import Base

class NotificationType(str, enum.Enum):
    APPLICATION_RECEIVED = "application_received"
    APPLICATION_ACCEPTED = "application_accepted"
    APPLICATION_REJECTED = "application_rejected"
    COLLABORATION_SCHEDULED = "collaboration_scheduled"
    CONTENT_SUBMITTED = "content_submitted"
    CONTENT_APPROVED = "content_approved"
    CONTENT_REJECTED = "content_rejected"
    TIER_UPGRADED = "tier_upgraded"
    MESSAGE_RECEIVED = "message_received"
    OFFER_CLOSED = "offer_closed"
    DISPUTE_OPENED = "dispute_opened"

class Notification(Base):
    __tablename__ = "notifications"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    
    type = Column(Enum(NotificationType), nullable=False, index=True)
    title = Column(String(200))
    content = Column(Text)
    
    # Relación a entidad relevante
    related_offer_id = Column(Integer, ForeignKey("offers.id"), nullable=True)
    related_collaboration_id = Column(Integer, ForeignKey("collaborations.id"), nullable=True)
    related_application_id = Column(Integer, ForeignKey("applications.id"), nullable=True)
    related_user_id = Column(Integer, ForeignKey("users.id"), nullable=True)  # Quién origina
    
    # Estado
    is_read = Column(Boolean, default=False)
    read_at = Column(DateTime, nullable=True)
    
    # Metadata
    data = Column(JSON, default={})  # Datos adicionales
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    
    # Relaciones
    user = relationship("User", back_populates="notifications", foreign_keys=[user_id])


class Message(Base):
    __tablename__ = "messages"
    
    id = Column(Integer, primary_key=True, index=True)
    sender_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    recipient_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    
    content = Column(Text, nullable=False)
    attachments = Column(JSON, default=[])  # URLs
    
    # Relación a colaboración (opcional)
    collaboration_id = Column(Integer, ForeignKey("collaborations.id"), nullable=True)
    
    # Estado
    is_read = Column(Boolean, default=False)
    read_at = Column(DateTime, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relaciones
    sender = relationship("User", back_populates="messages_sent", foreign_keys=[sender_id])
    recipient = relationship("User", back_populates="messages_received", foreign_keys=[recipient_id])
