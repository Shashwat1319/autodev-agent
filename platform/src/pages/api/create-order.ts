import type { NextApiRequest, NextApiResponse } from 'next';
import { rateLimit } from '../../lib/rate-limit';

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || '';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || '';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const ip = req.headers['x-forwarded-for']?.toString().split(',')[0]?.trim() || req.headers['x-real-ip']?.toString() || 'unknown';
  const rl = rateLimit({ key: `create-order:${ip}`, maxRequests: 10, windowMs: 60000 });
  if (!rl.allowed) return res.status(429).json({ error: `Too many requests. Try again in ${Math.ceil(rl.resetIn / 1000)}s.` });

  if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
    return res.status(400).json({
      error: 'PAYMENT_NOT_CONFIGURED',
      message: 'Payment gateway is being configured. Please check back soon.',
    });
  }

  let body = '';
  try {
    body = JSON.stringify(req.body);
  } catch (e) {
    return res.status(400).json({ error: 'Body parse error' });
  }

  if (!req.body || !req.body.username) {
    return res.status(400).json({ error: 'Username is required', body });
  }

  const { username } = req.body;

  try {
    const razorpay = require('razorpay');
    const instance = new razorpay({
      key_id: RAZORPAY_KEY_ID,
      key_secret: RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: 9900,
      currency: 'INR',
      receipt: `autodev_${username}_${Date.now()}`,
      notes: { username },
    };

    const order = await instance.orders.create(options);

    res.status(200).json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id: RAZORPAY_KEY_ID,
    });
  } catch (err: any) {
    console.error('Order creation error:', err);
    res.status(500).json({ error: err.message || 'Failed to create order' });
  }
}
