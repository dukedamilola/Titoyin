/* =============================================
   TITOYIN ADMIN — Auth + Data Layer v4
   Source of truth: GitHub posts.json
   Works across all devices
   ============================================= */

// ── ADMIN PASSWORD ────────────────────────────
const ADMIN_PASSWORD = 'Titoyin2025!';
const SESSION_KEY    = 'titoyin_admin_session';

function adminLogin(password) {
  if (password === ADMIN_PASSWORD) {
    const session = {
      loggedIn: true,
      expires:  Date.now() + (8 * 60 * 60 * 1000),
      user:     'Administrator'
    };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
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
  sessionStorage.setItem('gh_token', token.trim());
  if (remember) localStorage.setItem('gh_token_saved', token.trim());
  else          localStorage.removeItem('gh_token_saved');
}
function clearToken() {
  sessionStorage.removeItem('gh_token');
  localStorage.removeItem('gh_token_saved');
}
function hasToken() { return !!getToken(); }

// Auto-load saved token
(function() {
  const saved = localStorage.getItem('gh_token_saved');
  if (saved && !sessionStorage.getItem('gh_token')) {
    sessionStorage.setItem('gh_token', saved);
  }
})();

// ── POSTS — SOURCE OF TRUTH IS GITHUB ─────────
// Local cache only for the current session
let _localPosts = null;

async function syncPostsFromGitHub() {
  try {
    const r = await fetch('https://raw.githubusercontent.com/dukedamilola/titoyin/main/posts.json?t=' + Date.now(), {
      cache: 'no-store'
    });
    if (!r.ok) return [];
    const data = await r.json();
    const posts = data.posts || [];
    // Store in session so we don't re-fetch on every page
    sessionStorage.setItem('titoyin_posts_cache', JSON.stringify(posts));
    sessionStorage.setItem('titoyin_posts_ts', Date.now().toString());
    _localPosts = posts;
    return posts;
  } catch(e) {
    console.warn('Could not sync from GitHub:', e);
    return getCachedPosts();
  }
}

function getCachedPosts() {
  if (_localPosts) return _localPosts;
  try {
    const cached = sessionStorage.getItem('titoyin_posts_cache');
    if (cached) { _localPosts = JSON.parse(cached); return _localPosts; }
  } catch {}
  return [];
}

function getPosts() {
  // Return cached posts synchronously for immediate use
  return getCachedPosts();
}

function savePost(post) {
  const posts = getCachedPosts();
  const idx   = posts.findIndex(p => p.id === post.id);
  if (idx > -1) posts[idx] = post;
  else          posts.unshift(post);
  _localPosts = posts;
  sessionStorage.setItem('titoyin_posts_cache', JSON.stringify(posts));
  return post;
}

function deletePost(id) {
  const posts = getCachedPosts().filter(p => p.id !== id);
  _localPosts = posts;
  sessionStorage.setItem('titoyin_posts_cache', JSON.stringify(posts));
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

// ── BREAKING NEWS ─────────────────────────────
function getBreakingNews() { return localStorage.getItem('titoyin_breaking') || ''; }
function setBreakingNews(t) {
  if (t) localStorage.setItem('titoyin_breaking', t);
  else   localStorage.removeItem('titoyin_breaking');
}

// ── ACTIVITY LOG ──────────────────────────────
function logActivity(type, description) {
  try {
    const logs = JSON.parse(localStorage.getItem('titoyin_activity') || '[]');
    logs.unshift({ type, description, time: new Date().toISOString(),
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
