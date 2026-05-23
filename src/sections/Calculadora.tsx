import { useState } from 'react';
import { useGSAPReveal } from '../hooks/useGSAP';

// ── Precios base en CLP por tipo de proyecto ───────────────────────────
const BASE_CLP: Record<string, number> = {
  'Páginas Web': 350_000,
  'eCommerce / Shopify': 700_000,
  'SEO Técnico': 300_000,
  'Contenido Visual': 300_000,
};

// ── Precios "desde" visibles ───────────────────────────────────────────
const PRICE_CARDS = [
  { label: 'Páginas Web', from: '$350.000', to: '$2.000.000', desc: 'Landing, corporativo, institucional' },
  { label: 'eCommerce / Shopify', from: '$700.000', to: '$4.000.000', desc: 'Tienda online con panel admin' },
  { label: 'SEO Técnico', from: '$300.000', to: '$1.200.000', desc: 'Auditoría, optimización, posicionamiento' },
  { label: 'Contenido Visual', from: '$300.000', to: '$2.800.000', desc: 'Fotografía, video, pack completo' },
];

// ── Paso 1: selección de tipo ──────────────────────────────────────────
const STEP_1 = {
  q: '¿Qué necesitas?',
  hint: 'Selecciona el servicio principal',
  opts: [
    { icon: '🌐', t: 'Páginas Web', sub: 'Landing, corporativo, institucional', val: 1 },
    { icon: '🛒', t: 'eCommerce / Shopify', sub: 'Tienda online con panel admin', val: 1 },
    { icon: '🔍', t: 'SEO Técnico', sub: 'Auditoría, optimización, posicionamiento', val: 1 },
    { icon: '🎬', t: 'Contenido Visual', sub: 'Fotografía, video, pack completo', val: 1 },
  ],
};

// ── Pasos Web ──────────────────────────────────────────────────────────
const WEB_STEPS = [
  {
    q: '¿Qué tipo de sitio?',
    hint: '',
    opts: [
      { icon: '📄', t: 'Landing page', sub: '1 página, foco en conversión', val: 1 },
      { icon: '🏢', t: 'Sitio corporativo', sub: '4–10 páginas, información completa', val: 1.8 },
      { icon: '🏛️', t: 'Web institucional', sub: '10+ páginas, panel autoadministrable', val: 2.8 },
    ],
  },
  {
    q: '¿Necesitas diseño de marca?',
    hint: '',
    opts: [
      { icon: '🚫', t: 'No, ya tengo', sub: 'Entregas logo y colores', val: 1 },
      { icon: '✨', t: 'Sí, branding básico', sub: 'Logo + paleta + tipografía', val: 1.4 },
      { icon: '◈', t: 'Sí, branding completo', sub: 'Identidad visual + guía de marca', val: 1.9 },
    ],
  },
  {
    q: '¿Plazo?',
    hint: '',
    opts: [
      { icon: '🗓️', t: 'Sin apuro (2–4 meses)', sub: '', val: 0.9 },
      { icon: '📅', t: 'Normal (1–2 meses)', sub: '', val: 1 },
      { icon: '⚡', t: 'Urgente (2–4 semanas)', sub: '', val: 1.25 },
    ],
  },
];

// ── Pasos eCommerce ────────────────────────────────────────────────────
const ECOMMERCE_STEPS = [
  {
    q: '¿Qué tipo de tienda?',
    hint: '',
    opts: [
      { icon: '📦', t: 'Tienda pequeña', sub: 'Hasta 50 productos', val: 1 },
      { icon: '🏪', t: 'Tienda mediana', sub: '50–500 productos', val: 1.5 },
      { icon: '🏬', t: 'Tienda grande', sub: '500+ productos, catálogo complejo', val: 2.2 },
    ],
  },
  {
    q: '¿Necesitas diseño de marca?',
    hint: '',
    opts: [
      { icon: '🚫', t: 'No, ya tengo', sub: '', val: 1 },
      { icon: '✨', t: 'Sí, branding básico', sub: '', val: 1.3 },
      { icon: '◈', t: 'Sí, branding completo', sub: '', val: 1.7 },
    ],
  },
  {
    q: '¿Plazo?',
    hint: '',
    opts: [
      { icon: '🗓️', t: 'Sin apuro (3–5 meses)', sub: '', val: 0.9 },
      { icon: '📅', t: 'Normal (2–3 meses)', sub: '', val: 1 },
      { icon: '⚡', t: 'Urgente (1–2 meses)', sub: '', val: 1.25 },
    ],
  },
];

