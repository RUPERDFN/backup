# 🚀 TheCookFlow Android - Guía Rápida Android Studio

## 📋 Pre-requisitos

1. **Android Studio** (Hedgehog 2023.1.1 o superior)
2. **JDK 17** o superior
3. **Archivos de firma** (keystore):
   - `cookflow-release-key.jks` en la raíz del proyecto
   - Contraseñas configuradas en `gradle.properties`

---

## ⚡ Inicio Rápido (5 pasos)

### 1️⃣ Abrir Proyecto
```bash
# En Android Studio:
File > Open > Seleccionar carpeta: android/
```

### 2️⃣ Sincronizar Gradle
- Espera 1-2 minutos mientras Gradle descarga dependencias
- Si ves errores, click en "Sync Now" o "Try Again"

### 3️⃣ Configurar Firma (Release Build)

Crea/edita `android/gradle.properties`:
```properties
MYAPP_UPLOAD_STORE_FILE=../cookflow-release-key.jks
MYAPP_UPLOAD_STORE_PASSWORD=tu_password_keystore
MYAPP_UPLOAD_KEY_ALIAS=cookflow-key-alias
MYAPP_UPLOAD_KEY_PASSWORD=tu_password_key
```

⚠️ **IMPORTANTE**: Nunca subas este archivo a Git. Ya está en `.gitignore`.

### 4️⃣ Compilar APK/AAB

**Opción A - APK (Instalación directa):**
```
Build > Build Bundle(s) / APK(s) > Build APK(s)
```
📍 Ubicación: `android/app/build/outputs/apk/release/app-release.apk`

**Opción B - AAB (Google Play Store):**
```
Build > Generate Signed Bundle / APK > Android App Bundle
```
📍 Ubicación: `android/app/build/outputs/bundle/release/app-release.aab`

### 5️⃣ Instalar y Probar

**En emulador/dispositivo:**
```bash
adb install app-release.apk
```

---

## 🎯 Características Integradas

### ✅ Google Play Billing
- **Suscripción mensual**: €1.99/mes
- **Trial gratuito**: 7 días automático
- **Product ID**: `premium_monthly`
- **Auto-renovación**: Sí

### ✅ AdMob (IDs de Producción)
- **App ID**: `ca-app-pub-7982290772698799~6190992844`
- **Banner**: `ca-app-pub-7982290772698799/7257867786`
- **Interstitial**: `ca-app-pub-7982290772698799/8325501869`
- **App Open**: `ca-app-pub-7982290772698799/2139367466`
- **Native/Rewarded**: `ca-app-pub-7982290772698799/1052967761`

### ✅ JavaScript Bridge
Disponible en WebView:
```javascript
// Android interface
window.Android.getUserId()              // Obtiene userId del sistema
window.Android.setUserId("user123")     // Guarda userId en SharedPreferences
window.Android.isPremium()
window.Android.purchasePremium("monthly")
window.Android.getSubscriptionStatus()

// AdMob interface
window.TCFAdMob.showInterstitial()
window.TCFAdMob.showRewarded("menu_unlock")
```

---

## 🔧 Managers Implementados

### 1. `GooglePlayBillingManager.kt`
- Gestión de suscripciones
- Verificación de compras con backend (OkHttp)
- Auto-conversión después del trial
- Almacenamiento seguro de userId en SharedPreferences

### 2. `AdMobManager.kt`
- Banner, Interstitial, Rewarded, Native ads
- GDPR/UMP compliance automático
- Ocultación para usuarios premium

### 3. `WebViewBridge.kt`
- Comunicación bidireccional JS ↔ Android
- Eventos de suscripción
- Control de anuncios desde web

---

## 📦 Estructura del Proyecto

```
android/
├── app/
│   ├── src/main/
│   │   ├── java/com/cookflow/app/
│   │   │   ├── MainActivity.kt          # Activity principal
│   │   │   ├── GooglePlayBillingManager.kt
│   │   │   ├── AdMobManager.kt
│   │   │   └── WebViewBridge.kt
│   │   ├── res/
│   │   │   ├── layout/activity_main.xml
│   │   │   └── values/admob_config.xml
│   │   └── AndroidManifest.xml
│   ├── build.gradle                     # Configuración IDs
│   └── proguard-rules.pro              # Protección clases
├── build.gradle
└── gradle.properties                    # 🔒 Claves de firma
```

---

## 🐛 Solución de Problemas

### Error: "SDK not found"
```bash
# Configurar SDK path en local.properties:
echo "sdk.dir=/Users/TU_USUARIO/Library/Android/sdk" >> local.properties
```

### Error: "Keystore not found"
Verifica que `cookflow-release-key.jks` esté en la raíz del proyecto (un nivel arriba de `android/`).

### Error: "Gradle sync failed"
```bash
# Limpiar y reconstruir:
Build > Clean Project
Build > Rebuild Project
```

