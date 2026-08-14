import { PROOF } from '../lib/proof';
import { MAKEOVER_PRICE_INR, MAKEOVER_PRICE_STRIKE_INR } from '../lib/pro';

export interface ProItem {
  rec: string;
  impact: string;
  gain: string;
  effort: string;
}

interface ProLockedProps {
  username: string;
  items: ProItem[];
  proEmail: string;
  setProEmail: (v: string) => void;
  onUnlock: () => void;
  verifyingPro: boolean;
}

const impactColor: Record<string, string> = {
  high: 'text-red-400 bg-red-500/10',
  medium: 'text-amber-400 bg-amber-500/10',
};

export default function ProLocked({ username, items, proEmail, setProEmail, onUnlock, verifyingPro }: ProLockedProps) {
  const teaser = items.slice(0, 2);

  return (
    <div className="relative">
      {verifyingPro && (
        <p className="text-xs text-amber-400 mb-4 animate-pulse" role="status">Verifying your payment…</p>
      )}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center text-lg flex-shrink-0">🎯</div>
        <div>
          <h2 className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Profile Makeover</h2>
          <p className="text-xs text-gray-500">Recruiters check GitHub — make yours recruiter-ready in 48 hours</p>
        </div>
      </div>

      {teaser.length > 0 && (
        <div className="mb-6">
          <p className="text-xs text-gray-400 mb-3">
            Personalized for <span className="text-white font-medium">{username}</span> — here&apos;s a preview of your fix plan:
          </p>
          <div className="space-y-3 relative">
            {teaser.map((item) => (
              <div key={item.rec} className="glass rounded-xl p-4 relative" aria-hidden="true">
                <div className="flex items-start justify-between gap-3">
                  <div className="text-sm text-white font-medium">{item.rec}</div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${impactColor[item.impact] || impactColor.medium}`}>
                    {item.impact === 'high' ? 'High impact' : 'Medium impact'}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-gray-500 mt-1.5">
                  <span>📈 {item.gain}</span>
                  <span>⏱ {item.effort}</span>
                </div>
              </div>
            ))}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="absolute inset-0 rounded-xl" style={{ backdropFilter: 'blur(6px)' }} />
              <div className="relative flex flex-col items-center gap-2 px-4">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center text-base">🎯</div>
                <p className="text-xs text-white font-medium">Unlock the full fix plan — all {items.length + 3} personalized steps</p>
                <p className="text-[10px] text-gray-500">Repo deep dives · Score breakdown · Ranked by impact</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid sm:grid-cols-3 gap-3 mb-6">
        {[
          ['📝', 'Recruiter-Ready README', 'Auto-generated profile README — copy, paste, done'],
          ['🎯', 'Prioritized Fix Plan', 'Every step ranked by impact, score gain, and effort'],
          ['🏆', 'Score Badge', 'Show your score on GitHub — proof, not promises'],
        ].map(([icon, title, desc]) => (
          <div key={title} className="glass rounded-xl p-4">
            <div className="text-lg mb-1.5">{icon}</div>
            <div className="text-sm text-white font-medium mb-0.5">{title}</div>
            <div className="text-[10px] text-gray-500">{desc}</div>
          </div>
        ))}
      </div>

      {PROOF.testimonials.length > 0 && (
        <div className="grid sm:grid-cols-2 gap-3 mb-6">
          {PROOF.testimonials.map((t) => (
            <div key={t.name} className="glass rounded-xl p-4">
              <div className="text-amber-400 text-xs mb-2">★★★★★</div>
              <p className="text-xs text-gray-300 leading-relaxed mb-3">&ldquo;{t.quote}&rdquo;</p>
              <p className="text-[11px] text-white font-medium">{t.name} <span className="text-gray-500 font-normal">· {t.role}</span></p>
            </div>
          ))}
        </div>
      )}

      <div className="text-center max-w-sm mx-auto">
        <input
          type="email"
          placeholder="Email for delivery (receipt + makeover kit)"
          aria-label="Email for delivery"
          value={proEmail}
          onChange={e => setProEmail(e.target.value)}
          className="w-full glass rounded-xl px-4 py-3 text-sm text-white outline-none mb-1.5 placeholder:text-gray-500"
        />
        <p className="text-[10px] text-gray-500 text-left mb-3">Your receipt, makeover kit, and free recheck reminders land in this inbox.</p>
        <button
          id="pro-pay-btn"
          onClick={onUnlock}
          className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-bold px-8 py-3.5 rounded-xl transition text-sm"
        >
          Get My Makeover — {MAKEOVER_PRICE_INR} <span className="line-through opacity-60 font-medium">{MAKEOVER_PRICE_STRIKE_INR}</span>
        </button>
        <div className="mt-4 flex items-center justify-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1.5 text-[10px] text-gray-400 bg-white/5 border border-white/10 rounded-full px-3 py-1">
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="6" width="18" height="12" rx="2" fill="#3395ff"/><path d="M8 10v4m4-4v4m4-4v4" stroke="#fff" strokeWidth="1.6" strokeLinecap="round"/></svg>
            Razorpay
          </span>
          <span className="inline-flex items-center gap-1 text-[10px] text-gray-400 bg-white/5 border border-white/10 rounded-full px-3 py-1">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3l9 5-9 5-9-5 9-5z" fill="#00b9f5"/><path d="M3 13l9 5 9-5" stroke="#10847e" strokeWidth="1.6"/></svg>
            UPI
          </span>
          <span className="text-[10px] text-gray-400">Pay once · Delivered in 48h · No subscription</span>
        </div>
        <p className="text-[10px] text-gray-500 mt-2">Secure payment · Instant access · Money-back guarantee ·{" "}
          <a href={PROOF.supportUrl} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 transition">Need help?</a>
        </p>
        <p className="text-[10px] text-gray-500 mt-3">
          <a href={PROOF.phUrl} target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:text-orange-300 transition font-medium">🚀 Featured on Product Hunt</a>
          {" · "}Used by {PROOF.usersCount} developers in {PROOF.countriesCount}+ countries
        </p>
      </div>
    </div>
  );
}