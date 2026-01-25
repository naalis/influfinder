#!/bin/bash

# Influfinder Backend Setup Script

echo "🚀 Influfinder Backend Setup"
echo "=================================="

# Check Python version
python_version=$(python3 --version 2>&1)
echo "✅ Python: $python_version"

# Create virtual environment
if [ ! -d "venv" ]; then
    echo "📦 Creando entorno virtual..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

echo "✅ Entorno virtual activado"

# Install dependencies
echo "📥 Instalando dependencias..."
pip install -r requirements.txt

# Setup environment
if [ ! -f ".env" ]; then
    echo "⚙️  Creando archivo .env..."
    cp .env.example .env
    echo "⚠️  Edita .env con tus configuraciones (API keys, etc)"
fi

echo ""
echo "✅ Setup completado!"
echo ""
echo "Para iniciar el servidor:"
echo ""
echo "  1. Con Docker:"
echo "     docker-compose up -d"
echo ""
echo "  2. Local:"
echo "     uvicorn app.main:app --reload"
echo ""
echo "Documentación: http://localhost:8000/docs"
echo ""
