import { useGSAPReveal } from '../hooks/useGSAP';
import { Link } from 'react-router';

const SVCS = [
  {
    num: '01',
    icon: '🌐',
    title: 'Diseño Web',
    href: '/servicios/diseno-web',
    desc: 'Sitios corporativos, landing pages y webs comerciales que convierten visitas en clientes. Rápidos, responsivos y con panel autoadministrable.',
    tags: ['Landing pages', 'Corporativo', 'React / Vite', 'SSR', 'Panel admin'],
  },
  {
    num: '02',
    icon: '◈',
    title: 'Branding',
    href: '/servicios/branding',
    desc: 'Identidad visual completa: logo, sistema gráfico, paleta, tipografía y guía de marca. Tu empresa, reconocible y consistente en todos los canales.',
    tags: ['Logo', 'Sistema gráfico', 'Guía de marca', 'Naming', 'Packaging'],
  },
  {
    num: '03',
    icon: '⟳',
    title: 'SEO',
    href: '/servicios/seo',
    desc: 'Posicionamiento técnico, local y estratégico. Aparecer primero en Google cuando tus clientes te buscan en Chile.',
    tags: ['SEO técnico', 'SEO local', 'On-page', 'Core Web Vitals', 'Auditoría'],
  },
  {
    num: '04',
    icon: '⊞',
    title: 'Shopify / eCommerce',
    href: '#contact',
    desc: 'Tiendas online de alto rendimiento con panel autoadministrable. Vende 24/7 sin depender de nadie para actualizar tu catálogo.',
    tags: ['Shopify Plus', 'Custom themes', 'CRO', 'Integraciones', 'Panel propio'],
  },
  {
    num: '05',
    icon: '▶',
    title: 'Motion & Animación',
    href: '#contact',
    desc: 'Animaciones cinematográficas con scroll y micro-interacciones que dan vida a las interfaces y cautivan a los usuarios desde el primer segundo.',
    tags: ['GSAP', 'ScrollTrigger', 'Micro-interactions', 'Lottie', 'CSS Motion'],
  },
];

export default function Approach() {
  const ref = useGSAPReveal('.svc-card', { stagger: 0.1, y: 50 });

  return (
    <section id="approach" className="sec-servicios" ref={ref}>
      <div className="sec-label">Servicios</div>
      <h2 className="sec-h2">
        Todo lo que tu empresa
        <br />
        <em>necesita online</em>
      </h2>
      <p className="sec-sub">
        Nos especializamos en las áreas que determinan si una empresa crece o
        se estanca en internet.
      </p>
      <div className="svcs-grid">
        {SVCS.map((s) => (
          <Link key={s.title} to={s.href} className="svc-card">
            <div className="svc-num">{s.num}</div>
            <div className="svc-icon">{s.icon}</div>
            <div className="svc-title">{s.title}</div>
            <div className="svc-desc">{s.desc}</div>
            <div className="svc-tags">
              {s.tags.map((t) => (
                <span key={t} className="svc-tag">
                  {t}
                </span>
              ))}
            </div>
            <div className="svc-arrow">→</div>
          </Link>
        ))}
      </div>
    </section>
  );
}
