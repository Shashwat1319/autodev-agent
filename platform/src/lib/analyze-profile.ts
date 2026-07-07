import { ProfileAnalysis } from '../shared/types';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';

function getHeaders(): Record<string, string> {
  const headers: Record<string, string> = { Accept: 'application/vnd.github.v3+json' };
  if (GITHUB_TOKEN) headers.Authorization = `Bearer ${GITHUB_TOKEN}`;
  return headers;
}

export function calculateScore(data: {
  repoCount: number;
  totalStars: number;
  eventCount: number;
  publicRepos: number;
  hasBio: boolean;
}): { consistencyScore: number; overallScore: number } {
  const consistencyScore = Math.min(100, Math.round(
    (data.repoCount > 0 ? 30 : 0) +
    (data.totalStars > 0 ? 20 : 0) +
    (data.eventCount > 10 ? 25 : data.eventCount > 0 ? 10 : 0) +
    (data.publicRepos > 5 ? 15 : 5) +
    (data.hasBio ? 10 : 0)
  ));
  const overallScore = Math.round((consistencyScore + Math.min(100, data.totalStars * 2)) / 2);
  return { consistencyScore, overallScore };
}

export async function analyzeProfile(username: string): Promise<ProfileAnalysis | null> {
  const headers = getHeaders();

  const [userRes, reposRes, eventsRes] = await Promise.all([
    fetch(`https://api.github.com/users/${username}`, { headers }),
    fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, { headers }),
    fetch(`https://api.github.com/users/${username}/events/public?per_page=100`, { headers }),
  ]);

  if (!userRes.ok) {
    if (userRes.status === 403) throw new Error('GitHub API rate limit exceeded. Try again later.');
    return null;
  }
  if (!reposRes.ok || !eventsRes.ok) {
    if (reposRes.status === 403 || eventsRes.status === 403) throw new Error('GitHub API rate limit exceeded. Try again later.');
    return null;
  }

  const userData = await userRes.json();
  const repos = await reposRes.json();
  const events = await eventsRes.json();

  const repoList = Array.isArray(repos) ? repos : [];
  const eventList = Array.isArray(events) ? events : [];

  const totalStars = repoList.reduce((sum: number, r: any) => sum + (r.stargazers_count || 0), 0);
  const totalForks = repoList.reduce((sum: number, r: any) => sum + (r.forks_count || 0), 0);

  const langMap: Record<string, number> = {};
  repoList.forEach((r: any) => {
    if (r.language) langMap[r.language] = (langMap[r.language] || 0) + 1;
  });
  const totalLangs = Object.values(langMap).reduce((a: number, b: number) => a + b, 0);
  const languages = Object.entries(langMap)
    .map(([name, count]) => ({ name, percentage: Math.round((count / totalLangs) * 100) }))
    .sort((a, b) => b.percentage - a.percentage);

  const topRepos = repoList
    .filter((r: any) => !r.fork)
    .sort((a: any, b: any) => b.stargazers_count - a.stargazers_count)
    .slice(0, 5)
    .map((r: any) => ({
      name: r.name,
      description: r.description || 'No description',
      stars: r.stargazers_count || 0,
      forks: r.forks_count || 0,
      language: r.language || 'Unknown',
      score: Math.min(100, Math.round(
        (r.stargazers_count * 10) + (r.forks_count * 5) + (r.description ? 10 : 0) + ((r.topics?.length || 0) * 5)
      )),
      strengths: r.description ? ['Has description'] : [],
      weaknesses: !r.description ? ['No description'] : [],
    }));

  const repoVolume = Math.round(repoList.reduce((sum: number, r: any) => sum + (r.size || 0), 0) / 100);

  const { consistencyScore, overallScore } = calculateScore({
    repoCount: repoList.length,
    totalStars,
    eventCount: eventList.length,
    publicRepos: userData.public_repos,
    hasBio: !!userData.bio,
  });

  const hasDescriptions = repoList.some((r: any) => r.description && r.description.length > 20);
  const recommendations: string[] = [];
  if (!userData.bio) recommendations.push('Add a bio to your GitHub profile');
  if (!userData.blog) recommendations.push('Add a website/blog link to your profile');
  if (repoList.filter((r: any) => !r.fork).length < 3) recommendations.push('Create more original repositories (not forks)');
  if (!hasDescriptions) recommendations.push('Add descriptions to your repositories');
  if (totalStars < 5) recommendations.push('Share your projects to get more stars');
  if (eventList.length < 10) recommendations.push('Be more active — commit more frequently');

  return {
    username: userData.login,
    avatar: userData.avatar_url,
    bio: userData.bio || 'No bio',
    location: userData.location || '',
    totalRepos: userData.public_repos,
    totalStars,
    totalForks,
    totalContributions: repoVolume,
    languages,
    topRepos,
    consistencyScore,
    overallScore,
    recommendations,
  };
}
