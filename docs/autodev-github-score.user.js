// ==UserScript==
// @name         AutoDev — GitHub Profile Score
// @namespace    https://autodev-kappa.vercel.app
// @version      1.0.0
// @description  Shows AutoDev score on any GitHub profile page. Click to see full analysis.
// @author       AutoDev
// @match        https://github.com/*
// @grant        none
// @run-at       document-idle
// @icon         https://autodev-kappa.vercel.app/favicon.svg
// ==/UserScript==

(function() {
  'use strict';

  const BASE_URL = 'https://autodev-kappa.vercel.app';
  const EXCLUDED = ['settings', 'notifications', 'login', 'signup', 'explore', 'topics', 'trending', 'marketplace', 'pulls', 'issues', 'organizations', 'codespaces', 'new', 'search', 'account'];

  function getUsername() {
    const path = location.pathname.replace(/\/$/, '').split('/').filter(Boolean);
    if (path.length !== 1) return null;
    if (EXCLUDED.includes(path[0].toLowerCase())) return null;
    if (path[0].startsWith('.')) return null;
    return path[0];
  }

  function injectBadge(score) {
    const existing = document.getElementById('autodev-score-badge');
    if (existing) existing.remove();

    const badge = document.createElement('a');
    badge.id = 'autodev-score-badge';
    badge.href = `${BASE_URL}/dashboard?user=${getUsername()}`;
    badge.target = '_blank';
    badge.rel = 'noopener noreferrer';
    badge.style.cssText = 'display:inline-flex;align-items:center;gap:4px;margin-left:8px;padding:2px 10px;border-radius:999px;background:linear-gradient(135deg,#06b6d4,#2563eb);color:#fff;font-size:11px;font-weight:600;text-decoration:none;vertical-align:middle;transition:opacity.2s;cursor:pointer;';
    badge.onmouseover = () => badge.style.opacity = '0.85';
    badge.onmouseout = () => badge.style.opacity = '1';
    badge.innerHTML = `<span style="width:14px;height:14px;border-radius:3px;background:#000;color:#06b6d4;font-size:9px;font-weight:800;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;">A</span><span>${score}</span>`;

    const container = document.querySelector('.vcard-names, .p-name, .vcard-fullname, [itemprop="name"], h1');
    if (container) {
      const wrap = document.createElement('span');
      wrap.style.cssText = 'display:inline-flex;align-items:center;margin-left:4px;';
      wrap.appendChild(badge);
      container.appendChild(wrap);
    }
  }

  async function fetchScore(username) {
    try {
      const res = await fetch(`${BASE_URL}/api/analyze?username=${encodeURIComponent(username)}`, { signal: AbortSignal.timeout(5000) });
      if (!res.ok) return;
      const data = await res.json();
      injectBadge(data.overallScore);
    } catch (err) { console.warn('AutoDev score fetch failed:', err); }
  }

  function checkProfile() {
    const username = getUsername();
    if (!username) {
      document.getElementById('autodev-score-badge')?.remove();
      return;
    }

    let lastUsername = localStorage.getItem('autodev_last_checked') || '';
    if (username !== lastUsername) {
      localStorage.setItem('autodev_last_checked', username);
      setTimeout(() => fetchScore(username), 1500);
    }
  }

  checkProfile();

  let lastUrl = location.href;
  new MutationObserver(() => {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      setTimeout(checkProfile, 1000);
    }
  }).observe(document.body, { childList: true, subtree: true });
})();
