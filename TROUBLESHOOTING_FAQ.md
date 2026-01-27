# 🔧 Troubleshooting & FAQ - Influfinder

## 🚨 Common Issues

### Backend Issues

#### ❌ "ModuleNotFoundError: No module named 'app'"

**Causa:** Estás en la carpeta equivocada o PYTHONPATH no está configurado.

**Soluciones:**

```bash
# ✅ Solución 1: Estar en carpeta backend
cd /Users/jesusacostazamora/inlfufinder/backend

# Verificar estructura
ls -la
# Debe mostrar: app/, requirements.txt, Dockerfile, etc.

# ✅ Solución 2: Ejecutar desde carpeta backend
uvicorn app.main:app --reload

# ✅ Solución 3: Configurar PYTHONPATH
export PYTHONPATH="${PYTHONPATH}:/Users/jesusacostazamora/inlfufinder/backend"
```

---

#### ❌ "ConnectionRefusedError: Cannot connect to PostgreSQL"

**Causa:** PostgreSQL no está corriendo o puerto incorrectos.

**Soluciones:**

```bash
# ✅ Verificar si PostgreSQL está corriendo
docker-compose ps

# Ver: postgres RUNNING

# Si no está running:
docker-compose up postgres -d

# ✅ Verificar puerto
docker-compose logs postgres | grep "port"

# Por defecto: 5432

# ✅ Verificar DATABASE_URL en .env
echo $DATABASE_URL
# Debe ser: postgresql+asyncpg://user:pass@localhost:5432/db

# ✅ Test conexión directa
psql postgresql://influfinder:influfinder123@localhost:5432/influfinder_db

# Si error "psql: error: could not translate host name"
# → PostgreSQL no está en localhost, probablemente en Docker

# Test con Docker:
docker-compose exec postgres psql -U influfinder -d influfinder_db
```

---

#### ❌ "Redis connection error: Cannot connect to Redis"

**Causa:** Redis no está corriendo.

**Soluciones:**

```bash
# ✅ Verificar Redis
docker-compose ps redis

# ✅ Ver logs de Redis
docker-compose logs redis

# ✅ Reiniciar Redis
docker-compose restart redis

# ✅ Test conexión
redis-cli ping
# Debe responder: PONG

# Si error "Could not connect to Redis at 127.0.0.1:6379"
# Estás en Docker, usa:
docker-compose exec redis redis-cli ping
```

---

#### ❌ "Address already in use" (puerto 8000)

**Causa:** Otro proceso está usando el puerto 8000.

**Soluciones:**

```bash
# ✅ Ver qué está usando puerto 8000
lsof -i :8000

# ✅ Matar el proceso
kill -9 <PID>

# ✅ O usar otro puerto
uvicorn app.main:app --port 8001

# ✅ En Docker, cambiar puerto en docker-compose.yml
# backend:
#   ports:
#     - "8001:8000"  # Host:Container

docker-compose restart backend
```

---

#### ❌ "pydantic_core._pydantic_core.ValidationError"

**Causa:** Datos inválidos en request JSON.

**Soluciones:**

```bash
# ✅ Verificar JSON es válido
# Usar https://jsonlint.com/

# ✅ Ejemplo correcto:
curl -X POST http://localhost:8000/api/v1/auth/register/email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123!",
    "username": "testuser",
    "user_type": "CREATOR",
    "country": "ES"
  }'

# ✅ Verificar tipos de datos
# - email: string
# - password: string
# - username: string
# - user_type: "CREATOR" o "BUSINESS"
# - country: "ES", "MX", etc.

# ✅ Ver error detallado en respuesta
# Respuesta incluye: "detail" con campos específicos
```

---

#### ❌ "JWT token validation failed"

**Causa:** Token expirado o inválido.

**Soluciones:**

```bash
# ✅ Token expirado (30 minutos)
# Usar endpoint refresh:
curl -X POST http://localhost:8000/api/v1/auth/refresh \
  -H "Authorization: Bearer {refresh_token}"

# ✅ Token inválido
# Hacer login nuevamente

# ✅ Formato de header incorrecto
# Correcto: Authorization: Bearer eyJhbGc...
# Incorrecto: Authorization: eyJhbGc... (sin "Bearer")

# ✅ Token en Redis expiró
# Redis guarda tokens durante 30 min
# Si Redis se reinicia, los tokens se pierden
# → Usuario debe hacer login nuevamente
```

