#!/bin/bash

# Script para generar keystore de TheCookFlow
# Válido por 27+ años para Google Play Store

echo "🔐 Generando keystore para TheCookFlow..."

# Verificar si ya existe
if [ -f "app/thecookflow-release-key.keystore" ]; then
    echo "✅ Keystore ya existe en: app/thecookflow-release-key.keystore"
    echo "🔑 Datos del keystore:"
    echo "   - Alias: thecookflow"
    echo "   - Store Password: thecookflow2025"
    echo "   - Key Password: thecookflow2025"
    exit 0
fi

# Crear directorio si no existe
mkdir -p app

# Generar keystore
keytool -genkey -v \
    -keystore app/thecookflow-release-key.keystore \
    -alias thecookflow \
    -keyalg RSA \
    -keysize 2048 \
    -validity 10000 \
    -storepass thecookflow2025 \
    -keypass thecookflow2025 \
    -dname "CN=TheCookFlow, OU=TheCookFlow Dev, O=TheCookFlow, L=Madrid, ST=Madrid, C=ES"

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 ¡KEYSTORE CREADO EXITOSAMENTE!"
    echo "📁 Ubicación: app/thecookflow-release-key.keystore"
    echo "🔐 Configuración:"
    echo "   - Store Password: thecookflow2025"
    echo "   - Key Alias: thecookflow"  
    echo "   - Key Password: thecookflow2025"
    echo "   - Validez: 27+ años"
    echo ""
    echo "✅ Listo para firmar APK/AAB para Google Play Store"
    echo "💡 Guarda estas credenciales de forma segura"
else
    echo ""
    echo "❌ Error al generar keystore"
    echo "💡 Verifica que tienes keytool instalado (viene con Java)"
fi