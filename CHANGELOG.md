# Changelog

## [1.0.0] — 2026-07-30

### Added
- GitHub profile analyzer with score/100, language breakdown, top repos, streak stats
- README generator with 3 styles (Professional / Minimal / Recruiter)
- Leaderboard with ranked profiles and search
- Dynamic SVG badge for GitHub READMEs
- Chrome extension for inline profile scores on GitHub
- CLI agent (`npx autodev-agent`) for auto-commits and pushes
- Shareable score cards (Twitter/X share)
- OG image generation for social previews
- Rate limiting (in-memory, per-IP)
- Sentry error monitoring (v8)
- 30 unit tests across 4 test files
- CSP with strict allowlist, security headers (HSTS, X-Frame-Options, etc.)
- Progressive loading states with step-by-step feedback
- Skip-to-content link and keyboard focus management
- Focus trap in ShareModal
- Screen-reader accessible stats regions
- Score tier legend and methodology section
- Dismissible CTA banner
- Lazy `cleanExpired()` rate-limit strategy (no `setInterval`)
- Token lazy getter with retry/backoff logic
- Health check endpoint (`/api/health`)
- CI workflow (lint + typecheck + build + test)
- Dependabot config (weekly npm + monthly actions)
- CODEOWNERS, PR template, CONTRIBUTING, SECURITY docs

### Changed
- Autoprefixer and PostCSS moved to devDependencies
- Version bumped to 1.0.0 across all packages
- "Repo Volume" renamed to "Code Volume" for accuracy
- All recommendations shown (removed `slice(0, 3)`)
- Hero subtitle clarified: "Enter any GitHub username to see their score"
- Rate-limit error messages now include reset time and token setup instructions
- README style caching (no re-fetch on style switch)
- Repo names now clickable (external links to GitHub)
- Extension badge shows loading spinner while fetching

### Fixed
- Conditional hooks in pro-report page (useMemo order)
- Unescaped entities in JSX
- `no-html-link-for-pages` ESLint errors
- `setInterval` replaced with lazy `cleanExpired()` (serverless anti-pattern)
- GSC sitemap — static file verified 200, awaiting GSC cache refresh

### Security
- CSP headers with strict allowlist
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Permissions-Policy` restricted
- `Strict-Transport-Security` with 2-year max-age
- `Referrer-Policy: strict-origin-when-cross-origin`
- `poweredByHeader: false`
- Token moved to lazy getter (no top-level env read)
- Fetch retry with exponential backoff + 10s timeout

### Known Limitations
- Rate limiting is in-memory only (defense-in-depth; requires Vercel KV or Upstash for persistence)
- OG image generation uses `sharp` (~500ms cold start); `@vercel/og` migration planned
- Leaderboard data is ephemeral (no database; resets on Vercel function cold start)
- No OAuth login (intentionally stateless)
