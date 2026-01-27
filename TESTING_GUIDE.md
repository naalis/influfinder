# 🧪 Testing Guide - Influfinder Backend

## Configuración de Testing

### Instalar dependencias de test

```bash
cd backend
pip install pytest pytest-asyncio pytest-cov httpx
```

### Crear archivo pytest.ini

```ini
[pytest]
asyncio_mode = auto
testpaths = tests
python_files = test_*.py
python_classes = Test*
python_functions = test_*
```

---

## Estructura de Tests

```
backend/
├── app/
│   └── ... (código principal)
├── tests/
│   ├── __init__.py
│   ├── conftest.py                 # Fixtures compartidas
│   ├── test_auth.py                # Tests de autenticación
│   ├── test_offers.py              # Tests de ofertas
│   ├── test_collaborations.py      # Tests de colaboraciones
│   ├── test_content.py             # Tests de contenido
│   ├── test_notifications.py       # Tests de notificaciones
│   └── test_messages.py            # Tests de mensajes
└── requirements.txt
```

---

## Archivo conftest.py (Fixtures)

```python
# tests/conftest.py
import pytest
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from httpx import AsyncClient
from app.main import app
from app.database import get_db
from app.security import SecurityService

# Database de test (en memoria o SQLite)
TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"

@pytest.fixture
async def test_db():
    """Crear base de datos de test"""
    engine = create_async_engine(TEST_DATABASE_URL, echo=True)
    
    async with engine.begin() as conn:
        # Crear todas las tablas
        from app.models import Base
        await conn.run_sync(Base.metadata.create_all)
    
    async_session = async_sessionmaker(
        engine, class_=AsyncSession, expire_on_commit=False
    )
    
    async def override_get_db():
        async with async_session() as session:
            yield session
    
    app.dependency_overrides[get_db] = override_get_db
    yield async_session
    
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
    
    await engine.dispose()

@pytest.fixture
async def client(test_db):
    """Cliente HTTP para testing"""
    async with AsyncClient(app=app, base_url="http://test") as ac:
        yield ac

@pytest.fixture
async def test_user(test_db):
    """Crear usuario de test"""
    security = SecurityService()
    
    async with test_db() as session:
        from app.models import User, Profile
        from sqlalchemy import insert
        
        user = User(
            email="test@example.com",
            username="testuser",
            password_hash=security.hash_password("TestPassword123!"),
            user_type="CREATOR",
            is_verified=True
        )
        session.add(user)
        await session.flush()
        
        profile = Profile(user_id=user.id)
        session.add(profile)
        await session.commit()
        
        return user

@pytest.fixture
async def test_business_user(test_db):
    """Crear usuario business de test"""
    security = SecurityService()
    
    async with test_db() as session:
        from app.models import User, Profile
        
        user = User(
            email="business@example.com",
            username="businessuser",
            password_hash=security.hash_password("BizPassword123!"),
            user_type="BUSINESS",
            is_verified=True
        )
        session.add(user)
        await session.flush()
        
        profile = Profile(user_id=user.id)
        session.add(profile)
        await session.commit()
        
        return user

@pytest.fixture
def auth_headers(test_user):
    """Headers con token JWT"""
    security = SecurityService()
    token = security.create_access_token(user_id=str(test_user.id))
    return {"Authorization": f"Bearer {token}"}
```

---

## Test de Autenticación

