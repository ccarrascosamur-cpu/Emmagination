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

export interface ServiceFaq {
  question: string;
  answer: string;
}

export interface ServiceRecord {
  slug: string;
  shortTitle: string;
  title: string;
  heroTitle: string;
  intro: string;
  description: string;
  keywords: string;
  category: string;
  benefits: string[];
  deliverables: string[];
  process: string[];
  faqs: ServiceFaq[];
  relatedProjectIds: number[];
}

export interface HeroContent {
  badge: string;
  titleLine1: string;
  titleLine2: string;
  titleLine3: string;
  taglineLine1: string;
  taglineLine2: string;
  subtitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
}

export interface SeoGlobal {
  siteTitle: string;
  siteDescription: string;
  siteKeywords: string;
  ogImage: string;
  twitterHandle: string;
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
  services: ServiceRecord[];
  config: SiteConfig;
  hero: HeroContent;
  seo: SeoGlobal;
}

export const SITE_DATA_STORAGE_KEY = 'emmagination-site-data';

export const defaultHero: HeroContent = {
  badge: 'Agencia de diseño web, branding y SEO en Chile',
  titleLine1: 'Diseño Web,',
  titleLine2: 'Branding y SEO',
  titleLine3: 'en Chile',
  taglineLine1: 'Deja de ser un logo.',
  taglineLine2: 'Pasa a ser una marca.',
  subtitle:
    'Diseñamos identidades y posicionamos marcas en Google. Hacemos que tu negocio se vea, se entienda y se compre.',
  ctaPrimary: 'Trabajemos juntos',
  ctaSecondary: 'Ver proyectos',
};

export const defaultSeo: SeoGlobal = {
  siteTitle: 'EMMAGINATION | Diseño Web, Branding y Experiencias Digitales en Chile',
  siteDescription:
    'EMMAGINATION - Agencia de diseño web, branding, desarrollo Shopify y producción de contenido en Chile. Creamos experiencias digitales que transforman marcas.',
  siteKeywords:
    'diseño web, branding, shopify, desarrollo web, seo chile, agencia digital, e-commerce, producción de video',
  ogImage: '/images/isotipo.png',
  twitterHandle: '@emmagination',
};

