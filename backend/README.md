# Influfinder Backend

Backend API para Influfinder - Plataforma de marketplace de influencers.

## Stack Tecnológico

- **Framework**: FastAPI
- **Base de Datos**: PostgreSQL + SQLAlchemy 2.0
- **Autenticación**: JWT + OAuth2 (Instagram, Facebook, TikTok, Google)
- **Cache**: Redis
- **IA**: OpenAI API (análisis de contenido)
- **Storage**: AWS S3
- **Email**: SMTP (Gmail)

## Instalación

### Requisitos
- Python 3.11+
- Docker & Docker Compose (opcional)
- PostgreSQL 15+
- Redis

### Setup Local

1. **Clonar repositorio**
```bash
git clone https://github.com/naalis/influfinder.git
cd influfinder/backend
```

2. **Crear entorno virtual**
```bash
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
```

3. **Instalar dependencias**
```bash
pip install -r requirements.txt
```

4. **Configurar variables de entorno**
```bash
cp .env.example .env
# Editar .env con tus credenciales
```

5. **Ejecutar servidor**
```bash
uvicorn app.main:app --reload
```

La API estará disponible en `http://localhost:8000`
Documentación: `http://localhost:8000/docs`

### Setup con Docker

```bash
docker-compose up -d
```

## Estructura de Proyectos

```
backend/
├── app/
│   ├── api/v1/              # API endpoints
│   │   ├── auth.py          # Autenticación
│   │   ├── offers.py        # Ofertas
│   │   ├── collaborations.py # Colaboraciones
│   │   ├── submissions.py   # Contenido
│   │   ├── notifications.py # Notificaciones
│   │   ├── messages.py      # Mensajes
│   │   └── health.py        # Health check
│   │
│   ├── models/              # SQLAlchemy models
│   │   ├── __init__.py      # User + Profile
│   │   ├── offer.py
│   │   ├── collaboration.py
│   │   ├── content.py
│   │   └── notification.py
│   │
│   ├── schemas/             # Pydantic schemas
│   │   ├── __init__.py      # User schemas
│   │   ├── offer.py
│   │   ├── collaboration.py
│   │   ├── content.py
│   │   └── notification.py
│   │
│   ├── services/            # Business logic
│   │   ├── auth_service.py
│   │   ├── offer_service.py
│   │   ├── collaboration_service.py
│   │   ├── content_service.py
│   │   ├── notification_service.py
│   │   └── email_service.py
│   │
│   ├── utils/               # Utilities
│   │   └── dependencies.py
│   │
│   ├── config.py            # Settings
│   ├── database.py          # Database setup
│   ├── security.py          # JWT + OAuth
│   └── main.py              # FastAPI app
│
├── migrations/              # Alembic migrations
├── requirements.txt
├── .env.example
├── docker-compose.yml
├── Dockerfile
└── README.md
```

## API Endpoints

### Autenticación
- `POST /api/v1/auth/register/email` - Registro con email
- `POST /api/v1/auth/register/instagram` - Registro con Instagram
- `POST /api/v1/auth/register/facebook` - Registro con Facebook
- `POST /api/v1/auth/register/tiktok` - Registro con TikTok
- `POST /api/v1/auth/register/google` - Registro con Google
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/login/oauth` - Login OAuth
- `POST /api/v1/auth/refresh` - Renovar token
- `POST /api/v1/auth/logout` - Logout

### Ofertas
- `POST /api/v1/offers` - Crear oferta
- `GET /api/v1/offers` - Listar ofertas
- `GET /api/v1/offers/{id}` - Detalles oferta
- `PATCH /api/v1/offers/{id}` - Actualizar
- `POST /api/v1/offers/{id}/publish` - Publicar
- `GET /api/v1/offers/me/created` - Mis ofertas

### Aplicaciones & Colaboraciones
- `POST /api/v1/applications` - Aplicar
- `GET /api/v1/applications` - Mis aplicaciones
- `POST /api/v1/applications/{id}/review` - Revisar
- `GET /api/v1/collaborations` - Mis colaboraciones
- `POST /api/v1/collaborations/{id}/schedule` - Agendar
- `POST /api/v1/collaborations/{id}/rate` - Calificar

### Contenido
- `POST /api/v1/submissions` - Subir contenido
- `POST /api/v1/submissions/{id}/analyze-ai` - Analizar IA
- `POST /api/v1/submissions/{id}/approve` - Aprobar

### Notificaciones & Mensajes
- `GET /api/v1/notifications` - Mis notificaciones
- `POST /api/v1/messages` - Enviar mensaje
- `GET /api/v1/messages` - Conversaciones
- `GET /api/v1/messages/{user_id}` - Chat con usuario

## Variables de Entorno Requeridas

Ver `.env.example` para la lista completa.

## Flujos Principales

### 1. Registro & Autenticación
1. Usuario elige proveedor (email/Instagram/Facebook/TikTok/Google)
2. Si email: valida contraseña fuerte y verifica email
3. Si OAuth: valida token con proveedor
4. Backend retorna JWT access + refresh token
5. Crear perfil del usuario automáticamente

### 2. Publicar Oferta (Business)
1. Business crea oferta en estado DRAFT
2. Define requisitos duales (influencer vs regular)
3. Especifica contenido requerido
4. Publica (estado ACTIVE)
5. Aparece en listado de creadores

### 3. Aplicar a Oferta (Creator)
1. Creator descubre oferta
2. Revisa requisitos (tiene seguidores suficientes?)
3. Aplica con mensaje + portfolio
4. Business recibe notificación
5. Business acepta o rechaza

### 4. Colaboración (Creator + Business)
1. Tras aceptación, se crea Collaboration
2. Acuerdan fecha de ejecución
3. Creator ejecuta/visita
4. Creator sube contenido
5. Business aprueba con IA
6. Ambos califican 1-5 estrellas
7. Creator gana karma y sube tier

### 5. Sistema de Gamificación
- Tier 0: Newbie (0 completadas)
- Tier 1: Explorer (1-3 completadas)
- Tier 2: Pro (4-10 completadas)
- Tier 3: Elite (11-25 completadas)
- Tier 4: Master (26-50 completadas)
- Tier 5: Legend (50+ completadas)

## Testing

```bash
pytest
pytest -v  # Verbose
pytest --cov=app  # Coverage
```

## Deployment

### Railway / Vercel
```bash
# Configurar DATABASE_URL y secretos en la plataforma
git push  # Deploy automático
```

### AWS / DigitalOcean
```bash
# Usar Docker Compose
docker-compose -f docker-compose.prod.yml up
```

## Troubleshooting

**Error de conexión a PostgreSQL**
- Verificar DATABASE_URL
- Asegurar que PostgreSQL está corriendo

**Error de OAuth**
- Verificar credenciales en .env
- Confirmar redirect URIs en plataformas

**Error de Email**
- Usar contraseña de aplicación (no contraseña de Gmail)
- Habilitar acceso a aplicaciones menos seguras

## Licencia

Propiedad de Naalis / Influfinder 2024-2025
