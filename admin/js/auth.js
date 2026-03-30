/* =============================================
   TITOYIN ADMIN — Authentication
   Change ADMIN_PASSWORD below to your own password
   ============================================= */

// ── CHANGE THIS PASSWORD ──────────────────────
const ADMIN_PASSWORD = 'Titoyin2025$';
// ─────────────────────────────────────────────

const SESSION_KEY   = 'titoyin_admin_session';
const SESSION_HOURS = 8;

function adminLogin(password) {
  if (password === ADMIN_PASSWORD) {
    const session = {
      loggedIn: true,
      expires: Date.now() + (SESSION_HOURS * 60 * 60 * 1000),
      user: 'Administrator'
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
    if (Date.now() > s.expires) {
      sessionStorage.removeItem(SESSION_KEY);
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

function requireLogin() {
  if (!isLoggedIn()) {
    window.location.href = 'index.html';
  }
}

// ── ACTIVITY LOG ──────────────────────────────
function logActivity(type, description) {
  try {
    const logs = JSON.parse(localStorage.getItem('titoyin_activity') || '[]');
    logs.unshift({
      type,
      description,
      time: new Date().toISOString(),
      display: new Date().toLocaleString('en-NG', { timeZone: 'Africa/Lagos' })
    });
    // Keep last 100 entries
    localStorage.setItem('titoyin_activity', JSON.stringify(logs.slice(0, 100)));
  } catch(e) {}
}

function getActivityLog() {
  try {
    return JSON.parse(localStorage.getItem('titoyin_activity') || '[]');
  } catch { return []; }
}

// ── POST STORAGE ──────────────────────────────
function savePosts(posts) {
  localStorage.setItem('titoyin_posts', JSON.stringify(posts));
}

function getPosts() {
  try {
    return JSON.parse(localStorage.getItem('titoyin_posts') || '[]');
  } catch { return []; }
}

function savePost(post) {
  const posts = getPosts();
  const idx = posts.findIndex(p => p.id === post.id);
  if (idx > -1) {
    posts[idx] = post;
  } else {
    posts.unshift(post);
  }
  savePosts(posts);
  return post;
}

function deletePost(id) {
  const posts = getPosts().filter(p => p.id !== id);
  savePosts(posts);
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

// ── AD STORAGE ────────────────────────────────
function getAds() {
  try {
    return JSON.parse(localStorage.getItem('titoyin_ads') || '{}');
  } catch { return {}; }
}

function saveAds(ads) {
  localStorage.setItem('titoyin_ads', JSON.stringify(ads));
}

// ── SETTINGS ─────────────────────────────────
function getSettings() {
  try {
    return JSON.parse(localStorage.getItem('titoyin_settings') || '{}');
  } catch { return {}; }
}

function saveSettings(settings) {
  localStorage.setItem('titoyin_settings', JSON.stringify(settings));
}

// ── BREAKING NEWS ─────────────────────────────
function getBreakingNews() {
  return localStorage.getItem('titoyin_breaking') || '';
}

function setBreakingNews(text) {
  if (text) {
    localStorage.setItem('titoyin_breaking', text);
  } else {
    localStorage.removeItem('titoyin_breaking');
  }
}
