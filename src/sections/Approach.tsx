import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Palette, Code2, Box, Zap } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    icon: Palette,
    title: 'Diseño Web Profesional',
    description:
      'Sitios web minimalistos y de alto rendimiento que priorizan la experiencia de usuario y la conversión. Cada píxel tiene un propósito.',
    tags: ['UI/UX', 'Responsive', 'Motion'],
  },
  {
    icon: Box,
    title: 'Branding e Identidad Visual',
    description:
      'Identidades visuales que destacan en el mercado y construyen presencia duradera. Desde el logo hasta sistemas de marca completos.',
    tags: ['Logo', 'Estrategia', 'Guidelines'],
  },
  {
    icon: Code2,
    title: 'Desarrollo & Shopify',
    description:
      'Código limpio y escalable. React, WebGL e integración de CMS headless. Temas Shopify personalizados que convierten.',
    tags: ['React', 'Shopify', 'WebGL'],
  },
  {
    icon: Zap,
    title: 'Motion & Animación',
    description:
      'Animaciones cinematográficas con scroll y micro-interacciones que dan vida a las interfaces y cautivan a los usuarios.',
    tags: ['GSAP', 'Scroll', 'Micro-interactions'],
  },
];

// Component for the illusion text effect
function IllusionText({ word }: { word: string }) {
  const letters = word.split('');

  return (
    <span className="illusion-word" style={{ '--t': letters.length } as React.CSSProperties}>
      {letters.map((letter, i) => (
        <span
          key={i}
          className={`illusion-letter ${i > 0 ? `l-${i + 1}` : ''}`}
        >
          {letter}
        </span>
      ))}
    </span>
  );
}

export default function Approach() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header animation
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );

      // Service cards animation
      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        gsap.fromTo(
          card,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            delay: i * 0.1,
            scrollTrigger: {
              trigger: card,
              start: 'top 88%',
              toggleActions: 'play none none none',
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="approach"
      className="relative w-full"
      style={{
        backgroundColor: '#f2efe6',
        padding: '120px 0',
      }}
    >
      <div className="mx-auto" style={{ maxWidth: '1440px', padding: '0 4vw' }}>
        {/* Section Header */}
        <div ref={headerRef} className="mb-20 opacity-0">
          <span className="label-mono text-black/50 block mb-4">
            NUESTROS SERVICIOS
          </span>
          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(36px, 5vw, 64px)',
              fontWeight: 500,
              letterSpacing: '-1.5px',
              lineHeight: 1.05,
              color: '#000000',
            }}
          >
            Diseño,{' '}
            <span style={{ color: '#7C3AED' }}>Branding</span>,{' '}
            <IllusionText word="CODE" /> y{' '}
            <span style={{ color: '#CC26D3' }}>Motion</span>
          </h2>
          <p
            className="mt-6 max-w-2xl text-black/60"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '1.125rem',
              lineHeight: 1.6,
            }}
          >
            Enfoque estratégico que combina design thinking con excelencia
            técnica. Transformamos problemas complejos en soluciones digitales
            elegantes que generan resultados.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={service.title}
                ref={(el) => { cardsRef.current[index] = el; }}
                className="group relative p-8 bg-white/60 backdrop-blur-sm border border-black/5 hover:border-[#7C3AED]/30 hover:bg-white transition-all duration-500 opacity-0"
              >
                {/* Icon */}
                <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-[#7C3AED]/10 text-[#7C3AED] mb-6 group-hover:bg-[#7C3AED] group-hover:text-white transition-all duration-300">
                  <Icon size={24} strokeWidth={1.5} />
                </div>

                {/* Title */}
                <h3
                  className="text-black text-xl mb-3"
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 500,
                  }}
                >
                  {service.title}
                </h3>

                {/* Description */}
                <p
                  className="text-black/50 text-sm mb-6"
                  style={{
                    fontFamily: 'var(--font-body)',
                    lineHeight: 1.6,
                  }}
                >
                  {service.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {service.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-black/5 text-black/50 rounded-full text-xs"
                      style={{ fontFamily: 'var(--font-mono)' }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Hover accent line */}
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#382B8F] via-[#7C3AED] to-[#CC26D3] transform scaleX-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </div>
            );
          })}
        </div>

        {/* Bottom stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 pt-16 border-t border-black/10">
          {[
            { number: '50+', label: 'Proyectos' },
            { number: '30+', label: 'Clientes' },
            { number: '5+', label: 'Años' },
            { number: '100%', label: 'Satisfacción' },
          ].map((stat) => (
            <div key={stat.label} className="text-center md:text-left">
              <div
                className="text-black"
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(28px, 3vw, 40px)',
                  fontWeight: 500,
                  letterSpacing: '-1px',
                }}
              >
                {stat.number}
              </div>
              <div
                className="text-black/50 mt-1"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
