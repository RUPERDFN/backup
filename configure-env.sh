#!/bin/bash

# Script para configurar variables de entorno en el VPS
# Ejecutar en el servidor: bash configure-env.sh

set -e

APP_DIR="/var/www/thecookflow"

# Verificar que el directorio existe antes de hacer cd
if [ ! -d "$APP_DIR" ]; then
    echo "❌ Error: El directorio $APP_DIR no existe"
    exit 1
fi

cd "$APP_DIR"

echo "🔑 Configurando variables de entorno para TheCookFlow..."

# Generar secretos seguros usando openssl
if ! command -v openssl &> /dev/null; then
    echo "❌ Error: openssl no está instalado"
    exit 1
fi

SESSION_SECRET=$(openssl rand -base64 32)
JWT_SECRET=$(openssl rand -base64 32)

echo "📝 Creando archivo .env..."

# Crear archivo .env con permisos restrictivos
touch .env
chmod 600 .env

cat > .env << EOF
# TheCookFlow Production Environment Variables
NODE_ENV=production
PORT=5000

# Database
# ⚠️ IMPORTANTE: Cambia la contraseña de la base de datos por una segura
DATABASE_URL=postgresql://thecookflow:CAMBIAR_CONTRASEÑA_AQUI@localhost:5432/thecookflow

# AI Services (CONFIGURAR CON TUS CLAVES REALES)
OPENAI_API_KEY=sk-tu-clave-openai-aqui
PERPLEXITY_API_KEY=pplx-tu-clave-perplexity-aqui

# Security (Generados automáticamente - NO CAMBIAR)
SESSION_SECRET=$SESSION_SECRET
JWT_SECRET=$JWT_SECRET

# Google Play Billing (Para la app Android)
GOOGLE_PLAY_PUBLIC_KEY=tu-clave-publica-google-play
GOOGLE_PLAY_PACKAGE_NAME=com.cookflow.app

# Domain Configuration (CAMBIAR POR TU DOMINIO)
ALLOWED_ORIGINS=https://tu-dominio.com,https://www.tu-dominio.com

# Advertising (Opcional)
VITE_ADSENSE_CLIENT_ID=ca-pub-tu-publisher-id
VITE_ENABLE_CMP=true
EOF

# Asegurar permisos restrictivos del archivo .env
chmod 600 .env

echo "✅ Archivo .env creado con secretos seguros."
echo ""
echo "🔧 CONFIGURACIÓN PENDIENTE:"
echo "1. Editar .env y agregar tus claves API reales:"
echo "   nano .env"
echo ""
echo "2. Cambiar estas variables:"
echo "   - OPENAI_API_KEY (obligatorio)"
echo "   - PERPLEXITY_API_KEY (obligatorio)"  
echo "   - ALLOWED_ORIGINS (cambiar por tu dominio)"
echo "   - GOOGLE_PLAY_PUBLIC_KEY (para Android)"
echo ""
echo "3. Iniciar la aplicación:"
echo "   pm2 start ecosystem.config.js --env production"
echo ""
echo "4. Verificar que funciona:"
echo "   curl http://localhost:5000/api/health"