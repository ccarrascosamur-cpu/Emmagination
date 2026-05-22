import { useState } from 'react';

// ── Helpers de semáforo ─────────────────────────────────────────────────
function scoreColor(n: number | null): string {
  if (n === null || n === undefined) return '#9E9CC8';
  if (n >= 75) return '#06D6A0';
  if (n >= 50) return '#FFC107';
  return '#FF5252';
}
function vitalColor(key: string, val: number | null): string {
  if (val === null || val === undefined) return '#9E9CC8';
  const thresholds: Record<string, [number, number]> = {
    lcp: [2500, 4000],
    cls: [0.1, 0.25],
    fcp: [1800, 3000],
    ttfb: [800, 1800],
  };
  const t = thresholds[key];
  if (!t) return '#9E9CC8';
  if (val <= t[0]) return '#06D6A0';
  if (val <= t[1]) return '#FFC107';
  return '#FF5252';
}
function boolIcon(ok: boolean): string {
  return ok ? '✓' : '✗';
}
function boolColor(ok: boolean): string {
  return ok ? '#06D6A0' : '#FF5252';
}

// ── ScoreCircle ─────────────────────────────────────────────────────────
function ScoreCircle({ score, label, size = 80 }: { score: number | null; label: string; size?: number }) {
  if (score === null || score === undefined) return null;
  const color = scoreColor(score);
  const r = size / 2 - 6;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={5} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={5}
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 1s ease' }}
        />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="central"
          style={{
            transform: 'rotate(90deg)',
            transformOrigin: '50% 50%',
            fill: color,
            fontSize: size < 70 ? 13 : 16,
            fontFamily: 'Syne, sans-serif',
            fontWeight: 800,
          }}
        >
          {score}
        </text>
      </svg>
      <span
        style={{
          fontSize: '0.68rem',
          color: '#9E9CC8',
          textAlign: 'center',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          fontWeight: 600,
        }}
      >
        {label}
      </span>
    </div>
  );
}

// ── MetaRow ─────────────────────────────────────────────────────────────
function MetaRow({ label, ok, value, note }: { label: string; ok: boolean; value?: string | null; note?: string | null }) {
  return (
    <div className="audit-meta-row">
      <span className="audit-meta-icon" style={{ color: boolColor(ok) }}>
        {boolIcon(ok)}
      </span>
      <div className="audit-meta-content">
        <span className="audit-meta-label">{label}</span>
        {value && <span className="audit-meta-value">{value}</span>}
        {note && <span className="audit-meta-note">{note}</span>}
      </div>
    </div>
  );
}

