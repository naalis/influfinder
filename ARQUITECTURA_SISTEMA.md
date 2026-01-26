# Arquitectura del Sistema - Influfinder

## 🏗️ Arquitectura General

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (Flutter)                        │
│  - Multi-Platform: Android, iOS, Web                            │
│  - Flutter Widgets (Material Design)                            │
│  - Provider State Management                                    │
│  - Auth Flow (Email + OAuth)                                     │
│  - Ofertas (CRUD)                                                │
│  - Aplicaciones & Colaboraciones                                 │
│  - Gamificación (Tiers)                                          │
│  - Chat en tiempo real                                           │
└─────────────────────┬───────────────────────────────────────────┘
                      │ HTTP/HTTPS
                      │ JWT Token
                      │
┌─────────────────────▼───────────────────────────────────────────┐
│                     BACKEND (FastAPI)                            │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ API Layer (40+ Endpoints)                                │   │
│  │ ├─ Auth (15 endpoints)                                   │   │
│  │ ├─ Offers (7 endpoints)                                  │   │
│  │ ├─ Collaborations (8 endpoints)                          │   │
│  │ ├─ Submissions (4 endpoints)                             │   │
│  │ ├─ Notifications (4 endpoints)                           │   │
│  │ └─ Messages (3 endpoints)                                │   │
│  └──────────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Services Layer (Business Logic)                          │   │
│  │ ├─ AuthService (OAuth + JWT)                             │   │
│  │ ├─ OfferService                                          │   │
│  │ ├─ CollaborationService (Tiers)                          │   │
│  │ ├─ ContentAnalysisService (AI)                           │   │
│  │ ├─ NotificationService                                   │   │
│  │ └─ EmailService                                          │   │
│  └──────────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Models Layer (SQLAlchemy)                                │   │
│  │ ├─ User + Profile                                        │   │
│  │ ├─ Offer                                                 │   │
│  │ ├─ Application + Collaboration                           │   │
│  │ ├─ ContentSubmission                                     │   │
│  │ └─ Notification + Message                                │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────┬───────────────────────────────────────────┘
                      │
        ┌─────────────┼─────────────┬──────────────┐
        │             │             │              │
        ▼             ▼             ▼              ▼
  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
  │PostgreSQL│  │  Redis   │  │OpenAI API│  │AWS S3   │
  │Database  │  │  Cache   │  │(Vision)  │  │Storage  │
  │  (8 TB)  │  │          │  │          │  │         │
  └──────────┘  └──────────┘  └──────────┘  └──────────┘
```

## 🔐 Flujo de Autenticación

```
┌──────────────────────────────────────┐
│       USUARIO EN FRONTEND             │
├──────────────────────────────────────┤
│ Opción 1: Email + Contraseña         │
│ Opción 2: Instagram OAuth            │
│ Opción 3: Facebook OAuth             │
│ Opción 4: TikTok OAuth               │
│ Opción 5: Google OAuth               │
└──────────────────┬────────────────────┘
                   │
        ┌──────────▼───────────┐
        │ Verificar con API    │
        │ de Plataforma (OAuth)│
        │ o Validar Email/Pass │
        └──────────┬───────────┘
                   │
        ┌──────────▼──────────────────┐
        │ Backend Crea/Actualiza User │
        │ + Profile                    │
        └──────────┬───────────────────┘
                   │
        ┌──────────▼──────────────────┐
        │ Genera JWT Tokens:           │
        │ - Access (30 min)            │
        │ - Refresh (7 días)           │
        └──────────┬───────────────────┘
                   │
        ┌──────────▼──────────────────────────┐
        │ Frontend Guarda en:                  │
        │ - shared_preferences (tokens)        │
        │ - Provider/ChangeNotifier            │
        │   (AuthService, user info, state)    │
        └──────────────────────────────────────┘