---

#### ❌ "Email verification failed"

**Causa:** Email no configurado correctamente en .env.

**Soluciones:**

```bash
# ✅ Verificar SMTP_* variables en .env
cat backend/.env | grep SMTP

# Debe mostrar:
# SMTP_SERVER=smtp.gmail.com
# SMTP_PORT=587
# SMTP_USER=your_email@gmail.com
# SMTP_PASSWORD=your_app_password
# SMTP_FROM=your_email@gmail.com

# ✅ Para Gmail:
# 1. Habilitar 2FA en Google Account
# 2. Crear App Password (no contraseña normal)
# 3. Usar App Password en SMTP_PASSWORD

# ✅ Test SMTP
python3 << 'EOF'
import smtplib
smtp = smtplib.SMTP("smtp.gmail.com", 587)
smtp.starttls()
smtp.login("your_email@gmail.com", "your_app_password")
print("✅ SMTP funciona")
smtp.quit()
EOF
```

---

### Frontend Issues

#### ❌ "CORS error: Access-Control-Allow-Origin"

**Causa:** Backend no tiene configurado CORS para el frontend.

**Soluciones:**

```bash
# ✅ Verificar CORS_ORIGINS en backend/.env
cat backend/.env | grep CORS_ORIGINS

# Debe incluir: http://localhost:3000

# ✅ Actualizar si es necesario
# CORS_ORIGINS=http://localhost:3000,http://localhost:8000,https://influfinder.com

# ✅ Reiniciar backend
docker-compose restart backend

# ✅ Verificar headers en respuesta
curl -i http://localhost:8000/api/v1/health
# Debe mostrar: Access-Control-Allow-Origin: *
```

---

#### ❌ "Cannot POST /api/v1/auth/login"

**Causa:** Frontend está llamando al endpoint equivocado.

**Soluciones:**

```bash
# ✅ Verificar NEXT_PUBLIC_API_URL en frontend/.env.local
cat frontend/.env.local

# Debe ser: NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1

# ✅ Backend debe tener ruta /api/v1/auth/login
# Verificar en app/api/v1/__init__.py

# ✅ Verificar que backend está corriendo
curl http://localhost:8000/api/v1/health

# ✅ Hacer request manual
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"TestPass123!"}'
```

---

#### ❌ "Cannot find module '@/lib'"

**Causa:** Alias de TypeScript no configurado.

**Soluciones:**

```bash
# ✅ Verificar tsconfig.json
cat frontend/tsconfig.json | grep -A5 "paths"

# Debe mostrar:
# "paths": {
#   "@/*": ["./src/*"]
# }

# ✅ Reiniciar Next.js
npm run dev

# ✅ Limpiar cache
rm -rf frontend/.next
npm run dev
```

---

### Docker Issues

#### ❌ "Docker daemon is not running"

**Solución:**

```bash
# ✅ En Mac: Abrir Docker Desktop app
open /Applications/Docker.app

# ✅ En Linux: Iniciar docker daemon
sudo systemctl start docker

# ✅ Verificar que está corriendo
docker ps
```

---

#### ❌ "docker-compose: command not found"

**Solución:**

```bash
# ✅ Docker Desktop en Mac incluye docker-compose
# Si no funciona:

docker compose up -d  # Con espacio en lugar de guion

# ✅ O instalar docker-compose standalone
brew install docker-compose
```

---

#### ❌ "Cannot bind to port 5432" (PostgreSQL)

**Solución:**

```bash
# ✅ Postgres local está corriendo, matarlo
brew services stop postgresql@15

# ✅ O cambiar puerto en docker-compose.yml
# ports:
#   - "5433:5432"  # Cambiar 5432 a 5433

# ✅ Actualizar DATABASE_URL
# DATABASE_URL=postgresql+asyncpg://...@localhost:5433/...
```

---

## ❓ FAQ

### 1. ¿Cómo cambio la contraseña de un usuario?

**Opción 1: Frontend**
```
Perfil → Cambiar Contraseña → Ingresar antigua y nueva
```

**Opción 2: Endpoint**
```bash
curl -X POST http://localhost:8000/api/v1/auth/change-password \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "current_password": "OldPass123!",
    "new_password": "NewPass456!"
  }'
```

