"""User and Profile endpoints"""
from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from app.schemas import UserMeOut, UserOut, UpdateProfileRequest
from app.models import User, Profile
from app.database import get_db
from app.utils.dependencies import get_current_user

router = APIRouter(prefix="/api/v1/users", tags=["users"])


@router.get("/me", response_model=UserMeOut)
async def get_current_user_profile(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Obtener perfil del usuario actual (incluye información sensible)

    Retorna todos los datos del usuario autenticado incluyendo:
    - Información básica (id, email, username, user_type)
    - Estado de verificación
    - Perfil completo (tier, karma, redes sociales)
    - Providers OAuth conectados
    """
    # Refrescar datos del usuario desde la DB con el perfil
    stmt = select(User).where(User.id == current_user.id)
    result = await db.execute(stmt)
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado"
        )

    return user


@router.patch("/me", response_model=UserMeOut)
async def update_current_user_profile(
    profile_data: UpdateProfileRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Actualizar perfil del usuario actual

    Permite actualizar:
    - full_name: Nombre completo
    - bio: Biografía (máx 500 caracteres)
    - city: Ciudad
    - categories: Lista de categorías de interés
    - instagram_handle: Usuario de Instagram
    - tiktok_handle: Usuario de TikTok
    - timezone: Zona horaria
    """
    # Obtener el perfil actual
    if not current_user.profile:
        # Crear perfil si no existe
        profile = Profile(user_id=current_user.id)
        db.add(profile)
        current_user.profile = profile

    # Actualizar campos del perfil
    if profile_data.full_name is not None:
        current_user.profile.full_name = profile_data.full_name

    if profile_data.bio is not None:
        current_user.profile.bio = profile_data.bio

    if profile_data.city is not None:
        current_user.profile.city = profile_data.city

    if profile_data.categories is not None:
        current_user.profile.categories = profile_data.categories

    if profile_data.instagram_handle is not None:
        current_user.profile.instagram_handle = profile_data.instagram_handle

    if profile_data.tiktok_handle is not None:
        current_user.profile.tiktok_handle = profile_data.tiktok_handle

    if profile_data.timezone is not None:
        current_user.profile.timezone = profile_data.timezone

    await db.commit()
    await db.refresh(current_user)

    return current_user


@router.get("/{user_id}", response_model=UserOut)
async def get_user_by_id(
    user_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Obtener perfil público de otro usuario

    Retorna información pública del usuario:
    - Información básica (id, username, user_type)
    - Perfil público (tier, karma, redes sociales, rating)
    - NO incluye información sensible (email completo, providers OAuth)

    Nota: Se requiere autenticación para ver perfiles de otros usuarios
    """
    stmt = select(User).where(User.id == user_id)
    result = await db.execute(stmt)
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado"
        )

    # Si el usuario solicitado es el mismo que el actual, redirigir a /me
    if user.id == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Para obtener tu propio perfil usa GET /users/me"
        )

    return user
