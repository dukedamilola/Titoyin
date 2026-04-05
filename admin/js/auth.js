/* =============================================
   TITOYIN ADMIN — Auth + Data Layer v5
   Multi-device sync via GitHub posts.json
   ============================================= */

const ADMIN_PASSWORD = 'Titoyin2025!';
const SESSION_KEY    = 'titoyin_admin_session';
const GITHUB_USER    = 'dukedamilola';
const GITHUB_REPO    = 'titoyin';

function adminLogin(password) {
  if (password === ADMIN_PASSWORD) {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({
      loggedIn: true,
      expires:  Date.now() + (8 * 60 * 60 * 1000)
    }));
    logActivity('login', 'Admin logged in');
    return true;
  }
  return false;
}

function adminLogout() {
  sessionStorage.removeItem(SESSION_KEY);
  window.location.href = 'index.html';
}

function isLoggedIn() {
  try {
    const s = JSON.parse(sessionStorage.getItem(SESSION_KEY));
    if (!s || !s.loggedIn) return false;
    if (Date.now() > s.expires) { sessionStorage.removeItem(SESSION_KEY); return false; }
    return true;
  } catch { return false; }
}

function requireLogin() {
  if (!isLoggedIn()) window.location.href = 'index.html';
}

// ── TOKEN ─────────────────────────────────────
function getToken() {
  return sessionStorage.getItem('gh_token') ||
         localStorage.getItem('gh_token_saved') || '';
}
function setToken(token, remember) {
  const t = token.trim();
  sessionStorage.setItem('gh_token', t);
  if (remember) localStorage.setItem('gh_token_saved', t);
  else          localStorage.removeItem('gh_token_saved');
}
function clearToken() {
  sessionStorage.removeItem('gh_token');
  localStorage.removeItem('gh_token_saved');
}
function hasToken() { return !!getToken(); }

// Auto-load saved token into session
(function() {
  const saved = localStorage.getItem('gh_token_saved');
  if (saved && !sessionStorage.getItem('gh_token')) {
    sessionStorage.setItem('gh_token', saved);
  }
})();

// ── POSTS — SYNC FROM GITHUB ──────────────────
let _posts = null;

async function syncPostsFromGitHub() {
  // Try multiple URLs in case one is cached or blocked
  const urls = [
    `https://raw.githubusercontent.com/${GITHUB_USER}/${GITHUB_REPO}/main/posts.json`,
    `https://${GITHUB_USER}.github.io/${GITHUB_REPO}/posts.json`,
    `https://titoyin.com/posts.json`
  ];

  for (const url of urls) {
    try {
      const r = await fetch(url + '?nocache=' + Date.now(), {
        cache: 'no-store',
        headers: { 'Accept': 'application/json' }
      });
      if (!r.ok) continue;
      const data = await r.json();
      const posts = Array.isArray(data) ? data : (data.posts || []);
      console.log('[Admin] Loaded', posts.length, 'posts from', url);
      _posts = posts;
      sessionStorage.setItem('titoyin_posts_cache', JSON.stringify(posts));
      return posts;
    } catch(e) {
      console.warn('[Admin] Failed to fetch from', url, e.message);
    }
  }

  // Fall back to session cache
  console.warn('[Admin] All fetches failed — using session cache');
  return getCachedPosts();
}

function getCachedPosts() {
  if (_posts !== null) return _posts;
  try {
    const c = sessionStorage.getItem('titoyin_posts_cache');
    if (c) { _posts = JSON.parse(c); return _posts; }
  } catch {}
  _posts = [];
  return _posts;
}

function getPosts() {
  return getCachedPosts();
}

function savePost(post) {
  const posts = getCachedPosts();
  const idx   = posts.findIndex(p => p.id === post.id);
  if (idx > -1) posts[idx] = post;
  else          posts.unshift(post);
  _posts = posts;
  sessionStorage.setItem('titoyin_posts_cache', JSON.stringify(posts));
  return post;
}

function deletePost(id) {
  _posts = getCachedPosts().filter(p => p.id !== id);
  sessionStorage.setItem('titoyin_posts_cache', JSON.stringify(_posts));
}

// ── ADS + SETTINGS ────────────────────────────
function getAds() {
  try { return JSON.parse(localStorage.getItem('titoyin_ads') || '{}'); } catch { return {}; }
}
function saveAds(ads) { localStorage.setItem('titoyin_ads', JSON.stringify(ads)); }
function getSettings() {
  try { return JSON.parse(localStorage.getItem('titoyin_settings') || '{}'); } catch { return {}; }
}
function saveSettings(s) { localStorage.setItem('titoyin_settings', JSON.stringify(s)); }
function getBreakingNews() { return localStorage.getItem('titoyin_breaking') || ''; }
function setBreakingNews(t) {
  if (t) localStorage.setItem('titoyin_breaking', t);
  else   localStorage.removeItem('titoyin_breaking');
}

// ── ACTIVITY LOG ──────────────────────────────
function logActivity(type, description) {
  try {
    const logs = JSON.parse(localStorage.getItem('titoyin_activity') || '[]');
    logs.unshift({ type, description,
      display: new Date().toLocaleString('en-NG', { timeZone: 'Africa/Lagos' }) });
    localStorage.setItem('titoyin_activity', JSON.stringify(logs.slice(0, 100)));
  } catch {}
}
function getActivityLog() {
  try { return JSON.parse(localStorage.getItem('titoyin_activity') || '[]'); } catch { return []; }
}

// ── HELPERS ───────────────────────────────────
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}
function nigeriaDateInput() {
  return new Date(new Date().toLocaleString('en-US', { timeZone: 'Africa/Lagos' }))
    .toISOString().slice(0, 16);
}
async function verifyGitHubToken(token) {
  try {
    const r = await fetch(`https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}`, {
      headers: { 'Authorization': `token ${token}`, 'Accept': 'application/vnd.github.v3+json' }
    });
    return r.ok;
  } catch { return false; }
}
