import type { NextApiRequest, NextApiResponse } from 'next';
import * as Sentry from '@sentry/nextjs';
import { createHmac, timingSafeEqual } from 'crypto';
import { rateLimit } from '../../../lib/api-utils';

const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || '';

export const config = {
  api: {
    bodyParser: false,
  },
};

function readBody(req: NextApiRequest): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (chunk: Buffer) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const ip = req.headers['x-forwarded-for']?.toString().split(',')[0]?.trim() || req.headers['x-real-ip']?.toString() || 'unknown';
  const rl = rateLimit({ key: `webhook:${ip}`, maxRequests: 120, windowMs: 60000 });
  if (!rl.allowed) return res.status(429).json({ error: 'Too many requests.' });

  if (!KEY_SECRET) {
    Sentry.captureMessage('Razorpay webhook received but RAZORPAY_KEY_SECRET is not set');
    return res.status(500).json({ error: 'Webhook not configured' });
  }

  const signature = req.headers['x-razorpay-signature'];
  let body: string;
  try {
    body = await readBody(req);
  } catch {
    return res.status(400).json({ error: 'Invalid body' });
  }

  const expected = createHmac('sha256', KEY_SECRET).update(body).digest('hex');
  const a = Buffer.from(expected);
  const b = Buffer.from(String(signature || ''));
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    Sentry.captureMessage('Razorpay webhook signature mismatch');
    return res.status(400).json({ error: 'Invalid signature' });
  }

  try {
    const event = JSON.parse(body);
    const entity = event?.payload?.payment_link?.entity || {};

    if (event.event === 'payment_link.paid') {
      Sentry.captureMessage('AutoDev Pro payment received', {
        extra: {
          paymentLinkId: entity.id,
          amount: entity.amount,
          currency: entity.currency,
          status: entity.status,
          username: entity.notes?.username,
          email: entity.customer?.email,
        },
        tags: { event: 'pro_payment' },
      });
    }

    return res.status(200).json({ received: true });
  } catch (err) {
    Sentry.captureException(err);
    return res.status(400).json({ error: 'Invalid payload' });
  }
}