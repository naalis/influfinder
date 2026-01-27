# Guía de Integración OAuth - Instagram, TikTok, Google & Apple

## 📊 Comparación Rápida de Plataformas

| Característica | Google | Apple | Instagram | TikTok |
|----------------|--------|-------|-----------|--------|
| **Dificultad** | ⭐ Fácil | ⭐⭐ Media | ⭐⭐⭐ Difícil | ⭐⭐⭐ Difícil |
| **Costo** | Gratis | $99/año | Gratis | Gratis |
| **App Review** | No | No | Sí (semanas) | Sí (días) |
| **Usuarios dev** | Ilimitados | Ilimitados | 25 usuarios | Ilimitados |
| **Token expira** | 1 hora | 10 min | 60 días | 24 horas |
| **Refresh token** | ✅ Sí | ❌ No | ✅ Sí | ✅ Sí |
| **Obligatorio iOS** | No | Sí* | No | No |
| **Web/Android/iOS** | ✅ Todos | ✅ Todos | ✅ Todos | ✅ Todos |
| **Mejor para** | Login rápido | Apps iOS | Creators | Creators |
| **Complejidad setup** | Baja | Media | Alta | Media |

*Si usas otros SSO en iOS, Apple Sign In es obligatorio.

### 🎯 Recomendación por Caso de Uso

- **Solo necesitas login básico**: Google (más fácil)
- **App va a iOS**: Google + Apple (obligatorio)
- **Plataforma de creators**: Google + Instagram + TikTok
- **Todas las opciones**: Google + Apple + Instagram + TikTok

## Recomendaciones Generales

### 🎯 Arquitectura Recomendada

**Backend maneja OAuth** (más seguro):
```
Usuario → Flutter App → Backend FastAPI → Plataforma Social (Instagram/TikTok)
                ↓                              ↓
            Deep Link ← Backend ← Token ←─────┘
```

**Por qué en el backend**:
- ✅ Más seguro (Client Secret nunca se expone al cliente)
- ✅ Tokens se guardan directamente en la base de datos
- ✅ Mejor control de errores y logging
- ✅ Facilita refresh de tokens
- ✅ Compatible con cualquier plataforma (web, iOS, Android)

---

## 📱 Instagram OAuth

### 1. Registro de la App

**Plataforma**: Facebook for Developers (Meta)

**Pasos**:
1. Ir a https://developers.facebook.com/
2. Crear una app → Tipo: "Consumer"
3. Agregar producto: **Instagram Basic Display**
4. Configurar Instagram Basic Display:
   - Valid OAuth Redirect URIs:
     - Desarrollo: `http://localhost:8000/api/v1/auth/instagram/callback`
     - Producción: `https://api.influfinder.com/api/v1/auth/instagram/callback`
   - Deauthorize Callback URL: `https://api.influfinder.com/api/v1/auth/instagram/deauthorize`
   - Data Deletion Request URL: `https://api.influfinder.com/api/v1/auth/instagram/data-deletion`

5. Obtener:
   - Instagram App ID (Client ID)
   - Instagram App Secret (Client Secret)

### 2. Permisos Necesarios (Scopes)

**Basic Display API** (para creators):
- `user_profile`: Nombre, username, foto
- `user_media`: Posts y fotos del usuario

**Instagram Graph API** (para análisis avanzado):
- Requiere **Business Account** o **Creator Account**
- `instagram_basic`: Perfil básico
- `instagram_manage_insights`: Métricas y analytics
- `pages_read_engagement`: Engagement metrics

⚠️ **Importante**: Instagram Basic Display solo funciona en **modo desarrollo** para 25 usuarios de prueba. Para producción necesitas **App Review de Meta**.

### 3. Flujo de Implementación

#### Backend (Ya parcialmente implementado)

**Endpoint para iniciar OAuth** (`/api/v1/auth/instagram/login`):
```python
@router.get("/instagram/login")
async def instagram_login():
    """Redirige a Instagram para autorización"""
    params = {
        'client_id': settings.INSTAGRAM_CLIENT_ID,
        'redirect_uri': settings.INSTAGRAM_REDIRECT_URI,
        'scope': 'user_profile,user_media',
        'response_type': 'code'
    }
    auth_url = f"https://api.instagram.com/oauth/authorize?{urlencode(params)}"
    return {"auth_url": auth_url}
```

**Endpoint de callback** (ya existe en `auth.py`):
```python
@router.get("/instagram/callback")
async def instagram_callback(code: str, db: AsyncSession = Depends(get_db)):
    """Maneja el callback de Instagram"""
    # 1. Intercambiar code por access_token
    # 2. Obtener datos del usuario de Instagram
    # 3. Crear o actualizar usuario en DB
    # 4. Generar JWT token
    # 5. Redirigir a la app con deep link
```