**Opción 3: Base de datos (emergencia)
```bash
docker-compose exec postgres psql -U influfinder -d influfinder_db

# Generar nuevo hash
python3 << 'EOF'
from passlib.context import CryptContext
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
print(pwd_context.hash("NewPassword123!"))
EOF

# Copiar el hash

# En psql:
UPDATE users SET password_hash='$2b$12...' WHERE email='user@example.com';
```

---

### 2. ¿Cómo borro todos los datos y empiezo de nuevo?

**Opción 1: Con Docker**
```bash
docker-compose down -v  # -v elimina volúmenes (datos)
docker-compose up -d
```

**Opción 2: Localmente**
```bash
# Eliminar base de datos
dropdb influfinder_db

# Crear nuevamente
createdb influfinder_db

# Reiniciar servidor
uvicorn app.main:app --reload
```

---

### 3. ¿Cómo veo los logs en tiempo real?

```bash
# Backend
docker-compose logs -f backend

# Database
docker-compose logs -f postgres

# Redis
docker-compose logs -f redis

# Todo
docker-compose logs -f

# Específicas líneas
docker-compose logs --tail=50 backend
```

---

### 4. ¿Cómo conecto directamente a PostgreSQL?

```bash
# Con Docker
docker-compose exec postgres psql -U influfinder -d influfinder_db

# Localmente
psql influfinder_db

# Comandos útiles:
# \dt                       - Ver todas las tablas
# \d users                  - Ver estructura de tabla
# SELECT * FROM users;      - Ver todos los usuarios
# UPDATE users SET ...;     - Actualizar datos
# DELETE FROM users WHERE id='...'; - Eliminar usuario
# \q                        - Salir
```

---

### 5. ¿Cómo conecto directamente a Redis?

```bash
# Con Docker
docker-compose exec redis redis-cli

# Localmente
redis-cli

# Comandos:
# KEYS *                    - Ver todas las claves
# GET key_name              - Obtener valor
# DEL key_name              - Eliminar clave
# FLUSHDB                   - Limpiar todo
# QUIT o exit               - Salir

# Ver tokens guardados
redis-cli KEYS "*token*"
```

---

### 6. ¿Cómo agrego un nuevo usuario para testing?

```bash
# Opción 1: Endpoint (recomendado)
curl -X POST http://localhost:8000/api/v1/auth/register/email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "TestPass123!",
    "username": "newuser",
    "user_type": "CREATOR",
    "country": "ES"
  }'

# Opción 2: Database (emergencia)
docker-compose exec postgres psql -U influfinder -d influfinder_db

-- Primero generar hash de password
-- python3: from passlib.context import CryptContext; hash = CryptContext(schemes=["bcrypt"]).hash("pass")

INSERT INTO users (id, email, username, password_hash, user_type, is_verified, created_at, updated_at)
VALUES ('uuid-here', 'user@example.com', 'username', '$2b$12...hash', 'CREATOR', true, NOW(), NOW());

INSERT INTO profiles (id, user_id, tier_level, karma_score, created_at, updated_at)
VALUES ('uuid-here', 'user-uuid', 0, 0, NOW(), NOW());
```

---

### 7. ¿Cómo veo si una oferta está siendo listada?

```bash
# GET offers
curl "http://localhost:8000/api/v1/offers?category=FASHION&page=1"

# Debe mostrar la oferta si:
# - status = "ACTIVE"
# - is_public = true

# Si no aparece, verificar:
docker-compose exec postgres psql -U influfinder -d influfinder_db

SELECT id, title, status, is_public FROM offers;
```

---

### 8. ¿Cómo hago testing de OAuth?

```bash
# OAuth require credenciales reales de las plataformas
# Para testing local, puedes mockear:

# En tests/conftest.py:
@pytest.fixture
def mock_instagram_token(monkeypatch):
    async def mock_verify(token):
        return {
            "id": "123456789",
            "username": "test_user",
            "followers": 50000
        }
    
    monkeypatch.setattr(
        "app.security.OAuthService.verify_instagram_token",
        mock_verify
    )
```

---

### 9. ¿Cómo veo el estado de una colaboración?

