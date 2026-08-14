import Head from 'next/head';
import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../components/Layout';
import { BASE_URL } from '../lib/config';
import { HOMEPAGE_FAMOUS } from '../lib/top-dev-usernames';

const faqs = [
  {
    q: 'What is a GitHub profile score?',
    a: 'A GitHub profile score is a single number (out of 100) that measures how strong a GitHub profile looks: profile completeness, code activity, repository quality, documentation, and community impact. AutoDev calculates it automatically from public GitHub data in about 10 seconds.',
  },
  {
    q: 'Is the GitHub profile score free?',
    a: 'Yes. Enter any public GitHub username and you instantly get a free scored analysis: overall score, repositories, stars, forks, code volume, language breakdown, and improvement suggestions — no signup required.',
  },
  {
    q: 'How does AutoDev calculate the score?',
    a: 'The score combines profile completion (bio, location, website), code activity (recent commits and consistency), repository quality (original repos, descriptions, topics, structure), and community impact (stars, forks). Every factor is weighted and explained on the dashboard.',
  },
  {
    q: 'Can I put my score on my GitHub README?',
    a: 'Yes. AutoDev generates a badge you can paste into your README in one line of Markdown. Every visitor who sees your profile badge clicks through to your full scored profile.',
  },
  {
    q: 'How can I improve my GitHub score?',
    a: 'The free dashboard lists personalized suggestions in priority order. Pro Insights add a ranked improvement roadmap with estimated score gain and effort for each step, plus a per-repository deep dive.',
  },
];

