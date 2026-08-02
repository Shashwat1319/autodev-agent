# AutoDev V2 — Founder Strategy

**Prepared:** 2026-07-30 · **Audience:** founder (self), future investor, future CTO
**Context:** v1.0.0 shipped, 30 tests green, 609 npm downloads/wk, 11 platform visitors/wk, $0 revenue.

**Where we stand, brutally:**
- Product/Engineering: strong (Product 70, Architecture 85, Testing 75, Security 80, Docs 85, DevOps 70)
- Everything that makes money: near zero (Revenue 2, Users 8, Marketing 10, Monetization 5, Retention 3, Brand 20)
- Overall verdict from the founder board: **4.5/10**. The company is 85% engineering and 2% business.
- V2 is the release that starts correcting the business side, on a frozen scope (`AutoDev_V2_Freeze.md`).

---

## TASK 2 — ICP: Who is the FIRST paying customer?

### Primary ICP: The Junior Developer on the Job Hunt

| Attribute | Value |
|---|---|
| Age | 22–29 |
| Profession | Junior / Associate Developer (frontend, backend, or full-stack) |
| Location | India, then SE Asia and LATAM (matches our data: 82% India traffic) |
| Experience | 1–4 years; 0–1 promotions; first/second job change |
| Current state | Applying for jobs, off-campus hiring, or a performance-review cycle is coming |
| Tech literacy | High — uses GitHub, npm, Chrome extensions daily. Comfortable with `npx`. |

**Problems (in their words):**
- "Recruiters looked at my GitHub and said my profile is empty."
- "I don't know what a good profile looks like. Mine is repos with no READMEs and no pinned projects."
- "I spent 2 hours fixing my profile and had no idea if it mattered."
- "My resume is fine, but every second-round interviewer opens my GitHub."

**Goals:**
- Get more interview calls
- Look professional to recruiters and future colleagues
- Have a shareable artifact that proves skill level ("my GitHub scores 87/100")
- Land the promotion / raise

**Why they pay ($9 one-time):**
- The report is directly tied to money: a job, a raise, a promotion — all orders of magnitude larger than $9
- Low friction: no account, no subscription, email + payment link, PDF in inbox
- It is a proof artifact: they send it to recruiters and interviewers
- They already spend on courses, resume services, and interview prep — $9 is inside their budget by default
- Paying at the moment of maximum anxiety (job hunting) converts at the highest rate of any segment

**Why this ICP over all alternatives:**

| Alternative audience | Why not first |
|---|---|
| Senior devs / maintainers | Don't need a score, resent the comparison, won't pay. Their ego works against us. |
| Recruiters / talent teams | Different product (ATS integration, dashboards), long sales cycle, impossible with zero customers and zero social proof. |
| Enterprises | No trust, no reference customers, no sales motion. Team/Enterprise tiers are placeholders, not targets. |
| Students | High volume but zero disposable income; they are traffic, not revenue. |
| Career switchers / bootcamp grads | Great secondary ICP — they are the traffic who will convert once the report exists. They validate the primary ICP's demand. |

**Secondary ICP (feeds the primary):** Bootcamp graduates and career switchers (age 25–32). They have the same problems with even more urgency and weaker profiles. They monetize on the same $9 report; their college/discord networks are viral channels for the score page.

**Whom we deliberately do NOT target for payment yet:** maintainers, recruiters, enterprises. Traffic yes; paid product no.

---

## TASK 3 — Revenue Strategy

### Pricing table

| | **Free** | **Pro** (real, this quarter) | **Team** (placeholder) | **Enterprise** (placeholder) |
|---|---|---|---|---|
| **Price** | $0 | **$9 one-time report** or $5/mo, $49/yr | $49/mo (5 seats) | $199/mo + custom |
| **Score** | 50-metric score | ✓ | ✓ | ✓ |
| **Badge** | ✓ | ✓ (priority styling) | ✓ | ✓ |
| **README generator** | 2 styles | 3 styles + copy-one-click | ✓ | ✓ |
| **Full report** | Top-level tips only | **Full PDF: breakdown, prioritized fix list, top-10% peer comparison** | ✓ | ✓ |
| **History** | — | 30-day score tracking | Team leaderboard | ✓ |
| **Team/org features** | — | — | 5 seats, org profile baseline | SSO, API access, custom scoring, SLA, dedicated onboarding |
| **Upgrade trigger** | Report is behind paywall | Needs the report for job application; one-time price is trivial | Manager wants team standards | Talent team wants scale |

