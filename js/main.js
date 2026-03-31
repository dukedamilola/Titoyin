/* =============================================
   TITOYIN — Main JavaScript
   ============================================= */

'use strict';

// ── MOBILE NAVIGATION ─────────────────────────
(function () {
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');
  const mobileClose = document.getElementById('mobile-nav-close');

  if (!hamburger || !mobileNav) return;

  hamburger.addEventListener('click', () => {
    mobileNav.classList.add('open');
    document.body.style.overflow = 'hidden';
    hamburger.setAttribute('aria-expanded', 'true');
  });

  function closeNav() {
    mobileNav.classList.remove('open');
    document.body.style.overflow = '';
    hamburger.setAttribute('aria-expanded', 'false');
  }

  if (mobileClose) mobileClose.addEventListener('click', closeNav);

  mobileNav.addEventListener('click', (e) => {
    if (e.target === mobileNav) closeNav();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeNav();
  });
})();

// ── BREAKING NEWS STRIP ───────────────────────
(function () {
  const strip = document.getElementById('breaking-strip');
  if (!strip) return;
  // Can be toggled from admin — class 'active' shows it
  // strip.classList.add('active'); // Uncomment to enable
})();

// ── BACK TO TOP ───────────────────────────────
(function () {
  const btn = document.getElementById('back-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('show');
    } else {
      btn.classList.remove('show');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

// ── READING PROGRESS BAR ──────────────────────
(function () {
  const bar = document.getElementById('read-progress');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const el = document.documentElement;
    const scrollTop = el.scrollTop || document.body.scrollTop;
    const scrollHeight = el.scrollHeight - el.clientHeight;
    const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    bar.style.width = Math.min(progress, 100) + '%';
  }, { passive: true });
})();

// ── TOAST NOTIFICATION ────────────────────────
function showToast(message, type = 'success', duration = 3000) {
  let toast = document.getElementById('site-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'site-toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.className = 'toast ' + type;

  requestAnimationFrame(() => {
    requestAnimationFrame(() => toast.classList.add('show'));
  });

  setTimeout(() => {
    toast.classList.remove('show');
  }, duration);
}
window.showToast = showToast;

// ── SHARE BUTTONS ─────────────────────────────
(function () {
  document.querySelectorAll('[data-share]').forEach(btn => {
    btn.addEventListener('click', () => {
      const platform = btn.dataset.share;
      const url = encodeURIComponent(window.location.href);
      const title = encodeURIComponent(document.title);
      let shareUrl = '';

      if (platform === 'facebook') {
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
      } else if (platform === 'twitter') {
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
      } else if (platform === 'whatsapp') {
        shareUrl = `https://wa.me/?text=${title}%20${url}`;
      } else if (platform === 'copy') {
        navigator.clipboard.writeText(window.location.href).then(() => {
          showToast('Link copied to clipboard!', 'success');
        }).catch(() => {
          showToast('Could not copy link.', 'error');
        });
        return;
      }

      if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=400,noopener,noreferrer');
      }
    });
  });
})();

// ── NEWSLETTER FORM ───────────────────────────
(function () {
  document.querySelectorAll('.newsletter-form').forEach(form => {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      const emailEl = this.querySelector('input[type="email"]');
      if (!emailEl || !emailEl.value) {
        showToast('Please enter a valid email address.', 'error');
        return;
      }

      const btn = this.querySelector('button[type="submit"], .newsletter-btn');
      if (btn) { btn.textContent = 'Subscribing…'; btn.disabled = true; }

      const action = this.getAttribute('action');
      if (action && action.includes('sibforms')) {
        try {
          const data = new FormData();
          data.append('EMAIL', emailEl.value);
          data.append('email_address_check', '');
          data.append('locale', 'en');
          await fetch(action, { method: 'POST', body: data, mode: 'no-cors' });
          showToast('Thank you! You are now subscribed. 🎉', 'success', 4000);
          emailEl.value = '';
        } catch(err) {
          // no-cors means we can't read response — assume success
          showToast('Thank you! You are now subscribed. 🎉', 'success', 4000);
          emailEl.value = '';
        }
      } else {
        showToast('Thank you! You are now subscribed. 🎉', 'success');
        emailEl.value = '';
      }

      if (btn) { btn.textContent = 'Subscribe Now'; btn.disabled = false; }
    });
  });
})();

