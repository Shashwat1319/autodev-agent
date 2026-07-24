import { BASE_URL, STRIPE_PRO_LINK } from '../lib/config';

export default function ShareModal({ profile, onClose }: { profile: any; onClose: () => void }) {
  const shareLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`${BASE_URL}/dashboard?user=${profile.username}`)}`, '_blank');
  };
  const shareX = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`My AutoDev score is ${profile.overallScore}/100! Check yours →`)}&url=${encodeURIComponent(`${BASE_URL}/dashboard?user=${profile.username}`)}`, '_blank');
  };
  const copyBadge = () => {
    navigator.clipboard.writeText(`[![AutoDev Score](${BASE_URL}/api/badge?username=${profile.username})](${BASE_URL}/dashboard?user=${profile.username})`);
  };
  const handlePro = () => {
    if (STRIPE_PRO_LINK) {
      window.open(STRIPE_PRO_LINK, '_blank');
    } else {
      window.open(`/pro-report/${profile.username}`, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative glass rounded-2xl p-8 max-w-lg w-full animate-slide-up glow text-center"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white transition text-xl">&times;</button>

        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-2xl font-bold text-black mx-auto mb-4">
          A
        </div>

        <h2 className="text-xl font-bold text-white mb-1">Your AutoDev Score</h2>
        <p className="text-gray-400 text-sm mb-6">@{profile.username}</p>

        <div className="text-6xl font-bold text-cyan-400 mb-2">{profile.overallScore}<span className="text-2xl text-gray-500">/100</span></div>
        <p className="text-xs text-gray-500 mb-6">GitHub Profile Score</p>

        <div className="flex flex-col gap-3 mb-6">
          <button
            onClick={handlePro}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-bold py-4 rounded-xl transition text-base"
          >
            Get Pro Report — $9
          </button>
          <p className="text-[10px] text-gray-500 -mt-2">Detailed breakdown + improvement roadmap + PDF export</p>
        </div>

        <div className="border-t border-white/5 pt-5">
          <p className="text-xs text-gray-500 mb-3 uppercase tracking-wider font-semibold">Share your score</p>
          <div className="flex flex-col sm:flex-row gap-2">
            <button onClick={shareLinkedIn} className="flex-1 glass rounded-xl px-4 py-2.5 text-xs text-white hover:bg-white/[0.08] transition font-medium" style={{ backgroundColor: '#0a66c2' }}>
              LinkedIn
            </button>
            <button onClick={shareX} className="flex-1 glass rounded-xl px-4 py-2.5 text-xs text-white hover:bg-white/[0.08] transition font-medium" style={{ backgroundColor: '#000' }}>
              X / Twitter
            </button>
            <button onClick={copyBadge} className="flex-1 glass rounded-xl px-4 py-2.5 text-xs text-cyan-400 hover:bg-white/[0.08] transition font-medium">
              Copy Badge
            </button>
          </div>
        </div>

        <button onClick={onClose} className="mt-5 text-xs text-gray-600 hover:text-gray-400 transition">
          Continue to Dashboard
        </button>
      </div>
    </div>
  );
}