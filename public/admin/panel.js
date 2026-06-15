// ── CONFIG ──
const GITHUB_REPO = 'ccarrascosamur-cpu/Emmagination';
const CONTENT_FILE = 'content/site-data.json';
const AUTH_KEY = 'emmagination-admin-token';

// Credenciales del panel (usuario/contraseña para el cliente)
const ADMIN_USER = 'emmagination';
const ADMIN_PASS = 'emma2024';
// GitHub token — se usa internamente para commits, no lo ve el cliente
const GITHUB_TOKEN = '__GITHUB_TOKEN__';
// Webhook secret — también protege el endpoint AI extract
const WEBHOOK_SECRET = '__WEBHOOK_SECRET__';

// ── STATE ──
let state = null;
let editingProjectId = null;
let editingServiceSlug = null;
let isProjectScrollImageUploading = false;
let draggedProjectId = null;
let fileSha = null; // SHA del archivo en GitHub (necesario para actualizarlo)

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

function getToken() {
  return GITHUB_TOKEN;
}

function showStatus(msg, type = '') {
  const bar = $('#status-bar');
  bar.textContent = msg;
  bar.className = 'status-bar show ' + type;
  setTimeout(() => bar.classList.remove('show'), 4000);
}

function setProjectScrollImageUploading(uploading) {
  isProjectScrollImageUploading = uploading;
  const uploadBtn = $('#btn-upload-project-scroll-image');
  const submitBtn = $('#project-form button[type="submit"]');
  if (uploadBtn) {
    uploadBtn.disabled = uploading;
    uploadBtn.textContent = uploading ? 'Subiendo...' : '📁 Subir';
  }
  if (submitBtn) {
    submitBtn.disabled = uploading;
    submitBtn.textContent = uploading ? 'Espera la subida...' : 'Guardar proyecto';
  }
}

