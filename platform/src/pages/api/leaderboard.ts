import type { NextApiRequest, NextApiResponse } from 'next';
import { rateLimit } from '../../lib/rate-limit';
import { analyzeProfile } from '../../lib/analyze-profile';

const FEATURED = [
  'torvalds', 'gaearon', 'sindresorhus', 'tj', 'Shashwat1319',
  'TheAlgorithms', 'yyx990803', 'addyosmani', 'kentcdodds', 'mjackson',
  'prakhar1989', 'kamranahmedse', 'nikhilkalburgi',
];

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://autodev-kappa.vercel.app');

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const ip = req.headers['x-forwarded-for']?.toString().split(',')[0]?.trim() || req.headers['x-real-ip']?.toString() || 'unknown';
  const rl = rateLimit({ key: `leaderboard:${ip}`, maxRequests: 20, windowMs: 60000 });
  if (!rl.allowed) return res.status(429).json({ error: `Too many requests. Try again in ${Math.ceil(rl.resetIn / 1000)}s.` });

  const { q } = req.query;
  const usernames: string[] = [...FEATURED];

  if (q && typeof q === 'string') {
    const extra = q.split(',').map((u: string) => u.trim()).filter(Boolean).slice(0, 10);
    extra.forEach((u) => {
      if (!usernames.includes(u)) usernames.push(u);
    });
  }

  const results: any[] = [];

  const batchSize = 5;
  for (let i = 0; i < usernames.length; i += batchSize) {
    const batch = usernames.slice(i, i + batchSize);
    const promises = batch.map(async (username) => {
      try {
        return await analyzeProfile(username);
      } catch {
        return null;
      }
    });
    const batchResults = await Promise.all(promises);
    results.push(...batchResults.filter(Boolean));
    if (i + batchSize < usernames.length) {
      await new Promise((r) => setTimeout(r, 300));
    }
  }

  results.sort((a, b) => (b.overallScore || 0) - (a.overallScore || 0));

  const leaderboard = results.map((p, i) => ({
    rank: i + 1,
    username: p.username,
    avatar: p.avatar,
    score: p.overallScore,
    repos: p.totalRepos,
    stars: p.totalStars,
    forks: p.totalForks,
    languages: (p.languages || []).slice(0, 3).map((l: any) => l.name),
  }));

  res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate');
  res.status(200).json({ leaderboard, total: leaderboard.length });
}
