import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Quote } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function Testimonial() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #1a1030 0%, #1a1a2e 50%, #0a0a1a 100%)',
        padding: '120px 0',
      }}
    >
      {/* Background glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-20"
          style={{ background: '#7C3AED', filter: 'blur(120px)' }}
        />
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full opacity-10"
          style={{ background: '#CC26D3', filter: 'blur(120px)' }}
        />
      </div>

      <div
        ref={contentRef}
        className="relative mx-auto text-center opacity-0"
        style={{ maxWidth: '900px', padding: '0 4vw' }}
      >
        {/* Quote icon */}
        <div
          className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-10"
          style={{ backgroundColor: '#7C3AED15' }}
        >
          <Quote className="w-8 h-8" style={{ color: '#7C3AED' }} />
        </div>

        {/* Quote text */}
        <blockquote className="mb-10">
          <p
            className="text-white/90 font-light italic leading-relaxed"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(20px, 2.5vw, 30px)',
              lineHeight: 1.5,
            }}
          >
            "Transformaron nuestra visión en una experiencia digital que superó todas nuestras expectativas. El equipo de EMMAGINATION entiende perfectamente cómo convertir ideas en realidades digitales impactantes."
          </p>
        </blockquote>

        {/* Author */}
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg"
            style={{
              background: 'linear-gradient(135deg, #7C3AED, #CC26D3)',
              fontFamily: 'var(--font-heading)',
            }}
          >
            PZ
          </div>
          <div>
            <div
              className="text-white font-semibold"
              style={{ fontFamily: 'var(--font-body)', fontSize: '1.1rem' }}
            >
              Paula Zamora
            </div>
            <div
              className="text-white/50 text-sm"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Fundadora, PortalZen
            </div>
          </div>
        </div>

        {/* Dots indicator */}
        <div className="flex items-center justify-center gap-2 mt-10">
          <div
            className="w-6 h-2 rounded-full"
            style={{ backgroundColor: '#7C3AED' }}
          />
          <div className="w-2 h-2 rounded-full bg-white/20" />
          <div className="w-2 h-2 rounded-full bg-white/20" />
        </div>
      </div>
    </section>
  );
}