```python
# tests/test_auth.py
import pytest
from fastapi import status

class TestAuth:
    """Tests para autenticación"""
    
    @pytest.mark.asyncio
    async def test_register_email_success(self, client):
        """Registrar usuario con email exitosamente"""
        response = await client.post(
            "/api/v1/auth/register/email",
            json={
                "email": "newuser@example.com",
                "password": "ValidPass123!",
                "username": "newuser",
                "user_type": "CREATOR",
                "country": "ES"
            }
        )
        
        assert response.status_code == status.HTTP_201_CREATED
        assert response.json()["user"]["email"] == "newuser@example.com"
        assert response.json()["user"]["is_verified"] == False
    
    @pytest.mark.asyncio
    async def test_register_email_duplicate(self, client, test_user):
        """No permitir registrar con email duplicado"""
        response = await client.post(
            "/api/v1/auth/register/email",
            json={
                "email": test_user.email,
                "password": "ValidPass123!",
                "username": "another",
                "user_type": "CREATOR",
                "country": "ES"
            }
        )
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "already registered" in response.json()["detail"]
    
    @pytest.mark.asyncio
    async def test_register_email_weak_password(self, client):
        """No permitir contraseña débil"""
        response = await client.post(
            "/api/v1/auth/register/email",
            json={
                "email": "test@example.com",
                "password": "weak",  # Muy corta
                "username": "testuser",
                "user_type": "CREATOR",
                "country": "ES"
            }
        )
        
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
    
    @pytest.mark.asyncio
    async def test_login_success(self, client, test_user):
        """Login exitoso"""
        response = await client.post(
            "/api/v1/auth/login",
            json={
                "email": test_user.email,
                "password": "TestPassword123!"
            }
        )
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "access_token" in data
        assert "refresh_token" in data
        assert data["user"]["email"] == test_user.email
    
    @pytest.mark.asyncio
    async def test_login_wrong_password(self, client, test_user):
        """Login con contraseña incorrecta"""
        response = await client.post(
            "/api/v1/auth/login",
            json={
                "email": test_user.email,
                "password": "WrongPassword123!"
            }
        )
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
    
    @pytest.mark.asyncio
    async def test_login_user_not_found(self, client):
        """Login con usuario que no existe"""
        response = await client.post(
            "/api/v1/auth/login",
            json={
                "email": "nonexistent@example.com",
                "password": "TestPassword123!"
            }
        )
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
    
    @pytest.mark.asyncio
    async def test_refresh_token_success(self, client, auth_headers):
        """Refrescar token exitosamente"""
        # Primero hacer login para obtener refresh token
        login_response = await client.post(
            "/api/v1/auth/login",
            json={
                "email": "test@example.com",
                "password": "TestPassword123!"
            }
        )
        
        refresh_token = login_response.json()["refresh_token"]
        headers = {"Authorization": f"Bearer {refresh_token}"}
        
        response = await client.post(
            "/api/v1/auth/refresh",
            headers=headers
        )
        
        assert response.status_code == status.HTTP_200_OK
        assert "access_token" in response.json()
    
    @pytest.mark.asyncio
    async def test_protected_endpoint_without_token(self, client):
        """Acceder a endpoint protegido sin token"""
        response = await client.get(
            "/api/v1/users/me"
        )
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
```

---

## Test de Ofertas

