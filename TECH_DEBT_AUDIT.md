# Technical Debt Audit — AutoDev

> Based on full reverse engineering of 37 source files across 4 projects.
> Rules: No UI changes, no new features, no dependency changes, no scoring changes, backward-compatible APIs.

---

## Priority Summary

| Priority | Count | Issues |
|----------|-------|--------|
| CRITICAL | 4 | Duplicate types (3 copies), duplicate GitHub fetch + language logic, `generate-readme.ts` reimplements `analyzeProfile` |
| HIGH | 5 | Dead code in agent (CloudConnector, SyncQueue reads, UserSession, hardcoded statuses), `langColors` in 3 places, `BASE_URL` in 8 places |
| MEDIUM | 6 | Empty `utils/`, broken `getRelativePath`, null-rendering sitemap, stale PHBanner, missing input validation, hardcoded version string |
| LOW | 3 | No pagination for >100 repos, per-instance rate limiting, 1-hour badge cache |

---

## CRITICAL

### C-1: Three Copies of Identical Type Definitions

**Why it exists:** The `shared/` directory was created as a central types package, but the agent and platform both have their own local copies. Likely added during initial scaffold without cross-referencing.

**Risk:** When a type changes (e.g., `ProfileAnalysis` gains a new field), one copy gets updated and the others silently drift. The app compiles but sends/expects different shapes.

**Files affected:**
- `shared/types/index.ts` (67 lines)
- `agent/src/shared/types.ts` (67 lines, identical content)
- `platform/src/shared/types.ts` (26 lines, subset — only `ProfileAnalysis` + `RepoAnalysis`)

**All interfaces duplicated:**
- `AutoDevConfig` — in `shared/` and `agent/src/shared/`
- `WatchedRepo` — same
- `CommitEvent` — same
- `ProfileAnalysis` — ALL THREE files
- `RepoAnalysis` — ALL THREE files
- `AgentStatus` — in `shared/` and `agent/src/shared/`
- `UserSession` — in `shared/` and `agent/src/shared/`

**Estimated effort:** 1 hour

**Refactor plan:**
1. Select `shared/types/index.ts` as the canonical source of truth
2. Delete `agent/src/shared/types.ts`
3. Update `agent/src/index.ts` to import from `../../shared/types/index.ts` instead of `./shared/types`
4. Delete `platform/src/shared/types.ts`
5. Update `platform/src/lib/analyze-profile.ts` to import from `../../shared/types/index.ts`
6. Verify both agent and platform compile

**Note:** The agent's `tsconfig.json` has `rootDir: "./src"`. The import for `../../shared/types/index.ts` would be outside rootDir, which will fail. **Fix:** Change `rootDir` to `"../.."` in `agent/tsconfig.json` and adjust `include`/`exclude`. Or publish `shared` as a separate package. The simplest fix: use `tsconfig.json` paths mapping in both agent and platform to alias `@shared` to the `shared/` directory.

---

### C-2: `generate-readme.ts` Duplicates the Entire GitHub Fetch + Language Logic

**Why it exists:** The README generator was written as a standalone API route. Instead of importing `analyzeProfile()` from `analyze-profile.ts`, it reimplements:
- GitHub API fetch (`fetchJSON` helper at line 9-14)
- User/repos/events fetch (lines 305-309)
- Language aggregation (lines 319-324)
- Top repos calculation (lines 326-334)
- Score calculation (lines 357-363, imports `calculateScore` but not `analyzeProfile`)

**Risk:** Any change to how data is fetched or transformed must be made in two files. Already diverged: `generate-readme.ts` fetches only 30 events vs 100 in `analyze-profile.ts`, and slices languages to 8 instead of all. These inconsistencies will grow.

**Files affected:**
- `platform/src/pages/api/generate-readme.ts` (lines 9-14, 305-323)
- `platform/src/lib/analyze-profile.ts`

**Estimated effort:** 2 hours

**Refactor plan:**
1. Import `analyzeProfile` from `../../lib/analyze-profile` in `generate-readme.ts` (already imported from `leaderboard.ts`, `badge.ts`, `og.ts` — same pattern)
2. Replace the 3 manual fetches (user, repos, events) + language calc + top repos calc with a single call to `analyzeProfile(username)`
3. Extract `ProfileAnalysis` into the data needed for README generation:
   - `analysis.topRepos` exists but lacks `url` and `topics` fields needed by README templates
   - `analysis.pinned` doesn't exist in `ProfileAnalysis`
   - `analysis.recentActivity` doesn't exist in `ProfileAnalysis`