#### Frontend Flutter

**Opción 1: WebView In-App (Recomendada)**

```dart
import 'package:webview_flutter/webview_flutter.dart';
import 'package:url_launcher/url_launcher.dart';

class InstagramOAuthScreen extends StatefulWidget {
  @override
  _InstagramOAuthScreenState createState() => _InstagramOAuthScreenState();
}

class _InstagramOAuthScreenState extends State<InstagramOAuthScreen> {
  late WebViewController _controller;

  @override
  void initState() {
    super.initState();
    _initOAuth();
  }

  Future<void> _initOAuth() async {
    // 1. Llamar al backend para obtener auth_url
    final response = await http.get(
      Uri.parse('http://localhost:8000/api/v1/auth/instagram/login'),
    );
    final authUrl = jsonDecode(response.body)['auth_url'];

    // 2. Abrir WebView con auth_url
    _controller = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..setNavigationDelegate(
        NavigationDelegate(
          onNavigationRequest: (NavigationRequest request) {
            // Detectar callback
            if (request.url.startsWith('influfinder://oauth/callback')) {
              _handleCallback(request.url);
              return NavigationDecision.prevent;
            }
            return NavigationDecision.navigate;
          },
        ),
      )
      ..loadRequest(Uri.parse(authUrl));
  }

  void _handleCallback(String url) {
    final uri = Uri.parse(url);
    final token = uri.queryParameters['token'];

    if (token != null) {
      // Guardar token y navegar a home
      // SharedPreferences, Provider, etc.
      context.go('/home');
    }
  }
}
```

**Dependencias**:
```yaml
dependencies:
  webview_flutter: ^4.5.0
  url_launcher: ^6.3.1
  http: ^1.2.0
```

**Opción 2: Browser Externo + Deep Link**

```dart
Future<void> _connectInstagram() async {
  // 1. Obtener auth URL del backend
  final response = await http.get(
    Uri.parse('http://localhost:8000/api/v1/auth/instagram/login'),
  );
  final authUrl = jsonDecode(response.body)['auth_url'];

  // 2. Abrir browser
  if (await canLaunchUrl(Uri.parse(authUrl))) {
    await launchUrl(Uri.parse(authUrl), mode: LaunchMode.externalApplication);
  }

  // 3. La app volverá via deep link (configurar en AndroidManifest.xml y Info.plist)
}
```

### 4. Configurar Deep Links

**iOS** (`ios/Runner/Info.plist`):
```xml
<key>CFBundleURLTypes</key>
<array>
  <dict>
    <key>CFBundleURLSchemes</key>
    <array>
      <string>influfinder</string>
    </array>
    <key>CFBundleURLName</key>
    <string>com.influfinder.app</string>
  </dict>
</array>
```

**Android** (`android/app/src/main/AndroidManifest.xml`):
```xml
<intent-filter>
  <action android:name="android.intent.action.VIEW" />
  <category android:name="android.intent.category.DEFAULT" />
  <category android:name="android.intent.category.BROWSABLE" />
  <data
    android:scheme="influfinder"
    android:host="oauth" />
</intent-filter>
```

---

## 🎵 TikTok OAuth

### 1. Registro de la App

**Plataforma**: TikTok for Developers

**Pasos**:
1. Ir a https://developers.tiktok.com/
2. Crear app → Login Kit
3. Configurar Redirect URIs:
   - `http://localhost:8000/api/v1/auth/tiktok/callback`
   - `https://api.influfinder.com/api/v1/auth/tiktok/callback`

4. Obtener:
   - Client Key (Client ID)
   - Client Secret

### 2. Permisos Necesarios (Scopes)

**Para creators**:
- `user.info.basic`: Username, display name, avatar
- `user.info.profile`: Bio, follower count, verificado
- `user.info.stats`: Followers, likes, views
- `video.list`: Lista de videos públicos
- `video.insights`: Métricas de videos (requiere aprobación)

### 3. Flujo de Implementación