```

## 💼 Flujo de Oferta (Business → Creator)

```
BUSINESS (Publicador)
        │
        ▼
  ┌──────────────────┐
  │ 1. Crea Oferta   │
  │    - DRAFT       │
  └────────┬─────────┘
           │
           ▼
  ┌──────────────────┐
  │ 2. Define:       │
  │    - Requisitos  │
  │    - Contenido   │
  │    - Budget      │
  └────────┬─────────┘
           │
           ▼
  ┌──────────────────┐
  │ 3. Publica       │
  │    - ACTIVE      │
  │    - Public=true │
  └────────┬─────────┘
           │
           ▼ (visible para creadores)
        
CREATORS (Descubridores)
        │
        ▼
  ┌──────────────────┐
  │ 1. Ven Oferta    │
  │ 2. Filtran       │
  │ 3. Buscan        │
  └────────┬─────────┘
           │
           ▼
  ┌──────────────────┐
  │ 4. Aplican       │
  │    - Application │
  │    - APPLIED     │
  └────────┬─────────┘
           │
           ▼ (notificación → business)

BUSINESS (Revisa)
        │
        ▼
  ┌──────────────────┐
  │ 5. Revisa Aplic  │
  │    ACCEPTED/     │
  │    REJECTED      │
  └────────┬─────────┘
           │
    ┌──────┴──────┐
    │             │
    ▼             ▼
 ACCEPTED      REJECTED
    │             │
    ▼             ▼
  CREATE       NOTIFY
COLLAB      CREATOR
```

## 🎮 Flujo de Colaboración

```
Aplicación ACEPTADA
        │
        ▼
┌─────────────────────────────────────┐
│ COLLABORATION Creada                │
│ - Status: ACCEPTED                  │
│ - Agreed Fee: $XXX                  │
└──────┬──────────────────────────────┘
       │
       ▼ (creator propone fecha)
┌─────────────────────────────────────┐
│ 1. SCHEDULE PHASE                   │
│    - Status: SCHEDULED              │
│    - scheduled_date: 2026-03-01     │
└──────┬──────────────────────────────┘
       │
       ▼ (creator ejecuta trabajo)
┌─────────────────────────────────────┐
│ 2. EXECUTION PHASE                  │
│    - Status: VISITED                │
│    - visited_date: 2026-03-01       │
└──────┬──────────────────────────────┘
       │
       ▼ (creator sube contenido)
┌─────────────────────────────────────┐
│ 3. SUBMISSION PHASE                 │
│    - Status: CONTENT_SUBMITTED      │
│    - submitted_at: 2026-03-02       │
│    - content_urls: [...]            │
└──────┬──────────────────────────────┘
       │
       ▼ (backend analiza con IA)
┌─────────────────────────────────────┐
│ 4. AI ANALYSIS                      │
│    - ai_score: 87.5/100             │
│    - hashtags_found: 5/5            │
│    - mentions_found: 1/1            │
│    - quality_rating: 9/10           │
└──────┬──────────────────────────────┘
       │
       ▼ (business revisa/aprueba)
┌─────────────────────────────────────┐
│ 5. REVIEW PHASE                     │
│    - Status: IN_REVIEW              │
│    - reviewed_by: business_id       │
│    - reviewer_notes: "Perfecto!"    │
└──────┬──────────────────────────────┘
       │
       ▼ (ambos califican 1-5)
┌─────────────────────────────────────┐
│ 6. RATING PHASE                     │
│    - creator_rating: 5 ⭐            │
│    - business_rating: 5 ⭐          │
│    - Status: COMPLETED              │
│    - completed_date: 2026-03-03     │
└──────┬──────────────────────────────┘
       │
       ▼ (actualizar datos del creator)
┌─────────────────────────────────────┐
│ 7. POST-COMPLETION                  │
│    - completed_collaborations++     │
│    - Calculate NEW TIER             │
│    - Update karma_score             │
│    - Update rating / completion_rate│
│    - TIER UPGRADE NOTIFICATION ✨   │
└─────────────────────────────────────┘
```

## 📊 Sistema de Gamificación

```
TIER PROGRESSION
┌────────────────────────────────────────────────┐
│ Tier 0: NEWBIE                                 │
│ - 0 colaboraciones completadas                 │
│ - Karma Score: 0                               │
│ - Acceso limitado a ofertas                    │
└────────────────────────────────────────────────┘
                    │
                    ▼ (1-3 completadas)
