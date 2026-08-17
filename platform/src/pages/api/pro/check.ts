import type { NextApiRequest, NextApiResponse } from 'next';
import { rateLimit } from '../../../lib/api-utils';
import { isUserPro } from '../../../lib/pro-server';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const ip = req.headers['x-forwarded-for']?.toString().split(',')[0]?.trim() || req.headers['x-real-ip']?.toString() || 'unknown';
  const rl = rateLimit({ key: `procheck:${ip}`, maxRequests: 30, windowMs: 60000 });
  if (!rl.allowed) return res.status(429).json({ error: 'Too many requests. Try again in a minute.' });

  const { username } = req.query;
  if (!username || typeof username !== 'string') return res.status(400).json({ error: 'username required' });

  const isPro = await isUserPro(username);
  res.status(200).json({ username, isPro });
}