# Stage 0 Validation Plan — AutoDev vs New Opportunity

**Date:** July 7, 2026
**Context:** Solo India-based dev, $0 budget, 3 months of work invested in AutoDev

---

## Executive Summary

**Decision:** Validate a new product (cloud spend watchdog) over 7 days. Do not invest more engineering time into AutoDev until evidence justifies it. AutoDev stays live as a side project.

**Why:** The weighted decision matrix below shows the new opportunity scores 7.05/10 vs AutoDev's 5.00/10. The gap is driven by one critical factor: **cloud billing shock is a painful, recurring problem with willingness to pay; AutoDev solves curiosity with no natural monetization.**

**Caveat:** This is a 7-day experiment, not a pivot. You validate both options simultaneously — AutoDev by not investing more, the new product by testing demand. After 7 days, you get a go/no-go with data, not assumptions.

---

## 1. Weighted Decision Matrix

### Definitions

| Dimension | Weight | Why This Weight |
|-----------|--------|-----------------|
| Market Pain | 20% | Determines whether anyone will care |
| Distribution | 15% | $0 budget means organic reach is everything |
| Monetization | 15% | You need revenue (goal: $5 for Chrome Store unless not applicable) |
| Time to MVP | 15% | Solo founder with limited runway |
| Competition | 15% | Existing solutions limit upside |
| Technical Feasibility | 10% | Must be buildable solo with $0 |
| Founder Fit | 5% | Your skills and interest matter |
| Leverage Existing Assets | 5% | Reusing AutoDev code/infra reduces risk |

### Option A: AutoDev (GitHub Scorecard Positioning)

| Dimension | Score (0-10) | Weighted | Rationale |
|-----------|:---:|:--------:|-----------|
| Market Pain | 2 | 0.40 | Solves curiosity about "what's my GitHub score" — not a pain. Users check once and leave. |
| Distribution | 5 | 0.75 | Badge viral loop works but coefficient < 0.1. GitHub search + npm drive discovery. |
| Monetization | 2 | 0.30 | Near-zero willingness to pay. github-readme-stats (20K stars) is free forever. No premium feature has cleared the "would you pay?" test. |
| Time to MVP | 9 | 1.35 | Already built. All features work. 609 npm downloads/week. |
| Competition | 4 | 0.60 | github-readme-stats dominates (20K stars, 10+ themes). Profile-summary-for-github exists. AutoDev's differentiators (badge + Chrome extension + CLI agent) are weak moats. |
| Technical Feasibility | 9 | 0.90 | Next.js + GitHub API. Well-understood stack. No infrastructure risk. |
| Founder Fit | 8 | 0.40 | You built it. You understand the domain intimately. |
| Leverage Assets | 10 | 0.50 | All existing assets are AutoDev: code, README, npm package, GitHub repo, Product Hunt listing, Google Search Console. |
| **Total** | **—** | **5.00** | — |

### Option B: Cloud Spend Watchdog (New Product)

Product concept: a simple tool that monitors your cloud provider bills in real-time, alerts you before spending exceeds thresholds, and optionally auto-disables resources when spending hits a cap. Starts with Vercel, expands to AWS.

| Dimension | Score (0-10) | Weighted | Rationale |
|-----------|:---:|:--------:|-----------|
| Market Pain | 9 | 1.80 | Documented cases: $23K Vercel (DDoS), $96K Vercel bandwidth, $3.2K student bill, $700→$1.1K Pro plan creep (UsageBox June 2026, ServerlessHorrors). Multiple Reddit/HN threads. Pain is financial and acute. |
| Distribution | 8 | 1.20 | Bill shock stories go viral naturally (see: $23K Vercel thread, $34K Cloudflare story). Every thread is free distribution. Single blog post could reach 10K+ devs in 48 hours. |
| Monetization | 9 | 1.35 | "Save $23K for $50/month" is the easiest sales pitch in software. Subscription model fits naturally. Free tier creates trust, paid tier unlocks real protection. |
| Time to MVP | 3 | 0.45 | Not built. Need: API integrations (Vercel, AWS), threshold engine, alerting system (email/SMS), dashboard. Estimated 2-4 weeks for functional MVP. |
| Competition | 8 | 1.20 | Enterprise tools exist (CloudZero, CAST AI, CloudKeeper) — all start at $1000+/month for teams. **No simple tool for individual developers.** StackSpend exists but is analytics, not protection. Gap is real. |
| Technical Feasibility | 7 | 0.70 | Feasible solo: Vercel deployment API exists, AWS Budgets API exists, GitHub Actions cron for free polling. No AI needed. Challenge: SMS alerts cost money, multi-cloud scope creep. |
| Founder Fit | 5 | 0.25 | Different domain from AutoDev (profiles → infrastructure). You'd learn new APIs but no deep cloud infra expertise needed. |
| Leverage Assets | 2 | 0.10 | Minimal reuse. Maybe auth patterns, UI components, deployment pipeline. The code, branding, audience, and SEO are largely new. |
| **Total** | **—** | **7.05** | — |

