export interface ProjectRecord {
  id: number;
  slug: string;
  title: string;
  client: string;
  category: string;
  year: string;
  image: string;
  pdf?: string;
  description: string;
  excerpt: string;
  url: string;
  services: string[];
  offset: number;
  featured: boolean;
  seoTitle?: string;
  seoDescription?: string;
  challenge: string;
  solution: string;
  results: string[];
  gallery: string[];
}

export interface SiteConfig {
  contactEmail: string;
  contactPhone: string;
  instagramUrl: string;
  linkedinUrl: string;
  googleBusinessUrl: string;
}

export interface SiteData {
  projects: ProjectRecord[];
  config: SiteConfig;
}

export const SITE_DATA_STORAGE_KEY = 'emmagination-site-data';

export const defaultSiteData: SiteData = {
  projects: [
    {
      id: 1,
      slug: 'portal-zen',
      title: 'Portal Zen',
      client: 'Portal Zen',
      category: 'E-commerce',
      year: '2024',
      image: '/images/project-portalzen.jpg',
      pdf: '/proyectos/portalzen.pdf',
      description:
        'Tienda online de productos esotéricos, aromaterapia y bienestar. Diseño minimalista con experiencia de compra fluida.',
      excerpt:
        'Rediseño e-commerce con foco en catálogo, claridad comercial y una experiencia de compra más limpia.',
      url: 'https://www.portalzen.cl',
      services: ['Shopify', 'E-commerce', 'Branding'],
      offset: 0,
      featured: true,
      seoTitle: 'Caso Portal Zen | E-commerce Shopify y Branding',
      seoDescription:
        'Caso de Portal Zen: rediseño e-commerce, branding y optimización de experiencia de compra para una tienda Shopify.',
      challenge:
        'La marca necesitaba una tienda más ordenada, coherente y capaz de presentar un catálogo amplio sin perder claridad visual ni intención comercial.',
      solution:
        'Se trabajó una experiencia Shopify más limpia, categorías más legibles y una propuesta visual alineada con el universo de la marca.',
      results: [
        'Catálogo más entendible para nuevas visitas.',
        'Jerarquía visual pensada para acompañar la compra.',
        'Base sólida para seguir creciendo con campañas y SEO.',
      ],
      gallery: ['/images/project-portalzen.jpg'],
    },
    {
      id: 2,
      slug: 'sagrada-madre',
      title: 'Sagrada Madre',
      client: 'Sagrada Madre',
      category: 'E-commerce',
      year: '2024',
      image: '/images/project-sagradamadre.jpg',
      pdf: '/proyectos/sagradamadre.pdf',
      description: 'E-commerce de productos naturales con identidad visual orgánica',
      excerpt:
        'Proyecto e-commerce orientado a identidad de marca, legibilidad de producto y una experiencia de compra más natural.',
      url: 'https://www.sagradamadre.cl',
      services: ['Diseño web', 'Shopify', 'Branding'],
      offset: 60,
      featured: true,
      seoTitle: 'Caso Sagrada Madre | Diseño Web y Branding E-commerce',
      seoDescription:
        'Caso de Sagrada Madre: trabajo de diseño web, branding y e-commerce para una marca de productos naturales.',
      challenge:
        'El sitio debía transmitir una identidad orgánica y al mismo tiempo sostener una estructura comercial clara para venta online.',
      solution:
        'Se articuló una propuesta visual más cálida, navegación más simple y una presentación de productos enfocada en comprensión rápida.',
      results: [
        'Identidad visual más coherente con el producto.',
        'Mejor lectura de categorías y fichas.',
        'Experiencia de compra más directa y consistente.',
      ],
      gallery: ['/images/project-sagradamadre.jpg'],
    },
    {
      id: 3,
      slug: 'fegar',
      title: 'Fegar',
      client: 'Fegar',
      category: 'Landing Page',
      year: '2024',
      image: '/images/project-fegar.jpg',
      pdf: '/proyectos/fegar.pdf',
      description: 'Landing page corporativa con branding completo',
      excerpt:
        'Landing page corporativa construida para comunicar con más claridad y reforzar una imagen de marca más sólida.',
      url: 'https://www.fegar.cl',
      services: ['Landing page', 'Branding', 'Logo'],
      offset: 0,
      featured: true,
      seoTitle: 'Caso Fegar | Landing Page Corporativa y Branding',
      seoDescription:
        'Caso Fegar: landing page corporativa con trabajo de branding y estructura enfocada en claridad comercial.',
      challenge:
        'La empresa necesitaba una presencia digital más clara para presentar sus servicios con una percepción más profesional.',
      solution:
        'Se desarrolló una landing de alto contraste, mensaje directo y estructura comercial más ordenada junto con una identidad renovada.',
      results: [
        'Narrativa comercial más clara.',
        'Mejor percepción corporativa.',
        'Base adecuada para campañas y presentación comercial.',
      ],
      gallery: ['/images/project-fegar.jpg'],
    },
    {
      id: 4,
      slug: 'ingles-rugby-club',
      title: 'Inglés Rugby Club',
      client: 'Inglés Rugby Club',
      category: 'Landing Page',
      year: '2024',
      image: '/images/project-irc.jpg',
      pdf: '/proyectos/irc.pdf',
      description:
        'Sitio web institucional para club de rugby con panel autoadministrable de contenidos y noticias.',
      excerpt:
        'Sitio institucional con gestión de contenidos para noticias, comunicaciones y presencia del club.',
      url: 'https://www.inglesrugbyclub.cl',
      services: ['Web institucional', 'Panel admin', 'Noticias'],
      offset: 60,
      featured: true,
      seoTitle: 'Caso Inglés Rugby Club | Web Institucional con Panel',
      seoDescription:
        'Caso Inglés Rugby Club: desarrollo de sitio institucional con panel autoadministrable para contenidos y noticias.',
      challenge:
        'El club necesitaba una web institucional simple de actualizar y clara para comunicar actividades, noticias y vida deportiva.',
      solution:
        'Se diseñó un sitio liviano, con estructura institucional y soporte para autogestión de contenidos clave.',
      results: [
        'Mayor autonomía para actualizar contenidos.',
        'Presentación institucional más ordenada.',
        'Canal digital más claro para la comunidad del club.',
      ],
      gallery: ['/images/project-irc.jpg'],
    },
  ],
  config: {
    contactEmail: 'hola@emmagination.cl',
    contactPhone: '+56 9 8829 0618',
    instagramUrl: 'https://instagram.com/emmagination',
    linkedinUrl: 'https://linkedin.com/company/emmagination',
    googleBusinessUrl: 'https://share.google/SI0GjDkMkZa63cVnL',
  },
};

