import { Link, Navigate, useParams } from 'react-router';
import { ArrowLeft, ArrowRight, MapPin, Star } from 'lucide-react';
import SEO from '../components/SEO';
import Footer from '../sections/Footer';
import { getServiceBySlug } from '../data/services';
import { buildServiceSeo } from '../lib/route-seo';
import { useSiteData } from '../lib/site-data-client';

export default function ServicePage() {
  const { slug } = useParams();
  const { data } = useSiteData();

  if (slug === 'shopify-seo') {
    return <Navigate to="/servicios/seo" replace />;
  }

  const service = slug ? getServiceBySlug(slug) : undefined;

  if (!service || !slug) {
    return <Navigate to="/" replace />;
  }

  const seo = buildServiceSeo(slug);
  const relatedProjects = data.projects.filter((project) =>
    service.relatedProjectIds.includes(project.id),
  );

  return (
    <main className="relative min-h-screen" style={{ backgroundColor: '#F8F7FB' }}>
      {seo ? <SEO {...seo} /> : null}

      <section
        className="relative overflow-hidden"
        style={{
          background:
            'radial-gradient(circle at top left, rgba(124,58,237,0.24) 0%, transparent 35%), linear-gradient(180deg, #08060f 0%, #11111d 100%)',
          padding: '150px 0 110px',
        }}
      >
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        <div className="relative mx-auto" style={{ maxWidth: '1440px', padding: '0 4vw' }}>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <ArrowLeft size={16} />
            Volver al inicio
          </Link>

          <div className="mt-10 max-w-4xl">
            <span
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-white/70"
              style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}
            >
              <MapPin size={13} />
              Servicio en Chile
            </span>
            <h1
              className="mt-8 text-white"
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(42px, 7vw, 92px)',
                fontWeight: 700,
                letterSpacing: '-2px',
                lineHeight: 0.98,
              }}
            >
              {service.title}
            </h1>
            <p
              className="mt-8 max-w-3xl text-white/70"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(18px, 2vw, 22px)',
                lineHeight: 1.7,
              }}
            >
              {service.heroTitle}
            </p>
            <p
              className="mt-5 max-w-2xl text-white/52"
              style={{ fontFamily: 'var(--font-body)', lineHeight: 1.7 }}
            >
              {service.intro}
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="/#contact"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-white text-sm font-medium transition-all duration-300 hover:shadow-lg hover:shadow-[#7C3AED]/25"
                style={{
                  fontFamily: 'var(--font-body)',
                  background:
                    'linear-gradient(135deg, #7C3AED 0%, #9333EA 50%, #A855F7 100%)',
                }}
              >
                Solicitar propuesta
                <ArrowRight size={16} />
              </a>
              <a
                href={data.config.googleBusinessUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-white/12 bg-white/5 text-white/75 hover:bg-white/10 transition-all duration-300 text-sm"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                <Star size={16} />
                Ver perfil en Google
              </a>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '88px 0 40px' }}>
        <div className="mx-auto grid gap-8 lg:grid-cols-3" style={{ maxWidth: '1440px', padding: '0 4vw' }}>
          {[
            { title: 'Qué resolvemos', items: service.benefits },
            { title: 'Qué entregamos', items: service.deliverables },
            { title: 'Cómo trabajamos', items: service.process },
          ].map((block) => (
            <article
              key={block.title}
              className="rounded-[28px] bg-white p-8 shadow-[0_24px_70px_rgba(15,23,42,0.06)]"
            >
              <h2
                className="text-[#151522]"
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.5rem',
                  fontWeight: 600,
                }}
              >
                {block.title}
              </h2>
              <ul className="mt-6 space-y-4">
                {block.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-2xl border border-[#ece9f8] bg-[#faf9fe] px-4 py-4 text-[#4b5563]"
                    style={{ fontFamily: 'var(--font-body)', lineHeight: 1.7 }}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section style={{ padding: '40px 0 40px' }}>
        <div className="mx-auto" style={{ maxWidth: '1440px', padding: '0 4vw' }}>
          <div className="rounded-[32px] bg-[#11111d] px-8 py-10 text-white lg:px-12">
            <span
              className="label-mono text-white/45"
            >
              SEO LOCAL
            </span>
            <h2
              className="mt-4"
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(28px, 4vw, 46px)',
                fontWeight: 600,
                lineHeight: 1.08,
              }}
            >
              Señales de entidad más claras para búsquedas locales y comerciales.
            </h2>
            <p
              className="mt-5 max-w-3xl text-white/65"
              style={{ fontFamily: 'var(--font-body)', lineHeight: 1.8 }}
            >
              Esta página se integra con la presencia general de EMMAGINATION, su perfil de
              Google Business, enlazado interno, schema de servicio y contenido específico
              para que Google entienda mejor qué haces, dónde operas y para qué tipo de
              búsqueda eres relevante.
            </p>
          </div>
        </div>
      </section>

      {relatedProjects.length > 0 ? (
        <section style={{ padding: '40px 0 72px' }}>
          <div className="mx-auto" style={{ maxWidth: '1440px', padding: '0 4vw' }}>
            <div className="flex items-end justify-between gap-6">
              <div>
                <span className="label-mono" style={{ color: '#7C3AED' }}>
                  CASOS RELACIONADOS
                </span>
                <h2
                  className="mt-3 text-[#171728]"
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'clamp(28px, 4vw, 44px)',
                    fontWeight: 600,
                  }}
                >
                  Proyectos conectados con este servicio
                </h2>
              </div>
              <Link
                to="/portafolio"
                className="hidden md:inline-flex items-center gap-2 text-[#7C3AED] hover:text-[#5b21b6] transition-colors"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                Ver portafolio completo
                <ArrowRight size={16} />
              </Link>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {relatedProjects.map((project) => (
                <article
                  key={project.id}
                  className="overflow-hidden rounded-[28px] bg-white shadow-[0_24px_70px_rgba(15,23,42,0.06)]"
                >
                  <img
                    src={project.image}
                    alt={project.title}
                    className="h-64 w-full object-cover"
                    loading="lazy"
                  />
                  <div className="p-7">
                    <div className="flex items-center justify-between gap-4">
                      <h3
                        className="text-[#171728]"
                        style={{ fontFamily: 'var(--font-heading)', fontWeight: 600 }}
                      >
                        {project.title}
                      </h3>
                      <span
                        className="text-[#8b8b9c] text-xs"
                        style={{ fontFamily: 'var(--font-mono)' }}
                      >
                        {project.year}
                      </span>
                    </div>
                    <p
                      className="mt-4 text-[#5b6270]"
                      style={{ fontFamily: 'var(--font-body)', lineHeight: 1.7 }}
                    >
                      {project.description}
                    </p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {project.services.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full px-3 py-1 text-xs"
                          style={{
                            fontFamily: 'var(--font-mono)',
                            background: 'rgba(124, 58, 237, 0.08)',
                            color: '#7C3AED',
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-6 inline-flex items-center gap-2 text-[#7C3AED] hover:text-[#5b21b6] transition-colors"
                      style={{ fontFamily: 'var(--font-body)' }}
                    >
                      Visitar proyecto
                      <ArrowRight size={16} />
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section style={{ padding: '0 0 72px' }}>
        <div className="mx-auto" style={{ maxWidth: '1440px', padding: '0 4vw' }}>
          <div className="rounded-[30px] bg-white p-8 shadow-[0_24px_70px_rgba(15,23,42,0.06)] lg:p-12">
            <span className="label-mono" style={{ color: '#7C3AED' }}>
              PREGUNTAS FRECUENTES
            </span>
            <div className="mt-8 grid gap-5">
              {service.faqs.map((faq) => (
                <article
                  key={faq.question}
                  className="rounded-2xl border border-[#ede9fb] bg-[#faf9fe] px-6 py-6"
                >
                  <h2
                    className="text-[#171728]"
                    style={{ fontFamily: 'var(--font-heading)', fontWeight: 600 }}
                  >
                    {faq.question}
                  </h2>
                  <p
                    className="mt-3 text-[#596171]"
                    style={{ fontFamily: 'var(--font-body)', lineHeight: 1.8 }}
                  >
                    {faq.answer}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
