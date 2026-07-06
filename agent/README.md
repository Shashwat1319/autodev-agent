# AutoDev Agent — Auto-Pilot Your Git

[![npm](https://img.shields.io/npm/v/autodev-agent)](https://www.npmjs.com/package/autodev-agent)
[![AutoDev Score](https://autodev-kappa.vercel.app/api/badge?username=Shashwat1319)](https://autodev-kappa.vercel.app/dashboard?user=Shashwat1319)

Run in your terminal, it watches your files, auto-commits with smart debouncing, and auto-pushes to GitHub. Zero config, no install needed.

```bash
npx autodev-agent
```

## Features

- **File Watcher** — detects every change in real-time
- **Smart Debounce** — waits for inactivity before committing (60s default)
- **Auto Commit** — descriptive commit messages, no manual staging
- **Auto Push** — pushes to GitHub automatically

## Configuration

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

### Options

| Field | Default | Description |
|---|---|---|
| `commitThreshold` | `60` | Seconds of inactivity before auto-commit |
| `maxChangesBeforeCommit` | `10` | Max file changes before forcing a commit |
| `commitMessagePattern` | `"auto: updated {files}"` | Commit message template |
| `autoCommit` | `true` | Enable/disable auto-committing |
| `autoPush` | `true` | Enable/disable auto-pushing |

## Cloud Platform

AutoDev also includes a free web platform:

| Tool | Link |
|---|---|
| **Profile Analyzer** | [autodev-kappa.vercel.app/dashboard](https://autodev-kappa.vercel.app/dashboard) |
| **README Generator** (3 styles) | [autodev-kappa.vercel.app/readme-generator](https://autodev-kappa.vercel.app/readme-generator) |
| **Leaderboard** | [autodev-kappa.vercel.app/leaderboard](https://autodev-kappa.vercel.app/leaderboard) |

**100% free. No login. No database.**

## How It Works

1. Agent watches your configured repo folders
2. When you save a file, a 60s timer starts
3. No more changes? Timer fires → auto-commit
4. Auto-pushes to GitHub
5. Cloud dashboard shows your live activity

## Links

- **Platform**: https://autodev-kappa.vercel.app
- **Source**: https://github.com/Shashwat1319/autodev-agent
- **Support**: [Buy me a coffee](https://buymeacoffee.com/shashwatsrivastava)

## License

MIT
