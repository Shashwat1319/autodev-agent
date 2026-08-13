// ==UserScript==
// @name         AutoDev GitHub Score
// @namespace    https://autodev-kappa.vercel.app
// @version      1.0.0
// @description  Shows the AutoDev score (out of 100) on any GitHub profile page you visit.
// @author       AutoDev
// @match        https://github.com/*
// @grant        GM_xmlhttpRequest
// @connect      autodev-kappa.vercel.app
// @license      MIT
// @homepage     https://autodev-kappa.vercel.app
// ==/UserScript==

(function () {
  'use strict';

  const API = 'https://autodev-kappa.vercel.app/api/analyze';

  function isProfilePage() {
    const parts = location.pathname.split('/').filter(Boolean);
    return parts.length === 1 && !!document.querySelector('meta[property="profile:username"], [itemprop="additionalName"], .vcard-username');
  }

  async function getScore(username) {
    return new Promise((resolve) => {
      GM_xmlhttpRequest({
        method: 'GET',
        url: `${API}?username=${encodeURIComponent(username)}`,
        timeout: 15000,
        onload: (res) => {
          try {
            const data = JSON.parse(res.responseText);
            resolve({ score: data.overallScore, ok: true });
          } catch {
            resolve({ ok: false });
          }
        },
        onerror: () => resolve({ ok: false }),
        ontimeout: () => resolve({ ok: false }),
      });
    });
  }

  function inject(score) {
    const field = document.querySelector('.vcard-details .vcard-detail') || document.querySelector('.vcard-names');
    if (!field) return;
    const host = document.createElement('div');
    host.style.cssText = 'margin:4px 0 8px;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif;';
    const color = score >= 70 ? '#2da44e' : score >= 40 ? '#bf8700' : '#cf222e';
    host.innerHTML =
      '<div style="display:flex;align-items:center;gap:8px;padding:8px 12px;border:1px solid rgba(27,31,36,.15);' +
      'border-radius:8px;background:#f6f8fa;">' +
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="' + color + '"/></svg>' +
      '<span style="font-size:14px;font-weight:600;color:' + color + '">AutoDev Score ' + score + '/100</span>' +
      '<a href="https://autodev-kappa.vercel.app/dashboard?user=' + encodeURIComponent(document.location.pathname.split('/')[1]) + '" ' +
      'style="font-size:12px;color:#0969da;text-decoration:none;margin-left:auto;font-weight:500">Improve it →</a>' +
      '</div>';
    field.parentNode.insertBefore(host, field.previousSibling || field.parentNode.firstChild);
  }

  async function main() {
    if (!isProfilePage()) return;
    const username = document.location.pathname.split('/')[1];
    const { score, ok } = await getScore(username);
    if (!ok || typeof score !== 'number') return;
    if (document.querySelector('[data-autodev-score]')) return;
    inject(score);
  }

  const start = () => {
    const t = setInterval(() => {
      if (document.querySelector('.vcard-details') || document.querySelector('.vcard-names')) {
        clearInterval(t);
        main();
      }
    }, 500);
    setTimeout(() => clearInterval(t), 10000);
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();