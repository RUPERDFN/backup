# TheCookFlow API (Replit)

API backend simplificada para TheCookFlow con servicios de IA, billing freemium y manejo de imágenes.

## 🚀 Comandos Rápidos

```bash
# Instalar dependencias
npm i

# Iniciar servidor (desarrollo)
npm run dev

# Iniciar servidor (producción)
npm start

# Ejecutar tests QA
npm run qa:api
```

## 📋 Configuración

### Variables de Entorno

Copiar `.env.example` a `.env` y configurar:

```bash
OPENAI_API_KEY=         # Clave API de OpenAI (opcional, usa mock si no existe)
PERPLEXITY_API_KEY=     # Clave API de Perplexity (opcional)
PORT=3000               # Puerto del servidor
ALLOWED_ORIGINS=http://localhost:5173,https://app.thecookflow.com,https://thecookflow.com
UPLOAD_DIR=./uploads    # Directorio para imágenes subidas
BILLING_PROVIDER=play   # Proveedor de billing
```

### Secrets en Replit

En **Replit → Secrets**, añadir:
- `ALLOWED_ORIGINS` = `https://app.thecookflow.com,https://thecookflow.com,http://localhost:5173`
- `OPENAI_API_KEY` (opcional, para usar IA real)
- `UPLOAD_DIR` = `./uploads`

## 🔌 API Endpoints

### Health Check
```bash
curl http://localhost:3000/api/health
# Respuesta: { "ok": true, "ts": 1234567890, "env": "dev" }
```

### Chef IA (Generación de Recetas)
```bash
curl -X POST http://localhost:3000/api/chef \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "menú vegetariano para 2 personas",
    "alergias": ["gluten"],
    "presupuesto": 15,
    "tiempo": 30,
    "imageUrl": "/uploads/nevera.jpg"
  }'
# Respuesta: { "result": "🍽️ Menú sugerido..." }
```

### Billing - Verificar Compra
```bash
curl -X POST http://localhost:3000/api/billing/verify \
  -H "Content-Type: application/json" \
  -d '{"userId":"u1","purchaseToken":"xyzOK"}'
# Respuesta: { "active": true, "plan": "pro" }
```

### Billing - Estado Suscripción
```bash
curl "http://localhost:3000/api/subscription-status?userId=u1"
# Respuesta: { "active": true, "plan": "pro", "updatedAt": 1234567890 }
```

### Upload de Imagen
```bash
curl -X POST http://localhost:3000/api/upload \
  -F "file=@nevera.jpg"
# Respuesta: { "imageUrl": "/uploads/1234567890-abc123.jpg" }
```

## 🔐 Seguridad

### Características Implementadas
- **CORS restrictivo**: Solo dominios configurados en `ALLOWED_ORIGINS`
- **Rate Limiting**: 
  - 100 requests/15min para `/api/*`
  - 30 requests/15min para `/api/chef`
- **Helmet CSP**: Content Security Policy configurado
- **Sanitización**: Prompts limitados a 2500 caracteres
- **Validación de uploads**: Solo imágenes <4MB (jpeg/png/webp)

### Headers Permitidos
- `Content-Type`, `Accept`
- `x-utm-source`, `x-utm-medium`, `x-utm-campaign`

## 🧪 Testing & QA

### Script Automático
```bash
npm run qa:api
```

Verifica:
- ✅ `/api/health` responde `{ok:true}`
- ✅ `/api/billing/verify` activa PRO con token que termina en "OK"
- ✅ `/api/subscription-status` devuelve estado correcto

### Tests Manuales
```bash
# 1. Health check
curl http://localhost:3000/api/health

# 2. Activar suscripción PRO
curl -X POST http://localhost:3000/api/billing/verify \
  -H "Content-Type: application/json" \
  -d '{"userId":"testuser","purchaseToken":"testOK"}'

# 3. Verificar estado
curl "http://localhost:3000/api/subscription-status?userId=testuser"

# 4. Generar receta (mock)
curl -X POST http://localhost:3000/api/chef \
  -H "Content-Type: application/json" \
  -d '{"prompt":"pasta rápida"}'
```