┌────────────────────────────────────────────────┐
│ Tier 1: EXPLORER                               │
│ - 1-3 colaboraciones completadas               │
│ - Karma Score: 100-300                         │
│ - Acceso a más ofertas                         │
│ - Badge "Explorer"                             │
└────────────────────────────────────────────────┘
                    │
                    ▼ (4-10 completadas)
┌────────────────────────────────────────────────┐
│ Tier 2: PRO                                    │
│ - 4-10 colaboraciones completadas              │
│ - Karma Score: 300-650                         │
│ - Acceso prioritario a ofertas                 │
│ - Badge "Pro"                                  │
│ - Comisiones reducidas                         │
└────────────────────────────────────────────────┘
                    │
                    ▼ (11-25 completadas)
┌────────────────────────────────────────────────┐
│ Tier 3: ELITE                                  │
│ - 11-25 colaboraciones completadas             │
│ - Karma Score: 650-1100                        │
│ - Acceso a ofertas premium                     │
│ - Badge "Elite"                                │
│ - Support prioritario                          │
└────────────────────────────────────────────────┘
                    │
                    ▼ (26-50 completadas)
┌────────────────────────────────────────────────┐
│ Tier 4: MASTER                                 │
│ - 26-50 colaboraciones completadas             │
│ - Karma Score: 1100-2000                       │
│ - Acceso a ofertas VIP                         │
│ - Badge "Master"                               │
│ - Dedicated account manager                    │
└────────────────────────────────────────────────┘
                    │
                    ▼ (50+ completadas)
┌────────────────────────────────────────────────┐
│ Tier 5: LEGEND                                 │
│ - 50+ colaboraciones completadas               │
│ - Karma Score: 2000+                           │
│ - VIP treatment                                │
│ - Badge "Legend"                               │
│ - Featured creator                             │
└────────────────────────────────────────────────┘
```

## 🤖 Análisis de Contenido (AI)

```
Creator sube contenido
        │
        ▼
┌─────────────────────────┐
│ 1. URL del contenido    │
│    (foto/video)         │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│ 2. Backend descarga     │
│    archivo              │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│ 3. Envia a OpenAI Vision│
│    + Requisitos del     │
│    offer                │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│ 4. OpenAI retorna análisis:         │
│    - Hashtags encontrados           │
│    - Menciones encontradas          │
│    - Calidad visual (1-10)          │
│    - Relevancia (1-10)              │
│    - Cumplimiento (%)               │
│    - Sugerencias mejora             │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│ 5. Backend calcula AI_SCORE:        │
│    (compliance*0.5 +                │
│     quality*0.25 +                  │
│     relevance*0.25)                 │
│                                     │
│    Score: 0-100                     │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│ 6. Resultado guardado en:           │
│    - submission.ai_score            │
│    - submission.ai_analysis         │
│    - submission.status = UNDER_REVIEW
└────────┬────────────────────────────┘
         │
         ▼ (business revisa)
┌─────────────────────────────────────┐
│ 7. Business puede:                  │
│    - Aprobar (APPROVED)             │
│    - Rechazar (REJECTED)            │
│    - Solicitar revision             │
└─────────────────────────────────────┘
```

## 💬 Flujo de Notificaciones

```
Backend Events
    │
    ├─► Nueva aplicación recibida
    │   └─► Notificar Business
    │
    ├─► Aplicación aceptada
    │   └─► Notificar Creator
    │
    ├─► Aplicación rechazada
    │   └─► Notificar Creator
    │
    ├─► Colaboración agendada
    │   └─► Notificar ambos
    │
    ├─► Contenido enviado
    │   └─► Notificar Business
    │
    ├─► Tier ascenso
    │   └─► Notificar Creator
    │
    └─► Disputa abierta
        └─► Notificar Support

Guardar en DB (notifications)
    │
    ▼
