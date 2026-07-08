# HN "Show HN" Draft
**Title:** Show HN: AutoDev — Auto-git agent + Free GitHub Profile Analyzer & README Generator

**Body:**
I built AutoDev — a dual product:

1. **Local agent** (`npx autodev-agent`): Runs in your terminal, watches files, auto-commits and pushes with smart debouncing. Zero config, no install needed.

2. **Cloud platform** (autodev-kappa.vercel.app): Enter any GitHub username → get profile score/100, language breakdown, activity graph, streak stats, and generate a beautiful README in 3 styles (Professional/Minimal/Recruiter) — all free, no login.

The agent has 600+ npm downloads/week. The platform is on Vercel free tier, uses live GitHub API (no database), and includes rate limiting.

Built solo with Next.js 14, Tailwind, Sharp. Would love feedback!

Try the README generator: https://autodev-kappa.vercel.app/readme-generator