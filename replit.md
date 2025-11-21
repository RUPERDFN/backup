# TheCookFlow

## Overview

TheCookFlow is an AI-powered Spanish language application designed for meal planning and grocery optimization. Initially a web application, its primary focus is now Android monetization through Google Play Billing. It offers intelligent weekly menu generation based on user preferences, visual food recognition, and streamlined grocery shopping with personalized lists and Amazon Fresh integration. The business model includes a 7-day free trial followed by automatic subscription billing.

## User Preferences

Preferred communication style: Simple, everyday language.
Preferred language: Spanish (castellano)

## Recent Changes

**Octubre 18, 2025**: MEJORAS COMPLETAS DE UX Y ACCESIBILIDAD
- ✅ **Sistema de Gamificación**: 9 achievements en 4 categorías, sistema de XP y niveles, página de Achievements con progreso visual
- ✅ **Theme Switcher**: 3 variantes de pizarra (Clásica/Moderna/Digital) con CSS variables y localStorage persistence
- ✅ **HelpTooltip System**: Componente reutilizable accesible integrado en MenuGenerator (Presupuesto, Tiempo, Porciones)
- ✅ **Onboarding Mejorado**: Barra de progreso con porcentaje, animaciones framer-motion, indicadores de pasos completados
- ✅ **Accesibilidad WCAG 2.1 AA**: Skip-link, focus-visible mejorado, ARIA labels apropiados en navegación
- ✅ **Soporte Reduced Motion**: Media query para usuarios con preferencia de movimiento reducido
- ✅ **Touch Targets Accesibles**: Tamaños mínimos de 44px para elementos interactivos
- ✅ **Variaciones de Color de Tiza**: 5 paletas temáticas (recipe/help/tip/warning/favorite) con efectos de glow
- ✅ **Sistema de Colores por Contexto**: Naranja (recetas), azul (ayuda), verde (consejos), amarillo (avisos), rosa (favoritos)

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite.
- **UI Framework**: shadcn/ui (Radix UI + Tailwind CSS).
- **State Management**: TanStack Query with LocalStorage cache.
- **Routing**: Wouter.
- **Styling**: Custom "blackboard and chalk" theme with handwritten fonts.
- **Form Handling**: React Hook Form with Zod validation.
- **File Uploads**: Uppy.js with AWS S3 integration.
- **UI/UX Decisions**: Consistent visual design with shadcn/ui Card components, chalk-green gradient background, interactive chat, and social media integration. Features a gamification system with achievements, user stats, and a leveling system, alongside a Theme Switcher for personalized blackboard styles. Enhanced onboarding with smooth animations and a visual progress bar.

### Backend Architecture
- **Framework**: Express.js with TypeScript on Node.js.
- **Database ORM**: Drizzle ORM with PostgreSQL.
- **Authentication**: Replit's OIDC-based system.
- **API Design**: RESTful.
- **File Storage**: Google Cloud Storage.
- **AI Integration**: OpenAI (menu generation, food recognition), Perplexity (fallback generation).
- **Billing Integration**: Google Play Billing API for Android subscriptions with server-side verification using Firebase service account credentials.
- **Advertising System**: PWA/TWA compatible ad management with GDPR compliance.

### Data Storage Solutions
- **Primary Database**: PostgreSQL via Neon Database.
- **Session Storage**: PostgreSQL-backed.
- **Object Storage**: Google Cloud Storage for user-uploaded images.
- **Schema Management**: Drizzle migrations.
- **Purchase Tracking**: `google_play_purchases` table for Android subscription verification.

### Authentication and Authorization
- **Provider**: Replit OIDC integration.
- **Session Management**: Express-session with PostgreSQL.
- **Security**: Middleware-based authentication, prompt sanitization, upload validation, rate-limiting, and hardened security configurations for Android WebView.

### Core Features Architecture
- **Menu Generation**: AI-powered weekly meal planning with a fallback system (OpenAI → Perplexity → Offline).
- **Food Recognition**: AI-powered image-to-ingredient identification using GPT-4o vision.
- **Shopping Lists**: Auto-generated, categorized, interactive lists with precise measurements.
- **Recipe Management**: Dual-layer system for user-specific and private library recipes.
- **Subscription System**: Google Play Billing integration for a €1.99/month premium plan on Android, including a 7-day free trial and automatic downgrade for expired subscriptions.
- **Monetization**: Google Play subscriptions and web advertising for free users, including Amazon Fresh affiliate revenue.
- **Freemium System**: Implemented with Drizzle schemas for trials and limits, a billing service for 7-day trials with auto-conversion, and a menu limiter. Includes ad components and a paywall dialog.
- **Gamification System**: Features achievements (planning, cooking, shopping, dedication), user statistics, and a leveling system.
- **Help Tooltips**: Contextual help integrated into critical forms like MenuGenerator.

## External Dependencies

### Cloud Services
- **Neon Database**: Serverless PostgreSQL hosting.
- **Google Cloud Storage**: Object storage.
- **Replit Infrastructure**: Authentication, development, and deployment.

### AI and Machine Learning
- **OpenAI API**: GPT-3.5 Turbo (text), GPT-4o (vision).
- **Perplexity API**: Sonar Basic model (fallback menu generation).

### Third-Party Integrations
- **Amazon Fresh**: Direct purchasing integration.
- **Google Play Billing**: Android subscription management via Google Play Developer API.
- **Firebase Admin SDK**: Service account authentication for Google Play API access.

### Database and ORM
- **Drizzle ORM**: Type-safe SQL ORM.
- **Drizzle Kit**: Migration and schema generation.

### UI and Styling Dependencies
- **Radix UI**: Accessible component primitives.
- **Tailwind CSS**: Utility-first styling.
- **Lucide React**: Icon library.
- **Google Fonts**: Custom typography (Kalam, Caveat).