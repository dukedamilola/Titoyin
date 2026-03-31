/* =============================================
   TITOYIN — GitHub API Auto-Publisher
   Pushes posts directly to your GitHub repo
   ============================================= */

const GITHUB_USER = 'dukedamilola';
const GITHUB_REPO = 'titoyin';
const GITHUB_BRANCH = 'main';
const GITHUB_API = 'https://api.github.com';

// ── TOKEN MANAGEMENT ──────────────────────────
function getToken() {
  return sessionStorage.getItem('gh_token') || '';
}
function setToken(token) {
  sessionStorage.setItem('gh_token', token.trim());
}
function clearToken() {
  sessionStorage.removeItem('gh_token');
}
function hasToken() {
  return !!getToken();
}

// ── CORE API CALL ─────────────────────────────
async function githubAPI(method, path, body) {
  const token = getToken();
  if (!token) throw new Error('No GitHub token set. Go to Settings to add your token.');

  const res = await fetch(`${GITHUB_API}/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/${path}`, {
    method,
    headers: {
      'Authorization': `token ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/vnd.github.v3+json'
    },
    body: body ? JSON.stringify(body) : undefined
  });

  if (res.status === 401) {
    clearToken();
    throw new Error('GitHub token is invalid or expired. Please update your token in Settings.');
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `GitHub API error: ${res.status}`);
  }
  return res.status === 204 ? null : res.json();
}

// ── GET FILE SHA (needed to update existing files) ────
async function getFileSHA(path) {
  try {
    const res = await fetch(`${GITHUB_API}/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/${path}`, {
      headers: {
        'Authorization': `token ${getToken()}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    if (res.status === 404) return null;
    const data = await res.json();
    return data.sha || null;
  } catch { return null; }
}

// ── ENCODE CONTENT TO BASE64 ──────────────────
function toBase64(str) {
  return btoa(unescape(encodeURIComponent(str)));
}

// ── PUSH A FILE TO GITHUB ─────────────────────
async function pushFile(path, content, commitMessage) {
  const sha = await getFileSHA(path);
  const body = {
    message: commitMessage,
    content: toBase64(content),
    branch: GITHUB_BRANCH
  };
  if (sha) body.sha = sha;
  return githubAPI('PUT', path, body);
}

// ── GENERATE ARTICLE SLUG ─────────────────────
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 60);
}

