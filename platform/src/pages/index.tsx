import Head from 'next/head';
import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { track } from '@vercel/analytics';
import { getLangColor } from '../lib/format';
import Layout from '../components/Layout';

const ShareModal = dynamic(() => import('../components/ShareModal'), { ssr: false });

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

import { BASE_URL } from '../lib/config';

export default function Home() {
  const [username, setUsername] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [npxCopied, setNpxCopied] = useState(false);
  const [badgeCopied, setBadgeCopied] = useState(false);
  const [homeBadgeCopied, setHomeBadgeCopied] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const usernameRef = useRef(username);
  usernameRef.current = username;
  const prevResultRef = useRef<any>(null);
  const abortRef = useRef<AbortController | null>(null);
  useEffect(() => {
    if (result && result !== prevResultRef.current) {
      prevResultRef.current = result;
      const scrollTimer = setTimeout(() => {
        document.getElementById('home-result')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
      let shareTimer: ReturnType<typeof setTimeout> | undefined;
      if (!localStorage.getItem('autodev_share_autoopened')) {
        shareTimer = setTimeout(() => {
          localStorage.setItem('autodev_share_autoopened', '1');
          setShowShareModal(true);
        }, 900);
      }
      return () => { if (shareTimer) clearTimeout(shareTimer); clearTimeout(scrollTimer); };
    }
  }, [result]);

  const analyzeProfile = async () => {
    const u = usernameRef.current.trim();
    if (!u) { setError('Please enter a GitHub username'); return; }
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setAnalyzing(true);
    setError('');
    setResult(null);
    setLoadingStep('Fetching profile...');
    try {
      const res = await fetch(`/api/analyze?username=${encodeURIComponent(u)}`, { signal: controller.signal });
      setLoadingStep('Calculating score...');
      if (!res.ok) {
        let errorMsg = 'Failed to analyze';
        try { const e = await res.json(); errorMsg = e.error || errorMsg; } catch {}
        throw new Error(errorMsg);
      }
      const data = await res.json();
      setResult(data);
      track('profile_analyzed', { username: u, score: data.overallScore ?? null, source: 'home' });
    } catch (err: any) {
      if (err.name !== 'AbortError') setError(err.message);
    }
    setAnalyzing(false);
    setLoadingStep('');
  };

  return (
    <>
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
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
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
                url: 'https://github.com/Shashwat1319',
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'AutoDev',
              url: BASE_URL,
              logo: `${BASE_URL}/favicon.svg`,
              sameAs: ['https://github.com/Shashwat1319/autodev-agent'],
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'AutoDev',
              url: BASE_URL,
              potentialAction: {
                '@type': 'SearchAction',
                target: `${BASE_URL}/dashboard?user={search_term_string}`,
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
      </Head>

      <Layout currentPage="/" showHomeLinks>

      <main id="main-content">
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
            Your GitHub Profile<br />
            <span className="gradient-text">Has a Score.</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-3 sm:mb-4 animate-fade-in text-balance">
            Find yours in 10 seconds — no prompts, no chat with Claude. A free scored profile, badge, and recruiter-ready README.
          </p>
          <p className="text-xs sm:text-sm text-cyan-400/70 max-w-xl mx-auto mb-2 sm:mb-3 animate-fade-in">
            10 seconds vs. a 30-minute AI chat. Type a username → get your score → put it on your README.
          </p>
          <p className="text-xs sm:text-sm text-gray-500 max-w-xl mx-auto mb-8 sm:mb-10 animate-fade-in">
            See how the score works <Link href="/github-profile-score" className="text-cyan-400 hover:underline">here</Link> — what matters, what doesn&apos;t, and how to raise yours.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8 sm:mb-10 animate-fade-in">
            <div className="flex glass rounded-xl overflow-hidden glow w-full sm:w-auto mx-auto sm:mx-0 min-w-0">
              <input
                type="text"
                placeholder="Enter GitHub username to analyze..."
                aria-label="GitHub username"
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
                  <span className="inline-flex items-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                    <span>Analyzing</span>
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
          <section aria-label="Quick stats" className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto animate-fade-in">
            {stats.map(s => (
              <div key={s.label} className="glass rounded-xl p-3 sm:p-4 text-center">
                <div className="text-xs sm:text-sm font-semibold text-cyan-400 mb-0.5">{s.value}</div>
                <div className="text-[10px] sm:text-xs text-gray-500">{s.label}</div>
              </div>
            ))}
          </section>

          {/* Result */}
          {analyzing && (
            <div className="mt-8 max-w-xl mx-auto glass rounded-xl p-4 text-center" role="status" aria-live="polite">
              <p className="text-cyan-400 text-sm">{loadingStep}</p>
              <p className="text-[10px] text-gray-500 mt-1">Fetching from GitHub API</p>
            </div>
          )}
          {error && (
            <div className="mt-8 max-w-xl mx-auto glass rounded-xl p-4 border-red-500/20" role="alert">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}
          {result && (
            <div id="home-result" className="mt-8 glass rounded-2xl p-8 max-w-3xl mx-auto text-left animate-slide-up glow">
              <div className="flex items-center gap-5 mb-6">
                <img src={result.avatar} alt={`${result.username}'s avatar`} className="w-16 h-16 rounded-full ring-2 ring-cyan-400/50" />
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-bold text-white">{result.username}</h2>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-500/10 text-cyan-300">
                      Score: {result.overallScore}
                    </span>
                    <span className="text-[10px] text-gray-500">70+ Great · 40-69 Okay · &lt;40 Needs Work</span>
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
                  ['Code Volume', result.totalContributions],
                ].map(([label, value]) => (
                  <div key={label as string} className="bg-white/5 rounded-xl p-3 text-center">
                    <div className="text-lg font-bold text-white">{value}</div>
                    <div className="text-[10px] text-gray-500 uppercase tracking-wider">{label as string}</div>
                  </div>
                ))}
              </div>
              <div className="text-center mb-4">
                <a href="#how-it-works" className="text-[11px] text-gray-500 hover:text-cyan-400 transition">How is this calculated?</a>
              </div>
              {result.languages?.length > 0 && (
                <div className="mb-4">
                  <div className="flex gap-1 h-2 mb-3 rounded-full overflow-hidden">
                    {result.languages.slice(0, 6).map((l: any) => (
                      <div key={l.name} className="h-full rounded-full" style={{ width: `${l.percentage}%`, backgroundColor: getLangColor(l.name) }} />
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
                    {result.recommendations.map((r: string, i: number) => (
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
                      setHomeBadgeCopied(true);
                      track('badge_copied', { username: result.username, source: 'home-result' });
                      setTimeout(() => setHomeBadgeCopied(false), 2000);
                    }}
                    className="glass rounded-xl px-4 py-2.5 text-xs text-cyan-400 hover:bg-white/[0.08] transition text-center font-medium"
                  >
                    {homeBadgeCopied ? 'Copied!' : 'Copy Badge'}
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
      <section id="how-it-works" tabIndex={-1} className="section-padding border-t border-white/5">
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
                onClick={() => { navigator.clipboard.writeText('npx autodev-agent').catch(() => {}); setNpxCopied(true); track('npx_copied'); setTimeout(() => setNpxCopied(false), 2000); }}
                className="text-gray-500 hover:text-white transition text-xs min-w-[36px] text-left"
              >
                {npxCopied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Score Methodology */}
      <section id="score-methodology" className="section-padding border-t border-white/5">
        <div className="max-w-3xl mx-auto container-padding text-center">
          <span className="text-xs font-semibold text-cyan-400 uppercase tracking-[0.2em]">Methodology</span>
          <h2 className="text-2xl sm:text-3xl font-bold mt-3 mb-4">How Scores Are Calculated</h2>
          <div className="glass rounded-2xl p-6 sm:p-8 text-left">
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div className="bg-white/5 rounded-xl p-4">
                <div className="text-cyan-400 font-semibold mb-1">Profile Completion</div>
                <p className="text-gray-400 text-xs">Bio, location, company, and website presence</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4">
                <div className="text-cyan-400 font-semibold mb-1">Code Activity</div>
                <p className="text-gray-400 text-xs">Recent commits, events, and consistency over time</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4">
                <div className="text-cyan-400 font-semibold mb-1">Repository Quality</div>
                <p className="text-gray-400 text-xs">Original repos, descriptions, topics, and structure</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4">
                <div className="text-cyan-400 font-semibold mb-1">Community Impact</div>
                <p className="text-gray-400 text-xs">Stars, forks, and contributions to the ecosystem</p>
              </div>
            </div>
            <div className="mt-4 text-center">
              <div className="inline-flex items-center gap-3 text-xs text-gray-500">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> 70+ Great</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-500"></span> 40-69 Okay</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span> Below 40 Needs Work</span>
              </div>
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
                track('badge_copied', { source: 'home-hero' });
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
            <Link href="/dashboard" className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl transition glow-hover whitespace-nowrap">
              Open Dashboard
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
            </Link>
            <a href="https://github.com/Shashwat1319/autodev-agent" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 glass text-gray-300 px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl hover:bg-white/[0.08] transition whitespace-nowrap">
              View on GitHub
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
            </a>
          </div>
        </div>
      </section>

      </main>
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

      {showShareModal && result && <ShareModal profile={result} onClose={() => setShowShareModal(false)} />}

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
      </Layout>
    </>
  );
}
