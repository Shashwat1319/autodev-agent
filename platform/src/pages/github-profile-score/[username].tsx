import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { BASE_URL } from '../../lib/config';
import { TOP_DEVELOPERS } from '../../lib/top-dev-usernames';
import { analyzeProfile } from '../../lib/analyze-profile';

export async function getStaticPaths() {
  return {
    paths: TOP_DEVELOPERS.map(d => ({ params: { username: d.username } })),
    fallback: 'blocking',
  };
}

export async function getStaticProps({ params }: { params: { username: string } }) {
  const username = String(params.username || '');
  try {
    const analysis = await analyzeProfile(username);
    if (!analysis) return { props: { username, data: null }, revalidate: 86400 };
    return { props: { username, data: analysis }, revalidate: 86400 };
  } catch {
    return { props: { username, data: null }, revalidate: 86400 };
  }
}

export default function ProfileScorePage({ username, data }: { username: string; data: any }) {
  const canonical = `${BASE_URL}/github-profile-score/${encodeURIComponent(username)}`;
  const faqs = [
    {
      q: `What is ${username}'s GitHub profile score?`,
      a: data
        ? `${username}'s GitHub profile scores ${data.overallScore}/100 on AutoDev, combining profile completeness, code activity, repository quality, and community impact from public GitHub data.`
        : `Check ${username}'s GitHub profile score on AutoDev — a single number out of 100 measuring profile completeness, code activity, repository quality, and community impact.`,
    },
    {
      q: 'How is a GitHub profile score calculated?',
      a: 'AutoDev combines profile completion (bio, location, website), code activity (recent commits and consistency), repository quality (original repos, descriptions, topics, structure), and community impact (stars, forks). Every factor is weighted and explained on the dashboard.',
    },
    {
      q: 'Is checking a GitHub profile score free?',
      a: 'Yes. Enter any public GitHub username and you instantly get a free scored analysis: overall score, repositories, stars, forks, code volume, language breakdown, and improvement suggestions — no signup required.',
    },
  ];

  return (
    <>
      <Head>
        <title>{data ? `${username} GitHub Profile Score ${data.overallScore}/100 | AutoDev` : `${username} GitHub Profile Score & Analysis | AutoDev`}</title>
        <meta
          name="description"
          content={
            data
              ? `${username}'s GitHub profile scores ${data.overallScore}/100 with ${data.totalRepos} repos, ${data.totalStars} stars, ${data.totalForks} forks. Free scored analysis of ${username}'s GitHub profile.`
              : `Check ${username}'s GitHub profile score out of 100 — repositories, stars, languages, activity and improvement suggestions. Free, no login.`
          }
        />
        <meta name="keywords" content={`${username} github profile score, ${username} github, ${username} github stats, github profile checker`} />
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content={data ? `${username}'s GitHub Score: ${data.overallScore}/100 | AutoDev` : `${username} GitHub Profile Score | AutoDev`} />
        <meta property="og:description" content={data ? `Free analysis: ${data.totalRepos} repos · ${data.totalStars} stars · ${data.totalForks} forks · Score ${data.overallScore}/100` : `Check ${username}'s GitHub profile score for free.`} />
        <meta property="og:image" content={`${BASE_URL}/api/og?username=${encodeURIComponent(username)}`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:url" content={canonical} />
        <meta property="og:type" content="profile" />
        <meta property="profile:username" content={username} />
        <meta name="twitter:title" content={data ? `${username}'s GitHub Score: ${data.overallScore}/100 | AutoDev` : `${username} GitHub Profile Score | AutoDev`} />
        <meta name="twitter:description" content={data ? `Free analysis: ${data.totalRepos} repos · ${data.totalStars} stars · ${data.totalForks} forks` : `Check ${username}'s GitHub profile score for free.`} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'ProfilePage',
                  mainEntity: {
                    '@type': 'Person',
                    name: data?.bio || username,
                    url: `https://github.com/${username}`,
                    image: data?.avatar,
                  },
                },
                {
                  '@type': 'FAQPage',
                  mainEntity: faqs.map(f => ({
                    '@type': 'Question',
                    name: f.q,
                    acceptedAnswer: { '@type': 'Answer', text: f.a },
                  })),
                },
              ],
            }),
          }}
        />
      </Head>

      <Layout currentPage="/github-profile-score" showHomeLinks>
        <main id="main-content" className="relative pt-24 sm:pt-32 pb-16 overflow-hidden">
          <div className="absolute inset-0 bg-grid opacity-40" />
          <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-cyan-500/10 rounded-full blur-[120px]" />
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6">
            <div className="text-xs text-gray-500 mb-4">
              <Link href="/github-profile-score" className="text-cyan-400 hover:underline">GitHub Profile Score</Link>
              <span className="mx-2">/</span>
              <span className="text-gray-400">{username}</span>
            </div>

            {!data ? (
              <div className="glass rounded-2xl p-8 text-center">
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">{username} GitHub Profile Score</h1>
                <p className="text-gray-400 text-sm mb-6">
                  We could not fetch {username}&apos;s data right now — GitHub may be rate-limiting us. Try the live analyzer instead.
                </p>
                <Link
                  href={`/dashboard?user=${encodeURIComponent(username)}`}
                  className="inline-block bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold px-6 py-3 rounded-xl text-sm"
                >
                  Analyze {username} live
                </Link>
              </div>
            ) : (
              <>
                <div className="glass rounded-2xl p-6 sm:p-8 mb-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                    <img src={data.avatar} alt={`${username} GitHub avatar`} width={80} height={80} className="rounded-2xl" />
                    <div className="flex-1">
                      <h1 className="text-2xl sm:text-3xl font-bold text-white text-balance">
                        {username} GitHub Profile Score:{' '}
                        <span className="gradient-text">{data.overallScore}/100</span>
                      </h1>
                      <p className="text-gray-400 text-sm mt-1">
                        {data.bio} {data.location ? `· ${data.location}` : ''}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        <Link
                          href={`/dashboard?user=${encodeURIComponent(username)}`}
                          className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold px-4 py-2 rounded-lg text-xs"
                        >
                          Full dashboard analysis
                        </Link>
                        <Link
                          href={`/badge?username=${encodeURIComponent(username)}`}
                          className="bg-white/10 hover:bg-white/15 text-white font-semibold px-4 py-2 rounded-lg text-xs"
                        >
                          Get score badge
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                  {[
                    ['Repos', String(data.totalRepos)],
                    ['Stars', String(data.totalStars)],
                    ['Forks', String(data.totalForks)],
                    ['Consistency', `${data.consistencyScore}/100`],
                  ].map(([label, value]) => (
                    <div key={label} className="glass rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-white">{value}</div>
                      <div className="text-xs text-gray-500 mt-1">{label}</div>
                    </div>
                  ))}
                </div>

                {data.languages?.length > 0 && (
                  <div className="glass rounded-2xl p-6 sm:p-8 mb-6">
                    <h2 className="text-lg font-bold text-white mb-4">{username}&apos;s top languages</h2>
                    <div className="space-y-3">
                      {data.languages.slice(0, 6).map((l: any) => (
                        <div key={l.name}>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-300">{l.name}</span>
                            <span className="text-gray-500">{l.percentage}%</span>
                          </div>
                          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full" style={{ width: `${l.percentage}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {data.topRepos?.length > 0 && (
                  <div className="glass rounded-2xl p-6 sm:p-8 mb-6">
                    <h2 className="text-lg font-bold text-white mb-4">Top repositories</h2>
                    <div className="space-y-3">
                      {data.topRepos.map((r: any) => (
                        <a
                          key={r.name}
                          href={`https://github.com/${username}/${r.name}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block bg-white/5 hover:bg-white/10 rounded-xl p-4 transition"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-sm font-semibold text-cyan-400 truncate">{r.name}</span>
                            <span className="text-xs text-gray-500 whitespace-nowrap">★ {r.stars} · ⑂ {r.forks}</span>
                          </div>
                          <p className="text-xs text-gray-400 mt-1 line-clamp-2">{r.description}</p>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {data.recommendations?.length > 0 && (
                  <div className="glass rounded-2xl p-6 sm:p-8 mb-6">
                    <h2 className="text-lg font-bold text-white mb-4">How {username} could score higher</h2>
                    <ul className="space-y-2 text-sm">
                      {data.recommendations.map((rec: string, i: number) => (
                        <li key={i} className="flex gap-2 text-gray-300">
                          <span className="text-cyan-400">→</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="glass rounded-2xl p-6 sm:p-8">
                  <h2 className="text-lg font-bold text-white mb-4">Frequently asked questions</h2>
                  <div className="space-y-5">
                    {faqs.map(f => (
                      <div key={f.q}>
                        <h3 className="text-white font-semibold text-sm mb-1">{f.q}</h3>
                        <p className="text-gray-400 text-sm">{f.a}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-5">
                    Want your own score?{' '}
                    <Link href="/github-profile-score" className="text-cyan-400 hover:underline">Check any GitHub profile for free</Link>.
                  </p>
                </div>
              </>
            )}
          </div>
        </main>
      </Layout>
    </>
  );
}
