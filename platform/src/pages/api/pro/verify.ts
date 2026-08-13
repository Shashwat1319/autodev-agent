import type { NextApiRequest, NextApiResponse } from 'next';
import * as Sentry from '@sentry/nextjs';
import { createHmac, timingSafeEqual } from 'crypto';
import { rateLimit } from '../../../lib/api-utils';

const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || '';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const ip = req.headers['x-forwarded-for']?.toString().split(',')[0]?.trim() || req.headers['x-real-ip']?.toString() || 'unknown';
  const rl = rateLimit({ key: `proverify:${ip}`, maxRequests: 30, windowMs: 60000 });
  if (!rl.allowed) return res.status(429).json({ error: 'Too many requests. Try again in a minute.' });

  if (!KEY_SECRET) return res.status(500).json({ error: 'Verification unavailable' });

  const { link, ref, status, payment, sig } = req.query;
  const str = (v: unknown) => (typeof v === 'string' ? v : Array.isArray(v) ? v[0] ?? '' : '');

  const paymentLinkId = str(link);
  const referenceId = str(ref);
  const linkStatus = str(status);
  const paymentId = str(payment);
  const signature = str(sig);

  if (!paymentLinkId || !paymentId || !linkStatus || !signature) {
    return res.status(200).json({ paid: false, reason: 'missing' });
  }

  try {
    const payload = `${paymentLinkId}|${referenceId}|${linkStatus}|${paymentId}`;
    const expected = createHmac('sha256', KEY_SECRET).update(payload).digest('hex');
    const a = Buffer.from(expected);
    const b = Buffer.from(signature);
    const signatureOk = a.length === b.length && timingSafeEqual(a, b);

    if (!signatureOk) {
      Sentry.captureMessage(`Razorpay signature mismatch for link ${paymentLinkId}`);
      return res.status(200).json({ paid: false, reason: 'signature' });
    }

    return res.status(200).json({ paid: linkStatus === 'paid' });
  } catch (err) {
    Sentry.captureException(err);
    return res.status(200).json({ paid: false, reason: 'error' });
  }
}