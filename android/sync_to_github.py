#!/usr/bin/env python3
"""
TheCookFlow - Sincronización Inteligente con GitHub
Sincroniza solo la carpeta android al repositorio específico
"""

import os
import subprocess
import shutil
import tempfile
from datetime import datetime

class AndroidGitHubSync:
    def __init__(self):
        self.target_repo = "https://github.com/RUPERDFN/thecookflow20playstore.git"
        self.android_folder = "android"
        self.temp_dir = None
        
    def run_command(self, cmd, cwd=None):
        """Ejecuta comando y devuelve resultado
        
        Args:
            cmd: Lista de argumentos o string (se convertirá a lista de forma segura)
            cwd: Directorio de trabajo actual
        """
        try:
            # Si es string, convertir a lista de argumentos (más seguro)
            if isinstance(cmd, str):
                import shlex
                cmd = shlex.split(cmd)
            
            # Usar shell=False para prevenir inyección de comandos
            result = subprocess.run(cmd, shell=False, capture_output=True, text=True, cwd=cwd)
            return result.returncode == 0, result.stdout, result.stderr
        except Exception as e:
            return False, "", str(e)
    
    def create_temp_repo(self):
        """Crea repositorio temporal para la sincronización"""
        self.temp_dir = tempfile.mkdtemp(prefix="cookflow_sync_")
        print(f"📁 Creando repositorio temporal en: {self.temp_dir}")
        
        # Inicializar repositorio Git
        success, _, error = self.run_command(['git', 'init'], self.temp_dir)
        if not success:
            print(f"❌ Error inicializando Git: {error}")
            return False
            
        # Configurar usuario si no está configurado
        self.run_command(['git', 'config', 'user.name', 'RUPERDFN'], self.temp_dir)
        self.run_command(['git', 'config', 'user.email', 'rubengarsan@live.com'], self.temp_dir)
        
        # Agregar remote
        success, _, error = self.run_command(['git', 'remote', 'add', 'origin', self.target_repo], self.temp_dir)
        if not success and "already exists" not in error:
            print(f"❌ Error agregando remote: {error}")
            return False
            
        return True
    
    def copy_android_files(self):
        """Copia archivos de Android al repositorio temporal"""
        print("📋 Copiando archivos de Android...")
        
        if not self.temp_dir:
            print("❌ Repositorio temporal no inicializado")
            return False
        
        source_android = os.path.join(os.getcwd(), self.android_folder)
        dest_android = os.path.join(self.temp_dir, self.android_folder)
        
        if not os.path.exists(source_android):
            print("❌ Carpeta android no encontrada")
            return False
            
        # Copiar toda la carpeta android
        shutil.copytree(source_android, dest_android, ignore=shutil.ignore_patterns(
            'build', '*.apk', '*.aab', '*.keystore', '.git'
        ))
        
        # Crear README.md en la raíz
        readme_content = """# 🍽️ TheCookFlow Android App

## Descripción
Aplicación Android completa de TheCookFlow con Google Play Billing y AdMob integrados.

## Estado
✅ 100% lista para Google Play Store
✅ Google Play Billing v7.1.1
✅ AdMob configurado
✅ Permisos AD_ID corregidos

## Compilación
```bash
cd android
./gradlew bundleRelease
```

## Versión
7.0.0 - Lista para subir a Google Play Store

Desarrollado por RUPERDFN para TheCookFlow
"""
        
        with open(os.path.join(self.temp_dir, "README.md"), 'w', encoding='utf-8') as f:
            f.write(readme_content)
            
        return True
    
    def commit_and_push(self):
        """Hace commit y push de los archivos"""
        print("💾 Haciendo commit de los archivos...")
        
        # Agregar todos los archivos
        success, _, error = self.run_command(['git', 'add', '.'], self.temp_dir)
        if not success:
            print(f"❌ Error agregando archivos: {error}")
            return False
        
        # Hacer commit
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        commit_msg = f"🚀 TheCookFlow Android App - Ready for Google Play Store - {timestamp}"
        
        success, _, error = self.run_command(['git', 'commit', '-m', commit_msg], self.temp_dir)
        if not success and "nothing to commit" not in error:
            print(f"❌ Error en commit: {error}")
            return False
        elif "nothing to commit" in error:
            print("ℹ️  No hay cambios para subir")
            return True
        
        # Push forzado (para sobrescribir cualquier conflicto)
        print("⬆️  Subiendo a GitHub...")
        success, output, error = self.run_command(['git', 'push', '-u', 'origin', 'main', '--force'], self.temp_dir)
        
        if not success:
            # Intentar con master como branch
            print("🔄 Intentando con branch master...")
            success, output, error = self.run_command(['git', 'push', '-u', 'origin', 'master', '--force'], self.temp_dir)
            
        if success:
            print(f"✅ ¡Sincronización exitosa!")
            print(f"🌐 Repositorio actualizado: {self.target_repo}")
            return True
        else:
            print(f"❌ Error subiendo: {error}")
            return False
    
    def cleanup(self):
        """Limpia archivos temporales"""
        if self.temp_dir and os.path.exists(self.temp_dir):
            shutil.rmtree(self.temp_dir)
            print("🧹 Archivos temporales limpiados")
    
    def sync_android_to_github(self):
        """Proceso completo de sincronización"""
        print("🚀 Iniciando sincronización de Android a GitHub...")
        print(f"📱 Carpeta: {self.android_folder}")
        print(f"🎯 Destino: {self.target_repo}")
        print("-" * 50)
        
        try:
            if not self.create_temp_repo():
                return False
                
            if not self.copy_android_files():
                return False
                
            if not self.commit_and_push():
                return False
                
            print("-" * 50)
            print("🎉 ¡Aplicación Android sincronizada exitosamente!")
            print("📱 Tu repositorio GitHub ahora tiene:")
            print("   ✅ Código fuente completo de Android")
            print("   ✅ Configuración de Google Play Billing")
            print("   ✅ AdMob con permisos AD_ID")
            print("   ✅ Scripts de compilación")
            print("   ✅ Lista para Google Play Store")
            
            return True
            
        except Exception as e:
            print(f"💥 Error inesperado: {e}")
            return False
        finally:
            self.cleanup()

if __name__ == "__main__":
    syncer = AndroidGitHubSync()
    syncer.sync_android_to_github()