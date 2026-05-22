import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import Lenis from '@studio-freight/lenis';
import { ArrowRight, Menu, X } from 'lucide-react';

interface NavigationProps {
  lenisRef: React.MutableRefObject<Lenis | null>;
}

export default function Navigation({ lenisRef }: NavigationProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
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

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

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
    setMenuOpen(false);
  };

  const handleLogoClick = () => {
    if (isHome) {
      scrollTo('#');
    } else {
      navigate('/');
    }
    setMenuOpen(false);
  };

  const navLinks = [
    { label: 'Servicios', href: '/#approach', target: '#approach' },
    { label: 'Portafolio', href: '/portafolio', target: null, isPage: true },
    { label: 'Proceso', href: '/#process', target: '#process' },
    { label: 'Cotizar', href: '/#cotizar', target: '#cotizar' },
    { label: 'Contacto', href: '/#contact', target: '#contact' },
  ];

  return (
    <>
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
          {/* Texto del logo visible solo en mobile */}
          <span
            className="sm:hidden text-white text-[15px] font-bold tracking-[0.12em] uppercase"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            EMMAGINATION
          </span>
        </Link>

        {/* Navigation Links — desktop with hover glow effect */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) =>
            link.isPage ? (
              <Link
                key={link.label}
                to={link.href}
                className="nav-link-glow relative px-4 py-2 text-white/70 text-[13px] transition-colors duration-300 hover:text-white"
                style={{ fontFamily: 'var(--font-body)' }}
                onMouseEnter={() => setHoveredLink(link.label)}
                onMouseLeave={() => setHoveredLink(null)}
              >
                <span className="relative z-10">{link.label}</span>
                {hoveredLink === link.label && (
                  <span
                    className="absolute inset-0 rounded-lg transition-all duration-300"
                    style={{
                      background: 'rgba(168, 85, 247, 0.12)',
                      border: '1px solid rgba(168, 85, 247, 0.25)',
                      boxShadow: '0 0 20px rgba(168, 85, 247, 0.15)',
                    }}
                  />
                )}
              </Link>
            ) : (
              <a
                key={link.label}
                href={link.href}
                onClick={(event) =>
                  link.target
                    ? handleSectionLinkClick(event, link.target)
                    : undefined
                }
                className="nav-link-glow relative px-4 py-2 text-white/70 text-[13px] transition-colors duration-300 hover:text-white"
                style={{ fontFamily: 'var(--font-body)' }}
                onMouseEnter={() => setHoveredLink(link.label)}
                onMouseLeave={() => setHoveredLink(null)}
              >
                <span className="relative z-10">{link.label}</span>
                {hoveredLink === link.label && (
                  <span
                    className="absolute inset-0 rounded-lg transition-all duration-300"
                    style={{
                      background: 'rgba(168, 85, 247, 0.12)',
                      border: '1px solid rgba(168, 85, 247, 0.25)',
                      boxShadow: '0 0 20px rgba(168, 85, 247, 0.15)',
                    }}
                  />
                )}
              </a>
            ),
          )}
        </div>

        {/* CTA Button — desktop */}
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

        {/* Botón menú hamburguesa — mobile */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg border border-white/20 bg-white/5 backdrop-blur-sm"
          aria-label="Abrir menú"
        >
          {menuOpen ? (
            <X size={20} className="text-white" />
          ) : (
            <Menu size={20} className="text-white" />
          )}
        </button>
      </nav>

      {/* Menú mobile fullscreen */}
      <div
        className={`fixed inset-0 bg-[#0a0a0f]/95 backdrop-blur-xl transition-all duration-300 lg:hidden ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        style={{ zIndex: 99 }}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8 px-6">
          {navLinks.map((link) =>
            link.isPage ? (
              <Link
                key={link.label}
                to={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-white text-2xl font-medium tracking-wide"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.label}
                href={link.href}
                onClick={(event) =>
                  link.target
                    ? handleSectionLinkClick(event, link.target)
                    : setMenuOpen(false)
                }
                className="text-white text-2xl font-medium tracking-wide"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {link.label}
              </a>
            ),
          )}
          <a
            href="/#contact"
            onClick={(event) => handleSectionLinkClick(event, '#contact')}
            className="mt-4 inline-flex items-center gap-2 px-8 py-3 rounded-xl text-white text-base font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-[#7C3AED]/25"
            style={{
              fontFamily: 'var(--font-body)',
              background: 'linear-gradient(135deg, #3A3FD4 0%, #C840E8 100%)',
            }}
          >
            Hablemos
            <ArrowRight size={18} />
          </a>
        </div>
      </div>
    </>
  );
}
