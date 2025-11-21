#!/usr/bin/env python3
"""
Script para generar assets promocionales para Google Play Store
"""

from PIL import Image, ImageDraw, ImageFont
import os

def create_screenshot_mockup(width, height, title, subtitle, features):
    """Crea un mockup de screenshot estilo pizarra"""
    # Fondo estilo pizarra
    img = Image.new('RGB', (width, height), (45, 77, 58))  # dark_green
    draw = ImageDraw.Draw(img)
    
    # Añadir textura de pizarra (líneas sutiles)
    for i in range(0, height, 20):
        draw.line([(0, i), (width, i)], fill=(50, 82, 63), width=1)
    
    # Título principal
    try:
        title_font = ImageFont.truetype("/System/Library/Fonts/Arial.ttf", 48)
        subtitle_font = ImageFont.truetype("/System/Library/Fonts/Arial.ttf", 32)
        feature_font = ImageFont.truetype("/System/Library/Fonts/Arial.ttf", 24)
    except:
        title_font = ImageFont.load_default()
        subtitle_font = ImageFont.load_default()
        feature_font = ImageFont.load_default()
    
    # Dibujar título
    title_bbox = draw.textbbox((0, 0), title, font=title_font)
    title_width = title_bbox[2] - title_bbox[0]
    title_x = (width - title_width) // 2
    draw.text((title_x, 80), title, fill=(245, 245, 220), font=title_font)  # chalk_white
    
    # Dibujar subtítulo
    subtitle_bbox = draw.textbbox((0, 0), subtitle, font=subtitle_font)
    subtitle_width = subtitle_bbox[2] - subtitle_bbox[0]
    subtitle_x = (width - subtitle_width) // 2
    draw.text((subtitle_x, 150), subtitle, fill=(168, 213, 186), font=subtitle_font)  # chalk_green
    
    # Dibujar características
    y_offset = 220
    for i, feature in enumerate(features):
        # Bullet point
        draw.ellipse([100, y_offset + 5, 110, y_offset + 15], fill=(168, 213, 186))
        
        # Texto de la característica
        draw.text((130, y_offset), feature, fill=(212, 212, 170), font=feature_font)  # chalk
        y_offset += 50
    
    # Agregar logo en la esquina
    try:
        logo = Image.open('android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png')
        logo_resized = logo.resize((100, 100))
        img.paste(logo_resized, (width - 150, 50), logo_resized if logo_resized.mode == 'RGBA' else None)
    except:
        # Crear logo simple si no existe
        draw.ellipse([width - 150, 50, width - 50, 150], fill=(168, 213, 186))
        draw.text((width - 120, 90), "C", fill=(45, 77, 58), font=title_font)
    
    return img

def generate_screenshots():
    """Genera screenshots principales para Play Store"""
    os.makedirs('play_store_assets/screenshots', exist_ok=True)
    
    # Screenshot 1: Generación de menús
    screenshot1 = create_screenshot_mockup(
        1080, 1920,
        "TheCookFlow",
        "Planifica tus menús semanales con IA",
        [
            "🤖 Generación automática con IA",
            "🍽️ Menús personalizados para tu dieta",
            "📱 Acceso desde cualquier dispositivo",
            "⚡ Rápido y fácil de usar",
            "💡 Sugerencias inteligentes"
        ]
    )
    screenshot1.save('play_store_assets/screenshots/screenshot_1.png')
    
    # Screenshot 2: Lista de compras
    screenshot2 = create_screenshot_mockup(
        1080, 1920,
        "Lista de Compras Inteligente",
        "Organiza tu compra automáticamente",
        [
            "📋 Listas organizadas por categorías",
            "💰 Precios estimados en tiempo real",
            "🛒 Integración con Amazon Fresh",
            "✅ Marca ingredientes comprados",
            "📊 Control de presupuesto"
        ]
    )
    screenshot2.save('play_store_assets/screenshots/screenshot_2.png')
    
    print("Screenshots generados: 1080x1920")

def generate_feature_graphic():
    """Genera el banner de cabecera (1024x500)"""
    width, height = 1024, 500
    img = Image.new('RGB', (width, height), (45, 77, 58))
    draw = ImageDraw.Draw(img)
    
    # Gradiente sutil
    for y in range(height):
        shade = int(45 + (y / height) * 20)
        draw.line([(0, y), (width, y)], fill=(shade, 77, 58))
    
    try:
        main_font = ImageFont.truetype("/System/Library/Fonts/Arial.ttf", 72)
        sub_font = ImageFont.truetype("/System/Library/Fonts/Arial.ttf", 36)
    except:
        main_font = ImageFont.load_default()
        sub_font = ImageFont.load_default()
    
    # Título principal
    title = "TheCookFlow"
    title_bbox = draw.textbbox((0, 0), title, font=main_font)
    title_width = title_bbox[2] - title_bbox[0]
    title_x = (width - title_width) // 2
    draw.text((title_x, 150), title, fill=(245, 245, 220), font=main_font)
    
    # Subtítulo
    subtitle = "Tu planificador de menús semanales con IA"
    subtitle_bbox = draw.textbbox((0, 0), subtitle, font=sub_font)
    subtitle_width = subtitle_bbox[2] - subtitle_bbox[0]
    subtitle_x = (width - subtitle_width) // 2
    draw.text((subtitle_x, 250), subtitle, fill=(168, 213, 186), font=sub_font)
    
    # Iconos decorativos
    for i, icon in enumerate(['🍳', '🤖', '📱', '🍽️']):
        x = 100 + i * 200
        draw.text((x, 350), icon, fill=(168, 213, 186), font=sub_font)
    
    img.save('play_store_assets/feature_graphic.png')
    print("Feature graphic generado: 1024x500")

def generate_promo_video_script():
    """Genera el guión para el video promocional"""
    script = """
# GUIÓN VIDEO PROMOCIONAL THECOOKFLOW (30 segundos)

## Escena 1 (0-5s): Problema
- Visual: Persona confundida frente a frigorífico vacío
- Texto: "¿Qué cocinar esta semana?"
- Narración: "¿Cansado de no saber qué cocinar?"

## Escena 2 (5-10s): Solución
- Visual: Apertura de TheCookFlow en móvil
- Texto: "TheCookFlow - IA para tu cocina"
- Narración: "TheCookFlow usa IA para planificar tus menús"

## Escena 3 (10-20s): Características
- Visual: Pantalla de generación de menú
- Texto superpuesto:
  * "Menús personalizados"
  * "Lista de compras automática"
  * "Integración Amazon Fresh"
- Narración: "Menús personalizados, listas automáticas, compra directa"

## Escena 4 (20-25s): Resultado
- Visual: Familia feliz cocinando
- Texto: "Cocina sin estrés"
- Narración: "Cocina sin estrés, come mejor"

## Escena 5 (25-30s): Call-to-Action
- Visual: Logo TheCookFlow + Play Store
- Texto: "Descarga gratis - 7 días premium"
- Narración: "Descarga TheCookFlow gratis"

## Música: Upbeat, familiar, cocina/hogar
## Colores: Verde pizarra (#2d4d3a), Tiza (#a8d5ba), Blanco tiza (#f5f5dc)
"""
    
    with open('play_store_assets/video_script.txt', 'w', encoding='utf-8') as f:
        f.write(script)
    print("Guión de video generado")

if __name__ == "__main__":
    print("Generando assets promocionales para Google Play Store...")
    generate_screenshots()
    generate_feature_graphic()
    generate_promo_video_script()
    print("¡Assets promocionales generados exitosamente!")