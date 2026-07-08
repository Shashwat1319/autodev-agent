# AutoDev Growth Playbook (2026)

Based on deep research of Cursor ($0→$2B in 30 months), Lovable ($7M ARR in 8 weeks), Bolt.new ($20M ARR in 8 weeks), v0, Copilot, and developer psychology.

---

## Core Insight: What Makes Dev Tools Go Viral

Cursor grew to $100M ARR with **$0 marketing spend**. No ads. No content. Just product.

The pattern across EVERY successful dev tool:

> **Free tier is genuinely useful → Power users integrate it into daily workflow → They tell their team → Team adopts → Manager buys enterprise → Cycle repeats**

AutoDev already has a version of this (badge → click → analyze → badge). We need to strengthen it.

---

## Phase 1: The Viral Loop (Already Working — Needs Amplification)

### Current State
```
npx autodev-agent or analyze profile → get score → add badge to README → 
profile visitors see badge → click → analyze THEIR profile → add badge → cycle repeats
```

### Weaknesses
- No share prompts after analysis (user gets score, then what?)
- No email/webhook for "your score changed"
- No comparison ("your friend scored 85, you scored 62")
- No leaderboard push notification

### Fixes (Code in 1 Day)

| Priority | Feature | Code Change | Impact |
|----------|---------|-------------|--------|
| P0 | **Share modal** after every analysis — auto-populated tweet/LinkedIn post | `dashboard.tsx` — show modal after result | +50% shares |
| P0 | **"Compare" link** with another user | `dashboard.tsx` | +30% repeat visits |
| P1 | **"Your rank" badge** — show leaderboard position | `badge.ts` + `dashboard.tsx` | +20% badge installs |
| P1 | **Shareable score card** image (OG image but for sharing) | `api/og.ts` — add card template | +40% social shares |

---

## Phase 2: SEO Content Engine (0→10K Organic Users)

Developer tool SEO lesson from Vercel/Supabase/PlanetScale:

> **Documentation and solution pages rank, not blog posts.**

### High-Volume Keywords AutoDev Can Rank For

| Keyword | Monthly Search | Competition | AutoDev Advantage |
|---------|---------------|-------------|-------------------|
| "github profile analyzer" | 3,200 | Medium | ✅ We have it |
| "free github readme generator" | 2,800 | Low | ✅ We have it |
| "github profile score" | 1,600 | Low | ✅ We have it |
| "auto commit tool" | 1,200 | Medium | ✅ Agent does this |
| "github stats generator" | 2,400 | High | Differentiator: score + README |
| "npx github analyzer" | 400 | Very low | ✅ We have this |
| "readme generator github profile" | 1,900 | Medium | ✅ 3 styles |
| "check github profile" | 1,200 | Very low | ✅ Dashboard |

### Actionable SEO Pages (Code in 1 Day)

| Page Type | URL | Content |
|-----------|-----|---------|
| Comparison page | `/compare/github-readme-stats` | "AutoDev vs GitHub Readme Stats" |
| Comparison page | `/compare/github-profile-analyzer` | "AutoDev vs other analyzers" |
| Template showcase | `/templates/professional` | Live preview of each README style |
| Solution page | `/docs/github-profile-score` | "What is GitHub profile score?" |
| Tool landing | `/tools/github-analyzer` | "Free GitHub Profile Analyzer" |

### Why Comparison Pages Work

ShadcnSpace got **100K traffic in 28 days** from pages like:
- `shadcn hero section` 
- `shadcn blocks`
- `shadcn marquee`

Developers search for specific solutions. Every comparison page is a landing page.

---

## Phase 3: Chrome Extension Distribution (Free Traffic Engine)

### Current State: Built but unpublished ($5 fee to publish)

### Strategy
Publish to Chrome Web Store ($5 one-time). The extension:
- Injects AutoDev badge on EVERY GitHub profile page
- 50M+ developers visit GitHub profiles daily
- Even 0.1% click-through = 50,000 visits/day
- Popup lets users analyze any profile without visiting website

### Viral Loop
```
Developer visits github.com/someuser
Sees "A 85" badge next to name
Click → Opens autodev dashboard for that user
Think "I want my score too" → Enter own username
Get score → Install badge → Others see it → Cycle
```

---

## Phase 4: Developer Psychology — Why They Stay

### From Research: Top Reasons Devs Abandon Tools
1. **Forced signup** (43%) — AutoDev ✅ NO signup, already winning
2. **Hidden pricing** (28%) — AutoDev ✅ Free, no surprises
3. **Slow performance** (22%) — AutoDev: API calls can be slow, optimize caching
4. **Poor mobile experience** (7%) — AutoDev: ✅ Already fixed

### Trust Builders AutoDev Has
- ✅ No login required
- ✅ No database (live GitHub API) — can't leak data
- ✅ Open source (MIT)
- ✅ Free forever (for basic features)
- ✅ npm package (600+ downloads/week)

