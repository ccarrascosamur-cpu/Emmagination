import { useEffect, useRef } from 'react';
import { Link, Navigate, useParams } from 'react-router';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowLeft,
  ExternalLink,
  FileText,
  ArrowUpRight,
  CheckCircle2,
} from 'lucide-react';
import SEO from '../components/SEO';
import Footer from '../sections/Footer';
import { useSiteData } from '../lib/site-data-client';
import { getProjectBySlug } from '../lib/site-data';
import { buildProjectSeo } from '../lib/route-seo';
import { useScrollDepth } from '../hooks/useScrollDepth';
import { trackProjectView } from '../lib/ga4';

gsap.registerPlugin(ScrollTrigger);

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-flex items-center rounded-full px-4 py-2 text-[11px] font-bold uppercase tracking-[0.24em]"
      style={{
        fontFamily: 'var(--font-mono)',
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.08)',
        color: '#C084FC',
      }}
    >
      {children}
    </span>
  );
}

function CaseCard({
  eyebrow,
  title,
  children,
  accent = false,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <article
      className="rounded-[28px] p-7 lg:p-8"
      style={{
        background: accent
          ? 'linear-gradient(160deg, rgba(24,17,49,0.98) 0%, rgba(15,11,31,0.96) 100%)'
          : 'linear-gradient(160deg, rgba(16,15,34,0.96) 0%, rgba(11,10,24,0.96) 100%)',
        border: accent
          ? '1px solid rgba(192,132,252,0.24)'
          : '1px solid rgba(255,255,255,0.08)',
        boxShadow: accent
          ? '0 30px 80px rgba(124,58,237,0.12)'
          : '0 24px 70px rgba(0,0,0,0.28)',
      }}
    >
      <div
        className="text-[11px] font-bold uppercase tracking-[0.22em]"
        style={{ fontFamily: 'var(--font-mono)', color: accent ? '#E9D5FF' : '#A855F7' }}
      >
        {eyebrow}
      </div>
      <h3
        className="mt-4 text-white"
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'clamp(1.15rem, 2vw, 1.5rem)',
          fontWeight: 800,
          letterSpacing: '-0.03em',
          lineHeight: 1.05,
        }}
      >
        {title}
      </h3>
      <div
        className="mt-4 text-white/68"
        style={{ fontFamily: 'var(--font-body)', fontSize: '0.98rem', lineHeight: 1.75 }}
      >
        {children}
      </div>
    </article>
  );
}

