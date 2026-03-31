/* =============================================
   TITOYIN — Shared Components v3
   Header, footer, burger, view toggle
   All in one file — no timing issues
   ============================================= */

const TITOYIN_NAV_LINKS = [
  { href: 'index.html',                      label: 'Home' },
  { href: 'category.html?cat=national',      label: 'National' },
  { href: 'category.html?cat=politics',      label: 'Politics' },
  { href: 'category.html?cat=entertainment', label: 'Entertainment' },
  { href: 'category.html?cat=fashion',       label: 'Fashion & Style' },
  { href: 'category.html?cat=trending',      label: 'Trending' },
  { href: 'category.html?cat=gossip',        label: 'Gossip' },
  { href: 'category.html?cat=world',         label: 'World' },
];

/* ── VIEW MODE (social / grid) ─────────────── */
const VIEW_KEY = 'titoyin_view_mode';

function getViewMode() {
  return localStorage.getItem(VIEW_KEY) || 'grid';
}

function setViewMode(mode) {
  localStorage.setItem(VIEW_KEY, mode);
  applyViewMode(mode, true);
}

function applyViewMode(mode, animate) {
  const root  = document.documentElement;
  const btn   = document.getElementById('view-toggle-btn');
  const bar   = document.getElementById('social-mode-bar');

  if (mode === 'social') {
    root.classList.add('social-mode');
    if (bar) bar.style.display = 'flex';
    if (btn) {
      btn.classList.add('active');
      btn.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg><span>Grid</span>`;
    }
    if (animate && typeof showToast === 'function') showToast('📱 Social view on', 'info', 1800);
  } else {
    root.classList.remove('social-mode');
    if (bar) bar.style.display = 'none';
    if (btn) {
      btn.classList.remove('active');
      btn.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg><span>Social</span>`;
    }
    if (animate && typeof showToast === 'function') showToast('⊞ Grid view on', 'info', 1800);
  }
}

window.toggleViewMode = function() {
  const next = getViewMode() === 'social' ? 'grid' : 'social';
  setViewMode(next);
};

/* ── MOBILE NAV ────────────────────────────── */
function openMobileNav() {
  const nav = document.getElementById('mobile-nav');
  const btn = document.getElementById('hamburger');
  if (!nav) return;
  nav.classList.add('open');
  document.body.style.overflow = 'hidden';
  if (btn) btn.setAttribute('aria-expanded', 'true');
}

function closeMobileNav() {
  const nav = document.getElementById('mobile-nav');
  const btn = document.getElementById('hamburger');
  if (!nav) return;
  nav.classList.remove('open');
  document.body.style.overflow = '';
  if (btn) btn.setAttribute('aria-expanded', 'false');
}

function initBurger() {
  const hamburger = document.getElementById('hamburger');
  const closeBtn  = document.getElementById('mobile-nav-close');
  const mobileNav = document.getElementById('mobile-nav');

  if (!hamburger || !mobileNav) return;

  hamburger.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    if (mobileNav.classList.contains('open')) {
      closeMobileNav();
    } else {
      openMobileNav();
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeMobileNav);
  }

  mobileNav.addEventListener('click', function(e) {
    if (e.target === mobileNav) closeMobileNav();
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeMobileNav();
  });
}

/* ── NEWSLETTER MODAL ──────────────────────── */
window.openNewsletterModal = function() {
  const modal = document.getElementById('newsletter-modal');
  if (!modal) return;
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  setTimeout(() => {
    const inner = modal.querySelector('.modal-inner');
    if (inner) inner.classList.add('show');
  }, 10);
};

window.closeNewsletterModal = function() {
  const modal = document.getElementById('newsletter-modal');
  if (!modal) return;
  const inner = modal.querySelector('.modal-inner');
  if (inner) inner.classList.remove('show');
  setTimeout(() => {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }, 250);
};

