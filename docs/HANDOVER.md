# AutoDev — Complete Product Handover Document

**Version:** 1.0.0  
**Date:** July 30, 2026  
**Author:** Lead Architect (handover to new CTO)  
**Status:** Production-ready, post-launch

---

# 1. Executive Summary

## What is AutoDev?

AutoDev is a free, open-source (MIT) developer-tooling platform consisting of **three integrated deliverables**:

1. **Web Platform** (Next.js 14) — Analyzes any GitHub profile into a score out of 100, generates professional profile READMEs in three styles, maintains a leaderboard of ranked profiles, and serves dynamic SVG badges and social-preview (OG) images.
2. **CLI Agent** (`npx autodev-agent`, published on npm) — A file watcher that auto-commits and auto-pushes code changes to GitHub using smart debouncing. 609 weekly downloads at handover time.
3. **Chrome Extension** (MV3) — Injects a live score badge next to the profile name on any `github.com` profile page.

## Why was it created?

The creator (a solo developer in India) experienced three recurring pains:

1. Typing `git add` / `git commit` / `git push` dozens of times per day — repetitive, error-prone manual work.
2. A blank GitHub profile README — profiles looked empty to recruiters despite real work behind them.
3. No single free tool that combined **analysis** (what does my profile look like?) with **automation** (make it better) with **presentation** (make it beautiful).

## What problem does it solve?

- **For developers:** A blank-page-to-polished-profile pipeline in minutes. Understand your GitHub presence objectively, get a README that presents it well, and stop wasting time on git ceremony.
- **For recruiters/hiring managers:** An objective, consistent, comparable score for any public GitHub profile — useful for candidate screening.
- **For the open-source ecosystem:** A free MIT-licensed reference implementation of a serverless, database-free SaaS — no login, no tracking, no infrastructure cost.

## Who is it for?

| Audience | Use case |
|----------|----------|
| Developers (primary) | Analyze own profile, generate README, auto-commit code |
| Students/job-seekers | Improve profile before applying; export recruiter-ready README |
| Recruiters | Screen candidates via objective score |
| Companies/teams | Track team profile quality (future GitHub Action) |
| Open-source contributors | Contribute to the platform itself |

## What is the biggest value?

**Zero-infrastructure SaaS.** The entire platform runs on Vercel's free tier with no database, no OAuth, no background jobs, no persistent state. All data flows live from the GitHub API with CDN caching. This means $0/month operating cost, zero maintenance surface, and zero user-data liability — while still delivering 6 API endpoints, 9 static pages, 30 passing tests, Sentry monitoring, and production-grade security headers.

---

# 2. Vision

## Long-term vision

AutoDev becomes the **default layer between developers and their public technical identity** — not just GitHub profiles, but GitLab, Bitbucket, personal websites, and LinkedIn. A "developer identity OS" that analyzes, visualizes, and automates how the world sees your code.

## End goal

1. **100,000+ profiles analyzed** — the leaderboard becomes the de-facto "GitHub profile ranking" people check.
2. **10,000+ badge installs** — the SVG badge becomes a standard element of GitHub profile READMEs (like shields.io badges).
3. **100+ contributors** — a healthy open-source community with governance.
4. **Sustainable revenue** — Pro Reports, Team plans, and API access fund the infrastructure and development.

## Why this product matters

GitHub profiles are the de-facto technical resume, yet there is no objective, standardized way to evaluate or present them. AutoDev creates the standard. Every developer who cares about their career has a GitHub profile; every profile can be analyzed, improved, and showcased — that is a nearly universal market with a free entry point.

---

# 3. Product Overview

## 3.1 Profile Analyzer (`/dashboard`, `/api/analyze`)

- **Purpose:** Compute an objective score (0–100) for any public GitHub profile with language breakdown, top repos, and personalized recommendations.
- **Inputs:** `username` query parameter (validated against regex `/^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/`).
- **Outputs:** `ProfileAnalysis` JSON (see `shared/types/index.ts:18`):
  - `username`, `avatar`, `bio`, `location`
  - `totalRepos`, `totalStars`, `totalForks`, `totalContributions` (repo volume in KB/100)
  - `languages[]` (name + percentage), `topRepos[]` (name, description, stars, forks, language, score, strengths, weaknesses)
  - `consistencyScore`, `overallScore`
  - `recommendations[]` (actionable strings)
- **Internal workflow:**
  1. Rate limit check (30 req/min/IP).
  2. Username validation (regex, max 39 chars, no leading hyphen).
  3. Parallel fetch: user profile + repos (`?per_page=100&sort=updated`) + public events (`?per_page=100`) via `Promise.all`.
  4. `calculateScore()` — pure function scoring.
  5. Recommendation engine — rule-based checks (bio, blog link, original repos, descriptions, stars, activity).
  6. Respond with `Cache-Control: s-maxage=300, stale-while-revalidate`.
- **Dependencies:** GitHub REST API (3 endpoints), `github-client.ts` (retry/backoff/timeout), `analyze-profile.ts`, `api-utils.ts`.
- **Errors:** 400 invalid username · 404 user not found · 429 rate limited (with retry seconds) · 500 with Sentry capture.

## 3.2 README Generator (`/readme-generator`, `/api/generate-readme`)

- **Purpose:** Generate a complete GitHub profile README in one of three styles from live GitHub data.
- **Inputs:** `username` + `style` (`professional` | `minimal` | `recruiter`); GET returns JSON, POST returns downloadable `.md` file.
- **Outputs:** Ready-to-paste Markdown. **Professional:** capsule-render header wave, typing SVG, About Me blockquote, tech-stack badges, activity graph, streak stats, pinned repo cards, social badges. **Minimal:** clean header, stats bar, language badges, compact top-languages card, score badge. **Recruiter:** header wave, professional summary, stats table, language badges, activity graph, top-projects table, pinned cards, Buy-Me-a-Coffee badge.
- **Internal workflow:** fetch user + repos + 30 events → compute languages/top repos/pinned/recent activity (event-type to human-readable mapping) → template interpolation → return.
- **External dependencies (templates reference):** shields.io badges, github-readme-stats.vercel.app, github-readme-activity-graph.vercel.app, github-readme-streak-stats.herokuapp.com, readme-typing-svg.herokuapp.com, capsule-render.vercel.app, komarev.com (profile views).
- **Customization:** Style switching is client-cached (no re-fetch). No user-defined templates yet (roadmap).

## 3.3 Leaderboard (`/leaderboard`, `/api/leaderboard`)

- **Purpose:** Rank profiles by score with optional search.
- **Inputs:** `q` — comma-separated usernames to add to the 13 featured profiles (max 10 added).
- **Outputs:** `{ leaderboard: [{rank, username, avatar, score, repos, stars, forks, languages[3]}], total }` sorted descending by score.
- **Internal workflow:** rate limit (20/min/IP) → validate each added username → batch analysis (10 at a time with token, 5 at a time with 300ms pacing without token) → sort → respond. `Cache-Control: s-maxage=600`.
- **Dependencies:** GitHub API + `analyzeProfile` (each entry = 3 GitHub calls).
- **Known limitation:** Data is ephemeral — recomputed per request; rate limits cap batch size.

