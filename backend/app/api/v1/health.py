"""Health and Info endpoints"""
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.config import settings

router = APIRouter(prefix="/api/v1", tags=["info"])

@router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "ok", "version": settings.VERSION}


@router.get("/info")
async def get_info():
    """Get API information"""
    return {
        "name": settings.APP_NAME,
        "version": settings.VERSION,
        "api_version": "v1"
    }
