# AutoDev Architecture

## System Overview

AutoDev is a monorepo with three deployable artifacts:

```
autodev/
├── platform/          → Next.js web app (Vercel)
├── agent/             → Node.js CLI (npm package)
├── chrome-extension/  → MV3 browser extension
└── shared/types/      → Common TypeScript interfaces
```

## Data Flow

```
User → Browser → Next.js (Vercel) → GitHub API → Analysis → Response
                 ↓
           CDN Cache (s-maxage headers)
```

## API Routes

| Route | Method | Cache | Description |
|-------|--------|-------|-------------|
| `/api/analyze` | GET | 300s | Profile analysis |
| `/api/badge` | GET | 3600s | SVG score badge |
| `/api/og` | GET | 3600s | OG image (PNG via sharp) |
| `/api/leaderboard` | GET | 600s | Ranked profiles |
| `/api/generate-readme` | GET/POST | 300s | README generation |
| `/api/health` | GET | no-store | Health check |

## Key Design Decisions

1. **No database** — All data fetched live from GitHub API. Simplifies deployment at the cost of latency.
2. **In-memory rate limiting** — Defense-in-depth only. Scale requires Vercel KV or Upstash.
3. **Static pages** — All pages are pre-rendered (ISR/SSG). API routes are serverless.
4. **No authentication** — All features are public. The pro report is a free feature.
5. **No custom fonts** — Uses system font stack for zero FOUT/FOIT.
6. **CSP via next.config.js** — Content Security Policy restricts scripts, styles, and connections.

## Security

Security headers are applied in `next.config.js` via the `headers()` function. The CSP allows:
- `'self'` for all resources
- `https://api.github.com` for API calls
- `https://avatars.githubusercontent.com` for avatars
- Known badge/stat image CDNs for README generator previews
- `'unsafe-inline'` for styles (Tailwind generates inline styles)
- `'unsafe-eval'` for Next.js dynamic imports
