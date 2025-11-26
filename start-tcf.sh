#!/bin/bash
# TheCookFlow API - Script de inicio

echo "🍳 Iniciando TheCookFlow API..."

# Variables de entorno por defecto
export PORT=${PORT:-3000}
export ALLOWED_ORIGINS=${ALLOWED_ORIGINS:-"http://localhost:5173,https://app.thecookflow.com,https://thecookflow.com"}
export UPLOAD_DIR=${UPLOAD_DIR:-"./uploads"}
export BILLING_PROVIDER=${BILLING_PROVIDER:-"play"}

# Cargar .env si existe
if [ -f .env ]; then
  echo "📋 Cargando variables de .env..."
  export $(cat .env | grep -v '^#' | xargs)
fi

# Crear directorio uploads si no existe
mkdir -p "$UPLOAD_DIR"

# Iniciar servidor
echo "🚀 Servidor escuchando en puerto $PORT"
node api/server/index.js
