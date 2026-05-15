import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import TactileMatrix from '../components/TactileMatrix';

interface HeroProps {
  lenisRef: React.MutableRefObject<any>;
}

export default function Hero({ lenisRef }: HeroProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.3 });

    tl.fromTo(
      titleRef.current,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' }
    )
      .fromTo(
        subtitleRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out' },
        '-=0.6'
      )
      .fromTo(
        ctaRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
        '-=0.4'
      );

    return () => {
      tl.kill();
    };
  }, []);

  const scrollToWork = () => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo('#work', { offset: 0, duration: 1.2 });
    }
  };

  const scrollToContact = () => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo('#contact', { offset: 0, duration: 1.2 });
    }
  };

  return (
    <section
      ref={heroRef}
      className="relative w-full flex items-center justify-center overflow-hidden"
      style={{ height: '100vh', minHeight: '600px' }}
    >
      {/* WebGL Background */}
      <TactileMatrix />

      {/* Content */}
      <div
        className="relative flex flex-col items-center justify-center text-center px-4 sm:px-8"
        style={{ zIndex: 10, maxWidth: '900px' }}
      >
        <h1
          ref={titleRef}
          className="text-white leading-none opacity-0"
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(36px, 8vw, 80px)',
            fontWeight: 500,
            letterSpacing: '-2px',
            lineHeight: 1.05,
          }}
        >
          CREAMOS{' '}
          <span
            style={{
              color: 'transparent',
              WebkitTextStroke: '2px #7C3AED',
            }}
          >
            REALIDADES
          </span>{' '}
          DIGITALES
        </h1>

        <p
          ref={subtitleRef}
          className="text-white/70 mt-8 max-w-xl opacity-0"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(16px, 1.8vw, 20px)',
            lineHeight: 1.6,
            fontWeight: 300,
          }}
        >
          Diseño web, branding y experiencias digitales inmersivas
          para marcas con visión de futuro.
        </p>

        <div ref={ctaRef} className="flex gap-4 mt-10 opacity-0">
          <button
            onClick={scrollToWork}
            className="px-8 py-3 border border-white/30 rounded-full text-white text-sm hover:bg-white hover:text-black transition-all duration-300"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Ver proyectos
          </button>
          <button
            onClick={scrollToContact}
            className="px-8 py-3 bg-[#7C3AED] rounded-full text-white text-sm hover:bg-[#CC26D3] transition-all duration-300"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Trabajemos juntos
          </button>
        </div>
      </div>

      {/* Gradient overlay at bottom */}
      <div
        className="absolute bottom-0 left-0 w-full h-32 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, #000000, transparent)',
          zIndex: 5,
        }}
      />
    </section>
  );
}
