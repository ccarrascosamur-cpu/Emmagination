const API_URL = '/api/data';
const LOGIN_URL = '/api/login';
const AUTH_KEY = 'emmagination-admin-token';

// ── STATE ──
let state = null;
let editingProjectId = null;
let editingServiceSlug = null;

// ── UTILS ──
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

function slugify(v) {
  return String(v || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}
function splitLines(v) { return String(v || '').split('\n').map(s => s.trim()).filter(Boolean); }
function joinLines(v) { return Array.isArray(v) ? v.join('\n') : ''; }
function parseFaqs(v) {
  return splitLines(v).map(line => {
    const parts = line.split('|').map(p => p.trim());
    return { question: parts[0] || '', answer: parts[1] || '' };
  }).filter(f => f.question && f.answer);
}
function formatFaqs(faqs) { return Array.isArray(faqs) ? faqs.map(f => `${f.question} | ${f.answer}`).join('\n') : ''; }

function getAuthHeader() {
  const token = localStorage.getItem(AUTH_KEY);
  return token ? `Bearer ${token}` : '';
}

function showStatus(msg, type = '') {
  const bar = $('#status-bar');
  bar.textContent = msg;
  bar.className = 'status-bar show ' + type;
  setTimeout(() => bar.classList.remove('show'), 4000);
}

// ── LOGIN ──
function initLogin() {
  const saved = localStorage.getItem(AUTH_KEY);
  if (saved) { showApp(); return; }

  $('#login-btn').addEventListener('click', doLogin);
  $('#login-pass').addEventListener('keypress', (e) => { if (e.key === 'Enter') doLogin(); });
}

async function doLogin() {
  const user = $('#login-user').value.trim();
  const pass = $('#login-pass').value;
  if (!user || !pass) { $('#login-error').textContent = 'Ingresa usuario y contraseña'; return; }

  try {
    const res = await fetch(`${LOGIN_URL}?_t=${Date.now()}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user, password: pass }),
    });
    const data = await res.json();
    if (!res.ok || data.error) {
      $('#login-error').textContent = data.error || 'Usuario o contraseña incorrectos';
      return;
    }
    localStorage.setItem(AUTH_KEY, data.token);
    showApp();
  } catch (e) {
    $('#login-error').textContent = 'Error de conexión';
  }
}

function showApp() {
  $('#login-screen').style.display = 'none';
  $('#app').style.display = 'block';
  loadAll();
}

function logout() {
  localStorage.removeItem(AUTH_KEY);
  location.reload();
}

// ── API ──
async function fetchData() {
  const auth = getAuthHeader();
  if (!auth) throw new Error('No autenticado');
  const res = await fetch(`${API_URL}?_t=${Date.now()}`, {
    headers: { Accept: 'application/json', 'Cache-Control': 'no-store', Authorization: auth },
  });
  if (res.status === 401) { logout(); throw new Error('Sesión expirada'); }
  if (!res.ok) throw new Error(`GET ${res.status}`);
  return res.json();
}

async function saveData(payload) {
  const auth = getAuthHeader();
  if (!auth) throw new Error('No autenticado');
  const res = await fetch(`${API_URL}?_t=${Date.now()}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json', Authorization: auth },
    body: JSON.stringify(payload),
  });
  if (res.status === 401) { logout(); throw new Error('Sesión expirada'); }
  if (!res.ok) throw new Error(await res.text() || `POST ${res.status}`);
  return res.json();
}

// ── TABS ──
function initTabs() {
  $$('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      $$('.tab').forEach(t => t.classList.remove('active'));
      $$('.tab-content').forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      $(`#tab-${tab.dataset.tab}`).classList.add('active');
    });
  });
}