**Backend**:
```python
@router.get("/tiktok/login")
async def tiktok_login():
    """Inicia OAuth de TikTok"""
    csrfState = secrets.token_urlsafe(32)  # Anti-CSRF

    params = {
        'client_key': settings.TIKTOK_CLIENT_ID,
        'scope': 'user.info.basic,user.info.profile,user.info.stats',
        'response_type': 'code',
        'redirect_uri': settings.TIKTOK_REDIRECT_URI,
        'state': csrfState
    }

    auth_url = f"https://www.tiktok.com/v2/auth/authorize/?{urlencode(params)}"

    # Guardar csrfState en Redis con TTL de 10 minutos
    # Para validar en el callback

    return {"auth_url": auth_url, "state": csrfState}

@router.get("/tiktok/callback")
async def tiktok_callback(
    code: str,
    state: str,
    db: AsyncSession = Depends(get_db)
):
    """Callback de TikTok"""
    # 1. Validar state (anti-CSRF)
    # 2. Intercambiar code por access_token
    token_url = "https://open.tiktokapis.com/v2/oauth/token/"
    data = {
        'client_key': settings.TIKTOK_CLIENT_ID,
        'client_secret': settings.TIKTOK_CLIENT_SECRET,
        'code': code,
        'grant_type': 'authorization_code',
        'redirect_uri': settings.TIKTOK_REDIRECT_URI
    }

    # 3. Obtener datos del usuario
    # 4. Crear/actualizar usuario
    # 5. Generar JWT
    # 6. Redirigir a app
```

**Frontend**: Similar a Instagram (usar WebView o browser + deep link)

---

## 🔍 Google OAuth

### 1. Registro de la App

**Plataforma**: Google Cloud Console

**Pasos**:
1. Ir a https://console.cloud.google.com/
2. Crear un proyecto nuevo o seleccionar uno existente
3. Habilitar **Google+ API** y **People API**
4. Ir a **APIs & Services** → **Credentials**
5. Crear credenciales → **OAuth 2.0 Client ID**
6. Configurar pantalla de consentimiento OAuth:
   - Tipo: Externo (para usuarios fuera de tu organización)
   - Información de la app (nombre, logo, dominio)
   - Scopes: `email`, `profile`, `openid`
   - Usuarios de prueba (para desarrollo)

7. Crear OAuth Client ID:
   - **Tipo**: Web application
   - **Authorized redirect URIs**:
     - `http://localhost:8000/api/v1/auth/google/callback`
     - `https://api.influfinder.com/api/v1/auth/google/callback`

8. Para **Android** (si usas Google Sign-In nativo):
   - Tipo: Android
   - Package name: `com.influfinder.app`
   - SHA-1 certificate fingerprint (obtener con `keytool`)

9. Para **iOS** (si usas Google Sign-In nativo):
   - Tipo: iOS
   - Bundle ID: `com.influfinder.app`

10. Obtener:
    - Client ID
    - Client Secret

### 2. Permisos Necesarios (Scopes)

**Básicos**:
- `openid`: Identificador único del usuario
- `email`: Email del usuario
- `profile`: Nombre, foto de perfil

**Adicionales** (si necesitas):
- `https://www.googleapis.com/auth/userinfo.profile`: Perfil extendido
- `https://www.googleapis.com/auth/userinfo.email`: Email verificado
- `https://www.googleapis.com/auth/youtube.readonly`: Datos de YouTube (para creators)

### 3. Flujo de Implementación

#### Backend

**Endpoint para iniciar OAuth**:
```python
@router.get("/google/login")
async def google_login():
    """Inicia OAuth de Google"""
    params = {
        'client_id': settings.GOOGLE_CLIENT_ID,
        'redirect_uri': settings.GOOGLE_REDIRECT_URI,
        'response_type': 'code',
        'scope': 'openid email profile',
        'access_type': 'offline',  # Para obtener refresh_token
        'prompt': 'consent'  # Forzar pantalla de consentimiento
    }

    auth_url = f"https://accounts.google.com/o/oauth2/v2/auth?{urlencode(params)}"
    return {"auth_url": auth_url}

@router.get("/google/callback")
async def google_callback(code: str, db: AsyncSession = Depends(get_db)):
    """Callback de Google"""
    # 1. Intercambiar code por tokens
    token_url = "https://oauth2.googleapis.com/token"
    data = {
        'code': code,
        'client_id': settings.GOOGLE_CLIENT_ID,
        'client_secret': settings.GOOGLE_CLIENT_SECRET,
        'redirect_uri': settings.GOOGLE_REDIRECT_URI,
        'grant_type': 'authorization_code'
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(token_url, data=data)
        tokens = response.json()

        # 2. Verificar ID token (más seguro)
        id_token = tokens.get('id_token')
        user_data = await OAuthService.verify_google_token(id_token)

        # 3. Crear/actualizar usuario en DB
        # 4. Generar JWT
        # 5. Redirigir a app
```

**Verificar ID Token** (ya implementado en `security.py`):
```python
from google.oauth2 import id_token
from google.auth.transport import requests

@staticmethod
async def verify_google_token(id_token_str: str) -> dict:
    try:
        request = requests.Request()
        payload = id_token.verify_oauth2_token(
            id_token_str,
            request,
            settings.GOOGLE_CLIENT_ID
        )

        return {
            "provider_id": payload.get("sub"),
            "name": payload.get("name"),
            "email": payload.get("email"),
            "avatar_url": payload.get("picture"),
            "verified": payload.get("email_verified"),
        }
    except Exception:
        return None
```

