#!/bin/bash

# TheCookFlow - Configurar Token GitHub de forma segura
# Configura GITHUB_PERSONAL_ACCESS_TOKEN como variable de entorno

echo "🔐 Configuración Segura de Token GitHub"
echo "======================================="

if [ -z "$1" ]; then
    echo "❌ Uso: $0 TU_TOKEN_GITHUB"
    echo ""
    echo "📋 Para obtener tu token:"
    echo "   1. Ve a: https://github.com/settings/tokens"
    echo "   2. Generate new token (classic)"  
    echo "   3. Marca: 'repo' (control de repositorios)"
    echo "   4. Copia el token y ejecútalo así:"
    echo "      $0 ghp_tu_token_aqui"
    echo ""
    exit 1
fi

TOKEN="$1"

# Validar formato básico del token
if [[ ! $TOKEN =~ ^ghp_[a-zA-Z0-9]{36}$ ]]; then
    echo "⚠️  Advertencia: El token no parece tener el formato correcto"
    echo "   Los tokens de GitHub suelen verse así: ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
    echo ""
    read -p "¿Continuar de todas formas? (y/N): " confirm
    if [[ ! $confirm =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo "🔧 Configurando variable de entorno..."

# Crear archivo de configuración
cat > ~/.github_env << EOF
# TheCookFlow - Token GitHub para sincronización automática
export GITHUB_PERSONAL_ACCESS_TOKEN="$TOKEN"
EOF

# Agregar al bashrc si no existe
if ! grep -q "source ~/.github_env" ~/.bashrc 2>/dev/null; then
    echo "source ~/.github_env" >> ~/.bashrc
    echo "📝 Agregado a ~/.bashrc para persistir entre sesiones"
fi

# Cargar en sesión actual
source ~/.github_env

echo ""
echo "✅ Token configurado correctamente!"
echo "🔒 Guardado de forma segura en: ~/.github_env"
echo ""
echo "🧪 Probando configuración..."

if [ -n "$GITHUB_PERSONAL_ACCESS_TOKEN" ]; then
    echo "✅ Variable GITHUB_PERSONAL_ACCESS_TOKEN configurada"
    echo ""
    echo "🚀 ¡Ya puedes ejecutar la sincronización!"
    echo "   ./sync_android_now.sh"
    echo ""
    echo "🔄 Para sincronización automática continua:"
    echo "   ./start_auto_sync.sh"
else
    echo "❌ Error configurando la variable"
    exit 1
fi