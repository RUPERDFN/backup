#!/bin/bash

# Script de Despliegue Automatizado - TheCookFlow VPS
# Servidor: root@85.31.238.204

set -e  # Salir si algún comando falla
set -u  # Salir si se usa una variable no definida

SERVER="root@85.31.238.204"
APP_DIR="/var/www/thecookflow"
DOMAIN="${DEPLOY_DOMAIN:-tu-dominio.com}"  # Usar variable de entorno o valor por defecto

# Verificar que el dominio haya sido configurado
if [ "$DOMAIN" = "tu-dominio.com" ]; then
    echo "⚠️ ADVERTENCIA: El dominio no ha sido configurado"
    echo "Configura la variable DEPLOY_DOMAIN antes de ejecutar:"
    echo "  export DEPLOY_DOMAIN='tu-dominio-real.com'"
    read -p "¿Continuar de todas formas? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo "🚀 Iniciando despliegue de TheCookFlow en VPS..."

# 1. Subir archivos al servidor
echo "📤 Subiendo archivos al servidor..."
scp thecookflow-codigo-completo-final.tar.gz $SERVER:/tmp/

# 2. Conectar al servidor y ejecutar instalación
ssh $SERVER << 'ENDSSH'

# Actualizar sistema
echo "🔄 Actualizando sistema..."
apt update && apt upgrade -y

# Instalar Node.js 18
echo "📦 Instalando Node.js 18..."
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs

# Instalar PostgreSQL
echo "🗄️ Instalando PostgreSQL..."
apt install postgresql postgresql-contrib -y

# Instalar PM2
echo "⚙️ Instalando PM2..."
npm install pm2 -g

# Crear directorio de aplicación
echo "📁 Preparando directorio de aplicación..."
mkdir -p /var/www/thecookflow
cd /var/www/thecookflow

# Extraer aplicación
echo "📦 Extrayendo aplicación..."
tar -xzf /tmp/thecookflow-codigo-completo-final.tar.gz --strip-components=1

# Instalar dependencias
echo "📚 Instalando dependencias..."
npm install --production

# Crear build de producción
echo "🔨 Generando build de producción..."
npm run build

# Configurar PostgreSQL
echo "🗄️ Configurando base de datos..."
# Generar contraseña segura para la base de datos
DB_PASSWORD=$(openssl rand -base64 32)
sudo -u postgres psql << ENDPG
CREATE USER thecookflow WITH PASSWORD '$DB_PASSWORD';
CREATE DATABASE thecookflow OWNER thecookflow;
GRANT ALL PRIVILEGES ON DATABASE thecookflow TO thecookflow;
\q
ENDPG

# Guardar la contraseña en un archivo seguro
echo "🔐 Guardando credenciales de base de datos..."
echo "DATABASE_PASSWORD=$DB_PASSWORD" > /root/.thecookflow_db_creds
chmod 600 /root/.thecookflow_db_creds
echo "✅ Contraseña de base de datos guardada en: /root/.thecookflow_db_creds"

# Crear directorio de logs
mkdir -p logs

# Configurar firewall
echo "🔥 Configurando firewall..."
ufw --force enable
ufw allow ssh
ufw allow 80
ufw allow 443
ufw allow from 127.0.0.1 to any port 5000

echo "✅ Instalación completada. Configure las variables de entorno antes de iniciar."
echo "📝 Archivo de configuración: /var/www/thecookflow/.env"

ENDSSH

echo "🎉 Despliegue base completado!"
echo ""
echo "🔑 PRÓXIMOS PASOS:"
echo "1. Conectar al servidor: ssh $SERVER"
echo "2. Ir al directorio: cd $APP_DIR"
echo "3. Configurar variables de entorno: nano .env"
echo "4. Iniciar aplicación: pm2 start ecosystem.config.js --env production"
echo ""
echo "📋 Variables de entorno requeridas:"
echo "   DATABASE_URL=postgresql://thecookflow:[ver /root/.thecookflow_db_creds]@localhost:5432/thecookflow"
echo "   OPENAI_API_KEY=tu-clave-openai"
echo "   PERPLEXITY_API_KEY=tu-clave-perplexity"
echo "   SESSION_SECRET=\$(openssl rand -base64 32)"
echo "   JWT_SECRET=\$(openssl rand -base64 32)"
echo "   ALLOWED_ORIGINS=https://$DOMAIN,https://www.$DOMAIN"
echo ""
echo "🔐 Credenciales de base de datos guardadas en: /root/.thecookflow_db_creds"