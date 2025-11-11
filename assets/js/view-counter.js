(function () {
  const STORAGE_KEY = 'centrion:viewCounts';
  const SESSION_KEY = 'centrion:viewedThisSession';

  function loadCounts() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  function saveCounts(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      // ignore
    }
  }

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

  function incrementForCurrent() {
    const key = normalizePath(window.location.href);
    
    if (isViewedThisSession(key)) {
      const data = loadCounts();
      return data[key] || 0;
    }
    
    const data = loadCounts();
    const next = (data[key] || 0) + 1;
    data[key] = next;
    saveCounts(data);
    markSessionViewed(key);
    return next;
  }

  function getCountFor(url) {
    const key = normalizePath(url);
    const data = loadCounts();
    return data[key] || 0;
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

  function renderList() {
    const articles = document.querySelectorAll('article.post-entry, article.first-entry, article.tag-entry');
    articles.forEach((article) => {
      const link = article.querySelector('a.entry-link');
      const footer = article.querySelector('footer.entry-footer') || article.querySelector('.entry-footer') || article.querySelector('header.entry-header');
      if (!link || !footer) return;

      const count = getCountFor(link.href);
      let node = article.querySelector('.post-views');
      if (!node) {
        node = document.createElement('span');
        node.className = 'post-views';
        footer.appendChild(node);
      }
      node.textContent = 'Okunma: ' + count;
    });
  }

  function isSingle() {
    return document.querySelector('.post-single') !== null;
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (isSingle()) {
      const c = incrementForCurrent();
      renderSingle(c);
    } else {
      renderList();
    }
  });
})();
