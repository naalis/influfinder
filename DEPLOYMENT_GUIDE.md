# 🚀 Deployment & Production Guide - Influfinder

## Opciones de Deployment

```
┌─────────────────────────────────────────────────────────────┐
│                 DEPLOYMENT OPTIONS                          │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│ 1. Railway (Recomendado - Fácil)                            │
│    - Deploy desde GitHub                                     │
│    - PostgreSQL incluido                                     │
│    - Costo: ~$5-20/mes                                       │
│                                                               │
│ 2. DigitalOcean App Platform                                │
│    - Deploy desde GitHub                                     │
│    - Escalable                                               │
│    - Costo: ~$10-50/mes                                      │
│                                                               │
│ 3. AWS (ECS + RDS + ElastiCache)                            │
│    - Enterprise-grade                                        │
│    - Muy escalable                                           │
│    - Costo: ~$50-200+/mes                                    │
│                                                               │
│ 4. Heroku (Legacy)                                          │
│    - Ya no tiene free tier                                   │
│    - Costo: ~$7+/mes por dyno                               │
│                                                               │
│ 5. Self-hosted (VPS)                                        │
│    - Máximo control                                          │
│    - Más trabajo de mantenimiento                            │
│    - Costo: ~$5-20/mes (DigitalOcean, Linode)              │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚂 Option 1: Railway (Recommended)

### Step 1: Preparar repositorio

```bash
cd /Users/jesusacostazamora/inlfufinder

# Crear archivo railway.json en raíz
cat > railway.json << 'EOF'
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "dockerfile",
    "dockerfile": "backend/Dockerfile"
  },
  "deploy": {
    "startCommand": "uvicorn app.main:app --host 0.0.0.0 --port $PORT",
    "restartPolicyMaxRetries": 5
  }
}
EOF

# Crear .env para Railway
cat > .env.railway << 'EOF'
# Railway asigna automáticamente DATABASE_URL y REDIS_URL
# Solo configura lo que falta

JWT_SECRET_KEY=your_super_secret_key_here
JWT_ALGORITHM=HS256

# OAuth
INSTAGRAM_CLIENT_ID=your_id
INSTAGRAM_CLIENT_SECRET=your_secret
FACEBOOK_CLIENT_ID=your_id
FACEBOOK_CLIENT_SECRET=your_secret
TIKTOK_CLIENT_ID=your_id
TIKTOK_CLIENT_SECRET=your_secret
GOOGLE_CLIENT_ID=your_id
GOOGLE_CLIENT_SECRET=your_secret

# Email
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password

# OpenAI
OPENAI_API_KEY=sk-your_key

DEBUG=False
CORS_ORIGINS=https://influfinder.com,https://www.influfinder.com
EOF

git add .
git commit -m "Add Railway deployment config"
git push
```

### Step 2: Crear cuenta en Railway

1. Ir a [railway.app](https://railway.app)
2. Sign up con GitHub
3. Autorizar Railway a acceder a tus repos

### Step 3: Crear proyecto en Railway

```bash
# Instalar CLI de Railway
npm install -g @railway/cli

# Login
railway login

# Crear proyecto
railway init

# Seleccionar repositorio
# Seleccionar rama (main)
```

### Step 4: Configurar variables de entorno

En Railway Dashboard:

1. Ir a Project Settings
2. Variables → Add Variable
3. Copiar del archivo `.env.railway`

### Step 5: Conectar Bases de Datos

Railway conecta automáticamente PostgreSQL y Redis:

```bash
# Railway crea automáticamente:
# - DATABASE_URL=postgresql://user:pass@host:port/db
# - REDIS_URL=redis://default:pass@host:port
```

### Step 6: Deploy

```bash
railway up
```

O hacer push a GitHub y Railway hace deploy automático:

```bash
git push origin main
```

### Verificar Deploy

```bash
# Ver logs
railway logs

# URL de la API
railway domain
# Resultado: https://influfinder-prod.railway.app

