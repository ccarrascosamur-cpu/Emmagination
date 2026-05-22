import { useEffect, useRef } from 'react';
import { Link } from 'react-router';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import { useSiteData } from '../lib/site-data-client';

gsap.registerPlugin(ScrollTrigger);

export default function SelectedWork() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const { data } = useSiteData();

  const featuredProjects = data.projects.filter((p) => p.featured).slice(0, 4);

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
          { opacity: 0, y: 60 },
          {
            opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.12,
            scrollTrigger: { trigger: gridRef.current, start: 'top 85%', toggleActions: 'play none none none' },
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
        background: '#111028',
      }}
    >
      <div className="mx-auto relative" style={{ maxWidth: '1440px', padding: '0 4vw' }}>
        {/* Section Header */}
        <div ref={headerRef} className="mb-16 opacity-0">
          <div className="sec-label">Portafolio</div>
          <h2
            className="text-white"
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2.2rem, 5vw, 4rem)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              lineHeight: 1.08,
              marginBottom: '1rem',
            }}
          >
            Proyectos <em style={{
              fontStyle: 'normal',
              background: 'linear-gradient(135deg, #A78BFA 0%, #C084FC 50%, #E879F9 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>reales,</em>
            <br />
            resultados medibles
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '1rem',
              color: '#9E9CC8',
              maxWidth: '480px',
              lineHeight: 1.7,
            }}
          >
            No mostramos mockups. Cada proyecto está vivo y generando resultados.
          </p>
        </div>

        {/* Projects Grid — 4 cards */}
        <div
          ref={gridRef}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {featuredProjects.map((project) => (
            <Link
              key={project.id}
              to={`/proyectos/${project.slug}`}
              className="proj-card group"
              style={{
                display: 'block',
                textDecoration: 'none',
                color: 'inherit',
                background: '#161435',
                border: '1px solid rgba(168,85,247,0.12)',
                borderRadius: '16px',
                overflow: 'hidden',
                transition: 'transform 0.3s, border-color 0.3s, box-shadow 0.3s',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.transform = 'translateY(-6px)';
                el.style.borderColor = 'rgba(168,85,247,0.35)';
                el.style.boxShadow = '0 20px 60px rgba(168,85,247,0.12)';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.transform = 'translateY(0)';
                el.style.borderColor = 'rgba(168,85,247,0.12)';
                el.style.boxShadow = 'none';
              }}
            >
              {/* Image area with dark tint */}
              <div
                style={{
                  position: 'relative',
                  height: '200px',
                  overflow: 'hidden',
                  background: project.color || '#161435',
                }}
              >
                <img
                  src={project.image}
                  alt={project.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    opacity: 0.7,
                    transition: 'transform 0.5s, opacity 0.3s',
                  }}
                  className="group-hover:scale-105"
                  loading="lazy"
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: `linear-gradient(to top, ${project.color || '#161435'} 0%, transparent 60%)`,
                  }}
                />
              </div>

              {/* Content */}
              <div style={{ padding: '1.5rem' }}>
                {/* Tags */}
                <div
                  style={{
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: '#A855F7',
                    marginBottom: '0.6rem',
                  }}
                >
                  {project.tags || project.category}
                </div>

                {/* Title */}
                <h3
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.15rem',
                    fontWeight: 800,
                    color: '#F4F3FF',
                    letterSpacing: '-0.02em',
                    lineHeight: 1.2,
                    marginBottom: '0.6rem',
                  }}
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

                {/* Metrics */}
                {(project.metric || project.metricLabel) && (
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {project.metric && (
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 600,
                          color: '#06D6A0',
                          background: 'rgba(6,214,160,0.08)',
                          border: '1px solid rgba(6,214,160,0.2)',
                          borderRadius: 100,
                          padding: '0.25rem 0.7rem',
                        }}
                      >
                        ✓ {project.metric}
                      </span>
                    )}
                    {project.metricLabel && (
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 600,
                          color: '#06D6A0',
                          background: 'rgba(6,214,160,0.08)',
                          border: '1px solid rgba(6,214,160,0.2)',
                          borderRadius: 100,
                          padding: '0.25rem 0.7rem',
                        }}
                      >
                        ✓ {project.metricLabel}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div ref={ctaRef} className="flex justify-center mt-16 opacity-0">
          <Link
            to="/portafolio"
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-full text-white text-sm font-medium transition-all duration-300 hover:shadow-lg hover:shadow-[#7C3AED]/25"
            style={{
              fontFamily: 'var(--font-body)',
              background: 'linear-gradient(135deg, #7C3AED 0%, #9333EA 50%, #A855F7 100%)',
            }}
          >
            Ver todos los proyectos
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
