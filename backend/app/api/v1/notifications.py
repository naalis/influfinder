"""Notification endpoints"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from typing import List
from datetime import datetime

from app.models.notification import Notification
from app.models import User
from app.schemas.notification import NotificationOut
from app.database import get_db
from app.utils.dependencies import get_current_user

router = APIRouter(prefix="/api/v1/notifications", tags=["notifications"])

@router.get("/", response_model=List[NotificationOut])
async def get_notifications(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Obtener notificaciones del usuario"""
    result = await db.execute(
        select(Notification)
        .where(Notification.user_id == current_user.id)
        .order_by(desc(Notification.created_at))
    )
    return result.scalars().all()


@router.patch("/{notification_id}/read")
async def mark_notification_read(
    notification_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Marcar notificación como leída"""
    notification = await db.get(Notification, notification_id)
    
    if not notification:
        raise HTTPException(status_code=404, detail="Notificación no encontrada")
    
    if notification.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No autorizado"
        )
    
    notification.is_read = True
    notification.read_at = datetime.utcnow()
    await db.commit()
    
    return {"message": "Marcado como leído"}


@router.delete("/{notification_id}")
async def delete_notification(
    notification_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Eliminar notificación"""
    notification = await db.get(Notification, notification_id)
    
    if not notification:
        raise HTTPException(status_code=404, detail="Notificación no encontrada")
    
    if notification.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No autorizado"
        )
    
    await db.delete(notification)
    await db.commit()
    
    return {"message": "Notificación eliminada"}


@router.get("/unread-count")
async def get_unread_count(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Obtener cantidad de notificaciones sin leer"""
    result = await db.execute(
        select(Notification)
        .where(
            Notification.user_id == current_user.id,
            Notification.is_read == False
        )
    )
    count = len(result.scalars().all())
    return {"unread_count": count}
