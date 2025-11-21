#!/bin/bash

# Script para compilar el App Bundle (.aab) de TheCookFlow
# Los App Bundles son el formato preferido por Google Play Store

set -e

echo "🍳 Compilando TheCookFlow App Bundle (.aab)..."

# Verificar que estamos en el directorio correcto
if [ ! -f "app/build.gradle" ]; then
    echo "❌ Error: Ejecuta este script desde el directorio android/"
    exit 1
fi

# Limpiar builds anteriores
echo "🧹 Limpiando builds anteriores..."
./gradlew clean

# Generar keystore si no existe
if [ ! -f "app/thecookflow-release-key.keystore" ]; then
    echo "🔐 Generando keystore para firmar App Bundle..."
    keytool -genkey -v -keystore app/thecookflow-release-key.keystore \
            -alias thecookflow \
            -keyalg RSA \
            -keysize 2048 \
            -validity 10000 \
            -storepass thecookflow2025 \
            -keypass thecookflow2025 \
            -dname "CN=TheCookFlow, OU=Development, O=TheCookFlow, L=Madrid, S=Madrid, C=ES"
    echo "✅ Keystore generado exitosamente"
fi

# Compilar App Bundle firmado
echo "🔨 Compilando App Bundle firmado..."
./gradlew bundleRelease

# Verificar que el App Bundle se generó correctamente
BUNDLE_PATH="app/build/outputs/bundle/release/app-release.aab"
if [ -f "$BUNDLE_PATH" ]; then
    BUNDLE_SIZE=$(du -h "$BUNDLE_PATH" | cut -f1)
    echo "✅ App Bundle compilado exitosamente!"
    echo "📁 Ubicación: $BUNDLE_PATH"
    echo "📏 Tamaño: $BUNDLE_SIZE"
    
    # Copiar App Bundle a directorio de assets
    mkdir -p ../play_store_assets/
    cp "$BUNDLE_PATH" "../play_store_assets/thecookflow-v1.0.0.aab"
    echo "📋 App Bundle copiado a play_store_assets/"
    
    # También generar APK para testing local si se necesita
    echo "🔨 Generando APK adicional para testing..."
    ./gradlew assembleRelease
    APK_PATH="app/build/outputs/apk/release/app-release.apk"
    if [ -f "$APK_PATH" ]; then
        cp "$APK_PATH" "../play_store_assets/thecookflow-v1.0.0.apk"
        echo "📋 APK de testing también generado"
    fi
    
    echo "ℹ️  Información del App Bundle:"
    echo "El App Bundle (.aab) es el formato preferido por Google Play Store"
    echo "Permite optimizaciones automáticas de descarga para diferentes dispositivos"
    echo "Tamaño de descarga será menor que el APK tradicional"
    
else
    echo "❌ Error: No se pudo generar el App Bundle"
    exit 1
fi

echo "🎉 ¡Compilación completada! App Bundle listo para subir a Google Play Store"
echo "📤 Usa el archivo: play_store_assets/thecookflow-v1.0.0.aab"