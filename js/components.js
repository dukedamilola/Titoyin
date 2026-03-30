/* =============================================
   TITOYIN — Shared Components
   Injected into every page via components.js
   ============================================= */

const TITOYIN_NAV_LINKS = [
  { href: 'index.html',          label: 'Home' },
  { href: 'category.html?cat=national', label: 'National' },
  { href: 'category.html?cat=politics', label: 'Politics' },
  { href: 'category.html?cat=entertainment', label: 'Entertainment' },
  { href: 'category.html?cat=fashion', label: 'Fashion & Style' },
  { href: 'category.html?cat=trending', label: 'Trending' },
  { href: 'category.html?cat=gossip', label: 'Gossip' },
  { href: 'category.html?cat=world', label: 'World' },
];

function renderHeader() {
  const navLinks = TITOYIN_NAV_LINKS.map(n =>
    `<a href="${n.href}">${n.label}</a>`
  ).join('');

  const mobileNavLinks = TITOYIN_NAV_LINKS.map(n =>
    `<a href="${n.href}">${n.label} <span>›</span></a>`
  ).join('');

  return `
  <!-- Breaking News -->
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

  <!-- Site Header -->
  <header class="site-header" role="banner">
    <div class="container">
      <div class="header-top">
        <a href="index.html" class="site-logo">Tito<span>yin</span></a>
        <div class="header-meta">
          <form class="header-search" data-search-form role="search" aria-label="Site search">
            <span class="search-icon" aria-hidden="true">&#128269;</span>
            <input type="search" placeholder="Search stories…" aria-label="Search stories" data-search-input>
            <button type="submit" class="sr-only">Search</button>
          </form>
          <span id="header-date" style="font-size:12px;color:var(--ink-muted);white-space:nowrap;display:none" aria-live="polite"></span>
        </div>
      </div>

      <nav class="header-nav" role="navigation" aria-label="Main navigation">
        <div class="nav-links">
          ${navLinks}
        </div>
        <div class="nav-actions">
          <a href="contact.html" class="btn btn-primary" style="font-size:12px;padding:8px 16px;">Subscribe</a>
          <button class="hamburger" id="hamburger" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-nav">
            <span></span><span></span><span></span>
          </button>
        </div>
      </nav>
    </div>
  </header>

  <!-- Mobile Nav Overlay -->
  <nav class="mobile-nav" id="mobile-nav" role="navigation" aria-label="Mobile navigation">
    <button class="mobile-nav-close" id="mobile-nav-close" aria-label="Close menu">✕</button>
    <div class="mobile-nav-links">
      ${mobileNavLinks}
      <a href="about.html">About Us <span>›</span></a>
      <a href="contact.html">Contact <span>›</span></a>
      <a href="search.html">Search <span>›</span></a>
    </div>
    <div style="margin-top:32px;">
      <form class="header-search" data-search-form style="border-radius:8px;background:var(--surface);border:1.5px solid var(--border);padding:10px 16px;display:flex;gap:10px;" role="search">
        <input type="search" placeholder="Search stories…" data-search-input style="flex:1;border:none;outline:none;font-family:inherit;font-size:15px;background:none;">
        <button type="submit" style="font-size:13px;font-weight:600;color:var(--green-deep);background:none;border:none;cursor:pointer;">Go</button>
      </form>
    </div>
  </nav>
  `;
}

function renderFooter() {
  return `
  <footer class="site-footer" role="contentinfo">
    <div class="container">
      <!-- Footer Ad Slot -->
      <div class="footer-ad" role="complementary" aria-label="Advertisement">
        Advertisement — 728×90
      </div>

      <div class="footer-grid">
        <div class="footer-brand">
          <a href="index.html" class="site-logo" style="color:white;">Tito<span style="color:var(--accent);">yin</span></a>
          <p class="footer-desc">Nigeria's go-to platform for national news, politics, entertainment, fashion, and trending stories. Stay informed. Stay empowered.</p>
          <div class="footer-social">
            <a href="#" aria-label="Facebook" rel="noopener noreferrer" target="_blank">f</a>
            <a href="#" aria-label="X / Twitter" rel="noopener noreferrer" target="_blank">𝕏</a>
            <a href="#" aria-label="Instagram" rel="noopener noreferrer" target="_blank">&#9633;</a>
            <a href="#" aria-label="TikTok" rel="noopener noreferrer" target="_blank">&#9654;</a>
            <a href="#" aria-label="WhatsApp" rel="noopener noreferrer" target="_blank">W</a>
            <a href="#" aria-label="Telegram" rel="noopener noreferrer" target="_blank">T</a>
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
            <li><a href="contact.html#advertising">Advertise with Us</a></li>
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
        <span>© <span id="footer-year"></span> Titoyin. All rights reserved. Nigeria.</span>
        <div class="footer-bottom-links">
          <a href="privacy.html">Privacy</a>
          <a href="terms.html">Terms</a>
          <a href="disclaimer.html">Disclaimer</a>
          <a href="contact.html">Contact</a>
        </div>
      </div>
    </div>
  </footer>

  <!-- Reading Progress -->
  <div id="read-progress" role="progressbar" aria-hidden="true"></div>

  <!-- Back to Top -->
  <button id="back-top" aria-label="Back to top" title="Back to top">↑</button>

  <!-- Toast Notification -->
  <div id="site-toast" class="toast" role="alert" aria-live="polite"></div>
  `;
}

// Inject header and footer
document.addEventListener('DOMContentLoaded', function () {
  const headerPlaceholder = document.getElementById('site-header-placeholder');
  const footerPlaceholder = document.getElementById('site-footer-placeholder');

  if (headerPlaceholder) headerPlaceholder.outerHTML = renderHeader();
  if (footerPlaceholder) footerPlaceholder.outerHTML = renderFooter();

  // Set year and date
  const yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const dateEl = document.getElementById('header-date');
  if (dateEl) {
    dateEl.textContent = new Date().toLocaleDateString('en-NG', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
    dateEl.style.display = 'block';
  }

  // Now load main.js logic that needs the DOM
  // (main.js is loaded after components.js so this is fine)
});