Frontend obtiene
    │
    ├─► GET /api/v1/notifications
    ├─► PATCH /api/v1/notifications/{id}/read
    └─► WebSocket (tiempo real - próximo)
```

## 📱 Componentes Frontend Conectados (Flutter)

```
Frontend Structure → Backend Endpoints

lib/features/onboarding/screens/
├── welcome_screen.dart → Pantalla inicial
├── login_screen.dart → POST /auth/login
├── select_type_screen.dart → Selección creator/business
├── location_screen.dart → Selección país (Peru, UAE, Italy)
├── connect_instagram_screen.dart → OAuth Instagram flow
├── categories_screen.dart → GET /categories
├── profile_setup_screen.dart → PATCH /users/me
└── success_screen.dart → Finalización onboarding

lib/features/ (Main App Screens)
├── home/screens/
│   └── home_screen.dart → GET /offers + POST /offers (if business)
├── search/screens/
│   └── search_screen.dart → GET /offers?category=...&search=...
├── collabs/screens/
│   └── collabs_screen.dart → GET /collaborations?status=...
├── offers/screens/
│   └── offer_detail_screen.dart → GET /offers/{id} + POST /applications
├── profile/screens/
│   └── profile_screen.dart → GET /users/me + GET /users/{id}
├── notifications/screens/
│   └── notifications_screen.dart → GET /notifications
└── auth/screens/
    └── oauth_connect_screen.dart → OAuth platforms (IG, TikTok, YT)

lib/core/
├── router/
│   └── app_router.dart → go_router (declarative routing)
│       ├── /onboarding → WelcomeScreen
│       ├── /home → MainShell (tab 0)
│       ├── /search → MainShell (tab 1)
│       ├── /collabs → MainShell (tab 2)
│       ├── /notifications → MainShell (tab 3)
│       ├── /profile → MainShell (tab 4)
│       └── /offer/:id → OfferDetailScreen
│
├── services/ (Provider State Management)
│   ├── auth_service.dart → ChangeNotifier
│   │   ├── AuthStatus: initial, loading, authenticated, error
│   │   ├── login(email, password) → POST /auth/login
│   │   ├── loginWithSocial(platform) → OAuth flow
│   │   ├── connectSocialAccount(platform) → OAuth connect
│   │   └── completeOnboarding() → PATCH /users/me
│   ├── offers_service.dart → ChangeNotifier
│   │   ├── fetchOffers() → GET /offers
│   │   ├── searchOffers(query, filters) → GET /offers?...
│   │   └── applyToOffer(offerId) → POST /applications
│   └── collabs_service.dart → ChangeNotifier
│       ├── fetchCollabs() → GET /collaborations
│       └── updateCollabStatus() → PATCH /collaborations/{id}
│
├── models/
│   ├── user_model.dart → User, UserProfile
│   ├── tier_model.dart → Tier (Newbie → Legend)
│   └── social_account_model.dart → SocialAccount, SocialPlatform
│
└── widgets/
    ├── gradient_button.dart → Botón estilizado
    ├── gradient_background.dart → Fondo con gradientes
    ├── influfinder_logo.dart → Logo de la app
    └── main_shell.dart → Bottom Navigation (5 tabs)

lib/main.dart
└── MultiProvider setup
    ├── AuthService
    ├── OffersService
    └── CollabsService
```

### 🔧 Tecnologías Flutter

**Navegación:**
- `go_router` v14.6.2 - Routing declarativo

**State Management:**
- `provider` v6.1.2 - Pattern ChangeNotifier

**Storage:**
- `shared_preferences` v2.3.4 - Tokens JWT, configuración local

**UI/UX:**
- `google_fonts` v6.2.1 - Tipografía
- `lucide_icons` v0.257.0 - Iconografía
- `flutter_animate` v4.5.0 - Animaciones
- `cached_network_image` v3.4.1 - Imágenes optimizadas

**OAuth/URLs:**
- `url_launcher` v6.3.1 - Abrir URLs externas (OAuth callbacks)

---

**Arquitectura completa, modular y escalable** ✅