export const defaultServices: ServiceRecord[] = [
  {
    slug: 'diseno-web',
    shortTitle: 'Diseño Web',
    title: 'Diseño Web Profesional en Chile',
    heroTitle: 'Sitios web pensados para verse bien, cargar rápido y convertir.',
    intro:
      'Diseñamos sitios corporativos, landing pages y webs comerciales con foco en claridad, performance y posicionamiento.',
    description:
      'Servicio de diseño web profesional en Chile para marcas que necesitan una presencia sólida, rápida y orientada a resultados.',
    keywords:
      'diseño web chile, diseño web profesional, landing page chile, paginas web chile, agencia diseño web',
    category: 'Diseño web',
    benefits: [
      'Arquitectura clara para que Google y tus clientes entiendan tu propuesta.',
      'Diseño responsive con jerarquía visual orientada a conversión.',
      'Base técnica optimizada para velocidad, indexación y mantenimiento.',
    ],
    deliverables: [
      'UX/UI para home, páginas clave y secciones comerciales.',
      'Sistema visual coherente con tu marca y tus objetivos.',
      'Implementación optimizada en frontend moderno.',
    ],
    process: [
      'Auditoría de negocio, competencia y estructura de contenidos.',
      'Wireframes y propuesta visual con foco en mensaje y conversión.',
      'Desarrollo, QA técnico, lanzamiento y medición inicial.',
    ],
    faqs: [
      {
        question: '¿Qué tipo de sitios diseñan?',
        answer:
          'Trabajamos sitios corporativos, landing pages, portfolios y webs comerciales con foco en captación y posicionamiento.',
      },
      {
        question: '¿Incluyen SEO técnico en el desarrollo?',
        answer:
          'Sí. Definimos metadata, estructura semántica, enlazado interno, performance y base técnica para indexación.',
      },
      {
        question: '¿Pueden rediseñar un sitio existente?',
        answer:
          'Sí. Podemos rediseñar una web actual sin perder foco comercial y corrigiendo problemas de UX, velocidad y rastreo.',
      },
    ],
    relatedProjectIds: [3, 4],
  },
  {
    slug: 'branding',
    shortTitle: 'Branding',
    title: 'Branding e Identidad Visual en Chile',
    heroTitle: 'Construimos marcas que se reconocen, se recuerdan y se entienden.',
    intro:
      'Desarrollamos identidades visuales con criterio estratégico para que tu marca gane coherencia y presencia.',
    description:
      'Servicio de branding e identidad visual en Chile para empresas que necesitan diferenciarse con claridad y consistencia.',
    keywords:
      'branding chile, identidad visual chile, diseño de marca, logo profesional chile, agencia branding',
    category: 'Branding',
    benefits: [
      'Una marca más clara y consistente en web, redes y piezas comerciales.',
      'Lenguaje visual alineado con el posicionamiento del negocio.',
      'Activos de marca listos para crecer sin improvisación.',
    ],
    deliverables: [
      'Concepto visual, logotipo y sistema gráfico base.',
      'Paleta, tipografías, criterios de composición y aplicaciones.',
      'Guía de uso para mantener consistencia en el tiempo.',
    ],
    process: [
      'Diagnóstico de posicionamiento, audiencia y tono de marca.',
      'Exploración visual y definición del sistema de identidad.',
      'Entrega de lineamientos y aplicaciones prioritarias.',
    ],
    faqs: [
      {
        question: '¿El branding es solo el logo?',
        answer:
          'No. El logo es una parte. El branding incluye sistema visual, tono, consistencia y percepción de marca.',
      },
      {
        question: '¿Sirve para marcas nuevas y existentes?',
        answer:
          'Sí. Podemos construir una identidad desde cero o reorganizar una marca que ya existe pero perdió coherencia.',
      },
      {
        question: '¿Entregan archivos y lineamientos?',
        answer:
          'Sí. Entregamos archivos base y una guía para aplicar la identidad de forma consistente.',
      },
    ],
    relatedProjectIds: [1, 2, 3],
  },
  {
    slug: 'seo',
    shortTitle: 'SEO',
    title: 'SEO Profesional en Chile',
    heroTitle: 'Posicionamiento orgánico pensado para atraer búsquedas correctas y convertir mejor.',
    intro:
      'Trabajamos SEO técnico, local, on-page y estratégico para sitios corporativos, servicios y e-commerce, incluyendo Shopify cuando corresponde.',
    description:
      'Servicio de SEO profesional en Chile para marcas que necesitan más visibilidad orgánica, mejor estructura técnica y crecimiento sostenible.',
    keywords:
      'seo chile, posicionamiento web chile, seo tecnico chile, seo local chile, agencia seo chile',
    category: 'SEO',
    benefits: [
      'Más claridad para Google sobre qué ofrece tu negocio y para qué búsquedas eres relevante.',
      'Correcciones técnicas que mejoran rastreo, indexación, velocidad y experiencia.',
      'Enfoque combinado de posicionamiento y conversión para atraer tráfico con intención real.',
    ],
    deliverables: [
      'Auditoría SEO técnica, semántica y de competencia.',
      'Mejoras en metadata, enlazado interno, arquitectura y contenido clave.',
      'Roadmap priorizado para SEO local, técnico y comercial.',
    ],
    process: [
      'Auditoría del sitio, búsquedas objetivo, competencia y estado técnico.',
      'Priorización de quick wins y oportunidades de crecimiento orgánico.',
      'Implementación, validación y mejora continua según datos y resultados.',
    ],
    faqs: [
      {
        question: '¿Solo trabajan SEO para Shopify?',
        answer:
          'No. Trabajamos SEO para sitios corporativos, servicios, landings y e-commerce. Shopify es solo una de las plataformas que podemos optimizar.',
      },
      {
        question: '¿Qué incluye su servicio de SEO?',
        answer:
          'Incluye auditoría técnica, arquitectura, enlazado interno, metadata, contenido, SEO local y prioridades de implementación.',
      },
      {
        question: '¿Sirve para negocios locales y empresas de servicios?',
        answer:
          'Sí. De hecho, en negocios locales y de servicios el SEO bien estructurado suele generar oportunidades comerciales de alta intención.',
      },
    ],
    relatedProjectIds: [1, 2, 3],
  },
];

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
  services: defaultServices,
  config: {
    contactEmail: 'hola@emmagination.cl',
    contactPhone: '+56 9 8829 0618',
    instagramUrl: 'https://instagram.com/emmagination',
    linkedinUrl: 'https://linkedin.com/company/emmagination',
    googleBusinessUrl: 'https://share.google/SI0GjDkMkZa63cVnL',
  },
  hero: defaultHero,
  seo: defaultSeo,
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

