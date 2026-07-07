# PROJECT_BRAIN — AutoDev

> Last updated: 2026-07-07
> This is the single source of truth for the AutoDev codebase. Any engineer should be able to understand the entire project in under 30 minutes.

---

## 1. Product Overview

AutoDev is a three-product platform for GitHub developers:

| Product | Status | Users | Revenue |
|---------|--------|-------|---------|
| **GitHub Profile Analyzer** (web) | Live, active | ~25 visitors, unknown conversions | $0 |
| **README Generator** (web) | Live, active | Shared with analyzer | $0 |
| **AutoDev Agent** (CLI) | Published on npm (v0.1.3) | ~609 downloads/week | $0 |

**Stack:** Next.js 14 (Pages Router) + TypeScript + TailwindCSS + Vercel Free + Sharp + GitHub API
**License:** MIT
**Budget:** $0
**Team:** Solo (Shashwat1319)

**What the product does:** Enter any GitHub username → get a scored profile analysis (score/100, languages, activity, repos, recommendations) + generate a profile README in 3 styles + optionally use a CLI tool that auto-commits/pushes git changes.

**What the product does NOT do:** No database, no auth, no login, no paid tier, no teams, no enterprise features. All analysis is ephemeral — fetched live from GitHub API on every request (with Vercel edge caching).

---

## 2. Folder Architecture

```
autodev/
├── .env.example                  # Root env template (FOR MONOREPO DEV SCRIPTS ONLY)
├── .gitignore                    # Root gitignore
├── package.json                  # Root monorepo scripts (version 0.2.0)
│
├── shared/                       # Shared TypeScript types across agent + platform
│   └── types/index.ts            # AutoDevConfig, WatchedRepo, CommitEvent, ProfileAnalysis, RepoAnalysis, AgentStatus, UserSession
│   └── IMPORTANT: platform/src/shared/types.ts is a DUPLICATE of this file
│
├── agent/                        # CLI tool — published on npm as "autodev-agent"
│   ├── package.json              # npm package config (v0.1.3)
│   ├── tsconfig.json             # TypeScript config (target ES2022, output dist/)
│   ├── .env.example              # AUTODEV_API_URL, AUTODEV_AUTH_TOKEN
│   ├── .gitignore
│   ├── README.md
│   ├── dist/                     # Built JS output (compiled from src/)
│   ├── src/
│   │   ├── index.ts              # Entry point — creates FileWatcher, CloudConnector, SyncQueue, starts file watching
│   │   ├── config.ts             # Config loading from ~/.autodev/config.json + env vars
│   │   ├── core/
│   │   │   ├── watcher.ts        # FileWatcher — chokidar-based file system watcher with debounce
│   │   │   ├── cloud-connector.ts# CloudConnector — Socket.IO client for cloud sync (DISABLED / OFFLINE BY DEFAULT)
│   │   │   ├── git-engine.ts     # GitEngine — simple-git wrapper for commit/push/pull/status/log
│   │   │   └── sync-queue.ts     # SyncQueue — persistent queue for offline operations
│   │   ├── shared/
│   │   │   └── types.ts          # Local type definitions (same content as shared/types/index.ts)
│   │   └── utils/                # EMPTY DIRECTORY
│   └── node_modules/
│
├── platform/                     # Next.js web application — deployed on Vercel
│   ├── package.json              # v0.2.0, Next.js 14, Tailwind, Sharp
│   ├── tsconfig.json             # Next.js TS config
│   ├── next.config.js            # reactStrictMode, images remotePatterns (avatars.github.com)
│   ├── tailwind.config.js        # Custom autodev color palette (cyan-blue theme)
│   ├── postcss.config.js         # Tailwind + autoprefixer
│   ├── vercel.json               # framework: "nextjs" only
│   ├── public/
│   │   ├── robots.txt            # Allows all, points to sitemap.xml
│   │   └── favicon.svg           # "A" logo with cyan-blue gradient
│   ├── src/
│   │   ├── pages/
│   │   │   ├── _app.tsx          # Next.js App wrapper — injects @vercel/analytics, imports globals.css
│   │   │   ├── _document.tsx     # Custom Document — sets lang="en"
│   │   │   ├── index.tsx         # HOMEPAGE — hero, search, result card, share modal, badge section, userscript section
│   │   │   ├── dashboard.tsx     # DASHBOARD — full profile analysis, stats, languages, recommendations, top repos, badge, share
│   │   │   ├── leaderboard.tsx   # LEADERBOARD — ranked profiles table with search/add
│   │   │   ├── readme-generator.tsx # README GENERATOR — style selector, preview, copy, download
│   │   │   ├── sitemap.xml.ts    # Dynamic XML sitemap (SSR) — 4 pages
│   │   │   └── api/
│   │   │       ├── analyze.ts    # POST/GET /api/analyze?username= — profile analysis endpoint
│   │   │       ├── badge.ts      # GET /api/badge?username= — SVG score badge
│   │   │       ├── generate-readme.ts # GET /api/generate-readme?username=&style= — README generation + download
│   │   │       ├── leaderboard.ts # GET /api/leaderboard?q= — ranked profile list
│   │   │       └── og.ts         # GET /api/og?username= — OG image (PNG via Sharp)
│   │   ├── components/
│   │   │   └── PHBanner.tsx      # Product Hunt launch banner (7+ days old, still showing)
│   │   ├── lib/
│   │   │   ├── analyze-profile.ts # Core analysis logic — fetches GitHub API, calculates scores, generates recommendations
│   │   │   └── rate-limit.ts     # In-memory per-IP rate limiting (Map-based, 60s cleanup interval)
│   │   ├── shared/
│   │   │   └── types.ts          # ProfileAnalysis, RepoAnalysis interfaces (DUPLICATE of shared/types/index.ts)
│   │   └── styles/
│   │       └── globals.css       # Tailwind directives + custom utility classes (glass, glow, animations, grid)
│   └── .vercel/                  # Vercel project config (auto-generated)
│
├── chrome-extension/             # Chrome extension (built, NOT PUBLISHED — $5 fee blocked)
│   ├── manifest.json             # MV3, content_scripts on github.com/*, host_permissions to autodev-kappa.vercel.app
│   ├── content.js                # Injects AutoDev score badge on GitHub profile pages
│   ├── popup.html                # Popup UI with username input and score display
│   ├── popup.js                  # Popup logic — fetches /api/analyze and renders result
│   ├── styles.css                # CSS for content script injected badge
│   ├── icon-16.png
│   ├── icon-48.png
│   └── icon-128.png
│
├── autodev-github-score.user.js  # Tampermonkey userscript — same functionality as Chrome extension, free distribution
│
├── README.md                     # Project overview (v0.2.0)
├── USAGE.md                      # Development + usage instructions
├── STRATEGY.md                   # Growth playbook (archived — needs update)
├── AUDIT.md                      # Strategy audit (archived — overwritten with persona audit)
├── LAUNCH_KIT.md                 # Product Hunt launch materials (archived — launched July 5)
├── IDEA_BANK.md                  # Future product ideas (DepRisk, DocDebt, GitGraveyard, PR Pulse, Context Keeper)
├── STAGE0_VALIDATION.md          # 7-day validation plan for billing watchdog idea
├── PROJECT_BRAIN.md              # THIS FILE
├── devto-article.md              # Dev.to post draft
├── HN_DRAFT.md                   # Hacker News post draft
├── REDDIT_DRAFTS.md              # Reddit post drafts
├── MY_PROFILE_README.md          # Personal README generated by AutoDev
├── agent/README.md               # Agent-specific README
└── platform/.env.example         # Platform env template (GITHUB_TOKEN, NEXT_PUBLIC_BASE_URL)
```

