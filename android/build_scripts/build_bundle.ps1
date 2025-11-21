# Script PowerShell para compilar App Bundle de TheCookFlow
# Ejecutar desde el directorio android/

Write-Host "🍳 Compilando TheCookFlow App Bundle (.aab)..." -ForegroundColor Green

# Verificar que estamos en el directorio correcto
if (-not (Test-Path "app\build.gradle")) {
    Write-Host "❌ Error: Ejecuta este script desde el directorio android/" -ForegroundColor Red
    exit 1
}

# Verificar Java
try {
    $javaVersion = java -version 2>&1
    Write-Host "✅ Java encontrado: $($javaVersion[0])" -ForegroundColor Green
} catch {
    Write-Host "❌ Error: Java no encontrado. Instala JDK 8 o superior" -ForegroundColor Red
    exit 1
}

# Limpiar builds anteriores
Write-Host "🧹 Limpiando builds anteriores..." -ForegroundColor Yellow
.\gradlew clean

# Generar keystore si no existe
if (-not (Test-Path "app\thecookflow-release-key.keystore")) {
    Write-Host "🔐 Generando keystore para firmar App Bundle..." -ForegroundColor Yellow
    keytool -genkey -v -keystore app\thecookflow-release-key.keystore -alias thecookflow -keyalg RSA -keysize 2048 -validity 10000 -storepass thecookflow2025 -keypass thecookflow2025 -dname "CN=TheCookFlow, OU=Development, O=TheCookFlow, L=Madrid, S=Madrid, C=ES"
    Write-Host "✅ Keystore generado exitosamente" -ForegroundColor Green
}

# Compilar App Bundle firmado
Write-Host "🔨 Compilando App Bundle firmado..." -ForegroundColor Yellow
.\gradlew bundleRelease

# Verificar que el App Bundle se generó correctamente
$bundlePath = "app\build\outputs\bundle\release\app-release.aab"
if (Test-Path $bundlePath) {
    $bundleSize = (Get-Item $bundlePath).Length / 1MB
    Write-Host "✅ App Bundle compilado exitosamente!" -ForegroundColor Green
    Write-Host "📁 Ubicación: $bundlePath" -ForegroundColor Cyan
    Write-Host "📏 Tamaño: $([math]::Round($bundleSize, 2)) MB" -ForegroundColor Cyan
    
    # Copiar App Bundle a directorio de assets
    if (-not (Test-Path "..\play_store_assets")) {
        New-Item -ItemType Directory -Path "..\play_store_assets"
    }
    Copy-Item $bundlePath "..\play_store_assets\thecookflow-v1.0.0.aab"
    Write-Host "📋 App Bundle copiado a play_store_assets\" -ForegroundColor Green
    
    # También generar APK para testing local
    Write-Host "🔨 Generando APK adicional para testing..." -ForegroundColor Yellow
    .\gradlew assembleRelease
    $apkPath = "app\build\outputs\apk\release\app-release.apk"
    if (Test-Path $apkPath) {
        Copy-Item $apkPath "..\play_store_assets\thecookflow-v1.0.0.apk"
        Write-Host "📋 APK de testing también generado" -ForegroundColor Green
    }
    
    Write-Host "ℹ️  Información del App Bundle:" -ForegroundColor Cyan
    Write-Host "El App Bundle (.aab) es el formato preferido por Google Play Store" -ForegroundColor White
    Write-Host "Permite optimizaciones automáticas de descarga para diferentes dispositivos" -ForegroundColor White
    
} else {
    Write-Host "❌ Error: No se pudo generar el App Bundle" -ForegroundColor Red
    exit 1
}

Write-Host "🎉 ¡Compilación completada! App Bundle listo para subir a Google Play Store" -ForegroundColor Green
Write-Host "📤 Usa el archivo: play_store_assets\thecookflow-v1.0.0.aab" -ForegroundColor Cyan