// ── GITHUB API ──
async function githubRequest(path, options = {}) {
  const token = getToken();
  const res = await fetch(`https://api.github.com${path}`, {
    ...options,
    headers: {
      Authorization: `token ${token}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  if (res.status === 401) {
    logout();
    throw new Error('Token inválido o expirado');
  }
  return res;
}

async function fetchData() {
  const res = await githubRequest(`/repos/${GITHUB_REPO}/contents/${CONTENT_FILE}`);
  if (!res.ok) throw new Error(`Error al leer datos: ${res.status}`);
  const file = await res.json();
  fileSha = file.sha;
  const content = JSON.parse(atob(file.content.replace(/\n/g, '')));
  return content;
}

async function saveData(payload) {
  const json = JSON.stringify(payload, null, 2);
  const content = btoa(String.fromCharCode(...new TextEncoder().encode(json)));
  const body = {
    message: 'admin: actualizar contenido del sitio',
    content,
    sha: fileSha,
  };
  const res = await githubRequest(`/repos/${GITHUB_REPO}/contents/${CONTENT_FILE}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Error al guardar: ${res.status}`);
  }
  const result = await res.json();
  fileSha = result.content.sha;
  return payload;
}

// Subida de imagen: convierte a base64 y la sube como archivo al repo
async function uploadImage(file) {
  const reader = new FileReader();
  const base64 = await new Promise((resolve, reject) => {
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const ext = file.name.split('.').pop().toLowerCase();
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2,7)}.${ext}`;
  const path = `public/images/uploads/${filename}`;

  // Verificar si ya existe (para obtener SHA)
  let existingSha;
  const check = await githubRequest(`/repos/${GITHUB_REPO}/contents/${path}`);
  if (check.ok) {
    const existing = await check.json();
    existingSha = existing.sha;
  }

  const body = {
    message: `admin: subir imagen ${filename}`,
    content: base64,
    ...(existingSha ? { sha: existingSha } : {}),
  };

  const res = await githubRequest(`/repos/${GITHUB_REPO}/contents/${path}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Error al subir imagen');
  }

  return `/images/uploads/${filename}`;
}

function triggerImageUpload(onStart, onUrl, onError, onComplete) {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/jpeg,image/png,image/webp,image/gif';
  input.onchange = async () => {
    const file = input.files[0];
    if (!file) return;
    onStart?.(file);
    try {
      const url = await uploadImage(file);
      onUrl(url);
    } catch (error) {
      onError?.(error instanceof Error ? error : new Error('Error al subir imagen'));
    } finally {
      onComplete?.();
    }
  };
  input.click();
}

// ── LOGIN ──
function initLogin() {
  const saved = localStorage.getItem(AUTH_KEY);
  if (saved === 'authenticated') { showApp(); return; }

  $('#login-btn').addEventListener('click', doLogin);
  $('#login-pass').addEventListener('keypress', (e) => { if (e.key === 'Enter') doLogin(); });
  if ($('#login-user')) {
    $('#login-user').addEventListener('keypress', (e) => { if (e.key === 'Enter') doLogin(); });
  }
}

function showLoginScreen() {
  $('#login-screen').style.display = 'flex';
  $('#app').style.display = 'none';
}

async function doLogin() {
  const user = $('#login-user') ? $('#login-user').value.trim() : ADMIN_USER;
  const pass = $('#login-pass').value.trim();

  if (!pass) { $('#login-error').textContent = 'Ingresa la contraseña'; return; }

  if (user === ADMIN_USER && pass === ADMIN_PASS) {
    localStorage.setItem(AUTH_KEY, 'authenticated');
    showApp();
  } else {
    $('#login-error').textContent = 'Usuario o contraseña incorrectos';
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
    <div class="project-card" data-id="${p.id}" draggable="true">
      <div style="position:relative;" onclick="editProject(${p.id})">
        <div class="drag-handle">↕ Arrastrar para ordenar</div>
        ${p.featured ? '<span class="badge-featured">⭐ Destacado</span>' : ''}
        <img
          src="${p.image || p.portfolioScrollImage || ''}"
          alt=""
          onerror="if (this.dataset.fallback && this.src !== this.dataset.fallback) { this.src = this.dataset.fallback; return; } this.style.display='none';"
          data-fallback="${p.portfolioScrollImage || ''}"
        />
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

  initProjectSorting();
}

function moveProject(projectId, targetProjectId, placeAfter) {
  const fromIndex = state.projects.findIndex((project) => project.id === projectId);
  const targetIndex = state.projects.findIndex((project) => project.id === targetProjectId);
  if (fromIndex === -1 || targetIndex === -1 || fromIndex === targetIndex) return;

  const [moved] = state.projects.splice(fromIndex, 1);
  const adjustedTargetIndex = state.projects.findIndex((project) => project.id === targetProjectId);
  const insertionIndex = placeAfter ? adjustedTargetIndex + 1 : adjustedTargetIndex;
  state.projects.splice(insertionIndex, 0, moved);
}

function initProjectSorting() {
  const cards = Array.from($$('#project-list .project-card'));

  cards.forEach((card) => {
    card.addEventListener('dragstart', (event) => {
      draggedProjectId = Number(card.dataset.id);
      card.classList.add('dragging');
      if (event.dataTransfer) {
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/plain', String(draggedProjectId));
      }
    });

    card.addEventListener('dragover', (event) => {
      event.preventDefault();
      if (!draggedProjectId || draggedProjectId === Number(card.dataset.id)) return;
      card.classList.add('drag-over');
      if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';
    });

    card.addEventListener('dragleave', () => card.classList.remove('drag-over'));

    card.addEventListener('drop', (event) => {
      event.preventDefault();
      card.classList.remove('drag-over');
      const targetProjectId = Number(card.dataset.id);
      if (!draggedProjectId || !targetProjectId || draggedProjectId === targetProjectId) return;

      const rect = card.getBoundingClientRect();
      const placeAfter = event.clientY > rect.top + rect.height / 2;
      moveProject(draggedProjectId, targetProjectId, placeAfter);
      draggedProjectId = null;
      renderProjects();
      showStatus('Orden actualizado. Presiona "Guardar cambios" para persistir.', 'ok');
    });

    card.addEventListener('dragend', () => {
      draggedProjectId = null;
      cards.forEach((item) => item.classList.remove('dragging', 'drag-over'));
    });
  });
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
  f.portfolioScrollImage.value = p.portfolioScrollImage || '';
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

// ── EXTRACT FROM URL ──
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
      const res = await fetch('/admin/ai-extract.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Deploy-Token': WEBHOOK_SECRET,
        },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.error || `Error ${res.status}`);
      }

      renderExtractResult(data.project, true);
      $('#extract-loading').style.display = 'none';
    } catch (err) {
      showStatus('Error al analizar sitio: ' + err.message, 'error');
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
    if (isProjectScrollImageUploading) {
      showStatus('Espera a que termine la subida de la imagen.', 'error');
      return;
    }
    const f = e.target;
    const existingProject = editingProjectId
      ? state.projects.find((p) => p.id === editingProjectId)
      : null;
    const project = {
      id: editingProjectId || (Math.max(0, ...state.projects.map(p => p.id || 0)) + 1),
      title: f.title.value.trim(),
      slug: f.slug.value.trim() || slugify(f.title.value),
      client: f.client.value.trim(),
      category: f.category.value.trim(),
      year: f.year.value.trim(),
      featured: f.featured.value === 'true',
      image: f.image.value.trim(),
      portfolioScrollImage: f.portfolioScrollImage.value.trim(),
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
      offset: existingProject?.offset || 0,
      pdf: existingProject?.pdf || '',
    };

    if (editingProjectId) {
      state.projects = state.projects.map(p => p.id === editingProjectId ? project : p);
    } else {
      state.projects.unshift(project);
    }
    closeModal('modal-project');
    renderProjects();
    showStatus('Guardando en GitHub...', '');
    try {
      updateStateFromForms();
      state = await saveData(state);
      showStatus('✅ Proyecto guardado. Deploy en curso...', 'ok');
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
    showStatus('Guardando en GitHub...', '');
    try {
      updateStateFromForms();
      state = await saveData(state);
      showStatus('✅ Proyecto eliminado. Deploy en curso...', 'ok');
    } catch (e) {
      showStatus('⚠️ Error al guardar: ' + e.message, 'error');
    }
  });

  $('#btn-upload-project-scroll-image').addEventListener('click', () => {
    triggerImageUpload(
      (file) => { setProjectScrollImageUploading(true); showStatus(`Subiendo ${file.name} a GitHub...`, ''); },
      (url) => {
        $('#project-form').elements.namedItem('portfolioScrollImage').value = url;
        showStatus('✅ Imagen cargada. Puedes guardar el proyecto.', 'ok');
      },
      (error) => showStatus('⚠️ Error al subir imagen: ' + error.message, 'error'),
      () => setProjectScrollImageUploading(false),
    );
  });

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

  resultEl.innerHTML = `
    <div style="margin-bottom:16px;">
      <div style="display:flex; align-items:center; gap:8px; margin-bottom:12px;">
        <span style="font-size:13px; font-weight:600;">Vista previa extraída</span>
        ${aiUsed
          ? '<span style="font-size:11px; background:linear-gradient(135deg,rgba(124,58,237,0.2),rgba(168,85,247,0.15)); border:1px solid rgba(124,58,237,0.3); color:#c4b5fd; padding:3px 10px; border-radius:999px;">✨ Analizado con IA</span>'
          : '<span style="font-size:11px; background:rgba(255,255,255,0.05); border:1px solid var(--line); color:var(--muted); padding:3px 10px; border-radius:999px;">Screenshot automático</span>'
        }
      </div>
      <div style="border-radius:14px; overflow:hidden; margin-bottom:16px; background:rgba(255,255,255,0.03); border:1px solid var(--line);">
        <img src="${escapeHtml(p.image || '')}" alt="" style="width:100%; height:200px; object-fit:cover; display:block;" onerror="this.parentElement.style.display='none'" />
      </div>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:0; border:1px solid var(--line); border-radius:12px; overflow:hidden; margin-bottom:12px;">
        <div class="extract-preview-item"><div class="extract-label">Título</div><div class="extract-value">${escapeHtml(p.title || '—')}</div></div>
        <div class="extract-preview-item"><div class="extract-label">Cliente</div><div class="extract-value">${escapeHtml(p.client || '—')}</div></div>
        <div class="extract-preview-item"><div class="extract-label">Categoría</div><div class="extract-value">${escapeHtml(p.category || '—')}</div></div>
        <div class="extract-preview-item"><div class="extract-label">Servicios</div><div class="extract-value">${escapeHtml(services || '—')}</div></div>
        <div class="extract-preview-item" style="grid-column:1/-1;"><div class="extract-label">Descripción</div><div class="extract-value">${escapeHtml(p.description || '—')}</div></div>
        ${p.challenge ? `<div class="extract-preview-item" style="grid-column:1/-1;"><div class="extract-label">Desafío</div><div class="extract-value">${escapeHtml(p.challenge)}</div></div>` : ''}
        ${p.solution ? `<div class="extract-preview-item" style="grid-column:1/-1;"><div class="extract-label">Solución</div><div class="extract-value">${escapeHtml(p.solution)}</div></div>` : ''}
        <div class="extract-preview-item"><div class="extract-label">Tags</div><div class="extract-value">${escapeHtml(p.tags || '—')}</div></div>
        <div class="extract-preview-item"><div class="extract-label">Color</div><div class="extract-value" style="display:flex;align-items:center;gap:8px;"><span style="width:16px;height:16px;border-radius:4px;background:${escapeHtml(p.color||'#1a1a2e')};display:inline-block;border:1px solid var(--line);"></span>${escapeHtml(p.color || '—')}</div></div>
      </div>
      <p style="color:var(--muted); font-size:13px; margin-top:4px;">Puedes revisar y editar los campos antes de guardar.</p>
      <div style="display:flex; gap:10px; margin-top:16px;">
        <button type="button" class="btn btn-success" style="flex:1;" id="btn-extract-edit-add">✏️ Editar y agregar</button>
        <button type="button" class="btn btn-secondary" onclick="resetExtractModal()">↩ Analizar otro</button>
      </div>
    </div>
  `;

  resultEl.style.display = 'block';

  document.getElementById('btn-extract-edit-add').onclick = () => {
    editingProjectId = null;
    $('#modal-project-title').textContent = 'Agregar proyecto';
    fillProjectForm(p);
    $('#project-form').elements.namedItem('slug').dataset.touched = 'true';
    $('#btn-delete-project').style.display = 'none';
    closeModal('modal-extract');
    openModal('modal-project');
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
    showStatus('Guardando en GitHub...', '');
    try {
      updateStateFromForms();
      state = await saveData(state);
      showStatus('✅ Servicio guardado. Deploy en curso...', 'ok');
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
    showStatus('Guardando en GitHub...', '');
    try {
      updateStateFromForms();
      state = await saveData(state);
      showStatus('✅ Servicio eliminado. Deploy en curso...', 'ok');
    } catch (e) {
      showStatus('⚠️ Error al guardar: ' + e.message, 'error');
    }
  });
}

// ── DEFAULTS ──
const DEFAULT_HERO = {
  badge: 'Agencia de diseño web, branding y SEO en Chile',
  titleLine1: 'Diseño web que',
  titleLine2: 'convierte visitas',
  titleLine3: 'en clientes.',
  taglineLine1: 'Deja de ser un logo.',
  taglineLine2: 'Pasa a ser una marca.',
  subtitle: 'Diseñamos identidades y posicionamos marcas en Google.',
  ctaPrimary: 'Iniciar proyecto',
  ctaSecondary: 'Cotizar gratis',
};

const DEFAULT_CONFIG = {
  contactEmail: 'hola@emmagination.cl',
  contactPhone: '+56 9 8829 0618',
  instagramUrl: 'https://instagram.com/emmagination.cl',
  linkedinUrl: '',
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

// ── FORMS ──
function fillForms() {
  const hero = { ...DEFAULT_HERO, ...state.hero };
  const config = { ...DEFAULT_CONFIG, ...state.config };
  const seo = { ...DEFAULT_SEO, ...state.seo };
  const stats = Array.isArray(state.stats) && state.stats.length === 4 ? state.stats : DEFAULT_STATS;

  const hf = $('#hero-form');
  if (hf) Object.entries(hero).forEach(([k, v]) => { const el = hf.elements.namedItem(k); if (el) el.value = v || ''; });

  const cf = $('#config-form');
  if (cf) Object.entries(config).forEach(([k, v]) => { const el = cf.elements.namedItem(k); if (el) el.value = v || ''; });

  const sf = $('#seo-form');
  if (sf) Object.entries(seo).forEach(([k, v]) => { const el = sf.elements.namedItem(k); if (el) el.value = v || ''; });

  const stf = $('#stats-form');
  if (stf) stats.forEach((s, i) => {
    const valEl = stf.elements.namedItem(`stat${i + 1}Value`);
    const labelEl = stf.elements.namedItem(`stat${i + 1}Label`);
    if (valEl) valEl.value = s.value || '';
    if (labelEl) labelEl.value = s.label || '';
  });
}

function updateStateFromForms() {
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
    $('#save-status').textContent = 'Guardando en GitHub...';
    state = await saveData(state);
    $('#save-status').textContent = '';
    showStatus('✅ Guardado. GitHub Actions desplegará los cambios en ~2 min.', 'ok');
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
      showStatus('JSON importado. Guarda para persistir en GitHub.', 'ok');
    } catch (err) {
      showStatus('Error al importar: ' + err.message, 'error');
    }
  };
  reader.readAsText(file);
}

// ── MODAL ──
window.openModal = function(id) { $(`#${id}`).classList.add('open'); };
window.closeModal = function(id) { $(`#${id}`).classList.remove('open'); };

$$('.modal-overlay').forEach(el => {
  el.addEventListener('click', (e) => { if (e.target === el) el.classList.remove('open'); });
});

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ── LOAD ALL ──
async function loadAll() {
  try {
    showStatus('Cargando datos desde GitHub...', '');
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
    showStatus('✅ Datos cargados', 'ok');
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
