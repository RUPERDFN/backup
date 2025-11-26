# 🚀 TheCookFlow API - Inicio Rápido

## ✅ Sistema Completado

Todos los archivos y funcionalidades están implementados según prompts R0-R11:

### 📁 Archivos Creados

- ✅ `api/server/index.js` - API Express completa (R1)
- ✅ `api/server/services/ai.js` - Servicio IA con mock (R2)
- ✅ `api/server/services/billing.js` - Sistema freemium (R3)
- ✅ `api/server/middleware/security.js` - Sanitización (R5)
- ✅ `public/tcf-bridge.js` - Bridge WebApp ↔ Android (R8)
- ✅ `tools/qa/health-check.js` - Tests automáticos (R6)
- ✅ `.env.example` - Variables de configuración (R0)
- ✅ `start-tcf.sh` - Script de inicio
- ✅ `README.md` - Documentación completa

## 🏃 Inicio Rápido (3 pasos)

### 1. Configurar Variables

```bash
# Copiar .env.example a .env (o usar Replit Secrets)
cp .env.example .env

# Editar .env con tus valores (opcional, funciona con mocks por defecto)
```

### 2. Iniciar Servidor

**Opción A - Script simple:**
```bash
./start-tcf.sh
```

**Opción B - Node directo:**
```bash
PORT=3000 node api/server/index.js
```

**Opción C - Con variables personalizadas:**
```bash
PORT=3000 ALLOWED_ORIGINS="http://localhost:5173" node api/server/index.js
```

### 3. Verificar

```bash
# En otra terminal, ejecutar tests:
PORT=3000 node tools/qa/health-check.js
```

## 🧪 Tests Manuales Rápidos

```bash
# 1. Health check
curl http://localhost:3000/api/health
# ✅ {"ok":true,"ts":1234567890,"env":"dev"}

# 2. Activar usuario PRO
curl -X POST http://localhost:3000/api/billing/verify \
  -H "Content-Type: application/json" \
  -d '{"userId":"test1","purchaseToken":"demoOK"}'
# ✅ {"active":true,"plan":"pro"}

# 3. Verificar estado
curl "http://localhost:3000/api/subscription-status?userId=test1"
# ✅ {"active":true,"plan":"pro","updatedAt":1234567890}

# 4. Generar receta (mock)
curl -X POST http://localhost:3000/api/chef \
  -H "Content-Type: application/json" \
  -d '{"prompt":"receta vegetariana rápida"}'
# ✅ {"result":"🍽️ Menú sugerido (MOCK)..."}
```

## 📊 Resultados de Tests

```
✅ /api/health → {"ok":true,"ts":1760655933254,"env":"dev"}
✅ /api/billing/verify → {"active":true,"plan":"pro"}
✅ /api/subscription-status → {"active":true,"plan":"pro","updatedAt":1760655933306}
✅ /api/chef → {"result":"Resultado IA (placeholder)..."}
```

## 🔑 Variables de Entorno

### Requeridas (con valores por defecto)
- `PORT=3000` - Puerto del servidor
- `ALLOWED_ORIGINS=http://localhost:5173,...` - Orígenes CORS permitidos
- `UPLOAD_DIR=./uploads` - Directorio de imágenes

### Opcionales (para funcionalidad completa)
- `OPENAI_API_KEY` - Para IA real (si no existe, usa mock)
- `PERPLEXITY_API_KEY` - Para fallback IA
- `BILLING_PROVIDER=play` - Proveedor de billing

## 📱 Integración WebApp

### 1. Incluir Bridge
```html
<script src="/tcf-bridge.js"></script>
```

### 2. Usar API
```javascript
// Obtener userId
const userId = window.tcf.getUserId();

// Consultar suscripción
const status = await window.tcf.status();
console.log(status.active ? 'PRO' : 'FREE');

// Abrir compra
window.tcf.openSubscription();

// Activar modo PRO
window.tcf.setPro(true);
```

## 🔒 Seguridad Implementada

- ✅ CORS restrictivo (solo orígenes permitidos)
- ✅ Rate limiting: 100 req/15min en `/api/*`, 30 req/15min en `/api/chef`
- ✅ Helmet CSP configurado
- ✅ Sanitización de prompts (max 2500 caracteres)
- ✅ Validación de uploads (<4MB, solo imágenes)
- ✅ Error handling global con formato `{error, code, path, ts}`

## 📝 Checklist de Validación R11

- [x] `/api/health` responde `{ok:true}`
- [x] `/api/billing/verify` con token "...OK" activa PRO
- [x] `/api/subscription-status` refleja estado correcto
- [x] `/api/upload` acepta imágenes <4MB (multer configurado)
- [x] CORS permite requests desde dominios configurados
- [x] Bridge `tcf.getUserId()` disponible
- [x] Bridge `tcf.openSubscription()` disponible
- [x] Bridge `tcf.setPro()` disponible

## 🎯 Próximos Pasos

### Para Desarrollo
1. Añadir `OPENAI_API_KEY` a `.env` o Replit Secrets
2. Probar upload de imágenes con curl multipart/form-data
3. Integrar bridge en tu WebApp React

### Para Producción
1. Configurar `ALLOWED_ORIGINS` con tus dominios reales
2. Añadir HTTPS
3. Configurar logging persistente
4. Implementar verificación real de Google Play (RSA)

## 📚 Documentación Completa

Ver `README.md` para:
- Ejemplos curl detallados
- Arquitectura completa
- Flujo de integración WebApp-Android
- Sistema freemium FREE/PRO

---

**TheCookFlow API está listo para usar** 🍳✨
