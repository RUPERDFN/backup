# Security Middleware Documentation

## Overview

Este módulo implementa middlewares de seguridad críticos para el servidor Express de TheCookFlow, siguiendo las mejores prácticas de la industria.

## Componentes Implementados

### 1. Rate Limiting (`apiRateLimit`)
**Función**: Previene ataques DoS limitando requests por IP
**Configuración**: 100 requests/15 minutos para rutas `/api/*`
**Desarrollo**: Bypass automático para localhost

### 2. CORS Configuration (`corsOptions`)
**Función**: Control de orígenes permitidos
**Configuración**: Variable `ALLOWED_ORIGINS` en .env
**Seguridad**: Validación dinámica + credenciales habilitadas

### 3. Helmet/CSP (`getHelmetConfig`)
**Función**: Headers de seguridad + Content Security Policy
**Nonce**: Generado dinámicamente por respuesta
**Producción**: CSP estricto activado solo en production

### 4. Input Sanitization (`sanitizeInput`)
**Función**: Validación y escape de inputs
**Librerías**: express-validator
**Respuesta**: Formato JSON consistente

### 5. Error Handling (`globalErrorHandler`)
**Función**: Manejo global de errores con logging
**Desarrollo**: Stack traces incluidos
**Producción**: Detalles ocultos para seguridad

## Uso

```typescript
import {
  apiRateLimit,
  corsOptions,
  getHelmetConfig,
  nonceMiddleware,
  globalErrorHandler,
  notFoundHandler
} from './middleware/security';

// Aplicar en orden específico
app.use(cors(corsOptions));
app.use(nonceMiddleware);
app.use(getHelmetConfig);
app.use('/api/', apiRateLimit);
app.use(globalErrorHandler); // Debe ser el último
```

## Variables de Entorno

```bash
NODE_ENV=production|development
SESSION_SECRET=your-session-secret
ALLOWED_ORIGINS=https://domain1.com,https://domain2.com
```

## Testing

Los middlewares incluyen tests comprehensivos con Vitest:

```bash
npx vitest run tests/security.test.ts
```

## Seguridad Por Capas

1. **Network Layer**: Rate limiting + CORS
2. **Application Layer**: CSP + Input validation  
3. **Data Layer**: Session security + Error handling
4. **Logging Layer**: Security event logging

Esta arquitectura proporciona defensa en profundidad contra ataques comunes.