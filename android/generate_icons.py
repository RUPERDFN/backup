#!/usr/bin/env python3
"""
Script para generar iconos de la aplicación TheCookFlow
Genera todos los tamaños necesarios para Android desde un icono base
"""

from PIL import Image, ImageDraw, ImageFont
import os

def create_thecookflow_icon(size):
    """Crea el icono de TheCookFlow con el estilo pizarra"""
    # Crear imagen con fondo verde oscuro
    img = Image.new('RGBA', (size, size), (45, 77, 58, 255))  # dark_green
    draw = ImageDraw.Draw(img)
    
    # Dibujar círculo de fondo con borde tiza
    margin = size // 10
    circle_bbox = [margin, margin, size - margin, size - margin]
    
    # Fondo del círculo en verde tiza
    draw.ellipse(circle_bbox, fill=(168, 213, 186, 255))  # chalk_green
    
    # Borde del círculo
    border_width = max(2, size // 64)
    draw.ellipse(circle_bbox, outline=(245, 245, 220, 255), width=border_width)  # chalk_white
    
    # Dibujar chef hat (símbolo principal)
    hat_size = size // 3
    hat_x = (size - hat_size) // 2
    hat_y = (size - hat_size) // 2 - size // 12
    
    # Base del gorro de chef
    hat_base = [hat_x, hat_y + hat_size // 2, hat_x + hat_size, hat_y + hat_size]
    draw.rectangle(hat_base, fill=(45, 77, 58, 255))  # dark_green
    
    # Parte superior del gorro (círculo)
    hat_top = [hat_x + hat_size // 6, hat_y, hat_x + hat_size - hat_size // 6, hat_y + hat_size // 2 + hat_size // 6]
    draw.ellipse(hat_top, fill=(45, 77, 58, 255))  # dark_green
    
    # Detalles del gorro
    detail_y = hat_y + hat_size // 2 + hat_size // 8
    draw.line([hat_x + hat_size // 4, detail_y, hat_x + hat_size - hat_size // 4, detail_y], 
              fill=(245, 245, 220, 255), width=max(1, size // 128))
    
    # Agregar letra "C" estilizada (de CookFlow)
    font_size = max(size // 8, 8)
    try:
        # Intentar usar una fuente del sistema
        font = ImageFont.truetype("/System/Library/Fonts/Arial.ttf", font_size)
    except:
        try:
            font = ImageFont.truetype("arial.ttf", font_size)
        except:
            font = ImageFont.load_default()
    
    # Dibujar "C" en la parte inferior
    text = "C"
    text_bbox = draw.textbbox((0, 0), text, font=font)
    text_width = text_bbox[2] - text_bbox[0]
    text_height = text_bbox[3] - text_bbox[1]
    text_x = (size - text_width) // 2
    text_y = size - margin - text_height - size // 20
    
    draw.text((text_x, text_y), text, fill=(245, 245, 220, 255), font=font)
    
    return img

def generate_android_icons():
    """Genera todos los iconos necesarios para Android"""
    # Tamaños estándar de iconos para Android
    icon_sizes = {
        'mipmap-mdpi': 48,
        'mipmap-hdpi': 72,
        'mipmap-xhdpi': 96,
        'mipmap-xxhdpi': 144,
        'mipmap-xxxhdpi': 192,
    }
    
    # Crear directorios si no existen
    for folder in icon_sizes.keys():
        os.makedirs(f'android/app/src/main/res/{folder}', exist_ok=True)
    
    # Generar iconos
    for folder, size in icon_sizes.items():
        # Icono principal
        icon = create_thecookflow_icon(size)
        icon.save(f'android/app/src/main/res/{folder}/ic_launcher.png')
        
        # Icono redondo (mismo diseño)
        icon_round = create_thecookflow_icon(size)
        icon_round.save(f'android/app/src/main/res/{folder}/ic_launcher_round.png')
        
        print(f"Generated {folder}: {size}x{size}")

def generate_splash_logo():
    """Genera el logo para la pantalla de splash"""
    size = 512
    logo = create_thecookflow_icon(size)
    os.makedirs('android/app/src/main/res/drawable', exist_ok=True)
    logo.save('android/app/src/main/res/drawable/splash_logo.png')
    print(f"Generated splash logo: {size}x{size}")

def generate_play_store_icon():
    """Genera el icono de 512x512 para Play Store"""
    size = 512
    icon = create_thecookflow_icon(size)
    icon.save('play_store_assets/ic_launcher_512.png')
    print(f"Generated Play Store icon: {size}x{size}")

if __name__ == "__main__":
    # Crear directorios necesarios
    os.makedirs('play_store_assets', exist_ok=True)
    
    print("Generando iconos para TheCookFlow...")
    generate_android_icons()
    generate_splash_logo()
    generate_play_store_icon()
    print("¡Iconos generados exitosamente!")