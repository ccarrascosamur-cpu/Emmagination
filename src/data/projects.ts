export interface Project {
  id: number;
  title: string;
  category: string;
  year: string;
  image: string;
  pdf: string;
  description: string;
  url: string;
  services: string[];
  offset: number;
}

export const projects: Project[] = [
  {
    id: 1,
    title: 'Portal Zen',
    category: 'E-commerce',
    year: '2024',
    image: '/images/project-portalzen.jpg',
    pdf: '/proyectos/portalzen.pdf',
    description: 'Tienda online de productos esotéricos, aromaterapia y bienestar. Diseño minimalista con experiencia de compra fluida.',
    url: 'https://www.portalzen.cl',
    services: ['Shopify', 'E-commerce', 'Branding'],
    offset: 0,
  },
  {
    id: 2,
    title: 'Sagrada Madre',
    category: 'E-commerce',
    year: '2024',
    image: '/images/project-sagradamadre.jpg',
    pdf: '/proyectos/sagradamadre.pdf',
    description: 'E-commerce de productos naturales con identidad visual orgánica',
    url: 'https://www.sagradamadre.cl',
    services: ['Diseño web', 'Shopify', 'Branding'],
    offset: 60,
  },
  {
    id: 3,
    title: 'Fegar',
    category: 'Landing Page',
    year: '2024',
    image: '/images/project-fegar.jpg',
    pdf: '/proyectos/fegar.pdf',
    description: 'Landing page corporativa con branding completo',
    url: 'https://www.fegar.cl',
    services: ['Landing page', 'Branding', 'Logo'],
    offset: 0,
  },
  {
    id: 4,
    title: 'Inglés Rugby Club',
    category: 'Landing Page',
    year: '2024',
    image: '/images/project-irc.jpg',
    pdf: '/proyectos/irc.pdf',
    description: 'Sitio web institucional para club de rugby con panel autoadministrable de contenidos y noticias.',
    url: 'https://www.inglesrugbyclub.cl',
    services: ['Web institucional', 'Panel admin', 'Noticias'],
    offset: 60,
  },
];

export const categories = ['Todos', 'E-commerce', 'Landing Page', 'Branding', 'SEO'];
