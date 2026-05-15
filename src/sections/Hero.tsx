import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Sparkles, ArrowRight, ChevronDown } from 'lucide-react';

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
  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);
  const orb3Ref = useRef<HTMLDivElement>(null);

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

    // Animate orbs with GSAP for smoother, continuous movement
    const orbTl = gsap.timeline({ repeat: -1, yoyo: true });
    orbTl.to(orb1Ref.current, {
      x: 60,
      y: -40,
      scale: 1.15,
      duration: 6,
      ease: 'sine.inOut',
    }, 0);
    orbTl.to(orb2Ref.current, {
      x: -50,
      y: 30,
      scale: 1.1,
      duration: 8,
      ease: 'sine.inOut',
    }, 0);
    orbTl.to(orb3Ref.current, {
      x: 40,
      y: 50,
      scale: 1.2,
      duration: 7,
      ease: 'sine.inOut',
    }, 0);

    return () => {
      tl.kill();
      orbTl.kill();
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
      }}
    >
      {/* Animated gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 30% 40%, #1a0f2e 0%, #0d0618 30%, #000000 70%)',
        }}
      />

      {/* Animated mesh gradient */}
      <div
        className="absolute inset-0 opacity-60"
        style={{
          background: `
            radial-gradient(ellipse 600px 400px at 20% 30%, rgba(124,58,237,0.25) 0%, transparent 70%),
            radial-gradient(ellipse 500px 350px at 80% 70%, rgba(204,38,211,0.15) 0%, transparent 70%),
            radial-gradient(ellipse 400px 300px at 50% 50%, rgba(147,51,234,0.1) 0%, transparent 70%)
          `,
          animation: 'meshMove 15s ease-in-out infinite',
        }}
      />

      {/* Subtle grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(124,58,237,0.3) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(124,58,237,0.3) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Floating gradient orbs - animated with GSAP */}
      <div
        ref={orb1Ref}
        className="absolute rounded-full"
        style={{
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(124,58,237,0.4) 0%, transparent 70%)',
          filter: 'blur(100px)',
          top: '5%',
          left: '15%',
        }}
      />
      <div
        ref={orb2Ref}
        className="absolute rounded-full"
        style={{
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(204,38,211,0.3) 0%, transparent 70%)',
          filter: 'blur(80px)',
          bottom: '15%',
          right: '10%',
        }}
      />
      <div
        ref={orb3Ref}
        className="absolute rounded-full"
        style={{
          width: '350px',
          height: '350px',
          background: 'radial-gradient(circle, rgba(147,51,234,0.25) 0%, transparent 70%)',
          filter: 'blur(90px)',
          top: '40%',
          right: '30%',
        }}
      />

      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '128px 128px',
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
      </div>

      {/* Scroll indicator - positioned at very bottom, outside content flow */}
      <div
        ref={scrollRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-0"
        style={{ zIndex: 10 }}
      >
        <ChevronDown size={20} className="text-white/30 animate-bounce" />
      </div>

      {/* Bottom gradient fade */}
      <div
        className="absolute bottom-0 left-0 w-full h-40 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, #000000, transparent)',
          zIndex: 5,
        }}
      />

      <style>{`
        @keyframes meshMove {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(30px, -20px) scale(1.05);
          }
          50% {
            transform: translate(-20px, 30px) scale(0.95);
          }
          75% {
            transform: translate(20px, 20px) scale(1.02);
          }
        }
      `}</style>
    </section>
  );
}
