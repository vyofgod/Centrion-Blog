(function () {
  const API_BASE = 'https://api.countapi.xyz';
  const SESSION_KEY = 'centrion:viewedThisSession';
  const NAMESPACE = 'centrion-blog';

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
      return p.replace(/\//g, '-').replace(/^-/, '') || 'home';
    } catch (e) {
      return 'unknown';
    }
  }

  function makeKey(path) {
    return NAMESPACE + '-' + path;
  }

  async function incrementForCurrent() {
    const path = normalizePath(window.location.href);
    const key = makeKey(path);
    
    if (isViewedThisSession(path)) {
      return await getCount(key);
    }
    
    try {
      const response = await fetch(`${API_BASE}/hit/${NAMESPACE}/${path}`);
      const data = await response.json();
      markSessionViewed(path);
      return data.value || 0;
    } catch (e) {
      return 0;
    }
  }

  async function getCount(fullKey) {
    try {
      const parts = fullKey.split('-');
      const path = parts.slice(2).join('-');
      const response = await fetch(`${API_BASE}/get/${NAMESPACE}/${path}`);
      const data = await response.json();
      return data.value || 0;
    } catch (e) {
      return 0;
    }
  }

  async function getCountFor(url) {
    const path = normalizePath(url);
    try {
      const response = await fetch(`${API_BASE}/get/${NAMESPACE}/${path}`);
      const data = await response.json();
      return data.value || 0;
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