```python
# tests/test_offers.py
import pytest
from fastapi import status

class TestOffers:
    """Tests para ofertas"""
    
    @pytest.mark.asyncio
    async def test_create_offer_success(self, client, test_business_user, auth_headers):
        """Crear oferta exitosamente"""
        response = await client.post(
            "/api/v1/offers",
            headers=auth_headers,
            json={
                "title": "Instagram Post",
                "description": "Necesitamos post bonito",
                "category": "FASHION",
                "platforms": ["INSTAGRAM"],
                "budget_min": 500,
                "budget_max": 2000,
                "currency": "EUR",
                "requirements": {
                    "influencer": {
                        "min_followers": 50000,
                        "min_engagement_rate": 5.0,
                        "verified_required": True
                    },
                    "regular": {
                        "min_followers": 1000
                    }
                },
                "content_specs": {
                    "formats": ["POST"],
                    "required_hashtags": ["#summer"],
                    "required_mentions": ["@brand"]
                },
                "application_deadline": "2026-02-01T23:59:59Z",
                "content_deadline": "2026-03-01T23:59:59Z",
                "is_public": True
            }
        )
        
        assert response.status_code == status.HTTP_201_CREATED
        assert response.json()["title"] == "Instagram Post"
        assert response.json()["status"] == "DRAFT"
    
    @pytest.mark.asyncio
    async def test_create_offer_creator_cant(self, client, auth_headers):
        """Creator no puede crear ofertas"""
        # auth_headers es de un CREATOR
        response = await client.post(
            "/api/v1/offers",
            headers=auth_headers,
            json={...}
        )
        
        assert response.status_code == status.HTTP_403_FORBIDDEN
    
    @pytest.mark.asyncio
    async def test_get_offers_list(self, client):
        """Obtener lista de ofertas públicas"""
        response = await client.get(
            "/api/v1/offers?page=1&limit=10"
        )
        
        assert response.status_code == status.HTTP_200_OK
        assert "offers" in response.json()
        assert "total" in response.json()
    
    @pytest.mark.asyncio
    async def test_get_offers_with_filters(self, client):
        """Filtrar ofertas por categoría"""
        response = await client.get(
            "/api/v1/offers?category=FASHION&budget_min=500&budget_max=3000"
        )
        
        assert response.status_code == status.HTTP_200_OK
        offers = response.json()["offers"]
        
        # Verificar que cumplen los filtros
        for offer in offers:
            assert offer["category"] == "FASHION"
            assert offer["budget_min"] >= 500
            assert offer["budget_max"] <= 3000
    
    @pytest.mark.asyncio
    async def test_get_offer_details(self, client, test_offer):
        """Obtener detalles de una oferta"""
        response = await client.get(
            f"/api/v1/offers/{test_offer.id}"
        )
        
        assert response.status_code == status.HTTP_200_OK
        assert response.json()["id"] == str(test_offer.id)
        # views_count debe incrementarse
        assert response.json()["views_count"] > 0
    
    @pytest.mark.asyncio
    async def test_publish_offer(self, client, test_offer, auth_headers):
        """Publicar oferta (DRAFT → ACTIVE)"""
        response = await client.post(
            f"/api/v1/offers/{test_offer.id}/publish",
            headers=auth_headers
        )
        
        assert response.status_code == status.HTTP_200_OK
        assert response.json()["status"] == "ACTIVE"
    
    @pytest.mark.asyncio
    async def test_archive_offer(self, client, test_offer, auth_headers):
        """Archivar oferta"""
        response = await client.post(
            f"/api/v1/offers/{test_offer.id}/archive",
            headers=auth_headers
        )
        
        assert response.status_code == status.HTTP_200_OK
        assert response.json()["status"] == "ARCHIVED"
```

---

## Test de Colaboraciones