4. **Problem:** `analyzeProfile()` doesn't return `url`, `topics`, `pinned`, `recentActivity` — these are README-specific fields. **Solution:** Either:
   a. Add these fields to the shared `ProfileAnalysis` type (affects all consumers)
   b. Call `analyzeProfile()` for the core data + add a second lightweight fetch in `generate-readme.ts` for only the extra fields (pinned topics, recent activity)
   c. Create a new `fetchReadmeData()` helper that extends `analyzeProfile()` data

**Recommendation:** Option (b) — keep the README-specific fetch separate but small. The core analysis (score, languages, repos, stars, forks) comes from `analyzeProfile()`. The extra fields (pinned topics, recent activity markdown) are fetched in a focused helper.

---

### C-3: `langColors` Map Defined in Three Places

**Why it exists:** The language color mapping is needed wherever languages display with colored dots/bars. Each file defines its own copy.

**Risk:** Adding a new language color in one file but not the others causes inconsistent rendering (missing language shows gray in one place, defined in another).

**Files affected:**
- `platform/src/pages/index.tsx` (lines 30-37, `langColors` record)
- `platform/src/pages/dashboard.tsx` (lines 6-13, `langColors` record)
- `platform/src/pages/api/generate-readme.ts` (lines 275-285, `getLangColor` function)

**Estimated effort:** 30 minutes

**Refactor plan:**
1. Create `platform/src/lib/lang-colors.ts` exporting `LANG_COLORS: Record<string, string>` and `getLangColor(name: string): string`
2. Import in `index.tsx`, `dashboard.tsx`, and `generate-readme.ts`
3. Delete the inline definitions

---

### C-4: `getColor` / `getLabel` / `getScoreColor` — Score Color Logic in Three Places

**Why it exists:** The score-to-color mapping (>=70 green, >=40 yellow/orange, <40 red) is independently reimplemented.

**Risk:** Inconsistency if one file changes thresholds.

**Files affected:**
- `platform/src/pages/api/badge.ts` — `getColor()` and `getLabel()` (lines 5-15)
- `platform/src/pages/api/generate-readme.ts` — `getScoreColor()` (lines 287-291)
- `platform/src/pages/api/og.ts` — inline `score >= 70 ? '#4caf50' : ...` (line 37)

**Estimated effort:** 20 minutes

**Refactor plan:**
1. Add `getScoreLabel()`, `getScoreHex()`, and `getScoreShieldsColor()` to `platform/src/lib/analyze-profile.ts` or a new `platform/src/lib/score.ts`
2. Import and use in `badge.ts`, `generate-readme.ts`, `og.ts`
3. Delete inline definitions

---

## HIGH

### H-1: CloudConnector Is Dead Code

**Why it exists:** The agent was architected with a Socket.IO cloud sync feature. But the required `AUTODEV_AUTH_TOKEN` is never configured (`.env.example` shows `your_token_here`). Without a token, `CloudConnector.connect()` prints "No auth token configured. Running in offline mode." and never connects. Every method becomes a no-op.

**Evidence:**
- `agent/src/config.ts:46-48` — `getAuthToken()` returns empty string by default
- `agent/src/core/cloud-connector.ts:10-14` — exits immediately when no token
- `agent/src/index.ts:32-33` — `cloud.connect()` called but does nothing
- `agent/src/index.ts:16` — `cloud.sendStatus(status)` called every 60s but does nothing

**Files affected:**
- `agent/src/core/cloud-connector.ts` (69 lines)
- `agent/src/index.ts` (lines 16, 32-33, 38, 53-58)
- `agent/package.json` — `socket.io-client` dependency (can be removed)

**Estimated effort:** 30 minutes

**Refactor plan:**
1. Remove `agent/src/core/cloud-connector.ts`
2. Remove `agent/src/index.ts` lines 16, 32-33, 38, and the `setInterval` block (lines 49-58)
3. Remove `socket.io-client` from `agent/package.json` dependencies
4. Run `npm install` to clean up

---

### H-2: SyncQueue Is Dead Code (Writes but Never Reads)

