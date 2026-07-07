const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';

function getHeaders(): Record<string, string> {
  const headers: Record<string, string> = { Accept: 'application/vnd.github.v3+json' };
  if (GITHUB_TOKEN) headers.Authorization = `Bearer ${GITHUB_TOKEN}`;
  return headers;
}

export async function fetchGitHubJSON(url: string): Promise<any> {
  const headers = getHeaders();
  const res = await fetch(url, { headers });
  if (res.status === 403) throw new Error('GitHub API rate limit exceeded. Try again later.');
  if (!res.ok) return null;
  return res.json();
}

export async function fetchUserAndRepos(username: string): Promise<{
  user: any;
  repos: any;
  repoList: any[];
  totalStars: number;
  totalForks: number;
}> {
  const [user, repos] = await Promise.all([
    fetchGitHubJSON(`https://api.github.com/users/${username}`),
    fetchGitHubJSON(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`),
  ]);

  const repoList = Array.isArray(repos) ? repos : [];
  const totalStars = repoList.reduce((sum: number, r: any) => sum + (r.stargazers_count || 0), 0);
  const totalForks = repoList.reduce((sum: number, r: any) => sum + (r.forks_count || 0), 0);

  return { user, repos, repoList, totalStars, totalForks };
}
