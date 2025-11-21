#!/bin/bash

# TheCookFlow - Lanzador de Sincronización Automática
# Ejecuta el sistema de actualización automática con GitHub

echo "🎯 TheCookFlow - Sistema de Sincronización Automática"
echo "=================================================="

# Verificar si Python está disponible
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 no encontrado. Instalando..."
    # Para sistemas basados en Debian/Ubuntu
    if command -v apt-get &> /dev/null; then
        sudo apt-get update && sudo apt-get install -y python3
    fi
fi

# Hacer ejecutables los scripts
chmod +x sync_github.sh
chmod +x auto_sync.py

echo "🔧 Configurando Git..."
# Configurar Git si no está configurado
if [ -z "$(git config --global user.name)" ]; then
    echo "📝 Configurando usuario Git..."
    echo "Ingresa tu nombre para Git:"
    read git_name
    git config --global user.name "$git_name"
    
    echo "Ingresa tu email para Git:"
    read git_email
    git config --global user.email "$git_email"
fi

echo ""
echo "🚀 Opciones disponibles:"
echo "1. Sincronización única (ahora)"
echo "2. Monitoreo automático continuo (cada 5 minutos)"
echo "3. Monitoreo automático rápido (cada 2 minutos)"
echo "4. Solo configurar Git"

read -p "Selecciona una opción (1-4): " option

case $option in
    1)
        echo "🔄 Ejecutando sincronización única..."
        python3 auto_sync.py
        ;;
    2)
        echo "⏰ Iniciando monitoreo automático (cada 5 minutos)..."
        python3 auto_sync.py --monitor 5
        ;;
    3)
        echo "⚡ Iniciando monitoreo rápido (cada 2 minutos)..."
        python3 auto_sync.py --monitor 2
        ;;
    4)
        echo "✅ Git configurado correctamente"
        ;;
    *)
        echo "❌ Opción no válida"
        exit 1
        ;;
esac