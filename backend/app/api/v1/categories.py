"""Categories endpoints"""
from fastapi import APIRouter
from pydantic import BaseModel
from typing import List

router = APIRouter(prefix="/api/v1/categories", tags=["categories"])


class CategoryOut(BaseModel):
    """Category model"""
    id: int
    name: str
    icon: str
    slug: str
    description: str


# Categorías predefinidas del sistema
CATEGORIES = [
    {
        "id": 1,
        "name": "Fashion",
        "icon": "👗",
        "slug": "fashion",
        "description": "Moda, estilo y tendencias"
    },
    {
        "id": 2,
        "name": "Food",
        "icon": "🍕",
        "slug": "food",
        "description": "Gastronomía, restaurantes y recetas"
    },
    {
        "id": 3,
        "name": "Travel",
        "icon": "✈️",
        "slug": "travel",
        "description": "Viajes, destinos y aventuras"
    },
    {
        "id": 4,
        "name": "Tech",
        "icon": "💻",
        "slug": "tech",
        "description": "Tecnología, gadgets y software"
    },
    {
        "id": 5,
        "name": "Fitness",
        "icon": "💪",
        "slug": "fitness",
        "description": "Deporte, ejercicio y bienestar"
    },
    {
        "id": 6,
        "name": "Beauty",
        "icon": "💄",
        "slug": "beauty",
        "description": "Belleza, maquillaje y cuidado personal"
    },
    {
        "id": 7,
        "name": "Lifestyle",
        "icon": "🌟",
        "slug": "lifestyle",
        "description": "Estilo de vida y día a día"
    },
    {
        "id": 8,
        "name": "Gaming",
        "icon": "🎮",
        "slug": "gaming",
        "description": "Videojuegos y e-sports"
    },
    {
        "id": 9,
        "name": "Music",
        "icon": "🎵",
        "slug": "music",
        "description": "Música, conciertos y artistas"
    },
    {
        "id": 10,
        "name": "Art",
        "icon": "🎨",
        "slug": "art",
        "description": "Arte, diseño y creatividad"
    },
    {
        "id": 11,
        "name": "Photography",
        "icon": "📸",
        "slug": "photography",
        "description": "Fotografía y edición visual"
    },
    {
        "id": 12,
        "name": "Business",
        "icon": "💼",
        "slug": "business",
        "description": "Negocios, emprendimiento y finanzas"
    },
    {
        "id": 13,
        "name": "Education",
        "icon": "📚",
        "slug": "education",
        "description": "Educación, cursos y aprendizaje"
    },
    {
        "id": 14,
        "name": "Entertainment",
        "icon": "🎬",
        "slug": "entertainment",
        "description": "Entretenimiento, cine y series"
    },
    {
        "id": 15,
        "name": "Health",
        "icon": "🏥",
        "slug": "health",
        "description": "Salud, nutrición y medicina"
    },
    {
        "id": 16,
        "name": "Pets",
        "icon": "🐾",
        "slug": "pets",
        "description": "Mascotas y animales"
    },
    {
        "id": 17,
        "name": "Home & Decor",
        "icon": "🏠",
        "slug": "home-decor",
        "description": "Hogar, decoración y DIY"
    },
    {
        "id": 18,
        "name": "Automotive",
        "icon": "🚗",
        "slug": "automotive",
        "description": "Autos, motos y vehículos"
    }
]


@router.get("/", response_model=List[CategoryOut])
async def get_categories():
    """
    Obtener lista de todas las categorías disponibles

    Retorna las categorías predefinidas del sistema para:
    - Selección durante onboarding (categories_screen.dart)
    - Filtros de búsqueda (search_screen.dart)
    - Clasificación de ofertas
    - Clasificación de perfiles de creadores

    No requiere autenticación (endpoint público)
    """
    return CATEGORIES


@router.get("/{category_id}", response_model=CategoryOut)
async def get_category_by_id(category_id: int):
    """
    Obtener una categoría específica por ID

    Args:
        category_id: ID de la categoría (1-18)

    Returns:
        Información detallada de la categoría
    """
    category = next((cat for cat in CATEGORIES if cat["id"] == category_id), None)

    if not category:
        from fastapi import HTTPException, status
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Categoría con ID {category_id} no encontrada"
        )

    return category


@router.get("/slug/{slug}", response_model=CategoryOut)
async def get_category_by_slug(slug: str):
    """
    Obtener una categoría específica por slug

    Args:
        slug: Slug de la categoría (ej: "fashion", "food", "tech")

    Returns:
        Información detallada de la categoría
    """
    category = next((cat for cat in CATEGORIES if cat["slug"] == slug), None)

    if not category:
        from fastapi import HTTPException, status
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Categoría '{slug}' no encontrada"
        )

    return category
