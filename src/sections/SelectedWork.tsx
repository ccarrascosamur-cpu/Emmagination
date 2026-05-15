import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ExternalLink, Eye } from 'lucide-react';
import ProjectPreviewModal from '../components/ProjectPreviewModal';

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    id: 1,
    title: 'PortalZen',
    category: 'E-commerce',
    year: '2024',
    image: '/images/project-portalzen.jpg',
    description: 'Tienda Shopify de productos zen y bienestar con diseño minimalista',
    url: 'https://www.portalzen.cl',
    services: ['Logo', 'Shopify', 'E-commerce'],
    offset: 0,
  },
  {
    id: 2,
    title: 'PortalZen Mayorista',
    category: 'E-commerce',
    year: '2024',
    image: '/images/project-portalzen-mayorista.jpg',
    description: 'Plataforma B2B con catálogo exclusivo para distribuidores',
    url: 'https://www.portalzenmayorista.cl',
    services: ['Shopify', 'B2B', 'Mayorista'],
    offset: 60,
  },
  {
    id: 3,
    title: 'Sagrada Madre',
    category: 'E-commerce',
    year: '2024',
    image: '/images/project-sagradamadre.jpg',
    description: 'E-commerce de productos naturales con identidad visual orgánica',
    url: 'https://www.sagradamadre.cl',
    services: ['Diseño web', 'Shopify', 'Branding'],
    offset: 0,
  },
  {
    id: 4,
    title: 'Sagrada Madre Mayorista',
    category: 'E-commerce',
    year: '2024',
    image: '/images/project-sagradamadre-mayorista.jpg',
    description: 'Canal mayorista con precios especiales y gestión de pedidos',
    url: 'https://www.sagradamadremayorista.cl',
    services: ['Shopify', 'Portal B2B', 'Pedidos'],
    offset: 60,
  },
  {
    id: 5,
    title: 'Fegar',
    category: 'Landing Page',
    year: '2024',
    image: '/images/project-fegar.jpg',
    description: 'Landing page corporativa con branding completo',
    url: 'https://www.fegar.cl',
    services: ['Landing page', 'Branding', 'Logo'],
    offset: 0,
  },
  {
    id: 6,
    title: 'Inglés Rugby Club',
    category: 'Landing Page',
    year: '2024',
    image: '/images/project-irc.jpg',
    description: 'Landing page con panel autoadministrable de contenidos',
    url: 'https://www.inglesrugbyclub.cl',
    services: ['Landing page', 'Panel admin', 'Web'],
    offset: 60,
  },
];

const categories = ['Todos', 'E-commerce', 'Landing Page'];

export default function SelectedWork() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [activeFilter, setActiveFilter] = useState('Todos');
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredProjects =
    activeFilter === 'Todos'
      ? projects
      : projects.filter((p) => p.category === activeFilter);

  const openProject = (project: typeof projects[0]) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedProject(null), 300);
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );

      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        gsap.fromTo(
          card,
          { opacity: 0, y: 80 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            delay: i * 0.12,
            scrollTrigger: {
              trigger: card,
              start: 'top 90%',
              toggleActions: 'play none none none',
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [filteredProjects]);

  return (
    <>
      <section
        ref={sectionRef}
        id="work"
        className="relative w-full bg-white"
        style={{ padding: '120px 0' }}
      >
        <div className="mx-auto" style={{ maxWidth: '1440px', padding: '0 4vw' }}>
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16">
            <div>
              <span className="label-mono text-black/50 block mb-4">
                PORTAFOLIO
              </span>
              <h2
                ref={titleRef}
                className="text-black opacity-0"
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(36px, 5vw, 64px)',
                  fontWeight: 500,
                  letterSpacing: '-1.5px',
                  lineHeight: 1.05,
                }}
              >
                PROYECTOS
                <br />
                DESTACADOS
              </h2>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2 mt-8 md:mt-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`px-5 py-2.5 text-xs rounded-full transition-all duration-300 ${
                    activeFilter === cat
                      ? 'bg-[#7C3AED] text-white'
                      : 'bg-black/5 text-black/60 hover:bg-black/10'
                  }`}
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Projects Grid - 2 columns for better harmony */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {filteredProjects.map((project, index) => (
              <div
                key={project.id}
                ref={(el) => { cardsRef.current[index] = el; }}
                className="group cursor-pointer opacity-0"
                style={{ marginTop: window.innerWidth >= 768 ? `${project.offset}px` : 0 }}
              >
                {/* Image Container - 16:10 aspect ratio */}
                <div
                  className="relative overflow-hidden rounded-xl bg-black/5 shadow-sm"
                  style={{ aspectRatio: '16/10' }}
                >
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-500 flex items-center justify-center gap-4">
                    <button
                      onClick={(e) => { e.stopPropagation(); openProject(project); }}
                      className="flex items-center gap-2 px-5 py-2.5 bg-white/95 backdrop-blur-sm rounded-full text-black text-sm font-medium opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 hover:bg-[#7C3AED] hover:text-white"
                      style={{ fontFamily: 'var(--font-body)', transitionDelay: '0ms' }}
                    >
                      <Eye size={16} />
                      Preview
                    </button>
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-2 px-5 py-2.5 bg-white/95 backdrop-blur-sm rounded-full text-black text-sm font-medium opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 hover:bg-[#7C3AED] hover:text-white"
                      style={{ fontFamily: 'var(--font-body)', transitionDelay: '80ms' }}
                    >
                      <ExternalLink size={16} />
                      Visitar
                    </a>
                  </div>
                  {/* Category label */}
                  <div className="absolute top-4 left-4 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full">
                    <span
                      className="text-black/70"
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.7rem',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                      }}
                    >
                      {project.category}
                    </span>
                  </div>
                </div>

                {/* Project Info */}
                <div className="mt-5 px-1">
                  <div className="flex items-baseline justify-between mb-1">
                    <h3
                      className="text-black text-xl group-hover:text-[#7C3AED] transition-colors duration-300"
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontWeight: 500,
                      }}
                    >
                      {project.title}
                    </h3>
                    <span
                      className="text-black/30"
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.75rem',
                      }}
                    >
                      {project.year}
                    </span>
                  </div>
                  <p
                    className="text-black/50 text-sm"
                    style={{ fontFamily: 'var(--font-body)', lineHeight: 1.6 }}
                  >
                    {project.description}
                  </p>
                  {/* Services tags */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {project.services.map((service, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 bg-black/[0.04] rounded-md text-black/45 text-xs"
                        style={{ fontFamily: 'var(--font-mono)' }}
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ProjectPreviewModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </>
  );
}
