/* =============================================
   TITOYIN ADMIN — Shared Utilities
   ============================================= */

// ── SIDEBAR ───────────────────────────────────
function initSidebar() {
  const sidebar  = document.getElementById('admin-sidebar');
  const overlay  = document.getElementById('sidebar-overlay');
  const menuBtn  = document.getElementById('topbar-menu-btn');

  if (!sidebar) return;

  function openSidebar() {
    sidebar.classList.add('open');
    if (overlay) overlay.classList.add('show');
    document.body.style.overflow = 'hidden';
  }
  function closeSidebar() {
    sidebar.classList.remove('open');
    if (overlay) overlay.classList.remove('show');
    document.body.style.overflow = '';
  }

  if (menuBtn) menuBtn.addEventListener('click', openSidebar);
  if (overlay) overlay.addEventListener('click', closeSidebar);

  // Highlight active nav item
  const current = window.location.pathname.split('/').pop();
  document.querySelectorAll('.nav-item').forEach(item => {
    if (item.getAttribute('href') === current) {
      item.classList.add('active');
    }
  });
}

// ── TOAST ─────────────────────────────────────
function showToast(message, type = 'info', duration = 3200) {
  let toast = document.getElementById('admin-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'admin-toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.className = 'toast ' + type;
  requestAnimationFrame(() => requestAnimationFrame(() => toast.classList.add('show')));
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), duration);
}

// ── HELPERS / TOOLTIPS ────────────────────────
function initHelpers() {
  document.querySelectorAll('.helper-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      const popup = this.nextElementSibling;
      if (!popup) return;
      // Close all others
      document.querySelectorAll('.helper-popup.show').forEach(p => {
        if (p !== popup) p.classList.remove('show');
      });
      popup.classList.toggle('show');
    });
  });
  document.addEventListener('click', () => {
    document.querySelectorAll('.helper-popup.show').forEach(p => p.classList.remove('show'));
  });
}

// ── AUTOSAVE ──────────────────────────────────
let autosaveTimer = null;
function initAutosave(formId, storageKey) {
  const form = document.getElementById(formId);
  if (!form) return;

  // Restore from autosave
  const saved = sessionStorage.getItem('autosave_' + storageKey);
  if (saved) {
    try {
      const data = JSON.parse(saved);
      Object.keys(data).forEach(key => {
        const el = form.querySelector(`[name="${key}"], #${key}`);
        if (el) el.value = data[key];
      });
      showToast('Draft restored from autosave', 'info');
    } catch(e) {}
  }

  form.addEventListener('input', () => {
    clearTimeout(autosaveTimer);
    autosaveTimer = setTimeout(() => {
      const data = {};
      form.querySelectorAll('input, textarea, select').forEach(el => {
        if (el.name || el.id) data[el.name || el.id] = el.value;
      });
      sessionStorage.setItem('autosave_' + storageKey, JSON.stringify(data));
      const indicator = document.getElementById('autosave-indicator');
      if (indicator) {
        indicator.textContent = 'Draft saved ' + new Date().toLocaleTimeString('en-NG', {hour:'2-digit', minute:'2-digit'});
        indicator.style.display = 'block';
      }
    }, 2000);
  });
}

function clearAutosave(storageKey) {
  sessionStorage.removeItem('autosave_' + storageKey);
}

// ── TAG INPUT ─────────────────────────────────
function initTagInput(wrapperId, hiddenInputId) {
  const wrap = document.getElementById(wrapperId);
  const hidden = document.getElementById(hiddenInputId);
  if (!wrap || !hidden) return;

  let tags = hidden.value ? hidden.value.split(',').filter(Boolean) : [];

  function renderTags() {
    wrap.querySelectorAll('.tag-chip').forEach(c => c.remove());
    const input = wrap.querySelector('.tags-input');
    tags.forEach(tag => {
      const chip = document.createElement('span');
      chip.className = 'tag-chip';
      chip.innerHTML = `${tag}<button type="button" onclick="removeTag('${wrapperId}','${hiddenInputId}','${tag}')">×</button>`;
      wrap.insertBefore(chip, input);
    });
    hidden.value = tags.join(',');
  }

  const input = wrap.querySelector('.tags-input');
  if (input) {
    input.addEventListener('keydown', function(e) {
      if ((e.key === 'Enter' || e.key === ',') && this.value.trim()) {
        e.preventDefault();
        const tag = this.value.trim().replace(/,/g,'');
        if (tag && !tags.includes(tag)) {
          tags.push(tag);
          renderTags();
        }
        this.value = '';
      }
      if (e.key === 'Backspace' && !this.value && tags.length) {
        tags.pop();
        renderTags();
      }
    });
  }
  wrap.addEventListener('click', () => wrap.querySelector('.tags-input')?.focus());
  renderTags();

  window[`removeTag_${wrapperId}`] = (tag) => {
    tags = tags.filter(t => t !== tag);
    renderTags();
  };
}

