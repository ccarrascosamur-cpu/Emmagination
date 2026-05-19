import { Link, Navigate, useParams } from 'react-router';
import { ArrowLeft, ExternalLink, FileText } from 'lucide-react';
import SEO from '../components/SEO';
import Footer from '../sections/Footer';
import { useSiteData } from '../lib/site-data-client';
import { getProjectBySlug } from '../lib/site-data';
import { buildProjectSeo } from '../lib/route-seo';

export default function ProjectCasePage() {
  const { slug } = useParams();
  const { data, isRemoteLoaded } = useSiteData();

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
    <main className="relative min-h-screen" style={{ backgroundColor: '#F8F7FB' }}>
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

      <section
        className="relative overflow-hidden"
        style={{
          background:
            'radial-gradient(circle at top left, rgba(124,58,237,0.20) 0%, transparent 35%), linear-gradient(180deg, #08060f 0%, #11111d 100%)',
          padding: '150px 0 110px',
        }}
      >
        <div className="mx-auto" style={{ maxWidth: '1440px', padding: '0 4vw' }}>
          <Link
            to="/portafolio"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <ArrowLeft size={16} />
            Volver al portafolio
          </Link>

          <div className="mt-10 grid items-start gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <span
                className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-white/70"
                style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}
              >
                {displayProject.category}
              </span>
              <h1
                className="mt-8 text-white"
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(42px, 7vw, 90px)',
                  fontWeight: 700,
                  letterSpacing: '-2px',
                  lineHeight: 0.98,
                }}
              >
                {displayProject.title}
              </h1>
              <p
                className="mt-6 max-w-3xl text-white/70"
                style={{ fontFamily: 'var(--font-body)', fontSize: '1.1rem', lineHeight: 1.8 }}
              >
                {displayProject.description}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={displayProject.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm text-white transition-all duration-300 hover:shadow-lg hover:shadow-[#7C3AED]/25"
                  style={{
                    fontFamily: 'var(--font-body)',
                    background:
                      'linear-gradient(135deg, #7C3AED 0%, #9333EA 50%, #A855F7 100%)',
                  }}
                >
                  <ExternalLink size={16} />
                  Visitar sitio
                </a>
                {displayProject.pdf ? (
                  <a
                    href={displayProject.pdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/5 px-7 py-3.5 text-sm text-white/75 transition-all duration-300 hover:bg-white/10"
                    style={{ fontFamily: 'var(--font-body)' }}
                  >
                    <FileText size={16} />
                    Ver PDF
                  </a>
                ) : null}
              </div>
            </div>

            <div className="rounded-[30px] bg-white/6 p-4 backdrop-blur-sm">
              <img
                src={displayProject.image}
                alt={displayProject.title}
                className="w-full rounded-[22px] object-cover"
                style={{ aspectRatio: '16/11' }}
              />
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '80px 0 40px' }}>
        <div className="mx-auto grid gap-8 lg:grid-cols-3" style={{ maxWidth: '1440px', padding: '0 4vw' }}>
          <article className="rounded-[28px] bg-white p-8 shadow-[0_24px_70px_rgba(15,23,42,0.06)]">
            <h2
              className="text-[#151522]"
              style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 600 }}
            >
              Cliente
            </h2>
            <p className="mt-5 text-[#566071]" style={{ fontFamily: 'var(--font-body)', lineHeight: 1.8 }}>
              {displayProject.client}
            </p>
          </article>
          <article className="rounded-[28px] bg-white p-8 shadow-[0_24px_70px_rgba(15,23,42,0.06)]">
            <h2
              className="text-[#151522]"
              style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 600 }}
            >
              Desafío
            </h2>
            <p className="mt-5 text-[#566071]" style={{ fontFamily: 'var(--font-body)', lineHeight: 1.8 }}>
              {displayProject.challenge}
            </p>
          </article>
          <article className="rounded-[28px] bg-white p-8 shadow-[0_24px_70px_rgba(15,23,42,0.06)]">
            <h2
              className="text-[#151522]"
              style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 600 }}
            >
              Solución
            </h2>
            <p className="mt-5 text-[#566071]" style={{ fontFamily: 'var(--font-body)', lineHeight: 1.8 }}>
              {displayProject.solution}
            </p>
          </article>
        </div>
      </section>

      <section style={{ padding: '40px 0 40px' }}>
        <div className="mx-auto rounded-[32px] bg-white p-8 shadow-[0_24px_70px_rgba(15,23,42,0.06)] lg:p-12" style={{ maxWidth: '1440px', margin: '0 4vw' }}>
          <span className="label-mono" style={{ color: '#7C3AED' }}>
            SERVICIOS APLICADOS
          </span>
          <div className="mt-6 flex flex-wrap gap-3">
            {displayProject.services.map((service) => (
              <span
                key={service}
                className="rounded-full px-4 py-2 text-sm"
                style={{
                  fontFamily: 'var(--font-mono)',
                  background: 'rgba(124, 58, 237, 0.08)',
                  color: '#7C3AED',
                }}
              >
                {service}
              </span>
            ))}
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {displayProject.results.map((result) => (
              <div
                key={result}
                className="rounded-2xl border border-[#ece9f8] bg-[#faf9fe] px-5 py-5 text-[#566071]"
                style={{ fontFamily: 'var(--font-body)', lineHeight: 1.7 }}
              >
                {result}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '40px 0 80px' }}>
        <div className="mx-auto" style={{ maxWidth: '1440px', padding: '0 4vw' }}>
          <span className="label-mono" style={{ color: '#7C3AED' }}>
            GALERÍA
          </span>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {displayProject.gallery.map((image, index) => (
              <img
                key={`${image}-${index}`}
                src={image}
                alt={`${displayProject.title} imagen ${index + 1}`}
                className="w-full rounded-[28px] bg-white object-cover shadow-[0_24px_70px_rgba(15,23,42,0.06)]"
                style={{ aspectRatio: '16/11' }}
                loading="lazy"
              />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
