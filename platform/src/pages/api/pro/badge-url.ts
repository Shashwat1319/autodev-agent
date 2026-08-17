import type { NextApiRequest, NextApiResponse } from 'next';
import * as Sentry from '@sentry/nextjs';
import { createHmac } from 'crypto';
import { rateLimit, validateUsername } from '../../../lib/api-utils';
import { BASE_URL } from '../../../lib/config';
import { isUserPro } from '../../../lib/pro-server';

const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || '';
const EXPIRY_SECONDS = 90 * 86400;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const ip = req.headers['x-forwarded-for']?.toString().split(',')[0]?.trim() || req.headers['x-real-ip']?.toString() || 'unknown';
  const rl = rateLimit({ key: `badgeurl:${ip}`, maxRequests: 30, windowMs: 60000 });
  if (!rl.allowed) return res.status(429).json({ error: 'Too many requests. Try again in a minute.' });

  const cookies = req.headers.cookie || '';
  const hasProCookie = cookies.split('; ').some(c => c.startsWith('autodev_pro=1'));

  const { username, style } = req.query;
  const requestedStyle = String(style || 'gold');
  if (requestedStyle !== 'gold' && requestedStyle !== 'dark') {
    return res.status(400).json({ error: 'Invalid style' });
  }
  const validated = validateUsername(username);
  if (!validated) return res.status(400).json({ error: 'Invalid username' });

  const isPro = hasProCookie || await isUserPro(validated);
  if (!isPro) return res.status(403).json({ error: 'Pro required' });

  if (!KEY_SECRET) {
    Sentry.captureMessage('badge-url: RAZORPAY_KEY_SECRET not set');
    return res.status(500).json({ error: 'Signing unavailable' });
  }

  const exp = Math.floor(Date.now() / 1000) + EXPIRY_SECONDS;
  const msg = `${validated}:${requestedStyle}:${exp}`;
  const sig = createHmac('sha256', KEY_SECRET).update(msg).digest('hex');

  const url = `${BASE_URL}/api/badge?username=${encodeURIComponent(validated)}&style=${requestedStyle}&exp=${exp}&sig=${sig}`;
  res.status(200).json({ url, expiresAt: exp });
}