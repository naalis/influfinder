# Despliegue en Dokploy - Influfinder Backend

## Configuración del Proyecto

### 1. Variables de Entorno Requeridas

En Dokploy, configura las siguientes variables de entorno:

```bash
# App Configuration
DEBUG=False
APP_NAME=Influfinder API
VERSION=1.0.0

# Database (PostgreSQL)
DATABASE_URL=postgresql+asyncpg://usuario:password@host:5432/influfinder

# Redis
REDIS_URL=redis://host:6379

# JWT Security
SECRET_KEY=your-super-secret-key-change-this-in-production-min-32-chars
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# CORS - Agregar tu dominio de producción
ALLOWED_ORIGINS=["https://tudominio.com","https://www.tudominio.com"]

# OAuth2 Providers (Opcional - configurar cuando estés listo)
INSTAGRAM_CLIENT_ID=
INSTAGRAM_CLIENT_SECRET=
FACEBOOK_APP_ID=
FACEBOOK_APP_SECRET=
TIKTOK_CLIENT_ID=
TIKTOK_CLIENT_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# AWS S3 (Para almacenamiento de archivos)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_S3_BUCKET=influfinder-content
AWS_S3_REGION=us-east-1

# OpenAI (Para análisis de contenido con IA)
OPENAI_API_KEY=

# Email (SMTP)
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASSWORD=
SMTP_FROM_EMAIL=noreply@influfinder.com
SMTP_FROM_NAME=Influfinder
```

### 2. Configuración de Dokploy

#### Base de Datos PostgreSQL
1. Crear un servicio PostgreSQL en Dokploy
2. Base de datos: `influfinder`
3. Usuario y contraseña según lo configurado
4. Anotar el hostname interno (ej: `postgres.railway.internal`)

#### Redis
1. Crear un servicio Redis en Dokploy
2. Anotar el hostname interno

#### Backend (FastAPI)
1. **Repositorio**: Conectar tu repo de GitHub
2. **Branch**: `main`
3. **Build Path**: `/backend`
4. **Dockerfile Path**: `Dockerfile`
5. **Puerto**: `8000`
6. **Health Check Path**: `/api/v1/health`

### 3. Dockerfile

El proyecto ya incluye un `Dockerfile` optimizado para producción que:
- Usa Python 3.11 slim
- Instala dependencias del sistema
- Crea un usuario no-root para seguridad
- Ejecuta el script `start.sh` que:
  - Espera a que la base de datos esté lista
  - Ejecuta migraciones (cuando estén configuradas)
  - Inicia uvicorn en modo producción (sin --reload)

### 4. Build y Deploy

```bash
# Dokploy automáticamente:
1. Clona el repositorio
2. Construye la imagen Docker
3. Ejecuta el contenedor
4. Expone el puerto 8000
```

### 5. Verificación

Una vez desplegado, verifica:

1. **Health Check**:
   ```
   GET https://tudominio.com/api/v1/health
   ```
   Respuesta esperada:
   ```json
   {
     "status": "healthy",
     "version": "1.0.0",
     "database": "connected"
   }
   ```

2. **Documentación API**:
   ```
   https://tudominio.com/docs
   ```

3. **Root Endpoint**:
   ```
   GET https://tudominio.com/
   ```
   Respuesta:
   ```json
   {
     "name": "Influfinder API",
     "version": "1.0.0",
     "status": "running"
   }
   ```

### 6. Troubleshooting

#### Error: "FileNotFoundError: [Errno 2] No such file or directory"
- **Causa**: Uvicorn corriendo en modo --reload en producción
- **Solución**: Asegurar que `DEBUG=False` en variables de entorno

#### Error: "Temporary failure in name resolution"
- **Causa**: El contenedor inicia antes que la base de datos
- **Solución**: El script `start.sh` ya maneja esto con reintentos automáticos

#### Error: "Database connection failed"
- **Verificar**:
  - DATABASE_URL es correcta
  - PostgreSQL está corriendo
  - Network entre contenedores está configurada

#### Logs de Uvicorn en producción
Si ves logs de auto-reload:
```
INFO: Will watch for changes in these directories: ['/app']
```
Esto indica que está en modo desarrollo. Verificar `DEBUG=False`.

### 7. Monitoreo

Endpoints útiles para monitoreo:

- **Health**: `/api/v1/health` - Estado de la aplicación
- **Docs**: `/docs` - Documentación interactiva
- **OpenAPI**: `/openapi.json` - Especificación OpenAPI

### 8. Seguridad

Asegurar antes de producción:

- [ ] Cambiar `SECRET_KEY` a un valor aleatorio y seguro
- [ ] Configurar `ALLOWED_ORIGINS` solo con dominios permitidos
- [ ] Habilitar HTTPS en Dokploy
- [ ] Configurar rate limiting (si es necesario)
- [ ] Revisar logs de intentos de acceso maliciosos

### 9. Escalamiento

El Dockerfile usa `--workers 2` por defecto. Para ajustar:

Editar `backend/start.sh` línea 37:
```bash
exec uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

Número recomendado de workers: `(2 × CPU cores) + 1`

### 10. Actualizaciones

Para desplegar cambios:

1. Hacer push a `main` branch
2. Dokploy automáticamente:
   - Detecta cambios
   - Rebuilds imagen
   - Redeploys con zero-downtime (si está configurado)

## Comandos Útiles

### Ver logs en tiempo real
```bash
# En Dokploy UI: Logs tab
```

### Ejecutar comando en el contenedor
```bash
# En Dokploy: Terminal tab
python -m alembic upgrade head  # Ejecutar migraciones
```

### Reiniciar aplicación
```bash
# En Dokploy: Restart button
```

## Checklist de Despliegue

- [ ] PostgreSQL configurado y corriendo
- [ ] Redis configurado y corriendo
- [ ] Variables de entorno configuradas
- [ ] `SECRET_KEY` cambiada de valor por defecto
- [ ] `ALLOWED_ORIGINS` actualizado con dominios de producción
- [ ] Build exitoso
- [ ] Health check pasando
- [ ] `/docs` accesible
- [ ] Prueba de endpoint de registro
- [ ] Prueba de endpoint de login
- [ ] Logs sin errores

## Soporte

Si encuentras problemas:

1. Revisar logs en Dokploy
2. Verificar variables de entorno
3. Verificar conectividad entre servicios
4. Revisar este documento
