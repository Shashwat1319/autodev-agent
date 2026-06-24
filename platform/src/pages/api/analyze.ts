import type { NextApiRequest, NextApiResponse } from 'next';
import { rateLimit } from '../../lib/rate-limit';
import { analyzeProfile } from '../../lib/analyze-profile';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const ip = req.headers['x-forwarded-for']?.toString().split(',')[0]?.trim() || req.headers['x-real-ip']?.toString() || 'unknown';
  const rl = rateLimit({ key: `analyze:${ip}`, maxRequests: 30, windowMs: 60000 });
  if (!rl.allowed) return res.status(429).json({ error: `Too many requests. Try again in ${Math.ceil(rl.resetIn / 1000)}s.` });

  const { username } = req.query;

  if (!username || typeof username !== 'string') {
    return res.status(400).json({ error: 'Username is required' });
  }

  if (!process.env.GITHUB_TOKEN && process.env.NODE_ENV === 'development') {
    console.warn('⚠️ GITHUB_TOKEN not set — GitHub API rate limited to 60 req/hr');
  }

  try {
    const analysis = await analyzeProfile(username);
    if (!analysis) return res.status(404).json({ error: 'User not found' });

    res.status(200).json(analysis);
  } catch (err: any) {
    console.error('Analysis error:', err);
    res.status(500).json({ error: err.message || 'Failed to analyze profile' });
  }
}