export default function ProjectCasePage() {
  const { slug } = useParams();
  const { data, isRemoteLoaded } = useSiteData();
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    if (!contentRef.current) return;
    const ctx = gsap.context(() => {
      const sections = contentRef.current!.querySelectorAll('.case-section');
      sections.forEach((section, index) => {
        gsap.fromTo(
          section,
          { opacity: 0, y: 56 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            delay: index * 0.05,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 82%',
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

  useEffect(() => {
    if (displayProject) {
      trackProjectView(displayProject.title);
    }
  }, [displayProject]);

  useScrollDepth();

  const heroVisual = displayProject.portfolioScrollImage || displayProject.image;
  const metrics = [displayProject.metric, displayProject.metricLabel].filter(Boolean);

  return (
    <main
      className="relative min-h-screen overflow-hidden"
      style={{
        background:
          'radial-gradient(circle at 18% 12%, rgba(120,77,255,0.16) 0%, transparent 24%), radial-gradient(circle at 86% 20%, rgba(236,72,153,0.1) 0%, transparent 20%), linear-gradient(180deg, #090613 0%, #05040b 42%, #020203 100%)',
      }}
    >
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

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)',
          backgroundSize: '110px 110px',
          maskImage: 'linear-gradient(180deg, rgba(0,0,0,0.85), transparent 80%)',
        }}
      />

      <section style={{ padding: '132px 0 72px' }}>
        <div className="mx-auto relative" style={{ maxWidth: '1380px', padding: '0 4vw' }}>
          <Link
            to="/portafolio"
            className="inline-flex items-center gap-2 text-white/46 hover:text-white transition-colors text-sm"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <ArrowLeft size={16} />
            Volver al portafolio
          </Link>

          <div className="mt-10 grid gap-10 xl:grid-cols-[0.95fr_1.15fr] xl:items-end">
            <div className="relative z-10">
              <div className="flex flex-wrap items-center gap-3">
                <SectionLabel>{displayProject.category}</SectionLabel>
                <span
                  className="text-white/28"
                  style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem' }}
                >
                  {displayProject.year}
                </span>
                {displayProject.tags ? (
                  <span
                    className="text-white/40"
                    style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem' }}
                  >
                    {displayProject.tags}
                  </span>
                ) : null}
              </div>

              <h1
                className="mt-7 text-white uppercase"
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(3rem, 8vw, 7rem)',
                  fontWeight: 900,
                  letterSpacing: '-0.065em',
                  lineHeight: 0.92,
                  textWrap: 'balance',
                }}
              >
                {displayProject.title}
              </h1>

              <p
                className="mt-6 max-w-xl text-white/62"
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '1.02rem',
                  lineHeight: 1.82,
                }}
              >
                {displayProject.description}
              </p>

              {metrics.length > 0 && (
                <div className="mt-8 flex flex-wrap gap-3">
                  {metrics.map((metric) => (
                    <div
                      key={metric}
                      className="rounded-full px-4 py-2.5"
                      style={{
                        border: '1px solid rgba(6,214,160,0.16)',
                        background: 'rgba(6,214,160,0.06)',
                        color: '#86EFAC',
                      }}
                    >
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          letterSpacing: '0.02em',
                        }}
                      >
                        ▲ {metric}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-9 flex flex-wrap gap-3">
                <a
                  href={displayProject.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm text-white font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-[#7C3AED]/25"
                  style={{
                    fontFamily: 'var(--font-body)',
                    background: 'linear-gradient(135deg, #7C3AED 0%, #9333EA 52%, #EC4899 100%)',
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
                    className="inline-flex items-center gap-2 rounded-full border px-7 py-3.5 text-sm text-white/78 font-medium transition-all duration-300 hover:bg-white/6 hover:text-white"
                    style={{
                      fontFamily: 'var(--font-body)',
                      borderColor: 'rgba(255,255,255,0.12)',
                      background: 'rgba(255,255,255,0.03)',
                    }}
                  >
                    <FileText size={15} />
                    Ver PDF
                  </a>
                ) : null}
              </div>

              <div
                className="mt-10 rounded-[28px] p-5 sm:p-6"
                style={{
                  background: 'linear-gradient(160deg, rgba(255,255,255,0.03), rgba(255,255,255,0.015))',
                  border: '1px solid rgba(255,255,255,0.08)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <div
                  className="text-[11px] font-bold uppercase tracking-[0.22em]"
                  style={{ fontFamily: 'var(--font-mono)', color: '#A855F7' }}
                >
                  Servicios aplicados
                </div>
                <div className="mt-4 flex flex-wrap gap-2.5">
                  {displayProject.services.map((service) => (
                    <span
                      key={service}
                      className="rounded-full px-4 py-2 text-xs font-semibold"
                      style={{
                        fontFamily: 'var(--font-mono)',
                        background: 'rgba(168, 85, 247, 0.08)',
                        border: '1px solid rgba(168, 85, 247, 0.18)',
                        color: '#D8B4FE',
                      }}
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="relative xl:pl-6">
              <div
                className="absolute -top-8 right-4 hidden xl:block"
                style={{
                  width: '190px',
                  height: '190px',
                  borderRadius: '999px',
                  background: 'radial-gradient(circle, rgba(124,58,237,0.26) 0%, transparent 70%)',
                  filter: 'blur(18px)',
                }}
              />

              <div
                className="relative overflow-hidden rounded-[34px] p-3"
                style={{
                  background:
                    'linear-gradient(160deg, rgba(20,15,42,0.94) 0%, rgba(10,8,21,0.98) 100%)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  boxShadow: '0 40px 120px rgba(0,0,0,0.45)',
                }}
              >
                <div
                  className="flex items-center gap-2 px-4 py-3"
                  style={{
                    borderBottom: '1px solid rgba(255,255,255,0.08)',
                    background: 'rgba(255,255,255,0.03)',
                  }}
                >
                  <div className="flex gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                    <div className="h-3 w-3 rounded-full bg-[#febc2e]" />
                    <div className="h-3 w-3 rounded-full bg-[#28c840]" />
                  </div>
                  <div
                    className="ml-3 flex-1 truncate rounded-full px-4 py-2 text-[11px]"
                    style={{
                      fontFamily: 'var(--font-mono)',
                      color: '#B8ACD9',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.06)',
                    }}
                  >
                    {displayProject.url.replace(/^https?:\/\//, '')}
                  </div>
                </div>

                <div className="relative">
                  <img
                    src={heroVisual}
                    alt={displayProject.title}
                    className="w-full object-cover"
                    style={{
                      aspectRatio: '16/10',
                      borderRadius: '0 0 24px 24px',
                    }}
                  />
                  <div
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-40"
                    style={{
                      background:
                        'linear-gradient(180deg, rgba(4,4,7,0) 0%, rgba(4,4,7,0.16) 38%, rgba(4,4,7,0.8) 100%)',
                    }}
                  />
                </div>

                <div className="pointer-events-none absolute bottom-6 left-6 right-6 hidden md:flex md:items-end md:justify-between">
                  <div
                    className="max-w-[62%] rounded-[22px] px-5 py-4"
                    style={{
                      background: 'rgba(6,6,14,0.6)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      backdropFilter: 'blur(14px)',
                    }}
                  >
                    <div
                      className="text-[11px] uppercase tracking-[0.2em] text-white/42"
                      style={{ fontFamily: 'var(--font-mono)' }}
                    >
                      Cliente
                    </div>
                    <div
                      className="mt-2 text-white"
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: '1.15rem',
                        fontWeight: 800,
                        letterSpacing: '-0.02em',
                      }}
                    >
                      {displayProject.client}
                    </div>
                  </div>
                  <div
                    className="rounded-[20px] px-4 py-3"
                    style={{
                      background: 'rgba(6,6,14,0.6)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      backdropFilter: 'blur(14px)',
                    }}
                  >
                    <div
                      className="text-[11px] uppercase tracking-[0.2em] text-white/42"
                      style={{ fontFamily: 'var(--font-mono)' }}
                    >
                      Año
                    </div>
                    <div
                      className="mt-1 text-white"
                      style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 800 }}
                    >
                      {displayProject.year}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div ref={contentRef}>
        <section className="case-section opacity-0" style={{ padding: '18px 0 30px' }}>
          <div className="mx-auto" style={{ maxWidth: '1380px', padding: '0 4vw' }}>
            <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
              <CaseCard eyebrow="01" title="El punto de partida">
                {displayProject.challenge}
              </CaseCard>

              <CaseCard eyebrow="02" title="La dirección creativa" accent>
                {displayProject.solution}
              </CaseCard>
            </div>
          </div>
        </section>

        <section className="case-section opacity-0" style={{ padding: '24px 0 34px' }}>
          <div className="mx-auto" style={{ maxWidth: '1380px', padding: '0 4vw' }}>
            <div
              className="overflow-hidden rounded-[34px] p-7 lg:p-9"
              style={{
                background:
                  'linear-gradient(180deg, rgba(15,13,30,0.98) 0%, rgba(10,9,20,0.98) 100%)',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: '0 32px 100px rgba(0,0,0,0.32)',
              }}
            >
              <div className="grid gap-8 xl:grid-cols-[0.75fr_1.25fr]">
                <div>
                  <SectionLabel>Resumen</SectionLabel>
                  <h2
                    className="mt-5 text-white uppercase"
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: 'clamp(1.8rem, 4vw, 3.2rem)',
                      fontWeight: 900,
                      letterSpacing: '-0.05em',
                      lineHeight: 0.94,
                    }}
                  >
                    Resultado con
                    <br />
                    carácter visual.
                  </h2>
                  <p
                    className="mt-5 max-w-md text-white/58"
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.98rem',
                      lineHeight: 1.8,
                    }}
                  >
                    Una ejecución pensada para que la marca se entendiera mejor, se
                    sintiera más sólida y tuviera una base comercial más clara.
                  </p>

                  <div className="mt-7 grid gap-3 sm:grid-cols-2">
                    <div
                      className="rounded-[22px] p-4"
                      style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.07)',
                      }}
                    >
                      <div
                        className="text-[11px] uppercase tracking-[0.18em] text-white/42"
                        style={{ fontFamily: 'var(--font-mono)' }}
                      >
                        Cliente
                      </div>
                      <div
                        className="mt-2 text-white"
                        style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: 800 }}
                      >
                        {displayProject.client}
                      </div>
                    </div>
                    <div
                      className="rounded-[22px] p-4"
                      style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.07)',
                      }}
                    >
                      <div
                        className="text-[11px] uppercase tracking-[0.18em] text-white/42"
                        style={{ fontFamily: 'var(--font-mono)' }}
                      >
                        Categoría
                      </div>
                      <div
                        className="mt-2 text-white"
                        style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: 800 }}
                      >
                        {displayProject.category}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <SectionLabel>Resultados</SectionLabel>
                  <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {displayProject.results.map((result, index) => (
                      <div
                        key={index}
                        className="rounded-[24px] p-5"
                        style={{
                          background:
                            index === 0
                              ? 'linear-gradient(160deg, rgba(34,197,94,0.08), rgba(255,255,255,0.03))'
                              : 'linear-gradient(160deg, rgba(255,255,255,0.03), rgba(255,255,255,0.015))',
                          border:
                            index === 0
                              ? '1px solid rgba(34,197,94,0.16)'
                              : '1px solid rgba(255,255,255,0.07)',
                        }}
                      >
                        <div className="flex items-start gap-3">
                          <CheckCircle2
                            size={18}
                            className={index === 0 ? 'text-[#86EFAC]' : 'text-[#C084FC]'}
                          />
                          <div>
                            <div
                              className="text-[11px] uppercase tracking-[0.18em] text-white/32"
                              style={{ fontFamily: 'var(--font-mono)' }}
                            >
                              Impacto {String(index + 1).padStart(2, '0')}
                            </div>
                            <p
                              className="mt-3 text-white/74"
                              style={{
                                fontFamily: 'var(--font-body)',
                                fontSize: '0.95rem',
                                lineHeight: 1.68,
                              }}
                            >
                              {result}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {displayProject.gallery.length > 0 && (
          <section className="case-section opacity-0" style={{ padding: '30px 0 90px' }}>
            <div className="mx-auto" style={{ maxWidth: '1380px', padding: '0 4vw' }}>
              <div className="flex items-end justify-between gap-6 flex-wrap">
                <div>
                  <SectionLabel>Galería</SectionLabel>
                  <h2
                    className="mt-5 text-white uppercase"
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: 'clamp(1.8rem, 4vw, 3rem)',
                      fontWeight: 900,
                      letterSpacing: '-0.05em',
                      lineHeight: 0.96,
                    }}
                  >
                    Detalles del proyecto
                  </h2>
                </div>
                <p
                  className="max-w-md text-white/46"
                  style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', lineHeight: 1.75 }}
                >
                  Una selección de vistas para mostrar estructura, estilo visual y cómo
                  se resolvió la experiencia digital.
                </p>
              </div>

              <div className="mt-8 grid gap-5 lg:grid-cols-12">
                {displayProject.gallery.map((image, index) => {
                  const isHeroCard = index === 0;
                  return (
                    <div
                      key={`${image}-${index}`}
                      className={`${isHeroCard ? 'lg:col-span-7' : 'lg:col-span-5'} group overflow-hidden rounded-[30px]`}
                      style={{
                        border: '1px solid rgba(255,255,255,0.08)',
                        background: 'rgba(255,255,255,0.02)',
                        boxShadow: '0 24px 80px rgba(0,0,0,0.28)',
                      }}
                    >
                      <div className="overflow-hidden">
                        <img
                          src={image}
                          alt={`${displayProject.title} — imagen ${index + 1}`}
                          className="w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                          style={{ aspectRatio: isHeroCard ? '16/10' : '4/3' }}
                          loading="lazy"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}
      </div>

      <section
        className="relative overflow-hidden"
        style={{
          padding: '88px 0 96px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          background:
            'linear-gradient(180deg, rgba(10,8,24,0.96) 0%, rgba(6,5,14,1) 100%)',
        }}
      >
        <div
          className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(124,58,237,0.14) 0%, transparent 70%)',
            filter: 'blur(90px)',
          }}
        />
        <div className="mx-auto relative text-center" style={{ maxWidth: '1080px', padding: '0 4vw' }}>
          <SectionLabel>Siguiente paso</SectionLabel>
          <h2
            className="mt-6 text-white uppercase"
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2rem, 5vw, 4.2rem)',
              fontWeight: 900,
              letterSpacing: '-0.06em',
              lineHeight: 0.94,
            }}
          >
            ¿Quieres una página
            <br />
            con este nivel de presencia?
          </h2>
          <p
            className="mt-5 mx-auto max-w-2xl text-white/52"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '1rem',
              lineHeight: 1.82,
            }}
          >
            Diseñamos sitios que no se quedan en verse correctos. Buscamos que la marca
            se sienta más sólida, más clara y más deseable desde la primera impresión.
          </p>
          <div className="mt-9 flex justify-center gap-3 flex-wrap">
            <Link
              to="/#contact"
              className="inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm text-white font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-[#7C3AED]/25"
              style={{
                fontFamily: 'var(--font-body)',
                background: 'linear-gradient(135deg, #7C3AED 0%, #9333EA 52%, #EC4899 100%)',
              }}
            >
              Iniciar proyecto
              <ArrowUpRight size={16} />
            </Link>
            <Link
              to="/portafolio"
              className="inline-flex items-center gap-2 rounded-full border px-8 py-3.5 text-sm text-white/76 font-medium transition-all duration-300 hover:bg-white/5 hover:text-white"
              style={{
                fontFamily: 'var(--font-body)',
                borderColor: 'rgba(255,255,255,0.14)',
                background: 'rgba(255,255,255,0.025)',
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
