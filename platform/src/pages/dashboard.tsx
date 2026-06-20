import Head from 'next/head';
import { useState, useEffect } from 'react';

const langColors: Record<string, string> = {
  JavaScript: '#f7df1e', TypeScript: '#3178c6', Python: '#3572A5',
  HTML: '#e34c26', CSS: '#563d7c', Rust: '#dea584', Go: '#00ADD8',
  Java: '#b07219', C: '#555555', 'C++': '#f34b7d', 'C#': '#178600',
  Ruby: '#701516', PHP: '#4F5D95', Swift: '#F05138', Kotlin: '#A97BFF',
  Dart: '#00B4AB', Lua: '#000080', Scala: '#c22d40', Shell: '#89e051',
  Vue: '#4fc08d', Svelte: '#ff3e00', React: '#61dafb',
};

export default function Dashboard() {
  const [username, setUsername] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const user = params.get('user') || localStorage.getItem('autodev_username') || '';
    if (user) {
      setUsername(user);
      setInputValue(user);
      fetchProfile(user);
    }
  }, []);

  const fetchProfile = async (user?: string) => {
    const target = user || inputValue;
    if (!target.trim()) return;
    setLoading(true);
    setError('');
    setUsername(target);
    localStorage.setItem('autodev_username', target);
    try {
      const res = await fetch(`/api/analyze?username=${encodeURIComponent(target)}`);
      if (!res.ok) {
        const e = await res.json();
        throw new Error(e.error || 'Failed to analyze');
      }
      const data = await res.json();
      setProfile(data);
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  const bg = (lang: string) => langColors[lang] || '#666';

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white">
      <Head>
        <title>{profile ? `${profile.username} — AutoDev Dashboard` : 'Dashboard — AutoDev'}</title>
      </Head>

      {/* Nav */}
      <header className="glass border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-sm font-bold text-black group-hover:scale-105 transition">
              A
            </div>
            <span className="text-lg font-bold">
              <span className="text-cyan-400">{'{'}</span>AutoDev<span className="text-cyan-400">{'}'}</span>
            </span>
            <span className="text-xs text-gray-500 ml-2 hidden sm:inline">Dashboard</span>
          </a>
          <nav className="flex items-center gap-4">
            <a href="/" className="text-xs text-gray-400 hover:text-white transition">Home</a>
            <a href="/dashboard" className="text-xs text-cyan-400 font-medium">Dashboard</a>
          </nav>
        </div>
      </header>

      {/* Search Bar */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex gap-3 max-w-xl">
          <div className="flex-1 glass rounded-xl overflow-hidden flex">
            <input
              type="text"
              placeholder="Search any GitHub username..."
              className="bg-transparent px-5 py-3 text-white w-full outline-none text-sm"
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
        {error && <p className="text-red-400 text-sm mt-3 glass rounded-xl p-3 inline-block">{error}</p>}
      </div>

      {profile ? (
        <main className="max-w-7xl mx-auto px-6 pb-12 space-y-6 animate-fade-in">
          {/* Profile Header */}
          <div className="glass rounded-2xl p-8 glow">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <img src={profile.avatar} className="w-20 h-20 rounded-full ring-2 ring-cyan-400/50" />
              <div className="flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl font-bold">{profile.username}</h1>
                  <span className="px-3 py-0.5 rounded-full text-xs font-medium bg-cyan-500/10 text-cyan-300">
                    Score: {profile.overallScore}/100
                  </span>
                </div>
                <p className="text-gray-400 text-sm mt-0.5">{profile.bio}</p>
                {profile.location && <p className="text-xs text-gray-500 mt-1">📍 {profile.location}</p>}
              </div>
              <div className="flex gap-2">
                <a
                  href={`https://github.com/${profile.username}`}
                  target="_blank"
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
              ['Contributions', profile.totalContributions, '📈'],
            ].map(([label, value, icon]) => (
              <div key={label as string} className="glass rounded-xl p-5 text-center hover:border-cyan-400/20 transition">
                <div className="text-xl mb-1">{icon as string}</div>
                <div className="text-2xl font-bold text-white">{value}</div>
                <div className="text-[10px] text-gray-500 uppercase tracking-wider mt-0.5">{label as string}</div>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Languages */}
            <div className="glass rounded-2xl p-6">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Languages</h3>
              {profile.languages?.length > 0 && (
                <>
                  <div className="flex gap-0.5 h-2 mb-4 rounded-full overflow-hidden">
                    {profile.languages.slice(0, 8).map((l: any) => (
                      <div key={l.name} className="h-full rounded-full" style={{ width: `${l.percentage}%`, backgroundColor: bg(l.name) }} />
                    ))}
                  </div>
                  <div className="space-y-2">
                    {profile.languages.slice(0, 8).map((l: any) => (
                      <div key={l.name} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: bg(l.name) }} />
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
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Consistency</h3>
              <div className="text-center mb-6">
                <div className="text-5xl font-bold text-cyan-400">{profile.consistencyScore}%</div>
                <p className="text-xs text-gray-500 mt-1">Activity consistency score</p>
              </div>
              <div className="h-3 glass rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full transition-all duration-1000" style={{ width: `${profile.consistencyScore}%` }} />
              </div>
              <div className="mt-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Repos with README</span>
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
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Recommendations</h3>
              {profile.recommendations?.length > 0 ? (
                <ul className="space-y-3">
                  {profile.recommendations.map((r: string, i: number) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <span className="w-5 h-5 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span className="text-gray-300">{r}</span>
                    </li>
                  ))}
                </ul>
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
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Top Repositories</h3>
            <div className="space-y-3">
              {profile.topRepos?.map((repo: any) => (
                <div key={repo.name} className="glass rounded-xl p-4 hover:border-cyan-400/20 transition flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white font-medium truncate">{repo.name}</span>
                      {repo.language && (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] bg-white/5 text-gray-400">
                          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: bg(repo.language) }} />
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
        </main>
      ) : (
        <div className="max-w-7xl mx-auto px-6 pb-20 text-center">
          {loading ? (
            <div className="flex flex-col items-center gap-4 py-20">
              <svg className="animate-spin w-8 h-8 text-cyan-400" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
              <p className="text-gray-400 animate-pulse">Fetching GitHub data...</p>
            </div>
          ) : (
            <div className="py-20">
              <div className="w-16 h-16 rounded-2xl glass flex items-center justify-center text-3xl mx-auto mb-4">{'{ }'}</div>
              <h2 className="text-xl text-white font-semibold mb-2">Welcome to AutoDev Dashboard</h2>
              <p className="text-gray-400 text-sm">Search any GitHub username to see their analysis</p>
            </div>
          )}
        </div>
      )}

      <footer className="border-t border-white/5 py-8 text-center text-xs text-gray-600">
        AutoDev · npx autodev-agent · MIT
      </footer>
    </div>
  );
}
