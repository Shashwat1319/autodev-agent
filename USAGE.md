# AutoDev — Usage Guide

## Platform (Website)

### Development
```bash
cd platform
npm run dev
# Opens at http://localhost:3000
```

### Build & Deploy
```bash
npm run build     # Production build
vercel --prod     # Deploy to Vercel
```

---

## Agent (CLI)

### Install & Run
```bash
npx autodev-agent
# No install needed — runs via npx
```

### Configure
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

### Dev Mode
```bash
cd agent
npm run dev
# Hot-reload with ts-node-dev
```

---

## Chrome Extension

### Load Unpacked
1. Open Chrome → `chrome://extensions`
2. Enable Developer mode (top right)
3. Click "Load unpacked" → select `chrome-extension/`
4. Visit any GitHub profile — see AutoDev score badge next to their name

---

## How End Users Use AutoDev

### Auto-Git Agent
```
npx autodev-agent → watches files → auto-commits (60s debounce) → auto-pushes
```

### Profile Analyzer
```
autodev-kappa.vercel.app → enter GitHub username → score/100 + languages + repos + consistency
```

### README Generator
```
autodev-kappa.vercel.app/readme-generator → pick style → preview → copy/download
```

**All free. No login. No signup. No database — live GitHub API.**

---

## Project Structure
```
autodev/
├── agent/              ← CLI agent (npm package)
├── platform/           ← Next.js website (Vercel)
├── chrome-extension/   ← Chrome extension
├── shared/             ← Shared types
├── README.md           ← Project overview
├── USAGE.md            ← This file
├── LAUNCH_KIT.md       ← Launch drafts (archived)
└── IDEA_BANK.md        ← Future product ideas
```