## 3.4 Dynamic Badge (`/api/badge`)

- **Purpose:** Auto-updating SVG badge for GitHub READMEs (shields.io-style).
- **Inputs:** `username`.
- **Outputs:** SVG of shape `[AutoDev {Label}] [{score}/100]` with color by tier: green ≥70, orange 40–69, red <40.
- **Internal workflow:** rate limit (60/min/IP) → validate → `analyzeProfile` → `badgeSVG()` — computed label width + value width for proportional rendering, dual text pass (shadow + white text) like shields.io → respond `image/svg+xml` with `s-maxage=3600`.
- **Graceful degradation:** Never returns non-200 — rate-limited/invalid/not-found/error all render a red "error badge" instead of a broken image.
- **Dependencies:** `format.ts` (tier colors/labels), `analyze-profile.ts`.

## 3.5 OG Image Generator (`/api/og`)

- **Purpose:** Dynamic 1200×630 social preview (Open Graph / Twitter card) per profile.
- **Inputs:** optional `username`; without it, a generic AutoDev card.
- **Outputs:** PNG (via `sharp`), or SVG fallback.
- **Internal workflow:** rate limit (30/min/IP) → optional analysis → build SVG template (gradient background, avatar clipped to circle or initial, name, score with color-coded progress bar, repos/stars/forks stats, branding footer) → `sharp` SVG→PNG conversion → respond with `s-maxage=3600`.
- **Triple fallback chain:** sharp PNG → simplified sharp PNG → raw error SVG. All fail states still return 200 images.
- **XSS protection:** username is HTML-escaped before SVG interpolation (`og.ts:24`).

## 3.6 Health Endpoint (`/api/health`)

- **Purpose:** Uptime monitoring + environment verification.
- **Inputs:** optional `?detail=1` (adds live GitHub rate-limit check).
- **Outputs:** `{ status, version, timestamp, checks: { github_token, base_url, github_rate_remaining? } }`, `Cache-Control: no-store`.
- **Internal workflow:** check env presence → optionally probe `api.github.com/rate_limit` → respond 200.
- **Note:** `version` field is hardcoded `"0.2.0"` — **should be synced to 1.0.0** (minor technical debt).

## 3.7 CLI Agent (`npx autodev-agent`)

- **Purpose:** Watch local repos and auto-commit/push on changes.
- **Inputs:** `~/.autodev/config.json`; new `--score <username>` flag fetches and prints a live score box.
- **Outputs:** Console logs; git commits/pushes; score table for `--score`.
- **Internal workflow:** See Section 10.
- **Dependencies:** chokidar, simple-git, dotenv, Node ≥18 (fetch global).

## 3.8 Chrome Extension

- **Purpose:** Show AutoDev score on GitHub profile pages.
- **Inputs:** None — content script auto-runs on `https://github.com/*`.
- **Outputs:** Score badge injected next to profile name; popup page.
- **Internal workflow:** See Section 11.

## 3.9 Share Modal (Platform feature)

- **Purpose:** Post-analysis share CTA — LinkedIn / X share links + copy message. Auto-opens once (600ms delay) after first analysis, dismissed permanently via `localStorage` (`autodev_dismissed_share`). Fully accessible with focus trap.

---

# 4. Complete Architecture

## 4.1 System Overview

```
                        ┌──────────────────────────────────────────┐
                        │                AutoDev                   │
                        │                                          │
  ┌───────────┐         │  ┌────────────────────────────────────┐  │
  │  Browser  │─────────┼─▶│  Next.js 14 (Pages Router)          │  │
  │  (Web app)│         │  │  ├─ 9 static pages                  │  │
  └───────────┘         │  │  └─ 6 API routes (serverless)       │  │
                        │  └────────────────────────────────────┘  │
  ┌───────────┐         │             │            │               │
  │  Terminal │─────────┼─▶  CLI Agent│            │               │
  │  npx      │         │  chokidar →│            ▼               │
  └───────────┘         │  simple-git│     ┌─────────────┐         │
                        │            │     │  GitHub API  │         │
  ┌───────────┐         │            │     │  (REST v3)   │         │
  │  Chrome   │─────────┼─▶ Extension │     └─────────────┘         │
  │  browser  │         │  content.js │            ▲                │
  └───────────┘         │             │            │                │
                        │             └────────────┘                │
                        │          s-maxage CDN caching             │
                        └──────────────────────────────────────────┘
                              Vercel (free tier) · No database
```

## 4.2 Frontend (Platform)

- **Framework:** Next.js 14.2 (Pages Router — `src/pages/`), React 18.3.
- **Styling:** Tailwind CSS 3.4 with custom "glass" utility classes; global dark theme (`#0a0f1e`).
- **Pages:** `/` (landing), `/dashboard`, `/leaderboard`, `/readme-generator`, `/pro-report/[username]`, `/analyzer`, `/badge`, `/github-profile-tips`, `/404`.
- **Shared components:** `Layout` (nav, mobile menu, skip-to-content), `ShareModal` (focus trap), `ErrorBoundary`, `PHBanner` (Product Hunt banner).
- **State:** Local React state + `localStorage` (username persistence, share dismissal). No global state library.
- **Meta/SEO:** Per-page `next/head` with canonical URLs, OG tags, Twitter cards, JSON-LD (SoftwareApplication, Person, HowTo, Article schemas).

## 4.3 Backend (Platform API routes)

Six serverless functions under `src/pages/api/`:

| Route | Method | Rate limit | Cache | Purpose |
|-------|--------|-----------|-------|---------|
| `/api/analyze` | GET | 30/min/IP | s-maxage=300 | Profile analysis |
| `/api/badge` | GET | 60/min/IP | s-maxage=3600 | SVG score badge |
| `/api/og` | GET | 30/min/IP | s-maxage=3600 | OG image PNG |
| `/api/generate-readme` | GET/POST | 20/min/IP | s-maxage=300 | README generation |
| `/api/leaderboard` | GET | 20/min/IP | s-maxage=600 | Ranked profiles |
| `/api/health` | GET | none | no-store | Health check |

Shared backend libraries: `lib/api-utils.ts` (rate limiting, validation), `lib/analyze-profile.ts` (scoring + analysis), `lib/format.ts` (colors/labels), `shared/github-client.ts` (GitHub fetch with retry).

## 4.4 CLI Agent

Node.js CLI (CommonJS, TS source compiled to `dist/agent/src/index.js`). Entry: `src/index.ts` → banner → optional `--score` → `loadConfig()` → `FileWatcher` (chokidar) → SIGINT/SIGTERM graceful shutdown. Published to npm as `autodev-agent`.

## 4.5 Chrome Extension

MV3 manifest, content script (`content.js`) + CSS + popup. Zero `permissions` (no storage, no tabs); only `host_permissions` for the AutoDev API origin. Fetches score from `/api/analyze` and injects a badge element into the GitHub profile header.

## 4.6 Shared packages

