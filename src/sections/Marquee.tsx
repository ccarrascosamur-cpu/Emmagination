const ITEMS = [
  'Web Design',
  'Branding',
  'SEO Técnico',
  'Shopify Plus',
  'eCommerce',
  'UI/UX',
  'Motion Design',
  'Identidad Visual',
  'React · Vite',
  'Cloudflare',
  'GSAP',
  'Digital Experience',
];

export default function Marquee() {
  const doubled = [...ITEMS, ...ITEMS];
  return (
    <div className="marquee-wrap">
      <div className="marquee-track">
        {doubled.map((t, i) => (
          <div key={i} className="marquee-item">
            <span className="marquee-dot" />
            {t}
          </div>
        ))}
      </div>
    </div>
  );
}