**Why it exists:** `SyncQueue` is instantiated and files are written to disk (`~/.autodev/queue.json`) but no code ever calls `dequeue()`, `peek()`, `getAll()`, or `clear()`. The only consumer would be the `CloudConnector`, which is also dead.

**Evidence:**
- `agent/src/index.ts:17` — `const syncQueue = new SyncQueue()` — instantiated
- `agent/src/index.ts` — `syncQueue` never referenced again after creation
- `agent/src/core/sync-queue.ts:26-34` — `enqueue()` writes to disk
- `agent/src/core/sync-queue.ts:36-41` — `dequeue()` is never called
- `agent/src/core/sync-queue.ts:52-55` — `clear()` is never called

**Files affected:**
- `agent/src/core/sync-queue.ts` (71 lines)
- `agent/src/index.ts` (line 17)

**Estimated effort:** 15 minutes

**Refactor plan:**
1. Remove `agent/src/core/sync-queue.ts`
2. Remove line 17 from `agent/src/index.ts`

---

### H-3: `UserSession` Interface Is Defined but Never Used

**Why it exists:** Leftover from an earlier version that planned authentication/sessions. The platform has no auth system, no database, no sessions.

**Evidence:**
- `shared/types/index.ts:62-67` — `UserSession` with `id`, `githubUsername`, `accessToken`, `plan`
- `agent/src/shared/types.ts:62-67` — same
- **Not imported anywhere in platform or agent runtime code**

**Files affected:**
- `shared/types/index.ts` (6 lines)
- `agent/src/shared/types.ts` (6 lines)

**Estimated effort:** 5 minutes

**Refactor plan:**
1. Remove `UserSession` from `shared/types/index.ts`
2. Will be automatically resolved when types are consolidated (C-1)

---

### H-4: `AgentStatus.running` and `commitsToday` Are Hardcoded

**Why it exists:** The status heartbeat sends placeholder values that were never wired to real metrics.

**Evidence:**
- `agent/src/index.ts:50-56` — `running: true`, `commitsToday: 0` are hardcoded

**Files affected:**
- `agent/src/index.ts` (lines 50-56)

**Estimated effort:** 5 minutes (but see H-1 — the entire `setInterval` is dead code because CloudConnector never connects)

**Refactor plan:** This block is removed as part of H-1 (the CloudConnector removal deletes the `setInterval` that uses `AgentStatus`).

---

### H-5: `BASE_URL` Defined Separately in Every Page

**Why it exists:** Each page defines its own local constant rather than importing a shared one.

**Evidence:**
- `platform/src/pages/index.tsx:28` — `const BASE_URL = ...`
- `platform/src/pages/dashboard.tsx:15` — `const BASE_URL = ...`
- `platform/src/pages/leaderboard.tsx:7` — `const BASE_URL = ...`
- `platform/src/pages/readme-generator.tsx:5` — `const BASE_URL = ...`
- `platform/src/pages/api/generate-readme.ts:57` — `const BASE_URL = ...`
- `platform/src/pages/api/og.ts:6` — `const BASE_URL = ...`
- `platform/src/pages/api/badge.ts:69` — uses `NEXT_PUBLIC_BASE_URL` inline (in default badge URL)

**Risk:** If the domain changes, all 7 locations must be updated. One miss causes broken canonical URLs, OG images, or share links.

**Estimated effort:** 15 minutes

**Refactor plan:**
1. Add to `platform/src/lib/` a file (e.g., `platform/src/lib/config.ts`):
   ```ts
   export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://autodev-kappa.vercel.app';
   ```
2. Import `BASE_URL` in all 7 locations
3. Delete the local constants

---

## MEDIUM

### M-1: Empty `agent/src/utils/` Directory

**Why it exists:** Scaffolded during project initialization, never populated.

**Files affected:**
- `agent/src/utils/` (empty directory, `.gitkeep` not present)

**Estimated effort:** 1 minute

**Refactor plan:**
1. Delete `agent/src/utils/`

---

### M-2: `getRelativePath()` Doesn't Make Paths Relative

**Why it exists:** The method is named to suggest it returns a relative path, but it returns the full `filePath` unchanged. It iterates through repos looking for a prefix match, then returns the full path anyway. The loop always returns the original `filePath` regardless.

**Evidence:**
- `agent/src/core/watcher.ts:126-133`
```typescript
private getRelativePath(filePath: string): string {
    for (const repo of this.config.repos) {
      if (filePath.startsWith(repo.localPath)) {
        return filePath;  // Returns the FULL path, not relative
      }
    }
    return filePath;
  }
```

