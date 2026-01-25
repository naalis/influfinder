"""Offer schemas"""
from pydantic import BaseModel, Field, validator
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum

class OfferCategory(str, Enum):
    TRAVEL = "travel"
    FASHION = "fashion"
    BEAUTY = "beauty"
    FITNESS = "fitness"
    FOOD = "food"
    TECH = "tech"
    LIFESTYLE = "lifestyle"
    GAMING = "gaming"
    MUSIC = "music"
    EDUCATION = "education"

class OfferStatus(str, Enum):
    DRAFT = "draft"
    ACTIVE = "active"
    PAUSED = "paused"
    CLOSED = "closed"
    ARCHIVED = "archived"

# ============ REQUEST ============

class InfluencerRequirements(BaseModel):
    """Requisitos para influencers"""
    min_followers: int = Field(..., ge=10000, description="Mínimo 10k seguidores")
    max_followers: Optional[int] = None
    min_engagement_rate: Optional[float] = Field(None, ge=0, le=100)
    verified_required: bool = False
    categories: Optional[List[str]] = None
    excluded_categories: Optional[List[str]] = None
    country_required: Optional[str] = None


class RegularCreatorRequirements(BaseModel):
    """Requisitos para creadores normales"""
    min_followers: int = Field(..., ge=100, le=10000)
    engagement_rate: Optional[float] = None
    must_have_account: bool = True


class ContentSpecification(BaseModel):
    """Especificaciones de contenido"""
    formats: List[str] = Field(..., description="reel, post, story, video, etc")
    min_duration: Optional[int] = Field(None, description="segundos")
    max_duration: Optional[int] = None
    min_resolution: Optional[str] = None
    
    hashtags: Optional[List[str]] = None
    must_include_hashtags: bool = False
    mentions_required: bool = False
    link_required: bool = False
    caption_required: bool = False
    caption_text: Optional[str] = None
    
    product_placement: Optional[Dict[str, Any]] = None
    restricted_content: Optional[List[str]] = None


class OfferCreate(BaseModel):
    """Crear oferta"""
    title: str = Field(..., min_length=10, max_length=200)
    description: str = Field(..., min_length=50, max_length=5000)
    category: OfferCategory
    
    budget_min: float = Field(..., gt=0)
    budget_max: Optional[float] = None
    currency: str = "USD"
    payment_terms: str
    
    influencer_requirements: InfluencerRequirements
    regular_creator_requirements: RegularCreatorRequirements
    
    content_specs: ContentSpecification
    deliverables: Optional[Dict] = None
    
    application_deadline: datetime = Field(..., description="Fecha límite para aplicar")
    content_deadline: datetime = Field(..., description="Fecha límite para entregar contenido")
    
    platforms: List[str] = Field(..., min_items=1, description="instagram, tiktok, youtube, facebook")
    
    @validator('budget_max')
    def budget_max_validation(cls, v, values):
        if v and 'budget_min' in values and v < values['budget_min']:
            raise ValueError('budget_max debe ser >= budget_min')
        return v
    
    @validator('content_deadline')
    def deadline_validation(cls, v, values):
        if 'application_deadline' in values and v <= values['application_deadline']:
            raise ValueError('content_deadline debe ser después de application_deadline')
        return v


class OfferUpdate(BaseModel):
    """Actualizar oferta"""
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[OfferStatus] = None
    budget_min: Optional[float] = None
    budget_max: Optional[float] = None
    payment_terms: Optional[str] = None
    content_deadline: Optional[datetime] = None


class OfferOut(BaseModel):
    """Oferta pública"""
    id: int
    title: str
    description: str
    category: OfferCategory
    budget_min: float
    budget_max: Optional[float] = None
    currency: str
    platforms: List[str]
    content_specs: Dict
    application_deadline: datetime
    content_deadline: datetime
    deliverables: Optional[Dict] = None
    status: OfferStatus
    views_count: int
    applications_count: int
    accepted_count: int
    created_at: datetime
    published_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class OfferDetailOut(OfferOut):
    """Oferta con detalles completos"""
    requirements: Dict
    payment_terms: str
    
    class Config:
        from_attributes = True
