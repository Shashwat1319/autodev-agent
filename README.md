# AutoDev — GitHub Profile Analyzer & README Generator

<div align="center">
  <a href="https://autodev-kappa.vercel.app"><img src="https://img.shields.io/badge/deployed-vercel-000?style=for-the-badge" /></a>
  <a href="https://www.npmjs.com/package/autodev-agent"><img src="https://img.shields.io/npm/v/autodev-agent?style=for-the-badge" /></a>
  <a href="https://www.npmjs.com/package/autodev-agent"><img src="https://img.shields.io/npm/dm/autodev-agent?style=for-the-badge" /></a>
</div>

A free, no-login GitHub profile analyzer and README generator. Also includes a local git automation agent (`npx autodev-agent`) and a Chrome extension for inline profile scores.

---

## Platform (autodev-kappa.vercel.app)

| Feature | Description |
|---|---|
| **Profile Analyzer** | Score/100, language breakdown, top repos, streak stats |
| **README Generator** | 3 styles (Professional / Minimal / Recruiter) — preview, copy, or download |
| **Leaderboard** | Ranked profiles by score with search |
| **Shareable Badge** | Dynamic SVG badge for your GitHub README |

No login. No signup. No database — all data comes from the GitHub API.

### Quick Links

- **Analyze**: [autodev-kappa.vercel.app/dashboard](https://autodev-kappa.vercel.app/dashboard)
- **Generate README**: [autodev-kappa.vercel.app/readme-generator](https://autodev-kappa.vercel.app/readme-generator)
- **Leaderboard**: [autodev-kappa.vercel.app/leaderboard](https://autodev-kappa.vercel.app/leaderboard)

### Badge

Add to your GitHub profile README:

```markdown
[![AutoDev Score](https://autodev-kappa.vercel.app/api/badge?username=YOUR_USERNAME)](https://autodev-kappa.vercel.app/dashboard?user=YOUR_USERNAME)
```

---

## Agent (`npx autodev-agent`)

A CLI tool that watches your files, auto-commits with smart debouncing, and pushes to GitHub.

### One-command run

```bash
npx autodev-agent
```

No install needed — runs via npx.

### Development

```bash
cd agent
npm run dev
```

### Configuration

Create `~/.autodev/config.json`:

```json
{
  "repos": [
    {
      "localPath": "/path/to/your/project",
      "remoteUrl": "https://github.com/you/project.git",
      "branch": "main",
      "enabled": true
    }
  ],
  "autoCommit": true,
  "autoPush": true,
  "commitThreshold": 60,
  "commitMessagePattern": "auto: updated {files}",
  "maxChangesBeforeCommit": 10,
  "ignoredPaths": ["node_modules", ".git", "dist", "build", ".next"]
}
```

---

## Chrome Extension

Shows AutoDev score on any GitHub profile page.

1. Open Chrome → `chrome://extensions`
2. Enable Developer mode
3. Click "Load unpacked" → select `chrome-extension/`
4. Visit any GitHub profile — score appears next to their name

Also includes a Tampermonkey userscript at [`docs/autodev-github-score.user.js`](docs/autodev-github-score.user.js).

---

## Project Structure

```
autodev/
├── agent/              ← CLI agent (npm package)
├── platform/           ← Next.js website (Vercel)
├── chrome-extension/   ← Chrome extension
├── shared/             ← Shared TypeScript types
├── docs/               ← Documentation and userscript
└── README.md
```

## Stack

| Component | Tech |
|---|---|
| Website | Next.js 14 (Pages Router) + Tailwind CSS |
| Hosting | Vercel (free tier) |
| Agent | Node.js CLI (published on npm) |
| Extension | Chrome Extension (unpacked) |
| Images | Sharp (SVG→PNG for OG images) |
| Rate Limit | In-memory per-IP (no external store) |
| Analytics | @vercel/analytics |

## Development

```bash
# Website
cd platform
npm run dev     # http://localhost:3000

# Agent
cd agent
npm run dev     # hot-reload with ts-node-dev

# Build
cd platform
npm run build   # production build
```

## License

MIT

---

<div align="center">
  <a href="https://autodev-kappa.vercel.app">autodev-kappa.vercel.app</a> ·
  <a href="https://www.npmjs.com/package/autodev-agent">npm</a> ·
  <a href="https://github.com/Shashwat1319/autodev-agent">GitHub</a> ·
  <a href="https://buymeacoffee.com/shashwatsrivastava">Buy me a coffee</a>
</div>
