import Head from 'next/head';
import { useState, useEffect } from 'react';

export default function Dashboard() {
  const [username, setUsername] = useState('');
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [agentConnected, setAgentConnected] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('autodev_username');
    if (stored) {
      setUsername(stored);
      fetchProfile(stored);
    }
  }, []);

  const fetchProfile = async (user?: string) => {
    const target = user || username;
    if (!target.trim()) return;
    setLoading(true);
    localStorage.setItem('autodev_username', target);
    try {
      const res = await fetch(`/api/analyze?username=${target}`);
      const data = await res.json();
      setProfile(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0f1e]">
      <Head>
        <title>Dashboard — AutoDev</title>
      </Head>

      <header className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="text-xl font-bold text-white">
            <span className="text-cyan-400">{'{'}</span>AutoDev<span className="text-cyan-400">{'}'}</span>
            <span className="text-sm text-gray-500 ml-3">Dashboard</span>
          </span>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${agentConnected ? 'bg-green-400' : 'bg-gray-600'}`} />
              <span className="text-sm text-gray-400">Agent {agentConnected ? 'Connected' : 'Offline'}</span>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="GitHub username"
                className="bg-white/5 border border-white/10 rounded px-3 py-1.5 text-sm text-white outline-none w-40"
                value={username}
                onChange={e => setUsername(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && fetchProfile()}
              />
              <button
                onClick={() => fetchProfile()}
                className="bg-cyan-500 hover:bg-cyan-400 text-black text-sm font-semibold px-4 rounded transition"
              >
                {loading ? '...' : 'Load'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {profile ? (
        <main className="max-w-6xl mx-auto px-6 py-8">
          <div className="grid grid-cols-12 gap-6">
            {/* Profile Card */}
            <div className="col-span-12 md:col-span-4 bg-white/5 border border-white/10 rounded-xl p-6">
              <div className="text-center mb-4">
                <img src={profile.avatar} className="w-20 h-20 rounded-full mx-auto border-2 border-cyan-400" />
                <h2 className="text-xl font-bold text-white mt-3">{profile.username}</h2>
                <p className="text-sm text-gray-400">{profile.bio}</p>
                <p className="text-xs text-gray-500 mt-1">{profile.location}</p>
              </div>
              <div className="text-center mb-4">
                <div className="text-5xl font-bold text-cyan-400">{profile.overallScore}</div>
                <div className="text-sm text-gray-500">Overall Score</div>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm text-gray-400 mb-1">
                    <span>Consistency</span>
                    <span>{profile.consistencyScore}%</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${profile.consistencyScore}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="col-span-12 md:col-span-8 space-y-6">
              <div className="grid grid-cols-4 gap-4">
                {[
                  ['Repos', profile.totalRepos],
                  ['Stars', profile.totalStars],
                  ['Forks', profile.totalForks],
                  ['Contribs', profile.totalContributions],
                ].map(([label, value]) => (
                  <div key={label as string} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-white">{value}</div>
                    <div className="text-xs text-gray-500">{label}</div>
                  </div>
                ))}
              </div>

              {/* Languages */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h3 className="text-sm font-semibold text-gray-400 mb-3">Languages</h3>
                <div className="flex gap-2 flex-wrap">
                  {profile.languages?.map((l: any) => (
                    <span key={l.name} className="px-3 py-1.5 bg-white/5 rounded-full text-sm text-gray-300 border border-white/5">
                      {l.name} <span className="text-cyan-400">{l.percentage}%</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Top Repos */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h3 className="text-sm font-semibold text-gray-400 mb-3">Top Repositories</h3>
                <div className="space-y-3">
                  {profile.topRepos?.map((repo: any) => (
                    <div key={repo.name} className="bg-white/5 rounded-lg p-4 flex items-center justify-between">
                      <div>
                        <div className="text-white font-medium">{repo.name}</div>
                        <div className="text-xs text-gray-500">{repo.description}</div>
                        <span className="text-xs text-cyan-400 mt-1 block">{repo.language}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-cyan-400">{repo.score}</div>
                        <div className="text-xs text-gray-500">Score</div>
                        <div className="text-xs text-gray-500">⭐ {repo.stars}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              {profile.recommendations?.length > 0 && (
                <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-6">
                  <h3 className="text-sm font-semibold text-amber-400 mb-3">Improvements</h3>
                  <ul className="space-y-2">
                    {profile.recommendations.map((r: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                        <span className="text-amber-400 mt-0.5">→</span>
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </main>
      ) : (
        <div className="max-w-6xl mx-auto px-6 py-20 text-center">
          {loading ? (
            <div className="text-gray-400 text-lg animate-pulse">Analyzing profile...</div>
          ) : (
            <div className="text-gray-500">
              <div className="text-6xl mb-4 text-cyan-400/30">{'{ }'}</div>
              <h2 className="text-xl text-white mb-2">Welcome to AutoDev Dashboard</h2>
              <p className="text-sm">Enter a GitHub username above to analyze their profile</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
