import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Sparkles, ArrowRight } from 'lucide-react';

interface HeroProps {
  lenisRef: React.MutableRefObject<any>;
}

export default function Hero({ lenisRef }: HeroProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.3 });

    tl.fromTo(
      badgeRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
    )
      .fromTo(
        titleRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' },
        '-=0.4'
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
      )
      .fromTo(
        scrollRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.8, ease: 'power2.out' },
        '-=0.2'
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
      style={{
        height: '100vh',
        minHeight: '600px',
        background: 'radial-gradient(ellipse at center, #1a0f2e 0%, #0a0612 50%, #000000 100%)',
      }}
    >
      {/* Subtle grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(124,58,237,0.3) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(124,58,237,0.3) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Floating gradient orbs */}
      <div
        className="absolute rounded-full blur-[120px] opacity-30"
        style={{
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, #7C3AED 0%, transparent 70%)',
          top: '10%',
          left: '20%',
          animation: 'float 8s ease-in-out infinite',
        }}
      />
      <div
        className="absolute rounded-full blur-[100px] opacity-20"
        style={{
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, #CC26D3 0%, transparent 70%)',
          bottom: '20%',
          right: '15%',
          animation: 'float 10s ease-in-out infinite reverse',
        }}
      />

      {/* Content */}
      <div
        className="relative flex flex-col items-center justify-center text-center px-4 sm:px-8"
        style={{ zIndex: 10, maxWidth: '900px' }}
      >
        {/* Badge */}
        <div
          ref={badgeRef}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-8 opacity-0"
        >
          <Sparkles size={14} className="text-[#CC26D3]" />
          <span
            className="text-white/70 text-sm"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Diseño web, branding y experiencias digitales
          </span>
        </div>

        {/* Title */}
        <h1
          ref={titleRef}
          className="text-white leading-none opacity-0"
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(48px, 10vw, 96px)',
            fontWeight: 700,
            letterSpacing: '-3px',
            lineHeight: 1.0,
          }}
        >
          CREAMOS
          <br />
          <span
            style={{
              background: 'linear-gradient(135deg, #A78BFA 0%, #C084FC 50%, #E879F9 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            REALIDADES
          </span>
          <br />
          DIGITALES
        </h1>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="text-white/50 mt-8 max-w-lg opacity-0"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(16px, 1.6vw, 18px)',
            lineHeight: 1.7,
            fontWeight: 300,
          }}
        >
          Diseño web, branding y experiencias digitales inmersivas
          para marcas con visión de futuro.
        </p>

        {/* CTAs */}
        <div ref={ctaRef} className="flex flex-wrap items-center justify-center gap-4 mt-10 opacity-0">
          <button
            onClick={scrollToWork}
            className="group inline-flex items-center gap-2 px-8 py-3.5 border border-white/20 rounded-full text-white text-sm hover:bg-white/10 transition-all duration-300"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Ver proyectos
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={scrollToContact}
            className="px-8 py-3.5 rounded-full text-white text-sm font-medium transition-all duration-300 hover:shadow-lg hover:shadow-[#7C3AED]/25"
            style={{
              fontFamily: 'var(--font-body)',
              background: 'linear-gradient(135deg, #7C3AED 0%, #9333EA 50%, #A855F7 100%)',
            }}
          >
            Trabajemos juntos
          </button>
        </div>

        {/* Scroll indicator */}
        <div
          ref={scrollRef}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-0"
        >
          <span
            className="text-white/30 text-xs tracking-[3px] uppercase"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            Scroll
          </span>
          <div className="w-[1px] h-8 bg-gradient-to-b from-white/30 to-transparent" />
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div
        className="absolute bottom-0 left-0 w-full h-32 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, #000000, transparent)',
          zIndex: 5,
        }}
      />

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-20px) scale(1.05); }
        }
      `}</style>
    </section>
  );
}