# Test
curl https://influfinder-prod.railway.app/health
```

---

## 🌊 Option 2: DigitalOcean App Platform

### Step 1: Crear cuenta

1. Ir a [digitalocean.com](https://digitalocean.com)
2. Sign up (obtén $100 crédito con referencia)
3. Crear App Platform

### Step 2: Conectar GitHub

```
1. Apps → Create App
2. GitHub → Authorize
3. Seleccionar repo
4. Seleccionar rama (main)
```

### Step 3: Configurar backend

```yaml
# app.yaml que DigitalOcean crea automáticamente

services:
  backend:
    build_command: cd backend && pip install -r requirements.txt
    dockerfile_path: backend/Dockerfile
    github:
      branch: main
      repo: usuario/inlfufinder
    health_check:
      http_path: /health
    http_port: 8000
    name: influfinder-backend
    source_dir: /
    envs:
      - key: DATABASE_URL
        scope: RUN_AND_BUILD_TIME
        value: ${db.DATABASE_URL}
      - key: REDIS_URL
        scope: RUN_AND_BUILD_TIME
        value: ${cache.DATABASE_URL}
      - key: JWT_SECRET_KEY
        scope: RUN_AND_BUILD_TIME
        value: ${JWT_SECRET_KEY}

databases:
  - engine: PG
    name: influfinder-db
    version: "15"

  - engine: REDIS
    name: influfinder-cache
    version: "7"
```

### Step 4: Agregar variables

En DigitalOcean Dashboard:

```
App → Settings → Environment Variables

JWT_SECRET_KEY=your_key
INSTAGRAM_CLIENT_ID=...
INSTAGRAM_CLIENT_SECRET=...
... etc
```

### Step 5: Deploy

```
Click "Deploy"
```

DigitalOcean deployará automáticamente:
- Backend (uvicorn)
- PostgreSQL 15
- Redis 7

---

## ☁️ Option 3: AWS Deployment

### Architecture

```
┌──────────────────────────────────────────────────┐
│              AWS Resources                        │
├──────────────────────────────────────────────────┤
│                                                   │
│  ┌─────────────────────────────────────────┐    │
│  │        CloudFront (CDN)                 │    │
│  │  + SSL Certificate (ACM)                │    │
│  │  + Cache Static Files                   │    │
│  └────────────────────┬────────────────────┘    │
│                       │                          │
│  ┌────────────────────▼────────────────────┐    │
│  │      Application Load Balancer          │    │
│  │  - Health Checks                        │    │
│  │  - SSL Termination                      │    │
│  └────────────────────┬────────────────────┘    │
│                       │                          │
│  ┌────────────────────▼────────────────────┐    │
│  │      ECS Fargate (Backend)              │    │
│  │  - 2-4 Tasks (auto-scaling)             │    │
│  │  - Docker containers                    │    │
│  │  - Auto-restart on failure              │    │
│  └────────────────────┬────────────────────┘    │
│                       │                          │
│  ┌────────────────────▼────────────────────┐    │
│  │  RDS PostgreSQL (Multi-AZ)              │    │
│  │  - Automated backups                    │    │
│  │  - Read replicas                        │    │
│  │  - Encrypted storage                    │    │
│  └─────────────────────────────────────────┘    │
│                                                   │
│  ┌─────────────────────────────────────────┐    │
│  │  ElastiCache Redis                      │    │
│  │  - High availability                    │    │
│  │  - Automatic failover                   │    │
│  └─────────────────────────────────────────┘    │
│                                                   │
│  ┌─────────────────────────────────────────┐    │
│  │  S3 (File Storage)                      │    │
│  │  - CloudFront distribution              │    │
│  │  - Versioning enabled                   │    │
│  └─────────────────────────────────────────┘    │
│                                                   │
│  ┌─────────────────────────────────────────┐    │
│  │  CloudWatch (Monitoring)                │    │
│  │  - Logs                                 │    │
│  │  - Metrics                              │    │
│  │  - Alarms                               │    │
│  └─────────────────────────────────────────┘    │
│                                                   │
└──────────────────────────────────────────────────┘
```

### Step 1: Crear ECR Repository

```bash
# Instalar AWS CLI
brew install awscli

# Configure AWS credentials
aws configure

# Crear ECR repo
aws ecr create-repository --repository-name influfinder-backend

# Build y push image
cd backend
docker build -t influfinder-backend .