```python
# tests/test_collaborations.py
import pytest
from fastapi import status

class TestCollaborations:
    """Tests para colaboraciones"""
    
    @pytest.mark.asyncio
    async def test_create_application_success(
        self, 
        client, 
        test_user, 
        test_offer, 
        auth_headers
    ):
        """Crear aplicación exitosamente"""
        response = await client.post(
            "/api/v1/applications",
            headers=auth_headers,
            json={
                "offer_id": str(test_offer.id),
                "message": "I'm interested!",
                "media_attachments": ["https://instagram.com/post/123"],
                "proposed_fee": 1500
            }
        )
        
        assert response.status_code == status.HTTP_201_CREATED
        assert response.json()["status"] == "APPLIED"
    
    @pytest.mark.asyncio
    async def test_apply_to_own_offer(
        self,
        client,
        test_business_user,
        auth_headers,
        test_offer
    ):
        """Business no puede aplicar a su propia oferta"""
        response = await client.post(
            "/api/v1/applications",
            headers=auth_headers,
            json={
                "offer_id": str(test_offer.id),
                "message": "I want my own offer!",
                "proposed_fee": 1500
            }
        )
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
    
    @pytest.mark.asyncio
    async def test_get_applications(self, client, test_user, auth_headers):
        """Obtener aplicaciones del usuario"""
        response = await client.get(
            "/api/v1/applications",
            headers=auth_headers
        )
        
        assert response.status_code == status.HTTP_200_OK
        assert "applications" in response.json()
    
    @pytest.mark.asyncio
    async def test_review_application_accept(
        self,
        client,
        test_application,
        auth_headers
    ):
        """Business acepta aplicación"""
        response = await client.post(
            f"/api/v1/applications/{test_application.id}/review",
            headers=auth_headers,
            json={
                "action": "accept"
            }
        )
        
        assert response.status_code == status.HTTP_200_OK
        assert response.json()["status"] == "ACCEPTED"
        assert "collaboration_id" in response.json()
    
    @pytest.mark.asyncio
    async def test_review_application_reject(
        self,
        client,
        test_application,
        auth_headers
    ):
        """Business rechaza aplicación"""
        response = await client.post(
            f"/api/v1/applications/{test_application.id}/review",
            headers=auth_headers,
            json={
                "action": "reject",
                "rejection_reason": "Not a good fit"
            }
        )
        
        assert response.status_code == status.HTTP_200_OK
        assert response.json()["status"] == "REJECTED"
    
    @pytest.mark.asyncio
    async def test_schedule_collaboration(
        self,
        client,
        test_collaboration,
        auth_headers
    ):
        """Programar colaboración"""
        response = await client.post(
            f"/api/v1/collaborations/{test_collaboration.id}/schedule",
            headers=auth_headers,
            json={
                "scheduled_date": "2026-03-01T10:00:00Z"
            }
        )
        
        assert response.status_code == status.HTTP_200_OK
        assert response.json()["status"] == "SCHEDULED"
    
    @pytest.mark.asyncio
    async def test_rate_collaboration_both_rate(
        self,
        client,
        test_collaboration,
        auth_headers
    ):
        """Ambos califican la colaboración"""
        # Creator califica
        response = await client.post(
            f"/api/v1/collaborations/{test_collaboration.id}/rate",
            headers=auth_headers,
            json={
                "rating": 5,
                "feedback": "Great work!"
            }
        )
        
        assert response.status_code == status.HTTP_200_OK
        # Status aún es IN_REVIEW (solo 1 ha calificado)
        assert response.json()["status"] == "IN_REVIEW"
```

---

## Test de Contenido

```python
# tests/test_content.py
import pytest
from fastapi import status

class TestContent:
    """Tests para análisis de contenido"""
    
    @pytest.mark.asyncio
    async def test_submit_content_success(
        self,
        client,
        test_collaboration,
        auth_headers
    ):
        """Enviar contenido exitosamente"""
        response = await client.post(
            "/api/v1/submissions",
            headers=auth_headers,
            json={
                "collaboration_id": str(test_collaboration.id),
                "content_urls": [
                    "https://example.s3.amazonaws.com/photo1.jpg"
                ],
                "captions": {
                    "instagram": "Beautiful summer vibes #summer"
                },
                "platform": "INSTAGRAM",
                "platform_post_id": "12345678"
            }
        )
        
        assert response.status_code == status.HTTP_201_CREATED
        assert response.json()["status"] == "SUBMITTED"
    
    @pytest.mark.asyncio
    async def test_analyze_content_ai(
        self,
        client,
        test_submission,
        auth_headers
    ):
        """Analizar contenido con IA"""
        response = await client.post(
            f"/api/v1/submissions/{test_submission.id}/analyze-ai",
            headers=auth_headers
        )
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "ai_score" in data
        assert 0 <= data["ai_score"] <= 100
        assert "ai_analysis" in data
    
    @pytest.mark.asyncio
    async def test_approve_content(
        self,
        client,
        test_submission,
        auth_headers
    ):
        """Aprobar contenido"""
        response = await client.post(
            f"/api/v1/submissions/{test_submission.id}/approve",
            headers=auth_headers
        )
        
        assert response.status_code == status.HTTP_200_OK
        assert response.json()["status"] == "APPROVED"
    
    @pytest.mark.asyncio
    async def test_reject_content(
        self,
        client,
        test_submission,
        auth_headers
    ):
        """Rechazar contenido"""
        response = await client.post(
            f"/api/v1/submissions/{test_submission.id}/reject",
            headers=auth_headers,
            json={
                "reviewer_notes": "Hashtags don't match"
            }
        )
        
        assert response.status_code == status.HTTP_200_OK
        assert response.json()["status"] == "REJECTED"
```

