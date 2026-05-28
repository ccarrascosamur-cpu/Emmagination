import { defaultSiteData, getProjectBySlug, getServiceBySlug } from './site-data';
import {
  DEFAULT_OG_IMAGE,
  DEFAULT_LANGUAGE,
  DEFAULT_LOCALE,
  SITE_NAME,
  absoluteUrl,
  buildBreadcrumbSchema,
  buildLocalBusinessSchema,
  buildOrganizationSchema,
  buildWebsiteSchema,
  getAlternateLocales,
} from './seo';
const projects = defaultSiteData.projects;
const services = defaultSiteData.services;

export interface RouteSeoData {
  title: string;
  description: string;
  keywords: string;
  canonicalPath: string;
  image?: string;
  type?: string;
  robots?: string;
  schema?: Record<string, unknown>[];
}

export const homeSeo: RouteSeoData = {
  title: 'Diseño Web, Branding y SEO en Chile | EMMAGINATION',
  description:
    'Agencia en Chile especializada en diseño web, branding y SEO. Creamos sitios visuales, rápidos y orientados a conversión.',
  keywords:
    'diseño web chile, agencia branding chile, shopify chile, seo chile, desarrollo web chile, e-commerce chile',
  canonicalPath: '/',
  image: '/images/isotipo.png',
  type: 'website',
  robots: 'index, follow',
  schema: [
    buildWebsiteSchema(),
    buildOrganizationSchema(defaultSiteData.config),
    buildLocalBusinessSchema(defaultSiteData.config),
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Diseño Web, Branding y SEO en Chile | EMMAGINATION',
      url: absoluteUrl('/'),
      description:
        'Página principal de EMMAGINATION con servicios de diseño web, branding y SEO en Chile.',
      isPartOf: {
        '@type': 'WebSite',
        name: SITE_NAME,
        url: absoluteUrl('/'),
      },
      primaryImageOfPage: absoluteUrl('/images/isotipo.png'),
      breadcrumb: buildBreadcrumbSchema([
        { name: 'Inicio', url: absoluteUrl('/') },
      ]),
    },
  ],
};

export const portfolioSeo: RouteSeoData = {
  title: 'Portafolio Web y Branding | EMMAGINATION',
  description:
    'Portafolio de EMMAGINATION con proyectos de e-commerce, landing pages, branding y desarrollo web en Chile.',
  keywords:
    'portafolio diseño web, casos de estudio web, proyectos shopify chile, branding chile, e-commerce chile',
  canonicalPath: '/portafolio',
  image: '/images/isotipo.png',
  type: 'website',
  robots: 'index, follow',
  schema: [
    buildOrganizationSchema(defaultSiteData.config),
    buildLocalBusinessSchema(defaultSiteData.config),
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Portafolio | EMMAGINATION',
      url: absoluteUrl('/portafolio'),
      description:
        'Selección de proyectos de diseño web, branding y e-commerce desarrollados por EMMAGINATION.',
      hasPart: projects.map((project) => ({
        '@type': 'CreativeWork',
        name: project.title,
        url: project.url,
        image: absoluteUrl(project.image),
        description: project.description,
        dateCreated: project.year,
      })),
      breadcrumb: buildBreadcrumbSchema([
        { name: 'Inicio', url: absoluteUrl('/') },
        { name: 'Portafolio', url: absoluteUrl('/portafolio') },
      ]),
    },
  ],
};

export function buildServiceSeo(slug: string): RouteSeoData | null {
  const service = getServiceBySlug(services, slug);
  if (!service) return null;

  const canonicalPath = `/servicios/${service.slug}`;

  return {
    title: `${service.title} | EMMAGINATION`,
    description: service.description,
    keywords: service.keywords,
    canonicalPath,
    image: '/images/isotipo.png',
    type: 'website',
    robots: 'index, follow',
    schema: [
      buildOrganizationSchema(defaultSiteData.config),
      buildLocalBusinessSchema(defaultSiteData.config),
      {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: service.title,
        serviceType: service.category,
        areaServed: {
          '@type': 'Country',
          name: 'Chile',
        },
        provider: {
          '@type': 'ProfessionalService',
          name: SITE_NAME,
          url: absoluteUrl('/'),
        },
        description: service.description,
        url: absoluteUrl(canonicalPath),
        offers: {
          '@type': 'Offer',
          areaServed: 'CL',
          priceCurrency: 'CLP',
          availability: 'https://schema.org/InStock',
        },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: service.faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      },
      buildBreadcrumbSchema([
        { name: 'Inicio', url: absoluteUrl('/') },
        { name: 'Servicios', url: absoluteUrl('/#approach') },
        { name: service.shortTitle, url: absoluteUrl(canonicalPath) },
      ]),
    ],
  };
}

