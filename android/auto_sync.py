#!/usr/bin/env python3
"""
TheCookFlow - Sistema de Sincronización Automática con GitHub
Monitorea cambios y actualiza el repositorio automáticamente
"""

import os
import subprocess
import time
import hashlib
import json
from datetime import datetime
from pathlib import Path

class GitHubAutoSync:
    def __init__(self):
        self.repo_url = "https://github.com/RUPERDFN/thecookflow2.0_playstore.git"
        self.branch = "main"
        self.sync_file = ".sync_state.json"
        self.exclude_patterns = [
            '*.keystore', '*.jks', 'build/', '*.apk', '*.aab', 
            '.git/', '__pycache__/', '*.pyc', '.sync_state.json'
        ]
        
    def run_command(self, cmd):
        """Ejecuta comando y devuelve resultado
        
        Args:
            cmd: Lista de argumentos o string (se convertirá a lista de forma segura)
        """
        try:
            # Si es string, convertir a lista de argumentos (más seguro)
            if isinstance(cmd, str):
                import shlex
                cmd = shlex.split(cmd)
            
            # Usar shell=False para prevenir inyección de comandos
            result = subprocess.run(cmd, shell=False, capture_output=True, text=True)
            return result.returncode == 0, result.stdout, result.stderr
        except Exception as e:
            return False, "", str(e)
    
    def calculate_directory_hash(self):
        """Calcula hash del directorio para detectar cambios"""
        hash_md5 = hashlib.md5()
        
        for root, dirs, files in os.walk('.'):
            # Excluir directorios
            dirs[:] = [d for d in dirs if not any(d.startswith(p.rstrip('/*')) for p in self.exclude_patterns)]
            
            for file in sorted(files):
                # Excluir archivos
                if any(file.endswith(p.rstrip('*')) or p.rstrip('/*') in file for p in self.exclude_patterns):
                    continue
                    
                file_path = os.path.join(root, file)
                try:
                    with open(file_path, 'rb') as f:
                        content = f.read()
                    hash_md5.update(content)
                except:
                    continue
                    
        return hash_md5.hexdigest()
    
    def load_sync_state(self):
        """Carga el estado anterior de sincronización"""
        if os.path.exists(self.sync_file):
            try:
                with open(self.sync_file, 'r') as f:
                    return json.load(f)
            except:
                pass
        return {"last_hash": "", "last_sync": ""}
    
    def save_sync_state(self, hash_value):
        """Guarda el estado de sincronización"""
        state = {
            "last_hash": hash_value,
            "last_sync": datetime.now().isoformat()
        }
        with open(self.sync_file, 'w') as f:
            json.dump(state, f, indent=2)
    
    def init_git_repo(self):
        """Inicializa repositorio Git si no existe"""
        if not os.path.exists('.git'):
            print("📦 Inicializando repositorio Git...")
            success, _, error = self.run_command(['git', 'init'])
            if not success:
                print(f"❌ Error inicializando Git: {error}")
                return False
            
            success, _, error = self.run_command(['git', 'remote', 'add', 'origin', self.repo_url])
            if not success and "already exists" not in error:
                print(f"❌ Error agregando remote: {error}")
                return False
                
        return True
    
    def sync_to_github(self):
        """Sincroniza cambios con GitHub"""
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        
        print(f"📝 Agregando cambios... ({timestamp})")
        success, _, error = self.run_command(['git', 'add', '.'])
        if not success:
            print(f"❌ Error agregando archivos: {error}")
            return False
        
        commit_msg = f"🔄 Auto-sync: TheCookFlow Android - {timestamp}"
        success, output, error = self.run_command(['git', 'commit', '-m', commit_msg])
        if not success and "nothing to commit" not in error:
            print(f"❌ Error en commit: {error}")
            return False
        elif "nothing to commit" in error:
            print("ℹ️  No hay cambios para sincronizar")
            return True
        
        print("⬆️  Subiendo a GitHub...")
        success, _, error = self.run_command(['git', 'push', '-u', 'origin', self.branch])
        if not success:
            print(f"❌ Error subiendo cambios: {error}")
            return False
            
        print(f"✅ Sincronización exitosa: {timestamp}")
        return True
    
    def auto_monitor(self, interval_minutes=5):
        """Monitorea cambios automáticamente"""
        print(f"🔄 Iniciando monitoreo automático (cada {interval_minutes} minutos)")
        print(f"🌐 Repositorio: {self.repo_url}")
        print("⏹️  Presiona Ctrl+C para detener")
        
        if not self.init_git_repo():
            return
        
        try:
            while True:
                current_hash = self.calculate_directory_hash()
                sync_state = self.load_sync_state()
                
                if current_hash != sync_state.get("last_hash", ""):
                    print(f"\n🔍 Cambios detectados - {datetime.now().strftime('%H:%M:%S')}")
                    if self.sync_to_github():
                        self.save_sync_state(current_hash)
                else:
                    print(f"⏰ Sin cambios - {datetime.now().strftime('%H:%M:%S')}", end='\r')
                
                time.sleep(interval_minutes * 60)
                
        except KeyboardInterrupt:
            print("\n🛑 Monitoreo detenido")
    
    def sync_once(self):
        """Sincroniza una sola vez"""
        print("🚀 Sincronización única con GitHub...")
        
        if not self.init_git_repo():
            return False
            
        if self.sync_to_github():
            current_hash = self.calculate_directory_hash()
            self.save_sync_state(current_hash)
            return True
        return False

if __name__ == "__main__":
    import sys
    
    syncer = GitHubAutoSync()
    
    if len(sys.argv) > 1 and sys.argv[1] == "--monitor":
        # Modo monitoreo continuo
        interval = int(sys.argv[2]) if len(sys.argv) > 2 else 5
        syncer.auto_monitor(interval)
    else:
        # Sincronización única
        syncer.sync_once()