/* ── RENDER HEADER ─────────────────────────── */
function renderHeader() {
  const navLinks    = TITOYIN_NAV_LINKS.map(n => `<a href="${n.href}">${n.label}</a>`).join('');
  const mobileLinks = TITOYIN_NAV_LINKS.map(n => `<a href="${n.href}">${n.label} <span>›</span></a>`).join('');

  return `
  <!-- Breaking News Strip -->
  <div id="breaking-strip">
    <div class="container">
      <div class="breaking-inner">
        <span class="breaking-label">Breaking</span>
        <div class="breaking-ticker">
          <div class="breaking-ticker-inner" id="ticker-content">
            <span>Stay tuned for the latest updates from across Nigeria and the world</span>
            <span>Stay tuned for the latest updates from across Nigeria and the world</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Header Ad Strip -->
  <div class="header-ad-strip" role="complementary" aria-label="Advertisement">
    <div class="container">
      <div class="ad-slot leaderboard" style="max-width:728px;margin:0 auto;">Advertisement — 728×90 Header Banner</div>
    </div>
  </div>

  <!-- Site Header -->
  <header class="site-header" role="banner">
    <div class="container">
      <div class="header-top">
        <a href="index.html" class="site-logo" aria-label="Titoyin — Home">
          <img class="site-logo-img" src="assets/titoyin-logo.png" alt="Titoyin's Blog"
            onerror="this.style.display='none';this.nextElementSibling.style.display='inline';">
          <span class="site-logo-fallback" style="display:none;">Titoyin<span>'s Blog</span></span>
        </a>
        <div class="header-meta">
          <form class="header-search" data-search-form role="search" aria-label="Search">
            <span class="search-icon" aria-hidden="true">&#128269;</span>
            <input type="search" placeholder="Search stories…" aria-label="Search" data-search-input autocomplete="off">
            <button type="submit" class="sr-only">Search</button>
          </form>
          <span id="header-date" style="font-size:12px;color:var(--ink-muted);white-space:nowrap;display:none;"></span>
        </div>
      </div>

      <nav class="header-nav" role="navigation" aria-label="Main navigation">
        <div class="nav-links">${navLinks}</div>
        <div class="nav-actions">
          <!-- Social/Grid view toggle — always visible -->
          <button
            id="view-toggle-btn"
            class="view-toggle-btn"
            onclick="toggleViewMode()"
            aria-label="Switch to social view"
            title="Toggle Social/Grid view"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
            <span>Social</span>
          </button>
          <button id="dark-mode-btn" onclick="toggleDarkMode()" aria-label="Toggle dark mode"
            style="width:34px;height:34px;border-radius:50%;border:1.5px solid var(--border);background:var(--surface);display:flex;align-items:center;justify-content:center;font-size:15px;cursor:pointer;">🌙</button>
          <button onclick="openNewsletterModal()" class="btn btn-primary" style="font-size:12px;padding:8px 16px;">Subscribe</button>
          <button class="hamburger" id="hamburger" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-nav">
            <span></span><span></span><span></span>
          </button>
        </div>
      </nav>
    </div>
  </header>

  <!-- Mobile Nav -->
  <nav class="mobile-nav" id="mobile-nav" role="navigation" aria-label="Mobile navigation">
    <button class="mobile-nav-close" id="mobile-nav-close" aria-label="Close menu">✕</button>
    <div class="mobile-nav-links">
      ${mobileLinks}
      <a href="about.html">About Us <span>›</span></a>
      <a href="contact.html">Contact <span>›</span></a>
      <a href="search.html">Search <span>›</span></a>
    </div>
    <div style="margin-top:28px;">
      <form data-search-form role="search" style="display:flex;gap:10px;background:var(--surface);border:1.5px solid var(--border);border-radius:8px;padding:10px 14px;">
        <input type="search" data-search-input placeholder="Search stories…"
          style="flex:1;border:none;outline:none;font-family:inherit;font-size:15px;background:none;color:var(--ink);" aria-label="Search">
        <button type="submit" style="font-size:13px;font-weight:700;color:var(--navy);background:none;border:none;cursor:pointer;">Go</button>
      </form>
    </div>
    <div style="margin-top:24px;display:flex;gap:10px;flex-wrap:wrap;">
      <button onclick="toggleViewMode();closeMobileNav();" class="view-toggle-btn" style="font-size:13px;padding:10px 18px;">
        📱 Toggle Social View
      </button>
      <button onclick="openNewsletterModal();closeMobileNav();" class="btn btn-primary" style="font-size:13px;">
        Subscribe
      </button>
    </div>
  </nav>

  <!-- Newsletter Modal -->
  <div id="newsletter-modal" onclick="if(event.target===this)closeNewsletterModal()"
    style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.55);z-index:400;align-items:center;justify-content:center;padding:16px;">
    <div class="modal-inner">
      <button onclick="closeNewsletterModal()" class="modal-close-btn" aria-label="Close">✕</button>
      <div style="font-size:32px;margin-bottom:12px;">📧</div>
      <h2 style="font-family:'Playfair Display',serif;font-size:22px;font-weight:700;margin-bottom:8px;color:var(--ink);">Stay in the Know</h2>
      <p style="font-size:14px;color:var(--ink-muted);margin-bottom:20px;line-height:1.6;">Get the biggest Nigerian stories delivered to your inbox daily — free, always.</p>
      <form class="newsletter-form" action="https://e18bac4f.sibforms.com/serve/MUIFAPGI6xVheGBljaJRqJgUuITSLy3IPoMLS09hIm3Npkhzr70ajEYrg_LmN-HMxh94HbjYIhOPSp7BKggwLLgv3PvbutEqREQhFXWntlUqWIIDZhOCxPDh8d8kIxE5gPk8_1jQuwlh3eY8qBRbcABtB-j2M3j0AlbWo-86qPZdTPTMNjaUDlL5WYvykdIrYAkUGQ6446zh_r8PoA==" method="POST" novalidate style="display:flex;flex-direction:column;gap:10px;">
        <input type="email" name="EMAIL" placeholder="Enter your email address" required
          style="padding:12px 16px;border:1.5px solid var(--border);border-radius:8px;font-size:15px;font-family:inherit;color:var(--ink);" aria-label="Email address">
        <button type="submit" class="newsletter-btn" style="padding:13px;background:var(--navy);color:white;border:none;border-radius:8px;font-size:15px;font-weight:700;cursor:pointer;">
          Subscribe Free
        </button>
      </form>
      <p style="font-size:11px;color:var(--ink-muted);margin-top:12px;text-align:center;">No spam. Unsubscribe at any time.</p>
    </div>
  </div>`;
}