export function slugify(input: string) {
  return input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function normalizeString(value: unknown, fallback = '') {
  return typeof value === 'string' ? value.trim() : fallback;
}

function normalizeStringArray(value: unknown) {
  if (Array.isArray(value)) {
    return value.map((item) => normalizeString(item)).filter(Boolean);
  }

  if (typeof value === 'string') {
    return value
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

export function normalizeProject(value: unknown, index = 0): ProjectRecord {
  const fallback = defaultSiteData.projects[index] ?? defaultSiteData.projects[0];
  const source = typeof value === 'object' && value !== null ? (value as Record<string, unknown>) : {};
  const title = normalizeString(source.title, fallback.title);

  return {
    id: Number(source.id) || fallback.id || Date.now() + index,
    slug: normalizeString(source.slug, slugify(title || fallback.title)),
    title: title || fallback.title,
    client: normalizeString(source.client, fallback.client),
    category: normalizeString(source.category, fallback.category),
    year: normalizeString(source.year, fallback.year),
    image: normalizeString(source.image, fallback.image),
    pdf: normalizeString(source.pdf, fallback.pdf ?? ''),
    description: normalizeString(source.description, fallback.description),
    excerpt: normalizeString(source.excerpt, fallback.excerpt),
    url: normalizeString(source.url, fallback.url),
    services: normalizeStringArray(source.services).length > 0
      ? normalizeStringArray(source.services)
      : fallback.services,
    offset: Number(source.offset) || 0,
    featured: source.featured === undefined ? fallback.featured : Boolean(source.featured),
    seoTitle: normalizeString(source.seoTitle, fallback.seoTitle ?? ''),
    seoDescription: normalizeString(source.seoDescription, fallback.seoDescription ?? ''),
    challenge: normalizeString(source.challenge, fallback.challenge),
    solution: normalizeString(source.solution, fallback.solution),
    results: normalizeStringArray(source.results).length > 0
      ? normalizeStringArray(source.results)
      : fallback.results,
    gallery: normalizeStringArray(source.gallery).length > 0
      ? normalizeStringArray(source.gallery)
      : fallback.gallery,
  };
}

export function normalizeSiteData(input: unknown): SiteData {
  const source = typeof input === 'object' && input !== null ? (input as Record<string, unknown>) : {};
  const projectsSource = Array.isArray(source.projects) ? source.projects : defaultSiteData.projects;
  const configSource =
    typeof source.config === 'object' && source.config !== null
      ? (source.config as Record<string, unknown>)
      : {};

  return {
    projects: projectsSource.map((project, index) => normalizeProject(project, index)),
    config: {
      contactEmail: normalizeString(configSource.contactEmail, defaultSiteData.config.contactEmail),
      contactPhone: normalizeString(configSource.contactPhone, defaultSiteData.config.contactPhone),
      instagramUrl: normalizeString(configSource.instagramUrl, defaultSiteData.config.instagramUrl),
      linkedinUrl: normalizeString(configSource.linkedinUrl, defaultSiteData.config.linkedinUrl),
      googleBusinessUrl: normalizeString(
        configSource.googleBusinessUrl,
        defaultSiteData.config.googleBusinessUrl,
      ),
    },
  };
}

export function getProjectCategories(projects: ProjectRecord[]) {
  return ['Todos', ...Array.from(new Set(projects.map((project) => project.category)))];
}

export function getProjectBySlug(projects: ProjectRecord[], slug: string) {
  return projects.find((project) => project.slug === slug);
}
