"""Collaboration endpoints"""
from fastapi import APIRouter, HTTPException, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc, and_, or_
from typing import List, Optional
from datetime import datetime

from app.models.collaboration import Application, Collaboration, ApplicationStatus, CollaborationStatus
from app.models.offer import Offer
from app.models import User
from app.schemas.collaboration import (
    ApplicationCreate, ApplicationOut, ApplicationMeOut, ApplicationReview,
    CollaborationSchedule, CollaborationRate, CollaborationOut, CollaborationDetailOut
)
from app.database import get_db
from app.utils.dependencies import get_current_user
from app.services.collaboration_service import CollaborationService
from app.services.notification_service import NotificationService

router = APIRouter(prefix="/api/v1", tags=["collaborations"])

# ============ APLICACIONES ============

@router.post("/applications", response_model=ApplicationOut, status_code=201)
async def apply_to_offer(
    app_data: ApplicationCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Aplicar a una oferta"""
    if current_user.user_type.value != "creator":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Solo creators pueden aplicar"
        )
    
    offer = await db.get(Offer, app_data.offer_id)
    if not offer:
        raise HTTPException(status_code=404, detail="Oferta no encontrada")
    
    existing = await db.scalar(
        select(Application).where(
            and_(
                Application.offer_id == app_data.offer_id,
                Application.creator_id == current_user.id
            )
        )
    )
    
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Ya has aplicado a esta oferta"
        )
    
    application = await CollaborationService.create_application(
        db, app_data, current_user.id
    )
    
    await NotificationService.notify_new_application(
        db, offer.business_id, application.id
    )
    
    return application


@router.get("/applications", response_model=List[ApplicationMeOut])
async def get_my_applications(
    status_filter: Optional[ApplicationStatus] = Query(None, alias="status"),
    offer_id: Optional[int] = Query(None),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Mis aplicaciones"""
    if current_user.user_type.value != "creator":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No autorizado"
        )
    
    query = select(Application).where(Application.creator_id == current_user.id)
    
    if status_filter:
        query = query.where(Application.status == status_filter)
    
    if offer_id:
        query = query.where(Application.offer_id == offer_id)
    
    query = query.order_by(desc(Application.applied_at))
    
    result = await db.execute(query)
    return result.scalars().all()


@router.get("/applications/{app_id}", response_model=ApplicationMeOut)
async def get_application(
    app_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Obtener detalles de aplicación"""
    application = await db.get(Application, app_id)
    
    if not application:
        raise HTTPException(status_code=404, detail="Aplicación no encontrada")
    
    offer = await db.get(Offer, application.offer_id)
    
    if (current_user.id != application.creator_id and 
        current_user.id != offer.business_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No autorizado"
        )
    
    return application


@router.post("/applications/{app_id}/review")
async def review_application(
    app_id: int,
    review: ApplicationReview,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Revisar aplicación"""
    application = await db.get(Application, app_id)
    
    if not application:
        raise HTTPException(status_code=404, detail="Aplicación no encontrada")
    
    offer = await db.get(Offer, application.offer_id)
    
    if offer.business_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No autorizado"
        )
    
    application.status = review.status
    application.reviewed_at = datetime.utcnow()
    application.responded_at = datetime.utcnow()
    
    if review.status == ApplicationStatus.REJECTED:
        application.rejection_reason = review.rejection_reason
        await db.commit()
        
        await NotificationService.notify_application_rejected(
            db, application.creator_id, application.id
        )
    
    elif review.status == ApplicationStatus.ACCEPTED:
        await db.commit()
        
        collaboration = await CollaborationService.create_collaboration(
            db,
            offer.id,
            application.id,
            application.creator_id,
            offer.business_id,
            application.proposed_fee or offer.budget_min
        )
        
        await NotificationService.notify_application_accepted(
            db, application.creator_id, application.id
        )
    
    return {"message": f"Aplicación {review.status.value}"}


# ============ COLABORACIONES ============

@router.get("/collaborations", response_model=List[CollaborationOut])
async def get_collaborations(
    status_filter: Optional[CollaborationStatus] = Query(None, alias="status"),
    role: str = Query("all", regex="^(creator|business|all)$"),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Mis colaboraciones"""
    filters = []
    
    if role == "creator" or role == "all":
        filters.append(Collaboration.creator_id == current_user.id)
    
    if role == "business" or role == "all":
        filters.append(Collaboration.business_id == current_user.id)
    
    query = select(Collaboration).where(or_(*filters) if len(filters) > 1 else filters[0])
    
    if status_filter:
        query = query.where(Collaboration.status == status_filter)
    
    query = query.order_by(desc(Collaboration.created_at))
    
    result = await db.execute(query)
    return result.scalars().all()


@router.get("/collaborations/{collab_id}", response_model=CollaborationDetailOut)
async def get_collaboration(
    collab_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Obtener detalles de colaboración"""
    collaboration = await db.get(Collaboration, collab_id)
    
    if not collaboration:
        raise HTTPException(status_code=404, detail="Colaboración no encontrada")
    
    if (current_user.id != collaboration.creator_id and 
        current_user.id != collaboration.business_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No autorizado"
        )
    
    return collaboration


@router.post("/collaborations/{collab_id}/schedule")
async def schedule_collaboration(
    collab_id: int,
    schedule: CollaborationSchedule,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Agendar colaboración"""
    collaboration = await db.get(Collaboration, collab_id)
    
    if not collaboration:
        raise HTTPException(status_code=404, detail="Colaboración no encontrada")
    
    if (current_user.id != collaboration.creator_id and 
        current_user.id != collaboration.business_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No autorizado"
        )
    
    collaboration.scheduled_date = schedule.scheduled_date
    collaboration.status = CollaborationStatus.SCHEDULED
    await db.commit()
    
    other_user_id = (collaboration.business_id 
                     if current_user.id == collaboration.creator_id 
                     else collaboration.creator_id)
    
    await NotificationService.notify_collaboration_scheduled(
        db, other_user_id, collab_id
    )
    
    return {"message": "Colaboración agendada"}


@router.post("/collaborations/{collab_id}/rate")
async def rate_collaboration(
    collab_id: int,
    rating: CollaborationRate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Calificar colaboración"""
    collaboration = await db.get(Collaboration, collab_id)
    
    if not collaboration:
        raise HTTPException(status_code=404, detail="Colaboración no encontrada")
    
    if (current_user.id != collaboration.creator_id and 
        current_user.id != collaboration.business_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No autorizado"
        )
    
    if current_user.id == collaboration.creator_id:
        collaboration.creator_rating = rating.rating
        collaboration.creator_feedback = rating.feedback
    else:
        collaboration.business_rating = rating.rating
        collaboration.business_feedback = rating.feedback
    
    if (collaboration.creator_rating is not None and 
        collaboration.business_rating is not None):
        collaboration.status = CollaborationStatus.COMPLETED
        collaboration.completed_date = datetime.utcnow()
        
        await CollaborationService.update_creator_tier(db, collaboration.creator_id)
    
    await db.commit()
    
    return {"message": "Calificación registrada"}
