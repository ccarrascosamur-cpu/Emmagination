import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { useSiteData } from '../lib/site-data-client';

gsap.registerPlugin(ScrollTrigger);

// Laptop mockup con colores corporativos
function LaptopMockup({
  image,
  scrollImage,
  alt,
  url,
}: {
  image: string;
  scrollImage?: string;
  alt: string;
  url: string;
}) {
  const domain = url.replace(/^https?:\/\//, '').replace(/\/$/, '');
  const viewportRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [scrollOffset, setScrollOffset] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const displayImage = scrollImage || image;

  useEffect(() => {
    const updateViewport = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    const measure = () => {
      const viewport = viewportRef.current;
      const img = imgRef.current;
      if (!viewport || !img) return;
      const overflow = Math.max(0, img.scrollHeight - viewport.clientHeight);
      setScrollOffset(overflow);
    };

    updateViewport();
    measure();

    window.addEventListener('resize', updateViewport);
    window.addEventListener('resize', measure);

    return () => {
      window.removeEventListener('resize', updateViewport);
      window.removeEventListener('resize', measure);
    };
  }, [displayImage]);

  const shouldScroll = Boolean(scrollImage) && isDesktop && scrollOffset > 12;
  const transitionDuration = `${Math.min(7.5, Math.max(2.8, scrollOffset / 120))}s`;

  return (
    <div className="relative w-full">
      <div className="relative mx-auto" style={{ maxWidth: '96%' }}>
        {/* Screen frame */}
        <div
          className="relative rounded-t-xl p-2 pb-0"
          style={{
            background: 'linear-gradient(180deg, #1c1c2e 0%, #131325 100%)',
            boxShadow: `
              0 0 0 1px rgba(168,85,247,0.12),
              0 20px 60px -10px rgba(0,0,0,0.6),
              0 40px 80px -20px rgba(0,0,0,0.4)
            `,
          }}
        >
          {/* Camera dot */}
          <div className="flex justify-center mb-1.5">
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: 'rgba(255,255,255,0.1)' }}
            />
          </div>
          {/* Screen */}
          <div
            className="relative rounded-lg overflow-hidden"
            style={{
              background: '#000',
              border: '1px solid rgba(168,85,247,0.08)',
            }}
            onMouseEnter={() => shouldScroll && setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Browser bar */}
            <div
              className="flex items-center gap-2 px-3 py-2"
              style={{ background: '#161435' }}
            >
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57] border border-black/10" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e] border border-black/10" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#28c840] border border-black/10" />
              </div>
              <div className="flex-1 mx-2">
                <div
                  className="h-5 rounded-md flex items-center justify-center px-3 text-[10px]"
                  style={{
                    background: 'rgba(168, 85, 247, 0.08)',
                    border: '1px solid rgba(168, 85, 247, 0.12)',
                    color: '#5C5A8A',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  {domain}
                </div>
              </div>
            </div>
            <div
              ref={viewportRef}
              className="relative w-full overflow-hidden"
              style={{ aspectRatio: '16/10' }}
            >
              {scrollImage ? (
                <img
                  ref={imgRef}
                  src={displayImage}
                  alt={alt}
                  className="block w-full"
                  style={{
                    transform: shouldScroll && isHovered ? `translateY(-${scrollOffset}px)` : 'translateY(0px)',
                    transition: shouldScroll ? `transform ${transitionDuration} ease-in-out` : 'none',
                  }}
                  loading="lazy"
                  onLoad={() => {
                    const viewport = viewportRef.current;
                    const img = imgRef.current;
                    if (!viewport || !img) return;
                    const overflow = Math.max(0, img.scrollHeight - viewport.clientHeight);
                    setScrollOffset(overflow);
                  }}
                />
              ) : (
                <img
                  src={image}
                  alt={alt}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              )}
            </div>
          </div>
        </div>
        {/* Hinge */}
        <div
          className="h-1.5 mx-auto"
          style={{
            maxWidth: '98%',
            background: 'linear-gradient(180deg, #1a1a2e, #0a0a18)',
            borderRadius: '0 0 2px 2px',
          }}
        />
        {/* Base */}
        <div
          className="relative mx-auto rounded-b-lg"
          style={{
            maxWidth: '100%',
            height: '10px',
            background: 'linear-gradient(180deg, #1c1c2e 0%, #131325 100%)',
            boxShadow: `
              0 4px 20px rgba(0,0,0,0.5),
              0 0 0 1px rgba(168,85,247,0.08)
            `,
          }}
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-[1.5px] rounded-full bg-white/8" />
        </div>
        {/* Shadow */}
        <div
          className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-[90%] h-6 rounded-[50%]"
          style={{
            background: 'radial-gradient(ellipse, rgba(0,0,0,0.3) 0%, transparent 70%)',
          }}
        />
      </div>
    </div>
  );
}