export function buildProjectSeo(slug: string): RouteSeoData | null {
  const project = getProjectBySlug(projects, slug);
  if (!project) return null;

  const canonicalPath = `/proyectos/${project.slug}`;

  return {
    title: `${project.seoTitle || project.title} | EMMAGINATION`,
    description: project.seoDescription || project.description,
    keywords: [
      project.title,
      project.category,
      ...project.services,
      'caso de estudio',
      'portafolio web chile',
    ].join(', '),
    canonicalPath,
    image: project.image,
    type: 'article',
    robots: 'index, follow',
    schema: [
      buildOrganizationSchema(defaultSiteData.config),
      buildLocalBusinessSchema(defaultSiteData.config),
      {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: project.seoTitle || project.title,
        description: project.seoDescription || project.description,
        image: absoluteUrl(project.image),
        url: absoluteUrl(canonicalPath),
        datePublished: `${project.year}-01-01`,
        dateModified: `${project.year}-06-01`,
        author: {
          '@type': 'Organization',
          name: SITE_NAME,
          url: absoluteUrl('/'),
        },
        publisher: {
          '@type': 'Organization',
          name: SITE_NAME,
          logo: {
            '@type': 'ImageObject',
            url: absoluteUrl('/images/isotipo.png'),
            width: 1024,
            height: 1024,
          },
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': absoluteUrl(canonicalPath),
        },
        about: project.services,
        articleSection: project.category,
      },
      buildBreadcrumbSchema([
        { name: 'Inicio', url: absoluteUrl('/') },
        { name: 'Portafolio', url: absoluteUrl('/portafolio') },
        { name: project.title, url: absoluteUrl(canonicalPath) },
      ]),
    ],
  };
}

const SECTION_ROUTES = [
  'servicios',
  'portafolio',
  'proceso',
  'testimonios',
  'contacto',
  'cotizar',
  'auditoria',
];

export function getPrerenderRoutes() {
  return [
    { url: '/', file: 'index.html' },
    { url: '/portafolio', file: 'portafolio/index.html' },
    ...projects.map((project) => ({
      url: `/proyectos/${project.slug}`,
      file: `proyectos/${project.slug}/index.html`,
    })),
    ...services.map((service) => ({
      url: `/servicios/${service.slug}`,
      file: `servicios/${service.slug}/index.html`,
    })),
    ...SECTION_ROUTES.map((section) => ({
      url: `/${section}`,
      file: `${section}/index.html`,
    })),
    { url: '/ads/landing', file: 'ads/landing/index.html' },
  ];
}

const SECTION_SEO: Record<string, RouteSeoData> = {
  servicios: {
    title: 'Servicios de Diseño Web, Branding y SEO en Chile | EMMAGINATION',
    description: 'Descubre nuestros servicios de diseño web profesional, branding e identidad visual, y SEO técnico en Chile. Soluciones digitales para hacer crecer tu marca.',
    keywords: 'servicios diseño web chile, branding chile, seo chile, agencia digital servicios',
    canonicalPath: '/servicios',
    image: '/images/og-default.jpg',
    type: 'website',
    robots: 'index, follow',
  },
  portafolio: portfolioSeo,
  proceso: {
    title: 'Nuestro Proceso de Diseño Web y Branding | EMMAGINATION',
    description: 'Conoce nuestro proceso de trabajo: descubrimiento, estrategia, diseño, desarrollo y lanzamiento. Metodología probada para proyectos digitales exitosos.',
    keywords: 'proceso diseño web, metodología branding, cómo trabaja agencia digital',
    canonicalPath: '/proceso',
    image: '/images/og-default.jpg',
    type: 'website',
    robots: 'index, follow',
  },
  testimonios: {
    title: 'Testimonios y Opiniones de Clientes | EMMAGINATION',
    description: 'Lee lo que dicen nuestros clientes sobre nuestros servicios de diseño web, branding y SEO en Chile. Testimonios reales de marcas que confiaron en nosotros.',
    keywords: 'testimonios agencia diseño web, opiniones branding chile, clientes satisfechos',
    canonicalPath: '/testimonios',
    image: '/images/og-default.jpg',
    type: 'website',
    robots: 'index, follow',
  },
  contacto: {
    title: 'Contacto - Agencia de Diseño Web y Branding en Chile | EMMAGINATION',
    description: 'Contáctanos para tu proyecto de diseño web, branding o SEO. Cotización gratuita. Atención personalizada para marcas en Chile.',
    keywords: 'contacto agencia diseño web chile, cotizar diseño web, contactar branding chile',
    canonicalPath: '/contacto',
    image: '/images/og-default.jpg',
    type: 'website',
    robots: 'index, follow',
  },
  cotizar: {
    title: 'Cotizar Diseño Web, Branding o SEO | EMMAGINATION',
    description: 'Obtén una cotización personalizada para tu proyecto de diseño web, branding o SEO en Chile. Calculadora online y atención directa por WhatsApp.',
    keywords: 'cotizar diseño web chile, presupuesto branding, cuánto cuesta página web chile',
    canonicalPath: '/cotizar',
    image: '/images/og-default.jpg',
    type: 'website',
    robots: 'index, follow',
  },
  auditoria: {
    title: 'Auditoría SEO Gratuita para tu Sitio Web | EMMAGINATION',
    description: 'Solicita una auditoría SEO gratuita de tu sitio web. Analizamos velocidad, indexación, contenido y oportunidades de mejora. Sin compromiso.',
    keywords: 'auditoría seo gratis, análisis web gratuito, revisión seo chile',
    canonicalPath: '/auditoria',
    image: '/images/og-default.jpg',
    type: 'website',
    robots: 'index, follow',
  },
  'ads/landing': {
    title: 'Diseño Web y Branding en Chile | Cotización Gratuita | EMMAGINATION',
    description: 'Agencia de diseño web y branding en Chile. Creamos marcas visuales, landing pages, sitios corporativos y e-commerce Shopify. Cotiza gratis hoy.',
    keywords: 'diseño web chile, branding chile, agencia diseño web, identidad visual chile, landing page chile',
    canonicalPath: '/ads/landing',
    image: '/images/og-default.jpg',
    type: 'website',
    robots: 'index, follow',
  },
};