// ── GENERATE ARTICLE HTML ─────────────────────
function generateArticleHTML(post) {
  const categoryLabels = {
    national: 'National', politics: 'Politics',
    entertainment: 'Entertainment', fashion: 'Fashion & Style',
    trending: 'Trending', gossip: 'Gossip', world: 'World',
    health: 'Health', tech: 'Technology', business: 'Business'
  };
  const tagClass = post.category || 'national';
  const catLabel = categoryLabels[post.category] || post.category || 'National';
  const tags = post.tags ? post.tags.split(',').filter(Boolean) : [];
  const featuredImgHTML = post.imgSrc ? `
      <figure style="max-width:960px;margin:0 auto;">
        <img class="article-cover" src="${post.imgSrc}" alt="${post.title}" loading="eager">
        ${post.imgCaption ? `<figcaption class="article-caption">${post.imgCaption}</figcaption>` : ''}
      </figure>` : '';

  const sourceHTML = (post.sourceUrl || post.sourceName) ? `
        <div class="source-box">
          <strong>Source:</strong> ${post.sourceName || ''}
          ${post.sourceUrl ? `<a href="${post.sourceUrl}" target="_blank" rel="noopener noreferrer" style="margin-left:8px;">View original →</a>` : ''}
        </div>` : '';

  const socialHTML = post.socialLink ? `
        <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg);padding:16px;margin:24px 0;">
          <div style="font-size:12px;color:var(--ink-muted);margin-bottom:8px;">Referenced content</div>
          <a href="${post.socialLink}" target="_blank" rel="noopener noreferrer" style="color:var(--navy);font-weight:500;word-break:break-all;">${post.socialLink}</a>
          ${post.socialCredit ? `<div style="font-size:12px;color:var(--ink-muted);margin-top:6px;">Credit: ${post.socialCredit}</div>` : ''}
        </div>` : '';

  const tagsHTML = tags.length ? `
      <div class="article-tags">
        <span class="label-sm">Tags:</span>
        ${tags.map(t => `<a href="search.html?q=${encodeURIComponent(t.trim())}" class="article-tag-pill">${t.trim()}</a>`).join('')}
      </div>` : '';

  const featuredBadge = post.featured ? '<span class="editors-pick" style="margin-left:8px;">Featured</span>' : '';
  const editorsBadge  = post.editorsPick ? '<span class="editors-pick" style="margin-left:8px;">Editor\'s Pick</span>' : '';

  return `<!DOCTYPE html>
<html lang="en-NG">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${(post.subtitle || post.title || '').replace(/"/g, '&quot;')}">
  <meta property="og:title" content="${(post.title || '').replace(/"/g, '&quot;')} — Titoyin">
  <meta property="og:description" content="${(post.subtitle || '').replace(/"/g, '&quot;')}">
  <meta property="og:type" content="article">
  <meta property="og:url" content="https://titoyin.com/${post.slug}.html">
  ${post.imgSrc ? `<meta property="og:image" content="${post.imgSrc}">` : ''}
  <meta name="twitter:card" content="summary_large_image">
  <link rel="canonical" href="https://titoyin.com/${post.slug}.html">
  <link rel="alternate" type="application/rss+xml" title="Titoyin RSS Feed" href="feed.xml">
  <title>${post.title || 'Article'} — Titoyin</title>
  <link rel="stylesheet" href="css/style.css">
  <link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
</head>
<body>
<div id="site-header-placeholder"></div>
<main id="main" role="main">
  <article class="article-hero" itemscope itemtype="https://schema.org/NewsArticle">
    <div class="container">
      <div class="article-header">
        <div class="article-kicker">
          <span class="tag ${tagClass}">${catLabel}</span>
          ${post.type !== 'article' ? `<span class="label-sm">${post.type}</span>` : ''}
          ${featuredBadge}${editorsBadge}
        </div>
        <h1 class="article-title" itemprop="headline">${post.title || ''}</h1>
        ${post.subtitle ? `<p class="article-subtitle" itemprop="description">${post.subtitle}</p>` : ''}
        <div class="article-byline">
          <div class="byline-avatar" aria-hidden="true">T</div>
          <div class="byline-info">
            <div class="byline-name" itemprop="author">Titoyin Editorial</div>
            <div class="byline-meta">
              <time itemprop="datePublished">${post.date || ''}</time>
            </div>
          </div>
          <div class="share-row" role="group" aria-label="Share this article">
            <button class="share-btn fb" data-share="facebook">f Share</button>
            <button class="share-btn tw" data-share="twitter">𝕏 Tweet</button>
            <button class="share-btn wa" data-share="whatsapp">WhatsApp</button>
            <button class="share-btn copy" data-share="copy">📋 Copy Link</button>
          </div>
        </div>
      </div>
      ${featuredImgHTML}
      <div class="article-body" itemprop="articleBody">
        ${post.body || ''}
        ${socialHTML}
        ${sourceHTML}
      </div>
      ${tagsHTML}
      <div style="max-width:760px;margin:0 auto;padding:20px 0;border-top:1px solid var(--border);">
        <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
          <span style="font-size:13px;font-weight:600;color:var(--ink-muted);">Share this story:</span>
          <button class="share-btn fb" data-share="facebook">f Facebook</button>
          <button class="share-btn tw" data-share="twitter">𝕏 Twitter</button>
          <button class="share-btn wa" data-share="whatsapp">WhatsApp</button>
          <button class="share-btn copy" data-share="copy">📋 Copy Link</button>
        </div>
      </div>
    </div>
    <section class="section section-alt" aria-label="More stories">
      <div class="container">
        <h2 class="section-title">More <span>Stories</span></h2>
        <div class="grid-3" id="related-posts"></div>
      </div>
    </section>
  </article>
</main>
<div id="site-footer-placeholder"></div>
<script src="js/components.js"></script>
<script src="js/main.js"></script>
<script>
// Load related posts from other articles
(function() {
  const grid = document.getElementById('related-posts');
  if (!grid) return;
  // Placeholder related posts - will show latest 3 articles
  grid.innerHTML = '<div class="text-muted" style="font-size:14px;">Related stories loading...</div>';
})();
</script>
</body>
</html>`;
}

// ── GENERATE HOMEPAGE CARD HTML ───────────────
function generatePostCard(post) {
  const categoryLabels = {
    national:'National', politics:'Politics', entertainment:'Entertainment',
    fashion:'Fashion & Style', trending:'Trending', gossip:'Gossip',
    world:'World', health:'Health', tech:'Technology', business:'Business'
  };
  const catLabel = categoryLabels[post.category] || post.category || '';
  const imgHTML  = post.imgSrc
    ? `<a href="${post.slug}.html" class="post-card-img-wrap"><img class="post-card-img" src="${post.imgSrc}" alt="${post.title}" loading="lazy"></a>`
    : `<a href="${post.slug}.html" class="post-card-img-wrap" style="background:var(--navy-light);display:flex;align-items:center;justify-content:center;aspect-ratio:16/9;"><span style="font-size:32px;">📰</span></a>`;

  return `
            <article class="post-card" data-animate>
              ${imgHTML}
              <div class="post-card-body">
                <span class="tag ${post.category||''}">${catLabel}</span>
                <a href="${post.slug}.html" class="post-card-title">${post.title||''}</a>
                ${post.subtitle ? `<p class="post-card-excerpt">${post.subtitle}</p>` : ''}
                <div class="post-card-meta">
                  <span>Titoyin Editorial</span>
                  <span>${post.date||''}</span>
                </div>
              </div>
            </article>`;
}

