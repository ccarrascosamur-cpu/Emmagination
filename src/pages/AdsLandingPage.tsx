import { useEffect, useRef } from 'react';
import { Link } from 'react-router';
import { ArrowRight, CheckCircle2, Zap, Target, TrendingUp, Clock, Shield, MessageCircle, Star, Sparkles, Eye, Palette } from 'lucide-react';
import SEO from '../components/SEO';
import { useSiteData } from '../lib/site-data-client';
import { trackCTAClick, trackGenerateLead, trackContact } from '../lib/ga4';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const BENEFITS = [
  {
    icon: Zap,
    title: 'Sitios que cargan en menos de 2 segundos',
    desc: 'Performance y código limpio para una experiencia de usuario excepcional.',
  },
  {
    icon: Target,
    title: 'Diseño orientado a conversión',
    desc: 'Cada elemento visual tiene un propósito: guiar al visitante hacia la acción que tú defines.',
  },
  {
    icon: Palette,
    title: 'Branding integrado desde el primer diseño',
    desc: 'Colores, tipografía, voz de marca y diseño consistente en cada página.',
  },
  {
    icon: Clock,
    title: 'Entrega en 2-4 semanas',
    desc: 'Proceso ágil con revisiones incluidas. Sin demoras ni sorpresas.',
  },
  {
    icon: Shield,
    title: 'Garantía de satisfacción',
    desc: 'Trabajamos hasta que estés conforme. Tu marca merece un resultado que te represente.',
  },
  {
    icon: Star,
    title: 'Panel autoadministrable',
    desc: 'Actualiza contenido, imágenes y textos sin depender de un desarrollador.',
  },
];

const STEPS = [
  { n: '1', t: 'Conversión inicial', d: 'Nos cuentas tu proyecto, objetivos y plazo. Sin compromiso.' },
  { n: '2', t: 'Propuesta y presupuesto', d: 'Recibes una propuesta detallada con alcance, tiempos y valor en 24-48h.' },
  { n: '3', t: 'Diseño y aprobación', d: 'Wireframes y diseño visual. Tú apruebas cada etapa antes de seguir.' },
  { n: '4', t: 'Desarrollo y entrega', d: 'Código limpio, optimizado y listo para producción. Soporte post-lanzamiento.' },
];

const FAQS = [
  {
    q: '¿Cuánto cuesta una página web profesional?',
    a: 'El valor depende del alcance: una landing page puede partir desde $800.000 CLP, mientras que un sitio corporativo completo o e-commerce Shopify puede ir desde $2.500.000 CLP. La mejor forma de saber es conversar tu proyecto.',
  },
  {
    q: '¿Incluyen dominio y hosting?',
    a: 'No incluimos dominio ni hosting, pero te asesoramos en la compra y configuración. Recomendamos Cloudflare Pages o Vercel para hosting (gratuito o muy económico) y Namecheap para dominios.',
  },
  {
    q: '¿Puedo editar el sitio yo mismo después?',
    a: 'Sí. Todos nuestros sitios incluyen un panel autoadministrable donde puedes cambiar textos, imágenes, agregar páginas y gestionar contenido sin saber de código.',
  },
  {
    q: '¿Trabajan con clientes fuera de Chile?',
    a: 'Sí, aunque nuestro foco principal es Chile. Tenemos experiencia trabajando de forma remota con clientes en Latinoamérica y España.',
  },
];

