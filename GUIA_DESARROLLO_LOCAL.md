# 🚀 Guía de Desarrollo Local - Influfinder

## Requisitos Previos

- **Git** instalado
- **Docker Desktop** instalado (incluye Docker + Docker Compose)
- **Python 3.11+** (opcional si usas Docker)
- **Node.js 18+** (para frontend)

---

## Opción 1: Ejecutar con Docker Compose (Recomendado)

### Paso 1: Clonar el repositorio

```bash
cd /Users/jesusacostazamora/inlfufinder
```

### Paso 2: Crear archivo .env

Copiar `.env.example` a `.env` en la carpeta `backend`:

```bash
cp backend/.env.example backend/.env
```

Editar `backend/.env` y configurar:

```env
# Database
DATABASE_URL=postgresql+asyncpg://influfinder:influfinder123@localhost:5432/influfinder_db

# Redis
REDIS_URL=redis://localhost:6379/0

# Email (Gmail)
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
SMTP_FROM=your_email@gmail.com

# OAuth (obtener credentials)
INSTAGRAM_CLIENT_ID=your_instagram_app_id
INSTAGRAM_CLIENT_SECRET=your_instagram_secret
INSTAGRAM_REDIRECT_URI=http://localhost:3000/auth/callback/instagram

FACEBOOK_CLIENT_ID=your_facebook_app_id
FACEBOOK_CLIENT_SECRET=your_facebook_secret
FACEBOOK_REDIRECT_URI=http://localhost:3000/auth/callback/facebook

TIKTOK_CLIENT_ID=your_tiktok_client_id
TIKTOK_CLIENT_SECRET=your_tiktok_secret
TIKTOK_REDIRECT_URI=http://localhost:3000/auth/callback/tiktok

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_secret
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/callback/google

# OpenAI (para análisis de contenido)
OPENAI_API_KEY=sk-your_openai_key

# JWT
JWT_SECRET_KEY=your_super_secret_jwt_key_here_123456789
JWT_ALGORITHM=HS256

# Other
DEBUG=True
CORS_ORIGINS=http://localhost:3000,http://localhost:8000
```

### Paso 3: Iniciar contenedores

```bash
cd backend
docker-compose up -d
```

Esto levanta:
- **PostgreSQL** en puerto 5432
- **Redis** en puerto 6379
- **Backend FastAPI** en puerto 8000

### Paso 4: Verificar estado

```bash
# Ver logs del backend
docker-compose logs -f backend

# Ver logs de la base de datos
docker-compose logs -f postgres

# Verificar que todo está up
docker-compose ps
```

### Paso 5: Acceder a la API

```bash
# API principal
http://localhost:8000

# Documentación interactiva (Swagger UI)
http://localhost:8000/docs

# Documentación alternativa (ReDoc)
http://localhost:8000/redoc

# Health check
curl http://localhost:8000/api/v1/health
```

---

## Opción 2: Ejecutar Localmente (Sin Docker)

### Paso 1: Instalar PostgreSQL

**macOS:**
```bash
brew install postgresql@15
brew services start postgresql@15

# Crear base de datos
createdb influfinder_db
psql influfinder_db -c "CREATE USER influfinder WITH PASSWORD 'influfinder123';"
psql influfinder_db -c "ALTER USER influfinder CREATEDB;"
```

### Paso 2: Instalar Redis

**macOS:**
```bash
brew install redis
brew services start redis
```

### Paso 3: Crear entorno virtual Python

```bash
cd backend
python3.11 -m venv venv
source venv/bin/activate

# En Windows:
# venv\Scripts\activate
```

### Paso 4: Instalar dependencias

```bash
pip install -r requirements.txt
```

### Paso 5: Crear archivo .env

```bash
cp .env.example .env
# Editar .env con valores
```

### Paso 6: Ejecutar migraciones (si aplica)

```bash
# Las migraciones automáticas se hacen en startup
# pero si necesitas limpiar la DB:
# psql influfinder_db -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
```

### Paso 7: Iniciar servidor

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Verás:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete
```

---

## Frontend Setup

### Paso 1: Instalar dependencias

```bash
cd frontend
npm install
```

### Paso 2: Crear .env.local

```bash
# frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_WS_URL=ws://localhost:8000/ws
```

### Paso 3: Ejecutar frontend

```bash
npm run dev
```

Acceder a:
```
http://localhost:3000
```

---

## Testing Rápido

### Crear usuario test

```bash
curl -X POST http://localhost:8000/api/v1/auth/register/email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123!",
    "username": "testuser",
    "user_type": "CREATOR",
    "country": "ES"
  }'
```

**Respuesta esperada:**
```json
{
  "user": {
    "id": "uuid-123",
    "email": "test@example.com",
    "username": "testuser",
    "user_type": "CREATOR",
    "is_verified": false
  },
  "message": "Verification email sent"
}
```

### Login

```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123!"
  }'
```

**Respuesta esperada:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer",
  "expires_in": 1800,
  "user": {
    "id": "uuid-123",
    "email": "test@example.com",
    "is_verified": false,
    "profile": {
      "tier_level": 0,
      "karma_score": 0
    }
  }
}
```

### Obtener datos del usuario

```bash
curl -H "Authorization: Bearer {access_token}" \
  http://localhost:8000/api/v1/users/me
```

---

## Estructura de Carpetas