#### Frontend Flutter

**Opción 1: WebView** (como Instagram/TikTok)

**Opción 2: Google Sign-In Package** (Recomendado para mejor UX):

```yaml
dependencies:
  google_sign_in: ^6.2.1
```

```dart
import 'package:google_sign_in/google_sign_in.dart';

class GoogleAuthService {
  final GoogleSignIn _googleSignIn = GoogleSignIn(
    scopes: ['email', 'profile'],
    // Para Web, especificar clientId
    clientId: 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com',
  );

  Future<void> signInWithGoogle() async {
    try {
      // 1. Sign in con Google
      final GoogleSignInAccount? account = await _googleSignIn.signIn();

      if (account == null) return; // Usuario canceló

      // 2. Obtener auth tokens
      final GoogleSignInAuthentication auth = await account.authentication;

      // 3. Enviar ID token al backend
      final response = await http.post(
        Uri.parse('http://localhost:8000/api/v1/auth/google/verify'),
        body: jsonEncode({
          'id_token': auth.idToken,
          'access_token': auth.accessToken,
        }),
      );

      // 4. Backend verifica token y devuelve JWT
      final jwt = jsonDecode(response.body)['token'];

      // 5. Guardar JWT y navegar
      await _saveToken(jwt);
      context.go('/home');

    } catch (error) {
      print('Error signing in with Google: $error');
    }
  }
}
```

**Configuración Android** (`android/app/build.gradle`):
```gradle
dependencies {
    implementation 'com.google.android.gms:play-services-auth:20.7.0'
}
```

**Configuración iOS** (`ios/Runner/Info.plist`):
```xml
<key>CFBundleURLTypes</key>
<array>
  <dict>
    <key>CFBundleURLSchemes</key>
    <array>
      <string>com.googleusercontent.apps.YOUR-CLIENT-ID</string>
    </array>
  </dict>
</array>
```

### 4. Refresh Tokens

Google tokens expiran en **1 hora**, pero refresh token dura indefinidamente:

```python
async def refresh_google_token(refresh_token: str):
    url = "https://oauth2.googleapis.com/token"
    data = {
        'client_id': settings.GOOGLE_CLIENT_ID,
        'client_secret': settings.GOOGLE_CLIENT_SECRET,
        'refresh_token': refresh_token,
        'grant_type': 'refresh_token'
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(url, data=data)
        return response.json()
```

---

## 🍎 Apple OAuth (Sign in with Apple)

### 1. Registro de la App

**Plataforma**: Apple Developer Program (requiere cuenta de pago $99/año)

**Pasos**:
1. Ir a https://developer.apple.com/account/
2. **Certificates, Identifiers & Profiles** → **Identifiers**
3. Registrar un **App ID**:
   - Bundle ID: `com.influfinder.app`
   - Habilitar **Sign in with Apple**

4. Crear **Services ID** (para web):
   - Identifier: `com.influfinder.service`
   - Habilitar **Sign in with Apple**
   - Configurar:
     - Domains: `api.influfinder.com`
     - Return URLs: `https://api.influfinder.com/api/v1/auth/apple/callback`

5. Crear **Key** para autenticación de servidor:
   - Key Name: `AppleSignInKey`
   - Habilitar **Sign in with Apple**
   - Descargar el archivo `.p8` (solo se puede descargar una vez)
   - Anotar el **Key ID**

6. Obtener:
   - Team ID (en Account membership)
   - Services ID (Client ID)
   - Key ID
   - Private Key (archivo .p8)

### 2. Permisos Necesarios (Scopes)

Apple tiene scopes muy limitados:
- `name`: Nombre completo (solo se obtiene en el primer login)
- `email`: Email (puede ser privado: `xyz@privaterelay.appleid.com`)

⚠️ **Importante**:
- Apple SOLO envía `name` y `email` en el **primer login**
- En logins subsecuentes, solo envía el `user_id`
- **Debes guardar** name/email en la primera vez

### 3. Flujo de Implementación

#### Backend

**Generar Client Secret** (Apple requiere JWT firmado):

