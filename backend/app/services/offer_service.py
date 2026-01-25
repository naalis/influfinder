"""Offer service"""
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from datetime import datetime
from app.models.offer import Offer
from app.schemas.offer import OfferCreate, OfferUpdate

class OfferService:
    
    @staticmethod
    async def create_offer(db: AsyncSession, offer_data: OfferCreate, business_id: int) -> Offer:
        """Crear nueva oferta"""
        offer = Offer(
            business_id=business_id,
            title=offer_data.title,
            description=offer_data.description,
            category=offer_data.category,
            budget_min=offer_data.budget_min,
            budget_max=offer_data.budget_max,
            currency=offer_data.currency,
            payment_terms=offer_data.payment_terms,
            requirements={
                "influencer": offer_data.influencer_requirements.dict(),
                "regular": offer_data.regular_creator_requirements.dict()
            },
            content_specs=offer_data.content_specs.dict(),
            deliverables=offer_data.deliverables or {},
            application_deadline=offer_data.application_deadline,
            content_deadline=offer_data.content_deadline,
            platforms=offer_data.platforms,
            status="draft",
            is_public=False
        )
        
        db.add(offer)
        await db.commit()
        await db.refresh(offer)
        return offer
    
    @staticmethod
    async def get_offer_by_id(db: AsyncSession, offer_id: int) -> Offer:
        """Obtener oferta por ID"""
        return await db.get(Offer, offer_id)
    
    @staticmethod
    async def update_offer(db: AsyncSession, offer: Offer, offer_data: OfferUpdate) -> Offer:
        """Actualizar oferta"""
        for field, value in offer_data.dict(exclude_unset=True).items():
            setattr(offer, field, value)
        
        offer.updated_at = datetime.utcnow()
        await db.commit()
        await db.refresh(offer)
        return offer
