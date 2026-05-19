export interface ServiceFaq {
  question: string;
  answer: string;
}

export interface ServicePageData {
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

export const googleBusinessProfileUrl = 'https://share.google/SI0GjDkMkZa63cVnL';

export const servicePages: ServicePageData[] = [
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

export function getServiceBySlug(slug: string) {
  if (slug === 'shopify-seo') {
    return servicePages.find((service) => service.slug === 'seo');
  }

  return servicePages.find((service) => service.slug === slug);
}
