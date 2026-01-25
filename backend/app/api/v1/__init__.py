"""API v1 endpoints"""
# Auth endpoints (TODO: Enable when fully implemented)
# from app.api.v1.auth import router as auth_router

# Active endpoints
from app.api.v1.health import router as health_router
from app.api.v1.offers import router as offers_router
from app.api.v1.collaborations import router as collaborations_router
from app.api.v1.submissions import router as submissions_router
from app.api.v1.notifications import router as notifications_router
from app.api.v1.messages import router as messages_router

__all__ = [
    # "auth_router",
    "health_router",
    "offers_router",
    "collaborations_router",
    "submissions_router",
    "notifications_router",
    "messages_router",
]


# ============ REGISTRO ============

@router.post("/register/email", response_model=TokenResponse, status_code=201)
async def register_with_email(
    user_data: UserRegisterEmail,
    db: AsyncSession = Depends(get_db)
):
    """Registro con email y contraseña"""
    existing_user = await AuthService.get_user_by_email(db, user_data.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email ya registrado"
        )
    
    user = await AuthService.create_user_email(db, user_data)
    
    verification_token = secrets.token_urlsafe(32)
    await AuthService.save_verification_token(db, user.id, verification_token)
    
    await EmailService.send_verification_email(user.email, verification_token)
    
    access_token = SecurityService.create_access_token(
        data={"sub": str(user.id), "type": user.user_type, "tier": 0}
    )
    refresh_token = SecurityService.create_refresh_token(
        data={"sub": str(user.id)}
    )
    
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        expires_in=1800,
        user=user
    )


@router.post("/register/instagram", response_model=TokenResponse, status_code=201)
async def register_with_instagram(
    oauth_data: UserRegisterOAuth,
    db: AsyncSession = Depends(get_db)
):
    """Registro con Instagram"""
    if oauth_data.provider.value != "instagram":
        raise HTTPException(status_code=400, detail="Provider debe ser instagram")
    
    instagram_data = await OAuthService.verify_instagram_token(oauth_data.access_token)
    if not instagram_data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token de Instagram inválido"
        )
    
    existing = await AuthService.get_user_by_instagram(db, instagram_data["username"])
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Cuenta Instagram ya registrada"
        )
    
    user = await AuthService.create_user_oauth(
        db,
        instagram_data,
        oauth_data.provider,
        oauth_data.user_type,
        oauth_data.country
    )
    
    access_token = SecurityService.create_access_token(
        data={"sub": str(user.id), "type": user.user_type, "tier": 0}
    )
    refresh_token = SecurityService.create_refresh_token(
        data={"sub": str(user.id)}
    )
    
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        expires_in=1800,
        user=user
    )


@router.post("/register/facebook", response_model=TokenResponse, status_code=201)
async def register_with_facebook(
    oauth_data: UserRegisterOAuth,
    db: AsyncSession = Depends(get_db)
):
    """Registro con Facebook"""
    facebook_data = await OAuthService.verify_facebook_token(oauth_data.access_token)
    if not facebook_data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token de Facebook inválido"
        )
    
    existing = await AuthService.get_user_by_email(db, facebook_data["email"])
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email ya registrado"
        )
    
    user = await AuthService.create_user_oauth(
        db,
        facebook_data,
        oauth_data.provider,
        oauth_data.user_type,
        oauth_data.country
    )
    
    access_token = SecurityService.create_access_token(
        data={"sub": str(user.id), "type": user.user_type, "tier": 0}
    )
    refresh_token = SecurityService.create_refresh_token(
        data={"sub": str(user.id)}
    )
    
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        expires_in=1800,
        user=user
    )


