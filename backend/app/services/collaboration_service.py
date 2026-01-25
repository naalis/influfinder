"""Collaboration service"""
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime
from app.models.collaboration import Application, ApplicationStatus, Collaboration
from app.models import Profile
from app.schemas.collaboration import ApplicationCreate

class CollaborationService:
    
    @staticmethod
    async def create_application(db: AsyncSession, app_data: ApplicationCreate, creator_id: int) -> Application:
        """Crear aplicación a oferta"""
        application = Application(
            offer_id=app_data.offer_id,
            creator_id=creator_id,
            message=app_data.message,
            media_attachments=app_data.media_attachments or [],
            proposed_fee=app_data.proposed_fee,
            proposed_date=app_data.proposed_date,
            status=ApplicationStatus.APPLIED
        )
        
        db.add(application)
        await db.commit()
        await db.refresh(application)
        return application
    
    @staticmethod
    async def create_collaboration(
        db: AsyncSession,
        offer_id: int,
        application_id: int,
        creator_id: int,
        business_id: int,
        agreed_fee: float
    ) -> Collaboration:
        """Crear colaboración desde aplicación aceptada"""
        collaboration = Collaboration(
            offer_id=offer_id,
            application_id=application_id,
            creator_id=creator_id,
            business_id=business_id,
            agreed_fee=agreed_fee
        )
        
        db.add(collaboration)
        await db.commit()
        await db.refresh(collaboration)
        return collaboration
    
    @staticmethod
    async def update_creator_tier(db: AsyncSession, creator_id: int):
        """Actualizar tier del creador basado en colaboraciones completadas"""
        profile = await db.execute(
            select(Profile).where(Profile.user_id == creator_id)
        )
        profile = profile.scalar_one_or_none()
        
        if not profile:
            return
        
        # Contar colaboraciones completadas
        from app.models.collaboration import CollaborationStatus
        completed = await db.execute(
            select(Collaboration).where(
                Collaboration.creator_id == creator_id,
                Collaboration.status == CollaborationStatus.COMPLETED
            )
        )
        completed_count = len(completed.scalars().all())
        
        profile.completed_collaborations = completed_count
        
        # Actualizar tier basado en completadas
        # Tier 0: 0 completadas
        # Tier 1: 1-3 completadas (Newbie)
        # Tier 2: 4-10 completadas (Explorer)
        # Tier 3: 11-25 completadas (Pro)
        # Tier 4: 26-50 completadas (Elite)
        # Tier 5: 50+ completadas (Master/Legend)
        
        if completed_count == 0:
            profile.tier_level = 0
            profile.tier_progress = 0.0
        elif completed_count <= 3:
            profile.tier_level = 1
            profile.tier_progress = (completed_count / 3) * 100
            profile.karma_score = completed_count * 100
        elif completed_count <= 10:
            profile.tier_level = 2
            profile.tier_progress = ((completed_count - 3) / 7) * 100
            profile.karma_score = 300 + (completed_count - 3) * 50
        elif completed_count <= 25:
            profile.tier_level = 3
            profile.tier_progress = ((completed_count - 10) / 15) * 100
            profile.karma_score = 650 + (completed_count - 10) * 30
        elif completed_count <= 50:
            profile.tier_level = 4
            profile.tier_progress = ((completed_count - 25) / 25) * 100
            profile.karma_score = 1100 + (completed_count - 25) * 20
        else:
            profile.tier_level = 5
            profile.tier_progress = 100.0
            profile.karma_score = 2000 + (completed_count - 50) * 10
        
        await db.commit()
