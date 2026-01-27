clear# Integración Frontend + Backend

## 🔗 URLs de la API

**Desarrollo:**
```
http://localhost:8000
```

**Producción:**
```
https://api.influfinder.com  (reemplazar con tu dominio)
```

## 🔐 Autenticación desde Frontend

### 1. Registro con Email

```typescript
// Frontend - src/app/onboarding/page.tsx
const response = await fetch('http://localhost:8000/api/v1/auth/register/email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'SecurePass123!',
    confirm_password: 'SecurePass123!',
    full_name: 'Juan Pérez',
    user_type: 'creator',
    country: 'ES'
  })
});

const { access_token, refresh_token, user } = await response.json();

// Guardar en localStorage
localStorage.setItem('access_token', access_token);
localStorage.setItem('refresh_token', refresh_token);
localStorage.setItem('user', JSON.stringify(user));
```

### 2. Registro con Instagram

```typescript
// Usar Instagram Login Kit en el frontend
// https://developers.instagram.com/docs/instagram-graph-api/overview

const response = await fetch('http://localhost:8000/api/v1/auth/register/instagram', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    provider: 'instagram',
    access_token: instagramAccessToken,  // Del SDK de Instagram
    user_type: 'creator',
    country: 'ES'
  })
});
```

### 3. Login

```typescript
const response = await fetch('http://localhost:8000/api/v1/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'SecurePass123!',
    remember_me: true
  })
});

const { access_token, refresh_token } = await response.json();
```

## 📤 Llamadas API Autenticadas

Todas las llamadas autenticadas deben incluir el header:

```typescript
const headers = {
  'Authorization': `Bearer ${access_token}`,
  'Content-Type': 'application/json'
};
```

## 📋 Ejemplos de Endpoints

### Crear Oferta (Business)

```typescript
// Frontend - src/app/(main)/home/page.tsx
const response = await fetch('http://localhost:8000/api/v1/offers', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    title: 'Necesito fotos de viaje a Bali',
    description: 'Buscamos creadores para colaboración...',
    category: 'travel',
    budget_min: 500,
    budget_max: 1500,
    currency: 'USD',
    payment_terms: 'upon_completion',
    influencer_requirements: {
      min_followers: 50000,
      min_engagement_rate: 3.0,
      verified_required: true
    },
    regular_creator_requirements: {
      min_followers: 1000
    },
    content_specs: {
      formats: ['reel', 'post'],
      hashtags: ['#viaje', '#bali'],
      mentions_required: true,
      caption_required: true
    },
    application_deadline: '2026-02-28T23:59:59Z',
    content_deadline: '2026-03-15T23:59:59Z',
    platforms: ['instagram', 'tiktok']
  })
});

const offer = await response.json();
```

### Listar Ofertas (Creator)

```typescript
// Frontend - src/app/(main)/explore/page.tsx
const response = await fetch(
  'http://localhost:8000/api/v1/offers?category=travel&sort_by=recent&page=1&limit=20',
  {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  }
);

const offers = await response.json();
```

### Aplicar a Oferta

```typescript
const response = await fetch('http://localhost:8000/api/v1/applications', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    offer_id: 123,
    message: 'Tengo experiencia en viajes y contenido de calidad',
    media_attachments: ['https://instagram.com/p/...', 'https://...'],
    proposed_fee: 800,
    proposed_date: '2026-03-01T10:00:00Z'
  })
});

const application = await response.json();
```

### Obtener Mis Colaboraciones

```typescript
const response = await fetch(
  'http://localhost:8000/api/v1/collaborations?status=accepted&role=creator',
  {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  }
);

const collaborations = await response.json();
```

### Subir Contenido

```typescript
const response = await fetch('http://localhost:8000/api/v1/submissions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    collaboration_id: 456,
    content_urls: ['https://instagram.com/p/...'],
    captions: {
      text: 'Hermosas vistas de Bali #viaje #bali @brand',
      hashtags: ['#viaje', '#bali', '#viajero'],
      mentions: ['@brand']
    },
    platform: 'instagram',
    platform_post_id: 'ABC123...'
  })
});

const submission = await response.json();
```

### Obtener Notificaciones

```typescript
const response = await fetch('http://localhost:8000/api/v1/notifications', {
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});

const notifications = await response.json();
```

### Enviar Mensaje