`shared/types/index.ts` — TypeScript interfaces (`AutoDevConfig`, `WatchedRepo`, `ProfileAnalysis`, `RepoAnalysis`) consumed by both platform and agent. Single source of truth for API contracts.

## 4.7 Build system

- **Platform:** Next.js build (`next build`) — lint + typecheck + 9 static pages + 6 serverless functions.
- **Agent:** `tsc` (rootDir `..`, outputs `dist/agent/src/index.js`).
- **CI:** GitHub Actions (`ci.yml`) — two jobs: `lint-and-typecheck` (platform: lint, tsc, vitest) and `build` (platform build + artifact upload), plus `agent-build` (tsc).
- **GitHub Action product:** standalone `github-action/` — esbuild-bundled action (Node 20 runtime) that fails CI when a profile score drops below a threshold.

## 4.8 Deployment / Hosting / Infrastructure

- **Platform:** Vercel (free tier). Deploys on push to `main`. Edge CDN caching via `s-maxage` + `stale-while-revalidate` headers.
- **Agent:** npm registry (`autodev-agent`). `prepublishOnly` runs build.
- **Extension:** Unpacked load only — **not yet published to Chrome Web Store**.
- **Infrastructure:** Zero persistent state. No database, no queues, no cron, no blob storage. In-memory rate-limit maps per serverless instance.
- **Monitoring:** Sentry v8 (client/server/edge via `instrumentation.ts`).

---

# 5. Folder Structure

```
autodev/
├── .github/
│   ├── CODEOWNERS              → All paths owned by Shashwat1319
│   ├── PULL_REQUEST_TEMPLATE.md → PR checklist (type, testing, checklist)
│   ├── dependabot.yml          → Weekly npm updates (platform+agent), monthly actions
│   ├── ISSUE_TEMPLATE/         → bug_report.md, feature_request.md, config.yml
│   └── workflows/ci.yml        → lint+typecheck+test, build, agent-build
│
├── agent/                      → CLI tool (npm package `autodev-agent`)
│   ├── src/
│   │   ├── index.ts            → Entry: banner, --score flag, watcher bootstrap, shutdown
│   │   ├── config.ts           → Loads ~/.autodev/config.json with defaults
│   │   └── core/watcher.ts     → chokidar watcher, debounce, commit/push logic
│   ├── scripts/postinstall.js  → npm install message (promotes the platform URL)
│   ├── package.json            → bin: autodev-agent, scripts: build/prepublish/postinstall
│   └── tsconfig.json           → ES2022, CommonJS, rootDir ".." (shares ../shared)
│
├── platform/                   → Next.js web app (Vercel)
│   ├── src/
│   │   ├── pages/
│   │   │   ├── index.tsx            → Landing: hero, analyzer input, features, methodology, CTA
│   │   │   ├── dashboard.tsx        → Analyzer UI: search, results, badge copy, share, CTA banner
│   │   │   ├── leaderboard.tsx      → Ranked profiles with search
│   │   │   ├── readme-generator.tsx → 3-style generator with preview/copy/download
│   │   │   ├── pro-report/[username].tsx → Detailed profile report (recruiter view)
│   │   │   ├── analyzer.tsx         → SEO landing for "github profile analyzer" (new)
│   │   │   ├── badge.tsx            → SEO landing for score badge usage (new)
│   │   │   ├── github-profile-tips.tsx → SEO article (10 tips) (new)
│   │   │   ├── 404.tsx              → Custom 404
│   │   │   ├── _app.tsx             → ErrorBoundary + Vercel Analytics
│   │   │   ├── _document.tsx        → Preconnect, JSON-LD SoftwareApplication schema
│   │   │   ├── _error.tsx           → Sentry error boundary
│   │   │   └── api/                 → 6 serverless routes (analyze, badge, og,
│   │   │                              generate-readme, leaderboard, health)
│   │   ├── lib/
│   │   │   ├── api-utils.ts         → rateLimit() (lazy cleanExpired), validateUsername()
│   │   │   ├── analyze-profile.ts   → calculateScore(), analyzeProfile() pipeline
│   │   │   ├── format.ts            → LANG_COLORS, score tiers (hex/label/shields)
│   │   │   └── config.ts            → BASE_URL (env-driven)
│   │   ├── shared/github-client.ts  → getToken (lazy), retry+backoff+timeout, rate-limit errors
│   │   ├── components/
│   │   │   ├── Layout.tsx           → Fixed header, nav, mobile menu, skip-to-content
│   │   │   ├── ShareModal.tsx       → Focus-trap share dialog
│   │   │   ├── ErrorBoundary.tsx    → Client error boundary
│   │   │   └── PHBanner.tsx         → Product Hunt banner
│   │   ├── instrumentation.ts       → Sentry runtime registration
│   │   └── styles/globals.css       → Tailwind + glass utilities
│   ├── public/
│   │   ├── robots.txt               → Allows all, disallows /api/, points to sitemap
│   │   ├── sitemap.xml              → 9 URLs with lastmod/changefreq/priority
│   │   └── favicon.svg              → Cyan-blue gradient "A"
│   ├── sentry.{client,server,edge}.config.ts → Sentry v8 configs
│   ├── next.config.js               → CSP + security headers, images remotePatterns
│   ├── vitest.config.ts             → V8 coverage, jsdom
│   ├── tsconfig.json / tailwind.config.js / postcss.config.js / .eslintrc.json
│   └── package.json                 → 1.0.0, typecheck script, test scripts
│
├── chrome-extension/            → MV3 extension (unpublished)
│   ├── manifest.json            → content_scripts on github.com/*, host_permissions for API
│   ├── content.js               → Score fetch + badge injection (with loading spinner)
│   ├── styles.css               → Injected badge styles
│   ├── popup.html / popup.js    → Extension popup
│   └── icon-{16,48,128}.png     → Icons
│
├── github-action/               → Marketplace action (new)
│   ├── action.yml               → inputs: username, min-score, api-base; node20 runtime
│   ├── index.js                 → Score fetch + setFailed below threshold
│   ├── dist/index.js            → esbuild bundle
│   └── README.md                → Usage docs
│
├── shared/types/index.ts        → Shared TS contracts
├── docs/
│   ├── architecture/README.md   → Architecture overview (routes, caching table)
│   ├── adr/                     → ADR-001 in-memory rate limiting, ADR-002 no database
│   ├── autodev-github-score.user.js → Tampermonkey userscript (same as extension logic)
│   └── internal/                → LAUNCH_KIT, PROJECT_BRAIN, STRATEGY, drafts (archived thinking)
├── README.md                    → Full documentation (hero, badges, mermaid diagram, roadmap)
├── CHANGELOG.md                 → v1.0.0 changelog
├── LICENSE                      → MIT
├── CONTRIBUTING.md              → Setup, quality gates, PR process
├── CODE_OF_CONDUCT.md           → Contributor Covenant 2.1
├── SECURITY.md                  → Reporting, controls, known limitations
├── .env.example                 → GITHUB_TOKEN, RAZORPAY_KEY_ID/SECRET documentation
├── .gitignore                   → node_modules, dist, .next, .env*, coverage
└── package.json                 → Monorepo convenience scripts (install/dev/build per package)
```