**Why users upgrade (honest mechanics):**
- Free → Pro: the score teases "you're missing 23 points, here are 2 of them." The report names all 23 and how to fix them. The moment of maximum intent is immediately after the score renders — the paywall is right there.
- One-time $9 converts better than $5/mo for job-hunters; subscription is offered as a slower, cheaper entry for the career-forever user.
- Team/Enterprise are not sold this year. They exist in the table to (a) show the ceiling, (b) avoid pricing ourselves into a corner later. Adding them costs nothing; selling them would cost us focus.

### Revenue projections (realistic conversion: 4% free→paid, 5% paid→team, blended 15% discount for annual)

| Total users | Free | Pro (5/mo equiv) | Team | **MRR** | **Annualized** |
|---|---|---|---|---|---|
| 100 | 96 | 4 | 0 | **$20** | $240 |
| 500 | 480 | 20 | 0 | **$100** | $1,200 |
| 1,000 | 960 | 40 | 0 | **$200** | $2,400 |
| 5,000 | 4,800 | 190 | 10 | **$1,440** | ~$17,000 |

Reality check: at current 11 visitors/week, 100 *users* (not visitors) is ~2 months of consistent execution with SEO + marketplace shipping. 5,000 users is a 2–3 year journey **unless** distribution wins land (SEO pages + viral READMEs + marketplace listing). API tier ($10–99/mo) and Action Pro ($9/mo) are upside on top, not part of the base case.

The $1,000 MRR gate is achievable at ~1,000 users with 4%+ conversion and $49 Team sales beginning — which is why the gates for platform evolution (in Task 7) are set there.

---

## TASK 4 — GitHub Launch Checklist

Current state (verified 2026-07-30): the repo is unusually well-prepared for a 6-month-old project. Gaps are concentrated in *verification and distribution*, not creation.

| Item | Status | Action |
|---|---|---|
| **README** | ✅ Done (badges, mermaid architecture, roadmap, security table) | Add live dashboard screenshot + `/score/` links; add "Try it: `npx autodev-agent --score torvalds`" one-liner above the fold |
| **Issues** | 🟡 Partial | Templates exist (bug/feature/config). Add labels (good-first-issue, help-wanted, money-requested) + 5 seeded good-first-issues so newcomers find entry points |
| **Milestones** | ❌ Missing | Create `v1.1.0 — Distribution Ship` (M1–M7 from the freeze doc) and `v2.0.0 — First Revenue`; close `v1.0.0` if open |
| **Releases** | 🟡 Verify | Confirm v1.0.0 release exists with changelog; v1.1.0 release must attach the built action `dist/`, badge SVG, and changelog |
| **License** | ✅ MIT | — |
| **Contributing** | ✅ CONTRIBUTING.md exists | Add "how to run platform + agent locally" quickstart if absent |
| **Security** | ✅ SECURITY.md + dependabot + CODEOWNERS | Add security.txt if trivial; otherwise done |
| **Documentation** | 🟡 Good | HANDOVER.md exists; add short `docs/SCORING.md` (public methodology — critical for trust, see Risk 9) and `docs/API.md` |
| **Demo** | ❌ Missing | No demo video found. Produce a 30–60s screencast (analyze → score → README generated) via Loom or a GIF from existing `assets/cli.png`; embed in README + release notes |
| **Screenshots** | ✅ 6 assets exist | Wire `assets/*` into README gallery (currently unwired in places) |
| **Badges** | ✅ Present | Add the "Analyze your profile" GitHub Action badge + npm version badge in README |