**Impact:** None on behavior — the return value is the same as the input. But the function is misleading and could cause confusion during maintenance. The `relativePath` variable at line 72 stores the unchanged full path.

**Estimated effort:** 30 minutes (if fixing: replace with actual `path.relative()`)

**Refactor plan:**
- Option A (simplest): Rename to `normalizePath()` or inline the filePath directly and remove the function
- Option B (correct fix): Use `path.relative(repo.localPath, filePath)` to produce truly relative paths for commit messages

Note: Option B changes the commit message content (currently shows full paths). Since `commitMessagePattern` uses `{files}` which is populated by `getRelativePath()` result, this is technically a behavior change. **Recommendation:** Option A to stay safe — remove the function and use `filePath` directly.

---

### M-3: `sitemap.xml.ts` Renders a Null React Component

**Why it exists:** The sitemap is generated entirely in `getServerSideProps`, which writes XML directly to the response. The React component `Sitemap()` at line 30 returns `null` — it never renders. Next.js recommends this pattern for API-like pages.

**Files affected:**
- `platform/src/pages/sitemap.xml.ts:30` — `export default function Sitemap() { return null; }`

**Estimated effort:** 1 minute (acknowledge only — this is a Next.js convention, not a real bug)

**Refactor plan:** No change needed. This is standard Next.js pattern. Record in PROJECT_BRAIN as known pattern.

---

### M-4: Hardcoded Version String on Homepage

**Why it exists:** Version is hardcoded in JSX rather than read from `package.json`.

**Evidence:**
- `platform/src/pages/index.tsx:180` — `v0.1.0 — npx autodev-agent`
- `platform/package.json:3` — `"version": "0.2.0"`

**Impact:** The hero shows `v0.1.0` but the actual package is `v0.2.0`. Misleading.

**Estimated effort:** 10 minutes

**Refactor plan:**
1. Import `package.json` version or use `process.env.NEXT_PUBLIC_APP_VERSION`
2. Replace hardcoded `"v0.1.0"` with the dynamic value

**To keep zero dependencies:** Just update the string to `"v0.2.0"` manually and add a comment to update on version bumps.

---

### M-5: Product Hunt Banner Still Shows

**Why it exists:** The PHBanner was added for the July 5 launch and has no dismiss mechanism or expiration.

**Impact:** Takes vertical space on every page. If the launch is over, the banner looks stale.

**Files affected:**
- `platform/src/components/PHBanner.tsx` (28 lines)

**Estimated effort:** 15 minutes (adds a close button) or 5 minutes (remove entirely)

**Refactor plan:**
- Option A: Remove the banner (simplest, no behavior change since PH launch is over)
- Option B: Add a `localStorage`-based dismiss mechanism

---

### M-6: No Input Sanitization on Username

**Why it exists:** Username is passed directly to GitHub API URLs after only a `typeof string` check. GitHub validates usernames on their side, but the pattern is poor practice.

**Evidence:**
- `platform/src/pages/api/analyze.ts:13` — `const { username } = req.query;`
- `platform/src/pages/api/analyze.ts:15` — `typeof username !== 'string'`
- All other API routes use the same pattern

**Impact:** Low — GitHub API rejects invalid usernames. But if a future version stores usernames, injection risk exists.

**Estimated effort:** 15 minutes

**Refactor plan:**
1. Create a shared validation helper:
```typescript
export function validateUsername(username: unknown): string | null {
  if (typeof username !== 'string') return null;
  if (!/^[a-zA-Z0-9][a-zA-Z0-9-]*$/.test(username)) return null;
  if (username.length > 39) return null;
  return username;
}
```
2. Use in all 5 API routes before passing to `analyzeProfile()`
3. Return 400 with clear error message on invalid username

---

## LOW

### L-1: No Pagination for Repos > 100

**Why it exists:** GitHub API defaults to 30 repos per page. The code uses `per_page=100` but never follows `Link` headers for subsequent pages.

**Evidence:**
- `platform/src/lib/analyze-profile.ts:34` — `per_page=100`
- `platform/src/pages/api/generate-readme.ts:307` — same

**Impact:** Users with >100 repos get truncated language stats, wrong repo count, wrong star count, and potentially wrong score. Power users (the very audience AutoDev targets) are silently given incomplete data.

