function getToken(): string {
  return process.env.GITHUB_TOKEN || '';
}

function getHeaders(): Record<string, string> {
  const headers: Record<string, string> = { Accept: 'application/vnd.github.v3+json' };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

async function fetchWithRetry(url: string, options: RequestInit, retries = 2): Promise<Response> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    try {
      const res = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(timeout);
      if (res.status === 429 && attempt < retries) {
        await new Promise(r => setTimeout(r, 1000 * Math.pow(2, attempt)));
        continue;
      }
      return res;
    } catch (err) {
      clearTimeout(timeout);
      if (attempt === retries) throw err;
      await new Promise(r => setTimeout(r, 1000 * Math.pow(2, attempt)));
    }
  }
  throw new Error('Request failed after retries');
}

export async function fetchGitHubJSON(url: string): Promise<any> {
  const headers = getHeaders();
  let res: Response;
  try {
    res = await fetchWithRetry(url, { headers });
  } catch {
    throw new Error('GitHub is having a moment \u2014 try again in a minute.');
  }
  if (res.status === 403 || res.status === 429) {
    const msg = !getToken()
      ? 'GitHub is rate-limiting us right now \u2014 try again in about an hour.'
      : 'GitHub is rate-limiting us right now \u2014 try again in a minute.';
    throw new Error(msg);
  }
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
