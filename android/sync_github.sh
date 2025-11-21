#!/bin/bash

# TheCookFlow - Script de Sincronización Automática con GitHub
# Actualiza automáticamente el repositorio con los últimos cambios

echo "🚀 Iniciando sincronización automática con GitHub..."

# Configuración
REPO_URL="https://github.com/RUPERDFN/thecookflow2.0_playstore.git"
BRANCH="main"

# Verificar si git está inicializado
if [ ! -d ".git" ]; then
    echo "📦 Inicializando repositorio Git..."
    git init
    git remote add origin $REPO_URL
fi

# Verificar conexión con GitHub
echo "🔗 Verificando conexión con GitHub..."
git remote -v

# Agregar todos los cambios
echo "📝 Agregando cambios..."
git add .

# Crear commit con timestamp
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
COMMIT_MSG="🔄 Auto-sync: TheCookFlow Android - $TIMESTAMP"

git commit -m "$COMMIT_MSG" || echo "ℹ️  No hay cambios para hacer commit"

# Configurar branch principal
git branch -M $BRANCH

# Subir cambios
echo "⬆️  Subiendo cambios a GitHub..."
git push -u origin $BRANCH --force

echo "✅ Sincronización completada exitosamente!"
echo "🌐 Repositorio: $REPO_URL"
echo "📅 Fecha: $TIMESTAMP"