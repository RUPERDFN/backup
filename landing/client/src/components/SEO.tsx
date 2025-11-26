import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  canonical?: string;
  noindex?: boolean;
}

export default function SEO({
  title = "TheCookFlow - Planificador de Menús con IA en España",
  description = "Planifica menús semanales personalizados con inteligencia artificial. Reconocimiento de alimentos, listas de compra automáticas y recetas para cocinas españolas. Prueba gratuita de 7 días.",
  keywords = "planificador culinario, menús IA, planificador de menús España, recetas con IA, lista de compra inteligente, reconocimiento de alimentos, menús semanales personalizados, cocina española, ahorro en compra, TheCookFlow",
  ogTitle,
  ogDescription,
  ogImage = "/logo.PNG",
  canonical,
  noindex = false
}: SEOProps) {
  useEffect(() => {
    // Update title
    document.title = title;

    // Update or create meta tags
    const updateMeta = (name: string, content: string, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attribute}="${name}"]`);
      
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attribute, name);
        document.head.appendChild(meta);
      }
      
      meta.setAttribute('content', content);
    };

    // Basic meta tags
    updateMeta('description', description);
    updateMeta('keywords', keywords);

    // Open Graph tags
    updateMeta('og:title', ogTitle || title, true);
    updateMeta('og:description', ogDescription || description, true);
    updateMeta('og:image', ogImage, true);
    updateMeta('og:type', 'website', true);

    // Twitter Card tags
    updateMeta('twitter:card', 'summary_large_image');
    updateMeta('twitter:title', ogTitle || title);
    updateMeta('twitter:description', ogDescription || description);
    updateMeta('twitter:image', ogImage);

    // Robots meta tag
    if (noindex) {
      updateMeta('robots', 'noindex,nofollow');
    } else {
      const robotsMeta = document.querySelector('meta[name="robots"]');
      if (robotsMeta) {
        robotsMeta.remove();
      }
    }

    // Canonical URL
    if (canonical) {
      let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
      }
      
      link.setAttribute('href', canonical);
    }

    // Language
    document.documentElement.lang = 'es';
  }, [title, description, keywords, ogTitle, ogDescription, ogImage, canonical, noindex]);

  return null;
}
