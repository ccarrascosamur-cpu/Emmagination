import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ExternalLink, ArrowLeft } from 'lucide-react';
import Footer from '../sections/Footer';
import SEO from '../components/SEO';
import { portfolioSeo } from '../lib/route-seo';
import { useSiteData } from '../lib/site-data-client';
import { getProjectCategories } from '../lib/site-data';
import { useScrollDepth } from '../hooks/useScrollDepth';

gsap.registerPlugin(ScrollTrigger);

// Laptop mockup component (same as SelectedWork)
function LaptopMockup({
  image,
  scrollImage,
  alt,
}: {
  image: string;
  scrollImage?: string;
  alt: string;
}) {
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
              onMouseEnter={() => shouldScroll && setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
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
  const { data } = useSiteData();
  useScrollDepth();
  const pageRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const filtersRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  const [activeFilter, setActiveFilter] = useState('Todos');
  const [isDesktop, setIsDesktop] = useState(false);
  const categories = getProjectCategories(data.projects);

  const filteredProjects =
    activeFilter === 'Todos'
      ? data.projects
      : data.projects.filter((p) => p.category === activeFilter);

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

  useEffect(() => {
    const updateViewport = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    updateViewport();
    window.addEventListener('resize', updateViewport);

    return () => window.removeEventListener('resize', updateViewport);
  }, []);

  return (
    <main ref={pageRef} className="relative min-h-screen" style={{ background: 'radial-gradient(ellipse at 30% 0%, #1a0f2e 0%, #0d0618 40%, #050208 100%)' }}>
      <SEO {...portfolioSeo} />
      {/* Top header */}
      <div className="relative w-full">
        {/* Back button */}
        <div className="absolute top-24 left-8 lg:left-16 z-50">
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
            minHeight: '40vh',
            padding: '140px 0 60px',
          }}
        >
          <div className="mx-auto w-full" style={{ maxWidth: '1440px', padding: '0 4vw' }}>
            <h1
              ref={titleRef}
              className="text-white opacity-0"
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(56px, 10vw, 140px)',
                fontWeight: 900,
                letterSpacing: '-3px',
                lineHeight: 0.95,
              }}
            >
              Portafolio
            </h1>
            <p
              className="mt-4 max-w-2xl text-white/65"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '1rem',
                lineHeight: 1.7,
              }}
            >
              Casos de diseño web, branding, Shopify y landing pages desarrollados
              para marcas que necesitaban vender mejor y comunicar con claridad.
            </p>
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
      </div>

      {/* Projects Grid */}
      <section className="relative w-full overflow-hidden" style={{ padding: '80px 0 120px' }}>
        {/* Decorative orbs */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: '700px',
            height: '700px',
            background: 'radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)',
            filter: 'blur(100px)',
            top: '5%',
            right: '-10%',
          }}
        />
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: '500px',
            height: '500px',
            background: 'radial-gradient(circle, rgba(204,38,211,0.1) 0%, transparent 70%)',
            filter: 'blur(120px)',
            bottom: '10%',
            left: '-8%',
          }}
        />
        <div className="mx-auto relative" style={{ maxWidth: '1440px', padding: '0 4vw' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-20">
            {filteredProjects.map((project, index) => (
              <div
                key={project.id}
                ref={(el) => { cardsRef.current[index] = el; }}
                className="group cursor-pointer opacity-0"
                style={{ marginTop: isDesktop ? `${project.offset}px` : 0 }}
              >
                {/* Laptop Mockup */}
                <div className="relative">
                  <LaptopMockup
                    image={project.image}
                    scrollImage={project.portfolioScrollImage}
                    alt={project.title}
                  />
                </div>

                {/* Project Info */}
                <div className="mt-10 px-2">
                  <div className="mb-5 flex flex-wrap gap-3">
                    <Link
                      to={`/proyectos/${project.slug}`}
                      className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-white transition-all duration-300 hover:shadow-lg hover:shadow-[#7C3AED]/20"
                      style={{
                        fontFamily: 'var(--font-body)',
                        background: 'linear-gradient(135deg, #7C3AED 0%, #9333EA 100%)',
                      }}
                    >
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
                      <ExternalLink size={16} />
                      Visitar sitio
                    </a>
                  </div>
                  <div className="flex items-baseline justify-between mb-2">
                    <h3
                      className="text-white text-xl transition-colors duration-300"
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontWeight: 700,
                      }}
                    >
                      {project.title}
                    </h3>
                    <span
                      className="text-white/25"
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.75rem',
                      }}
                    >
                      {project.year}
                    </span>
                  </div>
                  <p
                    className="text-white/45 text-sm mb-3"
                    style={{ fontFamily: 'var(--font-body)', lineHeight: 1.6 }}
                  >
                    {project.excerpt}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.services.map((service, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-full text-xs"
                        style={{
                          fontFamily: 'var(--font-mono)',
                          background: 'rgba(167, 139, 250, 0.12)',
                          color: '#C084FC',
                          border: '1px solid rgba(167, 139, 250, 0.2)',
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
    </main>
  );
}
