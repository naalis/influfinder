# Fix: Bcrypt Password Length Error

## 🔴 Error Original

```
ValueError: password cannot be longer than 72 bytes, truncate manually if necessary (e.g. my_password[:72])
```

## 📋 Problema

Bcrypt tiene un **límite estricto de 72 bytes** para las contraseñas. Si una contraseña excede este límite, bcrypt lanza un error.

## ✅ Solución Aplicada

### 1. Truncado Automático en `hash_password`

**Archivo:** `backend/app/security.py`

```python
@staticmethod
def hash_password(password: str) -> str:
    """Hashear contraseña con bcrypt"""
    # Bcrypt tiene un límite de 72 bytes, truncar si es necesario
    password_bytes = password.encode('utf-8')[:72]
    password_truncated = password_bytes.decode('utf-8', errors='ignore')
    return pwd_context.hash(password_truncated)
```

**Por qué funciona:**
- Convierte la contraseña a bytes UTF-8
- Trunca a máximo 72 bytes
- Decodifica de vuelta a string (ignora errores de encoding)
- Hashea la contraseña truncada

### 2. Validación en el Schema

**Archivo:** `backend/app/schemas/__init__.py`

```python
class UserRegisterEmail(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=72)  # Bcrypt limit
    confirm_password: str
    # ...
```

**Cambio:** `max_length=100` → `max_length=72`

Esto previene que los usuarios envíen contraseñas más largas del límite de bcrypt desde el frontend.

## 🚀 Reiniciar Servidor

```bash
cd backend
docker compose restart app
```

## ✅ Probar

```json
POST http://localhost:8000/api/v1/auth/register/email

{
  "email": "test@example.com",
  "password": "Test123!@",
  "confirm_password": "Test123!@",
  "full_name": "Test User",
  "user_type": "creator",
  "country": "PE"
}
```

## 📝 Notas

- Bcrypt siempre ha tenido este límite de 72 bytes
- La mayoría de las contraseñas reales están muy por debajo de este límite
- El truncado automático es seguro porque cualquier contraseña >72 bytes ya es extremadamente fuerte
- Este fix previene errores sin afectar la seguridad
