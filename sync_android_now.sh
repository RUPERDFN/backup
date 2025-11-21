#!/bin/bash

# TheCookFlow - Sincronización Directa de Android a GitHub
# Sube la carpeta android completa al repositorio específico

echo "🚀 TheCookFlow - Sincronización Android → GitHub"
echo "================================================"

# Configuración
REPO_URL="github.com/RUPERDFN/thecookflow20playstore.git"

# Verificar si existe el token de GitHub
if [ -n "$GITHUB_PERSONAL_ACCESS_TOKEN" ]; then
    TARGET_REPO="https://$GITHUB_PERSONAL_ACCESS_TOKEN@$REPO_URL"
    echo "✅ Token GitHub configurado correctamente"
else
    TARGET_REPO="https://$REPO_URL"
    echo "⚠️  Usando HTTPS sin token - puede requerir autenticación manual"
fi

TEMP_DIR="/tmp/cookflow_android_sync_$$"
ANDROID_FOLDER="android"

# Función para limpiar en caso de error
cleanup() {
    if [ -d "$TEMP_DIR" ]; then
        rm -rf "$TEMP_DIR"
        echo "🧹 Archivos temporales limpiados"
    fi
}

# Trap para limpiar en caso de interrupción
trap cleanup EXIT

echo "📱 Preparando sincronización..."
echo "🎯 Destino: $TARGET_REPO"

# Verificar que existe la carpeta android
if [ ! -d "$ANDROID_FOLDER" ]; then
    echo "❌ Error: No se encontró la carpeta '$ANDROID_FOLDER'"
    exit 1
fi

# Crear directorio temporal
mkdir -p "$TEMP_DIR"
echo "📁 Creando repositorio temporal: $TEMP_DIR"

# Inicializar git en el directorio temporal
cd "$TEMP_DIR"
git init
git config user.name "RUPERDFN"
git config user.email "rubengarsan@live.com"
git remote add origin "$TARGET_REPO"

# Volver al directorio original y copiar archivos
cd - > /dev/null

echo "📋 Copiando archivos de Android..."

# Copiar toda la carpeta android excluyendo archivos sensibles
cp -r "$ANDROID_FOLDER"/* "$TEMP_DIR/"

# Limpiar archivos sensibles del directorio temporal
find "$TEMP_DIR" -name "build" -type d -exec rm -rf {} + 2>/dev/null || true
find "$TEMP_DIR" -name "*.apk" -delete 2>/dev/null || true
find "$TEMP_DIR" -name "*.aab" -delete 2>/dev/null || true
find "$TEMP_DIR" -name "*.keystore" -delete 2>/dev/null || true
find "$TEMP_DIR" -name ".git" -type d -exec rm -rf {} + 2>/dev/null || true
rm -f "$TEMP_DIR/local.properties" 2>/dev/null || true

# Crear README.md completo
cat > "$TEMP_DIR/README.md" << 'EOF'
# 🍽️ TheCookFlow Android App

## 📱 Descripción
Aplicación Android completa de TheCookFlow con planificación de menús inteligente usando IA.

## ✅ Estado Actual
- ✅ **100% lista para Google Play Store**
- ✅ **Google Play Billing v7.1.1** completamente integrado
- ✅ **AdMob** configurado con permisos AD_ID corregidos
- ✅ **Keystore** configurado para firma de release
- ✅ **Monetización dual**: Suscripciones €1.99/mes + Publicidad

## 🚀 Características
- 🤖 Generación de menús con IA (OpenAI + Perplexity)
- 💳 Google Play Billing con 7 días de prueba gratuita
- 📺 AdMob integrado con GDPR compliance
- 🛒 Listas de compra inteligentes
- 📷 Reconocimiento de alimentos por imagen
- 🔒 Verificación RSA de compras

## 🔧 Especificaciones Técnicas
- **Package Name:** `com.cookflow.app`
- **Min SDK:** 24 (Android 7.0)
- **Target SDK:** 34 (Android 14)
- **Versión:** 7.0.0

## 📦 Compilación

### Generar AAB para Google Play Store:
```bash
./gradlew bundleRelease
```

### Generar APK Debug:
```bash
./gradlew assembleDebug
```

### Scripts incluidos:
- `compile_final_aab.py` - Compilación automatizada con Python
- `manual_build.sh` - Compilación manual paso a paso
- `generate_keystore.sh` - Generar nuevo keystore

## 📁 Estructura
```
app/
├── src/main/
│   ├── AndroidManifest.xml     # Configuración y permisos
│   ├── java/com/cookflow/app/   # Código fuente Kotlin
│   │   ├── MainActivity.kt      # Actividad principal
│   │   ├── BillingManager.kt    # Google Play Billing
│   │   └── SplashActivity.kt    # Pantalla de carga
│   └── res/                     # Recursos (layouts, icons, etc.)
├── build.gradle                 # Configuración de compilación
└── proguard-rules.pro          # Reglas de optimización
```

## 🔐 Seguridad
- ⚠️ **Keystore NO incluido** en este repositorio por seguridad
- ✅ Verificación RSA de Google Play purchases
- ✅ Permisos AD_ID configurados correctamente
- ✅ ProGuard habilitado para release

## 📞 Soporte
Desarrollado por **RUPERDFN** para TheCookFlow.
Sistema completo de planificación culinaria con IA.

---
**Fecha de actualización:** $(date '+%Y-%m-%d %H:%M:%S')
EOF

# Cambiar al directorio temporal y hacer commit
cd "$TEMP_DIR"

echo "💾 Creando commit..."
git add .

TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
COMMIT_MSG="🚀 TheCookFlow Android - Ready for Google Play Store - $TIMESTAMP"

if git commit -m "$COMMIT_MSG"; then
    echo "⬆️  Subiendo a GitHub..."
    
    # Intentar push a main, si falla intentar master
    if git push -u origin main --force; then
        echo "✅ ¡Sincronización exitosa con branch 'main'!"
    elif git push -u origin master --force; then
        echo "✅ ¡Sincronización exitosa con branch 'master'!"
    else
        echo "❌ Error al subir cambios"
        exit 1
    fi
else
    echo "ℹ️  No hay cambios para subir"
fi

# Regresar al directorio original
cd - > /dev/null

echo ""
echo "🎉 ¡SINCRONIZACIÓN COMPLETADA!"
echo "📱 Tu aplicación Android está ahora en:"
echo "🌐 $TARGET_REPO"
echo ""
echo "✅ Incluye:"
echo "   📱 Código fuente completo"
echo "   💳 Google Play Billing configurado"
echo "   📺 AdMob con permisos AD_ID"
echo "   🔧 Scripts de compilación"
echo "   📚 Documentación completa"
echo ""
echo "🚀 ¡Lista para compilar y subir a Google Play Store!"