import { getServiceBySlug, servicePages } from '../data/services';
import { defaultSiteData, getProjectBySlug } from './site-data';
import {
  DEFAULT_OG_IMAGE,
  DEFAULT_LOCALE,
  SITE_NAME,
  absoluteUrl,
  buildOrganizationSchema,
  buildWebsiteSchema,
} from './seo';
const projects = defaultSiteData.projects;

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
    buildOrganizationSchema(),
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
    buildOrganizationSchema(),
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
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Inicio',
            item: absoluteUrl('/'),
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Portafolio',
            item: absoluteUrl('/portafolio'),
          },
        ],
      },
    },
  ],
};

export function buildServiceSeo(slug: string): RouteSeoData | null {
  const service = getServiceBySlug(slug);
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
      buildOrganizationSchema(),
      {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: service.title,
        serviceType: service.category,
        areaServed: 'Chile',
        provider: {
          '@type': 'ProfessionalService',
          name: SITE_NAME,
          url: absoluteUrl('/'),
        },
        description: service.description,
        url: absoluteUrl(canonicalPath),
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
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Inicio',
            item: absoluteUrl('/'),
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Servicios',
            item: absoluteUrl('/#approach'),
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: service.shortTitle,
            item: absoluteUrl(canonicalPath),
          },
        ],
      },
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
      buildOrganizationSchema(),
      {
        '@context': 'https://schema.org',
        '@type': 'CreativeWork',
        name: project.title,
        headline: project.title,
        description: project.description,
        image: absoluteUrl(project.image),
        url: absoluteUrl(canonicalPath),
        dateCreated: project.year,
        about: project.services,
        author: {
          '@type': 'Organization',
          name: SITE_NAME,
          url: absoluteUrl('/'),
        },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Inicio',
            item: absoluteUrl('/'),
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Portafolio',
            item: absoluteUrl('/portafolio'),
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: project.title,
            item: absoluteUrl(canonicalPath),
          },
        ],
      },
    ],
  };
}

export function getPrerenderRoutes() {
  return [
    { url: '/', file: 'index.html' },
    { url: '/portafolio', file: 'portafolio/index.html' },
    ...projects.map((project) => ({
      url: `/proyectos/${project.slug}`,
      file: `proyectos/${project.slug}/index.html`,
    })),
    ...servicePages.map((service) => ({
      url: `/servicios/${service.slug}`,
      file: `servicios/${service.slug}/index.html`,
    })),
  ];
}

export function getRouteSeo(pathname: string): RouteSeoData {
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
    `<meta property="og:image:alt" content="${escapeHtml(seo.title)}">`,
    '<meta name="twitter:card" content="summary_large_image">',
    `<meta name="twitter:title" content="${escapeHtml(seo.title)}">`,
    `<meta name="twitter:description" content="${escapeHtml(seo.description)}">`,
    `<meta name="twitter:url" content="${escapeHtml(canonicalUrl)}">`,
    `<meta name="twitter:image" content="${escapeHtml(imageUrl)}">`,
    `<meta name="twitter:image:alt" content="${escapeHtml(seo.title)}">`,
  ];

  for (const item of schema) {
    tags.push(`<script type="application/ld+json">${jsonLd(item)}</script>`);
  }

  return tags.join('\n    ');
}
