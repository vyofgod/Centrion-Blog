import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getDatabase, ref, runTransaction, get } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js';

(function () {
  const firebaseConfig = {
    apiKey: "AIzaSyB3tQ7iFro0zlmkh-C_zN4s7RnlGGycgD0",
    authDomain: "centrion-blog.firebaseapp.com",
    databaseURL: "https://centrion-blog-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "centrion-blog",
    storageBucket: "centrion-blog.firebasestorage.app",
    messagingSenderId: "53755457531",
    appId: "1:53755457531:web:f35e2fd2aadcef252a255e",
    measurementId: "G-8ZQ3E23014"
  };

  const app = initializeApp(firebaseConfig);
  const database = getDatabase(app);
  const SESSION_KEY = 'centrion:viewedThisSession';

  // Her post için sabit bir taban değer hesapla (URL'ye göre tutarlı)
  // Bu değer hiç değişmez, sadece gerçek okumalar +1 ekler
  function getBaseCount(path) {
    let hash = 0;
    for (let i = 0; i < path.length; i++) {
      const char = path.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    // 50-150 arası sabit taban değer
    return 50 + (Math.abs(hash) % 100);
  }

  // Gösterilecek sayı = taban + gerçek okunma
  function getDisplayCount(realCount, path) {
    const base = getBaseCount(path);
    return base + realCount;
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
      return p.replace(/[^a-zA-Z0-9]/g, '-').replace(/^-+|-+$/g, '') || 'home';
    } catch (e) {
      return 'unknown';
    }
  }

  async function incrementForCurrent() {
    const path = normalizePath(window.location.href);

    if (isViewedThisSession(path)) {
      return await getCountFor(window.location.href);
    }

    try {
      const viewRef = ref(database, 'views/' + path);
      const result = await runTransaction(viewRef, (current) => {
        return (current || 0) + 1;
      });
      markSessionViewed(path);
      return result.snapshot.val() || 0;
    } catch (e) {
      console.error('Failed to increment:', e);
      return 0;
    }
  }

  async function getCountFor(url) {
    const path = normalizePath(url);
    try {
      const viewRef = ref(database, 'views/' + path);
      const snapshot = await get(viewRef);
      return snapshot.val() || 0;
    } catch (e) {
      console.error('Failed to get count for', path, ':', e);
      return 0;
    }
  }

  // Okunma sayısını göstermek için meta alanını bul veya oluştur
  function findOrCreateViewsNode(container) {
    let node = container.querySelector('.post-views');
    if (!node) {
      node = document.createElement('span');
      node.className = 'post-views';
      container.appendChild(node);
    }
    return node;
  }

  // Tekil yazı sayfasında okunma sayısını göster
  function renderSingle(realCount) {
    const metaSelectors = [
      '.post-single .post-header .post-meta',
      '.post-single .post-meta',
      '.post-header .post-meta',
      '.post-meta'
    ];

    let meta = null;
    for (const selector of metaSelectors) {
      meta = document.querySelector(selector);
      if (meta) break;
    }

    if (!meta) {
      console.warn('View counter: post-meta element not found');
      return;
    }

    const path = normalizePath(window.location.href);
    const displayCount = getDisplayCount(realCount, path);

    const node = findOrCreateViewsNode(meta);
    node.textContent = 'Okunma: ' + displayCount;
  }

  // Liste sayfalarında tüm yazıların okunma sayılarını göster
  async function renderList() {
    const articles = document.querySelectorAll('article.post-entry, article.first-entry, article.tag-entry');

    if (articles.length === 0) return;

    const promises = Array.from(articles).map(async (article) => {
      const link = article.querySelector('a.entry-link');
      const footer = article.querySelector('footer.entry-footer') ||
        article.querySelector('.entry-footer') ||
        article.querySelector('header.entry-header');

      if (!link || !footer) return;

      try {
        const realCount = await getCountFor(link.href);
        const path = normalizePath(link.href);
        const displayCount = getDisplayCount(realCount, path);

        const node = findOrCreateViewsNode(footer);
        node.textContent = 'Okunma: ' + displayCount;
      } catch (e) {
        console.error('Failed to render count for article:', e);
      }
    });

    await Promise.all(promises);
  }

  function isSingle() {
    return document.querySelector('.post-single') !== null;
  }

  // Sayfa yüklendiğinde çalıştır
  async function init() {
    try {
      if (isSingle()) {
        const count = await incrementForCurrent();
        renderSingle(count);
      } else {
        await renderList();
      }
    } catch (e) {
      console.error('View counter initialization failed:', e);
    }
  }

  // DOMContentLoaded ve load eventlerini dinle
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Sayfa tam yüklendiğinde tekrar dene (güvenilirlik için)
  window.addEventListener('load', () => {
    setTimeout(() => {
      if (isSingle()) {
        const existingNode = document.querySelector('.post-views');
        if (!existingNode || !existingNode.textContent) {
          getCountFor(window.location.href).then(count => {
            renderSingle(count);
          });
        }
      }
    }, 500);
  });
})();
