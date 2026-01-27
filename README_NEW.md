# 🚀 Influfinder - Marketplace de Colaboraciones de Influencers

[![FastAPI](https://img.shields.io/badge/FastAPI-0.104.1-green?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com)
[![Python](https://img.shields.io/badge/Python-3.11+-blue?style=flat-square&logo=python)](https://www.python.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue?style=flat-square&logo=postgresql)](https://www.postgresql.org)
[![Docker](https://img.shields.io/badge/Docker-Compose-blue?style=flat-square&logo=docker)](https://www.docker.com)
[![Next.js](https://img.shields.io/badge/Next.js-React-black?style=flat-square&logo=nextjs)](https://nextjs.org)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

---

## 📱 ¿Qué es Influfinder?

**Influfinder** es una plataforma digital que conecta a:

- 👤 **Creadores** (influencers, bloggers, content creators)
- 🏢 **Negocios** (agencias, empresas, marcas)

Para hacer **colaboraciones pagadas** en redes sociales (Instagram, TikTok, Facebook, etc.)

### Características Principales

✨ **Autenticación Multi-plataforma**
- Email + Contraseña
- Instagram, Facebook, TikTok, Google OAuth

🎮 **Sistema de Gamificación**
- 6 Tiers progresivos (NEWBIE → LEGEND)
- Karma Score automático
- Badges y reconocimiento

🤖 **Análisis de Contenido con IA**
- Integración OpenAI Vision
- Detección de hashtags y menciones
- Scoring automático (0-100)

🔔 **Notificaciones en Tiempo Real**
- 11 tipos de eventos
- Push notifications
- WebSocket ready

💼 **Marketplace Completo**
- Crear ofertas de colaboración
- Aplicar a ofertas
- Gestión de colaboraciones
- Pagos y transacciones

---

## 🚀 Quick Start (5 minutos)

### 1️⃣ Requisitos

```bash
docker --version      # Docker Desktop (abierto)
docker-compose --version
git --version
```

### 2️⃣ Clonar y Preparar

```bash
cd /Users/jesusacostazamora/inlfufinder/backend
cp .env.example .env
```

Edita `.env` y actualiza:
```env
JWT_SECRET_KEY=tu_clave_secreta
```

### 3️⃣ Iniciar con Docker

```bash
docker-compose up -d
```

### 4️⃣ Verificar

```bash
curl http://localhost:8000/health
# {"status":"ok","version":"1.0.0"}
```

### 5️⃣ Explorar API

```
Swagger UI:  http://localhost:8000/docs
ReDoc:       http://localhost:8000/redoc
API:         http://localhost:8000/api/v1
```

✅ **¡Listo!** Backend completamente funcional.

---

## 📚 Documentación Completa

| Documento | Descripción | Tiempo |
|-----------|-----------|--------|
| **[QUICK_START.md](./QUICK_START.md)** | Empezar en 5 minutos | 5 min |
| **[RESUMEN_EJECUTIVO.md](./RESUMEN_EJECUTIVO.md)** | Visión general del proyecto | 10 min |
| **[ARQUITECTURA_SISTEMA.md](./ARQUITECTURA_SISTEMA.md)** | Diagramas y flujos | 15 min |
| **[API_REFERENCE.md](./API_REFERENCE.md)** | Todos los endpoints | 30 min |
| **[GUIA_DESARROLLO_LOCAL.md](./GUIA_DESARROLLO_LOCAL.md)** | Setup local detallado | 30 min |
| **[TESTING_GUIDE.md](./TESTING_GUIDE.md)** | Suite de tests | 45 min |
| **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** | Desplegar a producción | 45 min |
| **[TROUBLESHOOTING_FAQ.md](./TROUBLESHOOTING_FAQ.md)** | Problemas y soluciones | 20 min |
| **[DOCUMENTATION_INDEX.md](./DOCUMENTATION_INDEX.md)** | Índice de toda la documentación | 5 min |

**[👉 Ir al índice completo](./DOCUMENTATION_INDEX.md)**

---

## 🏗️ Arquitectura

```
┌────────────────────────────────────────┐
│     Frontend (Next.js + React)         │
│     http://localhost:3000              │
└────────────────┬───────────────────────┘
                 │ HTTP/HTTPS + JWT
                 ▼
┌────────────────────────────────────────┐
│   Backend (FastAPI + PostgreSQL)       │
│   http://localhost:8000/api/v1         │
│                                         │
│   • 40+ REST Endpoints                 │
│   • Autenticación JWT + OAuth2         │
│   • Gamificación                       │
│   • Análisis IA                        │
│   • Notificaciones                     │
└────────────────┬───────────────────────┘
                 │
    ┌────────────┼────────────┐
    ▼            ▼            ▼
PostgreSQL     Redis      OpenAI API
(Port 5432)  (Port 6379)  (Vision)
```

---

## 📊 Stack Tecnológico

### Backend

- **FastAPI 0.104.1** - Framework web async
- **SQLAlchemy 2.0** - ORM
- **PostgreSQL 15** - Base de datos
- **asyncpg** - Driver async para PostgreSQL
- **Pydantic v2** - Validación
- **PyJWT + bcrypt** - Autenticación
- **Redis 7** - Cache y sesiones
- **OpenAI** - Análisis de contenido
- **Docker** - Contenedorización

### Frontend

- **Next.js 14+** - Framework React
- **TypeScript** - Type safety
- **Tailwind CSS** - Estilos
- **React Query** - Data fetching
- **NextAuth.js** - Autenticación

---

## 🗄️ Base de Datos (8 modelos)

```
Users
├── Profiles (Gamification)
├── Offers (Marketplace)
│   ├── Applications (Solicitudes)
│   └── Collaborations (Activas)
│       └── ContentSubmissions (Contenido)
└── Notifications & Messages (Comunicación)
```

---

## 🔌 API Endpoints (40+)

### Autenticación (15)

```
POST   /auth/register/{email,instagram,facebook,tiktok,google}
POST   /auth/login
POST   /auth/refresh
POST   /auth/verify-email
POST   /auth/forgot-password
POST   /auth/reset-password
... y más
```

### Ofertas (7)

```
POST   /offers              (crear)
GET    /offers              (listar)
GET    /offers/{id}         (detalles)
PATCH  /offers/{id}         (editar)
POST   /offers/{id}/publish
POST   /offers/{id}/archive
```

### Colaboraciones (8)

```
POST   /applications        (solicitar)
POST   /applications/{id}/review  (revisar)
GET    /collaborations      (listar)
POST   /collaborations/{id}/schedule  (agendar)
POST   /collaborations/{id}/rate      (calificar)
```

### Contenido (4)

```
POST   /submissions         (enviar)
POST   /submissions/{id}/analyze-ai (analizar con IA)
POST   /submissions/{id}/approve    (aprobar)
POST   /submissions/{id}/reject     (rechazar)
```

### Notificaciones (4)

```
GET    /notifications
PATCH  /notifications/{id}/read
DELETE /notifications/{id}
GET    /notifications/unread-count
```

### Mensajes (3)

```
POST   /messages           (enviar)
GET    /messages           (conversaciones)
GET    /messages/{user_id} (chat)
```

**[Ver documentación completa →](./API_REFERENCE.md)**

---

## 🚀 Deployment

### Railway (Recomendado)

```bash
npm install -g @railway/cli
railway init
railway up
```

⏱️ **5 minutos** | 💰 **$5-20/mes**

### DigitalOcean

Conectar GitHub → Deploy automático

⏱️ **15 minutos** | 💰 **$30-50/mes**

### AWS

ECS Fargate + RDS + ElastiCache

⏱️ **45 minutos** | 💰 **$60-200+/mes**

**[Guía completa de deployment →](./DEPLOYMENT_GUIDE.md)**

---

## 🧪 Testing

```bash
pip install pytest pytest-asyncio pytest-cov
pytest --cov=app
```

Cobertura objetivo: **80%+**

**[Guía completa de testing →](./TESTING_GUIDE.md)**

---

## 🔐 Seguridad

✅ JWT con tokens de acceso/refresh
✅ Hashing de contraseñas (bcrypt)
✅ OAuth2 con 4 proveedores
✅ CORS configurado
✅ Rate limiting ready
✅ Email verification
✅ Password reset tokens

---

## 📈 Escalabilidad

- ✅ Async/await en todo el código
- ✅ Connection pooling (PostgreSQL)
- ✅ Redis para sesiones
- ✅ CDN ready (S3 + CloudFront)
- ✅ Load balancing ready
- ✅ Horizontal scaling ready

---

## 🆘 Problemas?

Revisar **[TROUBLESHOOTING_FAQ.md](./TROUBLESHOOTING_FAQ.md)**

Comandos útiles:

```bash
# Ver logs
docker-compose logs -f backend

# Conectar a BD
docker-compose exec postgres psql -U influfinder -d influfinder_db

# Reset
docker-compose down -v
docker-compose up -d
```

---

## 📊 Estado del Proyecto

```
✅ Backend:    100%
├─ Core infrastructure
├─ Database models
├─ API endpoints
├─ Authentication
├─ Gamification
├─ AI integration
└─ Full documentation

✅ Frontend:   60%
├─ Auth UI
├─ Offer browsing
├─ Application flow
└─ (En desarrollo)

⬜ Testing:    0%
├─ Unit tests
├─ Integration tests
└─ E2E tests

⬜ DevOps:     0%
├─ CI/CD pipeline
├─ Monitoring
└─ Logging
```

---

## 🤝 Contribuir

Cualquier contribución es bienvenida:

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📞 Contacto

- 📧 Email: [tu_email@example.com]
- 🐙 GitHub: [tu_github]
- 🔗 LinkedIn: [tu_linkedin]

---

## 📝 Licencia

Este proyecto está bajo la Licencia MIT - ver archivo [LICENSE](./LICENSE)

---

## 🎉 ¿Listo para empezar?

```bash
# Opción 1: Quick Start (5 min)
cat QUICK_START.md

# Opción 2: Ver documentación
cat DOCUMENTATION_INDEX.md

# Opción 3: Empezar directamente
cd backend
cp .env.example .env
docker-compose up -d
```

**API disponible en:** http://localhost:8000/docs

---

## 📚 Recursos Adicionales

- [FastAPI Documentation](https://fastapi.tiangolo.com)
- [PostgreSQL Documentation](https://www.postgresql.org/docs)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org)
- [Next.js Documentation](https://nextjs.org/docs)
- [Docker Documentation](https://docs.docker.com)

---

**Hecho con ❤️ para creadores e influencers** 🚀
