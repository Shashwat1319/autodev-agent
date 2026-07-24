import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getLangColor } from '../../lib/format';
import { BASE_URL } from '../../lib/config';
import Layout from '../../components/Layout';

export default function ProReport() {
  const router = useRouter();
  const { username } = router.query;
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!username || typeof username !== 'string') return;
    const abort = new AbortController();
    fetch(`/api/analyze?username=${encodeURIComponent(username)}`, { signal: abort.signal })
      .then(r => { if (!r.ok) throw new Error('Failed to load'); return r.json(); })
      .then(d => { setProfile(d); setLoading(false); })
      .catch(e => { if (e.name !== 'AbortError') { setError(e.message); setLoading(false); } });
    return () => abort.abort();
  }, [username]);

  const handlePrint = () => window.print();
  const bg = (lang: string) => getLangColor(lang);

  if (loading) return (
    <Layout currentPage="/dashboard" subtitle="Pro Report">
      <div className="flex items-center justify-center min-h-[60vh] pt-28">
        <div className="text-center">
          <svg className="animate-spin w-8 h-8 text-cyan-400 mx-auto mb-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
          <p className="text-gray-400">Generating your Pro Report...</p>
        </div>
      </div>
    </Layout>
  );

  if (error || !profile) return (
    <Layout currentPage="/dashboard" subtitle="Pro Report">
      <div className="flex items-center justify-center min-h-[60vh] pt-28">
        <div className="text-center glass rounded-2xl p-8 max-w-md">
          <div className="text-3xl mb-4">⚠️</div>
          <p className="text-red-400 text-sm mb-4">{error || 'Profile not found'}</p>
          <a href="/dashboard" className="text-cyan-400 hover:underline text-sm">Back to Dashboard</a>
        </div>
      </div>
    </Layout>
  );

  const improvementItems = profile.recommendations?.map((r: string) => {
    if (r.includes('bio')) return { rec: r, impact: 'high', gain: '+5-10 pts', effort: '5 min' };
    if (r.includes('website') || r.includes('blog')) return { rec: r, impact: 'medium', gain: '+3-5 pts', effort: '10 min' };
    if (r.includes('original')) return { rec: r, impact: 'high', gain: '+5-15 pts', effort: '1-2 hrs' };
    if (r.includes('description')) return { rec: r, impact: 'medium', gain: '+3-8 pts', effort: '20 min' };
    if (r.includes('stars')) return { rec: r, impact: 'high', gain: '+5-20 pts', effort: 'ongoing' };
    if (r.includes('active') || r.includes('commit')) return { rec: r, impact: 'high', gain: '+5-15 pts', effort: 'ongoing' };
    return { rec: r, impact: 'medium', gain: '+2-5 pts', effort: 'varies' };
  }) || [];

  const impactColor = (i: string) => i === 'high' ? 'text-red-400' : i === 'medium' ? 'text-amber-400' : 'text-green-400';

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <Layout currentPage="/dashboard" subtitle="Pro Report">
      <style>{`
        @media print { .no-print { display: none !important; } body { background: white !important; color: black !important; } }
      `}</style>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-28 sm:pt-36 pb-12">
        <div className="no-print flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold">Pro Report</h1>
          <button onClick={handlePrint} className="glass rounded-xl px-5 py-2.5 text-sm text-cyan-400 hover:bg-white/[0.08] transition font-medium">
            Print / Save PDF
          </button>
        </div>

        {/* Header */}
        <div className="glass rounded-2xl p-8 glow mb-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-semibold text-amber-400 uppercase tracking-wider bg-amber-500/10 px-2 py-0.5 rounded">Pro Report</span>
          </div>
          <div className="flex items-start gap-5 mt-3">
            <img src={profile.avatar} alt={profile.username} className="w-16 h-16 rounded-full ring-2 ring-cyan-400/50" />
            <div>
              <h2 className="text-2xl font-bold">{profile.username}</h2>
              <p className="text-gray-400 text-sm mt-0.5">{profile.bio}</p>
              {profile.location && <p className="text-xs text-gray-500 mt-1">{profile.location}</p>}
              <p className="text-xs text-gray-600 mt-1">Report generated: {dateStr}</p>
            </div>
            <div className="ml-auto text-right">
              <div className="text-5xl font-bold text-cyan-400">{profile.overallScore}<span className="text-lg text-gray-500">/100</span></div>
              <p className="text-xs text-gray-500">Overall Score</p>
            </div>
          </div>
        </div>

        {/* Score Breakdown */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="glass rounded-2xl p-6">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Score Breakdown</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-300">Consistency Score</span>
                  <span className="text-white font-semibold">{profile.consistencyScore}/100</span>
                </div>
                <div className="h-2 glass rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full" style={{ width: `${profile.consistencyScore}%` }} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2">
                {[
                  { label: 'Total Repos', value: profile.totalRepos },
                  { label: 'Total Stars', value: profile.totalStars },
                  { label: 'Total Forks', value: profile.totalForks },
                  { label: 'Languages', value: profile.languages?.length || 0 },
                ].map(s => (
                  <div key={s.label} className="bg-white/5 rounded-xl p-3 text-center">
                    <div className="text-lg font-bold text-white">{s.value}</div>
                    <div className="text-[10px] text-gray-500 uppercase tracking-wider">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="glass rounded-2xl p-6">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Language Distribution</h3>
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
          </div>
        </div>

        {/* Improvement Roadmap */}
        <div className="glass rounded-2xl p-6 mb-6">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Improvement Roadmap</h3>
          <p className="text-xs text-gray-500 mb-4">Prioritized actions to increase your score. Higher impact = bigger gain.</p>
          <div className="space-y-3">
            {improvementItems.map((item: any, i: number) => (
              <div key={i} className="flex items-start gap-4 glass rounded-xl p-4">
                <div className="w-7 h-7 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-200">{item.rec}</p>
                  <div className="flex gap-3 mt-1.5">
                    <span className={`text-[10px] font-medium uppercase ${impactColor(item.impact)}`}>Impact: {item.impact}</span>
                    <span className="text-[10px] text-gray-500">Est. gain: {item.gain}</span>
                    <span className="text-[10px] text-gray-500">Effort: {item.effort}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Repo Analysis */}
        <div className="glass rounded-2xl p-6 mb-6">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Repository Deep Dive</h3>
          <div className="space-y-3">
            {profile.topRepos?.map((repo: any) => (
              <div key={repo.name} className="glass rounded-xl p-4">
                <div className="flex items-start justify-between gap-4">
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

        {/* Stats Summary */}
        <div className="glass rounded-2xl p-6">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Summary</h3>
          <div className="grid sm:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-white">{profile.totalRepos}</div>
              <div className="text-[10px] text-gray-500 uppercase tracking-wider mt-0.5">Total Repositories</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{profile.totalStars}</div>
              <div className="text-[10px] text-gray-500 uppercase tracking-wider mt-0.5">Total Stars</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{profile.totalForks}</div>
              <div className="text-[10px] text-gray-500 uppercase tracking-wider mt-0.5">Total Forks</div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}