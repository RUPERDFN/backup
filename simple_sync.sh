#!/bin/bash

# TheCookFlow - Sincronización Simple y Directa

# Verificar que el token de GitHub esté configurado como variable de entorno
if [ -z "$GITHUB_PERSONAL_ACCESS_TOKEN" ]; then
    echo "❌ Error: Variable de entorno GITHUB_PERSONAL_ACCESS_TOKEN no configurada"
    echo "Por favor, configura tu token de GitHub:"
    echo "  export GITHUB_PERSONAL_ACCESS_TOKEN='tu_token_aqui'"
    echo "O ejecuta: ./setup_github_token.sh TU_TOKEN"
    exit 1
fi

REPO_URL="https://$GITHUB_PERSONAL_ACCESS_TOKEN@github.com/RUPERDFN/thecookflow20playstore.git"

echo "🚀 Sincronización Directa a GitHub"
echo "=================================="

# Crear directorio temporal
TEMP_DIR=$(mktemp -d)
echo "📁 Directorio temporal: $TEMP_DIR"

# Clonar o inicializar repo
echo "🔧 Inicializando repositorio..."
cd "$TEMP_DIR"
git init
git remote add origin "$REPO_URL"
git config user.name "RUPERDFN"  
git config user.email "rubengarsan@live.com"

# Volver al directorio original y copiar archivos
cd /home/runner/workspace

echo "📋 Copiando archivos Android..."
cp -r android/* "$TEMP_DIR/"

# Limpiar archivos sensibles
rm -rf "$TEMP_DIR/build" "$TEMP_DIR"/*.apk "$TEMP_DIR"/*.aab "$TEMP_DIR"/*.keystore "$TEMP_DIR/.git" 2>/dev/null || true

# Crear README
cat > "$TEMP_DIR/README.md" << 'EOF'
# TheCookFlow Android App

## Estado
✅ Listo para Google Play Store  
✅ Google Play Billing v7.1.1  
✅ AdMob con permisos AD_ID corregidos  

## Compilar
```bash
./gradlew bundleRelease
```

Aplicación Android de planificación de menús con IA.
Desarrollado por RUPERDFN.
EOF

# Hacer commit y push
cd "$TEMP_DIR"
echo "💾 Haciendo commit..."
git add .
git commit -m "🚀 TheCookFlow Android - $(date '+%Y-%m-%d %H:%M')"

echo "⬆️  Subiendo a GitHub..."
if git push -u origin main --force; then
    echo "✅ ¡ÉXITO! Repositorio actualizado:"
    echo "🌐 https://github.com/RUPERDFN/thecookflow20playstore"
elif git push -u origin master --force; then
    echo "✅ ¡ÉXITO! Repositorio actualizado:" 
    echo "🌐 https://github.com/RUPERDFN/thecookflow20playstore"
else
    echo "❌ Error en push - verificando estado del repositorio..."
    git status
fi

# Limpiar
cd /home/runner/workspace
rm -rf "$TEMP_DIR"
echo "🧹 Limpieza completada"