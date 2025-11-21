#!/bin/bash

# Script para compilar el APK de TheCookFlow
# Asegurate de tener Android SDK y todas las dependencias instaladas

set -e

echo "🍳 Compilando TheCookFlow APK..."

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
    echo "🔐 Generando keystore para firmar APK..."
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

# Compilar APK firmado
echo "🔨 Compilando APK firmado..."
./gradlew assembleRelease

# Verificar que el APK se generó correctamente
APK_PATH="app/build/outputs/apk/release/app-release.apk"
if [ -f "$APK_PATH" ]; then
    APK_SIZE=$(du -h "$APK_PATH" | cut -f1)
    echo "✅ APK compilado exitosamente!"
    echo "📁 Ubicación: $APK_PATH"
    echo "📏 Tamaño: $APK_SIZE"
    
    # Copiar APK a directorio de assets
    mkdir -p ../play_store_assets/
    cp "$APK_PATH" "../play_store_assets/thecookflow-v1.0.0.apk"
    echo "📋 APK copiado a play_store_assets/"
    
    # Mostrar información del APK
    echo "ℹ️  Información del APK:"
    aapt dump badging "$APK_PATH" | grep -E "(package|sdkVersion|targetSdkVersion)"
    
else
    echo "❌ Error: No se pudo generar el APK"
    exit 1
fi

echo "🎉 ¡Compilación completada! APK listo para subir a Google Play Store"