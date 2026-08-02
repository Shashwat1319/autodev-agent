# GitHub Repository Audit — AutoDev (autodev-agent)

**Audited:** 2026-08-02 · **Repository:** https://github.com/Shashwat1319/autodev-agent
**Method:** live GitHub API + remote tree + npm registry + local codebase comparison (v1.0.0)

**Auditor's verdict in one sentence:** This is a well-engineered product (30 passing tests, CI, security headers, MIT license, handover docs) hiding behind a repository that is **2–3 weeks out of date, unlicensed, and socially invisible** — it presents as a student project while the local codebase is open-source-tool grade.

---

## Critical Context: The Repo Is Behind the Code

| Item | Live on GitHub | Locally (v1.0.0, uncommitted) |
|---|---|---|
| Last push | 2026-07-24 | — |
| README | Old, 4.2 KB | New, 8.9 KB (OG hero, roadmap, security table) |
| LICENSE (MIT) | **Missing** (API: `license: null`) | ✅ Present |
| `.github/` (CI, issue templates, PR template, dependabot) | **Missing** | ✅ Present |
| CONTRIBUTING / SECURITY / CODE_OF_CONDUCT | **Missing** | ✅ Present |
| CHANGELOG.md | Missing | ✅ Present |
| Release | v0.1.4 (Jul 8) | v1.0.0 ready |
| npm | 0.1.3 (1.0.1 not published) | 1.0.1 ready (postinstall + `--score`) |

**This single fact dominates every section below.** Every trust fix has been built and then left on a local disk. The #1 ROI move is not a new feature — it is `git push`.

---

## 1. README (of what visitors currently see, with local v2 noted)

