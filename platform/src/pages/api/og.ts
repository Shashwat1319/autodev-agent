import type { NextApiRequest, NextApiResponse } from 'next';
import sharp from 'sharp';
import { rateLimit } from '../../lib/rate-limit';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const ip = req.headers['x-forwarded-for']?.toString().split(',')[0]?.trim() || req.headers['x-real-ip']?.toString() || 'unknown';
  const rl = rateLimit({ key: `og:${ip}`, maxRequests: 30, windowMs: 60000 });
  if (!rl.allowed) return res.status(429).json({ error: 'Too many requests' });

  const { username } = req.query;
  if (!username || typeof username !== 'string') {
    return res.status(400).end();
  }

  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://autodev-kappa.vercel.app');
    const dataRes = await fetch(
      `${baseUrl}/api/analyze?username=${encodeURIComponent(username)}`
    );

    let avatar = '';
    let repos = 0;
    let stars = 0;
    let forks = 0;
    let score = 0;

    if (dataRes.ok) {
      const d = await dataRes.json();
      avatar = d.avatar || '';
      repos = d.totalRepos || 0;
      stars = d.totalStars || 0;
      forks = d.totalForks || 0;
      score = d.overallScore || 0;
    }

    const barColor = score >= 70 ? '#4caf50' : score >= 40 ? '#ff9800' : '#f44336';

    const svg = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0a0f1e"/>
          <stop offset="100%" stop-color="#111827"/>
        </linearGradient>
        <linearGradient id="glow1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#06b6d4" stop-opacity="0.12"/>
          <stop offset="100%" stop-color="transparent"/>
        </linearGradient>
        <linearGradient id="glow2" x1="100%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.08"/>
          <stop offset="100%" stop-color="transparent"/>
        </linearGradient>
      </defs>

      <!-- Background -->
      <rect width="1200" height="630" fill="url(#bg)"/>
      <circle cx="1000" cy="100" r="300" fill="url(#glow1)"/>
      <circle cx="200" cy="500" r="250" fill="url(#glow2)"/>

      <!-- Top Bar -->
      <rect x="60" y="50" width="36" height="36" rx="8" fill="url(#glow1)"/>
      <text x="78" y="75" fill="url(#glow1)" font-size="18" font-weight="900" text-anchor="middle" font-family="sans-serif">A</text>
      <text x="110" y="75" fill="#06b6d4" font-size="22" font-weight="700" font-family="sans-serif">{AutoDev}</text>
      <text x="1140" y="75" fill="#6b7280" font-size="14" text-anchor="end" font-family="sans-serif">github.com/${username.replace(/&/g, '&amp;')}</text>

      <!-- Avatar -->
      ${avatar ? `<image href="${avatar}" x="552" y="140" width="96" height="96" rx="48"/>` : `
      <circle cx="600" cy="188" r="48" fill="#1a1f2e"/>
      <text x="600" y="203" fill="#06b6d4" font-size="36" font-weight="700" text-anchor="middle" font-family="sans-serif">${(username[0] || '?').toUpperCase()}</text>`}

      <!-- Username -->
      <text x="600" y="275" fill="#fff" font-size="36" font-weight="700" text-anchor="middle" font-family="sans-serif">${username.replace(/&/g, '&amp;')}</text>

      <!-- Score Card -->
      <rect x="350" y="310" width="500" height="60" rx="12" fill="rgba(255,255,255,0.05)"/>
      <text x="450" y="348" fill="#9ca3af" font-size="16" text-anchor="middle" font-family="sans-serif">AutoDev Score</text>
      <text x="650" y="348" fill="${barColor}" font-size="42" font-weight="800" text-anchor="middle" font-family="sans-serif">${score}<tspan font-size="24" fill="#9ca3af">/100</tspan></text>

      <!-- Progress Bar -->
      <rect x="400" y="390" width="400" height="8" rx="4" fill="rgba(255,255,255,0.1)"/>
      <rect x="400" y="390" width="${score * 4}" height="8" rx="4" fill="${barColor}"/>

      <!-- Stats -->
      <g transform="translate(360, 430)">
        <text x="0" y="30" fill="#fff" font-size="24" font-weight="700" text-anchor="middle" font-family="sans-serif">${repos}</text>
        <text x="0" y="46" fill="#6b7280" font-size="12" text-anchor="middle" font-family="sans-serif">Repos</text>
        <text x="160" y="30" fill="#fff" font-size="24" font-weight="700" text-anchor="middle" font-family="sans-serif">${stars}</text>
        <text x="160" y="46" fill="#6b7280" font-size="12" text-anchor="middle" font-family="sans-serif">Stars</text>
        <text x="320" y="30" fill="#fff" font-size="24" font-weight="700" text-anchor="middle" font-family="sans-serif">${forks}</text>
        <text x="320" y="46" fill="#6b7280" font-size="12" text-anchor="middle" font-family="sans-serif">Forks</text>
      </g>

      <!-- Footer -->
      <line x1="60" y1="560" x2="1140" y2="560" stroke="rgba(255,255,255,0.05)"/>
      <text x="600" y="590" fill="#6b7280" font-size="13" text-anchor="middle" font-family="sans-serif">npx autodev-agent · ${process.env.NEXT_PUBLIC_BASE_URL?.replace('https://','') || 'autodev-kappa.vercel.app'}</text>
    </svg>`;

    const png = await sharp(Buffer.from(svg)).png().toBuffer();

    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    res.status(200).send(png);
  } catch (err) {
    // Fallback minimal SVG
    const fallback = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <rect width="1200" height="630" fill="#0a0f1e"/>
      <text x="600" y="300" fill="#06b6d4" font-size="64" font-weight="700" text-anchor="middle" font-family="sans-serif">{AutoDev}</text>
      <text x="600" y="350" fill="#9ca3af" font-size="24" text-anchor="middle" font-family="sans-serif">GitHub Profile Analyzer</text>
      <text x="600" y="590" fill="#6b7280" font-size="13" text-anchor="middle" font-family="sans-serif">autodev-kappa.vercel.app</text>
    </svg>`;
    const png = await sharp(Buffer.from(fallback)).png().toBuffer();
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    res.status(200).send(png);
  }
}
