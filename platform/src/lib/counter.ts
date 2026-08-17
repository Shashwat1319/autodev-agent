const OWNER = 'Shashwat1319';
const REPO = 'autodev-agent';
const PATH = 'stats/counter.json';
const BRANCH = 'master';

export interface CounterData {
  analyses: number;
  countries: string[];
}

const FALLBACK: CounterData = { analyses: 0, countries: [] };

function apiHeaders() {
  return {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN || ''}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
}

function normalize(raw: any): CounterData {
  try {
    const parsed = JSON.parse(Buffer.from(raw.content, 'base64').toString('utf8'));
    return {
      analyses: Number(parsed.analyses) || 0,
      countries: Array.isArray(parsed.countries) ? parsed.countries.filter((c: unknown) => typeof c === 'string' && /^[A-Z]{2}$/.test(c)) : [],
    };
  } catch {
    return FALLBACK;
  }
}

export async function readCounter(): Promise<CounterData> {
  if (!process.env.GITHUB_TOKEN) return FALLBACK;
  try {
    const r = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/contents/${PATH}?ref=${BRANCH}`, { headers: apiHeaders() });
    if (!r.ok) return FALLBACK;
    return normalize(await r.json());
  } catch {
    return FALLBACK;
  }
}

export async function incrementCounter(country?: string): Promise<CounterData> {
  if (!process.env.GITHUB_TOKEN) return FALLBACK;
  const cc = country && /^[A-Z]{2}$/.test(country) ? country : '';
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const get = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/contents/${PATH}?ref=${BRANCH}`, { headers: apiHeaders() });
      let sha: string | undefined;
      let current: CounterData;
      if (get.status === 404) {
        current = FALLBACK;
      } else if (!get.ok) {
        return FALLBACK;
      } else {
        const data: any = await get.json();
        sha = data.sha;
        current = normalize(data);
      }
      const countries = cc && !current.countries.includes(cc) ? [...current.countries, cc] : current.countries;
      const next: CounterData = { analyses: current.analyses + 1, countries };
      const body: Record<string, unknown> = {
        message: 'stats: increment profile analysis counter',
        content: Buffer.from(JSON.stringify(next)).toString('base64'),
        branch: BRANCH,
      };
      if (sha) body.sha = sha;
      const put = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/contents/${PATH}`, {
        method: 'PUT',
        headers: { ...apiHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (put.ok) return next;
      console.error(`[counter] write failed status=${put.status} body=${(await put.text()).slice(0, 200)}`);
      if (put.status === 409 || put.status === 422) continue;
      return FALLBACK;
    } catch {
      continue;
    }
  }
  return FALLBACK;
}
