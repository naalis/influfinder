"""Notification service"""
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime
from app.models.notification import Notification, NotificationType

class NotificationService:
    
    @staticmethod
    async def create_notification(
        db: AsyncSession,
        user_id: int,
        notification_type: NotificationType,
        title: str,
        content: str,
        related_offer_id: int = None,
        related_collaboration_id: int = None,
        related_application_id: int = None,
        related_user_id: int = None,
        data: dict = None
    ) -> Notification:
        """Crear notificación"""
        notification = Notification(
            user_id=user_id,
            type=notification_type,
            title=title,
            content=content,
            related_offer_id=related_offer_id,
            related_collaboration_id=related_collaboration_id,
            related_application_id=related_application_id,
            related_user_id=related_user_id,
            data=data or {}
        )
        
        db.add(notification)
        await db.commit()
        await db.refresh(notification)
        return notification
    
    @staticmethod
    async def notify_new_application(db: AsyncSession, business_id: int, application_id: int):
        """Notificar nueva aplicación"""
        await NotificationService.create_notification(
            db,
            business_id,
            NotificationType.APPLICATION_RECEIVED,
            "Nueva aplicación recibida",
            "Un creador ha aplicado a una de tus ofertas",
            related_application_id=application_id
        )
    
    @staticmethod
    async def notify_application_accepted(db: AsyncSession, creator_id: int, application_id: int):
        """Notificar aplicación aceptada"""
        await NotificationService.create_notification(
            db,
            creator_id,
            NotificationType.APPLICATION_ACCEPTED,
            "¡Aplicación aceptada!",
            "Tu aplicación ha sido aceptada. Es hora de negociar los detalles.",
            related_application_id=application_id
        )
    
    @staticmethod
    async def notify_application_rejected(db: AsyncSession, creator_id: int, application_id: int):
        """Notificar aplicación rechazada"""
        await NotificationService.create_notification(
            db,
            creator_id,
            NotificationType.APPLICATION_REJECTED,
            "Aplicación rechazada",
            "Tu aplicación ha sido rechazada. Sigue intentando con otras ofertas.",
            related_application_id=application_id
        )
    
    @staticmethod
    async def notify_collaboration_scheduled(db: AsyncSession, user_id: int, collaboration_id: int):
        """Notificar colaboración agendada"""
        await NotificationService.create_notification(
            db,
            user_id,
            NotificationType.COLLABORATION_SCHEDULED,
            "Colaboración agendada",
            "La fecha de ejecución ha sido confirmada.",
            related_collaboration_id=collaboration_id
        )
    
    @staticmethod
    async def notify_content_submitted(db: AsyncSession, business_id: int, submission_id: int):
        """Notificar contenido enviado"""
        await NotificationService.create_notification(
            db,
            business_id,
            NotificationType.CONTENT_SUBMITTED,
            "Contenido enviado",
            "El creador ha enviado el contenido para revisión."
        )
    
    @staticmethod
    async def notify_tier_upgraded(db: AsyncSession, creator_id: int, new_tier: int):
        """Notificar ascenso de tier"""
        tier_names = ["Newbie", "Explorer", "Pro", "Elite", "Master", "Legend"]
        await NotificationService.create_notification(
            db,
            creator_id,
            NotificationType.TIER_UPGRADED,
            f"¡Ascendiste a {tier_names[new_tier]}!",
            f"Felicidades, ahora eres nivel {tier_names[new_tier]}. Desbloquea nuevas ofertas.",
            data={"new_tier": new_tier}
        )
    
    @staticmethod
    async def notify_dispute_opened(db: AsyncSession, collaboration_id: int, user_id: int, reason: str):
        """Notificar disputa abierta"""
        # Notificar a soporte
        await NotificationService.create_notification(
            db,
            1,  # Admin/Support user ID
            NotificationType.DISPUTE_OPENED,
            "Nueva disputa abierta",
            f"Se ha abierto una disputa en la colaboración #{collaboration_id}. Razón: {reason}",
            related_collaboration_id=collaboration_id,
            related_user_id=user_id
        )
