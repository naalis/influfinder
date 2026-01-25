from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
import httpx
from app.config import settings

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class SecurityService:
    
    @staticmethod
    def hash_password(password: str) -> str:
        """Hashear contraseña con bcrypt"""
        return pwd_context.hash(password)
    
    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        """Verificar contraseña"""
        return pwd_context.verify(plain_password, hashed_password)
    
    @staticmethod
    def create_access_token(
        data: dict,
        expires_delta: Optional[timedelta] = None
    ) -> str:
        """Crear JWT access token"""
        to_encode = data.copy()
        
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(
                minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
            )
        
        to_encode.update({"exp": expire, "iat": datetime.utcnow()})
        
        encoded_jwt = jwt.encode(
            to_encode,
            settings.SECRET_KEY,
            algorithm=settings.ALGORITHM
        )
        return encoded_jwt
    
    @staticmethod
    def create_refresh_token(data: dict) -> str:
        """Crear JWT refresh token"""
        to_encode = data.copy()
        expire = datetime.utcnow() + timedelta(
            days=settings.REFRESH_TOKEN_EXPIRE_DAYS
        )
        to_encode.update({"exp": expire, "iat": datetime.utcnow(), "type": "refresh"})
        
        encoded_jwt = jwt.encode(
            to_encode,
            settings.SECRET_KEY,
            algorithm=settings.ALGORITHM
        )
        return encoded_jwt
    
    @staticmethod
    def decode_token(token: str) -> dict:
        """Decodificar y validar JWT"""
        try:
            payload = jwt.decode(
                token,
                settings.SECRET_KEY,
                algorithms=[settings.ALGORITHM]
            )
            return payload
        except JWTError:
            return None


class OAuthService:
    """Servicio para validar OAuth tokens de múltiples plataformas"""
    
    @staticmethod
    async def verify_instagram_token(access_token: str) -> dict:
        """
        Verificar token de Instagram y obtener datos del usuario
        https://developers.facebook.com/docs/instagram-graph-api
        """
        async with httpx.AsyncClient() as client:
            # Obtener información del usuario
            response = await client.get(
                "https://graph.instagram.com/me",
                params={
                    "fields": "id,username,name,profile_picture_url,biography,followers_count,follows,ig_id,verified",
                    "access_token": access_token
                }
            )
            
            if response.status_code != 200:
                return None
            
            data = response.json()
            
            return {
                "provider_id": data.get("id"),
                "username": data.get("username"),
                "name": data.get("name"),
                "avatar_url": data.get("profile_picture_url"),
                "bio": data.get("biography"),
                "followers": data.get("followers_count"),
                "verified": data.get("verified"),
                "access_token": access_token
            }
    
    @staticmethod
    async def verify_facebook_token(access_token: str) -> dict:
        """
        Verificar token de Facebook
        https://developers.facebook.com/docs/facebook-login/access-tokens/access-token-tool
        """
        async with httpx.AsyncClient() as client:
            response = await client.get(
                "https://graph.facebook.com/me",
                params={
                    "fields": "id,name,email,picture,verified",
                    "access_token": access_token
                }
            )
            
            if response.status_code != 200:
                return None
            
            data = response.json()
            
            return {
                "provider_id": data.get("id"),
                "name": data.get("name"),
                "email": data.get("email"),
                "avatar_url": data.get("picture", {}).get("data", {}).get("url"),
                "verified": data.get("verified"),
                "access_token": access_token
            }
    
    @staticmethod
    async def verify_tiktok_token(access_token: str) -> dict:
        """
        Verificar token de TikTok
        https://developers.tiktok.com/doc/login-kit
        """
        async with httpx.AsyncClient() as client:
            response = await client.get(
                "https://open.tiktokapis.com/v1/oauth/user/info/",
                headers={"Authorization": f"Bearer {access_token}"}
            )
            
            if response.status_code != 200:
                return None
            
            data = response.json().get("data", {})
            user_data = data.get("user", {})
            
            return {
                "provider_id": user_data.get("open_id"),
                "username": user_data.get("display_name"),
                "avatar_url": user_data.get("avatar_url"),
                "access_token": access_token
            }
    
    @staticmethod
    async def verify_google_token(id_token: str) -> dict:
        """
        Verificar ID token de Google
        https://developers.google.com/identity/protocols/oauth2
        """
        try:
            from google.auth.transport import requests
            from google.oauth2 import id_token
            
            request = requests.Request()
            payload = id_token.verify_oauth2_token(
                id_token,
                request,
                settings.GOOGLE_CLIENT_ID
            )
            
            return {
                "provider_id": payload.get("sub"),
                "name": payload.get("name"),
                "email": payload.get("email"),
                "avatar_url": payload.get("picture"),
                "verified": payload.get("email_verified"),
                "access_token": id_token
            }
        except Exception:
            return None
