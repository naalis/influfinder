"""Content submission endpoints"""
from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional

from app.models.content import ContentSubmission, SubmissionStatus
from app.models import User
from app.schemas.content import ContentSubmissionCreate, ContentSubmissionOut, ContentAnalysisResult
from app.database import get_db
from app.utils.dependencies import get_current_user
from app.services.content_service import ContentAnalysisService

router = APIRouter(prefix="/api/v1/submissions", tags=["content"])

@router.post("/", response_model=ContentSubmissionOut, status_code=201)
async def create_submission(
    submission_data: ContentSubmissionCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Subir contenido"""
    from app.models.collaboration import Collaboration
    
    collaboration = await db.get(Collaboration, submission_data.collaboration_id)
    
    if not collaboration:
        raise HTTPException(status_code=404, detail="Colaboración no encontrada")
    
    if collaboration.creator_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tienes permiso"
        )
    
    submission = ContentSubmission(
        collaboration_id=submission_data.collaboration_id,
        creator_id=current_user.id,
        content_urls=submission_data.content_urls,
        captions=submission_data.captions,
        platform=submission_data.platform,
        platform_post_id=submission_data.platform_post_id,
        status=SubmissionStatus.SUBMITTED
    )
    
    db.add(submission)
    await db.commit()
    await db.refresh(submission)
    
    # Actualizar estado de colaboración
    collaboration.status = "content_submitted"
    await db.commit()
    
    return submission


@router.get("/{submission_id}", response_model=ContentSubmissionOut)
async def get_submission(
    submission_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Obtener detalles de submission"""
    submission = await db.get(ContentSubmission, submission_id)
    
    if not submission:
        raise HTTPException(status_code=404, detail="Submission no encontrado")
    
    # Verificar permisos
    from app.models.collaboration import Collaboration
    collaboration = await db.get(Collaboration, submission.collaboration_id)
    
    if (current_user.id != submission.creator_id and 
        current_user.id != collaboration.business_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No autorizado"
        )
    
    return submission


@router.post("/{submission_id}/analyze-ai", response_model=ContentAnalysisResult)
async def analyze_content_ai(
    submission_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Analizar contenido con IA"""
    submission = await db.get(ContentSubmission, submission_id)
    
    if not submission:
        raise HTTPException(status_code=404, detail="Submission no encontrado")
    
    from app.models.collaboration import Collaboration
    collaboration = await db.get(Collaboration, submission.collaboration_id)
    
    if current_user.id != collaboration.business_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tienes permiso"
        )
    
    # Analizar primer contenido
    if not submission.content_urls:
        raise HTTPException(status_code=400, detail="Sin contenido para analizar")
    
    from app.models.offer import Offer
    offer = await db.get(Offer, collaboration.offer_id)
    
    result = await ContentAnalysisService.analyze_content(
        submission.content_urls[0],
        offer.requirements.get("content_specs", {}),
        submission.platform
    )
    
    submission.ai_score = result["ai_score"]
    submission.ai_analysis = result["analysis"]
    submission.status = SubmissionStatus.UNDER_REVIEW
    await db.commit()
    
    return result


@router.post("/{submission_id}/approve")
async def approve_submission(
    submission_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Aprobar contenido"""
    submission = await db.get(ContentSubmission, submission_id)
    
    if not submission:
        raise HTTPException(status_code=404, detail="Submission no encontrado")
    
    from app.models.collaboration import Collaboration
    collaboration = await db.get(Collaboration, submission.collaboration_id)
    
    if current_user.id != collaboration.business_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tienes permiso"
        )
    
    submission.status = SubmissionStatus.APPROVED
    submission.reviewed_at = __import__('datetime').datetime.utcnow()
    submission.reviewed_by = current_user.id
    
    collaboration.status = "completed"
    await db.commit()
    
    return {"message": "Contenido aprobado"}


@router.post("/{submission_id}/reject")
async def reject_submission(
    submission_id: int,
    notes: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Rechazar contenido"""
    submission = await db.get(ContentSubmission, submission_id)
    
    if not submission:
        raise HTTPException(status_code=404, detail="Submission no encontrado")
    
    from app.models.collaboration import Collaboration
    collaboration = await db.get(Collaboration, submission.collaboration_id)
    
    if current_user.id != collaboration.business_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tienes permiso"
        )
    
    submission.status = SubmissionStatus.REJECTED
    submission.reviewed_at = __import__('datetime').datetime.utcnow()
    submission.reviewed_by = current_user.id
    submission.reviewer_notes = notes
    await db.commit()
    
    return {"message": "Contenido rechazado"}
