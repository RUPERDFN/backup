#!/bin/bash
# TheCookFlow - Production Deployment Script
# Para servidor VPS: srv897847.hstgr.cloud

set -e

echo "🚀 TheCookFlow - Deployment en Producción"
echo "=========================================="

# Variables del servidor
SERVER_IP="85.31.238.204"
SERVER_USER="root"
APP_NAME="thecookflow"
APP_DIR="/opt/thecookflow"
DOMAIN="srv897847.hstgr.cloud"

# Colors para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar que la contraseña SSH esté configurada como variable de entorno
if [ -z "$SSH_PASSWORD" ]; then
    print_error "Variable de entorno SSH_PASSWORD no configurada"
    echo "Por favor, configura tu contraseña SSH:"
    echo "  export SSH_PASSWORD='tu_contraseña_aqui'"
    echo "O usa autenticación por clave SSH (recomendado)"
    exit 1
fi

# Función para ejecutar comandos en el servidor
ssh_exec() {
    sshpass -p "$SSH_PASSWORD" ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP "$1"
}

# Función para copiar archivos al servidor
scp_copy() {
    sshpass -p "$SSH_PASSWORD" scp -o StrictHostKeyChecking=no -r "$1" "$SERVER_USER@$SERVER_IP:$2"
}

print_status "Paso 1: Actualizando sistema del servidor..."
ssh_exec "apt update && apt upgrade -y"

print_status "Paso 2: Instalando dependencias del sistema..."
ssh_exec "apt install -y curl wget git nginx postgresql postgresql-contrib redis-server certbot python3-certbot-nginx sshpass htop nano ufw fail2ban"

print_status "Paso 3: Instalando Node.js 20 LTS..."
ssh_exec "curl -fsSL https://deb.nodesource.com/setup_20.x | bash -"
ssh_exec "apt install -y nodejs"

print_status "Paso 4: Configurando PostgreSQL..."
ssh_exec "sudo -u postgres psql -c \"CREATE USER thecookflow WITH PASSWORD 'CookFlow2024++!';\""
ssh_exec "sudo -u postgres psql -c \"CREATE DATABASE thecookflow OWNER thecookflow;\""
ssh_exec "sudo -u postgres psql -c \"GRANT ALL PRIVILEGES ON DATABASE thecookflow TO thecookflow;\""

print_status "Paso 5: Configurando firewall..."
ssh_exec "ufw allow OpenSSH"
ssh_exec "ufw allow 'Nginx Full'"
ssh_exec "ufw --force enable"

print_status "Paso 6: Creando directorio de la aplicación..."
ssh_exec "mkdir -p $APP_DIR"
ssh_exec "mkdir -p $APP_DIR/logs"
ssh_exec "chown -R www-data:www-data $APP_DIR"

print_success "Servidor preparado correctamente!"
echo ""
echo "Credenciales de la base de datos:"
echo "  - Host: localhost"
echo "  - Database: thecookflow"
echo "  - User: thecookflow"
echo "  - Password: CookFlow2024++!"
echo ""
print_status "Siguiente paso: Subir código de la aplicación..."