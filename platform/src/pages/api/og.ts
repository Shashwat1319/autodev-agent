import type { NextApiRequest, NextApiResponse } from 'next';
import * as Sentry from '@sentry/nextjs';
import sharp from 'sharp';
import { rateLimit, validateUsername } from '../../lib/api-utils';
import { analyzeProfile } from '../../lib/analyze-profile';
import { getScoreHex } from '../../lib/format';
import { BASE_URL } from '../../lib/config';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const ip = req.headers['x-forwarded-for']?.toString().split(',')[0]?.trim() || req.headers['x-real-ip']?.toString() || 'unknown';
  const rl = rateLimit({ key: `og:${ip}`, maxRequests: 30, windowMs: 60000 });
  if (!rl.allowed) {
    return res.status(200).setHeader('Content-Type', 'image/svg+xml').setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate').send(
      `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="1200" height="630" fill="#0a0f1e"/><text x="600" y="315" fill="#f44336" font-size="24" text-anchor="middle" font-family="sans-serif">Rate Limited — Try Again Later</text></svg>`
    );
  }

  const validated = validateUsername(req.query.username);
  if (req.query.username && !validated) return res.status(400).json({ error: 'Invalid username' });
  const isGeneric = !validated;
  const displayUsername = isGeneric ? 'AutoDev' : validated.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

  try {
    const analysis = !isGeneric ? await analyzeProfile(validated) : null;

    let avatar = '';
    let repos = 0;
    let stars = 0;
    let forks = 0;
    let score = 0;

    if (analysis) {
      avatar = analysis.avatar || '';
      repos = analysis.totalRepos || 0;
      stars = analysis.totalStars || 0;
      forks = analysis.totalForks || 0;
      score = analysis.overallScore || 0;
    }

    const barColor = getScoreHex(score);

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
        <clipPath id="avatarClip"><circle cx="600" cy="188" r="48"/></clipPath>
      </defs>

      <rect width="1200" height="630" fill="url(#bg)"/>
      <circle cx="1000" cy="100" r="300" fill="url(#glow1)"/>
      <circle cx="200" cy="500" r="250" fill="url(#glow2)"/>

      <rect x="60" y="50" width="36" height="36" rx="8" fill="url(#glow1)"/>
      <text x="78" y="75" fill="url(#glow1)" font-size="18" font-weight="900" text-anchor="middle" font-family="sans-serif">A</text>
      <text x="110" y="75" fill="#06b6d4" font-size="22" font-weight="700" font-family="sans-serif">{AutoDev}</text>
      ${!isGeneric ? `<text x="1140" y="75" fill="#6b7280" font-size="14" text-anchor="end" font-family="sans-serif">github.com/${displayUsername}</text>` : ''}

      ${!isGeneric && avatar ? `<image href="${avatar}" x="552" y="140" width="96" height="96" clip-path="url(#avatarClip)"/>` : `
      <circle cx="600" cy="188" r="48" fill="#1a1f2e"/>
      <text x="600" y="203" fill="#06b6d4" font-size="36" font-weight="700" text-anchor="middle" font-family="sans-serif">${isGeneric ? 'A' : (validated[0] || '?').toUpperCase()}</text>`}

      <text x="600" y="275" fill="#fff" font-size="36" font-weight="700" text-anchor="middle" font-family="sans-serif">${displayUsername}</text>

      <rect x="350" y="310" width="500" height="60" rx="12" fill="rgba(255,255,255,0.05)"/>
      <text x="450" y="348" fill="#9ca3af" font-size="16" text-anchor="middle" font-family="sans-serif">AutoDev Score</text>
      <text x="650" y="348" fill="${barColor}" font-size="42" font-weight="800" text-anchor="middle" font-family="sans-serif">${score}<tspan font-size="24" fill="#9ca3af">/100</tspan></text>

      <rect x="400" y="390" width="400" height="8" rx="4" fill="rgba(255,255,255,0.1)"/>
      <rect x="400" y="390" width="${Math.min(score, 100) * 4}" height="8" rx="4" fill="${barColor}"/>

      <g transform="translate(360, 430)">
        <text x="0" y="30" fill="#fff" font-size="24" font-weight="700" text-anchor="middle" font-family="sans-serif">${repos}</text>
        <text x="0" y="46" fill="#6b7280" font-size="12" text-anchor="middle" font-family="sans-serif">Repos</text>
        <text x="160" y="30" fill="#fff" font-size="24" font-weight="700" text-anchor="middle" font-family="sans-serif">${stars}</text>
        <text x="160" y="46" fill="#6b7280" font-size="12" text-anchor="middle" font-family="sans-serif">Stars</text>
        <text x="320" y="30" fill="#fff" font-size="24" font-weight="700" text-anchor="middle" font-family="sans-serif">${forks}</text>
        <text x="320" y="46" fill="#6b7280" font-size="12" text-anchor="middle" font-family="sans-serif">Forks</text>
      </g>

      <line x1="60" y1="560" x2="1140" y2="560" stroke="rgba(255,255,255,0.05)"/>
      <text x="600" y="590" fill="#6b7280" font-size="13" text-anchor="middle" font-family="sans-serif">npx autodev-agent · ${BASE_URL.replace(/^https?:\/\//, '')}</text>
    </svg>`;

    const png = await sharp(Buffer.from(svg)).png().toBuffer();

    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    res.status(200).send(png);
  } catch (err) {
    Sentry.captureException(err);
    try {
      const domain = BASE_URL.replace('https://', '').replace('http://', '');
      const fallback = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
        <rect width="1200" height="630" fill="#0a0f1e"/>
        <text x="600" y="300" fill="#06b6d4" font-size="64" font-weight="700" text-anchor="middle" font-family="sans-serif">{AutoDev}</text>
        <text x="600" y="350" fill="#9ca3af" font-size="24" text-anchor="middle" font-family="sans-serif">GitHub Profile Analyzer</text>
        <text x="600" y="590" fill="#6b7280" font-size="13" text-anchor="middle" font-family="sans-serif">${domain}</text>
      </svg>`;
      const png = await sharp(Buffer.from(fallback)).png().toBuffer();
      res.setHeader('Content-Type', 'image/png');
      res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
      res.status(200).send(png);
    } catch (err2) {
      Sentry.captureException(err2);
      res.setHeader('Content-Type', 'image/svg+xml');
      res.status(200).send(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="1200" height="630" fill="#0a0f1e"/><text x="600" y="315" fill="#f44336" font-size="24" text-anchor="middle" font-family="sans-serif">AutoDev OG Image Error</text></svg>`);
    }
  }
}
