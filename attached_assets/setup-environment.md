
# Configuración del Entorno

Para que el sistema funcione correctamente, necesitas configurar estas variables de entorno:

## Variables Requeridas

### 1. PERPLEXITY_API_KEY
- Ve a [Perplexity AI](https://www.perplexity.ai/settings/api)
- Crea una cuenta y obtén tu API key
- En Replit, ve a Secrets (🔒) en la barra lateral
- Añade: `PERPLEXITY_API_KEY` = `tu_api_key_aquí`

### 2. REPLIT_DB_URL
- Esta variable se configura automáticamente por Replit
- No necesitas hacer nada, se genera automáticamente

### 3. SECRET_KEY (Opcional)
- Clave secreta para JWT tokens
- En Replit, ve a Secrets (🔒) en la barra lateral
- Añade: `SECRET_KEY` = `una_clave_secreta_muy_segura_aqui`
- Si no se configura, se usará una por defecto

## Uso del Sistema

1. Los usuarios completan el cuestionario
2. Las respuestas se envían a Perplexity AI para generar menús personalizados
3. Los menús se guardan en la base de datos de Replit con un ID único por usuario
4. Los usuarios pueden acceder a sus menús usando su ID único

## Características

- ✅ **Sistema de autenticación completo**: Registro y login seguro
- ✅ **Base de datos única por usuario**: Cada usuario tiene su propio espacio
- ✅ **Generación de menús con IA**: Integración con Perplexity AI
- ✅ **Persistencia de datos**: Los menús se guardan automáticamente
- ✅ **Seguridad**: Contraseñas hasheadas y tokens JWT
- ✅ **Lista de compra automática**: Generada con cada menú
- ✅ **Estimación de costos**: Calculada según presupuesto
- ✅ **Respaldo local**: Si falla la IA, menú de respaldo
- ✅ **Interfaz responsive**: Funciona en móvil y escritorio

## Flujo del Sistema

1. **Registro/Login**: El usuario se registra o inicia sesión
2. **Base de datos personal**: Se crea un espacio único para cada usuario
3. **Cuestionario**: El usuario completa sus preferencias
4. **Generación IA**: Perplexity genera un menú personalizado
5. **Almacenamiento**: El menú se guarda en la base de datos del usuario
6. **Acceso futuro**: El usuario puede recuperar sus menús guardados