```
inlfufinder/
├── backend/                    # FastAPI backend
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py             # Entrada de FastAPI
│   │   ├── config.py           # Configuración
│   │   ├── database.py         # SQLAlchemy setup
│   │   ├── security.py         # JWT + OAuth
│   │   ├── api/v1/             # Endpoints
│   │   │   ├── __init__.py     # Auth (15 endpoints)
│   │   │   ├── offers.py       # Offers (7 endpoints)
│   │   │   ├── collaborations.py
│   │   │   ├── submissions.py
│   │   │   ├── notifications.py
│   │   │   ├── messages.py
│   │   │   └── health.py
│   │   ├── models/             # SQLAlchemy models
│   │   │   ├── __init__.py
│   │   │   ├── offer.py
│   │   │   ├── collaboration.py
│   │   │   ├── content.py
│   │   │   └── notification.py
│   │   ├── schemas/            # Pydantic validation
│   │   │   ├── __init__.py
│   │   │   ├── offer.py
│   │   │   ├── collaboration.py
│   │   │   ├── content.py
│   │   │   └── notification.py
│   │   ├── services/           # Business logic
│   │   │   ├── auth_service.py
│   │   │   ├── offer_service.py
│   │   │   ├── collaboration_service.py
│   │   │   ├── content_service.py
│   │   │   ├── notification_service.py
│   │   │   └── email_service.py
│   │   └── utils/
│   │       └── dependencies.py
│   ├── requirements.txt
│   ├── .env.example
│   ├── docker-compose.yml
│   ├── Dockerfile
│   └── setup.sh
├── frontend/                   # Next.js frontend
│   ├── src/
│   │   ├── app/                # Pages
│   │   ├── components/         # React components
│   │   └── lib/                # Utils
│   ├── package.json
│   ├── next.config.ts
│   └── tsconfig.json
└── README.md
```

---

## Troubleshooting

### Error: "connection refused" en PostgreSQL

```bash
# Verificar si PostgreSQL está corriendo
docker-compose ps

# Si no está:
docker-compose up postgres -d
```

### Error: "port 5432 already in use"

```bash
# Encontrar proceso en puerto 5432
lsof -i :5432

# Matar el proceso
kill -9 <PID>

# O cambiar puerto en docker-compose.yml
```

### Error: "Redis connection refused"

```bash
# Verificar Redis
docker-compose ps redis

# Reiniciar
docker-compose restart redis
```

### Error: "Module not found"

```bash
# Reinstalar dependencias
pip install -r requirements.txt --force-reinstall

# O dentro del Docker
docker-compose exec backend pip install -r requirements.txt
```

### Error: "database does not exist"

```bash
# Dentro del Docker
docker-compose exec postgres createdb -U influfinder influfinder_db

# O localmente
createdb influfinder_db
```

### Frontend no conecta con backend

Verificar:
1. Backend corriendo en `http://localhost:8000`
2. CORS configurado en `backend/.env`: `CORS_ORIGINS=http://localhost:3000,...`
3. `NEXT_PUBLIC_API_URL` correcta en `frontend/.env.local`

---

## Limpieza Total

### Borrar todo (Docker)

```bash
cd backend

# Detener contenedores
docker-compose down

# Eliminar volúmenes (datos)
docker-compose down -v

# Eliminar imágenes
docker image rm inlfufinder-backend
docker image rm postgres:15
docker image rm redis:7
```

### Borrar todo (Local)

```bash
# Detener PostgreSQL
brew services stop postgresql@15

# Detener Redis
brew services stop redis

# Borrar base de datos
dropdb influfinder_db

# Eliminar virtual env
rm -rf backend/venv
```

---

## Comandos Útiles

### Ver logs en tiempo real

```bash
# Backend
docker-compose logs -f backend

# Database
docker-compose logs -f postgres

# Todo
docker-compose logs -f
```

### Conectarse a la base de datos

```bash
# Con Docker
docker-compose exec postgres psql -U influfinder -d influfinder_db

# Localmente
psql influfinder_db

# Comandos útiles en psql:
# \dt                    - Ver todas las tablas
# \d users               - Ver estructura de tabla
# SELECT * FROM users;   - Ver usuarios
# \q                     - Salir
```

### Conectarse a Redis

```bash
# Con Docker
docker-compose exec redis redis-cli

# Localmente
redis-cli

# Comandos:
# KEYS *                 - Ver todas las claves
# GET key_name           - Obtener valor
# FLUSHDB                - Limpiar todo
# QUIT                   - Salir
```

### Reconstruir sin caché

```bash
docker-compose build --no-cache
docker-compose up -d
```

---

## Guía de Variaciones de Entornos

### Desarrollo

```env
DEBUG=True
JWT_EXPIRATION_MINUTES=10080  # 7 días
CORS_ORIGINS=http://localhost:3000,http://localhost:8000
```

### Staging

```env
DEBUG=False
DATABASE_URL=postgresql+asyncpg://user:pass@staging-db:5432/influfinder
REDIS_URL=redis://staging-redis:6379/0
CORS_ORIGINS=https://staging.influfinder.com
```

### Producción

```env
DEBUG=False
DATABASE_URL=postgresql+asyncpg://user:pass@prod-db:5432/influfinder
REDIS_URL=redis://prod-redis:6379/0
CORS_ORIGINS=https://influfinder.com,https://www.influfinder.com
JWT_EXPIRATION_MINUTES=30
```

---

## Próximos Pasos

1. ✅ Backend corriendo localmente
2. ✅ Frontend conectando con backend
3. ⬜ Configurar OAuth providers (Instagram, Facebook, TikTok, Google)
4. ⬜ Obtener OpenAI API key
5. ⬜ Implementar WebSockets para notificaciones en tiempo real
6. ⬜ Escribir tests
7. ⬜ Desplegar a producción (AWS, Heroku, DigitalOcean, etc.)

---

**¡Sistema listo para desarrollar!** 🎉
