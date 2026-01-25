# ⚡ Quick Start Guide - 5 Minutos

## 🎯 Objetivo

Tener **Influfinder backend completamente corriendo** en 5 minutos sin configuraciones complicadas.

---

## ✅ Prerequisites Check

```bash
# Verificar que tienes todo
docker --version           # Docker Desktop debe estar abierto
docker-compose --version   # v2.0+
git --version              # v2.0+
```

**No tienes algo?** Instala:
- [Docker Desktop](https://www.docker.com/products/docker-desktop) (Mac/Windows)
- Git desde [git-scm.com](https://git-scm.com)

---

## 🚀 5-Step Setup

### Step 1: Ir a la carpeta (30 segundos)

```bash
cd /Users/jesusacostazamora/inlfufinder/backend
```

### Step 2: Crear archivo .env (1 minuto)

```bash
cp .env.example .env
```

**Abrir `backend/.env` y actualizar estos campos CRÍTICOS:**

```env
# 🔐 Security (cambiar a valores reales)
JWT_SECRET_KEY=tu_clave_super_secreta_aqui_12345

# 📧 Email (opcional, puede dejar como está para testing)
SMTP_PASSWORD=dummy_for_testing

# 🔑 OpenAI (opcional, puede dejar como está)
OPENAI_API_KEY=sk-dummy_for_testing

# 🎭 OAuth (opcional, puede dejar como está)
INSTAGRAM_CLIENT_ID=dummy
INSTAGRAM_CLIENT_SECRET=dummy
```

**¡Listo!** Los demás valores ya están preconfigurados.

### Step 3: Iniciar Docker (2 minutos)

```bash
docker-compose up -d
```

Espera a que vea esto:
```
✓ Container backend Running
✓ Container postgres Running
✓ Container redis Running
```

### Step 4: Verificar que funciona (30 segundos)

```bash
curl http://localhost:8000/health
```

**Respuesta esperada:**
```json
{
  "status": "ok",
  "version": "1.0.0"
}
```

✅ **¡LISTO!** Backend está corriendo.

### Step 5: Ver documentación API (30 segundos)

Abre en navegador:
```
http://localhost:8000/docs
```

Verás la documentación interactiva con todos los endpoints.

---

## 🧪 Test Rápido (Opcional)

### Crear un usuario test

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

**Respuesta esperada (201):**
```json
{
  "user": {
    "id": "uuid-123",
    "email": "test@example.com",
    "username": "testuser",
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

**Respuesta esperada (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid-123",
    "email": "test@example.com",
    "profile": {
      "tier_level": 0,
      "karma_score": 0
    }
  }
}
```

✅ **Autenticación funcionando!**

---

## 📱 Conectar Frontend

### En la carpeta frontend

```bash
cd ../frontend

# Instalar dependencias
npm install

# Crear .env.local
cat > .env.local << 'EOF'
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
EOF

# Iniciar
npm run dev
```

Abre: `http://localhost:3000`

---

## 📊 Ver datos en BD (Opcional)

### Acceder a PostgreSQL

```bash
docker-compose exec postgres psql -U influfinder -d influfinder_db

# Ver todos los usuarios
SELECT id, email, username, user_type FROM users;

# Salir
\q
```

---

## 🆘 Problemas?

### "docker-compose: command not found"

```bash
# Usar así en lugar
docker compose up -d
```

### "port 8000 already in use"

```bash
# Matar el proceso
lsof -i :8000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# O cambiar puerto en docker-compose.yml
# ports:
#   - "8001:8000"
```

### "Cannot connect to Docker daemon"

```bash
# Abrir Docker Desktop app
open /Applications/Docker.app

# Esperar a que inicie (1 minuto)
# Reintentar
```

### Ver logs para debug

```bash
docker-compose logs backend -f
```

Presiona `Ctrl+C` para salir.

---

## 🎯 Próximos Pasos

```
✅ Backend corriendo (hecho!)
⬜ Configurar OAuth (20 min)
  → Instagram, Facebook, TikTok, Google apps
⬜ Configurar OpenAI (5 min)
  → Obtener API key en openai.com
⬜ Escribir tests (30 min)
  → pytest tests/
⬜ Deploy a producción (45 min)
  → Railway, DigitalOcean, AWS
```

---

## 📚 Documentación Completa

Para más detalles, consulta:

| Documento | Para qué |
|-----------|---------|
| `RESUMEN_EJECUTIVO.md` | Visión general del proyecto |
| `ARQUITECTURA_SISTEMA.md` | Cómo está diseñado |
| `API_REFERENCE.md` | Todos los endpoints |
| `GUIA_DESARROLLO_LOCAL.md` | Setup detallado |
| `TESTING_GUIDE.md` | Cómo escribir tests |
| `DEPLOYMENT_GUIDE.md` | Cómo desplegar |
| `TROUBLESHOOTING_FAQ.md` | Problemas comunes |

---

## 🎉 ¡Eso es todo!

Tu backend está **completamente funcional** y listo para:

- ✅ Registrar usuarios (5 métodos: email + 4 OAuth)
- ✅ Autenticación JWT
- ✅ CRUD de ofertas
- ✅ Gestión de colaboraciones
- ✅ Análisis de contenido con IA
- ✅ Sistema de notificaciones
- ✅ Mensajería directa
- ✅ Gamificación con tiers
- ✅ Y mucho más...

**Documentación automática disponible:**
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

---

## 💡 Tips Útiles

### Ver estado de contenedores

```bash
docker-compose ps
```

### Ver logs en tiempo real

```bash
docker-compose logs -f backend
```

### Detener todo

```bash
docker-compose down
```

### Resetear base de datos

```bash
docker-compose down -v
docker-compose up -d
```

### Acceder a Redis

```bash
docker-compose exec redis redis-cli
KEYS *  # Ver todas las claves
QUIT    # Salir
```

---

## 🚀 Deploy Rápido (Opcional)

Si quieres poner en producción inmediatamente:

```bash
# Opción 1: Railway (más fácil)
npm install -g @railway/cli
railway init
railway up

# Opción 2: DigitalOcean
# 1. Ir a digitalocean.com
# 2. Apps → Create App
# 3. Connect GitHub
# 4. Deploy

# Opción 3: Heroku
heroku create influfinder
git push heroku main
```

---

**¡Bienvenido a Influfinder!** 🎊

Para preguntas, revisar `TROUBLESHOOTING_FAQ.md`
