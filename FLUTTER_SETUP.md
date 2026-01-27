# Guía de Instalación y Ejecución - Flutter App

## Requisitos Previos

### 1. Instalar Flutter

**macOS:**
```bash
# Opción 1: Usando Homebrew (recomendado)
brew install --cask flutter

# Opción 2: Descarga manual
# Descarga Flutter desde: https://docs.flutter.dev/get-started/install/macos
# Extrae el archivo y agrega Flutter al PATH
```

**Verificar instalación:**
```bash
flutter --version
flutter doctor
```

### 2. Instalar Dependencias

**Xcode (para iOS):**
```bash
# Instalar desde App Store
# Luego configurar:
sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer
sudo xcodebuild -runFirstLaunch
```

**Android Studio (para Android):**
- Descarga desde: https://developer.android.com/studio
- Durante la instalación, asegúrate de instalar:
  - Android SDK
  - Android SDK Platform
  - Android Virtual Device

**Configurar Flutter:**
```bash
flutter doctor --android-licenses  # Aceptar licencias de Android
flutter doctor  # Verificar que todo esté OK
```

## Ejecutar el Proyecto

### Paso 1: Navegar al directorio

```bash
cd /Users/jesusacostazamora/inlfufinder/frontend-flutter
```

### Paso 2: Instalar dependencias de Flutter

```bash
flutter pub get
```

Esto instalará todas las dependencias listadas en `pubspec.yaml`:
- go_router (navegación)
- provider (state management)
- google_fonts (tipografías)
- lucide_icons (iconos)
- shared_preferences (almacenamiento local)
- cached_network_image (imágenes optimizadas)
- etc.

### Paso 3: Verificar dispositivos disponibles

```bash
flutter devices
```

Verás algo como:
```
Found 3 connected devices:
  iPhone 15 Pro (mobile)           • <id> • ios            • com.apple.CoreSimulator (simulator)
  macOS (desktop)                  • macos • darwin-arm64  • macOS 14.x
  Chrome (web)                     • chrome • web-javascript • Google Chrome 120.0
```

### Paso 4: Ejecutar la aplicación

**En iOS Simulator:**
```bash
# Abrir simulador
open -a Simulator

# Ejecutar app
flutter run
# o específicamente para iOS:
flutter run -d ios
```

**En Android Emulator:**
```bash
# Primero abre Android Studio y crea/inicia un emulador AVD
# Luego:
flutter run -d android
```

**En Chrome (Web):**
```bash
flutter run -d chrome
```

**En macOS (Desktop):**
```bash
flutter run -d macos
```

### Paso 5: Hot Reload durante el desarrollo

Una vez que la app está corriendo:
- Presiona `r` para hot reload (recarga rápida sin perder el estado)
- Presiona `R` para hot restart (recarga completa)
- Presiona `q` para salir

## Estructura del Proyecto

```
frontend-flutter/
├── lib/
│   ├── main.dart                 # Punto de entrada
│   ├── core/
│   │   ├── router.dart          # Configuración de rutas (go_router)
│   │   ├── theme.dart           # Tema de la app
│   │   └── constants.dart       # Constantes
│   ├── features/
│   │   ├── onboarding/         # Pantallas de onboarding
│   │   ├── auth/               # Login/Register
│   │   ├── home/               # Home screen
│   │   ├── search/             # Búsqueda
│   │   └── profile/            # Perfil
│   ├── models/                  # Modelos de datos
│   ├── services/                # Servicios (API, auth, etc)
│   ├── providers/               # Estado global (Provider)
│   └── widgets/                 # Widgets reutilizables
├── assets/
│   └── images/                  # Imágenes y logos
├── android/                     # Configuración Android
├── ios/                         # Configuración iOS
└── pubspec.yaml                 # Dependencias
```

## Conectar con el Backend

### Configurar la URL del API

Edita el archivo de configuración de API (usualmente en `lib/core/constants.dart` o `lib/services/api_service.dart`):

```dart
// Para desarrollo local
const String API_BASE_URL = 'http://localhost:8000/api/v1';

// Para iOS Simulator (no puede usar localhost)
const String API_BASE_URL = 'http://127.0.0.1:8000/api/v1';

// Para Android Emulator
const String API_BASE_URL = 'http://10.0.2.2:8000/api/v1';

// Para dispositivo físico (usa la IP de tu máquina)
const String API_BASE_URL = 'http://192.168.1.100:8000/api/v1';

// Para producción
const String API_BASE_URL = 'https://api.influfinder.com/api/v1';
```

## Comandos Útiles

```bash
# Limpiar build y caché
flutter clean
flutter pub get

# Analizar código
flutter analyze

# Ejecutar tests
flutter test

# Generar APK (Android)
flutter build apk

# Generar IPA (iOS)
flutter build ios

# Generar app para web
flutter build web

# Ver logs detallados
flutter run --verbose

# Ejecutar en modo release (más rápido)
flutter run --release
```

## Troubleshooting

### Error: "Unable to find bundled Java version"
```bash
# Configurar JAVA_HOME
export JAVA_HOME=/Applications/Android\ Studio.app/Contents/jbr/Contents/Home
```

### Error: "CocoaPods not installed"
```bash
sudo gem install cocoapods
cd ios
pod install
cd ..
```

### Error: "Gradle build failed"
```bash
cd android
./gradlew clean
cd ..
flutter clean
flutter pub get
```

### App no se conecta al backend local

**iOS Simulator:**
- Usar `http://127.0.0.1:8000` en lugar de `localhost`

**Android Emulator:**
- Usar `http://10.0.2.2:8000` (IP especial que apunta al host)

**Dispositivo físico:**
- Usar la IP local de tu máquina (ej: `http://192.168.1.100:8000`)
- Asegurar que el dispositivo y la máquina están en la misma red Wi-Fi
- Verificar que el backend permite CORS desde esa IP

### Hot reload no funciona
```bash
# Detener la app y ejecutar:
flutter clean
flutter pub get
flutter run
```

## Desarrollo

### Agregar nueva dependencia
```bash
# Agregar al pubspec.yaml manualmente o:
flutter pub add nombre_del_paquete

# Ejemplo:
flutter pub add http
```

### Generar íconos de la app
```bash
# Si usas flutter_launcher_icons:
flutter pub run flutter_launcher_icons
```

### Ver performance
```bash
flutter run --profile  # Modo con profiling habilitado
# Luego en DevTools puedes ver el performance
```

## Recursos

- [Documentación Flutter](https://docs.flutter.dev/)
- [Flutter Packages](https://pub.dev/)
- [Flutter Codelabs](https://docs.flutter.dev/codelabs)
- [Widget Catalog](https://docs.flutter.dev/ui/widgets)

## Siguientes Pasos

1. ✅ Instalar Flutter
2. ✅ Ejecutar `flutter doctor` y resolver problemas
3. ✅ Navegar a `frontend-flutter/`
4. ✅ Ejecutar `flutter pub get`
5. ✅ Iniciar simulador/emulador
6. ✅ Ejecutar `flutter run`
7. ✅ Asegurar que el backend está corriendo en `http://localhost:8000`
8. ✅ Probar la app y explorar las pantallas

## Nota: Backend debe estar corriendo

Antes de usar la app, asegúrate de que el backend FastAPI esté corriendo:

```bash
cd backend
docker compose up -d
# o
uvicorn app.main:app --reload
```

Verificar que el backend responde:
```bash
curl http://localhost:8000/api/v1/health
```
