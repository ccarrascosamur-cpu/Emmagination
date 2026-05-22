import { useState } from 'react';
import { useGSAPReveal } from '../hooks/useGSAP';

const BASE_UF = 20;

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

const STEPS: StepData[] = [
  {
    q: '¿Qué tipo de proyecto necesitas?',
    hint: 'Selecciona el servicio principal',
    opts: [
      { icon: '🌐', t: 'Diseño Web', sub: 'Sitio corporativo o landing page', val: 1 },
      { icon: '🛒', t: 'eCommerce / Shopify', sub: 'Tienda online completa', val: 2 },
      { icon: '◈', t: 'Branding completo', sub: 'Logo + identidad + guía de marca', val: 1.2 },
      { icon: '📦', t: 'Proyecto integral', sub: 'Web + Branding + SEO', val: 2.5 },
    ],
  },
  {
    q: '¿Cuántas páginas necesitas?',
    hint: 'Aproximado, se puede ajustar en el brief',
    opts: [
      { icon: '📄', t: '1–3 páginas', sub: 'Landing page o sitio simple', val: 1 },
      { icon: '📑', t: '4–8 páginas', sub: 'Sitio corporativo estándar', val: 1.5 },
      { icon: '📚', t: '9–20 páginas', sub: 'Sitio mediano con secciones', val: 2 },
      { icon: '🏢', t: '+20 páginas o tienda', sub: 'Sitio grande o eCommerce', val: 3 },
    ],
  },
  {
    q: '¿Necesitas panel autoadministrable?',
    hint: 'Para editar contenido sin programar',
    opts: [
      { icon: '✅', t: 'Sí, lo necesito', sub: 'Panel CMS para editar todo', val: 1.3 },
      { icon: '🔧', t: 'Solo ediciones básicas', sub: 'Nos envías los cambios', val: 1 },
      { icon: '🚫', t: 'No es necesario', sub: 'Sitio estático sin CMS', val: 0.9 },
    ],
  },
  {
    q: '¿Cuándo lo necesitas listo?',
    hint: 'El plazo afecta la planificación del equipo',
    opts: [
      { icon: '⚡', t: 'Urgente (2–3 semanas)', sub: 'Prioridad máxima', val: 1.4 },
      { icon: '📅', t: 'Normal (1–2 meses)', sub: 'Plazo estándar de producción', val: 1 },
      { icon: '🗓️', t: 'Sin apuro (2–4 meses)', sub: 'Proceso completo y detallado', val: 0.9 },
    ],
  },
];

interface CalcResult {
  low: number;
  high: number;
  usd_low: number;
  usd_high: number;
}

function calcRange(answers: number[]): CalcResult {
  const mult = answers.reduce((a, v) => a * v, 1);
  const low = Math.round(BASE_UF * mult);
  const high = Math.round(BASE_UF * mult * 1.4);
  return {
    low,
    high,
    usd_low: Math.round(low * 40),
    usd_high: Math.round(high * 40),
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

  const total = STEPS.length;
  const progress = done ? 100 : (step / total) * 100;
  const result: CalcResult | null = done ? calcRange(answers) : null;

  const next = () => {
    if (selected === null) return;
    const newAns = [...answers, selected];
    setAnswers(newAns);
    setSelected(null);
    if (step + 1 >= total) setDone(true);
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
          answers: STEPS.map((s, i) => ({
            question: s.q,
            answer: s.opts.find((o) => o.val === answers[i])?.t || '—',
          })),
          range: result ? `${result.low}–${result.high} UF` : '',
        }),
      });
    } catch {
      // silently fail — visual success is enough for now
    }
    setSent(true);
  };

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
        <p className="sec-sub" style={{ margin: '0 auto 0 auto', textAlign: 'center' }}>
          Responde 4 preguntas y obtén un rango de inversión estimado al instante.
        </p>
      </div>

      <div className="calc-wrap">
        {/* Barra de progreso */}
        <div className="calc-progress">
          <div className="calc-bar" style={{ width: `${progress}%` }} />
        </div>

        {!done ? (
          <div className="calc-body">
            <div className="calc-step-label">
              Paso {step + 1} de {total}
            </div>
            <div className="calc-question">{STEPS[step].q}</div>
            <div className="calc-hint">{STEPS[step].hint}</div>

            <div className="calc-opts">
              {STEPS[step].opts.map((o) => (
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
                {step + 1 === total ? 'Ver resultado →' : 'Siguiente →'}
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
              {result?.low}–{result?.high} UF
            </div>
            <div className="calc-res-usd">
              Aprox. USD {result?.usd_low.toLocaleString()} – {result?.usd_high.toLocaleString()}
            </div>

            <div className="calc-breakdown">
              {[
                ['Tipo de proyecto', STEPS[0].opts.find((o) => o.val === answers[0])?.t],
                ['Alcance', STEPS[1].opts.find((o) => o.val === answers[1])?.t],
                ['Panel admin', STEPS[2].opts.find((o) => o.val === answers[2])?.t],
                ['Plazo', STEPS[3].opts.find((o) => o.val === answers[3])?.t],
              ].map(([l, v]) => (
                <div key={l} className="calc-br-item">
                  <div className="calc-br-label">{l}</div>
                  <div className="calc-br-val">{v || '—'}</div>
                </div>
              ))}
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
