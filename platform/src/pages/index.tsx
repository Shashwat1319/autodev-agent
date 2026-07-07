import Head from 'next/head';
import { useState, useEffect } from 'react';
import PHBanner from '../components/PHBanner';

const features = [
  { icon: '👁️', title: 'File Watcher', desc: 'Detects every change in real-time. No manual staging needed.' },
  { icon: '⚡', title: 'Auto Commit & Push', desc: 'Smart debouncing commits and pushes your code automatically.' },
  { icon: '📊', title: 'Profile Analyzer', desc: 'AI-powered scoring of repos, languages, and consistency.' },
  { icon: '📄', title: 'Portfolio Reports', desc: 'Shareable recruiter-ready profiles with detailed insights.' },
  { icon: '📱', title: 'Live Dashboard', desc: 'Real-time activity feed, stats, and contribution tracking.' },
  { icon: '🔌', title: 'One Command Setup', desc: 'Just run npx autodev-agent — no install needed.' },
];

const steps = [
  { num: '01', title: 'Run One Command', desc: 'npx autodev-agent in your terminal. Nothing to install.' },
  { num: '02', title: 'Code Normally', desc: 'Agent watches your files, auto-commits, and auto-pushes.' },
  { num: '03', title: 'Check Your Profile', desc: 'Visit the dashboard to see your scored GitHub analysis.' },
  { num: '04', title: 'Share & Impress', desc: 'Get a shareable link to your portfolio — ready for recruiters.' },
];

const stats = [
  { value: 'npx autodev-agent', label: 'Setup' },
  { value: '60s', label: 'Auto-commit delay' },
  { value: '100%', label: 'Hands-free git' },
  { value: 'Free', label: 'Open source' },
];

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://autodev-kappa.vercel.app';

const langColors: Record<string, string> = {
  JavaScript: '#f7df1e', TypeScript: '#3178c6', Python: '#3572A5',
  HTML: '#e34c26', CSS: '#563d7c', Rust: '#dea584', Go: '#00ADD8',
  Java: '#b07219', C: '#555555', 'C++': '#f34b7d', 'C#': '#178600',
  Ruby: '#701516', PHP: '#4F5D95', Swift: '#F05138', Kotlin: '#A97BFF',
  Dart: '#00B4AB', Lua: '#000080', Scala: '#c22d40', Shell: '#89e051',
  Vue: '#4fc08d', Svelte: '#ff3e00', React: '#61dafb',
};