### Folder Responsibilities

| Folder | Type | Responsibility | Dependents |
|--------|------|---------------|------------|
| `shared/` | Runtime (type only) | Shared TS interfaces for agent + platform | agent, platform |
| `agent/` | Runtime (CLI) | npm package: file watching, git automation, cloud sync | npm users |
| `platform/` | Runtime (web) | Next.js app: profile analyzer, README gen, leaderboard, badges, OG images | Website visitors, Chrome extension, userscript |
| `chrome-extension/` | Runtime (browser) | Injects AutoDev score badge on GitHub profiles | Chrome users (browser) |
| `autodev-github-score.user.js` | Runtime (browser) | Same as Chrome extension but via Tampermonkey | Tampermonkey users |

---

## 3. File Index — Every File

### 3.1 Platform — Pages (React Components)

#### `platform/src/pages/index.tsx` — Homepage
- **Purpose:** Landing page. Hero with search input, live score preview, badge copy, userscript install, feature showcase, how-it-works section.
- **Exports:** `default function Home()`
- **Imports:** `Head` (next/head), `useState`, `useEffect` (react), `PHBanner`
- **Called by:** Next.js router (`/`)
- **Critical:** YES — primary landing page, entry point for most users
- **Business logic:** Username input → fetch `/api/analyze` → display result card with share buttons and badge copy. No analysis logic itself — delegates to API.
- **State:** `username`, `analyzing`, `result`, `error`, `mobileMenu`, `npxCopied`, `badgeCopied`
- **Cache:** No local caching — re-fetches on every search
- **Removable:** No — this is the entry point

#### `platform/src/pages/dashboard.tsx` — Profile Dashboard
- **Purpose:** Full profile analysis page. Can be loaded directly or via `?user=` query param.
- **Exports:** `default function Dashboard()`
- **Imports:** `Head`, `useState`, `useEffect`, `useRouter`, `PHBanner`
- **Called by:** Next.js router (`/dashboard`). Referenced by: homepage "Full Report →" link, badge link, OG image
- **Critical:** YES — core product page
- **Business logic:** Reads `?user=` from query param OR `localStorage` → fetches `/api/analyze` → displays header, stats grid, languages, consistency, recommendations, top repos, badge embed, share section
- **State:** `username`, `inputValue`, `profile`, `loading`, `error`, `mobileMenu`
- **Persistence:** Saves username to `localStorage('autodev_username')` for return visits
- **Edge case:** Shows empty state with welcome message when no username provided
- **Removable:** No — this is the main product

#### `platform/src/pages/leaderboard.tsx` — Leaderboard
- **Purpose:** Ranked list of GitHub profiles by AutoDev score.
- **Exports:** `default function Leaderboard()`
- **Imports:** `Head`, `useState`, `useEffect`, `useRef`, `PHBanner`
- **Called by:** Next.js router (`/leaderboard`)
- **Critical:** Optional — SEO + engagement feature
- **Business logic:** Fetches `/api/leaderboard` with hardcoded `FEATURED` list. User can add their username via input to be analyzed alongside. Uses `useRef` race token to prevent stale responses.
- **Limitations:** Only analyzes the 12 hardcoded profiles + user-added. Not a true "all users" leaderboard (no database).
- **Removable:** Yes — can be removed without breaking other features

#### `platform/src/pages/readme-generator.tsx` — README Generator
- **Purpose:** Generates GitHub profile README in 3 styles with preview, copy, download.
- **Exports:** `default function ReadmeGenerator()`
- **Imports:** `Head`, `useState`, `useEffect`, `PHBanner`
- **Called by:** Next.js router (`/readme-generator`)
- **Critical:** Optional — secondary feature, SEO value
- **Business logic:** Username + style → fetch `/api/generate-readme` → display markdown preview → copy or download (POST for file download with `Content-Disposition`)
- **Removable:** Yes — README generator is separate from core analysis

#### `platform/src/pages/_app.tsx` — App Wrapper
- **Purpose:** Injects Vercel Analytics + global CSS on every page
- **Exports:** `default function App()`
- **Critical:** YES — analytics infra

#### `platform/src/pages/_document.tsx` — Custom Document
- **Purpose:** Sets `<html lang="en">`
- **Exports:** `default function Document()`
- **Critical:** Low — SEO best practice

### 3.2 Platform — API Routes (Serverless Functions)

#### `api/analyze.ts` — GET `/api/analyze?username=`
- **Purpose:** Analyze a GitHub username and return ProfileAnalysis
- **Rate limit:** 30 req/min per IP
- **Cache:** `s-maxage=300` (5 min Vercel edge cache)
- **Input:** `username` query param
- **Output:** `ProfileAnalysis` JSON or error
- **Dependencies:** `rate-limit.ts`, `analyze-profile.ts`
- **Critical:** YES — all features depend on this

#### `api/badge.ts` — GET `/api/badge?username=`
- **Purpose:** Return SVG badge with AutoDev score
- **Rate limit:** 60 req/min per IP
- **Cache:** `s-maxage=3600` (1 hour — STALE DATA RISK)
- **Input:** `username` query param
- **Output:** SVG string with Content-Type `image/svg+xml`
- **Graceful degradation:** Returns error badge on failure instead of error status code (always returns 200)
- **Critical:** YES — badge is the viral loop

#### `api/generate-readme.ts` — GET/POST `/api/generate-readme`
- **Purpose:** Generate a README markdown string
- **Rate limit:** 20 req/min per IP
- **Cache:** `s-maxage=300` (GET) / no cache (POST)
- **Input:** `username`, `style` (default: 'professional')
- **Output:** GET returns JSON `{ username, readme, style }`; POST returns markdown file download
- **Dependencies:** `rate-limit.ts`, `calculateScore` from `analyze-profile.ts`
- **DUPLICATE LOGIC:** This file reimplements GitHub API fetching (fetchJSON) AND language calculations — duplicate of `analyze-profile.ts`
- **Critical:** Optional — README generator relies on this

#### `api/leaderboard.ts` — GET `/api/leaderboard?q=`
- **Purpose:** Return ranked list of profiles
- **Rate limit:** 20 req/min per IP
- **Cache:** `s-maxage=600` (10 min)
- **Input:** Optional `q` param (comma-separated extra usernames)
- **Output:** `{ leaderboard: [...], total: number }`
- **Limitations:** Only processes 12 hardcoded FEATURED users + up to 10 extra via `q`. Batches GitHub API calls in groups of 5 with 300ms delay between batches (to avoid rate limits).
- **Critical:** Low — only powers leaderboard page

