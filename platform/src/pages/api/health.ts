import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const checks: Record<string, string> = {};

  const hasToken = !!process.env.GITHUB_TOKEN;
  checks.github_token = hasToken ? 'configured' : 'missing (60 req/hr limit)';

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://autodev-kappa.vercel.app';
  checks.base_url = baseUrl;

  if (req.query.detail === '1') {
    try {
      const ghRes = await fetch('https://api.github.com/rate_limit', {
        headers: hasToken
          ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}`, Accept: 'application/vnd.github.v3+json' }
          : { Accept: 'application/vnd.github.v3+json' },
      });
      if (ghRes.ok) {
        const data = await ghRes.json();
        checks.github_rate_remaining = String(data.resources?.core?.remaining ?? 'unknown');
      } else {
        checks.github_rate_remaining = 'fetch-failed';
      }
    } catch {
      checks.github_rate_remaining = 'fetch-error';
    }
  }

  const allOk = Object.values(checks).every(v => !v.startsWith('error') && !v.startsWith('missing'));
  const statusCode = allOk ? 200 : 200;

  res.setHeader('Cache-Control', 'no-store');
  res.status(statusCode).json({
    status: 'ok',
    version: '0.2.0',
    timestamp: new Date().toISOString(),
    checks,
  });
}
