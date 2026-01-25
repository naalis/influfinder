"""Authentication service"""
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from datetime import datetime, timedelta
from app.models import User, Profile
from app.models.user import UserType, AuthProvider
from app.schemas import UserRegisterEmail, UserRegisterOAuth
from app.security import SecurityService
from app.database import AsyncSessionLocal
import secrets

class AuthService:
    
    @staticmethod
    async def get_user_by_email(db: AsyncSession, email: str) -> User:
        """Obtener usuario por email"""
        result = await db.execute(
            select(User).where(User.email == email)
        )
        return result.scalar_one_or_none()
    
    @staticmethod
    async def get_user_by_id(db: AsyncSession, user_id: int) -> User:
        """Obtener usuario por ID"""
        return await db.get(User, user_id)
    
    @staticmethod
    async def get_user_by_instagram(db: AsyncSession, handle: str) -> User:
        """Obtener usuario por Instagram handle"""
        result = await db.execute(
            select(User).join(Profile).where(Profile.instagram_handle == handle)
        )
        return result.scalar_one_or_none()
    
    @staticmethod
    async def get_user_by_tiktok(db: AsyncSession, handle: str) -> User:
        """Obtener usuario por TikTok handle"""
        result = await db.execute(
            select(User).join(Profile).where(Profile.tiktok_handle == handle)
        )
        return result.scalar_one_or_none()
    
    @staticmethod
    async def get_user_by_oauth(db: AsyncSession, provider: AuthProvider, value: str) -> User:
        """Obtener usuario por OAuth provider"""
        if provider == AuthProvider.INSTAGRAM:
            return await AuthService.get_user_by_instagram(db, value)
        elif provider == AuthProvider.TIKTOK:
            return await AuthService.get_user_by_tiktok(db, value)
        elif provider in [AuthProvider.FACEBOOK, AuthProvider.GOOGLE]:
            return await AuthService.get_user_by_email(db, value)
        return None
    
    @staticmethod
    async def create_user_email(db: AsyncSession, user_data: UserRegisterEmail) -> User:
        """Crear usuario con email y contraseña"""
        user = User(
            email=user_data.email,
            username=user_data.email.split('@')[0],
            password_hash=SecurityService.hash_password(user_data.password),
            user_type=user_data.user_type,
            is_active=False,
            is_verified=False
        )
        
        db.add(user)
        await db.flush()  # Para obtener el ID
        
        # Crear perfil
        profile = Profile(
            user_id=user.id,
            full_name=user_data.full_name,
            country=user_data.country
        )
        db.add(profile)
        await db.commit()
        await db.refresh(user)
        
        return user
    
    @staticmethod
    async def create_user_oauth(
        db: AsyncSession,
        oauth_data: dict,
        provider: AuthProvider,
        user_type: UserType,
        country: str = None
    ) -> User:
        """Crear usuario con OAuth"""
        # Generar email único si no existe
        email = oauth_data.get("email") or f"{provider.value}_{oauth_data.get('provider_id')}@influfinder.com"
        
        user = User(
            email=email,
            username=oauth_data.get("username") or oauth_data.get("name", "user"),
            password_hash=None,  # No necesita contraseña
            user_type=user_type,
            is_active=True,
            is_verified=True,
            email_verified_at=datetime.utcnow(),
            auth_providers={
                provider.value: {
                    "provider_id": oauth_data.get("provider_id"),
                    "access_token": oauth_data.get("access_token"),
                    "connected_at": datetime.utcnow().isoformat()
                }
            }
        )
        
        db.add(user)
        await db.flush()
        
        # Crear perfil
        profile_data = {
            "user_id": user.id,
            "full_name": oauth_data.get("name"),
            "avatar_url": oauth_data.get("avatar_url"),
            "bio": oauth_data.get("bio"),
            "country": country
        }
        
        # Agregar datos específicos del provider
        if provider == AuthProvider.INSTAGRAM:
            profile_data["instagram_handle"] = oauth_data.get("username")
            profile_data["instagram_followers"] = oauth_data.get("followers", 0)
            profile_data["instagram_verified"] = oauth_data.get("verified", False)
            profile_data["instagram_profile_id"] = oauth_data.get("provider_id")
        
        elif provider == AuthProvider.TIKTOK:
            profile_data["tiktok_handle"] = oauth_data.get("username")
            profile_data["tiktok_verified"] = oauth_data.get("verified", False)
        
        profile = Profile(**profile_data)
        db.add(profile)
        await db.commit()
        await db.refresh(user)
        
        return user
    
    @staticmethod
    async def save_verification_token(db: AsyncSession, user_id: int, token: str):
        """Guardar token de verificación en Redis"""
        # En producción usar Redis
        from app.config import settings
        import redis
        r = redis.from_url(settings.REDIS_URL)
        r.setex(f"verify_token:{token}", 86400, str(user_id))  # Expira en 24 horas
    
    @staticmethod
    async def verify_email_token(db: AsyncSession, token: str) -> User:
        """Verificar token de email"""
        from app.config import settings
        import redis
        r = redis.from_url(settings.REDIS_URL)
        user_id = r.get(f"verify_token:{token}")
        
        if not user_id:
            return None
        
        user = await AuthService.get_user_by_id(db, int(user_id))
        return user
    
    @staticmethod
    async def save_reset_token(db: AsyncSession, user_id: int, token: str, expires_in: int = 3600):
        """Guardar token de reset de contraseña"""
        from app.config import settings
        import redis
        r = redis.from_url(settings.REDIS_URL)
        r.setex(f"reset_token:{token}", expires_in, str(user_id))
    
    @staticmethod
    async def verify_reset_token(db: AsyncSession, token: str) -> User:
        """Verificar token de reset"""
        from app.config import settings
        import redis
        r = redis.from_url(settings.REDIS_URL)
        user_id = r.get(f"reset_token:{token}")
        
        if not user_id:
            return None
        
        user = await AuthService.get_user_by_id(db, int(user_id))
        return user
