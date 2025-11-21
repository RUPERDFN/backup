# INSTRUCCIONES COMPLETAS PARA SUBIR THECOOKFLOW A GOOGLE PLAY STORE

## PREPARACIÓN PREVIA

### 1. Cuenta de Desarrollador de Google Play
- Crear cuenta en [Google Play Console](https://play.google.com/console)
- Pagar tarifa única de $25 USD
- Verificar identidad y completar perfil de desarrollador

### 2. Compilar el APK
```bash
# Desde el directorio android/
chmod +x build_scripts/build_apk.sh
./build_scripts/build_apk.sh
```

**Archivos generados:**
- `play_store_assets/thecookflow-v1.0.0.apk` (APK firmado)
- Keystore de firma en `android/app/thecookflow-release-key.keystore`

## PASO A PASO EN GOOGLE PLAY CONSOLE

### PASO 1: Crear Nueva Aplicación
1. Ir a [Google Play Console](https://play.google.com/console)
2. Click en "Crear aplicación"
3. Completar información básica:
   - **Nombre:** TheCookFlow - Menús con IA
   - **Idioma predeterminado:** Español (España)
   - **Tipo de aplicación:** App
   - **Gratis o de pago:** Gratis (con compras in-app)

### PASO 2: Configurar Ficha de Play Store

#### 2.1 Detalles de la aplicación
- **Título:** TheCookFlow - Menús con IA
- **Descripción corta:** Planifica menús semanales personalizados con inteligencia artificial y genera listas de compra automáticas
- **Descripción completa:** [Copiar desde `google_play_listing.md`]

#### 2.2 Assets gráficos (usar archivos generados)
- **Icono de aplicación:** `play_store_assets/ic_launcher_512.png` (512x512)
- **Gráfico de funciones:** `play_store_assets/feature_graphic.png` (1024x500)
- **Capturas de pantalla del teléfono:**
  - `play_store_assets/screenshots/screenshot_1.png`
  - `play_store_assets/screenshots/screenshot_2.png`

#### 2.3 Categorización
- **Categoría:** Casa y hogar
- **Etiquetas:** Comida y bebida, Productividad, Estilo de vida

#### 2.4 Información de contacto
- **Sitio web:** https://thecookflow.com
- **Email:** soporte@thecookflow.com
- **Política de privacidad:** https://thecookflow.com/politica-privacidad

### PASO 3: Configurar Contenido de la App

#### 3.1 Clasificación de contenido
1. Completar cuestionario de clasificación
2. Seleccionar "Apto para toda la familia"
3. Sin anuncios dirigidos a menores

#### 3.2 Público objetivo
- **Grupo de edad principal:** 18-65 años
- **Audiencia secundaria:** Familias con niños mayores de 13 años

#### 3.3 Permisos de aplicación
Explicar uso de permisos sensibles:
- **Internet:** Generación de menús con IA
- **Almacenamiento:** Guardar preferencias y menús
- **Cámara:** Reconocimiento de alimentos (opcional)

### PASO 4: Configurar Monetización

#### 4.1 Productos in-app
1. Crear producto de suscripción:
   - **ID del producto:** `premium_monthly`
   - **Nombre:** Suscripción Premium Mensual
   - **Descripción:** Acceso completo a todas las funciones premium
   - **Precio:** €1.99/mes
   - **Período de prueba gratuita:** 7 días
   - **Facturación:** Mensual

#### 4.2 Configurar Google Play Billing
- Agregar cuenta bancaria para pagos
- Configurar información fiscal
- Establecer precios por país

### PASO 5: Subir APK/Bundle

#### 5.1 Crear nueva versión
1. Ir a "Gestión de versiones" > "Versiones de la app"
2. Seleccionar "Pista de producción"
3. Click en "Crear versión"

#### 5.2 Subir archivo
- Subir `play_store_assets/thecookflow-v1.0.0.apk`
- Verificar que no haya errores de validación

#### 5.3 Notas de la versión
```
Versión 1.0.0 - Lanzamiento inicial

🎉 ¡Bienvenido a TheCookFlow!

• Generación de menús con IA OpenAI y Perplexity
• Planificación semanal completamente personalizable  
• Lista de compras automática con precios estimados
• Integración directa con Amazon Fresh España
• 7 días de prueba premium totalmente gratis
• Interfaz optimizada para móviles
• Soporte completo para dietas especiales

¡Transforma tu forma de cocinar con la inteligencia artificial!
```

### PASO 6: Configuraciones Avanzadas

#### 6.1 Distribución por países
- **Países disponibles:** España, México, Argentina, Colombia, Chile, Perú
- **Restricciones:** Ninguna específica

#### 6.2 Configuración de dispositivos
- **Versión mínima de Android:** 7.0 (API 24)
- **Arquitecturas:** ARM, ARM64, x86, x86_64
- **Densidades de pantalla:** Todas

#### 6.3 Configuración de usuarios
- **Límite de edad:** 13+ (por características de pago)
- **Contenido generado por usuarios:** No aplica

### PASO 7: Revisión y Publicación

#### 7.1 Lista de verificación pre-publicación
- [ ] Todos los assets gráficos subidos
- [ ] Descripciones completas en español
- [ ] Política de privacidad accesible
- [ ] Información de contacto correcta
- [ ] Suscripción configurada correctamente
- [ ] APK sin errores de validación
- [ ] Permisos explicados adecuadamente

#### 7.2 Enviar para revisión
1. Revisar toda la información
2. Click en "Enviar para revisión"
3. Esperar aprobación (2-7 días hábiles)

#### 7.3 Después de la aprobación
- La app estará disponible en Play Store
- Configurar alertas de reseñas y comentarios
- Monitorear métricas de instalación

## HERRAMIENTAS DE SEGUIMIENTO

### Métricas importantes a monitorear:
- **Instalaciones diarias/semanales**
- **Retención de usuarios (1, 7, 30 días)**
- **Conversión a suscripción premium**
- **Calificación promedio de la app**
- **Comentarios y reseñas**

### Google Play Console Analytics:
- Estadísticas de adquisición
- Rendimiento financiero
- Informes de vitalidad de la app
- Feedback de usuarios

## NOTAS IMPORTANTES

### Tiempos de revisión:
- **Primera publicación:** 2-7 días
- **Actualizaciones:** 1-3 días
- **Cambios en metadatos:** 1-2 días

### Mejores prácticas:
- Responder a todas las reseñas
- Actualizar regularmente con mejoras
- Mantener política de privacidad actualizada
- Monitorear crashes y errores
- Optimizar ASO (App Store Optimization)

### Contactos de soporte:
- **Soporte técnico:** [Google Play Console Help](https://support.google.com/googleplay/android-developer)
- **Política de contenido:** [Políticas para desarrolladores](https://support.google.com/googleplay/android-developer/answer/4430948)

---

**¡IMPORTANTE!** Mantener backup del keystore (`thecookflow-release-key.keystore`) - sin él no podrás actualizar la app en el futuro.