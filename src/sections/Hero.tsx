import { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { Sparkles, ArrowRight, ChevronDown } from 'lucide-react';

interface HeroProps {
  lenisRef: React.MutableRefObject<any>;
}

export default function Hero({ lenisRef }: HeroProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);
  const orb3Ref = useRef<HTMLDivElement>(null);
  const meshRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  // Mouse move handler for interactive gradient
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    mouseRef.current = { x, y };

    // Move orbs based on mouse position
    if (orb1Ref.current) {
      orb1Ref.current.style.transform = `translate(${(x - 0.5) * 80}px, ${(y - 0.5) * 60}px) scale(1.1)`;
    }
    if (orb2Ref.current) {
      orb2Ref.current.style.transform = `translate(${(0.5 - x) * 60}px, ${(y - 0.5) * 80}px) scale(1.05)`;
    }
    if (orb3Ref.current) {
      orb3Ref.current.style.transform = `translate(${(x - 0.5) * 40}px, ${(0.5 - y) * 50}px) scale(1.15)`;
    }

    // Shift mesh gradient position
    if (meshRef.current) {
      meshRef.current.style.background = `
        radial-gradient(ellipse 600px 400px at ${20 + x * 20}% ${30 + y * 20}%, rgba(124,58,237,0.3) 0%, transparent 70%),
        radial-gradient(ellipse 500px 350px at ${80 - x * 15}% ${70 - y * 15}%, rgba(204,38,211,0.2) 0%, transparent 70%),
        radial-gradient(ellipse 400px 300px at ${50 + x * 10}% ${50 + y * 10}%, rgba(147,51,234,0.15) 0%, transparent 70%)
      `;
    }
  }, []);

  useEffect(() => {
    const hero = heroRef.current;
    if (hero) {
      hero.addEventListener('mousemove', handleMouseMove);
    }

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
        taglineRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out' },
        '-=0.6'
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

    // Continuous ambient animation for orbs
    const ambientTl = gsap.timeline({ repeat: -1, yoyo: true });
    ambientTl.to(orb1Ref.current, {
      x: '+=30',
      y: '-=20',
      duration: 5,
      ease: 'sine.inOut',
    }, 0);
    ambientTl.to(orb2Ref.current, {
      x: '-=25',
      y: '+=25',
      duration: 7,
      ease: 'sine.inOut',
    }, 0);
    ambientTl.to(orb3Ref.current, {
      x: '+=20',
      y: '+=30',
      duration: 6,
      ease: 'sine.inOut',
    }, 0);

    return () => {
      tl.kill();
      ambientTl.kill();
      if (hero) {
        hero.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, [handleMouseMove]);

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

      {/* Animated mesh gradient - responds to mouse */}
      <div
        ref={meshRef}
        className="absolute inset-0 opacity-60 transition-all duration-300 ease-out"
        style={{
          background: `
            radial-gradient(ellipse 600px 400px at 20% 30%, rgba(124,58,237,0.25) 0%, transparent 70%),
            radial-gradient(ellipse 500px 350px at 80% 70%, rgba(204,38,211,0.15) 0%, transparent 70%),
            radial-gradient(ellipse 400px 300px at 50% 50%, rgba(147,51,234,0.1) 0%, transparent 70%)
          `,
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

      {/* Floating gradient orbs - respond to mouse */}
      <div
        ref={orb1Ref}
        className="absolute rounded-full transition-transform duration-500 ease-out"
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
        className="absolute rounded-full transition-transform duration-500 ease-out"
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
        className="absolute rounded-full transition-transform duration-500 ease-out"
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

        {/* Tagline: Deja de ser logo. Para ser marca. */}
        <div
          ref={taglineRef}
          className="mt-8 opacity-0"
          style={{ maxWidth: '640px' }}
        >
          <p
            className="text-white leading-tight"
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(28px, 4vw, 48px)',
              fontWeight: 700,
              letterSpacing: '-1.5px',
              lineHeight: 1.1,
            }}
          >
            <span className="text-white">Deja de ser logo.</span>
            <br />
            <span
              style={{
                color: 'rgba(255, 255, 255, 0.35)',
              }}
            >
              Para ser marca.
            </span>
          </p>
        </div>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="text-white/50 mt-6 max-w-lg opacity-0"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(16px, 1.6vw, 18px)',
            lineHeight: 1.7,
            fontWeight: 300,
          }}
        >
          Diseñamos identidades, optimizamos tiendas Shopify y posicionamos
          marcas en Google. Hacemos que tu negocio se vea, se entienda y se compre.
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

      {/* Scroll indicator */}
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
    </section>
  );
}
