/* =============================================
   TITOYIN — Posts Data Layer
   Reads from posts.json and renders content
   dynamically on all public pages
   ============================================= */

const POSTS_URL = '/posts.json';

// Cache
let _postsCache = null;
let _postsPromise = null;

// ── FETCH ALL POSTS ───────────────────────────
async function fetchPosts() {
  if (_postsCache) return _postsCache;
  if (_postsPromise) return _postsPromise;

  _postsPromise = fetch(POSTS_URL + '?v=' + Date.now())
    .then(r => r.json())
    .then(data => {
      _postsCache = data.posts || [];
      return _postsCache;
    })
    .catch(() => []);

  return _postsPromise;
}

// ── CATEGORY LABELS & TAG CLASSES ────────────
const CAT_LABELS = {
  national:'National', politics:'Politics',
  entertainment:'Entertainment', fashion:'Fashion & Style',
  trending:'Trending', gossip:'Gossip', world:'World',
  health:'Health', tech:'Technology', business:'Business'
};

function catLabel(cat) { return CAT_LABELS[cat] || cat || 'General'; }

// ── RENDER A POST CARD ────────────────────────
function renderPostCard(post, size = 'normal') {
  const img = post.imgSrc
    ? `<a href="${post.slug}.html" class="post-card-img-wrap" aria-label="${post.title}"><img class="post-card-img" src="${post.imgSrc}" alt="${post.title}" loading="lazy"></a>`
    : `<a href="${post.slug}.html" class="post-card-img-wrap" style="background:var(--navy-light);display:flex;align-items:center;justify-content:center;aspect-ratio:16/9;" aria-label="${post.title}"><span style="font-size:36px;">📰</span></a>`;

  const badges = [
    post.featured    ? '<span class="editors-pick">Featured</span>' : '',
    post.editorsPick ? '<span class="editors-pick">Editor\'s Pick</span>' : '',
    post.trending    ? '<span class="tag trending" style="font-size:9px;">🔥 Trending</span>' : ''
  ].filter(Boolean).join(' ');

  return `
    <article class="post-card" data-animate>
      ${img}
      <div class="post-card-body">
        <div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap;margin-bottom:7px;">
          <span class="tag ${post.category||''}">${catLabel(post.category)}</span>
          ${badges}
        </div>
        <a href="${post.slug}.html" class="post-card-title">${post.title||''}</a>
        ${post.subtitle ? `<p class="post-card-excerpt">${post.subtitle}</p>` : ''}
        <div class="post-card-meta">
          <span>Titoyin Editorial</span>
          <span>${post.date||''}</span>
        </div>
      </div>
    </article>`;
}

// ── RENDER A LIST CARD ────────────────────────
function renderListCard(post) {
  const img = post.imgSrc
    ? `<img class="post-list-img" src="${post.imgSrc}" alt="${post.title}" loading="lazy">`
    : `<div class="post-list-img" style="background:var(--navy-light);display:flex;align-items:center;justify-content:center;flex-shrink:0;"><span style="font-size:20px;">📰</span></div>`;

  return `
    <div class="post-list-card">
      ${img}
      <div class="post-list-body">
        <span class="tag ${post.category||''}" style="margin-bottom:4px;display:inline-block;">${catLabel(post.category)}</span>
        <a href="${post.slug}.html" class="post-list-title">${post.title||''}</a>
        <div class="post-list-meta">${post.date||''}</div>
      </div>
    </div>`;
}

// ── RENDER HERO LEAD ──────────────────────────
function renderHeroLead(post) {
  const img = post.imgSrc || 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=900&q=80';
  return `
    <article class="hero-lead">
      <img class="hero-lead-img" src="${img}" alt="${post.title}" loading="eager">
      <div class="hero-lead-content">
        <span class="tag ${post.category||''}">${catLabel(post.category)}</span>
        <a href="${post.slug}.html">
          <h1 class="hero-lead-title">${post.title||''}</h1>
        </a>
        <p class="hero-lead-meta">Titoyin Editorial &nbsp;·&nbsp; ${post.date||''}</p>
      </div>
    </article>`;
}

