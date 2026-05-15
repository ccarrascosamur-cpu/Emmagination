import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { value: '50+', label: 'Proyectos' },
  { value: '30+', label: 'Clientes' },
  { value: '5+', label: 'Años' },
  { value: '100%', label: 'Satisfacción' },
];

export default function StatsBar() {
  const sectionRef = useRef<HTMLElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      itemsRef.current.forEach((item, i) => {
        if (!item) return;
        gsap.fromTo(
          item,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            delay: i * 0.12,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 85%',
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
      className="relative w-full"
      style={{ backgroundColor: '#050505' }}
    >
      <div
        className="mx-auto border-y border-white/5"
        style={{ maxWidth: '1440px', padding: '40px 4vw' }}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 relative">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              ref={(el) => { itemsRef.current[index] = el; }}
              className="text-center relative opacity-0"
            >
              <div
                className="text-white"
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(28px, 3vw, 42px)',
                  fontWeight: 500,
                  letterSpacing: '-1px',
                }}
              >
                {stat.value}
              </div>
              <div
                className="text-white/40 mt-1"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '1.5px',
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
          {/* Vertical dividers */}
          <div className="hidden md:block absolute left-1/4 top-0 bottom-0 w-[1px] bg-white/5" />
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[1px] bg-white/5" />
          <div className="hidden md:block absolute left-3/4 top-0 bottom-0 w-[1px] bg-white/5" />
        </div>
      </div>
    </section>
  );
}
