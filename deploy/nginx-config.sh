#!/bin/bash
# TheCookFlow - Nginx Configuration Script

set -e

SERVER_IP="85.31.238.204"
SERVER_USER="root"
DOMAIN="srv897847.hstgr.cloud"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() { echo -e "${BLUE}[INFO]${NC} $1"; }
print_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }

# Verificar que la contraseña SSH esté configurada como variable de entorno
if [ -z "$SSH_PASSWORD" ]; then
    echo -e "${RED}[ERROR]${NC} Variable de entorno SSH_PASSWORD no configurada"
    echo "Por favor, configura tu contraseña SSH:"
    echo "  export SSH_PASSWORD='tu_contraseña_aqui'"
    echo "O usa autenticación por clave SSH (recomendado)"
    exit 1
fi

ssh_exec() {
    sshpass -p "$SSH_PASSWORD" ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP "$1"
}

print_status "Configurando Nginx para TheCookFlow..."

# Crear configuración de Nginx
ssh_exec "cat > /etc/nginx/sites-available/thecookflow << 'EOF'
# TheCookFlow - Production Nginx Configuration

# Rate limiting
limit_req_zone \$binary_remote_addr zone=api:10m rate=10r/s;
limit_req_zone \$binary_remote_addr zone=auth:10m rate=5r/s;

# Upstream para la aplicación Node.js
upstream thecookflow_backend {
    server 127.0.0.1:3000;
}

server {
    listen 80;
    listen [::]:80;
    server_name $DOMAIN www.$DOMAIN;
    
    # Redirigir HTTP a HTTPS
    return 301 https://\$host\$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name $DOMAIN www.$DOMAIN;

    # SSL Configuration (certbot configurará esto)
    ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;
    
    # Configuración SSL moderna
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Security headers
    add_header X-Frame-Options \"SAMEORIGIN\" always;
    add_header X-Content-Type-Options \"nosniff\" always;
    add_header X-XSS-Protection \"1; mode=block\" always;
    add_header Strict-Transport-Security \"max-age=31536000; includeSubDomains\" always;
    add_header Content-Security-Policy \"default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' *.openai.com *.google.com; style-src 'self' 'unsafe-inline' fonts.googleapis.com; font-src 'self' fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' *.openai.com *.perplexity.ai;\" always;

    # Logging
    access_log /var/log/nginx/thecookflow_access.log;
    error_log /var/log/nginx/thecookflow_error.log;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/json application/xml+rss;

    # Rate limiting para rutas específicas
    location /api/auth/ {
        limit_req zone=auth burst=10 nodelay;
        proxy_pass http://thecookflow_backend;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    location /api/ {
        limit_req zone=api burst=20 nodelay;
        proxy_pass http://thecookflow_backend;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # Archivos estáticos con cache
    location ~* \.(js|css|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot|ico)\$ {
        expires 1y;
        add_header Cache-Control \"public, immutable\";
        proxy_pass http://thecookflow_backend;
        proxy_set_header Host \$host;
    }

    # Todas las demás rutas van a la aplicación
    location / {
        proxy_pass http://thecookflow_backend;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        
        # WebSocket support
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection \"upgrade\";
    }

    # Health check endpoint
    location /health {
        access_log off;
        proxy_pass http://thecookflow_backend/health;
    }
}
EOF"

# Habilitar el sitio
ssh_exec "ln -sf /etc/nginx/sites-available/thecookflow /etc/nginx/sites-enabled/"
ssh_exec "nginx -t"

print_success "Configuración de Nginx creada!"
print_status "Configurando SSL con Let's Encrypt..."

# Instalar certificado SSL
ssh_exec "certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN --redirect"

# Configurar renovación automática
ssh_exec "systemctl enable certbot.timer"

print_status "Reiniciando servicios..."
ssh_exec "systemctl reload nginx"
ssh_exec "systemctl restart thecookflow"

print_success "¡Nginx configurado con SSL!"
print_success "La aplicación estará disponible en: https://$DOMAIN"