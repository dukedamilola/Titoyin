/* =============================================
   TITOYIN — Posts Data Layer v3
   ============================================= */

async function fetchPosts() {
  const urls = ['/posts.json', 'posts.json', '/titoyin/posts.json'];
  for (const url of urls) {
    try {
      const r = await fetch(url + '?t=' + Date.now(), { cache: 'no-store' });
      if (r.ok) {
        const data = await r.json();
        const posts = data.posts || [];
        console.log('[Titoyin] Loaded', posts.length, 'posts from', url);
        return posts;
      }
    } catch(e) { continue; }
  }
  console.warn('[Titoyin] Could not load posts.json');
  return [];
}

const CAT_LABELS = {
  national:'National', politics:'Politics', entertainment:'Entertainment',
  fashion:'Fashion & Style', trending:'Trending', gossip:'Gossip',
  world:'World', health:'Health', tech:'Technology', business:'Business'
};
const catLabel = cat => CAT_LABELS[cat] || cat || 'General';
const postUrl  = post => post.slug ? post.slug + '.html' : '#';

function renderPostCard(p) {
  const img = p.imgSrc
    ? `<a href="${postUrl(p)}" class="post-card-img-wrap"><img class="post-card-img" src="${p.imgSrc}" alt="${p.title||''}" loading="lazy"></a>`
    : `<a href="${postUrl(p)}" class="post-card-img-wrap" style="background:var(--navy-light);display:flex;align-items:center;justify-content:center;aspect-ratio:16/9;"><span style="font-size:32px;">📰</span></a>`;
  return `<article class="post-card" data-animate>${img}
    <div class="post-card-body">
      <span class="tag ${p.category||''}" style="margin-bottom:8px;display:inline-block;">${catLabel(p.category)}</span>
      <a href="${postUrl(p)}" class="post-card-title">${p.title||'Untitled'}</a>
      ${p.subtitle ? `<p class="post-card-excerpt">${p.subtitle}</p>` : ''}
      <div class="post-card-meta"><span>Titoyin</span><span>${p.date||''}</span></div>
    </div></article>`;
}

function renderListCard(p) {
  const img = p.imgSrc
    ? `<img class="post-list-img" src="${p.imgSrc}" alt="${p.title||''}" loading="lazy">`
    : `<div class="post-list-img" style="background:var(--navy-light);display:flex;align-items:center;justify-content:center;flex-shrink:0;border-radius:6px;"><span>📰</span></div>`;
  return `<div class="post-list-card">${img}
    <div class="post-list-body">
      <span class="tag ${p.category||''}" style="margin-bottom:4px;display:inline-block;font-size:9px;">${catLabel(p.category)}</span>
      <a href="${postUrl(p)}" class="post-list-title">${p.title||'Untitled'}</a>
      <div class="post-list-meta">${p.date||''}</div>
    </div></div>`;
}

function renderHeroLead(p) {
  const img = p.imgSrc || 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=900&q=80';
  return `<article class="hero-lead">
    <img class="hero-lead-img" src="${img}" alt="${p.title||''}" loading="eager">
    <div class="hero-lead-content">
      <span class="tag ${p.category||''}">${catLabel(p.category)}</span>
      <a href="${postUrl(p)}"><h2 class="hero-lead-title">${p.title||''}</h2></a>
      <p class="hero-lead-meta">Titoyin Editorial &nbsp;·&nbsp; ${p.date||''}</p>
    </div></article>`;
}

function renderHeroCard(p) {
  return `<article class="hero-card" data-animate>
    ${p.imgSrc
      ? `<img class="hero-card-img" src="${p.imgSrc}" alt="${p.title||''}" loading="lazy">`
      : `<div class="hero-card-img" style="background:var(--navy-light);display:flex;align-items:center;justify-content:center;"><span>📰</span></div>`}
    <div class="hero-card-body">
      <span class="tag ${p.category||''}" style="margin-bottom:5px;display:inline-block;">${catLabel(p.category)}</span>
      <a href="${postUrl(p)}" class="hero-card-title">${p.title||''}</a>
      <p class="hero-card-meta">${p.date||''}</p>
    </div></article>`;
}

function renderTrendingItem(p, n) {
  return `<div class="trending-item">
    <span class="trending-num">${n}</span>
    <div><div class="trending-cat">${catLabel(p.category)}</div>
    <a href="${postUrl(p)}" class="trending-title" style="color:#ffffff!important;">${p.title||''}</a></div>
  </div>`;
}

function renderNumberedPost(p, n) {
  return `<div class="post-numbered">
    <span class="post-num">${String(n).padStart(2,'0')}</span>
    <div><a href="${postUrl(p)}" class="post-num-title">${p.title||''}</a>
    <div class="post-list-meta" style="margin-top:3px;">${p.date||''}</div></div>
  </div>`;
}

function setEl(id, html) {
  const el = document.getElementById(id);
  if (el) { el.innerHTML = html; return true; }
  return false;
}

const EMPTY_GRID = `<div style="grid-column:1/-1;text-align:center;padding:48px;color:var(--ink-muted);">
  <div style="font-size:40px;margin-bottom:12px;">📰</div>
  <div style="font-size:16px;font-weight:500;">No stories published yet — check back soon</div>
</div>`;

