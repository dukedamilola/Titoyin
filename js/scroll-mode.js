/* =============================================
   TITOYIN — Social Scroll Mode
   Clean, self-contained implementation
   ============================================= */

(function() {
  'use strict';

  const STORAGE_KEY = 'titoyin_view_mode';
  let currentMode = localStorage.getItem(STORAGE_KEY) || 'grid';

  // Apply mode immediately on script load (before DOMContentLoaded)
  // to prevent flash of wrong layout
  if (currentMode === 'social') {
    document.documentElement.classList.add('social-mode');
  }

  function applyMode(mode, animate) {
    currentMode = mode;
    localStorage.setItem(STORAGE_KEY, mode);

    const root   = document.documentElement;
    const btn    = document.getElementById('view-toggle-btn');
    const bar    = document.getElementById('social-mode-bar');
    const grid   = document.getElementById('latest-posts-grid');

    if (mode === 'social') {
      root.classList.add('social-mode');
      if (bar) bar.style.display = 'flex';
      if (btn) {
        btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg> Grid View`;
        btn.classList.add('active');
      }
      if (grid && animate) {
        grid.style.opacity = '0';
        grid.style.transform = 'translateY(8px)';
        setTimeout(() => {
          grid.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
          grid.style.opacity = '1';
          grid.style.transform = 'translateY(0)';
        }, 50);
      }
      if (animate) showToast('📱 Social scroll view', 'info', 1800);
    } else {
      root.classList.remove('social-mode');
      if (bar) bar.style.display = 'none';
      if (btn) {
        btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg> Social View`;
        btn.classList.remove('active');
      }
      if (animate) showToast('⊞ Grid view', 'info', 1800);
    }
  }

  window.toggleViewMode = function() {
    applyMode(currentMode === 'social' ? 'grid' : 'social', true);
  };

  // Init on DOM ready
  document.addEventListener('DOMContentLoaded', function() {
    applyMode(currentMode, false);
  });

  // Re-apply after posts.js loads content
  setTimeout(() => applyMode(currentMode, false), 800);
  setTimeout(() => applyMode(currentMode, false), 2000);

})();

// ── NEWSLETTER MODAL ──────────────────────────
window.openNewsletterModal = function() {
  const modal = document.getElementById('newsletter-modal');
  if (!modal) return;
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  setTimeout(() => modal.querySelector('.modal-inner')?.classList.add('show'), 10);
};
window.closeNewsletterModal = function() {
  const modal = document.getElementById('newsletter-modal');
  if (!modal) return;
  modal.querySelector('.modal-inner')?.classList.remove('show');
  setTimeout(() => {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }, 250);
};
document.addEventListener('click', function(e) {
  const modal = document.getElementById('newsletter-modal');
  if (modal && e.target === modal) window.closeNewsletterModal();
});
