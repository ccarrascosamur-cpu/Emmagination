import { useGSAPReveal } from '../hooks/useGSAP';

const STEPS = [
  {
    n: '01',
    t: 'Descubrimiento',
    d: 'Analizamos tu marca, audiencia y objetivos. Auditoría del sitio actual, competencia y oportunidades SEO.',
  },
  {
    n: '02',
    t: 'Estrategia & Diseño',
    d: 'Wireframes, mockups y sistema visual. Tú apruebas cada etapa antes de que se construya.',
  },
  {
    n: '03',
    t: 'Desarrollo',
    d: 'Código limpio, optimizado y escalable. SSR, Core Web Vitals y panel autoadministrable incluidos.',
  },
  {
    n: '04',
    t: 'Lanzamiento',
    d: 'Deploy, testing de performance y SEO técnico. Entrega con documentación y capacitación.',
  },
];

export default function Process() {
  const leftRef = useGSAPReveal('.proc-left-block', { y: 30, stagger: 0 });
  const stepsRef = useGSAPReveal('.proc-step', { y: 40, stagger: 0.13 });

  return (
    <section id="process" className="sec-proceso">
      <div className="proc-grid">
        <div ref={leftRef} className="proc-left-block">
          <div className="sec-label">Proceso</div>
          <h2 className="sec-h2">
            Así trabajamos,
            <br />
            <em>sin sorpresas</em>
          </h2>
          <p className="sec-sub" style={{ marginBottom: 0 }}>
            Un proceso transparente donde siempre sabes qué viene después. Cada
            sprint con revisión real antes de continuar.
          </p>
        </div>
        <div ref={stepsRef} className="proc-steps">
          {STEPS.map((s) => (
            <div key={s.n} className="proc-step">
              <div className="proc-step-left">
                <div className="proc-num">{s.n}</div>
                <div className="proc-line" />
              </div>
              <div className="proc-step-body">
                <div className="proc-title">{s.t}</div>
                <div className="proc-desc">{s.d}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