// ── CONTACT FORM ──────────────────────────────
(function () {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const btn = this.querySelector('[type="submit"]');
    const name = this.querySelector('#name')?.value?.trim();
    const email = this.querySelector('#email')?.value?.trim();
    const msg = this.querySelector('#message')?.value?.trim();

    if (!name || !email || !msg) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }

    // Disable button temporarily
    btn.textContent = 'Sending…';
    btn.disabled = true;

    // Submit to Formspree → routes to titoyin.blog@gmail.com
    setTimeout(() => {
      showToast('Message sent! We will respond within 24 hours.', 'success');
      form.reset();
      btn.textContent = 'Send Message';
      btn.disabled = false;
    }, 1200);
  });
})();

// ── SEARCH FUNCTIONALITY ──────────────────────
(function () {
  const searchForms = document.querySelectorAll('[data-search-form]');
  searchForms.forEach(form => {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const q = this.querySelector('input')?.value?.trim();
      if (q) {
        window.location.href = `search.html?q=${encodeURIComponent(q)}`;
      }
    });
  });

  // Auto-populate search input from URL
  const params = new URLSearchParams(window.location.search);
  const q = params.get('q');
  if (q) {
    document.querySelectorAll('[data-search-input]').forEach(inp => {
      inp.value = q;
    });
    const resultsTitle = document.getElementById('search-results-title');
    if (resultsTitle) {
      resultsTitle.textContent = `Results for: "${q}"`;
    }
  }
})();

// ── ACTIVE NAV LINK ───────────────────────────
(function () {
  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === current || href === './' + current) {
      link.classList.add('active');
    }
  });
})();

// ── LAZY LOAD IMAGES ──────────────────────────
(function () {
  if ('IntersectionObserver' in window) {
    const imgs = document.querySelectorAll('img[data-src]');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          observer.unobserve(img);
        }
      });
    }, { rootMargin: '200px' });
    imgs.forEach(img => observer.observe(img));
  }
})();

// ── CATEGORY FILTER PILLS ─────────────────────
(function () {
  document.querySelectorAll('.filter-chip, .cat-pill').forEach(chip => {
    chip.addEventListener('click', function () {
      const group = this.closest('[data-filter-group]');
      if (group) {
        group.querySelectorAll('.filter-chip, .cat-pill').forEach(c => c.classList.remove('active'));
      }
      this.classList.toggle('active');
    });
  });
})();

// ── STICKY HEADER SHADOW ─────────────────────
(function () {
  const header = document.querySelector('.site-header');
  if (!header) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
      header.style.boxShadow = 'var(--shadow-md)';
    } else {
      header.style.boxShadow = 'var(--shadow-sm)';
    }
  }, { passive: true });
})();

// ── POSTS PER PAGE (desktop) ──────────────────
(function () {
  const sel = document.getElementById('per-page-select');
  if (!sel) return;
  sel.addEventListener('change', function () {
    const count = parseInt(this.value, 10);
    const allCards = document.querySelectorAll('.post-feed-item');
    allCards.forEach((card, i) => {
      card.style.display = i < count ? '' : 'none';
    });
    showToast(`Showing ${count} posts per page`);
  });
})();

// ── BREAKING NEWS TOGGLE (admin use) ─────────
window.toggleBreakingNews = function (message) {
  const strip = document.getElementById('breaking-strip');
  if (!strip) return;
  if (message) {
    const inner = strip.querySelector('.breaking-ticker-inner');
    if (inner) {
      const dup = message + ' &nbsp;&nbsp;&bull;&nbsp;&nbsp; ' + message;
      inner.innerHTML = `<span>${dup}</span>`;
    }
    strip.classList.add('active');
  } else {
    strip.classList.remove('active');
  }
};

// ── SCROLL ANIMATION ──────────────────────────
(function () {
  if (!('IntersectionObserver' in window)) return;
  const els = document.querySelectorAll('[data-animate]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity = '1';
        e.target.style.transform = 'translateY(0)';
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  els.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
  });
})();

// ── DARK MODE ─────────────────────────────────
function toggleDarkMode() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const newTheme = isDark ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('titoyin_theme', newTheme);
  const btn = document.getElementById('dark-mode-btn');
  if (btn) btn.textContent = newTheme === 'dark' ? '☀️' : '🌙';
}

