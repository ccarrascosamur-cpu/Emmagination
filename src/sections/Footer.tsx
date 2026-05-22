import { useState } from 'react';
import { Instagram, Mail, Phone, MessageCircle } from 'lucide-react';
import { Link, useLocation } from 'react-router';
import { useSiteData } from '../lib/site-data-client';

const SVCS_CONTACT = ['Diseño Web', 'Branding', 'SEO', 'Shopify', 'Todo'];

export default function Footer() {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const { data } = useSiteData();
  const whatsappNumber = data.config.contactPhone.replace(/[^\d]/g, '');

  const [svc, setSvc] = useState('Diseño Web');
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formMsg, setFormMsg] = useState('');
  const [formSent, setFormSent] = useState(false);

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

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formEmail) return;
    try {
      await fetch('https://formspree.io/f/mredkeor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: formName,
          email: formEmail,
          message: formMsg,
          service: svc,
          subject: `Nuevo lead: ${svc} - ${formName}`,
        }),
      });
    } catch {
      // silently fail
    }
    setFormSent(true);
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
        {/* Contact Form Section */}
        <div className="mb-20">
          <div className="sec-label" style={{ marginBottom: '1rem' }}>
            Contacto
          </div>
          <h2
            className="sec-h2"
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2rem, 4vw, 3.2rem)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              lineHeight: 1.08,
              marginBottom: '0.9rem',
            }}
          >
            Hablemos de<br /><em>tu proyecto</em>
          </h2>
          <p
            className="sec-sub"
            style={{
              color: '#9E9CC8',
              maxWidth: '520px',
              fontSize: '1rem',
              lineHeight: 1.8,
              marginBottom: '2.5rem',
            }}
          >
            Completa el formulario y te respondemos en menos de 24 horas.
          </p>

          {!formSent ? (
            <form onSubmit={handleFormSubmit} className="max-w-xl">
              <div className="ct-svc-label">¿Qué necesitas?</div>
              <div className="ct-chips">
                {SVCS_CONTACT.map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={`ct-chip${svc === s ? ' ct-chip-on' : ''}`}
                    onClick={() => setSvc(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>

              <div className="flex flex-col gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Tu nombre"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="ct-input"
                />
                <input
                  type="email"
                  placeholder="tu@empresa.cl"
                  required
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  className="ct-input"
                />
                <textarea
                  rows={4}
                  placeholder={`Cuéntanos sobre tu proyecto de ${svc}…`}
                  value={formMsg}
                  onChange={(e) => setFormMsg(e.target.value)}
                  className="ct-input ct-textarea"
                />
              </div>

              <button
                type="submit"
                className="calc-btn-next"
                style={{ display: 'inline-flex' }}
              >
                Empezar mi proyecto →
              </button>
            </form>
          ) : (
            <div
              className="max-w-xl rounded-2xl border p-8 text-center"
              style={{
                borderColor: 'rgba(168,85,247,0.2)',
                background: 'rgba(168,85,247,0.06)',
              }}
            >
              <div style={{ fontSize: '2.8rem', marginBottom: '0.9rem' }}>🎉</div>
              <div
                className="sec-h2"
                style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}
              >
                ¡Mensaje enviado!
              </div>
              <p className="sec-sub" style={{ margin: '0 auto' }}>
                Gracias por contactarnos. Te responderemos en menos de 24 horas
                con una propuesta para tu proyecto de {svc}.
              </p>
            </div>
          )}
        </div>

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
              <h4 className="label-mono text-white/40 mb-6">NAVEGACIÓN</h4>
              <ul className="space-y-3">
                {[
                  { label: 'Proyectos', href: '/portafolio' },
                  { label: 'Servicios', href: '#approach' },
                  { label: 'Cotizar', href: '#cotizar' },
                  { label: 'Contacto', href: '#contact' },
                ].map((item) => (
                  <li key={item.label}>
                    {item.href.startsWith('#') ? (
                      <a
                        href={`/${item.href}`}
                        onClick={(event) =>
                          handleSectionLinkClick(event, item.href)
                        }
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
              <h4 className="label-mono text-white/40 mb-6">SERVICIOS</h4>
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
              <h4 className="label-mono text-white/40 mb-6">REDES</h4>
              <div className="flex gap-4">
                {[
                  { icon: Instagram, label: 'Instagram', href: data.config.instagramUrl },
                ].filter(item => item.href).map(({ icon: Icon, label, href }) => (
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
