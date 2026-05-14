import { Instagram, Linkedin, Twitter, Mail, Phone, MessageCircle } from 'lucide-react';

export default function Footer() {
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
                src="/images/emmagination-logo.jpg"
                alt="EMMAGINATION"
                className="h-12 w-auto object-contain"
              />
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
                href="mailto:hola@emmagination.com"
                className="inline-flex items-center gap-2 px-8 py-3 bg-[#7C3AED] rounded-full text-white text-sm hover:bg-[#CC26D3] transition-all duration-300 w-fit"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                <Mail size={16} />
                Contactar
              </a>
              <a
                href="https://wa.me/56988290618"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-3 bg-[#25D366] rounded-full text-white text-sm hover:bg-[#128C7E] transition-all duration-300 w-fit"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                <MessageCircle size={16} />
                WhatsApp
              </a>
              <a
                href="tel:+56988290618"
                className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                <Phone size={16} />
                +56 9 8829 0618
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
                  { label: 'Proyectos', href: '#work' },
                  { label: 'Servicios', href: '#approach' },
                  { label: 'Contacto', href: '#contact' },
                ].map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      className="text-white/70 hover:text-white transition-colors text-sm"
                      style={{ fontFamily: 'var(--font-body)' }}
                    >
                      {item.label}
                    </a>
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
                  'Diseño Web',
                  'Branding',
                  'Shopify',
                  'UX/UI',
                  'Motion',
                ].map((item) => (
                  <li key={item}>
                    <span
                      className="text-white/70 text-sm"
                      style={{ fontFamily: 'var(--font-body)' }}
                    >
                      {item}
                    </span>
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
                  { icon: Instagram, label: 'Instagram' },
                  { icon: Linkedin, label: 'LinkedIn' },
                  { icon: Twitter, label: 'Twitter' },
                ].map(({ icon: Icon, label }) => (
                  <a
                    key={label}
                    href="#"
                    className="w-10 h-10 flex items-center justify-center rounded-full border border-white/10 text-white/50 hover:text-white hover:border-[#7C3AED] hover:bg-[#7C3AED]/10 transition-all duration-300"
                    aria-label={label}
                  >
                    <Icon size={16} />
                  </a>
                ))}
              </div>
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