```python
import jwt
import time
from datetime import datetime, timedelta

def generate_apple_client_secret():
    """Genera client_secret firmado con la private key de Apple"""

    # Leer private key (.p8)
    with open('AppleSignInKey.p8', 'r') as f:
        private_key = f.read()

    headers = {
        'kid': settings.APPLE_KEY_ID,
        'alg': 'ES256'
    }

    payload = {
        'iss': settings.APPLE_TEAM_ID,
        'iat': int(time.time()),
        'exp': int(time.time()) + 86400 * 180,  # 6 meses
        'aud': 'https://appleid.apple.com',
        'sub': settings.APPLE_CLIENT_ID  # Services ID
    }

    client_secret = jwt.encode(
        payload,
        private_key,
        algorithm='ES256',
        headers=headers
    )

    return client_secret

@router.get("/apple/login")
async def apple_login():
    """Inicia OAuth de Apple"""
    params = {
        'client_id': settings.APPLE_CLIENT_ID,
        'redirect_uri': settings.APPLE_REDIRECT_URI,
        'response_type': 'code',
        'response_mode': 'form_post',  # Apple usa POST, no GET
        'scope': 'name email'
    }

    auth_url = f"https://appleid.apple.com/auth/authorize?{urlencode(params)}"
    return {"auth_url": auth_url}

@router.post("/apple/callback")  # POST, no GET
async def apple_callback(
    code: str = Form(...),
    user: Optional[str] = Form(None),  # JSON con name/email (solo primera vez)
    db: AsyncSession = Depends(get_db)
):
    """Callback de Apple"""

    # 1. Generar client_secret
    client_secret = generate_apple_client_secret()

    # 2. Intercambiar code por tokens
    token_url = "https://appleid.apple.com/auth/token"
    data = {
        'client_id': settings.APPLE_CLIENT_ID,
        'client_secret': client_secret,
        'code': code,
        'grant_type': 'authorization_code',
        'redirect_uri': settings.APPLE_REDIRECT_URI
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(token_url, data=data)
        tokens = response.json()

    # 3. Decodificar ID token
    id_token = tokens.get('id_token')
    payload = jwt.decode(id_token, options={"verify_signature": False})

    apple_user_id = payload.get('sub')
    email = payload.get('email')

    # 4. Si hay 'user' (primera vez), extraer name
    user_data = {}
    if user:
        user_json = json.loads(user)
        user_data = {
            'first_name': user_json.get('name', {}).get('firstName'),
            'last_name': user_json.get('name', {}).get('lastName'),
            'email': email
        }

    # 5. Crear/actualizar usuario en DB
    # IMPORTANTE: Guardar name en primera vez

    # 6. Generar JWT
    # 7. Redirigir a app
```

#### Frontend Flutter

**Opción 1: sign_in_with_apple Package** (Recomendado):

```yaml
dependencies:
  sign_in_with_apple: ^5.0.0
```

```dart
import 'package:sign_in_with_apple/sign_in_with_apple.dart';

Future<void> signInWithApple() async {
  try {
    // 1. Sign in con Apple
    final credential = await SignInWithApple.getAppleIDCredential(
      scopes: [
        AppleIDAuthorizationScopes.email,
        AppleIDAuthorizationScopes.fullName,
      ],
      webAuthenticationOptions: WebAuthenticationOptions(
        clientId: 'com.influfinder.service',
        redirectUri: Uri.parse(
          'https://api.influfinder.com/api/v1/auth/apple/callback',
        ),
      ),
    );

    // 2. Enviar al backend
    final response = await http.post(
      Uri.parse('http://localhost:8000/api/v1/auth/apple/verify'),
      body: jsonEncode({
        'id_token': credential.identityToken,
        'authorization_code': credential.authorizationCode,
        'user_identifier': credential.userIdentifier,
        'given_name': credential.givenName,
        'family_name': credential.familyName,
        'email': credential.email,
      }),
    );

    // 3. Guardar JWT y navegar
    final jwt = jsonDecode(response.body)['token'];
    await _saveToken(jwt);
    context.go('/home');

  } catch (error) {
    print('Error signing in with Apple: $error');
  }
}
```

**Configuración iOS** (Xcode):
1. Abrir `ios/Runner.xcworkspace`
2. Seleccionar proyecto Runner
3. **Signing & Capabilities** → **+ Capability**
4. Agregar **Sign in with Apple**

**Configuración Android**:
No necesita configuración especial, funciona con webview.

### 4. Consideraciones Especiales de Apple

**⚠️ Obligatorio en iOS**:
- Si ofreces Google, Facebook u otro SSO en iOS, **DEBES incluir Apple Sign In** (requisito de App Store)

**🔒 Email Privado**:
- Apple puede dar un email relay: `xyz@privaterelay.appleid.com`
- Los emails se reenvían al email real del usuario
- Debes configurar dominio en Apple Developer para recibir emails

**📝 Name solo en primera vez**:
- Guardar name/email en primer login
- Subsecuentes logins solo dan `user_id`
- No hay forma de volver a obtener el name

**🔄 No hay Refresh Token**:
- Apple no proporciona refresh tokens
- El `id_token` expira en 10 minutos
- Debes re-autenticar al usuario cuando expire

