import Head from 'next/head';
import { useState } from 'react';

export default function Home() {
  const [username, setUsername] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const analyzeProfile = async () => {
    if (!username.trim()) return;
    setAnalyzing(true);
    try {
      const res = await fetch(`/api/analyze?username=${username}`);
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
    }
    setAnalyzing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-[#0a0f1e] to-slate-900">
      <Head>
        <title>AutoDev — Your Code. Auto-Piloted.</title>
        <meta name="description" content="Auto-commit, auto-push, auto-analyze your GitHub profile" />
      </Head>

      <header className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-white">
              <span className="text-cyan-400">{'{'}</span>AutoDev<span className="text-cyan-400">{'}'}</span>
            </span>
          </div>
          <nav className="flex gap-6 text-sm text-gray-400">
            <a href="#features" className="hover:text-white transition">Features</a>
            <a href="#demo" className="hover:text-white transition">Demo</a>
            <button className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-5 py-2 rounded-lg transition">
              Get Started
            </button>
          </nav>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-6 pt-24 pb-16 text-center">
        <h1 className="text-6xl font-bold text-white mb-6 leading-tight">
          Your Code.<br />
          <span className="gradient-text">Auto-Piloted.</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
          AutoDev watches your local files, auto-commits and pushes to GitHub, 
          and builds a recruiter-ready portfolio — all without lifting a finger.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <div className="flex bg-white/5 border border-white/10 rounded-lg overflow-hidden">
            <input
              type="text"
              placeholder="Enter a GitHub username to analyze..."
              className="bg-transparent px-5 py-3 text-white w-72 outline-none"
              value={username}
              onChange={e => setUsername(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && analyzeProfile()}
            />
            <button
              onClick={analyzeProfile}
              disabled={analyzing}
              className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-6 py-3 transition disabled:opacity-50"
            >
              {analyzing ? 'Analyzing...' : 'Analyze'}
            </button>
          </div>
        </div>

        {result && (
          <div className="bg-white/5 border border-white/10 rounded-xl p-8 max-w-3xl mx-auto text-left">
            <div className="flex items-center gap-4 mb-6">
              <img src={result.avatar} className="w-16 h-16 rounded-full border-2 border-cyan-400" />
              <div>
                <h2 className="text-2xl font-bold text-white">{result.username}</h2>
                <p className="text-gray-400">{result.bio}</p>
              </div>
              <div className="ml-auto text-center">
                <div className="text-4xl font-bold text-cyan-400">{result.overallScore}</div>
                <div className="text-sm text-gray-500">Score</div>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4 mb-6">
              {[
                ['Repos', result.totalRepos],
                ['Stars', result.totalStars],
                ['Forks', result.totalForks],
                ['Contribs', result.totalContributions],
              ].map(([label, value]) => (
                <div key={label as string} className="bg-white/5 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-white">{value}</div>
                  <div className="text-xs text-gray-500">{label}</div>
                </div>
              ))}
            </div>
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-400 mb-2">Top Languages</h3>
              <div className="flex gap-2 flex-wrap">
                {result.languages?.map((l: any) => (
                  <span key={l.name} className="px-3 py-1 bg-white/5 rounded-full text-sm text-gray-300">
                    {l.name} {l.percentage}%
                  </span>
                ))}
              </div>
            </div>
            {result.recommendations?.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-400 mb-2">Recommendations</h3>
                <ul className="list-disc list-inside text-gray-300 text-sm space-y-1">
                  {result.recommendations.map((r: string, i: number) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </section>

      <section id="features" className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-white text-center mb-12">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              step: '01',
              title: 'Connect & Install',
              desc: 'Link your GitHub account and install the AutoDev agent on your machine.',
            },
            {
              step: '02',
              title: 'Code Normally',
              desc: 'The agent watches your files and auto-commits/pushes based on your rules.',
            },
            {
              step: '03',
              title: 'Share Your Progress',
              desc: 'Get a live portfolio page with AI analysis — ready for recruiters.',
            },
          ].map((feature) => (
            <div key={feature.step} className="border border-white/10 rounded-xl p-6 hover:border-cyan-400/50 transition">
              <div className="text-cyan-400 text-4xl font-bold mb-4">{feature.step}</div>
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-white/10 py-8 text-center text-gray-500 text-sm">
        AutoDev — Built with ❤️ for developers who hate typing 'git push'
      </footer>
    </div>
  );
}
