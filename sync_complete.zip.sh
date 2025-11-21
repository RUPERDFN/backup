#!/bin/bash

# TheCookFlow - Crear Paquete Completo para Sincronización
# Genera un archivo con todo lo necesario para subir a GitHub

echo "📦 Creando paquete completo de sincronización..."

# Crear directorio de trabajo
mkdir -p /tmp/cookflow_complete
cd /tmp/cookflow_complete

# Copiar todo el proyecto Android
echo "📱 Copiando proyecto Android..."
cp -r /home/runner/workspace/android ./

# Limpiar archivos sensibles
find ./android -name "build" -type d -exec rm -rf {} + 2>/dev/null || true
find ./android -name "*.apk" -delete 2>/dev/null || true
find ./android -name "*.aab" -delete 2>/dev/null || true  
find ./android -name "*.keystore" -delete 2>/dev/null || true
rm -f ./android/local.properties 2>/dev/null || true

# Crear script de sincronización (SIN token hardcodeado)
cat > sync_to_github.sh << 'EOF'
#!/bin/bash

# TheCookFlow - Sincronización Segura
# Verificar que el token de GitHub esté configurado como variable de entorno
if [ -z "$GITHUB_PERSONAL_ACCESS_TOKEN" ]; then
    echo "❌ Error: Variable de entorno GITHUB_PERSONAL_ACCESS_TOKEN no configurada"
    echo "Por favor, configura tu token de GitHub:"
    echo "  export GITHUB_PERSONAL_ACCESS_TOKEN='tu_token_aqui'"
    exit 1
fi

REPO_URL="https://$GITHUB_PERSONAL_ACCESS_TOKEN@github.com/RUPERDFN/thecookflow20playstore.git"

echo "🚀 Sincronizando TheCookFlow Android a GitHub..."

# Inicializar git si no existe
if [ ! -d ".git" ]; then
    git init
    git remote add origin $REPO_URL
fi

# Configurar usuario
git config user.name "RUPERDFN"
git config user.email "rubengarsan@live.com"

# Agregar archivos
git add .
git commit -m "🚀 TheCookFlow Android - Ready for Play Store - $(date '+%Y-%m-%d %H:%M')"

# Push
if git push -u origin main --force; then
    echo "✅ ¡Sincronización exitosa!"
    echo "🌐 https://github.com/RUPERDFN/thecookflow20playstore"
elif git push -u origin master --force; then
    echo "✅ ¡Sincronización exitosa!"  
    echo "🌐 https://github.com/RUPERDFN/thecookflow20playstore"
else
    echo "❌ Error - verifica tu conexión a internet"
fi
EOF

chmod +x sync_to_github.sh

# Crear README completo
cat > README.md << 'EOF'
# 🍽️ TheCookFlow Android App - Lista para Google Play Store

## 🚀 Estado Actual
- ✅ **100% lista para Google Play Store**
- ✅ **Google Play Billing v7.1.1** completamente integrado
- ✅ **AdMob** configurado con permisos AD_ID corregidos 
- ✅ **Keystore** configurado para firma de release
- ✅ **Monetización dual**: Suscripciones €1.99/mes + Publicidad

## 📱 Características
- 🤖 Generación de menús con IA (OpenAI + Perplexity)
- 💳 Google Play Billing con 7 días de prueba gratuita
- 📺 AdMob integrado con GDPR compliance
- 🛒 Listas de compra inteligentes  
- 📷 Reconocimiento de alimentos por imagen
- 🔒 Verificación RSA de compras

## 🔧 Especificaciones
- **Package Name:** `com.cookflow.app`
- **Min SDK:** 24 (Android 7.0)
- **Target SDK:** 34 (Android 14) 
- **Versión:** 7.0.0

## 📦 Compilación para Google Play Store

### Generar AAB (requerido para Play Store):
```bash
cd android
./gradlew bundleRelease
```

### Generar APK Debug:
```bash
cd android  
./gradlew assembleDebug
```

## 🏗️ Estructura del Proyecto
```
android/
├── app/
│   ├── src/main/
│   │   ├── AndroidManifest.xml        # Configuración y permisos
│   │   ├── java/com/cookflow/app/      # Código fuente Kotlin
│   │   │   ├── MainActivity.kt         # Actividad principal
│   │   │   ├── BillingManager.kt       # Google Play Billing
│   │   │   └── SplashActivity.kt       # Pantalla de carga
│   │   └── res/                        # Recursos (layouts, icons, etc.)
│   ├── build.gradle                    # Configuración de compilación
│   └── proguard-rules.pro             # Reglas de optimización
├── build.gradle                        # Configuración del proyecto
└── gradle.properties                   # Propiedades de Gradle
```

## 🔐 Seguridad
- ⚠️ **Keystore NO incluido** en este repositorio por seguridad
- ✅ Verificación RSA de Google Play purchases  
- ✅ Permisos AD_ID configurados correctamente
- ✅ ProGuard habilitado para release builds

## 📚 Scripts Incluidos
- `compile_final_aab.py` - Compilación automatizada con Python
- `manual_build.sh` - Compilación manual paso a paso
- `sync_to_github.sh` - Sincronización con GitHub (con token incluido)

## 🎯 Monetización
- **Suscripciones**: €1.99/mes con 7 días de prueba gratuita
- **Publicidad**: AdMob integrado para usuarios no premium
- **Product ID**: `suscripcion`

## 📞 Soporte  
Desarrollado por **RUPERDFN** para TheCookFlow.
Sistema completo de planificación culinaria con IA.

---
**Fecha:** $(date '+%Y-%m-%d %H:%M:%S')  
**Estado:** Lista para Google Play Store
EOF

# Crear instrucciones de uso
cat > INSTRUCCIONES.txt << 'EOF'
🚀 INSTRUCCIONES DE USO:

1. Descargar este paquete completo
2. Configurar tu token de GitHub como variable de entorno:
   export GITHUB_PERSONAL_ACCESS_TOKEN="tu_token_aqui"
3. Abrir terminal/command prompt en la carpeta descargada
4. Ejecutar: ./sync_to_github.sh
5. ¡Tu app aparecerá en GitHub automáticamente!

🌐 Repositorio destino: 
https://github.com/RUPERDFN/thecookflow20playstore

✅ Incluye:
- Código fuente completo de Android
- Google Play Billing configurado  
- AdMob con permisos AD_ID
- Scripts de compilación
- Documentación completa

🔑 Para obtener tu token de GitHub:
1. Ve a: https://github.com/settings/tokens
2. Generate new token (classic)
3. Marca: 'repo' (control de repositorios)
4. Copia el token y configúralo como variable de entorno

⚠️ SEGURIDAD:
- NUNCA incluyas tokens en scripts
- Usa variables de entorno para credenciales
EOF

echo ""
echo "✅ Paquete completo creado en: /tmp/cookflow_complete"
echo "📦 Contiene:"
echo "   - Proyecto Android completo"
echo "   - Script de sincronización con tu token"
echo "   - Documentación completa"
echo "   - Instrucciones de uso"
echo ""
echo "🎯 Para usarlo:"
echo "   1. Descarga la carpeta /tmp/cookflow_complete"
echo "   2. Ejecuta: ./sync_to_github.sh"
echo "   3. ¡Tu app estará en GitHub!"

# Crear archivo comprimido si es posible
if command -v tar >/dev/null 2>&1; then
    cd /tmp
    tar -czf cookflow_android_complete.tar.gz cookflow_complete/
    echo ""
    echo "📦 También creado archivo comprimido:"
    echo "   /tmp/cookflow_android_complete.tar.gz"
fi