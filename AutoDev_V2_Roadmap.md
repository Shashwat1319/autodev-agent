# AutoDev — V2 Founder Roadmap

**Prepared by:** Founder Advisory (Co-Founder / CTO / PM / Startup Advisor / Investor)  
**Date:** July 30, 2026  
**Confidential — Investor Review Draft**

> **Brutal honesty warning:** This document does not flatter the project. It says what a founder needs to hear, not what they want to hear. Read it twice.

---

# 1. Current Product

## 1.1 Current Features

| Feature | Status | Notes |
|---------|--------|-------|
| GitHub profile analyzer (score/100) | ✅ Live | Consistency + stars + bio, deterministic algorithm, 6 recommendations |
| README generator (3 styles) | ✅ Live | Professional / Minimal / Recruiter, live data, preview/copy/download |
| Dynamic SVG badge | ✅ Live | Shields.io-style, tiered colors, always-200 fallback |
| OG image generator | ✅ Live | sharp-based 1200×630 PNG, triple fallback |
| Leaderboard | ✅ Live | 13 featured + search-add, ephemeral data |
| CLI agent (`npx autodev-agent`) | ✅ Live | chokidar watcher, debounce, auto commit/push, multi-repo |
| CLI `--score` flag | ✅ New | Fetches score box from terminal |
| npm postinstall message | ✅ New | Converts downloads → site visits |
| Chrome extension (MV3) | ⚠️ Built, unpublished | Zero permissions, score badge injection |
| Tampermonkey userscript | ✅ Published-ready | `docs/autodev-github-score.user.js` |
| GitHub Action (score-check) | ⚠️ Built, unpublished | Fails CI under min-score |
| Analytics custom events | ✅ New | 7 events (analyze, readme, badge, share, npx, cta) |
| SEO landing pages | ✅ New | `/analyzer`, `/badge`, `/github-profile-tips` + schema |
| Sentry monitoring | ✅ Live | Client/server/edge |
| Health endpoint | ✅ Live | `/api/health` |

## 1.2 Current Architecture

```
Next.js 14 (Pages Router) on Vercel free tier
├── 9 static pages
├── 6 serverless API routes
├── No database · No OAuth · No queues · No cron
├── Live GitHub API + CDN caching (s-maxage 300–3600s)
├── In-memory per-IP rate limiting (per instance)
└── Monorepo: platform / agent / chrome-extension / shared / github-action
```

**Design philosophy:** zero infrastructure, zero maintenance, zero cost. All data live from GitHub API. Every architecture decision documented as ADR.

## 1.3 Current Strengths

1. **Engineering discipline (rare for solo projects):** 30 unit tests, TypeScript strict, Sentry v8, CSP + 6 security headers, CI with 3 jobs, dependabot, CODEOWNERS, PR templates, ADRs.
2. **Zero-cost architecture:** $0/month. Can run forever on free tiers.
3. **Zero user-data liability:** no database, no OAuth, no PII. GDPR non-issue.
4. **3-in-1 product surface:** analyze + generate + automate under one brand.
5. **Real organic npm traction:** 609 downloads/week — this is the ONLY real distribution signal, and it proves the CLI solves a real pain.
6. **Viral primitive exists:** the SVG badge. Every install is a backlink.
7. **Clean separation of concerns:** monorepo boundaries are right; `shared/types` is a proper contract layer.

## 1.4 Current Weaknesses

1. **No users.** 11 visitors in the last 7 days. 25 in the launch week. This is not a product problem — it's a distribution problem. The product has never been seen by more than a few dozen people.
2. **npm downloads don't convert.** 609 downloads/week but the website gets ~2 visitors/day. The agent is successful; the platform is invisible. Until the postinstall/`--score` changes ship (v1.0.1, unpublished), downloads and website are disconnected funnels.
3. **Zero retention mechanics.** No accounts, no history, no "score over time", no email, no saved favorites. Every visitor is a one-time hit.
4. **Ephemeral leaderboard.** Recomputes live; resets on cold start; not a product, a demo.
5. **No revenue.** $0. No Stripe integration, no pricing page, no Pro Report.
6. **No team.** Bus factor 1. Solo founder in India with no track record visible to investors.
7. **Brand is weak.** "AutoDev" is generic (there are many AutoDevs); `.vercel.app` domain screams hobby project; no social preview image committed to the repo.
8. **SEO starts from zero.** Domain authority 0, no backlinks, GSC sitemap still unresolved from the old serverless route.
9. **Chrome extension and GitHub Action — the two highest-leverage distribution assets — are built but unpublished.**

---

# 2. Current Problems

## 2.1 Full Problem List

### Technical

| # | Problem | Priority |
|---|---------|----------|
| T1 | In-memory rate limiting is per-instance — not globally enforceable | **Critical** (at scale) |
| T2 | GitHub API quota (60/hr unauth) is the hard scaling ceiling | **Critical** |
| T3 | Leaderboard recomputes all profiles per request (slow, wasteful) | High |
| T4 | `sharp` cold start (~500ms) on OG images | Medium |
| T5 | No integration tests for API routes or agent watcher | Medium |
| T6 | `/api/health` version hardcoded to "0.2.0" | Low |
| T7 | ESLint warnings remain (img-element ×5, exhaustive-deps ×3) | Low |
| T8 | `count_private=true` flag in generated README stats URLs is misleading | Low |
| T9 | Fork repos count toward scoring `repoCount` | Low |
| T10 | npm audit: high-severity advisory in agent dev deps (ts-node chain) | Medium |