// ── RENDER HERO CARD (secondary) ──────────────
function renderHeroCard(post) {
  const img = post.imgSrc || '';
  return `
    <article class="hero-card" data-animate>
      ${img ? `<img class="hero-card-img" src="${img}" alt="${post.title}" loading="lazy">` : '<div class="hero-card-img" style="background:var(--navy-light);display:flex;align-items:center;justify-content:center;"><span style="font-size:24px;">📰</span></div>'}
      <div class="hero-card-body">
        <span class="tag ${post.category||''}">${catLabel(post.category)}</span>
        <a href="${post.slug}.html" class="hero-card-title">${post.title||''}</a>
        <p class="hero-card-meta">${post.date||''}</p>
      </div>
    </article>`;
}

// ── RENDER TRENDING ITEM ──────────────────────
function renderTrendingItem(post, num) {
  return `
    <div class="trending-item">
      <span class="trending-num">${num}</span>
      <div>
        <div class="trending-cat">${catLabel(post.category)}</div>
        <a href="${post.slug}.html" class="trending-title">${post.title||''}</a>
      </div>
    </div>`;
}

// ── RENDER NUMBERED POST ──────────────────────
function renderNumberedPost(post, num) {
  return `
    <div class="post-numbered">
      <span class="post-num">${String(num).padStart(2,'0')}</span>
      <div>
        <a href="${post.slug}.html" class="post-num-title">${post.title||''}</a>
        <div class="post-list-meta" style="margin-top:3px;">${post.date||''}</div>
      </div>
    </div>`;
}

// ── LOAD HOMEPAGE ─────────────────────────────
async function loadHomepage() {
  const posts = await fetchPosts();
  if (!posts.length) return; // Keep placeholder content if no posts yet

  const published = posts.filter(p => p.status === 'published');
  if (!published.length) return;

  // Hero lead — featured post or latest
  const heroPost = published.find(p => p.featured) || published[0];
  const heroEl   = document.getElementById('hero-lead');
  if (heroEl) heroEl.outerHTML = renderHeroLead(heroPost);

  // Hero secondary (next 3)
  const secondaryEl = document.getElementById('hero-secondary');
  if (secondaryEl) {
    const secondary = published.filter(p => p.id !== heroPost.id).slice(0, 3);
    secondaryEl.innerHTML = secondary.map(p => renderHeroCard(p)).join('');
  }

  // Latest posts grid
  const latestEl = document.getElementById('latest-posts-grid');
  if (latestEl) {
    const latest = published.slice(0, 12);
    latestEl.innerHTML = latest.map(p => renderPostCard(p)).join('');
  }

  // Trending strip
  const trendingEl = document.getElementById('trending-posts');
  if (trendingEl) {
    const trending = published.filter(p => p.trending).slice(0, 4);
    const fallback = published.slice(0, 4);
    const items    = trending.length >= 2 ? trending : fallback;
    trendingEl.innerHTML = items.map((p, i) => renderTrendingItem(p, i+1)).join('');
  }

  // Most read widget
  const mostReadEl = document.getElementById('most-read-list');
  if (mostReadEl) {
    mostReadEl.innerHTML = published.slice(0, 5).map((p, i) => renderNumberedPost(p, i+1)).join('');
  }

  // Editor's picks
  const picksEl = document.getElementById('editors-picks-grid');
  if (picksEl) {
    const picks = published.filter(p => p.editorsPick).slice(0, 3);
    const fallback = published.slice(3, 6);
    const items = picks.length >= 2 ? picks : fallback;
    picksEl.innerHTML = items.map(p => renderPostCard(p)).join('');
  }

  // Entertainment grid
  const entEl = document.getElementById('entertainment-grid');
  if (entEl) {
    const ent = published.filter(p => p.category === 'entertainment').slice(0, 4);
    entEl.innerHTML = ent.map(p => renderPostCard(p)).join('');
  }
}

// ── LOAD CATEGORY PAGE ────────────────────────
async function loadCategoryPage(cat) {
  const posts = await fetchPosts();
  const filtered = posts.filter(p => p.status === 'published' && p.category === cat);

  const grid = document.getElementById('category-posts-grid');
  const count = document.getElementById('category-count');

  if (count) count.textContent = `${filtered.length} stor${filtered.length !== 1 ? 'ies' : 'y'}`;

  if (!grid) return;
  if (!filtered.length) {
    grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:48px;color:var(--ink-muted);">No stories published in this category yet. Check back soon.</div>';
    return;
  }
  grid.innerHTML = filtered.map(p => renderPostCard(p)).join('');
}

