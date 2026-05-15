import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ExternalLink, Eye, ArrowLeft } from 'lucide-react';
import { projects, categories, type Project } from '../data/projects';
import ProjectPreviewModal from '../components/ProjectPreviewModal';
import Footer from '../sections/Footer';

gsap.registerPlugin(ScrollTrigger);

// Laptop mockup component (same as SelectedWork)
function LaptopMockup({ image, alt }: { image: string; alt: string }) {
  return (
    <div className="relative w-full">
      <div className="relative mx-auto" style={{ maxWidth: '92%' }}>
        <div
          className="relative rounded-t-2xl p-3 pb-0"
          style={{
            background: 'linear-gradient(180deg, #3a3a3c 0%, #2c2c2e 100%)',
            boxShadow: `
              0 0 0 1px rgba(255,255,255,0.08),
              0 20px 60px -10px rgba(0,0,0,0.5),
              0 40px 80px -20px rgba(0,0,0,0.3)
            `,
          }}
        >
          <div className="flex justify-center mb-2">
            <div
              className="w-2 h-2 rounded-full"
              style={{ background: 'rgba(255,255,255,0.15)' }}
            />
          </div>
          <div
            className="relative rounded-lg overflow-hidden"
            style={{
              background: '#000',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <div
              className="flex items-center gap-2 px-3 py-2.5"
              style={{ background: '#f0f0f0' }}
            >
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#ff5f57] border border-black/5" />
                <div className="w-3 h-3 rounded-full bg-[#febc2e] border border-black/5" />
                <div className="w-3 h-3 rounded-full bg-[#28c840] border border-black/5" />
              </div>
              <div className="flex-1 mx-3">
                <div
                  className="h-6 rounded-md flex items-center px-3 text-[10px] text-gray-400"
                  style={{ background: '#fff', border: '1px solid #e0e0e0' }}
                >
                  https://www.{alt.toLowerCase().replace(/\s/g, '')}.cl
                </div>
              </div>
            </div>
            <img
              src={image}
              alt={alt}
              className="w-full object-cover"
              style={{ aspectRatio: '16/10' }}
              loading="lazy"
            />
          </div>
        </div>
        <div
          className="h-2 mx-auto"
          style={{
            maxWidth: '98%',
            background: 'linear-gradient(180deg, #1a1a1a, #0a0a0a)',
            borderRadius: '0 0 2px 2px',
          }}
        />
        <div
          className="relative mx-auto rounded-b-xl"
          style={{
            maxWidth: '100%',
            height: '14px',
            background: 'linear-gradient(180deg, #2c2c2e 0%, #1c1c1e 100%)',
            boxShadow: `
              0 4px 20px rgba(0,0,0,0.4),
              0 0 0 1px rgba(255,255,255,0.05)
            `,
          }}
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-[2px] rounded-full bg-white/10" />
        </div>
        <div
          className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[95%] h-8 rounded-[50%]"
          style={{
            background: 'radial-gradient(ellipse, rgba(0,0,0,0.2) 0%, transparent 70%)',
          }}
        />
      </div>
    </div>
  );
}

export default function PortfolioPage() {
  const navigate = useNavigate();
  const pageRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const filtersRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  const [activeFilter, setActiveFilter] = useState('Todos');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredProjects =
    activeFilter === 'Todos'
      ? projects
      : projects.filter((p) => p.category === activeFilter);

  const openProject = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedProject(null), 300);
  };

  useEffect(() => {
    window.scrollTo(0, 0);

    const ctx = gsap.context(() => {
      // Title animation
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          delay: 0.2,
        }
      );

      // Filters animation
      gsap.fromTo(
        filtersRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          delay: 0.5,
        }
      );
    }, pageRef);

    return () => ctx.revert();
  }, []);

  // Animate cards when filter changes
  useEffect(() => {
    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        gsap.fromTo(
          card,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power3.out',
            delay: i * 0.1,
          }
        );
      });
    }, pageRef);

    return () => ctx.revert();
  }, [filteredProjects]);

  return (
    <div ref={pageRef} className="relative bg-black min-h-screen">
      {/* Back button */}
      <div className="fixed top-24 left-8 lg:left-16 z-50">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          <ArrowLeft size={16} />
          Volver
        </button>
      </div>

      {/* Hero Header */}
      <section
        className="relative w-full flex items-end overflow-hidden"
        style={{
          minHeight: '50vh',
          padding: '160px 0 80px',
        }}
      >
        <div className="mx-auto w-full" style={{ maxWidth: '1440px', padding: '0 4vw' }}>
          <h1
            ref={titleRef}
            className="text-white opacity-0"
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(60px, 12vw, 180px)',
              fontWeight: 700,
              letterSpacing: '-4px',
              lineHeight: 0.95,
            }}
          >
            Portafolio
          </h1>
        </div>
      </section>

      {/* Filter Tabs */}
      <div
        ref={filtersRef}
        className="relative w-full opacity-0"
        style={{
          borderTop: '1px solid rgba(255,255,255,0.08)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          padding: '20px 0',
        }}
      >
        <div className="mx-auto" style={{ maxWidth: '1440px', padding: '0 4vw' }}>
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-5 py-2.5 text-xs rounded-full transition-all duration-300 ${
                  activeFilter === cat
                    ? 'text-white'
                    : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/80'
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
      </div>

      {/* Projects Grid */}
      <section className="relative w-full" style={{ padding: '80px 0 120px' }}>
        <div className="mx-auto" style={{ maxWidth: '1440px', padding: '0 4vw' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-20">
            {filteredProjects.map((project, index) => (
              <div
                key={project.id}
                ref={(el) => { cardsRef.current[index] = el; }}
                className="group cursor-pointer opacity-0"
                style={{ marginTop: typeof window !== 'undefined' && window.innerWidth >= 768 ? `${project.offset}px` : 0 }}
              >
                {/* Laptop Mockup */}
                <div className="relative">
                  <LaptopMockup image={project.image} alt={project.title} />

                  {/* Hover overlay */}
                  <div className="absolute inset-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-all duration-500 z-10">
                    {project.pdf && (
                      <button
                        onClick={(e) => { e.stopPropagation(); openProject(project); }}
                        className="flex items-center gap-2 px-5 py-2.5 bg-white/95 backdrop-blur-sm rounded-full text-black text-sm font-medium transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 hover:bg-[#7C3AED] hover:text-white"
                        style={{ fontFamily: 'var(--font-body)', transitionDelay: '0ms' }}
                      >
                        <Eye size={16} />
                        Ver PDF
                      </button>
                    )}
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
                <div className="mt-10 px-2">
                  <div className="flex items-baseline justify-between mb-2">
                    <h3
                      className="text-white text-xl group-hover:text-[#7C3AED] transition-colors duration-300"
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontWeight: 600,
                      }}
                    >
                      {project.title}
                    </h3>
                    <span
                      className="text-white/30"
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.75rem',
                      }}
                    >
                      {project.year}
                    </span>
                  </div>
                  <p
                    className="text-white/50 text-sm mb-3"
                    style={{ fontFamily: 'var(--font-body)', lineHeight: 1.6 }}
                  >
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.services.map((service, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-full text-xs"
                        style={{
                          fontFamily: 'var(--font-mono)',
                          background: 'rgba(124, 58, 237, 0.15)',
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

      <Footer />

      <ProjectPreviewModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </div>
  );
}