```bash
curl -H "Authorization: Bearer {token}" \
  "http://localhost:8000/api/v1/collaborations"

# Respuesta muestra:
# - id
# - status (ACCEPTED, SCHEDULED, VISITED, CONTENT_SUBMITTED, etc.)
# - agreed_fee
# - scheduled_date
# - created_at

# Ver detalles de una:
curl -H "Authorization: Bearer {token}" \
  "http://localhost:8000/api/v1/collaborations/{id}"
```

---

### 10. ¿Cuál es el flujo completo de una oferta?

```
1. Business crea oferta
   POST /offers
   Status: DRAFT

2. Business publica oferta
   POST /offers/{id}/publish
   Status: ACTIVE

3. Creators ven la oferta
   GET /offers
   Views count incrementa

4. Creator aplica
   POST /applications
   Application status: APPLIED

5. Business revisa aplicación
   POST /applications/{id}/review?action=accept
   Application status: ACCEPTED
   → Crea Collaboration (status: ACCEPTED)

6. Creator propone fecha
   POST /collaborations/{id}/schedule
   Status: SCHEDULED

7. Creator ejecuta trabajo
   Collaboration status: VISITED (manual o automático)

8. Creator sube contenido
   POST /submissions
   Collaboration status: CONTENT_SUBMITTED

9. Backend analiza con IA (opcional)
   POST /submissions/{id}/analyze-ai
   Scores: ai_score, quality, relevance, compliance

10. Business revisa y aprueba
    POST /submissions/{id}/approve
    Collaboration status: IN_REVIEW

11. Ambos califican
    POST /collaborations/{id}/rate (creator)
    POST /collaborations/{id}/rate (business)
    Status: COMPLETED (cuando ambos calificaron)

12. Creator tier se actualiza
    tier_level y karma_score se recalculan
    Si subió de tier: TIER_UPGRADED notification
```

---

### 11. ¿Cómo reinstalo todo desde cero?

```bash
# Opción 1: Total reset con Docker
docker-compose down -v
rm -rf backend/.env backend/venv
cp backend/.env.example backend/.env

# Editar .env con valores nuevos

docker-compose up -d
docker-compose logs -f backend

# Esperar a que inicie, luego test:
curl http://localhost:8000/health

# Opción 2: Reset parcial (solo BD)
docker-compose exec postgres psql -U influfinder -d influfinder_db

DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
```

---

### 12. ¿Dónde están los logs del backend?

```bash
# En Docker
docker-compose logs backend

# Ver últimas 100 líneas
docker-compose logs --tail=100 backend

# En tiempo real
docker-compose logs -f backend

# Filtrar por palabra
docker-compose logs backend | grep "ERROR"

# Localmente (si no usas Docker)
# Los logs se muestran en terminal donde ejecutaste:
# uvicorn app.main:app --reload

# Para guardar logs a archivo:
uvicorn app.main:app --reload >> backend.log 2>&1
```

---

### 13. ¿Por qué dice "invalid grant" en OAuth?

**Causas comunes:**

```
1. Access token expirado
   → Hacer login nuevamente

2. Access token inválido
   → Verificar que estás pasando el token correcto

3. Credentials equivocados
   → Verificar INSTAGRAM_CLIENT_ID, etc. en .env

4. Redirect URI no configurada
   → En app OAuth settings: http://localhost:3000/callback

5. IP bloqueada
   → Algunos OAuth tienen whitelist de IPs

Solución:
1. Verificar token en https://jwt.io
2. Verificar .env variables
3. Testear con curl
```

---

## 🆘 Recursos Útiles

### Documentación Oficial

- [FastAPI Docs](https://fastapi.tiangolo.com)
- [SQLAlchemy Docs](https://docs.sqlalchemy.org)
- [PostgreSQL Docs](https://www.postgresql.org/docs)
- [Redis Docs](https://redis.io/documentation)
- [Docker Docs](https://docs.docker.com)
- [Next.js Docs](https://nextjs.org/docs)

### Tools para Testing

- [Postman](https://www.postman.com) - API testing
- [Insomnia](https://insomnia.rest) - REST client
- [Thunder Client](https://www.thunderclient.com) - VS Code extension
- [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) - VS Code extension

### Debugging

```bash
# Python debugger
python -m pdb app/main.py

# Logging más detallado
import logging
logging.basicConfig(level=logging.DEBUG)

# Inspect JWT tokens
https://jwt.io

# Check JSON validity
https://jsonlint.com

# Test regex
https://regex101.com
```

---

**¡Siempre hay una solución!** 🎯
