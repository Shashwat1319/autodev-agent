import type { NextApiRequest, NextApiResponse } from 'next';
import { rateLimit } from '../../lib/rate-limit';

function getColor(score: number): string {
  if (score >= 70) return '#4caf50';
  if (score >= 40) return '#ff9800';
  return '#f44336';
}

function getLabel(score: number): string {
  if (score >= 70) return 'Great';
  if (score >= 40) return 'Okay';
  return 'Needs Work';
}

function badgeSVG(label: string, score: number, color: string, labelColor: string) {
  const lw = label.length * 7.5 + 20;
  const rw = `${score}/100`.length * 8 + 20;
  const total = lw + rw;
  const ls = lw / 2;
  const rs = lw + rw / 2;

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
  if (!rl.allowed) return res.status(429).send(badgeSVG('Rate Limited', 0, '#f44336', '#555'));

  const { username } = req.query;

  if (!username || typeof username !== 'string') {
    return res.status(400).send(badgeSVG('Error', 0, '#f44336', '#555'));
  }

  try {
    const token = process.env.GITHUB_TOKEN || '';
    const headers: Record<string, string> = {
      Accept: 'application/vnd.github.v3+json',
    };
    if (token) headers.Authorization = `Bearer ${token}`;

    const [userRes, reposRes, eventsRes] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`, { headers }),
      fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, { headers }),
      fetch(`https://api.github.com/users/${username}/events/public?per_page=100`, { headers }),
    ]);

    if (!userRes.ok) {
      return res.status(200)
        .setHeader('Content-Type', 'image/svg+xml')
        .setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate')
        .send(badgeSVG('User Not Found', 0, '#f44336', '#555'));
    }

    const userData = await userRes.json();
    const repos = await reposRes.json();
    const events = await eventsRes.json();

    const totalStars = repos.reduce((sum: number, r: any) => sum + (r.stargazers_count || 0), 0);
    const consistency = Math.min(100, Math.round(
      (repos.length > 0 ? 30 : 0) +
      (totalStars > 0 ? 20 : 0) +
      (events.length > 10 ? 25 : events.length > 0 ? 10 : 0) +
      (userData.public_repos > 5 ? 15 : 5) +
      (userData.bio ? 10 : 0)
    ));
    const score = Math.round((consistency + Math.min(100, totalStars * 2)) / 2);

    const color = getColor(score);
    const label = `AutoDev ${getLabel(score)}`;

    res.status(200)
      .setHeader('Content-Type', 'image/svg+xml')
      .setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate')
      .send(badgeSVG(label, score, color, '#555'));
  } catch (err) {
    res.status(200)
      .setHeader('Content-Type', 'image/svg+xml')
      .setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate')
      .send(badgeSVG('Error', 0, '#f44336', '#555'));
  }
}
