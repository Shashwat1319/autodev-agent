import Head from 'next/head';
import { useState } from 'react';

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

export default function Home() {
  const [username, setUsername] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const analyzeProfile = async () => {
    const u = username.trim();
    if (!u) return;
    setAnalyzing(true);
    setError('');
    setResult(null);
    try {
      const res = await fetch(`/api/analyze?username=${u}`);
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
        <title>AutoDev — Your Code. Auto-Piloted.</title>
        <meta name="description" content="Auto-commit, auto-push, auto-analyze your GitHub profile" />
      </Head>

      {/* Nav */}
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-sm font-bold text-black group-hover:scale-105 transition">
              A
            </div>
            <span className="text-lg font-bold">
              <span className="text-cyan-400">{'{'}</span>AutoDev<span className="text-cyan-400">{'}'}</span>
            </span>
          </a>
          <nav className="hidden md:flex items-center gap-8 text-sm">
            <a href="#features" className="text-gray-400 hover:text-white transition">Features</a>
            <a href="#how-it-works" className="text-gray-400 hover:text-white transition">How it Works</a>
            <a href="/dashboard" className="text-gray-400 hover:text-white transition">Dashboard</a>
            <a
              href="https://github.com/Shashwat1319/autodev-agent"
              target="_blank"
              className="flex items-center gap-1.5 text-gray-400 hover:text-white transition"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
              GitHub
            </a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-40" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px]" />
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-sm text-cyan-300 mb-8 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse-slow" />
            v0.1.2 — npx autodev-agent
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight animate-slide-up">
            Your Code.<br />
            <span className="gradient-text">Auto-Piloted.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 animate-fade-in">
            AutoDev watches your files, auto-commits and pushes to GitHub, 
            and builds a recruiter-ready portfolio — all without lifting a finger.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fade-in">
            <div className="flex glass rounded-xl overflow-hidden glow mx-auto sm:mx-0">
              <input
                type="text"
                placeholder="Enter GitHub username..."
                className="bg-transparent px-5 py-3.5 text-white w-64 outline-none text-sm"
                value={username}
                onChange={e => setUsername(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && analyzeProfile()}
              />
              <button
                onClick={analyzeProfile}
                disabled={analyzing}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold px-6 py-3.5 transition disabled:opacity-50 text-sm"
              >
                {analyzing ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                    Analyzing
                  </span>
                ) : 'Analyze'}
              </button>
            </div>
            <a href="#how-it-works" className="inline-flex items-center gap-2 glass text-gray-300 px-6 py-3.5 rounded-xl hover:bg-white/[0.08] transition text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              See How it Works
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto animate-fade-in">
            {stats.map(s => (
              <div key={s.label} className="glass rounded-xl p-4 text-center">
                <div className="text-sm font-semibold text-cyan-400 mb-0.5">{s.value}</div>
                <div className="text-xs text-gray-500">{s.label}</div>
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
                <img src={result.avatar} className="w-16 h-16 rounded-full ring-2 ring-cyan-400/50" />
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
                  ['Contributions', result.totalContributions],
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
                      <div key={l.name} className="h-full rounded-full" style={{ width: `${l.percentage}%`, backgroundColor: ['#06b6d4','#3b82f6','#8b5cf6','#ec4899','#f59e0b','#10b981'][Math.floor(Math.random() * 6)] }} />
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
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-radial opacity-50" />
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-[0.2em]">Features</span>
            <h2 className="text-4xl font-bold mt-3 mb-4">Everything You Need</h2>
            <p className="text-gray-400 max-w-xl mx-auto">From auto-git to profile analysis — one platform handles it all.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map(f => (
              <div key={f.title} className="glass rounded-xl p-6 glass-hover">
                <div className="text-2xl mb-3">{f.icon}</div>
                <h3 className="text-white font-semibold mb-1.5">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-[0.2em]">How It Works</span>
            <h2 className="text-4xl font-bold mt-3 mb-4">Start in Seconds</h2>
            <p className="text-gray-400 max-w-xl mx-auto">Four simple steps from zero to auto-piloted.</p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {steps.map(s => (
              <div key={s.num} className="glass rounded-xl p-6 text-center group hover:border-cyan-400/30 transition">
                <div className="text-4xl font-bold text-cyan-400/30 group-hover:text-cyan-400 transition mb-3">{s.num}</div>
                <h3 className="text-white font-semibold mb-1.5">{s.title}</h3>
                <p className="text-gray-400 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 glass rounded-xl px-6 py-3">
              <code className="text-cyan-400 text-sm font-mono">$ npx autodev-agent</code>
              <button
                onClick={() => navigator.clipboard.writeText('npx autodev-agent')}
                className="text-gray-500 hover:text-white transition text-xs"
              >
                Copy
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 border-t border-white/5 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/5 to-transparent" />
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Auto-Pilot Your Git?</h2>
          <p className="text-gray-400 mb-8">Stop typing git commands. Start building.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/dashboard" className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold px-8 py-3.5 rounded-xl transition glow-hover">
              Open Dashboard
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
            </a>
            <a href="https://github.com/Shashwat1319/autodev-agent" target="_blank" className="inline-flex items-center gap-2 glass text-gray-300 px-8 py-3.5 rounded-xl hover:bg-white/[0.08] transition">
              View on GitHub
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-xs font-bold text-black">A</div>
            <span className="text-sm text-gray-500">AutoDev</span>
          </div>
          <div className="flex items-center gap-6 text-xs text-gray-500">
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
