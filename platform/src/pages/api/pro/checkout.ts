import type { NextApiRequest, NextApiResponse } from 'next';
import * as Sentry from '@sentry/nextjs';
import { rateLimit, validateUsername } from '../../../lib/api-utils';
import { BASE_URL } from '../../../lib/config';

const KEY_ID = process.env.RAZORPAY_KEY_ID || '';
const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || '';
const AMOUNT = Number(process.env.PRO_PRICE_PAISE) || 49900;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const ip = req.headers['x-forwarded-for']?.toString().split(',')[0]?.trim() || req.headers['x-real-ip']?.toString() || 'unknown';
  const rl = rateLimit({ key: `pro:${ip}`, maxRequests: 10, windowMs: 60000 });
  if (!rl.allowed) return res.status(429).json({ error: 'Too many requests. Try again in a minute.' });

  if (!KEY_ID || !KEY_SECRET) {
    return res.status(503).json({ error: 'Payment not configured' });
  }

  const username = validateUsername(req.body?.username) || '';
  const rawEmail = typeof req.body?.email === 'string' ? req.body.email.trim() : '';
  const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rawEmail) ? rawEmail : '';

  if (!username) {
    return res.status(400).json({ error: 'Valid GitHub username required' });
  }

  const referenceId = `ad-${username}-${Date.now().toString(36)}`;

  const payload: Record<string, unknown> = {
    amount: AMOUNT,
    currency: 'INR',
    description: 'AutoDev GitHub Profile Makeover — README + roadmap + badge',
    reference_id: referenceId,
    callback_url: `${BASE_URL}/dashboard?user=${encodeURIComponent(username)}&pro_unlocked=1`,
    callback_method: 'get',
    notify: { email: true },
    notes: { source: 'autodev-dashboard', product: 'makeover', username },
  };
  if (email) payload.customer = { email };

  try {
    const auth = Buffer.from(`${KEY_ID}:${KEY_SECRET}`).toString('base64');
    const r = await fetch('https://api.razorpay.com/v1/payment_links', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify(payload),
    });
    if (!r.ok) {
      const body = await r.text();
      Sentry.captureException(new Error(`Razorpay payment link failed: ${r.status} ${body.slice(0, 300)}`));
      return res.status(502).json({ error: 'Payment setup failed. Please try again in a minute.' });
    }
    const data = await r.json();
    return res.status(200).json({ url: data.short_url, referenceId });
  } catch (err) {
    Sentry.captureException(err);
    return res.status(502).json({ error: 'Payment setup failed. Please try again in a minute.' });
  }
}