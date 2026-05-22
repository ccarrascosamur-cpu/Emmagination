import { useEffect, useRef } from 'react';
import { Link } from 'react-router';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { useSiteData } from '../lib/site-data-client';

gsap.registerPlugin(ScrollTrigger);

export default function SelectedWork() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const { data } = useSiteData();

  const featuredProjects = data.projects.filter((p) => p.featured).slice(0, 4);

  // Bento grid sizing: first = large, others = mixed
  const getGridClass = (index: number) => {
    if (index === 0) return 'bento-large';
    if (index === 1) return 'bento-tall';
    if (index === 2) return 'bento-wide';
    return 'bento-standard';
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1, y: 0, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: headerRef.current, start: 'top 85%', toggleActions: 'play none none none' },
        }
      );

      if (gridRef.current) {
        const cards = gridRef.current.querySelectorAll('.proj-card');
        gsap.fromTo(cards,
          { opacity: 0, y: 80, scale: 0.96 },
          {
            opacity: 1, y: 0, scale: 1, duration: 0.9, ease: 'power3.out', stagger: 0.15,
            scrollTrigger: { trigger: gridRef.current, start: 'top 80%', toggleActions: 'play none none none' },
          }
        );
      }

      gsap.fromTo(
        ctaRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: ctaRef.current, start: 'top 90%', toggleActions: 'play none none none' },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="work"
      className="relative w-full overflow-hidden"
      style={{
        padding: '120px 0',
        background: '#0a0818',
      }}
    >
      {/* Subtle grid background */}
      <div
        className="absolute pointer-events-none"
        style={{
          inset: 0,
          opacity: 0.015,
          backgroundImage: `linear-gradient(rgba(168,85,247,1) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,1) 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Decorative orbs */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: '700px',
          height: '700px',
          background: 'radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)',
          filter: 'blur(120px)',
          top: '-10%',
          right: '-20%',
        }}
      />
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(204,38,211,0.08) 0%, transparent 70%)',
          filter: 'blur(100px)',
          bottom: '5%',
          left: '-15%',
        }}
      />

      <div className="mx-auto relative" style={{ maxWidth: '1440px', padding: '0 4vw' }}>
        {/* Section Header */}
        <div ref={headerRef} className="mb-16 opacity-0">
          <div className="sec-label">Portafolio</div>
          <h2
            className="text-white uppercase"
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2.5rem, 5.5vw, 4.5rem)',
              fontWeight: 900,
              letterSpacing: '-2px',
              lineHeight: 0.95,
              marginBottom: '1.25rem',
            }}
          >
            Proyectos <span className="hero-stroke-text">reales,</span>
            <br />
            <span style={{
              background: 'linear-gradient(135deg, #A78BFA 0%, #C084FC 50%, #E879F9 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>resultados</span> medibles
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '1.05rem',
              color: '#9E9CC8',
              maxWidth: '520px',
              lineHeight: 1.75,
            }}
          >
            No mostramos mockups. Cada proyecto está vivo, generando tráfico y convirtiendo visitas.
          </p>
        </div>

        {/* Bento Grid — Asymmetric layout */}
        <div
          ref={gridRef}
          className="bento-grid"
        >
          {featuredProjects.map((project, index) => {
            const isLarge = index === 0;
            const isTall = index === 1;

            return (
              <Link
                key={project.id}
                to={`/proyectos/${project.slug}`}
                className={`proj-card group ${getGridClass(index)}`}
                style={{
                  display: 'block',
                  textDecoration: 'none',
                  color: 'inherit',
                  background: '#111028',
                  border: '1px solid rgba(168,85,247,0.1)',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  position: 'relative',
                  transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.4s, box-shadow 0.4s',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget;
                  el.style.transform = 'translateY(-8px)';
                  el.style.borderColor = 'rgba(168,85,247,0.3)';
                  el.style.boxShadow = '0 32px 80px rgba(124,58,237,0.15), 0 0 0 1px rgba(168,85,247,0.1)';
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget;
                  el.style.transform = 'translateY(0)';
                  el.style.borderColor = 'rgba(168,85,247,0.1)';
                  el.style.boxShadow = 'none';
                }}
              >
                {/* Image area */}
                <div
                  style={{
                    position: 'relative',
                    height: isLarge ? '320px' : isTall ? '280px' : '220px',
                    overflow: 'hidden',
                    background: project.color || '#111028',
                  }}
                >
                  <img
                    src={project.image}
                    alt={project.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      opacity: 0.75,
                      transition: 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s',
                    }}
                    className="group-hover:scale-110 group-hover:opacity-90"
                    loading="lazy"
                  />
                  {/* Gradient overlay */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: `linear-gradient(to top, rgba(17,16,40,0.95) 0%, rgba(17,16,40,0.3) 50%, transparent 100%)`,
                    }}
                  />
                  {/* Top-right action buttons on hover */}
                  <div
                    className="absolute top-5 right-5 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-3 group-hover:translate-y-0"
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{
                        background: 'rgba(168, 85, 247, 0.9)',
                        backdropFilter: 'blur(12px)',
                        transition: 'transform 0.3s',
                      }}
                    >
                      <ArrowUpRight size={18} className="text-white" />
                    </div>
                  </div>
                  {/* Bottom-left: tags on image */}
                  <div className="absolute bottom-5 left-5 flex gap-2">
                    <span
                      style={{
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        letterSpacing: '0.14em',
                        textTransform: 'uppercase',
                        color: '#A855F7',
                        background: 'rgba(10, 8, 24, 0.7)',
                        backdropFilter: 'blur(8px)',
                        padding: '0.35rem 0.8rem',
                        borderRadius: '100px',
                        border: '1px solid rgba(168,85,247,0.25)',
                      }}
                    >
                      {project.tags || project.category}
                    </span>
                    {project.year && (
                      <span
                        style={{
                          fontSize: '0.65rem',
                          fontWeight: 600,
                          letterSpacing: '0.1em',
                          color: 'rgba(255,255,255,0.5)',
                          background: 'rgba(10, 8, 24, 0.7)',
                          backdropFilter: 'blur(8px)',
                          padding: '0.35rem 0.8rem',
                          borderRadius: '100px',
                          border: '1px solid rgba(255,255,255,0.08)',
                        }}
                      >
                        {project.year}
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div style={{ padding: isLarge ? '2rem' : '1.5rem' }}>
                  {/* Title */}
                  <h3
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: isLarge ? '1.5rem' : '1.2rem',
                      fontWeight: 800,
                      color: '#F4F3FF',
                      letterSpacing: '-0.02em',
                      lineHeight: 1.2,
                      marginBottom: '0.6rem',
                      transition: 'color 0.3s',
                    }}
                    className="group-hover:text-white"
                  >
                    {project.title}
                  </h3>

                  {/* Excerpt */}
                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.88rem',
                      color: '#9E9CC8',
                      lineHeight: 1.7,
                      marginBottom: '1.25rem',
                    }}
                  >
                    {project.excerpt}
                  </p>

                  {/* Metrics row */}
                  <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    {project.metric && (
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          color: '#06D6A0',
                          background: 'rgba(6,214,160,0.08)',
                          border: '1px solid rgba(6,214,160,0.2)',
                          borderRadius: 100,
                          padding: '0.3rem 0.85rem',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                        }}
                      >
                        <span style={{ fontSize: '0.65rem' }}>▲</span> {project.metric}
                      </span>
                    )}
                    {project.metricLabel && (
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          color: '#06D6A0',
                          background: 'rgba(6,214,160,0.08)',
                          border: '1px solid rgba(6,214,160,0.2)',
                          borderRadius: 100,
                          padding: '0.3rem 0.85rem',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                        }}
                      >
                        <span style={{ fontSize: '0.65rem' }}>▲</span> {project.metricLabel}
                      </span>
                    )}
                  </div>

                  {/* Services tags */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {project.services.slice(0, 3).map((service, i) => (
                      <span
                        key={i}
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 600,
                          color: '#5C5A8A',
                          background: 'rgba(168, 85, 247, 0.06)',
                          border: '1px solid rgba(168, 85, 247, 0.12)',
                          borderRadius: 100,
                          padding: '0.25rem 0.7rem',
                        }}
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom accent line */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '2px',
                    background: 'linear-gradient(90deg, transparent, rgba(168,85,247,0.5), transparent)',
                    opacity: 0,
                    transition: 'opacity 0.4s',
                  }}
                  className="group-hover:opacity-100"
                />
              </Link>
            );
          })}
        </div>

        {/* CTA */}
        <div ref={ctaRef} className="flex justify-center mt-20 opacity-0">
          <Link
            to="/portafolio"
            className="group inline-flex items-center gap-3 px-10 py-4 rounded-full text-white text-sm font-semibold transition-all duration-300 hover:shadow-xl hover:shadow-[#7C3AED]/30"
            style={{
              fontFamily: 'var(--font-body)',
              background: 'linear-gradient(135deg, #7C3AED 0%, #9333EA 50%, #A855F7 100%)',
              letterSpacing: '0.02em',
            }}
          >
            Explorar todos los proyectos
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
