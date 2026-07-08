# Reddit Posts (3 versions)

## r/sideproject
**Title:** Built a free GitHub profile README generator + auto-git agent (AutoDev)

**Body:**
Hey r/sideproject! I've been working on AutoDev for 2 weeks solo.

**The problem:** 
- Typing `git add . && git commit -m "wip" && git push` 50x/day
- Blank GitHub profile that recruiters skip
- No single tool for both automation AND portfolio

**The solution — AutoDev:**

🤖 **Local Agent** (`npx autodev-agent`)
- Terminal-based, watches your files
- Auto-commits with smart debouncing, auto-pushes
- Zero config, no install — just run `npx autodev-agent`

🌐 **Cloud Platform** (autodev-kappa.vercel.app)
- GitHub profile analyzer: score/100, languages, activity graph, streak stats
- **Free README Generator**: 3 styles (Professional/Minimal/Recruiter)
- Shareable badge + developer leaderboard
- 100% free, no login, no database (live GitHub API)

**Stack:** Next.js 14, Tailwind, Sharp (SVG→PNG OG images), Vercel free tier

No VC, no team, just code. 600+ npm downloads/week on the agent.

Try it: https://autodev-kappa.vercel.app/readme-generator

Would love feedback — what's broken, what's missing, what would you add?

---

## r/webdev
**Title:** Free tool: Generate GitHub profile README in 3 styles from your public data

**Body:**
Built a free README generator that takes your GitHub username and creates a beautiful profile README in seconds.

**3 styles:**
1. **Professional** — Full layout: stats bar, about, language badges, top repos, recent activity
2. **Minimal** — Just essentials: name, bio, stats, languages
3. **Recruiter** — Tables, pinned repo cards, comprehensive stats table

**Features:**
- Preview in browser → Copy or Download .md — both free
- No login, no signup, no signup, no data stored
- Fetches live from GitHub API
- Also shows profile score, activity graph, streak stats

Try it: https://autodev-kappa.vercel.app/readme-generator

Part of a larger platform (AutoDev) that also includes a local git automation agent (`npx autodev-agent`).

Feedback welcome!

---

## r/github
**Title:** GitHub Profile Analyzer — Score, languages, activity graph, streak, and free README generator

**Body:**
Enter any GitHub username → instant analysis:

- **Score/100** based on repos, stars, contributions, consistency
- **Language breakdown** with % bars
- **Activity graph** (heatmap, like GitHub's but for any user)
- **Contribution streak** stats
- **Top repositories** ranked by stars
- **Free README generator** — 3 styles (Professional/Minimal/Recruiter)
- **Shareable badge** for your profile

Free, no login: https://autodev-kappa.vercel.app/dashboard?user=USERNAME

README generator: https://autodev-kappa.vercel.app/readme-generator

Built with Next.js 14, Tailwind, Sharp, Vercel. Live GitHub API (rate limited).

Would love your thoughts!