**Token Revocation**:
```python
async def revoke_apple_token(refresh_token: str):
    """Revocar token de Apple"""
    client_secret = generate_apple_client_secret()

    url = "https://appleid.apple.com/auth/revoke"
    data = {
        'client_id': settings.APPLE_CLIENT_ID,
        'client_secret': client_secret,
        'token': refresh_token,
        'token_type_hint': 'refresh_token'
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(url, data=data)
```

---

## 🔐 Seguridad y Best Practices

### 1. Manejo de Tokens

**Backend**:
```python
# Guardar en base de datos (modelo User)
user.auth_providers = {
    'instagram': {
        'provider_id': instagram_user_id,
        'access_token': encrypted_token,  # ⚠️ ENCRIPTAR
        'refresh_token': encrypted_refresh,
        'expires_at': expiration_date,
        'connected_at': datetime.utcnow(),
        'username': instagram_username,
        'followers': follower_count
    }
}
```

**Encriptar tokens**:
```python
from cryptography.fernet import Fernet

class TokenEncryption:
    def __init__(self, key: str):
        self.cipher = Fernet(key.encode())

    def encrypt(self, token: str) -> str:
        return self.cipher.encrypt(token.encode()).decode()

    def decrypt(self, encrypted_token: str) -> str:
        return self.cipher.decrypt(encrypted_token.encode()).decode()
```

### 2. Refresh Tokens

**Instagram**: Tokens duran 60 días, se pueden refresh
```python
async def refresh_instagram_token(user: User):
    url = "https://graph.instagram.com/refresh_access_token"
    params = {
        'grant_type': 'ig_refresh_token',
        'access_token': user.instagram_access_token
    }
    # Actualizar token en DB
```

**TikTok**: Tokens duran 24 horas, DEBEN refrescarse
```python
async def refresh_tiktok_token(user: User):
    url = "https://open.tiktokapis.com/v2/oauth/token/"
    data = {
        'client_key': settings.TIKTOK_CLIENT_ID,
        'client_secret': settings.TIKTOK_CLIENT_SECRET,
        'grant_type': 'refresh_token',
        'refresh_token': user.tiktok_refresh_token
    }
    # Actualizar token en DB
```

### 3. Validación de Tokens

Antes de cada llamada a API social, verificar:
```python
async def validate_instagram_token(access_token: str) -> bool:
    try:
        response = await httpx.get(
            "https://graph.instagram.com/me",
            params={'access_token': access_token, 'fields': 'id'}
        )
        return response.status_code == 200
    except:
        return False
```

---

## 📊 Obtener Datos de Redes Sociales

### Google

**Perfil del usuario**:
```python
async def get_google_profile(access_token: str):
    url = "https://www.googleapis.com/oauth2/v2/userinfo"
    headers = {'Authorization': f'Bearer {access_token}'}
    response = await httpx.get(url, headers=headers)
    return response.json()
    # Devuelve: id, email, verified_email, name, given_name,
    #           family_name, picture, locale
```

**Usando Google People API** (más datos):
```python
async def get_google_profile_extended(access_token: str):
    url = "https://people.googleapis.com/v1/people/me"
    headers = {'Authorization': f'Bearer {access_token}'}
    params = {
        'personFields': 'names,emailAddresses,photos,phoneNumbers,birthdays'
    }
    response = await httpx.get(url, headers=headers, params=params)
    return response.json()
```

### Instagram

**Perfil del usuario**:
```python
async def get_instagram_profile(access_token: str):
    url = "https://graph.instagram.com/me"
    params = {
        'fields': 'id,username,account_type,media_count',
        'access_token': access_token
    }
    response = await httpx.get(url, params=params)
    return response.json()
```

**Métricas** (requiere Business Account):
```python
async def get_instagram_insights(user_id: str, access_token: str):
    url = f"https://graph.instagram.com/{user_id}/insights"
    params = {
        'metric': 'follower_count,impressions,reach,profile_views',
        'period': 'day',
        'access_token': access_token
    }
```

### TikTok

**Perfil del usuario**:
```python
async def get_tiktok_profile(access_token: str):
    url = "https://open.tiktokapis.com/v2/user/info/"
    headers = {
        'Authorization': f'Bearer {access_token}',
        'Content-Type': 'application/json'
    }
    params = {'fields': 'open_id,union_id,avatar_url,display_name,follower_count,following_count,likes_count'}
    response = await httpx.get(url, headers=headers, params=params)
    return response.json()
```

### Apple

**Perfil del usuario**:
Apple NO proporciona API para obtener datos del usuario después del login inicial. Solo se obtiene en el primer login:
- `sub`: User ID único
- `email`: Email (puede ser relay)
- `name`: Solo en primer login (no disponible después)