// ── LOAD SEARCH PAGE ──────────────────────────
async function loadSearchPage(query) {
  const posts = await fetchPosts();
  const q = query.toLowerCase().trim();

  const results = q ? posts.filter(p =>
    p.status === 'published' && (
      (p.title||'').toLowerCase().includes(q) ||
      (p.subtitle||'').toLowerCase().includes(q) ||
      (p.category||'').toLowerCase().includes(q) ||
      (p.tags||'').toLowerCase().includes(q)
    )
  ) : posts.filter(p => p.status === 'published');

  const container = document.getElementById('search-results');
  const countEl   = document.getElementById('search-count');

  if (countEl) countEl.textContent = q
    ? `${results.length} result${results.length !== 1 ? 's' : ''} for "${query}"`
    : `${results.length} total stories`;

  if (!container) return;
  if (!results.length) {
    container.innerHTML = `
      <div style="text-align:center;padding:48px;color:var(--ink-muted);">
        <div style="font-size:40px;margin-bottom:12px;">🔍</div>
        <div style="font-size:16px;font-weight:500;margin-bottom:8px;">No results found for "${query}"</div>
        <div style="font-size:14px;">Try different keywords or browse by category</div>
      </div>`;
    return;
  }
  container.innerHTML = results.map(p => renderListCard(p)).join('');
}

// ── LOAD ARCHIVE PAGE ─────────────────────────
async function loadArchivePage() {
  const posts = await fetchPosts();
  const published = posts.filter(p => p.status === 'published');

  const container = document.getElementById('archive-list');
  if (!container || !published.length) return;

  // Group by month
  const groups = {};
  published.forEach(p => {
    const key = p.date ? p.date.split(' ').slice(1).join(' ') : 'Recent';
    if (!groups[key]) groups[key] = [];
    groups[key].push(p);
  });

  container.innerHTML = Object.entries(groups).map(([month, items]) => `
    <h2 style="font-family:var(--font-serif);font-size:20px;font-weight:700;color:var(--ink-muted);margin:28px 0 16px;display:flex;align-items:center;gap:12px;">
      ${month}
      <span style="font-size:12px;background:var(--navy-light);color:var(--navy);padding:3px 10px;border-radius:100px;font-weight:500;">${items.length} ${items.length !== 1 ? 'stories' : 'story'}</span>
    </h2>
    ${items.map(p => renderListCard(p)).join('')}
  `).join('<hr class="divider">');
}

// ── LOAD RELATED POSTS ────────────────────────
async function loadRelatedPosts(currentSlug, category) {
  const posts = await fetchPosts();
  const related = posts.filter(p =>
    p.status === 'published' &&
    p.slug !== currentSlug &&
    p.category === category
  ).slice(0, 3);

  const fallback = posts.filter(p =>
    p.status === 'published' && p.slug !== currentSlug
  ).slice(0, 3);

  const items  = related.length >= 2 ? related : fallback;
  const grid   = document.getElementById('related-posts');
  if (!grid || !items.length) return;
  grid.innerHTML = items.map(p => renderPostCard(p)).join('');
}

// ── AUTO-INIT ON PAGE LOAD ────────────────────
document.addEventListener('DOMContentLoaded', async function() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  const params = new URLSearchParams(window.location.search);

  if (page === 'index.html' || page === '') {
    await loadHomepage();
  } else if (page === 'category.html') {
    const cat = params.get('cat') || 'national';
    await loadCategoryPage(cat);
  } else if (page === 'search.html') {
    const q = params.get('q') || '';
    await loadSearchPage(q);
  } else if (page === 'archive.html') {
    await loadArchivePage();
  }

  // Related posts on article pages
  const relatedGrid = document.getElementById('related-posts');
  if (relatedGrid) {
    const slug = page.replace('.html','');
    const cat  = document.querySelector('.tag')?.className?.split(' ')[1] || '';
    await loadRelatedPosts(slug, cat);
  }

  // Scroll animations
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.style.opacity = '1';
          e.target.style.transform = 'translateY(0)';
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.08 });
    document.querySelectorAll('[data-animate]').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(18px)';
      el.style.transition = 'opacity 0.45s ease, transform 0.45s ease';
      obs.observe(el);
    });
  }
});
