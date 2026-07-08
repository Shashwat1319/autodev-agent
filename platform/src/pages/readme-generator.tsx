import Head from 'next/head';
import { useState, useEffect } from 'react';
import { BASE_URL } from '../lib/config';
import Layout from '../components/Layout';

const STYLES = [
  { id: 'professional', label: 'Professional', desc: 'Clean, well-structured with stats and activity' },
  { id: 'minimal', label: 'Minimal', desc: 'Simple and lightweight — just the essentials' },
  { id: 'recruiter', label: 'Recruiter', desc: 'Recruiter-ready with tables and pinned repos' },
];

export default function ReadmeGenerator() {
  const [username, setUsername] = useState('');
  const [style, setStyle] = useState('professional');
  const [readme, setReadme] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const generatePreview = async (s?: string) => {
    const u = username.trim();
    const activeStyle = s || style;
    if (!u) return;
    if (s) setStyle(s);
    setLoading(true);
    setError('');
    setReadme('');
    setCopied(false);
    try {
      const res = await fetch(`/api/generate-readme?username=${encodeURIComponent(u)}&style=${activeStyle}`);
      if (!res.ok) {
        const e = await res.json();
        throw new Error(e.error || 'Failed to generate README');
      }
      const data = await res.json();
      setReadme(data.readme);
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  const downloadReadme = async () => {
    const u = username.trim();
    if (!u || !readme) return;
    try {
      const res = await fetch('/api/generate-readme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: u, style }),
      });
      if (!res.ok) throw new Error('Download failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `README-${u}.md`;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 1000);
    } catch {
      setError('Failed to download. Please try again.');
    }
  };

  const copyReadme = () => {
    if (!readme) return;
    navigator.clipboard.writeText(readme).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Head>
        <title>Free GitHub README Generator — 3 Professional Styles | AutoDev</title>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="canonical" href={`${BASE_URL}/readme-generator`} />
        <meta name="description" content="Generate a free GitHub profile README from your public GitHub data. Three styles: Professional, Minimal, Recruiter. Preview, copy, or download. No sign-up." />
        <meta name="keywords" content="free README generator, GitHub profile README, README template, GitHub README maker, profile README, developer portfolio README" />
        <meta property="og:title" content="Free GitHub README Generator — 3 Professional Styles | AutoDev" />
        <meta property="og:description" content="Generate a free GitHub profile README from your GitHub data. Three styles — Professional, Minimal, Recruiter. Preview, copy, or download." />
        <meta property="og:image" content={`${BASE_URL}/api/og`} />
        <meta property="og:url" content={`${BASE_URL}/readme-generator`} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free GitHub README Generator — 3 Professional Styles | AutoDev" />
        <meta name="twitter:description" content="Generate a free GitHub profile README from your GitHub data. Three styles — preview, copy, or download." />
        <meta name="twitter:image" content={`${BASE_URL}/api/og`} />
      </Head>

      <Layout currentPage="/readme-generator" subtitle="README Generator">

      <section className="pt-28 sm:pt-36 pb-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-10">
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-[0.2em]">Free Tool</span>
            <h1 className="text-4xl font-bold mt-3 mb-4">README Generator</h1>
            <p className="text-gray-400 max-w-xl mx-auto">
              Generate a beautiful GitHub profile README from your public GitHub data. Three styles — preview, copy, or download — all free.
            </p>
          </div>

          {/* Input */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="flex gap-3">
              <div className="flex-1 glass rounded-xl overflow-hidden flex">
                <input
                  type="text"
                  placeholder="Enter GitHub username..."
                  className="bg-transparent px-5 py-3 text-white w-full outline-none text-sm"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && generatePreview()}
                />
              </div>
              <button
                onClick={() => generatePreview()}
                disabled={loading}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold px-6 py-3 rounded-xl transition disabled:opacity-50 text-sm"
              >
                {loading ? 'Generating...' : 'Generate'}
              </button>
            </div>
            {error && <p className="text-red-400 text-sm mt-3 glass rounded-xl p-3 inline-block">{error}</p>}
          </div>

          {/* Style Selector */}
          <div className="flex gap-3 justify-center mb-8 flex-wrap">
            {STYLES.map(s => (
              <button
                key={s.id}
                onClick={() => { if (readme) generatePreview(s.id); else setStyle(s.id); }}
                className={`glass rounded-xl px-5 py-3 text-left transition text-sm min-w-[160px] ${style === s.id ? 'border-cyan-400/50 ring-1 ring-cyan-400/20' : 'hover:border-white/10'}`}
              >
                <div className="font-medium text-white mb-0.5">{s.label}</div>
                <div className="text-[10px] text-gray-500">{s.desc}</div>
              </button>
            ))}
          </div>

          {/* Preview + Actions */}
          {readme && (
            <div className="animate-fade-in">
              <div className="glass rounded-2xl p-6 mb-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Preview</h2>
                  <div className="flex gap-2 items-center">
                    <button
                      onClick={copyReadme}
                      className="glass rounded-lg px-4 py-2 text-xs text-cyan-400 hover:bg-white/[0.08] transition font-medium"
                    >
                      {copied ? 'Copied!' : 'Copy Markdown'}
                    </button>
                    <button
                      onClick={downloadReadme}
                      className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold px-4 py-2 rounded-lg transition text-xs"
                    >
                      Download .md
                    </button>
                  </div>
                </div>
                <pre className="text-xs text-gray-300 font-mono whitespace-pre-wrap break-all max-h-[500px] overflow-y-auto glass rounded-xl p-4 leading-relaxed">
                  {readme}
                </pre>
              </div>
            </div>
          )}

          {/* Empty state */}
          {!readme && !loading && (
            <div className="text-center py-20">
              <div className="w-16 h-16 rounded-2xl glass flex items-center justify-center text-3xl mx-auto mb-4">📝</div>
              <h2 className="text-xl text-white font-semibold mb-2">Generate Your README</h2>
              <p className="text-gray-400 text-sm">Enter a GitHub username and click Generate — it's free</p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 text-center text-xs text-gray-600">
        AutoDev · npx autodev-agent · MIT
        <br />
        <a href="https://buymeacoffee.com/shashwatsrivastava" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 mt-2 hover:text-amber-400 transition">☕ Buy me a coffee</a>
      </footer>
      </Layout>
    </>
  );
}
