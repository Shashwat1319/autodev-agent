# AutoDev Launch Kit (Archived — Launched July 5, 2026)
> Product Hunt: 8 upvotes, 6 comments, 25 site visitors
> npm: 609 downloads/week
> Status: Free tier, 0 revenue

**Product URL:** https://autodev-kappa.vercel.app

---

## 🎯 Tagline Options (pick one)

1. **Primary:** "Automate your git. Analyze your GitHub. Generate READMEs — all free."
2. **Short:** "Auto-git + GitHub profile analyzer + README generator. Free."
3. **Punchy:** "Your code. Auto-piloted. + Beautiful GitHub READMEs in seconds."

---

## 📸 Screenshots Needed (3-4)

| # | Description | Dimensions |
|---|---|---|
| 1 | **Dashboard** — Profile score, stats, languages, top repos | 2400×1600 |
| 2 | **README Generator** — 3 style selector + preview | 2400×1600 |
| 3 | **Leaderboard** — Ranked developers | 2400×1600 |
| 4 | **Badge + OG Image** — Shareable assets | 2400×1600 |

**How to capture:** Open each page in browser → DevTools device toolbar → 2400×1600 → Screenshot.

---

## 📝 Maker Comment (copy-paste ready)

```
Hey hunters! 👋

I'm Shashwat — solo dev from India. I built AutoDev because I was tired of:
1. Typing `git add . && git commit -m "..." && git push` 50 times a day
2. Having a blank GitHub profile that recruiters skip
3. No single tool that does both automation AND portfolio building

So I built AutoDev — two products in one platform:

🤖 **Local Agent** (`npx autodev-agent`)
- Runs in your terminal, watches files
- Auto-commits + auto-pushes with smart debouncing
- Zero config, no install needed

🌐 **Cloud Platform** (autodev-kappa.vercel.app)
- GitHub profile analyzer: score/100, languages, activity graph, streak stats
- Free README Generator: 3 styles (Professional/Minimal/Recruiter)
- Shareable badge + leaderboard
- 100% free, no login, no database (live GitHub API)

**Stack:** Next.js 14, Tailwind, Sharp (SVG→PNG OG images), Vercel free tier
**Agent:** 600+ npm downloads/week

No VC, no team, just code. Would love your feedback and upvotes! 🚀

Try it: https://autodev-kappa.vercel.app/readme-generator
```

---

## 🎨 Thumbnail Prompt (for 1270×760)

```
AutoDev product screenshot collage: left side shows terminal with "npx autodev-agent" running, right side shows GitHub profile dashboard with score 87/100, language bars, activity graph. Clean dark theme with cyan/blue accents. Text "AutoDev" top left, "Auto-git + Profile Analyzer + Free README Generator" bottom. Professional SaaS launch thumbnail style.
```

---

## 🚀 Launch Checklist

- [ ] Product Hunt account verified
- [ ] Screenshots uploaded (3-4)
- [ ] Tagline set
- [ ] Maker comment posted immediately after launch
- [ ] Thumbnail uploaded
- [ ] Topics: `developer-tools`, `github`, `productivity`, `open-source`
- [ ] Schedule for 12:01 AM PT (or launch manually at that time)
- [ ] Share in PH Discord #launch channel
- [ ] Reply to EVERY comment within 1 hour

---

## 📱 Hacker News "Show HN" Draft

**Title:** Show HN: AutoDev — Auto-git agent + Free GitHub Profile Analyzer & README Generator

**Body:**
```
I built AutoDev — a dual product:

1. **Local agent** (`npx autodev-agent`): Runs in your terminal, watches files, auto-commits and pushes with smart debouncing. Zero config, no install.

2. **Cloud platform** (autodev-kappa.vercel.app): Enter any GitHub username → get profile score/100, language breakdown, activity graph, streak stats, and generate a beautiful README in 3 styles (Professional/Minimal/Recruiter) — all free, no login.

The agent has 600+ npm downloads/week. The platform is on Vercel free tier, uses live GitHub API (no database), and includes rate limiting.

Built solo with Next.js 14, Tailwind, Sharp. Would love feedback!

Try the README generator: https://autodev-kappa.vercel.app/readme-generator
```

