import { Project } from "./types";

export const projects: Project[] = [
  {
    id: "matias-brieba",
    title: "Matias Brieba",
    category: "ecommerce",
    categoryLabel: "ECOMMERCE · SHOPIFY PLUS",
    tags: ["Fotografía", "Shopify Plus", "Media Delivery"],
    description: "Portafolio y e-commerce inmersivo diseñado para la venta de licencias de video, presets y cursos de alta resolución.",
    longDescription: "Rediseño completo de la tienda online del reconocido cineasta y fotógrafo Matías Brieba. El desafío principal radicaba en alojar archivos de altísimo peso sin comprometer la velocidad de carga móvil, y lograr una interfaz que reflejara la pulcritud cinematográfica de su fotografía.",
    beforeDescription: "Portafolio lento con imágenes sin optimizar que tardaban hasta 8 segundos en renderizarse, provocando un rebote del 62% de las visitas interesadas y un checkout confuso.",
    afterDescription: "Estructura de carga progresiva integrada, optimización dinámica de assets visuales y un checkout ultrarrápido en un solo paso con Shopify Plus. Interfaces cinematográficas oscuras con transiciones fluidas de página.",
    metrics: [
      { label: "Tráfico Orgánico", value: "+45%", trend: "up" },
      { label: "Conversión General", value: "+12%", trend: "up" },
      { label: "Velocidad Core Web Vitals", value: "98/100", trend: "up" }
    ],
    techStack: ["Shopify Plus", "Liquid", "Tailwind CSS", "motion/react", "Cloudflare Stream"],
    color: "from-[#a816f0] via-[#8212e3] to-[#4c05b3]",
    glowColor: "shadow-[0_0_50px_-12px_rgba(168,22,240,0.35)]",
    textColor: "text-purple-400",
    imageAccent: "matias",
    chartData: [
      { month: "Ene", before: 1.2, after: 1.2 },
      { month: "Feb", before: 1.1, after: 1.3 },
      { month: "Mar", before: 0.9, after: 1.5 },
      { month: "Abr", before: 1.0, after: 1.8 },
      { month: "May", before: 1.3, after: 2.1 },
      { month: "Jun", before: 1.2, after: 2.3 },
      { month: "Jul", before: 1.1, after: 2.6 },
      { month: "Ago", before: 1.0, after: 2.8 },
      { month: "Sep", before: 1.2, after: 3.1 },
      { month: "Oct", before: 1.3, after: 3.3 },
      { month: "Nov", before: 1.2, after: 3.6 },
      { month: "Dic", before: 1.4, after: 3.9 }
    ]
  },
  {
    id: "portal-zen",
    title: "Portal Zen",
    category: "ecommerce",
    categoryLabel: "ECOMMERCE · SHOPIFY PLUS",
    tags: ["Bienestar", "Filtros Avanzados", "Headless"],
    description: "Rediseño completo con enfoque en orden de catálogo, claridad comercial y una experiencia de compra minimalista.",
    longDescription: "Portal Zen comercializa productos de meditación, yoga y aromaterapia. Para escalar necesitaban reorganizar un catálogo masivo y complejo de variantes en una experiencia móvil fluida que inspirara serenidad y elevara el ticket de compra promedio.",
    beforeDescription: "Menú móvil engorroso con más de 25 llamadas incoherentes, lentitud extrema al filtrar productos y un embudo que abandonaba el 74% de los carritos.",
    afterDescription: "Simplificación extrema de menú a 3 niveles principales, filtros predictivos instantáneos integrados con buscador inteligente AI, y diseño minimalista enfocado en la aromaterapia sensorial.",
    metrics: [
      { label: "Tráfico Orgánico", value: "+82%", trend: "up" },
      { label: "Conversión de Compra", value: "+11%", trend: "up" },
      { label: "Aumento Ticket Promedio", value: "+28%", trend: "up" }
    ],
    techStack: ["Shopify Plus", "React", "Next.js", "GraphQL", "Tailwind CSS", "Algolia"],
    color: "from-[#0ea5e9] via-[#2563eb] to-[#1e3a8a]",
    glowColor: "shadow-[0_0_50px_-12px_rgba(14,165,233,0.35)]",
    textColor: "text-blue-400",
    imageAccent: "zen",
    chartData: [
      { month: "Ene", before: 2.1, after: 2.2 },
      { month: "Feb", before: 2.0, after: 2.4 },
      { month: "Mar", before: 1.9, after: 2.8 },
      { month: "Abr", before: 1.8, after: 3.1 },
      { month: "May", before: 2.2, after: 3.5 },
      { month: "Jun", before: 1.9, after: 3.9 },
      { month: "Jul", before: 2.0, after: 4.2 },
      { month: "Ago", before: 2.1, after: 4.5 },
      { month: "Sep", before: 1.8, after: 4.9 },
      { month: "Oct", before: 2.0, after: 5.2 },
      { month: "Nov", before: 2.3, after: 5.6 },
      { month: "Dic", before: 2.2, after: 5.9 }
    ]
  },
  {
    id: "sagrada-madre",
    title: "Sagrada Madre",
    category: "branding",
    categoryLabel: "BRANDING · WEB · CRO",
    tags: ["Sostenibilidad", "Custom UX", "Storytelling"],
    description: "Experiencia e-commerce inmersiva orientada a la identidad de marca, legibilidad del producto y un viaje sensorial de compra.",
    longDescription: "Sagrada Madre elabora sahumerios y productos de sahumado natural ecológico. El proyecto web requería transmitir la exquisitez del aroma de forma visual. Construimos una narrativa rica con micro-animaciones que explican los ingredientes naturales del producto y guían al usuario hacia su fragancia ideal.",
    beforeDescription: "Fichas de producto frías y genéricas que no lograban educar al cliente acerca del origen natural, ecológico y premium del incienso.",
    afterDescription: "Estructuras modulares enriquecidas con storytelling botánico, un recomendador de aromas basado en estados de ánimo (aromaterapia interactiva) y optimización en embudo de pago.",
    metrics: [
      { label: "Tiempo en Sitio", value: "+35%", trend: "up" },
      { label: "Tasa de Conversión (CVR)", value: "+25%", trend: "up" },
      { label: "Ventas por Recomendador", value: "+40%", trend: "up" }
    ],
    techStack: ["Shopify Plus", "React", "GSAP Animations", "Tailwind CSS", "Sanity CMS"],
    color: "from-[#ec4899] via-[#d946ef] to-[#86198f]",
    glowColor: "shadow-[0_0_50px_-12px_rgba(236,72,153,0.35)]",
    textColor: "text-pink-400",
    imageAccent: "sagrada",
    chartData: [
      { month: "Ene", before: 0.8, after: 1.0 },
      { month: "Feb", before: 0.9, after: 1.3 },
      { month: "Mar", before: 0.7, after: 1.6 },
      { month: "Abr", before: 1.1, after: 1.9 },
      { month: "May", before: 1.0, after: 2.2 },
      { month: "Jun", before: 1.2, after: 2.4 },
      { month: "Jul", before: 0.9, after: 2.7 },
      { month: "Ago", before: 1.1, after: 3.1 },
      { month: "Sep", before: 1.2, after: 3.4 },
      { month: "Oct", before: 1.0, after: 3.8 },
      { month: "Nov", before: 1.3, after: 4.1 },
      { month: "Dic", before: 1.4, after: 4.5 }
    ]
  },
  {
    id: "fogar",
    title: "Fogar",
    category: "web",
    categoryLabel: "CORPORATIVO · WEB",
    tags: ["Logística", "React", "Formularios B2B"],
    description: "Plataforma web corporativa de alto rendimiento para el sector logístico y de transporte, orientada a la captación de grandes clientes.",
    longDescription: "Fogar es un gigante en soluciones de logística integrada y transporte de carga pesada. El objetivo estratégico consistía en lanzar una plataforma corporativa imponente que reflejara solidez, automatizara las solicitudes de cotización internacional y redujera la fricción de preventa.",
    beforeDescription: "Sitio web desactualizado y estático que no adaptaba la propuesta a clientes internacionales y desviaba las cotizaciones a llamadas telefónicas lentas.",
    afterDescription: "Lanzamiento de un cotizador logístico dinámico bajo React, panel interactivo B2B que estima tiempos de tránsito y optimiza el ruteo, integrado directamente con su CRM corporativo.",
    metrics: [
      { label: "Leads Calificados", value: "Día 1", trend: "up" },
      { label: "Presencia Corporativa", value: "+60%", trend: "up" },
      { label: "Reducción de Rebote", value: "-40%", trend: "down" }
    ],
    techStack: ["React", "Node.js", "Express", "Tailwind CSS", "motion/react", "Salesforce API"],
    color: "from-[#f59e0b] via-[#ea580c] to-[#7c2d12]",
    glowColor: "shadow-[0_0_50px_-12px_rgba(245,158,11,0.35)]",
    textColor: "text-amber-400",
    imageAccent: "fogar",
    chartData: [
      { month: "Ene", before: 12, after: 15 },
      { month: "Feb", before: 8, after: 18 },
      { month: "Mar", before: 14, after: 24 },
      { month: "Abr", before: 10, after: 32 },
      { month: "May", before: 15, after: 38 },
      { month: "Jun", before: 11, after: 45 },
      { month: "Jul", before: 16, after: 52 },
      { month: "Ago", before: 13, after: 55 },
      { month: "Sep", before: 19, after: 68 },
      { month: "Oct", before: 17, after: 72 },
      { month: "Nov", before: 21, after: 84 },
      { month: "Dic", before: 20, after: 95 }
    ]
  }
];