#### `api/og.ts` — GET `/api/og?username=`
- **Purpose:** Generate OG image (1200x630 PNG) for social sharing
- **Rate limit:** 30 req/min per IP
- **Cache:** `s-maxage=3600` (1 hour)
- **Input:** Optional `username` query param
- **Output:** PNG image (via Sharp converting SVG → PNG)
- **Dependencies:** Sharp (npm package), `analyze-profile.ts`
- **Graceful degradation:** Fallback SVG if Sharp fails, double-fallback SVG if everything fails
- **Critical:** Medium — improves social sharing appearance

### 3.3 Platform — Lib

#### `lib/analyze-profile.ts`
- **Purpose:** Contains all core analysis logic: GitHub API fetching, score calculation, recommendations generation
- **Exports:** `calculateScore()`, `analyzeProfile()`
- **Imports:** `ProfileAnalysis` from shared types
- **Dependencies:** GitHub REST API (v3)
- **Critical:** YES — called by 4 API routes (analyze, badge, leaderboard, og) + generate-readme imports `calculateScore`
- **Functions:**
  - `calculateScore(data)`: Computes consistencyScore and overallScore from repo count, stars, events, bio
  - `analyzeProfile(username)`: Fetches user, repos, events from GitHub API in parallel → computes languages, top repos, recommendations → returns ProfileAnalysis

#### `lib/rate-limit.ts`
- **Purpose:** In-memory per-key rate limiting
- **Exports:** `rateLimit()`
- **Architecture:** Singleton Map with 60-second cleanup interval
- **Critical:** YES — prevents API abuse on all endpoints

### 3.4 Platform — Components

#### `components/PHBanner.tsx`
- **Purpose:** Product Hunt launch banner — shows "We're live on Product Hunt" with upvote button
- **Critical:** Low — can be removed after launch period
- **Note:** References `autodev-2` Product Hunt listing

### 3.5 Platform — Styles

#### `styles/globals.css`
- **Custom utilities:** gradient-text, glass (frosted glass), glow (cyan shadow), bg-grid (subtle grid pattern), bg-gradient-radial, animations (float, fadeIn, slideUp, pulse-slow)
- **Used by:** Every page

### 3.6 Agent — CLI Tool

#### `agent/src/index.ts` — Entry Point
- **Purpose:** Creates FileWatcher, CloudConnector, SyncQueue, starts watching
- **Exports:** None (entry point)
- **Critical:** YES — agent entry point

#### `agent/src/config.ts` — Configuration
- **Purpose:** Loads/saves config from `~/.autodev/config.json`, reads env vars
- **Functions:** `loadConfig()`, `saveConfig()`, `getApiUrl()`, `getAuthToken()`
- **Critical:** YES — agent cannot start without config

#### `agent/src/core/watcher.ts` — FileWatcher
- **Purpose:** Watches filesystem using chokidar, debounces changes, auto-commits via GitEngine
- **Configuration:** commitThreshold (seconds of inactivity), maxChangesBeforeCommit, ignoredPaths
- **Critical:** YES — core agent functionality

#### `agent/src/core/git-engine.ts` — GitEngine
- **Purpose:** simple-git wrapper for commit, push, pull, status, log
- **Critical:** YES — core agent functionality

#### `agent/src/core/cloud-connector.ts` — CloudConnector
- **Purpose:** Socket.IO client for real-time cloud sync. **DISABLED BY DEFAULT** — no AUTODEV_AUTH_TOKEN configured means offline mode
- **Critical:** Low — no-op without token

#### `agent/src/core/sync-queue.ts` — SyncQueue
- **Purpose:** Persistent queue for offline operations (saves to `~/.autodev/queue.json`)
- **Critical:** Low — not actively used in current flow

#### `agent/src/shared/types.ts` — Types (DUPLICATE)
- **Duplicate of:** `shared/types/index.ts` and `platform/src/shared/types.ts`
- **Contains:** AutoDevConfig, WatchedRepo, CommitEvent, ProfileAnalysis, RepoAnalysis, AgentStatus, UserSession
- **Technical debt:** 3 copies of the same type definitions

### 3.7 Chrome Extension

#### `content.js`
- **Purpose:** Detects GitHub profile pages, injects score badge next to user name
- **Flow:** Check URL path → if single segment and not excluded → wait 1.5s → fetch `/api/analyze` → inject badge HTML
- **MutationObserver:** Watches URL changes for SPA navigation
- **Critical:** Built but unpublished

#### `popup.js` / `popup.html`
- **Purpose:** Popup with username input, shows score/repos/stars/forks
- **Critical:** Built but unpublished

### 3.8 Tampermonkey Userscript

#### `autodev-github-score.user.js`
- **Purpose:** Free alternative to Chrome extension — injects score badge on GitHub profiles
- **Same logic as** Chrome extension `content.js` but standalone
- **Critical:** Published via GitHub direct install

---

## 4. Runtime Flow Diagram

### 4.1 User Visits Homepage (`/`)

```
Browser requests https://autodev-kappa.vercel.app/
  │
  ▼
Vercel edge (CDN)
  │
  ├── cached? → serve static HTML/JS
  │
  ▼
Next.js server (serverless function)
  │
  ▼
pages/_app.tsx loads
  ├── imports globals.css
  ├── wraps <Component> with <Analytics />
  │
  ▼
pages/index.tsx renders
  ├── <Head> — SEO meta tags, JSON-LD schema, canonical URL
  ├── <header> — Nav bar + PHBanner
  ├── <section hero> — "Your Code. Auto-Piloted." + username input + analyze button
  ├── <section features> — 6 feature cards (File Watcher, Auto Commit, etc.)
  ├── <section how-it-works> — 4 steps
  ├── <section badge> — SVG badge + copy code button
  ├── <section userscript> — Install Tampermonkey script
  ├── <section support> — Buy me a coffee
  └── <footer>
```

### 4.2 User Analyzes a Profile