export default function SelectedWork() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const { data } = useSiteData();

  const featuredProjects = data.projects.filter((p) => p.featured).slice(0, 4);

  // Determinar tamaño por posición: 0=grande, 1=chico, 2=chico, 3=grande
  const getSizeClass = (index: number) => {
    if (index === 0 || index === 3) return 'bento-large';
    return 'bento-small';
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
          { opacity: 0, y: 60, scale: 0.97 },
          {
            opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power3.out', stagger: 0.12,
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
        <div ref={headerRef} className="mb-14 opacity-0">
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

        {/* Bento Grid — Alternating large/small */}
        <div
          ref={gridRef}
          className="bento-work-grid"
        >
          {featuredProjects.map((project, index) => {
            const isLarge = index === 0 || index === 3;

            return (
              <article
                key={project.id}
                className={`proj-card group ${getSizeClass(index)}`}
                style={{
                  display: 'block',
                  color: 'inherit',
                  position: 'relative',
                }}
              >
                {/* Card container with border */}
                <div
                  className="rounded-2xl overflow-hidden h-full"
                  style={{
                    background: '#111028',
                    border: '1px solid rgba(168,85,247,0.1)',
                    transition: 'border-color 0.4s, box-shadow 0.4s',
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget;
                    el.style.borderColor = 'rgba(168,85,247,0.25)';
                    el.style.boxShadow = '0 24px 60px rgba(124,58,237,0.12)';
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget;
                    el.style.borderColor = 'rgba(168,85,247,0.1)';
                    el.style.boxShadow = 'none';
                  }}
                >
                  {/* Laptop Mockup */}
                  <div className="relative p-3 pb-0">
                    <LaptopMockup
                      image={project.image}
                      scrollImage={project.portfolioScrollImage}
                      alt={project.title}
                      url={project.url}
                    />
                  </div>

                  {/* Project Info */}
                  <div className="p-5 pt-6">
                    <div className="flex flex-wrap gap-2.5 mb-4">
                      <Link
                        to={`/proyectos/${project.slug}`}
                        className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:shadow-lg hover:shadow-[#7C3AED]/20"
                        style={{
                          fontFamily: 'var(--font-body)',
                          background: 'linear-gradient(135deg, #7C3AED 0%, #9333EA 50%, #A855F7 100%)',
                        }}
                      >
                        <ArrowUpRight size={16} />
                        Caso
                      </Link>
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium text-white/78 transition-all duration-300 hover:bg-white/6 hover:text-white"
                        style={{
                          fontFamily: 'var(--font-body)',
                          borderColor: 'rgba(255,255,255,0.12)',
                          background: 'rgba(255,255,255,0.03)',
                        }}
                      >
                        <ArrowUpRight size={16} />
                        Visitar sitio
                      </a>
                    </div>
                    {/* Tags row */}
                    <div className="flex items-center justify-between mb-3">
                      <span
                        style={{
                          fontSize: '0.65rem',
                          fontWeight: 700,
                          letterSpacing: '0.14em',
                          textTransform: 'uppercase',
                          color: '#A855F7',
                        }}
                      >
                        {project.tags || project.category}
                      </span>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.65rem',
                          color: 'rgba(255,255,255,0.25)',
                        }}
                      >
                        {project.year}
                      </span>
                    </div>

                    {/* Title */}
                    <h3
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: isLarge ? '1.35rem' : '1.15rem',
                        fontWeight: 800,
                        color: '#F4F3FF',
                        letterSpacing: '-0.02em',
                        lineHeight: 1.2,
                        marginBottom: '0.5rem',
                      }}
                    >
                      {project.title}
                    </h3>

                    {/* Excerpt */}
                    <p
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.85rem',
                        color: '#9E9CC8',
                        lineHeight: 1.65,
                        marginBottom: '1rem',
                      }}
                    >
                      {project.excerpt}
                    </p>

                    {/* Metrics */}
                    <div className="flex flex-wrap gap-2">
                      {project.metric && (
                        <span
                          style={{
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            color: '#06D6A0',
                            background: 'rgba(6,214,160,0.08)',
                            border: '1px solid rgba(6,214,160,0.18)',
                            borderRadius: 100,
                            padding: '0.25rem 0.7rem',
                          }}
                        >
                          ▲ {project.metric}
                        </span>
                      )}
                      {project.metricLabel && (
                        <span
                          style={{
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            color: '#06D6A0',
                            background: 'rgba(6,214,160,0.08)',
                            border: '1px solid rgba(6,214,160,0.18)',
                            borderRadius: 100,
                            padding: '0.25rem 0.7rem',
                          }}
                        >
                          ▲ {project.metricLabel}
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
                  </div>
                </div>

                {/* Número de proyecto — esquina inferior derecha */}
                <span
                  className="absolute bottom-4 right-5 text-white/[0.06] font-black select-none pointer-events-none"
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '2.2rem',
                    lineHeight: 1,
                  }}
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
              </article>
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
