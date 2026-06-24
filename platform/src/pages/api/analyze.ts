import type { NextApiRequest, NextApiResponse } from 'next';
import { ProfileAnalysis } from '../../shared/types';
import { rateLimit } from '../../lib/rate-limit';

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

  try {
    const token = process.env.GITHUB_TOKEN || '';
    if (!token && process.env.NODE_ENV === 'development') {
      console.warn('⚠️ GITHUB_TOKEN not set — GitHub API rate limited to 60 req/hr');
    }

    const headers: Record<string, string> = {
      Accept: 'application/vnd.github.v3+json',
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const [userRes, reposRes, eventsRes] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`, { headers }),
      fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, { headers }),
      fetch(`https://api.github.com/users/${username}/events/public?per_page=100`, { headers }),
    ]);

    if (!userRes.ok) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userData = await userRes.json();
    const repos = await reposRes.json();
    const events = await eventsRes.json();

    const totalStars = repos.reduce((sum: number, r: any) => sum + (r.stargazers_count || 0), 0);
    const totalForks = repos.reduce((sum: number, r: any) => sum + (r.forks_count || 0), 0);

    const langMap: Record<string, number> = {};
    repos.forEach((r: any) => {
      if (r.language) {
        langMap[r.language] = (langMap[r.language] || 0) + 1;
      }
    });
    const totalLangs = Object.values(langMap).reduce((a: number, b: number) => a + b, 0);
    const languages = Object.entries(langMap)
      .map(([name, count]) => ({
        name,
        percentage: Math.round((count / totalLangs) * 100),
      }))
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 8);

    const topRepos = repos
      .filter((r: any) => !r.fork)
      .sort((a: any, b: any) => b.stargazers_count - a.stargazers_count)
      .slice(0, 5)
      .map((r: any) => ({
        name: r.name,
        description: r.description || 'No description',
        stars: r.stargazers_count,
        forks: r.forks_count,
        language: r.language || 'Unknown',
        score: Math.min(100, Math.round(
          (r.stargazers_count * 10) +
          (r.forks_count * 5) +
          (r.description ? 10 : 0) +
          (r.topics?.length ? 5 : 0)
        )),
        strengths: r.description ? ['Has description'] : [],
        weaknesses: !r.description ? ['No README / description'] : [],
      }));

    const totalContributions = repos.reduce((sum: number, r: any) => sum + (r.size || 0), 0);

    const consistencyScore = Math.min(100, Math.round(
      (repos.length > 0 ? 30 : 0) +
      (totalStars > 0 ? 20 : 0) +
      (events.length > 10 ? 25 : events.length > 0 ? 10 : 0) +
      (userData.public_repos > 5 ? 15 : 5) +
      (userData.bio ? 10 : 0)
    ));

    const hasReadme = repos.some((r: any) => r.description && r.description.length > 20);
    const recommendations: string[] = [];
    if (!userData.bio) recommendations.push('Add a bio to your GitHub profile');
    if (!userData.blog) recommendations.push('Add a website/blog link to your profile');
    if (repos.filter((r: any) => !r.fork).length < 3) recommendations.push('Create more original repositories (not forks)');
    if (!hasReadme) recommendations.push('Add README files to your repositories');
    if (totalStars < 5) recommendations.push('Share your projects to get more stars');
    if (events.length < 10) recommendations.push('Be more active — commit more frequently');

    const analysis: ProfileAnalysis = {
      username: userData.login,
      avatar: userData.avatar_url,
      bio: userData.bio || 'No bio',
      location: userData.location || 'Unknown',
      totalRepos: userData.public_repos,
      totalStars,
      totalForks,
      totalContributions: Math.round(totalContributions / 100),
      languages,
      topRepos,
      consistencyScore,
      overallScore: Math.round((consistencyScore + Math.min(100, totalStars * 2)) / 2),
      recommendations,
    };

    res.status(200).json(analysis);
  } catch (err: any) {
    console.error('Analysis error:', err);
    res.status(500).json({ error: err.message || 'Failed to analyze profile' });
  }
}
