import { useState } from 'react';
import { useGSAPReveal } from '../hooks/useGSAP';

// ── Precios base en CLP por tipo de proyecto ───────────────────────────
const BASE_CLP: Record<string, number> = {
  'Diseño Web': 350_000,
  'eCommerce / Shopify': 750_000,
  'Branding completo': 300_000,
  'Proyecto integral': 1_250_000,
  'Contenido Visual': 280_000,
};

// ── Rangos de referencia visibles ──────────────────────────────────────
const PRICE_RANGES = [
  { label: 'Landing page', range: '$350.000 – $700.000' },
  { label: 'Sitio corporativo', range: '$700.000 – $2.000.000' },
  { label: 'Shopify / eCommerce', range: '$1.500.000 – $4.000.000' },
  { label: 'Branding completo', range: '$600.000 – $2.000.000' },
  { label: 'Fotografía sesión', range: '$280.000 – $1.200.000' },
  { label: 'Video corporativo', range: '$500.000 – $2.500.000' },
  { label: 'Pack foto + video', range: '$900.000 – $2.800.000' },
  { label: 'Plan mensual RRSS', range: '$400.000 – $900.000/mes' },
  { label: 'SEO técnico', range: '$400.000 – $1.200.000' },
  { label: 'Proyecto integral', range: '$2.500.000 – $6.000.000' },
];

// ── Pasos para proyectos web/branding ──────────────────────────────────
const WEB_STEPS = [
  {
    q: '¿Cuántas páginas necesitas?',
    hint: 'Aproximado, se puede ajustar en el brief',
    opts: [
      { icon: '📄', t: '1–3 páginas', sub: 'Landing page o sitio simple', val: 1 },
      { icon: '📑', t: '4–8 páginas', sub: 'Sitio corporativo estándar', val: 1.3 },
      { icon: '📚', t: '9–20 páginas', sub: 'Sitio mediano con secciones', val: 1.6 },
      { icon: '🏢', t: '+20 páginas o tienda', sub: 'Sitio grande o eCommerce', val: 2 },
    ],
  },
  {
    q: '¿Necesitas panel autoadministrable?',
    hint: 'Para editar contenido sin programar',
    opts: [
      { icon: '🚫', t: 'No es necesario', sub: 'Sitio estático sin CMS', val: 1 },
      { icon: '🔧', t: 'Solo ediciones básicas', sub: 'Nos envías los cambios', val: 1.1 },
      { icon: '✅', t: 'Sí, lo necesito', sub: 'Panel CMS para editar todo', val: 1.4 },
    ],
  },
  {
    q: '¿Necesitas contenido visual?',
    hint: 'Fotografía, video o motion graphics',
    opts: [
      { icon: '🚫', t: 'No, ya tengo todo', sub: 'Entregas fotos/videos tú', val: 1 },
      { icon: '📸', t: 'Fotografía de producto', sub: 'Sesión profesional de fotos', val: 1.3 },
      { icon: '🎬', t: 'Video corporativo / reels', sub: 'Edición + filmación básica', val: 1.8 },
      { icon: '✨', t: 'Pack completo foto + video', sub: 'Sesión + reels + motion', val: 2.5 },
    ],
  },
  {
    q: '¿Cuándo lo necesitas listo?',
    hint: 'El plazo afecta la planificación del equipo',
    opts: [
      { icon: '🗓️', t: 'Sin apuro (2–4 meses)', sub: 'Proceso completo y detallado', val: 0.9 },
      { icon: '📅', t: 'Normal (1–2 meses)', sub: 'Plazo estándar de producción', val: 1 },
      { icon: '⚡', t: 'Urgente (2–3 semanas)', sub: 'Prioridad máxima', val: 1.3 },
    ],
  },
];

// ── Pasos para contenido visual ────────────────────────────────────────
const CONTENT_STEPS = [
  {
    q: '¿Qué tipo de contenido necesitas?',
    hint: 'Puedes combinar foto y video en una sesión',
    opts: [
      { icon: '📷', t: 'Solo fotografía', sub: 'Producto, marca o equipo', val: 1 },
      { icon: '🎬', t: 'Solo video', sub: 'Reel, corporativo o spot', val: 1.4 },
      { icon: '📷🎬', t: 'Pack foto + video', sub: 'Sesión completa en un día', val: 1.8 },
      { icon: '📅', t: 'Plan mensual RRSS', sub: 'Contenido recurrente para redes', val: 2.2 },
    ],
  },
  {
    q: '¿Cuántas piezas necesitas?',
    hint: 'Afecta el tiempo de sesión y edición',
    opts: [
      { icon: '🗂️', t: 'Pack básico', sub: '5–10 fotos / 1 video corto', val: 1 },
      { icon: '📦', t: 'Pack estándar', sub: '20–40 fotos / 2–3 videos', val: 1.5 },
      { icon: '🏆', t: 'Pack completo', sub: '60+ fotos / 5+ videos editados', val: 2.2 },
    ],
  },
  {
    q: '¿Requiere locación especial o modelo?',
    hint: 'Influye en la logística y producción',
    opts: [
      { icon: '🏠', t: 'Estudio o locación simple', sub: 'Sin desplazamiento especial', val: 1 },
      { icon: '🌆', t: 'Locación exterior Santiago', sub: 'Desplazamiento incluido', val: 1.3 },
      { icon: '🧍', t: 'Con modelo o actor', sub: 'Casting + producción completa', val: 1.6 },
    ],
  },
  {
    q: '¿Cuándo lo necesitas listo?',
    hint: 'El plazo afecta la planificación del equipo',
    opts: [
      { icon: '🗓️', t: 'Sin apuro (2–4 semanas)', sub: 'Proceso completo y detallado', val: 0.9 },
      { icon: '📅', t: 'Normal (1 semana)', sub: 'Plazo estándar de producción', val: 1 },
      { icon: '⚡', t: 'Urgente (2–3 días)', sub: 'Prioridad máxima', val: 1.3 },
    ],
  },
];