### Business

| # | Problem | Priority |
|---|---------|----------|
| B1 | **$0 revenue, no monetization mechanism built** | **Critical** |
| B2 | No pricing page, no plan tiers, no Stripe | **Critical** |
| B3 | No clear ICP (individual devs? students? recruiters? teams?) | High |
| B4 | Solo founder, no team, no advisors | High |
| B5 | No legal entity / tax handling for revenue | High (before first $) |

### Marketing

| # | Problem | Priority |
|---|---------|----------|
| M1 | **Zero distribution.** 11 visitors/week. Product is invisible. | **Critical** |
| M2 | npm (609/wk) and website (2/day) are disconnected funnels | **Critical** |
| M3 | No SEO presence; domain authority 0; no backlinks | High |
| M4 | Chrome extension + GitHub Action unpublished (the two best distribution assets) | **Critical** |
| M5 | No content, no social presence, no newsletter | High |
| M6 | First Product Hunt launch underperformed (8 upvotes) — no audience before launch | Medium |

### UX

| # | Problem | Priority |
|---|---------|----------|
| U1 | 45% bounce rate on the website | High |
| U2 | Empty state on `/` doesn't show the value instantly (no example results) | High |
| U3 | Leaderboard is slow to load | Medium |
| U4 | No mobile app / PWA | Low |
| U5 | Share modal auto-open can annoy first-time users | Low |

### Scalability

| # | Problem | Priority |
|---|---------|----------|
| S1 | GitHub quota shared across all users — one analysis = 3 calls | **Critical** |
| S2 | No persistent cache layer (KV/Redis) | High |
| S3 | Leaderboard fan-out multiplies GitHub calls (13+ profiles = 39+ calls) | High |
| S4 | Vercel free tier limits (no cron, serverless invocation caps) | High |

### Security

| # | Problem | Priority |
|---|---------|----------|
| C1 | Rate limit bypassable across instances | High |
| C2 | No security.txt, no automated dependency scanning in CI (npm audit not in pipeline) | Medium |
| C3 | CSP has `unsafe-inline`/`unsafe-eval` (required by Vercel analytics — acceptable) | Low |

### Revenue

| # | Problem | Priority |
|---|---------|----------|
| R1 | $0 MRR, no payment provider wired | **Critical** |
| R2 | No Pro feature exists yet to charge for | **Critical** |
| R3 | No sponsors/donations pipeline (BuyMeACoffee link exists, unmeasured) | Medium |

### Branding

| # | Problem | Priority |
|---|---------|----------|
| N1 | "AutoDev" is generic and crowded | Medium |
| N2 | `.vercel.app` subdomain signals hobby project | Medium |
| N3 | No logo assets beyond favicon/extension icons | Low |
| N4 | No social preview image committed to repo | Medium |

### Hiring

| # | Problem | Priority |
|---|---------|----------|
| H1 | Bus factor 1 — if founder disappears, project dies | High |
| H2 | No contributor base yet (first external PR never merged) | Medium |

### Growth

| # | Problem | Priority |
|---|---------|----------|
| G1 | No growth loop wired end-to-end (badge → site → README → badge) | **Critical** |
| G2 | No referral mechanism | Medium |
| G3 | No onboarding moment that forces value (e.g., "your score" email) | High |

### Documentation

| # | Problem | Priority |
|---|---------|----------|
| D1 | Technical docs are excellent (HANDOVER.md, ADRs, README) | ✅ (strength) |
| D2 | Missing: pricing page copy, FAQ for customers (not just developers) | Medium |
| D3 | README over-indexes on the agent; the analyzer (the viral surface) deserves the top slot | Low |

## 2.2 Priority Summary

| Priority | Count | Items |
|----------|-------|-------|
| **Critical** | 9 | T1, T2, B1, B2, M1, M2, M4, S1, G1 |
| High | 14 | T3, B3, B4, B5, M3, U1, U2, S2, S3, S4, C1, H1, G3, T10 |
| Medium | 12 | T4, T5, M5, U3, U6, C2, R3, N2, N4, H2, G2, D2 |
| Low | 6 | T6, T7, T8, T9, U4, U5, C3, N1, N3 |

**Founder's blunt read:** 9 critical problems, and 8 of them are *business/distribution*, not code. The code is not the bottleneck. Distribution is the bottleneck. Everything else is decoration until 1,000 people use this weekly.

---

# 3. Top 10 Features (Ranked by Impact)

