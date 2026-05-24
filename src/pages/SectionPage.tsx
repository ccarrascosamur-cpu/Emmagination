import { Link, useParams } from 'react-router';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import SEO from '../components/SEO';
import Footer from '../sections/Footer';
import { useSiteData } from '../lib/site-data-client';
// import { trackPageView, isGA4Initialized } from '../lib/ga4';
import { useScrollDepth } from '../hooks/useScrollDepth';

const SECTIONS: Record<string, {
  title: string;
  description: string;
  keywords: string;
  heading: string;
  content: string;
  cta: string;
  ctaLink: string;
  relatedLinks: { label: string; href: string }[];
}> = {
  servicios: {
    title: 'Servicios de Diseño Web, Branding y SEO en Chile | EMMAGINATION',
    description: 'Descubre nuestros servicios de diseño web profesional, branding e identidad visual, y SEO técnico en Chile. Soluciones digitales para hacer crecer tu marca.',
    keywords: 'servicios diseño web chile, branding chile, seo chile, agencia digital servicios, diseño web profesional',
    heading: 'Servicios que transforman tu presencia digital',
    content: 'En EMMAGINATION combinamos diseño web, branding y SEO para crear experiencias digitales que convierten. Cada servicio está pensado para resolver un problema específico de tu negocio, con procesos claros y resultados medibles.',
    cta: 'Ver servicios detallados',
    ctaLink: '/#approach',
    relatedLinks: [
      { label: 'Diseño Web', href: '/servicios/diseno-web' },
      { label: 'Branding', href: '/servicios/branding' },
      { label: 'SEO', href: '/servicios/seo' },
    ],
  },
  portafolio: {
    title: 'Portafolio de Proyectos Web y Branding en Chile | EMMAGINATION',
    description: 'Explora nuestro portafolio de casos de éxito: diseño web, e-commerce Shopify, branding e identidad visual para marcas chilenas. Resultados comprobados.',
    keywords: 'portafolio diseño web chile, casos éxito branding, proyectos shopify chile, ejemplos diseño web',
    heading: 'Proyectos que hablan por sí solos',
    content: 'Cada proyecto en nuestro portafolio representa un desafío resuelto. Desde tiendas Shopify que aumentan conversiones hasta marcas que se posicionan con claridad. Estos son algunos de los resultados que hemos logrado para nuestros clientes.',
    cta: 'Ver portafolio completo',
    ctaLink: '/portafolio',
    relatedLinks: [
      { label: 'Portal Zen', href: '/proyectos/portal-zen' },
      { label: 'Sagrada Madre', href: '/proyectos/sagrada-madre' },
      { label: 'Fegar', href: '/proyectos/fegar' },
    ],
  },
  proceso: {
    title: 'Nuestro Proceso de Diseño Web y Branding | EMMAGINATION',
    description: 'Conoce nuestro proceso de trabajo: descubrimiento, estrategia, diseño, desarrollo y lanzamiento. Metodología probada para proyectos digitales exitosos.',
    keywords: 'proceso diseño web, metodología branding, cómo trabaja agencia digital, etapas proyecto web',
    heading: 'Un proceso claro, resultados predecibles',
    content: 'No improvisamos. Cada proyecto sigue una metodología de 5 etapas que garantiza que nada se pase por alto: desde el descubrimiento inicial hasta el lanzamiento y medición de resultados.',
    cta: 'Iniciar un proyecto',
    ctaLink: '/#contact',
    relatedLinks: [
      { label: 'Cotizar proyecto', href: '/#cotizar' },
      { label: 'Ver servicios', href: '/servicios' },
      { label: 'Contacto', href: '/#contact' },
    ],
  },
  testimonios: {
    title: 'Testimonios y Opiniones de Clientes | EMMAGINATION',
    description: 'Lee lo que dicen nuestros clientes sobre nuestros servicios de diseño web, branding y SEO en Chile. Testimonios reales de marcas que confiaron en nosotros.',
    keywords: 'testimonios agencia diseño web, opiniones branding chile, clientes satisfechos diseño web',
    heading: 'Lo que dicen quienes ya trabajaron con nosotros',
    content: 'La confianza de nuestros clientes es nuestro mejor aval. Estas son algunas de las experiencias de marcas que decidieron transformar su presencia digital con EMMAGINATION.',
    cta: 'Ver portafolio',
    ctaLink: '/portafolio',
    relatedLinks: [
      { label: 'Ver proyectos', href: '/portafolio' },
      { label: 'Nuestros servicios', href: '/servicios' },
      { label: 'Contactar', href: '/#contact' },
    ],
  },
  contacto: {
    title: 'Contacto - Agencia de Diseño Web y Branding en Chile | EMMAGINATION',
    description: 'Contáctanos para tu proyecto de diseño web, branding o SEO. Cotización gratuita. Atención personalizada para marcas en Chile.',
    keywords: 'contacto agencia diseño web chile, cotizar diseño web, contactar branding chile, presupuesto web',
    heading: 'Hablemos de tu proyecto',
    content: 'Estamos listos para escuchar tus necesidades y proponerte una solución a medida. Ya sea un rediseño, una marca nueva o una estrategia SEO, el primer paso es conversar.',
    cta: 'Enviar mensaje por WhatsApp',
    ctaLink: 'https://wa.me/56988290618',
    relatedLinks: [
      { label: 'Cotizar online', href: '/#cotizar' },
      { label: 'Ver servicios', href: '/servicios' },
      { label: 'Ver portafolio', href: '/portafolio' },
    ],
  },
  cotizar: {
    title: 'Cotizar Diseño Web, Branding o SEO | EMMAGINATION',
    description: 'Obtén una cotización personalizada para tu proyecto de diseño web, branding o SEO en Chile. Calculadora online y atención directa por WhatsApp.',
    keywords: 'cotizar diseño web chile, presupuesto branding, cuánto cuesta página web chile, cotización seo',
    heading: 'Calcula el valor de tu proyecto',
    content: 'Usa nuestra calculadora para obtener una estimación rápida, o contáctanos directamente para una propuesta detallada adaptada a tus necesidades específicas.',
    cta: 'Usar calculadora',
    ctaLink: '/#cotizar',
    relatedLinks: [
      { label: 'Contactar por WhatsApp', href: 'https://wa.me/56988290618' },
      { label: 'Ver servicios', href: '/servicios' },
      { label: 'Ver portafolio', href: '/portafolio' },
    ],
  },
  auditoria: {
    title: 'Auditoría SEO Gratuita para tu Sitio Web | EMMAGINATION',
    description: 'Solicita una auditoría SEO gratuita de tu sitio web. Analizamos velocidad, indexación, contenido y oportunidades de mejora. Sin compromiso.',
    keywords: 'auditoría seo gratis, análisis web gratuito, revisión seo chile, diagnóstico web gratis',
    heading: 'Descubre qué está frenando tu crecimiento',
    content: 'Nuestra auditoría SEO gratuita analiza los aspectos técnicos y de contenido que pueden estar limitando la visibilidad de tu sitio en Google. Recibe un reporte con acciones concretas.',
    cta: 'Solicitar auditoría gratis',
    ctaLink: '/#auditoria',
    relatedLinks: [
      { label: 'Servicio SEO', href: '/servicios/seo' },
      { label: 'Contactar', href: '/#contact' },
      { label: 'Ver portafolio', href: '/portafolio' },
    ],
  },
};

