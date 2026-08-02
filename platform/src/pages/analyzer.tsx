import Head from 'next/head';
import Link from 'next/link';
import { BASE_URL } from '../lib/config';
import Layout from '../components/Layout';

export default function AnalyzerPage() {
  return (
    <>
      <Head>
        <title>GitHub Profile Analyzer — Free Score &amp; Insights (No Login) | AutoDev</title>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="canonical" href={`${BASE_URL}/analyzer`} />
        <meta name="description" content="Free GitHub profile analyzer. Get an instant score out of 100, language breakdown, top repos, and actionable recommendations for any public GitHub profile. No login required." />
        <meta name="keywords" content="github profile analyzer, github profile score, analyze github profile, github score, github analysis tool, github profile check, github stats analyzer" />
        <meta property="og:title" content="GitHub Profile Analyzer — Free Score &amp; Insights | AutoDev" />
        <meta property="og:description" content="Analyze any public GitHub profile for free. Score/100, languages, top repos, recommendations. No login." />
        <meta property="og:image" content={`${BASE_URL}/api/og`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:url" content={`${BASE_URL}/analyzer`} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="GitHub Profile Analyzer — Free Score &amp; Insights | AutoDev" />
        <meta name="twitter:description" content="Analyze any public GitHub profile for free. Score/100, languages, top repos, recommendations." />
        <meta name="twitter:image" content={`${BASE_URL}/api/og`} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: 'AutoDev GitHub Profile Analyzer',
              applicationCategory: 'DeveloperApplication',
              operatingSystem: 'Web',
              url: `${BASE_URL}/analyzer`,
              offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
            }),
          }}
        />
      </Head>

      <Layout currentPage="/analyzer" subtitle="Analyzer">
        <main id="main-content" className="max-w-4xl mx-auto px-4 sm:px-6 py-10 pt-28 sm:pt-36">
          <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold mb-3">GitHub Profile Analyzer</h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Enter any GitHub username and get a free score out of 100, language breakdown,
              top repositories, and personalized recommendations — all without login.
            </p>
            <div className="mt-6 flex justify-center">
              <Link
                href="/dashboard"
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold px-6 py-3 rounded-xl transition text-sm"
              >
                Analyze a Profile →
              </Link>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-12">
            {[
              ['Score /100', 'Consistency, stars, repos, and bio combine into one honest number.'],
              ['Language Breakdown', 'See which languages dominate any profile with color-coded bars.'],
              ['Recommendations', 'Actionable tips — add a bio, describe repos, fix your README.'],
            ].map(([title, desc]) => (
              <div key={title} className="glass rounded-xl p-5">
                <h2 className="text-sm font-semibold text-white mb-1.5">{title}</h2>
                <p className="text-xs text-gray-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          <section className="mb-12">
            <h2 className="text-xl font-semibold mb-4">How the GitHub Score Works</h2>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              AutoDev analyzes public GitHub data to compute two numbers for every profile:
            </p>
            <ul className="space-y-3 text-sm text-gray-300">
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-cyan-500/10 text-cyan-400 flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">1</span>
                <span><strong className="text-white">Consistency Score</strong> — based on recent activity, bio presence, and repository quality (descriptions, languages).</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-cyan-500/10 text-cyan-400 flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">2</span>
                <span><strong className="text-white">Overall Score</strong> — the average of your consistency score and a star-based component, capped at 100.</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {[
                ['Is the GitHub profile analyzer really free?', 'Yes — 100% free. No login, no signup, no credit card. All features are available without an account.'],
                ['Do you store my data?', 'No. AutoDev has no database. Every analysis is fetched live from the public GitHub API and discarded after the request.'],
                ['How do I improve my score?', 'The analyzer shows personalized recommendations — common ones are adding a profile bio, writing repo descriptions, and adding a README.'],
                ['Can I analyze anyone or only my own profile?', 'Any public GitHub profile. Companies use AutoDev to screen candidates, and developers use it to compare profiles.'],
                ['How do I add the score badge to my profile?', 'Copy the badge markdown from any analysis page and paste it into your GitHub profile README. It updates automatically.'],
              ].map(([q, a]) => (
                <div key={q as string} className="glass rounded-xl p-5">
                  <h3 className="text-sm font-semibold text-white mb-1.5">{q}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">{a}</p>
                </div>
              ))}
            </div>
          </section>
        </main>
      </Layout>
    </>
  );
}