---

# 6. Tech Stack

| Layer | Choice | Why | Alternatives rejected |
|-------|--------|-----|----------------------|
| Web framework | Next.js 14 (Pages Router) | Mature, Vercel-native, SSR+SSG, built-in API routes, zero-config deploys | App Router (stable later, Pages was safer at start); Remix (smaller ecosystem); plain Express+React (more assembly) |
| Language | TypeScript strict | Contracts via `shared/types`, compile-time safety across 3 packages | JavaScript (no safety), Babel (no types) |
| Styling | Tailwind CSS 3 | Utility-first, fast iteration, consistent dark glass theme | CSS Modules (slower), styled-components (runtime cost), Bootstrap (looks generic) |
| Image processing | sharp | High-quality SVG→PNG for OG images, Vercel-friendly | `@vercel/og` (Satori — planned migration, sharper + faster), Canvas (heavy on serverless) |
| Monitoring | Sentry v8 | Free tier, serverless-aware, client+server+edge coverage | LogRocket (paid), custom logging (no alerting) |
| Testing | Vitest + Testing Library | Fast, Vite-native, TS out of the box | Jest (slower config), Cypress (overkill for unit) |
| CI | GitHub Actions | Free, co-located with repo, marketplace reach | CircleCI (paid limits), Jenkins (self-host) |
| Agent deps | chokidar + simple-git | Battle-tested watcher + pure-JS git | fs.watch (unreliable cross-platform), isomorphic-git (immature), shelling out to git CLI |
| Analytics | @vercel/analytics | Zero-config, privacy-friendly, custom events via `track()` | GA4 (heavy, consent issues), Plausible (paid) |
| Rate limiting | In-memory Map + lazy cleanup | Zero infra, no vendor lock, documented trade-off (ADR-001) | Vercel KV/Upstash (paid, deferred until traffic requires) |
| Storage | None (live GitHub API) | Zero maintenance, zero cost, always-fresh data (ADR-002) | Supabase/Neon (unnecessary now), MongoDB (operational burden) |
| Hosting | Vercel free tier | Free, edge CDN, serverless API, previews per PR | Netlify (weaker API story), Railway (paid), self-host (ops burden) |

---

# 7. GitHub API Usage

## 7.1 Endpoints

| Endpoint | Used by | Params | Purpose |
|----------|---------|--------|---------|
| `GET /users/{username}` | analyze, badge, og, generate-readme | — | Profile: bio, name, location, blog, company, public_repos, avatar |
| `GET /users/{username}/repos` | analyze, badge, og, generate-readme | `per_page=100&sort=updated` | Repo list: language, stars, forks, description, topics, size, fork flag |
| `GET /users/{username}/events/public` | analyze (100), generate-readme (30) | `per_page=N` | Activity: event types (Push, Create, Issue, PR, Fork, Watch) for consistency score + "recent activity" section |

## 7.2 Rate limiting

- **Unauthenticated:** 60 req/hr/IP (core API).
- **Authenticated (`GITHUB_TOKEN` env):** 5,000 req/hr.
- **Platform behavior:** one analysis = 3 requests (user + repos + events). At 60/hr that is **20 analyses per hour unauthenticated** — shared across all users, which is why a token is essential at scale.
- **Client-visible:** errors carry reset time + token setup instructions (`github-client.ts:41-54`).
- **Server-side protection:** per-IP in-memory limits (20–60 req/min depending on route) prevent one user exhausting the shared GitHub quota.

## 7.3 Authentication

- Only server-to-server: `Authorization: Bearer ${GITHUB_TOKEN}` added when env var present (`getToken()` — lazy getter, never at module scope).
- No OAuth, no user tokens. All analysis is of public data.
- Health endpoint reports token presence.

## 7.4 Retry logic (`fetchWithRetry`, `github-client.ts:12-31`)

- 2 retries (3 attempts total).
- Retry on **429 only** at the HTTP level (backoff: 1s, 2s) and on **network errors** (AbortController 10s timeout per attempt).
- Final failure returns `null` (graceful) for non-ok statuses; throws only for rate-limit (403/429) so users see actionable errors.

## 7.5 Error handling

| GitHub status | Client behavior | User sees |
|---------------|-----------------|-----------|
| 200 | Parse JSON | Data |
| 403 (rate limit) | Throw with reset time | "Rate limit reached. Resets at HH:MM:SS. Set a GITHUB_TOKEN..." |
| 429 (rate limit) | Throw with token hint | "GitHub API rate limit exceeded (60 req/hr). Set a GITHUB_TOKEN for 5000 req/hr." |
| 404 | `null` | "User not found" (analyze) / red error badge (badge) / generic OG (og) |
| 5xx | `null` after retries | "User not found" or error badge |
| Timeout | AbortController after 10s | Error message |

All thrown errors are captured by Sentry in every API route's catch block.

---

# 8. Scoring Algorithm

## 8.1 Formula (`analyze-profile.ts:4-20`)

```
consistencyScore = min(100, round(
    (repoCount > 0 ? 30 : 0)        # Repository presence        — up to 30
  + (totalStars > 0 ? 20 : 0)       # Impact                     — up to 20
  + (eventCount > 10 ? 25 : eventCount > 0 ? 10 : 0)  # Activity — up to 25
  + (publicRepos > 5 ? 15 : 5)      # Visibility                — up to 15
  + (hasBio ? 10 : 0)               # Polish                    — up to 10
))

overallScore = round((consistencyScore + min(100, totalStars * 2)) / 2)
```

## 8.2 Why it works

- **Deterministic & pure:** no I/O, no randomness, fully unit-testable — same profile always scores the same.
- **Balanced:** activity (25) + repos (30) dominate, but stars double-count into the overall score, so popular repos matter without overwhelming consistency.
- **Actionable tiers:** the score decomposes into exactly the behaviors a developer can change (add bio, be active, create repos) — every missing point maps to a recommendation.
- **Monotone:** every positive input strictly increases or holds the score; nothing penalizes a fresh profile harder than the floor (3/100 minimum).

## 8.3 Edge cases

| Case | Behavior |
|------|----------|
| Empty profile (0 repos, 0 stars, 0 events, no bio) | consistency 5 + star component 0 → overall 3 (round(5/2)) |
| 100+ repos, 1000+ stars | Capped at 100 by `Math.min` |
| Exactly 10 events vs 11 events | 10 points vs 25 points — deliberate cliff to reward sustained activity |
| 1 repo with 50 stars | consistency: 30+20+0(no events)+5+0 = 55; overall = round((55+100)/2) = 78 |
| fork-heavy profile | repos with `fork=true` excluded from topRepos; repoCount includes them (limitation — document later) |
| Negative/NaN inputs | Not possible — all inputs derived from validated API data with `|| 0` guards |

## 8.4 Examples

| Profile shape | consistency | overall |
|---------------|-------------|---------|
| torvalds-like (huge stars, active) | 100 | 100 |
| 5 repos, 10 stars, 12 events, bio | 30+20+25+15+10 = 100 | round((100+20)/2) = 60 |
| 1 repo, 1 star, 1 event, no bio | 30+20+10+5+0 = 65 | round((65+2)/2) = 34 |
| Fresh account, bio only | 0+0+0+5+10 = 15 | round((15+0)/2) = 8 |

