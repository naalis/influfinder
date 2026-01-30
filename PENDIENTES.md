# Pendientes - Influfinder

## ✅ Completado Recientemente

### Frontend Flutter - Geolocalización Real

**Estado**: ✅ **IMPLEMENTADO** (2026-01-29)

**Implementación**:
- ✅ Paquetes instalados: `geolocator: ^10.1.0`, `geocoding: ^2.1.0`
- ✅ Servicio de ubicación creado: `lib/core/services/location_service.dart`
- ✅ Permisos de ubicación con manejo completo de errores
- ✅ Geocoding reverso para obtener ciudad/país
- ✅ Manejo de casos de error (permisos denegados, GPS desactivado)
- ✅ Pantalla "Coming soon" para países no soportados
- ✅ Integrado en `location_screen.dart` con UX mejorada

**Archivos**:
- `frontend-flutter/lib/core/services/location_service.dart`
- `frontend-flutter/lib/features/onboarding/screens/location_screen.dart`
- `frontend-flutter/lib/features/onboarding/screens/coming_soon_screen.dart`

---

## 🔴 Crítico / Alta Prioridad

*(No hay tareas críticas pendientes)*

---

## 🟡 Media Prioridad

### Conectar Flutter con Backend API

**Estado**: NO implementado

**Archivos involucrados**:
- `frontend-flutter/lib/core/services/auth_service.dart`
- `frontend-flutter/lib/core/services/offers_service.dart`
- `frontend-flutter/lib/core/services/collabs_service.dart`

**Tareas**:
1. Configurar API base URL según entorno:
   - Desarrollo local: `http://localhost:8000/api/v1`
   - iOS Simulator: `http://127.0.0.1:8000/api/v1`
   - Android Emulator: `http://10.0.2.2:8000/api/v1`
   - Producción: `https://api.influfinder.com/api/v1`

2. Implementar cliente HTTP (usando `http` o `dio`)

3. Implementar llamadas a endpoints:
   - Autenticación (login, register, OAuth)
   - Usuarios (perfil, actualizar)
   - Categorías
   - Ofertas
   - Colaboraciones

4. Manejar tokens JWT:
   - Guardar en SharedPreferences
   - Incluir en headers de requests
   - Refresh token automático

5. Manejo de errores HTTP

---

### Implementar Flujo Completo de Autenticación

**Estado**: Pantallas creadas pero sin conexión al backend

**Pantallas existentes**:
- `login_screen.dart`
- `profile_setup_screen.dart`
- `oauth_connect_screen.dart`

**Tareas**:
1. Conectar login con endpoint `/api/v1/auth/login`
2. Conectar registro con endpoint `/api/v1/auth/register/email`
3. Implementar OAuth flows (Instagram, TikTok, Facebook, Google)
4. Guardar tokens en almacenamiento local
5. Implementar auto-login si hay token válido
6. Implementar logout
7. Manejar sesiones expiradas

---

### Push de Commits Locales a Git Remote

**Estado**: 3 commits locales sin pushear

**Commits pendientes**:
1. `feat: implement complete auth, users, and categories APIs`
2. `fix: optimize Docker deployment for production`
3. `docs: add comprehensive backend and architecture documentation`

**Comando**:
```bash
git push origin main
```

**Notas**:
- Se dejó pendiente a petición del usuario
- Recordar hacer push antes de deploy a producción

---

## 🟢 Baja Prioridad / Futuro

### Optimizar Dependencias Flutter

**Archivo**: `frontend-flutter/pubspec.yaml`

**Estado**: 7 paquetes tienen versiones más nuevas disponibles

**Paquetes desactualizados**:
- characters 1.4.0 → 1.4.1
- go_router 14.8.1 → 17.0.1
- google_fonts 6.3.3 → 8.0.0
- matcher 0.12.17 → 0.12.18
- material_color_utilities 0.11.1 → 0.13.0
- meta 1.17.0 → 1.18.0
- test_api 0.7.7 → 0.7.9

**Acción**:
```bash
flutter pub outdated
flutter pub upgrade
```

**Nota**: Revisar breaking changes antes de actualizar, especialmente `go_router` (14 → 17)

---

### Configurar Variables de Entorno para Producción

**Archivos**:
- `backend/.env` (no existe, usar `.env.example`)
- `backend/app/config.py`

**Variables críticas a cambiar**:
- `SECRET_KEY`: Generar una clave segura para producción
- `ALLOWED_ORIGINS`: Agregar dominios de producción
- `DATABASE_URL`: URL de PostgreSQL en Dokploy
- `REDIS_URL`: URL de Redis en Dokploy
- OAuth credentials (Instagram, Facebook, etc.)
- AWS S3 credentials
- SMTP credentials para emails

---

### Implementar Migraciones de Base de Datos

**Estado**: No configurado

**Herramienta**: Alembic (ya está en requirements.txt)

**Tareas**:
1. Inicializar Alembic
2. Generar migración inicial
3. Configurar auto-generación de migraciones
4. Actualizar `start.sh` para ejecutar migraciones en deploy

---

### Testing

**Estado**: No implementado

**Tareas**:
1. **Backend**:
   - Tests unitarios de servicios
   - Tests de integración de endpoints
   - Tests de autenticación
   - Coverage mínimo del 70%

2. **Frontend**:
   - Widget tests
   - Integration tests
   - Golden tests (screenshots)

---

### Documentación Adicional

**Pendientes**:
- API usage examples
- Guía de contribución
- Guía de estilo de código
- Diagramas de flujo de usuario
- Diagramas de arquitectura (visuales)

---

## Changelog de Este Documento

- **2026-01-26**: Documento creado
  - Agregado: Geolocalización Flutter como pendiente crítico
  - Agregado: Conexión Flutter-Backend como media prioridad
  - Agregado: Push de commits a remote
