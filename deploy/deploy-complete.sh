#!/bin/bash
# TheCookFlow - Complete Deployment Script
# Ejecuta todo el proceso de deployment automáticamente

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

print_header() {
    echo -e "${CYAN}"
    echo "=============================================="
    echo "  🚀 TheCookFlow - Deployment Completo 🚀"
    echo "=============================================="
    echo -e "${NC}"
}

print_step() {
    echo -e "\n${BLUE}[PASO $1]${NC} $2"
    echo "----------------------------------------------"
}

print_status() { echo -e "${BLUE}[INFO]${NC} $1"; }
print_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
print_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
print_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Verificar que la contraseña SSH esté configurada como variable de entorno
if [ -z "$SSH_PASSWORD" ]; then
    print_error "Variable de entorno SSH_PASSWORD no configurada"
    echo "Por favor, configura tu contraseña SSH:"
    echo "  export SSH_PASSWORD='tu_contraseña_aqui'"
    echo "O usa autenticación por clave SSH (recomendado)"
    exit 1
fi

# Verificar dependencias
check_dependencies() {
    command -v sshpass >/dev/null 2>&1 || {
        print_error "sshpass no está instalado. Instalando..."
        sudo apt-get update && sudo apt-get install -y sshpass
    }
    
    command -v npm >/dev/null 2>&1 || {
        print_error "npm no está disponible"
        exit 1
    }
}

print_header

# Verificar conexión al servidor
print_step "1" "Verificando conexión al servidor..."
if sshpass -p "$SSH_PASSWORD" ssh -o ConnectTimeout=10 -o StrictHostKeyChecking=no root@85.31.238.204 "echo 'Conexión exitosa'" 2>/dev/null; then
    print_success "Conexión al servidor establecida ✅"
else
    print_error "No se puede conectar al servidor"
    exit 1
fi

check_dependencies

print_step "2" "Preparando servidor (instalando dependencias)..."
bash deploy/production-setup.sh

print_step "3" "Desplegando aplicación..."
bash deploy/app-deploy.sh

print_step "4" "Configurando base de datos..."
bash deploy/database-setup.sh

print_step "5" "Configurando Nginx y SSL..."
bash deploy/nginx-config.sh

print_step "6" "Verificación final..."
sleep 10

# Verificar que la aplicación responde
DOMAIN="srv897847.hstgr.cloud"
if curl -s -f https://$DOMAIN/health >/dev/null; then
    print_success "✅ Aplicación respondiendo correctamente en https://$DOMAIN"
else
    print_warning "⚠️  Aplicación podría estar iniciándose aún..."
fi

echo -e "\n${GREEN}"
echo "🎉 ¡DEPLOYMENT COMPLETADO! 🎉"
echo "=============================="
echo -e "${NC}"
echo -e "📱 ${CYAN}Tu aplicación TheCookFlow está disponible en:${NC}"
echo -e "   🌐 https://$DOMAIN"
echo -e "   🌐 https://www.$DOMAIN"
echo ""
echo -e "${YELLOW}📋 INFORMACIÓN IMPORTANTE:${NC}"
echo -e "   🔑 Usuario demo: demo@thecookflow.com / Demo1234!"
echo -e "   🗄️  Base de datos: PostgreSQL en localhost:5432"
echo -e "   📊 Logs de la app: /var/log/thecookflow/"
echo -e "   📊 Logs de Nginx: /var/log/nginx/"
echo -e "   🔄 Servicio: systemctl status thecookflow"
echo -e "   💾 Backups: /opt/backups/thecookflow/"
echo ""
echo -e "${YELLOW}⚙️  PRÓXIMOS PASOS:${NC}"
echo -e "   1. 🔧 Configurar APIs keys (OpenAI, Perplexity) en el archivo:"
echo -e "      /opt/thecookflow/.env"
echo -e "   2. 🔄 Reiniciar la aplicación: systemctl restart thecookflow"
echo -e "   3. 📱 Configurar Google Play Billing keys"
echo -e "   4. 🧪 Probar todas las funcionalidades"
echo ""
echo -e "${GREEN}¡Tu aplicación de cocina con IA está lista para producción! 🍽️${NC}"