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

  // Tomar todos los proyectos featured (escalable sin deformar)
  const featuredProjects = data.projects.filter((p) => p.featured);

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
          { opacity: 0, y: 60, scale: 0.97 },
          {
            opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power3.out', stagger: 0.1,
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
        padding: '100px 0',
        background: '#0a0818',
      }}
    >
      {/* Subtle grid background */}
      <div
        className="absolute pointer-events-none"
        style={{
          inset: 0,
          opacity: 0.012,
          backgroundImage: `linear-gradient(rgba(168,85,247,1) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,1) 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Decorative orbs */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)',
          filter: 'blur(120px)',
          top: '-5%',
          right: '-15%',
        }}
      />

      <div className="mx-auto relative" style={{ maxWidth: '1280px', padding: '0 4vw' }}>
        {/* Section Header */}
        <div ref={headerRef} className="mb-12 opacity-0">
          <div className="sec-label">Portafolio</div>
          <h2
            className="text-white uppercase"
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2rem, 4.5vw, 3.5rem)',
              fontWeight: 900,
              letterSpacing: '-2px',
              lineHeight: 0.95,
              marginBottom: '1rem',
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
              fontSize: '0.95rem',
              color: '#9E9CC8',
              maxWidth: '480px',
              lineHeight: 1.7,
            }}
          >
            No mostramos mockups. Cada proyecto está vivo, generando tráfico y convirtiendo visitas.
          </p>
        </div>

        {/* Bento Grid — Compacto y escalable */}
        <div
          ref={gridRef}
          className="bento-grid-compact"
        >
          {featuredProjects.map((project, index) => {
            // El primer proyecto es "destacado" (más grande), el resto iguales
            const isFeatured = index === 0;

            return (
              <Link
                key={project.id}
                to={`/proyectos/${project.slug}`}
                className={`proj-card group ${isFeatured ? 'bento-featured' : 'bento-item'}`}
                style={{
                  display: 'block',
                  textDecoration: 'none',
                  color: 'inherit',
                  background: '#111028',
                  border: '1px solid rgba(168,85,247,0.1)',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  position: 'relative',
                  transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.4s, box-shadow 0.4s',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget;
                  el.style.transform = 'translateY(-6px)';
                  el.style.borderColor = 'rgba(168,85,247,0.3)';
                  el.style.boxShadow = '0 24px 60px rgba(124,58,237,0.12)';
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
                    height: isFeatured ? '240px' : '180px',
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
                      opacity: 0.9,
                      transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s',
                    }}
                    className="group-hover:scale-105"
                    loading="lazy"
                  />
                  {/* Gradient overlay — sutil, solo para legibilidad de tags */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: `linear-gradient(to top, rgba(17,16,40,0.55) 0%, rgba(17,16,40,0.05) 40%, transparent 70%)`,
                    }}
                  />

                  {/* Top-right arrow on hover */}
                  <div
                    className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-400 transform translate-y-2 group-hover:translate-y-0"
                  >
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center"
                      style={{
                        background: 'rgba(168, 85, 247, 0.9)',
                        backdropFilter: 'blur(12px)',
                      }}
                    >
                      <ArrowUpRight size={16} className="text-white" />
                    </div>
                  </div>
                  {/* Bottom-left: tags on image */}
                  <div className="absolute bottom-4 left-4 flex gap-2">
                    <span
                      style={{
                        fontSize: '0.6rem',
                        fontWeight: 700,
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        color: '#A855F7',
                        background: 'rgba(10, 8, 24, 0.75)',
                        backdropFilter: 'blur(8px)',
                        padding: '0.3rem 0.7rem',
                        borderRadius: '100px',
                        border: '1px solid rgba(168,85,247,0.2)',
                      }}
                    >
                      {project.tags || project.category}
                    </span>
                    {project.year && (
                      <span
                        style={{
                          fontSize: '0.6rem',
                          fontWeight: 600,
                          letterSpacing: '0.1em',
                          color: 'rgba(255,255,255,0.45)',
                          background: 'rgba(10, 8, 24, 0.75)',
                          backdropFilter: 'blur(8px)',
                          padding: '0.3rem 0.7rem',
                          borderRadius: '100px',
                          border: '1px solid rgba(255,255,255,0.06)',
                        }}
                      >
                        {project.year}
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div style={{ padding: isFeatured ? '1.5rem' : '1.25rem' }}>
                  {/* Title */}
                  <h3
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: isFeatured ? '1.3rem' : '1.05rem',
                      fontWeight: 800,
                      color: '#F4F3FF',
                      letterSpacing: '-0.02em',
                      lineHeight: 1.2,
                      marginBottom: '0.5rem',
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
                      fontSize: '0.82rem',
                      color: '#9E9CC8',
                      lineHeight: 1.65,
                      marginBottom: '1rem',
                    }}
                  >
                    {project.excerpt}
                  </p>

                  {/* Metrics row */}
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    {project.metric && (
                      <span
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          color: '#06D6A0',
                          background: 'rgba(6,214,160,0.08)',
                          border: '1px solid rgba(6,214,160,0.18)',
                          borderRadius: 100,
                          padding: '0.25rem 0.7rem',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                        }}
                      >
                        <span style={{ fontSize: '0.6rem' }}>▲</span> {project.metric}
                      </span>
                    )}
                    {project.metricLabel && (
                      <span
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          color: '#06D6A0',
                          background: 'rgba(6,214,160,0.08)',
                          border: '1px solid rgba(6,214,160,0.18)',
                          borderRadius: 100,
                          padding: '0.25rem 0.7rem',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                        }}
                      >
                        <span style={{ fontSize: '0.6rem' }}>▲</span> {project.metricLabel}
                      </span>
                    )}
                  </div>

                  {/* Services tags */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {project.services.slice(0, 3).map((service, i) => (
                      <span
                        key={i}
                        style={{
                          fontSize: '0.65rem',
                          fontWeight: 600,
                          color: '#5C5A8A',
                          background: 'rgba(168, 85, 247, 0.05)',
                          border: '1px solid rgba(168, 85, 247, 0.1)',
                          borderRadius: 100,
                          padding: '0.2rem 0.6rem',
                        }}
                      >
                        {service}
                      </span>
                    ))}
                  </div>

                  {/* Número de proyecto — esquina inferior derecha de la tarjeta */}
                  <span
                    className="absolute bottom-3 right-4 text-white/[0.07] font-black select-none pointer-events-none"
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '2.2rem',
                      lineHeight: 1,
                    }}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>

                {/* Bottom accent line */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '2px',
                    background: 'linear-gradient(90deg, transparent, rgba(168,85,247,0.4), transparent)',
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
        <div ref={ctaRef} className="flex justify-center mt-16 opacity-0">
          <Link
            to="/portafolio"
            className="group inline-flex items-center gap-3 px-9 py-3.5 rounded-full text-white text-sm font-semibold transition-all duration-300 hover:shadow-xl hover:shadow-[#7C3AED]/25"
            style={{
              fontFamily: 'var(--font-body)',
              background: 'linear-gradient(135deg, #7C3AED 0%, #9333EA 50%, #A855F7 100%)',
              letterSpacing: '0.02em',
            }}
          >
            Explorar todos los proyectos
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
