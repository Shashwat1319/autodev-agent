import Head from 'next/head';
import { useState, useCallback } from 'react';

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
  const [paying, setPaying] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  const generatePreview = async () => {
    const u = username.trim();
    if (!u) return;
    setLoading(true);
    setError('');
    setReadme('');
    setCopied(false);
    try {
      const res = await fetch(`/api/generate-readme?username=${encodeURIComponent(u)}&style=${style}`);
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

  const handlePayment = useCallback(async () => {
    const u = username.trim();
    if (!u || !readme) return;
    setPaying(true);
    setPaymentError('');
    try {
      const orderRes = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: u }),
      });
      const order = await orderRes.json();

      if (!orderRes.ok) {
        if (order.error === 'PAYMENT_NOT_CONFIGURED') {
          setPaymentError('Payment gateway is being set up. Please check back soon.');
          setPaying(false);
          return;
        }
        throw new Error(order.error || 'Failed to create order');
      }

      if (!(window as any).Razorpay) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://checkout.razorpay.com/v1/checkout.js';
          script.onload = () => resolve();
          script.onerror = () => reject(new Error('Failed to load Razorpay'));
          document.body.appendChild(script);
        });
      }

      const options = {
        key: order.key_id,
        amount: order.amount,
        currency: order.currency,
        name: 'AutoDev',
        description: 'GitHub Profile README',
        order_id: order.id,
        handler: async function (response: any) {
          try {
            const pdfRes = await fetch('/api/generate-readme', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                username: u,
                style,
                payment_id: response.razorpay_payment_id,
                order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });
            if (!pdfRes.ok) throw new Error('Failed to generate README');
            const blob = await pdfRes.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `README-${u}.md`;
            a.click();
            URL.revokeObjectURL(url);
          } catch (e: any) {
            setPaymentError('Payment successful! Download failed. Contact support.');
          }
        },
        modal: {
          ondismiss: function () {
            setPaying(false);
          },
        },
        prefill: { name: u },
        theme: { color: '#06b6d4' },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        setPaymentError(`Payment failed: ${response.error.description}`);
        setPaying(false);
      });
      rzp.open();
    } catch (e: any) {
      setPaymentError(e.message || 'Something went wrong');
      setPaying(false);
    }
  }, [username, style, readme]);

  const copyReadme = () => {
    if (!readme) return;
    navigator.clipboard.writeText(readme);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white">
      <Head>
        <title>README Generator — AutoDev</title>
        <meta name="description" content="Generate a beautiful GitHub profile README from your GitHub data. Preview free, download for ₹99." />
      </Head>

      <header className="glass border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-sm font-bold text-black group-hover:scale-105 transition">A</div>
            <span className="text-lg font-bold"><span className="text-cyan-400">{'{'}</span>AutoDev<span className="text-cyan-400">{'}'}</span></span>
            <span className="text-xs text-gray-500 ml-2 hidden sm:inline">README Generator</span>
          </a>
          <nav className="flex items-center gap-4">
            <a href="/" className="text-xs text-gray-400 hover:text-white transition">Home</a>
            <a href="/dashboard" className="text-xs text-gray-400 hover:text-white transition">Dashboard</a>
            <a href="/leaderboard" className="text-xs text-gray-400 hover:text-white transition">Leaderboard</a>
            <a href="/readme-generator" className="text-xs text-cyan-400 font-medium">README</a>
          </nav>
        </div>
      </header>

      <section className="py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-10">
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-[0.2em]">Tool</span>
            <h1 className="text-4xl font-bold mt-3 mb-4">README Generator</h1>
            <p className="text-gray-400 max-w-xl mx-auto">
              Generate a beautiful GitHub profile README from your public GitHub data. Choose a style, preview for free, and download.
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
                onClick={generatePreview}
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
                onClick={() => { setStyle(s.id); if (readme) generatePreview(); }}
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
                  </div>
                </div>
                <pre className="text-xs text-gray-300 font-mono whitespace-pre-wrap break-all max-h-[500px] overflow-y-auto glass rounded-xl p-4 leading-relaxed">
                  {readme}
                </pre>
              </div>

              <div className="glass rounded-2xl p-6 glow">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Download</h3>
                    <p className="text-xs text-gray-500">Download the .md file and add it to your GitHub profile</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-2xl font-bold text-cyan-400">₹99</div>
                    <div className="text-[10px] text-gray-500">one-time</div>
                  </div>
                </div>
                {paymentError && (
                  <div className="mt-4 glass rounded-xl px-4 py-3 text-xs text-amber-400 border border-amber-500/10">
                    {paymentError}
                  </div>
                )}
                <button
                  onClick={handlePayment}
                  disabled={paying}
                  className="mt-4 w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold px-6 py-3 rounded-xl transition disabled:opacity-50 text-sm flex items-center justify-center gap-2"
                >
                  {paying ? (
                    <>
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                      Download .md — ₹99
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Empty state */}
          {!readme && !loading && (
            <div className="text-center py-20">
              <div className="w-16 h-16 rounded-2xl glass flex items-center justify-center text-3xl mx-auto mb-4">📝</div>
              <h2 className="text-xl text-white font-semibold mb-2">Generate Your README</h2>
              <p className="text-gray-400 text-sm">Enter a GitHub username and click Generate to see a preview — free</p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 text-center text-xs text-gray-600">
        AutoDev · npx autodev-agent · MIT
        <br />
        <a href="https://buymeacoffee.com/shashwatsrivastava" target="_blank" className="inline-flex items-center gap-1 mt-2 hover:text-amber-400 transition">☕ Buy me a coffee</a>
      </footer>
    </div>
  );
}