---

## Test de Notificaciones

```python
# tests/test_notifications.py
import pytest
from fastapi import status

class TestNotifications:
    """Tests para notificaciones"""
    
    @pytest.mark.asyncio
    async def test_get_notifications(self, client, auth_headers):
        """Obtener notificaciones del usuario"""
        response = await client.get(
            "/api/v1/notifications",
            headers=auth_headers
        )
        
        assert response.status_code == status.HTTP_200_OK
        assert "notifications" in response.json()
        assert "unread_count" in response.json()
    
    @pytest.mark.asyncio
    async def test_mark_notification_read(
        self,
        client,
        test_notification,
        auth_headers
    ):
        """Marcar notificación como leída"""
        response = await client.patch(
            f"/api/v1/notifications/{test_notification.id}/read",
            headers=auth_headers
        )
        
        assert response.status_code == status.HTTP_200_OK
        assert response.json()["is_read"] == True
    
    @pytest.mark.asyncio
    async def test_delete_notification(
        self,
        client,
        test_notification,
        auth_headers
    ):
        """Eliminar notificación"""
        response = await client.delete(
            f"/api/v1/notifications/{test_notification.id}",
            headers=auth_headers
        )
        
        assert response.status_code == status.HTTP_204_NO_CONTENT
    
    @pytest.mark.asyncio
    async def test_unread_count(self, client, auth_headers):
        """Obtener contador de no leídas"""
        response = await client.get(
            "/api/v1/notifications/unread-count",
            headers=auth_headers
        )
        
        assert response.status_code == status.HTTP_200_OK
        assert "unread_count" in response.json()
```

---

## Ejecutar Tests

### Todos los tests

```bash
pytest
```

### Con cobertura

```bash
pytest --cov=app --cov-report=html
# Abrirá reporte en htmlcov/index.html
```

### Tests específicos

```bash
# Solo tests de auth
pytest tests/test_auth.py

# Solo una función de test
pytest tests/test_auth.py::TestAuth::test_login_success

# Con verbose
pytest -v

# Con salida en tiempo real
pytest -s
```

### Modo watch (rerun tests on save)

```bash
pip install pytest-watch
ptw
```

---

## Cobertura Objetivo

| Módulo | Cobertura | Estado |
|--------|-----------|--------|
| Auth | 90%+ | 🎯 |
| Offers | 85%+ | 🎯 |
| Collaborations | 85%+ | 🎯 |
| Content | 80%+ | 🎯 |
| Notifications | 75%+ | 🎯 |
| Messages | 75%+ | 🎯 |

**Meta total:** 80%+ de cobertura

---

## CI/CD Integration

### GitHub Actions (.github/workflows/tests.yml)

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
      
      redis:
        image: redis:7
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up Python
      uses: actions/setup-python@v4
      with:
        python-version: '3.11'
    
    - name: Install dependencies
      run: |
        pip install -r backend/requirements.txt
        pip install pytest pytest-asyncio pytest-cov
    
    - name: Run tests
      env:
        DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test_db
        REDIS_URL: redis://localhost:6379/0
      run: |
        cd backend
        pytest --cov=app --cov-report=xml
    
    - name: Upload coverage
      uses: codecov/codecov-action@v3
```

---

**¡Testing completo listo!** ✅
