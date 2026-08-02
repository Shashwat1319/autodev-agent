# AutoDev — Growth Plan

**Date:** 2026-08-02 · **Budget:** $0 (until first revenue) · **Operator:** solo founder
**Document family:** builds on `AutoDev_V2_Strategy.md` (ICP, pricing), `AutoDev_V2_Freeze.md` (scope), `GitHub_Audit.md` (repo gaps)

---

## Current Product

| Component | Status | Role in growth |
|---|---|---|
| Profile Analyzer (web) | Live, 50 metrics, score/100 | Core value moment |
| Badge (SVG) | Live, embeddable | **The viral artifact** — every badge is an ad |
| README Generator | Live, 3 styles | Backlink loop: every generated README links the site |
| CLI agent (`npx autodev-agent`) | npm 0.1.3 (40 downloads/mo) | Install surface; v1.0.1 (postinstall + `--score`) built, unpublished |
| Chrome Extension | Built, unpublished | In-context traffic at the moment of need |
| GitHub Action | Built, tested, unpublished | CI install surface |
| GreasyFork userscript | Built, unpublished | Tampermonkey users |
| SEO pages (/analyzer, /badge, /tips) | Built, live | Long-tail search landing pages |
| `/score/[username]` pages | Planned | The #1 SEO engine (frozen for now) |

**The loop we are engineering:**
`install (npm/ext/action) → analyze → score + badge → README generated (backlink) → /score page indexed → organic traffic → more installs`

---

## Current Users

| Metric | Value | Honest reading |
|---|---|---|
| Platform visitors | ~11/week | Ghost town — no product traction yet |
| npm downloads | 40 last month (1 last week) | Near zero |
| Stars / forks | 0 / 0 | Invisible in GitHub search |
| Paid users | 0 | — |
| Email list | 0 | — |
| Geography | 82% India, 91% desktop | We know exactly where the first users are |
| Conversion events | 0 tracked | Events shipped; nothing measured yet |

**Verdict:** AutoDev is in the "zero to one" phase. The product exists and works; the distribution system does not. Growth here is not optimization — it is *activation of existing assets* (repo push, npm publish, marketplace listing, extension store).

---

## Target Audience

| Segment | Priority | Why |
|---|---|---|
| Junior devs (22–29, India/SEA) job-hunting | **1** | 82% of current traffic; acute need; pays $9 for a job-related report |
| Career switchers / bootcamp grads | 2 | Same problem, higher urgency, tight networks |
| Students (final year) | 3 | High volume traffic, $0 budget — monetize later via their first job |
| Recruiters & talent teams | 4 (later) | Different product (ATS), sales cycle — not now |
| Enterprise / agencies | 5 (much later) | Requires proof + sales motion |

The *audience* is broad (anyone with a GitHub profile). The *customer* is narrow (junior job hunter in India). All marketing copy should speak to the customer, not the audience.

---

## Ideal Customer Profile

**Name:** Arjun — 24, backend developer in Bangalore
**Experience:** 2 years at a service company, applying to product companies
**Behavior:** reads LinkedIn daily, active in r/developersIndia, installs dev tools that make him look good, spends ₹500–1500/month on courses and resume services
**Problems:**
- Recruiters open his GitHub and see empty repos, no READMEs, no pinned projects
- "What is a good GitHub profile?" — he has no reference point
- His resume is polished; his profile is not
**Goals:** get interview calls, land a product-company offer, build a portfolio that *proves* skill
**Why he pays:** the $9 report is one artifact he can send to recruiters — cheaper than one day of lost opportunity, inside his existing spending habits
**Moment of conversion:** immediately after seeing his score and the 2-of-50 tips teaser — the report names the other 48.

**North Star proxy for ICP:** a profile analyzed from an Indian job-hunting context (highest conversion cohort).

---

## Distribution Channels (scored honestly for this product)