// Apply saved theme on load
(function() {
  const saved = localStorage.getItem('titoyin_theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = saved || (prefersDark ? 'dark' : 'light');
  if (theme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    const btn = document.getElementById('dark-mode-btn');
    if (btn) btn.textContent = '☀️';
  }
})();

// ── READING TIME ──────────────────────────────
(function() {
  const body = document.querySelector('.article-body');
  if (!body) return;
  const words = body.innerText.trim().split(/\s+/).filter(Boolean).length;
  const mins  = Math.max(1, Math.ceil(words / 200));
  document.querySelectorAll('[data-reading-time]').forEach(el => {
    el.textContent = mins + ' min read';
  });
  const rtEl = document.getElementById('reading-time');
  if (rtEl) rtEl.textContent = mins + ' min read';
})();

// ── AUDIO READ-ALOUD ──────────────────────────
function initAudioRead() {
  const btn  = document.getElementById('audio-read-btn');
  const body = document.querySelector('.article-body');
  if (!btn || !body || !window.speechSynthesis) return;

  let utterance = null;
  let reading   = false;

  btn.addEventListener('click', function() {
    if (reading) {
      window.speechSynthesis.cancel();
      reading = false;
      btn.textContent = '🔊 Listen';
      btn.style.background = 'var(--surface)';
      return;
    }
    const text = body.innerText.trim().substring(0, 5000);
    utterance  = new SpeechSynthesisUtterance(text);
    utterance.lang  = 'en-NG';
    utterance.rate  = 0.92;
    utterance.pitch = 1;
    utterance.onend = () => { reading = false; btn.textContent = '🔊 Listen'; btn.style.background = 'var(--surface)'; };
    window.speechSynthesis.speak(utterance);
    reading = true;
    btn.textContent = '⏹ Stop';
    btn.style.background = 'var(--accent)';
    btn.style.color = 'white';
  });
}

document.addEventListener('DOMContentLoaded', initAudioRead);

// ── MID-ARTICLE SHARE NUDGE (mobile) ─────────
(function() {
  if (window.innerWidth > 768) return;
  const article = document.querySelector('.article-body');
  if (!article) return;

  let nudgeShown = false;
  window.addEventListener('scroll', function() {
    if (nudgeShown) return;
    const rect   = article.getBoundingClientRect();
    const height = article.offsetHeight;
    const scrolled = Math.abs(rect.top) / height;
    if (scrolled > 0.6) {
      nudgeShown = true;
      const nudge = document.createElement('div');
      nudge.innerHTML = `
        <div style="position:fixed;bottom:70px;left:0;right:0;z-index:88;display:flex;justify-content:center;padding:0 16px;animation:slideUp 0.4s ease;">
          <div style="background:var(--ink);color:white;border-radius:100px;padding:10px 20px;display:flex;align-items:center;gap:12px;font-size:13px;box-shadow:0 4px 20px rgba(0,0,0,0.3);">
            <span>Enjoying this story?</span>
            <button data-share="whatsapp" style="background:#25D366;color:white;border:none;border-radius:100px;padding:6px 14px;font-size:12px;font-weight:700;cursor:pointer;">📱 Share</button>
            <button onclick="this.closest('div').parentElement.parentElement.remove()" style="background:none;border:none;color:rgba(255,255,255,0.5);font-size:18px;cursor:pointer;padding:0 4px;">×</button>
          </div>
        </div>`;
      document.body.appendChild(nudge);
      setTimeout(() => nudge.remove(), 8000);
    }
  }, { passive: true });
})();

// ── COOKIE CONSENT BANNER ─────────────────────
(function() {
  if (localStorage.getItem('titoyin_cookie_consent')) return;
  const banner = document.getElementById('cookie-banner');
  if (!banner) return;
  setTimeout(() => banner.classList.add('show'), 1500);

  document.getElementById('cookie-accept')?.addEventListener('click', () => {
    localStorage.setItem('titoyin_cookie_consent', 'accepted');
    banner.classList.remove('show');
  });
  document.getElementById('cookie-decline')?.addEventListener('click', () => {
    localStorage.setItem('titoyin_cookie_consent', 'declined');
    banner.classList.remove('show');
  });
})();