### Matrix Verdict

| Option | Score | Verdict |
|--------|:-----:|---------|
| AutoDev | **5.00** | Built but tops out. Fine side project, not a business. |
| Billing Watchdog | **7.05** | Higher pain, higher willingness to pay, viral distribution pattern. Worth validating. |

**But note:** AutoDev is built (10/10 on time to MVP) and Billing Watchdog is not built (3/10). The 7.05 vs 5.00 gap assumes you invest 2-4 weeks to build. The validation experiment tests whether that investment is justified.

---

## 2. Confidence Scores

### AutoDev — Confidence: 30% (Low)

| Assumption | Confidence | Why |
|------------|:----------:|-----|
| Can reach 1,000 monthly users | 40% | Badge viral loop is weak. GitHub search is capped. All free channels (Reddit, HN, Dev.to) require karma/whitelisting. |
| Can reach $100 MRR | 10% | No premium feature has been validated. github-readme-stats has 20K+ stars and $0 revenue. Profile analysis tools don't monetize. |
| Users return more than once | 25% | Score is a one-time check. No natural retention loop. Nothing changes day-to-day. |
| Recruiters actually use scores | 20% | No evidence recruiters check GitHub scores. They check repos, contributions, PRs. Scores are a vanity metric. |
| Badge drives meaningful growth | 35% | Viral coefficient < 0.1 means each user brings <0.1 new users. Need 10 users to get 1 more. |
| **Overall confidence** | **30%** | **AutoDev is a solved curiosity with no natural monetization path.** |

### Cloud Billing Watchdog — Confidence: 60% (Medium-High)

| Assumption | Confidence | Why |
|------------|:----------:|-----|
| Cloud billing shock is widespread | 85% | 9+ documented cases ($100K Firebase, $96K Vercel, $23K Vercel, $34K Cloudflare, $34K AWS, $3.2K student, $700→$1.1K Pro plan, $104K Netlify, $120K Cloudflare). Multiple sources across 2025-2026. Pattern is clear. |
| Existing solutions don't serve indie devs | 75% | All cloud cost tools are enterprise ($1K+/mo for CloudZero, CAST AI, CloudKeeper). No simple "set a budget and get alerted" tool for individual devs. |
| Devs will pay for protection | 70% | Financial pain converts well. "Pay $50 to avoid $23K loss" is straightforward math. But: devs may accept risk or use manual spend caps. |
| Can build MVP solo in 2-4 weeks | 80% | Vercel API is documented. AWS Budgets API is mature. GitHub Actions cron is free. No AI or ML needed. |
| Revenue model sustains | 55% | Subscription ($5-20/mo) works if value is clear. Biggest risk: cloud providers add built-in spend alerts (Vercel already improved pricing after backlash). |
| **Overall confidence** | **60%** | **Problem is real. Evidence is strong. Risk is execution and competition from platform-native solutions.** |

### Key Insight About Confidence

The 30% vs 60% gap is not about which product is "better." It's about the difference between:

- **AutoDev:** You already did the work. The uncertainty is about user behavior (do they care? will they pay? will they return?). You can't engineer your way out of low willingness to pay.
- **Billing Watchdog:** The work is ahead of you. But the market signal is much clearer. The uncertainty is about execution (can you build it? can you reach users?).

---

## 3. Seven-Day $0 Validation Experiment

**Goal:** Determine whether the cloud billing shock problem is worth 2-4 weeks of engineering time.

**Cost:** $0 (Vercel free tier, GitHub Pages, free email service)

**Signal needed:** 20+ email signups from developers who have experienced or fear cloud billing shock, with genuine context in their signup message.

### Day 1: Build Landing Page (4 hours)

Create a single-page site at a new Vercel project (separate from autodev):

```
spendguard.vercel.app (or your-subdomain.vercel.app)
```

**Content:**
- Headline: "Never wake up to a $23,000 cloud bill again."
- Subheadline: "Real-time spend alerts and auto-protection for your Vercel, AWS, and cloud services. Set your budget. Get alerted before you overspend."
- Social proof section: 3 real bill shock stories (sourced from your research — $23K Vercel, $96K Vercel, $3.2K student)
- How it works: 3 steps (Connect provider → Set budget → Get alerts)
- Email capture form with subject line: "Notify me when SpendGuard launches"
- Bonus CTA: "I've experienced cloud bill shock — tell me more"

**No code needed for this** — use a simple HTML/CSS page or Vercel template.

### Day 2-3: Generate Traffic (6 hours total)

**2a. Write and publish a blog post: "The Real Cost of Cloud Bill Shock in 2026"**

