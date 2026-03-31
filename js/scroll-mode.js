/* =============================================
   TITOYIN — Scroll Mode + Mobile Nav
   Bulletproof implementation
   ============================================= */
'use strict';

// ── MOBILE NAV ────────────────────────────────
// Uses event delegation — works regardless of when DOM loads
document.addEventListener('click', function(e) {
  // Hamburger button or any child span inside it
  const hamburger = e.target.closest('#hamburger');
  if (hamburger) {
    e.preventDefault();
    e.stopPropagation();
    var nav = document.getElementById('mobile-nav');
    if (!nav) return;
    var isOpen = nav.classList.contains('open');
    if (isOpen) {
      nav.classList.remove('open');
      document.body.style.overflow = '';
      hamburger.setAttribute('aria-expanded', 'false');
    } else {
      nav.classList.add('open');
      document.body.style.overflow = 'hidden';
      hamburger.setAttribute('aria-expanded', 'true');
    }
    return;
  }

  // Close button inside mobile nav
  const closeBtn = e.target.closest('#mobile-nav-close');
  if (closeBtn) {
    closeMobileNav();
    return;
  }

  // Click outside nav (on overlay area)
  const nav = document.getElementById('mobile-nav');
  if (nav && nav.classList.contains('open') && !nav.contains(e.target)) {
    closeMobileNav();
    return;
  }
});

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') closeMobileNav();
});

function closeMobileNav() {
  var nav = document.getElementById('mobile-nav');
  var btn = document.getElementById('hamburger');
  if (nav) { nav.classList.remove('open'); document.body.style.overflow = ''; }
  if (btn) btn.setAttribute('aria-expanded', 'false');
}

// ── SOCIAL SCROLL MODE ────────────────────────
var STORAGE_KEY = 'titoyin_view_mode';
var currentMode = localStorage.getItem(STORAGE_KEY) || 'grid';

// Apply immediately before render
if (currentMode === 'social') {
  document.documentElement.classList.add('social-mode');
}

function applyMode(mode, animate) {
  currentMode = mode;
  localStorage.setItem(STORAGE_KEY, mode);
  var root = document.documentElement;
  var btn  = document.getElementById('view-toggle-btn');
  var label = btn ? btn.querySelector('.view-toggle-label') : null;
  var bar  = document.getElementById('social-mode-bar');

  if (mode === 'social') {
    root.classList.add('social-mode');
    if (bar) bar.style.display = 'flex';
    if (label) label.textContent = 'Grid';
    if (btn) {
      btn.classList.add('active');
      btn.title = 'Switch to Grid View';
      btn.setAttribute('aria-label', 'Switch to Grid View');
      btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg><span class="view-toggle-label">Grid</span>';
    }
    if (animate && typeof showToast === 'function') showToast('📱 Social scroll view', 'info', 1800);
  } else {
    root.classList.remove('social-mode');
    if (bar) bar.style.display = 'none';
    if (btn) {
      btn.classList.remove('active');
      btn.title = 'Switch to Social View';
      btn.setAttribute('aria-label', 'Switch to Social View');
      btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg><span class="view-toggle-label">Social</span>';
    }
    if (animate && typeof showToast === 'function') showToast('⊞ Grid view', 'info', 1800);
  }
}

window.toggleViewMode = function() {
  applyMode(currentMode === 'social' ? 'grid' : 'social', true);
};

// Apply on DOM ready and after posts load
document.addEventListener('DOMContentLoaded', function() { applyMode(currentMode, false); });
setTimeout(function() { applyMode(currentMode, false); }, 600);
setTimeout(function() { applyMode(currentMode, false); }, 1800);

// ── NEWSLETTER MODAL ──────────────────────────
window.openNewsletterModal = function() {
  var modal = document.getElementById('newsletter-modal');
  if (!modal) return;
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  setTimeout(function() {
    var inner = modal.querySelector('.modal-inner');
    if (inner) inner.classList.add('show');
  }, 10);
};

window.closeNewsletterModal = function() {
  var modal = document.getElementById('newsletter-modal');
  if (!modal) return;
  var inner = modal.querySelector('.modal-inner');
  if (inner) inner.classList.remove('show');
  setTimeout(function() {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }, 250);
};

document.addEventListener('click', function(e) {
  var modal = document.getElementById('newsletter-modal');
  if (modal && e.target === modal) window.closeNewsletterModal();
});