```typescript
const response = await fetch('http://localhost:8000/api/v1/messages', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    recipient_id: 789,
    content: '¿Cuándo te gustaría hacer la colaboración?',
    collaboration_id: 456
  })
});

const message = await response.json();
```

## 🔄 Refresh Token Pattern

```typescript
// Interceptor para refrescar token expirado
const apiCall = async (url, options = {}) => {
  let response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${getAccessToken()}`
    }
  });

  // Si 401 (Unauthorized), refrescar token
  if (response.status === 401) {
    const refreshToken = localStorage.getItem('refresh_token');
    
    const refreshResponse = await fetch(
      'http://localhost:8000/api/v1/auth/refresh',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refreshToken })
      }
    );

    if (refreshResponse.ok) {
      const { access_token } = await refreshResponse.json();
      localStorage.setItem('access_token', access_token);
      
      // Reintentar con nuevo token
      return fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          'Authorization': `Bearer ${access_token}`
        }
      });
    } else {
      // Token expirado, redirigir a login
      window.location.href = '/onboarding/login';
    }
  }

  return response;
};
```

## 📝 Variables de Entorno Frontend

Agregar a `frontend/.env.local`:

```env
# API
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_API_V1_URL=http://localhost:8000/api/v1

# OAuth
NEXT_PUBLIC_INSTAGRAM_APP_ID=your_instagram_app_id
NEXT_PUBLIC_FACEBOOK_APP_ID=your_facebook_app_id
NEXT_PUBLIC_TIKTOK_CLIENT_ID=your_tiktok_client_id
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
```

## 🔧 Configuración CORS

El backend ya tiene CORS configurado para aceptar:
- `http://localhost:3000` (desarrollo)
- `http://localhost:8000` (API local)
- `https://influfinder.com` (producción)

Si necesitas agregar más orígenes, edita `app/config.py`:

```python
ALLOWED_ORIGINS: list = [
    "http://localhost:3000",
    "https://mi-dominio.com",
]
```

## 🚀 Flow Completo de Usuario

### 1. Creador se registra
```
Frontend → POST /auth/register/instagram → Backend crea User + Profile
```

### 2. Creador descubre ofertas
```
Frontend → GET /offers?category=travel → Backend filtra y retorna
```

### 3. Creador aplica
```
Frontend → POST /applications → Backend crea Application, notifica Business
```

### 4. Business acepta
```
Frontend (Business) → POST /applications/{id}/review → Backend crea Collaboration
```

### 5. Creador sube contenido
```
Frontend → POST /submissions → Backend analiza con IA, valida requisitos
```

### 6. Business aprueba
```
Frontend (Business) → POST /submissions/{id}/approve → Collaboration → COMPLETED
```

### 7. Ambos califican
```
Frontend → POST /collaborations/{id}/rate → Backend actualiza Tier y Karma
```

## 📊 Estados Sincronizados

El frontend debe mostrar estos estados según respuesta del backend:

**Applicación:**
- `applied` - Esperando revisión
- `under_review` - Siendo revisada
- `accepted` - ✅ Aceptada
- `rejected` - ❌ Rechazada
- `withdrawn` - 🚫 Retirada

**Colaboración:**
- `accepted` - Acuerdo alcanzado
- `scheduled` - 📅 Agendada
- `visited` - 👁️ Ejecutada
- `content_submitted` - 📤 Contenido enviado
- `in_review` - 🔍 En revisión
- `completed` - ✅ Completada
- `cancelled` - ❌ Cancelada
- `disputed` - ⚠️ Disputa abierta

## 📱 Responsive Design

El backend está optimizado para:
- ✅ Mobile (iOS/Android con React Native posible)
- ✅ Tablet (iPad)
- ✅ Desktop (web)

## 🔐 Seguridad en Producción

1. **Variables de entorno seguras**
   ```bash
   DATABASE_URL=postgresql+asyncpg://user:pass@rds.amazonaws.com/db
   SECRET_KEY=very_long_random_string_min_32_chars
   OPENAI_API_KEY=sk-...
   ```

2. **HTTPS obligatorio**
   ```python
   ALLOWED_ORIGINS = ["https://influfinder.com"]
   ```

3. **Rate limiting**
   ```python
   # Agregar slowapi
   # pip install slowapi
   ```

4. **CORS restringido**
   ```python
   allow_origins=["https://influfinder.com"]
   allow_credentials=True
   ```

---

**Backend y Frontend completamente integrados y funcionales** ✅
