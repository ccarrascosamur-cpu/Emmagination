import { useState } from 'react';

export default function CTABanner() {
  const [email, setEmail] = useState('');
  const [ok, setOk] = useState(false);

  const handleSubmit = async () => {
    if (!email) return;
    try {
      await fetch('https://formspree.io/f/mredkeor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          email,
          subject: 'Lead desde CTA Banner emmagination.cl',
          message: 'Usuario dejó su email en el CTA banner del home.',
        }),
      });
    } catch {
      // silently fail
    }
    setOk(true);
  };

  return (
    <section className="cta-banner">
      <div className="cta-glow" />
      <h2 className="cta-h2">
        Tu próximo cliente
        <br />
        <em>te está buscando en Google.</em>
      </h2>
      <p className="cta-sub">
        ¿Lo van a encontrar a ti o a tu competencia? Hablemos hoy.
      </p>
      {!ok ? (
        <>
          <div className="cta-form">
            <input
              className="cta-inp"
              type="email"
              placeholder="tu@empresa.cl"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button className="cta-btn" onClick={handleSubmit}>
              Quiero más clientes →
            </button>
          </div>
          <p className="cta-fine">
            Te respondemos en menos de 24h · Sin spam · Sin compromiso
          </p>
        </>
      ) : (
        <div className="cta-ok">
          ✅ ¡Recibido! Te contactamos muy pronto.
        </div>
      )}
    </section>
  );
}