## 📱 Integración WebApp

### Bridge JavaScript (`public/tcf-bridge.js`)

Incluir en tu WebApp:

```html
<script src="/tcf-bridge.js"></script>
```

### API del Bridge

```javascript
// Obtener userId (Android o localStorage)
const userId = window.tcf.getUserId();

// Consultar estado de suscripción
const status = await window.tcf.status();
console.log(status); // { active: true, plan: 'pro' }

// Abrir pantalla de suscripción
window.tcf.openSubscription(); // Android: abre billing, Web: redirige a Play Store

// Activar modo PRO (ocultar ads en Android)
window.tcf.setPro(true);

// Escuchar deeplink de compra
window.addEventListener('tcf:deeplink', async (e) => {
  const { userId, token } = e.detail;
  // Verificación automática...
});
```

## 🎯 Sistema Freemium

### Plan FREE
- 3 usos diarios de `/api/chef`
- Control por localStorage: `chef_count_YYYYMMDD`
- Modal paywall al superar límite

### Plan PRO
- Usos ilimitados de `/api/chef`
- Sin publicidad (Android)
- Verificado por `purchaseToken` que termina en "OK"

### Flujo de Verificación

1. Usuario compra en Android
2. App envía `purchaseToken` a `/api/billing/verify`
3. Si token termina en "OK" → activa PRO en memoria
4. WebApp consulta `/api/subscription-status?userId=...`
5. Si `active:true` → desbloquea features y llama `tcf.setPro(true)`

## 📂 Estructura del Proyecto

```
.
├── api/
│   ├── server/               # API Express principal
│   │   ├── index.js
│   │   ├── middleware/
│   │   │   └── security.js   # Sanitización y seguridad
│   │   └── services/
│   │       ├── ai.js         # Servicio IA (OpenAI/mock)
│   │       └── billing.js    # Sistema freemium
│   └── server-microservice/  # Microservicio de monetización
├── public/
│   └── tcf-bridge.js         # Bridge WebApp ↔ Android
├── tools/qa/
│   └── health-check.js       # Tests automáticos
├── uploads/                  # Imágenes subidas (gitignored)
├── .env.example              # Variables de entorno template
├── .replit                   # Config auto-start Replit
└── package.json              # Dependencias y scripts
```

## 🔄 Workflow de Desarrollo

1. **Setup inicial**:
   ```bash
   npm i
   cp .env.example .env
   # Editar .env con tus valores
   ```

2. **Desarrollo**:
   ```bash
   npm run dev
   # API en http://localhost:3000
   ```

3. **Testing**:
   ```bash
   npm run qa:api
   ```

4. **Producción** (Replit):
   - Configurar Secrets
   - Click en Run (usa `.replit` automáticamente)

## ✅ Checklist de Validación (R11)

- [x] `/api/health` responde `{ok:true}`
- [x] `/api/billing/verify` con token "...OK" activa PRO
- [x] `/api/subscription-status` refleja estado correcto
- [x] `/api/upload` acepta imagen <4MB y devuelve `{imageUrl}`
- [x] CORS permite requests desde `https://app.thecookflow.com`
- [x] `tcf.getUserId()` funciona (Android/localStorage)
- [x] `tcf.openSubscription()` abre billing o Play Store
- [x] `tcf.setPro(true)` oculta anuncios en Android

## 📚 Documentación Adicional

- **PROMPT R0-R11**: Ver archivo adjunto con especificaciones completas
- **Seguridad**: Ver [`api/server/middleware/security.js`](api/server/middleware/security.js)
- **Servicios**: Ver [`api/server/services/`](api/server/services/)

---

**TheCookFlow API** - Backend simplificado para app culinaria con IA 🍳