// ── Paso 1 común ───────────────────────────────────────────────────────
const STEP_1 = {
  q: '¿Qué tipo de proyecto necesitas?',
  hint: 'Selecciona el servicio principal',
  opts: [
    { icon: '🌐', t: 'Diseño Web', sub: 'Sitio corporativo o landing page', val: 1 },
    { icon: '◈', t: 'Branding completo', sub: 'Logo + identidad + guía de marca', val: 1.3 },
    { icon: '📦', t: 'Proyecto integral', sub: 'Web + Branding + SEO', val: 2 },
    { icon: '🛒', t: 'eCommerce / Shopify', sub: 'Tienda online completa', val: 3.5 },
    { icon: '🎬', t: 'Contenido Visual', sub: 'Fotografía, video y producción audiovisual', val: 1.1 },
  ],
};

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
  const high = Math.round((base * mult * 1.45) / 10_000) * 10_000;
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

  // Determinar qué flujo de pasos usar
  const tipoLabel = STEP_1.opts.find((o) => o.val === answers[0])?.t || 'Diseño Web';
  const isContentVisual = tipoLabel === 'Contenido Visual';

  const progress = done ? 100 : (step / 5) * 100;
  const result: CalcResult | null = done ? calcRange(answers, tipoLabel) : null;

  const next = () => {
    if (selected === null) return;
    const newAns = [...answers, selected];
    setAnswers(newAns);
    setSelected(null);

    // Si estamos en paso 0 (selección de tipo), determinamos cuántos pasos quedan
    const selectedType = STEP_1.opts.find((o) => o.val === selected)?.t || '';
    const remainingSteps = selectedType === 'Contenido Visual' ? CONTENT_STEPS.length : WEB_STEPS.length;

    if (step >= remainingSteps) setDone(true);
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
          subject: 'Nueva cotización desde emmagination.cl',
          tipo_proyecto: tipoLabel,
          answers: answers.map((a, i) => {
            const allSteps = [STEP_1, ...(isContentVisual ? CONTENT_STEPS : WEB_STEPS)];
            const stepData = allSteps[i];
            const opt = stepData?.opts.find((o) => o.val === a);
            return { question: stepData?.q, answer: opt?.t };
          }),
          range: result ? `${result.display_low} – ${result.display_high}` : '',
        }),
      });
    } catch {
      // silently fail
    }
    setSent(true);
  };

  // Obtener el paso actual a mostrar
  const getCurrentStep = (): StepData => {
    if (step === 0) return STEP_1;
    const subSteps = isContentVisual ? CONTENT_STEPS : WEB_STEPS;
    return subSteps[step - 1] || subSteps[subSteps.length - 1];
  };

  const currentStep = getCurrentStep();

  return (
    <section id="cotizar" className="sec-calc" ref={ref}>
      {/* Tabla de referencia de precios */}
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

      {/* Tabla de rangos */}
      <div className="calc-ref-table" style={{ maxWidth: 700, margin: '0 auto 2.5rem' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '0.5rem',
          }}
        >
          {PRICE_RANGES.map((item) => (
            <div
              key={item.label}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.5rem 0.85rem',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(168,85,247,0.08)',
                borderRadius: 8,
              }}
            >
              <span style={{ fontSize: '0.78rem', color: '#9E9CC8' }}>{item.label}</span>
              <span style={{ fontSize: '0.78rem', color: '#A855F7', fontWeight: 600 }}>
                {item.range}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="calc-wrap">
        {/* Barra de progreso */}
        <div className="calc-progress">
          <div className="calc-bar" style={{ width: `${progress}%` }} />
        </div>

        {!done ? (
          <div className="calc-body">
            <div className="calc-step-label">
              Paso {step + 1} de 5
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
                {step === 4 ? 'Ver resultado →' : 'Siguiente →'}
              </button>
            </div>
          </div>
        ) : !sent ? (
          <div className="calc-result">
            <div className="calc-res-emoji">🎯</div>
            <div className="calc-res-title">
              Inversión estimada para tu proyecto
            </div>
            <div className="calc-res-range">
              {result?.display_low} – {result?.display_high}
            </div>
            <div className="calc-res-clp">CLP · Chile</div>

            <div className="calc-breakdown">
              {(() => {
                const allSteps = [STEP_1, ...(isContentVisual ? CONTENT_STEPS : WEB_STEPS)];
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
              Revisa tu bandeja de entrada.
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