| Section | Score | Why |
|---|---|---|
| First impression | 6/10 | Badge row is solid; but no hero image. Local v2 has a dark-mode-aware OG hero — 9/10 once pushed |
| Hero | 6/10 | Clear tagline, three badges. No visual hook for scanners |
| Problem statement | 4/10 | "Free, no-login analyzer" is a feature list, not a problem. Never says *why* (recruiters judge profiles; profiles lose offers) |
| Solution | 7/10 | Three-tool table is clear and concrete |
| Installation | 8/10 | `npx autodev-agent` one-liner, no-install story — the best section |
| Usage | 7/10 | Analyze + badge + CLI examples all copy-pasteable |
| Screenshots | 2/10 | **None.** Local v2 literally says *"Screenshots coming soon"* while 6 finished screenshots sit in `assets/` |
| Demo / GIF | 1/10 | No demo, no GIF, no video anywhere |
| Features | 8/10 | Good tables, scannable |
| Architecture | 6/10 | File tree in old README; local v2 has a mermaid diagram (not live yet) |
| FAQ | 0/10 | None — no scoring-methodology, privacy, or rate-limit answers |
| Contribution | 2/10 | Points nowhere useful (CONTRIBUTING.md isn't on GitHub) |
| License | 2/10 | Badge links to `./LICENSE` that **does not exist on GitHub** |

**README score: 5/10 live · 7.5/10 local (unpushed)**

---

## 2. Repository

| Item | State | Score |
|---|---|---|
| Name | `autodev-agent` — clear, brandable, matches npm package | 8/10 |
| Description | "GitHub profile analyzer, README generator, and auto-git CLI agent. Free, no-login, live from the GitHub API." — keyword-rich, good | 8/10 |
| Topics | 9 good topics (developer-tools, git-automation, github-profile-analyzer, github-readme, nextjs, npm-package, profile-analyzer, readme-generator, typescript) | 8/10 |
| Homepage | Set to Vercel app | 8/10 |
| Releases | **1 release, v0.1.4, 3+ weeks stale** | 3/10 |
| Tags | 1 tag | 3/10 |
| Versioning | **Inconsistent:** GitHub v0.1.4 / npm 0.1.3 / local 1.0.0 — three versions, one product | 3/10 |
| Branches | `master` only; local CI badge references `branch=main` → **badge breaks on push** | 5/10 |

**Repository score: 5.75/10**

---

## 3. Professionalism

**Current: Student Project.**
- 0 stars · 0 forks · 0 watchers
- No license detected on GitHub (deal-breaker for every informed developer)
- No CI badge visible, no community files, stale release, version chaos across npm/GitHub/local
- Yet the *functionality* works: live badge, live app, npm package — which is why it reads as a *competent* student project

**Potential: Open Source Tool (within 2 weeks).** The local v1.0.0 bundle (MIT, CI passing 30 tests, CONTRIBUTING/SECURITY/CODE_OF_CONDUCT, CHANGELOG, handover docs) is exactly what a maintained open-source tool looks like. It is one `git push` away from being true.

**Enterprise Product:** Not relevant at 0 users; nothing about this repo should pretend otherwise.

---

## 4. Trust

| Audience | Would they? | Score |
|---|---|---|
| Developers | Hesitant. The tool demonstrably works (badge renders), but no license, no stars, no screenshots, no methodology → "nice idea, unmaintained?" | 4/10 |
| Recruiters | Impressed by the *concept and live product* (a profile-score badge is a standout junior portfolio piece), but the repo page itself doesn't help | 5/10 |
| Contributors | Not yet. No CONTRIBUTING on GitHub, zero issues, no good-first-issues, no labels, no roadmap visible | 2/10 |

**Trust score: 3.7/10**

---

## 5. Discoverability

**GitHub search** ranks by stars first — 0 stars means the repo is invisible even with perfect keywords. Fixes:

1. **Topics to add:** `github`, `github-api`, `open-source`, `productivity`, `portfolio`, `recruiter-tools`, `developer-experience`, `hiring`, `contributor`, `profile`
2. **README keywords to seed:** repeat "GitHub profile analyzer", "README generator", "profile score", "GitHub badge", "recruiter" in the first 200 words (search reads README text)
3. **Description:** already keyword-rich; add "score" ("GitHub profile score analyzer…")
4. **Homepage link:** set (good) — also add the site URL in the README first line (done in v2)
5. **Off-GitHub SEO:** the 3 SEO landing pages + sitemap + schema markup exist locally — they only matter once deployed and linked *from the README*
6. **Social proof flywheel:** Show HN / Product Hunt post, then an "awesome-github-profile-readme" list submission, then twitter/X devs — each star raises GitHub search rank
7. **npm discovery:** package description + keywords (searchable on npm, 40 downloads/mo to date)

**Discoverability score: 7/10** (good fundamentals, zero amplification)

---

## 6. Top 20 Improvements (highest ROI first)

| # | Action | Effort | Impact |
|---|---|---|---|
| 1 | **Push local v1.0.0 to GitHub** (code, LICENSE, .github, docs, CHANGELOG) | 15 min | Unlocks everything below; fixes license:null |
| 2 | **Fix CI badge before pushing:** `branch=main` → `branch=master` in README line 21 | 1 min | Prevents a broken badge on the day of the push |
| 3 | **Create GitHub Release v1.0.0** with changelog + assets (badge SVG, action dist) | 20 min | Instant trust upgrade; replaces stale v0.1.4 |
| 4 | **Publish npm v1.0.1** (postinstall + `--score` already built/tested) | 10 min | Distribution: every `npx autodev-agent` becomes a site visit |
| 5 | **Wire the 6 screenshots into the README** (assets/ has dashboard, homepage, leaderboard, cli, readme-generator, badge) | 20 min | Fixes the "coming soon" embarrassment |
| 6 | **Produce a 30-second demo GIF** from the existing screenshots + `cli.png` | 1 hr | README hero visual; also reusable for Product Hunt |
| 7 | **List the GitHub Action on the Marketplace** (built & tested, unpublished) | 30 min | New install surface + badge traffic |
| 8 | **Seed 5 good-first-issues with labels** (issue templates exist locally) | 30 min | Contributor on-ramp |
| 9 | **Put the AutoDev badge on the founder's own GitHub profile README** | 5 min | The #1 advertisement: every recruiter/profile visitor sees it |
| 10 | **Publish the "Try it" — Show HN + Product Hunt launch** | 1 hr | First traffic wave; 0 → first stars |
| 11 | **Submit to awesome lists** (awesome-github-profile-readme, awesome-readme, awesome-npm) | 30 min | Long-tail developer traffic + backlinks |
| 12 | **Add FAQ section** (scoring methodology, privacy/no-login, rate limits, badge usage) | 30 min | Trust + keyword surface; the questions WILL be asked |
| 13 | **Add GitHub Sponsors button + Funding.yml** | 10 min | Free fundraising channel, signals sustainability |
| 14 | **Standardize versioning:** one version everywhere (npm = GitHub release = local = CHANGELOG) | 15 min | Removes the "is this maintained?" smell |
| 15 | **Add `docs/SCORING.md`** (public methodology, calibration examples) | 45 min | Defuses the #1 complaint risk ("my score is wrong") |
| 16 | **Fix local README "Screenshots coming soon" → real gallery** (see #5) | — | Trust |
| 17 | **Deploy /score/[username] SEO pages** (analyzer/badge/tips pages built) + link them in README footer | 30 min | Permanent SEO landing pages |
| 18 | **Add Star History widget + "Pin demo" to README** | 10 min | Social-proof instrumentation |
| 19 | **npm package keywords + description refresh** (align with new topics) | 10 min | npm search rank |
| 20 | **Write a short "Why AutoDev" problem statement into the README top** | 20 min | Turns features into a story recruiters/investors feel |

---

## 7. Final Score

| Dimension | Weight | Score | Weighted |
|---|---|---|---|
| README & docs | 15% | 5/10 | 7.5 |
| Repo setup & hygiene | 15% | 5.75/10 | 8.6 |
| Professionalism & branding | 20% | 4/10 | 8.0 |
| Trust & social proof | 20% | 3.7/10 | 7.4 |
| Discoverability & SEO | 15% | 7/10 | 10.5 |
| Engineering quality (internal) | 15% | 9/10 | 13.5 |

### **Final Score: 55.5 / 100**

**Reading the score:** the engineering is genuinely strong (9/10) — it is the *presentation layer* dragging everything down. Every failing dimension (license, releases, README, community files, versioning) is already **fixed locally** and awaiting one push. This is an unusual and fixable situation.

**After executing items 1–7 (a single afternoon): 75/100.**
**After items 1–20 + first 10 stars + 1 release cycle: 85/100.**

The product can carry that score — the repo just has to catch up to the code.