// ── Pasos SEO ──────────────────────────────────────────────────────────
const SEO_STEPS = [
  {
    q: '¿Qué necesitas?',
    hint: '',
    opts: [
      { icon: '🔍', t: 'Auditoría SEO', sub: 'Diagnóstico completo + informe', val: 1 },
      { icon: '⚡', t: 'SEO técnico', sub: 'Corrección de errores + optimización', val: 1.8 },
      { icon: '📈', t: 'SEO + contenido', sub: 'Técnico + estrategia de contenidos', val: 2.5 },
    ],
  },
  {
    q: '¿Tamaño del sitio?',
    hint: '',
    opts: [
      { icon: '📄', t: 'Hasta 10 páginas', sub: '', val: 1 },
      { icon: '📑', t: '10–50 páginas', sub: '', val: 1.3 },
      { icon: '🏢', t: '50+ páginas', sub: '', val: 1.7 },
    ],
  },
  {
    q: '¿Plazo?',
    hint: '',
    opts: [
      { icon: '🗓️', t: 'Sin apuro (1–2 meses)', sub: '', val: 0.9 },
      { icon: '📅', t: 'Normal (2–4 semanas)', sub: '', val: 1 },
      { icon: '⚡', t: 'Urgente (1 semana)', sub: '', val: 1.25 },
    ],
  },
];

// ── Pasos Contenido Visual ─────────────────────────────────────────────
const CONTENT_STEPS = [
  {
    q: '¿Qué tipo de contenido?',
    hint: '',
    opts: [
      { icon: '📷', t: 'Solo fotografía', sub: 'Producto, marca o equipo', val: 1 },
      { icon: '🎬', t: 'Solo video', sub: 'Reel, corporativo o spot', val: 1.6 },
      { icon: '📷🎬', t: 'Pack foto + video', sub: 'Sesión completa en un día', val: 2.2 },
    ],
  },
  {
    q: '¿Cuántas piezas?',
    hint: '',
    opts: [
      { icon: '🗂️', t: 'Pack básico', sub: '5–10 fotos / 1 video corto', val: 1 },
      { icon: '📦', t: 'Pack estándar', sub: '20–40 fotos / 2–3 videos', val: 1.5 },
      { icon: '🏆', t: 'Pack completo', sub: '60+ fotos / 5+ videos editados', val: 2.2 },
    ],
  },
  {
    q: '¿Plazo?',
    hint: '',
    opts: [
      { icon: '🗓️', t: 'Sin apuro (2–4 semanas)', sub: '', val: 0.9 },
      { icon: '📅', t: 'Normal (1 semana)', sub: '', val: 1 },
      { icon: '⚡', t: 'Urgente (2–3 días)', sub: '', val: 1.3 },
    ],
  },
];

interface Opt {
  icon: string;
  t: string;
  sub: string;
  val: number;
}

interface StepData {
  q: string;
  hint: string;
  opts: Opt[];
}

interface CalcResult {
  low: number;
  high: number;
  display_low: string;
  display_high: string;
}

function calcRange(answers: number[], tipoLabel: string): CalcResult {
  const base = BASE_CLP[tipoLabel] || 350_000;
  const mult = answers.reduce((a, v) => a * v, 1);
  const low = Math.round((base * mult) / 10_000) * 10_000;
  const high = Math.round((base * mult * 1.6) / 10_000) * 10_000;
  return {
    low,
    high,
    display_low: `$${low.toLocaleString('es-CL')}`,
    display_high: `$${high.toLocaleString('es-CL')}`,
  };
}