| Channel | ROI | Effort | Verdict | Concrete play |
|---|---|---|---|---|
| **GitHub** | ★★★★★ | Low | **Launch now** | Release v1.0.0, Marketplace action, badge on own profile, awesome lists, seed issues |
| **npm** | ★★★★☆ | Low | **Launch now** | Publish v1.0.1; postinstall message + `--score`; keywords refresh |
| **Reddit** | ★★★★☆ | Medium | **Week 2** | r/developersIndia (82% match), r/webdev, r/github — genuine "I built this" posts, not link spam |
| **LinkedIn** | ★★★★☆ | Medium | **Week 3** | Founder post: "I built a GitHub profile scorer"; Indian devs live on LinkedIn |
| **SEO** | ★★★★★ | Ongoing | **Foundation now** | Deploy /score/ pages, GSC re-add sitemap, backlinks from READMEs + directories |
| **Hacker News** | ★★★☆☆ | Low | **One shot, Week 3** | Show HN when demo GIF + stars > 5 ready; prepare for brutal feedback |
| **Product Hunt** | ★★☆☆☆ | Medium | **Week 3** | One launch day; secondary to Show HN for a dev tool |
| **Twitter/X** | ★★★☆☆ | Medium | **Weekly** | Screenshot threads of famous devs' scores (torvalds 88/100…) — the score is content |
| **DEV** | ★★☆☆☆ | Medium | **Week 2** | 1 tutorial: "How I score GitHub profiles with the GitHub API" — tutorial ≠ ad |
| **Communities** | ★★☆☆☆ | Low | **Week 2** | India dev Discords/Telegram; answer questions, mention badge naturally |
| **YouTube** | ★☆☆☆☆ | High | **Skip for 90 days** | Solo founder + $0 + editing time = worst ROI per hour |
| **Google Search** | ★★★★★ | Ongoing | **Months 2–3** | /score/[username] long-tail pages are the compounding engine |

**Channel doctrine:** Two channels (GitHub + npm) ship existing assets this week. One channel (Reddit/LinkedIn) creates the first human conversation. SEO compounds in the background. Everything else is opportunistic, never scheduled.

---

## User Acquisition

### Organic (80% of effort)
- GitHub search (stars + topics + README keywords)
- npm search (postinstall funnel from 40→1000 downloads/mo)
- Google long-tail ("<name> github score", "github profile score")
- Reddit/LinkedIn content from the founder
- The badge itself — every embed is a backlink

### Paid (0% for 90 days)
- **None.** No Google/Meta ads for a free tool at $0 revenue. The only acceptable spend is the $5 Chrome Store fee and domain (~$10).
- Paid only returns when MRR > $200 and LTV:CAC > 3.

### Community
- r/developersIndia presence (comment helpful things monthly, post 1x)
- India dev Telegram/Discord groups — answer "how do I improve my GitHub" questions; AutoDev is the answer
- Discord server for AutoDev itself: **defer** until 100+ users (a dead Discord costs more than no Discord)

### Open Source
- The repo itself is the funnel: badge → repo → star → contributor → user
- Seed 5 good-first-issues; first 2 external contributors are worth 100 stars
- Submit to awesome lists (awesome-github-profile-readme, awesome-readme, awesome-npm)

### Content Marketing
- 1 tutorial/month (DEV/LinkedIn): scoring methodology, README generator internals, GitHub API lessons
- Screenshot content (X/LinkedIn): famous devs' scores — inherently shareable, zero writing

---

## Revenue Strategy

| Tier | Price | What | Status |
|---|---|---|---|
| Free | $0 | Score, badge, 2 README styles, top tips | Live |
| **Pro Report** | **$9 one-time / $5 mo / $49 yr** | Full PDF: breakdown, prioritized fixes, top-10% comparison | **First build (V2)** |
| **Template Packs** | **$4.99** | Premium README/badge styles (adds 3–5 styles) | **Cheapest second product** |
| Enterprise / Team | $49/$199 | Placeholder only — no sales until users exist | Frozen |
| Sponsorship | GitHub Sponsors | Button on repo; $0 expected for months | Free to add |
| Affiliate | Later | Resume services/courses inside Pro report (only with trust) | Q4 at earliest |
| API | Later | Rate-limited API for third parties | Only with demand |
| CLI | Free | npx agent stays free (distribution) | — |

**Revenue order of operations:** Pro Report ($9, one-time, easiest) → Template Packs ($4.99, zero infra, impulse-buy) → then, only at 1,000+ weekly analyses, consider Team.

**Realistic trajectory:** Month 1–2: $0 (activation). Month 3: first $5–50. Month 6: $100–500 MRR if SEO + India content lands. The $1,000 MRR gate stays from the strategy doc.

---

## Growth Metrics

| Metric | Today | 30-day target | 90-day target |
|---|---|---|---|
| Stars | 0 | 10 | 50 |
| Forks | 0 | 2 | 10 |
| npm downloads/mo | 40 | 150 | 500 |
| Chrome ext installs | 0 | 50 | 500 |
| Weekly analyses (NSM) | ~5 | 30 | 200 |
| Visitors/wk | 11 | 150 | 500 |
| READMEs generated/wk | ~5 | 15 | 80 |
| Returning analyzers (retention) | 0% | 5% | 10% |
| Activation (analyze → README/badge) | untracked | 40% | 50% |
| Email list | 0 | 50 | 300 |
| Paid users | 0 | 0–1 | 5 |
| MRR | $0 | $0–9 | $25–100 |

**Review ritual:** 30 minutes every Monday. One number decides the week: weekly analyses.

---

## North Star Metric

**Weekly profiles analyzed (on the platform).**