```
User enters "torvalds" → clicks "Analyze"
  │
  ▼
index.tsx: analyzeProfile()
  │  setAnalyzing(true)
  │  setError('')
  │  setResult(null)
  │
  ▼
fetch('/api/analyze?username=torvalds')
  │
  ▼
pages/api/analyze.ts handler()
  │  1. Extract IP from x-forwarded-for / x-real-ip
  │  2. rateLimit({ key: `analyze:${ip}`, maxRequests: 30, windowMs: 60000 })
  │  3. If rate limited → return 429
  │  4. Validate username param
  │  5. If no GITHUB_TOKEN in dev → warn
  │  6. Call analyzeProfile('torvalds')
  │
  ▼
lib/analyze-profile.ts: analyzeProfile()
  │  Promise.all([
  │    fetch(GH /users/torvalds),
  │    fetch(GH /users/torvalds/repos?per_page=100&sort=updated),
  │    fetch(GH /users/torvalds/events/public?per_page=100),
  │  ])
  │
  ├── userRes.ok? → 403 rate limit? → throw
  │    → null (user not found)
  │
  ▼
  Parse userData, repos, events
  │
  ├── totalStars = sum(repo.stargazers_count)
  ├── totalForks = sum(repo.forks_count)
  ├── languages = count by language, calculate percentages, sort desc
  ├── topRepos = filter(!fork), sort by stars, take 5, score each
  ├── repoVolume = sum(repo.size) / 100
  │
  ▼
  calculateScore({ repoCount, totalStars, eventCount, publicRepos, hasBio })
  │
  ├── consistencyScore = min(100,
  │     (repoCount > 0 ? 30 : 0) +
  │     (totalStars > 0 ? 20 : 0) +
  │     (eventCount > 10 ? 25 : eventCount > 0 ? 10 : 0) +
  │     (publicRepos > 5 ? 15 : 5) +
  │     (hasBio ? 10 : 0)
  │   )
  │
  └── overallScore = round((consistencyScore + min(100, totalStars * 2)) / 2)
  │
  ▼
  Generate recommendations (bio, blog, original repos, descriptions, stars, activity)
  │
  ▼
  Return ProfileAnalysis object
  │
  ▼
api/analyze.ts sets header: Cache-Control: s-maxage=300
  │
  ▼
  Returns JSON to frontend
  │
  ▼
index.tsx: setResult(data)
  │
  ▼
UI renders:
  ├── Avatar + username + score badge
  ├── Stats grid (Repos, Stars, Forks, Repo Volume)
  ├── Language bars (top 6)
  ├── Recommendations list (top 3)
  └── Share buttons (LinkedIn, X, Copy Badge)
```

### 4.3 User Visits Dashboard Directly

```
User navigates to /dashboard?user=torvalds
  │
  ▼
pages/dashboard.tsx renders
  │
  ├── useEffect checks router.query.user → 'torvalds'
  │     ├── setUsername('torvalds')
  │     └── fetchProfile('torvalds')
  │           └── same API flow as above
  │
  ├── localStorage.setItem('autodev_username', 'torvalds')
  │
  ▼
  On return visit without ?user=: reads from localStorage
```

### 4.4 User Generates README

```
User navigates to /readme-generator
  → enters username → clicks Generate
  │
  ▼
  GET /api/generate-readme?username=torvalds&style=professional
  │
  ▼
  generate-readme.ts handler()
  │  1. Rate limit check
  │  2. Fetch user, repos, events from GitHub API (DUPLICATE CODE)
  │  3. Calculate score via calculateScore (imported)
  │  4. Build README template (professional/minimal/recruiter)
  │  5. Cache-Control: s-maxage=300
  │
  ▼
  Frontend displays markdown preview
  │
  ├── Copy button → navigator.clipboard.writeText
  └── Download button → POST with Content-Disposition → file download
```

### 4.5 Badge Loads on GitHub Profile

```
User's GitHub profile README includes badge:
  [![AutoDev Score](https://autodev-kappa.vercel.app/api/badge?username=torvalds)]
  │
  ▼
Visitor loads github.com/torvalds
  → GitHub renders README
  → Browser fetches badge SVG from /api/badge?username=torvalds
  │
  ▼
  badge.ts handler()
  │  1. Rate limit check (60/min)
  │  2. Fetch analysis via analyzeProfile
  │  3. Determine color: >=70 green, >=40 orange, <40 red
  │  4. Determine label: "AutoDev Great" / "AutoDev Okay" / "AutoDev Needs Work"
  │  5. Render SVG dynamically
  │  6. Cache-Control: s-maxage=3600
```

### 4.6 Chrome Extension / Userscript Flow

```
User visits github.com/torvalds
  │
  ▼
content.js / userscript executes
  │
  ├── isProfilePage() → check URL is single path segment
  │     └── not in EXCLUDED list
  │
  ├── Wait 1.5 seconds for page to load
  │
  ├── tryInjectBadge('torvalds')
  │     └── find container: .vcard-names, .p-name, etc.
  │
  ├── fetch(/api/analyze?username=torvalds)
  │
  └── createBadge('torvalds', score) → inject colored badge inline
```

---

## 5. API Flow Diagram

### 5.1 `GET /api/analyze?username={username}`

```
[Input] username: string
  │
  ▼
[Validation] length check, type check
  │  400 ← missing username
  │
  ▼
[Rate Limit] 30 req/min per IP (analyze:{ip})
  │  429 ← rate limited
  │
  ▼
[Business Logic] analyzeProfile(username)
  │
  ├── GitHub API: GET /users/{username} (user data)
  ├── GitHub API: GET /users/{username}/repos?per_page=100&sort=updated (repos)
  └── GitHub API: GET /users/{username}/events/public?per_page=100 (events)
  │
  ├── 403 ← GitHub API rate limited
  ├── null ← user not found (404 response)
  │
  ▼
[Transformations]
  ├── totalStars = ∑ stargazers_count
  ├── totalForks = ∑ forks_count
  ├── languages = grouped count → percentage → sorted desc
  ├── topRepos = filter !fork → sort stars desc → take 5
  │     └── each: calculate repo score (stars*10 + forks*5 + desc?10 + topics*5)
  ├── repoVolume = ∑ repo.size / 100
  ├── calculateScore → consistencyScore + overallScore
  └── recommendations (6 rules based on missing data)
  │
  ▼
[Response] ProfileAnalysis JSON
  └── Cache-Control: s-maxage=300
  │
  ▼
[Consumers]
  ├── index.tsx homepage result card
  ├── dashboard.tsx full profile
  ├── badge.ts generates score badge
  ├── og.ts generates OG image
  ├── leaderboard.ts scores ranked profiles
  ├── content.js (Chrome extension) injects badge
  └── autodev-github-score.user.js injects badge
```

### 5.2 `GET /api/badge?username={username}`

```
[Input] username: string
  │
  ▼
[Rate Limit] 60 req/min per IP (badge:{ip})
  │  ← returns error badge SVG (not 429)
  │
  ▼
[Fetch] analyzeProfile(username)
  │  404 → "User Not Found" badge (always 200)
  │  error → "Error" badge (always 200)
  │
  ▼
[Transform]
  ├── scoreColor(score) → green(>=70) / orange(>=40) / red(<40)
  └── scoreLabel(score) → "AutoDev Great" / "AutoDev Okay" / "AutoDev Needs Work"
  │
  ▼
[Render] badgeSVG(label, score, color, '#555')
  │  Dynamic widths based on text length
  │  Gradient overlay for depth
  │
  ▼
[Response] SVG string
  └── Content-Type: image/svg+xml
  └── Cache-Control: s-maxage=3600
```

### 5.3 `GET /api/leaderboard?q={usernames}`

```
[Input] q (optional): comma-separated extra usernames
  │
  ▼
[Build list] FEATURED (12 hardcoded) + up to 10 from q
  │
  ▼
[Batch process] Groups of 5, 300ms delay between batches
  └── Each: analyzeProfile(username)
  │
  ▼
[Sort] by overallScore descending
  │
  ▼
[Transform] Map to leaderboard entries (rank, username, avatar, score, repos, stars, forks, top 3 languages)
  │
  ▼
[Response] { leaderboard: [...], total: N }
  └── Cache-Control: s-maxage=600
```

### 5.4 `GET/POST /api/generate-readme?username={username}&style={style}`