**Post-checklist distribution actions (same session):**
- Add GitHub Action to Marketplace (`github-action/` is built and tested)
- Set repo topics: `github-profile`, `readme-generator`, `developer-tools`, `github-api`, `resume-builder`
- Add GitHub Sponsors button (opens the fundraising channel for free, costs nothing)
- Publish `agent` v1.0.1 to npm (postinstall + `--score` shipped, tested, unpublished)
- Pin a "⭐ Star us" issue or add `Star History` widget to README

---

## TASK 5 — Founder KPIs

### North Star Metric
**Weekly analyses** (profiles scored on the platform per week). Rationale: it captures the product's core value moment (the score), filters out bounce traffic, and every analysis is a potential /score/ SEO page + README + share.

### KPI dashboard (weekly review, 30/60/90 targets)

| KPI | Now (baseline) | 30 days | 60 days | 90 days | Source |
|---|---|---|---|---|---|
| Weekly analyses (NSM) | ~5 (untracked) | 30 | 100 | 500 | Analytics custom event `profile_analyzed` (shipped) |
| READMEs generated / wk | ~5 (untracked) | 20 | 50 | 250 | `readme_generated` event |
| npm downloads / wk | 609 | 700 | 800 | 1,000 | npm API |
| Chrome extension installs | 0 | 50 | 250 | 1,000 | Web Store dashboard |
| GitHub Action runs / wk | 0 | 25 | 100 | 300 | Marketplace insights |
| GitHub stars | verify | 10 | 30 | 50 | repo |
| Paid users | 0 | 1 | 5 | 15 | Stripe |
| MRR | $0 | $5 | $25 | $75 | Stripe |
| Organic indexed pages | 9 | 30 | 60 | 90 | GSC (re-verify sitemap) |
| Platform visitors / wk | 11 | 200 | 500 | 1,000 | Vercel analytics |
| Bounce rate | 45% | 42% | 40% | 35% | Vercel analytics |
| Email list | 0 | 50 | 150 | 300 | capture form |
| India share | 82% | 75% | 68% | 60% | Vercel analytics (diversification) |

### Funnel we actually track
`Visitor → analyze → README generated → share/backlink → return → paid`

### Rules of the dashboard
- Review every Monday. 30 minutes, no more.
- **Kill rule:** any channel or feature that produces 0 signups/analyses for 4 straight weeks gets killed or reworked. (No vanity metrics — installs count only if they become analyses.)
- Attribution (M6 in freeze doc) is required for the funnel to be readable; it is the #1 instrumentation priority.

---

## TASK 6 — Top 10 Risks

Ranked by likelihood × impact for the next 90 days.