Para obtener datos posteriormente, debes guardarlos en tu base de datos en el primer login.

---

## 🚀 Plan de Implementación General (Todas las Plataformas)

### Fase 1: Setup Básico (1-2 días por plataforma)
1. ✅ Registrar apps en cada plataforma (Google/Apple/Instagram/TikTok)
2. ✅ Obtener Client IDs y Secrets
3. ✅ Configurar variables de entorno en backend
4. ✅ Probar endpoints manualmente (Postman/Thunder Client)

### Fase 2: Backend OAuth (2-3 días por plataforma)
1. ✅ Implementar endpoints de inicio OAuth
2. ✅ Implementar callbacks
3. ✅ Implementar refresh de tokens (excepto Apple)
4. ✅ Agregar encriptación de tokens
5. ✅ Testing con usuarios de prueba

### Fase 3: Frontend Flutter (2-3 días por plataforma)
1. ✅ Configurar deep links (iOS + Android)
2. ✅ Implementar WebView o native SDK
3. ✅ Manejar callback y guardar token
4. ✅ Actualizar UI con datos del usuario
5. ✅ Testing en emuladores y dispositivos físicos

### Fase 4: App Review (1-2 semanas para Instagram/TikTok)
1. ✅ Instagram: Enviar app review a Meta
2. ✅ TikTok: Solicitar permisos adicionales si es necesario
3. ✅ Preparar video demo
4. ✅ Documentar casos de uso
5. ✅ Política de privacidad y términos publicados

---

## ⚠️ Limitaciones y Consideraciones

### Instagram
- ❌ Basic Display API solo permite 25 usuarios en desarrollo
- ❌ Requiere **App Review** para producción (puede tomar semanas)
- ❌ Business Account necesario para métricas avanzadas
- ⚠️ Tokens expiran en 60 días (refresh necesario)

### TikTok
- ⚠️ Tokens expiran en **24 horas** (refresh obligatorio)
- ❌ Algunas métricas requieren aprobación especial
- ❌ API rate limits estrictos
- ⚠️ Solo funciona con cuentas públicas

### Google
- ✅ Más fácil de implementar
- ✅ No requiere app review para funciones básicas
- ⚠️ Tokens expiran en 1 hora (pero refresh token dura indefinidamente)
- ✅ Funciona en web, iOS, Android sin problemas
- ✅ Excelente documentación

### Apple
- ❌ Requiere **Apple Developer Program** ($99/año)
- ❌ **Obligatorio en iOS** si usas otros SSO
- ⚠️ Name y email **solo se obtienen en el primer login**
- ❌ No hay refresh tokens (re-autenticación necesaria)
- ⚠️ Email puede ser privado (relay)
- ⚠️ Configuración más compleja (JWT firmado con .p8 key)

---

## 📝 Checklist Pre-Producción

### General
- [ ] Client IDs y Secrets en variables de entorno (todas las plataformas)
- [ ] Redirect URIs configurados en todas las plataformas
- [ ] HTTPS configurado (obligatorio para producción)
- [ ] Deep links probados en iOS y Android
- [ ] Tokens encriptados en base de datos
- [ ] Refresh tokens implementado (Google, Instagram, TikTok)
- [ ] Manejo de errores completo
- [ ] Testing con usuarios reales
- [ ] Política de privacidad publicada
- [ ] Terms of Service publicados
- [ ] Data deletion endpoint implementado

### Google
- [ ] OAuth consent screen aprobado
- [ ] Redirect URIs configurados para web, iOS, Android
- [ ] Refresh token funcionando correctamente

### Apple
- [ ] Apple Developer Program activo
- [ ] Sign in with Apple configurado en App ID
- [ ] Services ID configurado con dominio verificado
- [ ] Private Key (.p8) guardada de forma segura
- [ ] JWT client_secret funcionando
- [ ] Probado en dispositivo iOS real
- [ ] Manejo de email relay implementado
- [ ] Guardado de name en primer login

### Instagram
- [ ] App review aprobado (Meta)
- [ ] Business Account configurado (para métricas)
- [ ] Refresh tokens implementado
- [ ] Webhooks configurados (deauthorize, data deletion)

### TikTok
- [ ] Permisos de API aprobados
- [ ] Refresh automático cada 24h implementado
- [ ] Rate limiting manejado correctamente

---

## 🛠️ Herramientas Útiles

