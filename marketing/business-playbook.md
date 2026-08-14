# AutoDev Business Playbook — ₹100/day (₹3,000/month)

> Start: 14 Aug 2026. Product relaunch: free score (lead magnet) → ₹499 Profile Makeover (paid).
> Model proof: SlateGit sells $119-249 GitHub profile transformations. We sell at ₹499 for India.

## The Funnel

```
Free score check (dashboard/landing)
  → Score < 75 → Makeover CTA banner
  → Makeover section (₹499) → Razorpay/UPI
  → Unlock: fix plan + recruiter README + badge
  → Badge in README → viral loop (every visitor sees score)
```

## Math

- ₹100/day = ₹3,000/month = **6 makeovers/month @ ₹499** (or 2-3 @ ₹999 later)
- Conversion needed: 6 buyers per month ≈ 0.5-1% of ~600-1,200 real visitors
- Fiverr price anchor: ₹999-1,499 for the same service = ₹499 looks like a steal

## Week 1 — Distribution Blitz (today onward)

### Day 0 (14 Aug)
- [ ] Deploy makeover build (this commit)
- [ ] Buy `autodev.fyi` (₹475/yr, Porkbun) — optional, only if sharing URLs today
- [ ] Fiverr gig: "GitHub Profile Makeover — Recruiter-Ready README + Score Badge" ₹1,299, 2-day delivery
  - Title: "I will make your GitHub profile recruiter ready in 48 hours"
  - Tags: github, profile, resume, developer, portfolio
- [ ] r/developersIndia post: "I built a free GitHub profile scorer — your score out of 100. Mine was 53/100. Fixing it made me rethink how I code." (link dashboard)
- [ ] X post (torvalds angle, from content-pack.md): "Linus Torvalds' GitHub profile scores 95/100. Yours?" + link

### Day 1-3 — Outreach (10 msgs/day, LinkedIn + X DMs)
- Target: final-year CS students, job seekers, "Open to Work" devs
- Script: "Hi [name], I built a free tool that scores GitHub profiles out of 100 (recruiters check these!). Scored yours — it's [X]/100. Want the 5-minute fix list? No charge: [link]"
- Personal touch: actually check their score first (tool is free — 10 seconds)

### Day 4-7 — Follow-up + proof
- [ ] Reply to every comment on Reddit/X (engagement = reach)
- [ ] Collect 2-3 "before/after" makeover screenshots from buyers → testimonials
- [ ] Post makeover result thread: "From 53 → 82 in 2 weeks. Here's the exact plan" (uses our own roadmap!)

## Demand-Gap Loop (make the product indispensable)

1. **Score badge in README** = every visitor of that README sees the score → clicks → new check → repeat
2. **Userscript** = score visible on every GitHub profile → constant reminder
3. **Famous devs pages** (`/github-profile-score/torvalds` etc.) = SEO + shareable curiosity
4. **Recheck reminders** = returning users (retention already built)
5. **The standard claim**: "GitHub score matters to recruiters" — our content says it until it's believed

## Tracking (Vercel Analytics + Razorpay)

- Dashboard events: `makeover_cta_clicked`, `pro_cta_clicked`, `pro_unlocked`, `badge_copied`
- Razorpay dashboard = customer emails + payment links (leads stored even if unpaid)
- Weekly check: visitors / makeover CTA clicks / payment links / paid / badge copies

## Gates

- Week 8: 6+ paying clients → double down (₹999 package, B2B reports for recruiters)
- Week 8: 0-1 clients → pivot to pure freelancing, this product = portfolio proof
- Stop building features. Only fix breakage. Every hour = distribution.

## Golden Rules

- Never post the kappa URL in content; post the dashboard link (clean)
- Reply to everything — every comment is a lead
- 1,000 micro-conversions > 1 big feature