| # | Risk | Type | Likelihood | Impact | Mitigation |
|---|---|---|---|---|---|
| 1 | **Traffic stays at ~11 visitors/wk** — the product dies of silence | Business/Marketing | High | Critical | /score/[username] SEO pages (M2), marketplace listings (M4), README viral loop (M3). If 30-day targets miss, kill rule forces channel rework — not more features |
| 2 | **GitHub rate-limit 429s** when /score/ pages get crawled or /score/ spam-bombing starts | Technical | High | High | Vercel KV cache + cron prefetch (M5); cache-first for popular profiles; 429 page with retry UX instead of a dead error |
| 3 | **Nobody pays** — report purchased 0 times in first 6 weeks | Revenue | Medium-High | Critical | One-time $9 (lowest friction), refund-friendly, price iteration allowed weekly, annual discount; if zero buys, interview the top 10 analytics users about the report before changing anything else |
| 4 | **Google ignores us** — /score/ pages don't rank | Marketing | Medium | High | Schema + canonical + sitemap already shipped; GSC delete/re-add pending; famous-dev pages target long-tail ("<name> github score"); need external backlinks from READMEs, GreasyFork, directories |
| 5 | **Copycat** (existing README generators add scoring; new tool clones the badge) | Competition | Medium | High | Speed + distribution now (weeks ahead matters); brand the score ("AutoDev score" becomes the term); badge embed lock-in; community over features |
| 6 | **Single-founder overload / scope creep** | Personal | High | Medium | Scope freeze doc is binding; 30-day plan from roadmap; ship small daily; Monday metrics ritual; V3 gated, not scheduled |
| 7 | **npm postinstall backlash** | Reputation | Medium | Medium | Message stays tiny + opt-out documented; CI auto-skip already handled; monitor npm issues weekly; if >0% hostile reports, remove message — not worth reputation |
| 8 | **Chrome Web Store rejection / delay** | Marketing | Low-Med | Medium | Privacy policy page (M4 prep), honest minimal permissions, screenshots pre-made; account for 2-week review lag in 30-day plan |
| 9 | **Score accuracy complaints** — "my score is wrong, this tool is a joke" | Business | Medium | High | Public methodology doc (`docs/SCORING.md`), calibration examples (show real famous devs' scores), allow "why" explanation on every score, respond to every complaint on GitHub in <24h |
| 10 | **Serverless cost / rate-limit spend spike** (Vercel + GitHub API + Sentry) | Financial | Low-Med | Medium | Cache-first architecture (M5) collapses per-analysis cost toward $0; Sentry quotas; monthly cost review — target <$10/mo infrastructure at 1,000 visitors/wk |

**Watch item (not a top-10 yet):** AI assistants (ChatGPT/Claude) absorbing one-off profile analysis. Mitigation: don't compete on "answer generation" — compete on *the score as a brand and the README/report as artifacts*, which agents don't produce for you on a shareable URL.

---

## TASK 7 — Final Recommendation

### Decision: **Stay an independent, focused product for the next 6 months — do NOT evolve into a larger platform now. Architect for it, defer building it, gate it hard.**

**Verdict in one line:** Independent product now, platform later, with three hard gates.

### Reasoning

**1. We have no evidence of a platform audience.**
11 visitors/week and 0 paid users cannot carry accounts, a database, team dashboards, or marketplace ambitions. Every platform feature is exactly the scope creep the freeze doc exists to block. A platform with no users is a portfolio project; a focused tool with users is a company. We do not have the users yet.

**2. The growth engine is not a platform — it's the score wedge.**
The differentiated brand is "the GitHub score" — an instantly shareable, embeddable, comparable number. It spreads through: the badge (viral artifact), the README generator (backlink loop), /score/[username] pages (SEO inventory), and the extension/CLI/action surfaces (already built). All of these are independent-product moves, and all are already 80% shipped.

**3. The platform foundation already exists in the architecture.**
The monorepo with `shared/types`, the API, the action, the extension, and the CLI *is* a platform skeleton — we simply don't activate it. That means "platform later" is a genuine option, not a fantasy. The day the gates are hit, adding auth + accounts + portfolio pages is an incremental release, not a rewrite.

**4. The revenue math supports waiting.**
~$200 MRR at 1,000 users with a one-time report. Platform features (Team, Enterprise, API) don't unlock revenue until there's an audience to sell to. The sequence must be: traffic → conversion → revenue → then platform breadth. Inverting it (platform first, traffic later) is the classic solo-founder trap.

### The gates (from the freeze doc — binding)

Platform evolution may begin only when **all three** are true:
1. **500 weekly analyses**
2. **$1,000 MRR**
3. **100 GitHub stars**

### What "platform" means if we hit the gates (concrete, not vibes)
- Accounts + saved profiles → score history and public portfolio pages ("my AutoDev portfolio")
- The score becomes a credential: recruiters search high-scoring profiles → a talent-matching layer is the eventual business, not the current one
- Team/Enterprise tiers activate; API monetizes
- AI-platform integration (from the roadmap) becomes a distribution deal, not a feature

### If we do NOT hit the gates
At month 6: honest reassessment. Either distribution has failed (pivot the wedge — different surface, same score) or the category is dead (AI absorption). In no scenario do we add features as the response to missing growth. That is the rule.

**Final answer: independent product, this quarter. Platform, only on proof. The freeze doc is the contract.**
