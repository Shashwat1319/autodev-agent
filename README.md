# AutoDev — Auto-Git Agent + GitHub Profile Analyzer & Free README Generator

<div align="center">
  <a href="https://autodev-kappa.vercel.app"><img src="https://img.shields.io/badge/deployed-vercel-000?style=for-the-badge" /></a>
  <a href="https://www.npmjs.com/package/autodev-agent"><img src="https://img.shields.io/npm/v/autodev-agent?style=for-the-badge" /></a>
  <a href="https://autodev-kappa.vercel.app/api/badge?username=Shashwat1319"><img src="https://autodev-kappa.vercel.app/api/badge?username=Shashwat1319" /></a>
</div>

**AutoDev** is a dual-component platform — a local git automation agent and a cloud-based GitHub profile analyzer with a free README generator.

## What It Does

### 🤖 Local Agent (`npx autodev-agent`)
Run in your terminal — watches files, auto-commits with smart debouncing, and auto-pushes to GitHub. No manual `git add`, `git commit`, or `git push` ever again.

### 🌐 Cloud Platform (autodev-kappa.vercel.app)
| Tool | Description |
|---|---|
| **Profile Analyzer** | Score/100, language breakdown, activity graph, streak stats, top repos |
| **README Generator** | 3 styles (Professional/Minimal/Recruiter) — capsule header, typing SVG, pinned cards, activity graph — preview, copy, or download for free |
| **Leaderboard** | Ranked profiles by score with search |
| **Shareable Badge** | Dynamic SVG badge for your GitHub profile |
| **OG Image** | Auto-generated social preview images |

**100% free. No login. No signup. No database (live GitHub API).**

## Quick Start

### Run the agent (one command)
```bash
npx autodev-agent
```
Zero config, no install needed.

### Analyze any profile
Go to **[autodev-kappa.vercel.app/dashboard](https://autodev-kappa.vercel.app/dashboard)** → enter username → see score, languages, activity graph, streak, recommendations.

### Generate your README
Go to **[autodev-kappa.vercel.app/readme-generator](https://autodev-kappa.vercel.app/readme-generator)** → pick a style → generate → copy or download.

## Badge

Add this to your GitHub profile README:

```markdown
[![AutoDev Score](https://autodev-kappa.vercel.app/api/badge?username=YOUR_USERNAME)](https://autodev-kappa.vercel.app/dashboard?user=YOUR_USERNAME)
```

## Stack

| Component | Tech |
|---|---|
| Framework | Next.js 14 (Pages Router) |
| Styling | Tailwind CSS + glassmorphism utilities |
| Images | Sharp (SVG→PNG for OG images) |
| Hosting | Vercel (free tier, auto-deploy from GitHub) |
| Agent | Node.js CLI published on npm |
| Rate Limit | In-memory per-IP (no Redis) |
| Analytics | @vercel/analytics |

## Links

- **Platform**: https://autodev-kappa.vercel.app
- **Agent**: `npx autodev-agent` (npm: [autodev-agent](https://www.npmjs.com/package/autodev-agent))
- **Source**: https://github.com/Shashwat1319/autodev-agent
- **Support**: [Buy me a coffee](https://buymeacoffee.com/shashwatsrivastava)

## License

MIT
