const GITHUB_PROFILE_REGEX = /^https:\/\/github\.com\/([a-zA-Z0-9_-]+)$/;
const EXCLUDED_PATHS = ['settings', 'notifications', 'login', 'signup', 'explore', 'topics', 'trending', 'marketplace', 'pulls', 'issues', 'notifications', 'organizations', 'codespaces', 'settings', 'new', 'search'];

function isProfilePage() {
  const path = window.location.pathname.replace(/\/$/, '');
  const parts = path.split('/').filter(Boolean);
  if (parts.length !== 1) return null;
  const username = parts[0];
  if (EXCLUDED_PATHS.includes(username.toLowerCase())) return null;
  return username;
}

function createBadge(username, score) {
  const existing = document.getElementById('autodev-badge');
  if (existing) existing.remove();

  const badge = document.createElement('a');
  badge.id = 'autodev-badge';
  badge.href = `https://autodev-kappa.vercel.app/dashboard?user=${username}`;
  badge.target = '_blank';
  badge.rel = 'noopener noreferrer';
  badge.style.cssText = `
    display: inline-flex;
    align-items: center;
    gap: 5px;
    margin-left: 8px;
    padding: 2px 10px;
    border-radius: 999px;
    background: linear-gradient(135deg, #06b6d4, #2563eb);
    color: #fff;
    font-size: 11px;
    font-weight: 600;
    text-decoration: none;
    vertical-align: middle;
    transition: opacity 0.2s;
  `;
  badge.onmouseover = () => { badge.style.opacity = '0.85'; };
  badge.onmouseout = () => { badge.style.opacity = '1'; };

  const letter = document.createElement('span');
  letter.textContent = 'A';
  letter.style.cssText = `
    width: 14px;
    height: 14px;
    border-radius: 3px;
    background: #000;
    color: #06b6d4;
    font-size: 9px;
    font-weight: 800;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  `;

  const text = document.createElement('span');
  text.textContent = `${score}`;

  badge.appendChild(letter);
  badge.appendChild(text);

  return badge;
}

function tryInjectBadge(username) {
  const selectors = [
    '.vcard-names',
    '.p-name',
    '.vcard-fullname',
    '[itemprop="name"]',
  ];

  let container = null;
  for (const sel of selectors) {
    const el = document.querySelector(sel);
    if (el) { container = el; break; }
  }

  if (!container) {
    const h1 = document.querySelector('h1');
    if (h1) container = h1;
  }

  if (container) {
    fetchBadge(username);
  }
}

async function fetchBadge(username) {
  try {
    const res = await fetch(`https://autodev-kappa.vercel.app/api/analyze?username=${encodeURIComponent(username)}`);
    if (!res.ok) return;
    const data = await res.json();

    const container = document.querySelector('#autodev-badge-container');
    if (container) container.remove();

    const wrapper = document.createElement('span');
    wrapper.id = 'autodev-badge-container';
    wrapper.style.cssText = 'display: inline-flex; align-items: center; margin-left: 4px;';

    const badge = createBadge(username, data.overallScore);
    wrapper.appendChild(badge);

    const target = document.querySelector('.vcard-names, .p-name, .vcard-fullname, [itemprop="name"]');
    if (target) {
      target.appendChild(wrapper);
    }
  } catch {}
}

function observeProfile() {
  let lastUsername = null;

  const check = () => {
    const username = isProfilePage();
    if (username && username !== lastUsername) {
      lastUsername = username;
      setTimeout(() => tryInjectBadge(username), 1500);
    } else if (!username) {
      lastUsername = null;
      const existing = document.getElementById('autodev-badge');
      if (existing) existing.remove();
    }
  };

  check();

  let lastUrl = location.href;
  new MutationObserver(() => {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      setTimeout(check, 1000);
    }
  }).observe(document.body, { childList: true, subtree: true });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', observeProfile);
} else {
  observeProfile();
}
