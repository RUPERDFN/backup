# Inventario de Archivos de la Landing Page - TheCookFlow

## 📄 Archivos Principales de la Landing

> Nota: todos los archivos de la landing ahora están ubicados bajo el directorio raíz `landing/` (por ejemplo, `landing/client/src/...`).

### 1. **Página Principal de Landing**
- **`client/src/pages/Landing.tsx`** - Componente principal de la landing page
  - Hero section con logo y CTA
  - Sección de redes sociales (Facebook, Instagram, YouTube)
  - Navegación a demos (Cuestionario, Generador IA, SkinChef)
  - Iconos de características principales
  - Sección "Cómo Funciona" (3 pasos)
  - Reconocimiento visual de alimentos (demo)
  - CTAs finales
  - Footer con enlaces

### 2. **HTML Base**
- **`client/index.html`** - Archivo HTML principal
  - Meta tags SEO (title, description, keywords)
  - Open Graph tags para redes sociales
  - Twitter Card meta tags
  - Enlaces a Google Fonts (Kalam, Caveat, Crafty Girls)
  - Scripts de integración (TCF Bridge, AdMob)
  - Punto de montaje React (#root)

### 3. **Punto de Entrada JavaScript**
- **`client/src/main.tsx`** - Entrada principal de la aplicación
  - Inicialización de billing manager
  - Inicialización de ad manager con CMP
  - Integración TCF Bridge
  - Montaje de la aplicación React

### 4. **Enrutamiento**
- **`client/src/App.tsx`** - Configuración de rutas
  - Define la ruta "/" como Landing para usuarios no autenticados
  - Configuración de rutas públicas y privadas
  - Lazy loading de componentes pesados

## 🎨 Archivos de Estilos

### Estilos CSS
- **`client/src/index.css`** - Hoja de estilos principal (1039 líneas)
  - Configuración de Tailwind CSS
  - Variables CSS personalizadas para temas
  - 3 temas de pizarra (Classic, Modern, Digital)
  - Estilos de botones (.btn-red-chalk, .btn-red-chalk-outline, .btn-primary-chalk, etc.)
  - Clases de utilidad de tiza (.text-chalk, .text-chalk-white, .text-chalk-green, etc.)
  - Contenedores de vidrio (.glass-container, .glass-container-transparent)
  - Secciones principales (.seccion)
  - Estilos de navegación (.nav-chalk)
  - Estilos de iconos (.iconos, .decoraciones)
  - Logo (.logo)
  - Footer
  - Scrollbar personalizado
  - Animaciones personalizadas
  - Decoraciones de tiza (.chalk-decorative, .chalk-divider)
  - Mejoras de accesibilidad
  - Variaciones de color de tiza por sección (naranja, azul, verde menta, amarillo, rosa)
  - Media queries responsivas

### Configuración de Tailwind
- **`tailwind.config.ts`** - Configuración de Tailwind CSS
  - Tema personalizado con variables CSS
  - Keyframes y animaciones (accordion-down, accordion-up)
  - Plugins (tailwindcss-animate, @tailwindcss/typography)

### PostCSS
- **`postcss.config.js`** - Configuración de PostCSS

## 🧩 Componentes Compartidos

### Componentes Core
- **`client/src/components/SEO.tsx`** - Componente SEO dinámico
  - Gestión de meta tags
  - Open Graph tags
  - Twitter Card tags
  - Canonical URLs
  - Robots meta tag
  - Configuración de idioma

- **`client/src/components/Navbar.tsx`** - Barra de navegación
  - Versión para usuarios no autenticados (landing)
  - Logo de TheCookFlow
  - Enlaces a demos (Cuestionario, Generador, SkinChef)
  - Enlaces a Ayuda y Contacto
  - Botones de autenticación (Login/Registro)
  - Menú móvil responsivo

### Componentes UI (Shadcn/ui)
Ubicados en `client/src/components/ui/`:
- `button.tsx` - Botones personalizados
- `dropdown-menu.tsx` - Menús desplegables
- `toast.tsx` / `toaster.tsx` - Notificaciones
- `tooltip.tsx` - Tooltips
- Y otros 40+ componentes UI reutilizables

## 🖼️ Recursos Visuales

### Imágenes PNG (Iconos y Logos)
Ubicadas en `client/public/`:
- **`logo.PNG`** - Logo principal de TheCookFlow (usado en meta tags)
- **`logo-new.PNG`** - Logo actualizado (700px en landing)
- **`menu.png`** - Icono de generador de menús
- **`recetas.png`** - Icono de reconocimiento visual
- **`lista.png`** - Icono de listas inteligentes
- **`chef.png`** - Icono de SkinChef/planificación
- **`auto.png`** - Icono de panel personal
- **`comparador.png`** - Icono de comparador
- **`hojas.png`** - Decoración vegetal
- **`limon.png`** - Decoración cítrico
- **`pimiento.png`** - Decoración vegetal
- **`tomate.png`** - Decoración vegetal
- **`zanahoria.png`** - Decoración vegetal

### Imagen de Fondo
- **`client/public/textura-grunge-oscura.jpg`** - Textura de fondo tipo pizarra (7.6 MB)

### Fuente Personalizada
- **`client/public/Cheveuxdange.ttf`** - Fuente principal con efecto tiza (422 KB)

## 📜 Scripts de Integración

Ubicados en `public/`:
- **`tcf-bridge.js`** - Integración con Android WebView para billing
- **`admob-integration.js`** - Integración de AdMob para Android

## 🔧 Archivos de Configuración

### Build y Desarrollo
- **`vite.config.ts`** - Configuración de Vite (bundler)
- **`tsconfig.json`** - Configuración de TypeScript
- **`package.json`** - Dependencias del proyecto
- **`eslint.config.js`** / **`.eslintrc.json`** - Linting
- **`.prettierrc`** - Formateo de código

### Otros Archivos Relacionados
- **`components.json`** - Configuración de componentes Shadcn/ui
- **`.editorconfig`** - Configuración del editor
- **`.env.example`** - Variables de entorno ejemplo

## 🔍 Archivos de Soporte

### Contextos y Hooks
- **`client/src/contexts/ThemeContext.tsx`** - Gestión de temas
- **`client/src/hooks/useAuth.ts`** - Hook de autenticación
- **`client/src/hooks/use-mobile.tsx`** - Detección móvil
- **`client/src/hooks/use-toast.ts`** - Gestión de toasts

### Librerías y Utilidades
- **`client/src/lib/queryClient.ts`** - Cliente de React Query
- **`client/src/lib/tcf-bridge-integration.ts`** - Integración TCF Bridge

### Módulos de Facturación y Anuncios
- **`client/src/billing/billing.ts`** - Sistema de facturación
- **`client/src/ads/adManager.ts`** - Gestor de anuncios
- **`client/src/config/admob.ts`** - Configuración AdMob

## 📱 Otros Archivos Públicos

- **`client/public/robots.txt`** - Configuración para crawlers
- **`client/public/.well-known/assetlinks.json`** - Asset links de Android

## 📊 Resumen de Archivos Clave

### Total de archivos principales de la landing:
1. **1 componente principal**: Landing.tsx
2. **1 archivo HTML**: index.html
3. **1 entrada JS**: main.tsx
4. **1 hoja de estilos principal**: index.css
5. **2 componentes compartidos**: SEO.tsx, Navbar.tsx
6. **13 imágenes PNG**: logos + iconos de features
7. **1 imagen de fondo**: textura-grunge-oscura.jpg
8. **1 fuente personalizada**: Cheveuxdange.ttf
9. **2 scripts de integración**: tcf-bridge.js, admob-integration.js
10. **Múltiples archivos de configuración**: tailwind, vite, tsconfig, etc.

## 🎯 Características de la Landing

La landing page implementa:
- ✅ SEO optimizado con meta tags dinámicos
- ✅ Diseño responsivo (mobile-first)
- ✅ Tema tipo pizarra con 3 variantes de color
- ✅ Integración con redes sociales
- ✅ Demos interactivos de funcionalidades
- ✅ Animaciones y transiciones suaves
- ✅ Accesibilidad mejorada
- ✅ Navegación intuitiva
- ✅ CTAs prominentes
- ✅ Footer informativo

## 📝 Notas Adicionales

- Todas las rutas de archivos son relativas a `/home/user/backup/`
- La aplicación usa React 18 con TypeScript
- El bundler es Vite 5
- El framework CSS es Tailwind 3
- Los componentes UI son de Shadcn/ui
- La aplicación soporta PWA y TWA (Trusted Web Activity)
- Sistema de temas personalizado con variables CSS