| Rank | Feature | Why needed | User value | Business value | Complexity | Time |
|------|---------|-----------|-----------|----------------|-----------|------|
| 1 | **Pro Report (PDF + history)** | First paid product; converts 1% of analyzers; Stripe-ready (link scaffold exists) | Recruiter-ready PDF resume in 1 click; score history | First revenue ($5/mo), proves willingness to pay | Medium | 2–3 weeks |
| 2 | **Account-lite: saved profiles + score tracking** | Retention; without accounts every user is a one-time hit | "My score" dashboard, compare over time | Retention loop, email capture → marketing channel | Medium | 2 weeks |
| 3 | **Chrome Web Store publication** | Biggest passive distribution asset, built and sitting unused | Score on every GitHub page, zero effort | 50–200 installs/mo organic | Low (payment only) | 2 days |
| 4 | **GitHub Actions Marketplace publication** | B2B distribution; teams find it in the marketplace | CI score guard for teams | Enterprise funnel entry, leads list | Low | 2 days |
| 5 | **Vercel KV + cron cache layer** | Kills T1, T2, S1, S2, S3 — the scaling ceiling | Faster leaderboard, more analyses per hour | Foundation for every future feature | Medium | 1 week |
| 6 | **Team/Org dashboard (B2B)** | Highest revenue per customer ($50/mo) | Managers see team profile health at a glance | $500–5K MRR potential | High | 4–6 weeks |
| 7 | **Compare mode (side-by-side)** | Viral shareability; the "game" layer | See yourself vs. a friend/competitor | Share → traffic → signups loop | Medium | 1 week |
| 8 | **AI README generation (4th style)** | Trend-fit; saves real time; upsell trigger | Personalised README from LLM in seconds | $5–10/mo tier; premium perception | Medium | 2 weeks |
| 9 | **Weekly score digest email** | Retention + reactivation | "Your score changed 53→61" | Opt-in email list = marketing channel | Medium | 1 week |
| 10 | **i18n (Hindi, Spanish, Portuguese)** | India = #2 GitHub market; the founder is Indian — first-mover advantage | Product in native language | TAM expansion in high-growth markets | Medium | 2–3 weeks |

**Explicitly NOT in top 10 (deliberately deferred):** OAuth login, mobile app, widget embeds, job board, custom score algorithms, white-label. All add surface area without fixing distribution.

---

# 4. Revenue Plan

## 4.1 Plan Tiers

| Plan | Price | Included | Target |
|------|-------|----------|--------|
| **Free** | $0 | Analyzer, badge, README gen (3 styles), leaderboard, CLI, extension | Everyone — the viral surface stays free |
| **Pro** | $5/mo (or $49/yr) | PDF report, 90-day score history, compare mode, AI README, priority API | Individual devs & job seekers |
| **Team** | $49/mo (up to 10 profiles) | Team dashboard, weekly digests, score guard action, shared reports | Bootcamps, startups, hiring teams |
| **Enterprise** | $199/mo+ (custom) | White-label, custom scoring, API 50K req/day, SSO, SLA | Agencies, recruitment firms |
| **API** | $10–99/mo | 10K–1M req/day, webhooks, cached endpoints | Developers building on AutoDev data |
| **Marketplace** | Action Pro $9/mo | History in PRs, team thresholds, Slack alerts | Teams on GitHub Actions |
| **Donations** | $3–10/mo | Sponsors tier with roadmap influence | Supporters |

## 4.2 Pricing Rules (do not break these)

1. **The badge stays free forever.** It is the marketing flywheel — charging for it kills the network effect.
2. **Free tier must feel complete** (analyzer + badge + README). Pro must feel like "depth", not "paywall anger".
3. **Team plan priced per workspace, not per seat** — simpler billing, bigger ARPU.
4. **Annual = 2 months free.** Cash flow for a bootstrapped solo founder.

## 4.3 MRR Milestones

| Milestone | What it means | Required base | Timeline |
|-----------|---------------|---------------|----------|
| **First $1** | Someone pays — anything. A BuyMeACoffee, a Pro Report, a sponsor. | 1 person who loves it | Week 4–6 |
| **First $100 MRR** | 20 Pro users OR 2 team customers | ~2,000 monthly analyzers (1% conv) | Month 4–6 |
| **First $1,000 MRR** | 200 Pro users OR 20 teams + API | ~20,000 monthly analyzers | Month 9–12 |
| **First $10,000 MRR** | 2,000 Pro OR 200 teams — needs team + content engine | 100K+ monthly analyzers | Year 2–3 |

## 4.4 How to Reach Each Milestone (the honest math)

### First $1 (weeks 4–6)
- Ship Pro Access with Razorpay (server-side checkout live — `RAZORPAY_KEY_ID` + `RAZORPAY_KEY_SECRET` env; ₹749 one-time, no PDF).
- **Activation driver:** in the ShareModal, after score analysis: "Get your recruiter-ready PDF — $5".
- **Trigger event:** first external user copies the badge. That user is 100× more likely to pay than a random visitor.
- **Also wire:** GitHub Sponsors profile + measure BuyMeACoffee.

### First $100 MRR (months 4–6)
- Requires ~2,000 analyzers/month. Path:
  - Chrome extension live (50–200 installs/mo)
  - GreasyFork userscript (20–50/mo)
  - npm postinstall + `--score` conversion (609/wk × 3–5% = 20–30 visitors/day)
  - SEO pages (3–6 months to index; 100–300 visits/mo by month 6)
  - Directory listings (30–100 visits/mo)
- Conversion math: 2,000 analyzers × 1% Pro = 20 × $5 = **$100 MRR**. Realistic at month 6 if the distribution tasks are actually executed.

