"""User schemas"""
from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional, List, Dict
from datetime import datetime
from enum import Enum

class UserType(str, Enum):
    CREATOR = "creator"
    BUSINESS = "business"
    AGENCY = "agency"

class AuthProvider(str, Enum):
    EMAIL = "email"
    INSTAGRAM = "instagram"
    FACEBOOK = "facebook"
    TIKTOK = "tiktok"
    GOOGLE = "google"

# ============ REGISTRO ============

class UserRegisterEmail(BaseModel):
    """Registro con Email & Contraseña"""
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=72)  # Bcrypt limit
    confirm_password: str
    full_name: str
    user_type: UserType
    country: str = Field(..., min_length=2, max_length=2)
    
    @validator('password')
    def password_strength(cls, v):
        """Validar contraseña fuerte"""
        if not any(c.isupper() for c in v):
            raise ValueError('Debe contener mayúscula')
        if not any(c.isdigit() for c in v):
            raise ValueError('Debe contener número')
        if not any(c in '!@#$%^&*' for c in v):
            raise ValueError('Debe contener carácter especial')
        return v
    
    @validator('confirm_password')
    def passwords_match(cls, v, values):
        if 'password' in values and v != values['password']:
            raise ValueError('Las contraseñas no coinciden')
        return v


class UserRegisterOAuth(BaseModel):
    """Registro con OAuth"""
    provider: AuthProvider
    access_token: str
    user_type: UserType
    country: Optional[str] = None
    
    @validator('provider')
    def provider_is_oauth(cls, v):
        if v == AuthProvider.EMAIL:
            raise ValueError('Use UserRegisterEmail para registro por email')
        return v


class UserLoginEmail(BaseModel):
    """Login con Email & Contraseña"""
    email: EmailStr
    password: str
    remember_me: bool = False


class UserLoginOAuth(BaseModel):
    """Login con OAuth"""
    provider: AuthProvider
    access_token: str


# ============ RESPUESTAS ============

class ProfileOut(BaseModel):
    """Perfil del usuario"""
    id: int
    full_name: Optional[str] = None
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    tier_level: int = 0
    karma_score: int = 0
    instagram_handle: Optional[str] = None
    instagram_followers: int = 0
    tiktok_handle: Optional[str] = None
    tiktok_followers: int = 0
    rating: float = 0.0
    rating_count: int = 0
    categories: List[str] = []
    country: Optional[str] = None
    city: Optional[str] = None
    
    class Config:
        from_attributes = True


class UserOut(BaseModel):
    """Usuario público"""
    id: int
    email: str
    username: Optional[str] = None
    user_type: UserType
    created_at: datetime
    profile: Optional[ProfileOut] = None
    
    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    """Respuesta de token tras login"""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int
    user: UserOut


class UserMeOut(UserOut):
    """Mi perfil (información sensible)"""
    is_verified: bool
    email_verified_at: Optional[datetime] = None
    last_login: Optional[datetime] = None
    auth_providers: Dict = {}


class VerifyEmailRequest(BaseModel):
    """Verificación de email"""
    token: str


class ResendVerificationEmail(BaseModel):
    email: EmailStr


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str
    password: str = Field(..., min_length=8)
    confirm_password: str


class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str = Field(..., min_length=8)
    confirm_password: str


class UpdateProfileRequest(BaseModel):
    """Actualizar perfil del usuario"""
    full_name: Optional[str] = None
    bio: Optional[str] = None
    city: Optional[str] = None
    categories: Optional[List[str]] = None
    instagram_handle: Optional[str] = None
    tiktok_handle: Optional[str] = None
    timezone: Optional[str] = None
    
    @validator('bio')
    def bio_length(cls, v):
        if v and len(v) > 500:
            raise ValueError('Máximo 500 caracteres')
        return v
