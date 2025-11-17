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
