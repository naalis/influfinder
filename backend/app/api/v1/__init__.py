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

# NOTE: All auth-related endpoints are temporarily disabled and moved to auth.py
# for future implementation. See auth.py for endpoint definitions.
