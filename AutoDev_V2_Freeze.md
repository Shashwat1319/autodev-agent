# AutoDev V2 — Scope Freeze

**Decision date:** 2026-07-30
**Status:** FROZEN. No feature enters V2 unless it passes the test below.
**The test:** *Does this feature get us a user or a dollar within 30 days?* If the answer is no, it is frozen.

Current reality check:
- 609 npm downloads/week (agent) — our only real audience
- 11 visitors/week on the platform, 45% bounce, 82% India, 91% desktop
- Revenue: **$0**. Business score: 2/100. Monetization score: 5/100.
- 0 paid users, 0 tracked conversions (analytics events shipped but unmeasured)

V2 is not a features release. V2 is the release where we **convert existing traffic into users, and users into the first $1**. Everything below is sized to that goal.

---

## 1. What MUST be in V2

### M1. Pro Report + Stripe checkout (the paid product)
The one-click PDF report: full 50-metric breakdown, prioritized fix list, comparison against the top 10% of peers, printable for job applications. Paywall the deep report, keep the free score.

**Why it must ship:** Revenue is $0 and nothing else in this plan produces a dollar. Without a payment path, every visitor is a missed conversion. A $9 one-time report is the lowest-friction paid product that exists: no account, no subscription, no trust build-up — the score is already delivered, the report is the deep version.

### M2. `/score/[username]` SEO pages
Dynamic, statically-indexable pages for every analyzed dev: `/score/torvalds`, `/score/gaearon`, `/score/<any-username>`. Each page is a permanent landing page with the user's score, breakdown, and a "get yours" CTA.

**Why it must ship:** Marketing budget is $0 and will stay $0. 11 visitors/week is not a product, it's a ghost town. Famous-dev pages are free SEO inventory — every page can rank for "torvalds github score" and similar. This is the cheapest traffic engine that exists for us. The dashboard empty-state chips (torvalds, gaearon, tj, sindresorhus) already hint at this demand.

### M3. README generator v2 (3 styles, copy-in-one-click)
Three named styles (e.g., Minimal / Pro / Bold), rendered preview, one-click copy, plus "host on GitHub" instructions.

**Why it must ship:** The README generator is our only viral loop — every generated README is publicly visible on GitHub and links back to the site. 609 npm downloads/week is the top-of-funnel; READMEs are how those installs turn into backlinks and new visitors. A README is also the artifact that makes a dev's profile (and therefore the score) better — it closes the loop between our product and the score it advertises.

### M4. Ship the existing distribution assets
- GitHub Action listed on the Marketplace
- GreasyFork userscript live
- Chrome Web Store listing live
- `agent` v1.0.1 published to npm (postinstall message + `--score` flag — code is done and tested)

**Why it must ship:** These are **zero new code**. They are already built, tested (action scored 53 against the founder's profile), and sitting unshipped. Distribution is the #1 weakness (marketing score 10/100); shipping what exists costs hours, not weeks.

### M5. Vercel KV cache + cron prefetch for GitHub API data
Move from in-memory per-instance rate limiting to cached analysis results with a cron refreshing popular profiles (famous devs for /score/ pages, plus any profile hit more than N times/day).

**Why it must ship:** Two reasons. First, `/score/[username]` SEO pages will get scraped and hammered — per-instance in-memory state means every burst of crawl traffic burns the GitHub rate limit and returns 429s to real users, killing the funnel at the exact moment traffic arrives. Second, cached popular profiles make famous-dev pages instant and infinitely cheap (s-maxage=300 exists; cache hits go to 0 API calls).

### M6. Install attribution (extension + CLI → site)
Track which channel (npm postinstall, extension install, GreasyFork, action, SEO) produced each first visit/analyze.

**Why it must ship:** We cannot run a growth funnel we cannot see. Currently: 609 npm downloads/week and zero knowledge of how many become users. Attribution costs a few lines (UTM params in postinstall/extension links + the `track()` calls already shipped) and tells us where to spend the 4 hours of daily execution.

### M7. Email capture (one opt-in box on the dashboard, behind the score)
Plain email input: "Get your score report + growth tips when it's ready."

**Why it must ship:** Email is the only asset that survives a platform migration, a domain change, or a SEO setback. With 0 auth and 0 accounts, it is also the only retention mechanism we have. Cost: one input + one Vercel edge function + free tier of any email provider.

**V2 scope = M1–M7. Everything else is frozen.**

---

## 2. What MUST NOT be in V2

| Feature | Why it is frozen |
|---|---|
| Accounts / login / auth | Kills friction, requires a DB, and exists to serve Team features nobody pays for. Pro report works without auth (email + payment link). |
| LLM / "AI insights" | Costs money per call, no proven demand, and every AI-whatever tool ships it — it is a checkbox, not a moat. Revisit only as a Pro upsell with a hard cost cap. |
| Team / org features | 0 paying customers. Building collaboration for a team plan with no buyers is the definition of fantasy. Team tier stays a placeholder. |
| Public API for third parties | Sell API access only when there is proven external demand. Building an API first is a solution in search of a problem. |
| PWA / mobile | 91% desktop. Our users are developers at laptops. |
| Localization | 82% India but the product is English-native and the ICP is bilingual. Translations are polish, not growth. |
| Gamification / achievements / leaderboards beyond score | The badge is the viral artifact; anything more is feature creep with no revenue path. |
| IDE plugin / desktop app | The Chrome extension already covers the visible surface. A new install surface multiplies support burden, not users. |
| "AI chat" assistant widget | Demo-ware. It makes the demo feel smart and the roadmap feel busy; it does not make the first $1. |
| Dark mode / design-system overhaul | Polish. The current UI is functional and documented. Redesigns at 11 visitors/week are self-indulgence. |
| Changelog-driven features (GitHub API, contribution graph, etc. as standalone pages) | Already partially in v1; any *new* metric pages beyond the score page itself are frozen until /score/ pages prove they rank. |

---

## 3. Hard gates for V3 (to keep future scope honest)

V3 scope may be discussed only when **all three** are true:

1. **500 weekly analyses** (North Star, defined in strategy doc)
2. **$1,000 MRR**
3. **100 GitHub stars**

Until then: V2 scope is frozen, the 30-day execution plan from `AutoDev_V2_Roadmap.md` runs, and new feature ideas go into the backlog file — not into the code.

---

## 4. What V2 success looks like (definition of done)

- First $1 received from a paying user
- ≥1,000 weekly visitors (from 11) — majority organic, driven by /score/ pages
- ≥100 READMEs generated/week
- Extension, action, userscript, agent v1.0.1 all live on their platforms
- Email list ≥200 opt-ins
- Bounce rate below 40% (from 45%)

Nothing else counts as V2 success.