### First $1,000 MRR (months 9–12)
- Requires either 200 Pro users OR 20 teams.
- The realistic 2027 path: **Teams, not Pro.** 20 teams × $49 = $980. Bootcamp + startup outreach (LinkedIn DMs, dev community posts). 20 teams from warm outreach is achievable for one person in 3 months if the product demo is 60 seconds.
- Supporting: API tier ($10–99) + Action Pro ($9).
- **Do not count on viral traffic alone for this milestone.** Outreach wins it.

### First $10,000 MRR (year 2–3)
- Requires a team, content engine, and real funnel:
  - 2,000 Pro ($10K) OR 200 teams ($9.8K) OR mix.
  - Needs 100K+ monthly analyzers → SEO + YouTube + partnerships (bootcamps, dev communities).
  - Needs at minimum: 1 engineer + 1 content/marketing person + founder on sales.
  - Needs infrastructure spend: Vercel Pro (~$20/mo) + KV (~$25/mo) + email (free tier) — still < $100/mo at this scale. **The zero-DB architecture keeps margin at 90%+.**

## 4.5 Revenue risk honesty

- **Best case:** $10K MRR in year 2–3 — achievable, but only with consistent distribution work for 24 months.
- **Base case:** $500–1,500 MRR by month 12 (teams + pro + sponsors).
- **Worst case:** $0–50 MRR — if the founder treats this as a code project and never does distribution. **This is the most likely outcome unless the founder accepts that 80% of founder work is marketing and sales.**

---

# 5. Marketing Plan (12-Month)

## 5.1 Month-by-Month

| Month | Focus | Key actions |
|-------|-------|-------------|
| **1** | Distribution foundation | Chrome Store, GreasyFork, 6 directories, Action marketplace, GSC fix, domain purchase, postinstall + `--score` live |
| **2** | Conversion funnel | Pro Report + Stripe, analytics review, CTA optimization, first email capture (waitlist) |
| **3** | Content engine | Dev.to launch article, cross-post (Hashnode/Medium), LinkedIn carousel, Reddit (r/sideproject journey post) |
| **4** | Community | GitHub Discussions live, 10 good-first-issues, first contributors, Product Hunt re-launch (with 1K+ npm + extension users as proof) |
| **5** | SEO compounding | 5 more content pages (scores of famous devs — built-in backlinks from social shares), schema refresh, first backlink outreach |
| **6** | B2B pilot | 3 team pilots (bootcamps + startups), Team plan live, LinkedIn DM outreach |
| **7** | AI feature launch | AI README (paid tier), Dev.to AI article, Reddit r/webdev |
| **8** | Retention | Weekly score digest emails live, referral ("invite a friend → pro week free") |
| **9** | YouTube | First video: "I built a free GitHub profile analyzer" (build-in-public vlog) |
| **10** | International | Hindi landing page, r/developersIndia launch post, Indian bootcamp partnerships |
| **11** | Enterprise push | Case studies, white-label pilot, API tier press |
| **12** | Review & double down | Full funnel review; double down on the single best channel; plan v2.0 |

## 5.2 Channel Strategy

### SEO (compounding, 3–6 month lag)
- 3 landing pages live (`/analyzer`, `/badge`, `/github-profile-tips`) + 5 more by month 5.
- **Killer content angle: "GitHub score of [famous dev]"** — analysis pages for torvalds, gaearon, sindresorhus, etc. Each one is a shareable URL with a "check your score" CTA. This is a content engine with zero writing effort — the API does the work.
- Backlink targets: dev.to articles, Reddit posts, directory listings, GitHub READMEs of contributors.

### GitHub (the ecosystem that already gives 609 downloads/wk)
- README of the agent package → links to site (already done).
- Postinstall message + `--score` (done — unpublished).
- Action marketplace listing (teams discover).
- Extension repo popularity → GitHub topic pages.
- **GitHub Stars are the #1 credibility metric for investors — target 100 by month 4, 500 by month 12.**

### Dev.to (the best free technical audience)
- Month 3: "I built a GitHub profile analyzer that 600 people install weekly" — honest, technical, teaches the setInterval→lazy-cleanup story.
- Month 7: AI README deep-dive.
- Month 10: Hindi-market dev story.
- Cross-post to Hashnode + Medium with canonical URLs.