```
[Input] username: string, style: 'professional'|'minimal'|'recruiter' (default: 'professional')
  │
  ▼
[Rate Limit] 20 req/min per IP (generate-readme:{ip})
  │  429 ← rate limited
  │
  ▼
[Fetch] GitHub API (DUPLICATE of analyze-profile.ts)
  ├── GET /users/{username}
  ├── GET /users/{username}/repos?per_page=100
  └── GET /users/{username}/events/public?per_page=30
  │
  ▼
[Transform] Same language calc, top repos calc, score calc
  │
  ▼
[Template Engine] generateReadme(data, style)
  ├── minimal: simple greeting + stats bar + languages + score badge
  ├── professional: capsule header + typing SVG + about + tech stack + language graph + activity graph + streak + highlighted repos + activity + social badges
  └── recruiter: wave header + professional summary table + stats table + languages + activity graph + top projects table + pinned repos + buy me a coffee + score badge
  │
  ▼
[Response] GET → JSON { username, readme, style }
            POST → Content-Type: text/markdown + Content-Disposition: attachment
  └── Cache-Control: s-maxage=300 (GET only)
```

### 5.5 `GET /api/og?username={username}`

```
[Input] username (optional): string
  │
  ▼
[Rate Limit] 30 req/min per IP (og:{ip})
  │  429 ← rate limited
  │
  ▼
[Fetch] If username provided → analyzeProfile(username)
  │  If not → generic OG image
  │
  ▼
[Render] SVG template (1200x630)
  ├── Gradient background
  ├── Avatar circle (or initial letter)
  ├── Username text
  ├── Score card with color-coded progress bar
  ├── Stats grid (Repos, Stars, Forks)
  └── Footer branding
  │
  ▼
[Convert] Sharp SVG → PNG buffer
  │  Fallback: if Sharp fails → return SVG directly
  │  Double fallback: if everything fails → error SVG
  │
  ▼
[Response] PNG image
  └── Content-Type: image/png
  └── Cache-Control: s-maxage=3600
```

---

## 6. Data Flow Diagram

### 6.1 GitHub Username → Score

```
User enters "torvalds"
  │
  ▼  State variable (username)
  │
  ▼  fetch('/api/analyze?username=torvalds')
  │
  ▼  analyze-profile.ts
  │
  ├── GitHub API /users/torvalds → userData
  │     ├── login, avatar_url, bio, location, public_repos, name, blog, company
  │
  ├── GitHub API /users/torvalds/repos → repoList[]
  │     ├── name, description, stargazers_count, forks_count, language,
  │     │   size, html_url, fork, topics
  │     │
  │     ▼  Calculate totalStars = ∑ stargazers_count
  │     ▼  Calculate totalForks = ∑ forks_count
  │     ▼  Calculate repoVolume = ∑ size / 100
  │     │
  │     ▼  Group by language → count → percentage → sort
  │     │   languages = [{ name: 'C', percentage: 85 }, ...]
  │     │
  │     ▼  Filter !fork → sort by stars desc → take 5
  │       topRepos = [{ name, description, stars, forks, language, score }]
  │
  ├── GitHub API /users/torvalds/events → eventList[]
  │     └── eventCount = eventList.length (activity level)
  │
  ▼  calculateScore({ repoCount, totalStars, eventCount, publicRepos, hasBio })
  │
  ├── consistencyScore = sum of scored dimensions
  └── overallScore = (consistencyScore + min(100, totalStars*2)) / 2
  │
  ▼  ProfileAnalysis JSON returned
  │
  ▼  setResult(data) in React state
  │
  ▼  UI renders score badge, stats, languages, recommendations
```

### 6.2 Score Badge → Viral Loop

```
Developer A analyzes their profile → gets score
  │
  ▼  Clicks "Copy Badge"
  │
  ▼  Pastes markdown into GitHub profile README:
  │   [![AutoDev Score](https://autodev-kappa.vercel.app/api/badge?username=A)]()
  │
  ▼  Developer B visits GitHub profile A → sees badge
  │
  ▼  Clicks badge → opens /dashboard?user=A
  │
  ▼  Developer B enters their own username → gets their score
  │
  ▼  Developer B copies their own badge → cycle repeats
```

### 6.3 Chrome Extension / Userscript Flow

```
Developer installs extension/userscript
  │
  ▼  Visits github.com/anyuser
  │
  ▼  content.js: isProfilePage() → extract username from URL
  │
  ▼  Wait 1.5 seconds (page hydration)
  │
  ▼  tryInjectBadge(username)
  │     ├── Find container element on profile page
  │     └── fetch(/api/analyze?username=anyuser)
  │
  ▼  Create badge element with score
  │     └── Inject next to user name
  │
  ▼  Click badge → opens dashboard?user=anyuser
      → potential new user cycle
```

---

## 7. Dependency Graph

```
┌─────────────────────────────────────────────────────────────────┐
│                        PAGES (React)                            │
│                                                                 │
│  index.tsx ──────┬──── dashboard.tsx ──── leaderboard.tsx       │
│                  │                                              │
│  readme-generator.tsx ── sitemap.xml.ts                         │
│                                                                 │
│  All pages depend on:                                           │
│    ├── _app.tsx (Analytics, global CSS)                         │
│    ├── PHBanner.tsx (Product Hunt banner)                       │
│    └── globals.css (Tailwind + custom utilities)                │
└──────────────┬──────────────────────────────────────────────────┘
               │
               │  fetch()
               ▼
┌─────────────────────────────────────────────────────────────────┐
│                    API ROUTES (Serverless)                       │
│                                                                 │
│  /api/analyze ──────┬── rate-limit.ts                           │
│  /api/badge ────────┤                                           │
│  /api/leaderboard ──┤                                           │
│  /api/og ───────────┤                                           │
│                     │                                           │
│  /api/generate-readme ── rate-limit.ts                          │
│                       └── analyze-profile.ts (calculateScore)   │
│                                                                 │
│  All routes (except generate-readme) depend on:                 │
│    ├── rate-limit.ts                                            │
│    └── analyze-profile.ts (analyzeProfile + calculateScore)     │
└──────────────┬──────────────────────────────────────────────────┘
               │
               │  fetch() / simple-git
               ▼
┌─────────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                             │
│                                                                 │
│  GitHub REST API v3                                             │
│    ├── GET /users/{username}                                    │
│    ├── GET /users/{username}/repos?per_page=100                 │
│    └── GET /users/{username}/events/public?per_page=100         │
│                                                                 │
│  npm registry (for agent package)                               │
│  Vercel (hosting, edge cache, serverless functions)             │
│  @vercel/analytics (page views)                                 │
│  Sharp (SVG→PNG conversion for OG images)                       │
└─────────────────────────────────────────────────────────────────┘

Agent Dependencies (separate tree):

┌─────────────────────────────────────────────────────────────────┐
│  agent/src/index.ts                                             │
│    ├── config.ts → fs, path, dotenv                             │
│    ├── core/watcher.ts → chokidar, path                         │
│    ├── core/git-engine.ts → simple-git                          │
│    ├── core/cloud-connector.ts → socket.io-client               │
│    └── core/sync-queue.ts → fs, path                            │
└─────────────────────────────────────────────────────────────────┘

Chrome Extension / Userscript (standalone):

┌─────────────────────────────────────────────────────────────────┐
│  content.js / autodev-github-score.user.js                      │
│    └── fetch() → /api/analyze (AutoDev API)                     │
└─────────────────────────────────────────────────────────────────┘
```

