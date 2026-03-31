/* =============================================
   TITOYIN — Scroll Mode (re-apply on navigation)
   components.js handles the main logic.
   This file re-applies the saved mode after
   posts.js finishes rendering cards.
   ============================================= */
(function() {
  var KEY = 'titoyin_view_mode';

  function reapply() {
    var mode = localStorage.getItem(KEY) || 'grid';
    if (mode === 'social') {
      document.documentElement.classList.add('social-mode');
      var bar = document.getElementById('social-mode-bar');
      if (bar) bar.style.display = 'flex';
      var btn = document.getElementById('view-toggle-btn');
      if (btn) {
        btn.classList.add('active');
        btn.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg><span>Grid</span>';
      }
    } else {
      document.documentElement.classList.remove('social-mode');
    }
  }

  // Re-apply after posts render
  setTimeout(reapply, 800);
  setTimeout(reapply, 2000);
})();