/* ── RENDER FOOTER ─────────────────────────── */
function renderFooter() {
  return `
  <footer class="site-footer" role="contentinfo">
    <div class="container">
      <div class="footer-ad" role="complementary" aria-label="Advertisement">Advertisement — 728×90</div>
      <div class="footer-grid">
        <div class="footer-brand">
          <a href="index.html" class="site-logo" aria-label="Titoyin Home" style="margin-bottom:0;">
            <img class="site-logo-img" src="assets/titoyin-logo.png" alt="Titoyin's Blog"
              style="filter:brightness(0) invert(1);background:transparent;border:none;padding:0;height:48px;"
              onerror="this.style.display='none';this.nextElementSibling.style.display='block';">
            <span style="display:none;font-family:'Playfair Display',serif;font-size:22px;font-weight:900;color:white;font-style:italic;">Titoyin<span style="color:var(--accent);">'s Blog</span></span>
          </a>
          <p class="footer-desc">Nigeria's go-to platform for national news, politics, entertainment, fashion, and trending stories. Stay informed. Stay empowered.</p>
          <div class="footer-social">
            <a href="#" aria-label="Facebook"  target="_blank" rel="noopener">f</a>
            <a href="#" aria-label="X/Twitter" target="_blank" rel="noopener">𝕏</a>
            <a href="#" aria-label="Instagram" target="_blank" rel="noopener">◻</a>
            <a href="#" aria-label="TikTok"    target="_blank" rel="noopener">▶</a>
            <a href="#" aria-label="WhatsApp"  target="_blank" rel="noopener">W</a>
            <a href="#" aria-label="Telegram"  target="_blank" rel="noopener">T</a>
          </div>
        </div>
        <div class="footer-col">
          <h4>Categories</h4>
          <ul>
            <li><a href="category.html?cat=national">National Events</a></li>
            <li><a href="category.html?cat=politics">Politics</a></li>
            <li><a href="category.html?cat=entertainment">Entertainment</a></li>
            <li><a href="category.html?cat=fashion">Fashion & Style</a></li>
            <li><a href="category.html?cat=trending">Trending</a></li>
            <li><a href="category.html?cat=gossip">Gossip</a></li>
            <li><a href="category.html?cat=world">World</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Company</h4>
          <ul>
            <li><a href="about.html">About Us</a></li>
            <li><a href="contact.html">Contact Us</a></li>
            <li><a href="contact.html#advertising">Advertise</a></li>
            <li><a href="archive.html">Archive</a></li>
            <li><a href="feed.xml">RSS Feed</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Legal</h4>
          <ul>
            <li><a href="privacy.html">Privacy Policy</a></li>
            <li><a href="terms.html">Terms & Conditions</a></li>
            <li><a href="disclaimer.html">Disclaimer</a></li>
            <li><a href="copyright.html">Copyright Notice</a></li>
            <li><a href="takedown.html">Report / Takedown</a></li>
            <li><a href="ad-disclosure.html">Ad Disclosure</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© <span id="footer-year"></span> Titoyin's Blog. All rights reserved. Nigeria.</span>
        <div class="footer-bottom-links">
          <a href="privacy.html">Privacy</a>
          <a href="terms.html">Terms</a>
          <a href="disclaimer.html">Disclaimer</a>
          <a href="contact.html">Contact</a>
        </div>
      </div>
    </div>
  </footer>

  <!-- Cookie Banner -->
  <div id="cookie-banner" role="dialog" aria-label="Cookie consent" aria-live="polite">
    <p>We use cookies to improve your experience and analyse traffic. <a href="privacy.html">Learn more</a></p>
    <div class="cookie-btns">
      <button class="cookie-accept" id="cookie-accept">Accept</button>
      <button class="cookie-decline" id="cookie-decline">Decline</button>
    </div>
  </div>

  <div id="read-progress" role="progressbar" aria-hidden="true"></div>
  <button id="back-top" aria-label="Back to top">↑</button>
  <div id="site-toast" class="toast" role="alert" aria-live="polite"></div>`;
}

