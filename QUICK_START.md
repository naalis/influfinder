# Influfinder - Guía Rápida

## Iniciar el Proyecto

### Backend (FastAPI)
```bash
cd backend
docker compose up -d

# Verificar que esté corriendo
curl http://localhost:8000/api/v1/health

# Ver logs
docker compose logs -f backend

# Detener
docker compose down
```

### Frontend (Flutter)
```bash
cd frontend-flutter
flutter run -d chrome

# Comandos mientras corre:
# r - Hot reload (recarga rápida)
# R - Hot restart (recarga completa)
# q - Salir
```

## URLs Importantes

- **Backend API**: http://localhost:8000
- **Documentación API**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/api/v1/health

## Comandos Útiles

### Backend
```bash
# Ver logs en tiempo real
docker compose logs -f backend

# Reiniciar backend
docker compose restart backend

# Rebuild después de cambios en Dockerfile
docker compose up -d --build
```

### Frontend
```bash
# Limpiar y reinstalar
flutter clean
flutter pub get

# Ver dispositivos disponibles
flutter devices

# Ejecutar en diferentes dispositivos
flutter run -d chrome    # Chrome
flutter run -d macos     # macOS Desktop
flutter run -d ios       # iOS Simulator
```

## Estado Actual del Proyecto

✅ Backend con 43 endpoints funcionando
✅ Autenticación JWT + OAuth
✅ Base de datos PostgreSQL
✅ Cache Redis
✅ Frontend Flutter con onboarding
✅ Sistema de navegación (go_router)
✅ Tema personalizado
✅ Gestión de estado (Provider)

## Próximos Pasos

1. Conectar Flutter con el backend API
2. Implementar flujo de autenticación completo
3. Desarrollar pantallas de búsqueda y ofertas
4. Desplegar a producción en Dokploy

## Documentación Completa

- [Configuración Flutter](FLUTTER_SETUP.md)
- [Arquitectura del Sistema](ARQUITECTURA_SISTEMA.md)
- [Análisis de Endpoints](ANALISIS_ENDPOINTS.md)
- [Despliegue Dokploy](DEPLOY_DOKPLOY.md)
