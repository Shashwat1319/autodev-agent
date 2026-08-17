import type { NextApiRequest, NextApiResponse } from 'next';
import { readCounter } from '../../lib/counter';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const counter = await readCounter();
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  res.status(200).json({
    analyses: counter.analyses,
    countryCount: counter.countries.length,
  });
}