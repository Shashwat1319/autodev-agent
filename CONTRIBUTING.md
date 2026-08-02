# Contributing to AutoDev

## Development Setup

### Prerequisites
- Node.js 20+
- npm 10+
- Git

### Platform (Web App)
```bash
cd platform
npm install
npm run dev
```

### Agent (CLI)
```bash
cd agent
npm install
npx ts-node src/index.ts --help
```

### Chrome Extension
1. Open `chrome://extensions`
2. Enable Developer Mode
3. Load unpacked → select `chrome-extension/`

## Code Quality

- TypeScript strict mode is enabled in both packages
- Run `npm run build` in platform before committing
- Run `npx tsc --noEmit` in agent before committing
- Use existing patterns (same imports, same styling approach)

## Pull Request Process

1. Create a feature branch from `main`
2. Make your changes
3. Verify both packages build with 0 errors
4. Open a PR against `main` using the PR template
5. Ensure CI passes (lint + typecheck + build)

## Architecture Notes

- `platform/` — Next.js Pages Router app (no App Router)
- `agent/` — Node.js CLI with chokidar file watcher
- `chrome-extension/` — MV3 extension for GitHub profile badge injection
- `shared/types/` — TypeScript interfaces shared across packages
- Security headers are configured in `next.config.js`
- Rate limiting is in-memory (defense-in-depth; not production-scale enforcement)
