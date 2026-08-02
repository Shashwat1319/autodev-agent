# Security Policy

## Reporting a Vulnerability

Report vulnerabilities via GitHub Issues (not public disclosure) or email.

Please include:
- Description of the issue
- Steps to reproduce
- Potential impact
- Suggested fix (if known)

## Scope

The following are in scope:
- `platform/` — Next.js web application
- `agent/` — CLI tool (local file system access)
- `chrome-extension/` — Browser extension

## Known Security Controls

- Content Security Policy set via `next.config.js`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` restricts camera/mic/geolocation
- `X-XSS-Protection: 1; mode=block`
- Rate limiting per IP (in-memory; defense-in-depth)
- GitHub token read lazily (not at module scope)
- Input validation via `validateUsername()` regex on all API routes
- No authentication (all features are public)

## Known Limitations

- Rate limiter is per-serverless-instance (bypassable on cold start)
- No session management (not required — public read-only features)
- No database (all data fetched live from GitHub API)