export default function SectionPage() {
  const { sectionId } = useParams();
  const { data } = useSiteData();
  useScrollDepth();

  const section = sectionId ? SECTIONS[sectionId] : undefined;

  if (!section) {
    return (
      <main className="relative min-h-screen" style={{ background: '#050208' }}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-white text-4xl font-bold">Sección no encontrada</h1>
            <Link to="/" className="text-[#A855F7] mt-4 inline-block">Volver al inicio</Link>
          </div>
        </div>
      </main>
    );
  }

  const canonicalPath = `/${sectionId}`;
  const whatsappNumber = data.config.contactPhone.replace(/[^\d]/g, '');

  return (
    <main className="relative min-h-screen" style={{ background: '#050208' }}>
      <SEO
        title={section.title}
        description={section.description}
        keywords={section.keywords}
        canonicalPath={canonicalPath}
        image="/images/og-default.jpg"
        type="website"
        schema={[
          {
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: section.title,
            url: `https://emmagination.cl${canonicalPath}`,
            description: section.description,
            isPartOf: {
              '@type': 'WebSite',
              name: 'EMMAGINATION',
              url: 'https://emmagination.cl',
            },
            breadcrumb: {
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://emmagination.cl/' },
                { '@type': 'ListItem', position: 2, name: section.heading, item: `https://emmagination.cl${canonicalPath}` },
              ],
            },
          },
        ]}
      />

      {/* Hero de sección */}
      <section
        className="relative overflow-hidden"
        style={{
          background: 'radial-gradient(circle at top left, rgba(124,58,237,0.24) 0%, transparent 35%), linear-gradient(180deg, #08060f 0%, #11111d 100%)',
          padding: '140px 0 80px',
        }}
      >
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px)',
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
              EMMAGINATION
            </span>
            <h1
              className="mt-8 text-white"
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(36px, 6vw, 72px)',
                fontWeight: 700,
                letterSpacing: '-2px',
                lineHeight: 0.98,
              }}
            >
              {section.heading}
            </h1>
            <p
              className="mt-6 max-w-2xl text-white/65"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(16px, 1.8vw, 20px)',
                lineHeight: 1.7,
              }}
            >
              {section.content}
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href={section.ctaLink.startsWith('http') ? section.ctaLink : section.ctaLink}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-white text-sm font-medium transition-all duration-300 hover:shadow-lg hover:shadow-[#7C3AED]/25"
                style={{
                  fontFamily: 'var(--font-body)',
                  background: 'linear-gradient(135deg, #7C3AED 0%, #9333EA 50%, #A855F7 100%)',
                }}
              >
                {section.cta}
                <ArrowRight size={16} />
              </a>
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-white/12 bg-white/5 text-white/75 hover:bg-white/10 transition-all duration-300 text-sm"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Links relacionados */}
      <section style={{ padding: '60px 0' }}>
        <div className="mx-auto" style={{ maxWidth: '1440px', padding: '0 4vw' }}>
          <h2
            className="text-white/80"
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.5rem',
              fontWeight: 600,
            }}
          >
            También te puede interesar
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {section.relatedLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="group rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition-all duration-300"
              >
                <span
                  className="text-white group-hover:text-[#A855F7] transition-colors"
                  style={{ fontFamily: 'var(--font-body)', fontSize: '1.1rem' }}
                >
                  {link.label}
                </span>
                <ArrowRight
                  size={16}
                  className="mt-2 text-white/40 group-hover:text-[#A855F7] group-hover:translate-x-1 transition-all"
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section
        className="relative overflow-hidden"
        style={{
          padding: '80px 0',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          background: 'linear-gradient(180deg, rgba(10,8,24,0.96) 0%, rgba(6,5,14,1) 100%)',
        }}
      >
        <div className="mx-auto text-center" style={{ maxWidth: '1080px', padding: '0 4vw' }}>
          <h2
            className="text-white"
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(1.8rem, 4vw, 3rem)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
            }}
          >
            ¿Listo para transformar tu marca?
          </h2>
          <p
            className="mt-4 mx-auto max-w-xl text-white/52"
            style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', lineHeight: 1.7 }}
          >
            Diseñamos sitios que no se quedan en verse correctos. Buscamos que la marca se sienta más sólida, más clara y más deseable.
          </p>
          <div className="mt-8 flex justify-center gap-3 flex-wrap">
            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm text-white font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-[#7C3AED]/25"
              style={{
                fontFamily: 'var(--font-body)',
                background: 'linear-gradient(135deg, #7C3AED 0%, #9333EA 52%, #EC4899 100%)',
              }}
            >
              Iniciar proyecto
              <ArrowRight size={16} />
            </a>
            <Link
              to="/#cotizar"
              className="inline-flex items-center gap-2 rounded-full border px-8 py-3.5 text-sm text-white/76 font-medium transition-all duration-300 hover:bg-white/5 hover:text-white"
              style={{
                fontFamily: 'var(--font-body)',
                borderColor: 'rgba(255,255,255,0.14)',
                background: 'rgba(255,255,255,0.025)',
              }}
            >
              Cotizar gratis
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
