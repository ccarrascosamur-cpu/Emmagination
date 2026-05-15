import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Monitor, Palette, Code2, Play, Camera } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    icon: Monitor,
    title: 'Diseño Web Profesional',
    description:
      'Sitios web minimalistos y de alto rendimiento que priorizan la experiencia de usuario y la conversión. Cada píxel tiene un propósito.',
    tags: ['UI/UX', 'Responsive', 'Motion'],
  },
  {
    icon: Palette,
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
    icon: Play,
    title: 'Motion & Animación',
    description:
      'Animaciones cinematográficas con scroll y micro-interacciones que dan vida a las interfaces y cautivan a los usuarios.',
    tags: ['GSAP', 'Scroll', 'Micro-interactions'],
  },
  {
    icon: Camera,
    title: 'Generación de Contenido',
    description:
      'Producción de fotografía y video profesional con Film Maker. Contenido visual de alto impacto para redes sociales, web y campañas publicitarias.',
    tags: ['Fotografía', 'Video', 'Film Maker'],
  },
];

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
        backgroundColor: '#F8F7FB',
        padding: '120px 0',
      }}
    >
      <div className="mx-auto" style={{ maxWidth: '1440px', padding: '0 4vw' }}>
        {/* Section Header */}
        <div ref={headerRef} className="text-center mb-20 opacity-0">
          <span
            className="block mb-4"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              fontWeight: 500,
              letterSpacing: '1px',
              color: '#7C3AED',
            }}
          >
            SERVICIOS
          </span>
          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(32px, 4vw, 48px)',
              fontWeight: 700,
              letterSpacing: '-1px',
              lineHeight: 1.15,
              color: '#1a1a2e',
            }}
          >
            Diseño,{' '}
            <span style={{ color: '#7C3AED' }}>Branding</span>,{' '}
            <span style={{ color: '#7C3AED' }}>Code</span> y{' '}
            <span style={{ color: '#CC26D3' }}>Motion</span>
          </h2>
          <p
            className="mt-4 max-w-2xl mx-auto"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '1rem',
              lineHeight: 1.6,
              color: '#6b7280',
            }}
          >
            Enfoque estratégico que combina design thinking con excelencia técnica.
            Transformamos problemas complejos en soluciones digitales elegantes.
          </p>
        </div>

        {/* Services Grid - 5 columns on large screens */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={service.title}
                ref={(el) => { cardsRef.current[index] = el; }}
                className="group relative p-6 bg-white rounded-2xl border border-gray-100 hover:border-[#7C3AED]/20 hover:shadow-xl hover:shadow-[#7C3AED]/5 transition-all duration-500 opacity-0"
              >
                {/* Top accent line */}
                <div
                  className="absolute top-0 left-6 right-6 h-[2px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: 'linear-gradient(90deg, #7C3AED, #CC26D3)',
                  }}
                />

                {/* Icon */}
                <div
                  className="w-10 h-10 flex items-center justify-center rounded-xl mb-5 transition-all duration-300"
                  style={{
                    background: 'linear-gradient(135deg, #7C3AED15, #CC26D315)',
                    color: '#7C3AED',
                  }}
                >
                  <Icon size={20} strokeWidth={1.5} />
                </div>

                {/* Title */}
                <h3
                  className="text-[#1a1a2e] text-base mb-3"
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 600,
                  }}
                >
                  {service.title}
                </h3>

                {/* Description */}
                <p
                  className="text-gray-500 text-sm mb-5"
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
                      className="px-2.5 py-1 rounded-md text-xs"
                      style={{
                        fontFamily: 'var(--font-mono)',
                        background: 'rgba(124, 58, 237, 0.06)',
                        color: '#7C3AED',
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