Structure:
- Opening hook: "I woke up to a story about a $23,000 Vercel bill. It wasn't the only one."
- Body: Compile the 9 documented cases with sources (UsageBox, ServerlessHorrors, Medium, Reddit)
- Analysis: Why usage-based pricing creates this risk (no spend caps, invisible meter, bot traffic counts)
- Solution tease: "I'm building a free tool that monitors your cloud spend and alerts you before disaster."
- CTA: "If this resonates, drop your email here → [link]"

**Distribution channels:**
- Dev.to (free, no karma required) — publish as a story, not a promo
- LinkedIn post (your network, organic)
- Hacker News "Ask HN: Have you experienced cloud bill shock?" (discussion, not promotion)

**2b. Post to relevant Reddit communities:**
- r/webdev — "I compiled 9 cloud billing horror stories from 2025-2026. These are all real."
- r/devops — discussion thread about cloud billing protection
- r/SaaS — "How do you protect against cloud bill shock?"
- r/selfhosted — alternative perspective

**Rules for Reddit:**
- Do NOT link to landing page in post body
- Include link in comment if someone asks
- Focus on discussion value, not promotion

**2c. Search for recent bill shock threads on HN/Reddit and comment helpfully**

Find 5-10 recent threads about cloud billing. Comment with useful information (you have the research). If relevant, mention "I'm looking into building a tool for this" — gauge reaction.

### Day 4-5: Direct Outreach (4 hours)

**Objective:** Find 10 developers who have experienced cloud bill shock and interview them.

**Method:**
- Search Reddit for users who posted bill shock stories (the metadata says "posted by u/username")
- LinkedIn search for "Vercel bill shock" or "cloud billing nightmare"
- Comment on their thread: "Hey, I'm researching a solution for this. Would you be open to a 10-min call?"

**Interview script (5 questions):**
1. "What happened with your cloud bill?" (understand the pain)
2. "How much was the overage?" (quantify the cost)
3. "Did you get it refunded?" (understand resolution mechanics)
4. "What do you use now to prevent it from happening again?" (current behavior)
5. "If a tool existed that alerted you at 50%/80%/100% of your budget, would you use it? Would you pay $5/month for it?" (willingness to pay)

**Target:** 5-10 interviews. Document responses in a table.

### Day 6: Analyze Signal (2 hours)

**Compile evidence:**

| Signal Source | Metric | Go Signal | No-Go Signal |
|--------------|--------|-----------|--------------|
| Landing page | Email signups | 20+ in 7 days | <5 signups |
| Blog post | Dev.to views | 500+ views | <100 views |
| Blog post | Comments mentioning bill shock | 5+ personal stories | 0 stories |
| Reddit/HN | Upvotes + discussion engagement | 50+ upvotes, 20+ comments | <10 upvotes |
| Direct outreach | Interview completion rate | 5+ interviews booked | <2 interviews |
| Direct outreach | "I would pay $5/mo" count | 3+ out of 5 say yes | 0-1 out of 5 say yes |

**Decision framework:**
- **GO:** 4+ of 6 signals hit green. Start building Week 1 MVP.
- **NO-GO:** 3 or fewer green signals. Either pivot (different problem) or accept AutoDev as side project.
- **WEAK GO (extend):** Mixed signals. Extend experiment by 7 days with different angle (target AWS users instead of Vercel, or target a different billing problem).

### Day 7: Decide + Write Report (2 hours)

**Document:**
- Interview summaries
- Landing page conversion rate
- Community engagement (Reddit/HN/Dev.to)
- Clear go/no-go/weak-go recommendation

**Total time investment: 18 hours**

---

## 4. Objective Kill Criteria

These are the exact metrics that would make me abandon AutoDev as a primary focus:

### Hard Kill Criteria (If ANY of these are true, stop investing in AutoDev)

| # | Criterion | Why It's Terminal | Source of Truth |
|---|-----------|-------------------|-----------------|
| 1 | **The 7-day billing watchdog experiment gets more email signups (20+) than AutoDev got total visitors (25) in 30 days.** | If a landing page with 1 day of work outperforms a fully-built product with 3 months of work, the product is the problem. | Landing page analytics vs Vercel Analytics |
| 2 | **Fewer than 2 out of 5 interviewed billing shock victims say "I would pay for this."** | Without willingness to pay, this is just another curiosity. | Interview transcripts |
| 3 | **AutoDev still has <50 monthly visitors 60 days from now with no active investment.** | If you stop marketing, you confirm the product has no organic growth. | Vercel Analytics, 60-day check |
| 4 | **AutoDev's badge is indexed by Google on <10 GitHub profile READMEs 90 days from now.** | The viral loop is not working. Badge installs are the only growth mechanic. | GitHub search: "AutoDev Score" in README files |

