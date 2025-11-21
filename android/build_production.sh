#!/bin/bash

# TheCookFlow - Build Production AAB for Google Play Store
# Este script debe ejecutarse en una máquina con Android Studio instalado

echo "🚀 TheCookFlow - Preparando build de producción..."

# Verificar que el keystore existe
if [ ! -f "thecookflow-release-key.keystore" ]; then
    echo "❌ ERROR: thecookflow-release-key.keystore no encontrado"
    echo "   Asegúrate de que el archivo keystore esté en el directorio android/"
    exit 1
fi

# Configurar variables de entorno para AdMob producción
echo "🎯 Configurando IDs de AdMob de producción..."
export ADMOB_APP_ID="ca-app-pub-7982290772698799~1854089866"
export ADMOB_BANNER_ID="ca-app-pub-7982290772698799/7257867786"
export ADMOB_INTERSTITIAL_ID="ca-app-pub-7982290772698799/8325501869"
export ADMOB_APP_OPEN_ID="ca-app-pub-7982290772698799/2139367466"

echo "✅ Variables de entorno configuradas:"
echo "   BANNER: $ADMOB_BANNER_ID"
echo "   INTERSTITIAL: $ADMOB_INTERSTITIAL_ID"
echo "   APP_OPEN: $ADMOB_APP_OPEN_ID"

# Limpiar builds anteriores
echo "🧹 Limpiando builds anteriores..."
./gradlew clean

# Generar Android App Bundle
echo "📱 Generando Android App Bundle (.aab)..."
./gradlew bundleRelease

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 ¡BUILD EXITOSO!"
    echo ""
    echo "📂 Android App Bundle generado en:"
    echo "   app/build/outputs/bundle/release/app-release.aab"
    echo ""
    echo "📋 Información del build:"
    echo "   ✅ Firmado con keystore de producción"
    echo "   ✅ AdMob IDs de producción configuradas"
    echo "   ✅ Minificación y optimización habilitadas"
    echo "   ✅ Listo para subir a Google Play Store"
    echo ""
    echo "🔗 Siguiente paso:"
    echo "   1. Ve a https://play.google.com/console"
    echo "   2. Crea nueva aplicación o selecciona TheCookFlow"
    echo "   3. Sube el archivo app-release.aab"
else
    echo ""
    echo "❌ BUILD FALLÓ"
    echo "   Verifica los logs anteriores para identificar el problema"
    exit 1
fi