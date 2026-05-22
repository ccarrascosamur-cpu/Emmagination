import { useGSAPReveal } from '../hooks/useGSAP';

const TESTS = [
  {
    q: 'El equipo de EMMAGINATION transformó completamente nuestra presencia digital. Necesitábamos transmitir confianza y profesionalismo. El resultado superó todas nuestras expectativas.',
    name: 'Jaime Ávila',
    co: 'Gerente General · Fegar',
    i: 'JA',
  },
  {
    q: 'Nuestro sitio no solo se ve increíble — convierte. Portal Zen tiene ahora una presencia online que realmente representa la marca y genera ventas todos los días.',
    name: 'Portal Zen',
    co: 'eCommerce · Wellness · B2B',
    i: 'PZ',
  },
  {
    q: 'El panel autoadministrable que nos entregaron es increíble. Actualizamos noticias y novedades del club sin necesitar ayuda técnica.',
    name: 'Inglés Rugby Club',
    co: 'Club deportivo · Santiago',
    i: 'IR',
  },
];

export default function Testimonial() {
  const ref = useGSAPReveal('.test-card', { stagger: 0.13, y: 44 });
  return (
    <section id="testimonios" className="sec-testimonios" ref={ref}>
      <div className="sec-label">Testimonios</div>
      <h2 className="sec-h2">
        Lo que dicen
        <br />
        <em>nuestros clientes</em>
      </h2>
      <div className="test-grid">
        {TESTS.map((t) => (
          <div key={t.name} className="test-card">
            <div className="test-quote">"</div>
            <p className="test-text">{t.q}</p>
            <div className="test-author">
              <div className="test-av">{t.i}</div>
              <div>
                <div className="test-name">{t.name}</div>
                <div className="test-co">{t.co}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
