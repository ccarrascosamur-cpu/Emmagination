import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Search, PenTool, Code, Rocket } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    number: '01',
    title: 'Descubrimiento',
    description: 'Analizamos tu marca, audiencia y objetivos para definir una estrategia clara.',
    icon: Search,
  },
  {
    number: '02',
    title: 'Diseño',
    description: 'Creamos wireframes y mockups visuales que capturan la esencia de tu marca.',
    icon: PenTool,
  },
  {
    number: '03',
    title: 'Desarrollo',
    description: 'Convertimos el diseño en código limpio, optimizado y listo para escalar.',
    icon: Code,
  },
  {
    number: '04',
    title: 'Lanzamiento',
    description: 'Deploy, testing y optimización de performance para un lanzamiento perfecto.',
    icon: Rocket,
  },
];

export default function Process() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<(HTMLDivElement | null)[]>([]);
  const lineRef = useRef<HTMLDivElement>(null);

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

      // Timeline line animation
      if (lineRef.current) {
        gsap.fromTo(
          lineRef.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.5,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 70%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // Steps animation
      stepsRef.current.forEach((step, i) => {
        if (!step) return;
        gsap.fromTo(
          step,
          { opacity: 0, y: 60, scale: 0.9 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: 'power3.out',
            delay: 0.3 + i * 0.2,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 65%',
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
      id="process"
      className="relative w-full bg-white"
      style={{ padding: '120px 0' }}
    >
      <div className="mx-auto" style={{ maxWidth: '1440px', padding: '0 4vw' }}>
        {/* Header */}
        <div ref={headerRef} className="text-center mb-20 opacity-0">
          <span className="label-mono text-black/50 block mb-4">
            PROCESO
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
            CÓMO{' '}
            <span style={{ color: '#7C3AED' }}>TRABAJAMOS</span>
          </h2>
          <div
            className="mx-auto mt-6"
            style={{
              height: '2px',
              width: '80px',
              background: 'linear-gradient(90deg, #7C3AED, #CC26D3)',
            }}
          />
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Connection line - desktop only */}
          <div className="hidden lg:block absolute top-[3.5rem] left-[10%] right-[10%] h-[2px] bg-black/5">
            <div
              ref={lineRef}
              className="h-full origin-left"
              style={{
                background: 'linear-gradient(90deg, #7C3AED, #CC26D3)',
              }}
            />
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.number}
                  ref={(el) => { stepsRef.current[index] = el; }}
                  className="relative flex flex-col items-center text-center opacity-0"
                >
                  {/* Number circle */}
                  <div className="relative z-10 mb-8">
                    <div
                      className="w-28 h-28 rounded-full flex items-center justify-center border-4 border-white shadow-xl"
                      style={{
                        background: 'linear-gradient(135deg, #7C3AED, #CC26D3)',
                        boxShadow: '0 8px 32px rgba(124, 58, 237, 0.25)',
                      }}
                    >
                      <span
                        className="text-white text-2xl font-bold"
                        style={{ fontFamily: 'var(--font-heading)' }}
                      >
                        {step.number}
                      </span>
                    </div>
                  </div>

                  {/* Icon */}
                  <div
                    className="w-10 h-10 flex items-center justify-center rounded-lg mb-4"
                    style={{ backgroundColor: '#7C3AED10', color: '#7C3AED' }}
                  >
                    <Icon size={20} strokeWidth={1.5} />
                  </div>

                  {/* Content */}
                  <h3
                    className="text-black text-xl mb-3"
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontWeight: 500,
                    }}
                  >
                    {step.title}
                  </h3>
                  <p
                    className="text-black/50 text-sm max-w-[260px]"
                    style={{
                      fontFamily: 'var(--font-body)',
                      lineHeight: 1.6,
                    }}
                  >
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
