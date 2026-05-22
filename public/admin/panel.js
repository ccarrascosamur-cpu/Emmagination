const API_URL = '/api/data';
const AUTH_KEY = 'emmagination-admin-auth';

// ── DOM refs ──
const els = {
  authUser: document.getElementById('auth-user'),
  authPassword: document.getElementById('auth-password'),
  saveAuth: document.getElementById('save-auth'),
  reloadData: document.getElementById('reload-data'),
  saveAll: document.getElementById('save-all'),
  exportJson: document.getElementById('export-json'),
  importJsonBtn: document.getElementById('import-json-btn'),
  importJsonFile: document.getElementById('import-json-file'),
  status: document.getElementById('status'),
  // Tabs
  navTabs: document.querySelectorAll('.nav-tab'),
  tabContents: document.querySelectorAll('.tab-content'),
  // Projects
  addProject: document.getElementById('add-project'),
  deleteProject: document.getElementById('delete-project'),
  projectList: document.getElementById('project-list'),
  projectForm: document.getElementById('project-form'),
  projectEditor: document.getElementById('project-editor'),
  // Services
  addService: document.getElementById('add-service'),
  deleteService: document.getElementById('delete-service'),
  serviceList: document.getElementById('service-list'),
  serviceForm: document.getElementById('service-form'),
  serviceEditor: document.getElementById('service-editor'),
  // Hero
  heroForm: document.getElementById('hero-form'),
  heroPreview: document.getElementById('hero-preview'),
  // SEO
  seoForm: document.getElementById('seo-form'),
  seoPreview: document.getElementById('seo-preview'),
  // Config
  configForm: document.getElementById('config-form'),
};

// ── State ──
let state = null;
let activeProjectId = null;
let activeServiceSlug = null;
let currentTab = 'projects';

function setStatus(message, type = '') {
  els.status.textContent = message;
  els.status.className = `status ${type}`.trim();
}

// ── Utils ──
function slugify(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function splitLines(value) {
  return String(value || '')
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);
}

function joinLines(value) {
  return Array.isArray(value) ? value.join('\n') : '';
}

function parseFaqs(value) {
  return String(value || '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const parts = line.split('|').map((p) => p.trim());
      return { question: parts[0] || '', answer: parts[1] || '' };
    })
    .filter((faq) => faq.question && faq.answer);
}

function formatFaqs(faqs) {
  return Array.isArray(faqs)
    ? faqs.map((f) => `${f.question} | ${f.answer}`).join('\n')
    : '';
}

function getAuthHeader() {
  const raw = localStorage.getItem(AUTH_KEY);
  return raw ? `Basic ${raw}` : '';
}

function saveAuth() {
  const user = els.authUser.value.trim();
  const password = els.authPassword.value;
  if (!user || !password) {
    setStatus('Ingresa usuario y password.', 'error');
    return;
  }
  localStorage.setItem(AUTH_KEY, btoa(`${user}:${password}`));
  setStatus('Credenciales guardadas.', 'ok');
}

function readAuth() {
  const raw = localStorage.getItem(AUTH_KEY);
  if (!raw) return;
  try {
    const decoded = atob(raw);
    const separator = decoded.indexOf(':');
    if (separator < 0) return;
    els.authUser.value = decoded.slice(0, separator);
    els.authPassword.value = decoded.slice(separator + 1);
  } catch {
    localStorage.removeItem(AUTH_KEY);
  }
}

