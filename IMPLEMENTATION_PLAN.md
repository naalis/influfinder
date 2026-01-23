# InfluFinder - Implementation Plan

> Plan actualizado basado en análisis de UI/UX de "The Secret Society"

---

## TOP 10 MEJORAS PRIORITARIAS

### Fase 1: Onboarding y Autenticación (Semana actual)

| # | Mejora | Descripción | Estado |
|---|--------|-------------|--------|
| 1 | **Bifurcación 3 roles** | Usuario vs Empresa vs Agencia en select-type | 🔄 En progreso |
| 2 | **YouTube Integration** | Añadir YouTube como red social verificable (TSS no lo tiene) | ⏳ Pendiente |
| 3 | **Google Sign-In** | Añadir Google además de Facebook/Apple | ⏳ Pendiente |

### Fase 2: Perfil y Verificación

| # | Mejora | Descripción | Estado |
|---|--------|-------------|--------|
| 4 | **Media Kit descargable** | Portfolio profesional desde el perfil | ⏳ Pendiente |
| 5 | **Verificación de autenticidad** | Badge verificado con proceso de validación | ⏳ Pendiente |
| 6 | **Profile Health Score** | Métrica visual de completitud del perfil | ⏳ Pendiente |

### Fase 3: Matching y Búsqueda

| # | Mejora | Descripción | Estado |
|---|--------|-------------|--------|
| 7 | **Smart Match Score** | 0-100% compatibilidad en cada oportunidad | ⏳ Pendiente |
| 8 | **Filtros por presupuesto** | Rango de pago en búsqueda de campañas | ⏳ Pendiente |

### Fase 4: Gestión de Campañas

| # | Mejora | Descripción | Estado |
|---|--------|-------------|--------|
| 9 | **Timeline de workflow** | Visual del progreso por campaña | ⏳ Pendiente |
| 10 | **Sistema de pagos** | Estados visibles: Pendiente → Procesando → Pagado | ⏳ Pendiente |

---

## DETALLE DE IMPLEMENTACIÓN

### 1. Bifurcación 3 Roles (`/onboarding/select-type`)

**Archivo:** `frontend/src/app/onboarding/select-type/page.tsx`

```
Opciones:
├── Creador/Influencer (cyan)
│   └── → /onboarding/login
├── Empresa/Marca (magenta)
│   └── → /onboarding/business/login
└── Agencia (purple) [NUEVO]
    └── → /onboarding/agency/login
```

**UI Inspirada en TSS:**
- Fondo con video/imagen en loop
- Cards con gradientes y hover effects
- FAB de chatbot flotante
- Botón CTA gradient

---

### 2. YouTube Integration

**Archivos a modificar:**
- `frontend/src/app/onboarding/connect-instagram/page.tsx` → Renombrar a `connect-socials`
- Añadir APIs: YouTube Data API v3

**Redes sociales soportadas:**
- Instagram (existente)
- TikTok (existente en TSS)
- YouTube (diferenciador vs TSS)

---

### 3. Smart Match Score

**Algoritmo propuesto:**
```typescript
interface MatchScore {
  total: number; // 0-100
  breakdown: {
    categoryMatch: number;    // 0-30 pts
    audienceOverlap: number;  // 0-25 pts
    engagementRate: number;   // 0-20 pts
    locationMatch: number;    // 0-15 pts
    budgetFit: number;        // 0-10 pts
  }
}
```

---

### 4. Sistema de Pagos

**Estados de pago:**
```
PENDING → IN_REVIEW → APPROVED → PROCESSING → PAID
```

**Integraciones sugeridas:**
- Stripe Connect (para payouts a creadores)
- Mercado Pago (LATAM)

---

### 5. Media Kit

**Componentes del kit:**
- Foto de perfil HD
- Bio y categorías
- Métricas de redes (followers, engagement)
- Rate card (tarifas)
- Portfolio de trabajos anteriores
- Exportable como PDF

---

## ESTRUCTURA DE CARPETAS PROPUESTA

```
frontend/src/
├── app/
│   ├── onboarding/
│   │   ├── select-type/          # ✅ Actualizado (3 opciones)
│   │   ├── login/                # Creadores
│   │   ├── business/             # Empresas
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── agency/               # 🆕 Agencias
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── connect-socials/      # 🔄 Renombrado (IG + TikTok + YT)
│   │   └── profile-setup/
│   ├── dashboard/
│   │   ├── creator/
│   │   ├── business/
│   │   └── agency/               # 🆕
│   └── campaigns/
│       ├── [id]/
│       │   ├── timeline/         # 🆕 Workflow visual
│       │   └── deliverables/
│       └── explore/
├── components/
│   ├── ui/
│   │   ├── ChatbotFAB.tsx        # 🆕 FAB flotante
│   │   ├── MatchScoreBadge.tsx   # 🆕
│   │   └── PaymentStatus.tsx     # 🆕
│   └── profile/
│       ├── MediaKitPreview.tsx   # 🆕
│       └── ProfileHealth.tsx     # 🆕
└── lib/
    ├── matching/
    │   └── calculateScore.ts     # 🆕 Algoritmo de matching
    └── payments/
        └── stripe.ts             # 🆕
```

---

## PRÓXIMOS PASOS INMEDIATOS

1. [x] Analizar UI/UX de The Secret Society
2. [x] Crear Implementation Plan
3. [ ] **Implementar select-type con 3 opciones**
4. [ ] Crear rutas de onboarding para Agencia
5. [ ] Implementar ChatbotFAB component
6. [ ] Añadir connect-socials con YouTube

---

## REFERENCIAS DE DISEÑO

- **Paleta de colores:** Dark mode con acentos cyan/magenta/purple
- **Tipografía:** Inter + font display para "Influfinder"
- **Iconos:** Lucide React
- **Animaciones:** Framer Motion (a integrar)

---

*Última actualización: 2026-01-23*