/* ── INJECT + INIT (runs after DOM ready) ──── */
document.addEventListener('DOMContentLoaded', function() {
  // Inject header using insertAdjacentHTML for reliable DOM insertion
  const hp = document.getElementById('site-header-placeholder');
  if (hp) {
    hp.insertAdjacentHTML('afterend', renderHeader());
    hp.remove();
  }

  // Inject footer
  const fp = document.getElementById('site-footer-placeholder');
  if (fp) {
    fp.insertAdjacentHTML('afterend', renderFooter());
    fp.remove();
  }

  // Use requestAnimationFrame to guarantee DOM is painted before init
  requestAnimationFrame(function() {
    // Set year and date
    const yr = document.getElementById('footer-year');
    if (yr) yr.textContent = new Date().getFullYear();
    const dt = document.getElementById('header-date');
    if (dt) {
      dt.textContent = new Date().toLocaleDateString('en-NG', {
        weekday:'long', year:'numeric', month:'long', day:'numeric'
      });
      dt.style.display = 'block';
    }

    // Init burger AFTER header is in DOM
    initBurger();

    // Apply saved view mode
    applyViewMode(getViewMode(), false);

    // Active nav link
    const current = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(link => {
      if (link.getAttribute('href') === current) link.classList.add('active');
    });

    // Sticky header shadow
    const header = document.querySelector('.site-header');
    if (header) {
      window.addEventListener('scroll', () => {
        header.style.boxShadow = window.scrollY > 10 ? 'var(--shadow-md)' : 'var(--shadow-sm)';
      }, { passive: true });
    }

    // Dark mode
    const savedTheme = localStorage.getItem('titoyin_theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if ((savedTheme || (prefersDark ? 'dark' : 'light')) === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      const btn = document.getElementById('dark-mode-btn');
      if (btn) btn.textContent = '☀️';
    }

    // Cookie consent
    if (!localStorage.getItem('titoyin_cookie_consent')) {
      const banner = document.getElementById('cookie-banner');
      if (banner) setTimeout(() => banner.classList.add('show'), 1500);
    }
    document.getElementById('cookie-accept')?.addEventListener('click', () => {
      localStorage.setItem('titoyin_cookie_consent', 'accepted');
      document.getElementById('cookie-banner')?.classList.remove('show');
    });
    document.getElementById('cookie-decline')?.addEventListener('click', () => {
      localStorage.setItem('titoyin_cookie_consent', 'declined');
      document.getElementById('cookie-banner')?.classList.remove('show');
    });
  });
});
