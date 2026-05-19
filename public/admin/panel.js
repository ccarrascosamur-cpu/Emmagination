const API_URL = '/api/data';
const AUTH_KEY = 'emmagination-admin-auth';

const els = {
  authUser: document.getElementById('auth-user'),
  authPassword: document.getElementById('auth-password'),
  saveAuth: document.getElementById('save-auth'),
  reloadData: document.getElementById('reload-data'),
  addProject: document.getElementById('add-project'),
  deleteProject: document.getElementById('delete-project'),
  projectList: document.getElementById('project-list'),
  projectForm: document.getElementById('project-form'),
  configForm: document.getElementById('config-form'),
  saveAll: document.getElementById('save-all'),
  exportJson: document.getElementById('export-json'),
  status: document.getElementById('status'),
};

let state = null;
let activeProjectId = null;

function setStatus(message, type = '') {
  els.status.textContent = message;
  els.status.className = `status ${type}`.trim();
}

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

function getAuthHeader() {
  const raw = localStorage.getItem(AUTH_KEY);
  return raw ? `Basic ${raw}` : '';
}

function saveAuth() {
  const user = els.authUser.value.trim();
  const password = els.authPassword.value;

  if (!user || !password) {
    setStatus('Ingresa usuario y password para guardar las credenciales.', 'error');
    return;
  }

  localStorage.setItem(AUTH_KEY, btoa(`${user}:${password}`));
  setStatus('Credenciales guardadas en este navegador.', 'ok');
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
  const response = await fetch(API_URL, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Cache-Control': 'no-store',
    },
  });

  if (!response.ok) {
    throw new Error(`GET ${API_URL} respondió ${response.status}`);
  }

  return response.json();
}

async function saveData(payload) {
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  const auth = getAuthHeader();
  if (auth) {
    headers.Authorization = auth;
  }

  const response = await fetch(API_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `POST ${API_URL} respondió ${response.status}`);
  }

  return response.json();
}

function getActiveProject() {
  return state.projects.find((project) => project.id === activeProjectId) || null;
}

function renderProjectList() {
  els.projectList.innerHTML = '';

  state.projects.forEach((project) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `project-item${project.id === activeProjectId ? ' active' : ''}`;
    button.innerHTML = `
      <strong>${project.title || 'Proyecto sin título'}</strong>
      <span>${project.category || 'Sin categoría'} · ${project.year || ''}</span>
      <span>${project.slug || ''}</span>
    `;
    button.addEventListener('click', () => {
      activeProjectId = project.id;
      renderProjectList();
      fillProjectForm();
    });
    els.projectList.appendChild(button);
  });
}

function fillProjectForm() {
  const project = getActiveProject();
  if (!project) {
    els.projectForm.reset();
    return;
  }

  const fields = new FormData(els.projectForm);
  fields.forEach((_, key) => {
    const input = els.projectForm.elements.namedItem(key);
    if (!input) return;
    input.value = '';
  });

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

function fillConfigForm() {
  Object.entries(state.config).forEach(([key, value]) => {
    const input = els.configForm.elements.namedItem(key);
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

  slugInput.addEventListener('input', () => {
    slugInput.dataset.touched = 'true';
    updateActiveProjectFromForm();
  });

  els.projectForm.addEventListener('input', (event) => {
    if (event.target !== slugInput) {
      updateActiveProjectFromForm();
    }
  });
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

function updateConfigFromForm() {
  state.config = {
    contactEmail: els.configForm.elements.namedItem('contactEmail').value.trim(),
    contactPhone: els.configForm.elements.namedItem('contactPhone').value.trim(),
    instagramUrl: els.configForm.elements.namedItem('instagramUrl').value.trim(),
    linkedinUrl: els.configForm.elements.namedItem('linkedinUrl').value.trim(),
    googleBusinessUrl: els.configForm.elements.namedItem('googleBusinessUrl').value.trim(),
  };
}

function addProject() {
  const nextId = Math.max(0, ...state.projects.map((project) => Number(project.id) || 0)) + 1;
  const title = `Nuevo proyecto ${nextId}`;
  const project = {
    id: nextId,
    slug: slugify(title),
    title,
    client: '',
    category: 'Proyecto',
    year: String(new Date().getFullYear()),
    image: '',
    pdf: '',
    description: '',
    excerpt: '',
    url: '',
    services: [],
    offset: 0,
    featured: false,
    seoTitle: '',
    seoDescription: '',
    challenge: '',
    solution: '',
    results: [],
    gallery: [],
  };

  state.projects.unshift(project);
  activeProjectId = project.id;
  renderProjectList();
  fillProjectForm();
  setStatus('Proyecto creado localmente. Guarda para persistir.', '');
}

function deleteProject() {
  if (!activeProjectId) return;

  const current = getActiveProject();
  if (!current) return;

  const confirmed = window.confirm(`Eliminar "${current.title}" del dataset?`);
  if (!confirmed) return;

  state.projects = state.projects.filter((project) => project.id !== activeProjectId);
  activeProjectId = state.projects[0]?.id || null;
  renderProjectList();
  fillProjectForm();
  setStatus('Proyecto eliminado localmente. Guarda para persistir.', '');
}

async function loadAll() {
  setStatus('Cargando datos...');
  state = await fetchData();
  activeProjectId = state.projects[0]?.id || null;
  renderProjectList();
  fillProjectForm();
  fillConfigForm();
  setStatus('Datos cargados.', 'ok');
}

async function persistAll() {
  try {
    updateActiveProjectFromForm();
    updateConfigFromForm();
    setStatus('Guardando cambios...');
    state = await saveData(state);
    activeProjectId = getActiveProject()?.id || state.projects[0]?.id || null;
    renderProjectList();
    fillProjectForm();
    fillConfigForm();
    setStatus('Cambios guardados en Cloudflare KV.', 'ok');
  } catch (error) {
    setStatus(error.message || 'No fue posible guardar los cambios.', 'error');
  }
}

function exportJson() {
  updateActiveProjectFromForm();
  updateConfigFromForm();
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'emmagination-site-data.json';
  link.click();
  URL.revokeObjectURL(url);
}

els.saveAuth.addEventListener('click', saveAuth);
els.reloadData.addEventListener('click', () => {
  loadAll().catch((error) => setStatus(error.message, 'error'));
});
els.addProject.addEventListener('click', addProject);
els.deleteProject.addEventListener('click', deleteProject);
els.saveAll.addEventListener('click', persistAll);
els.exportJson.addEventListener('click', exportJson);
els.configForm.addEventListener('input', updateConfigFromForm);

readAuth();
bindProjectForm();
loadAll().catch((error) => setStatus(error.message || 'No fue posible cargar los datos.', 'error'));
