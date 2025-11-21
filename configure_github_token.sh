#!/bin/bash

# TheCookFlow - Configurador de Token GitHub
# Configura automáticamente el token para sincronización

echo "🔐 Configurador de Token GitHub - TheCookFlow"
echo "============================================="

if [ -z "$1" ]; then
    echo "❌ Error: Debes proporcionar el token como parámetro"
    echo ""
    echo "📋 Uso correcto:"
    echo "   ./configure_github_token.sh TU_TOKEN_GITHUB"
    echo ""
    echo "🔗 Para obtener tu token:"
    echo "   1. Ve a: https://github.com/settings/tokens"
    echo "   2. Generate new token (classic)"
    echo "   3. Marca solo: 'repo'"
    echo "   4. Copia el token y úsalo aquí"
    exit 1
fi

TOKEN="$1"
REPO_BASE_URL="github.com/RUPERDFN/thecookflow20playstore.git"
NEW_URL="https://$TOKEN@$REPO_BASE_URL"

echo "🔧 Configurando token en sync_android_now.sh..."

# Crear backup del script original
cp sync_android_now.sh sync_android_now.sh.backup

# Reemplazar la URL en el script con el token
sed -i "s|TARGET_REPO=\"https://github.com/RUPERDFN/thecookflow20playstore.git\"|TARGET_REPO=\"$NEW_URL\"|g" sync_android_now.sh

if [ $? -eq 0 ]; then
    echo "✅ Token configurado correctamente"
    echo "💾 Backup creado: sync_android_now.sh.backup"
    echo ""
    echo "🚀 ¡Ahora puedes ejecutar la sincronización!"
    echo "   ./sync_android_now.sh"
    echo ""
    echo "🔒 Seguridad:"
    echo "   - Token guardado localmente solo en Replit"
    echo "   - Revócalo desde GitHub cuando no lo necesites"
else
    echo "❌ Error configurando token"
    exit 1
fi