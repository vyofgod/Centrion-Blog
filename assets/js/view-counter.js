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

  // Görüntüleme sayısını artırma sistemi
  // URL'ye göre tutarlı bir "boost" değeri hesaplar
  function calculateBoost(path) {
    // URL'den tutarlı bir hash oluştur
    let hash = 0;
    for (let i = 0; i < path.length; i++) {
      const char = path.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    // Pozitif değere çevir
    hash = Math.abs(hash);

    // Taban değer: 50-120 arası (her post için farklı)
    const baseBoost = 50 + (hash % 70);

    // Çarpan: 1.2 - 1.8 arası
    const multiplier = 1.2 + ((hash % 60) / 100);

    return { baseBoost, multiplier };
  }

  // Gerçek sayıyı artırılmış sayıya çevir
  function boostCount(realCount, path) {
    const { baseBoost, multiplier } = calculateBoost(path);
    // Formül: (gerçek sayı * çarpan) + taban değer
    return Math.floor((realCount * multiplier) + baseBoost);
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
    // Artırılmış okunma sayısını göster
    const path = normalizePath(window.location.href);
    const boostedCount = boostCount(count, path);
    node.textContent = 'Okunma: ' + boostedCount.toLocaleString('tr-TR');
  }

  async function renderList() {
    const articles = document.querySelectorAll('article.post-entry, article.first-entry, article.tag-entry');
    for (const article of articles) {
      const link = article.querySelector('a.entry-link');
      const footer = article.querySelector('footer.entry-footer') || article.querySelector('.entry-footer') || article.querySelector('header.entry-header');
      if (!link || !footer) continue;

      const count = await getCountFor(link.href);
      const path = normalizePath(link.href);
      const boostedCount = boostCount(count, path);
      let node = article.querySelector('.post-views');
      if (!node) {
        node = document.createElement('span');
        node.className = 'post-views';
        footer.appendChild(node);
      }
      node.textContent = 'Okunma: ' + boostedCount.toLocaleString('tr-TR');
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
