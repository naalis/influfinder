"""Notification and Message schemas"""
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum

class NotificationType(str, Enum):
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

class NotificationOut(BaseModel):
    """Notificación"""
    id: int
    type: NotificationType
    title: str
    content: str
    is_read: bool
    created_at: datetime
    read_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class MessageCreate(BaseModel):
    """Crear mensaje"""
    recipient_id: int
    content: str = Field(..., min_length=1, max_length=5000)
    collaboration_id: Optional[int] = None
    attachments: Optional[List[str]] = None


class MessageOut(BaseModel):
    """Mensaje"""
    id: int
    sender_id: int
    recipient_id: int
    content: str
    attachments: List[str] = []
    is_read: bool
    created_at: datetime
    read_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class ConversationOut(BaseModel):
    """Conversación"""
    user_id: int
    last_message: str
    last_message_at: datetime
    unread_count: int
    user_avatar: Optional[str] = None
    user_name: Optional[str] = None
