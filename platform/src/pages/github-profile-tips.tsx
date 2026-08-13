import Head from 'next/head';
import Link from 'next/link';
import { BASE_URL } from '../lib/config';
import Layout from '../components/Layout';

export default function ProfileTipsPage() {
  return (
    <>
      <Head>
        <title>How to Make Your GitHub Profile Look Good in 2026 — 10 Tips | AutoDev</title>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="canonical" href={`${BASE_URL}/github-profile-tips`} />
        <meta name="description" content="10 actionable tips to make your GitHub profile stand out to recruiters in 2026: add a bio, write a README, pin your best repos, add a score badge, and more." />
        <meta name="keywords" content="how to make github profile look good, github profile tips, github profile optimization, github profile for recruiters, improve github profile, github readme tips, developer portfolio github" />
        <meta property="og:title" content="How to Make Your GitHub Profile Look Good in 2026 — 10 Tips | AutoDev" />
        <meta property="og:description" content="10 actionable tips to make your GitHub profile stand out to recruiters — bio, README, pinned repos, badge, and more." />
        <meta property="og:image" content={`${BASE_URL}/api/og`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:url" content={`${BASE_URL}/github-profile-tips`} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="How to Make Your GitHub Profile Look Good in 2026 — 10 Tips | AutoDev" />
        <meta name="twitter:description" content="10 actionable tips to make your GitHub profile stand out to recruiters." />
        <meta name="twitter:image" content={`${BASE_URL}/api/og`} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Article',
              headline: 'How to Make Your GitHub Profile Look Good in 2026 — 10 Tips',
              description: '10 actionable tips to make your GitHub profile stand out to recruiters.',
              author: { '@type': 'Person', name: 'Shashwatsrivastava' },
              publisher: { '@type': 'Organization', name: 'AutoDev' },
              datePublished: '2026-07-30',
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: [
                {
                  '@type': 'Question',
                  name: 'How can I make my GitHub profile look good?',
                  acceptedAnswer: { '@type': 'Answer', text: 'Add a clear bio, a profile README, pin your best repositories with descriptions, write a README for each repo, add topics, and keep a consistent commit streak. AutoDev scores your profile out of 100 and lists the exact improvements that would raise it.' },
                },
                {
                  '@type': 'Question',
                  name: 'What do recruiters look for on a GitHub profile?',
                  acceptedAnswer: { '@type': 'Answer', text: 'Recruiters look for a complete profile (bio, photo, links), original projects with descriptions and READMEs, consistent contribution activity, and clear proof of your main language skills.' },
                },
                {
                  '@type': 'Question',
                  name: 'Does a GitHub README help with recruiters?',
                  acceptedAnswer: { '@type': 'Answer', text: 'Yes. A profile README is the first thing many recruiters read on your profile. A well-structured one summarizes who you are, your skills, and your featured work in under a minute.' },
                },
              ],
            }),
          }}
        />
      </Head>

      <Layout currentPage="/github-profile-tips" subtitle="Profile Tips">
        <main id="main-content" className="max-w-3xl mx-auto px-4 sm:px-6 py-10 pt-28 sm:pt-36">
          <article>
            <header className="mb-10 text-center">
              <h1 className="text-3xl sm:text-4xl font-bold mb-3 leading-tight">
                How to Make Your GitHub Profile Look Good in 2026
              </h1>
              <p className="text-gray-400 text-sm">
                Updated July 2026 · 6 min read · Written for developers who want recruiters to notice them
              </p>
            </header>

            <p className="text-gray-400 leading-relaxed mb-8">
              Your GitHub profile is your technical resume. Recruiters open it before they call you.
              Here are 10 things that take minutes but change how your profile reads — verified on
              thousands of analyzed profiles.
            </p>

            <div className="space-y-8">
              {[
                ['Add a Bio (2 min)', 'Profiles without a bio lose points on AutoDev and in real life. One line — what you build, what you love — beats blank space every time.'],
                ['Write a Profile README (10 min)', 'Create a repo named YOUR_USERNAME/YOUR_USERNAME with a README. It appears at the top of your profile. Use a generator like AutoDev to get a professional layout in seconds.'],
                ['Pin Your Best Repos (2 min)', 'Visitors see pinned repos before anything else. Pin the 6 projects that represent your best work — not your most recent commits.'],
                ['Describe Every Repo (5 min)', 'A one-line description in every repo. AutoDev checks for this, and so do humans. "My awesome project" is a description. Blank is not.'],
                ['Add a README to Top Repos (15 min)', 'Repos with READMEs get more stars, more forks, and more trust. At minimum, explain what it does and how to install it.'],
                [`Add a Score Badge (1 min)`, `A live badge like [![AutoDev Score](${BASE_URL}/api/badge?username=YOUR_USERNAME)](${BASE_URL}/dashboard?user=YOUR_USERNAME) shows activity at a glance and links to your full stats.`],
                ['Use the Right Profile Picture (2 min)', 'A clear face or logo photo. Not the default identicon. Trust matters — GitHub is a social platform.'],
                ['Keep Activity Consistent (habit)', 'Contribution streaks read as reliability. 15 minutes of small fixes daily beats a weekend of giant commits.'],
                ['Show Off Your Languages (5 min)', 'GitHub auto-shows your top languages. Make sure your profile actually reflects what you want to be hired for.'],
                ['Check Your Score (1 min)', 'Run your profile through a free analyzer like AutoDev and fix what it flags. You get a number you can track month over month.'],
              ].map(([title, body], i) => (
                <section key={title as string} className="glass rounded-xl p-6">
                  <h2 className="text-base font-semibold text-white mb-2 flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-[11px] font-bold text-black flex-shrink-0">{i + 1}</span>
                    {title}
                  </h2>
                  <p className="text-sm text-gray-400 leading-relaxed">{body}</p>
                </section>
              ))}
            </div>

            <div className="mt-10 text-center glass rounded-2xl p-8">
              <h2 className="text-lg font-semibold text-white mb-2">See Your Current Score</h2>
              <p className="text-sm text-gray-400 mb-4">Free. No login. Takes 5 seconds.</p>
              <Link
                href="/dashboard"
                className="inline-block bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold px-6 py-3 rounded-xl transition text-sm"
              >
                Analyze My Profile →
              </Link>
            </div>
          </article>
        </main>
      </Layout>
    </>
  );
}