// ── UPDATE POSTS.JSON ─────────────────────────
async function updatePostsJSON(posts) {
  const published = posts
    .filter(p => p.status === 'published' && p.slug)
    .map(p => ({
      id:          p.id,
      slug:        p.slug,
      title:       p.title,
      subtitle:    p.subtitle,
      category:    p.category,
      type:        p.type || 'article',
      tags:        p.tags,
      date:        p.date,
      imgSrc:      p.imgSrc || '',
      featured:    p.featured || false,
      pinned:      p.pinned || false,
      trending:    p.trending || false,
      editorsPick: p.editorsPick || false,
      status:      'published'
    }));

  const json = JSON.stringify({
    updated: new Date().toISOString(),
    posts: published
  }, null, 2);

  await pushFile('posts.json', json, 'Update posts.json');
}

// ── UPDATE SITEMAP ────────────────────────────
async function updateSitemap(posts) {
  const published = posts.filter(p => p.status === 'published' && p.slug);
  const today = new Date().toISOString().split('T')[0];

  const urls = [
    { loc: 'https://titoyin.com/', priority: '1.0', freq: 'daily' },
    { loc: 'https://titoyin.com/about.html', priority: '0.5', freq: 'monthly' },
    { loc: 'https://titoyin.com/contact.html', priority: '0.5', freq: 'monthly' },
    ...published.map(p => ({
      loc: `https://titoyin.com/${p.slug}.html`,
      priority: p.featured ? '0.9' : '0.8',
      freq: 'weekly',
      lastmod: today
    }))
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <changefreq>${u.freq}</changefreq>
    <priority>${u.priority}</priority>
    ${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}
  </url>`).join('\n')}
</urlset>`;

  await pushFile('sitemap.xml', sitemap, 'Update sitemap.xml');
}

// ── UPDATE RSS FEED ───────────────────────────
async function updateRSSFeed(posts) {
  const published = posts.filter(p => p.status === 'published' && p.slug).slice(0, 20);
  const items = published.map(p => `
    <item>
      <title><![CDATA[${p.title || ''}]]></title>
      <link>https://titoyin.com/${p.slug}.html</link>
      <description><![CDATA[${p.subtitle || ''}]]></description>
      <pubDate>${new Date().toUTCString()}</pubDate>
      <guid isPermaLink="true">https://titoyin.com/${p.slug}.html</guid>
      <category>${p.category || ''}</category>
    </item>`).join('');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Titoyin — Nigeria's News, Media &amp; Lifestyle Platform</title>
    <link>https://titoyin.com</link>
    <description>The latest Nigerian news, politics, entertainment, fashion, and trending stories.</description>
    <language>en-NG</language>
    <atom:link href="https://titoyin.com/feed.xml" rel="self" type="application/rss+xml"/>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${items}
  </channel>
</rss>`;

  await pushFile('feed.xml', rss, 'Update RSS feed');
}

// ── MAIN PUBLISH FUNCTION ─────────────────────
async function publishToGitHub(post) {
  if (!hasToken()) {
    throw new Error('GitHub token not set. Go to Settings → GitHub Token to add it.');
  }

  // Generate slug
  post.slug = generateSlug(post.title);
  post.filename = post.slug + '.html';

  // 1. Push the article HTML file
  const articleHTML = generateArticleHTML(post);
  await pushFile(post.filename, articleHTML, `Publish: ${post.title}`);

  // 2. Update posts.json
  const allPosts = getPosts().map(p => p.id === post.id ? post : p);
  try {
    await updatePostsJSON(allPosts);
  } catch(e) {
    console.warn('posts.json update failed:', e.message);
  }

  // 3. Update sitemap
  try {
    await updateSitemap(allPosts);
  } catch(e) {
    console.warn('Sitemap update failed:', e.message);
  }

  // 4. Update RSS feed
  try {
    await updateRSSFeed(allPosts);
  } catch(e) {
    console.warn('RSS update failed:', e.message);
  }

  return post;
}

// ── UNPUBLISH (delete file) ───────────────────
async function unpublishFromGitHub(post) {
  if (!post.filename || !hasToken()) return;
  try {
    const sha = await getFileSHA(post.filename);
    if (sha) {
      await githubAPI('DELETE', post.filename, {
        message: `Unpublish: ${post.title}`,
        sha,
        branch: GITHUB_BRANCH
      });
    }
  } catch(e) {
    console.warn('Unpublish error:', e.message);
  }
}

// ── VERIFY TOKEN ──────────────────────────────
async function verifyGitHubToken(token) {
  try {
    const res = await fetch(`${GITHUB_API}/repos/${GITHUB_USER}/${GITHUB_REPO}`, {
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    return res.ok;
  } catch { return false; }
}
