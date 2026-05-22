import { useEffect, useRef } from 'react';
import { Link, Navigate, useParams } from 'react-router';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowLeft, ExternalLink, FileText, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import SEO from '../components/SEO';
import Footer from '../sections/Footer';
import { useSiteData } from '../lib/site-data-client';
import { getProjectBySlug } from '../lib/site-data';
import { buildProjectSeo } from '../lib/route-seo';

gsap.registerPlugin(ScrollTrigger);

export default function ProjectCasePage() {
  const { slug } = useParams();
  const { data, isRemoteLoaded } = useSiteData();
  const heroRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    if (!contentRef.current) return;
    const ctx = gsap.context(() => {
      const sections = contentRef.current!.querySelectorAll('.case-section');
      sections.forEach((section) => {
        gsap.fromTo(
          section,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      });
    }, contentRef);
    return () => ctx.revert();
  }, [slug]);

  if (!slug) {
    return <Navigate to="/portafolio" replace />;
  }

  const project = getProjectBySlug(data.projects, slug);

  if (!project && isRemoteLoaded) {
    return <Navigate to="/portafolio" replace />;
  }

  const displayProject = project ?? null;

  if (!displayProject) {
    return null;
  }

  return (
    <main className="relative min-h-screen" style={{ backgroundColor: '#000000' }}>
      <SEO
        {...(buildProjectSeo(slug) ?? {
          title: `${displayProject.title} | EMMAGINATION`,
          description: displayProject.description,
          keywords: displayProject.services.join(', '),
          canonicalPath: `/proyectos/${displayProject.slug}`,
          image: displayProject.image,
        })}
        title={`${displayProject.seoTitle || displayProject.title} | EMMAGINATION`}
        description={displayProject.seoDescription || displayProject.description}
        canonicalPath={`/proyectos/${displayProject.slug}`}
        image={displayProject.image}
      />

      {/* ===== HERO ===== */}
      <section
        ref={heroRef}
        className="relative overflow-hidden"
        style={{
          background: 'radial-gradient(ellipse at 30% 20%, #1a0f2e 0%, #0d0618 40%, #000000 100%)',
          padding: '140px 0 80px',
        }}
      >
        {/* Decorative orbs */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: '500px',
            height: '500px',
            background: 'radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)',
            filter: 'blur(100px)',
            top: '-10%',
            right: '10%',
          }}
        />
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(204,38,211,0.08) 0%, transparent 70%)',
            filter: 'blur(120px)',
            bottom: '0%',
            left: '-5%',
          }}
        />

        <div className="mx-auto relative" style={{ maxWidth: '1280px', padding: '0 4vw' }}>
          {/* Back link */}
          <Link
            to="/portafolio"
            className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <ArrowLeft size={16} />
            Volver al portafolio
          </Link>

          {/* Hero content */}
          <div className="mt-10 grid items-center gap-10 lg:grid-cols-[1fr_1.1fr]">
            {/* Left: Text */}
            <div>
              <span
                className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[0.15em]"
                style={{
                  fontFamily: 'var(--font-mono)',
                  background: 'rgba(168, 85, 247, 0.08)',
                  borderColor: 'rgba(168, 85, 247, 0.25)',
                  color: '#A855F7',
                }}
              >
                {displayProject.category}
              </span>

              <h1
                className="mt-6 text-white uppercase"
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(36px, 6vw, 72px)',
                  fontWeight: 900,
                  letterSpacing: '-2px',
                  lineHeight: 0.95,
                }}
              >
                {displayProject.title}
              </h1>

              <p
                className="mt-5 max-w-xl text-white/60"
                style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', lineHeight: 1.75 }}
              >
                {displayProject.description}
              </p>

              {/* CTAs */}
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={displayProject.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm text-white font-medium transition-all duration-300 hover:shadow-lg hover:shadow-[#7C3AED]/25"
                  style={{
                    fontFamily: 'var(--font-body)',
                    background: 'linear-gradient(135deg, #7C3AED 0%, #9333EA 50%, #A855F7 100%)',
                  }}
                >
                  <ExternalLink size={15} />
                  Visitar sitio
                </a>
                {displayProject.pdf ? (
                  <a
                    href={displayProject.pdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border px-7 py-3 text-sm text-white/75 font-medium transition-all duration-300 hover:bg-white/10 hover:text-white"
                    style={{
                      fontFamily: 'var(--font-body)',
                      borderColor: 'rgba(168, 85, 247, 0.3)',
                    }}
                  >
                    <FileText size={15} />
                    Ver PDF
                  </a>
                ) : null}
              </div>

              {/* Year + Services mini */}
              <div className="mt-8 flex items-center gap-4 flex-wrap">
                <span
                  className="text-white/30"
                  style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}
                >
                  {displayProject.year}
                </span>
                <span className="w-1 h-1 rounded-full bg-white/20" />
                {displayProject.services.slice(0, 3).map((s, i) => (
                  <span
                    key={i}
                    className="text-white/40"
                    style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem' }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Right: Image */}
            <div
              className="relative rounded-2xl overflow-hidden group"
              style={{
                border: '1px solid rgba(168, 85, 247, 0.15)',
                background: '#111028',
              }}
            >
              <img
                src={displayProject.image}
                alt={displayProject.title}
                className="w-full object-cover"
                style={{ aspectRatio: '16/10' }}
              />
              {/* Hover overlay */}
              <div
                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                style={{ background: 'rgba(0,0,0,0.4)' }}
              >
                <a
                  href={displayProject.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white text-sm font-medium transform translate-y-2 group-hover:translate-y-0 transition-transform duration-400"
                  style={{
                    background: 'linear-gradient(135deg, #7C3AED 0%, #9333EA 50%, #A855F7 100%)',
                  }}
                >
                  <ArrowUpRight size={16} />
                  Visitar sitio
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div
          className="absolute bottom-0 left-0 w-full h-24 pointer-events-none"
          style={{ background: 'linear-gradient(to top, #000000, transparent)' }}
        />
      </section>

      {/* ===== CONTENT ===== */}
      <div ref={contentRef}>
        {/* Info Grid: Cliente / Desafío / Solución */}
        <section className="case-section opacity-0" style={{ padding: '60px 0 30px' }}>
          <div className="mx-auto" style={{ maxWidth: '1280px', padding: '0 4vw' }}>
            <div className="grid gap-5 lg:grid-cols-3">
              {/* Cliente */}
              <article
                className="rounded-2xl p-7"
                style={{
                  background: '#111028',
                  border: '1px solid rgba(168, 85, 247, 0.12)',
                }}
              >
                <span
                  className="text-xs font-bold uppercase tracking-[0.15em]"
                  style={{ fontFamily: 'var(--font-mono)', color: '#A855F7' }}
                >
                  Cliente
                </span>
                <p
                  className="mt-4 text-white/70"
                  style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', lineHeight: 1.7 }}
                >
                  {displayProject.client}
                </p>
              </article>

              {/* Desafío */}
              <article
                className="rounded-2xl p-7"
                style={{
                  background: '#111028',
                  border: '1px solid rgba(168, 85, 247, 0.12)',
                }}
              >
                <span
                  className="text-xs font-bold uppercase tracking-[0.15em]"
                  style={{ fontFamily: 'var(--font-mono)', color: '#A855F7' }}
                >
                  Desafío
                </span>
                <p
                  className="mt-4 text-white/70"
                  style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', lineHeight: 1.7 }}
                >
                  {displayProject.challenge}
                </p>
              </article>

              {/* Solución */}
              <article
                className="rounded-2xl p-7"
                style={{
                  background: '#111028',
                  border: '1px solid rgba(168, 85, 247, 0.12)',
                }}
              >
                <span
                  className="text-xs font-bold uppercase tracking-[0.15em]"
                  style={{ fontFamily: 'var(--font-mono)', color: '#A855F7' }}
                >
                  Solución
                </span>
                <p
                  className="mt-4 text-white/70"
                  style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', lineHeight: 1.7 }}
                >
                  {displayProject.solution}
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* Servicios + Resultados */}
        <section className="case-section opacity-0" style={{ padding: '30px 0' }}>
          <div
            className="mx-auto rounded-2xl p-8 lg:p-10"
            style={{
              maxWidth: '1280px',
              margin: '0 4vw',
              background: '#111028',
              border: '1px solid rgba(168, 85, 247, 0.12)',
            }}
          >
            {/* Servicios */}
            <span
              className="text-xs font-bold uppercase tracking-[0.15em]"
              style={{ fontFamily: 'var(--font-mono)', color: '#A855F7' }}
            >
              Servicios aplicados
            </span>
            <div className="mt-5 flex flex-wrap gap-2">
              {displayProject.services.map((service) => (
                <span
                  key={service}
                  className="rounded-full px-4 py-2 text-xs font-semibold"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    background: 'rgba(168, 85, 247, 0.08)',
                    border: '1px solid rgba(168, 85, 247, 0.18)',
                    color: '#C084FC',
                  }}
                >
                  {service}
                </span>
              ))}
            </div>

            {/* Resultados */}
            <div className="mt-10">
              <span
                className="text-xs font-bold uppercase tracking-[0.15em]"
                style={{ fontFamily: 'var(--font-mono)', color: '#A855F7' }}
              >
                Resultados
              </span>
              <div className="mt-5 grid gap-3 lg:grid-cols-3">
                {displayProject.results.map((result, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 rounded-xl px-5 py-4"
                    style={{
                      background: 'rgba(168, 85, 247, 0.04)',
                      border: '1px solid rgba(168, 85, 247, 0.1)',
                    }}
                  >
                    <CheckCircle2 size={18} className="text-[#A855F7] mt-0.5 flex-shrink-0" />
                    <span
                      className="text-white/70"
                      style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', lineHeight: 1.6 }}
                    >
                      {result}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Galería */}
        {displayProject.gallery.length > 0 && (
          <section className="case-section opacity-0" style={{ padding: '30px 0 80px' }}>
            <div className="mx-auto" style={{ maxWidth: '1280px', padding: '0 4vw' }}>
              <span
                className="text-xs font-bold uppercase tracking-[0.15em]"
                style={{ fontFamily: 'var(--font-mono)', color: '#A855F7' }}
              >
                Galería
              </span>
              <div className="mt-6 grid gap-5 md:grid-cols-2">
                {displayProject.gallery.map((image, index) => (
                  <div
                    key={`${image}-${index}`}
                    className="rounded-2xl overflow-hidden group"
                    style={{
                      border: '1px solid rgba(168, 85, 247, 0.12)',
                      background: '#111028',
                    }}
                  >
                    <img
                      src={image}
                      alt={`${displayProject.title} — imagen ${index + 1}`}
                      className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      style={{ aspectRatio: '16/10' }}
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>

      {/* ===== CTA BANNER ===== */}
      <section
        className="relative overflow-hidden"
        style={{
          padding: '80px 0',
          background: '#0a0818',
          borderTop: '1px solid rgba(168, 85, 247, 0.1)',
        }}
      >
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: '600px',
            height: '600px',
            background: 'radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)',
            filter: 'blur(120px)',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
        <div className="mx-auto text-center relative" style={{ maxWidth: '1280px', padding: '0 4vw' }}>
          <h2
            className="text-white"
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(1.8rem, 4vw, 3rem)',
              fontWeight: 800,
              letterSpacing: '-1px',
              lineHeight: 1.1,
            }}
          >
            ¿Tienes un proyecto similar?
          </h2>
          <p
            className="mt-4 mx-auto text-white/50"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '1rem',
              maxWidth: '440px',
              lineHeight: 1.7,
            }}
          >
            Hablemos y veamos cómo podemos ayudarte a alcanzar resultados como estos.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Link
              to="/#contact"
              className="inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm text-white font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-[#7C3AED]/25"
              style={{
                fontFamily: 'var(--font-body)',
                background: 'linear-gradient(135deg, #7C3AED 0%, #9333EA 50%, #A855F7 100%)',
              }}
            >
              Iniciar proyecto
              <ArrowUpRight size={16} />
            </Link>
            <Link
              to="/portafolio"
              className="inline-flex items-center gap-2 rounded-full border px-8 py-3.5 text-sm text-white/75 font-medium transition-all duration-300 hover:bg-white/5 hover:text-white"
              style={{
                fontFamily: 'var(--font-body)',
                borderColor: 'rgba(168, 85, 247, 0.3)',
              }}
            >
              Ver más proyectos
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
