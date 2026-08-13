import Head from 'next/head';
import { useState, useEffect, useRef } from 'react';
import { BASE_URL } from '../lib/config';
import { isValidUsernameFormat, USERNAME_FORMAT_ERROR } from '../lib/username';
import Layout from '../components/Layout';

const rankColors = ['#ffd700', '#c0c0c0', '#cd7f32'];

export default function Leaderboard() {
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [adding, setAdding] = useState(false);
  const [addedMsg, setAddedMsg] = useState('');
  const [highlightUser, setHighlightUser] = useState('');
  const fetchIdRef = useRef(0);

  const getStoredAdded = (): string[] => {
    try { return JSON.parse(localStorage.getItem('autodev_lb_added') || '[]'); } catch { return []; }
  };

  const fetchLeaderboard = async (extra?: string) => {
    const token = ++fetchIdRef.current;
    setLoading(true);
    setFetchError('');
    setAddedMsg('');
    try {
      const q = extra ? `?q=${encodeURIComponent(extra)}` : '';
      const res = await fetch(`/api/leaderboard${q}`);
      if (res.ok) {
        const data = await res.json();
        if (token === fetchIdRef.current) {
          setEntries(data.leaderboard || []);
        }
      } else {
        if (token === fetchIdRef.current) {
          setFetchError('Failed to load leaderboard. Please try again.');
        }
      }
    } catch (e) {
      console.error('Leaderboard fetch error:', e);
      if (token === fetchIdRef.current) {
        setFetchError('Network error. Check your connection and try again.');
      }
    }
    if (token === fetchIdRef.current) {
      setLoading(false);
    }
  };

  useEffect(() => {
    const stored = getStoredAdded();
    if (stored.length > 0) fetchLeaderboard(stored.join(','));
    else fetchLeaderboard();
  }, []);

  const addProfile = async () => {
    const u = inputValue.trim();
    if (!u) { setFetchError('Please enter a GitHub username'); return; }
    if (!isValidUsernameFormat(u)) { setFetchError(USERNAME_FORMAT_ERROR); return; }
    setAdding(true);
    const stored = getStoredAdded();
    if (!stored.includes(u)) {
      stored.push(u);
      try { localStorage.setItem('autodev_lb_added', JSON.stringify(stored.slice(-10))); } catch {}
    }
    const existing = await new Promise<boolean>(resolve => {
      fetch('/api/leaderboard?q=' + encodeURIComponent(u))
        .then(r => r.json())
        .then((d: any) => resolve((d.leaderboard || []).some((e: any) => e.username === u)))
        .catch(() => resolve(false));
    });
    if (!existing) {
      setFetchError('That username was not found on GitHub \u2014 double-check the spelling.');
    } else {
      setFetchError('');
      setHighlightUser(u);
      setAddedMsg('Added! Your profile is on the board below.');
    }
    await fetchLeaderboard(stored.join(','));
    setInputValue('');
    setAdding(false);
    if (existing) {
      setTimeout(() => {
        document.getElementById(`lb-${u}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 400);
    }
  };

  return (
    <>
      <Head>
        <title>GitHub Profile Leaderboard — Top Developers Ranked | AutoDev</title>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="canonical" href={`${BASE_URL}/leaderboard`} />
        <meta name="description" content="Top GitHub profiles ranked by AutoDev score. Find your rank, compare with other developers, and improve your GitHub presence for free." />
        <meta name="keywords" content="GitHub leaderboard, top GitHub developers, GitHub profile ranking, developer score, compare GitHub profiles" />
        <meta property="og:title" content="GitHub Profile Leaderboard — Top Developers Ranked | AutoDev" />
        <meta property="og:description" content="Top GitHub profiles ranked by AutoDev score. Find your rank and compare with other developers for free." />
        <meta property="og:image" content={`${BASE_URL}/api/og${entries.length > 0 ? `?username=${entries[0]?.username}` : ''}`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:url" content={`${BASE_URL}/leaderboard`} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="GitHub Profile Leaderboard — Top Developers Ranked | AutoDev" />
        <meta name="twitter:description" content="Top GitHub profiles ranked by AutoDev score. Find your rank for free." />
        <meta name="twitter:image" content={`${BASE_URL}/api/og${entries.length > 0 ? `?username=${entries[0]?.username}` : ''}`} />
        {entries.length > 0 && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'ItemList',
                name: 'Top GitHub Profiles',
                description: 'Top GitHub profiles ranked by AutoDev score',
                itemListElement: entries.slice(0, 10).map((e: any, i: number) => ({
                  '@type': 'ListItem',
                  position: i + 1,
                  item: {
                    '@type': 'Person',
                    name: e.username,
                    url: `https://github.com/${e.username}`,
                  },
                })),
              }),
            }}
          />
        )}
      </Head>

      <Layout currentPage="/leaderboard" subtitle="Leaderboard">

      <main id="main-content">
      {/* Hero */}
      <section className="pt-28 sm:pt-36 pb-16 text-center">
        <div className="max-w-3xl mx-auto px-6">
          <span className="text-xs font-semibold text-cyan-400 uppercase tracking-[0.2em]">Rankings</span>
          <h1 className="text-4xl font-bold mt-3 mb-4">Top GitHub Profiles</h1>
          <p className="text-gray-400 max-w-xl mx-auto">Ranked by AutoDev Score. Add your username to see where you stand — it stays on the board for your next visit.</p>

          <div className="flex gap-3 max-w-md mx-auto mt-8">
            <div className="flex-1 glass rounded-xl overflow-hidden flex">
              <input
                type="text"
                placeholder="Add your GitHub username..."
                aria-label="GitHub username to add to leaderboard"
                className="bg-transparent px-5 py-3 text-white w-full outline-none text-sm"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addProfile()}
              />
            </div>
            <button
              onClick={addProfile}
              disabled={adding}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold px-6 py-3 rounded-xl transition disabled:opacity-50 text-sm"
            >
              {adding ? 'Adding...' : 'Add'}
            </button>
          </div>
          {fetchError && <p className="text-red-400 text-sm mt-3 glass rounded-xl p-3 inline-block" role="alert">{fetchError}</p>}
          {addedMsg && <p className="text-green-400 text-sm mt-3 glass rounded-xl p-3 inline-block" role="status">{addedMsg}</p>}
        </div>
      </section>

      {/* Table */}
      <section className="pb-20">
        <div className="max-w-4xl mx-auto px-6">
          {loading ? (
            <div className="text-center py-16" role="status" aria-live="polite">
              <svg className="animate-spin w-8 h-8 text-cyan-400 mx-auto" viewBox="0 0 24 24" aria-hidden="true"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
              <p className="text-gray-400 mt-4 text-sm animate-pulse">Ranking profiles...</p>
            </div>
          ) : (
            <div className="space-y-2">
              <h2 className="sr-only">Leaderboard Rankings</h2>
              {entries.map((e, i) => (
                <div
                  key={e.username}
                  id={`lb-${e.username}`}
                  className={`glass rounded-xl p-4 flex items-center gap-4 transition hover:border-cyan-400/20 scroll-mt-32 ${i < 3 ? 'glow' : ''} ${highlightUser === e.username ? 'ring-1 ring-cyan-400/60' : ''}`}
                  style={i < 3 ? { borderColor: rankColors[i] + '33' } : {}}
                >
                  {/* Rank */}
                  <div className="w-8 text-center flex-shrink-0">
                    {i < 3 ? (
                      <span className="text-xl">{['🥇', '🥈', '🥉'][i]}</span>
                    ) : (
                      <span className="text-sm text-gray-500 font-mono">#{e.rank}</span>
                    )}
                  </div>

                  {/* Avatar */}
                  <img src={e.avatar} alt={`${e.username}'s avatar`} className="w-10 h-10 rounded-full ring-2 ring-white/10 flex-shrink-0" />

                  {/* Name */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <a href={`/dashboard?user=${e.username}`} className="text-white font-medium hover:text-cyan-400 transition truncate">
                        {e.username}
                      </a>
                      {i < 3 && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                          style={{ backgroundColor: rankColors[i] + '20', color: rankColors[i] }}
                        >
                          Top 3
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-gray-500 mt-0.5">
                      <span>{e.repos} repos</span>
                      <span>⭐ {e.stars}</span>
                      <span>🍴 {e.forks}</span>
                      {e.languages?.length > 0 && <span>{e.languages.join(' · ')}</span>}
                    </div>
                  </div>

                  {/* Score */}
                  <div className="text-right flex-shrink-0">
                    <div className={`text-lg font-bold ${e.score >= 70 ? 'text-green-400' : e.score >= 40 ? 'text-amber-400' : 'text-red-400'}`}>
                      {e.score}
                    </div>
                    <div className="text-[10px] text-gray-500">score</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && !fetchError && entries.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-400 text-sm">No profiles found. Try adding a username!</p>
            </div>
          )}
        </div>
      </section>

      </main>
      {/* Footer */}
      <footer className="border-t border-white/5 py-8 text-center text-xs text-gray-400">
        AutoDev · npx autodev-agent · MIT
        <br />
        <a href="https://buymeacoffee.com/shashwatsrivastava" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 mt-2 hover:text-amber-400 transition">☕ Buy me a coffee</a>
      </footer>
      </Layout>
    </>
  );
}
