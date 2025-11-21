# 🚀 INSTRUCCIONES ESPECÍFICAS - DESPLIEGUE EN TU VPS

## Servidor: root@85.31.238.204

### 📋 EJECUTAR DESDE TU TERMINAL LOCAL:

#### 1. DESCARGAR EL CÓDIGO COMPLETO
```bash
# Descargar desde Replit el archivo: thecookflow-codigo-completo-final.tar.gz
# Tamaño: 28M
```

#### 2. SUBIR CÓDIGO AL SERVIDOR
```bash
scp thecookflow-codigo-completo-final.tar.gz root@85.31.238.204:/tmp/
# Confirmar con "yes" cuando pida verificar fingerprint
```

#### 3. CONECTAR AL SERVIDOR Y CONFIGURAR
```bash
ssh root@85.31.238.204
```

#### 4. UNA VEZ DENTRO DEL SERVIDOR, EJECUTAR:

##### a) Actualizar Sistema
```bash
apt update && apt upgrade -y
```

##### b) Instalar Node.js 18
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs
```

##### c) Instalar PostgreSQL
```bash
apt install postgresql postgresql-contrib -y
```

##### d) Instalar PM2
```bash
npm install pm2 -g
```

##### e) Crear Directorio y Extraer Aplicación
```bash
mkdir -p /var/www/thecookflow
cd /var/www/thecookflow
tar -xzf /tmp/thecookflow-codigo-completo-final.tar.gz --strip-components=1
```

##### f) Instalar Dependencias y Build
```bash
npm install --production
npm run build
```

##### g) Configurar PostgreSQL
```bash
sudo -u postgres psql
```
```sql
CREATE USER thecookflow WITH PASSWORD 'TcF2024#Secure';
CREATE DATABASE thecookflow OWNER thecookflow;
GRANT ALL PRIVILEGES ON DATABASE thecookflow TO thecookflow;
\q
```

##### h) Configurar Variables de Entorno
```bash
# Generar secretos seguros
SESSION_SECRET=$(openssl rand -base64 32)
JWT_SECRET=$(openssl rand -base64 32)

# Crear archivo .env
cat > .env << EOF
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://thecookflow:TcF2024#Secure@localhost:5432/thecookflow
OPENAI_API_KEY=sk-tu-clave-openai-real-aqui
PERPLEXITY_API_KEY=pplx-tu-clave-perplexity-real-aqui
SESSION_SECRET=$SESSION_SECRET
JWT_SECRET=$JWT_SECRET
GOOGLE_PLAY_PUBLIC_KEY=tu-clave-google-play
GOOGLE_PLAY_PACKAGE_NAME=com.cookflow.app
ALLOWED_ORIGINS=https://tu-dominio.com,https://www.tu-dominio.com
VITE_ADSENSE_CLIENT_ID=ca-pub-tu-publisher-id
VITE_ENABLE_CMP=true
EOF
```

##### i) Editar Variables de Entorno Reales
```bash
nano .env
# CAMBIAR:
# - OPENAI_API_KEY (obligatorio)
# - PERPLEXITY_API_KEY (obligatorio)
# - ALLOWED_ORIGINS (tu dominio real)
# - GOOGLE_PLAY_PUBLIC_KEY (para Android)
```

##### j) Crear Directorio de Logs
```bash
mkdir -p logs
```

##### k) Configurar Firewall
```bash
ufw --force enable
ufw allow ssh
ufw allow 80
ufw allow 443
ufw allow from 127.0.0.1 to any port 5000
```

##### l) Iniciar Aplicación
```bash
pm2 start ecosystem.config.js --env production
pm2 startup
pm2 save
```

##### m) Verificar que Funciona
```bash
curl http://localhost:5000/api/health
# Debería retornar: {"ok":true,"env":"replit","timestamp":"..."}

pm2 status
pm2 logs thecookflow
```

### 🔍 VERIFICACIONES FINALES:

#### En el servidor:
```bash
# Ver estado de la aplicación
pm2 monit

# Ver logs en tiempo real
pm2 logs thecookflow --lines 50

# Verificar base de datos
sudo -u postgres psql -d thecookflow -c "\dt"

# Verificar puerto 5000
netstat -tlnp | grep 5000
```

#### Desde tu navegador local:
```bash
# Reemplazar con la IP de tu servidor
curl http://85.31.238.204:5000/api/health
```

### 🌐 CONFIGURAR DOMINIO (Opcional):

Si tienes un dominio, configura DNS A record apuntando a `85.31.238.204`:
- `tu-dominio.com` → `85.31.238.204`
- `www.tu-dominio.com` → `85.31.238.204`

Luego instala SSL con Let's Encrypt:
```bash
apt install certbot -y
certbot certonly --standalone -d tu-dominio.com -d www.tu-dominio.com
```

### ✅ RESULTADO FINAL:

- ✅ Aplicación ejecutándose en puerto 5000
- ✅ PostgreSQL configurado
- ✅ PM2 manejando procesos
- ✅ Firewall configurado
- ✅ Deep Links funcionando (/.well-known/assetlinks.json)
- ✅ API endpoints disponibles

**URLs de verificación:**
- http://85.31.238.204:5000/api/health
- http://85.31.238.204:5000/.well-known/assetlinks.json

### 🆘 SOLUCIÓN DE PROBLEMAS:

**Error de conexión a base de datos:**
```bash
sudo systemctl restart postgresql
sudo -u postgres psql -d thecookflow -c "SELECT version();"
```

**Aplicación no inicia:**
```bash
pm2 logs thecookflow --lines 100
pm2 restart thecookflow
```

**Puerto no disponible:**
```bash
sudo netstat -tlnp | grep 5000
sudo lsof -i :5000
```

¡Tu aplicación TheCookFlow estará funcionando en tu VPS! 🎉