export default function Home() {
  const [username, setUsername] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [mobileMenu, setMobileMenu] = useState(false);
  const [npxCopied, setNpxCopied] = useState(false);
  const [badgeCopied, setBadgeCopied] = useState(false);

  useEffect(() => {
    document.body.style.overflow = mobileMenu ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenu]);

  const analyzeProfile = async () => {
    const u = username.trim();
    if (!u) return;
    setAnalyzing(true);
    setError('');
    setResult(null);
    try {
      const res = await fetch(`/api/analyze?username=${encodeURIComponent(u)}`);
      if (!res.ok) {
        const e = await res.json();
        throw new Error(e.error || 'Failed to analyze');
      }
      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    }
    setAnalyzing(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white overflow-x-hidden">
      <Head>
        <title>AutoDev — Free GitHub Profile Analyzer & README Generator</title>
        <meta name="google-site-verification" content="z_Jfvg1FTwpf58LlPaqSpGyUj0Kurbzd1o2_HRdTxfA" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="canonical" href={BASE_URL} />
        <meta name="description" content="AutoDev is a free GitHub profile analyzer and README generator. Auto-commit, auto-push, and analyze your GitHub profile score. npx autodev-agent." />
        <meta name="keywords" content="GitHub profile analyzer, GitHub profile score, free README generator, auto commit, git automation, developer portfolio, GitHub stats" />
        <meta property="og:title" content="AutoDev — Free GitHub Profile Analyzer & README Generator" />
        <meta property="og:description" content="Auto-commit, auto-push, auto-analyze your GitHub profile for free. Get your GitHub score, badges, and recruiter-ready README." />
        <meta property="og:image" content={`${BASE_URL}/api/og`} />
        <meta property="og:url" content={BASE_URL} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AutoDev — Free GitHub Profile Analyzer & README Generator" />
        <meta name="twitter:description" content="Auto-commit, auto-push, auto-analyze your GitHub profile for free. Get your GitHub score, badges, and recruiter-ready README." />
        <meta name="twitter:image" content={`${BASE_URL}/api/og`} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: 'AutoDev',
              applicationCategory: 'DeveloperApplication',
              operatingSystem: 'Windows, macOS, Linux',
              description: 'Free GitHub profile analyzer and README generator. Auto-commits and auto-pushes code with real-time profile analysis.',
              url: BASE_URL,
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
              },
              author: {
                '@type': 'Person',
                name: 'Shashwat Srivastava',
              },
            }),
          }}
        />
      </Head>

      {/* Nav */}
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="glass border-b border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-sm font-bold text-black group-hover:scale-105 transition">
                A
              </div>
              <span className="text-lg font-bold">
                <span className="text-cyan-400">{'{'}</span>AutoDev<span className="text-cyan-400">{'}'}</span>
              </span>
            </a>
            <nav className="hidden md:flex items-center gap-6 sm:gap-8 text-sm">
              <a href="#features" className="text-gray-400 hover:text-white transition">Features</a>
              <a href="#how-it-works" className="text-gray-400 hover:text-white transition">How it Works</a>
              <a href="/dashboard" className="text-gray-400 hover:text-white transition">Dashboard</a>
              <a href="/leaderboard" className="text-gray-400 hover:text-white transition">Leaderboard</a>
              <a href="/readme-generator" className="text-gray-400 hover:text-white transition">README</a>
              <a
                href="https://github.com/Shashwat1319/autodev-agent"
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-gray-400 hover:text-white transition"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                GitHub
              </a>
            </nav>
            <div className="md:hidden flex items-center gap-2">
              <a href="https://github.com/Shashwat1319/autodev-agent" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
              </a>
              <button onClick={() => setMobileMenu(!mobileMenu)} className="text-gray-400 hover:text-white transition p-1">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenu ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} /></svg>
              </button>
            </div>
          </div>
        </div>
        <PHBanner />
      </header>

      {/* Mobile Menu */}
      {mobileMenu && (
        <div className="fixed inset-0 z-50 md:hidden" onClick={() => setMobileMenu(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative glass rounded-b-2xl p-6 pt-28" onClick={e => e.stopPropagation()}>
            <nav className="flex flex-col gap-4 text-center">
              <a href="#features" onClick={() => setMobileMenu(false)} className="text-gray-300 hover:text-white transition text-lg font-medium">Features</a>
              <a href="#how-it-works" onClick={() => setMobileMenu(false)} className="text-gray-300 hover:text-white transition text-lg font-medium">How it Works</a>
              <a href="/dashboard" onClick={() => setMobileMenu(false)} className="text-gray-300 hover:text-white transition text-lg font-medium">Dashboard</a>
              <a href="/leaderboard" onClick={() => setMobileMenu(false)} className="text-gray-300 hover:text-white transition text-lg font-medium">Leaderboard</a>
              <a href="/readme-generator" onClick={() => setMobileMenu(false)} className="text-gray-300 hover:text-white transition text-lg font-medium">README Generator</a>
            </nav>
          </div>
        </div>
      )}

      {/* Hero */}
      <section className="relative pt-28 sm:pt-36 pb-12 sm:pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-40" />
        <div className="absolute top-1/4 left-1/4 w-72 h-72 sm:w-96 sm:h-96 bg-cyan-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 sm:w-96 sm:h-96 bg-blue-500/10 rounded-full blur-[120px]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-sm text-cyan-300 mb-6 sm:mb-8 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse-slow" />
            v0.1.0 — npx autodev-agent
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 leading-tight animate-slide-up text-balance">
            Your Code.<br />
            <span className="gradient-text">Auto-Piloted.</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-8 sm:mb-10 animate-fade-in text-balance">
            AutoDev watches your files, auto-commits and pushes to GitHub, 
            and builds a recruiter-ready portfolio — all without lifting a finger.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10 sm:mb-12 animate-fade-in">
            <div className="flex glass rounded-xl overflow-hidden glow w-full sm:w-auto mx-auto sm:mx-0">
              <input
                type="text"
                placeholder="Enter GitHub username to analyze..."
                className="bg-transparent px-4 sm:px-5 py-3 sm:py-3.5 text-white w-full sm:w-64 outline-none text-sm"
                value={username}
                onChange={e => setUsername(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && analyzeProfile()}
              />
              <button
                onClick={analyzeProfile}
                disabled={analyzing}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold px-4 sm:px-6 py-3 sm:py-3.5 transition disabled:opacity-50 text-sm whitespace-nowrap"
              >
                {analyzing ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                    Analyzing
                  </span>
                ) : 'Analyze'}
              </button>
            </div>
            <a href="#how-it-works" className="inline-flex items-center gap-2 glass text-gray-300 px-4 sm:px-6 py-3 sm:py-3.5 rounded-xl hover:bg-white/[0.08] transition text-sm whitespace-nowrap">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              See How it Works
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto animate-fade-in">
            {stats.map(s => (
              <div key={s.label} className="glass rounded-xl p-3 sm:p-4 text-center">
                <div className="text-xs sm:text-sm font-semibold text-cyan-400 mb-0.5">{s.value}</div>
                <div className="text-[10px] sm:text-xs text-gray-500">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Result */}
          {error && (
            <div className="mt-8 max-w-xl mx-auto glass rounded-xl p-4 border-red-500/20">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}
          {result && (
            <div className="mt-8 glass rounded-2xl p-8 max-w-3xl mx-auto text-left animate-slide-up glow">
              <div className="flex items-center gap-5 mb-6">
                <img src={result.avatar} alt={`${result.username}'s avatar`} className="w-16 h-16 rounded-full ring-2 ring-cyan-400/50" />
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-bold text-white">{result.username}</h2>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-500/10 text-cyan-300">
                      Score: {result.overallScore}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm">{result.bio}</p>
                </div>
                <a href={`/dashboard?user=${result.username}`} className="text-cyan-400 hover:text-cyan-300 text-sm font-medium transition">
                  Full Report →
                </a>
              </div>
              <div className="grid grid-cols-4 gap-3 mb-6">
                {[
                  ['Repositories', result.totalRepos],
                  ['Stars', result.totalStars],
                  ['Forks', result.totalForks],
                  ['Repo Volume', result.totalContributions],
                ].map(([label, value]) => (
                  <div key={label as string} className="bg-white/5 rounded-xl p-3 text-center">
                    <div className="text-lg font-bold text-white">{value}</div>
                    <div className="text-[10px] text-gray-500 uppercase tracking-wider">{label as string}</div>
                  </div>
                ))}
              </div>
              {result.languages?.length > 0 && (
                <div className="mb-4">
                  <div className="flex gap-1 h-2 mb-3 rounded-full overflow-hidden">
                    {result.languages.slice(0, 6).map((l: any) => (
                      <div key={l.name} className="h-full rounded-full" style={{ width: `${l.percentage}%`, backgroundColor: langColors[l.name] || '#666' }} />
                    ))}
                  </div>
                  <div className="flex gap-3 flex-wrap">
                    {result.languages.slice(0, 6).map((l: any) => (
                      <span key={l.name} className="text-xs text-gray-400">{l.name} <span className="text-cyan-400">{l.percentage}%</span></span>
                    ))}
                  </div>
                </div>
              )}
              {result.recommendations?.length > 0 && (
                <div className="bg-amber-500/5 border border-amber-500/10 rounded-xl p-4">
                  <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">Suggestions</p>
                  <ul className="space-y-1">
                    {result.recommendations.slice(0, 3).map((r: string, i: number) => (
                      <li key={i} className="text-sm text-gray-400 flex items-start gap-2">
                        <span className="text-amber-400 mt-0.5">→</span>{r}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="mt-5 pt-4 border-t border-white/5">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 text-center">Share Your Score</p>
                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`${BASE_URL}/dashboard?user=${result.username}`)}`}
                    target="_blank" rel="noopener noreferrer"
                    className="glass rounded-xl px-4 py-2.5 text-xs text-white hover:bg-white/[0.08] transition text-center font-medium"
                    style={{ backgroundColor: '#0a66c2' }}
                  >
                    Share on LinkedIn
                  </a>
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`My AutoDev score is ${result.overallScore}/100! Check yours →`)}&url=${encodeURIComponent(`${BASE_URL}/dashboard?user=${result.username}`)}`}
                    target="_blank" rel="noopener noreferrer"
                    className="glass rounded-xl px-4 py-2.5 text-xs text-white hover:bg-white/[0.08] transition text-center font-medium"
                    style={{ backgroundColor: '#000' }}
                  >
                    Share on 𝕏
                  </a>
                  <button
                    onClick={() => {
                      const text = `[![AutoDev Score](${BASE_URL}/api/badge?username=${result.username})](${BASE_URL}/dashboard?user=${result.username})`;
                      navigator.clipboard.writeText(text).catch(() => {});
                      const btn = document.getElementById('home-copy-badge');
                      if (btn) { btn.textContent = 'Copied!'; setTimeout(() => { btn.textContent = 'Copy Badge'; }, 2000); }
                    }}
                    id="home-copy-badge"
                    className="glass rounded-xl px-4 py-2.5 text-xs text-cyan-400 hover:bg-white/[0.08] transition text-center font-medium"
                  >
                    Copy Badge
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

{/* Features */}
      <section id="features" className="section-padding relative">
        <div className="absolute inset-0 bg-gradient-radial opacity-50" />
        <div className="relative max-w-7xl mx-auto container-padding">
          <div className="text-center mb-10 sm:mb-16">
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-[0.2em]">Features</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mt-3 mb-4">Everything You Need</h2>
            <p className="text-gray-400 max-w-xl mx-auto">From auto-git to profile analysis — one platform handles it all.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {features.map(f => (
              <div key={f.title} className="glass rounded-xl p-4 sm:p-6 glass-hover">
                <div className="text-xl sm:text-2xl mb-3">{f.icon}</div>
                <h3 className="text-white font-semibold mb-1.5">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="section-padding border-t border-white/5">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center mb-10 sm:mb-16">
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-[0.2em]">How It Works</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mt-3 mb-4">Start in Seconds</h2>
            <p className="text-gray-400 max-w-xl mx-auto">Four simple steps from zero to auto-piloted.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {steps.map(s => (
              <div key={s.num} className="glass rounded-xl p-4 sm:p-6 text-center group hover:border-cyan-400/30 transition">
                <div className="text-3xl sm:text-4xl font-bold text-cyan-400/30 group-hover:text-cyan-400 transition mb-3">{s.num}</div>
                <h3 className="text-white font-semibold mb-1.5">{s.title}</h3>
                <p className="text-gray-400 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 sm:mt-8 text-center">
            <div className="inline-flex items-center gap-2 glass rounded-xl px-4 sm:px-6 py-3">
              <code className="text-cyan-400 text-sm font-mono">$ npx autodev-agent</code>
              <button
                onClick={() => { navigator.clipboard.writeText('npx autodev-agent').catch(() => {}); setNpxCopied(true); setTimeout(() => setNpxCopied(false), 2000); }}
                className="text-gray-500 hover:text-white transition text-xs min-w-[36px] text-left"
              >
                {npxCopied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Badge */}
      <section className="section-padding border-t border-white/5">
        <div className="max-w-3xl mx-auto container-padding text-center">
          <span className="text-xs font-semibold text-cyan-400 uppercase tracking-[0.2em]">Viral</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mt-3 mb-4">Show Off Your Score</h2>
          <p className="text-gray-400 mb-6 sm:mb-8 max-w-xl mx-auto">
            Add a badge to your GitHub README — every visitor sees your AutoDev score and clicks through to your full profile.
          </p>
          <div className="glass rounded-2xl p-6 sm:p-8 max-w-lg mx-auto">
            <img
              src="/api/badge?username=Shashwat1319"
              alt="AutoDev Score Badge"
              className="h-5 mx-auto mb-6"
            />
            <div className="glass rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-[10px] sm:text-xs text-gray-400 font-mono mb-4 break-all select-all overflow-x-auto">
              {`[![AutoDev Score](${BASE_URL}/api/badge?username=YOUR_USERNAME)](${BASE_URL}/dashboard?user=YOUR_USERNAME)`}
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(`[![AutoDev Score](${BASE_URL}/api/badge?username=YOUR_USERNAME)](${BASE_URL}/dashboard?user=YOUR_USERNAME)`).catch(() => {});
                setBadgeCopied(true);
                setTimeout(() => setBadgeCopied(false), 2000);
              }}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold px-4 sm:px-6 py-2 sm:py-3 rounded-xl transition text-sm"
            >
              {badgeCopied ? 'Copied!' : 'Copy Badge Code'}
            </button>
          </div>
        </div>
      </section>

      {/* Userscript */}
      <section className="section-padding border-t border-white/5">
        <div className="max-w-3xl mx-auto container-padding text-center">
          <span className="text-xs font-semibold text-cyan-400 uppercase tracking-[0.2em]">Free Extension</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mt-3 mb-4">See Scores on GitHub Profiles</h2>
          <p className="text-gray-400 mb-6 sm:mb-8 max-w-xl mx-auto">
            Install the free userscript (no Chrome Web Store needed). Visit any GitHub profile — AutoDev score appears automatically.
          </p>
          <div className="glass rounded-2xl p-6 sm:p-8 max-w-lg mx-auto">
            <div className="flex items-center gap-3 justify-center mb-4">
              <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-lg font-bold text-black">A</span>
              <span className="text-sm text-gray-300">AutoDev Score Userscript</span>
            </div>
            <p className="text-xs text-gray-500 mb-4">
              1. Install <a href="https://www.tampermonkey.net" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">Tampermonkey</a> extension (free)<br />
              2. <a href="https://raw.githubusercontent.com/Shashwat1319/autodev-agent/main/autodev-github-score.user.js" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">Click here</a> to install script<br />
              3. Visit any GitHub profile → score appears
            </p>
            <a
              href="https://raw.githubusercontent.com/Shashwat1319/autodev-agent/main/autodev-github-score.user.js"
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold px-6 py-3 rounded-xl transition text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
              Install Userscript
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding border-t border-white/5 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/5 to-transparent" />
        <div className="relative max-w-3xl mx-auto container-padding text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">Ready to Auto-Pilot Your Git?</h2>
          <p className="text-gray-400 mb-6 sm:mb-8">Stop typing git commands. Start building.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/dashboard" className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl transition glow-hover whitespace-nowrap">
              Open Dashboard
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
            </a>
            <a href="https://github.com/Shashwat1319/autodev-agent" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 glass text-gray-300 px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl hover:bg-white/[0.08] transition whitespace-nowrap">
              View on GitHub
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
            </a>
          </div>
        </div>
      </section>

      {/* Support */}
      <section className="section-padding border-t border-white/5">
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-3">Support the project</p>
          <a href="https://buymeacoffee.com/shashwatsrivastava" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 glass rounded-xl px-4 sm:px-6 py-3 text-sm text-gray-300 hover:bg-white/[0.08] transition hover:border-amber-400/30 group">
            <span className="text-lg">☕</span>
            <span>Buy me a coffee</span>
            <span className="text-[10px] text-gray-500 group-hover:text-amber-400 transition hidden sm:inline">buymeacoffee.com/shashwatsrivastava</span>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 sm:py-10">
        <div className="max-w-7xl mx-auto container-padding flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-xs font-bold text-black">A</div>
            <span className="text-sm text-gray-500">AutoDev</span>
          </div>
          <div className="flex items-center gap-4 sm:gap-6 text-xs text-gray-500 flex-wrap justify-center">
            <span>MIT License</span>
            <span>·</span>
            <span>Built with ❤️</span>
            <span>·</span>
            <a href="https://github.com/Shashwat1319/autodev-agent" className="hover:text-cyan-400 transition">GitHub</a>
          </div>
          <div className="text-xs text-gray-600">npx autodev-agent</div>
        </div>
      </footer>
    </div>
  );
}
