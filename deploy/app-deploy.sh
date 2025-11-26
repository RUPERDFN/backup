#!/bin/bash
# TheCookFlow - Application Deployment Script

set -e

# Variables
SERVER_IP="85.31.238.204"
SERVER_USER="root"
APP_DIR="/opt/thecookflow"
DOMAIN="srv897847.hstgr.cloud"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() { echo -e "${BLUE}[INFO]${NC} $1"; }
print_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
print_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Verificar que la contraseña SSH esté configurada como variable de entorno
if [ -z "$SSH_PASSWORD" ]; then
    print_error "Variable de entorno SSH_PASSWORD no configurada"
    echo "Por favor, configura tu contraseña SSH:"
    echo "  export SSH_PASSWORD='tu_contraseña_aqui'"
    echo "O usa autenticación por clave SSH (recomendado)"
    exit 1
fi

ssh_exec() {
    sshpass -p "$SSH_PASSWORD" ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP "$1"
}

scp_copy() {
    sshpass -p "$SSH_PASSWORD" scp -o StrictHostKeyChecking=no -r "$1" "$SERVER_USER@$SERVER_IP:$2"
}

print_status "Construyendo aplicación para producción..."
npm run build 2>/dev/null || echo "Build step skipped"

print_status "Creando archivo de producción..."
tar --exclude=node_modules \
    --exclude=.git \
    --exclude=deploy \
    --exclude=attached_assets \
    --exclude=.env \
    -czf thecookflow-production.tar.gz .

print_status "Subiendo aplicación al servidor..."
scp_copy "thecookflow-production.tar.gz" "/tmp/"

print_status "Desplegando en el servidor..."
ssh_exec "cd $APP_DIR && tar -xzf /tmp/thecookflow-production.tar.gz"
ssh_exec "cd $APP_DIR && npm install --production"
ssh_exec "rm /tmp/thecookflow-production.tar.gz"

print_status "Configurando variables de entorno..."
ssh_exec "cat > $APP_DIR/.env << 'EOF'
# TheCookFlow - Production Environment
NODE_ENV=production
PORT=3000
HOST=0.0.0.0

# Base de datos
DATABASE_URL=postgresql://thecookflow:CookFlow2024++!@localhost:5432/thecookflow

# Autenticación
JWT_SECRET=TheCookFlowJWTSecret2024UltraSecure999!
SESSION_SECRET=TheCookFlowSessionSecret2024UltraSecure888!

# APIs externas - CONFIGURAR DESPUÉS
OPENAI_API_KEY=your_openai_key_here
PERPLEXITY_API_KEY=your_perplexity_key_here

# Google Play Billing
GOOGLE_PLAY_PUBLIC_KEY=your_google_play_key_here

# Configuración de servidor
ALLOWED_ORIGINS=https://$DOMAIN,https://www.$DOMAIN
TRUST_PROXY=true

# Logging
LOG_LEVEL=info
EOF"

print_success "Aplicación desplegada correctamente!"
print_status "Configurando servicio systemd..."

# Crear archivo de servicio systemd
ssh_exec "cat > /etc/systemd/system/thecookflow.service << 'EOF'
[Unit]
Description=TheCookFlow - AI Cooking App
After=network.target

[Service]
Type=simple
User=www-data
Group=www-data
WorkingDirectory=$APP_DIR
ExecStart=/usr/bin/node api/server/index.js
Restart=always
RestartSec=10
Environment=NODE_ENV=production

# Logging
StandardOutput=append:/var/log/thecookflow/app.log
StandardError=append:/var/log/thecookflow/error.log

[Install]
WantedBy=multi-user.target
EOF"

ssh_exec "mkdir -p /var/log/thecookflow"
ssh_exec "chown -R www-data:www-data /var/log/thecookflow"
ssh_exec "systemctl daemon-reload"
ssh_exec "systemctl enable thecookflow"

print_success "Servicio systemd configurado!"
print_status "La aplicación se iniciará automáticamente en el próximo paso..."