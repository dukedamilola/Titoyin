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
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const email = this.querySelector('input[type="email"]');
      if (!email || !email.value) {
        showToast('Please enter a valid email address.', 'error');
        return;
      }
      // Here you'd send to your email service (Mailchimp, etc.)
      showToast('Thank you! You are now subscribed.', 'success');
      email.value = '';
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

    // Simulate submission (replace with real form service like Formspree)
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
