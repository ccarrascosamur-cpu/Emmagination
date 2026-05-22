import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import Lenis from '@studio-freight/lenis';
import { ArrowRight } from 'lucide-react';

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
      setScrolled(window.scrollY > 30);
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
      className={`fixed top-0 left-0 w-full h-20 flex items-center justify-between px-6 lg:px-12 transition-all duration-500 ${
        scrolled
          ? 'nav-scrolled'
          : 'bg-transparent'
      }`}
      style={{ zIndex: 100 }}
    >
      {/* Logo: isotipo + EMMAGINATION + tagline */}
      <Link
        to="/"
        onClick={(event) => {
          if (isHome) {
            event.preventDefault();
            handleLogoClick();
          }
        }}
        className="flex items-center gap-2.5"
      >
        <img
          src="/images/isotipo.png"
          alt="EMMAGINATION"
          className="h-9 w-auto object-contain"
        />
        <div className="hidden sm:flex flex-col leading-none">
          <span
            className="text-white text-[17px] font-bold tracking-[0.14em] uppercase"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            EMMAGINATION
          </span>
          <span
            className="text-white/40 text-[8.5px] tracking-[0.22em] uppercase mt-0.5"
            style={{ fontFamily: 'var(--font-mono)', width: '100%', textAlign: 'justify', textAlignLast: 'justify', lineHeight: 1 }}
          >
            Web Design · Branding · Digital
          </span>
        </div>
      </Link>

      {/* Navigation Links — centrados, estilo referencia */}
      <div className="hidden lg:flex items-center gap-7">
        <a
          href="/#approach"
          onClick={(event) => handleSectionLinkClick(event, '#approach')}
          className="nav-link-underline text-white/70 hover:text-white transition-colors text-[13px]"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          Servicios
        </a>
        <Link
          to="/portafolio"
          className="nav-link-underline text-white/70 hover:text-white transition-colors text-[13px]"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          Portafolio
        </Link>
        <a
          href="/#process"
          onClick={(event) => handleSectionLinkClick(event, '#process')}
          className="nav-link-underline text-white/70 hover:text-white transition-colors text-[13px]"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          Proceso
        </a>
        <a
          href="/#cotizar"
          onClick={(event) => handleSectionLinkClick(event, '#cotizar')}
          className="nav-link-underline text-white/70 hover:text-white transition-colors text-[13px]"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          Cotizar
        </a>
        <a
          href="/#contact"
          onClick={(event) => handleSectionLinkClick(event, '#contact')}
          className="nav-link-underline text-white/70 hover:text-white transition-colors text-[13px]"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          Contacto
        </a>
      </div>

      {/* CTA Button — estilo referencia */}
      <a
        href="/#contact"
        onClick={(event) => handleSectionLinkClick(event, '#contact')}
        className="hidden md:inline-flex items-center gap-2 px-5 py-2 rounded-lg text-white text-[13px] font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-[#7C3AED]/25 hover:opacity-90"
        style={{
          fontFamily: 'var(--font-body)',
          background: 'linear-gradient(135deg, #3A3FD4 0%, #C840E8 100%)',
        }}
      >
        Hablemos
        <ArrowRight size={14} />
      </a>
    </nav>
  );
}
