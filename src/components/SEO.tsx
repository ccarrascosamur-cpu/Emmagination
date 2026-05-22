import { useEffect } from 'react';
import { DEFAULT_LOCALE, SITE_NAME, absoluteUrl } from '../lib/seo';
import { useSiteData } from '../lib/site-data-client';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  type?: string;
  canonicalPath?: string;
  robots?: string;
  schema?: Record<string, unknown> | Array<Record<string, unknown>>;
  noIndex?: boolean;
}

export default function SEO({
  title: titleProp,
  description: descriptionProp,
  keywords: keywordsProp,
  image: imageProp,
  type = 'website',
  canonicalPath = '/',
  robots = 'index, follow',
  schema,
  noIndex = false,
}: SEOProps) {
  const { data } = useSiteData();
  const seo = data.seo;

  const title = titleProp || seo.siteTitle || `${SITE_NAME} | Diseño Web, Branding y Experiencias Digitales en Chile`;
  const description = descriptionProp || seo.siteDescription || 'EMMAGINATION - Agencia de diseño web, branding, desarrollo Shopify y producción de contenido en Chile. Creamos experiencias digitales que transforman marcas.';
  const keywords = keywordsProp || seo.siteKeywords || 'diseño web, branding, shopify, desarrollo web, seo chile, agencia digital, e-commerce, producción de video';
  const image = imageProp || seo.ogImage || '/images/isotipo.png';
  const twitterHandle = seo.twitterHandle || '@emmagination';
  useEffect(() => {
    document.title = title;

    const canonicalUrl = absoluteUrl(canonicalPath);
    const imageUrl = absoluteUrl(image);
    const finalRobots = noIndex ? 'noindex, nofollow' : robots;

    const metaTags: Record<string, string> = {
      'description': description,
      'keywords': keywords,
      'robots': finalRobots,
      'googlebot': 'index, follow, max-image-preview:large',
      'og:title': title,
      'og:description': description,
      'og:image': imageUrl,
      'og:type': type,
      'og:url': canonicalUrl,
      'og:locale': DEFAULT_LOCALE,
      'og:site_name': SITE_NAME,
      'twitter:card': 'summary_large_image',
      'twitter:title': title,
      'twitter:description': description,
      'twitter:image': imageUrl,
      'twitter:url': canonicalUrl,
      'twitter:site': twitterHandle,
      'author': SITE_NAME,
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

    // Image dimensions for social sharing
    setOrCreateMeta('og:image:width', '1200', 'property');
    setOrCreateMeta('og:image:height', '630', 'property');
    setOrCreateMeta('og:image:alt', title, 'property');

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
  }, [canonicalPath, description, image, keywords, robots, schema, title, type, noIndex]);

  return null;
}

function setOrCreateMeta(name: string, content: string, attr: 'name' | 'property' = 'name') {
  let meta = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute(attr, name);
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', content);
}
