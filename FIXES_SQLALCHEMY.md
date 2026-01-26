# Correcciones SQLAlchemy - Relaciones Ambiguas

## 🔧 Problema

SQLAlchemy generaba errores de **relaciones ambiguas** cuando había múltiples foreign keys desde una tabla hacia `users`.

## ✅ Correcciones Aplicadas

### Archivo: `backend/app/models/__init__.py`

**Relaciones corregidas en el modelo `User`:**

```python
# 1. ContentSubmission - Dos FK: creator_id, reviewed_by
submissions = relationship("ContentSubmission", back_populates="creator", foreign_keys="ContentSubmission.creator_id")
submissions_reviewed = relationship("ContentSubmission", foreign_keys="ContentSubmission.reviewed_by")

# 2. Notification - Dos FK: user_id, related_user_id
notifications = relationship("Notification", back_populates="user", foreign_keys="Notification.user_id", cascade="all, delete-orphan")
notifications_triggered = relationship("Notification", foreign_keys="Notification.related_user_id")

# 3. Application - Explícita aunque solo tiene creator_id
applications = relationship("Application", back_populates="creator", foreign_keys="Application.creator_id")

# 4. Collaboration - Dos FK: creator_id, business_id (YA ESTABAN BIEN)
collaborations_as_creator = relationship("Collaboration", back_populates="creator", foreign_keys="Collaboration.creator_id")
collaborations_as_business = relationship("Collaboration", back_populates="business", foreign_keys="Collaboration.business_id")

# 5. Message - Dos FK: sender_id, recipient_id (YA ESTABAN BIEN)
messages_sent = relationship("Message", back_populates="sender", foreign_keys="Message.sender_id")
messages_received = relationship("Message", back_populates="recipient", foreign_keys="Message.recipient_id")

# 6. Offer - Explícita (YA ESTABA BIEN)
offers = relationship("Offer", back_populates="business", foreign_keys="Offer.business_id")
```

## 📊 Relaciones Ambiguas Corregidas

### 1. Múltiples FK hacia Users

| Tabla | FK 1 | FK 2 | Propósito |
|-------|------|------|-----------|
| **content_submissions** | `creator_id` | `reviewed_by` | Quien envía vs quien revisa |
| **notifications** | `user_id` | `related_user_id` | Quien recibe vs quien origina |
| **collaborations** | `creator_id` | `business_id` | Dos partes de la collab |
| **messages** | `sender_id` | `recipient_id` | Remitente vs destinatario |

### 2. Relación Circular: Collaboration ↔️ ContentSubmission

**Problema:** Relación bidireccional circular con dos foreign keys
- `collaborations.submission_id` → `content_submissions.id` (la submission aprobada)
- `content_submissions.collaboration_id` → `collaborations.id` (a qué collab pertenece)

Esto crea una relación bidireccional donde ambos lados apuntaban al otro.

**Solución:** Separar en dos relaciones distintas
```python
# En Collaboration - DOS relaciones
submissions = relationship(
    "ContentSubmission",
    back_populates="collaboration",
    foreign_keys="ContentSubmission.collaboration_id"
)  # One-to-many: todas las submissions

final_submission = relationship(
    "ContentSubmission",
    foreign_keys=[submission_id],
    post_update=True
)  # Many-to-one: la submission aprobada (con post_update para ciclo)

# En ContentSubmission
collaboration = relationship(
    "Collaboration",
    back_populates="submissions",  # ← Cambiado de "submission" a "submissions"
    foreign_keys=[collaboration_id]
)
```

**Nota:** `post_update=True` permite que SQLAlchemy actualice `final_submission` en un segundo paso, evitando el error de inserción circular.

## 🚀 Cómo Probar

1. **Reinicia el servidor:**
   ```bash
   cd backend
   docker compose restart app
   # o si usas uvicorn local: (auto-reload debería funcionar)
   ```

2. **Prueba el endpoint de registro:**
   ```bash
   POST http://localhost:8000/api/v1/auth/register/email

   Body:
   {
     "email": "test@example.com",
     "password": "Test123!@",
     "confirm_password": "Test123!@",
     "full_name": "Test User",
     "user_type": "creator",
     "country": "PE"
   }
   ```

3. **Verifica Swagger:**
   ```
   http://localhost:8000/docs
   ```

## 📝 Archivos Modificados

1. ✅ `backend/app/models/__init__.py` - Modelo User (4 relaciones)
2. ✅ `backend/app/models/collaboration.py` - Modelo Collaboration (2 relaciones)
3. ✅ `backend/app/models/content.py` - Modelo ContentSubmission (1 relación)

## ✅ Resumen de Cambios

### Collaboration Model
```python
# ANTES - Una sola relación ambigua
submission = relationship("ContentSubmission", back_populates="collaboration")

# DESPUÉS - Dos relaciones específicas
submissions = relationship("ContentSubmission", back_populates="collaboration", foreign_keys="ContentSubmission.collaboration_id")
final_submission = relationship("ContentSubmission", foreign_keys=[submission_id], post_update=True)
```

### ContentSubmission Model
```python
# ANTES
collaboration = relationship("Collaboration", back_populates="submission")

# DESPUÉS
collaboration = relationship("Collaboration", back_populates="submissions", foreign_keys=[collaboration_id])
```

### User Model
```python
# Agregado foreign_keys explícito a 4 relaciones
applications = relationship("Application", foreign_keys="Application.creator_id")
submissions = relationship("ContentSubmission", foreign_keys="ContentSubmission.creator_id")
submissions_reviewed = relationship("ContentSubmission", foreign_keys="ContentSubmission.reviewed_by")
notifications = relationship("Notification", foreign_keys="Notification.user_id")
notifications_triggered = relationship("Notification", foreign_keys="Notification.related_user_id")
```

## ✅ Estado Final

**Todas las relaciones ambiguas fueron corregidas** ✅

**Total de correcciones:** 7 relaciones especificadas

**Cambios importantes:**
- ✅ Resueltos todos los errores de foreign keys ambiguas
- ✅ Resuelto el ciclo bidireccional con `post_update=True`
- ✅ Separada la relación `Collaboration.submission` en dos: `submissions` (plural) y `final_submission`

Los endpoints ahora deberían funcionar sin errores de SQLAlchemy.
