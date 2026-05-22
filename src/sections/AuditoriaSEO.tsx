import { useState } from 'react';

// ── Helpers ─────────────────────────────────────────────────
function scoreColor(n: number | null): string {
  if (n === null || n === undefined) return '#9E9CC8';
  if (n >= 80) return '#06D6A0';
  if (n >= 60) return '#FFC107';
  if (n >= 40) return '#FF9800';
  return '#FF5252';
}
function scoreLabel(n: number): string {
  if (n >= 80) return 'Excelente';
  if (n >= 60) return 'Bueno';
  if (n >= 40) return 'Regular';
  return 'Crítico';
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
// ── ScoreCircle ─────────────────────────────────────────────
function ScoreCircle({ score, label, size = 90 }: { score: number; label: string; size?: number }) {
  const color = scoreColor(score);
  const r = size / 2 - 6;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={6} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={6}
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 1s ease' }}
        />
        <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central"
          style={{ transform: 'rotate(90deg)', transformOrigin: '50% 50%', fill: color,
            fontSize: size < 80 ? 14 : 18, fontFamily: 'Syne, sans-serif', fontWeight: 800 }}>
          {score}
        </text>
      </svg>
      <span style={{ fontSize: '0.7rem', color: '#9E9CC8', textAlign: 'center',
        letterSpacing: '0.05em', textTransform: 'uppercase', fontWeight: 600 }}>
        {label}
      </span>
    </div>
  );
}

// ── ScoreBadge ──────────────────────────────────────────────
function ScoreBadge({ score }: { score: number }) {
  const color = scoreColor(score);
  const label = scoreLabel(score);
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      background: `${color}15`, border: `1.5px solid ${color}40`,
      borderRadius: 100, padding: '0.5rem 1.2rem',
    }}>
      <span style={{
        width: 10, height: 10, borderRadius: '50%', background: color,
        boxShadow: `0 0 8px ${color}`, display: 'inline-block',
      }} />
      <span style={{ color, fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        {label}
      </span>
    </div>
  );
}

// ── SimpleCheck ─────────────────────────────────────────────
function SimpleCheck({ ok, label, badText, goodText }: { ok: boolean; label: string; badText?: string; goodText?: string }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10, padding: '0.7rem 1rem',
      background: ok ? 'rgba(6,214,160,0.06)' : 'rgba(255,82,82,0.06)',
      border: `1px solid ${ok ? 'rgba(6,214,160,0.15)' : 'rgba(255,82,82,0.15)'}`,
      borderRadius: 10,
    }}>
      <span style={{ fontSize: '1.1rem' }}>{ok ? '✅' : '⚠️'}</span>
      <div>
        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#F4F3FF' }}>{label}</div>
        <div style={{ fontSize: '0.72rem', color: ok ? '#06D6A0' : '#FF7070' }}>
          {ok ? (goodText || 'Correcto') : (badText || 'Necesita atención')}
        </div>
      </div>
    </div>
  );
}

