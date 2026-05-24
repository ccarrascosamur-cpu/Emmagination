import { useEffect, useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useSiteData } from '../lib/site-data-client';
import { trackCTAClick, trackGenerateLead } from '../lib/ga4';

interface HeroProps {
  lenisRef: React.MutableRefObject<any>;
}

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export default function Hero({ lenisRef }: HeroProps) {
  const { data } = useSiteData();
  const hero = data.hero;
  const heroRef = useRef<HTMLDivElement>(null);
  const spotRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);
  const orb3Ref = useRef<HTMLDivElement>(null);
  const meshRef = useRef<HTMLDivElement>(null);


  // Spotlight + paralaje con GSAP quickTo
  useEffect(() => {
    const hero = heroRef.current;
    const spot = spotRef.current;
    const content = contentRef.current;
    const grid = gridRef.current;
    if (!hero || !spot || !content || !grid) return;

    // GSAP quickTo para interpolación suave
    const moveContent = {
      x: gsap.quickTo(content, 'x', { duration: 0.6, ease: 'power2.out' }),
      y: gsap.quickTo(content, 'y', { duration: 0.6, ease: 'power2.out' }),
    };
    const moveGrid = {
      x: gsap.quickTo(grid, 'x', { duration: 0.9, ease: 'power2.out' }),
      y: gsap.quickTo(grid, 'y', { duration: 0.9, ease: 'power2.out' }),
    };

    const onMove = (e: MouseEvent) => {
      const rect = hero.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;
      const normX = (cx / rect.width - 0.5) * 2; // -1 a 1
      const normY = (cy / rect.height - 0.5) * 2; // -1 a 1

      // Spotlight sigue el cursor directo (sin GSAP para máxima precisión)
      spot.style.transform = `translate(${cx - 300}px, ${cy - 300}px)`;

      // Contenido se mueve en dirección opuesta (paralaje)
      moveContent.x(normX * -18);
      moveContent.y(normY * -12);

      // Grilla se mueve en la misma dirección, más lenta
      moveGrid.x(normX * 8);
      moveGrid.y(normY * 5);

      // Orbs también responden al mouse
      if (orb1Ref.current) {
        orb1Ref.current.style.transform = `translate(${(normX * 0.5) * 80}px, ${(normY * 0.5) * 60}px) scale(1.1)`;
      }
      if (orb2Ref.current) {
        orb2Ref.current.style.transform = `translate(${(0.5 - normX * 0.5) * 60}px, ${(normY * 0.5) * 80}px) scale(1.05)`;
      }
      if (orb3Ref.current) {
        orb3Ref.current.style.transform = `translate(${(normX * 0.5) * 40}px, ${(0.5 - normY * 0.5) * 50}px) scale(1.15)`;
      }

      // Shift mesh gradient position
      if (meshRef.current) {
        meshRef.current.style.background = `
          radial-gradient(ellipse 600px 400px at ${20 + normX * 0.5 * 20}% ${30 + normY * 0.5 * 20}%, rgba(124,58,237,0.3) 0%, transparent 70%),
          radial-gradient(ellipse 500px 350px at ${80 - normX * 0.5 * 15}% ${70 - normY * 0.5 * 15}%, rgba(204,38,211,0.2) 0%, transparent 70%),
          radial-gradient(ellipse 400px 300px at ${50 + normX * 0.5 * 10}% ${50 + normY * 0.5 * 10}%, rgba(147,51,234,0.15) 0%, transparent 70%)
        `;
      }
    };

    const onLeave = () => {
      moveContent.x(0);
      moveContent.y(0);
      moveGrid.x(0);
      moveGrid.y(0);
      gsap.to(spot, { opacity: 0, duration: 0.5 });
    };

    const onEnter = () => {
      gsap.to(spot, { opacity: 1, duration: 0.4 });
    };

    hero.addEventListener('mousemove', onMove);
    hero.addEventListener('mouseleave', onLeave);
    hero.addEventListener('mouseenter', onEnter);

    return () => {
      hero.removeEventListener('mousemove', onMove);
      hero.removeEventListener('mouseleave', onLeave);
      hero.removeEventListener('mouseenter', onEnter);
    };
  }, []);

  // GSAP entrance animations
  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set([badgeRef.current, subtitleRef.current, ctaRef.current], {
        opacity: 0,
        y: 18,
      });

      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
      });

      tl.to(badgeRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.45,
      })
        .to(
          subtitleRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
          },
          '-=0.12'
        )
        .to(
          ctaRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.45,
          },
          '-=0.22'
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
      };
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const scrollToContact = () => {
    trackCTAClick('Iniciar proyecto', 'hero');
    trackGenerateLead(undefined, 'CLP', 'hero_cta_primary');
    if (lenisRef.current) {
      lenisRef.current.scrollTo('#contact', { offset: 0, duration: 1.2 });
    }
  };

  const scrollToWorkTracked = () => {
    trackCTAClick('Cotizar gratis', 'hero');
    if (lenisRef.current) {
      lenisRef.current.scrollTo('#work', { offset: 0, duration: 1.2 });
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

      {/* Spotlight / lupa que sigue el cursor */}
      <div
        ref={spotRef}
        className="absolute pointer-events-none"
        style={{
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(168,85,247,0.18) 0%, rgba(58,63,212,0.08) 35%, transparent 70%)',
          opacity: 0,
          willChange: 'transform',
          top: 0,
          left: 0,
          mixBlendMode: 'screen',
          zIndex: 1,
        }}
      />

      {/* Grilla sutil con paralaje */}
      <div
        ref={gridRef}
        className="absolute pointer-events-none"
        style={{
          inset: -20,
          opacity: 0.028,
          backgroundImage: `linear-gradient(rgba(168,85,247,1) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,1) 1px, transparent 1px)`,
          backgroundSize: '68px 68px',
          willChange: 'transform',
          zIndex: 0,
        }}
      />

      {/* Floating gradient orbs */}
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

      {/* Content — CENTRADO con paralaje */}
      <div
        ref={contentRef}
        className="relative flex flex-col items-center justify-center text-center px-4 sm:px-8"
        style={{ zIndex: 2, maxWidth: '1000px', willChange: 'transform' }}
      >
        {/* Badge estilo referencia */}
        <div
          ref={badgeRef}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border mb-8 opacity-0"
          style={{
            background: 'rgba(124, 58, 237, 0.08)',
            borderColor: 'rgba(168, 85, 247, 0.25)',
          }}
        >
          <Sparkles size={14} className="text-[#A855F7]" />
          <span
            className="text-[#A855F7] text-xs font-bold uppercase tracking-[0.2em]"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            {hero.badge}
          </span>
        </div>

        {/* Title con estilo de referencia — H1 con texto visible para SEO */}
        <h1
          ref={titleRef}
          className="hero-title text-white uppercase"
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(36px, 7.5vw, 80px)',
            fontWeight: 900,
            letterSpacing: '-2px',
            lineHeight: 0.95,
          }}
          aria-label={`${hero.titleLine1} ${hero.titleLine2} ${hero.titleLine3}`}
        >
          <span className="hero-line block" style={{ overflow: 'hidden', paddingBottom: '0.06em' }}>
            <span className="line-inner block" style={{ transition: 'transform 0.3s ease, text-shadow 0.3s ease, color 0.3s ease' }}>
              {hero.titleLine1}
            </span>
          </span>
          <span className="hero-line block" style={{ overflow: 'hidden', paddingBottom: '0.06em' }}>
            <span
              className="line-inner block hero-stroke-text"
              style={{
                transition: 'transform 0.3s ease, text-shadow 0.3s ease, color 0.3s ease, -webkit-text-stroke 0.3s ease',
              }}
            >
              {hero.titleLine2}
            </span>
          </span>
          <span className="hero-line block" style={{ overflow: 'hidden', paddingBottom: '0.06em' }}>
            <span
              className="line-inner block"
              style={{
                transition: 'transform 0.3s ease, text-shadow 0.3s ease, color 0.3s ease',
              }}
            >
              {hero.titleLine3}
            </span>
          </span>
        </h1>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="mt-8 max-w-xl opacity-0"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(15px, 1.5vw, 17px)',
            lineHeight: 1.75,
            fontWeight: 300,
            color: '#9E9CC8',
          }}
        >
          {hero.subtitle}
        </p>

        {/* CTAs */}
        <div ref={ctaRef} className="flex flex-wrap items-center justify-center gap-4 mt-10 opacity-0">
          <button
            onClick={scrollToContact}
            className="px-8 py-3.5 rounded-full text-white text-sm font-medium transition-all duration-300 hover:shadow-lg hover:shadow-[#7C3AED]/25"
            style={{
              fontFamily: 'var(--font-body)',
              background: 'linear-gradient(135deg, #7C3AED 0%, #9333EA 50%, #A855F7 100%)',
            }}
          >
            {hero.ctaPrimary}
          </button>
          <button
            onClick={scrollToWorkTracked}
            className="group inline-flex items-center gap-2 px-8 py-3.5 border rounded-full text-white text-sm hover:bg-white/10 transition-all duration-300"
            style={{
              fontFamily: 'var(--font-body)',
              borderColor: 'rgba(168, 85, 247, 0.3)',
            }}
          >
            {hero.ctaSecondary}
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
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
