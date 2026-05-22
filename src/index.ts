import { defaultSiteData, normalizeSiteData } from './lib/site-data';

const STORAGE_KEY = 'site-data';
const BUILD_TIMESTAMP = new Date().toISOString();

interface WorkerKVNamespace {
  get(key: string, type: 'json'): Promise<unknown | null>;
  put(key: string, value: string): Promise<void>;
}

export interface Env {
  ASSETS: {
    fetch: (request: Request) => Promise<Response>;
  };
  SITE_DATA?: WorkerKVNamespace;
  SITE_ADMIN_USER?: string;
  SITE_ADMIN_PASSWORD?: string;
  GEMINI_API_KEY?: string;
  AI?: {
    run: (model: string, inputs: { prompt: string }) => Promise<{ response?: string }>;
  };
}

// ── Headers anti-cache para API y admin ──
function noCacheHeaders() {
  const headers = new Headers();
  headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  headers.set('Pragma', 'no-cache');
  headers.set('Expires', '0');
  headers.set('Surrogate-Control', 'no-store');
  headers.set('Vary', 'Authorization');
  return headers;
}

// ── Headers anti-cache para HTML estático (SPA) ──
function htmlNoCacheHeaders() {
  const headers = new Headers();
  headers.set('Cache-Control', 'no-cache, must-revalidate');
  headers.set('Pragma', 'no-cache');
  return headers;
}

// ── Headers de seguridad para todas las respuestas ──
function securityHeaders(headers: Headers) {
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('X-Frame-Options', 'DENY');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  headers.set('Permissions-Policy', 'accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()');
  return headers;
}

function json(data: unknown, init: ResponseInit = {}) {
  const headers = noCacheHeaders();
  headers.set('Content-Type', 'application/json; charset=utf-8');
  if (init.headers) {
    const initHeaders = new Headers(init.headers);
    initHeaders.forEach((value, key) => headers.set(key, value));
  }
  return new Response(JSON.stringify(data), { ...init, headers });
}

function base64Encode(str: string): string {
  const bytes = new TextEncoder().encode(str);
  const bin = Array.from(bytes, (b) => String.fromCharCode(b)).join('');
  return btoa(bin);
}

function isAuthorized(request: Request, env: Env) {
  const header = request.headers.get('Authorization') || '';
  if (!header.startsWith('Bearer ')) return false;

  const token = header.slice(7);
  const expectedUser = env.SITE_ADMIN_USER || 'admin';
  const expectedPassword = env.SITE_ADMIN_PASSWORD || 'change-me';
  const expectedToken = base64Encode(`${expectedUser}:${expectedPassword}`);

  return token === expectedToken;
}

async function readStoredData(env: Env) {
  if (!env.SITE_DATA) {
    return normalizeSiteData(defaultSiteData);
  }

  const raw = await env.SITE_DATA.get(STORAGE_KEY, 'json');
  return raw ? normalizeSiteData(raw) : normalizeSiteData(defaultSiteData);
}

async function handleApi(request: Request, env: Env) {
  if (request.method === 'GET') {
    // GET is public — anyone can read site data
    return json(await readStoredData(env));
  }

  if (request.method === 'POST') {
    if (!isAuthorized(request, env)) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!env.SITE_DATA) {
      return json(
        {
          error:
            'Missing KV binding SITE_DATA. Configure a KV namespace before using the admin in production.',
        },
        { status: 500 },
      );
    }

    let payload: unknown;
    try {
      payload = await request.json();
    } catch {
      return json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const normalized = normalizeSiteData(payload);
    await env.SITE_DATA.put(STORAGE_KEY, JSON.stringify(normalized));

    return json(normalized);
  }

  return new Response('Method Not Allowed', {
    status: 405,
    headers: { Allow: 'GET, POST' },
  });
}

async function handleLogin(request: Request, env: Env) {
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405, headers: { Allow: 'POST' } });
  }

  let body: { user?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const expectedUser = env.SITE_ADMIN_USER || 'admin';
  const expectedPassword = env.SITE_ADMIN_PASSWORD || 'change-me';

  // Try env secret first, then fallback to default
  const isValid = (body.user === expectedUser && body.password === expectedPassword) ||
                  (body.user === 'admin' && body.password === 'change-me');

  if (isValid) {
    return json({ ok: true, token: base64Encode(`${body.user}:${body.password}`) });
  }

  return json({ error: 'Invalid credentials' }, { status: 401 });
}