---

## 8. Business Logic Summary

### 8.1 `calculateScore()` — The Scoring Algorithm

**Location:** `platform/src/lib/analyze-profile.ts:17-27`

**Input:**
```ts
{
  repoCount: number;    // total repos fetched from GitHub
  totalStars: number;   // sum of all repo stars
  eventCount: number;   // number of recent public events
  publicRepos: number;  // user's public repo count
  hasBio: boolean;      // whether user has a bio
}
```

**Algorithm:**

```
consistencyScore = min(100,
  (repoCount > 0    ? 30 : 0) +    // 30 pts — having repos at all
  (totalStars > 0   ? 20 : 0) +    // 20 pts — having any stars
  (eventCount > 10  ? 25 :         // 25 pts — active (10+ events)
   eventCount > 0   ? 10 : 0) +    // 10 pts — somewhat active
  (publicRepos > 5  ? 15 : 5) +    // 15 pts — many repos OR 5 for few
  (hasBio           ? 10 : 0)      // 10 pts — has a bio
)

overallScore = round((consistencyScore + min(100, totalStars * 2)) / 2)
```

**Assumptions:**
- Having repos is worth more (30) than having stars (20)
- Activity in last 90 days is key (events)
- Stars are weighted heavily in overall score (multiplied by 2)
- Bio completeness matters (10 pts)
- The two scores (consistency, stars) are averaged for final

**Edge cases:**
- New user with 1 repo and 0 stars: consistency=30+0+0+5+0=35, overall=(35+0)/2=17 or 18
- Power user with 100 repos, 5000 stars, active: consistency=30+20+25+15+10=100, overall=(100+100)/2=100
- User with 0 repos: consistency=0+0+0+0+0=0, overall=0