# Tag
docker tag influfinder-backend:latest \
  123456789.dkr.ecr.us-east-1.amazonaws.com/influfinder-backend:latest

# Push
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin \
  123456789.dkr.ecr.us-east-1.amazonaws.com

docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/influfinder-backend:latest
```

### Step 2: Crear RDS PostgreSQL

```bash
aws rds create-db-instance \
  --db-instance-identifier influfinder-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --engine-version 15.3 \
  --allocated-storage 20 \
  --storage-type gp2 \
  --storage-encrypted \
  --master-username influfinder \
  --master-user-password YourSecurePassword123! \
  --backup-retention-period 30 \
  --multi-az \
  --no-publicly-accessible
```

### Step 3: Crear ElastiCache Redis

```bash
aws elasticache create-cache-cluster \
  --cache-cluster-id influfinder-redis \
  --cache-node-type cache.t3.micro \
  --engine redis \
  --engine-version 7.0 \
  --num-cache-nodes 1 \
  --port 6379
```

### Step 4: Crear ECS Cluster

```bash
# Crear cluster
aws ecs create-cluster --cluster-name influfinder

# Crear task definition
aws ecs register-task-definition \
  --cli-input-json file://task-definition.json
```

**task-definition.json:**

```json
{
  "family": "influfinder-backend",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "containerDefinitions": [
    {
      "name": "influfinder-backend",
      "image": "123456789.dkr.ecr.us-east-1.amazonaws.com/influfinder-backend:latest",
      "portMappings": [
        {
          "containerPort": 8000,
          "hostPort": 8000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "DATABASE_URL",
          "value": "postgresql+asyncpg://influfinder:pass@rds-endpoint:5432/influfinder"
        },
        {
          "name": "REDIS_URL",
          "value": "redis://elasticache-endpoint:6379/0"
        },
        {
          "name": "DEBUG",
          "value": "False"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/influfinder-backend",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

### Step 5: Crear ALB

```bash
# Crear ALB
aws elbv2 create-load-balancer \
  --name influfinder-alb \
  --subnets subnet-12345 subnet-67890 \
  --security-groups sg-12345 \
  --scheme internet-facing \
  --type application

# Crear target group
aws elbv2 create-target-group \
  --name influfinder-targets \
  --protocol HTTP \
  --port 8000 \
  --vpc-id vpc-12345 \
  --health-check-path /health \
  --health-check-interval-seconds 30 \
  --health-check-timeout-seconds 5 \
  --healthy-threshold-count 2 \
  --unhealthy-threshold-count 2
```

### Costo Estimado AWS

| Servicio | Costo |
|----------|-------|
| ECS Fargate | $0.015/hora (2 tasks) ≈ $10-20/mes |
| RDS PostgreSQL (t3.micro) | ≈ $15-20/mes |
| ElastiCache Redis (t3.micro) | ≈ $10-15/mes |
| ALB | ≈ $15-20/mes |
| Data Transfer | ≈ $5-10/mes |
| **Total** | **≈ $60-85/mes** |

---

## 🔒 Security Checklist

### SSL/HTTPS

```bash
# Railway
# ✅ Automático con Railway domain

# DigitalOcean
# ✅ Automático con Let's Encrypt

# AWS
# Crear certificado ACM:
aws acm request-certificate \
  --domain-name influfinder.com \
  --validation-method DNS
```

### Database Security

```bash
# ✅ Encrypted in transit (SSL)
# ✅ Encrypted at rest (KMS)
# ✅ VPC isolation
# ✅ No public access
# ✅ Strong passwords
# ✅ Regular backups
# ✅ Read replicas
```

### API Security

```python
# app/main.py
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware

app.add_middleware(TrustedHostMiddleware, allowed_hosts=["influfinder.com"])

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://influfinder.com",
        "https://www.influfinder.com"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Environment Variables

```bash
# NUNCA commit .env files
# ✅ Usar .env.example como template
# ✅ Guardar secrets en:
#    - Railway: Dashboard variables
#    - DigitalOcean: App settings
#    - AWS Secrets Manager
#    - GitHub Secrets (para CI/CD)

git add .gitignore
cat >> .gitignore << 'EOF'
.env
.env.local
.env.production
*.pem
*.key
EOF
```

### Monitoring & Alerts

```yaml
# CloudWatch Alarms
- High CPU (>80%)
- High Memory (>80%)
- Database errors
- API errors (500+)
- High latency (>1s)
- RDS backup failures
```

---

## 📊 Performance Optimization

### Database

```python
# app/database.py
engine = create_async_engine(
    DATABASE_URL,
    echo=False,
    pool_size=20,              # Connection pool
    max_overflow=10,           # Extra connections
    pool_pre_ping=True,        # Test connections
    pool_recycle=3600,         # Recycle every hour
)
```

### Caching

```python
# Cache offerings for 1 hour
@router.get("/offers")
async def list_offers(
    db: AsyncSession = Depends(get_db),
    cache: redis.Redis = Depends(get_cache)
):
    cache_key = "offers:list:recent"
    
    # Try cache first
    cached = await cache.get(cache_key)
    if cached:
        return json.loads(cached)
    
    # Query DB
    offers = await db.execute(select(Offer))
    result = offers.scalars().all()
    
    # Store in cache
    await cache.setex(cache_key, 3600, json.dumps(result))
    return result
```

### API Rate Limiting

```bash
# Install slowapi
pip install slowapi

# app/main.py
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter

# Apply to routes
@app.get("/offers")
@limiter.limit("100/minute")
async def list_offers(request: Request):
    ...
```

### CDN for Static Files

```
Frontend uploads → S3
CloudFront caches
Serve from nearest edge
```

---

## 🚨 Disaster Recovery

### Backup Strategy

```
Database:
- ✅ Daily automated backups (30-day retention)
- ✅ Read replicas for failover
- ✅ Monthly manual backups to S3

Cache:
- Redis data automatically replicated
- Can rebuild from database

Code:
- GitHub as primary backup
- Automated backups via GitHub

Secrets:
- AWS Secrets Manager / Vault
- Encrypted at rest
```

### Rollback Plan

```bash
# If deployment goes wrong:

# 1. Check previous image
docker images | grep influfinder

# 2. Rollback to previous version
# Railway: Click "Revert Deployment"
# AWS: Update ECS task definition to previous image

# 3. Monitor health
railway logs
aws logs tail /ecs/influfinder-backend
```

---

## 📈 Scaling Strategy

### Horizontal Scaling

```
Current: 1 instance
├── 2-4 tasks (ECS auto-scaling)
├── Read replicas for database
└── Redis cluster for high availability

Load Distribution:
- ALB/NLB distributes traffic
- Auto-scaling triggers at 70% CPU
- Min 2 tasks, max 10 tasks
```

### Database Scaling

```
PostgreSQL:
- Primary: handle writes
- Read replicas: handle reads
- Connection pooling (PgBouncer)

Redis:
- Redis cluster for horizontal scaling
- Sentinel for high availability
```

---

## 💰 Cost Optimization

### Development Environment

```
- Use smaller instance types
- Turn off non-essential services
- Use free tier where possible

Estimated: $10-20/month
```

### Production Environment (Recommended)

```
Railway:
- Recommended for startups
- Affordable: $5-20/month
- Auto-scaling included

DigitalOcean:
- Good balance: $30-50/month
- Full control

AWS:
- Enterprise-grade: $60-200+/month
- Most expensive but most powerful
```

---

## ✅ Pre-Deployment Checklist

- [ ] All tests passing
- [ ] Code reviewed and merged to main
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] SSL certificate configured
- [ ] CORS origins updated
- [ ] Monitoring/logging configured
- [ ] Backups enabled
- [ ] Security group rules configured
- [ ] Health checks working
- [ ] Load testing done
- [ ] Documentation updated

---

## 🎯 Next Steps

1. **Choose deployment option** (Railway recommended)
2. **Set up staging environment** (test before prod)
3. **Configure CI/CD** (auto-deploy on push)
4. **Set up monitoring** (CloudWatch, Datadog, etc.)
5. **Configure logging** (ELK stack, CloudWatch, etc.)
6. **Plan scaling strategy** (as traffic grows)
7. **Set up disaster recovery** (backups, replicas)
8. **Monitor costs** (monthly reviews)

---

**¡Listo para producción!** 🚀
