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

function json(data: unknown, init: ResponseInit = {}) {
  const headers = noCacheHeaders();
  headers.set('Content-Type', 'application/json; charset=utf-8');
  if (init.headers) {
    const initHeaders = new Headers(init.headers);
    initHeaders.forEach((value, key) => headers.set(key, value));
  }
  return new Response(JSON.stringify(data), { ...init, headers });
}

function readAuth(request: Request) {
  const header = request.headers.get('Authorization') || '';
  if (!header.startsWith('Basic ')) return null;

  try {
    const decoded = atob(header.slice(6));
    const separator = decoded.indexOf(':');
    if (separator < 0) return null;

    return {
      user: decoded.slice(0, separator),
      password: decoded.slice(separator + 1),
    };
  } catch {
    return null;
  }
}

function isAuthorized(request: Request, env: Env) {
  const credentials = readAuth(request);
  const expectedUser = env.SITE_ADMIN_USER || 'admin';
  const expectedPassword = env.SITE_ADMIN_PASSWORD || 'change-me';

  return (
    credentials &&
    credentials.user === expectedUser &&
    credentials.password === expectedPassword
  );
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
    return json(await readStoredData(env));
  }

  if (request.method === 'POST') {
    if (!env.SITE_DATA) {
      return json(
        {
          error:
            'Missing KV binding SITE_DATA. Configure a KV namespace before using the admin in production.',
        },
        { status: 500 },
      );
    }

    if (!isAuthorized(request, env)) {
      return json(
        { error: 'Unauthorized' },
        {
          status: 401,
          headers: { 'WWW-Authenticate': 'Basic realm="admin"' },
        },
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
    const wwwRedirect = redirectWwwToNonWww(request);
    if (wwwRedirect) {
      return wwwRedirect;
    }

    const url = new URL(request.url);

    // API data — nunca cachear
    if (url.pathname === '/api/data') {
      return handleApi(request, env);
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

    // SPA fallback — no cachear HTML
    const response = await env.ASSETS.fetch(request);
    if (response.status !== 404) {
      const contentType = response.headers.get('Content-Type') || '';
      if (contentType.includes('text/html')) {
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

    if (url.pathname.startsWith('/proyectos/')) {
      return serveAssetPath(request, env, '/index.html', true);
    }

    return response;
  },
};
