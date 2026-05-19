import { Instagram, Linkedin, Mail, Phone, MessageCircle } from 'lucide-react';
import { Link, useLocation } from 'react-router';
import { useSiteData } from '../lib/site-data-client';

export default function Footer() {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const { data } = useSiteData();
  const whatsappNumber = data.config.contactPhone.replace(/[^\d]/g, '');

  const handleSectionLinkClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    if (!isHome) return;

    const el = document.querySelector(href);
    if (el) {
      event.preventDefault();
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer
      id="contact"
      className="relative w-full"
      style={{
        backgroundColor: '#050505',
        padding: '100px 0 40px',
      }}
    >
      <div className="mx-auto" style={{ maxWidth: '1440px', padding: '0 4vw' }}>
        {/* Main Footer Content */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-16 mb-20">
          {/* Left - Brand */}
          <div className="max-w-md">
            <div className="flex items-center gap-3 mb-6">
              <img
                src="/images/isotipo.png"
                alt="EMMAGINATION"
                className="h-10 w-auto object-contain"
              />
              <span
                className="text-white text-xl font-semibold tracking-tight"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                EMMA<strong>GINATION</strong>
              </span>
            </div>
            <h3
              className="text-white mb-4"
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(24px, 3vw, 36px)',
                fontWeight: 500,
                letterSpacing: '-1px',
                lineHeight: 1.2,
              }}
            >
              ¿Listo para crear algo increíble?
            </h3>
            <p
              className="text-white/50 mb-8"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '1rem',
                lineHeight: 1.6,
              }}
            >
              Transformamos ideas en experiencias digitales memorables.
              Hablemos de tu próximo proyecto.
            </p>
            <div className="flex flex-col gap-3">
              <a
                href={`mailto:${data.config.contactEmail}`}
                className="inline-flex items-center gap-2 px-8 py-3 bg-[#7C3AED] rounded-full text-white text-sm hover:bg-[#CC26D3] transition-all duration-300 w-fit"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                <Mail size={16} />
                Contactar
              </a>
              <a
                href={`mailto:${data.config.contactEmail}`}
                className="text-white/50 hover:text-white/80 transition-colors text-xs"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                {data.config.contactEmail}
              </a>
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-3 bg-[#25D366] rounded-full text-white text-sm hover:bg-[#128C7E] transition-all duration-300 w-fit"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                <MessageCircle size={16} />
                WhatsApp
              </a>
              <a
                href={`tel:${whatsappNumber}`}
                className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                <Phone size={16} />
                {data.config.contactPhone}
              </a>
            </div>
          </div>

          {/* Right - Links */}
          <div className="flex flex-col sm:flex-row gap-12 lg:gap-20">
            {/* Navigation */}
            <div>
              <h4
                className="label-mono text-white/40 mb-6"
              >
                NAVEGACIÓN
              </h4>
              <ul className="space-y-3">
                {[
                  { label: 'Proyectos', href: '/portafolio' },
                  { label: 'Servicios', href: '#approach' },
                  { label: 'Contacto', href: '#contact' },
                ].map((item) => (
                  <li key={item.label}>
                    {item.href.startsWith('#') ? (
                      <a
                        href={`/${item.href}`}
                        onClick={(event) => handleSectionLinkClick(event, item.href)}
                        className="text-white/70 hover:text-white transition-colors text-sm"
                        style={{ fontFamily: 'var(--font-body)' }}
                      >
                        {item.label}
                      </a>
                    ) : (
                      <Link
                        to={item.href}
                        className="text-white/70 hover:text-white transition-colors text-sm"
                        style={{ fontFamily: 'var(--font-body)' }}
                      >
                        {item.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4
                className="label-mono text-white/40 mb-6"
              >
                SERVICIOS
              </h4>
              <ul className="space-y-3">
                {[
                  { label: 'Diseño Web', href: '/servicios/diseno-web' },
                  { label: 'Branding', href: '/servicios/branding' },
                  { label: 'SEO', href: '/servicios/seo' },
                ].map((item) => (
                  <li key={item.label}>
                    <Link
                      to={item.href}
                      className="text-white/70 text-sm"
                      style={{ fontFamily: 'var(--font-body)' }}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social */}
            <div>
              <h4
                className="label-mono text-white/40 mb-6"
              >
                REDES
              </h4>
              <div className="flex gap-4">
                {[
                  { icon: Instagram, label: 'Instagram', href: data.config.instagramUrl },
                  { icon: Linkedin, label: 'LinkedIn', href: data.config.linkedinUrl },
                ].map(({ icon: Icon, label, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center rounded-full border border-white/10 text-white/50 hover:text-white hover:border-[#7C3AED] hover:bg-[#7C3AED]/10 transition-all duration-300"
                    aria-label={label}
                  >
                    <Icon size={16} />
                  </a>
                ))}
              </div>
              <a
                href={data.config.googleBusinessUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex text-white/55 hover:text-white transition-colors text-xs"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                Ver perfil en Google Business
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p
            className="text-white/30 text-xs"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            © 2024 EMMAGINATION. Todos los derechos reservados.
          </p>
          <div className="flex gap-6">
            <a
              href="#"
              className="text-white/30 hover:text-white/60 text-xs transition-colors"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              Privacidad
            </a>
            <a
              href="#"
              className="text-white/30 hover:text-white/60 text-xs transition-colors"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              Términos
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
