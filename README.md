# AutoDev — Your Code. Auto-Piloted.

[![npm](https://img.shields.io/npm/v/autodev-agent)](https://www.npmjs.com/package/autodev-agent)
[![Vercel](https://img.shields.io/badge/deployed-vercel-000)](https://autodev-kappa.vercel.app)

AutoDev is a dual-component platform that:
1. **Automates your git workflow** — watches local files, auto-commits, auto-pushes
2. **Analyzes your GitHub profile** — generates AI-powered portfolio reports

## Quick Start

### Use the Agent (one command)
```bash
npx autodev-agent
```
That's it. Install not required. The agent watches your code and auto-commits/pushes.

### Configure your repos
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
  "commitThreshold": 60
}
```

### Analyze any GitHub profile
Visit the live platform: **[https://autodev-kappa.vercel.app](https://autodev-kappa.vercel.app)**

Enter a GitHub username to get a scored report with recommendations.

## What AutoDev Does

| Feature | Description |
|---|---|
| 🔄 Auto-commit | Watches your files, commits after inactivity |
| 🚀 Auto-push | Pushes to GitHub automatically |
| 📊 Profile Analysis | Scores repos, languages, consistency |
| 📄 Portfolio Report | Generates recruiter-ready shareable link |
| 📱 Dashboard | Live activity feed and stats |

## Architecture

```
┌────────────────────────────────────────────────────────┐
│                    AutoDev                              │
├────────────────────────────────────────────────────────┤
│  ┌──────────────────┐    ┌─────────────────────────┐   │
│  │  LOCAL AGENT      │    │   CLOUD PLATFORM        │   │
│  │  (npx/npm)        │◄──►│   (Web Dashboard)       │   │
│  │                   │    │                         │   │
│  │  • File Watcher   │    │  • Profile Analyzer     │   │
│  │  • Git Engine     │    │  • AI Report Gen        │   │
│  │  • Sync Queue     │    │  • Live Dashboard       │   │
│  │  • Offline Mode   │    │  • Portfolio Hosting    │   │
│  └──────────────────┘    └─────────────────────────┘   │
└────────────────────────────────────────────────────────┘
```

## Links
- **npm package**: `npx autodev-agent`
- **Live platform**: https://autodev-kappa.vercel.app
- **GitHub**: https://github.com/Shashwat1319/autodev-agent

## License
MIT
