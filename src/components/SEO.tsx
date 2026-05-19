import { useEffect } from 'react';
import { DEFAULT_LOCALE, SITE_NAME, absoluteUrl } from '../lib/seo';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  type?: string;
  canonicalPath?: string;
  robots?: string;
  schema?: Record<string, unknown> | Array<Record<string, unknown>>;
}

export default function SEO({
  title = `${SITE_NAME} | Diseño Web, Branding y Experiencias Digitales en Chile`,
  description = 'EMMAGINATION - Agencia de diseño web, branding, desarrollo Shopify y producción de contenido en Chile. Creamos experiencias digitales que transforman marcas.',
  keywords = 'diseño web, branding, shopify, desarrollo web, seo chile, agencia digital, e-commerce, producción de video',
  image = '/images/isotipo.png',
  type = 'website',
  canonicalPath = '/',
  robots = 'index, follow',
  schema,
}: SEOProps) {
  useEffect(() => {
    document.title = title;

    const canonicalUrl = absoluteUrl(canonicalPath);
    const imageUrl = absoluteUrl(image);

    const metaTags = {
      'description': description,
      'keywords': keywords,
      'robots': robots,
      'og:title': title,
      'og:description': description,
      'og:image': imageUrl,
      'og:type': type,
      'og:url': canonicalUrl,
      'og:locale': DEFAULT_LOCALE,
      'twitter:card': 'summary_large_image',
      'twitter:title': title,
      'twitter:description': description,
      'twitter:image': imageUrl,
      'twitter:url': canonicalUrl,
    };

    Object.entries(metaTags).forEach(([name, content]) => {
      const isOg = name.startsWith('og:');
      const isTwitter = name.startsWith('twitter:');
      
      let meta: HTMLMetaElement | null;
      if (isOg) {
        meta = document.querySelector(`meta[property="${name}"]`);
      } else if (isTwitter) {
        meta = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
      } else {
        meta = document.querySelector(`meta[name="${name}"]`);
      }

      if (!meta) {
        meta = document.createElement('meta');
        if (isOg) {
          meta.setAttribute('property', name);
        } else {
          meta.setAttribute('name', name);
        }
        document.head.appendChild(meta);
      }

      meta.setAttribute('content', content);
    });

    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalUrl);

    const schemaScriptId = 'seo-structured-data';
    const existingSchema = document.getElementById(schemaScriptId);
    if (schema && schema.length !== 0) {
      const payload = Array.isArray(schema) ? schema : [schema];
      const script = existingSchema ?? document.createElement('script');
      script.id = schemaScriptId;
      script.setAttribute('type', 'application/ld+json');
      script.textContent = JSON.stringify(payload);
      if (!existingSchema) {
        document.head.appendChild(script);
      }
    } else if (existingSchema) {
      existingSchema.remove();
    }
  }, [canonicalPath, description, image, keywords, robots, schema, title, type]);

  return null;
}
