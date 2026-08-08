import Head from 'next/head';
import { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { track } from '@vercel/analytics';
import { getLangColor, getScoreLabel } from '../lib/format';
import { BASE_URL } from '../lib/config';
import { isProUnlocked, unlockPro, PRO_PRICE_INR, PRO_PRICE_STRIKE_INR } from '../lib/pro';
import Layout from '../components/Layout';
import ShareModal from '../components/ShareModal';

const BADGE_STYLES = [
  { id: 'classic', label: 'Classic', pro: false },
  { id: 'gold', label: 'Gold', pro: true },
  { id: 'dark', label: 'Dark', pro: true },
];

export default function Dashboard() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [badgeCopied, setBadgeCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [ctaDismissed, setCtaDismissed] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [proUnlocked, setProUnlocked] = useState(false);
  const [badgeStyle, setBadgeStyle] = useState('classic');
  const [proEmail, setProEmail] = useState('');
  const abortRef = useRef<AbortController | null>(null);
  useEffect(() => {
    if (profile && !showShareModal) {
      const dismissed = localStorage.getItem('autodev_dismissed_share');
      if (!dismissed) {
        const timer = setTimeout(() => setShowShareModal(true), 600);
        return () => clearTimeout(timer);
      }
    }
  }, [profile]);
  useEffect(() => {
    const raw = router.query.user;
    const userParam = Array.isArray(raw) ? raw[0] : raw;
    const user = userParam || localStorage.getItem('autodev_username') || '';
    if (user && user !== username) {
      setUsername(user);
      setInputValue(user);
      fetchProfile(user);
    }
  }, [router.query.user]);

  const fetchProfile = async (user?: string) => {
    const target = user || inputValue;
    if (!target.trim()) return;
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setLoading(true);
    setError('');
    setUsername(target);
    setLoadingStep('Fetching profile...');
    try {
      localStorage.setItem('autodev_username', target);
      const res = await fetch(`/api/analyze?username=${encodeURIComponent(target)}`, { signal: controller.signal });
      setLoadingStep('Calculating score...');
      if (!res.ok) {
        let errorMsg = 'Failed to analyze';
        try { const e = await res.json(); errorMsg = e.error || errorMsg; } catch {}
        throw new Error(errorMsg);
      }
      const data = await res.json();
      setProfile(data);
      track('profile_analyzed', { username: target, score: data.overallScore ?? null });
    } catch (err: any) {
      if (err.name !== 'AbortError') setError(err.message);
    }
    setLoading(false);
    setLoadingStep('');
  };

  useEffect(() => {
    const q = router.query;
    if (q.pro_unlocked === '1') {
      unlockPro();
      setProUnlocked(true);
      const rest: Record<string, string> = {};
      for (const [k, v] of Object.entries(q)) if (k !== 'pro_unlocked') rest[k] = String(v);
      router.replace({ pathname: router.pathname, query: rest }, undefined, { shallow: true });
      track('pro_unlocked');
    } else if (isProUnlocked()) {
      setProUnlocked(true);
    }
  }, [router.query]);

  const openPro = async () => {
    track('pro_cta_clicked', { username: profile?.username });
    const btn = document.getElementById('pro-pay-btn') as HTMLButtonElement | null;
    if (btn) { btn.disabled = true; btn.textContent = 'Opening payment...'; }
    try {
      const res = await fetch('/api/pro/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: profile?.username, email: proEmail }),
      });
      const data = await res.json();
      if (data.url) { window.location.href = data.url; return; }
      if (data.demo && profile?.username) router.push(`/dashboard?user=${profile.username}&pro_unlocked=1`);
    } catch {}
    if (btn) { btn.disabled = false; btn.textContent = `Unlock Pro Insights — ${PRO_PRICE_INR}`; }
  };

  const improvementItems = useMemo(() => (profile?.recommendations || []).map((r: string) => {
    if (r.includes('bio')) return { rec: r, impact: 'high', gain: '+5-10 pts', effort: '5 min' };
    if (r.includes('website') || r.includes('blog')) return { rec: r, impact: 'medium', gain: '+3-5 pts', effort: '10 min' };
    if (r.includes('original')) return { rec: r, impact: 'high', gain: '+5-15 pts', effort: '1-2 hrs' };
    if (r.includes('description')) return { rec: r, impact: 'medium', gain: '+3-8 pts', effort: '20 min' };
    if (r.includes('stars')) return { rec: r, impact: 'high', gain: '+5-20 pts', effort: 'ongoing' };
    if (r.includes('active') || r.includes('commit')) return { rec: r, impact: 'high', gain: '+5-15 pts', effort: 'ongoing' };
    return { rec: r, impact: 'medium', gain: '+2-5 pts', effort: 'varies' };
  }), [profile?.recommendations]);

  return (
    <>
      <Head>
        <title>{profile ? `${profile.username} — GitHub Profile Score ${profile.overallScore}/100 | AutoDev` : 'GitHub Profile Analyzer — Free Score & Analysis | AutoDev'}</title>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="canonical" href={profile?.username ? `${BASE_URL}/dashboard?user=${profile.username}` : `${BASE_URL}/dashboard`} />
        <meta name="description" content={profile ? `${profile.username}'s free GitHub profile analysis: ${profile.totalRepos} repos, ${profile.totalStars} stars, score ${profile.overallScore}/100. Analyze any GitHub user.` : 'Free GitHub profile analyzer. Get your GitHub score, analyze repos, languages, and consistency. Search any public GitHub profile.'} />
        <meta property="og:title" content={profile ? `${profile.username}'s GitHub Score: ${profile.overallScore}/100 | AutoDev` : 'Free GitHub Profile Analyzer — AutoDev'} />
        <meta property="og:description" content={profile ? `Free analysis: ${profile.totalRepos} repos · ${profile.totalStars} stars · ${profile.totalForks} forks · Score ${profile.overallScore}/100` : 'Analyze any public GitHub profile for free. Get score, badges, and recruiter-ready README.'} />
        {profile?.username || username ? (
          <>
            <meta property="og:image" content={`${BASE_URL}/api/og?username=${profile?.username || username}`} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:url" content={`${BASE_URL}/dashboard?user=${profile?.username || username}`} />
            <meta name="twitter:image" content={`${BASE_URL}/api/og?username=${profile?.username || username}`} />
          </>
        ) : (
          <>
            <meta property="og:image" content={`${BASE_URL}/api/og`} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:url" content={`${BASE_URL}/dashboard`} />
            <meta name="twitter:image" content={`${BASE_URL}/api/og`} />
          </>
        )}
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={profile ? `${profile.username}'s GitHub Score: ${profile.overallScore}/100 | AutoDev` : 'Free GitHub Profile Analyzer — AutoDev'} />
        <meta name="twitter:description" content={profile ? `Free analysis: ${profile.totalRepos} repos · ${profile.totalStars} stars · ${profile.totalForks} forks` : 'Analyze any public GitHub profile for free. Get score, badges, and recruiter-ready README.'} />
        {profile && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Person",
                "name": profile.username,
                "url": `https://github.com/${profile.username}`,
                "image": profile.avatar,
                "description": `GitHub profile with AutoDev score ${profile.overallScore}/100. ${profile.totalRepos} repos, ${profile.totalStars} stars.`
              })
            }}
          />
        )}
      </Head>

      <Layout currentPage="/dashboard" subtitle="Dashboard">

      <main id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6">
      {/* Search Bar */}
      <div className="py-4 sm:py-6 pt-28 sm:pt-36">
        <div className="flex gap-2 sm:gap-3 max-w-xl">
          <div className="flex-1 glass rounded-xl overflow-hidden flex">
            <input
              type="text"
              placeholder="Enter GitHub username..."
              aria-label="GitHub username"
              className="bg-transparent px-3 sm:px-5 py-2.5 sm:py-3 text-white w-full outline-none text-sm"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && fetchProfile()}
            />
          </div>
          <button
            onClick={() => fetchProfile()}
            disabled={loading}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold px-6 py-3 rounded-xl transition disabled:opacity-50 text-sm"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                Loading
              </span>
            ) : 'Search'}
          </button>
        </div>
        {error && <p className="text-red-400 text-sm mt-3 glass rounded-xl p-3 inline-block" role="alert">{error}</p>}
      </div>

        {profile ? (
        <div className="pb-12 space-y-6 animate-fade-in">
          {/* CTA Banner */}
          {!ctaDismissed && (
          <div className="glass rounded-2xl p-5 border border-cyan-400/20 flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-lg font-bold text-black flex-shrink-0">!</div>
              <div>
                <p className="text-sm font-medium text-white">See YOUR AutoDev Score</p>
                <p className="text-xs text-gray-400">Type your GitHub username above and click Search</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const input = document.querySelector('input[type="text"]') as HTMLInputElement;
                  if (input) { input.focus(); input.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
                }}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold px-5 py-2.5 rounded-xl transition text-sm flex-shrink-0"
              >
                Search Your Profile
              </button>
              <button onClick={() => { setCtaDismissed(true); track('cta_dismissed'); }} aria-label="Dismiss" className="text-gray-500 hover:text-white transition p-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          </div>
          )}
          {/* Profile Header */}
          <div className="glass rounded-2xl p-8 glow">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <img src={profile.avatar} alt={`${profile.username}'s avatar`} className="w-20 h-20 rounded-full ring-2 ring-cyan-400/50" loading="lazy" />
              <div className="flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl font-bold">{profile.username}</h1>
                  <span className="px-3 py-0.5 rounded-full text-xs font-medium bg-cyan-500/10 text-cyan-300">
                    Score: {profile.overallScore}/100
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1.5">
                  {getScoreLabel(profile.overallScore)}
                  {profile.overallScore >= 70 ? ' — solid profile. Keep it up.' : profile.overallScore >= 40 ? ' — room to improve. The fixes below are your shortcut.' : ' — needs work. Start with the fixes below.'}
                </p>
                <p className="text-gray-400 text-sm mt-0.5">{profile.bio}</p>
                {profile.location && <p className="text-xs text-gray-500 mt-1">📍 {profile.location}</p>}
              </div>
              <div className="flex gap-2">
                <a
                  href={`https://github.com/${profile.username}`}
                  target="_blank" rel="noopener noreferrer"
                  className="glass rounded-xl px-4 py-2 text-xs text-gray-300 hover:bg-white/[0.08] transition inline-flex items-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                  GitHub Profile
                </a>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              ['Repositories', profile.totalRepos, '📦'],
              ['Stars', profile.totalStars, '⭐'],
              ['Forks', profile.totalForks, '🍴'],
              ['Code Volume', profile.totalContributions, '📈'],
            ].map(([label, value, icon]) => (
              <div key={label as string} className="glass rounded-xl p-5 text-center hover:border-cyan-400/20 transition">
                <div className="text-xl mb-1">{icon as string}</div>
                <div className="text-2xl font-bold text-white">{value}</div>
                <div className="text-[10px] text-gray-500 uppercase tracking-wider mt-0.5">{label as string}</div>
              </div>
            ))}
          </div>

          {/* Badge Embed */}
          <div className="glass rounded-2xl p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Badge</h2>
                <p className="text-xs text-gray-500">Show off your score — add this to your GitHub README</p>
              </div>
              <img
                src={`/api/badge?username=${profile.username}&style=${badgeStyle}`}
                alt={`AutoDev Score badge for ${profile.username}`}
                className="h-5 flex-shrink-0"
                loading="lazy"
              />
            </div>
            <div className="mt-4 flex gap-2">
              <div className="flex-1 glass rounded-lg px-4 py-2.5 text-xs text-gray-400 font-mono truncate select-all">
                {`[![AutoDev Score](${BASE_URL}/api/badge?username=${profile.username}&style=${badgeStyle})](${BASE_URL}/dashboard?user=${profile.username})`}
              </div>
              <button
                onClick={() => {
                  const text = `[![AutoDev Score](${BASE_URL}/api/badge?username=${profile.username}&style=${badgeStyle})](${BASE_URL}/dashboard?user=${profile.username})`;
                  navigator.clipboard.writeText(text).catch(() => {});
                  setBadgeCopied(true);
                  track('badge_copied', { username: profile.username, style: badgeStyle });
                  setTimeout(() => setBadgeCopied(false), 2000);
                }}
                className="glass rounded-lg px-4 py-2.5 text-xs text-cyan-400 hover:bg-white/[0.08] transition font-medium"
              >
                {badgeCopied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <div className="mt-3 flex gap-2">
              {BADGE_STYLES.map(s => (
                <button
                  key={s.id}
                  onClick={() => {
                    if (s.pro && !proUnlocked) { openPro(); return; }
                    setBadgeStyle(s.id);
                    track('badge_style_selected', { username: profile.username, style: s.id });
                  }}
                  className={`glass rounded-lg px-3 py-1.5 text-[10px] font-medium transition ${badgeStyle === s.id && (!s.pro || proUnlocked) ? 'text-cyan-400 ring-1 ring-cyan-400/30' : 'text-gray-400 hover:text-gray-200'}`}
                >
                  {s.label}{s.pro && !proUnlocked ? ' 🔒' : ''}
                </button>
              ))}
            </div>
          </div>

          {/* Share */}
          <div className="glass rounded-2xl p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Share</h2>
                <p className="text-xs text-gray-500">Let your network know your score</p>
              </div>
            </div>
            <div className="mt-4 flex flex-col sm:flex-row gap-3">
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`${BASE_URL}/dashboard?user=${profile.username}`)}`}
                target="_blank" rel="noopener noreferrer"
                className="flex-1 glass rounded-xl px-4 py-3 text-xs text-white hover:bg-white/[0.08] transition text-center font-medium min-w-[140px]"
                style={{ backgroundColor: '#0a66c2' }}
              >
                Share on LinkedIn
              </a>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`My AutoDev score is ${profile.overallScore}/100! Check yours →`)}&url=${encodeURIComponent(`${BASE_URL}/dashboard?user=${profile.username}`)}`}
                target="_blank" rel="noopener noreferrer"
                className="flex-1 glass rounded-xl px-4 py-3 text-xs text-white hover:bg-white/[0.08] transition text-center font-medium min-w-[140px]"
                style={{ backgroundColor: '#000' }}
              >
                Share on 𝕏
              </a>
              <button
                onClick={() => {
                  const msg = `My AutoDev score is ${profile.overallScore}/100! Check your GitHub profile here: ${BASE_URL}/dashboard?user=${profile.username}`;
                  navigator.clipboard.writeText(msg).catch(() => {});
                  setLinkCopied(true);
                  track('share_copied', { username: profile.username });
                  setTimeout(() => setLinkCopied(false), 3000);
                }}
                className="flex-1 glass rounded-xl px-4 py-3 text-xs text-gray-300 hover:bg-white/[0.08] transition text-center font-medium min-w-[140px]"
              >
                {linkCopied ? 'Copied!' : '📋 Copy Link'}
              </button>
            </div>
          </div>
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Languages */}
            <div className="glass rounded-2xl p-6">
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Languages</h2>
              {profile.languages?.length > 0 && (
                <>
                  <div className="flex gap-0.5 h-2 mb-4 rounded-full overflow-hidden">
                    {profile.languages.slice(0, 8).map((l: any) => (
                      <div key={l.name} className="h-full rounded-full" style={{ width: `${l.percentage}%`, backgroundColor: getLangColor(l.name) }} />
                    ))}
                  </div>
                  <div className="space-y-2">
                    {profile.languages.slice(0, 8).map((l: any) => (
                      <div key={l.name} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: getLangColor(l.name) }} />
                          <span className="text-gray-300">{l.name}</span>
                        </div>
                        <span className="text-gray-500">{l.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
              {(!profile.languages || profile.languages.length === 0) && (
                <p className="text-gray-500 text-sm">No language data available</p>
              )}
            </div>

            {/* Consistency */}
            <div className="glass rounded-2xl p-6">
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Consistency</h2>
              <div className="text-center mb-6">
                <div className="text-5xl font-bold text-cyan-400">{profile.consistencyScore}%</div>
                <p className="text-xs text-gray-500 mt-1">Activity consistency score</p>
              </div>
              <div className="h-3 glass rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full transition-all duration-1000" style={{ width: `${profile.consistencyScore}%` }} />
              </div>
              <div className="mt-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Repos with description</span>
                  <span className="text-white">{profile.topRepos?.filter((r: any) => r.strengths?.includes('Has description')).length || 0}/{profile.topRepos?.length || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Languages used</span>
                  <span className="text-white">{profile.languages?.length || 0}</span>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="glass rounded-2xl p-6">
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Recommendations</h2>
              {profile.recommendations?.length > 0 ? (
                <>
                  <ul className="space-y-3">
                    {profile.recommendations.slice(0, proUnlocked ? undefined : 3).map((r: string, i: number) => (
                      <li key={i} className="flex items-start gap-3 text-sm">
                        <span className="w-5 h-5 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <span className="text-gray-300">{r}</span>
                      </li>
                    ))}
                  </ul>
                  {!proUnlocked && profile.recommendations.length > 3 && (
                    <button
                      onClick={openPro}
                      className="mt-4 w-full glass rounded-xl px-4 py-3 text-xs text-amber-400 hover:bg-white/[0.08] transition font-medium"
                    >
                      🔒 +{profile.recommendations.length - 3} more recommendations with Pro
                    </button>
                  )}
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="text-3xl mb-2">🎉</div>
                  <p className="text-gray-400 text-sm">No improvements needed!</p>
                </div>
              )}
            </div>
          </div>

          {/* Top Repos */}
          <div className="glass rounded-2xl p-6">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Top Repositories</h2>
            <div className="space-y-3">
              {profile.topRepos?.map((repo: any) => (
                <div key={repo.name} className="glass rounded-xl p-4 hover:border-cyan-400/20 transition flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <a href={`https://github.com/${profile.username}/${repo.name}`} target="_blank" rel="noopener noreferrer" className="text-white font-medium truncate hover:text-cyan-400 transition">{repo.name}</a>
                      {repo.language && (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] bg-white/5 text-gray-400">
                          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: getLangColor(repo.language) }} />
                          {repo.language}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 truncate">{repo.description}</p>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500 flex-shrink-0">
                    <span>⭐ {repo.stars}</span>
                    <span>🍴 {repo.forks}</span>
                    <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 font-medium">{repo.score}</span>
                  </div>
                </div>
              ))}
              {(!profile.topRepos || profile.topRepos.length === 0) && (
                <p className="text-gray-500 text-sm text-center py-4">No repositories found</p>
              )}
            </div>
          </div>

          {/* Pro Insights */}
          <div className="glass rounded-2xl p-8 relative overflow-hidden">
            {!proUnlocked ? (
              <div className="relative">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center text-lg flex-shrink-0">🔒</div>
                  <div>
                    <h2 className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Pro Insights</h2>
                    <p className="text-xs text-gray-500">Level up your GitHub profile — right here</p>
                  </div>
                </div>
                <div className="grid md:grid-cols-3 gap-3 mb-6">
                  {[
                    ['🎯', 'Prioritized Roadmap', 'Every recommendation ranked by impact, estimated score gain, and effort'],
                    ['🧠', 'Repo Deep Dive', 'Strengths & weaknesses of each of your top repositories'],
                    ['📈', 'Score Breakdown', 'Consistency, volume, and language analysis in one view'],
                  ].map(([icon, title, desc]) => (
                    <div key={title} className="glass rounded-xl p-4">
                      <div className="text-lg mb-1.5">{icon}</div>
                      <div className="text-sm text-white font-medium mb-0.5">{title}</div>
                      <div className="text-[10px] text-gray-500">{desc}</div>
                    </div>
                  ))}
                </div>
                <div className="text-center max-w-sm mx-auto">
                  <input
                    type="email"
                    placeholder="Email for receipt (optional)"
                    aria-label="Email for receipt"
                    value={proEmail}
                    onChange={e => setProEmail(e.target.value)}
                    className="w-full glass rounded-xl px-4 py-3 text-sm text-white outline-none mb-3 placeholder:text-gray-500"
                  />
                  <button
                    id="pro-pay-btn"
                    onClick={openPro}
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-bold px-8 py-3.5 rounded-xl transition text-sm"
                  >
                    Unlock Pro Insights — {PRO_PRICE_INR} <span className="line-through opacity-60 font-medium">{PRO_PRICE_STRIKE_INR}</span>
                  </button>
                  <p className="text-[10px] text-gray-500 mt-3">Launch offer · Pay once · Lifetime access · No subscription · Razorpay</p>
                </div>
              </div>
            ) : (
              <div className="relative space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center text-lg flex-shrink-0">★</div>
                  <div>
                    <h2 className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Pro Insights</h2>
                    <p className="text-xs text-gray-500">Your improvement roadmap + repository deep dive</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Improvement Roadmap</h3>
                  <div className="space-y-3">
                    {improvementItems.map((item: any, i: number) => (
                      <div key={i} className="flex items-start gap-4 glass rounded-xl p-4">
                        <div className="w-7 h-7 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {i + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-200">{item.rec}</p>
                          <div className="flex gap-3 mt-1.5">
                            <span className={`text-[10px] font-medium uppercase ${item.impact === 'high' ? 'text-red-400' : item.impact === 'medium' ? 'text-amber-400' : 'text-green-400'}`}>Impact: {item.impact}</span>
                            <span className="text-[10px] text-gray-500">Est. gain: {item.gain}</span>
                            <span className="text-[10px] text-gray-500">Effort: {item.effort}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Repository Deep Dive</h3>
                  <div className="space-y-3">
                    {profile.topRepos?.map((repo: any) => (
                      <div key={repo.name} className="glass rounded-xl p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <a href={`https://github.com/${profile.username}/${repo.name}`} target="_blank" rel="noopener noreferrer" className="text-white font-medium truncate hover:text-cyan-400 transition">{repo.name}</a>
                              {repo.language && (
                                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] bg-white/5 text-gray-400">
                                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: getLangColor(repo.language) }} />
                                  {repo.language}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 truncate">{repo.description}</p>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-gray-500 flex-shrink-0">
                            <span>⭐ {repo.stars}</span>
                            <span>🍴 {repo.forks}</span>
                            <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 font-medium">{repo.score}</span>
                          </div>
                        </div>
                        {repo.weaknesses?.length > 0 && (
                          <div className="mt-2 pt-2 border-t border-white/5">
                            {repo.weaknesses.map((w: string) => (
                              <p key={w} className="text-[10px] text-red-400">⚠ {w}</p>
                            ))}
                          </div>
                        )}
                        {repo.strengths?.length > 0 && (
                          <div className="mt-1">
                            {repo.strengths.map((s: string) => (
                              <p key={s} className="text-[10px] text-green-400">✓ {s}</p>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="pb-20 text-center">
          {loading ? (
            <div className="flex flex-col items-center gap-4 py-20" role="status" aria-live="polite">
              <svg className="animate-spin w-8 h-8 text-cyan-400" viewBox="0 0 24 24" aria-hidden="true"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
              <p className="text-gray-400 animate-pulse">{loadingStep || 'Fetching GitHub data...'}</p>
            </div>
          ) : (
            <div className="py-20 max-w-2xl mx-auto">
              <div className="w-16 h-16 rounded-2xl glass flex items-center justify-center text-3xl mx-auto mb-4">{'{ }'}</div>
              <h1 className="text-xl text-white font-semibold mb-2">Search any GitHub profile</h1>
              <p className="text-gray-400 text-sm mb-6">Instant score, language breakdown, top repos, and recommendations. No login.</p>
              <div className="space-y-3">
                <p className="text-xs text-gray-500 uppercase tracking-wider">Try one of these</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {['torvalds', 'gaearon', 'tj', 'sindresorhus', 'addyosmani', 'Shashwat1319'].map(u => (
                    <button
                      key={u}
                      onClick={() => { setInputValue(u); setUsername(u); fetchProfile(u); }}
                      className="glass rounded-lg px-4 py-2 text-xs text-gray-300 hover:bg-white/[0.08] hover:text-cyan-400 transition font-mono"
                    >
                      {u}
                    </button>
                  ))}
                </div>
                <div className="pt-4">
                  <Link
                    href="/leaderboard"
                    className="text-xs text-cyan-400 hover:text-cyan-300 transition"
                  >
                    Or browse the leaderboard →
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      </main>
      <footer className="border-t border-white/5 py-8 text-center text-xs text-gray-400">
        AutoDev · npx autodev-agent · MIT
        <br />
        <a href="https://buymeacoffee.com/shashwatsrivastava" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 mt-2 hover:text-amber-400 transition">
          ☕ Buy me a coffee
        </a>
      </footer>
      {showShareModal && <ShareModal profile={profile} onClose={() => { setShowShareModal(false); localStorage.setItem('autodev_dismissed_share', '1'); }} />}
      </Layout>
    </>
  );
}
