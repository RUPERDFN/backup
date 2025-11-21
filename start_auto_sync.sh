#!/bin/bash

# TheCookFlow - Sincronización Automática Continua
# Ejecuta sincronización cada N minutos automáticamente

echo "🔄 TheCookFlow - Sincronización Automática Continua"
echo "==================================================="

# Cargar token si existe
if [ -f ~/.github_env ]; then
    source ~/.github_env
fi

# Verificar token
if [ -z "$GITHUB_PERSONAL_ACCESS_TOKEN" ]; then
    echo "❌ Token GitHub no configurado"
    echo "   Ejecuta primero: ./setup_github_token.sh TU_TOKEN"
    exit 1
fi

# Configurar intervalo
INTERVAL_MINUTES=${1:-10}
echo "⏰ Intervalo: cada $INTERVAL_MINUTES minutos"
echo "🛑 Presiona Ctrl+C para detener"
echo ""

# Función para mostrar estado
show_status() {
    local timestamp=$(date '+%H:%M:%S')
    echo "[$timestamp] $1"
}

# Sincronización inicial
show_status "🚀 Sincronización inicial..."
./sync_android_now.sh

if [ $? -eq 0 ]; then
    show_status "✅ Sincronización inicial exitosa"
else
    show_status "⚠️  Problemas en sincronización inicial, continuando..."
fi

echo ""
show_status "⏰ Iniciando monitoreo automático..."

# Loop principal
while true; do
    sleep $((INTERVAL_MINUTES * 60))
    
    show_status "🔍 Verificando cambios..."
    
    # Ejecutar sincronización
    if ./sync_android_now.sh > /tmp/sync_output.log 2>&1; then
        if grep -q "¡SINCRONIZACIÓN COMPLETADA!" /tmp/sync_output.log; then
            show_status "✅ Sincronización exitosa"
        else
            show_status "ℹ️  Sin cambios para sincronizar"
        fi
    else
        show_status "⚠️  Error en sincronización - reintentando en próximo ciclo"
    fi
done