import { useEffect, useRef, useState } from 'react';

interface NavigationProps {
  lenisRef: React.MutableRefObject<any>;
}

export default function Navigation({ lenisRef }: NavigationProps) {
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (target: string) => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(target, { offset: 0, duration: 1.2 });
    }
  };

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 w-full h-20 flex items-center justify-between px-8 lg:px-16 transition-all duration-500 ${
        scrolled
          ? 'bg-black/80 backdrop-blur-md border-b border-white/5'
          : 'bg-transparent'
      }`}
      style={{ zIndex: 100 }}
    >
      {/* Isotipo + Tipografía */}
      <div className="flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, #7C3AED 0%, #9333EA 100%)',
          }}
        >
          <span
            className="text-white text-sm font-bold"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            E
          </span>
        </div>
        <div className="hidden sm:block">
          <span
            className="text-white text-lg font-semibold tracking-tight"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            EMMA<strong>GINATION</strong>
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex items-center gap-8">
        <button
          onClick={() => scrollTo('#work')}
          className="nav-link-underline text-white/80 hover:text-white transition-colors text-sm"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          Proyectos
        </button>
        <button
          onClick={() => scrollTo('#approach')}
          className="nav-link-underline text-white/80 hover:text-white transition-colors text-sm"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          Servicios
        </button>
        <button
          onClick={() => scrollTo('#process')}
          className="nav-link-underline text-white/80 hover:text-white transition-colors text-sm"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          Proceso
        </button>
        <button
          onClick={() => scrollTo('#contact')}
          className="nav-link-underline text-white/80 hover:text-white transition-colors text-sm"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          Contacto
        </button>
      </div>

      {/* CTA Button */}
      <button
        onClick={() => scrollTo('#contact')}
        className="hidden md:inline-flex px-6 py-2.5 rounded-full text-white text-sm font-medium transition-all duration-300 hover:shadow-lg hover:shadow-[#7C3AED]/25"
        style={{
          fontFamily: 'var(--font-body)',
          background: 'linear-gradient(135deg, #7C3AED 0%, #9333EA 50%, #A855F7 100%)',
        }}
      >
        Trabajemos juntos
      </button>
    </nav>
  );
}
