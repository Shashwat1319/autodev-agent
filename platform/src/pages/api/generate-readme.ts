import type { NextApiRequest, NextApiResponse } from 'next';
import { rateLimit } from '../../lib/rate-limit';
import { calculateScore } from '../../lib/analyze-profile';
import { fetchGitHubJSON, fetchUserAndRepos } from '../../shared/github-client';
import { getLangColor } from '../../lib/lang-colors';
import { getScoreShieldsColor } from '../../lib/score';
import { BASE_URL } from '../../lib/config';
import { validateUsername } from '../../lib/validation';

function generateReadme(data: {
  username: string; avatar: string; name: string; bio: string;
  location: string; blog: string; company: string; twitter: string;
  totalRepos: number; totalStars: number; totalForks: number;
  languages: { name: string; percentage: number }[];
  topRepos: { name: string; description: string; stars: number; forks: number; language: string; url: string; topics: string[] }[];
  pinned: { name: string; description: string; stars: number; forks: number; language: string; url: string }[];
  recentActivity: string[];
  score: number;
}, style: string): string {
  const name = data.name || data.username;
  const e = (s: string) => encodeURIComponent(s);

  const statsBar = `<p align="center">
  <img src="https://img.shields.io/badge/Repos-${data.totalRepos}-blue?style=for-the-badge&logo=github&logoColor=white" />
  <img src="https://img.shields.io/badge/Stars-${data.totalStars}-yellow?style=for-the-badge&logo=star&logoColor=black" />
  <img src="https://img.shields.io/badge/Forks-${data.totalForks}-orange?style=for-the-badge&logo=git&logoColor=white" />
  <img src="https://img.shields.io/badge/AutoDev%20Score-${data.score}-${getScoreShieldsColor(data.score)}?style=for-the-badge&logo=target&logoColor=white" />
</p>`;

  const langBadges = data.languages.length > 0
    ? data.languages.map(l =>
      `<img src="https://img.shields.io/badge/${e(l.name)}-${l.percentage}%25-${getLangColor(l.name)}?style=for-the-badge&logoColor=white" />`
    ).join('\n  ')
    : '';

  const repoCard = (r: { url: string; name: string }) =>
    `  <a href="${r.url}">\n    <img align="center" src="https://github-readme-stats.vercel.app/api/pin/?username=${data.username}&repo=${r.name}&theme=tokyonight" />\n  </a>`;

  const pinnedCards = data.pinned.length > 0
    ? `<div align="center">\n${data.pinned.map(r => repoCard(r)).join('\n')}\n</div>`
    : '';

  const topReposCards = data.topRepos.length > 0
    ? `<div align="center">\n${data.topRepos.map(r => repoCard(r)).join('\n')}\n</div>`
    : '';

  const activitySection = data.recentActivity.length > 0
    ? `\n### ⚡ Recent Activity\n\n${data.recentActivity.map(a => `- ${a}`).join('\n')}`
    : '';

  const scoreBadge = `[![AutoDev Score](https://img.shields.io/badge/AutoDev%20Score-${data.score}/100-${getScoreShieldsColor(data.score)}?style=for-the-badge&logo=target&logoColor=white)](${BASE_URL}/dashboard?user=${data.username})`;

  const aboutLines: string[] = [];
  if (data.bio && data.bio !== 'No bio') aboutLines.push(data.bio);
  if (data.location) aboutLines.push(`🌍 **Location:** ${data.location}`);
  if (data.company) aboutLines.push(`🏢 **Company:** ${data.company}`);
  if (data.blog) aboutLines.push(`🔗 **Website:** [${data.blog}](${data.blog})`);
  aboutLines.push(`📊 **GitHub:** [${data.username}](https://github.com/${data.username})`);

  const typingLines: string[] = [];
  if (data.bio && data.bio !== 'No bio') {
    const words = data.bio.split(' ');
    if (words.length > 3) typingLines.push(words.slice(0, 4).join(' '));
    if (words.length > 7) typingLines.push(words.slice(4, 8).join(' '));
  }
  if (data.location) typingLines.push(`Based in ${data.location}`);
  if (data.company) typingLines.push(`Working at ${data.company}`);
  if (typingLines.length === 0) typingLines.push('Building Amazing Software', 'Open Source Enthusiast', 'Full Stack Developer');

  const socialBadges: string[] = [];
  if (data.twitter) socialBadges.push(`<a href="https://x.com/${data.twitter}"><img src="https://img.shields.io/badge/X-000000?style=flat-square&logo=x&logoColor=white" /></a>`);
  if (data.blog) socialBadges.push(`<a href="${data.blog}"><img src="https://img.shields.io/badge/Portfolio-000000?style=flat-square&logo=vercel&logoColor=white" /></a>`);
  socialBadges.push(`<a href="https://github.com/${data.username}"><img src="https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=github&logoColor=white" /></a>`);

  const templates: Record<string, string> = {
    minimal: `# 👋 Hello, I'm ${name}

${data.bio && data.bio !== 'No bio' ? `${data.bio}` : ''}

${statsBar}

---

### 🛠️ Languages

<div align="center">
  ${langBadges || 'No language data available'}
</div>

${data.languages.length > 0 ? `<p align="center">
  <img src="https://github-readme-stats.vercel.app/api/top-langs/?username=${data.username}&layout=compact&theme=tokyonight&count_private=true&hide_progress=false" alt="Top Languages" />
</p>` : ''}

---

<div align="center">
  ${scoreBadge}
</div>

<p align="center">
  <img src="https://komarev.com/ghpvc/?username=${data.username}&color=blueviolet" alt="Profile Views" />
</p>
`,

    professional: `<!-- Header Wave -->
<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&height=220&section=header&text=${e(name)}&fontSize=70&animation=fadeIn&fontAlignY=35&desc=AutoDev%20Generated%20Profile&descSize=20&descAlignY=55" />
</p>

<!-- Typing Effect -->
<p align="center">
  <a href="https://github.com/${data.username}">
    <img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&pause=1000&color=38BDF8&center=true&vCenter=true&width=435&lines=${e(typingLines[0] || 'Building Amazing Software')};${e(typingLines[1] || 'Open Source Enthusiast')};${e(typingLines[2] || 'Full Stack Developer')}" />
  </a>
</p>

---

### 👨‍💻 About Me

${aboutLines.map(l => `> ${l}`).join('\n')}

${data.totalRepos > 5 ? `
---

### 🛠️ Tech Stack

<div align="center">
  ${langBadges || 'No language data available'}
</div>

<p align="center">
  <img src="https://github-readme-stats.vercel.app/api/top-langs/?username=${data.username}&layout=compact&theme=tokyonight&count_private=true&hide_progress=false" alt="Top Languages" />
</p>
` : ''}

---

### 📈 GitHub Impact

<p align="center">
  <img src="https://github-readme-activity-graph.vercel.app/graph?username=${data.username}&theme=tokyonight&hide_border=true&area=true" width="100%" />
</p>

${data.totalRepos > 0 ? `<p align="center">
  <img src="https://github-readme-streak-stats.herokuapp.com/?user=${data.username}&theme=tokyonight&hide_border=true" alt="Streak Stats" />
</p>` : ''}

${data.topRepos.length > 0 ? `
---

### 🚀 Highlighted Repositories

${topReposCards}

<p align="center">
  <i><a href="https://github.com/${data.username}?tab=repositories">Explore all ${data.totalRepos} repositories →</a></i>
</p>
` : ''}

${activitySection}

---

<div align="center">
  ${scoreBadge}
</div>

### 📫 Connect with me

<p align="center">
  ${socialBadges.join('\n  ')}
</p>

<p align="center">
  <img src="https://komarev.com/ghpvc/?username=${data.username}&color=blueviolet" alt="Profile Views" />
</p>

<p align="center">
  <i>"Writing code that writes code to make life easier."</i>
</p>

<p align="center">
  <i>Profile auto-generated by <a href="${BASE_URL}">AutoDev</a></i>
</p>
`,

    recruiter: `<!-- Header Wave -->
<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=auto&height=200&section=header&text=${e(name)}&fontSize=60&animation=fadeIn&fontAlignY=35&desc=Recruiter-Ready%20Profile&descSize=18&descAlignY=55" />
</p>

---

### 📋 Professional Summary

> ${data.bio && data.bio !== 'No bio' ? data.bio : `${name} is a developer with ${data.totalRepos} public repositories and ${data.totalStars} stars across their projects.`}

${data.location ? `- 📍 **Based in:** ${data.location}` : ''}
${data.company ? `- 💼 **Currently:** ${data.company}` : ''}
${data.blog ? `- 🔗 **Website:** [${data.blog}](${data.blog})` : ''}
- 📊 **GitHub:** [${data.username}](https://github.com/${data.username})

---

### 📊 GitHub Statistics

| Metric | Value |
|--------|-------|
| Public Repositories | ${data.totalRepos} |
| Total Stars Earned | ${data.totalStars} |
| Repository Forks | ${data.totalForks} |
| AutoDev Score | ${data.score}/100 |

${data.languages.length > 0 ? `
### 🛠️ Languages

<div align="center">
  ${langBadges}
</div>

<p align="center">
  <img src="https://github-readme-stats.vercel.app/api/top-langs/?username=${data.username}&layout=compact&theme=tokyonight&count_private=true" alt="Top Languages" />
</p>
` : ''}

---

<p align="center">
  <img src="https://github-readme-activity-graph.vercel.app/graph?username=${data.username}&theme=tokyonight&hide_border=true&area=true" width="100%" />
</p>

${data.topRepos.length > 0 ? `
### 🔝 Top Projects

| # | Repository | Stars | Forks | Language |
|---|------------|:----:|:----:|:--------:|
${data.topRepos.map((r, i) => `| ${i + 1} | [${r.name}](${r.url}) | ${r.stars} | ${r.forks} | ${r.language} |`).join('\n')}
` : ''}

${data.pinned.length > 0 ? `
### 📌 Pinned Repositories

${pinnedCards}
` : ''}

---

<div align="center">
  ${scoreBadge}
  <br/><br/>
  <a href="https://buymeacoffee.com/shashwatsrivastava">
    <img src="https://img.shields.io/badge/Buy%20Me%20a%20Coffee-FFDD00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black" alt="Buy Me a Coffee" />
  </a>
</div>

<br/>

<div align="center">
  <i>Recruiter-ready profile · Generated by <a href="${BASE_URL}">AutoDev</a></i>
</div>
`,
  };

  return templates[style] || templates.professional;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const ip = req.headers['x-forwarded-for']?.toString().split(',')[0]?.trim() || req.headers['x-real-ip']?.toString() || 'unknown';
  const rl = rateLimit({ key: `generate-readme:${ip}`, maxRequests: 20, windowMs: 60000 });
  if (!rl.allowed) return res.status(429).json({ error: `Too many requests. Try again in ${Math.ceil(rl.resetIn / 1000)}s.` });

  const { username, style = 'professional' } = req.method === 'POST' ? req.body : req.query;
  const validated = validateUsername(username);
  if (!validated) return res.status(400).json({ error: 'Username is required' });

  try {
    const { user, repoList, totalStars, totalForks } = await fetchUserAndRepos(validated);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const events = await fetchGitHubJSON(`https://api.github.com/users/${validated}/events/public?per_page=30`);
    const eventList = Array.isArray(events) ? events : [];

    const langMap: Record<string, number> = {};
    repoList.forEach((r: any) => { if (r.language) langMap[r.language] = (langMap[r.language] || 0) + 1; });
    const totalLangs = Object.values(langMap).reduce((a: number, b: number) => a + b, 0);
    const languages = Object.entries(langMap)
      .map(([name, count]) => ({ name, percentage: Math.round((count / totalLangs) * 100) }))
      .sort((a, b) => b.percentage - a.percentage).slice(0, 8);

    const topRepos = repoList.filter((r: any) => !r.fork)
      .sort((a: any, b: any) => b.stargazers_count - a.stargazers_count)
      .slice(0, 5)
      .map((r: any) => ({
        name: r.name, description: r.description || 'No description',
        stars: r.stargazers_count || 0, forks: r.forks_count || 0,
        language: r.language || 'Unknown', url: r.html_url,
        topics: r.topics || [],
      }));

    const pinnedUrls: { name: string; description: string; stars: number; forks: number; language: string; url: string }[] = [];
    if (repoList.length > 0) {
      pinnedUrls.push(...repoList.filter((r: any) => !r.fork).slice(0, 3).map((r: any) => ({
        name: r.name, description: r.description || '', stars: r.stargazers_count || 0,
        forks: r.forks_count || 0, language: r.language || 'Unknown', url: r.html_url,
      })));
    }

    const recentActivity = eventList.slice(0, 5).map((e: any) => {
      const repo = e.repo?.name || 'unknown';
      switch (e.type) {
        case 'PushEvent': return `Pushed to [${repo}](https://github.com/${repo})`;
        case 'CreateEvent': return `Created ${e.payload?.ref_type || 'resource'} in [${repo}](https://github.com/${repo})`;
        case 'IssuesEvent': return `${e.payload?.action || 'Updated'} issue in [${repo}](https://github.com/${repo})`;
        case 'PullRequestEvent': return `${e.payload?.action || 'Updated'} PR in [${repo}](https://github.com/${repo})`;
        case 'ForkEvent': return `Forked [${repo}](https://github.com/${repo})`;
        case 'WatchEvent': return `Starred [${repo}](https://github.com/${repo})`;
        default: return `Activity in [${repo}](https://github.com/${repo})`;
      }
    }).filter(Boolean);

    const { overallScore } = calculateScore({
      repoCount: repoList.length,
      totalStars,
      eventCount: eventList.length,
      publicRepos: user.public_repos,
      hasBio: !!user.bio,
    });

    const readme = generateReadme({
      username: user.login, avatar: user.avatar_url, name: user.name || user.login,
      bio: user.bio || 'No bio', location: user.location || '', blog: user.blog || '',
      company: user.company || '', twitter: user.twitter_username || '',
      totalRepos: user.public_repos, totalStars, totalForks,
      languages, topRepos, pinned: pinnedUrls, recentActivity,
      score: overallScore,
    }, style as string);

    if (req.method === 'POST') {
      res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="README-${username}.md"`);
      return res.status(200).send(readme);
    }

    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');
    res.status(200).json({ username: user.login, readme, style });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to generate README' });
  }
}