// ── PROJECTS ──
function renderProjects() {
  const list = $('#project-list');
  if (!state.projects?.length) { list.innerHTML = '<p style="color:var(--muted)">No hay proyectos</p>'; return; }

  list.innerHTML = state.projects.map(p => `
    <div class="project-card" data-id="${p.id}">
      <div style="position:relative;" onclick="editProject(${p.id})">
        ${p.featured ? '<span class="badge-featured">⭐ Destacado</span>' : ''}
        <img src="${p.image || ''}" alt="" onerror="this.style.display='none'" />
        <h3>${escapeHtml(p.title)}</h3>
        <div class="meta">${escapeHtml(p.category || '')} · ${p.year || ''}</div>
      </div>
      <div style="display:flex; gap:8px; margin-top:12px; padding-top:12px; border-top:1px solid var(--line);">
        <button type="button" class="btn btn-sm ${p.featured ? 'btn-secondary' : 'btn-primary'}" style="flex:1; font-size:12px; padding:6px 10px;"
          onclick="toggleFeatured(${p.id}, event)">
          ${p.featured ? '⭐ Quitar destacado' : '☆ Destacar'}
        </button>
      </div>
    </div>
  `).join('');
}

window.toggleFeatured = async function(id, event) {
  if (event) event.stopPropagation();
  const project = state.projects.find(p => p.id === id);
  if (!project) return;
  project.featured = !project.featured;
  renderProjects();
  try {
    updateStateFromForms();
    state = await saveData(state);
    showStatus(project.featured ? '⭐ Proyecto destacado.' : 'Proyecto quitado de destacados.', 'ok');
  } catch (e) {
    showStatus('⚠️ Error al guardar: ' + e.message, 'error');
  }
};

window.editProject = function(id) {
  editingProjectId = id;
  const p = state.projects.find(x => x.id === id);
  if (!p) return;

  $('#modal-project-title').textContent = 'Editar proyecto';
  fillProjectForm(p);
  $('#btn-delete-project').style.display = 'inline-flex';
  openModal('modal-project');
};

function fillProjectForm(p) {
  const f = $('#project-form');
  f.title.value = p.title || '';
  f.slug.value = p.slug || '';
  f.client.value = p.client || '';
  f.category.value = p.category || '';
  f.year.value = p.year || '';
  f.featured.value = String(p.featured ?? false);
  f.image.value = p.image || '';
  f.url.value = p.url || '';
  f.description.value = p.description || '';
  f.excerpt.value = p.excerpt || '';
  f.services.value = joinLines(p.services);
  f.challenge.value = p.challenge || '';
  f.solution.value = p.solution || '';
  f.results.value = joinLines(p.results);
  f.gallery.value = joinLines(p.gallery);
  f.seoTitle.value = p.seoTitle || '';
  f.seoDescription.value = p.seoDescription || '';
  f.tags.value = p.tags || '';
  f.metric.value = p.metric || '';
  f.metricLabel.value = p.metricLabel || '';
  f.color.value = p.color || '';
}

