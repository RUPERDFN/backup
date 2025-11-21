#!/bin/bash
# TheCookFlow - Database Setup Script

set -e

SERVER_IP="85.31.238.204"
SERVER_USER="root"
APP_DIR="/opt/thecookflow"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
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

print_status "Configurando base de datos PostgreSQL..."

# Configurar PostgreSQL para producción
ssh_exec "sudo -u postgres psql -c \"ALTER USER thecookflow WITH SUPERUSER;\""

print_status "Ejecutando migraciones de Drizzle..."
ssh_exec "cd $APP_DIR && npm run db:push"

print_status "Insertando datos iniciales..."
ssh_exec "sudo -u postgres psql -d thecookflow << 'EOF'
-- Insertar usuario demo para testing
INSERT INTO users (id, email, first_name, last_name, provider, is_email_verified, is_premium, subscription_status, created_at, updated_at)
VALUES ('demo-user-001', 'demo@thecookflow.com', 'Usuario', 'Demo', 'email', true, false, 'trial', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Insertar algunas recetas de ejemplo
INSERT INTO recipes (id, name, description, ingredients, instructions, cooking_time, servings, difficulty, cost, category, user_id, created_at, updated_at)
VALUES 
('recipe-001', 'Paella Valenciana', 'Auténtica paella valenciana con pollo, conejo y judías.', 
 '[\"400g arroz bomba\",\"1 pollo troceado\",\"500g judías verdes\",\"200g garrofón\",\"2 tomates rallados\",\"Pimentón dulce\",\"Azafrán\",\"Aceite de oliva\",\"Sal\"]',
 '[\"Calentar aceite en paellera\",\"Dorar el pollo\",\"Añadir verduras\",\"Incorporar tomate y especias\",\"Añadir arroz y caldo\",\"Cocinar 20 minutos sin remover\"]',
 35, 6, 'intermedio', 12.50, 'principales', 'demo-user-001', NOW(), NOW()),
 
('recipe-002', 'Gazpacho Andaluz', 'Refrescante gazpacho andaluz tradicional.',
 '[\"1kg tomates maduros\",\"1 pepino\",\"1 pimiento verde\",\"1 cebolla pequeña\",\"2 dientes ajo\",\"Pan del día anterior\",\"Aceite de oliva virgen\",\"Vinagre de Jerez\",\"Sal\"]',
 '[\"Pelar y trocear las verduras\",\"Remojar el pan\",\"Triturar todos los ingredientes\",\"Colar la mezcla\",\"Ajustar sal y vinagre\",\"Enfriar en nevera\"]',
 15, 4, 'fácil', 4.80, 'entrantes', 'demo-user-001', NOW(), NOW()),
 
('recipe-003', 'Tortilla Española', 'Clásica tortilla española con patatas y cebolla.',
 '[\"6 huevos\",\"4 patatas grandes\",\"1 cebolla mediana\",\"Aceite de oliva\",\"Sal\"]',
 '[\"Pelar y laminar las patatas\",\"Freír patatas y cebolla\",\"Batir los huevos\",\"Mezclar patatas con huevos\",\"Cuajar la tortilla por ambos lados\"]',
 30, 4, 'fácil', 3.20, 'principales', 'demo-user-001', NOW(), NOW())

ON CONFLICT (id) DO NOTHING;

-- Insertar plan de menú demo
INSERT INTO menu_plans (id, user_id, week_start, days, total_recipes, estimated_cost, generated_at, created_at, updated_at)
VALUES ('menu-001', 'demo-user-001', CURRENT_DATE, 7, 21, 58.50, NOW(), NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO thecookflow;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO thecookflow;
EOF"

print_status "Configurando backups automáticos..."
ssh_exec "mkdir -p /opt/backups/thecookflow"

# Crear script de backup
ssh_exec "cat > /opt/backups/thecookflow-backup.sh << 'EOF'
#!/bin/bash
# TheCookFlow Database Backup Script

BACKUP_DIR=/opt/backups/thecookflow
DATE=\$(date +%Y%m%d_%H%M%S)
BACKUP_FILE=\$BACKUP_DIR/thecookflow_backup_\$DATE.sql

# Crear backup
pg_dump -U thecookflow -h localhost thecookflow > \$BACKUP_FILE

# Comprimir backup
gzip \$BACKUP_FILE

# Eliminar backups antiguos (mantener últimos 30 días)
find \$BACKUP_DIR -name \"*.gz\" -mtime +30 -delete

echo \"Backup completed: \$BACKUP_FILE.gz\"
EOF"

ssh_exec "chmod +x /opt/backups/thecookflow-backup.sh"

# Configurar cron para backups diarios
ssh_exec "echo '0 2 * * * /opt/backups/thecookflow-backup.sh' | crontab -"

print_success "Base de datos configurada correctamente!"
print_success "Backups automáticos configurados (diario a las 2:00 AM)"