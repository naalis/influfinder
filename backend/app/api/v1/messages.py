"""Message endpoints"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc, and_, or_
from typing import List, Optional
from datetime import datetime

from app.models.notification import Message
from app.models import User
from app.schemas.notification import MessageCreate, MessageOut, ConversationOut
from app.database import get_db
from app.utils.dependencies import get_current_user

router = APIRouter(prefix="/api/v1/messages", tags=["messages"])

@router.post("/", response_model=MessageOut, status_code=201)
async def send_message(
    message_data: MessageCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Enviar mensaje"""
    recipient = await db.get(User, message_data.recipient_id)
    
    if not recipient:
        raise HTTPException(status_code=404, detail="Destinatario no encontrado")
    
    if current_user.id == message_data.recipient_id:
        raise HTTPException(status_code=400, detail="No puedes escribirte a ti mismo")
    
    message = Message(
        sender_id=current_user.id,
        recipient_id=message_data.recipient_id,
        content=message_data.content,
        attachments=message_data.attachments or [],
        collaboration_id=message_data.collaboration_id
    )
    
    db.add(message)
    await db.commit()
    await db.refresh(message)
    
    return message


@router.get("/", response_model=List[ConversationOut])
async def get_conversations(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Obtener conversaciones del usuario"""
    # Obtener todos los usuarios con los que tiene mensajes
    result = await db.execute(
        select(Message)
        .where(
            or_(
                Message.sender_id == current_user.id,
                Message.recipient_id == current_user.id
            )
        )
        .order_by(desc(Message.created_at))
    )
    
    messages = result.scalars().all()
    conversations = {}
    
    for message in messages:
        other_user_id = (message.recipient_id 
                        if message.sender_id == current_user.id 
                        else message.sender_id)
        
        if other_user_id not in conversations:
            other_user = await db.get(User, other_user_id)
            conversations[other_user_id] = ConversationOut(
                user_id=other_user_id,
                last_message=message.content,
                last_message_at=message.created_at,
                unread_count=0,
                user_avatar=other_user.profile.avatar_url if other_user.profile else None,
                user_name=other_user.profile.full_name if other_user.profile else other_user.username
            )
            
            # Contar sin leídos
            if message.recipient_id == current_user.id and not message.is_read:
                conversations[other_user_id].unread_count += 1
    
    return list(conversations.values())


@router.get("/{user_id}", response_model=List[MessageOut])
async def get_conversation(
    user_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Obtener conversación con usuario"""
    result = await db.execute(
        select(Message)
        .where(
            or_(
                and_(Message.sender_id == current_user.id, Message.recipient_id == user_id),
                and_(Message.sender_id == user_id, Message.recipient_id == current_user.id)
            )
        )
        .order_by(Message.created_at)
    )
    
    messages = result.scalars().all()
    
    # Marcar como leídos los mensajes del otro usuario
    for message in messages:
        if message.recipient_id == current_user.id and not message.is_read:
            message.is_read = True
            message.read_at = datetime.utcnow()
    
    await db.commit()
    
    return messages