// ── Componente principal ────────────────────────────────────
export default function AuditoriaSEO() {
  const [url, setUrl] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

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
      // Enviar lead a Formspree
      sendAuditLead({ email, url, data });
    } catch (e) {
      setError('No pudimos analizar ese sitio. Verifica que la URL sea correcta e intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const sendAuditLead = async (payload: { email: string; url: string; data: any }) => {
    try {
      const d = payload.data;
      const mob = d?.pagespeed?.mobile?.scores;
      const meta = d?.meta;
      const srv = d?.server;
      const robots = d?.robots;
      const sitemap = d?.sitemap;
      const gScore = d ? calcGlobalScore(d) : 0;

      const scoreLine = (label: string, val: number | null) =>
        val != null ? `${label}: ${val}/100` : `${label}: N/D`;

      const checkLine = (label: string, ok: boolean, detail?: string) =>
        ok ? `✅ ${label}${detail ? ': ' + detail : ''}` : `❌ ${label}${detail ? ': ' + detail : ' — necesita atención'}`;

      const message = `
🔍 NUEVA AUDITORÍA SEO GRATUITA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 SCORE GLOBAL: ${gScore}/100 — ${scoreLabel(gScore)}

📈 SCORES PAGESPEED (Mobile):
${scoreLine('Performance', mob?.performance)}
${scoreLine('SEO', mob?.seo)}
${scoreLine('Accesibilidad', mob?.accessibility)}
${scoreLine('Best Practices', mob?.bestPractices)}

🔎 ANÁLISIS TÉCNICO:
${checkLine('Title tag', meta?.title?.ok, meta?.title?.value ? `${meta.title.length} chars` : undefined)}
${checkLine('Meta description', meta?.description?.ok, meta?.description?.value ? `${meta.description.length} chars` : undefined)}
${checkLine('H1 correcto', meta?.headings?.h1ok, `${meta?.headings?.h1 || 0} H1`)}
${checkLine('Imágenes con alt', meta?.imgsNoAlt?.ok, meta?.imgsNoAlt?.count > 0 ? `${meta.imgsNoAlt.count} sin alt` : undefined)}
${checkLine('URL canónica', meta?.canonical?.ok)}
${checkLine('Schema.org', meta?.schema?.present)}
${checkLine('HTTPS activo', srv?.https)}
${checkLine('robots.txt', robots?.exists)}
${checkLine('sitemap.xml', sitemap?.exists, sitemap?.urlCount ? `${sitemap.urlCount} URLs` : undefined)}

🌐 DATOS DEL SITIO:
- URL: ${payload.url}
- Plataforma: ${meta?.platform || 'Desconocida'}
- TTFB: ${srv?.responseTime ? srv.responseTime + 'ms' : 'N/D'}

📧 PROSPECTO:
- Email: ${payload.email}
      `.trim();

      await fetch('https://formspree.io/f/mredkeor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          subject: `🔍 Auditoría SEO — ${payload.url} — Score ${gScore}/100`,
          email: payload.email,
          url_analizada: payload.url,
          score_global: gScore,
          message,
        }),
      });
    } catch { /* silent */ }
  };

  // Calcular score global (0-100)
  const calcGlobalScore = (data: any): number => {
    if (!data) return 0;
    const mob = data.pagespeed?.mobile?.scores;
    const meta = data.meta;
    const srv = data.server;
    const robots = data.robots;
    const sitemap = data.sitemap;

    let score = 0;
    // Performance mobile (30%)
    score += (mob?.performance || 0) * 0.30;
    // SEO score (20%)
    score += (mob?.seo || 0) * 0.20;
    // Meta básicos (20%)
    if (meta?.title?.ok) score += 5;
    if (meta?.description?.ok) score += 5;
    if (meta?.headings?.h1ok) score += 5;
    if (meta?.canonical?.ok) score += 5;
    // Técnico (20%)
    if (srv?.https) score += 5;
    if (srv?.hsts) score += 3;
    if (srv?.xContentType) score += 3;
    if (srv?.xFrame) score += 3;
    if (srv?.compression) score += 3;
    if (robots?.exists) score += 3;
    // Sitemap (10%)
    if (sitemap?.exists) score += 5;
    if (sitemap?.isXml) score += 5;

    return Math.round(score);
  };

  const r = result;
  const globalScore = r ? calcGlobalScore(r) : 0;
  const mob = r?.pagespeed?.mobile;
  // const des = r?.pagespeed?.desktop;
  const meta = r?.meta;
  const srv = r?.server;
  const robots = r?.robots;
  const sitemap = r?.sitemap;

  // Contar problemas críticos
  const criticalIssues = r ? [
    !meta?.title?.ok,
    !meta?.description?.ok,
    meta?.headings?.h1 !== 1,
    meta?.imgsNoAlt?.count > 0,
    !meta?.canonical?.ok,
    !meta?.schema?.present,
    !robots?.exists,
    !sitemap?.exists,
    !srv?.https,
    (mob?.scores?.performance || 0) < 50,
  ].filter(Boolean).length : 0;

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
          Análisis instantáneo de tu SEO, velocidad y seguridad. Descubre qué te está
          haciendo perder clientes — y cómo arreglarlo.
        </p>
      </div>

      {/* Formulario */}
      <div className="audit-form-wrap">
        <div className="audit-form-title">Análisis SEO en segundos</div>
        <div className="audit-form-sub">
          Ingresa tu sitio y recibe un diagnóstico completo al instante.
        </div>

        <div className="audit-inputs">
          <input
            className="audit-inp"
            placeholder="https://tusitio.cl"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && run()}
          />
          <input
            className="audit-inp"
            placeholder="Tu email *"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button className="audit-btn" onClick={run} disabled={loading || !url || !email}>
            {loading ? (
              <><span className="audit-spinner" /> Analizando…</>
            ) : (
              'Analizar mi sitio gratis →'
            )}
          </button>

          <div className="audit-trust">
            <span>✓ Gratis</span>
            <span>✓ Sin spam</span>
            <span>✓ 6 fuentes de datos</span>
          </div>
        </div>

        {error && <div className="audit-error">{error}</div>}
      </div>

      {/* ── RESULTADO SIMPLIFICADO ── */}
      {result && (
        <div className="audit-result-wrap">

          {/* SCORE GLOBAL DESTACADO */}
          <div className="audit-result-header" style={{ flexDirection: 'column', textAlign: 'center', gap: '1.5rem' }}>
            <div>
              <div className="audit-result-domain">{r.domain}</div>
              <div className="audit-result-date">
                Analizado el{' '}
                {new Date(r.timestamp).toLocaleDateString('es-CL', {
                  day: '2-digit', month: 'long', year: 'numeric',
                  hour: '2-digit', minute: '2-digit',
                })}
              </div>
            </div>

            {/* Score grande y llamativo */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
              <ScoreCircle score={globalScore} label="Score SEO" size={120} />
              <ScoreBadge score={globalScore} />
            </div>

            {/* Mensaje persuasivo según score */}
            <div style={{
              background: globalScore < 60 ? 'rgba(255,82,82,0.08)' : 'rgba(6,214,160,0.08)',
              border: `1px solid ${globalScore < 60 ? 'rgba(255,82,82,0.2)' : 'rgba(6,214,160,0.2)'}`,
              borderRadius: 14, padding: '1rem 1.5rem', maxWidth: 480,
            }}>
              <p style={{
                fontSize: '0.9rem', lineHeight: 1.6,
                color: globalScore < 60 ? '#FF9E9E' : '#7EE9C6',
                margin: 0,
              }}>
                {globalScore < 40
                  ? `⚠️ ${r.domain} tiene problemas graves que están haciendo que pierdas clientes todos los días. Necesita atención inmediata.`
                  : globalScore < 60
                    ? `📉 ${r.domain} tiene varias áreas de mejora. Corregirlas podría aumentar significativamente tu tráfico orgánico.`
                    : globalScore < 80
                      ? `👍 ${r.domain} está bien, pero aún hay oportunidades para superar a tu competencia en Google.`
                      : `🎉 ¡Excelente! ${r.domain} está muy bien optimizado. Pocos sitios llegan a este nivel.`}
              </p>
            </div>

            {/* Contador de problemas */}
            {criticalIssues > 0 && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: 'rgba(255,152,0,0.08)', border: '1px solid rgba(255,152,0,0.2)',
                borderRadius: 100, padding: '0.4rem 1rem',
              }}>
                <span style={{ fontSize: '1rem' }}>🔧</span>
                <span style={{ fontSize: '0.8rem', color: '#FFB74D', fontWeight: 600 }}>
                  {criticalIssues} {criticalIssues === 1 ? 'problema crítico' : 'problemas críticos'} detectados
                </span>
              </div>
            )}
          </div>

          {/* ── SCORES INDIVIDUALES ── */}
          <div style={{ padding: '1.5rem 2.5rem', borderBottom: '1px solid rgba(168,85,247,0.12)' }}>
            <div className="audit-section-title" style={{ textAlign: 'center', marginBottom: '1rem' }}>
              Puntuación por área
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
              <ScoreCircle score={mob?.scores?.performance || 0} label="Velocidad" size={72} />
              <ScoreCircle score={mob?.scores?.seo || 0} label="SEO" size={72} />
              <ScoreCircle score={mob?.scores?.accessibility || 0} label="Accesibilidad" size={72} />
              <ScoreCircle score={mob?.scores?.bestPractices || 0} label="Buenas prácticas" size={72} />
            </div>
          </div>

          {/* ── CHECKLIST RÁPIDO ── */}
          <div className="audit-tab-content" style={{ paddingBottom: '1rem' }}>
            <div className="audit-section-title">Diagnóstico rápido</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.7rem' }}>
              <SimpleCheck
                ok={meta?.title?.ok}
                label="Title tag"
                badText={meta?.title?.value ? `${meta.title.length} chars (ideal: 50–60)` : 'No detectado'}
                goodText={`${meta?.title?.length || 0} chars ✓`}
              />
              <SimpleCheck
                ok={meta?.description?.ok}
                label="Meta description"
                badText={meta?.description?.value ? `${meta.description.length} chars` : 'No detectada'}
                goodText="✓"
              />
              <SimpleCheck
                ok={meta?.headings?.h1ok}
                label="Estructura H1"
                badText={`${meta?.headings?.h1 || 0} H1 encontrados`}
                goodText="1 H1 correcto"
              />
              <SimpleCheck
                ok={meta?.imgsNoAlt?.ok}
                label="Imágenes con alt"
                badText={`${meta?.imgsNoAlt?.count || 0} sin alt`}
                goodText="Todas con alt"
              />
              <SimpleCheck
                ok={meta?.canonical?.ok}
                label="URL canónica"
                badText="Falta canonical"
                goodText="Presente"
              />
              <SimpleCheck
                ok={meta?.schema?.present}
                label="Schema.org"
                badText="No detectado"
                goodText="Datos estructurados activos"
              />
              <SimpleCheck
                ok={srv?.https}
                label="HTTPS seguro"
                badText="Sin HTTPS"
                goodText="Conexión segura"
              />
              <SimpleCheck
                ok={robots?.exists}
                label="robots.txt"
                badText="No encontrado"
                goodText="Accesible"
              />
              <SimpleCheck
                ok={sitemap?.exists}
                label="Sitemap.xml"
                badText="No encontrado"
                goodText={`${sitemap?.urlCount || 0} URLs indexadas`}
              />
              <SimpleCheck
                ok={meta?.viewport?.present}
                label="Responsive"
                badText="Sin viewport"
                goodText="Mobile-friendly"
              />
            </div>
          </div>

          {/* ── CORE WEB VITALS ── */}
          {mob && (
            <div style={{ padding: '0 2.5rem 1.5rem', borderBottom: '1px solid rgba(168,85,247,0.12)' }}>
              <div className="audit-section-title">Velocidad real (Mobile)</div>
              <div className="audit-vitals-grid">
                {[
                  { key: 'lcp', label: 'LCP', hint: 'Carga principal', val: mob.vitals_raw?.lcp, disp: mob.vitals.lcp },
                  { key: 'cls', label: 'CLS', hint: 'Estabilidad', val: mob.vitals_raw?.cls, disp: mob.vitals.cls },
                  { key: 'fcp', label: 'FCP', hint: 'Primera pintura', val: mob.vitals_raw?.fcp, disp: mob.vitals.fcp },
                  { key: 'ttfb', label: 'TTFB', hint: 'Resp. servidor', val: mob.vitals_raw?.ttfb, disp: mob.vitals.ttfb },
                ].map((v) => (
                  <div key={v.key} className="audit-vital-card">
                    <div className="audit-vital-label">{v.label}</div>
                    <div className="audit-vital-hint">{v.hint}</div>
                    <div className="audit-vital-val" style={{ color: v.val !== null ? vitalColor(v.key, v.val) : '#9E9CC8' }}>
                      {v.disp || '—'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── CTA FINAL ── */}
          <div className="audit-cta-box">
            <div className="audit-cta-title">
              {globalScore < 60
                ? '¿Quieres que arreglemos esto por ti?'
                : '¿Quieres llegar al 100%?'}
            </div>
            <p className="audit-cta-sub">
              {globalScore < 60
                ? `Tu sitio pierde clientes cada día que estos problemas no se arreglan. Te preparamos un plan de acción sin costo.`
                : 'Incluso los mejores sitios tienen margen de mejora. Te mostramos cómo superar a tu competencia.'}
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
