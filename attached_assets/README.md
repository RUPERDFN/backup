# TheCookFlow - Exportación de Estilo Web

## Contenido del archivo

Este ZIP contiene todos los archivos necesarios para replicar el estilo y estructura visual de TheCookFlow:

### Archivos HTML
- `index.html` - Página principal
- `login.html` - Página de login/registro
- `cuestionario.html` - Formulario de preferencias
- `menu.html` - Visualización de menús
- `politica-privacidad.html` - Política de privacidad
- `aviso-legal.html` - Aviso legal

### Estilos y Fuentes
- `estilos.css` - Hoja de estilos principal con tema oscuro tipo pizarra
- `style.css` - Estilos adicionales
- `Cheveuxdange.ttf` - Fuente personalizada

### Recursos Visuales
- `logo.PNG` - Logo de TheCookFlow
- `textura-grunge-oscura.jpg` - Textura de fondo
- Iconos PNG para diferentes funcionalidades

### Scripts
- `script.js` - JavaScript principal
- `menu-generator.js` - Generador de menús

### Configuración
- `.replit` - Configuración de Replit
- `requirements.txt` - Dependencias Python
- `setup-environment.md` - Documentación de configuración

## Características del Estilo

### Tema Visual
- **Color base**: Fondo oscuro (#0f0f0f) con textura grunge
- **Paleta principal**: Verde aguamarina (#4a9b8e, #58c2a9)
- **Fuente**: Cheveuxdange (personalizada)
- **Estilo**: Diseño tipo pizarra/cartel con efectos de vidrio esmerilado

### Elementos de Diseño
- Botones con bordes redondeados (25px)
- Efectos de hover con translateY(-2px)
- Backdrop-filter: blur() para efectos de vidrio
- Sombras suaves con rgba()
- Transiciones suaves (0.3s ease)

### Responsive Design
- Grid layouts adaptativos
- Breakpoint principal: 768px
- Diseño mobile-first

## Instalación

1. Extrae todos los archivos
2. Asegúrate de que todos los recursos estén en el mismo directorio
3. Abre `index.html` en un navegador
4. Para funcionalidad completa, ejecuta `server.py` (requiere Python y Flask)

## Personalización

### Cambiar Colores
Edita las variables CSS en `estilos.css`:
- Verde principal: #4a9b8e
- Verde hover: #43a491
- Fondo: #0f0f0f

### Modificar Fuente
Reemplaza `Cheveuxdange.ttf` y actualiza @font-face en CSS

### Ajustar Efectos
Modifica backdrop-filter y box-shadow en las clases correspondientes

---
Generado automáticamente - TheCookFlow Style Export
