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
    title: 'Sagrada Madre',
    category: 'E-commerce',
    year: '2024',
    image: '/images/project-sagradamadre.jpg',
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
    description: 'Landing page con panel autoadministrable de contenidos',
    url: 'https://www.inglesrugbyclub.cl',
    services: ['Landing page', 'Panel admin', 'Web'],
    offset: 60,
  },
];

const categories = ['Todos', 'E-commerce', 'Landing Page'];

// Laptop mockup component
function LaptopMockup({ image, alt }: { image: string; alt: string }) {
  return (
    <div className="relative w-full" style={{ perspective: '1000px' }}>
      {/* Laptop frame */}
      <div
        className="relative mx-auto"
        style={{
          maxWidth: '90%',
          transform: 'rotateX(5deg)',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Screen bezel */}
        <div
          className="relative rounded-t-xl overflow-hidden bg-[#2a2a2a] p-2 pb-0"
          style={{
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255,255,255,0.1)',
          }}
        >
          {/* Screen */}
          <div className="relative rounded-lg overflow-hidden bg-white">
            {/* Browser chrome */}
            <div className="flex items-center gap-1.5 px-3 py-2 bg-[#f5f5f5] border-b border-gray-200">
              <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
              <div className="flex-1 mx-4">
                <div className="h-5 bg-white rounded-md border border-gray-200 flex items-center px-2">
                  <span className="text-[10px] text-gray-400">https://</span>
                </div>
              </div>
            </div>
            {/* Screenshot */}
            <img
              src={image}
              alt={alt}
              className="w-full object-cover"
              style={{ aspectRatio: '16/10' }}
              loading="lazy"
            />
          </div>
        </div>
        {/* Laptop base */}
        <div
          className="h-3 rounded-b-lg mx-auto"
          style={{
            maxWidth: '100%',
            background: 'linear-gradient(to bottom, #3a3a3a, #1a1a1a)',
            boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
          }}
        />
        {/* Laptop shadow */}
        <div
          className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[110%] h-8 rounded-[50%]"
          style={{
            background: 'radial-gradient(ellipse, rgba(0,0,0,0.15) 0%, transparent 70%)',
          }}
        />
      </div>
    </div>
  );
}

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
              <span
                className="block mb-4"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  fontWeight: 500,
                  letterSpacing: '1px',
                  color: '#7C3AED',
                }}
              >
                PORTAFOLIO
              </span>
              <h2
                ref={titleRef}
                className="text-black opacity-0"
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(36px, 5vw, 64px)',
                  fontWeight: 700,
                  letterSpacing: '-1.5px',
                  lineHeight: 1.05,
                }}
              >
                PROYECTOS
                <br />
                <span style={{ color: '#7C3AED' }}>DESTACADOS</span>
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
                      ? 'text-white'
                      : 'bg-black/5 text-black/60 hover:bg-black/10'
                  }`}
                  style={{
                    fontFamily: 'var(--font-mono)',
                    background: activeFilter === cat
                      ? 'linear-gradient(135deg, #7C3AED 0%, #9333EA 100%)'
                      : undefined,
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Projects Grid - 2 columns with laptop mockups */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
            {filteredProjects.map((project, index) => (
              <div
                key={project.id}
                ref={(el) => { cardsRef.current[index] = el; }}
                className="group cursor-pointer opacity-0"
                style={{ marginTop: window.innerWidth >= 768 ? `${project.offset}px` : 0 }}
              >
                {/* Laptop Mockup */}
                <div className="relative">
                  <LaptopMockup image={project.image} alt={project.title} />

                  {/* Hover overlay on laptop */}
                  <div className="absolute inset-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-all duration-500 z-10">
                    <button
                      onClick={(e) => { e.stopPropagation(); openProject(project); }}
                      className="flex items-center gap-2 px-5 py-2.5 bg-white/95 backdrop-blur-sm rounded-full text-black text-sm font-medium transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 hover:bg-[#7C3AED] hover:text-white"
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
                      className="flex items-center gap-2 px-5 py-2.5 bg-white/95 backdrop-blur-sm rounded-full text-black text-sm font-medium transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 hover:bg-[#7C3AED] hover:text-white"
                      style={{ fontFamily: 'var(--font-body)', transitionDelay: '80ms' }}
                    >
                      <ExternalLink size={16} />
                      Visitar
                    </a>
                  </div>
                </div>

                {/* Project Info */}
                <div className="mt-8 px-2">
                  <div className="flex items-baseline justify-between mb-2">
                    <h3
                      className="text-black text-xl group-hover:text-[#7C3AED] transition-colors duration-300"
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontWeight: 600,
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
                    className="text-black/50 text-sm mb-3"
                    style={{ fontFamily: 'var(--font-body)', lineHeight: 1.6 }}
                  >
                    {project.description}
                  </p>
                  {/* Services tags */}
                  <div className="flex flex-wrap gap-2">
                    {project.services.map((service, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-full text-xs"
                        style={{
                          fontFamily: 'var(--font-mono)',
                          background: 'rgba(124, 58, 237, 0.08)',
                          color: '#7C3AED',
                        }}
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
