import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import Lenis from '@studio-freight/lenis';

interface NavigationProps {
  lenisRef: React.MutableRefObject<Lenis | null>;
}

export default function Navigation({ lenisRef }: NavigationProps) {
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';

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

  const handleSectionLinkClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    target: string,
  ) => {
    if (!isHome) return;
    event.preventDefault();
    scrollTo(target);
  };

  const handleLogoClick = () => {
    if (isHome) {
      scrollTo('#');
    } else {
      navigate('/');
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
      <Link
        to="/"
        onClick={(event) => {
          if (isHome) {
            event.preventDefault();
            handleLogoClick();
          }
        }}
        className="flex items-center gap-3"
      >
        <img
          src="/images/isotipo.png"
          alt="EMMAGINATION"
          className="h-10 w-auto object-contain"
        />
        <div className="hidden sm:block">
          <span
            className="text-white text-lg font-semibold tracking-tight"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            EMMA<strong>GINATION</strong>
          </span>
        </div>
      </Link>

      {/* Navigation Links */}
      <div className="flex items-center gap-8">
        <Link
          to="/servicios/seo"
          className="nav-link-underline text-white/80 hover:text-white transition-colors text-sm hidden lg:inline-block"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          SEO
        </Link>
        <Link
          to="/portafolio"
          className="nav-link-underline text-white/80 hover:text-white transition-colors text-sm"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          Portafolio
        </Link>
        <a
          href="/#approach"
          onClick={(event) => handleSectionLinkClick(event, '#approach')}
          className="nav-link-underline text-white/80 hover:text-white transition-colors text-sm"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          Servicios
        </a>
        <a
          href="/#process"
          onClick={(event) => handleSectionLinkClick(event, '#process')}
          className="nav-link-underline text-white/80 hover:text-white transition-colors text-sm"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          Proceso
        </a>
        <a
          href="/#contact"
          onClick={(event) => handleSectionLinkClick(event, '#contact')}
          className="nav-link-underline text-white/80 hover:text-white transition-colors text-sm"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          Contacto
        </a>
      </div>

      {/* CTA Button */}
      <a
        href="/#contact"
        onClick={(event) => handleSectionLinkClick(event, '#contact')}
        className="hidden md:inline-flex px-6 py-2.5 rounded-full text-white text-sm font-medium transition-all duration-300 hover:shadow-lg hover:shadow-[#7C3AED]/25"
        style={{
          fontFamily: 'var(--font-body)',
          background: 'linear-gradient(135deg, #7C3AED 0%, #9333EA 50%, #A855F7 100%)',
        }}
      >
        Trabajemos juntos
      </a>
    </nav>
  );
}
