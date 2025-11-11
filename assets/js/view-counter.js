(function () {
  const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000'
    : 'https://view-counter-api-production.up.railway.app';
  
  const SESSION_KEY = 'centrion:viewedThisSession';

  function loadSessionViewed() {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  function markSessionViewed(key) {
    try {
      const viewed = loadSessionViewed();
      viewed[key] = true;
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(viewed));
    } catch (e) {
      // ignore
    }
  }

  function isViewedThisSession(key) {
    const viewed = loadSessionViewed();
    return !!viewed[key];
  }

  function normalizePath(url) {
    try {
      const u = new URL(url, window.location.origin);
      let p = u.pathname;
      if (p.length > 1 && p.endsWith('/')) p = p.slice(0, -1);
      return p;
    } catch (e) {
      return String(url || '');
    }
  }

  function encodeKey(path) {
    return encodeURIComponent(path.replace(/\//g, '_'));
  }

  async function incrementForCurrent() {
    const key = normalizePath(window.location.href);
    const encodedKey = encodeKey(key);
    
    if (isViewedThisSession(key)) {
      try {
        const response = await fetch(`${API_URL}/count/${encodedKey}`);
        const data = await response.json();
        return data.count || 0;
      } catch (e) {
        return 0;
      }
    }
    
    try {
      const response = await fetch(`${API_URL}/count/${encodedKey}/increment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      markSessionViewed(key);
      return data.count || 0;
    } catch (e) {
      return 0;
    }
  }

  async function getCountFor(url) {
    const key = normalizePath(url);
    const encodedKey = encodeKey(key);
    try {
      const response = await fetch(`${API_URL}/count/${encodedKey}`);
      const data = await response.json();
      return data.count || 0;
    } catch (e) {
      return 0;
    }
  }

  function renderSingle(count) {
    const meta = document.querySelector('.post-single .post-header .post-meta') ||
                 document.querySelector('.post-single .post-meta') ||
                 document.querySelector('.post-meta');
    if (!meta) return;
    let node = meta.querySelector('.post-views');
    if (!node) {
      node = document.createElement('span');
      node.className = 'post-views';
      meta.appendChild(node);
    }
    node.textContent = 'Okunma: ' + count;
  }

  async function renderList() {
    const articles = document.querySelectorAll('article.post-entry, article.first-entry, article.tag-entry');
    for (const article of articles) {
      const link = article.querySelector('a.entry-link');
      const footer = article.querySelector('footer.entry-footer') || article.querySelector('.entry-footer') || article.querySelector('header.entry-header');
      if (!link || !footer) continue;

      const count = await getCountFor(link.href);
      let node = article.querySelector('.post-views');
      if (!node) {
        node = document.createElement('span');
        node.className = 'post-views';
        footer.appendChild(node);
      }
      node.textContent = 'Okunma: ' + count;
    }
  }

  function isSingle() {
    return document.querySelector('.post-single') !== null;
  }

  document.addEventListener('DOMContentLoaded', async function () {
    if (isSingle()) {
      const c = await incrementForCurrent();
      renderSingle(c);
    } else {
      await renderList();
    }
  });
})();
