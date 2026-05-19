export const SITE_NAME = 'EMMAGINATION';
export const SITE_URL = 'https://emmagination.ccarrascosamur.workers.dev';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/images/isotipo.png`;
export const DEFAULT_LOCALE = 'es_CL';
export const GOOGLE_BUSINESS_PROFILE_URL = 'https://share.google/SI0GjDkMkZa63cVnL';

export function absoluteUrl(path = '/') {
  return new URL(path, SITE_URL).toString();
}

export function buildOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: SITE_NAME,
    url: SITE_URL,
    image: DEFAULT_OG_IMAGE,
    logo: DEFAULT_OG_IMAGE,
    description:
      'Agencia de diseño web, branding, Shopify y posicionamiento SEO en Chile.',
    areaServed: 'CL',
    availableLanguage: ['es', 'en'],
    email: 'hola@emmagination.cl',
    telephone: '+56 9 8829 0618',
    sameAs: [
      'https://instagram.com/emmagination',
      'https://linkedin.com/company/emmagination',
      GOOGLE_BUSINESS_PROFILE_URL,
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+56 9 8829 0618',
      contactType: 'sales',
      availableLanguage: ['Spanish'],
    },
  };
}

export function buildWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: 'es-CL',
    description:
      'Sitio oficial de EMMAGINATION, agencia de diseño web, branding y experiencias digitales en Chile.',
  };
}