---

# 9. README Generator

## 9.1 Templates

| Style | Audience | Sections |
|-------|----------|----------|
| `professional` | Portfolio showcase | Wave header, typing SVG, About Me, tech-stack badges, top-langs card, activity graph, streak stats, highlighted repos, recent activity, score badge, social badges, view counter, quote + attribution |
| `minimal` | Clean/personal | Name header, bio, stats bar (repos/stars/forks/score shields), language badges, compact top-langs, score badge, view counter |
| `recruiter` | Job seekers | Wave header, professional summary, stats table (repos/stars/forks/score), language badges, activity graph, top-projects table, pinned cards, Buy-Me-a-Coffee, attribution |

## 9.2 Rendering pipeline

1. Fetch user + repos + 30 events.
2. Compute: `languages` (top 8 by repo count), `topRepos` (top 5 non-fork by stars), `pinned` (top 3), `recentActivity` (top 5 events mapped to human strings), `overallScore`.
3. `generateReadme(data, style)` — pure string interpolation into one of three template strings; falls back to `professional` for unknown styles.
4. GET → JSON `{ username, readme, style }`; POST → `text/markdown` attachment `README-{username}.md`.

## 9.3 External services used in generated Markdown

shields.io (badges), github-readme-stats.vercel.app (stats + top-langs), github-readme-activity-graph.vercel.app, github-readme-streak-stats.herokuapp.com, readme-typing-svg.herokuapp.com, capsule-render.vercel.app, komarev.com (ghpvc), buymeacoffee.com badge.

**Risk note:** these are third-party uptime dependencies — if any dies, generated READMEs degrade visually. Fallback plan: self-host equivalents or static SVG fallbacks.

## 9.4 Customization

- Style selection with client-side caching (switching styles never re-fetches).
- No custom templates yet — community template gallery is on the roadmap (Q4 2026).

---

# 10. CLI Agent

## 10.1 File watcher (`watcher.ts`)

