import Head from 'next/head';
import { useState } from 'react';
import { BASE_URL } from '../lib/config';
import Layout from '../components/Layout';

export default function BadgePage() {
  const [username, setUsername] = useState('Shashwat1319');
  const [copied, setCopied] = useState(false);

  return (
    <>
      <Head>
        <title>Free GitHub Score Badge — Add to Your README (Auto-Updating) | AutoDev</title>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="canonical" href={`${BASE_URL}/badge`} />
        <meta name="description" content="Add a free, auto-updating GitHub score badge to your profile README. Dynamic SVG badge shows your AutoDev score out of 100. No login required." />
        <meta name="keywords" content="github score badge, github badge, github stats badge, profile readme badge, github score card, shields.io alternative, github status badge" />
        <meta property="og:title" content="Free GitHub Score Badge — Add to Your README | AutoDev" />
        <meta property="og:description" content="Auto-updating SVG badge showing your GitHub profile score. One line of markdown." />
        <meta property="og:image" content={`${BASE_URL}/api/og`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:url" content={`${BASE_URL}/badge`} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free GitHub Score Badge — Add to Your README | AutoDev" />
        <meta name="twitter:description" content="Auto-updating SVG badge showing your GitHub profile score. One line of markdown." />
        <meta name="twitter:image" content={`${BASE_URL}/api/og`} />
      </Head>

      <Layout currentPage="/badge" subtitle="Badge">
        <main id="main-content" className="max-w-3xl mx-auto px-4 sm:px-6 py-10 pt-28 sm:pt-36">
          <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold mb-3">GitHub Score Badge</h1>
            <p className="text-gray-400 max-w-2xl mx-auto mb-6">
              Show your AutoDev score on your GitHub profile. The badge updates automatically —
              add it once, it stays fresh forever.
            </p>
            <div className="flex gap-3 max-w-md mx-auto mb-6">
              <div className="flex-1 glass rounded-xl overflow-hidden flex">
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="Your GitHub username"
                  aria-label="Your GitHub username"
                  className="bg-transparent px-4 py-2.5 text-white w-full outline-none text-sm"
                />
              </div>
            </div>
            <div className="inline-flex items-center gap-3 glass rounded-xl px-5 py-3 mb-8">
              <span className="text-xs text-gray-400">Your badge:</span>
              <img
                src={`/api/badge?username=${encodeURIComponent(username.trim() || 'Shashwat1319')}`}
                alt="AutoDev score badge preview"
                width={178}
                height={20}
                className="h-5"
                loading="lazy"
              />
            </div>
          </div>

          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4">Add It in 3 Steps</h2>
            <ol className="space-y-4 text-sm text-gray-300">
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-cyan-500/10 text-cyan-400 flex items-center justify-center text-[10px] font-bold flex-shrink-0">1</span>
                <span>Create a repository named <code className="text-cyan-400 font-mono">YOUR_USERNAME/YOUR_USERNAME</code> and add a <code className="text-cyan-400 font-mono">README.md</code>.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-cyan-500/10 text-cyan-400 flex items-center justify-center text-[10px] font-bold flex-shrink-0">2</span>
                <span>Paste this line anywhere in your README, replacing <code className="text-cyan-400 font-mono">YOUR_USERNAME</code>:</span>
              </li>
            </ol>
            <div className="mt-3 flex gap-2">
              <div className="flex-1 glass rounded-lg px-4 py-3 text-xs text-gray-400 font-mono truncate select-all">
                {`[![AutoDev Score](${BASE_URL}/api/badge?username=YOUR_USERNAME)](${BASE_URL}/dashboard?user=YOUR_USERNAME)`}
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`[![AutoDev Score](${BASE_URL}/api/badge?username=YOUR_USERNAME)](${BASE_URL}/dashboard?user=YOUR_USERNAME)`).catch(() => {});
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="glass rounded-lg px-4 py-3 text-xs text-cyan-400 hover:bg-white/[0.08] transition font-medium"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <li className="flex items-start gap-3 mt-4">
              <span className="w-6 h-6 rounded-full bg-cyan-500/10 text-cyan-400 flex items-center justify-center text-[10px] font-bold flex-shrink-0">3</span>
              <span>Commit and push. The badge appears on your profile and updates itself daily.</span>
            </li>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Why Add a Score Badge?</h2>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>• Recruiters and visitors see your developer activity at a glance.</li>
              <li>• It links back to your full analysis with language stats and top repos.</li>
              <li>• It&apos;s free, has no tracking, and requires zero setup beyond one line of markdown.</li>
              <li>• Works with any GitHub profile README — private repos not required.</li>
            </ul>
          </section>
        </main>
      </Layout>
    </>
  );
}