### AdMob no muestra anuncios
- ✅ Verifica que el usuario NO sea premium
- ✅ Usa IDs de prueba para testing (`ca-app-pub-3940256099942544/...`)
- ✅ Espera 1-2 horas para activación de IDs nuevos en AdMob

### JavaScript Bridge no funciona
- ✅ Verifica que `@JavascriptInterface` esté en los métodos
- ✅ Revisa logs: `adb logcat | grep WebViewBridge`
- ✅ Asegúrate que ProGuard no esté ofuscando las clases

---

## 🚀 Publicar en Google Play Store

### 1. Generar AAB firmado
```
Build > Generate Signed Bundle / APK
> Seleccionar: Android App Bundle
> Firmar con: cookflow-release-key.jks
```

### 2. Configurar en Play Console

**Información requerida:**
- ✅ AAB generado
- ✅ Screenshots (1080x1920px)
- ✅ Descripción de la app
- ✅ Políticas de privacidad
- ✅ Clasificación de contenido

**Configurar suscripción:**
- SKU: `premium_monthly`
- Precio: €1.99
- Trial: 7 días
- Renovación: Mensual

### 3. Configurar AdMob

1. Crear cuenta en [AdMob](https://admob.google.com)
2. Agregar app con package: `com.cookflow.app`
3. Los IDs ya están configurados ✅
4. Configurar formato de anuncios (Banner, Interstitial, etc.)

---

## 📊 Testing Checklist

Antes de publicar, verifica:

- [ ] ✅ APK/AAB compila sin errores
- [ ] ✅ App carga correctamente en dispositivo
- [ ] ✅ WebView muestra thecookflow.com
- [ ] ✅ JavaScript Bridge funciona (probar `window.Android`)
- [ ] ✅ Flujo de suscripción funcional
- [ ] ✅ AdMob muestra anuncios (usuarios free)
- [ ] ✅ Usuarios premium NO ven anuncios
- [ ] ✅ Banner aparece al bottom
- [ ] ✅ Interstitial cada 3 páginas
- [ ] ✅ ProGuard no rompe funcionalidad

---

## 📞 Soporte

**Logs útiles:**
```bash
# Ver todos los logs
adb logcat

# Filtrar por TheCookFlow
adb logcat | grep -E "MainActivity|BillingManager|AdMobManager|WebViewBridge"

# Ver solo errores
adb logcat *:E
```

**Archivos importantes:**
- `android/app/build.gradle` - IDs de AdMob y configuración
- `android/app/src/main/AndroidManifest.xml` - Permisos y App ID
- `android/app/proguard-rules.pro` - Reglas de ofuscación

---

## ✨ Funcionalidades Completas

✅ **Sistema Freemium Full-Stack**
- Trial 7 días → Auto-conversión a €1.99/mes
- Google Play Billing integrado
- WebView ↔ Android bridge completo

✅ **AdMob Completo**
- Banner (bottom, visible solo free users)
- Interstitial (cada 3 navegaciones)
- Rewarded (desbloquear menús)
- GDPR/UMP compliance

✅ **Seguridad**
- ProGuard optimizado
- Claves protegidas (no en Git)
- WebView hardened (no file access, safe browsing)

---

## ✅ VERIFICACIÓN DE BACKEND IMPLEMENTADA

### 🔒 Sistema de Verificación Seguro Completo

**Estado**: ✅ **Verificación de compras completamente implementada y funcional**

**Características de seguridad**:
- ✅ Google Play Developer API configurada con credenciales Firebase
- ✅ Verificación server-side contra Google Play API oficial
- ✅ Android hace llamada HTTP real a backend con OkHttp
- ✅ Endpoint `/api/freemium/verify-google-play-purchase` operativo
- ✅ Base de datos registra todas las compras verificadas
- ✅ Prevención de compras duplicadas
- ✅ Auto-actualización de estado premium en usuarios

**Flujo de verificación**:
1. Usuario completa compra en Google Play
2. Android envía `purchaseToken` a backend vía HTTPS
3. Backend verifica con Google Play Developer API
4. Si válido, actualiza usuario a premium en base de datos
5. Android recibe confirmación y actualiza UI

**Archivos clave**:
- `api/server/googlePlayBilling.ts` - Servicio de verificación Google Play
- `android/app/src/main/java/com/cookflow/app/GooglePlayBillingManager.kt` - Cliente HTTP
- `firebase-service-account.json` - Credenciales (gitignored)

⚠️ **Requisito para producción**: Asegúrate que `firebase-service-account.json` esté configurado con credenciales válidas de tu proyecto Firebase.

### Configurar Suscripción en Play Console
Antes de publicar, configura en Google Play Console:

1. **Product ID**: `premium_monthly`
2. **Precio**: €1.99/mes
3. **Free Trial**: 7 días
4. **Renovación**: Mensual automática

---

**¡Todo listo para compilar! Recuerda implementar backend verification antes de producción 🎉**
