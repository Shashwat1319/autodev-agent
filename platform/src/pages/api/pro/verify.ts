import type { NextApiRequest, NextApiResponse } from 'next';
import * as Sentry from '@sentry/nextjs';
import { createHmac, timingSafeEqual } from 'crypto';
import { rateLimit } from '../../../lib/api-utils';
import {
  verifyPaymentLinkSignature,
  verifyPaymentAmount,
  addPaidUser,
  createProCookie,
} from '../../../lib/pro-server';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const ip = req.headers['x-forwarded-for']?.toString().split(',')[0]?.trim() || req.headers['x-real-ip']?.toString() || 'unknown';
  const rl = rateLimit({ key: `proverify:${ip}`, maxRequests: 30, windowMs: 60000 });
  if (!rl.allowed) return res.status(429).json({ error: 'Too many requests. Try again in a minute.' });

  const str = (v: unknown) => (typeof v === 'string' ? v : Array.isArray(v) ? v[0] ?? '' : '');

  const paymentLinkId = str(req.query.link);
  const referenceId = str(req.query.ref);
  const linkStatus = str(req.query.status);
  const paymentId = str(req.query.payment);
  const signature = str(req.query.sig);

  if (!paymentLinkId || !paymentId || !linkStatus || !signature) {
    return res.status(200).json({ paid: false, reason: 'missing' });
  }

  try {
    const sigValid = verifyPaymentLinkSignature(paymentLinkId, referenceId, linkStatus, paymentId, signature);
    if (!sigValid) {
      Sentry.captureMessage(`Razorpay signature mismatch for link ${paymentLinkId}`);
      return res.status(200).json({ paid: false, reason: 'signature' });
    }

    if (linkStatus !== 'paid') {
      return res.status(200).json({ paid: false, reason: 'not_paid' });
    }

    const amountValid = await verifyPaymentAmount(paymentLinkId);
    if (!amountValid) {
      Sentry.captureMessage(`Razorpay amount mismatch for link ${paymentLinkId}`);
      return res.status(200).json({ paid: false, reason: 'amount_mismatch' });
    }

    const username = referenceId.startsWith('ad-') ? referenceId.split('-').slice(-1)[0] : '';
    const email = str(req.query.email) || undefined;

    const saved = await addPaidUser({
      username,
      paymentLinkId,
      paymentId,
      email,
      amount: 49900,
      currency: 'INR',
      paidAt: Date.now(),
      verified: true,
    });

    if (!saved) {
      Sentry.captureMessage(`Failed to save paid user for ${paymentLinkId}`);
    }

    const cookie = createProCookie();
    res.setHeader('Set-Cookie', cookie);

    return res.status(200).json({ paid: true, username });
  } catch (err) {
    Sentry.captureException(err);
    return res.status(200).json({ paid: false, reason: 'error' });
  }
}