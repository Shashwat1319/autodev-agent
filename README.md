# AutoDev — Your Code. Auto-Piloted.

AutoDev is a dual-component platform that:
1. **Automates your git workflow** — watches local files, auto-commits, auto-pushes
2. **Analyzes your GitHub profile** — generates AI-powered portfolio reports

## Quick Start

### 1. Cloud Platform
```bash
cd platform
npm install
cp .env.example .env  # Add your GitHub token
npm run dev            # Opens at http://localhost:3000
```

### 2. Local Agent
```bash
cd agent
npm install
cp .env.example .env
npm run dev            # Starts watching your repos
```

### 3. Configure the Agent
The agent reads config from `~/.autodev/config.json`:
```json
{
  "repos": [
    {
      "localPath": "C:/Users/you/projects/my-app",
      "remoteUrl": "https://github.com/you/my-app.git",
      "branch": "main",
      "enabled": true
    }
  ],
  "autoCommit": true,
  "autoPush": true,
  "commitThreshold": 60
}
```

## Architecture

```
┌────────────────────────────────────────────────────────┐
│                    AutoDev PLATFORM                     │
├────────────────────────────────────────────────────────┤
│  ┌──────────────────┐    ┌─────────────────────────┐   │
│  │  LOCAL AGENT      │    │   CLOUD SAAS PLATFORM   │   │
│  │  (Desktop App)    │◄──►│   (Web Dashboard)       │   │
│  │                   │    │                         │   │
│  │  • File Watcher   │    │  • Profile Analyzer     │   │
│  │  • Git Engine     │    │  • AI Report Gen        │   │
│  │  • Sync Queue     │    │  • Live Dashboard       │   │
│  │  • Offline Mode   │    │  • Portfolio Hosting    │   │
│  └──────────────────┘    └─────────────────────────┘   │
└────────────────────────────────────────────────────────┘
```

## License
MIT