@router.post("/register/tiktok", response_model=TokenResponse, status_code=201)
async def register_with_tiktok(
    oauth_data: UserRegisterOAuth,
    db: AsyncSession = Depends(get_db)
):
    """Registro con TikTok"""
    tiktok_data = await OAuthService.verify_tiktok_token(oauth_data.access_token)
    if not tiktok_data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token de TikTok inválido"
        )
    
    existing = await AuthService.get_user_by_tiktok(db, tiktok_data["username"])
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Cuenta TikTok ya registrada"
        )
    
    user = await AuthService.create_user_oauth(
        db,
        tiktok_data,
        oauth_data.provider,
        oauth_data.user_type,
        oauth_data.country
    )
    
    access_token = SecurityService.create_access_token(
        data={"sub": str(user.id), "type": user.user_type, "tier": 0}
    )
    refresh_token = SecurityService.create_refresh_token(
        data={"sub": str(user.id)}
    )
    
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        expires_in=1800,
        user=user
    )


@router.post("/register/google", response_model=TokenResponse, status_code=201)
async def register_with_google(
    oauth_data: UserRegisterOAuth,
    db: AsyncSession = Depends(get_db)
):
    """Registro con Google"""
    google_data = await OAuthService.verify_google_token(oauth_data.access_token)
    if not google_data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token de Google inválido"
        )
    
    existing = await AuthService.get_user_by_email(db, google_data["email"])
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email ya registrado"
        )
    
    user = await AuthService.create_user_oauth(
        db,
        google_data,
        oauth_data.provider,
        oauth_data.user_type,
        oauth_data.country
    )
    
    access_token = SecurityService.create_access_token(
        data={"sub": str(user.id), "type": user.user_type, "tier": 0}
    )
    refresh_token = SecurityService.create_refresh_token(
        data={"sub": str(user.id)}
    )
    
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        expires_in=1800,
        user=user
    )


# ============ LOGIN ============

@router.post("/login", response_model=TokenResponse)
async def login(
    credentials: UserLoginEmail,
    db: AsyncSession = Depends(get_db)
):
    """Login con email y contraseña"""
    user = await AuthService.get_user_by_email(db, credentials.email)
    
    if not user or not user.password_hash:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email o contraseña incorrectos"
        )
    
    if not SecurityService.verify_password(credentials.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email o contraseña incorrectos"
        )
    
    if not user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Por favor verifica tu email"
        )
    
    user.last_login = datetime.utcnow()
    await db.commit()
    
    access_token = SecurityService.create_access_token(
        data={"sub": str(user.id), "type": user.user_type.value, "tier": user.profile.tier_level}
    )
    refresh_token = SecurityService.create_refresh_token(
        data={"sub": str(user.id)}
    )
    
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        expires_in=1800,
        user=user
    )


@router.post("/login/oauth", response_model=TokenResponse)
async def login_oauth(
    oauth_login: UserLoginOAuth,
    db: AsyncSession = Depends(get_db)
):
    """Login con OAuth"""
    provider_data = None
    lookup_value = None
    
    if oauth_login.provider.value == "instagram":
        provider_data = await OAuthService.verify_instagram_token(oauth_login.access_token)
        lookup_value = provider_data["username"] if provider_data else None
    
    elif oauth_login.provider.value == "facebook":
        provider_data = await OAuthService.verify_facebook_token(oauth_login.access_token)
        lookup_value = provider_data["email"] if provider_data else None
    
    elif oauth_login.provider.value == "tiktok":
        provider_data = await OAuthService.verify_tiktok_token(oauth_login.access_token)
        lookup_value = provider_data["username"] if provider_data else None
    
    elif oauth_login.provider.value == "google":
        provider_data = await OAuthService.verify_google_token(oauth_login.access_token)
        lookup_value = provider_data["email"] if provider_data else None
    
    if not provider_data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Token inválido"
        )
    
    user = await AuthService.get_user_by_oauth(db, oauth_login.provider, lookup_value)
    
    if not user:
        user = await AuthService.create_user_oauth(
            db,
            provider_data,
            oauth_login.provider,
            "creator",
            None
        )
    
    else:
        if not user.auth_providers:
            user.auth_providers = {}
        user.auth_providers[oauth_login.provider.value] = {
            "access_token": oauth_login.access_token,
            "updated_at": datetime.utcnow().isoformat()
        }
        user.last_login = datetime.utcnow()
        await db.commit()
    
    access_token = SecurityService.create_access_token(
        data={"sub": str(user.id), "type": user.user_type.value, "tier": user.profile.tier_level}
    )
    refresh_token = SecurityService.create_refresh_token(
        data={"sub": str(user.id)}
    )
    
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        expires_in=1800,
        user=user
    )


