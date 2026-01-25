"""Offer endpoints"""
from fastapi import APIRouter, HTTPException, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc, and_, or_, func
from typing import List, Optional
from datetime import datetime

from app.models.offer import Offer, OfferStatus
from app.models import User
from app.schemas.offer import OfferCreate, OfferUpdate, OfferOut, OfferDetailOut
from app.database import get_db
from app.utils.dependencies import get_current_user
from app.services.offer_service import OfferService

router = APIRouter(prefix="/api/v1/offers", tags=["offers"])

@router.post("/", response_model=OfferOut, status_code=201)
async def create_offer(
    offer_data: OfferCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Crear nueva oferta"""
    if current_user.user_type.value not in ["business", "agency"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Solo business y agency pueden crear ofertas"
        )
    
    offer = await OfferService.create_offer(db, offer_data, current_user.id)
    return offer


@router.get("/", response_model=List[OfferOut])
async def list_offers(
    category: Optional[str] = Query(None),
    platforms: Optional[str] = Query(None),
    budget_min: Optional[float] = Query(None),
    budget_max: Optional[float] = Query(None),
    search: Optional[str] = Query(None),
    sort_by: str = Query("recent", regex="^(recent|trending|deadline|payment)$"),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user)
):
    """Listar ofertas activas"""
    query = select(Offer).where(
        and_(
            Offer.status == OfferStatus.ACTIVE,
            Offer.is_public == True,
            Offer.application_deadline > datetime.utcnow()
        )
    )
    
    if category:
        query = query.where(Offer.category == category)
    
    if budget_min:
        query = query.where(Offer.budget_min >= budget_min)
    
    if budget_max:
        query = query.where(Offer.budget_max <= budget_max)
    
    if search:
        search_term = f"%{search}%"
        query = query.where(
            or_(
                Offer.title.ilike(search_term),
                Offer.description.ilike(search_term)
            )
        )
    
    if sort_by == "trending":
        query = query.order_by(desc(Offer.views_count))
    elif sort_by == "deadline":
        query = query.order_by(Offer.application_deadline)
    elif sort_by == "payment":
        query = query.order_by(desc(Offer.budget_max or Offer.budget_min))
    else:
        query = query.order_by(desc(Offer.published_at))
    
    result = await db.execute(query.offset((page - 1) * limit).limit(limit))
    offers = result.scalars().all()
    
    for offer in offers:
        offer.views_count += 1
    
    await db.commit()
    
    return offers


@router.get("/{offer_id}", response_model=OfferDetailOut)
async def get_offer(
    offer_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user)
):
    """Obtener detalles de oferta"""
    offer = await OfferService.get_offer_by_id(db, offer_id)
    
    if not offer:
        raise HTTPException(status_code=404, detail="Oferta no encontrada")
    
    if offer.status != OfferStatus.ACTIVE or not offer.is_public:
        if not current_user or current_user.id != offer.business_id:
            raise HTTPException(status_code=404, detail="Oferta no encontrada")
    
    offer.views_count += 1
    await db.commit()
    
    return offer


@router.patch("/{offer_id}", response_model=OfferOut)
async def update_offer(
    offer_id: int,
    offer_data: OfferUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Actualizar oferta"""
    offer = await OfferService.get_offer_by_id(db, offer_id)
    
    if not offer:
        raise HTTPException(status_code=404, detail="Oferta no encontrada")
    
    if offer.business_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tienes permiso"
        )
    
    offer = await OfferService.update_offer(db, offer, offer_data)
    return offer


@router.post("/{offer_id}/publish", response_model=OfferOut)
async def publish_offer(
    offer_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Publicar oferta"""
    offer = await OfferService.get_offer_by_id(db, offer_id)
    
    if not offer:
        raise HTTPException(status_code=404, detail="Oferta no encontrada")
    
    if offer.business_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tienes permiso"
        )
    
    if offer.status != OfferStatus.DRAFT:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Solo ofertas en DRAFT pueden publicarse"
        )
    
    offer.status = OfferStatus.ACTIVE
    offer.is_public = True
    offer.published_at = datetime.utcnow()
    
    await db.commit()
    await db.refresh(offer)
    
    return offer


@router.post("/{offer_id}/archive")
async def archive_offer(
    offer_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Archivar oferta"""
    offer = await OfferService.get_offer_by_id(db, offer_id)
    
    if not offer:
        raise HTTPException(status_code=404, detail="Oferta no encontrada")
    
    if offer.business_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tienes permiso"
        )
    
    offer.status = OfferStatus.ARCHIVED
    await db.commit()
    
    return {"message": "Oferta archivada"}


@router.get("/me/created", response_model=List[OfferOut])
async def my_offers(
    status: Optional[OfferStatus] = Query(None),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Mis ofertas creadas"""
    if current_user.user_type.value not in ["business", "agency"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Solo business y agency"
        )
    
    query = select(Offer).where(Offer.business_id == current_user.id)
    
    if status:
        query = query.where(Offer.status == status)
    
    query = query.order_by(desc(Offer.created_at))
    
    result = await db.execute(query)
    return result.scalars().all()