export function getRouteSeo(pathname: string): RouteSeoData {
  // Check for exact section matches first
  const cleanPath = pathname.replace(/^\//, '').split('/')[0];
  if (SECTION_SEO[cleanPath]) {
    return SECTION_SEO[cleanPath];
  }
  if (pathname === '/ads/landing' || pathname.startsWith('/ads/landing')) {
    return SECTION_SEO['ads/landing'];
  }

  if (pathname === '/portafolio' || pathname.startsWith('/portafolio/')) {
    return portfolioSeo;
  }

  if (pathname.startsWith('/proyectos/')) {
    const slug = pathname.replace('/proyectos/', '').split('/')[0];
    return buildProjectSeo(slug) ?? portfolioSeo;
  }

  if (pathname.startsWith('/servicios/')) {
    const slug = pathname.replace('/servicios/', '').split('/')[0];
    return buildServiceSeo(slug) ?? homeSeo;
  }

  return homeSeo;
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function jsonLd(value: unknown) {
  return JSON.stringify(value).replaceAll('<', '\\u003c');
}

export function renderSeoHead(seo: RouteSeoData) {
  const canonicalUrl = absoluteUrl(seo.canonicalPath);
  const imageUrl = absoluteUrl(seo.image ?? DEFAULT_OG_IMAGE);
  const type = seo.type ?? 'website';
  const robots = seo.robots ?? 'index, follow';
  const schema = seo.schema ?? [];
  const alternateLocales = getAlternateLocales(seo.canonicalPath);
  const twitterHandle = defaultSiteData.seo.twitterHandle || '@emmagination';

  const tags = [
    `<title>${escapeHtml(seo.title)}</title>`,
    `<meta name="description" content="${escapeHtml(seo.description)}">`,
    `<meta name="keywords" content="${escapeHtml(seo.keywords)}">`,
    `<meta name="robots" content="${escapeHtml(robots)}">`,
    '<meta name="googlebot" content="index, follow, max-image-preview:large">',
    `<link rel="canonical" href="${escapeHtml(canonicalUrl)}">`,
    `<meta property="og:locale" content="${DEFAULT_LOCALE}">`,
    `<meta property="og:site_name" content="${SITE_NAME}">`,
    `<meta property="og:type" content="${escapeHtml(type)}">`,
    `<meta property="og:title" content="${escapeHtml(seo.title)}">`,
    `<meta property="og:description" content="${escapeHtml(seo.description)}">`,
    `<meta property="og:url" content="${escapeHtml(canonicalUrl)}">`,
    `<meta property="og:image" content="${escapeHtml(imageUrl)}">`,
    '<meta property="og:image:width" content="1200">',
    '<meta property="og:image:height" content="630">',
    `<meta property="og:image:alt" content="${escapeHtml(seo.title)}">`,
    '<meta name="twitter:card" content="summary_large_image">',
    `<meta name="twitter:title" content="${escapeHtml(seo.title)}">`,
    `<meta name="twitter:description" content="${escapeHtml(seo.description)}">`,
    `<meta name="twitter:site" content="${escapeHtml(twitterHandle)}">`,
    `<meta name="twitter:url" content="${escapeHtml(canonicalUrl)}">`,
    `<meta name="twitter:image" content="${escapeHtml(imageUrl)}">`,
    `<meta name="twitter:image:alt" content="${escapeHtml(seo.title)}">`,
    `<meta name="language" content="${escapeHtml(DEFAULT_LANGUAGE)}">`,
  ];

  for (const alternate of alternateLocales) {
    tags.push(
      `<link rel="alternate" hreflang="${escapeHtml(alternate.hrefLang)}" href="${escapeHtml(alternate.href)}">`,
    );
  }

  for (const item of schema) {
    tags.push(`<script type="application/ld+json">${jsonLd(item)}</script>`);
  }

  return tags.join('\n    ');
}
