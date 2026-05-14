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
      {/* Isotipo */}
      <div className="flex items-center">
        <img
          src="/images/isotipo.png"
          alt="EMMAGINATION"
          className="h-10 w-auto object-contain"
        />
      </div>

      {/* Navigation Links */}
      <div className="flex items-center gap-8">
        <button
          onClick={() => scrollTo('#work')}
          className="nav-link-underline text-white/90 hover:text-white transition-colors text-sm"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          Proyectos
        </button>
        <button
          onClick={() => scrollTo('#approach')}
          className="nav-link-underline text-white/90 hover:text-white transition-colors text-sm"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          Servicios
        </button>
        <button
          onClick={() => scrollTo('#contact')}
          className="nav-link-underline text-white/90 hover:text-white transition-colors text-sm"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          Contacto
        </button>
      </div>
    </nav>
  );
}