export default function GithubScoreSEO() {
  const [u, setU] = useState('');
  const router = useRouter();
  const go = (e: React.FormEvent) => {
    e.preventDefault();
    const name = u.trim().replace(/^@/, '');
    if (name) router.push(`/dashboard?user=${encodeURIComponent(name)}`);
  };

  return (
    <>
      <Head>
        <title>GitHub Profile Score — Free Checker & Analyzer | AutoDev</title>
        <meta
          name="description"
          content="Check any GitHub profile score /100 free. See repositories, stars, languages, code volume and personalized fixes. No login. Get your score in 10 seconds."
        />
        <meta name="keywords" content="github profile score, github profile checker, github score analyzer, how to check github profile score, github reputation score" />
        <link rel="canonical" href={`${BASE_URL}/github-profile-score`} />
        <meta property="og:title" content="GitHub Profile Score — Free Checker & Analyzer | AutoDev" />
        <meta property="og:description" content="Check any GitHub profile score /100 free. Repos, stars, languages, code quality + personalized fixes in 10 seconds." />
        <meta property="og:image" content={`${BASE_URL}/api/og`} />
        <meta property="og:url" content={`${BASE_URL}/github-profile-score`} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: faqs.map(f => ({
                '@type': 'Question',
                name: f.q,
                acceptedAnswer: { '@type': 'Answer', text: f.a },
              })),
            }),
          }}
        />
      </Head>

      <Layout currentPage="/github-profile-score">
        <main id="main-content" className="relative pt-24 sm:pt-32 pb-16 overflow-hidden">
          <div className="absolute inset-0 bg-grid opacity-40" />
          <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-cyan-500/10 rounded-full blur-[120px]" />
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-10">
              <span className="text-xs font-semibold text-cyan-400 uppercase tracking-[0.2em]">Free Tool</span>
              <h1 className="text-3xl sm:text-5xl font-bold mt-3 mb-4 text-balance">
                GitHub Profile Score —<br /> check any profile <span className="gradient-text">/100</span>
              </h1>
              <p className="text-gray-400 max-w-2xl mx-auto mb-6">
                Type a GitHub username and get a scored analysis in 10 seconds: overall score, repositories,
                stars, languages, code volume and clear suggestions to improve. No login, no setup.
              </p>
              <form onSubmit={go} className="flex glass rounded-xl overflow-hidden glow max-w-md mx-auto">
                <input
                  type="text"
                  value={u}
                  onChange={e => setU(e.target.value)}
                  placeholder="github username (e.g. torvalds)"
                  aria-label="GitHub username"
                  className="bg-transparent px-4 py-3 text-white flex-1 outline-none text-sm"
                />
                <button type="submit" className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold px-5 py-3 text-sm">
                  Check score
                </button>
              </form>
              <p className="text-[11px] text-gray-500 mt-3">
                Sample: <Link href="/dashboard?user=Shashwat1319" className="text-cyan-400 hover:underline">Shashwat1319</Link>
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mb-12">
              {[
                ['📊', 'The score is honest', 'Profile completion, activity, repo quality and community impact in one weighted number.'],
                ['⚡', 'Instant & free', 'Public GitHub data is analyzed in about 10 seconds. No account needed.'],
                ['🛠️', 'Fixes, not noise', 'Every dashboard lists personalized suggestions — the exact things holding your score down.'],
                ['🏅', 'Badge for your README', 'Show your score on your profile. One Markdown line, updates automatically.'],
              ].map(([icon, title, desc]) => (
                <div key={title} className="glass rounded-xl p-5">
                  <div className="text-lg mb-2">{icon}</div>
                  <h2 className="text-white font-semibold mb-1 text-sm">{title}</h2>
                  <p className="text-gray-400 text-sm">{desc}</p>
                </div>
              ))}
            </div>

            <div className="glass rounded-2xl p-6 sm:p-8 mb-12">
              <h2 className="text-2xl font-bold text-white mb-2">Famous GitHub profiles, scored</h2>
              <p className="text-gray-400 text-sm mb-5">
                See the AutoDev score of well-known developers and open-source creators:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {HOMEPAGE_FAMOUS.map(u => (
                  <Link
                    key={u}
                    href={`/github-profile-score/${encodeURIComponent(u)}`}
                    className="bg-white/5 hover:bg-white/10 rounded-xl px-4 py-3 text-sm text-gray-300 hover:text-white transition truncate"
                  >
                    {u}
                  </Link>
                ))}
              </div>
            </div>

            <div className="glass rounded-2xl p-6 sm:p-8 mb-12">
              <h2 className="text-2xl font-bold text-white mb-6">How the score is calculated</h2>
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                {[
                  ['Profile Completion', 'Bio, location, company, website — do recruiters find a real person?'],
                  ['Code Activity', 'Recent commits and consistency over time.'],
                  ['Repository Quality', 'Original repos, descriptions, topics, README, structure.'],
                  ['Community Impact', 'Stars, forks and contributions beyond your own repos.'],
                ].map(([t, d]) => (
                  <div key={t} className="bg-white/5 rounded-xl p-4">
                    <div className="text-cyan-400 font-semibold mb-1">{t}</div>
                    <p className="text-gray-400 text-xs">{d}</p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-4">
                <Link href="/#score-methodology" className="text-cyan-400 hover:underline">Full methodology explained</Link> on the home page.
              </p>
            </div>

            <div className="glass rounded-2xl p-6 sm:p-8">
              <h2 className="text-xl font-bold text-white mb-6">Frequently asked questions</h2>
              <div className="space-y-5">
                {faqs.map(f => (
                  <div key={f.q}>
                    <h3 className="text-white font-semibold text-sm mb-1">{f.q}</h3>
                    <p className="text-gray-400 text-sm">{f.a}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-10 text-sm text-gray-500 text-center space-x-3">
              <Link href="/analyzer" className="text-cyan-400 hover:underline">Profile Analyzer</Link>
              <span>·</span>
              <Link href="/badge" className="text-cyan-400 hover:underline">README Badge</Link>
              <span>·</span>
              <Link href="/readme-generator" className="text-cyan-400 hover:underline">README Generator</Link>
              <span>·</span>
              <Link href="/github-profile-tips" className="text-cyan-400 hover:underline">Profile Tips</Link>
            </div>
          </div>
        </main>
      </Layout>
    </>
  );
}