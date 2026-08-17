import type { NextApiRequest, NextApiResponse } from 'next';
import * as Sentry from '@sentry/nextjs';
import { rateLimit, validateUsername } from '../../lib/api-utils';
import { analyzeProfile } from '../../lib/analyze-profile';
import { incrementCounter } from '../../lib/counter';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const ip = req.headers['x-forwarded-for']?.toString().split(',')[0]?.trim() || req.headers['x-real-ip']?.toString() || 'unknown';
  const rl = rateLimit({ key: `analyze:${ip}`, maxRequests: 30, windowMs: 60000 });
  if (!rl.allowed) return res.status(429).json({ error: `Too many requests. Try again in ${Math.ceil(rl.resetIn / 1000)}s.` });

  const { username } = req.query;
  const bodyUsername = typeof req.body?.username === 'string' ? req.body.username : '';
  const raw = (typeof username === 'string' && username.trim() !== '' ? username : bodyUsername).trim();
  if (!raw) {
    return res.status(400).json({ error: 'Please enter a GitHub username' });
  }
  const validated = validateUsername(raw);
  if (!validated) {
    return res.status(400).json({ error: 'That doesn\u2019t look like a GitHub username \u2014 letters, numbers, dashes and underscores only, no spaces.' });
  }

  if (!process.env.GITHUB_TOKEN && process.env.NODE_ENV === 'development') {
    console.warn('⚠️ GITHUB_TOKEN not set — GitHub API rate limited to 60 req/hr');
  }

  try {
    const analysis = await analyzeProfile(validated);
    if (!analysis) return res.status(404).json({ error: 'User not found' });

    const countryHeader = req.headers['x-vercel-ip-country'];
    const country = typeof countryHeader === 'string' ? countryHeader.toUpperCase() : '';
    res.setHeader('Cache-Control', 'no-store, max-age=0');
    res.status(200).json(analysis);
    await Promise.race([
      incrementCounter(country).catch(() => {}),
      new Promise(r => setTimeout(r, 3000)),
    ]);
  } catch (err: any) {
    Sentry.captureException(err);
    res.status(500).json({ error: err.message || 'Failed to analyze profile' });
  }
}
