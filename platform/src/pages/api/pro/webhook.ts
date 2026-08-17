import type { NextApiRequest, NextApiResponse } from 'next';
import * as Sentry from '@sentry/nextjs';
import { createHmac, timingSafeEqual } from 'crypto';
import { rateLimit } from '../../../lib/api-utils';
import { addPaidUser, verifyPaymentSignature } from '../../../lib/pro-server';

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

  if (!process.env.RAZORPAY_KEY_SECRET) {
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

  if (!verifyPaymentSignature(body, String(signature || ''))) {
    Sentry.captureMessage('Razorpay webhook signature mismatch');
    return res.status(400).json({ error: 'Invalid signature' });
  }

  try {
    const event = JSON.parse(body);
    const entity = event?.payload?.payment_link?.entity || {};

    if (event.event === 'payment_link.paid') {
      const username = entity.notes?.username || '';
      const email = entity.customer?.email;

      const saved = await addPaidUser({
        username,
        paymentLinkId: entity.id,
        paymentId: entity.id,
        email,
        amount: entity.amount,
        currency: entity.currency,
        paidAt: Date.now(),
        verified: true,
      });

      if (!saved) {
        Sentry.captureMessage('Failed to save paid user from webhook', {
          extra: { paymentLinkId: entity.id, username },
        });
      }

      Sentry.captureMessage('AutoDev Pro payment received via webhook', {
        extra: {
          paymentLinkId: entity.id,
          amount: entity.amount,
          currency: entity.currency,
          status: entity.status,
          username,
          email,
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