// ── EXTRACT PROJECT FROM URL USING WORKERS AI ──
function slugifyWorker(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function handleExtract(request: Request, env: Env) {
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405, headers: { Allow: 'POST' } });
  }

  // Auth check
  if (!isAuthorized(request, env)) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: { url?: string };
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const targetUrl = body.url?.trim();
  if (!targetUrl) {
    return json({ error: 'URL is required' }, { status: 400 });
  }

  try {
    // 1. Fetch the website HTML
    const siteResponse = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
      },
    });

    if (!siteResponse.ok) {
      return json({ error: `Could not fetch URL: ${siteResponse.status} ${siteResponse.statusText}` }, { status: 502 });
    }

    const html = await siteResponse.text();

    if (!html || html.length < 100) {
      return json({ error: 'URL returned empty or invalid content' }, { status: 502 });
    }

    // Extract basic metadata
    const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : '';

    const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>/i) ||
                      html.match(/<meta[^>]*content=["']([^"']*)["'][^>]*name=["']description["'][^>]*>/i);
    const description = descMatch ? descMatch[1].trim() : '';

    const ogImageMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']*)["'][^>]*>/i) ||
                          html.match(/<meta[^>]*content=["']([^"']*)["'][^>]*property=["']og:image["'][^>]*>/i);
    const ogImage = ogImageMatch ? ogImageMatch[1].trim() : '';

    // 2. Build project object from extracted metadata
    const project = {
      id: Date.now(),
      slug: slugifyWorker(title || 'proyecto'),
      title: title || 'Proyecto sin título',
      client: title || '',
      category: 'Web',
      year: String(new Date().getFullYear()),
      image: ogImage || '/images/isotipo.png',
      url: targetUrl,
      description: description || '',
      excerpt: description || '',
      services: ['Diseño web'],
      featured: false,
      offset: 0,
      challenge: '',
      solution: '',
      results: [],
      gallery: ogImage ? [ogImage] : [],
      seoTitle: title || '',
      seoDescription: description || '',
      pdf: '',
    };

    return json({ project, rawHtml: { title, description, ogImage, htmlLength: html.length } });

  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Extraction failed';
    return json({ error: message }, { status: 500 });
  }
}

// ═══════════════════════════════════════════════════════════════════════════
//  SEO AUDIT — Análisis 100% propio, sin APIs externas (no rate limits)
// ═══════════════════════════════════════════════════════════════════════════

// Calcular scores de rendimiento basados en TTFB y tamaño de página
function calcPerformanceScore(responseTime: number, htmlLength: number): number {
  let score = 65; // base más generosa
  // TTFB scoring (menos penalización)
  if (responseTime < 200) score += 20;
  else if (responseTime < 500) score += 15;
  else if (responseTime < 800) score += 10;
  else if (responseTime < 1500) score += 5;
  else if (responseTime < 3000) score += 0;
  else score -= 10;
  // Page size scoring
  if (htmlLength < 50_000) score += 10;
  else if (htmlLength < 150_000) score += 5;
  else if (htmlLength < 500_000) score += 0;
  else score -= 5;
  return Math.min(100, Math.max(0, score));
}

function calcSeoScore(meta: any): number {
  let score = 55; // base más generosa
  if (meta.title?.ok) score += 12;
  if (meta.description?.ok) score += 12;
  if (meta.headings?.h1ok) score += 8;
  if (meta.canonical?.ok) score += 5;
  if (meta.viewport?.present) score += 5;
  if (meta.imgsNoAlt?.ok) score += 5;
  if (meta.schema?.present) score += 5;
  // Penalizaciones suaves
  if (!meta.title?.value) score -= 15;
  if (!meta.description?.value) score -= 10;
  return Math.min(100, Math.max(0, score));
}

function calcAccessibilityScore(meta: any): number {
  let score = 60; // base más generosa
  if (meta.imgsNoAlt?.ok) score += 15;
  if (meta.viewport?.present) score += 10;
  if (meta.headings?.h1 > 0) score += 10;
  if (meta.headings?.h2 > 0) score += 5;
  return Math.min(100, score);
}

function calcBestPracticesScore(srv: any, meta: any): number {
  let score = 55; // base más generosa
  if (srv?.https) score += 10;
  if (srv?.hsts) score += 5;
  if (srv?.xContentType) score += 5;
  if (srv?.xFrame) score += 5;
  if (srv?.compression) score += 10;
  if (meta?.viewport?.present) score += 5;
  // HTTPS es crítico pero no penalizamos tanto si falta lo demás
  return Math.min(100, score);
}

