import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSiteData } from '../lib/site-data-client';

gsap.registerPlugin(ScrollTrigger);

function parseStatValue(value: string): { num: number; suffix: string } {
  const match = value.match(/^(\d+)(.*)$/);
  return match ? { num: parseInt(match[1]), suffix: match[2] } : { num: 0, suffix: value };
}

export default function StatsBar() {
  const { data } = useSiteData();
  const stats = data.stats;
  const sectionRef = useRef<HTMLElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const valueRefs = useRef<(HTMLDivElement | null)[]>([]);

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

      // Animated counters
      valueRefs.current.forEach((el, i) => {
        if (!el) return;
        const { num, suffix } = parseStatValue(stats[i].value);
        const proxy = { val: 0 };
        gsap.to(proxy, {
          val: num,
          duration: 2.2,
          ease: 'power3.out',
          delay: i * 0.12,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
          onUpdate: () => {
            if (el) el.textContent = Math.round(proxy.val) + suffix;
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [stats]);

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
              key={`stat-${index}`}
              ref={(el) => { itemsRef.current[index] = el; }}
              className="text-center relative opacity-0"
            >
              <div
                ref={(el) => { valueRefs.current[index] = el; }}
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