async function loadHomepage() {
  const posts = await fetchPosts();
  const pub   = posts.filter(p => p.status === 'published');
  console.log('[Titoyin] Rendering', pub.length, 'posts on homepage');

  const hero = pub.find(p => p.featured) || pub[0];
  if (hero) {
    const el = document.getElementById('hero-lead');
    if (el) el.innerHTML = renderHeroLead(hero);
  }

  const secondary = pub.filter(p => !hero || p.id !== hero.id).slice(0,3);
  setEl('hero-secondary', secondary.map(renderHeroCard).join(''));
  setEl('latest-posts-grid',    pub.length ? pub.slice(0,12).map(renderPostCard).join('') : EMPTY_GRID);
  setEl('trending-posts',       (pub.filter(p=>p.trending).slice(0,4).length ? pub.filter(p=>p.trending).slice(0,4) : pub.slice(0,4)).map((p,i)=>renderTrendingItem(p,i+1)).join(''));
  setEl('most-read-list',       pub.slice(0,5).map((p,i)=>renderNumberedPost(p,i+1)).join(''));
  setEl('editors-picks-grid',   (pub.filter(p=>p.editorsPick).slice(0,3).length>=2 ? pub.filter(p=>p.editorsPick).slice(0,3) : pub.slice(3,6)).map(renderPostCard).join(''));
  setEl('entertainment-grid',   (pub.filter(p=>p.category==='entertainment').slice(0,4).length ? pub.filter(p=>p.category==='entertainment').slice(0,4) : pub.slice(0,4)).map(renderPostCard).join(''));
}

async function loadCategoryPage(cat) {
  const posts = await fetchPosts();
  const items = posts.filter(p => p.status==='published' && p.category===cat);
  const el = document.getElementById('category-count');
  if (el) el.textContent = `${items.length} stor${items.length!==1?'ies':'y'}`;
  setEl('category-posts-grid', items.length ? items.map(renderPostCard).join('') : '<div style="grid-column:1/-1;text-align:center;padding:48px;color:var(--ink-muted);">No stories in this category yet.</div>');
}

async function loadSearchPage(query) {
  const posts = await fetchPosts();
  const q = (query||'').toLowerCase().trim();
  const results = posts.filter(p => p.status==='published' && (!q || (p.title||'').toLowerCase().includes(q) || (p.subtitle||'').toLowerCase().includes(q) || (p.tags||'').toLowerCase().includes(q)));
  const el = document.getElementById('search-count');
  if (el) el.textContent = q ? `${results.length} result${results.length!==1?'s':''} for "${query}"` : `${results.length} stories`;
  setEl('search-results', results.length ? results.map(renderListCard).join('') : `<div style="text-align:center;padding:48px;color:var(--ink-muted);"><div style="font-size:40px;margin-bottom:12px;">🔍</div><div>No results for "${query}"</div></div>`);
}

async function loadArchivePage() {
  const posts = await fetchPosts();
  const pub = posts.filter(p => p.status==='published');
  const groups = {};
  pub.forEach(p => { const k = p.date?p.date.split(' ').slice(1).join(' '):'Recent'; if(!groups[k])groups[k]=[]; groups[k].push(p); });
  setEl('archive-list', Object.entries(groups).map(([m,items])=>`
    <h2 style="font-family:var(--font-serif);font-size:20px;font-weight:700;color:var(--ink-muted);margin:28px 0 16px;display:flex;align-items:center;gap:12px;">${m}
      <span style="font-size:12px;background:var(--navy-light);color:var(--navy);padding:3px 10px;border-radius:100px;">${items.length}</span></h2>
    ${items.map(renderListCard).join('')}`).join('<hr class="divider">'));
}

document.addEventListener('DOMContentLoaded', async function() {
  const page   = window.location.pathname.split('/').pop() || 'index.html';
  const params = new URLSearchParams(window.location.search);

  if (!page || page === 'index.html' || page === '') await loadHomepage();
  else if (page === 'category.html') await loadCategoryPage(params.get('cat')||'national');
  else if (page === 'search.html')   await loadSearchPage(params.get('q')||'');
  else if (page === 'archive.html')  await loadArchivePage();

  if (document.getElementById('related-posts')) {
    const posts = await fetchPosts();
    const slug  = page.replace('.html','');
    const cat   = document.querySelector('.article-kicker .tag')?.classList[1] || '';
    const related = posts.filter(p=>p.status==='published'&&p.slug!==slug&&p.category===cat).slice(0,3);
    const fallback = posts.filter(p=>p.status==='published'&&p.slug!==slug).slice(0,3);
    setEl('related-posts', (related.length>=2?related:fallback).map(renderPostCard).join(''));
  }

  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.style.opacity='1';
          e.target.style.transform='translateY(0)';
          obs.unobserve(e.target);
        }
      });
    }, { threshold:0.08 });
    document.querySelectorAll('[data-animate]').forEach(el => {
      el.style.cssText += 'opacity:0;transform:translateY(18px);transition:opacity 0.45s ease,transform 0.45s ease;';
      obs.observe(el);
    });
  }
});
