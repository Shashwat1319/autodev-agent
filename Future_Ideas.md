# Future_Ideas.md — Feature Registry (CTO-controlled)

**Status: FEATURE FREEZE ACTIVE (from 2026-08-02).**
**Owner: CTO (opencode).** No feature enters the codebase unless it passes the framework below and is logged in this file.

**Priority order — anything that violates this order is auto-rejected:**
`Distribution → Marketing → Users → Revenue → Features`

A feature request can only be accepted if it demonstrably serves Distribution, Marketing, Users, or Revenue — and even then it must beat the current alternative (usually: *ship what's already built*).

---

## The Evaluation Framework (apply to EVERY idea)

| Field | Answer |
|---|---|
| **Problem Solved** | What real problem, for whom, right now? |
| **Who requested it** | User? Founder? Self? Recruiter? Nobody? ("Nobody" = reject) |
| **Expected Impact** | Users, revenue, or distribution — quantified |
| **Engineering Cost** | Days of solo-founder work |
| **Maintenance Cost** | Ongoing burden per month (lines, deps, support) |
| **Revenue Impact** | $/month potential, direct or enabling |
| **User Impact** | How many users, how deeply |
| **Priority** | P0 (blocking) / P1 (this quarter) / P2 (next quarter) / P3 (never-ish) |
| **Decision** | **Accept** / **Reject** / **Postpone** (with trigger) |

**Suggestion template for the founder:** *"Idea: <title>. Problem: <who+what+why now>. Expected: <user/revenue/distribution number>."* — if any field is missing, the answer is Postpone.

---

## Accepted (approved — will be built, in this order)

| ID | Title | Why accepted | Est. | Priority |
|---|---|---|---|---|
| A-01 | **Pro Access + Razorpay (₹749, one-time)** | Only revenue feature; first $1 milestone; low friction (no account). **SHIPPED 2026-08-02** — pivoted from $9 PDF to live dashboard insights (no PDF selling; retains users on site). Razorpay replaces Stripe (India ICP). Pending: user creates Razorpay payment link + Vercel env | done | P1 ✅ |
| A-02 | **/score/[username] SEO pages** | Free perpetual distribution; the only engine that scales without the founder | 3–4 d | P1 |
| A-03 | **README generator v2 (3 styles + copy-one-click)** | Viral loop: every README is a public backlink; closes score→README loop | 2–3 d | P1 |
| A-04 | **Vercel KV cache + cron prefetch** | Prevents 429-funnel-kill when traffic arrives; enables A-02 cheaply | 2–3 d | P1 (before traffic) |
| A-05 | **Install attribution (npm/ext/action → site)** | Without it we cannot run the kill-or-double ritual; 4 lines of UTM + events | 0.5 d | P1 |
| A-06 | **Email capture (dashboard opt-in)** | Only retention asset without accounts; survives any platform pivot | 0.5 d | P1 |
| A-07 | **Template Packs — badge styles SHIPPED (classic/gold/dark, Pro-gated picker); premium README templates POSTPONED** | Fastest second revenue line; near-zero infra; impulse buy. Badge styles done as Pro perk (2026-08-02); README templates skipped — zero users on that tool; revisit when readme-generator traffic exists | 1 d (badge) | P2 (after A-01) |

---

## Rejected (closed, do not resurface without new evidence)

| ID | Title | Reason |
|---|---|---|
| R-01 | Auth / accounts / login | Kills friction, needs DB, serves Team fantasy at 0 users. Pro report works without it |
| R-02 | "AI chat" assistant widget | Demo-ware. Every AI tool has one; it is a checkbox, not a moat |
| R-03 | LLM-generated insights | Cost per call, unproven demand, no differentiator |
| R-04 | Gamification / achievements / leaderboard toys | Badge is the viral artifact; anything more is creep with no revenue path |
| R-05 | PWA / mobile app | 91% desktop. Our users are devs at laptops |
| R-06 | Dark-mode / design-system overhaul | Polish at 11 visitors/week is self-indulgence |
| R-07 | IDE plugin / desktop app | Chrome extension already covers the surface; multiplies support, not users |
| R-08 | Team / org collaboration features | 0 paying customers; building for buyers that don't exist |
| R-09 | Public API for third parties | Solution in search of a problem; sell API only when demand exists |

---

## Postponed (viable later — each has a trigger)

| ID | Title | Trigger to un-freeze |
|---|---|---|
| P-01 | Accounts + saved profiles / score history | 500 analyses/wk AND 1,000 MRR AND 100 stars (V2 gates) |
| P-02 | Portfolio pages ("my AutoDev portfolio") | Same gates; requires P-01 |
| P-03 | Job / talent marketplace (recruiters pay for scores) | P-02 live AND recruiter demand signals |
| P-04 | Enterprise / Team tiers ($49/$199) | 1,000+ users with org requests in support inbox |
| P-05 | API monetization | External developers asking in issues (3+ distinct requests) |
| P-06 | Localization (Hindi first) | India share >70% with ≤2% conversion at the report step — *then* test Hindi as a conversion lever, not a feature |
| P-07 | Discord/community server | 100+ active users; a dead server costs more than none |
| P-08 | IDE plugin | Extension installs >5,000 |
| P-09 | README multi-language generation | Template Packs revenue >$200/mo |

---

## Needs Research (not decided — go find evidence, then re-enter)

| ID | Title | Research question | Cost of answering |
|---|---|---|---|
| N-01 | AI platform integration (from HANDOVER) | Can ChatGPT/Claude ecosystem be a distribution deal rather than a feature? | 1 afternoon of reading docs |
| N-02 | Historical score tracking (30-day) as Pro upsell | Do analyzers return? (Measure A-06 email + retention first) | Already instrumented via A-05 |
| N-03 | Competitor comparison in report | Does "your score vs top 10%" convert better than absolute score? | A/B on Pro report copy |
| N-04 | Affiliate (resume/course services in Pro report) | Would ICP click paid recommendations at the report moment? | Ask 10 free-report interviewees |
| N-05 | Badge customization (colors/styles) | **Answered 2026-08-02:** styles shipped (classic/gold/dark) as Pro perk; watch whether badge-style usage grows Pro conversion | Shipped — measure |

---

## Revenue Features (everything that could make money, ranked)

| ID | Title | Est. time | Revenue potential | Status |
|---|---|---|---|---|
| A-01 | Pro Access (₹749 one-time, Razorpay, live dashboard insights) | done | $0→$500/mo over 6 months | **Shipped 2026-08-02** |
| A-07 | Template Packs — badge styles (classic/gold/dark) | 1 d | Fastest second line; low ceiling | Badge styles shipped; README templates postponed |
| R-10 | GitHub Sponsors button + Funding.yml | 10 min | $0 short-term; signals sustainability | Postponed (add with release push) |
| N-04 | Affiliate placements in report | 0.5 d | $5–20/mo early; trust risk | Needs research |
| P-04 | Team $49/mo | 10+ d | High ceiling, zero current buyers | Postponed |
| P-05 | API ($10–99/mo) | 5+ d | Unknown demand | Postponed |
| P-03 | Talent marketplace | 60+ d | Highest ceiling of all | Postponed (gates) |

---

## Technical Debt (not features — must be scheduled, not debated)

| ID | Item | Cost to fix | Risk if ignored |
|---|---|---|---|
| D-01 | `/api/health` version hardcoded "0.2.0" | 5 min | Monitoring lies |
| D-02 | `count_private=true` in README stats URLs | 15 min | Wrong stats in generated READMEs |
| D-03 | Fork repos counted in scoring | 1 h | Score-accuracy complaints (trust risk #1) |
| D-04 | npm audit high-severity (agent dev deps, ts-node chain) | 30 min | Ugly `npm install` output; supply-chain optics |
| D-05 | ESLint warnings (img-element ×5, exhaustive-deps ×3) | 1 h | CI noise; real bugs hide behind it |
| D-06 | No integration tests for API routes / agent watcher | 1–2 d | Refactors ship blind |
| D-07 | README CI badge `branch=main` vs `master` | 1 min | Broken badge on push day — **fix before pushing** |
| D-08 | CI badge references non-existent branch/workflow link | 5 min | Dead link in hero section |

---

## Nice to Have (only after P1s, only if time is truly idle)

| ID | Title | Est. |
|---|---|---|
| H-01 | Demo GIF + screenshots wired into README | 1 h (do with release) |
| H-02 | FAQ section (methodology, privacy, rate limits) | 30 min |
| H-03 | `docs/SCORING.md` public methodology | 45 min |
| H-04 | Star-history widget | 10 min |
| H-05 | Social share cards per score page | 2 h |
| H-06 | "Try famous devs" chips on homepage (torvalds, gaearon…) | 30 min (already on dashboard) |

---

## CTO Doctrine (binding)

1. **Freeze is on.** No new feature idea gets code time — it gets a row in this file.
2. Every suggestion is answered with the framework table, not an opinion.
3. Priority ladder: **Distribution → Marketing → Users → Revenue.** Features are last, and usually lose.
4. The default answer to "should we build X?" is **Postpone** — unless X ships an existing asset or converts users to revenue.
5. When in doubt, the alternative is: *push the repo, publish npm 1.0.1, list the Action, post on r/developersIndia* — all pre-built, all unshipped.