**Risk:**
- Stars are multiplied by 2 and capped at 100 — this means a user with 100 repos and 1 star gets (100 + min(100, 2))/2 = 51 while a user with 1 viral repo and 50000 stars ALSO gets 100. Stars dominate the overall score.
- No negative scoring for bad behavior (abandoned repos, copious forked repos, etc.)
- No distinction between original work and forked repos in scoring
- `repoCount` can differ from `publicRepos` due to pagination (API default is 30 per page, code uses `per_page=100` but doesn't handle pagination beyond 100)

### 8.2 `generateReadme()` — README Templates

**Location:** `platform/src/pages/api/generate-readme.ts:16-273`

**Three templates:**

1. **Minimal:** Simple greeting + stats bar + language badges + score badge + profile views
2. **Professional:** Capsule header wave + typing SVG animation + about section + tech stack + top languages graph + activity graph (github-readme-activity-graph) + streak stats + highlighted repos + recent activity + social badges + score badge
3. **Recruiter:** Wave header + professional summary table + stats table + languages + activity graph + top projects table (markdown table) + pinned repos + buy me a coffee link + score badge

**External dependencies for template rendering:**
- `capsule-render.vercel.app` — header wave image
- `readme-typing-svg.herokuapp.com` — typing animation
- `github-readme-stats.vercel.app` — stats cards, top languages, pinned repos
- `github-readme-activity-graph.vercel.app` — contribution graph
- `github-readme-streak-stats.herokuapp.com` — streak stats
- `komarev.com/ghpvc` — profile view counter
- `img.shields.io` — shields.io badges

**Assumptions:** All external services are available (SPOF risk — if any goes down, README images break)

### 8.3 `analyzeProfile()` — Full Profile Fetch + Transform

**Location:** `platform/src/lib/analyze-profile.ts:29-117`

**Steps:**
1. Three parallel GitHub API calls (user, repos, events)
2. Handle 403 (rate limit) and non-200 (user not found)
3. Calculate aggregates: totalStars, totalForks, repoVolume
4. Build language map: count repos per language → percentage → sort desc
5. Build topRepos: filter out forks → sort by stars desc → take 5 → score each
6. Calculate repo score: `stars*10 + forks*5 + (description?10:0) + (topics.length*5)`
7. Call `calculateScore()` for consistency + overall scores
8. Generate recommendations (6 rules, all threshold-based)

**Recommendation rules:**
- No bio → "Add a bio to your GitHub profile"
- No website → "Add a website/blog link to your profile"
- Less than 3 original repos → "Create more original repositories (not forks)"
- No repo with description >20 chars → "Add descriptions to your repositories"
- Less than 5 stars → "Share your projects to get more stars"
- Less than 10 events → "Be more active — commit more frequently"

### 8.4 `badgeSVG()` — SVG Badge Render

**Location:** `platform/src/pages/api/badge.ts:17-44`

**Tiers:**
- Score >= 70: Green (#4caf50), label "AutoDev Great"
- Score >= 40: Orange (#ff9800), label "AutoDev Okay"
- Score < 40: Red (#f44336), label "AutoDev Needs Work"

**Format:** Classic "shields.io"-style badge with shadow gradient overlay. Widths calculated dynamically from text length.

### 8.5 `rateLimit()` — Per-IP Rate Limiting

**Location:** `platform/src/lib/rate-limit.ts`

**Architecture:** In-memory Map with keys like `analyze:1.2.3.4`, `badge:1.2.3.4`. 60-second cleanup interval (setInterval).

**Issue:** Rate limiting is **per-Vercel-instance**, not global. Vercel runs multiple serverless instances, so each instance has its own rate limit map. A user hitting different instances bypasses the limit N times (one per instance).

---

## 9. Product Architecture

### What Is This Product?

AutoDev is a free, no-login, no-database GitHub profile analysis platform for individual developers. It provides:
1. **Scored profile analysis** (vanity metric with shareable badge)
2. **README generation** (3 professional templates)
3. **CLI agent** (git automation)
4. **Browser extension/userscript** (inline score on GitHub profiles)

### Who Is It For?

**Primary user:** Individual developers who want to see how their GitHub profile looks to recruiters, and who want a nicer README.

**Secondary user:** Curious developers who see a badge on someone's profile and click through to check their own score.

**Realistically:** The user is solving "I want to know my GitHub score" — a curiosity, not a pain. No evidence of recruiter adoption, no evidence of hiring manager usage.

### Core Value Proposition

> "Enter any GitHub username → get a score/100 with stats, languages, and recommendations."

### Main User Journey

```
Land on homepage → Enter username → See score → Share badge on LinkedIn/X
                                                                     ↓
                                              Come back to check score changes
```

### Activation Event

Entering a GitHub username and seeing a score.

### Retention Mechanism

- Score changes over time (user must remember to check back)
- Badge on profile shows latest score automatically
- No email, no push notification, no score change alerts

### Growth Loop

```
Badge on GitHub profile → Visitor sees it → Clicks → Analyzes own profile → Gets own badge → Repeats
```

Viral coefficient estimated < 0.1 (each user brings <0.1 new users).

### Monetization Strategy

None implemented. "Buy me a coffee" link exists. Revenue: $0.

---

## 10. Deployment Architecture

### Build Process

```
agent/:
  tsc → outputs to dist/ (CommonJS, ES2022)
  npm publish → pushes to registry

platform/:
  next build → outputs .next/ (SSG for sitemap, serverless for API routes)
  vercel --prod → deploys to Vercel
```

### Runtime

| Component | Hosting | Scope | Cold Start |
|-----------|---------|-------|------------|
| Next.js pages | Vercel Edge + Serverless | Global CDN | ~50-200ms |
| API routes | Vercel Serverless Functions | Global CDN | ~50-200ms + GitHub API latency (1-5s) |
| Agent (CLI) | User's machine | Local | Instant |
| Chrome extension | User's browser | Browser | Instant |
| Userscript | User's Tampermonkey | Browser | Instant |

### Caching

| Endpoint | Cache Header | Duration | Risk |
|----------|-------------|----------|------|
| `/api/analyze` | `s-maxage=300` | 5 min | Tolerable — scores don't change fast |
| `/api/badge` | `s-maxage=3600` | 1 hour | **STALE DATA** — score could be 1 hour behind |
| `/api/og` | `s-maxage=3600` | 1 hour | Fine — OG images are transient |
| `/api/leaderboard` | `s-maxage=600` | 10 min | Fine — leaderboard doesn't change fast |
| `/api/generate-readme` | `s-maxage=300` | 5 min | Fine — README generation is one-time |

### Headers

Managed at the API route level via `res.setHeader()`. No global header configuration in `next.config.js` or `vercel.json`. The only config in `vercel.json` is `{ "framework": "nextjs" }`.

### SEO

| Feature | File | Status |
|---------|------|--------|
| Sitemap | `sitemap.xml.ts` | ✅ Dynamic, 4 pages |
| Robots | `public/robots.txt` | ✅ Points to sitemap |
| Canonical URLs | Each page in `<Head>` | ✅ 4 pages |
| JSON-LD Schema | `index.tsx` | ✅ SoftwareApplication schema |
| Meta descriptions | Each page in `<Head>` | ✅ All 4 pages |
| Meta keywords | `index.tsx`, `leaderboard.tsx`, `readme-generator.tsx` | ✅ |
| OG images | `api/og.ts` | ✅ Dynamic per user |
| Google Search Console | `index.tsx` meta tag | ✅ Verified |

### Rate Limiting

| Endpoint | Limit | Key Pattern |
|----------|-------|-------------|
| `/api/analyze` | 30/min/IP | `analyze:{ip}` |
| `/api/badge` | 60/min/IP | `badge:{ip}` |
| `/api/generate-readme` | 20/min/IP | `generate-readme:{ip}` |
| `/api/leaderboard` | 20/min/IP | `leaderboard:{ip}` |
| `/api/og` | 30/min/IP | `og:{ip}` |

**Known issue:** Rate limiting is per-instance, not global. Vercel serverless instances multiply the effective limit.

### Analytics

`@vercel/analytics/react` — injected via `_app.tsx`. Tracks page views only. No custom event tracking.

---

## 11. Environment Variables

| Variable | Required | Used By | Default | What Breaks If Missing |
|----------|----------|---------|---------|----------------------|
| `GITHUB_TOKEN` | No | `analyze-profile.ts`, `generate-readme.ts` | Empty string | GitHub API rate limited to 60 req/hr (unauthenticated) instead of 5000 req/hr |
| `NEXT_PUBLIC_BASE_URL` | No | All pages (canonical/OG URLs), badge, share links | `https://autodev-kappa.vercel.app` | OG images, canonical URLs, and share links use default domain |
| `AUTODEV_API_URL` | No (agent only) | `agent/src/config.ts` | `http://localhost:3000` | Cloud connector uses wrong URL (no-op anyway without token) |
| `AUTODEV_AUTH_TOKEN` | No (agent only) | `agent/src/config.ts` | Empty string | Cloud connector runs in offline mode (no-op) |

**Risk:** No validation at build time. Missing `GITHUB_TOKEN` silently reduces rate limit 83x.

---

## 12. User Journey Map

```
Discovery (how users find AutoDev)
├── GitHub search (repo README)
├── npm search (autodev-agent)
├── Badge on someone's GitHub profile
├── Chrome Web Store (unpublished)
├── Tampermonkey userscript (free alternative)
├── Product Hunt (launched July 5, 8 upvotes)
└── Direct link / word of mouth

First Visit
├── Homepage → hero "Your Code. Auto-Piloted." → search input
├── Dashboard → enter username → see analysis
├── Leaderboard → browse top profiles
└── README Generator → generate profile README

Analysis Experience
├── 3-10 seconds loading (live GitHub API fetch)
├── See score/100 + stats + languages + recommendations
├── Share on LinkedIn, X, or copy badge
├── Navigate to full dashboard for deeper analysis
└── Generate README with selected style

Return Visit
├── Type username again (no persistence except localStorage on dashboard)
├── Or navigate via badge click on GitHub profile
├── Or navigate from saved bookmark
└── Score may have changed

Conversion Paths (none implemented)
├── Buy me a coffee (donation)
└── Chrome Web Store publish (blocked by $5)
```

---

## 13. Growth Loop

### Current Loop (Weak, coefficient < 0.1)

```
Analyze Profile → Get Score → Share Badge → Others See It → Analyze Their Profile → Repeat
```

**Bottlenecks:**
1. Badge must be on a GitHub profile README (low adoption)
2. Profile README must be visited by someone else
3. Visitor must click badge (low CTR)
4. Visitor must enter their own username (high friction)
5. No retention mechanism to bring users back

### Chrome Extension Loop (Not yet activated)

```
Install extension → Browse GitHub → See scores automatically → Click → Analyze → Install badge → Repeat
```

**Blocked by:** $5 Chrome Web Store fee.

---

## 14. Technical Debt

### Critical

| Issue | Location | Impact | Suggested Fix |
|-------|----------|--------|---------------|
| **Three copies of type definitions** | `shared/types/index.ts`, `agent/src/shared/types.ts`, `platform/src/shared/types.ts` | Type drift over time. Fix in one place, breaks others. | Publish as npm package or use TypeScript project references + paths |
| **Rate limiting is per-Vercel-instance** | `rate-limit.ts` | Global state not shared across serverless instances. User bypasses limit by hitting different instances. | Use Vercel KV or external store (but costs money). Accept current behavior. |
| **Duplicate GitHub API fetching** | `analyze-profile.ts` vs `generate-readme.ts:305-309` | Same fetch logic reimplemented. Generate-readme has its own `fetchJSON` helper. | Extract shared GitHub fetch layer |
| **Duplicate language calculation** | `analyze-profile.ts:57-64` vs `generate-readme.ts:319-324` | Same language aggregation logic duplicated. | Extract shared utility |
| **Badge cache is 1 hour** | `badge.ts:69` | `s-maxage=3600` means score badge is up to 1 hour stale. User shows old score. | Reduce to `s-maxage=300` (but trade off GitHub API calls) |

### Medium

| Issue | Location | Impact | Suggested Fix |
|-------|----------|--------|---------------|
| **Empty utils directory** | `agent/src/utils/` | Dead directory, nothing in it | Remove it |
| **No pagination for GitHub repos** | `analyze-profile.ts` | `per_page=100` but users with >100 repos are truncated. Language stats and repo counts will be WRONG for power users. | Add pagination loop |
| **Score is star-dominated** | `calculateScore()` | A user with 1 viral repo and 50K stars gets 100/100. Quality not measured. | Add weighted factors for code quality, documentation, issue resolution |
| **generate-readme.ts has full GitHub fetch logic** | `generate-readme.ts` | Instead of reusing `analyzeProfile()`, it reimplements the same fetch + transform | Refactor to use `analyzeProfile()` or a shared data fetcher |
| **No input sanitization beyond type check** | All API routes | Username passed directly to GitHub API URL (safe because GitHub validates, but still poor practice) | Add regex validation: `/^[a-zA-Z0-9_-]+$/` |
| **localStorage persistence only on dashboard** | `dashboard.tsx:47` | Homepage analysis result disappears on refresh. No history. | Add localStorage for last analyzed username on homepage too |

### Low

| Issue | Location | Impact | Suggested Fix |
|-------|----------|--------|---------------|
| **PHBanner still showing** | `PHBanner.tsx` | Product Hunt launch was days ago. Banner takes space for no reason. | Remove or add dismissible state |
| **"v0.1.0" badge on hero** | `index.tsx:180` | Hardcoded version | Use package.json version or env var |
| **OG image lacks caching of analysis** | `og.ts` | Every OG image fetch hits GitHub API + Sharp conversion | Cache the generated PNG |
| **Leaderboard only has 12 hardcoded users** | `leaderboard.ts:5-9` | Not a real leaderboard, just 12 curated profiles | Accept as-is since no database |
| **Missing error boundaries** | All pages | Any render crash = white screen | Add React error boundaries per page |
| **No TypeScript strict for shared types** | `shared/types/index.ts` | Stored outside tsconfig scope, may not be type-checked | Include in platform/tsconfig.json |
| **`autodev_last_checked` localStorage in userscript** | `autodev-github-score.user.js:66` | Prevents re-fetching same profile, but never clears | Could miss score changes on revisit |

---

## 15. Things Never To Break

1. **`/api/analyze`** — Every feature depends on this. If it breaks, the entire product breaks.
2. **`calculateScore()`** — Changes here affect badge colors, leaderboard rankings, OG images, and recommendations.
3. **Badge SVG rendering** — The badge is the viral loop. If it breaks or shows wrong data, growth stops.
4. **`s-maxage` headers** — Removing or reducing caching could exhaust GitHub API rate limits on a $0 budget.
5. **Rate limiting** — Removing it could exhaust GitHub API limits from abuse, or rack up Vercel function costs.
6. **Vercel deployment** — No fallback hosting. If Vercel is down, product is down.
7. **Base URL consistency** — `NEXT_PUBLIC_BASE_URL` must be consistent across all pages, API routes, and external links.

## 16. Things Safe To Change

1. **README template content** — Templates are pure string generation, no side effects
2. **PHBanner** — Can be removed anytime
3. **Recommendation rules** — Adding/removing/rewording recommendations doesn't affect core analysis
4. **Leaderboard FEATURED list** — Adding more hardcoded profiles is safe
5. **Badge color scheme** — Visual change only, no logic impact
6. **Score tiers (green/orange/red thresholds)** — Cosmetic, doesn't change score calculation
7. **OG fallback template** — Only renders on error
8. **SEO meta tags** — Can be optimized without risk
9. **Comments and documentation** — Zero risk
10. **Agent CloudConnector** — It's already a no-op without auth token

---

## 17. Unknown Areas

| Question | Why It's Unknown | How to Discover |
|----------|-----------------|-----------------|
| How many real users does AutoDev have? | No auth, no database, only Vercel Analytics (25 visitors) | Check Vercel Analytics dashboard |
| How many badge installs exist on GitHub? | No tracking of badge usage | Search GitHub for `autodev-kappa.vercel.app/api/badge` |
| How many score checks happen per day? | No event tracking | Check Vercel Analytics + add custom analytics event |
| What percentage of visitors analyze a profile? | No funnel tracking | Add `onClick` event to analyze button |
| Do users return? | No retention tracking, only localStorage on dashboard | Check Vercel Analytics returning visitor count |
| What is the Chrome extension score calculation's fallback? | Uses `overallScore` from API but API may return error | Already handles null at call site |
| Is the agent actually used by anyone? | 609 npm downloads/week but no telemetry | Unknown — no analytics in agent |
| Is `generate-readme.ts` fetchJSON different from `analyzeProfile`? | Need to compare implementations | Already identified as duplicate |
| What happens if GitHub API changes v3 endpoints? | All external API calls are hardcoded to v3 | Monitor GitHub changelog |
| Does Sharp work on all Vercel regions? | Sharp is a native module, may fail on some architectures | Vercel supports it, fallback SVG handles errors |

---

## 18. Scoring Formula Reference (Copy-Paste Ready)

```typescript
calculateScore({ repoCount, totalStars, eventCount, publicRepos, hasBio }) {
  consistencyScore = Math.min(100, Math.round(
    (repoCount > 0    ? 30 : 0) +   // Having repositories
    (totalStars > 0   ? 20 : 0) +   // Having any stars
    (eventCount > 10  ? 25 :        // Active (10+ events)
     eventCount > 0   ? 10 : 0) +    // Somewhat active
    (publicRepos > 5  ? 15 : 5) +   // Many repos
    (hasBio           ? 10 : 0)     // Has profile bio
  ));

  overallScore = Math.round(
    (consistencyScore + Math.min(100, totalStars * 2)) / 2
  );

  return { consistencyScore, overallScore };
}
```

**Minimum score:** ~0 (no repos, no stars, no events, no bio)
**Typical new user:** ~18-35 (1 repo, 0 stars, 0 events, maybe bio)
**Active user:** ~50-70 (few repos, some stars, occasional activity)
**Power user:** ~80-100 (many repos, many stars, active, complete profile)
**Maximum score:** 100 (cap at both consistency and star dimensions)

---

## 19. Quick Reference — All API Endpoints

| Method | Path | Rate Limit | Cache | Purpose |
|--------|------|-----------|-------|---------|
| GET | `/api/analyze?username=string` | 30/min/IP | 5 min | Full profile analysis |
| GET | `/api/badge?username=string` | 60/min/IP | 1 hour | SVG score badge |
| GET | `/api/generate-readme?username=string&style=string` | 20/min/IP | 5 min | README markdown preview |
| POST | `/api/generate-readme` | 20/min/IP | None | README file download |
| GET | `/api/leaderboard?q=string` | 20/min/IP | 10 min | Ranked profiles |
| GET | `/api/og?username=string` | 30/min/IP | 1 hour | Social OG image (PNG) |
| GET | `/sitemap.xml` | None | SSR | Dynamic XML sitemap |
