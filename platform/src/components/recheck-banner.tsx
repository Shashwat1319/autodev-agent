import { useEffect, useState } from 'react';
import { track } from '@vercel/analytics';
import {
  getLastCheck,
  getRecheckReminder,
  setRecheckReminder,
  clearRecheckReminder,
  isRecheckDue,
} from '../lib/retention';

const RECHECK_INTERVAL = 48 * 60 * 60 * 1000;

interface RecheckBannerProps {
  username: string;
  onRecheck: () => void;
}

type BannerState = 'hidden' | 'due' | 'nudge' | 'scheduled';

export default function RecheckBanner({ username, onRecheck }: RecheckBannerProps) {
  const [state, setState] = useState<BannerState>('hidden');

  useEffect(() => {
    if (isRecheckDue()) { setState('due'); return; }
    if (getRecheckReminder() > 0) { setState('hidden'); return; }
    const last = getLastCheck();
    if (last > 0 && Date.now() - last >= RECHECK_INTERVAL) setState('nudge');
  }, [username]);

  useEffect(() => {
    if (state !== 'scheduled') return;
    const t = setTimeout(() => setState('hidden'), 3500);
    return () => clearTimeout(t);
  }, [state]);

  if (state === 'hidden') return null;

  if (state === 'scheduled') {
    return (
      <div className="glass rounded-2xl p-4 border border-green-400/20 flex items-center gap-3">
        <span className="text-lg">✓</span>
        <p className="text-xs text-green-300" role="status">Reminder set — we&apos;ll nudge you to recheck your score in 2 days.</p>
      </div>
    );
  }

  const isDue = state === 'due';

  return (
    <div className={`glass rounded-2xl p-5 border flex items-center justify-between gap-4 flex-wrap ${isDue ? 'border-amber-400/30' : 'border-cyan-400/20'}`}>
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${isDue ? 'bg-amber-400/15' : 'bg-cyan-400/15'}`}>
          {isDue ? '⏰' : '🔄'}
        </div>
        <div>
          <p className="text-sm font-medium text-white">
            {isDue ? 'Your recheck is due' : 'Score refreshes daily'}
          </p>
          <p className="text-xs text-gray-400">
            {isDue
              ? 'It&apos;s been 2 days — profile changes might have moved your score.'
              : `It&apos;s been a while since your last check — improvements may have changed your score.`}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => {
            track('recheck_now', { username });
            if (isDue) clearRecheckReminder();
            onRecheck();
          }}
          className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold px-5 py-2.5 rounded-xl transition text-sm flex-shrink-0"
        >
          Recheck Now
        </button>
        {!isDue && (
          <button
            onClick={() => { track('recheck_reminder_set', { username }); setRecheckReminder(2); setState('scheduled'); }}
            className="glass rounded-xl px-4 py-2.5 text-xs text-gray-300 hover:bg-white/[0.08] transition flex-shrink-0"
          >
            Remind me in 2 days
          </button>
        )}
        <button onClick={() => setState('hidden')} aria-label="Dismiss" className="text-gray-500 hover:text-white transition p-1 flex-shrink-0">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
    </div>
  );
}