export default function AdsLandingPage() {
  const { data } = useSiteData();
  const contentRef = useRef<HTMLDivElement>(null);
  const whatsappNumber = data.config.contactPhone.replace(/[^\d]/g, '');
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=Hola%2C%20vi%20su%20anuncio%20y%20quiero%20cotizar%20un%20proyecto%20de%20dise%C3%B1o%20web`;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!contentRef.current) return;
    const ctx = gsap.context(() => {
      const sections = contentRef.current!.querySelectorAll('.reveal-section');
      sections.forEach((section) => {
        gsap.fromTo(
          section,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
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
  }, []);

  const handleCTAClick = (location: string) => {
    trackCTAClick('Iniciar proyecto', location);
    trackGenerateLead(undefined, 'CLP', `ads_landing_${location}`);
  };

  const handleWhatsAppClick = () => {
    trackContact('whatsapp_ads');
    trackGenerateLead(undefined, 'CLP', 'ads_landing_whatsapp');
  };
  void handleWhatsAppClick; // referenced in JSX onclick

  return (
    <main className="relative min-h-screen overflow-hidden" style={{ background: '#050208' }}>
      <SEO
        title="Diseño Web y Branding en Chile | Cotización Gratuita | EMMAGINATION"
        description="Agencia de diseño web y branding en Chile. Creamos marcas visuales, landing pages, sitios corporativos y e-commerce Shopify. Cotiza gratis hoy."
        keywords="diseño web chile, branding chile, agencia diseño web, identidad visual chile, landing page chile, desarrollo web profesional"
        canonicalPath="/ads/landing"
        image="/images/og-default.jpg"
        type="website"
        schema={[
          {
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'Diseño Web y Branding en Chile | Cotización Gratuita | EMMAGINATION',
            url: 'https://emmagination.cl/ads/landing',
            description: 'Agencia de diseño web y branding en Chile. Creamos marcas visuales, landing pages, sitios corporativos y e-commerce Shopify.',
          },
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: FAQS.map((faq) => ({
              '@type': 'Question',
              name: faq.q,
              acceptedAnswer: { '@type': 'Answer', text: faq.a },
            })),
          },
        ]}
      />

      {/* ===== HERO ===== */}
      <section
        className="relative overflow-hidden"
        style={{
          background: 'radial-gradient(circle at 30% 20%, rgba(124,58,237,0.2) 0%, transparent 50%), linear-gradient(180deg, #08060f 0%, #0d0618 60%, #050208 100%)',
          padding: '120px 0 80px',
        }}
      >
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        <div className="relative mx-auto" style={{ maxWidth: '1200px', padding: '0 4vw' }}>
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#7C3AED]/30 bg-[#7C3AED]/10 mb-8">
            <Zap size={14} className="text-[#A855F7]" />
            <span className="text-[#A855F7] text-xs font-bold uppercase tracking-wider" style={{ fontFamily: 'var(--font-mono)' }}>
              Cotización gratuita
            </span>
          </div>

          <h1
            className="text-white max-w-4xl"
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(36px, 6vw, 68px)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              lineHeight: 1.05,
            }}
          >
            Diseño web que convierte visitantes en{' '}
            <span style={{ color: '#A855F7' }}>clientes reales</span>
          </h1>

          <p
            className="mt-6 max-w-2xl text-white/60"
            style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(16px, 1.6vw, 19px)', lineHeight: 1.7 }}
          >
            Agencia especializada en diseño web y branding en Chile. Creamos marcas visuales
            y sitios profesionales que conectan con tu audiencia. Entrega en 2-4 semanas.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleCTAClick('hero_primary')}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-white text-sm font-semibold transition-all duration-300 hover:shadow-xl hover:shadow-[#7C3AED]/30 hover:scale-[1.02]"
              style={{
                fontFamily: 'var(--font-body)',
                background: 'linear-gradient(135deg, #7C3AED 0%, #9333EA 50%, #EC4899 100%)',
              }}
            >
              <MessageCircle size={18} />
              Cotizar por WhatsApp
              <ArrowRight size={16} />
            </a>
            <a
              href="tel:+56988290618"
              onClick={() => trackContact('phone')}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-white/15 bg-white/5 text-white/80 hover:bg-white/10 transition-all duration-300 text-sm font-medium"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Llamar ahora
            </a>
          </div>

          {/* Trust badges */}
          <div className="mt-10 flex flex-wrap items-center gap-6 text-white/40 text-sm" style={{ fontFamily: 'var(--font-body)' }}>
            <span className="flex items-center gap-2">
              <CheckCircle2 size={14} className="text-[#22c55e]" />
              Respuesta en 24h
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 size={14} className="text-[#22c55e]" />
              Sin compromiso
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 size={14} className="text-[#22c55e]" />
              50+ proyectos entregados
            </span>
          </div>
        </div>
      </section>

      <div ref={contentRef}>
        {/* ===== DIAGNÓSTICO DE MARCA GRATIS ===== */}
        <section className="reveal-section" style={{ padding: '80px 0', borderTop: '1px solid rgba(255,255,255,0.05)', background: 'linear-gradient(180deg, rgba(124,58,237,0.08) 0%, transparent 100%)' }}>
          <div className="mx-auto" style={{ maxWidth: '1200px', padding: '0 4vw' }}>
            <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] items-center">
              {/* Left: Text */}
              <div>
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#A855F7]/30 bg-[#A855F7]/10 text-[#A855F7] text-xs font-bold uppercase tracking-wider mb-6" style={{ fontFamily: 'var(--font-mono)' }}>
                  <Sparkles size={14} />
                  100% Gratis
                </span>
                <h2
                  className="text-white"
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'clamp(28px, 4vw, 44px)',
                    fontWeight: 700,
                    letterSpacing: '-0.02em',
                    lineHeight: 1.1,
                  }}
                >
                  Descubre si tu marca transmite lo que vendes
                </h2>
                <p className="mt-5 text-white/60" style={{ fontFamily: 'var(--font-body)', fontSize: '1.05rem', lineHeight: 1.7 }}>
                  Revisión gratuita de tu identidad visual y presencia digital. Analizamos coherencia de marca, 
                  percepción visual, mensaje y lo que tus competidores están haciendo mejor.
                </p>

                <div className="mt-8 space-y-4">
                  {[
                    { icon: Eye, text: 'Análisis visual completo (logo, colores, tipografía)' },
                    { icon: Target, text: 'Diagnóstico de mensaje y posicionamiento' },
                    { icon: TrendingUp, text: 'Lista priorizada de mejoras para tu marca' },
                  ].map((item) => (
                    <div key={item.text} className="flex items-start gap-3">
                      <item.icon size={20} className="text-[#A855F7] mt-0.5 flex-shrink-0" />
                      <span className="text-white/70 text-sm" style={{ fontFamily: 'var(--font-body)', lineHeight: 1.6 }}>
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>

                <a
                  href={`https://wa.me/${whatsappNumber}?text=Hola%2C%20vi%20su%20anuncio%20y%20quiero%20solicitar%20la%20revisi%C3%B3n%20gratuita%20de%20mi%20marca`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    trackCTAClick('Diagnostico Marca Gratis', 'ads_landing');
                    trackGenerateLead(undefined, 'CLP', 'diagnostico_marca_gratis');
                  }}
                  className="mt-8 inline-flex items-center gap-2 px-8 py-4 rounded-full text-white text-sm font-semibold transition-all duration-300 hover:shadow-xl hover:shadow-[#7C3AED]/20 hover:scale-[1.02]"
                  style={{
                    fontFamily: 'var(--font-body)',
                    background: 'linear-gradient(135deg, #7C3AED 0%, #9333EA 50%, #EC4899 100%)',
                  }}
                >
                  <MessageCircle size={18} />
                  Solicitar revisión gratis
                  <ArrowRight size={16} />
                </a>

                <p className="mt-4 text-white/30 text-xs" style={{ fontFamily: 'var(--font-body)' }}>
                  Sin compromiso. Respuesta en 24-48 horas.
                </p>
              </div>

              {/* Right: Visual card */}
              <div className="relative">
                <div
                  className="rounded-3xl border border-white/10 p-8"
                  style={{
                    background: 'linear-gradient(160deg, rgba(124,58,237,0.15) 0%, rgba(15,23,42,0.4) 100%)',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-[#A855F7]/20 flex items-center justify-center">
                      <Palette size={20} className="text-[#A855F7]" />
                    </div>
                    <div>
                      <div className="text-white font-semibold text-sm" style={{ fontFamily: 'var(--font-heading)' }}>
                        Diagnóstico de Marca
                      </div>
                      <div className="text-white/40 text-xs" style={{ fontFamily: 'var(--font-body)' }}>
                        Reporte visual
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {[
                      { label: 'Identidad visual', status: 'Revisar', color: '#f59e0b' },
                      { label: 'Consistencia de marca', status: 'Revisar', color: '#f59e0b' },
                      { label: 'Mensaje claro', status: 'Revisar', color: '#f59e0b' },
                      { label: 'Presencia digital', status: 'Revisar', color: '#f59e0b' },
                      { label: 'Competencia', status: 'Revisar', color: '#f59e0b' },
                      { label: 'Oportunidades', status: 'Revisar', color: '#f59e0b' },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between py-2 border-b border-white/5">
                        <span className="text-white/60 text-sm" style={{ fontFamily: 'var(--font-body)' }}>
                          {item.label}
                        </span>
                        <span
                          className="text-xs px-2 py-1 rounded-full font-medium"
                          style={{
                            fontFamily: 'var(--font-mono)',
                            background: `${item.color}20`,
                            color: item.color,
                          }}
                        >
                          {item.status}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/10">
                    <div className="flex items-center justify-between">
                      <span className="text-white/40 text-xs" style={{ fontFamily: 'var(--font-body)' }}>
                        Valor estimado
                      </span>
                      <span className="text-white line-through text-sm" style={{ fontFamily: 'var(--font-body)' }}>
                        $150.000 CLP
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-white/40 text-xs" style={{ fontFamily: 'var(--font-body)' }}>
                        Hoy
                      </span>
                      <span className="text-[#A855F7] font-bold text-lg" style={{ fontFamily: 'var(--font-heading)' }}>
                        GRATIS
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== BENEFICIOS ===== */}
        <section className="reveal-section" style={{ padding: '80px 0', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="mx-auto" style={{ maxWidth: '1200px', padding: '0 4vw' }}>
            <div className="text-center mb-14">
              <span className="text-[#A855F7] text-xs font-bold uppercase tracking-wider" style={{ fontFamily: 'var(--font-mono)' }}>
                ¿Por qué elegirnos?
              </span>
              <h2
                className="mt-4 text-white"
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(28px, 4vw, 44px)',
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                }}
              >
                Lo que obtienes con nosotros
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {BENEFITS.map((b) => (
                <div
                  key={b.title}
                  className="rounded-2xl border border-white/8 bg-white/[0.03] p-7 hover:bg-white/[0.06] transition-all duration-300"
                >
                  <b.icon size={24} className="text-[#A855F7] mb-4" />
                  <h3
                    className="text-white text-lg font-semibold"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {b.title}
                  </h3>
                  <p className="mt-3 text-white/50 text-sm leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
                    {b.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== PROCESO ===== */}
        <section className="reveal-section" style={{ padding: '80px 0', background: 'linear-gradient(180deg, rgba(124,58,237,0.05) 0%, transparent 100%)' }}>
          <div className="mx-auto" style={{ maxWidth: '1200px', padding: '0 4vw' }}>
            <div className="text-center mb-14">
              <span className="text-[#A855F7] text-xs font-bold uppercase tracking-wider" style={{ fontFamily: 'var(--font-mono)' }}>
                Cómo trabajamos
              </span>
              <h2
                className="mt-4 text-white"
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(28px, 4vw, 44px)',
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                }}
              >
                De la idea al sitio en 4 pasos
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {STEPS.map((step, i) => (
                <div key={step.n} className="relative">
                  <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-6">
                    <span
                      className="text-[#7C3AED] text-3xl font-bold"
                      style={{ fontFamily: 'var(--font-heading)' }}
                    >
                      {step.n}
                    </span>
                    <h3 className="mt-3 text-white font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>
                      {step.t}
                    </h3>
                    <p className="mt-2 text-white/50 text-sm leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
                      {step.d}
                    </p>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-[1px] bg-white/10" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== SOCIAL PROOF ===== */}
        <section className="reveal-section" style={{ padding: '80px 0', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="mx-auto" style={{ maxWidth: '1200px', padding: '0 4vw' }}>
            <div className="text-center mb-10">
              <h2
                className="text-white"
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(24px, 3vw, 36px)',
                  fontWeight: 700,
                }}
              >
                Resultados que respaldan nuestro trabajo
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-4 text-center">
              {[
                { value: '50+', label: 'Proyectos entregados' },
                { value: '30+', label: 'Clientes satisfechos' },
                { value: '5+', label: 'Años de experiencia' },
                { value: '100%', label: 'Satisfacción' },
              ].map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-white/8 bg-white/[0.03] p-6">
                  <div className="text-[#A855F7] text-3xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
                    {stat.value}
                  </div>
                  <div className="mt-2 text-white/50 text-sm" style={{ fontFamily: 'var(--font-body)' }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== FAQ ===== */}
        <section className="reveal-section" style={{ padding: '80px 0', background: 'linear-gradient(180deg, transparent 0%, rgba(124,58,237,0.03) 100%)' }}>
          <div className="mx-auto" style={{ maxWidth: '800px', padding: '0 4vw' }}>
            <div className="text-center mb-14">
              <span className="text-[#A855F7] text-xs font-bold uppercase tracking-wider" style={{ fontFamily: 'var(--font-mono)' }}>
                Preguntas frecuentes
              </span>
              <h2
                className="mt-4 text-white"
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(24px, 3vw, 36px)',
                  fontWeight: 700,
                }}
              >
                Todo lo que necesitas saber
              </h2>
            </div>

            <div className="space-y-4">
              {FAQS.map((faq) => (
                <div
                  key={faq.q}
                  className="rounded-2xl border border-white/8 bg-white/[0.03] p-6"
                >
                  <h3 className="text-white font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>
                    {faq.q}
                  </h3>
                  <p className="mt-3 text-white/50 text-sm leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== CTA FINAL ===== */}
        <section
          className="reveal-section relative overflow-hidden"
          style={{
            padding: '100px 0 80px',
            background: 'radial-gradient(circle at 50% 50%, rgba(124,58,237,0.15) 0%, transparent 60%), linear-gradient(180deg, #050208 0%, #08060f 100%)',
          }}
        >
          <div className="mx-auto text-center" style={{ maxWidth: '800px', padding: '0 4vw' }}>
            <h2
              className="text-white"
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(32px, 5vw, 52px)',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                lineHeight: 1.1,
              }}
            >
              Tu proyecto web empieza con una conversación
            </h2>
            <p
              className="mt-5 mx-auto max-w-lg text-white/50"
              style={{ fontFamily: 'var(--font-body)', fontSize: '1.05rem', lineHeight: 1.7 }}
            >
              Cuéntanos qué necesitas y te enviamos una propuesta detallada en menos de 24 horas.
              Sin compromiso, sin costo.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleCTAClick('footer_primary')}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-white text-sm font-semibold transition-all duration-300 hover:shadow-xl hover:shadow-[#7C3AED]/30 hover:scale-[1.02]"
                style={{
                  fontFamily: 'var(--font-body)',
                  background: 'linear-gradient(135deg, #7C3AED 0%, #9333EA 50%, #EC4899 100%)',
                }}
              >
                <MessageCircle size={18} />
                Cotizar por WhatsApp
                <ArrowRight size={16} />
              </a>
              <Link
                to="/portafolio"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border border-white/15 bg-white/5 text-white/80 hover:bg-white/10 transition-all duration-300 text-sm font-medium"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                Ver portafolio
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap justify-center items-center gap-4 text-white/30 text-xs" style={{ fontFamily: 'var(--font-body)' }}>
              <span>+56 9 8829 0618</span>
              <span>·</span>
              <span>hola@emmagination.cl</span>
              <span>·</span>
              <span>Santiago, Chile</span>
            </div>
          </div>
        </section>
      </div>

      {/* Footer simple */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '24px 0' }}>
        <div className="mx-auto text-center" style={{ maxWidth: '1200px', padding: '0 4vw' }}>
          <p className="text-white/30 text-xs" style={{ fontFamily: 'var(--font-body)' }}>
            © 2026 EMMAGINATION. Agencia de diseño web y branding en Chile.
          </p>
        </div>
      </footer>
    </main>
  );
}