function normalizeFaqs(value: unknown): ServiceFaq[] {
  if (Array.isArray(value)) {
    return value
      .filter((item): item is Record<string, unknown> => typeof item === 'object' && item !== null)
      .map((item) => ({
        question: normalizeString(item.question),
        answer: normalizeString(item.answer),
      }))
      .filter((faq) => faq.question && faq.answer);
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

export function normalizeService(value: unknown, index = 0): ServiceRecord {
  const fallback = defaultSiteData.services[index] ?? defaultSiteData.services[0];
  const source = typeof value === 'object' && value !== null ? (value as Record<string, unknown>) : {};

  return {
    slug: normalizeString(source.slug, fallback.slug),
    shortTitle: normalizeString(source.shortTitle, fallback.shortTitle),
    title: normalizeString(source.title, fallback.title),
    heroTitle: normalizeString(source.heroTitle, fallback.heroTitle),
    intro: normalizeString(source.intro, fallback.intro),
    description: normalizeString(source.description, fallback.description),
    keywords: normalizeString(source.keywords, fallback.keywords),
    category: normalizeString(source.category, fallback.category),
    benefits: normalizeStringArray(source.benefits).length > 0
      ? normalizeStringArray(source.benefits)
      : fallback.benefits,
    deliverables: normalizeStringArray(source.deliverables).length > 0
      ? normalizeStringArray(source.deliverables)
      : fallback.deliverables,
    process: normalizeStringArray(source.process).length > 0
      ? normalizeStringArray(source.process)
      : fallback.process,
    faqs: normalizeFaqs(source.faqs).length > 0 ? normalizeFaqs(source.faqs) : fallback.faqs,
    relatedProjectIds: Array.isArray(source.relatedProjectIds)
      ? source.relatedProjectIds.map((id) => Number(id)).filter(Boolean)
      : fallback.relatedProjectIds,
  };
}

export function normalizeHero(value: unknown): HeroContent {
  const source = typeof value === 'object' && value !== null ? (value as Record<string, unknown>) : {};
  return {
    badge: normalizeString(source.badge, defaultHero.badge),
    titleLine1: normalizeString(source.titleLine1, defaultHero.titleLine1),
    titleLine2: normalizeString(source.titleLine2, defaultHero.titleLine2),
    titleLine3: normalizeString(source.titleLine3, defaultHero.titleLine3),
    taglineLine1: normalizeString(source.taglineLine1, defaultHero.taglineLine1),
    taglineLine2: normalizeString(source.taglineLine2, defaultHero.taglineLine2),
    subtitle: normalizeString(source.subtitle, defaultHero.subtitle),
    ctaPrimary: normalizeString(source.ctaPrimary, defaultHero.ctaPrimary),
    ctaSecondary: normalizeString(source.ctaSecondary, defaultHero.ctaSecondary),
  };
}

export function normalizeSeo(value: unknown): SeoGlobal {
  const source = typeof value === 'object' && value !== null ? (value as Record<string, unknown>) : {};
  return {
    siteTitle: normalizeString(source.siteTitle, defaultSeo.siteTitle),
    siteDescription: normalizeString(source.siteDescription, defaultSeo.siteDescription),
    siteKeywords: normalizeString(source.siteKeywords, defaultSeo.siteKeywords),
    ogImage: normalizeString(source.ogImage, defaultSeo.ogImage),
    twitterHandle: normalizeString(source.twitterHandle, defaultSeo.twitterHandle),
  };
}

export function normalizeSiteData(input: unknown): SiteData {
  const source = typeof input === 'object' && input !== null ? (input as Record<string, unknown>) : {};
  const projectsSource = Array.isArray(source.projects) ? source.projects : defaultSiteData.projects;
  const servicesSource = Array.isArray(source.services) ? source.services : defaultSiteData.services;
  const configSource =
    typeof source.config === 'object' && source.config !== null
      ? (source.config as Record<string, unknown>)
      : {};

  return {
    projects: projectsSource.map((project, index) => normalizeProject(project, index)),
    services: servicesSource.map((service, index) => normalizeService(service, index)),
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
    hero: normalizeHero(source.hero),
    seo: normalizeSeo(source.seo),
  };
}

export function getProjectCategories(projects: ProjectRecord[]) {
  return ['Todos', ...Array.from(new Set(projects.map((project) => project.category)))];
}

export function getProjectBySlug(projects: ProjectRecord[], slug: string) {
  return projects.find((project) => project.slug === slug);
}

export function getServiceBySlug(services: ServiceRecord[], slug: string) {
  if (slug === 'shopify-seo') {
    return services.find((service) => service.slug === 'seo');
  }
  return services.find((service) => service.slug === slug);
}