---

## 📱 Reddit Posts (3 versions)

### r/sideproject
**Title:** Built a free GitHub profile README generator + auto-git agent (AutoDev)
**Body:** Same as HN but shorter, more personal. Add: "Been working on this for 2 weeks solo. No VC, no team."

### r/webdev
**Title:** Free tool: Generate GitHub profile README in 3 styles from your public data
**Body:** Focus on README generator. Link directly to /readme-generator.

### r/github
**Title:** GitHub Profile Analyzer — Score, languages, activity graph, streak, and free README generator
**Body:** Focus on analysis features.

---

## 🐦 Twitter/X Thread (8 tweets)

**Tweet 1/8:**
```
I built AutoDev — a free tool that does 3 things:
1️⃣ Auto-commits & pushes your code (local agent)
2️⃣ Analyzes your GitHub profile (score/100, languages, activity)
3️⃣ Generates beautiful READMEs in 3 styles

All free. No login. No database. 🧵👇
#BuildInPublic #OpenSource #GitHub
```

**Tweet 2/8:**
```
The problem: I'd type `git add . && git commit -m "wip" && git push` 50x/day.
The solution: `npx autodev-agent` — watches files, auto-commits with smart debouncing, auto-pushes.
600+ downloads/week on npm.
```

**Tweet 3/8:**
```
The cloud side: Enter any GitHub username → instant profile analysis.
- Score out of 100
- Language breakdown with % bars
- Activity graph (heatmap)
- Contribution streak
- Top repos ranked
```

**Tweet 4/8:**
```
README Generator — 3 styles:
🎨 Professional: Full layout, stats, about, langs, top repos
📄 Minimal: Just essentials
💼 Recruiter: Tables, pinned cards, stats table

Preview → Copy → Download. All free.
```

**Tweet 5/8:**
```
Tech stack:
- Next.js 14 (App Router)
- Tailwind CSS + custom glassmorphism
- Sharp for SVG→PNG OG images
- Vercel free tier (auto-deploy from GitHub)
- Rate limiting (in-memory, no Redis)
```

**Tweet 6/8:**
```
No database — everything fetched live from GitHub API.
Unauthenticated: 60 req/hr. With GITHUB_TOKEN: 5000/hr.
Rate limited per IP on all endpoints.
```

**Tweet 7/8:**
```
Built solo in 2 weeks. No VC, no team.
If you're a dev, try it and tell me what's broken:
https://autodev-kappa.vercel.app/readme-generator

Agent: `npx autodev-agent`
```

**Tweet 8/8:**
```
If this helps you, a retweet would mean a lot! 🙏
Also open to feedback — what should I add next?
#BuildInPublic #IndieDev #GitHub #Productivity
```

---

## 📝 2nd Dev.to Article Draft

**Title:** "How I Built a GitHub Profile Analyzer + README Generator in 48 Hours (Solo, No VC)"

**Tags:** `github`, `webdev`, `showdev`, `productivity`, `nextjs`

**Cover Image:** Dashboard screenshot

**Content Structure:**
1. The problem (blank GitHub profiles, manual git)
2. The solution (AutoDev overview)
3. Architecture decisions (no DB, live API, Vercel free tier)
4. Challenges (rate limiting, OG images, loopback API calls)
5. What I'd do differently
6. Numbers so far (npm downloads, visitors)
7. What's next

---

## ⚡ Quick Actions for You Right Now

1. **Take 4 screenshots** (Dashboard, README Generator, Leaderboard, Badge)
2. **Create Product Hunt account** if not exists
3. **Schedule launch** for tomorrow 12:01 AM PT
4. **Post HN** after PH goes live
5. **Post Reddit** after PH
6. **Tweet thread** after PH
7. **Write 2nd Dev.to article** this week

---

**All drafts above are copy-paste ready.** Just fill in screenshots and launch.