# AutoDev Agent

[![npm](https://img.shields.io/npm/v/autodev-agent)](https://www.npmjs.com/package/autodev-agent)

Auto-pilot your git workflow. Watch files, auto-commit, auto-push — zero effort.

## Usage

```bash
npx autodev-agent
```

No install required. Run it anywhere, anytime.

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

## How it works

1. Agent watches your configured repo folders
2. When you save a file, a 60s timer starts
3. No more changes? Timer fires → auto-commit
4. Auto-pushes to GitHub
5. Cloud dashboard shows your live activity

## Links
- **Live platform**: https://autodev-kappa.vercel.app
- **GitHub repo**: https://github.com/Shashwat1319/autodev-agent

## License
MIT
