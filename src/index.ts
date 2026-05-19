import { defaultSiteData, normalizeSiteData } from './lib/site-data';

const STORAGE_KEY = 'site-data';

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

function json(data: unknown, init: ResponseInit = {}) {
  const headers = new Headers(init.headers || {});
  headers.set('Content-Type', 'application/json; charset=utf-8');
  headers.set('Cache-Control', 'no-store');
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

async function serveAssetPath(request: Request, env: Env, pathname: string) {
  const url = new URL(request.url);
  url.pathname = pathname;
  return env.ASSETS.fetch(new Request(url.toString(), request));
}

function redirectWwwToNonWww(request: Request): Response | null {
  const url = new URL(request.url);
  const hostname = url.hostname;

  // Redirect www.example.com -> example.com with 301
  if (hostname.startsWith('www.')) {
    url.hostname = hostname.slice(4);
    return Response.redirect(url.toString(), 301);
  }

  return null;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // 301 redirect: www -> non-www
    const wwwRedirect = redirectWwwToNonWww(request);
    if (wwwRedirect) {
      return wwwRedirect;
    }

    const url = new URL(request.url);

    if (url.pathname === '/api/data') {
      return handleApi(request, env);
    }

    if (url.pathname === '/admin') {
      return serveAssetPath(request, env, '/admin/index.html');
    }

    const response = await env.ASSETS.fetch(request);
    if (response.status !== 404) {
      return response;
    }

    if (url.pathname.startsWith('/proyectos/')) {
      return serveAssetPath(request, env, '/index.html');
    }

    return response;
  },
};
