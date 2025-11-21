# 🚀 Guía de Despliegue VPS - TheCookFlow

## 📋 Prerrequisitos en tu VPS

### 1. Sistema Operativo
- Ubuntu 20.04+ / Debian 11+ / CentOS 8+
- Mínimo 2GB RAM, 20GB SSD
- Acceso root o sudo

### 2. Software Requerido
```bash
# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalar PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# Instalar PM2 globalmente
sudo npm install pm2 -g

# Instalar Docker (Opcional - para método Docker)
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
```

## 🔧 Método 1: Despliegue con PM2 (Recomendado)

### Paso 1: Clonar y Preparar la Aplicación
```bash
# Subir archivos de tu aplicación al VPS
# Puedes usar SCP, SFTP, Git, etc.
scp -r /ruta/local/thecookflow usuario@tu-vps:/home/usuario/

# En el VPS
cd /home/usuario/thecookflow
npm install --production
```

### Paso 2: Configurar Base de Datos
```bash
# Crear usuario y base de datos PostgreSQL
sudo -u postgres psql

CREATE USER thecookflow WITH PASSWORD 'tu_password_seguro';
CREATE DATABASE thecookflow OWNER thecookflow;
GRANT ALL PRIVILEGES ON DATABASE thecookflow TO thecookflow;
\q
```

### Paso 3: Configurar Variables de Entorno
```bash
# Crear archivo de variables de entorno
nano .env

# Agregar estas variables (OBLIGATORIAS):
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://thecookflow:tu_password_seguro@localhost:5432/thecookflow

# CLAVES API (OBLIGATORIAS)
OPENAI_API_KEY=sk-tu-clave-openai-aqui
PERPLEXITY_API_KEY=pplx-tu-clave-perplexity-aqui

# SEGURIDAD (Generar con: openssl rand -base64 32)
SESSION_SECRET=tu-secreto-32-caracteres-aqui
JWT_SECRET=tu-jwt-secreto-32-caracteres-aqui

# GOOGLE PLAY (Para la app Android)
GOOGLE_PLAY_PUBLIC_KEY=tu-clave-publica-google-play
GOOGLE_PLAY_PACKAGE_NAME=com.cookflow.app

# DOMINIO (CRÍTICO - Reemplazar con tu dominio)
ALLOWED_ORIGINS=https://tudominio.com,https://www.tudominio.com

# OPCIONAL: Monetización con AdSense
VITE_ADSENSE_CLIENT_ID=ca-pub-tu-publisher-id
VITE_ENABLE_CMP=true
```

### Paso 4: Generar Secretos de Seguridad
```bash
# Generar secretos seguros
echo "SESSION_SECRET=$(openssl rand -base64 32)"
echo "JWT_SECRET=$(openssl rand -base64 32)"
```

### Paso 5: Crear Directorio de Logs
```bash
mkdir -p logs
```

### Paso 6: Iniciar con PM2
```bash
# Verificar que todos los archivos estén listos
ls -la dist/

# Iniciar la aplicación
pm2 start ecosystem.config.js --env production

# Verificar que está funcionando
pm2 status
pm2 logs thecookflow

# Configurar PM2 para auto-inicio
pm2 startup
pm2 save
```

## 🐳 Método 2: Despliegue con Docker

### Paso 1: Preparar el Proyecto
```bash
# En tu servidor VPS
cd /home/usuario/thecookflow

# Crear archivo .env con las variables de entorno (igual que el Método 1)
nano .env
```

### Paso 2: Generar Certificados SSL
```bash
# Crear directorio SSL
mkdir -p ssl

# Opción A: Certificados Let's Encrypt (Recomendado)
sudo apt install certbot -y
sudo certbot certonly --standalone -d tudominio.com -d www.tudominio.com

# Copiar certificados
sudo cp /etc/letsencrypt/live/tudominio.com/fullchain.pem ssl/
sudo cp /etc/letsencrypt/live/tudominio.com/privkey.pem ssl/
sudo chown -R $USER:$USER ssl/

# Opción B: Certificados autofirmados (Solo para testing)
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout ssl/privkey.pem -out ssl/fullchain.pem
```

### Paso 3: Configurar Nginx
```bash
# Editar nginx.conf con tu dominio
nano nginx.conf

# Reemplazar "your-domain.com" con tu dominio real
sed -i 's/your-domain.com/tudominio.com/g' nginx.conf
```

