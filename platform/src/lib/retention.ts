const LAST_CHECK_KEY = 'autodev_last_check';
const RECHECK_AT_KEY = 'autodev_recheck_at';

function read(key: string): number {
  try {
    const v = localStorage.getItem(key);
    const n = v ? parseInt(v, 10) : 0;
    return Number.isFinite(n) ? n : 0;
  } catch {
    return 0;
  }
}

function write(key: string, value: number): void {
  try { localStorage.setItem(key, String(value)); } catch {}
}

export function setLastCheck(ts: number = Date.now()): void {
  write(LAST_CHECK_KEY, ts);
}

export function getLastCheck(): number {
  return read(LAST_CHECK_KEY);
}

export function setRecheckReminder(days: number = 2): void {
  write(RECHECK_AT_KEY, Date.now() + days * 86400000);
}

export function getRecheckReminder(): number {
  return read(RECHECK_AT_KEY);
}

export function clearRecheckReminder(): void {
  try { localStorage.removeItem(RECHECK_AT_KEY); } catch {}
}

export function isRecheckDue(): boolean {
  const at = getRecheckReminder();
  return at > 0 && Date.now() >= at;
}
