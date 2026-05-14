import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ProjectPreviewModal from '../components/ProjectPreviewModal';

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    id: 1,
    title: 'PortalZen',
    category: 'Shopify / E-commerce',
    year: '2024',
    image: 'https://image.thum.io/get/width/800/crop/1200/https://www.portalzen.cl',
    description: 'Tienda Shopify de productos zen y bienestar con diseño minimalista y alta conversión',
    url: 'https://www.portalzen.cl',
    services: ['Creación de logo', 'Diseño web', 'Shopify e-commerce'],
    offset: 40,
  },
  {
    id: 2,
    title: 'PortalZen Mayorista',
    category: 'Shopify / E-commerce',
    year: '2024',
    image: 'https://image.thum.io/get/width/800/crop/1200/https://www.portalzenmayorista.cl',
    description: 'Plataforma B2B de venta al por mayor con catálogo exclusivo para distribuidores',
    url: 'https://www.portalzenmayorista.cl',
    services: ['Shopify e-commerce', 'Catálogo B2B', 'Sistema mayorista'],
    offset: 0,
  },
  {
    id: 3,
    title: 'Sagrada Madre',
    category: 'Shopify / E-commerce',
    year: '2024',
    image: 'https://image.thum.io/get/width/800/crop/1200/https://www.sagradamadre.cl',
    description: 'E-commerce de productos naturales y artesanales con identidad visual orgánica',
    url: 'https://www.sagradamadre.cl',
    services: ['Diseño web', 'Shopify e-commerce', 'Identidad visual'],
    offset: 80,
  },
  {
    id: 4,
    title: 'Sagrada Madre Mayorista',
    category: 'Shopify / E-commerce',
    year: '2024',
    image: 'https://image.thum.io/get/width/800/crop/1200/https://www.sagradamadremayorista.cl',
    description: 'Canal mayorista para distribuidores con precios especiales y gestión de pedidos',
    url: 'https://www.sagradamadremayorista.cl',
    services: ['Shopify e-commerce', 'Portal B2B', 'Gestión de pedidos'],
    offset: 40,
  },
  {
    id: 5,
    title: 'Fegar',
    category: 'Landing Page / Branding',
    year: '2024',
    image: 'https://image.thum.io/get/width/800/crop/1200/https://www.fegar.cl',
    description: 'Landing page corporativa con diseño de branding completo y presencia digital',
    url: 'https://www.fegar.cl',
    services: ['Landing page', 'Diseño de branding', 'Logo', 'Identidad visual'],
    offset: 0,
  },
  {
    id: 6,
    title: 'Inglés Rugby Club',
    category: 'Landing Page / Web App',
    year: '2024',
    image: 'https://image.thum.io/get/width/800/crop/1200/https://www.inglesrugbyclub.cl',
    description: 'Landing page para club deportivo con panel autoadministrable de contenidos',
    url: 'https://www.inglesrugbyclub.cl',
    services: ['Landing page', 'Panel autoadministrable', 'Diseño web'],
    offset: 80,
  },
];

const categories = ['Todos', 'Shopify', 'E-commerce', 'Landing Page', 'Branding'];

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
      : projects.filter((p) =>
          p.category.toLowerCase().includes(activeFilter.toLowerCase())
        );

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
      // Title animation
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

      // Card animations
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
            delay: i * 0.15,
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
              <span
                className="label-mono text-black/50 block mb-4"
              >
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
                  className={`px-4 py-2 text-xs rounded-full transition-all duration-300 ${
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

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, index) => (
              <div
                key={project.id}
                ref={(el) => { cardsRef.current[index] = el; }}
                className="group cursor-pointer opacity-0"
                onClick={() => openProject(project)}
                style={{ marginTop: window.innerWidth >= 1024 ? `${project.offset}px` : 0 }}
              >
                {/* Image Container */}
                <div
                  className="relative overflow-hidden bg-black/5"
                  style={{ aspectRatio: '3/4' }}
                >
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                    onError={(e) => {
                      // Fallback gradient if thum.io fails
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        const fallback = document.createElement('div');
                        fallback.className = 'w-full h-full flex items-center justify-center';
                        fallback.style.background = `linear-gradient(135deg, ${getProjectColor(project.id)} 0%, #1E1B27 100%)`;
                        fallback.innerHTML = `<span style="font-family: var(--font-heading); font-size: 2rem; font-weight: 600; color: white; opacity: 0.3;">${project.title.charAt(0)}</span>`;
                        parent.appendChild(fallback);
                      }
                    }}
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-500 flex items-center justify-center">
                    <span
                      className="px-6 py-3 bg-white/90 backdrop-blur-sm rounded-full text-black text-sm font-medium opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500"
                      style={{ fontFamily: 'var(--font-body)' }}
                    >
                      Ver preview
                    </span>
                  </div>
                  {/* Label */}
                  <div
                    className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full"
                  >
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
                <div className="mt-4">
                  <div className="flex items-baseline justify-between">
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
                      className="text-black/40"
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.75rem',
                      }}
                    >
                      {project.year}
                    </span>
                  </div>
                  <p
                    className="text-black/50 mt-1 text-sm"
                    style={{ fontFamily: 'var(--font-body)', lineHeight: 1.5 }}
                  >
                    {project.description}
                  </p>
                  {/* Services tags */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {project.services.slice(0, 3).map((service, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 bg-black/5 rounded text-black/50 text-xs"
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

      {/* Project Preview Modal */}
      <ProjectPreviewModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </>
  );
}

function getProjectColor(id: number): string {
  const colors = ['#7C3AED', '#CC26D3', '#382B8F', '#7C3AED', '#CC26D3', '#382B8F'];
  return colors[id - 1] || '#7C3AED';
}