async function fetchHtmlMeta(url: string) {
  const t0 = Date.now();
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; EmmaginationBot/1.0)' },
    redirect: 'follow',
    cf: { cacheTtl: 60 },
  } as RequestInit);
  const responseTime = Date.now() - t0;
  const html = await res.text();

  const match = (re: RegExp) => { const m = html.match(re); return m ? m[1]?.trim() : null; };
  const matchAll = (re: RegExp) => [...html.matchAll(re)];

  const title = match(/<title[^>]*>([^<]+)<\/title>/i);
  const description = match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i)
                   || match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/i);
  const robots = match(/<meta[^>]+name=["']robots["'][^>]+content=["']([^"']+)["']/i);
  const canonical = match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i);
  const ogTitle = match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i);
  const ogDesc = match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i);
  const ogImage = match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i);
  const generator = match(/<meta[^>]+name=["']generator["'][^>]+content=["']([^"']+)["']/i);

  const h1s = matchAll(/<h1[^>]*>/gi).length;
  const h2s = matchAll(/<h2[^>]*>/gi).length;
  const h3s = matchAll(/<h3[^>]*>/gi).length;
  const imgsNoAlt = matchAll(/<img(?![^>]*alt=["'][^"']+["'])[^>]*>/gi).length;
  const hasSchema = /<script[^>]+type=["']application\/ld\+json["']/i.test(html);
  const hasViewport = /<meta[^>]+name=["']viewport["']/i.test(html);

  let platform = 'Custom / Desconocido';
  if (/shopify/i.test(html)) platform = 'Shopify';
  else if (/wp-content|wordpress/i.test(html)) platform = 'WordPress';
  else if (/wix\.com/i.test(html)) platform = 'Wix';
  else if (/webflow/i.test(html)) platform = 'Webflow';
  else if (/squarespace/i.test(html)) platform = 'Squarespace';
  else if (/tiendanube|jumpseller/i.test(html)) platform = 'Tiendanube / Jumpseller';
  else if (generator) platform = generator;

  return {
    responseTime,
    statusCode: res.status,
    title: { value: title, length: title?.length || 0, ok: (title?.length || 0) >= 30 && (title?.length || 0) <= 65 },
    description: { value: description, length: description?.length || 0, ok: (description?.length || 0) >= 100 && (description?.length || 0) <= 165 },
    robots: { value: robots, ok: !robots || !robots.includes('noindex') },
    canonical: { value: canonical, ok: !!canonical },
    og: { title: !!ogTitle, description: !!ogDesc, image: !!ogImage },
    headings: { h1: h1s, h2: h2s, h3: h3s, h1ok: h1s === 1 },
    imgsNoAlt: { count: imgsNoAlt, ok: imgsNoAlt === 0 },
    schema: { present: hasSchema },
    viewport: { present: hasViewport },
    platform,
  };
}

async function fetchRobots(domain: string) {
  const url = `${domain}/robots.txt`;
  try {
    const res = await fetch(url, { cf: { cacheTtl: 300 } } as RequestInit);
    if (!res.ok) return { exists: false, ok: false };
    const text = await res.text();
    const blocksAll = /Disallow:\s*\//m.test(text) && /User-agent:\s*\*/m.test(text);
    const hasSitemapRef = /Sitemap:/i.test(text);
    const sitemapUrl = text.match(/Sitemap:\s*(.+)/i)?.[1]?.trim() || null;
    return { exists: true, ok: !blocksAll, blocksAll, hasSitemapRef, sitemapUrl };
  } catch {
    return { exists: false, ok: false, error: true };
  }
}

async function fetchSitemap(domain: string) {
  const candidates = [
    `${domain}/sitemap.xml`,
    `${domain}/sitemap_index.xml`,
    `${domain}/sitemap/sitemap.xml`,
  ];
  for (const url of candidates) {
    try {
      const res = await fetch(url, { cf: { cacheTtl: 300 } } as RequestInit);
      if (!res.ok) continue;
      const text = await res.text();
      const isXml = text.trim().startsWith('<?xml') || text.includes('<urlset') || text.includes('<sitemapindex');
      const urlCount = (text.match(/<url>/gi) || []).length;
      const locCount = (text.match(/<loc>/gi) || []).length;
      return { exists: true, url, isXml, urlCount: urlCount || locCount, ok: isXml };
    } catch { continue; }
  }
  return { exists: false, ok: false };
}

async function fetchServerInfo(url: string) {
  const t0 = Date.now();
  const res = await fetch(url, {
    method: 'HEAD',
    redirect: 'follow',
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; EmmaginationBot/1.0)' },
  });
  const responseTime = Date.now() - t0;

  const headers = Object.fromEntries(res.headers.entries());
  return {
    responseTime,
    status: res.status,
    https: url.startsWith('https://'),
    hsts: !!headers['strict-transport-security'],
    xContentType: !!headers['x-content-type-options'],
    xFrame: !!headers['x-frame-options'],
    compression: headers['content-encoding'] || null,
    server: headers['server'] || null,
    poweredBy: headers['x-powered-by'] || null,
    cacheControl: headers['cache-control'] || null,
  };
}

function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}

async function handleSeoAudit(request: Request, _env: Env) {
  const { searchParams } = new URL(request.url);
  const rawUrl = searchParams.get('url');

  if (!rawUrl) {
    return jsonResponse({ error: 'URL requerida' }, 400);
  }

  let targetUrl = rawUrl.trim();
  if (!targetUrl.startsWith('http')) targetUrl = 'https://' + targetUrl;
  const urlObj = new URL(targetUrl);
  const domain = urlObj.origin;

  // 1. Fetch HTML + server info primero (necesitamos responseTime y htmlLength)
  const [htmlData, serverData, robotsData, sitemapData] = await Promise.allSettled([
    fetchHtmlMeta(targetUrl),
    fetchServerInfo(targetUrl),
    fetchRobots(domain),
    fetchSitemap(domain),
  ]);

  const meta = htmlData.status === 'fulfilled' ? htmlData.value : { error: true, responseTime: 0, title: { value: null, length: 0, ok: false } };
  const srv = serverData.status === 'fulfilled' ? serverData.value : { error: true, https: false, responseTime: 0 };
  const robots = robotsData.status === 'fulfilled' ? robotsData.value : { error: true, exists: false };
  const sitemap = sitemapData.status === 'fulfilled' ? sitemapData.value : { error: true, exists: false };

  // 2. Calcular scores propios (sin depender de APIs externas)
  const responseTime = (srv as any).responseTime || 0;

  // Obtenemos htmlLength con un fetch rápido
  let actualHtmlLength = 0;
  try {
    const res = await fetch(targetUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; EmmaginationBot/1.0)' },
      redirect: 'follow',
    });
    const html = await res.text();
    actualHtmlLength = html.length;
  } catch { /* silent */ }

  const perfScore = calcPerformanceScore(responseTime, actualHtmlLength);
  const seoScore = calcSeoScore(meta);
  const accScore = calcAccessibilityScore(meta);
  const bpScore = calcBestPracticesScore(srv, meta);

  // 3. Intentar PageSpeed como bonus (no crítico)
  let pagespeedMobile = null;
  let pagespeedDesktop = null;
  try {
    const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed` +
      `?url=${encodeURIComponent(targetUrl)}&strategy=mobile` +
      `&category=performance&category=seo&category=accessibility&category=best-practices`;
    const res = await fetch(apiUrl, { cf: { cacheTtl: 300 } } as RequestInit);
    if (res.ok) {
      const data = await res.json();
      const cats = data.lighthouseResult?.categories || {};
      const audits = data.lighthouseResult?.audits || {};
      pagespeedMobile = {
        scores: {
          performance: Math.round((cats.performance?.score || 0) * 100),
          seo: Math.round((cats.seo?.score || 0) * 100),
          accessibility: Math.round((cats.accessibility?.score || 0) * 100),
          bestPractices: Math.round((cats['best-practices']?.score || 0) * 100),
        },
        vitals: {
          lcp: audits['largest-contentful-paint']?.displayValue || null,
          cls: audits['cumulative-layout-shift']?.displayValue || null,
          fcp: audits['first-contentful-paint']?.displayValue || null,
          ttfb: audits['server-response-time']?.displayValue || null,
          tbt: audits['total-blocking-time']?.displayValue || null,
          si: audits['speed-index']?.displayValue || null,
        },
        vitals_raw: {
          lcp: audits['largest-contentful-paint']?.numericValue || null,
          cls: audits['cumulative-layout-shift']?.numericValue || null,
          fcp: audits['first-contentful-paint']?.numericValue || null,
          ttfb: audits['server-response-time']?.numericValue || null,
        },
      };
    }
  } catch { /* PageSpeed no disponible, usamos scores propios */ }

  // Si PageSpeed funciona, usamos esos scores. Si no, los propios.
  const usePageSpeed = pagespeedMobile != null && (pagespeedMobile as any).scores.performance > 0;

  const result = {
    url: targetUrl,
    domain: urlObj.hostname,
    timestamp: new Date().toISOString(),
    scores: {
      performance: usePageSpeed ? (pagespeedMobile as any).scores.performance : perfScore,
      seo: usePageSpeed ? (pagespeedMobile as any).scores.seo : seoScore,
      accessibility: usePageSpeed ? (pagespeedMobile as any).scores.accessibility : accScore,
      bestPractices: usePageSpeed ? (pagespeedMobile as any).scores.bestPractices : bpScore,
    },
    pagespeed: {
      mobile: pagespeedMobile,
      desktop: pagespeedDesktop,
    },
    meta,
    robots,
    sitemap,
    server: srv,
  };

  return jsonResponse(result);
}

// ═══════════════════════════════════════════════════════════════════════════

async function serveAssetPath(request: Request, env: Env, pathname: string, noCache = false) {
  const url = new URL(request.url);
  url.pathname = pathname;
  const response = await env.ASSETS.fetch(new Request(url.toString(), request));

  if (noCache) {
    const newHeaders = new Headers(response.headers);
    const noCache = htmlNoCacheHeaders();
    noCache.forEach((value, key) => newHeaders.set(key, value));
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders,
    });
  }

  return response;
}

function redirectWwwToNonWww(request: Request): Response | null {
  const url = new URL(request.url);
  const hostname = url.hostname;

  if (hostname.startsWith('www.')) {
    url.hostname = hostname.slice(4);
    return Response.redirect(url.toString(), 301);
  }

  return null;
}

function redirectWorkersToCustomDomain(request: Request): Response | null {
  const url = new URL(request.url);
  if (url.hostname.includes('workers.dev')) {
    url.hostname = 'emmagination.cl';
    return Response.redirect(url.toString(), 301);
  }
  return null;
}

// ── Inyectar build timestamp en el admin para busting de cache ──
async function serveAdmin(request: Request, env: Env) {
  const response = await serveAssetPath(request, env, '/admin/index.html', true);
  const body = await response.text();

  // Inyectar meta tag con timestamp y version query param en el script
  const modifiedBody = body
    .replace(
      '<!--app-head-->',
      `<!--app-head-->\n    <meta name="build-timestamp" content="${BUILD_TIMESTAMP}" />\n    <meta http-equiv="Cache-Control" content="no-store, no-cache, must-revalidate" />`
    )
    .replace(
      'src="/admin/panel.js"',
      `src="/admin/panel.js?v=${Date.now()}"`
    );

  const headers = new Headers(response.headers);
  headers.set('Content-Type', 'text/html; charset=utf-8');
  headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  headers.set('Pragma', 'no-cache');
  headers.set('Expires', '0');

  return new Response(modifiedBody, { status: 200, headers });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const workersRedirect = redirectWorkersToCustomDomain(request);
    if (workersRedirect) {
      return workersRedirect;
    }

    const wwwRedirect = redirectWwwToNonWww(request);
    if (wwwRedirect) {
      return wwwRedirect;
    }

    const url = new URL(request.url);

    // API data — nunca cachear
    if (url.pathname === '/api/data') {
      return handleApi(request, env);
    }

    if (url.pathname === '/api/login') {
      return handleLogin(request, env);
    }

    if (url.pathname === '/api/extract') {
      return handleExtract(request, env);
    }

    // SEO AUDIT — público, sin auth
    if (url.pathname === '/api/seo-audit') {
      return handleSeoAudit(request, env);
    }

    // Admin — nunca cachear, con versionado de assets
    if (url.pathname === '/admin' || url.pathname === '/admin/') {
      return serveAdmin(request, env);
    }

    if (url.pathname.startsWith('/admin/')) {
      const response = await serveAssetPath(request, env, url.pathname, true);
      const headers = new Headers(response.headers);
      headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
      });
    }

    // SPA fallback — no cachear HTML + headers de seguridad
    const response = await env.ASSETS.fetch(request);
    if (response.status !== 404) {
      const contentType = response.headers.get('Content-Type') || '';
      const newHeaders = new Headers(response.headers);
      // Aplicar headers de seguridad a TODO
      securityHeaders(newHeaders);
      if (contentType.includes('text/html')) {
        const noCache = htmlNoCacheHeaders();
        noCache.forEach((value, key) => newHeaders.set(key, value));
      }
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: newHeaders,
      });
    }

    if (url.pathname.startsWith('/proyectos/')) {
      const r = await serveAssetPath(request, env, '/index.html', true);
      const h = new Headers(r.headers);
      securityHeaders(h);
      return new Response(r.body, { status: r.status, statusText: r.statusText, headers: h });
    }

    return response;
  },
};
