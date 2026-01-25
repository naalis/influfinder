"""FastAPI Application Entry Point"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.config import settings
from app.database import init_db, close_db
from app.api.v1 import auth
from app.api.v1.offers import router as offers_router
from app.api.v1.collaborations import router as collaborations_router
from app.api.v1.submissions import router as submissions_router
from app.api.v1.notifications import router as notifications_router
from app.api.v1.messages import router as messages_router
from app.api.v1.health import router as health_router

# Lifecycle events
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await init_db()
    yield
    # Shutdown
    await close_db()

# Create FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    description="API Backend para Influfinder - Plataforma de Colaboraciones entre Influencers y Marcas",
    version=settings.VERSION,
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(offers_router)
app.include_router(collaborations_router)
app.include_router(submissions_router)
app.include_router(notifications_router)
app.include_router(messages_router)
app.include_router(health_router)

# Root endpoint
@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Welcome to Influfinder API",
        "version": settings.VERSION,
        "docs": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG
    )