export default function Calculadora() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [done, setDone] = useState(false);
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const ref = useGSAPReveal('.calc-wrap', { y: 50, stagger: 0 });

  const tipoLabel = STEP_1.opts.find((o) => o.val === answers[0])?.t || 'Páginas Web';

  const getSubSteps = (): StepData[] => {
    switch (tipoLabel) {
      case 'eCommerce / Shopify': return ECOMMERCE_STEPS;
      case 'SEO Técnico': return SEO_STEPS;
      case 'Contenido Visual': return CONTENT_STEPS;
      default: return WEB_STEPS;
    }
  };

  const subSteps = getSubSteps();
  const progress = done ? 100 : (step / 4) * 100;
  const result: CalcResult | null = done ? calcRange(answers, tipoLabel) : null;

  const next = () => {
    if (selected === null) return;
    const newAns = [...answers, selected];
    setAnswers(newAns);
    setSelected(null);
    if (step >= subSteps.length) setDone(true);
    else setStep((s) => s + 1);
  };

  const back = () => {
    if (step === 0) return;
    setSelected(null);
    setAnswers((a) => a.slice(0, -1));
    setStep((s) => s - 1);
  };

  const reset = () => {
    setStep(0);
    setAnswers([]);
    setSelected(null);
    setDone(false);
    setSent(false);
    setEmail('');
  };

  const handleSubmitEmail = async () => {
    if (!email) return;
    try {
      await fetch('https://formspree.io/f/mredkeor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          email,
          subject: `Nueva cotización desde emmagination.cl — ${tipoLabel}`,
          tipo_proyecto: tipoLabel,
          answers: answers.map((a, i) => {
            const allSteps = [STEP_1, ...subSteps];
            const stepData = allSteps[i];
            const opt = stepData?.opts.find((o) => o.val === a);
            return { question: stepData?.q, answer: opt?.t };
          }),
          range: result ? `${result.display_low} – ${result.display_high}` : '',
        }),
      });
    } catch { /* silent */ }
    setSent(true);
  };

  const currentStep = step === 0 ? STEP_1 : subSteps[step - 1];

  return (
    <section id="cotizar" className="sec-calc" ref={ref}>
      <div className="calc-header">
        <div className="sec-label" style={{ justifyContent: 'center' }}>
          Calculadora
        </div>
        <h2 className="sec-h2">
          ¿Cuánto cuesta
          <br />
          <em>tu proyecto?</em>
        </h2>
        <p className="sec-sub" style={{ margin: '0 auto 2rem auto', textAlign: 'center' }}>
          Responde unas preguntas y obtén un rango de inversión estimado al instante.
        </p>
      </div>

      {/* Precios desde */}
      <div style={{ maxWidth: 720, margin: '0 auto 2.5rem' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '0.75rem',
          }}
        >
          {PRICE_CARDS.map((item) => (
            <div
              key={item.label}
              style={{
                padding: '1rem',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(168,85,247,0.1)',
                borderRadius: 12,
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '0.75rem', color: '#9E9CC8', marginBottom: 4 }}>{item.label}</div>
              <div style={{ color: '#A855F7', lineHeight: 1.1 }}>
                <span style={{ fontSize: '0.62rem', fontWeight: 600, opacity: 0.82, marginRight: 4 }}>
                  Desde
                </span>
                <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                  {item.from}
                </span>
              </div>
              <div style={{ fontSize: '0.7rem', color: '#5C5A8A', marginTop: 2 }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="calc-wrap">
        <div className="calc-progress">
          <div className="calc-bar" style={{ width: `${progress}%` }} />
        </div>

        {!done ? (
          <div className="calc-body">
            <div className="calc-step-label">
              Paso {step + 1} de 4
            </div>
            <div className="calc-question">{currentStep.q}</div>
            <div className="calc-hint">{currentStep.hint}</div>

            <div className="calc-opts">
              {currentStep.opts.map((o) => (
                <button
                  key={o.t}
                  className={`calc-opt${selected === o.val ? ' calc-opt-sel' : ''}`}
                  onClick={() => setSelected(o.val)}
                >
                  <div className="calc-opt-icon">{o.icon}</div>
                  <div className="calc-opt-text">
                    <div className="calc-opt-title">{o.t}</div>
                    <div className="calc-opt-sub">{o.sub}</div>
                  </div>
                  <div className="calc-check">
                    {selected === o.val ? '✓' : ''}
                  </div>
                </button>
              ))}
            </div>

            <div className="calc-nav">
              <button
                className="calc-btn-back"
                onClick={back}
                disabled={step === 0}
              >
                ← Atrás
              </button>
              <button
                className="calc-btn-next"
                onClick={next}
                disabled={selected === null}
              >
                {step === 3 ? 'Ver resultado →' : 'Siguiente →'}
              </button>
            </div>
          </div>
        ) : !sent ? (
          <div className="calc-result">
            <div className="calc-res-emoji">🎯</div>
            <div className="calc-res-title">
              Inversión estimada
            </div>
            <div className="calc-res-range">
              {result?.display_low} – {result?.display_high}
            </div>
            <div className="calc-res-clp">CLP · Chile</div>

            <div className="calc-breakdown">
              {(() => {
                const allSteps = [STEP_1, ...subSteps];
                return allSteps.map((s, i) => {
                  const opt = s.opts.find((o) => o.val === answers[i]);
                  return (
                    <div key={i} className="calc-br-item">
                      <div className="calc-br-label">{s.q}</div>
                      <div className="calc-br-val">{opt?.t || '—'}</div>
                    </div>
                  );
                });
              })()}
            </div>

            <p className="calc-res-note">
              Este es un rango orientativo. El valor final se define en el brief.
              Déjanos tu email y te enviamos una propuesta formal en 24 horas.
            </p>

            <div className="calc-email-row">
              <input
                className="calc-email-inp"
                type="email"
                placeholder="tu@empresa.cl"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button className="calc-btn-next" onClick={handleSubmitEmail}>
                Quiero mi propuesta →
              </button>
            </div>

            <button className="calc-btn-back" onClick={reset}>
              Recalcular
            </button>
          </div>
        ) : (
          <div className="calc-result">
            <div className="calc-res-emoji">🎉</div>
            <div className="calc-res-title">¡Listo!</div>
            <p className="calc-res-note">
              Te contactamos en menos de 24 horas con una propuesta detallada.
            </p>
            <button className="calc-btn-back" onClick={reset}>
              Nueva cotización
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
