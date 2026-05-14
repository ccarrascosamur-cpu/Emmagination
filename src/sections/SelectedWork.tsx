import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    id: 1,
    title: 'Aura',
    category: 'Web Design / E-commerce',
    year: '2024',
    image: '/images/project-aura.jpg',
    description: 'Plataforma e-commerce minimalista con experiencias de producto inmersivas',
    offset: 40,
  },
  {
    id: 2,
    title: 'Vertex',
    category: 'Branding / 3D',
    year: '2024',
    image: '/images/project-vertex.jpg',
    description: 'Branding arquitectónico con texturas metálicas y ángulos definidos',
    offset: 0,
  },
  {
    id: 3,
    title: 'Pulse',
    category: 'UX/UI / Dashboard',
    year: '2023',
    image: '/images/project-pulse.jpg',
    description: 'Dashboard futurista de visualización de datos con analíticas en tiempo real',
    offset: 80,
  },
  {
    id: 4,
    title: 'Echo',
    category: 'Branding / Packaging',
    year: '2023',
    image: '/images/project-echo.jpg',
    description: 'Identidad de marca de cosméticos de lujo con packaging minimalista',
    offset: 40,
  },
  {
    id: 5,
    title: 'Nova',
    category: 'Web Design / Shopify',
    year: '2024',
    image: '/images/project-aura.jpg',
    description: 'Tienda Shopify de alta conversión con desarrollo de tema personalizado',
    offset: 0,
  },
  {
    id: 6,
    title: 'Prism',
    category: 'Landing Page / Branding',
    year: '2024',
    image: '/images/project-vertex.jpg',
    description: 'Landing page enfocada en conversión con animaciones cinematográficas de scroll',
    offset: 80,
  },
];

const categories = ['Todos', 'Web Design', 'Shopify', 'Branding', 'UX/UI', 'Landing Pages'];

export default function SelectedWork() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [activeFilter, setActiveFilter] = useState('Todos');

  const filteredProjects =
    activeFilter === 'Todos'
      ? projects
      : projects.filter((p) =>
          p.category.toLowerCase().includes(activeFilter.toLowerCase())
        );

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
                />
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
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="flex justify-center mt-16">
          <button
            className="px-8 py-3 border border-black/20 rounded-full text-black text-sm hover:bg-black hover:text-white transition-all duration-300"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Ver todos los proyectos
          </button>
        </div>
      </div>
    </section>
  );
}