- chokidar watches all enabled repo paths (`ignoreInitial: true` — existing files don't trigger commits).
- Ignored: `node_modules`, `.git`, `dist`, `build`, `.next` (from config) + `**/.git/**` always.
- `awaitWriteFinish: { stabilityThreshold: 500, pollInterval: 100 }` — waits 500ms of file stability to avoid partial-write commits (IDE saves, formatters).

## 10.2 Debounce

- Each change logs `[event] relPath` and adds to `pendingChanges` Set.
- Two triggers, whichever hits first:
  1. **Timer:** `commitThreshold` seconds (default 60) of inactivity.
  2. **Count:** `maxChangesBeforeCommit` (default 10) accumulated changes.
- Single shared timer per watcher (cleared/recreated per change).

## 10.3 Auto commit

- `flush()` → for each repo, filter changes starting with `repo.localPath` → `git add .` → `git commit(message)`.
- Commit message from `commitMessagePattern` (default `auto: updated {files}`), `{files}` replaced with first 3 relative paths (+N more suffix).
- `git.status()` guards empty repos — "No changes to commit" errors are caught and logged, not fatal.

## 10.4 Auto push

- `git.push('origin', currentBranch)` after each successful commit when `autoPush: true`.

## 10.5 Multi-repo support

- Config supports N repos; each is watched (chokidar) and flushed independently (changes routed by `startsWith(repo.localPath)`). One repo's failure doesn't block others (per-repo try/catch).

## 10.6 Configuration (`config.ts`, `~/.autodev/config.json`)

```json
{
  "repos": [{ "localPath": "...", "remoteUrl": "...", "branch": "main", "enabled": true }],
  "autoCommit": true,
  "autoPush": true,
  "commitThreshold": 60,
  "commitMessagePattern": "auto: updated {files}",
  "maxChangesBeforeCommit": 10,
  "ignoredPaths": ["node_modules", ".git", "dist", "build", ".next"]
}
```

Defaults are applied for missing keys; `dotenv` loads `.env` for `GITHUB_TOKEN` (not currently used by the agent — future-proofing for score features).

## 10.7 CLI flags

- `--score <username>` — prints a live score box (added v1.0.1): banner → fetch `/api/analyze` → formatted table → exit.

---

# 11. Chrome Extension

## 11.1 Injection

- MV3 content script declared in `manifest.json`:
  - `matches: ["https://github.com/*"]`
  - `js: content.js`, `css: styles.css`
- Runs on every GitHub page load; targets the profile header element (V1-vCard selector logic).

## 11.2 Content script behavior

1. Locate profile header on `github.com/<username>`.
2. Insert loading indicator (pulsing "A" badge, keyframe injected once, guarded by DOM id).
3. Fetch `https://autodev-kappa.vercel.app/api/analyze?username=...`.
4. Inject result badge (score + label) next to the profile name; remove spinner.
5. Respects `autodev-badge-style` guard for idempotency (no duplicate injection on re-renders).

## 11.3 GitHub integration

- Read-only. No DOM mutation beyond the badge element. No interaction with GitHub's own data.
- Same logic shipped as a Tampermonkey userscript (`docs/autodev-github-score.user.js`) for users who prefer userscripts.

## 11.4 Permissions

- `permissions: []` — no storage, no tabs, no webRequest.
- `host_permissions: ["https://autodev-kappa.vercel.app/*"]` — only needed to call the AutoDev API cross-origin.
- This minimal-permission design is a selling point for the Chrome Web Store listing (pending — $5 registration fee).

---

# 12. Security

## 12.1 CSP (`next.config.js`)

`default-src 'self'`; `script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live https://va.vercel-scripts.com` (required by Vercel analytics/insights); `style-src 'self' 'unsafe-inline'`; `img-src` allowlist (avatars.githubusercontent.com, shields.io, GitHub readme stats services); `connect-src 'self' https://api.github.com`; `frame-src 'self' https://vercel.live`; `manifest-src/base-uri/form-action 'self'`.

## 12.2 Headers (applied to all routes)

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- `poweredByHeader: false`
- API routes additionally get `Cache-Control: no-store` (security-critical data shouldn't be cached in shared caches).

## 12.3 Rate limiting

- In-memory per-IP sliding-window (`api-utils.ts`): `rateLimit({key, maxRequests, windowMs})`.
- Per-route limits: analyze 30/min, badge 60/min, og 30/min, generate-readme 20/min, leaderboard 20/min.
- **Anti-pattern resolved:** original `setInterval` cleanup replaced with lazy `cleanExpired()` called on each request — no persistent timers in serverless, no memory leaks. Documented in ADR-001.
- **Known limitation:** per-instance only; Vercel can run multiple instances → limit is not global. Mitigation: CDN caching reduces origin hits; upgrade to Vercel KV at scale.

## 12.4 Input validation

- `validateUsername()`: regex `^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$` — blocks injection (no spaces, `<`, `>`, `/`, `.`), enforces 1–39 chars, trims whitespace, rejects non-strings. Applied on every API route.
- **XSS defense in depth:** OG image SVG interpolates username through HTML-escapes (`og.ts:24`).

## 12.5 Secrets

- Only `GITHUB_TOKEN` env var. Lazy getter (`getToken()`), never read at module scope (avoids leaking into client bundles or logs).
- `.env*` in `.gitignore`; `.env.example` documents usage; no secrets ever committed (verified by scan).

## 12.6 OAuth — intentionally absent

- No user accounts, no sessions, no personal data storage. All features analyze public data only. This eliminates: token storage risk, session fixation/CSRF surface, GDPR/PII scope, and rate-limit abuse via token sharing. If OAuth arrives (roadmap), it must be optional and scoped to public data first.

---

# 13. Monitoring

## 13.1 Error tracking — Sentry v8

- **Configs:** `sentry.client.config.ts` (10% traces sampling, error-only replay), `sentry.server.config.ts`, `sentry.edge.config.ts`.
- **Registration:** `instrumentation.ts` — imports server config in Node runtime, edge config otherwise.
- **Coverage:** `_error.tsx` (page errors) + `Sentry.captureException` in every API route catch block (analyze, badge, og, generate-readme, leaderboard).
- **Client:** `ErrorBoundary` wraps the app.

## 13.2 Logging

- `console.log` only in the CLI agent (intentional, user-facing CLI output).
- Platform: no noisy logging; `console.warn` for missing token in dev.
- Logs live in Vercel's runtime log viewer (free tier).

## 13.3 Health endpoint

`/api/health` returns status/version/timestamp + env checks; `?detail=1` adds live GitHub rate-limit probe. `Cache-Control: no-store`. Suitable for uptime monitors (UptimeRobot etc.).

## 13.4 Analytics

- `@vercel/analytics` page views + custom events added at v1.0.1: `profile_analyzed`, `readme_generated`, `readme_copied`, `badge_copied`, `share_copied`, `cta_dismissed`, `npx_copied` (dashboards/index/readme-generator).

---

# 14. Testing

## 14.1 Unit tests (Vitest, 30 tests, 4 files)

| File | Tests | Coverage |
|------|-------|----------|
| `src/lib/api-utils.test.ts` | 11 | rateLimit (first request, limit, block, window reset, defaults, key isolation) + validateUsername (valid, non-string, empty, trim, special chars, 39-char limit, leading hyphen) |
| `src/lib/analyze-profile.test.ts` | 6 | calculateScore: empty profile, rewards, bio bonus, caps, activity rewards, overall formula |
| `src/lib/format.test.ts` | 8 | getLangColor known/unknown, score hex tiers, labels, shields colors |
| `src/lib/config.test.ts` | 2 | BASE_URL shape |

## 14.2 Integration tests

- None formal. Manual end-to-end verification performed per release (analyze → badge → OG → README via curl/live testing). A test for `/api/analyze` is a listed good-first-issue.

## 14.3 Coverage

- V8 coverage configured in `vitest.config.ts`; libraries under test are the pure-logic core (scoring, validation, formatting). Page/API-route logic is not covered (thin handlers).

## 14.4 Missing tests (known gaps)

- API route handlers (analyze/badge/og/generate-readme/leaderboard) — no request-level tests.
- `github-client.ts` retry/backoff/timeout behavior — no unit tests.
- Agent watcher (debounce, multi-repo flush) — no tests.
- Chrome extension injection logic — no tests.
- ShareModal focus trap — no tests.
- Recommended next: integration tests for analyze route + watcher debounce (Vitest with mocked GitHub fetch).

---

# 15. Performance

## 15.1 Caching strategy

| Layer | Mechanism | Routes |
|-------|-----------|--------|
| CDN (Vercel edge) | `s-maxage` + `stale-while-revalidate` | analyze 300s, badge 3600s, og 3600s, generate-readme 300s, leaderboard 600s |
| Browser | default HTTP cache | static assets, badge/OG images |
| Client (README) | in-memory `cached` map | style switching — no re-fetch |
| Client (localStorage) | username persistence | repeat visits pre-fill |

`stale-while-revalidate` means one origin call per TTL window regardless of request volume — the single most important scale lever on a rate-limited GitHub quota.

## 15.2 Serverless behavior

- Each route is an isolated lambda; cold starts occur after idle. `sharp` in `og.ts` adds ~500ms cold-start cost (native module load).
- No persistent state between invocations (in-memory rate maps reset per instance) — correctness never depends on cross-instance state.
- `analyzeProfile` does parallel fetches, so one analysis ≈ latency of slowest of 3 GitHub calls (not sum).

## 15.3 Optimizations made

- 3 API calls run in parallel (`Promise.all`).
- Leaderboard batches analyses (5/10 at a time) with pacing to respect GitHub quota.
- Static pages (SSG) for all 9 pages — zero server work for page views.
- Badge route returns errors as valid SVGs (no error-path latency spikes).
- `awaitWriteFinish` in watcher prevents write-storm commits.

## 15.4 Known bottlenecks

- GitHub API quota is the hard ceiling (20 unauth analyses/hr shared).
- `sharp` cold start (mitigated by 1h cache).
- Leaderboard recomputes all profiles per request (10s+ cold) — a periodic-cache job would fix this (requires cron/KV).
- In-memory rate limit not global across instances.

---

# 16. UX

## 16.1 User journey

1. **Landing** (`/`) — hero with analyzer input, feature grid, "how it works" steps, methodology section (score tiers), CTA banner.
2. **Analyze** (`/dashboard` or hero) — type username → progressive loading steps ("Fetching profile..." → "Calculating score...") → results: avatar header, score badge, stats grid (Repos/Stars/Forks/Code Volume), language bars, consistency meter, recommendations, top repos (clickable), badge embed + share buttons.
3. **Share/React** — ShareModal auto-opens once (dismissible, remembered); LinkedIn/X share links; copy message.
4. **README** (`/readme-generator`) — username + style → live preview → copy/download with paste hint.
5. **Leaderboard** (`/leaderboard`) — ranked profiles, search adds profiles, click through to analysis.
6. **Pro report** (`/pro-report/[username]`) — deeper recruiter-facing report.

## 16.2 Accessibility (WCAG-conscious)

- Skip-to-content link (`Layout.tsx`).
- Focus trap + focus restore in ShareModal (Tab/Shift+Tab cycle).
- `aria-label` on all inputs/buttons; `role="alert"` on errors; `aria-live="polite"` on loading.
- `#how-it-works` focusable (`tabIndex={-1}`) for keyboard users.
- Stats grouped in `<section aria-label="Quick stats">`.
- Semantic headings hierarchy; contrast-friendly text on dark theme.

## 16.3 Mobile support

- Responsive throughout (max-w-7xl, sm/md breakpoints, grid collapse, mobile hamburger menu).
- `min-w-0` on hero input — safe at 320px viewports.
- Mobile share sheet buttons stack vertically.

## 16.4 Known pain points

- Bounce rate ~45% on `/` — visitors don't immediately grasp what to type; mitigated by clearer hero copy + example chips on dashboard.
- Leaderboard page load is slow (recomputes analyses server-side).
- No dark/light toggle (dark-only by design).
- ShareModal auto-open can surprise first-time users (dismissible).
- OG `sharp` cold start on first social scrape.

---

# 17. Business Model

## 17.1 Current monetization

- **$0.** Everything free. BuyMeACoffee link exists (unmeasured).

## 17.2 Future monetization (ranked by recommended priority)

| # | Product | Price | Requires | Est. MRR at scale |
|---|---------|-------|----------|-------------------|
| 1 | Pro Report (PDF, history, date ranges) | $5/mo | Auth (email or OAuth) + PDF gen | $500–2K |
| 2 | Team/Org plans (10+ profile dashboard) | $50/mo | Auth + dashboard + billing | $500–5K |
| 3 | API access (10K req/day, webhooks) | $10/mo | API keys + billing | $500–2K |
| 4 | AI README generation | $5–10/mo | LLM provider integration | $200–1K |
| 5 | GitHub Sponsors / donations | $3–10/mo | GitHub Sponsors profile | $50–500 |

`/api/pro/checkout` creates a per-click Razorpay payment link (₹749, lifetime Pro Access) server-side using `RAZORPAY_KEY_ID` + `RAZORPAY_KEY_SECRET` (server-only env; never `NEXT_PUBLIC_`). Callback returns the buyer to `/dashboard?user=…&pro_unlocked=1` (cookie `autodev_pro=1` unlocks the Pro Insights section). No keys configured → endpoint answers `{ demo: true }` and the site unlocks in demo mode.

## 17.3 Pricing philosophy

Free core (analyzer, badge, README gen) forever — the badge is the marketing flywheel. Monetize depth (reports, teams, API), never the viral surface.

## 17.4 TAM / SAM / SOM

| Metric | Value | Basis |
|--------|-------|-------|
| TAM | ~30M developers | GitHub Octoverse |
| SAM | ~3M | Developers who actively optimize profile presentation |
| SOM Year 1 | 10K–50K | Organic npm→site funnel + extension + SEO |
| SOM Year 3 | 500K–2M | Team plans + enterprise + marketplace presence |

---

# 18. Competitors

| Competitor | Strengths | Weaknesses | AutoDev advantage |
|-----------|-----------|------------|-------------------|
| **GitHub (native)** | Platform owner; could build scoring natively | No objective scoring; no README generation; no auto-commit tool | Multi-tool integration + neutrality + open source |
| **readme.so** | Clean README editor UI | Manual data entry (no live GitHub data); no analysis; single-purpose | Live data → generated README; analysis + README in one flow |
| **GitHub Profile README Generators (various)** | Many templates | Static templates; no personalization; no scoring; stale | Data-driven templates (real repos, real activity, real score) |
| **github-readme-stats** (anuraghazra) | Massive adoption; reliable cards | Stats only; no scoring or recommendations; no README writing | Recommendation engine + full README output + score badge |
| **streak-stats / activity-graph** (DenverCoder1) | Niche stats cards | Single-purpose | Suite approach (one tool, many outputs) |
| **gitauto / auto-commit CLIs** | Focused automation | No profile/presentation side | Analyzer + README + automation in one package |

**Moats:** (1) The score standard — first mover in "GitHub score" mental space; (2) the badge network effect — every badge is a backlink; (3) zero-cost architecture allows free-forever core; (4) MIT open source invites community contribution where closed tools stagnate.

---

# 19. SWOT Analysis

## Strengths
- $0/month infra (no database, Vercel free tier)
- 3-in-1 product (analyze / generate / automate) — one login, one brand
- Live GitHub data — always fresh, zero sync logic
- Production engineering: 30 tests, Sentry, CSP, HSTS, ADRs, CI
- Organic npm traction (609/wk) + published userscript
- MIT license + docs → contributor-ready
- No user data = minimal legal/compliance surface

## Weaknesses
- In-memory rate limiting — not globally enforceable
- No database → ephemeral leaderboard, no history, no retention
- No accounts → no personalization, no stickiness
- Solo maintainer — bus factor 1
- Chrome extension unpublished ($5 fee pending)
- GitHub quota is the scaling ceiling without a token or cache layer
- `sharp` cold start on OG; hardcoded version string in health route

## Opportunities
- Chrome Web Store + GitHub Actions Marketplace discovery
- SEO: 3 new landing pages (analyzer/badge/tips) + long-tail content
- Bootcamp/student partnerships (bulk adoption)
- AI README generation (trend fit)
- Team plans for hiring pipelines (B2B)
- Vercel template + Next.js showcase listings

## Threats
- GitHub ships native scoring
- GitHub API pricing/limits change
- VC-funded competitor bundles similar features
- Free-tier Vercel limits at scale (pro plan needed ~$20/mo)
- Third-party README services (shields, stats cards) outage breaks generated READMEs

---

# 20. Current Status

## 20.1 Finished

- v1.0.0 shipped: analyzer, README gen (3 styles), badge, OG images, leaderboard, CLI agent (npm), extension (unpacked), userscript.
- Security hardening (CSP, headers, rate limits, validation, lazy token).
- Sentry monitoring (3 runtimes) + health endpoint.
- 30 unit tests + CI (lint/typecheck/test/build) + dependabot + CODEOWNERS.
- Accessibility pass (focus trap, skip-link, aria, keyboard).
- UX polish pass (score legend, methodology, progressive loading, dismissible banner, clickable repos).
- Analytics custom events (7 events).
- SEO: 3 new static pages, schema markup, sitemap (9 URLs), robots.txt.
- CLI `--score` flag + npm postinstall message.
- GitHub Action `autodev-score-check` (built + tested locally, not yet published to marketplace).
- Docs: README (full), CHANGELOG, CONTRIBUTING, SECURITY, CODE_OF_CONDUCT, ADRs, LICENSE, .env.example, issue templates.

## 20.2 Unfinished

- Chrome Web Store submission (needs $5).
- GitHub Actions Marketplace publication.
- GreasyFork publication of userscript.
- Directory listings (alternateto, saashub, etc.).
- GSC sitemap re-submission (was 404 cached; static file verified 200).
- GitHub repository topics not yet set.
- Domain purchase (recommended: `getautodev.dev` — available).

## 20.3 Technical debt

| Item | Severity | Mitigation |
|------|----------|------------|
| `/api/health` version hardcoded "0.2.0" | Low | Import from package.json |
| In-memory rate limit not global | Medium | Vercel KV when traffic requires |
| `sharp` cold start | Low | Migrate to `@vercel/og` |
| ESLint warnings (img-element ×5, exhaustive-deps ×3) | Low | `next/image` migration + hook deps |
| Leaderboard recompute per request | Medium | Periodic cache job (cron + KV) |
| Agent version banner says v1.0 (code) but package has 1.0.0 — already synced | — | N/A |
| `count_private=true` in generated README stats URLs | Low | Misleading flag (private repos not accessible) — cosmetic |
| fork repos count toward `repoCount` in scoring | Low | Document or filter |

## 20.4 Known bugs

- None open at handover. GSC sitemap was the last known operational issue (external cache).

---

# 21. Future Roadmap

## 21.1 Version 1.0.x (next 4–6 weeks) — Distribution & Scale Foundations

- Chrome Web Store + GreasyFork + GitHub Actions Marketplace publication
- Vercel KV persistent rate limiting
- `@vercel/og` migration (remove sharp)
- Directory listings + domain + GSC fix
- Analytics dashboard review (first event data)

## 21.2 Version 1.x (Q3–Q4 2026) — Engagement & Value

- v1.1: Pro Report (PDF export, history tracking, date ranges) + Stripe (link already scaffolded)
- v1.2: Community README template gallery
- v1.3: Optional GitHub OAuth (saved profiles, compare mode)
- v1.4: Score history snapshots (weekly) via Vercel cron + KV
- API keys + tiered rate limits ($10/mo access)

## 21.3 Version 2.0 (Q1–Q2 2027) — B2B & Platform

- Team/Org dashboards ($50/mo)
- Team profile guard GitHub Action (productionized)
- i18n (Hindi, Spanish, Portuguese)
- Job-seeker report export (ATS-friendly resume)
- Embeddable profile widget (iframe)

## 21.4 Version 3.0 (2027–2028) — Identity Platform

- AI README generation (LLM)
- Multi-platform identity (GitLab, Bitbucket, personal sites)
- Recruitment marketplace (companies search profiles)
- Enterprise white-label + custom scoring

---

# 22. Biggest Risks

## Technical
- **GitHub API quota exhaustion** at 100+ concurrent users without token — highest technical risk. Mitigation: persistent cache layer (KV + cron), token provisioning, client-side analysis future.
- **Third-party stats services outage** breaks generated READMEs (upstream).
- **Serverless cold-start drift** as features accumulate.

## Business
- **Zero revenue stream live** — monetization is design-only. Mitigation: Sponsors now, Pro Report within 2 months.
- **Solo maintainer dependency** — burnout/abandonment risk. Mitigation: contributors, early governance.

## Marketing
- **No audience** (25 visitors/7 days) — the product outruns its distribution. Mitigation: 12-task growth plan (extension, directories, SEO, postinstall, CLI score).
- **SEO takes 3–6 months** to pay off — patience required.

## Legal
- **Minimal exposure** (no user data). Remaining: MIT license compliance for reused code; Shields-style badge SVG is original.
- Future OAuth introduces GDPR/ToS obligations — plan for it when added.

## Infrastructure
- **Vercel free-tier limits** (fair-use: serverless invocation caps, no cron on hobby tier → KV/cron require Pro $20/mo).
- **npm supply chain** — dependabot active; high-severity advisory exists in agent dev deps (ts-node) — review before next publish.

---

# 23. If I had 6 months

Month-by-month, exactly what I would build:

## Month 1 — Distribution (weeks 1–4)
1. Publish Chrome extension ($5) — Chrome Web Store listing with the minimal-permission story.
2. Publish userscript to GreasyFork; submit to 6 directories; submit Next.js showcase.
3. Set up Vercel Pro + KV: persistent rate limiting + leaderboard cache cron (kills two top risks).
4. Publish GitHub Action to marketplace; first external users.
5. Fix GSC; buy `getautodev.dev`; move site domain.

## Month 2 — Monetization v1
1. **Pro Report v1:** email-or-ghost auth (no OAuth — low friction), PDF export, 30-day history, Stripe payment link (scaffold exists). $5/mo.
2. Analytics review: funnel from `profile_analyzed` → `readme_generated` → `badge_copied`; ship the best-converting CTA variation.

## Month 3 — Community & Retention
1. Ship compare mode (2 profiles side-by-side) — shareable, viral.
2. GitHub Discussions enabled (6 categories); first good-first-issue batch; contributor onboarding doc.
3. Weekly score snapshot emails (opt-in) — first retention loop. Requires cron + KV (already paid for).

## Month 4 — AI + Automation
1. **AI README generation** — plug LLM provider into `generate-readme` as a 4th style ($5–10/mo tier).
2. GitHub Action v2 — score history in PR comments ("Your score changed: 53→61").

## Month 5 — B2B pilot
1. **Team dashboard** — invite up to 10 profiles, weekly digest, compare. Pilot 3 companies via LinkedIn outreach. $50/mo.
2. Fix all ESLint warnings (next/image migration); health-version debt; fork-repo scoring debt.

## Month 6 — Scale & polish
1. i18n first pass (Hindi, Spanish) for the analyzer page only.
2. Sponsors/GitHub sponsor tier launch with roadmap pledge.
3. Board review: numbers, funnel, churn; decide v2.0 scope vs. stay bootstrapped.

**Expected end state:** $1–3K MRR, 500+ DAU, 30+ contributors, extension + action live, two revenue streams proven.

---

# 24. If this product becomes part of a bigger AI platform

## Which modules stay independent

| Module | Why it stays standalone |
|--------|------------------------|
| **Scoring engine** (`calculateScore`) | Pure, deterministic, embeddable — a library, not a service |
| **Badge service** (`/api/badge`) | Infinitely cacheable; should stay a dumb, fast edge endpoint |
| **CLI agent** | Local tool; must never depend on a remote platform's auth |
| **Chrome extension / userscript** | Distribution channel; points at whatever API layer exists |
| **Format utilities** (`format.ts`) | Pure functions — shared npm package candidate |

## Which modules should merge

| Module | Merge into |
|--------|-----------|
| **README generator** | The AI platform's content-generation service (it becomes one of many "outputs" of a unified analysis pipeline) |
| **Profile analysis pipeline** (`analyze-profile.ts`) | A unified "developer identity" data service (GitHub + GitLab + LinkedIn signals) |
| **Leaderboard** | The platform's ranking/leaderboard engine (shared with other artifacts) |
| **OG image generator** | The platform's shared social-card renderer (one template system for all products) |
| **Analytics events** | The platform's unified product analytics schema (single event taxonomy) |

## Which features become platform services

| Feature | Becomes |
|---------|---------|
| Profile scoring | `identity-score` service — multi-source scoring (GitHub, GitLab, web presence) |
| Persistent storage/cache | Platform-level KV + cron (never per-product) |
| Auth/accounts | Platform identity (OAuth login, API keys, billing) shared by all products |
| Rate limiting | Platform gateway policy (Upstash/Vercel KV at the edge) |
| README/PDF/OG generation | Platform content-rendering service (one SDK, many outputs) |
| Recommendations engine | Platform insight service — shared by analysis, reports, digests, AI chat |
| Leaderboard | Platform leaderboard-as-a-service (any scoreable artifact) |
| Monitoring/analytics | Platform observability layer (Sentry + events standard) |

**Integration principle:** keep the viral surfaces (badge, CLI, extension) thin clients of the platform, and let the analysis/scoring/recommendation intelligence live in platform services that every product reuses. The monorepo structure already anticipates this — `shared/` becomes the platform SDK boundary.

---

*End of handover document. For day-to-day operations: `CONTRIBUTING.md` (dev setup), `docs/architecture/README.md` (routes/caching), `docs/adr/` (design decisions), `CHANGELOG.md` (release history).*