# ============ TOKENS ============

@router.post("/refresh")
async def refresh_access_token(
    refresh_token: str,
    db: AsyncSession = Depends(get_db)
):
    """Renovar access token"""
    payload = SecurityService.decode_token(refresh_token)
    
    if not payload or payload.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token inválido"
        )
    
    user_id = payload.get("sub")
    user = await AuthService.get_user_by_id(db, int(user_id))
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario no encontrado"
        )
    
    access_token = SecurityService.create_access_token(
        data={"sub": str(user.id), "type": user.user_type.value, "tier": user.profile.tier_level}
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "expires_in": 1800
    }


@router.post("/logout")
async def logout(
    current_user: User = Depends(get_current_user),
):
    """Logout"""
    return {"message": "Logout exitoso"}


# ============ EMAIL VERIFICATION ============

@router.post("/verify-email")
async def verify_email(
    request: VerifyEmailRequest,
    db: AsyncSession = Depends(get_db)
):
    """Verificar email"""
    user = await AuthService.verify_email_token(db, request.token)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Token inválido o expirado"
        )
    
    user.is_verified = True
    user.email_verified_at = datetime.utcnow()
    user.is_active = True
    await db.commit()
    
    return {"message": "Email verificado correctamente"}


@router.post("/resend-verification")
async def resend_verification_email(
    request: ResendVerificationEmail,
    db: AsyncSession = Depends(get_db)
):
    """Reenviar email de verificación"""
    user = await AuthService.get_user_by_email(db, request.email)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado"
        )
    
    if user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email ya verificado"
        )
    
    verification_token = secrets.token_urlsafe(32)
    await AuthService.save_verification_token(db, user.id, verification_token)
    
    await EmailService.send_verification_email(user.email, verification_token)
    
    return {"message": "Email de verificación enviado"}


# ============ PASSWORD RESET ============

@router.post("/forgot-password")
async def forgot_password(
    request: ForgotPasswordRequest,
    db: AsyncSession = Depends(get_db)
):
    """Solicitar reset de contraseña"""
    user = await AuthService.get_user_by_email(db, request.email)
    
    if user:
        reset_token = secrets.token_urlsafe(32)
        await AuthService.save_reset_token(db, user.id, reset_token, expires_in=3600)
        await EmailService.send_password_reset_email(user.email, reset_token)
    
    return {"message": "Si el email existe, se enviará instrucciones"}


@router.post("/reset-password")
async def reset_password(
    request: ResetPasswordRequest,
    db: AsyncSession = Depends(get_db)
):
    """Restablecer contraseña"""
    user = await AuthService.verify_reset_token(db, request.token)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Token inválido o expirado"
        )
    
    user.password_hash = SecurityService.hash_password(request.password)
    await db.commit()
    
    return {"message": "Contraseña actualizada correctamente"}


@router.post("/change-password")
async def change_password(
    request: ChangePasswordRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Cambiar contraseña"""
    if not current_user.password_hash:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Usuario no tiene contraseña (usa OAuth)"
        )
    
    if not SecurityService.verify_password(request.current_password, current_user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Contraseña actual incorrecta"
        )
    
    current_user.password_hash = SecurityService.hash_password(request.new_password)
    await db.commit()
    
    return {"message": "Contraseña actualizada"}
