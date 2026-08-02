import type { NextApiRequest, NextApiResponse } from 'next';
import * as Sentry from '@sentry/nextjs';
import { rateLimit, validateUsername } from '../../lib/api-utils';
import { analyzeProfile } from '../../lib/analyze-profile';
import { getScoreHex, getScoreLabel } from '../../lib/format';

const LABEL_COLORS: Record<string, string> = {
  classic: '#555',
  gold: '#a67c00',
  dark: '#1f1f1f',
};

function badgeSVG(label: string, score: number, color: string, style: string) {
  const lw = label.length * 7.5 + 20;
  const rw = `${score}/100`.length * 8 + 20;
  const total = lw + rw;
  const ls = lw / 2;
  const rs = lw + rw / 2;
  const labelColor = LABEL_COLORS[style] || LABEL_COLORS.classic;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${total}" height="20" viewBox="0 0 ${total} 20">
  <defs>
    <linearGradient id="s" x2="0" y2="100%">
      <stop offset="0" stop-color="#bbb" stop-opacity=".1"/>
      <stop offset="1" stop-opacity=".1"/>
    </linearGradient>
    <clipPath id="r"><rect width="${total}" height="20" rx="3"/></clipPath>
  </defs>
  <g clip-path="url(#r)">
    <rect width="${lw}" height="20" fill="${labelColor}"/>
    <rect x="${lw}" width="${rw}" height="20" fill="${color}"/>
    <rect width="${total}" height="20" fill="url(#s)"/>
  </g>
  <g fill="#fff" font-family="DejaVu Sans,Verdana,Geneva,sans-serif" font-size="11">
    <text x="${ls}" y="14" text-anchor="middle" fill="#010101" fill-opacity=".3">${label}</text>
    <text x="${ls}" y="13" text-anchor="middle">${label}</text>
    <text x="${rs}" y="14" text-anchor="middle" fill="#010101" fill-opacity=".3">${score}/100</text>
    <text x="${rs}" y="13" text-anchor="middle">${score}/100</text>
  </g>
</svg>`;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const ip = req.headers['x-forwarded-for']?.toString().split(',')[0]?.trim() || req.headers['x-real-ip']?.toString() || 'unknown';
  const rl = rateLimit({ key: `badge:${ip}`, maxRequests: 60, windowMs: 60000 });
  if (!rl.allowed) return res.status(200).setHeader('Content-Type', 'image/svg+xml').send(badgeSVG('Rate Limited', 0, '#f44336', 'classic'));

  const { username, style = 'classic' } = req.query;
  const badgeStyle = ['classic', 'gold', 'dark'].includes(String(style)) ? String(style) : 'classic';
  const validated = validateUsername(username);
  if (!validated) return res.status(200).setHeader('Content-Type', 'image/svg+xml').setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate').send(badgeSVG('Invalid User', 0, '#f44336', badgeStyle));

  try {
    const analysis = await analyzeProfile(validated);
    if (!analysis) {
      return res.status(200).setHeader('Content-Type', 'image/svg+xml').send(badgeSVG('User Not Found', 0, '#f44336', badgeStyle));
    }

    const color = getScoreHex(analysis.overallScore);
    const label = `AutoDev ${getScoreLabel(analysis.overallScore)}`;

    res.status(200).setHeader('Content-Type', 'image/svg+xml').setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate').send(badgeSVG(label, analysis.overallScore, color, badgeStyle));
  } catch (err) {
    Sentry.captureException(err);
    res.status(200).setHeader('Content-Type', 'image/svg+xml').setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate').send(badgeSVG('Error', 0, '#f44336', badgeStyle));
  }
}