**Note:** This IS a behavior change for power users. The scoring algorithm would produce a different result if all repos were included. **However**, the instructions say "do NOT change public APIs" and "do NOT change the scoring algorithm" — fixing pagination changes the score for users with >100 repos. This is technically a behavior change.

**Recommendation:** Leave as-is until the product is actively maintained, then fix with proper pagination and document that scores for users with >100 repos may be incomplete.

---

### L-2: Per-Instance Rate Limiting

**Why it exists:** Vercel runs multiple serverless function instances. The in-memory Map in `rate-limit.ts` is local to each instance. A user hitting 3 different instances gets 3x the intended rate limit.

**Impact:** Rate limiting is N times less effective (where N = concurrent Vercel instances). No $0 fix exists (would require Vercel KV, Redis, or external store).

**Recommendation:** Document as known limitation. Accept current behavior.

---

### L-3: One-Hour Badge Cache

**Why it exists:** `badge.ts:69` sets `s-maxage=3600` (1 hour) to reduce GitHub API calls. The 5-minute cache on `analyze.ts` is stricter.

**Impact:** A badge on a GitHub profile README can show a score that's up to 1 hour stale. If a user commits new code, their badge doesn't update for up to an hour.

**Trade-off:** Reducing to `s-maxage=300` (5 min) would increase GitHub API calls by 12x for the badge endpoint. On free GitHub API (60 req/hr unauthenticated), 5-minute badge cache for 12 active users would exhaust the limit.

**Recommendation:** Keep 1-hour cache. Document as intentional trade-off.

---

## Unchanged (Known Issues from PROJECT_BRAIN — No Action Required)

| Issue | Reason for No Action |
|-------|---------------------|
| Star-dominated scoring formula | Explicitly forbidden by rules |
| No database / no auth / no login | Product design choice |
| No retention mechanism | Product design choice (and would be a feature) |
| `dist/` not in agent `.gitignore` | Check if `dist/` is tracked; if not, no change needed |
| OG image fetches analysis on every request | Would require caching layer (paid infra) |
| `generate-readme.ts` `fetchJSON` helper | Removed as part of C-2 refactor |

---

## Summary of Changes

| ID | Issue | Priority | Files | Effort | Type |
|----|-------|----------|-------|--------|------|
| C-1 | 3 copies of types | CRITICAL | 5 | 1h | Merge + delete |
| C-2 | Duplicate GitHub fetch + lang calc | CRITICAL | 2 | 2h | Merge + refactor |
| C-3 | `langColors` in 3 places | CRITICAL | 4 | 30m | Extract shared |
| C-4 | Score color logic in 3 places | CRITICAL | 3 | 20m | Extract shared |
| H-1 | CloudConnector dead code | HIGH | 3 | 30m | Remove file + package dep |
| H-2 | SyncQueue dead code (writes only) | HIGH | 2 | 15m | Remove file |
| H-3 | `UserSession` unused interface | HIGH | 2 | 5m | Delete (bundled with C-1) |
| H-4 | Hardcoded AgentStatus values | HIGH | 1 | 5m | Delete (bundled with H-1) |
| H-5 | `BASE_URL` in 7 places | HIGH | 7 | 15m | Extract shared |
| M-1 | Empty `utils/` dir | MEDIUM | 1 | 1m | Delete directory |
| M-2 | `getRelativePath` is misleading | MEDIUM | 1 | 30m | Rename or inline |
| M-3 | Sitemap returns null component | MEDIUM | 1 | 1m | No change (Next.js convention) |
| M-4 | Hardcoded version string | MEDIUM | 1 | 10m | Fix string or env var |
| M-5 | PHBanner still showing | MEDIUM | 1 | 15m | Remove or add dismiss |
| M-6 | No input validation | MEDIUM | 5 | 15m | Add validation helper |
| L-1 | No pagination >100 repos | LOW | 2 | — | Deferred (behavior change) |
| L-2 | Per-instance rate limiting | LOW | 1 | — | No $0 fix |
| L-3 | 1-hour badge cache | LOW | 1 | — | Intentional trade-off |

**Total files touched:** ~22
**Total estimated effort:** ~6 hours
**Files deleted:** 3 (cloud-connector.ts, sync-queue.ts, utils/)
**Files created:** 3 (lang-colors.ts, score.ts, config.ts)
**Existing files modified:** ~16