Why: it is the only metric that (a) captures the core value moment, (b) filters bounce traffic, (c) feeds every downstream asset (score pages, READMEs, badges, reports), and (d) is directly influenced by every channel on this plan. Stars and downloads are inputs; analyses are the outcome. All other metrics are diagnostics around it.

---

## 30-Day Plan

**Goal: activate every existing asset; first human conversations; 30 weekly analyses.**

| Week | Theme | Actions (all pre-built work, not new features) |
|---|---|---|
| **W1: Ship everything** | Push repo v1.0.0 (fix CI badge branch first) · Release v1.0.0 w/ changelog + assets · Publish npm v1.0.1 · List Action on Marketplace · Badge on founder's own GitHub profile · GSC sitemap delete/re-add · Wire screenshots into README + demo GIF | 
| **W2: Communities** | r/developersIndia post ("I built a GitHub profile scorer — roast me") · DEV tutorial · Seed 5 good-first-issues · Submit 3 awesome lists · Extension on Chrome Store ($5) · GreasyFork userscript live | 
| **W3: Launch moments** | Show HN ("Show HN: AutoDev – GitHub profile analyzer") · Product Hunt · LinkedIn founder post · Deploy /score/[username] pages · 6 directory listings (alternateto, saashub, futurepedia, g2, capterra, toolkitly) | 
| **W4: Measure** | Read analytics (first week with real events!) · Kill-or-double decision per channel · Email capture live on dashboard · Offer first 10 analyzers a free Pro report → 3 interviews about willingness to pay | 

**Weekly goals:** W1: repo live, 0→5 stars expected. W2: first 10 visitors/day from Reddit. W3: 100+ visitors on launch days. W4: 30 weekly analyses, 50 email opt-ins, launch-readiness for Pro Report.

---

## 90-Day Plan

| Month | Goal | Focus | Exit criteria |
|---|---|---|---|
| **M1** | Activation | Ship everything, first community conversation | Repo live w/ release; npm 150/mo; 30 analyses/wk |
| **M2** | Distribution | Double down on the 2 best channels; SEO pages indexed | 150 analyses/wk; 25 stars; ext 200 installs; 500 visitors/wk |
| **M3** | Monetization | Build Pro Report ($9) + Template Packs ($4.99); email launch to list | First $25–100; 200 analyses/wk; 50 stars |

**Month 2 test that decides everything:** take the W4 channel data — if SEO/score pages drive >30% of analyses, triple down on SEO. If Reddit/India communities drive >30%, ship content weekly there. The plan is a filter for what to kill, not a schedule to follow.

---

## Biggest Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Zero traction persists (no analyses despite shipping) | Medium | Critical | W4 kill-or-double ritual; pivot the *wedge* (badge → score pages → report) — never add features |
| GitHub API rate limits throttle the funnel | High | High | KV cache + cron (frozen M5) — do BEFORE any traffic spike |
| SEO pages don't rank (Google ignores new domain) | Medium | High | Long-tail famous-dev pages, external backlinks (READMEs, directories, awesome lists), patience (90+ days) |
| AI assistants absorb the "analyze my profile" query | Medium | High | Own the *score as a brand* + artifacts (badge/README/report) that agents can't generate on a shareable URL |
| npm postinstall backlash | Low-Med | Medium | Keep message tiny, document opt-out, monitor npm issues weekly |
| Single-founder overload | High | Medium | 30-day plan is the filter; weekly metric review; features stay frozen |
| Paid product flops (0 buys in 6 weeks) | Medium | High | $9 low friction, refund-friendly; interview top analyzers; price-test weekly |

---

## Biggest Opportunities

1. **The badge is a free billboard.** Every badge on a GitHub profile README is seen by recruiters and devs for years. Number of badge embeds is a KPI itself.
2. **/score/[username] = unlimited SEO inventory.** Every analyzed famous dev is a permanent landing page. This is the only distribution engine that scales without the founder.
3. **The job-hunting pain cycle is recurring.** Campus season, off-campus drives, performance reviews — the ICP re-arms 3–4 times a year in India.
4. **First-mover on the "GitHub score" brand.** Score/100 is memorable, embeddable, comparable. Whoever owns that term owns the category.
5. **Marketplace + extension surfaces already built.** Two distribution points cost 0 code, just listing effort — most competitors never ship either.
6. **Template packs are an impulse-buy product** with near-zero infrastructure — the fastest possible second revenue line.

---

## Execution Doctrine (final)

1. Ship existing assets before building anything new (the repo is 2 weeks behind the code).
2. One metric decides every week: **weekly analyses**.
3. Every channel gets 4 weeks to produce — then kill or double.
4. Features stay frozen until the V2 gates (500 analyses/wk, $1K MRR, 100 stars) — *growth is the product now*.