### Paso 4: Iniciar con Docker Compose
```bash
# Construir e iniciar todos los servicios
docker-compose -f docker-compose.prod.yml up -d

# Verificar que todo está funcionando
docker-compose -f docker-compose.prod.yml ps
docker-compose -f docker-compose.prod.yml logs thecookflow
```

## 🔍 Verificación del Despliegue

### 1. Salud del Servidor
```bash
# Verificar que la aplicación responde
curl http://localhost:5000/api/health

# Debería retornar: {"ok":true,"env":"replit","timestamp":"..."}
```

### 2. Verificar Base de Datos
```bash
# Conectar a PostgreSQL y verificar tablas
sudo -u postgres psql -d thecookflow -c "\dt"
```

### 3. Verificar Logs
```bash
# PM2
pm2 logs thecookflow

# Docker
docker-compose -f docker-compose.prod.yml logs thecookflow
```

### 4. Verificar Enlaces Profundos (App Links)
```bash
# Verificar que assetlinks.json está disponible
curl https://tudominio.com/.well-known/assetlinks.json
```

## 🔥 Firewall y Seguridad

### Configurar UFW (Ubuntu Firewall)
```bash
# Habilitar firewall básico
sudo ufw enable

# Permitir SSH
sudo ufw allow ssh

# Permitir HTTP y HTTPS
sudo ufw allow 80
sudo ufw allow 443

# Para PM2 (puerto 5000 solo localmente)
sudo ufw allow from 127.0.0.1 to any port 5000

# Verificar estado
sudo ufw status
```

## 🔄 Mantenimiento y Updates

### PM2 - Actualizar la Aplicación
```bash
# Detener aplicación
pm2 stop thecookflow

# Actualizar código (git pull, scp, etc.)
git pull origin main  # Si usas Git

# Reconstruir
npm run build

# Reiniciar
pm2 start ecosystem.config.js --env production
```

### Docker - Actualizar la Aplicación
```bash
# Reconstruir imagen
docker-compose -f docker-compose.prod.yml build thecookflow

# Reiniciar servicios
docker-compose -f docker-compose.prod.yml up -d
```

### Monitoreo Básico
```bash
# Ver estado de la aplicación
pm2 monit  # Para PM2
docker stats  # Para Docker

# Verificar uso de recursos
htop
df -h
free -h
```

## 🆘 Solución de Problemas

### Error: "Cannot connect to database"
```bash
# Verificar que PostgreSQL está ejecutándose
sudo systemctl status postgresql

# Verificar conexión de red
sudo netstat -tlnp | grep 5432

# Verificar permisos de base de datos
sudo -u postgres psql -c "\du"
```

### Error: "Application not starting"
```bash
# Verificar logs detallados
pm2 logs thecookflow --lines 100

# Verificar variables de entorno
pm2 env 0

# Verificar archivos de build
ls -la dist/
```

### Error: "SSL Certificate issues"
```bash
# Verificar certificados
sudo certbot certificates

# Renovar certificados
sudo certbot renew --dry-run

# Verificar configuración Nginx
sudo nginx -t
```

## ✅ Checklist Final

- [ ] ✅ Node.js 18+ instalado
- [ ] ✅ PostgreSQL configurado y funcionando
- [ ] ✅ Variables de entorno configuradas (especialmente API keys)
- [ ] ✅ Build de producción generado (`npm run build`)
- [ ] ✅ Firewall configurado (puertos 80, 443 abiertos)
- [ ] ✅ SSL/HTTPS configurado
- [ ] ✅ Dominio apuntando al VPS
- [ ] ✅ assetlinks.json accesible en /.well-known/assetlinks.json
- [ ] ✅ PM2 o Docker funcionando correctamente
- [ ] ✅ Aplicación responde en https://tudominio.com
- [ ] ✅ Health check retorna OK: /api/health

## 🎯 URLs Importantes Después del Despliegue

- **Frontend**: https://tudominio.com
- **Health Check**: https://tudominio.com/api/health  
- **App Links**: https://tudominio.com/.well-known/assetlinks.json
- **Admin Panel**: https://tudominio.com/admin (si tienes acceso)

¡Tu aplicación TheCookFlow estará lista y funcionando en tu VPS! 🎉