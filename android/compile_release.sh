#!/bin/bash

# Script para compilar TheCookFlow para Google Play Store
echo "🚀 Compilando TheCookFlow para Google Play Store..."

# Verificar que existe el keystore
if [ ! -f "app/thecookflow-release-key.keystore" ]; then
    echo "❌ Keystore no encontrado. Ejecuta primero: ./generate_keystore.sh"
    exit 1
fi

# Limpiar builds anteriores
echo "🧹 Limpiando builds anteriores..."
./gradlew clean

if [ $? -eq 0 ]; then
    echo "✅ Limpieza completada"
else
    echo "❌ Error en la limpieza"
    exit 1
fi

# Compilar App Bundle
echo "📦 Compilando App Bundle..."
./gradlew bundleRelease

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 ¡COMPILACIÓN EXITOSA!"
    echo "📁 App Bundle generado en:"
    echo "   app/build/outputs/bundle/release/app-release.aab"
    
    # Mostrar información del archivo
    if [ -f "app/build/outputs/bundle/release/app-release.aab" ]; then
        size=$(du -h app/build/outputs/bundle/release/app-release.aab | cut -f1)
        echo "📊 Tamaño del archivo: $size"
        echo ""
        echo "🎯 PRÓXIMOS PASOS:"
        echo "1. Ir a Google Play Console: https://play.google.com/console"
        echo "2. Crear nueva aplicación"
        echo "3. Subir el archivo: app-release.aab"
        echo "4. Configurar productos de suscripción"
        echo "5. Completar ficha de la tienda"
        echo "6. Enviar para revisión"
        echo ""
        echo "⏱️  Tiempo de revisión de Google: 7-14 días"
        echo "💰 Ingresos estimados mes 1: €44-119"
    else
        echo "❌ El archivo App Bundle no fue encontrado"
        exit 1
    fi
else
    echo "❌ Error en la compilación del App Bundle"
    echo "💡 Posibles soluciones:"
    echo "   - Verificar que Android SDK 34 esté instalado"
    echo "   - Ejecutar: ./gradlew --refresh-dependencies"
    echo "   - Verificar configuración de Java (requiere JDK 17+)"
    exit 1
fi