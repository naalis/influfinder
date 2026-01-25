"""Utility functions and dependencies"""
from fastapi import Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.models import User
from app.security import SecurityService
from app.database import get_db
from typing import Optional

async def get_current_user(
    token: str = Depends(lambda: None),
    db: AsyncSession = Depends(get_db)
) -> Optional[User]:
    """Obtener usuario actual del token JWT"""
    if not token:
        return None
    
    # Obtener token del header Authorization
    from fastapi import Header
    async def get_token_from_header(authorization: Optional[str] = Header(None)):
        if not authorization:
            return None
        parts = authorization.split()
        if len(parts) == 2 and parts[0].lower() == "bearer":
            return parts[1]
        return None
    
    payload = SecurityService.decode_token(token)
    
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido"
        )
    
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido"
        )
    
    from app.services.auth_service import AuthService
    user = await AuthService.get_user_by_id(db, int(user_id))
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario no encontrado"
        )
    
    return user


async def get_current_user_optional(
    token: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
) -> Optional[User]:
    """Obtener usuario actual (opcional)"""
    if not token:
        return None
    
    return await get_current_user(token, db)