window.removeTag = function(wrapperId, hiddenInputId, tag) {
  const wrap = document.getElementById(wrapperId);
  const hidden = document.getElementById(hiddenInputId);
  if (!wrap || !hidden) return;
  const tags = hidden.value.split(',').filter(t => t && t !== tag);
  hidden.value = tags.join(',');
  wrap.querySelectorAll('.tag-chip').forEach(c => c.remove());
  const input = wrap.querySelector('.tags-input');
  tags.forEach(t => {
    const chip = document.createElement('span');
    chip.className = 'tag-chip';
    chip.innerHTML = `${t}<button type="button" onclick="removeTag('${wrapperId}','${hiddenInputId}','${t}')">×</button>`;
    wrap.insertBefore(chip, input);
  });
};

// ── IMAGE PREVIEW ─────────────────────────────
function initImageUpload(zoneId, previewId, inputId) {
  const zone    = document.getElementById(zoneId);
  const preview = document.getElementById(previewId);
  const input   = document.getElementById(inputId);
  if (!zone || !input) return;

  zone.addEventListener('click', () => input.click());
  zone.addEventListener('dragover', e => { e.preventDefault(); zone.style.borderColor = 'var(--navy)'; });
  zone.addEventListener('dragleave', () => { zone.style.borderColor = ''; });
  zone.addEventListener('drop', e => {
    e.preventDefault();
    zone.style.borderColor = '';
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) handleImageFile(file, preview, zone);
  });

  input.addEventListener('change', function() {
    if (this.files[0]) handleImageFile(this.files[0], preview, zone);
  });
}

function handleImageFile(file, previewEl, zoneEl) {
  const reader = new FileReader();
  reader.onload = e => {
    if (previewEl) {
      previewEl.src = e.target.result;
      previewEl.style.display = 'block';
    }
    if (zoneEl) zoneEl.querySelector('p').style.display = 'none';
  };
  reader.readAsDataURL(file);
}

// ── SIMPLE RICH TEXT EDITOR ───────────────────
function execFormat(command, value) {
  const editor = document.getElementById('post-body-editor');
  if (!editor) return;
  editor.focus();
  document.execCommand(command, false, value || null);
}

function initEditor() {
  const editor = document.getElementById('post-body-editor');
  const hidden = document.getElementById('post-body-hidden');
  if (!editor || !hidden) return;

  editor.addEventListener('input', () => {
    hidden.value = editor.innerHTML;
  });

  // Set initial content
  if (hidden.value) editor.innerHTML = hidden.value;
}

// ── CONFIRM DIALOG ────────────────────────────
function confirmAction(message, onConfirm) {
  if (window.confirm(message)) onConfirm();
}

// ── DATE/TIME HELPERS ─────────────────────────
function nigeriaTime() {
  return new Date().toLocaleString('en-NG', { timeZone: 'Africa/Lagos' });
}
function nigeriaDateInput() {
  return new Date(new Date().toLocaleString('en-US', { timeZone: 'Africa/Lagos' })).toISOString().slice(0,16);
}

// ── INIT ALL ──────────────────────────────────
document.addEventListener('DOMContentLoaded', function() {
  requireLogin();
  initSidebar();
  initHelpers();
  initEditor();
  initImageUpload('featured-img-zone', 'featured-img-preview', 'featured-img-input');
  initAutosave('post-form', 'post');

  // Set Nigeria time on datetime inputs
  const scheduleInput = document.getElementById('schedule-time');
  if (scheduleInput && !scheduleInput.value) {
    scheduleInput.value = nigeriaDateInput();
  }
});
