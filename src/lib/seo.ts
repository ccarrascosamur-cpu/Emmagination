export const SITE_NAME = 'EMMAGINATION';
export const SITE_URL = 'https://emmagination.ccarrascosamur.workers.dev';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/images/isotipo.png`;
export const DEFAULT_LOCALE = 'es_CL';
export const GOOGLE_BUSINESS_PROFILE_URL = 'https://share.google/SI0GjDkMkZa63cVnL';

export function absoluteUrl(path = '/') {
  return new URL(path, SITE_URL).toString();
}

export function buildOrganizationSchema(config?: {
  contactEmail?: string;
  contactPhone?: string;
  instagramUrl?: string;
  linkedinUrl?: string;
  googleBusinessUrl?: string;
}) {
  const email = config?.contactEmail ?? 'hola@emmagination.cl';
  const phone = config?.contactPhone ?? '+56 9 8829 0618';
  const sameAs = [
    config?.instagramUrl ?? 'https://instagram.com/emmagination',
    config?.linkedinUrl ?? 'https://linkedin.com/company/emmagination',
    config?.googleBusinessUrl ?? GOOGLE_BUSINESS_PROFILE_URL,
  ].filter(Boolean);

  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: SITE_NAME,
    url: SITE_URL,
    image: DEFAULT_OG_IMAGE,
    logo: DEFAULT_OG_IMAGE,
    description:
      'Agencia de diseño web, branding, Shopify y posicionamiento SEO en Chile.',
    areaServed: {
      '@type': 'Country',
      name: 'Chile',
    },
    availableLanguage: ['es', 'en'],
    email,
    telephone: phone,
    sameAs,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: phone,
      contactType: 'sales',
      availableLanguage: ['Spanish'],
      areaServed: 'CL',
    },
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'CL',
    },
    priceRange: '$$',
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '18:00',
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
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/portafolio?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function buildBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function buildLocalBusinessSchema(config?: {
  contactEmail?: string;
  contactPhone?: string;
  googleBusinessUrl?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${SITE_URL}/#business`,
    name: SITE_NAME,
    image: DEFAULT_OG_IMAGE,
    url: SITE_URL,
    telephone: config?.contactPhone ?? '+56 9 8829 0618',
    email: config?.contactEmail ?? 'hola@emmagination.cl',
    priceRange: '$$',
    areaServed: {
      '@type': 'Country',
      name: 'Chile',
    },
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'CL',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '-33.4489',
      longitude: '-70.6693',
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '18:00',
    },
    sameAs: [
      config?.googleBusinessUrl ?? GOOGLE_BUSINESS_PROFILE_URL,
    ].filter(Boolean),
  };
}