### Soft Kill Criteria (Consider reducing investment)

| # | Criterion | Why It Matters |
|---|-----------|----------------|
| 5 | **AutoDev gets <5 returning users per week.** | One-time check = no retention = no business. |
| 6 | **No inbound questions or feature requests from real users in 60 days.** | Silence means nobody cares enough to engage. |
| 7 | **0-1 npm download increase over 4 weeks (stays at 609/week).** | Organic discovery is not happening. |

### The One Question That Decides Everything

> **"If AutoDev disappeared tomorrow, how many people would notice, and how many would care enough to ask for it back?"**

If the answer is fewer than 3 people (you + 2 users), it's not a business. It's a learning project.

---

## 5. Asset Reuse Plan (If Pivot)

If the 7-day experiment goes well and you decide to build the billing watchdog, here's what to keep and what to discard from AutoDev.

### Keep (Reusable Assets)

| Asset | How to Reuse | Effort |
|-------|-------------|--------|
| **Vercel hosting setup** | Same Vercel project, new domain/route. Current `vercel.json` works as-is. | 0 min |
| **Next.js project structure** | Reuse framework boilerplate, `_app.tsx`, `_document.tsx`, Tailwind config, postcss config, TypeScript config | 0 min |
| **Theme/styling system** | Same Tailwind theme, glassmorphism components, button styles, nav bar patterns. Dark theme works for both. | 0 min |
| **Rate limiting code** | `src/lib/rate-limit.ts` — exact same pattern for API endpoints | 0 min |
| **npm publish pipeline** | If the new product has any npm package, reuse agent's publish setup | 15 min |
| **Google Search Console** | Same account, add new domain. Already verified. | 5 min |
| **GitHub repo** | Keep same repo, restructure. Or create new repo in same org. If same repo: rename, archive old code in `archive/autodev/`. | 30 min |
| **Developer audience empathy** | Your understanding of what devs need, how they talk, where they hang out. This is the most valuable asset. | Intangible |

### Discard (Don't Reuse)

| Asset | Why Discard |
|-------|-------------|
| **AutoDev brand** | "AutoDev" means "automated development" — wrong positioning for billing protection. Start fresh brand. |
| **GitHub profile analysis code** | 100% of `analyze-profile.ts`, `calculateScore()`, badges, OG images. Domain-specific to GitHub profiles. |
| **README generator** | Feature-specific to AutoDev. No overlap with billing. |
| **Leaderboard** | "Top spenders" is the wrong gamification for money stress. Don't gamify financial pain. |
| **Tampermonkey userscript** | GitHub-specific client-side injection. No analog in billing. |
| **Chrome extension** | Same reason. If the billing watchdog has a browser extension, it would be entirely new code. |
| **npm package (autodev-agent)** | CLI auto-git agent has zero overlap with billing monitoring. |
| **Product Hunt listing** | Can't change existing listing to new product. New product needs new listing. |
| **STRATEGY.md, AUDIT.md, LAUNCH_KIT.md** | These documents are AutoDev-specific. Archive them. |

### Recommended Restructure

```
github.com/Shashwat1319/
├── autodev-agent/              ← Archived (keep live, no new investment)
│   ├── README.md               ← Update: "This project is no longer actively developed."
│   └── ...existing code...
│
├── spendguard/                 ← New project
│   ├── platform/               ← Same Next.js structure as autodev
│   ├── README.md
│   └── package.json
```

Or, if you prefer a monorepo:

```
github.com/Shashwat1319/
├── autodev-agent/              ← Same repo, restructure
│   ├── archive/autodev/        ← Move all AutoDev-specific code here
│   ├── platform/               ← New billing watchdog code
│   └── README.md
```

**My recommendation:** New repo. Clean break. AutoDev keeps living as a side project, you can refer to it, and the new product starts with a clean namespace and no technical debt.

---

## Final Recommendation

**Build the landing page and blog post on Day 1. Deploy in 4 hours. Start driving traffic on Day 2.**

Do not touch AutoDev code during this 7 days. The point is to measure whether a NEW idea gets more traction than the EXISTING product without any additional investment.

If the experiment succeeds (4/6 signals green), build the billing watchdog MVP in 2-4 weeks. The core functionality — monitor spend, alert at thresholds, auto-throttle — is well-scoped and solo-founder-feasible.

If the experiment fails (3/6 or fewer green), you have two paths:
- **Pivot again** — pick the next-highest-scored problem from the Top 50 ranking (code review bottleneck, environment provisioning) and design a new validation experiment
- **Accept AutoDev as a side project** — ship the Strategy 1 positioning improvements (change hero headline, improve SEO pages), optimize the badge loop, and see if organic growth happens. Target: 200 visitors in 4 weeks. If not, archive.

Either way, after 7 days you have data, not assumptions. That's the whole point of Stage 0.