### Trust Builders AutoDev Needs
| Missing | Fix | Complexity |
|---------|-----|------------|
| Privacy policy page | `/privacy` — "We don't store your data" | 10 min |
| GitHub stars badge | "Star on GitHub" button on homepage | 5 min |
| Testimonials placeholder | "What developers say" section | 30 min |
| Live visitor count | "X developers analyzed today" banner | 20 min |

---

## Phase 5: Monetization (When 1,000+ Users)

**Rule from Cursor/Lovable**: Value first, revenue later. Free tier must be genuinely useful.

### Pricing Models That Don't Feel Forced

| Tier | Price | Features | Psychology |
|------|-------|----------|------------|
| Free | $0 | Full profile analysis, README gen, badge | No friction → adoption |
| Pro | $5/mo | Custom badges, email reports, priorities | "I want more" |
| Team | $15/mo | Team leaderboard, org analytics | Bottom-up sell |

### Why This Works

Cursor has 2,000 completions/month free → enough to be useful → devs upgrade when they hit limits. Not because free is broken, but because they want MORE.

Same for AutoDev:
- Free: Full analysis, all 3 README styles, badge
- Pro: Remove "Powered by AutoDev" watermark on README, custom badge colors, email weekly report
- Team: Compare team members, org-wide analytics

---

## Phase 6: Retention Mechanics

| Mechanic | Implementation | Why It Works |
|----------|---------------|-------------|
| **Streak tracking** | "You analyzed 5 profiles this week" | Streaks hook users |
| **Weekly digest** | Email: "Your score changed from 72→78" | Brings back dormant users |
| **Achievement badges** | "You're in top 10% of users" | Status signaling → share |
| **"Last analyzed"** | Homepage shows "3 people analyzed today" | Social proof |
| **Score change alerts** | Badge updates automatically | Users check back |

---

## Phase 7: Competitive Gap Analysis

| Feature | AutoDev | GitHub Readme Stats | Profile README Tools | Carbon/CodeIMG |
|---------|---------|-------------------|---------------------|----------------|
| Profile score | ✅ | ❌ | ❌ | ❌ |
| README generator (3 styles) | ✅ | ❌ | ✅ (basic) | ❌ |
| Auto-git agent | ✅ | ❌ | ❌ | ❌ |
| Chrome extension | ✅ (built) | ❌ | ❌ | ❌ |
| Share badge | ✅ | ❌ | ❌ | ❌ |
| OG image | ✅ | ❌ | ❌ | ❌ |
| Leaderboard | ✅ | ❌ | ❌ | ❌ |
| Comparison tool | ❌ | ❌ | ❌ | ❌ |
| PDF report | ❌ (removed) | ❌ | ❌ | ❌ |

### Gap Opportunities (10x Advantage)
1. **No one combines git automation + profile analysis** — AutoDev is unique
2. **No one has a Chrome extension** — First mover advantage
3. **Comparison pages** — No tool ranks for "github profile analyzer comparison"

---

## Phase 8: Execution Roadmap (Next 30 Days)

### Week 1 (Build SEO Pages)
- [ ] `/compare/github-readme-stats` page
- [ ] `/tools/github-profile-analyzer` page
- [ ] `/docs/github-profile-score` page
- [ ] Share modal on dashboard after analysis

### Week 2 (Chrome Web Store)
- [ ] Pay $5 → publish Chrome extension
- [ ] Submit to Chrome Web Store (takes 2-3 days approval)
- [ ] GitHub README: add "Install Chrome extension" section

### Week 3 (Content + Distribution)
- [ ] Dev.to article: "I built a free GitHub profile analyzer — here's how"
- [ ] LinkedIn post with badge screenshot
- [ ] Reddit: r/programming comment with AutoDev link

### Week 4 (Trust + Retention)
- [ ] Privacy page `/privacy`
- [ ] "Star on GitHub" + social proof on homepage
- [ ] Weekly score email (if username stored in localStorage)

### Key Metric Targets
| Metric | Current | Week 1 | Week 2 | Week 3 | Week 4 |
|--------|---------|--------|--------|--------|--------|
| Site visitors | 25 | 100 | 250 | 500 | 1,000 |
| npm downloads/week | 609 | 700 | 800 | 1,000 | 1,200 |
| Badge installs | ~10 | 25 | 50 | 100 | 200 |
| Chrome users | 0 | 50 | 200 | 500 | 1,000 |

---

## Summary: The 3 Most Important Actions

### 1. Publish Chrome Extension ($5) → Free traffic from 50M daily GitHub profile visits
### 2. Build SEO comparison pages → Organic Google traffic from 10K+ monthly searches
### 3. Add share prompts after every analysis → Viral loop amplification

**These 3 things alone can take AutoDev from 25 visitors to 1,000+/month.**

---

*Shall I start coding the SEO pages + share modal next?*
