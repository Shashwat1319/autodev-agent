import { BASE_URL } from '../lib/config';
import { PRO_PRICE_INR, PRO_PRICE_STRIKE_INR } from '../lib/pro';
import { copyText } from '../lib/clipboard';
import { useEffect, useRef, useState, useCallback } from 'react';

export default function ShareModal({ profile, onClose, continueHref }: { profile: any; onClose: () => void; continueHref?: string }) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [badgeCopied, setBadgeCopied] = useState(false);
  const [proBusy, setProBusy] = useState(false);
  const [proError, setProError] = useState('');

  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    const modal = modalRef.current;
    modal?.focus();
    const focusable = modal?.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable?.[0];
    const last = focusable?.[focusable.length - 1];
    const trap = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key !== 'Tab' || !focusable || focusable.length === 0) return;
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last?.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first?.focus(); }
      }
    };
    document.addEventListener('keydown', trap);
    return () => {
      document.removeEventListener('keydown', trap);
      prev?.focus();
    };
  }, [onClose]);

  const shareLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`${BASE_URL}/dashboard?user=${profile.username}`)}`, '_blank', 'noopener');
  };
  const shareX = () => {
    window.open(`https://x.com/intent/tweet?text=${encodeURIComponent(`My AutoDev score is ${profile.overallScore}/100! Check yours →`)}&url=${encodeURIComponent(`${BASE_URL}/dashboard?user=${profile.username}`)}`, '_blank', 'noopener');
  };
  const copyBadge = () => {
    copyText(`[![AutoDev Score](${BASE_URL}/api/badge?username=${profile.username})](${BASE_URL}/dashboard?user=${profile.username})`);
    setBadgeCopied(true);
    setTimeout(() => setBadgeCopied(false), 2000);
  };
  const handlePro = async () => {
    setProBusy(true);
    setProError('');
    try {
      const res = await fetch('/api/pro/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: profile.username }),
      });
      let data: any = null;
      try { data = await res.json(); } catch {}
      if (data?.url) {
        window.location.href = data.url;
        return;
      }
      setProError(data?.error || 'Payment setup failed. Please try again in a minute.');
    } catch {
      setProError('Payment setup failed. Please try again in a minute.');
    }
    setProBusy(false);
  };

  const modalTitleId = 'share-modal-title';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby={modalTitleId}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" aria-hidden="true" />
        <div
          ref={modalRef}
          tabIndex={-1}
          className="relative glass rounded-2xl p-8 max-w-lg w-full animate-slide-up glow text-center"
          onClick={e => e.stopPropagation()}
        >
          <button onClick={onClose} aria-label="Close modal" className="absolute top-4 right-4 text-gray-500 hover:text-white transition text-xl">&times;</button>

        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-2xl font-bold text-black mx-auto mb-4" aria-hidden="true">
          A
        </div>

        <h2 id={modalTitleId} className="text-xl font-bold text-white mb-1">AutoDev Score</h2>
        <p className="text-gray-400 text-sm mb-6">@{profile.username}</p>

        <div className="text-6xl font-bold text-cyan-400 mb-2">{profile.overallScore}<span className="text-2xl text-gray-500">/100</span></div>
        <p className="text-xs text-gray-500 mb-6">GitHub Profile Score</p>

        <div className="border-t border-white/5 pt-5 mb-6">
          <p className="text-xs text-gray-500 mb-3 uppercase tracking-wider font-semibold">Share your score</p>
          <div className="flex flex-col sm:flex-row gap-2">
            <button onClick={shareLinkedIn} className="flex-1 glass rounded-xl px-4 py-2.5 text-xs text-white hover:bg-white/[0.08] transition font-medium" style={{ backgroundColor: '#0a66c2' }}>
              LinkedIn
            </button>
            <button onClick={shareX} className="flex-1 glass rounded-xl px-4 py-2.5 text-xs text-white hover:bg-white/[0.08] transition font-medium" style={{ backgroundColor: '#000' }}>
              X / Twitter
            </button>
            <button onClick={copyBadge} className="flex-1 glass rounded-xl px-4 py-2.5 text-xs text-cyan-400 hover:bg-white/[0.08] transition font-medium">
              {badgeCopied ? 'Copied!' : 'Copy Badge'}
            </button>
          </div>
        </div>

        <div className="border-t border-white/5 pt-5">
          <button
            onClick={handlePro}
            disabled={proBusy}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-bold py-3.5 rounded-xl transition text-sm disabled:opacity-50"
          >
            {proBusy ? 'Opening payment...' : (<>
              Get Pro Insights — {PRO_PRICE_INR} <span className="line-through opacity-60 font-medium">{PRO_PRICE_STRIKE_INR}</span>
            </>)}
          </button>
          {proError && <p className="text-red-400 text-[11px] mt-2" role="alert">{proError}</p>}
          <p className="text-[10px] text-gray-500 mt-1.5">Launch offer · Prioritized roadmap + repository deep dive, unlocked in your dashboard</p>
        </div>

        {continueHref && (
          <a href={continueHref} className="mt-5 inline-block text-xs text-gray-400 hover:text-gray-300 transition">
            Continue to Dashboard
          </a>
        )}
      </div>
    </div>
  );
}