async function fetchData() {
  const url = `${API_URL}?_t=${Date.now()}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      Pragma: 'no-cache',
    },
  });
  if (!response.ok) throw new Error(`GET ${API_URL} → ${response.status}`);
  return response.json();
}

async function saveData(payload) {
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'Cache-Control': 'no-store',
    Pragma: 'no-cache',
  };
  const auth = getAuthHeader();
  if (auth) headers.Authorization = auth;
  const url = `${API_URL}?_t=${Date.now()}`;
  const response = await fetch(url, { method: 'POST', headers, body: JSON.stringify(payload) });
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `POST ${API_URL} → ${response.status}`);
  }
  return response.json();
}

// ── Tabs ──
function switchTab(tabId) {
  currentTab = tabId;
  els.navTabs.forEach((tab) => tab.classList.toggle('active', tab.dataset.tab === tabId));
  els.tabContents.forEach((content) => content.classList.toggle('active', content.id === `tab-${tabId}`));
}

els.navTabs.forEach((tab) => {
  tab.addEventListener('click', () => switchTab(tab.dataset.tab));
});

// ── Projects ──
function getActiveProject() {
  return state.projects.find((p) => p.id === activeProjectId) || null;
}

function renderProjectList() {
  els.projectList.innerHTML = '';
  if (!state.projects.length) {
    els.projectList.innerHTML = '<p class="hint">No hay proyectos. Crea uno nuevo.</p>';
    els.projectEditor.style.display = 'none';
    return;
  }
  state.projects.forEach((project) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `project-item${project.id === activeProjectId ? ' active' : ''}`;
    btn.innerHTML = `
      <strong>${project.title || 'Sin título'}</strong>
      <span>${project.category || 'Sin categoría'} · ${project.year || ''}</span>
      <span>${project.slug || ''} ${project.featured ? '⭐' : ''}</span>
    `;
    btn.addEventListener('click', () => {
      activeProjectId = project.id;
      renderProjectList();
      fillProjectForm();
      els.projectEditor.style.display = 'block';
    });
    els.projectList.appendChild(btn);
  });
}

function fillProjectForm() {
  const project = getActiveProject();
  if (!project) { els.projectForm.reset(); return; }
  const values = {
    title: project.title,
    slug: project.slug,
    client: project.client,
    category: project.category,
    year: project.year,
    offset: project.offset,
    image: project.image,
    pdf: project.pdf || '',
    url: project.url,
    featured: String(project.featured),
    description: project.description,
    excerpt: project.excerpt,
    services: joinLines(project.services),
    challenge: project.challenge,
    solution: project.solution,
    results: joinLines(project.results),
    gallery: joinLines(project.gallery),
    seoTitle: project.seoTitle || '',
    seoDescription: project.seoDescription || '',
  };
  Object.entries(values).forEach(([key, value]) => {
    const input = els.projectForm.elements.namedItem(key);
    if (input) input.value = value;
  });
}

function bindProjectForm() {
  const titleInput = els.projectForm.elements.namedItem('title');
  const slugInput = els.projectForm.elements.namedItem('slug');
  titleInput.addEventListener('input', () => {
    if (!slugInput.dataset.touched) {
      slugInput.value = slugify(titleInput.value);
      updateActiveProjectFromForm();
    }
  });
  slugInput.addEventListener('input', () => { slugInput.dataset.touched = 'true'; updateActiveProjectFromForm(); });
  els.projectForm.addEventListener('input', (e) => { if (e.target !== slugInput) updateActiveProjectFromForm(); });
}

function updateActiveProjectFromForm() {
  const project = getActiveProject();
  if (!project) return;
  const next = {
    ...project,
    title: els.projectForm.elements.namedItem('title').value.trim(),
    slug: els.projectForm.elements.namedItem('slug').value.trim(),
    client: els.projectForm.elements.namedItem('client').value.trim(),
    category: els.projectForm.elements.namedItem('category').value.trim(),
    year: els.projectForm.elements.namedItem('year').value.trim(),
    offset: Number(els.projectForm.elements.namedItem('offset').value) || 0,
    image: els.projectForm.elements.namedItem('image').value.trim(),
    pdf: els.projectForm.elements.namedItem('pdf').value.trim(),
    url: els.projectForm.elements.namedItem('url').value.trim(),
    featured: els.projectForm.elements.namedItem('featured').value === 'true',
    description: els.projectForm.elements.namedItem('description').value.trim(),
    excerpt: els.projectForm.elements.namedItem('excerpt').value.trim(),
    services: splitLines(els.projectForm.elements.namedItem('services').value),
    challenge: els.projectForm.elements.namedItem('challenge').value.trim(),
    solution: els.projectForm.elements.namedItem('solution').value.trim(),
    results: splitLines(els.projectForm.elements.namedItem('results').value),
    gallery: splitLines(els.projectForm.elements.namedItem('gallery').value),
    seoTitle: els.projectForm.elements.namedItem('seoTitle').value.trim(),
    seoDescription: els.projectForm.elements.namedItem('seoDescription').value.trim(),
  };
  state.projects = state.projects.map((item) => (item.id === next.id ? next : item));
  renderProjectList();
}

function addProject() {
  const nextId = Math.max(0, ...state.projects.map((p) => Number(p.id) || 0)) + 1;
  const title = `Nuevo proyecto ${nextId}`;
  const project = {
    id: nextId, slug: slugify(title), title, client: '', category: 'Proyecto',
    year: String(new Date().getFullYear()), image: '', pdf: '', description: '',
    excerpt: '', url: '', services: [], offset: 0, featured: false,
    seoTitle: '', seoDescription: '', challenge: '', solution: '', results: [], gallery: [],
  };
  state.projects.unshift(project);
  activeProjectId = project.id;
  renderProjectList();
  fillProjectForm();
  els.projectEditor.style.display = 'block';
  setStatus('Proyecto creado. Guarda para persistir.', '');
}

function deleteProject() {
  if (!activeProjectId) return;
  const current = getActiveProject();
  if (!current) return;
  if (!window.confirm(`¿Eliminar "${current.title}"?`)) return;
  state.projects = state.projects.filter((p) => p.id !== activeProjectId);
  activeProjectId = state.projects[0]?.id || null;
  renderProjectList();
  fillProjectForm();
  if (!activeProjectId) els.projectEditor.style.display = 'none';
  setStatus('Proyecto eliminado. Guarda para persistir.', '');
}

// ── Services ──
function getActiveService() {
  return state.services.find((s) => s.slug === activeServiceSlug) || null;
}

function renderServiceList() {
  els.serviceList.innerHTML = '';
  if (!state.services.length) {
    els.serviceList.innerHTML = '<p class="hint">No hay servicios. Crea uno nuevo.</p>';
    els.serviceEditor.style.display = 'none';
    return;
  }
  state.services.forEach((service) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `service-item${service.slug === activeServiceSlug ? ' active' : ''}`;
    btn.innerHTML = `
      <strong>${service.shortTitle || service.title || 'Sin título'}</strong>
      <span>${service.category || 'Sin categoría'} · /servicios/${service.slug}</span>
    `;
    btn.addEventListener('click', () => {
      activeServiceSlug = service.slug;
      renderServiceList();
      fillServiceForm();
      els.serviceEditor.style.display = 'block';
    });
    els.serviceList.appendChild(btn);
  });
}

function fillServiceForm() {
  const service = getActiveService();
  if (!service) { els.serviceForm.reset(); return; }
  const values = {
    slug: service.slug,
    shortTitle: service.shortTitle,
    title: service.title,
    heroTitle: service.heroTitle,
    intro: service.intro,
    description: service.description,
    keywords: service.keywords,
    category: service.category,
    benefits: joinLines(service.benefits),
    deliverables: joinLines(service.deliverables),
    process: joinLines(service.process),
    faqs: formatFaqs(service.faqs),
    relatedProjectIds: Array.isArray(service.relatedProjectIds) ? service.relatedProjectIds.join(',') : '',
  };
  Object.entries(values).forEach(([key, value]) => {
    const input = els.serviceForm.elements.namedItem(key);
    if (input) input.value = value;
  });
}

function bindServiceForm() {
  const titleInput = els.serviceForm.elements.namedItem('title');
  const slugInput = els.serviceForm.elements.namedItem('slug');
  const shortInput = els.serviceForm.elements.namedItem('shortTitle');
  titleInput.addEventListener('input', () => {
    if (!slugInput.dataset.touched) slugInput.value = slugify(titleInput.value);
    if (!shortInput.dataset.touched) shortInput.value = titleInput.value;
    updateActiveServiceFromForm();
  });
  slugInput.addEventListener('input', () => { slugInput.dataset.touched = 'true'; updateActiveServiceFromForm(); });
  shortInput.addEventListener('input', () => { shortInput.dataset.touched = 'true'; updateActiveServiceFromForm(); });
  els.serviceForm.addEventListener('input', (e) => {
    if (e.target !== slugInput && e.target !== shortInput) updateActiveServiceFromForm();
  });
}

function updateActiveServiceFromForm() {
  const service = getActiveService();
  if (!service) return;
  const next = {
    ...service,
    slug: els.serviceForm.elements.namedItem('slug').value.trim(),
    shortTitle: els.serviceForm.elements.namedItem('shortTitle').value.trim(),
    title: els.serviceForm.elements.namedItem('title').value.trim(),
    heroTitle: els.serviceForm.elements.namedItem('heroTitle').value.trim(),
    intro: els.serviceForm.elements.namedItem('intro').value.trim(),
    description: els.serviceForm.elements.namedItem('description').value.trim(),
    keywords: els.serviceForm.elements.namedItem('keywords').value.trim(),
    category: els.serviceForm.elements.namedItem('category').value.trim(),
    benefits: splitLines(els.serviceForm.elements.namedItem('benefits').value),
    deliverables: splitLines(els.serviceForm.elements.namedItem('deliverables').value),
    process: splitLines(els.serviceForm.elements.namedItem('process').value),
    faqs: parseFaqs(els.serviceForm.elements.namedItem('faqs').value),
    relatedProjectIds: els.serviceForm.elements.namedItem('relatedProjectIds').value
      .split(',').map((s) => Number(s.trim())).filter((n) => !isNaN(n) && n > 0),
  };
  state.services = state.services.map((item) => (item.slug === service.slug ? next : item));
  activeServiceSlug = next.slug;
  renderServiceList();
}

function addService() {
  const nextNum = state.services.length + 1;
  const title = `Nuevo servicio ${nextNum}`;
  const service = {
    slug: slugify(title), shortTitle: title, title, heroTitle: '', intro: '',
    description: '', keywords: '', category: 'Servicio', benefits: [],
    deliverables: [], process: [], faqs: [], relatedProjectIds: [],
  };
  state.services.push(service);
  activeServiceSlug = service.slug;
  renderServiceList();
  fillServiceForm();
  els.serviceEditor.style.display = 'block';
  setStatus('Servicio creado. Guarda para persistir.', '');
}

function deleteService() {
  if (!activeServiceSlug) return;
  const current = getActiveService();
  if (!current) return;
  if (!window.confirm(`¿Eliminar "${current.title}"?`)) return;
  state.services = state.services.filter((s) => s.slug !== activeServiceSlug);
  activeServiceSlug = state.services[0]?.slug || null;
  renderServiceList();
  fillServiceForm();
  if (!activeServiceSlug) els.serviceEditor.style.display = 'none';
  setStatus('Servicio eliminado. Guarda para persistir.', '');
}

// ── Hero ──
function fillHeroForm() {
  if (!state.hero) return;
  Object.entries(state.hero).forEach(([key, value]) => {
    const input = els.heroForm.elements.namedItem(key);
    if (input) input.value = value;
  });
  updateHeroPreview();
  updateCharCounts();
}

function updateHeroFromForm() {
  state.hero = {
    badge: els.heroForm.elements.namedItem('badge').value.trim(),
    titleLine1: els.heroForm.elements.namedItem('titleLine1').value.trim(),
    titleLine2: els.heroForm.elements.namedItem('titleLine2').value.trim(),
    titleLine3: els.heroForm.elements.namedItem('titleLine3').value.trim(),
    taglineLine1: els.heroForm.elements.namedItem('taglineLine1').value.trim(),
    taglineLine2: els.heroForm.elements.namedItem('taglineLine2').value.trim(),
    subtitle: els.heroForm.elements.namedItem('subtitle').value.trim(),
    ctaPrimary: els.heroForm.elements.namedItem('ctaPrimary').value.trim(),
    ctaSecondary: els.heroForm.elements.namedItem('ctaSecondary').value.trim(),
  };
  updateHeroPreview();
  updateCharCounts();
}

function updateHeroPreview() {
  if (!state.hero) return;
  els.heroPreview.innerHTML = `
    <div style="padding:20px; text-align:center;">
      <span style="display:inline-block;padding:6px 14px;border-radius:999px;background:rgba(124,58,237,0.2);font-size:0.85rem;margin-bottom:16px;">${escapeHtml(state.hero.badge)}</span>
      <h1 style="font-size:1.8rem;font-weight:700;margin:0 0 8px;line-height:1.1;">
        ${escapeHtml(state.hero.titleLine1)}<br>
        <span style="color:#A78BFA;">${escapeHtml(state.hero.titleLine2)}</span><br>
        ${escapeHtml(state.hero.titleLine3)}
      </h1>
      <p style="font-size:1.1rem;font-weight:600;margin:12px 0;">
        ${escapeHtml(state.hero.taglineLine1)}<br>
        <span style="opacity:0.5;">${escapeHtml(state.hero.taglineLine2)}</span>
      </p>
      <p style="opacity:0.7;font-size:0.9rem;">${escapeHtml(state.hero.subtitle)}</p>
      <div style="margin-top:16px;display:flex;gap:12px;justify-content:center;">
        <span style="padding:8px 16px;border-radius:999px;background:linear-gradient(135deg,#7C3AED,#9333EA);font-size:0.85rem;">${escapeHtml(state.hero.ctaPrimary)}</span>
        <span style="padding:8px 16px;border-radius:999px;border:1px solid rgba(255,255,255,0.2);font-size:0.85rem;">${escapeHtml(state.hero.ctaSecondary)}</span>
      </div>
    </div>
  `;
}

// ── SEO ──
function fillSeoForm() {
  if (!state.seo) return;
  Object.entries(state.seo).forEach(([key, value]) => {
    const input = els.seoForm.elements.namedItem(key);
    if (input) input.value = value;
  });
  updateSeoPreview();
  updateCharCounts();
}

function updateSeoFromForm() {
  state.seo = {
    siteTitle: els.seoForm.elements.namedItem('siteTitle').value.trim(),
    siteDescription: els.seoForm.elements.namedItem('siteDescription').value.trim(),
    siteKeywords: els.seoForm.elements.namedItem('siteKeywords').value.trim(),
    ogImage: els.seoForm.elements.namedItem('ogImage').value.trim(),
    twitterHandle: els.seoForm.elements.namedItem('twitterHandle').value.trim(),
  };
  updateSeoPreview();
  updateCharCounts();
}

function updateSeoPreview() {
  if (!state.seo) return;
  const title = state.seo.siteTitle || 'EMMAGINATION';
  const desc = state.seo.siteDescription || '';
  const url = 'https://emmagination.ccarrascosamur.workers.dev/';
  els.seoPreview.innerHTML = `
    <div style="max-width:600px;">
      <div style="color:#8ab4f8;font-size:14px;margin-bottom:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${url}</div>
      <div style="color:#bdc1c6;font-size:20px;font-weight:400;margin-bottom:8px;line-height:1.3;">${escapeHtml(title)}</div>
      <div style="color:#969ba1;font-size:14px;line-height:1.58;">${escapeHtml(desc.substring(0, 160))}${desc.length > 160 ? '...' : ''}</div>
    </div>
  `;
}

// ── Config ──
function fillConfigForm() {
  if (!state.config) return;
  Object.entries(state.config).forEach(([key, value]) => {
    const input = els.configForm.elements.namedItem(key);
    if (input) input.value = value;
  });
}

function updateConfigFromForm() {
  state.config = {
    contactEmail: els.configForm.elements.namedItem('contactEmail').value.trim(),
    contactPhone: els.configForm.elements.namedItem('contactPhone').value.trim(),
    instagramUrl: els.configForm.elements.namedItem('instagramUrl').value.trim(),
    linkedinUrl: els.configForm.elements.namedItem('linkedinUrl').value.trim(),
    googleBusinessUrl: els.configForm.elements.namedItem('googleBusinessUrl').value.trim(),
  };
}

// ── Char counts ──
function updateCharCounts() {
  const fields = [
    { id: 'cc-badge', el: els.heroForm?.elements.namedItem('badge'), max: 60 },
    { id: 'cc-siteTitle', el: els.seoForm?.elements.namedItem('siteTitle'), max: 60 },
    { id: 'cc-siteDescription', el: els.seoForm?.elements.namedItem('siteDescription'), max: 160 },
  ];
  fields.forEach(({ id, el, max }) => {
    const counter = document.getElementById(id);
    if (!counter || !el) return;
    const len = el.value.length;
    counter.textContent = `${len}/${max}`;
    counter.className = 'char-count ' + (len > max ? 'warn' : len > max * 0.8 ? 'warn' : 'ok');
  });
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ── Persistence ──
async function loadAll() {
  setStatus('Cargando datos...');
  try {
    state = await fetchData();
    // Ensure all sections exist
    if (!state.projects) state.projects = [];
    if (!state.services) state.services = [];
    if (!state.hero) state.hero = {};
    if (!state.seo) state.seo = {};
    if (!state.config) state.config = {};

    activeProjectId = state.projects[0]?.id || null;
    activeServiceSlug = state.services[0]?.slug || null;

    renderProjectList();
    fillProjectForm();
    if (!activeProjectId) els.projectEditor.style.display = 'none';

    renderServiceList();
    fillServiceForm();
    if (!activeServiceSlug) els.serviceEditor.style.display = 'none';

    fillHeroForm();
    fillSeoForm();
    fillConfigForm();

    setStatus('Datos cargados.', 'ok');
  } catch (err) {
    setStatus(err.message || 'Error al cargar datos.', 'error');
  }
}

async function persistAll() {
  try {
    updateActiveProjectFromForm();
    updateActiveServiceFromForm();
    updateHeroFromForm();
    updateSeoFromForm();
    updateConfigFromForm();
    setStatus('Guardando...');
    state = await saveData(state);
    setStatus('Cambios guardados en Cloudflare KV.', 'ok');
  } catch (err) {
    setStatus(err.message || 'No fue posible guardar.', 'error');
  }
}

function exportJson() {
  updateActiveProjectFromForm();
  updateActiveServiceFromForm();
  updateHeroFromForm();
  updateSeoFromForm();
  updateConfigFromForm();
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'emmagination-site-data.json';
  link.click();
  URL.revokeObjectURL(url);
  setStatus('JSON exportado.', 'ok');
}

function importJson(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      if (!data.projects || !Array.isArray(data.projects)) throw new Error('JSON inválido: falta projects');
      state = data;
      activeProjectId = state.projects[0]?.id || null;
      activeServiceSlug = state.services?.[0]?.slug || null;
      renderProjectList();
      fillProjectForm();
      renderServiceList();
      fillServiceForm();
      fillHeroForm();
      fillSeoForm();
      fillConfigForm();
      setStatus('JSON importado. Guarda para persistir.', 'ok');
    } catch (err) {
      setStatus('Error al importar: ' + err.message, 'error');
    }
  };
  reader.readAsText(file);
}

// ── Event bindings ──
els.saveAuth.addEventListener('click', saveAuth);
els.reloadData.addEventListener('click', () => loadAll().catch((err) => setStatus(err.message, 'error')));
els.saveAll.addEventListener('click', persistAll);
els.exportJson.addEventListener('click', exportJson);
els.importJsonBtn.addEventListener('click', () => els.importJsonFile.click());
els.importJsonFile.addEventListener('change', (e) => { if (e.target.files[0]) importJson(e.target.files[0]); });

// Projects
els.addProject.addEventListener('click', addProject);
els.deleteProject.addEventListener('click', deleteProject);

// Services
els.addService.addEventListener('click', addService);
els.deleteService.addEventListener('click', deleteService);

// Hero
els.heroForm.addEventListener('input', updateHeroFromForm);

// SEO
els.seoForm.addEventListener('input', updateSeoFromForm);

// Config
els.configForm.addEventListener('input', updateConfigFromForm);

// ── Init ──
readAuth();
bindProjectForm();
bindServiceForm();
loadAll().catch((err) => setStatus(err.message || 'Error inicial.', 'error'));