### LinkedIn
- Monthly carousel: "Your GitHub profile is your resume — 10 screenshots that fix it".
- Recruiter-targeted posts (they search for candidates' profiles).
- **B2B outreach is the revenue channel:** connect with bootcamp program directors, startup founders, recruiting agency owners.

### Reddit
- r/sideproject: journey posts (build-in-public).
- r/webdev: technical posts (the interesting engineering).
- r/developersIndia: local audience, huge (1M+ members).
- r/github: product fit posts.
- **Rule: never sell. Teach + show numbers honestly.** Reddit punishes ads; rewards honesty.

### X/Twitter
- 3–5 posts/week. Build-in-public thread style (screenshots of analytics, honest numbers).
- Tag @Vercel, @Nextjs, @GitHub on launches.
- **The score card is the sharable asset** — every analysis page has share buttons; make the card irresistible.

### Product Hunt
- **Re-launch at month 4, not now.** Rule: never launch twice with the same weakness. Second launch needs: 50+ GitHub stars, extension live, 1,000+ npm, and an engaged list of 200+ people to show up in the first hour.
- 12:01 AM PT Tuesday. Reply to every comment within 30 minutes.

### YouTube
- Month 9+. One video per month. Build-in-public + tutorials ("Analyze your GitHub profile like a recruiter").
- Repurpose short-form: one 30s clip per week.

### Newsletter
- **Earn capture through Pro/team funnel first** — don't build a newsletter before you have a product to sell.
- Weekly digest (product metrics, new features) once >500 analyzers/month.

### Community / Open Source
- Discussions (6 categories), good-first-issues labeled, monthly release cadence.
- **Contributor growth = credibility growth.** First 10 contributors are each a backlink + a testimonial.

## 5.3 Growth Loops

**The badge loop (the only real viral loop):**
```
User analyzes profile → copies badge → badge in README → 
visitors on profile see badge → click → land on analyzer → analyze → copy badge
```

**The score-comparison loop (to build in V2):**
```
Analyze → share "my score" card → friend checks their score → compares → shares back
```

**The team loop (B2B):**
```
Team plan → weekly digest → managers share to leadership → leadership wants org-wide → enterprise
```

## 5.4 Referral

- Simple version (month 8): invite a friend who analyzes 3 profiles → 1 week of Pro free.
- **Never pay cash for referrals at this stage** — reward with features and status (leaderboard badge "Growth Pioneer").

## 5.5 Partnerships

- **Bootcamps** (Flatiron, App Academy, freeCodeCamp, Indian bootcamps): free Team plan for cohorts; they get "profiles improve" as a metric; we get cohort-scale adoption + testimonials.
- **Dev communities** (Discord servers, r/developersIndia): sponsor-free value posts.
- **Recruiting agencies:** white-label reports for their candidates.
- **Vercel:** Next.js showcase submission (free credibility + directory traffic).

---

# 6. Version 2

## 6.1 Goals

| Goal | Metric |
|------|--------|
| Revenue | First $1,000 MRR |
| Users | 2,000 analyzers/month, 200 active weekly |
| Retention | 10% D7 |
| Distribution | Extension 500 installs, Action 50 installs, stars 100+ |
| Community | 10 contributors, 5 merged PRs from externals |

## 6.2 Features (V2 scope — ranked, cut ruthlessly)

| Feature | Ship in |
|---------|---------|
| Pro Report (PDF + history) | v2.0 |
| Vercel KV + cron (rate limit + leaderboard cache + digests) | v2.0 (infra first) |
| Compare mode | v2.0 |
| Account-lite (email + saved profiles, no OAuth) | v2.1 |
| Team dashboard v1 | v2.2 |
| AI README (4th style) | v2.3 |
| Weekly digest email | v2.3 |
| Famous-dev score pages (SEO) | v2.4 |
| Hindi landing | v2.4 |

**Cut from V2 (do not build):** OAuth login, mobile app, embeddings/widget, job board, i18n beyond Hindi, custom scoring, white-label.

## 6.3 Architecture (V2)

```
Platform (Vercel Pro ~$20/mo)
├── Vercel KV (Upstash Redis)     → global rate limits, cached analyses, leaderboard snapshots
├── Vercel Cron (daily)           → leaderboard refresh, score snapshots, digest jobs
├── Stripe                       → subscriptions (payment links → full checkout)
├── Resend / email provider       → digests, transactional
├── Supabase (free tier)          → optional-lite: email + saved profiles table ONLY
├── Same Next.js Pages Router     → zero migration churn
└── Same live-GitHub-API model    → with KV cache in front (TTL per username)
```

**Key architectural decisions:**
1. **Keep Pages Router.** Migration to App Router is churn without user value.
2. **KV cache in front of GitHub API:** 1-hour TTL per username → 20 analyses/hr unauth becomes ~unlimited (cache hits).
3. **Lite-accounts, not OAuth:** email + magic link (no password storage) OR just email capture + localStorage profiles. Defer OAuth to V3.
4. **Cron jobs respect GitHub quota** (batch, paced, token-authorized).
5. **Stripe via payment links first** (already scaffolded), full checkout when Pro ships.

## 6.4 Timeline

| Milestone | Date | Outcome |
|-----------|------|---------|
| M1: Infra (KV + cron) | Month 1 | Rate limit global, leaderboard cached |
| M2: Pro Report + Stripe | Month 2 | First $1 live |
| M3: Compare + famous-dev SEO pages | Month 3 | Shareable virality + SEO compounding |
| M4: Lite-accounts + digest | Month 4 | Retention loop + email list |
| M5: Team dashboard v1 | Month 5–6 | First $49 customers |
| M6: AI README | Month 7 | Pro tier upsell |
| M7: V2 review | Month 8 | Metrics vs goals; decide V3 scope |

## 6.5 Expected Outcomes (end of V2, month 12)

- MRR: $500–1,500
- Analyzers: 2,000–5,000/mo
- GitHub stars: 100–500
- Contributors: 10–25
- Extension: 500–2,000 installs
- Retention: 10–15% D7
- Infrastructure cost: < $100/mo (margin 90%+)

---

# 7. Version 3

## 7.1 Vision

AutoDev as the **developer identity platform**: "Your GitHub profile is your resume — AutoDev is how the world reads it." Multi-platform (GitLab, Bitbucket), AI-assisted, team-native, and the default scoring standard for developer hiring pipelines.

## 7.2 AI Features

- **AI README generation** — LLM writes a bio + project summaries from repo content, trained on the user's actual code (not boilerplate).
- **AI Recommendations** — "Your score would rise 12 points if you: add repo descriptions to 4 repos, write a README for X, pin your React projects" — generated from repo analysis, not generic rules.
- **AI score explainer** — natural-language breakdown of why a score is what it is (shareable, recruiters love it).
- **AI profile critique** — "Here's what a senior engineer at [company] would notice about your profile."

## 7.3 Automation

- **Auto-Improve agent** (extension of the CLI): watches repos, and when the score would improve by committing/adding descriptions/creating a README — suggests or performs it.
- **Scheduled digests** to managers and individuals.
- **Score guard everywhere** — CI, PRs, hiring pipelines (webhook-based).

## 7.4 Enterprise

- Org-wide dashboards (100+ profiles), SSO (defer — LOB need), white-label reports, custom scoring weights, SLA-backed API, dedicated support channel.

## 7.5 Scaling

- Multi-region (Vercel Enterprise / self-host), global Redis, background workers for AI + digests, dedicated GitHub API proxy with token pool, 99.9% uptime target.

## 7.6 Future roadmap (beyond V3)

- Recruitment marketplace (companies search by score + skills — commission per hire)
- Developer identity graph (public-facing profile pages at `autodev.dev/username`)
- Partnerships: bootcamps, universities, hiring platforms, GitHub itself (action + marketplace + sponsor relationships)

---

# 8. Founder Board (Startup Dashboard)

## Scores (0–100)

| Category | Score | Progress |
|----------|-------|----------|
| Product | 70 | ██████████████░░░░░░░░ 70% |
| Architecture | 85 | █████████████████░░░░░ 85% |
| Brand | 20 | ████░░░░░░░░░░░░░░░░░ 20% |
| Revenue | 2 | ░░░░░░░░░░░░░░░░░░░░ 2% |
| Users | 8 | █░░░░░░░░░░░░░░░░░░░ 8% |
| Marketing | 10 | ██░░░░░░░░░░░░░░░░░░ 10% |
| Retention | 3 | ░░░░░░░░░░░░░░░░░░░░ 3% |
| Monetization | 5 | █░░░░░░░░░░░░░░░░░░░ 5% |
| Testing | 75 | ███████████████░░░░░ 75% |
| Security | 80 | ████████████████░░░░ 80% |
| Documentation | 85 | █████████████████░░░ 85% |
| DevOps | 70 | ██████████████░░░░░░ 70% |

## Why each score

### Product — 70
Genuinely good engineering and a coherent 3-in-1 concept. The analyzer + badge + README flow is a real product, not a demo. −30 for: no accounts/retention, ephemeral leaderboard, no paid tier, and — critically — **the product has never been validated by real users at scale.** A product with 11 weekly visitors is a product with an unproven market fit, no matter how good it looks.

### Architecture — 85
The best part of the project. Zero-DB serverless design is elegant and cost-free; ADRs show real senior judgment; monorepo boundaries are correct; the setInterval→lazy-cleanup fix shows genuine serverless awareness. −15 for: per-instance rate limiting, no cache layer, no background jobs, hardcoded version string, and the fact that the "scale ceiling" (GitHub quota) is a design constraint, not a solved problem.

### Brand — 20
"AutoDev" is generic; the site runs on a `.vercel.app` subdomain; there is no logo system, no committed social preview, no design language beyond the dark theme; no domain; no social presence. For investors and users alike, this looks like a hobby project right now. Brand = trust, and trust = conversion. This score will hurt every other metric until fixed.

### Revenue — 2
$0 MRR, no Stripe integration, no pricing page, no paid feature, no sponsors pipeline measured. The only honest "revenue" infrastructure is a STRIPE_PRO_LINK env scaffold and a BuyMeACoffee link. A 2, not a 0, because the scaffolding exists and the monetization path is at least designed.

### Users — 8
11 visitors in the last 7 days. 25 in launch week. 609 npm downloads/week (real! but not site users). The only reason this is not 0 is the npm signal — it proves demand exists for one part of the product. But as a "platform" the user base is effectively nonexistent.

### Marketing — 10
No social presence, no content published, no directory listings, extension unpublished, no backlinks, no SEO history. The 12-task growth plan exists but is not executed. 10 points for: the growth plan, the SEO pages, and the badge loop — all of which exist on paper.

### Retention — 3
No accounts, no history, no email, no saved profiles, no "score over time". Every user is a one-time visitor by design. The share modal + localStorage are the only "retention" mechanisms, and they're ephemeral. A 3 is generous.

### Monetization — 5
The pricing table and tier design are done (this document + earlier strategy). The infrastructure is not. No payment processor, no paid feature, no billing. 5 points for design, 0 for execution.

### Testing — 75
30 unit tests on the pure logic core (scoring, validation, formatting) with coverage config — better than most solo projects. −25 for: zero API route tests, zero agent watcher tests, zero integration tests, and no test coverage gates in CI.

### Security — 80
CSP, HSTS, X-Frame-Options, Permissions-Policy, nosniff, lazy token getter, input validation on every route, XSS escaping in OG SVG, Sentry. Rare for this project size. −20 for: per-instance rate limiting (bypassable), no CI dependency audit, no security.txt.

### Documentation — 85
README (rewritten to top-tier), HANDOVER.md (24 sections), ADRs, CONTRIBUTING, SECURITY, CODE_OF_CONDUCT, CHANGELOG, .env.example, issue templates. This is genuinely investor-grade documentation. −15 for: no pricing-page copy, no end-customer FAQ, and some drift (health version string, roadmap dates in README vs CHANGELOG).

### DevOps — 70
CI with 3 jobs, dependabot, CODEOWNERS, PR templates, Vercel deploys, health endpoint. −30 for: no staging environment, no rollback runbook, no uptime monitor on the health endpoint, no dependency audit in CI, no automated release process (versions bumped manually).

## Overall business health

```
Engineering:  ██████████████████░░░  85%  (the asset)
Distribution: ██░░░░░░░░░░░░░░░░░░░  8%   (the missing half)
Business:     ░░░░░░░░░░░░░░░░░░░░  2%   (the missing half)
```

**The company is 85% engineering and 2% business.** That is the entire story of this project.

---

# 9. Brutal Founder Review

## Would you invest? — NO.

**Not yet.** There is no traction (11 visitors/week), no revenue, no team, no retention, no brand. A product with excellent engineering and zero users is a codebase, not a company. Any angel who invests now is betting on the founder alone — and there is no evidence of execution on distribution (yet).

**What would change the answer:** 2,000+ analyzers/month, $100+ MRR, extension live, 100+ stars, and 90 days of consistent growth numbers. That is the "investable" bar — and it's reachable in 6 months with discipline.

## Would Y Combinator accept it? — No (current state), but not for the reason you think.

YC rejects based on **traction and team**, not product. Current state: 11 visitors/week, solo founder with no track record visible, no revenue. This is a "pre-seed side project" profile, and YC's bar has moved far beyond that.

**The realistic YC path:** apply at 1,000+ npm/wk + extension live + $500 MRR + 100 stars + a clear "developer identity" narrative. That's a YC-interview-caliber application. The product narrative (GitHub profile → developer identity platform) is genuinely YC-shaped — it's a wedge into a massive market with a viral loop. But it must be *proven* first.

## Can this become a SaaS? — Yes, with a critical caveat.

The B2B path (team dashboards + action guard) is a legitimate SaaS. The B2C path is *not* a classic SaaS — it's a freemium tool with a subscription layer. The caveat: **every SaaS success this size needs a distribution engine** (SEO, marketplace, or partnerships). AutoDev has the engine designed (badge loop, marketplace, content) but not running.

## Can this become a startup? — Yes, but not a venture-scale startup as currently positioned.

Venture-scale needs a $100M+ outcome narrative. "GitHub profile analyzer" alone caps at a lifestyle/niche business ($50–500K ARR). The startup narrative requires the pivot to **developer identity platform** (multi-platform, hiring pipelines, marketplace) — a real market expansion. As currently built, this is a promising niche product. As visioned, it's a startup. The founder must decide which one they're building, because the strategies differ completely.

## Can this reach $10K MRR? — Yes, but it will take 2–3 years and it is NOT automatic.

The math: 2,000 Pro users ($5) OR 200 teams ($49) OR a mix. Realistic only with: a team (2–3 people), consistent content/distribution for 24 months, and a B2B sales motion. Without those — the honest answer is "probably not, and definitely not this year." $10K MRR is the reward for treating this as a business, not a hobby.

## Biggest weakness? — Distribution. Not engineering.

The code is not the problem. The founder has spent months polishing the product to 8/10 engineering quality and ~15 minutes/week on marketing. Every critical problem in Section 2 is a distribution or business problem. If the founder keeps shipping code and never ships *users*, this project stays invisible forever. **The biggest weakness is that the founder's default behavior is "build", when what's needed is "sell".**

## Biggest opportunity? — The developer-identity wedge.

GitHub profiles are the universal developer resume, and nobody owns the "score/standard" position. The badge is a viral distribution primitive; the npm agent proves organic demand; the extension + action are distribution assets ready to ship; India's developer market is an underserved home advantage. If AutoDev becomes the standard way developers (and the people who hire them) think about GitHub profiles, it's a 7-figure ARR business with a real narrative.

---

# 10. Next 30 Days (Day-by-Day)

**Principle:** 80% distribution, 20% code. Every day has exactly ONE important task. Weekends are buffer days.

| Day | Task |
|-----|------|
| 1 | **Publish Chrome extension** to Web Store ($5 registration) — the #1 passive distribution asset |
| 2 | **Publish userscript** to GreasyFork (free, 10 minutes) |
| 3 | **Publish GitHub Action** to the Actions Marketplace (requires a public repo + tag) |
| 4 | **Fix GSC** — delete sitemap, re-add, request indexing for all 9 pages |
| 5 | **Buy `getautodev.dev`** (~$10) — redirect to site; set up email |
| 6 | **Submit to 6 directories** — alternateto, saashub, futurepedia, toolkitly, capterra, g2 |
| 7 | **Submit to Next.js showcase + Vercel templates** |
| 8 | **Ship v1.0.1** — npm publish with postinstall + `--score` (converts 609/wk downloads into site visits) |
| 9 | **Wire GitHub Sponsors** + measure BuyMeACoffee; add a "Support" link to the site |
| 10 | **Set up uptime monitor** on `/api/health` (UptimeRobot free) |
| 11 | **Write the Dev.to launch article** (honest, technical, build-in-public) |
| 12 | **Publish Dev.to article** → cross-post Hashnode + Medium (canonical URLs) |
| 13 | **Reddit Day** — post to r/sideproject + r/developersIndia (journey post, no selling) |
| 14 | **X/Twitter thread** — 8-tweet build-in-public thread with real analytics screenshots |
| 15 | **Analyze analytics** — check custom events; find where users drop off; fix the top drop-off |
| 16 | **Fix `/` hero** — show a live example result (torvalds) on page load to kill 45% bounce |
| 17 | **Fix leaderboard speed** — add KV cache OR reduce featured list; measure |
| 18 | **Set up Stripe** — payment link (scaffold exists); create Pro Report pricing draft |
| 19 | **Build Pro Report v0** — PDF export of analysis (serverless PDF lib) |
| 20 | **Integrate Stripe** — Pro Report paywall (first $1 goal) |
| 21 | **Add "famous dev score pages"** — /score/torvalds, /score/gaearon (SEO + shareability) |
| 22 | **Email capture** — "Get your score weekly" form on dashboard (no auth, just email) |
| 23 | **LinkedIn post** — "Your GitHub profile is your resume" carousel (5 slides) |
| 24 | **Product Hunt prep** — draft listing for month-4 relaunch; start collecting screenshots/testimonials |
| 25 | **Backlink outreach** — email 10 dev tools directories/blogs for inclusion |
| 26 | **Community day** — GitHub Discussions enabled; label 5 good-first-issues; welcome message template |
| 27 | **Fix technical debt batch** — health version string, npm audit fix, ESLint warnings |
| 28 | **Review month** — metrics review: visitors, npm, extension installs, conversions; write up findings |
| 29 | **Plan month 2** — pick the single best channel from the data; double down on it |
| 30 | **Rest + reflect** — honest journal: what worked, what didn't, what to kill. |

**Success criteria for Day 30:** 100+ visitors/day (up from 2), extension live, action live, userscript live, first $1 possible, and — most importantly — a clear answer to *which channel converts best*.

---

# 11. Final Verdict

## Scores

| Dimension | Score |
|-----------|-------|
| **Overall** | 4.5 / 10 |
| **Founder Score** | 3 / 10 — great builder, weak distributor. Execution on shipping: excellent. Execution on distribution: absent. |
| **CTO Score** | 8.5 / 10 — architecture, security, testing, docs are all well above the solo-project bar. Real senior judgment in ADRs. |
| **Investor Score** | 2 / 10 — no traction, no revenue, no team. Nothing to underwrite yet. |
| **Business Score** | 3 / 10 — monetization designed but unbuilt; no funnel; no retention; no brand. |
| **Engineering Score** | 8 / 10 — 30 tests, Sentry, CI, security headers, clean monorepo. −2 for integration-test gaps and untested agent. |

## If I were the founder of AutoDev, this is exactly what I would do next

1. **I would stop writing code for a week.** The next seven days, my only job is Day 1–7 of Section 10: publishing the extension, the userscript, the action, fixing GSC, buying the domain, submitting directories. These are all one-time actions that start a machine that pulls users forever.

2. **I would accept that I am a distribution problem, not a code problem.** I would set a rule: no feature work until the month-1 distribution checklist is done. The most valuable line in this entire document is "The company is 85% engineering and 2% business." I would attack that imbalance every single week.

3. **I would wire the funnels that already exist.** 609 npm downloads/week is a gift I'm leaving on the table. Ship the postinstall message + `--score` flag (already built!), watch downloads → site conversion, and only then optimize the website.

4. **I would build the first paid feature (Pro Report) in two weeks flat** and wire Stripe. The first $1 is the single most important milestone in this document — it converts me from "project builder" to "business founder", and it forces every future decision to be about customers, not code.

5. **I would pick ONE growth channel and go deep.** Not six. After 30 days of data: if Dev.to works, I write weekly; if Reddit works, I post weekly; if outreach works, I pitch teams weekly. Depth beats breadth for a solo founder with 2 hours/day.

6. **I would kill my ego on the roadmap.** Compare mode, AI READMEs, i18n, OAuth — all of it waits. The V2 list is exactly ten features, cut ruthlessly. Every month I add one feature and one channel, never two of either.

7. **I would hold myself to a scoreboard.** Every Sunday night: visitors, analyzers, badge copies, stars, MRR, churn. If the number is flat for 30 days, I change the tactic, not the product.

8. **Most importantly — I would not quit my job-equivalent safety net yet, but I would also not wait for permission.** This is a 6-month experiment with a clear kill/scale criteria: 2,000 analyzers/month + $500 MRR at month 6 = double down; flat at 200 visitors and $0 at month 6 = pivot or sunset.

> **The honest bottom line:** This is the best-engineered hobby project I've reviewed — and it's still a hobby project until it has users. The code earns the right to be a business. Only the founder can earn the users. Go get them.

---

*End of AutoDev V2 Founder Roadmap. Companion docs: `docs/HANDOVER.md` (technical), `CHANGELOG.md` (release history), `docs/internal/LAUNCH_KIT.md` (launch assets).*
