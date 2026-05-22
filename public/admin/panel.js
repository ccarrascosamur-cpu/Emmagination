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
  return String(v || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
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

window.toggleFeatured = function(id, event) {
  if (event) event.stopPropagation();
  const project = state.projects.find(p => p.id === id);
  if (!project) return;
  project.featured = !project.featured;
  renderProjects();
  showStatus(project.featured ? '⭐ Proyecto destacado' : 'Proyecto quitado de destacados', 'ok');
};

window.editProject = function(id) {
  editingProjectId = id;
  const p = state.projects.find(x => x.id === id);
  if (!p) return;

  $('#modal-project-title').textContent = 'Editar proyecto';
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

  $('#btn-delete-project').style.display = 'inline-flex';
  openModal('modal-project');
};

function initProjectForm() {
  // Extract from URL
  $('#btn-extract-project').addEventListener('click', () => {
    $('#extract-form').reset();
    $('#extract-loading').style.display = 'none';
    $('#extract-preview').style.display = 'none';
    openModal('modal-extract');
  });

  $('#extract-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const url = e.target.url.value.trim();
    if (!url) return;

    $('#extract-loading').style.display = 'block';
    $('#extract-preview').style.display = 'none';

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
        return;
      }

      // Show preview
      const p = data.project;
      $('#extract-preview').innerHTML = `
        <div class="extract-preview-item">
          <div class="extract-label">Título</div>
          <div class="extract-value">${escapeHtml(p.title)}</div>
        </div>
        <div class="extract-preview-item">
          <div class="extract-label">Cliente</div>
          <div class="extract-value">${escapeHtml(p.client)}</div>
        </div>
        <div class="extract-preview-item">
          <div class="extract-label">Categoría</div>
          <div class="extract-value">${escapeHtml(p.category)}</div>
        </div>
        <div class="extract-preview-item">
          <div class="extract-label">Descripción</div>
          <div class="extract-value">${escapeHtml(p.description)}</div>
        </div>
        <div class="extract-preview-item">
          <div class="extract-label">Servicios</div>
          <div class="extract-value">${p.services.map(s => escapeHtml(s)).join(', ')}</div>
        </div>
        <div class="extract-preview-item">
          <div class="extract-label">Desafío</div>
          <div class="extract-value">${escapeHtml(p.challenge)}</div>
        </div>
        <div class="extract-preview-item">
          <div class="extract-label">Solución</div>
          <div class="extract-value">${escapeHtml(p.solution)}</div>
        </div>
        <div class="extract-preview-item">
          <div class="extract-label">Resultados</div>
          <div class="extract-value">${p.results.map(r => '• ' + escapeHtml(r)).join('<br>')}</div>
        </div>
      `;
      $('#extract-preview').style.display = 'block';
      $('#extract-loading').style.display = 'none';

      // Add confirm button
      const confirmBtn = document.createElement('button');
      confirmBtn.type = 'button';
      confirmBtn.className = 'btn btn-success';
      confirmBtn.textContent = '✅ Agregar este proyecto';
      confirmBtn.style.marginTop = '16px';
      confirmBtn.onclick = () => {
        state.projects.unshift(p);
        renderProjects();
        closeModal('modal-extract');
        showStatus('Proyecto agregado desde URL. Guarda para persistir.', 'ok');
      };
      $('#extract-preview').appendChild(confirmBtn);

    } catch (err) {
      showStatus('Error: ' + err.message, 'error');
      $('#extract-loading').style.display = 'none';
    }
  });

  $('#btn-new-project').addEventListener('click', () => {
    editingProjectId = null;
    $('#modal-project-title').textContent = 'Nuevo proyecto';
    $('#project-form').reset();
    $('#btn-delete-project').style.display = 'none';
    openModal('modal-project');
  });

  $('#project-form').addEventListener('submit', (e) => {
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
    showStatus('Proyecto guardado. Recuerda guardar todos los cambios.', 'ok');
  });

  $('#btn-delete-project').addEventListener('click', () => {
    if (!editingProjectId) return;
    const p = state.projects.find(x => x.id === editingProjectId);
    if (!confirm(`¿Eliminar "${p?.title}"?`)) return;
    state.projects = state.projects.filter(p => p.id !== editingProjectId);
    editingProjectId = null;
    closeModal('modal-project');
    renderProjects();
    showStatus('Proyecto eliminado. Recuerda guardar todos los cambios.', 'ok');
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

  $('#service-form').addEventListener('submit', (e) => {
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
    showStatus('Servicio guardado. Recuerda guardar todos los cambios.', 'ok');
  });

  $('#btn-delete-service').addEventListener('click', () => {
    if (!editingServiceSlug) return;
    const s = state.services.find(x => x.slug === editingServiceSlug);
    if (!confirm(`¿Eliminar "${s?.title}"?`)) return;
    state.services = state.services.filter(s => s.slug !== editingServiceSlug);
    editingServiceSlug = null;
    closeModal('modal-service');
    renderServices();
    showStatus('Servicio eliminado. Recuerda guardar todos los cambios.', 'ok');
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

// ── HERO / CONFIG / SEO ──
function fillForms() {
  const hero = { ...DEFAULT_HERO, ...state.hero };
  const config = { ...DEFAULT_CONFIG, ...state.config };
  const seo = { ...DEFAULT_SEO, ...state.seo };

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