// ── Componente principal ─────────────────────────────────────────────────
export default function AuditoriaSEO() {
  const [url, setUrl] = useState('');
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [, setLeadSent] = useState(false);
  const [tab, setTab] = useState('rendimiento');

  const run = async () => {
    if (!url || !email) return;
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const res = await fetch(`/api/seo-audit?url=${encodeURIComponent(url)}`);
      if (!res.ok) throw new Error('Error en el análisis');
      const data = await res.json();
      setResult(data);
      // Enviar lead automáticamente a Formspree
      sendAuditLead({ nombre, email, empresa, url, scores: data.pagespeed })
        .then(() => setLeadSent(true))
        .catch(() => {});
    } catch (e) {
      setError('No pudimos analizar ese sitio. Verifica que la URL sea correcta e intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const sendAuditLead = async (payload: { nombre: string; email: string; empresa: string; url: string; scores: any }) => {
    const scoresSummary = payload.scores
      ? `Performance Mobile: ${payload.scores.mobile?.scores?.performance ?? 'N/A'}/100 | ` +
        `SEO: ${payload.scores.mobile?.scores?.seo ?? 'N/A'}/100 | ` +
        `Performance Desktop: ${payload.scores.desktop?.scores?.performance ?? 'N/A'}/100`
      : 'No disponible';

    const body = {
      subject: `🔍 Nueva auditoría SEO — ${payload.url}`,
      name: payload.nombre || 'Prospecto',
      email: payload.email,
      empresa: payload.empresa || 'No indicada',
      url_analizada: payload.url,
      message: `
Nuevo lead desde la auditoría SEO gratuita de emmagination.cl

DATOS DEL PROSPECTO:
- Nombre: ${payload.nombre || 'No indicado'}
- Email: ${payload.email}
- Empresa: ${payload.empresa || 'No indicada'}
- URL analizada: ${payload.url}

RESULTADOS DEL ANÁLISIS:
${scoresSummary}

Este lead fue capturado automáticamente desde el módulo de auditoría.
      `.trim(),
    };

    const res = await fetch('https://formspree.io/f/mredkeor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body),
    });

    return res.ok;
  };

  const r = result;
  const mob = r?.pagespeed?.mobile;
  const des = r?.pagespeed?.desktop;
  const meta = r?.meta;
  const srv = r?.server;
  const robots = r?.robots;
  const sitemap = r?.sitemap;

  return (
    <section id="auditoria" className="sec-auditoria">
      {/* Header */}
      <div className="audit-header">
        <div className="sec-label">Auditoría gratuita</div>
        <h2 className="sec-h2">
          ¿Cómo está tu sitio
          <br />
          <em>en Google hoy?</em>
        </h2>
        <p className="sec-sub">
          Análisis real con 6 fuentes: PageSpeed, SEO técnico, meta tags,
          seguridad HTTPS, robots.txt y sitemap. Sin registro. Sin costo.
        </p>
      </div>

      {/* Formulario */}
      <div className="audit-form-wrap">
        <div className="audit-form-title">Análisis SEO instantáneo</div>
        <div className="audit-form-sub">
          Ingresa tu sitio y te mostramos un diagnóstico completo en segundos.
        </div>

        <div className="audit-inputs">
          <input
            className="audit-inp"
            placeholder="https://tusitio.cl"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && run()}
          />
          <div className="audit-inp-row">
            <input
              className="audit-inp"
              placeholder="Tu nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
            <input
              className="audit-inp"
              placeholder="Email de contacto *"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <input
            className="audit-inp"
            placeholder="Empresa / marca (opcional)"
            value={empresa}
            onChange={(e) => setEmpresa(e.target.value)}
          />

          <button className="audit-btn" onClick={run} disabled={loading || !url || !email}>
            {loading ? (
              <>
                <span className="audit-spinner" /> Analizando tu sitio…
              </>
            ) : (
              'Analizar mi sitio gratis →'
            )}
          </button>

          <div className="audit-trust">
            <span>✓ 100% gratuito</span>
            <span>✓ Sin spam</span>
            <span>✓ Resultado en segundos</span>
            <span>✓ 6 fuentes de análisis</span>
          </div>
        </div>

        {error && <div className="audit-error">{error}</div>}
      </div>

      {/* RESULTADO */}
      {result && (
        <div className="audit-result-wrap">
          {/* Encabezado del resultado */}
          <div className="audit-result-header">
            <div>
              <div className="audit-result-domain">{r.domain}</div>
              <div className="audit-result-date">
                Analizado el{' '}
                {new Date(r.timestamp).toLocaleDateString('es-CL', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
              {meta?.platform && (
                <div className="audit-platform-badge">
                  Plataforma detectada: <strong>{meta.platform}</strong>
                </div>
              )}
            </div>
            <div className="audit-scores-row">
              <ScoreCircle score={mob?.scores?.performance} label="Perf Mobile" />
              <ScoreCircle score={des?.scores?.performance} label="Perf Desktop" />
              <ScoreCircle score={mob?.scores?.seo} label="SEO" />
              <ScoreCircle score={mob?.scores?.accessibility} label="Accesib." size={68} />
              <ScoreCircle score={mob?.scores?.bestPractices} label="Best Pract." size={68} />
            </div>
          </div>

          {/* Tabs */}
          <div className="audit-tabs">
            {(['rendimiento', 'seo', 'tecnico', 'oportunidades'] as const).map((t) => (
              <button
                key={t}
                className={`audit-tab${tab === t ? ' audit-tab-on' : ''}`}
                onClick={() => setTab(t)}
              >
                {
                  {
                    rendimiento: '⚡ Rendimiento',
                    seo: '🔍 SEO & Meta',
                    tecnico: '🔒 Técnico',
                    oportunidades: '💡 Oportunidades',
                  }[t]
                }
              </button>
            ))}
          </div>

          {/* ── TAB: RENDIMIENTO ── */}
          {tab === 'rendimiento' && mob && (
            <div className="audit-tab-content">
              <div className="audit-section-title">Core Web Vitals (Mobile)</div>
              <div className="audit-vitals-grid">
                {[
                  { key: 'lcp', label: 'LCP', hint: 'Carga principal', val: mob.vitals_raw?.lcp, disp: mob.vitals.lcp, unit: 'ms', good: 2500, med: 4000 },
                  { key: 'cls', label: 'CLS', hint: 'Estabilidad visual', val: mob.vitals_raw?.cls, disp: mob.vitals.cls, unit: '', good: 0.1, med: 0.25 },
                  { key: 'fcp', label: 'FCP', hint: 'Primera pintura', val: mob.vitals_raw?.fcp, disp: mob.vitals.fcp, unit: 'ms', good: 1800, med: 3000 },
                  { key: 'ttfb', label: 'TTFB', hint: 'Resp. servidor', val: mob.vitals_raw?.ttfb, disp: mob.vitals.ttfb, unit: 'ms', good: 800, med: 1800 },
                  { key: 'tbt', label: 'TBT', hint: 'Bloqueo total', val: null, disp: mob.vitals.tbt, unit: 'ms', good: 200, med: 600 },
                  { key: 'si', label: 'SI', hint: 'Speed Index', val: null, disp: mob.vitals.si, unit: 'ms', good: 3400, med: 5800 },
                ].map((v) => (
                  <div key={v.key} className="audit-vital-card">
                    <div className="audit-vital-label">{v.label}</div>
                    <div className="audit-vital-hint">{v.hint}</div>
                    <div
                      className="audit-vital-val"
                      style={{ color: v.val !== null ? vitalColor(v.key, v.val) : '#9E9CC8' }}
                    >
                      {v.disp || '—'}
                    </div>
                    <div
                      className="audit-vital-status"
                      style={{ color: v.val !== null ? vitalColor(v.key, v.val) : '#5C5A8A' }}
                    >
                      {v.val !== null
                        ? v.val <= v.good
                          ? 'Bueno'
                          : v.val <= v.med
                            ? 'Mejorable'
                            : 'Crítico'
                        : 'N/D'}
                    </div>
                  </div>
                ))}
              </div>

              {des && (
                <>
                  <div className="audit-section-title" style={{ marginTop: '2rem' }}>
                    Scores comparativos
                  </div>
                  <div className="audit-compare-grid">
                    {[
                      ['Performance', mob.scores.performance, des.scores.performance],
                      ['SEO', mob.scores.seo, des.scores.seo],
                      ['Accesibilidad', mob.scores.accessibility, des.scores.accessibility],
                      ['Best Practices', mob.scores.bestPractices, des.scores.bestPractices],
                    ].map(([label, m, d]) => (
                      <div key={String(label)} className="audit-compare-row">
                        <span className="audit-compare-label">{String(label)}</span>
                        <div className="audit-compare-bars">
                          <div className="audit-bar-wrap">
                            <span className="audit-bar-tag">📱</span>
                            <div className="audit-bar-track">
                              <div
                                className="audit-bar-fill"
                                style={{ width: `${m}%`, background: scoreColor(m) }}
                              />
                            </div>
                            <span className="audit-bar-num" style={{ color: scoreColor(m) }}>
                              {m}
                            </span>
                          </div>
                          <div className="audit-bar-wrap">
                            <span className="audit-bar-tag">🖥</span>
                            <div className="audit-bar-track">
                              <div
                                className="audit-bar-fill"
                                style={{ width: `${d}%`, background: scoreColor(d) }}
                              />
                            </div>
                            <span className="audit-bar-num" style={{ color: scoreColor(d) }}>
                              {d}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* ── TAB: SEO & META ── */}
          {tab === 'seo' && meta && (
            <div className="audit-tab-content">
              <div className="audit-section-title">Meta Tags & Contenido</div>
              <div className="audit-meta-list">
                <MetaRow
                  label="Title tag"
                  ok={meta.title?.ok}
                  value={
                    meta.title?.value ? `"${meta.title.value.slice(0, 80)}"` : 'No detectado'
                  }
                  note={
                    meta.title?.value
                      ? `${meta.title.length} caracteres ${meta.title.ok ? '(✓ ideal)' : '(ideal: 50–65)'}`
                      : 'Crítico: el title es fundamental para SEO'
                  }
                />
                <MetaRow
                  label="Meta description"
                  ok={meta.description?.ok}
                  value={
                    meta.description?.value ? `"${meta.description.value.slice(0, 120)}…"` : 'No detectada'
                  }
                  note={
                    meta.description?.value
                      ? `${meta.description.length} caracteres ${meta.description.ok ? '(✓ ideal)' : '(ideal: 150–165)'}`
                      : 'Falta: Google puede usar texto aleatorio de la página'
                  }
                />
                <MetaRow
                  label="H1"
                  ok={meta.headings?.h1ok}
                  note={`Se encontraron ${meta.headings?.h1} H1 ${meta.headings?.h1ok ? '(✓ correcto)' : meta.headings?.h1 === 0 ? '— Falta el H1 principal' : '— Debe haber exactamente 1'}`}
                />
                <MetaRow
                  label="Estructura de headings"
                  ok={meta.headings?.h2 > 0}
                  note={`H2: ${meta.headings?.h2} · H3: ${meta.headings?.h3}`}
                />
                <MetaRow
                  label="Imágenes sin alt"
                  ok={meta.imgsNoAlt?.ok}
                  note={
                    meta.imgsNoAlt?.ok
                      ? 'Todas las imágenes tienen atributo alt ✓'
                      : `${meta.imgsNoAlt?.count} imágenes sin alt — afecta SEO y accesibilidad`
                  }
                />
                <MetaRow
                  label="URL canónica"
                  ok={meta.canonical?.ok}
                  value={meta.canonical?.value || null}
                  note={meta.canonical?.ok ? null : 'Sin canonical: riesgo de contenido duplicado'}
                />
                <MetaRow
                  label="Schema.org (datos estructurados)"
                  ok={meta.schema?.present}
                  note={
                    meta.schema?.present
                      ? 'JSON-LD detectado ✓ — mejora rich snippets en Google'
                      : 'No detectado — oportunidad para rich results en Google'
                  }
                />
                <MetaRow label="Viewport responsive" ok={meta.viewport?.present} />
              </div>

              <div className="audit-section-title" style={{ marginTop: '2rem' }}>
                Open Graph (Redes Sociales)
              </div>
              <div className="audit-meta-list">
                <MetaRow
                  label="og:title"
                  ok={meta.og?.title}
                  note={meta.og?.title ? null : 'Sin og:title — el link no se verá bien al compartir'}
                />
                <MetaRow
                  label="og:description"
                  ok={meta.og?.description}
                  note={meta.og?.description ? null : 'Sin og:description'}
                />
                <MetaRow
                  label="og:image"
                  ok={meta.og?.image}
                  note={meta.og?.image ? null : 'Sin og:image — el link aparecerá sin imagen en redes'}
                />
              </div>
            </div>
          )}

          {/* ── TAB: TÉCNICO ── */}
          {tab === 'tecnico' && (
            <div className="audit-tab-content">
              <div className="audit-section-title">Seguridad & HTTPS</div>
              <div className="audit-meta-list">
                <MetaRow
                  label="HTTPS activo"
                  ok={srv?.https}
                  note={srv?.https ? 'Conexión segura ✓' : '⚠ Sin HTTPS — Google penaliza sitios inseguros'}
                />
                <MetaRow
                  label="HSTS"
                  ok={srv?.hsts}
                  note={srv?.hsts ? 'Strict-Transport-Security activo ✓' : 'Sin HSTS — recomendado para seguridad'}
                />
                <MetaRow
                  label="X-Content-Type"
                  ok={srv?.xContentType}
                  note={srv?.xContentType ? 'Header de seguridad presente ✓' : 'Falta header X-Content-Type-Options'}
                />
                <MetaRow
                  label="X-Frame-Options"
                  ok={srv?.xFrame}
                  note={srv?.xFrame ? 'Protección contra clickjacking ✓' : 'Sin X-Frame-Options'}
                />
                {srv?.server && <MetaRow label="Servidor" ok={true} note={`Detectado: ${srv.server}`} />}
                {srv?.compression && (
                  <MetaRow
                    label="Compresión"
                    ok={true}
                    note={`${srv.compression} activo ✓ — reduce el peso de transferencia`}
                  />
                )}
              </div>

              <div className="audit-section-title" style={{ marginTop: '2rem' }}>
                robots.txt
              </div>
              <div className="audit-meta-list">
                <MetaRow
                  label="robots.txt existe"
                  ok={robots?.exists}
                  note={robots?.exists ? null : 'No encontrado — Google puede ignorar instrucciones de rastreo'}
                />
                <MetaRow
                  label="No bloquea Googlebot"
                  ok={!robots?.blocksAll}
                  note={
                    robots?.blocksAll
                      ? '⚠ El robots.txt bloquea todo el sitio — crítico'
                      : robots?.exists
                        ? 'Acceso correcto para bots ✓'
                        : null
                  }
                />
                <MetaRow
                  label="Referencia a Sitemap"
                  ok={robots?.hasSitemapRef}
                  note={robots?.sitemapUrl || null}
                />
              </div>

              <div className="audit-section-title" style={{ marginTop: '2rem' }}>
                sitemap.xml
              </div>
              <div className="audit-meta-list">
                <MetaRow
                  label="Sitemap encontrado"
                  ok={sitemap?.exists}
                  note={
                    sitemap?.exists
                      ? sitemap.url
                      : 'No encontrado — Google puede tardar más en indexar páginas nuevas'
                  }
                />
                {sitemap?.exists && <MetaRow label="Formato XML válido" ok={sitemap?.isXml} />}
                {sitemap?.urlCount > 0 && (
                  <MetaRow label="URLs en el sitemap" ok={true} note={`${sitemap.urlCount} URLs incluidas`} />
                )}
              </div>

              <div className="audit-section-title" style={{ marginTop: '2rem' }}>
                Tiempo de respuesta
              </div>
              <div className="audit-meta-list">
                <MetaRow
                  label="TTFB (servidor)"
                  ok={(srv?.responseTime || 9999) < 800}
                  note={
                    srv?.responseTime
                      ? `${srv.responseTime}ms ${srv.responseTime < 800 ? '(✓ rápido)' : srv.responseTime < 1800 ? '(mejorable)' : '(⚠ lento)'}`
                      : null
                  }
                />
                <MetaRow label="Status HTTP" ok={srv?.status === 200} note={`HTTP ${srv?.status || '—'}`} />
              </div>
            </div>
          )}

          {/* ── TAB: OPORTUNIDADES ── */}
          {tab === 'oportunidades' && (
            <div className="audit-tab-content">
              <div className="audit-section-title">Mejoras detectadas por PageSpeed</div>
              {mob?.opportunities?.length > 0 ? (
                <div className="audit-opps-list">
                  {mob.opportunities.map((o: any, i: number) => (
                    <div key={i} className="audit-opp-item">
                      <span className="audit-opp-icon">💡</span>
                      <div className="audit-opp-content">
                        <div className="audit-opp-title">{o.title}</div>
                        {o.savings && <div className="audit-opp-savings">Ahorro estimado: {o.savings}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="audit-no-opps">
                  ✓ No se detectaron oportunidades críticas de mejora en PageSpeed.
                </div>
              )}

              {/* Resumen de problemas encontrados */}
              <div className="audit-section-title" style={{ marginTop: '2rem' }}>
                Resumen de problemas detectados
              </div>
              <div className="audit-issues-list">
                {[
                  { cond: !meta?.title?.ok, msg: 'Title tag ausente o mal optimizado' },
                  { cond: !meta?.description?.ok, msg: 'Meta description ausente o fuera de rango' },
                  { cond: !meta?.headings?.h1ok, msg: `${meta?.headings?.h1 === 0 ? 'Falta el H1' : 'Múltiples H1 detectados'}` },
                  { cond: meta?.imgsNoAlt?.count > 0, msg: `${meta?.imgsNoAlt?.count} imágenes sin atributo alt` },
                  { cond: !meta?.canonical?.ok, msg: 'Sin URL canónica — riesgo de contenido duplicado' },
                  { cond: !meta?.schema?.present, msg: 'Sin Schema.org — sin opción de rich results en Google' },
                  { cond: !meta?.og?.image, msg: 'Sin og:image — links sin imagen en redes sociales' },
                  { cond: !robots?.exists, msg: 'robots.txt no encontrado' },
                  { cond: !sitemap?.exists, msg: 'sitemap.xml no encontrado' },
                  { cond: !srv?.hsts, msg: 'Sin HSTS — seguridad HTTPS mejorable' },
                  { cond: mob?.scores?.performance < 50, msg: `Performance mobile crítica (${mob?.scores?.performance}/100)` },
                  { cond: mob?.scores?.seo < 75, msg: `Score SEO mejorable (${mob?.scores?.seo}/100)` },
                ]
                  .filter((i) => i.cond)
                  .map((issue, idx) => (
                    <div key={idx} className="audit-issue-item">
                      <span style={{ color: '#FF5252' }}>✗</span>
                      <span>{issue.msg}</span>
                    </div>
                  ))}
                {[
                  { cond: meta?.title?.ok, msg: 'Title tag bien optimizado' },
                  { cond: meta?.description?.ok, msg: 'Meta description correcta' },
                  { cond: meta?.headings?.h1ok, msg: 'Estructura H1 correcta' },
                  { cond: meta?.schema?.present, msg: 'Schema.org presente' },
                  { cond: srv?.https, msg: 'HTTPS activo' },
                  { cond: robots?.exists, msg: 'robots.txt encontrado' },
                  { cond: sitemap?.exists, msg: 'sitemap.xml encontrado' },
                  { cond: mob?.scores?.performance >= 75, msg: `Performance mobile buena (${mob?.scores?.performance}/100)` },
                ]
                  .filter((i) => i.cond)
                  .map((item, idx) => (
                    <div key={idx} className="audit-issue-item">
                      <span style={{ color: '#06D6A0' }}>✓</span>
                      <span>{item.msg}</span>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* CTA POST-ANÁLISIS */}
          <div className="audit-cta-box">
            <div className="audit-cta-title">¿Quieres que Emmagination corrija estos problemas?</div>
            <p className="audit-cta-sub">
              Te preparamos un plan de mejoras personalizado sin costo. El análisis es tuyo, la solución también puede serlo.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="#contact" className="audit-cta-btn">
                Quiero mejorar mi sitio →
              </a>
              <a href="#cotizar" className="audit-cta-btn-ghost">
                Cotizar proyecto
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