// ── EXTRACT FROM URL (modal mejorado) ──
function initProjectForm() {
  $('#btn-extract-project').addEventListener('click', () => {
    $('#extract-form').reset();
    $('#extract-loading').style.display = 'none';
    $('#extract-result').style.display = 'none';
    $('#extract-submit-row').style.display = 'flex';
    openModal('modal-extract');
  });

  $('#extract-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const url = e.target.url.value.trim();
    if (!url) return;

    $('#extract-loading').style.display = 'block';
    $('#extract-result').style.display = 'none';
    $('#extract-submit-row').style.display = 'none';

    try {
      const auth = getAuthHeader();
      const res = await fetch(`/api/extract?_t=${Date.now()}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: auth },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();
      if (!res.ok) {
        showStatus('Error: ' + (data.error || 'Falló la extracción'), 'error');
        $('#extract-loading').style.display = 'none';
        $('#extract-submit-row').style.display = 'flex';
        return;
      }

      const p = data.project;
      renderExtractResult(p, data.aiUsed);
      $('#extract-loading').style.display = 'none';

    } catch (err) {
      showStatus('Error: ' + err.message, 'error');
      $('#extract-loading').style.display = 'none';
      $('#extract-submit-row').style.display = 'flex';
    }
  });

  $('#btn-new-project').addEventListener('click', () => {
    editingProjectId = null;
    $('#modal-project-title').textContent = 'Nuevo proyecto';
    $('#project-form').reset();
    $('#btn-delete-project').style.display = 'none';
    openModal('modal-project');
  });

  $('#project-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const f = e.target;
    const project = {
      id: editingProjectId || (Math.max(0, ...state.projects.map(p => p.id || 0)) + 1),
      title: f.title.value.trim(),
      slug: f.slug.value.trim() || slugify(f.title.value),
      client: f.client.value.trim(),
      category: f.category.value.trim(),
      year: f.year.value.trim(),
      featured: f.featured.value === 'true',
      image: f.image.value.trim(),
      url: f.url.value.trim(),
      description: f.description.value.trim(),
      excerpt: f.excerpt.value.trim(),
      services: splitLines(f.services.value),
      challenge: f.challenge.value.trim(),
      solution: f.solution.value.trim(),
      results: splitLines(f.results.value),
      gallery: splitLines(f.gallery.value),
      seoTitle: f.seoTitle.value.trim(),
      seoDescription: f.seoDescription.value.trim(),
      tags: f.tags.value.trim(),
      metric: f.metric.value.trim(),
      metricLabel: f.metricLabel.value.trim(),
      color: f.color.value.trim(),
      offset: 0,
      pdf: '',
    };

    if (editingProjectId) {
      state.projects = state.projects.map(p => p.id === editingProjectId ? project : p);
    } else {
      state.projects.unshift(project);
    }
    closeModal('modal-project');
    renderProjects();
    showStatus('Guardando...', '');
    try {
      updateStateFromForms();
      state = await saveData(state);
      showStatus('✅ Proyecto guardado.', 'ok');
    } catch (e) {
      showStatus('⚠️ Error al guardar: ' + e.message, 'error');
    }
  });

  $('#btn-delete-project').addEventListener('click', async () => {
    if (!editingProjectId) return;
    const p = state.projects.find(x => x.id === editingProjectId);
    if (!confirm(`¿Eliminar "${p?.title}"?`)) return;
    state.projects = state.projects.filter(p => p.id !== editingProjectId);
    editingProjectId = null;
    closeModal('modal-project');
    renderProjects();
    showStatus('Guardando...', '');
    try {
      updateStateFromForms();
      state = await saveData(state);
      showStatus('✅ Proyecto eliminado.', 'ok');
    } catch (e) {
      showStatus('⚠️ Error al guardar: ' + e.message, 'error');
    }
  });

  // Auto-generate slug from title
  $('#project-form').elements.namedItem('title').addEventListener('input', function() {
    const slugEl = $('#project-form').elements.namedItem('slug');
    if (!slugEl.dataset.touched) slugEl.value = slugify(this.value);
  });
  $('#project-form').elements.namedItem('slug').addEventListener('input', function() {
    this.dataset.touched = 'true';
  });
}

function renderExtractResult(p, aiUsed) {
  const resultEl = $('#extract-result');

  const services = Array.isArray(p.services) ? p.services.join(', ') : '';
  const results = Array.isArray(p.results) ? p.results : [];

  resultEl.innerHTML = `
    <div style="margin-bottom:16px;">
      <div style="display:flex; align-items:center; gap:8px; margin-bottom:12px; flex-wrap:wrap;">
        <span style="font-size:13px; font-weight:600; color:var(--text);">Vista previa del proyecto</span>
        ${aiUsed
          ? '<span style="font-size:11px; background:linear-gradient(135deg,rgba(124,58,237,0.2),rgba(168,85,247,0.1)); border:1px solid rgba(124,58,237,0.3); color:#c4b5fd; padding:3px 10px; border-radius:999px; font-weight:600;">✨ Generado con IA</span>'
          : '<span style="font-size:11px; background:rgba(255,255,255,0.05); border:1px solid var(--line); color:var(--muted); padding:3px 10px; border-radius:999px;">Extracción básica</span>'
        }
      </div>

      <div style="position:relative; border-radius:14px; overflow:hidden; margin-bottom:16px; background:rgba(255,255,255,0.03); border:1px solid var(--line);">
        <img id="extract-screenshot"
          src="${escapeHtml(p.image || '')}"
          alt="Screenshot del sitio"
          style="width:100%; height:200px; object-fit:cover; display:block;"
          onerror="this.parentElement.style.display='none'"
        />
        <div style="position:absolute; bottom:0; left:0; right:0; padding:10px 14px; background:linear-gradient(to top, rgba(10,12,20,0.9), transparent);">
          <span style="font-size:12px; color:rgba(255,255,255,0.7);">📸 Screenshot automático via thum.io</span>
        </div>
      </div>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:0;">
        <div class="extract-preview-item">
          <div class="extract-label">Título / Marca</div>
          <div class="extract-value" style="font-weight:600;">${escapeHtml(p.title || '—')}</div>
        </div>
        <div class="extract-preview-item">
          <div class="extract-label">Categoría</div>
          <div class="extract-value">${escapeHtml(p.category || '—')}</div>
        </div>
        <div class="extract-preview-item" style="grid-column:1/-1;">
          <div class="extract-label">Descripción</div>
          <div class="extract-value">${escapeHtml(p.description || '—')}</div>
        </div>
        <div class="extract-preview-item" style="grid-column:1/-1;">
          <div class="extract-label">Excerpt (grilla)</div>
          <div class="extract-value" style="color:var(--muted);">${escapeHtml(p.excerpt || '—')}</div>
        </div>
        <div class="extract-preview-item">
          <div class="extract-label">Servicios</div>
          <div class="extract-value">${escapeHtml(services || '—')}</div>
        </div>
        <div class="extract-preview-item">
          <div class="extract-label">Tags (card)</div>
          <div class="extract-value" style="font-family:monospace; font-size:12px; color:#a78bfa;">${escapeHtml(p.tags || '—')}</div>
        </div>
        <div class="extract-preview-item">
          <div class="extract-label">Métrica principal</div>
          <div class="extract-value" style="color:#4ade80; font-weight:600;">${escapeHtml(p.metric || '—')}</div>
        </div>
        <div class="extract-preview-item">
          <div class="extract-label">Métrica secundaria</div>
          <div class="extract-value" style="color:#4ade80;">${escapeHtml(p.metricLabel || '—')}</div>
        </div>
        <div class="extract-preview-item" style="grid-column:1/-1;">
          <div class="extract-label">Desafío</div>
          <div class="extract-value">${escapeHtml(p.challenge || '—')}</div>
        </div>
        <div class="extract-preview-item" style="grid-column:1/-1;">
          <div class="extract-label">Solución</div>
          <div class="extract-value">${escapeHtml(p.solution || '—')}</div>
        </div>
        <div class="extract-preview-item" style="grid-column:1/-1;">
          <div class="extract-label">Resultados</div>
          <div class="extract-value">${results.length ? results.map(r => '• ' + escapeHtml(r)).join('<br>') : '—'}</div>
        </div>
        <div class="extract-preview-item">
          <div class="extract-label">Color del card</div>
          <div class="extract-value" style="display:flex; align-items:center; gap:8px;">
            <span style="display:inline-block; width:16px; height:16px; border-radius:4px; background:${escapeHtml(p.color || '#1a1a2e')}; border:1px solid rgba(255,255,255,0.2);"></span>
            ${escapeHtml(p.color || '—')}
          </div>
        </div>
        <div class="extract-preview-item">
          <div class="extract-label">Año</div>
          <div class="extract-value">${escapeHtml(p.year || '—')}</div>
        </div>
      </div>

      <div style="display:flex; gap:10px; margin-top:16px; flex-wrap:wrap;">
        <button type="button" class="btn btn-success" style="flex:1; min-width:180px;" id="btn-extract-edit-add">
          ✏️ Revisar y agregar
        </button>
        <button type="button" class="btn btn-primary" style="flex:1; min-width:140px;" id="btn-extract-quick-add">
          ⚡ Agregar directo
        </button>
        <button type="button" class="btn btn-secondary" onclick="resetExtractModal()">
          ↩ Analizar otro
        </button>
      </div>
    </div>
  `;

  resultEl.style.display = 'block';

  // "Revisar y agregar" → cierra modal, abre form pre-llenado
  document.getElementById('btn-extract-edit-add').onclick = () => {
    editingProjectId = null;
    $('#modal-project-title').textContent = 'Agregar proyecto (revisar campos)';
    fillProjectForm(p);
    // mark slug as touched so it doesn't get auto-overwritten
    $('#project-form').elements.namedItem('slug').dataset.touched = 'true';
    $('#btn-delete-project').style.display = 'none';
    closeModal('modal-extract');
    openModal('modal-project');
  };

  // "Agregar directo" → agrega y guarda inmediatamente en KV
  document.getElementById('btn-extract-quick-add').onclick = async () => {
    const newId = Math.max(0, ...state.projects.map(pr => pr.id || 0)) + 1;
    const project = { ...p, id: newId };
    state.projects.unshift(project);
    renderProjects();
    closeModal('modal-extract');
    showStatus('Guardando proyecto...', '');
    try {
      updateStateFromForms();
      state = await saveData(state);
      showStatus('✅ Proyecto guardado correctamente.', 'ok');
    } catch (e) {
      showStatus('⚠️ Proyecto en memoria pero falló el guardado: ' + e.message, 'error');
    }
  };
}

window.resetExtractModal = function() {
  $('#extract-form').reset();
  $('#extract-result').style.display = 'none';
  $('#extract-loading').style.display = 'none';
  $('#extract-submit-row').style.display = 'flex';
};

// ── SERVICES ──
function renderServices() {
  const list = $('#service-list');
  if (!state.services?.length) { list.innerHTML = '<p style="color:var(--muted)">No hay servicios</p>'; return; }

  list.innerHTML = state.services.map(s => `
    <div class="project-card" onclick="editService('${s.slug}')">
      <div style="height:80px; display:flex; align-items:center; justify-content:center; background:linear-gradient(135deg,rgba(124,58,237,0.2),rgba(168,85,247,0.1)); border-radius:12px; margin-bottom:12px;">
        <span style="font-size:32px;">🛠</span>
      </div>
      <h3>${escapeHtml(s.shortTitle || s.title)}</h3>
      <div class="meta">${escapeHtml(s.category || '')} · /servicios/${s.slug}</div>
    </div>
  `).join('');
}

window.editService = function(slug) {
  editingServiceSlug = slug;
  const s = state.services.find(x => x.slug === slug);
  if (!s) return;

  $('#modal-service-title').textContent = 'Editar servicio';
  const f = $('#service-form');
  f.slug.value = s.slug || '';
  f.shortTitle.value = s.shortTitle || '';
  f.title.value = s.title || '';
  f.heroTitle.value = s.heroTitle || '';
  f.intro.value = s.intro || '';
  f.description.value = s.description || '';
  f.keywords.value = s.keywords || '';
  f.category.value = s.category || '';
  f.benefits.value = joinLines(s.benefits);
  f.deliverables.value = joinLines(s.deliverables);
  f.process.value = joinLines(s.process);
  f.faqs.value = formatFaqs(s.faqs);

  $('#btn-delete-service').style.display = 'inline-flex';
  openModal('modal-service');
};

function initServiceForm() {
  $('#btn-new-service').addEventListener('click', () => {
    editingServiceSlug = null;
    $('#modal-service-title').textContent = 'Nuevo servicio';
    $('#service-form').reset();
    $('#btn-delete-service').style.display = 'none';
    openModal('modal-service');
  });

  $('#service-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const f = e.target;
    const service = {
      slug: f.slug.value.trim() || slugify(f.title.value),
      shortTitle: f.shortTitle.value.trim(),
      title: f.title.value.trim(),
      heroTitle: f.heroTitle.value.trim(),
      intro: f.intro.value.trim(),
      description: f.description.value.trim(),
      keywords: f.keywords.value.trim(),
      category: f.category.value.trim(),
      benefits: splitLines(f.benefits.value),
      deliverables: splitLines(f.deliverables.value),
      process: splitLines(f.process.value),
      faqs: parseFaqs(f.faqs.value),
      relatedProjectIds: [],
    };

    if (editingServiceSlug) {
      state.services = state.services.map(s => s.slug === editingServiceSlug ? service : s);
    } else {
      state.services.push(service);
    }
    closeModal('modal-service');
    renderServices();
    showStatus('Guardando...', '');
    try {
      updateStateFromForms();
      state = await saveData(state);
      showStatus('✅ Servicio guardado.', 'ok');
    } catch (e) {
      showStatus('⚠️ Error al guardar: ' + e.message, 'error');
    }
  });

  $('#btn-delete-service').addEventListener('click', async () => {
    if (!editingServiceSlug) return;
    const s = state.services.find(x => x.slug === editingServiceSlug);
    if (!confirm(`¿Eliminar "${s?.title}"?`)) return;
    state.services = state.services.filter(s => s.slug !== editingServiceSlug);
    editingServiceSlug = null;
    closeModal('modal-service');
    renderServices();
    showStatus('Guardando...', '');
    try {
      updateStateFromForms();
      state = await saveData(state);
      showStatus('✅ Servicio eliminado.', 'ok');
    } catch (e) {
      showStatus('⚠️ Error al guardar: ' + e.message, 'error');
    }
  });
}

// ── DEFAULTS ──
const DEFAULT_HERO = {
  badge: 'Agencia de diseño web, branding y SEO en Chile',
  titleLine1: 'Diseño Web,',
  titleLine2: 'Branding y SEO',
  titleLine3: 'en Chile',
  taglineLine1: 'Deja de ser un logo.',
  taglineLine2: 'Pasa a ser una marca.',
  subtitle: 'Diseñamos identidades y posicionamos marcas en Google. Hacemos que tu negocio se vea, se entienda y se compre.',
  ctaPrimary: 'Trabajemos juntos',
  ctaSecondary: 'Ver proyectos',
};

const DEFAULT_CONFIG = {
  contactEmail: 'hola@emmagination.cl',
  contactPhone: '+56 9 8829 0618',
  instagramUrl: 'https://instagram.com/emmagination',
  linkedinUrl: 'https://linkedin.com/company/emmagination',
  googleBusinessUrl: 'https://share.google/SI0GjDkMkZa63cVnL',
};

const DEFAULT_SEO = {
  siteTitle: 'EMMAGINATION | Diseño Web, Branding y Experiencias Digitales en Chile',
  siteDescription: 'EMMAGINATION - Agencia de diseño web, branding, desarrollo Shopify y producción de contenido en Chile.',
  siteKeywords: 'diseño web, branding, shopify, desarrollo web, seo chile, agencia digital, e-commerce',
  ogImage: '/images/isotipo.png',
  twitterHandle: '@emmagination',
};

const DEFAULT_STATS = [
  { value: '50+', label: 'Proyectos' },
  { value: '30+', label: 'Clientes' },
  { value: '5+', label: 'Años' },
  { value: '100%', label: 'Satisfacción' },
];

// ── HERO / CONFIG / SEO / STATS ──
function fillForms() {
  const hero = { ...DEFAULT_HERO, ...state.hero };
  const config = { ...DEFAULT_CONFIG, ...state.config };
  const seo = { ...DEFAULT_SEO, ...state.seo };
  const stats = Array.isArray(state.stats) && state.stats.length === 4
    ? state.stats
    : DEFAULT_STATS;

  // Hero
  const hf = $('#hero-form');
  if (hf) {
    Object.entries(hero).forEach(([k, v]) => {
      const el = hf.elements.namedItem(k);
      if (el) el.value = v || '';
    });
  }

  // Config
  const cf = $('#config-form');
  if (cf) {
    Object.entries(config).forEach(([k, v]) => {
      const el = cf.elements.namedItem(k);
      if (el) el.value = v || '';
    });
  }

  // SEO
  const sf = $('#seo-form');
  if (sf) {
    Object.entries(seo).forEach(([k, v]) => {
      const el = sf.elements.namedItem(k);
      if (el) el.value = v || '';
    });
  }

  // Stats
  const stf = $('#stats-form');
  if (stf) {
    stats.forEach((s, i) => {
      const valEl = stf.elements.namedItem(`stat${i + 1}Value`);
      const labelEl = stf.elements.namedItem(`stat${i + 1}Label`);
      if (valEl) valEl.value = s.value || '';
      if (labelEl) labelEl.value = s.label || '';
    });
  }
}

function updateStateFromForms() {
  // Hero
  const hf = $('#hero-form');
  if (hf) {
    state.hero = {
      badge: hf.badge?.value?.trim() || '',
      titleLine1: hf.titleLine1?.value?.trim() || '',
      titleLine2: hf.titleLine2?.value?.trim() || '',
      titleLine3: hf.titleLine3?.value?.trim() || '',
      taglineLine1: hf.taglineLine1?.value?.trim() || '',
      taglineLine2: hf.taglineLine2?.value?.trim() || '',
      subtitle: hf.subtitle?.value?.trim() || '',
      ctaPrimary: hf.ctaPrimary?.value?.trim() || '',
      ctaSecondary: hf.ctaSecondary?.value?.trim() || '',
    };
  }
  // Config
  const cf = $('#config-form');
  if (cf) {
    state.config = {
      contactEmail: cf.contactEmail?.value?.trim() || '',
      contactPhone: cf.contactPhone?.value?.trim() || '',
      instagramUrl: cf.instagramUrl?.value?.trim() || '',
      linkedinUrl: cf.linkedinUrl?.value?.trim() || '',
      googleBusinessUrl: cf.googleBusinessUrl?.value?.trim() || '',
    };
  }
  // SEO
  const sf = $('#seo-form');
  if (sf) {
    state.seo = {
      siteTitle: sf.siteTitle?.value?.trim() || '',
      siteDescription: sf.siteDescription?.value?.trim() || '',
      siteKeywords: sf.siteKeywords?.value?.trim() || '',
      ogImage: state.seo?.ogImage || '/images/isotipo.png',
      twitterHandle: state.seo?.twitterHandle || '@emmagination',
    };
  }
  // Stats
  const stf = $('#stats-form');
  if (stf) {
    state.stats = [
      { value: stf.stat1Value?.value?.trim() || '', label: stf.stat1Label?.value?.trim() || '' },
      { value: stf.stat2Value?.value?.trim() || '', label: stf.stat2Label?.value?.trim() || '' },
      { value: stf.stat3Value?.value?.trim() || '', label: stf.stat3Label?.value?.trim() || '' },
      { value: stf.stat4Value?.value?.trim() || '', label: stf.stat4Label?.value?.trim() || '' },
    ];
  }
}

// ── SAVE / EXPORT / IMPORT ──
async function saveAll() {
  try {
    updateStateFromForms();
    $('#save-status').textContent = 'Guardando...';
    state = await saveData(state);
    $('#save-status').textContent = '';
    showStatus('✅ Cambios guardados correctamente', 'ok');
  } catch (e) {
    $('#save-status').textContent = '';
    showStatus('❌ ' + (e.message || 'Error al guardar'), 'error');
  }
}

function exportJson() {
  updateStateFromForms();
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'emmagination-data.json';
  a.click();
  URL.revokeObjectURL(url);
  showStatus('JSON exportado', 'ok');
}

function importJson(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      if (!data.projects) throw new Error('JSON inválido');
      state = data;
      renderProjects();
      renderServices();
      fillForms();
      showStatus('JSON importado. Guarda para persistir.', 'ok');
    } catch (err) {
      showStatus('Error al importar: ' + err.message, 'error');
    }
  };
  reader.readAsText(file);
}

// ── MODAL ──
window.openModal = function(id) { $(`#${id}`).classList.add('open'); };
window.closeModal = function(id) { $(`#${id}`).classList.remove('open'); };

// Close on overlay click
$$('.modal-overlay').forEach(el => {
  el.addEventListener('click', (e) => { if (e.target === el) el.classList.remove('open'); });
});

// ── ESCAPE HTML ──
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ── LOAD ALL ──
async function loadAll() {
  try {
    state = await fetchData();
    if (!state.projects) state.projects = [];
    if (!state.services) state.services = [];
    if (!state.hero) state.hero = {};
    if (!state.seo) state.seo = {};
    if (!state.config) state.config = {};
    if (!state.stats) state.stats = [...DEFAULT_STATS];

    renderProjects();
    renderServices();
    fillForms();
    showStatus('Datos cargados', 'ok');
  } catch (e) {
    showStatus('Error al cargar: ' + e.message, 'error');
  }
}

// ── INIT ──
initLogin();
initTabs();
initProjectForm();
initServiceForm();

$('#logout-btn').addEventListener('click', logout);
$('#btn-save').addEventListener('click', saveAll);
$('#btn-export').addEventListener('click', exportJson);
$('#btn-import').addEventListener('click', () => $('#file-import').click());
$('#file-import').addEventListener('change', (e) => { if (e.target.files[0]) importJson(e.target.files[0]); });