**Testing OAuth**:
- [OAuth Debugger](https://oauthdebugger.com/)
- Postman con OAuth 2.0 helper
- Thunder Client (VS Code)

**Monitoring**:
- Sentry para errores
- Mixpanel para analytics de OAuth success rate

**Documentación Oficial**:
- **Google**:
  - [Google Identity](https://developers.google.com/identity)
  - [OAuth 2.0](https://developers.google.com/identity/protocols/oauth2)
  - [Sign In with Google](https://developers.google.com/identity/gsi/web)
- **Apple**:
  - [Sign in with Apple](https://developer.apple.com/sign-in-with-apple/)
  - [REST API](https://developer.apple.com/documentation/sign_in_with_apple/sign_in_with_apple_rest_api)
  - [Generate Client Secret](https://developer.apple.com/documentation/sign_in_with_apple/generate_and_validate_tokens)
- **Instagram**:
  - [Basic Display API](https://developers.facebook.com/docs/instagram-basic-display-api)
  - [Graph API](https://developers.facebook.com/docs/instagram-api)
- **TikTok**:
  - [Login Kit](https://developers.tiktok.com/doc/login-kit-web/)
  - [API Reference](https://developers.tiktok.com/doc/login-kit-manage-user-access-tokens)

**Flutter Packages**:
- [google_sign_in](https://pub.dev/packages/google_sign_in)
- [sign_in_with_apple](https://pub.dev/packages/sign_in_with_apple)
- [webview_flutter](https://pub.dev/packages/webview_flutter)

---

## 🚦 Orden de Implementación Recomendado

### Orden sugerido (de más fácil a más difícil):

1. **Google** (1-2 días) ✅ **EMPEZAR AQUÍ**
   - Más fácil de configurar
   - No requiere app review
   - Excelente documentación
   - Funciona en todas las plataformas

2. **Apple** (2-3 días)
   - Necesario si vas a publicar en iOS
   - Más complejo pero bien documentado
   - Requiere cuenta de desarrollador de pago

3. **Instagram** (3-4 días)
   - Importante para creators
   - Requiere app review
   - Limitado a 25 usuarios en desarrollo

4. **TikTok** (2-3 días)
   - Similar a Instagram
   - Tokens de 24 horas requieren refresh constante

## Próximo Paso Inmediato

**Recomendación**: Empezar con **Google OAuth**

### Fase 1: Google (Prioridad Alta)
1. ✅ Crear proyecto en Google Cloud Console
2. ✅ Habilitar APIs necesarias
3. ✅ Configurar OAuth consent screen
4. ✅ Obtener Client ID y Secret
5. ✅ Implementar en backend
6. ✅ Probar con Postman
7. ✅ Implementar en Flutter
8. ✅ Testing end-to-end

### Fase 2: Apple (Si vas a iOS)
1. ✅ Registrar en Apple Developer Program
2. ✅ Crear Services ID y Key
3. ✅ Implementar generación de client_secret
4. ✅ Implementar endpoints
5. ✅ Configurar Sign in with Apple en Xcode
6. ✅ Testing en dispositivo iOS

### Fase 3: Instagram (Para creators)
1. ✅ Registrar en Facebook Developers
2. ✅ Configurar Instagram Basic Display
3. ✅ Agregar usuarios de prueba
4. ✅ Implementar flujo OAuth
5. ✅ Preparar app review
6. ✅ Enviar a revisión

### Fase 4: TikTok (Para creators)
1. ✅ Registrar en TikTok Developers
2. ✅ Configurar Login Kit
3. ✅ Implementar refresh automático de tokens
4. ✅ Testing extensivo

## 📋 Checklist Rápido por Plataforma

### Google ✅ Más Fácil
- [ ] Proyecto en Google Cloud Console
- [ ] OAuth consent screen configurado
- [ ] Client ID y Secret obtenidos
- [ ] Redirect URIs configurados
- [ ] Backend implementado
- [ ] Flutter package instalado
- [ ] Testing completo

### Apple ⚠️ Medio
- [ ] Apple Developer Program activo ($99)
- [ ] Services ID creado
- [ ] Key (.p8) descargada y guardada
- [ ] Team ID y Key ID anotados
- [ ] Función de firma JWT implementada
- [ ] Sign in with Apple en Xcode
- [ ] Testing en dispositivo iOS real

### Instagram 🔴 Difícil
- [ ] App en Facebook Developers
- [ ] Instagram Basic Display configurado
- [ ] 10-25 usuarios de prueba agregados
- [ ] Endpoints implementados
- [ ] Testing con usuarios reales
- [ ] Video demo preparado
- [ ] App review enviado
- [ ] Política de privacidad publicada

### TikTok 🔴 Difícil
- [ ] App en TikTok Developers
- [ ] Login Kit configurado
- [ ] Refresh automático implementado
- [ ] Testing extensivo de tokens
- [ ] Rate limits considerados

¿Necesitas ayuda con algún paso específico?
