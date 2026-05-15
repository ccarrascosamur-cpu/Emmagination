import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: string;
}

export default function SEO({
  title = 'EMMAGINATION | Diseño Web, Branding y Experiencias Digitales en Chile',
  description = 'EMMAGINATION - Agencia de diseño web, branding, desarrollo Shopify y producción de contenido en Chile. Creamos experiencias digitales que transforman marcas.',
  keywords = 'diseño web, branding, shopify, desarrollo web, diseño chile, agencia digital, e-commerce, producción de video, filmaker',
  ogImage = 'https://emmagination.ccarrascosamur.workers.dev/images/isotipo.png',
  ogType = 'website',
}: SEOProps) {
  useEffect(() => {
    // Update title
    document.title = title;

    // Update meta tags
    const metaTags = {
      'description': description,
      'keywords': keywords,
      'og:title': title,
      'og:description': description,
      'og:image': ogImage,
      'og:type': ogType,
      'twitter:title': title,
      'twitter:description': description,
      'twitter:image': ogImage,
    };

    Object.entries(metaTags).forEach(([name, content]) => {
      const isOg = name.startsWith('og:');
      const isTwitter = name.startsWith('twitter:');
      
      let meta: HTMLMetaElement | null;
      if (isOg) {
        meta = document.querySelector(`meta[property="${name}"]`);
      } else if (isTwitter) {
        meta = document.querySelector(`meta[property="${name}"]`);
      } else {
        meta = document.querySelector(`meta[name="${name}"]`);
      }

      if (meta) {
        meta.setAttribute('content', content);
      }
    });
  }, [title, description, keywords, ogImage, ogType]);

  return null;
}
