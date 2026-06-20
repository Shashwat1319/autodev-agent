# AutoDev — Usage Guide

## For You (The Developer / Owner)

### Step 1: Start the Cloud Platform
```bash
cd D:\GithubRepo\autodev\platform
npm run dev
```
- Opens at `http://localhost:3000`
- Landing page with GitHub profile analyzer
- Dashboard at `http://localhost:3000/dashboard`

### Step 2: Configure the Local Agent
Create `~/.autodev/config.json`:
```json
{
  "repos": [
    {
      "localPath": "C:/Users/YOU/Projects/my-app",
      "remoteUrl": "https://github.com/YOU/my-app.git",
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

### Step 3: Start the Agent
```bash
cd D:\GithubRepo\autodev\agent
npm run dev
```
- Agent starts watching your configured repos
- Any file change → auto-commits after 60s of inactivity → auto-pushes
- Logs appear in terminal

### Step 4: Analyze Any Profile
Go to `http://localhost:3000`
- Enter a GitHub username (anyone)
- See their repos, stars, languages, consistency score
- Get recommendations

---

## For End Users (How They Would Use It)

### Flow 1: "I want auto-git in the background"
```
1. Sign up at autodev.io with GitHub
2. Download the AutoDev desktop agent
3. Install & run — it sits in system tray
4. Configure which folders to watch
5. Done. Code normally. Agent auto-commits & pushes.
6. Dashboard shows live activity feed
```

### Flow 2: "I want a recruiter-ready profile"
```
1. Enter your GitHub username on autodev.io
2. AutoDev scans all your repos
3. Get a scored report: "Your profile scores 72/100"
4. Get personalized tips: "Add READMEs, contribute more"
5. Get a shareable link: autodev.io/u/yourname
6. Send this link to recruiters instead of raw GitHub
```

### Flow 3: "I want to check a candidate"
```
1. Recruiter enters candidate's GitHub username
2. AutoDev generates:
   - Total repos, stars, forks
   - Language breakdown
   - Contribution consistency score
   - Top repos with quality scores
   - Red flags & recommendations
3. Recruiter exports as PDF report
```

---

## Example Workflow (You Testing Both)

```bash
Terminal 1: cd platform && npm run dev
           → Platform running on :3000

Terminal 2: cd agent && npm run dev
           → Agent watching your repos

# Now edit a file in your project
echo "console.log('hello')" >> test.js
# Wait 60 seconds...
# Agent auto-commits: "auto: updated test.js"
# Agent auto-pushes to GitHub

# Open browser → http://localhost:3000
# Enter your GitHub username → see your scored profile
```

## Project Structure Reference
```
autodev/
├── agent/          ← Desktop agent (local machine)
├── platform/       ← Cloud dashboard (website)
├── shared/         ← Common types
├── IDEA_BANK.md    ← Saved future ideas
├── USAGE.md        ← This file
└── README.md       ← Project overview
```
